import { useCallback, useState } from "react";
import { useSOARState } from "../../hooks/useSOARState";
import { useVisionComposer } from "./hooks/useVisionComposer";
import { useLetterComposer } from "./hooks/useLetterComposer";
import { useConfirmDialog } from "./hooks/useConfirmDialog";
import { useAutosave } from "./hooks/useAutosave";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { formatMonthLabel } from "./utils/month";
import { ReflectHeader } from "./components/shared/ReflectHeader";
import { ReflectTabs } from "./components/shared/ReflectTabs";
import { ConfirmDialog } from "./components/shared/ConfirmDialog";
import { EditingBanner } from "./components/shared/EditingBanner";
import { VisionTabPanel } from "./components/vision/VisionTabPanel";
import { LetterTabPanel } from "./components/letters/LetterTabPanel";

/**
 * Reflect page. Thin orchestrator that:
 *   - wires the global store to the two domain composers
 *   - hosts the single ConfirmDialog instance
 *   - handles cross-cutting UX: autosave, keyboard shortcuts, editing banner
 *
 * All the hard state logic lives in useVisionComposer / useLetterComposer.
 * All the UI lives in the feature folders. This file is supposed to stay short.
 */
export default function Reflect() {
  const [state, dispatchStore] = useSOARState();
  const [tab, setTab] = useState("vision");

  const visionBoards = state.reflections?.visionBoards ?? [];
  const rawLetters = state.reflections?.letters ?? [];

  const visionComposer = useVisionComposer({ visionBoards, dispatchStore });
  const letterComposer = useLetterComposer({ rawLetters, dispatchStore });

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

  const confirmSeal = useCallback(
    async ({ onConfirm }) => {
      const ok = await confirm({
        title: "Seal this letter?",
        message:
          "Once sealed, the letter is hidden until its target month. You can break the seal early, but it will be recorded.",
        confirmText: "Seal it",
      });
      if (ok) onConfirm();
    },
    [confirm],
  );

  const confirmBreakSeal = useCallback(
    async ({ onConfirm }) => {
      const ok = await confirm({
        title: "Break the seal early?",
        message:
          "You committed to waiting. Breaking the seal will reveal the letter now — and be noted on the letter so your review stays honest.",
        confirmText: "Break seal",
        tone: "danger",
      });
      if (ok) onConfirm();
    },
    [confirm],
  );

  // Guard: no user, no page. Render nothing (NOT before the hooks).
  if (!state.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-5xl space-y-8">
        <ReflectHeader />

        <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center sm:gap-4">
          <ReflectTabs tab={tab} onTabChange={setTab} />
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-body text-[0.68rem] text-brand/55 sm:text-xs">
            <span>{visionBoards.length} moodboards</span>
            <span aria-hidden="true">·</span>
            <span>{letterComposer.letters.length} letters</span>
          </div>
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

        {tab === "vision" ? (
          <VisionTabPanel
            composer={visionComposer}
            onConfirmDelete={confirmDelete}
          />
        ) : (
          <LetterTabPanel
            composer={letterComposer}
            onConfirmDelete={confirmDelete}
            onConfirmSeal={confirmSeal}
            onConfirmBreakSeal={confirmBreakSeal}
          />
        )}
      </div>

      <ConfirmDialog {...confirmState} />
    </main>
  );
}
