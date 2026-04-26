/**
 * Progress bar showing votes cast vs quorum threshold. Reaches 100% when
 * the quorum is met; can visually fill beyond that but we cap at 100 for
 * the stroke (a cheerful "quorum met" indicator would be overkill).
 *
 * Renders a small caption below so the numbers are legible even without
 * the bar (e.g. for screen readers).
 */
export const QuorumBar = ({ cast, threshold, label = "Quorum" }) => {
  const percent = threshold > 0 ? Math.min(100, Math.round((cast / threshold) * 100)) : 0;
  const reached = cast >= threshold;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-body text-[0.65rem] uppercase tracking-[0.14em] text-brand/55">
          {label}
        </span>
        <span className="font-body text-xs tabular-nums text-brand/70">
          {cast} of {threshold}
          {reached ? " · reached" : ""}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-brand/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${reached ? "bg-sage" : "bg-brand"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
