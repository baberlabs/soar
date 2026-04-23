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
  peers: [],
  subjects: SUBJECTS,
  forum: [],
  connections: [],
  newsletterSubscribers: [],
});

const normalizePeer = (peer) => ({
  id: peer.id ?? createId("peer"),
  fullName: peer.fullName ?? "",
  email: peer.email ?? "",
  password: peer.password ?? "",
  joinedAt: peer.joinedAt ?? new Date().toISOString(),
  paid: peer.paid ?? true,
  onboardingComplete: peer.onboardingComplete ?? false,
  learningStyle: peer.learningStyle ?? null,
  interests: peer.interests ?? [],
  curriculum: peer.curriculum ?? [],
  creations: peer.creations ?? [],
  reflections: normalizeReflections(peer.reflections),

  // Profile fields editable from /account/profile
  avatarImage: peer.avatarImage ?? null,
  bio: peer.bio ?? "",
  location: peer.location ?? "",
  timezone: peer.timezone ?? "",
  links: peer.links ?? { website: "", github: "", linkedin: "" },

  // Preferences (placeholder for future backend)
  preferences: peer.preferences ?? { theme: "system", notifications: null },
});

const normalizeProposalAttachments = (attachments) => {
  if (!Array.isArray(attachments)) return [];

  return attachments
    .map((attachment) => ({
      id: attachment?.id ?? createId("attachment"),
      name: attachment?.name ?? "Attachment",
      type: attachment?.type ?? "application/octet-stream",
      size: Number.isFinite(attachment?.size) ? attachment.size : 0,
      dataUrl: attachment?.dataUrl ?? null,
    }))
    .filter((attachment) => Boolean(attachment.dataUrl));
};

const normalizeProposal = (proposal) => ({
  id: proposal.id ?? createId("proposal"),
  title: proposal.title ?? "",
  description: proposal.description ?? "",
  authorId: proposal.authorId ?? null,
  // Legacy "open" becomes "discussion"; "closed" stays "closed".
  status:
    proposal.status === "open"
      ? "discussion"
      : proposal.status === "closed"
        ? "closed"
        : (proposal.status ?? "draft"),
  votes: normalizeVotes(proposal.votes),
  comments: proposal.comments ?? [],
  attachments: normalizeProposalAttachments(proposal.attachments),
  createdAt: proposal.createdAt ?? new Date().toISOString(),
  updatedAt: proposal.updatedAt ?? proposal.createdAt ?? null,
  publishedAt: proposal.publishedAt ?? null,
  votingOpenedAt: proposal.votingOpenedAt ?? null,
  votingDeadline: proposal.votingDeadline ?? null,
  closedAt: proposal.closedAt ?? null,
  implementedAt: proposal.implementedAt ?? null,
  implementationNote: proposal.implementationNote ?? "",
  withdrawnAt: proposal.withdrawnAt ?? null,
});

const normalizeVotes = (votes) => {
  if (!votes || typeof votes !== "object") return {};
  const out = {};
  Object.entries(votes).forEach(([userId, raw]) => {
    // Legacy: { userId: true/false } — convert to the new shape.
    if (raw === true) out[userId] = { value: "yes", castAt: null };
    else if (raw === false) out[userId] = { value: "no", castAt: null };
    else if (raw && typeof raw === "object" && raw.value) {
      out[userId] = { value: raw.value, castAt: raw.castAt ?? null };
    }
  });
  return out;
};

const sanitizePeer = (peer) => {
  const { password: _password, ...safePeer } = normalizePeer(peer);
  return safePeer;
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
    peers: (candidate?.peers ?? []).map(normalizePeer),
    subjects: defaults.subjects,
    forum: (candidate?.forum ?? []).map(normalizeProposal),
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
    ? normalizePeer({
        ...legacyState.user,
        curriculum: legacyState.curriculum ?? [],
        creations: legacyState.creations ?? [],
        reflections: normalizeReflections(legacyState.reflections),
      })
    : null;

  return normalizeStore({
    ...defaults,
    session: { currentUserId: legacyUser?.id ?? null },
    peers: legacyUser ? [legacyUser] : [],
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

const getCurrentPeer = (state) =>
  state.peers.find((peer) => peer.id === state.session.currentUserId) ?? null;

const updateCurrentPeer = (state, updater) => {
  const currentUserId = state.session.currentUserId;
  if (!currentUserId) {
    return state;
  }

  let wasUpdated = false;
  const peers = state.peers.map((peer) => {
    if (peer.id !== currentUserId) {
      return peer;
    }

    wasUpdated = true;
    return normalizePeer(updater(normalizePeer(peer)));
  });

  return wasUpdated ? { ...state, peers } : state;
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
    case "REGISTER_PEER": {
      const peer = normalizePeer({
        ...action.payload,
        id: createId("peer"),
        paid: true,
        onboardingComplete: false,
      });

      return {
        ...state,
        peers: [...state.peers, peer],
        session: { currentUserId: peer.id },
      };
    }

    case "LOGIN_PEER":
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
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        ...action.payload,
      }));

    case "ADD_CURRICULUM_SUBJECT":
      return updateCurrentPeer(state, (peer) => {
        const existing = peer.curriculum.find(
          (entry) => entry.subjectId === action.payload.subjectId,
        );

        if (existing) {
          return {
            ...peer,
            curriculum: peer.curriculum.map((entry) =>
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
          ...peer,
          curriculum: [
            ...peer.curriculum,
            buildEnrollment(action.payload.subjectId, action.payload),
          ],
        };
      });

    case "UPDATE_CURRICULUM_PROGRESS":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        curriculum: peer.curriculum.map((entry) =>
          entry.id === action.payload.id
            ? { ...entry, progress: action.payload.progress }
            : entry,
        ),
      }));

    case "COMPLETE_LESSON":
      return updateCurrentPeer(state, (peer) => {
        const subject = getSubjectById(
          action.payload.subjectId,
          state.subjects,
        );

        return {
          ...peer,
          curriculum: peer.curriculum.map((entry) => {
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
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        creations: [...peer.creations, action.payload],
      }));

    case "UPDATE_CREATION":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        creations: peer.creations.map((creation) =>
          creation.id === action.payload.id
            ? { ...creation, ...action.payload }
            : creation,
        ),
      }));

    case "REMOVE_CREATION":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        creations: peer.creations.filter(
          (creation) => creation.id !== action.payload,
        ),
      }));

    case "ADD_VISION_BOARD":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        reflections: {
          ...normalizeReflections(peer.reflections),
          visionBoards: [
            ...normalizeReflections(peer.reflections).visionBoards,
            action.payload,
          ],
        },
      }));

    case "UPDATE_VISION_BOARD":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        reflections: {
          ...normalizeReflections(peer.reflections),
          visionBoards: normalizeReflections(peer.reflections).visionBoards.map(
            (board) =>
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
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        reflections: {
          ...normalizeReflections(peer.reflections),
          visionBoards: normalizeReflections(
            peer.reflections,
          ).visionBoards.filter((board) => board.id !== action.payload),
        },
      }));

    case "ADD_LETTER":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        reflections: {
          ...normalizeReflections(peer.reflections),
          letters: [
            ...normalizeReflections(peer.reflections).letters,
            action.payload,
          ],
        },
      }));

    case "UPSERT_MONTHLY_LETTER":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
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
          ...peer,
          reflections: {
            ...reflections,
            letters: nextLetters,
          },
        };
      });

    case "SEAL_MONTHLY_LETTER":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);

        return {
          ...peer,
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
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);

        return {
          ...peer,
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
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);

        return {
          ...peer,
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
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);

        return {
          ...peer,
          reflections: {
            ...reflections,
            letters: reflections.letters.filter(
              (letter) => letter.id !== action.payload,
            ),
          },
        };
      });

    case "UPSERT_LESSON_REFLECTION":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
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
          ...peer,
          reflections: {
            ...reflections,
            lessonEntries,
          },
        };
      });

    case "ADD_CONNECTION": {
      const existingConnection = state.connections.find((connection) => {
        const samePeers =
          connection.peers.includes(action.payload.peers[0]) &&
          connection.peers.includes(action.payload.peers[1]);

        return samePeers;
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

    case "UPSERT_PROPOSAL": {
      // Create or edit a proposal. Used during draft composition and later
      // edits in the discussion phase. Payload: { id?, title, description }
      const existing = state.forum.find((p) => p.id === action.payload.id);

      if (existing) {
        // Edits are only legal while draft or discussion. Silently ignore
        // attempts to edit a voting/closed/implemented/withdrawn proposal.
        if (!["draft", "discussion"].includes(existing.status)) return state;

        return {
          ...state,
          forum: state.forum.map((p) =>
            p.id === existing.id
              ? {
                  ...p,
                  title: action.payload.title ?? p.title,
                  description: action.payload.description ?? p.description,
                  attachments:
                    action.payload.attachments !== undefined
                      ? normalizeProposalAttachments(action.payload.attachments)
                      : p.attachments,
                  updatedAt: new Date().toISOString(),
                }
              : p,
          ),
        };
      }

      const newProposal = {
        id: action.payload.id ?? createId("proposal"),
        title: action.payload.title,
        description: action.payload.description,
        authorId: action.payload.authorId ?? state.session.currentUserId,
        status: "draft",
        votes: {},
        comments: [],
        attachments: normalizeProposalAttachments(action.payload.attachments),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
        votingOpenedAt: null,
        votingDeadline: null,
        closedAt: null,
        implementedAt: null,
        implementationNote: "",
        withdrawnAt: null,
      };

      return { ...state, forum: [...state.forum, newProposal] };
    }

    case "PUBLISH_PROPOSAL":
      return {
        ...state,
        forum: state.forum.map((p) =>
          p.id === action.payload.id && p.status === "draft"
            ? {
                ...p,
                status: "discussion",
                publishedAt: new Date().toISOString(),
              }
            : p,
        ),
      };

    case "OPEN_VOTING":
      // Payload: { id, votingDeadline }  (ISO string)
      return {
        ...state,
        forum: state.forum.map((p) =>
          p.id === action.payload.id && p.status === "discussion"
            ? {
                ...p,
                status: "voting",
                votingOpenedAt: new Date().toISOString(),
                votingDeadline: action.payload.votingDeadline,
              }
            : p,
        ),
      };

    case "CAST_VOTE":
      // Payload: { proposalId, userId, voteValue }  where voteValue is
      // "yes" | "no" | "abstain". Re-voting overrides the previous value.
      return {
        ...state,
        forum: state.forum.map((p) => {
          if (p.id !== action.payload.proposalId) return p;
          if (p.status !== "voting") return p; // only accept votes while voting
          // Deadline check is a defence — UI should already block expired
          // voting, but the reducer stays honest if someone races it.
          if (p.votingDeadline && new Date(p.votingDeadline) <= new Date()) {
            return p;
          }
          return {
            ...p,
            votes: {
              ...p.votes,
              [action.payload.userId]: {
                value: action.payload.voteValue,
                castAt: new Date().toISOString(),
              },
            },
          };
        }),
      };

    case "WITHDRAW_PROPOSAL":
      // Author explicitly withdraws. Legal in any pre-closed state.
      return {
        ...state,
        forum: state.forum.map((p) =>
          p.id === action.payload.id &&
          ["draft", "discussion", "voting"].includes(p.status)
            ? {
                ...p,
                status: "withdrawn",
                withdrawnAt: new Date().toISOString(),
              }
            : p,
        ),
      };

    case "MARK_IMPLEMENTED":
      // Payload: { id, implementationNote }
      return {
        ...state,
        forum: state.forum.map((p) =>
          p.id === action.payload.id && p.status === "closed"
            ? {
                ...p,
                status: "implemented",
                implementedAt: new Date().toISOString(),
                implementationNote: action.payload.implementationNote ?? "",
              }
            : p,
        ),
      };

    case "CLOSE_PROPOSAL":
      // Author-triggered close (rare; mostly used when the UI wants to
      // persist the closure for historical accuracy even though phase is
      // already derivable from the deadline).
      return {
        ...state,
        forum: state.forum.map((p) =>
          p.id === action.payload.id && p.status === "voting"
            ? { ...p, status: "closed", closedAt: new Date().toISOString() }
            : p,
        ),
      };

    case "ADD_PROPOSAL_COMMENT":
      // Payload: { proposalId, body, authorId }
      return {
        ...state,
        forum: state.forum.map((p) => {
          if (p.id !== action.payload.proposalId) return p;
          // Comments allowed in discussion and closed/implemented phases only.
          // Voting is silent to prevent last-minute lobbying during the ballot.
          if (!["discussion", "closed", "implemented"].includes(p.status)) {
            return p;
          }
          return {
            ...p,
            comments: [
              ...(p.comments ?? []),
              {
                id: createId("comment"),
                body: action.payload.body,
                authorId: action.payload.authorId,
                at: new Date().toISOString(),
              },
            ],
          };
        }),
      };

    case "REMOVE_PROPOSAL":
      // Hard delete — only legal for drafts that haven't been published.
      return {
        ...state,
        forum: state.forum.filter(
          (p) => p.id !== action.payload.id || p.status !== "draft",
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
  const user = getCurrentPeer(store);
  const userId = user?.id ?? null;

  return {
    ...store,
    peers: store.peers.map(sanitizePeer),
    user: user ? sanitizePeer(user) : null,
    curriculum: user?.curriculum ?? [],
    creations: user?.creations ?? [],
    reflections: normalizeReflections(user?.reflections),
    connections: userId
      ? store.connections.filter((connection) =>
          connection.peers.includes(userId),
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
      authenticatePeer(email, password) {
        const normalizedEmail = email.trim().toLowerCase();

        return (
          store.peers.find(
            (peer) =>
              peer.email.toLowerCase() === normalizedEmail &&
              peer.password === password,
          ) ?? null
        );
      },
    }),
    [store.peers],
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
