import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../../../../components/Badge";
import { Button } from "../../../../components/Button";
import { useMoodboardDrag } from "../../hooks/useMoodboardDrag";
import { formatMonthLabel } from "../../utils/month";
import { getBoardMonthValue } from "../../utils/moodboard";
import { FormError } from "../shared/FormError";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { MoodboardItemEditor } from "./MoodboardItemEditor";
import { VisionBoardCanvas } from "./VisionBoardCanvas";
import { VisionBoardMeta } from "./VisionBoardMeta";
import MusicIcon from "../../../../assets/icons/music.svg";

export const VisionBoardStage = ({
  board,
  isEditable,
  form,
  error,
  blockedMonthValues,
  onFieldChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onBeginEditItem,
  onCancelEditItem,
  onBringItemForward,
  onSendItemBack,
  onSetError,
  onClearError,
  onBeginEdit,
  onCreate,
}) => {
  const boardRef = useRef(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState(false);

  const items = isEditable ? (form?.items ?? []) : (board?.items ?? []);

  // Drag adapter: position-only updates go through onUpdateItem.
  const updatePosition = useCallback(
    (id, position) => {
      const existing = items.find((item) => item.id === id);
      if (!existing) return;
      onUpdateItem(id, { position: { ...existing.position, ...position } });
    },
    [items, onUpdateItem],
  );

  const {
    dragState,
    focusedItemId,
    setFocusedItemId,
    startDrag,
    handleItemKeyDown,
  } = useMoodboardDrag({
    boardRef,
    items,
    onUpdatePosition: updatePosition,
    onRemove: onRemoveItem,
    onBeginEdit: onBeginEditItem,
    isEnabled: isEditable,
    snapEnabled,
  });

  const editingItem = useMemo(
    () =>
      form?.editingItemId
        ? items.find((item) => item.id === form.editingItemId)
        : null,
    [form?.editingItemId, items],
  );

  const resizeItem = useCallback(
    (id, size) => onUpdateItem(id, { size }),
    [onUpdateItem],
  );

  const expandImage = useCallback(
    (src, alt) => setExpandedImage(src ? { src, alt } : null),
    [],
  );

  useEffect(() => {
    if (!isCanvasExpanded) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCanvasExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCanvasExpanded]);

  const canvas = (
    <VisionBoardCanvas
      boardRef={boardRef}
      items={items}
      isEditable={isEditable}
      dragState={dragState}
      focusedItemId={focusedItemId}
      snapEnabled={snapEnabled}
      onItemPointerDown={startDrag}
      onItemKeyDown={handleItemKeyDown}
      onItemFocus={setFocusedItemId}
      onBeginEditItem={onBeginEditItem}
      onRemoveItem={onRemoveItem}
      onResizeItem={resizeItem}
      onBringForward={onBringItemForward}
      onSendBack={onSendItemBack}
      onExpandImage={expandImage}
      className={
        isCanvasExpanded
          ? "h-[calc(100vh-10rem)] rounded-none sm:h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)]"
          : ""
      }
    />
  );

  return (
    <section className="space-y-4 rounded-3xl border border-brand/15 bg-linear-to-b from-cream to-page p-4 shadow-[0_18px_50px_rgba(55,62,112,0.08)] sm:space-y-5 sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          {board && board.playlistNote && (
            <div className="flex flex-row gap-2">
              <img src={MusicIcon} alt="Music icon" className="size-4" />
              <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/60">
                {board.playlistNote}
              </p>
            </div>
          )}
          {!isEditable && board ? (
            <>
              <h2 className="font-ui text-2xl text-brand sm:text-3xl">
                {formatMonthLabel(getBoardMonthValue(board))}
              </h2>
              <p className="text-sm italic text-brand/80">{board.prompt}</p>
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditable && board ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              fullWidth={false}
              text="Edit board"
              onClick={() => onBeginEdit(board)}
            />
          ) : null}
          {board || isEditable ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth={false}
              text={isCanvasExpanded ? "Exit cinema" : "Cinema mode"}
              onClick={() => setIsCanvasExpanded((current) => !current)}
            />
          ) : null}
        </div>
      </header>

      {isEditable && form ? (
        <>
          <VisionBoardMeta
            form={form}
            onFieldChange={onFieldChange}
            blockedMonthValues={blockedMonthValues}
          />
          <MoodboardItemEditor
            editingItemId={form.editingItemId}
            existingItem={editingItem}
            onAdd={onAddItem}
            onSaveEdit={(id, patch) => {
              onUpdateItem(id, patch);
              onCancelEditItem();
            }}
            onCancelEdit={onCancelEditItem}
            onError={onSetError}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand/10 px-4 py-2">
            <label className="inline-flex items-center gap-2 font-body text-sm text-brand/75">
              <input
                type="checkbox"
                checked={snapEnabled}
                onChange={(event) => setSnapEnabled(event.target.checked)}
                className="h-4 w-4 rounded border-brand/30 text-brand focus:ring-brand/30"
              />
              Snap to grid on release
            </label>
            <p className="font-body text-xs text-brand/55">
              Arrow keys nudge focused items. Hold Shift for larger steps.
            </p>
          </div>
        </>
      ) : null}

      {board || isEditable ? (
        isCanvasExpanded ? (
          <div className="fixed inset-x-0 bottom-0 top-0 z-40 bg-navy/85 px-3 backdrop-blur-md sm:px-6 py-22">
            <div className="mx-auto flex h-full w-full max-w-400 flex-col gap-3">
              <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-page/90 px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <div>
                  <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/60">
                    Cinema mode
                  </p>
                  <p className="font-body text-sm text-brand/70">
                    {board
                      ? formatMonthLabel(getBoardMonthValue(board))
                      : "Moodboard canvas"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  fullWidth={false}
                  text="Exit cinema"
                  onClick={() => setIsCanvasExpanded(false)}
                />
              </div>
              <div className="min-h-0 flex-1 overflow-hidden rounded-4xl border border-white/10 bg-page/95 shadow-[0_25px_80px_rgba(0,0,0,0.28)]">
                {canvas}
              </div>
            </div>
          </div>
        ) : (
          canvas
        )
      ) : null}

      {!board && !isEditable ? (
        <div className="rounded-3xl border border-dashed border-brand/25 bg-page/80 p-8 text-center">
          <p className="font-ui text-xl text-brand">No moodboard selected</p>
          <p className="mt-2 font-body text-sm text-brand/70">
            Pick one from the library, or start a new board.
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth={false}
              text="Create new"
              onClick={onCreate}
            />
          </div>
        </div>
      ) : null}

      <FormError message={error} onDismiss={onClearError} />

      <ImagePreviewModal
        image={expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </section>
  );
};

const MetaSummary = ({ label, value }) => (
  <div>
    <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/60">
      {label}
    </p>
    <p className="mt-1 font-body text-sm leading-relaxed text-brand/80">
      {value}
    </p>
  </div>
);
