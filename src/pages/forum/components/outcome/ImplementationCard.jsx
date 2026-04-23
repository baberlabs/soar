import { useState } from "react";
import { Button } from "../../../../components/Button";

/**
 * Post-close implementation card. Two modes:
 *   - Author + Closed phase: shows a form to add an implementation note
 *     and mark the proposal implemented
 *   - Implemented phase (everyone): shows the implementation note
 *
 * TODO: when a maintainer/role system lands, gate the "mark implemented"
 * action on role rather than authorship so authors can't falsely claim
 * their proposals shipped. For now authorship is the only available
 * signal.
 */
export const ImplementationCard = ({
  phase,
  isAuthor,
  implementationNote,
  implementedAt,
  onMarkImplemented,
}) => {
  const [note, setNote] = useState("");

  if (phase === "implemented") {
    return (
      <div className="rounded-3xl border border-sage/30 bg-sage/5 p-5">
        <header className="flex items-center justify-between gap-3">
          <p className="font-ui text-xs uppercase tracking-[0.18em] text-sage">
            Implemented
          </p>
          {implementedAt ? (
            <p className="font-body text-xs text-sage/80">
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(implementedAt))}
            </p>
          ) : null}
        </header>
        {implementationNote ? (
          <p className="mt-2 font-body text-sm leading-relaxed text-sage/90 whitespace-pre-line">
            {implementationNote}
          </p>
        ) : (
          <p className="mt-2 font-body text-sm text-sage/70">
            Marked as implemented. No implementation notes were added.
          </p>
        )}
      </div>
    );
  }

  // Only authors see the "mark implemented" form, and only while closed.
  if (phase !== "closed" || !isAuthor) return null;

  return (
    <div className="space-y-3 rounded-3xl border border-brand/15 bg-cream p-5">
      <header>
        <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
          Follow through
        </p>
        <p className="mt-1 font-ui text-lg text-brand">Mark as implemented</p>
        <p className="mt-1 font-body text-sm text-brand/65">
          Once the change has shipped, record what was done so peers can see the
          outcome in action.
        </p>
      </header>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows="3"
        placeholder="What was built, changed, or decided (optional)"
        className="w-full rounded-2xl border border-black/15 bg-page/60 px-4 py-3 font-body text-sm text-navy outline-none placeholder:text-navy/35 transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />

      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Mark implemented"
          onClick={() => onMarkImplemented(note.trim())}
        />
      </div>
    </div>
  );
};
