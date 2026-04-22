import { useEffect, useRef, useState } from "react";
import { AUTOSAVE_DEBOUNCE_MS } from "../constants";

/**
 * Debounced autosave. Invokes `saveFn` `debounceMs` after the last change
 * to `value`, provided `isEnabled` is true. Exposes status so the UI can
 * show a "Saving..." / "Saved" indicator.
 */
export const useAutosave = ({
  value,
  saveFn,
  isEnabled = true,
  debounceMs = AUTOSAVE_DEBOUNCE_MS,
}) => {
  const [status, setStatus] = useState("idle"); // 'idle' | 'pending' | 'saved'
  const timerRef = useRef(null);
  const statusResetRef = useRef(null);
  const saveFnRef = useRef(saveFn);
  // Track the first value we see so we don't autosave a newly-loaded form.
  const initialValueRef = useRef(value);
  const lastValueRef = useRef(value);
  const hasChangedRef = useRef(false);

  useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const valueChanged = !Object.is(value, lastValueRef.current);

    // Skip the initial mount — only save after the user actually edits.
    if (!hasChangedRef.current) {
      if (!Object.is(value, initialValueRef.current)) {
        hasChangedRef.current = true;
      } else {
        return undefined;
      }
    } else if (!valueChanged) {
      return undefined;
    }

    lastValueRef.current = value;

    setStatus("pending");
    clearTimeout(timerRef.current);
    clearTimeout(statusResetRef.current);

    timerRef.current = setTimeout(() => {
      const result = saveFnRef.current();
      if (result !== false) {
        setStatus("saved");
        // Revert to idle after a moment so the indicator doesn't linger.
        statusResetRef.current = setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("idle");
      }
    }, debounceMs);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(statusResetRef.current);
    };
  }, [value, isEnabled, debounceMs]);

  // Reset when enable toggles off (e.g., user cancels edit mode).
  useEffect(() => {
    if (!isEnabled) {
      clearTimeout(timerRef.current);
      clearTimeout(statusResetRef.current);
      hasChangedRef.current = false;
      initialValueRef.current = value;
      lastValueRef.current = value;
      setStatus("idle");
    }
  }, [isEnabled]);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      clearTimeout(statusResetRef.current);
    },
    [],
  );

  return status;
};
