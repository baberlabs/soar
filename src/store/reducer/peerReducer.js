import { calculateSubjectProgress, getSubjectById } from "../../data/subjects";
import { mergeInitialProposals } from "../../data/proposals";
import { createEnrollment, createPeer, nowIso } from "../factories";
import { normalizeReflections } from "../normalizers";
import { updateCurrentPeer } from "./helpers";

export const reducePeerActions = (state, action) => {
  switch (action.type) {
    case "REGISTER_PEER": {
      const peer = createPeer({
        ...action.payload,
        paid: true,
        onboardingComplete: false,
      });

      return {
        ...state,
        peers: [...state.peers, peer],
        forum: mergeInitialProposals(state.forum),
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
            createEnrollment(action.payload.subjectId, action.payload),
          ],
        };
      });

    case "UPDATE_CURRICULUM_PROGRESS":
      return updateCurrentPeer(state, (peer) => {
        let changed = false;

        const curriculum = peer.curriculum.map((entry) => {
          if (entry.id !== action.payload.id) return entry;
          if (entry.progress === action.payload.progress) return entry;

          changed = true;
          return {
            ...entry,
            progress: action.payload.progress,
            lastActivityAt: nowIso(),
          };
        });

        return changed ? { ...peer, curriculum } : peer;
      });

    case "COMPLETE_LESSON":
      return updateCurrentPeer(state, (peer) => {
        const subject = getSubjectById(
          action.payload.subjectId,
          state.subjects,
        );
        const timestamp = nowIso();
        let changed = false;

        const curriculum = peer.curriculum.map((entry) => {
          if (entry.subjectId !== action.payload.subjectId) return entry;
          if (entry.completedLessonIds.includes(action.payload.lessonId)) {
            return entry;
          }

          changed = true;
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
                ? timestamp
                : entry.completedAt,
            lastActivityAt: timestamp,
          };
        });

        return changed ? { ...peer, curriculum } : peer;
      });

    case "ADD_CREATION":
      return updateCurrentPeer(state, (peer) => ({
        ...peer,
        creations: [...peer.creations, action.payload],
      }));

    case "UPDATE_CREATION":
      return updateCurrentPeer(state, (peer) => {
        let changed = false;

        const creations = peer.creations.map((creation) => {
          if (creation.id !== action.payload.id) return creation;
          changed = true;
          return { ...creation, ...action.payload };
        });

        return changed ? { ...peer, creations } : peer;
      });

    case "REMOVE_CREATION":
      return updateCurrentPeer(state, (peer) => {
        const creations = peer.creations.filter(
          (creation) => creation.id !== action.payload,
        );

        return creations.length === peer.creations.length
          ? peer
          : { ...peer, creations };
      });

    case "ADD_VISION_BOARD":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);

        return {
          ...peer,
          reflections: {
            ...reflections,
            visionBoards: [...reflections.visionBoards, action.payload],
          },
        };
      });

    case "UPDATE_VISION_BOARD":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
        const timestamp = nowIso();
        let changed = false;

        const visionBoards = reflections.visionBoards.map((board) => {
          if (board.id !== action.payload.id) return board;
          changed = true;
          return {
            ...board,
            ...action.payload,
            updatedAt: timestamp,
          };
        });

        return changed
          ? {
              ...peer,
              reflections: {
                ...reflections,
                visionBoards,
              },
            }
          : peer;
      });

    case "REMOVE_VISION_BOARD":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
        const visionBoards = reflections.visionBoards.filter(
          (board) => board.id !== action.payload,
        );

        return visionBoards.length === reflections.visionBoards.length
          ? peer
          : {
              ...peer,
              reflections: {
                ...reflections,
                visionBoards,
              },
            };
      });

    case "ADD_LETTER":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);

        return {
          ...peer,
          reflections: {
            ...reflections,
            letters: [...reflections.letters, action.payload],
          },
        };
      });

    case "UPSERT_MONTHLY_LETTER":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
        const letters = reflections.letters;
        const existingIndex = letters.findIndex(
          (letter) => letter.id === action.payload.id,
        );
        const timestamp = nowIso();

        const nextLetter = {
          ...action.payload,
          updatedAt: timestamp,
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
        const timestamp = nowIso();
        let changed = false;

        const letters = reflections.letters.map((letter) => {
          if (letter.id !== action.payload) return letter;
          changed = true;
          return {
            ...letter,
            status: "sealed",
            sealedAt: letter.sealedAt ?? timestamp,
            updatedAt: timestamp,
          };
        });

        return changed
          ? {
              ...peer,
              reflections: {
                ...reflections,
                letters,
              },
            }
          : peer;
      });

    case "MARK_MONTHLY_LETTER_OPENED":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
        const timestamp = nowIso();
        let changed = false;

        const letters = reflections.letters.map((letter) => {
          if (letter.id !== action.payload) return letter;
          changed = true;
          return {
            ...letter,
            status: letter.status === "reviewed" ? "reviewed" : "unlocked",
            openedAt: letter.openedAt ?? timestamp,
            updatedAt: timestamp,
          };
        });

        return changed
          ? {
              ...peer,
              reflections: {
                ...reflections,
                letters,
              },
            }
          : peer;
      });

    case "MARK_MONTHLY_LETTER_REVIEWED":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
        const timestamp = nowIso();
        let changed = false;

        const letters = reflections.letters.map((letter) => {
          if (letter.id !== action.payload.id) return letter;
          changed = true;
          return {
            ...letter,
            status: "reviewed",
            review: action.payload.review,
            reviewedAt: timestamp,
            updatedAt: timestamp,
          };
        });

        return changed
          ? {
              ...peer,
              reflections: {
                ...reflections,
                letters,
              },
            }
          : peer;
      });

    case "REMOVE_MONTHLY_LETTER":
      return updateCurrentPeer(state, (peer) => {
        const reflections = normalizeReflections(peer.reflections);
        const letters = reflections.letters.filter(
          (letter) => letter.id !== action.payload,
        );

        return letters.length === reflections.letters.length
          ? peer
          : {
              ...peer,
              reflections: {
                ...reflections,
                letters,
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
          savedAt: nowIso(),
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

    default:
      return state;
  }
};
