import {
  createElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import {
  SUBJECTS,
  calculateSubjectProgress,
  getSubjectById,
} from "../data/subjects";

const STORAGE_KEY = "soar_state";

const DEFAULT_REFLECTIONS = {
  visionBoards: [],
  letters: [],
  lessonEntries: [],
};

const normalizeReflections = (reflections) => ({
  visionBoards: reflections?.visionBoards ?? [],
  letters: reflections?.letters ?? [],
  lessonEntries: reflections?.lessonEntries ?? [],
});

const SOARStateContext = createContext(null);

const createId = (prefix) =>
  `${prefix}_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`;

const createDefaultState = () => ({
  version: 2,
  session: { currentUserId: null },
  members: [],
  subjects: SUBJECTS,
  forum: [],
  connections: [],
  newsletterSubscribers: [],
});

const normalizeMember = (member) => ({
  id: member.id ?? createId("member"),
  fullName: member.fullName ?? "",
  email: member.email ?? "",
  password: member.password ?? "",
  joinedAt: member.joinedAt ?? new Date().toISOString(),
  paid: member.paid ?? true,
  onboardingComplete: member.onboardingComplete ?? false,
  learningStyle: member.learningStyle ?? null,
  interests: member.interests ?? [],
  curriculum: member.curriculum ?? [],
  creations: member.creations ?? [],
  reflections: normalizeReflections(member.reflections),
});

const sanitizeMember = (member) => {
  const { password: _password, ...safeMember } = normalizeMember(member);
  return safeMember;
};

const normalizeStore = (candidate) => {
  const defaults = createDefaultState();

  return {
    ...defaults,
    ...candidate,
    session: {
      ...defaults.session,
      ...(candidate?.session ?? {}),
    },
    members: (candidate?.members ?? []).map(normalizeMember),
    subjects: defaults.subjects,
    forum: candidate?.forum ?? [],
    connections: candidate?.connections ?? [],
    newsletterSubscribers: candidate?.newsletterSubscribers ?? [],
  };
};

const migrateLegacyStore = (legacyState) => {
  const defaults = createDefaultState();

  if (!legacyState || typeof legacyState !== "object") {
    return defaults;
  }

  if (legacyState.version === 2) {
    return normalizeStore(legacyState);
  }

  const legacyUser = legacyState.user
    ? normalizeMember({
        ...legacyState.user,
        curriculum: legacyState.curriculum ?? [],
        creations: legacyState.creations ?? [],
        reflections: normalizeReflections(legacyState.reflections),
      })
    : null;

  return normalizeStore({
    ...defaults,
    session: { currentUserId: legacyUser?.id ?? null },
    members: legacyUser ? [legacyUser] : [],
    subjects: defaults.subjects,
    forum: legacyState.forum ?? [],
    connections: [],
    newsletterSubscribers: legacyState.newsletterSubscribers ?? [],
  });
};

const loadInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createDefaultState();
    }

    return migrateLegacyStore(JSON.parse(stored));
  } catch (error) {
    console.error("Failed to load SOAR state:", error);
    return createDefaultState();
  }
};

const getCurrentMember = (state) =>
  state.members.find((member) => member.id === state.session.currentUserId) ??
  null;

const updateCurrentMember = (state, updater) => {
  const currentUserId = state.session.currentUserId;
  if (!currentUserId) {
    return state;
  }

  let wasUpdated = false;
  const members = state.members.map((member) => {
    if (member.id !== currentUserId) {
      return member;
    }

    wasUpdated = true;
    return normalizeMember(updater(normalizeMember(member)));
  });

  return wasUpdated ? { ...state, members } : state;
};

const buildEnrollment = (subjectId, payload = {}) => ({
  id: payload.id ?? createId("curriculum"),
  subjectId,
  targetDate: payload.targetDate ?? "",
  learningNotes: payload.learningNotes ?? "",
  learningStyle: payload.learningStyle ?? "general",
  enrolledAt: payload.enrolledAt ?? new Date().toISOString(),
  completedLessonIds: payload.completedLessonIds ?? [],
  progress: payload.progress ?? 0,
});

const soarReducer = (state, action) => {
  switch (action.type) {
    case "REGISTER_MEMBER": {
      const member = normalizeMember({
        ...action.payload,
        id: createId("member"),
        paid: true,
        onboardingComplete: false,
      });

      return {
        ...state,
        members: [...state.members, member],
        session: { currentUserId: member.id },
      };
    }

    case "LOGIN_MEMBER":
      return {
        ...state,
        session: { currentUserId: action.payload.userId },
      };

    case "SIGN_OUT":
      return {
        ...state,
        session: { currentUserId: null },
      };

    case "RESET_DEVICE_DATA":
      return createDefaultState();

    case "UPDATE_USER":
      return updateCurrentMember(state, (member) => ({
        ...member,
        ...action.payload,
      }));

    case "ADD_CURRICULUM_SUBJECT":
      return updateCurrentMember(state, (member) => {
        const existing = member.curriculum.find(
          (entry) => entry.subjectId === action.payload.subjectId,
        );

        if (existing) {
          return {
            ...member,
            curriculum: member.curriculum.map((entry) =>
              entry.subjectId === action.payload.subjectId
                ? {
                    ...entry,
                    ...action.payload,
                  }
                : entry,
            ),
          };
        }

        return {
          ...member,
          curriculum: [
            ...member.curriculum,
            buildEnrollment(action.payload.subjectId, action.payload),
          ],
        };
      });

    case "UPDATE_CURRICULUM_PROGRESS":
      return updateCurrentMember(state, (member) => ({
        ...member,
        curriculum: member.curriculum.map((entry) =>
          entry.id === action.payload.id
            ? { ...entry, progress: action.payload.progress }
            : entry,
        ),
      }));

    case "COMPLETE_LESSON":
      return updateCurrentMember(state, (member) => {
        const subject = getSubjectById(
          action.payload.subjectId,
          state.subjects,
        );

        return {
          ...member,
          curriculum: member.curriculum.map((entry) => {
            if (entry.subjectId !== action.payload.subjectId) {
              return entry;
            }

            if (entry.completedLessonIds.includes(action.payload.lessonId)) {
              return entry;
            }

            const completedLessonIds = [
              ...entry.completedLessonIds,
              action.payload.lessonId,
            ];

            return {
              ...entry,
              completedLessonIds,
              progress: calculateSubjectProgress(
                { ...entry, completedLessonIds },
                subject,
              ),
              completedAt:
                completedLessonIds.length === (subject?.lessons?.length ?? 0)
                  ? new Date().toISOString()
                  : entry.completedAt,
              lastActivityAt: new Date().toISOString(),
            };
          }),
        };
      });

    case "ADD_CREATION":
      return updateCurrentMember(state, (member) => ({
        ...member,
        creations: [...member.creations, action.payload],
      }));

    case "UPDATE_CREATION":
      return updateCurrentMember(state, (member) => ({
        ...member,
        creations: member.creations.map((creation) =>
          creation.id === action.payload.id
            ? { ...creation, ...action.payload }
            : creation,
        ),
      }));

    case "REMOVE_CREATION":
      return updateCurrentMember(state, (member) => ({
        ...member,
        creations: member.creations.filter(
          (creation) => creation.id !== action.payload,
        ),
      }));

    case "ADD_VISION_BOARD":
      return updateCurrentMember(state, (member) => ({
        ...member,
        reflections: {
          ...normalizeReflections(member.reflections),
          visionBoards: [
            ...normalizeReflections(member.reflections).visionBoards,
            action.payload,
          ],
        },
      }));

    case "UPDATE_VISION_BOARD":
      return updateCurrentMember(state, (member) => ({
        ...member,
        reflections: {
          ...normalizeReflections(member.reflections),
          visionBoards: normalizeReflections(
            member.reflections,
          ).visionBoards.map((board) =>
            board.id === action.payload.id
              ? {
                  ...board,
                  ...action.payload,
                  updatedAt: new Date().toISOString(),
                }
              : board,
          ),
        },
      }));

    case "REMOVE_VISION_BOARD":
      return updateCurrentMember(state, (member) => ({
        ...member,
        reflections: {
          ...normalizeReflections(member.reflections),
          visionBoards: normalizeReflections(
            member.reflections,
          ).visionBoards.filter((board) => board.id !== action.payload),
        },
      }));

    case "ADD_LETTER":
      return updateCurrentMember(state, (member) => ({
        ...member,
        reflections: {
          ...normalizeReflections(member.reflections),
          letters: [
            ...normalizeReflections(member.reflections).letters,
            action.payload,
          ],
        },
      }));

    case "UPSERT_MONTHLY_LETTER":
      return updateCurrentMember(state, (member) => {
        const reflections = normalizeReflections(member.reflections);
        const letters = reflections.letters;
        const existingIndex = letters.findIndex(
          (letter) => letter.id === action.payload.id,
        );

        const nextLetter = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };

        const nextLetters =
          existingIndex === -1
            ? [...letters, nextLetter]
            : letters.map((letter, index) =>
                index === existingIndex ? { ...letter, ...nextLetter } : letter,
              );

        return {
          ...member,
          reflections: {
            ...reflections,
            letters: nextLetters,
          },
        };
      });

    case "SEAL_MONTHLY_LETTER":
      return updateCurrentMember(state, (member) => {
        const reflections = normalizeReflections(member.reflections);

        return {
          ...member,
          reflections: {
            ...reflections,
            letters: reflections.letters.map((letter) =>
              letter.id === action.payload
                ? {
                    ...letter,
                    status: "sealed",
                    sealedAt: letter.sealedAt ?? new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : letter,
            ),
          },
        };
      });

    case "MARK_MONTHLY_LETTER_OPENED":
      return updateCurrentMember(state, (member) => {
        const reflections = normalizeReflections(member.reflections);

        return {
          ...member,
          reflections: {
            ...reflections,
            letters: reflections.letters.map((letter) =>
              letter.id === action.payload
                ? {
                    ...letter,
                    status:
                      letter.status === "reviewed" ? "reviewed" : "unlocked",
                    openedAt: letter.openedAt ?? new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : letter,
            ),
          },
        };
      });

    case "MARK_MONTHLY_LETTER_REVIEWED":
      return updateCurrentMember(state, (member) => {
        const reflections = normalizeReflections(member.reflections);

        return {
          ...member,
          reflections: {
            ...reflections,
            letters: reflections.letters.map((letter) =>
              letter.id === action.payload.id
                ? {
                    ...letter,
                    status: "reviewed",
                    review: action.payload.review,
                    reviewedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : letter,
            ),
          },
        };
      });

    case "REMOVE_MONTHLY_LETTER":
      return updateCurrentMember(state, (member) => {
        const reflections = normalizeReflections(member.reflections);

        return {
          ...member,
          reflections: {
            ...reflections,
            letters: reflections.letters.filter(
              (letter) => letter.id !== action.payload,
            ),
          },
        };
      });

    case "UPSERT_LESSON_REFLECTION":
      return updateCurrentMember(state, (member) => {
        const reflections = normalizeReflections(member.reflections);
        const existingEntries = reflections.lessonEntries;
        const existingIndex = existingEntries.findIndex(
          (entry) =>
            entry.subjectId === action.payload.subjectId &&
            entry.lessonId === action.payload.lessonId,
        );

        const nextEntry = {
          ...action.payload,
          savedAt: new Date().toISOString(),
        };

        const lessonEntries =
          existingIndex === -1
            ? [...existingEntries, nextEntry]
            : existingEntries.map((entry, index) =>
                index === existingIndex ? { ...entry, ...nextEntry } : entry,
              );

        return {
          ...member,
          reflections: {
            ...reflections,
            lessonEntries,
          },
        };
      });

    case "ADD_CONNECTION": {
      const existingConnection = state.connections.find((connection) => {
        const sameMembers =
          connection.members.includes(action.payload.members[0]) &&
          connection.members.includes(action.payload.members[1]);

        return sameMembers;
      });

      if (existingConnection) {
        return state;
      }

      return {
        ...state,
        connections: [
          ...state.connections,
          {
            id: action.payload.id ?? createId("connection"),
            createdAt: action.payload.createdAt ?? new Date().toISOString(),
            messages: [],
            ...action.payload,
          },
        ],
      };
    }

    case "ACCEPT_CONNECTION": {
      const { connectionId, mockMessage } = action.payload;
      return {
        ...state,
        connections: state.connections.map((connection) => {
          if (connection.id !== connectionId) return connection;

          // Build a fresh message list that prepends the mock welcome.
          const messages = connection.messages ?? [];
          const nextMessages = mockMessage
            ? [
                ...messages,
                {
                  id: createId("message"),
                  at: new Date().toISOString(),
                  body: mockMessage.body,
                  fromUserId: mockMessage.fromUserId,
                },
              ]
            : messages;

          return {
            ...connection,
            status: "accepted",
            acceptedAt: connection.acceptedAt ?? new Date().toISOString(),
            messages: nextMessages,
          };
        }),
      };
    }

    case "ADD_CONNECTION_MESSAGE":
      return {
        ...state,
        connections: state.connections.map((connection) =>
          connection.id === action.payload.connectionId
            ? {
                ...connection,
                status:
                  connection.status === "pending"
                    ? "accepted"
                    : connection.status,
                messages: [
                  ...(connection.messages ?? []),
                  {
                    id: createId("message"),
                    at: new Date().toISOString(),
                    ...action.payload.message,
                  },
                ],
              }
            : connection,
        ),
      };

    case "UPDATE_CONNECTION":
      return {
        ...state,
        connections: state.connections.map((connection) =>
          connection.id === action.payload.id
            ? { ...connection, ...action.payload }
            : connection,
        ),
      };

    case "ADD_PROPOSAL":
      return {
        ...state,
        forum: [...state.forum, action.payload],
      };

    case "VOTE_ON_PROPOSAL":
      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.proposalId
            ? {
                ...proposal,
                votes: {
                  ...(proposal.votes ?? {}),
                  [action.payload.userId]: action.payload.voteValue,
                },
              }
            : proposal,
        ),
      };

    case "CLOSE_PROPOSAL":
      return {
        ...state,
        forum: state.forum.map((proposal) =>
          proposal.id === action.payload.id
            ? {
                ...proposal,
                status: "closed",
                outcome: action.payload.outcome,
                closedAt: new Date().toISOString(),
              }
            : proposal,
        ),
      };

    case "SUBSCRIBE_TO_NEWSLETTER": {
      const normalizedEmail = action.payload.email.trim().toLowerCase();
      if (
        !normalizedEmail ||
        state.newsletterSubscribers.some(
          (subscriber) => subscriber.email === normalizedEmail,
        )
      ) {
        return state;
      }

      return {
        ...state,
        newsletterSubscribers: [
          ...state.newsletterSubscribers,
          {
            id: createId("dispatch"),
            email: normalizedEmail,
            subscribedAt: new Date().toISOString(),
          },
        ],
      };
    }

    default:
      return state;
  }
};

const deriveState = (store) => {
  const user = getCurrentMember(store);
  const userId = user?.id ?? null;

  return {
    ...store,
    members: store.members.map(sanitizeMember),
    user: user ? sanitizeMember(user) : null,
    curriculum: user?.curriculum ?? [],
    creations: user?.creations ?? [],
    reflections: normalizeReflections(user?.reflections),
    connections: userId
      ? store.connections.filter((connection) =>
          connection.members.includes(userId),
        )
      : [],
  };
};

export const SOARProvider = ({ children }) => {
  const [store, dispatch] = useReducer(
    soarReducer,
    undefined,
    loadInitialState,
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error("Failed to save SOAR state:", error);
    }
  }, [store]);

  const helpers = useMemo(
    () => ({
      authenticateMember(email, password) {
        const normalizedEmail = email.trim().toLowerCase();

        return (
          store.members.find(
            (member) =>
              member.email.toLowerCase() === normalizedEmail &&
              member.password === password,
          ) ?? null
        );
      },
    }),
    [store.members],
  );

  const value = useMemo(
    () => [deriveState(store), dispatch, helpers],
    [store, dispatch, helpers],
  );

  return createElement(SOARStateContext.Provider, { value }, children);
};

export const useSOARState = () => {
  const context = useContext(SOARStateContext);

  if (!context) {
    throw new Error("useSOARState must be used within a SOARProvider");
  }

  return context;
};
