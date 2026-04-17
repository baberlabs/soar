import { useCallback, useEffect, useRef, useState } from "react";
import {
  GRID_SNAP_PERCENT,
  KEYBOARD_NUDGE_PERCENT,
  MOODBOARD_ITEM_SIZES,
} from "../constants";
import { clamp, snapToGrid } from "../utils/moodboard";

/**
 * Pointer-based drag + keyboard-based positioning for moodboard items.
 *
 * Accessibility note: items must have tabIndex=0 to receive keyboard events.
 * When an item is focused, arrow keys nudge it by KEYBOARD_NUDGE_PERCENT.
 * Shift+arrow nudges by GRID_SNAP_PERCENT.
 *
 * @param {Object} params
 * @param {React.RefObject} params.boardRef - ref to the canvas element
 * @param {Array} params.items - current items array
 * @param {Function} params.onUpdatePosition - (id, {x, y}) => void
 * @param {Function} params.onRemove - (id) => void
 * @param {Function} params.onBeginEdit - (id) => void
 * @param {boolean} params.isEnabled - whether drag is active (editable mode)
 * @param {boolean} params.snapEnabled - whether grid snap is on
 */
export const useMoodboardDrag = ({
  boardRef,
  items,
  onUpdatePosition,
  onRemove,
  onBeginEdit,
  isEnabled,
  snapEnabled,
}) => {
  const [dragState, setDragState] = useState(null);
  const [focusedItemId, setFocusedItemId] = useState(null);
  // Track last non-snap position during drag to avoid jitter.
  const dragLatestRef = useRef(null);

  // -- Pointer-based drag.
  useEffect(() => {
    if (!dragState || !isEnabled) return undefined;

    const handlePointerMove = (event) => {
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const itemSize = MOODBOARD_ITEM_SIZES[dragState.size || "md"];
      const maxXPercent =
        ((boardRect.width - itemSize) / boardRect.width) * 100;
      const maxYPercent =
        ((boardRect.height - itemSize) / boardRect.height) * 100;

      const leftPx = clamp(
        event.clientX - boardRect.left - dragState.offsetX,
        0,
        boardRect.width - itemSize,
      );
      const topPx = clamp(
        event.clientY - boardRect.top - dragState.offsetY,
        0,
        boardRect.height - itemSize,
      );

      const x = Math.round((leftPx / boardRect.width) * 1000) / 10;
      const y = Math.round((topPx / boardRect.height) * 1000) / 10;

      dragLatestRef.current = {
        x: clamp(x, 0, maxXPercent),
        y: clamp(y, 0, maxYPercent),
      };
      onUpdatePosition(dragState.id, dragLatestRef.current);
    };

    const stopDrag = () => {
      // Snap on release if enabled.
      if (snapEnabled && dragLatestRef.current && dragState) {
        const boardRect = boardRef.current?.getBoundingClientRect();
        const itemSize = MOODBOARD_ITEM_SIZES[dragState.size || "md"];
        const maxXPercent = boardRect
          ? ((boardRect.width - itemSize) / boardRect.width) * 100
          : 100;
        const maxYPercent = boardRect
          ? ((boardRect.height - itemSize) / boardRect.height) * 100
          : 100;

        onUpdatePosition(dragState.id, {
          x: clamp(
            snapToGrid(dragLatestRef.current.x, GRID_SNAP_PERCENT),
            0,
            maxXPercent,
          ),
          y: clamp(
            snapToGrid(dragLatestRef.current.y, GRID_SNAP_PERCENT),
            0,
            maxYPercent,
          ),
        });
      }
      dragLatestRef.current = null;
      setDragState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [dragState, isEnabled, snapEnabled, boardRef, onUpdatePosition]);

  const startDrag = useCallback(
    (event, itemId) => {
      if (!isEnabled) return;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const item = items.find((entry) => entry.id === itemId);
      if (!item) return;

      const leftPx = (item.position.x / 100) * boardRect.width;
      const topPx = (item.position.y / 100) * boardRect.height;

      setDragState({
        id: itemId,
        size: item.size,
        offsetX: event.clientX - (boardRect.left + leftPx),
        offsetY: event.clientY - (boardRect.top + topPx),
      });
    },
    [isEnabled, boardRef, items],
  );

  // -- Keyboard interactions for focused items (a11y).
  const handleItemKeyDown = useCallback(
    (event, itemId) => {
      if (!isEnabled) return;
      const item = items.find((entry) => entry.id === itemId);
      if (!item) return;

      const step = event.shiftKey ? GRID_SNAP_PERCENT : KEYBOARD_NUDGE_PERCENT;
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const itemSize = MOODBOARD_ITEM_SIZES[item.size || "md"];
      const maxX = ((boardRect.width - itemSize) / boardRect.width) * 100;
      const maxY = ((boardRect.height - itemSize) / boardRect.height) * 100;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          onUpdatePosition(itemId, {
            x: clamp(item.position.x - step, 0, maxX),
            y: item.position.y,
          });
          break;
        case "ArrowRight":
          event.preventDefault();
          onUpdatePosition(itemId, {
            x: clamp(item.position.x + step, 0, maxX),
            y: item.position.y,
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          onUpdatePosition(itemId, {
            x: item.position.x,
            y: clamp(item.position.y - step, 0, maxY),
          });
          break;
        case "ArrowDown":
          event.preventDefault();
          onUpdatePosition(itemId, {
            x: item.position.x,
            y: clamp(item.position.y + step, 0, maxY),
          });
          break;
        case "Enter":
          event.preventDefault();
          onBeginEdit(itemId);
          break;
        case "Delete":
        case "Backspace":
          event.preventDefault();
          onRemove(itemId);
          break;
        default:
          break;
      }
    },
    [isEnabled, items, boardRef, onUpdatePosition, onBeginEdit, onRemove],
  );

  return {
    dragState,
    focusedItemId,
    setFocusedItemId,
    startDrag,
    handleItemKeyDown,
  };
};
