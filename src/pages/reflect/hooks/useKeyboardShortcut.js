import { useEffect } from "react";

/**
 * Register a global keyboard shortcut while the component is mounted.
 * Respects typical "don't steal keystrokes from inputs" etiquette, UNLESS
 * `allowInInputs` is true (useful for Cmd/Ctrl+S save).
 */
export const useKeyboardShortcut = (shortcut, handler, { allowInInputs = false } = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isEditable =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isEditable && !allowInInputs) return;

      const matchesMeta = shortcut.meta
        ? event.metaKey || event.ctrlKey
        : !(event.metaKey || event.ctrlKey);
      const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (matchesKey && matchesMeta && (shortcut.shift === undefined || matchesShift)) {
        event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcut.key, shortcut.meta, shortcut.shift, handler, allowInInputs]);
};
