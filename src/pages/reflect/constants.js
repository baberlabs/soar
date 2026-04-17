// Moodboard item sizing — three discrete sizes users can pick between
export const MOODBOARD_ITEM_SIZES = {
  sm: 72,
  md: 96,
  lg: 140,
};

export const DEFAULT_ITEM_SIZE = "md";

// Grid snap increment in percent (12 columns of ~8%)
export const GRID_SNAP_PERCENT = 8;

// Keyboard nudge step (percent of board)
export const KEYBOARD_NUDGE_PERCENT = 2;

// Autosave debounce for draft vision boards (ms)
export const AUTOSAVE_DEBOUNCE_MS = 1500;

// Error display auto-dismiss (ms)
export const ERROR_DISPLAY_MS = 5000;

// Max undo history for item positions
export const UNDO_HISTORY_LIMIT = 20;

export const MOODBOARD_CATEGORIES = [
  "Images",
  "Film / TV",
  "Books",
  "Activities",
  "Goals",
  "Music",
  "Recipes",
  "Hobbies",
  "Events",
];

// Deterministic default positions for new items (scattered, organic)
export const DEFAULT_POSITIONS = [
  { x: 12, y: 14, rotate: -7 },
  { x: 34, y: 18, rotate: 4 },
  { x: 56, y: 15, rotate: -3 },
  { x: 78, y: 26, rotate: 6 },
  { x: 16, y: 40, rotate: 5 },
  { x: 38, y: 38, rotate: -6 },
  { x: 62, y: 42, rotate: 2 },
  { x: 24, y: 64, rotate: -4 },
  { x: 48, y: 66, rotate: 3 },
  { x: 74, y: 62, rotate: -5 },
  { x: 12, y: 78, rotate: 4 },
  { x: 62, y: 80, rotate: -2 },
];

// Vision composer mode — discriminated union
// { kind: 'view' } | { kind: 'create', draftId, returnToBoardId } | { kind: 'edit', boardId, returnToBoardId }
export const VISION_MODES = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
};

// Letter statuses
export const LETTER_STATUS = {
  DRAFT: "draft",
  SEALED: "sealed",
  UNLOCKED: "unlocked",
  REVIEWED: "reviewed",
  ARCHIVED: "archived",
};

// A11y: labels for screen readers
export const A11Y_LABELS = {
  moodboardCanvas:
    "Moodboard canvas — use arrow keys to move focused item, Enter to edit, Delete to remove",
  moodboardItem: (category, caption) =>
    `${category} item${caption ? `: ${caption}` : ""}. Press arrow keys to move, Enter to edit, Delete to remove.`,
};
