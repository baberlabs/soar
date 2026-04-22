import { useState } from "react";
import { Button } from "../../../../components/Button";

/**
 * GitHub-style "type CONFIRM_STRING to enable the button" pattern for
 * destructive actions. Three-stage: collapsed description → input → confirm.
 *
 * Never uses window.confirm — matches the styled dialog pattern from Reflect.
 */
export const DangerConfirm = ({
  title,
  description,
  confirmString,
  actionLabel,
  onConfirm,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [typed, setTyped] = useState("");

  const isUnlocked = typed === confirmString;

  const reset = () => {
    setExpanded(false);
    setTyped("");
  };

  return (
    <div className="rounded-2xl border border-rose-300/40 bg-rose-50/40 p-4">
      <p className="font-ui text-sm tracking-[0.03em] text-rose-900">{title}</p>
      {description ? (
        <p className="mt-1 font-body text-sm leading-relaxed text-rose-900/75">
          {description}
        </p>
      ) : null}

      {expanded ? (
        <div className="mt-3 space-y-2">
          <label
            htmlFor={`danger-confirm-${confirmString}`}
            className="block font-body text-xs text-rose-900/80"
          >
            Type <code className="font-mono font-semibold">{confirmString}</code>{" "}
            to confirm
          </label>
          <input
            id={`danger-confirm-${confirmString}`}
            type="text"
            autoComplete="off"
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            className="w-full rounded-xl border border-rose-400/40 bg-white/90 px-3 py-2 font-mono text-sm text-rose-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-300/40"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="danger"
              size="sm"
              fullWidth={false}
              text={actionLabel}
              disabled={!isUnlocked}
              onClick={() => {
                onConfirm();
                reset();
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth={false}
              text="Cancel"
              onClick={reset}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <Button
            type="button"
            variant="danger"
            size="sm"
            fullWidth={false}
            text={actionLabel}
            onClick={() => setExpanded(true)}
          />
        </div>
      )}
    </div>
  );
};
