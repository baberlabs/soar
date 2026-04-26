import { useCallback, useEffect, useRef, useState } from "react";
import {
  GRID_SNAP_PERCENT,
  KEYBOARD_NUDGE_PERCENT,
  MOODBOARD_ITEM_SIZES,
} from "../constants";
import { clamp, snapToGrid } from "../utils/moodboard";

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

  const dragLatestRef = useRef(null);

  // --- Pointer-based drag (fixed)
  useEffect(() => {
    if (!dragState || !isEnabled) return;

    const handlePointerMove = (event) => {
      event.preventDefault(); // 🔑 critical for touch

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

    const stopDrag = (event) => {
      // 🔑 release pointer capture
      if (
        dragState?.pointerId != null &&
        event?.target?.releasePointerCapture
      ) {
        try {
          event.target.releasePointerCapture(dragState.pointerId);
        } catch {}
      }

      // Snap on release
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

    window.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [dragState, isEnabled, snapEnabled, boardRef, onUpdatePosition]);

  // --- Start drag (fixed)
  const startDrag = useCallback(
    (event, itemId) => {
      if (!isEnabled) return;

      event.preventDefault(); // 🔑 stops scroll interference
      event.currentTarget.setPointerCapture(event.pointerId); // 🔑 key fix

      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const item = items.find((entry) => entry.id === itemId);
      if (!item) return;

      const leftPx = (item.position.x / 100) * boardRect.width;
      const topPx = (item.position.y / 100) * boardRect.height;

      setDragState({
        id: itemId,
        size: item.size,
        pointerId: event.pointerId,
        offsetX: event.clientX - (boardRect.left + leftPx),
        offsetY: event.clientY - (boardRect.top + topPx),
      });
    },
    [isEnabled, boardRef, items],
  );

  // --- Keyboard controls (unchanged)
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
