import { useEffect } from "react";
import { ERROR_DISPLAY_MS } from "../../constants";

export const FormError = ({ message, onDismiss }) => {
  useEffect(() => {
    if (!message || !onDismiss) return undefined;
    const timer = setTimeout(onDismiss, ERROR_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-body text-sm text-rose-800"
    >
      <span aria-hidden="true" className="mt-0.5 font-ui text-base">
        !
      </span>
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full px-2 font-ui text-xs text-rose-700 hover:bg-rose-100"
          aria-label="Dismiss error"
        >
          ×
        </button>
      ) : null}
    </div>
  );
};
