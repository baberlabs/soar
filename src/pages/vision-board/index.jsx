import { useCallback } from "react";
import { useSOARDispatch, useSOARState } from "../../store";
import { useVisionComposer } from "../reflect/hooks/useVisionComposer";
import { useConfirmDialog } from "../reflect/hooks/useConfirmDialog";
import { useAutosave } from "../reflect/hooks/useAutosave";
import { useKeyboardShortcut } from "../reflect/hooks/useKeyboardShortcut";
import { formatMonthLabel } from "../reflect/utils/month";
import { ConfirmDialog } from "../reflect/components/shared/ConfirmDialog";
import { EditingBanner } from "../reflect/components/shared/EditingBanner";
import { VisionTabPanel } from "../reflect/components/vision/VisionTabPanel";

/**
 * Vision Board page (spec 8.11). Thin orchestrator that wires the global
 * store to the vision composer, hosts the ConfirmDialog instance, and
 * handles cross-cutting UX: autosave, keyboard shortcuts, editing banner.
 *
 * The hard state logic lives in useVisionComposer. The UI lives in the
 * `vision` feature folder. This file is intentionally short.
 */
export default function VisionBoard() {
  const state = useSOARState();
  const dispatchStore = useSOARDispatch();

  const visionBoards = state.reflections?.visionBoards ?? [];

  const visionComposer = useVisionComposer({ visionBoards, dispatchStore });
  const { confirm, confirmState } = useConfirmDialog();

  // Autosave drafts after the user has stopped editing for a moment.
  // Track the full editable form object so item edits (position/text/size/url)
  // also trigger autosave.
  const autosaveValue = visionComposer.form;

  const autosaveFn = useCallback(() => {
    if (!visionComposer.form) return false;
    // Avoid creating a blank board from autosave when create mode first opens.
    const hasAutosaveContent =
      visionComposer.form.items.length > 0 ||
      visionComposer.form.prompt.trim().length > 0 ||
      visionComposer.form.playlistNote.trim().length > 0;

    if (!hasAutosaveContent) {
      return false;
    }
    return Boolean(visionComposer.save({ keepEditing: true }));
  }, [visionComposer.form, visionComposer.save]);

  const autosaveStatus = useAutosave({
    value: autosaveValue,
    saveFn: autosaveFn,
    isEnabled: visionComposer.isEditable,
  });

  // Cmd/Ctrl+S saves the current editable board.
  useKeyboardShortcut(
    { key: "s", meta: true },
    () => {
      if (visionComposer.isEditable) visionComposer.save();
    },
    { allowInInputs: true },
  );

  // Escape cancels editing from anywhere.
  useKeyboardShortcut({ key: "Escape" }, () => {
    if (visionComposer.isEditable) visionComposer.cancel();
  });

  // -- Confirmation adapters for destructive / commitment actions.
  const confirmDelete = useCallback(
    async ({ title, message, confirmText, tone, onConfirm }) => {
      const ok = await confirm({ title, message, confirmText, tone });
      if (ok) onConfirm();
    },
    [confirm],
  );

  const confirmDeleteBoard = useCallback(async () => {
    if (visionComposer.mode.kind !== "edit") return;
    const boardId = visionComposer.mode.boardId;
    const board = visionBoards.find((entry) => entry.id === boardId);
    const boardMonthLabel = board
      ? formatMonthLabel(board.month ?? board.createdAt)
      : "this month";
    const ok = await confirm({
      title: "Delete this moodboard?",
      message: `The board for ${boardMonthLabel} will be removed permanently along with its ${board?.items?.length || 0} items.`,
      confirmText: "Delete board",
      tone: "danger",
    });
    if (ok) visionComposer.removeBoard(boardId);
  }, [confirm, visionComposer, visionBoards]);

  // Guard: no user, no page. Render nothing (NOT before the hooks).
  if (!state.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-brand/55">
            Reflection
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Vision Board
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Capture where you are heading this month. Images, notes, and links
            arranged on a single canvas. One board per month.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 font-body text-[0.68rem] text-brand/55 sm:text-xs">
          <span>
            {visionBoards.length}{" "}
            {visionBoards.length === 1 ? "board" : "boards"}
          </span>
        </div>

        {visionComposer.isEditable ? (
          <EditingBanner
            mode={visionComposer.mode.kind}
            boardLabel={
              visionComposer.form?.month
                ? formatMonthLabel(visionComposer.form.month)
                : null
            }
            autosaveStatus={autosaveStatus}
            onSave={visionComposer.save}
            onCancel={visionComposer.cancel}
            onDelete={
              visionComposer.mode.kind === "edit"
                ? confirmDeleteBoard
                : undefined
            }
          />
        ) : null}

        <VisionTabPanel
          composer={visionComposer}
          onConfirmDelete={confirmDelete}
        />
      </div>

      <ConfirmDialog {...confirmState} />
    </main>
  );
}
