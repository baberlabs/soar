import { LETTER_STATUS } from "../constants";
import { createId } from "./ids";
import { daysUntilMonth, formatMonthLabel, getNextMonthValue } from "./month";

// -- Migration: convert any legacy letter shape to the canonical schema.
// Kept as a pure, one-shot transform so it can live on the load path rather
// than re-running per render.
export const migrateLetter = (raw = {}) => ({
  id: raw.id || createId("lt"),
  targetMonth:
    raw.targetMonth ||
    (raw.openDate ? String(raw.openDate).slice(0, 7) : getNextMonthValue()),
  status: raw.status || LETTER_STATUS.DRAFT,
  intention: {
    feelings: raw.intention?.feelings || raw.title || "",
    threeActions: raw.intention?.threeActions || "",
    challengePlan: raw.intention?.challengePlan || "",
    affirmation: raw.intention?.affirmation || "",
  },
  noteToSelf: raw.noteToSelf || raw.body || "",
  review: raw.review || null,
  sealBroken: raw.sealBroken ?? false,
  createdAt: raw.createdAt || new Date().toISOString(),
  sealedAt: raw.sealedAt || null,
  openedAt: raw.openedAt || null,
  reviewedAt: raw.reviewedAt || null,
  updatedAt: raw.updatedAt || null,
});

// -- Status computation: convert stored status + date into effective status.
export const computeEffectiveStatus = (letter) => {
  return letter.status;
};

// -- Presentation: user-facing label for a status.
export const getStatusLabel = (status) => {
  switch (status) {
    case LETTER_STATUS.ARCHIVED:
      return "Archived";
    case LETTER_STATUS.REVIEWED:
      return "Reviewed";
    case LETTER_STATUS.UNLOCKED:
      return "Ready to open";
    case LETTER_STATUS.SEALED:
      return "Sealed";
    case LETTER_STATUS.DRAFT:
    default:
      return "Draft";
  }
};

// -- Presentation: tone mapping for status badges.
export const getStatusTone = (status) => {
  switch (status) {
    case LETTER_STATUS.ARCHIVED:
      return "lavender";
    case LETTER_STATUS.REVIEWED:
      return "sage";
    case LETTER_STATUS.UNLOCKED:
      return "yellow";
    case LETTER_STATUS.SEALED:
      return "sky";
    case LETTER_STATUS.DRAFT:
    default:
      return "cream";
  }
};

// -- Presentation: build the view model used by the UI.
export const getLetterViewModel = (letter) => {
  const effectiveStatus = computeEffectiveStatus(letter);
  const days = daysUntilMonth(letter.targetMonth);
  const targetMonthPassed = days === 0;

  return {
    ...letter,
    effectiveStatus,
    statusLabel: getStatusLabel(effectiveStatus),
    statusTone: getStatusTone(effectiveStatus),
    unlockHint:
      effectiveStatus === LETTER_STATUS.SEALED
        ? targetMonthPassed
          ? "Target month has arrived. Break the seal when you're ready."
          : `Sealed until ${formatMonthLabel(letter.targetMonth)}`
        : effectiveStatus === LETTER_STATUS.ARCHIVED
          ? "Archived letter"
          : effectiveStatus === LETTER_STATUS.UNLOCKED
            ? "Ready to open"
            : effectiveStatus === LETTER_STATUS.REVIEWED
              ? "Reviewed and archived"
              : "Draft letter",
    isSealed: effectiveStatus === LETTER_STATUS.SEALED,
    isOpenable:
      effectiveStatus === LETTER_STATUS.UNLOCKED ||
      effectiveStatus === LETTER_STATUS.REVIEWED ||
      effectiveStatus === LETTER_STATUS.DRAFT,
  };
};

// -- Orchestrate migration + viewmodel + sort. Call once per render of list.
export const buildLetterList = (rawLetters = []) =>
  rawLetters
    .map(migrateLetter)
    .map(getLetterViewModel)
    .sort((a, b) => {
      const leftStamp = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const rightStamp = new Date(b.updatedAt || b.createdAt || 0).getTime();
      if (leftStamp !== rightStamp) return rightStamp - leftStamp;
      return b.targetMonth.localeCompare(a.targetMonth);
    });
