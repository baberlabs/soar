import { useCallback } from "react";
import { formatMonthLabel } from "../utils/month";
import { useAutosave } from "./useAutosave";
import { useConfirmDialog } from "./useConfirmDialog";
import { useKeyboardShortcut } from "./useKeyboardShortcut";

const EMPTY_ARRAY = [];

export const useReflectOrchestrator = ({
  composer = null,
  kind = null,
  visionComposer: explicitVisionComposer = null,
  letterComposer: explicitLetterComposer = null,
  visionBoards = EMPTY_ARRAY,
} = {}) => {
  const visionComposer =
    explicitVisionComposer ?? (kind === "vision" ? composer : null);
  const letterComposer =
    explicitLetterComposer ?? (kind === "letter" ? composer : null);
  const { confirm, confirmState } = useConfirmDialog();

  const visionForm = visionComposer?.form ?? null;
  const visionIsEditable = Boolean(visionComposer?.isEditable);
  const visionSave = visionComposer?.save ?? null;
  const visionCancel = visionComposer?.cancel ?? null;
  const visionMode = visionComposer?.mode ?? null;
  const removeBoard = visionComposer?.removeBoard ?? null;

  const autosaveFn = useCallback(() => {
    if (!visionForm || !visionSave) return false;

    // Avoid creating a blank board from autosave when create mode first opens.
    const hasAutosaveContent =
      visionForm.items.length > 0 ||
      visionForm.prompt.trim().length > 0 ||
      visionForm.playlistNote.trim().length > 0;

    if (!hasAutosaveContent) {
      return false;
    }

    return Boolean(visionSave({ keepEditing: true }));
  }, [visionForm, visionSave]);

  const autosaveStatus = useAutosave({
    value: visionForm,
    saveFn: autosaveFn,
    isEnabled: visionIsEditable,
  });

  const saveShortcut = useCallback(() => {
    if (visionIsEditable) visionSave?.();
  }, [visionIsEditable, visionSave]);

  const cancelShortcut = useCallback(() => {
    if (visionIsEditable) visionCancel?.();
  }, [visionIsEditable, visionCancel]);

  useKeyboardShortcut({ key: "s", meta: true }, saveShortcut, {
    allowInInputs: true,
  });
  useKeyboardShortcut({ key: "Escape" }, cancelShortcut);

  const confirmDelete = useCallback(
    async ({ title, message, confirmText, tone, onConfirm }) => {
      const ok = await confirm({ title, message, confirmText, tone });
      if (ok) onConfirm?.();
    },
    [confirm],
  );

  const confirmDeleteBoard = useCallback(async () => {
    if (visionMode?.kind !== "edit" || !removeBoard) return;

    const boardId = visionMode.boardId;
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

    if (ok) removeBoard(boardId);
  }, [confirm, removeBoard, visionBoards, visionMode]);

  const confirmSeal = useCallback(
    async ({ onConfirm }) => {
      const ok = await confirm({
        title: "Seal this letter?",
        message:
          "Once sealed, the letter is hidden until its target month. You can break the seal early, but it will be recorded.",
        confirmText: "Seal it",
      });
      if (ok) onConfirm?.();
    },
    [confirm],
  );

  const confirmBreakSeal = useCallback(
    async ({ onConfirm }) => {
      const ok = await confirm({
        title: "Break the seal early?",
        message:
          "You committed to waiting. Breaking the seal will reveal the letter now, and be noted on the letter so your review stays honest.",
        confirmText: "Break seal",
        tone: "danger",
      });
      if (ok) onConfirm?.();
    },
    [confirm],
  );

  return {
    autosaveStatus,
    confirmState,
    confirmDelete,
    confirmDeleteBoard,
    confirmSeal,
    confirmBreakSeal,
    letterComposer,
    visionComposer,
  };
};
