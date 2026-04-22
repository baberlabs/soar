import { A11Y_LABELS, GRID_SNAP_PERCENT } from "../../constants";
import { MoodboardItem } from "./MoodboardItem";

/**
 * The canvas that holds moodboard items. Shows a faint grid when snap is on,
 * and renders the empty-board microcopy when there are no items yet.
 */
export const VisionBoardCanvas = ({
  boardRef,
  items,
  isEditable,
  dragState,
  focusedItemId,
  snapEnabled,
  onItemPointerDown,
  onItemKeyDown,
  onItemFocus,
  onBeginEditItem,
  onRemoveItem,
  onResizeItem,
  onBringForward,
  onSendBack,
  onExpandImage,
  className = "",
}) => {
  const gridBackground =
    snapEnabled && isEditable
      ? `linear-gradient(to right, rgba(75,81,149,0.08) 1px, transparent 1px) 0 0 / ${GRID_SNAP_PERCENT}% 100%,
       linear-gradient(to bottom, rgba(75,81,149,0.08) 1px, transparent 1px) 0 0 / 100% ${GRID_SNAP_PERCENT}%`
      : "none";

  return (
    <div
      ref={boardRef}
      role="region"
      aria-label={A11Y_LABELS.moodboardCanvas}
      className={`relative h-92 overflow-hidden rounded-3xl border border-brand/15 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.85),rgba(233,238,227,0.95))] shadow-inner sm:h-108 lg:h-128 ${className}`}
      style={{ backgroundImage: gridBackground }}
    >
      {items.length === 0 ? (
        <div className="flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-sm rounded-2xl border border-brand/15 p-6 backdrop-blur-sm">
            <p className="font-ui text-sm uppercase tracking-[0.14em] text-brand/60">
              Empty canvas
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-brand/70">
              {isEditable
                ? "Open the item panel below and add your first image, note, or link."
                : "Nothing on this board yet."}
            </p>
          </div>
        </div>
      ) : (
        items.map((item, index) => (
          <MoodboardItem
            key={item.id}
            item={item}
            index={index}
            isEditable={isEditable}
            isDragging={dragState?.id === item.id}
            isFocused={focusedItemId === item.id}
            onPointerDown={onItemPointerDown}
            onKeyDown={onItemKeyDown}
            onFocus={onItemFocus}
            onBeginEdit={onBeginEditItem}
            onRemove={onRemoveItem}
            onResize={onResizeItem}
            onBringForward={onBringForward}
            onSendBack={onSendBack}
            onExpandImage={onExpandImage}
          />
        ))
      )}
    </div>
  );
};
