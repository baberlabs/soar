import { useCallback, useState } from "react";

/**
 * Promise-based confirmation dialog. Replaces window.confirm with a styled,
 * accessible modal.
 *
 * Usage:
 *   const { confirm, confirmState } = useConfirmDialog();
 *   const ok = await confirm({ title: "Delete?", message: "...", tone: "danger" });
 *   if (ok) doTheThing();
 *
 * Consumer must render <ConfirmDialog {...confirmState} /> somewhere in its tree.
 */
export const useConfirmDialog = () => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "default",
    resolver: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title ?? "Are you sure?",
        message: options.message ?? "",
        confirmText: options.confirmText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
        tone: options.tone ?? "default",
        resolver: resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolver?.(true);
    setState((prev) => ({ ...prev, isOpen: false, resolver: null }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolver?.(false);
    setState((prev) => ({ ...prev, isOpen: false, resolver: null }));
  }, [state]);

  return {
    confirm,
    confirmState: {
      isOpen: state.isOpen,
      title: state.title,
      message: state.message,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      tone: state.tone,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  };
};
