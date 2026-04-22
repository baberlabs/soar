import {
  DEFAULT_POSITIONS,
  GRID_SNAP_PERCENT,
  MOODBOARD_ITEM_SIZES,
} from "../constants";
import { toMonthInputValue } from "./month";

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getDefaultMoodboardPosition = (index) =>
  DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];

// Snap a percent value to the nearest grid line, respecting bounds.
export const snapToGrid = (percent, snap = GRID_SNAP_PERCENT) =>
  Math.round(percent / snap) * snap;

// Build inline style for a moodboard item.
export const getMoodboardItemStyle = (item, index) => {
  const fallback = getDefaultMoodboardPosition(index);
  const position = item?.position || fallback;
  const size = MOODBOARD_ITEM_SIZES[item?.size || "md"];

  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${size}px`,
    transform: `rotate(${position.rotate ?? fallback.rotate}deg)`,
    zIndex: position.z ?? 1,
  };
};

// Normalize a board's items to the current schema, providing defaults for
// any fields added in later versions (size, z-index, rotation).
export const hydrateBoardItems = (items = []) =>
  items.map((entry, index) => {
    const fallback = getDefaultMoodboardPosition(index);
    return {
      id: entry.id || `mood_item_${index}`,
      category: entry.category || "Images",
      caption: entry.caption || "",
      text: entry.text || "",
      imageData: entry.imageData || null,
      url: entry.url || "",
      size: entry.size || "md",
      position: {
        x: entry.position?.x ?? fallback.x,
        y: entry.position?.y ?? fallback.y,
        rotate: entry.position?.rotate ?? fallback.rotate,
        z: entry.position?.z ?? index + 1,
      },
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: entry.updatedAt || null,
    };
  });

// Produce a sortable month value for a board, whether it stored the modern
// "YYYY-MM" value or a legacy label like "May 2026".
export const getBoardMonthValue = (board) => {
  if (!board) return "";
  return toMonthInputValue(board.month, board.createdAt);
};

// Compute a new z-index for bringing an item to the front.
export const getMaxZ = (items) =>
  items.reduce((max, item) => Math.max(max, item.position?.z ?? 0), 0);
