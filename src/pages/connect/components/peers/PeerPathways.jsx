import { pathwayNameById } from "../../utils/peers";

/**
 * Pathway progress bars. No explainer prose — a progress bar labelled
 * with a percentage and pathway name needs no narration.
 */
export const PeerPathways = ({ pathwayProgress = [], subjects }) => {
  if (pathwayProgress.length === 0) return null;

  return (
    <ul className="space-y-2.5">
      {pathwayProgress.map((entry) => {
        const percent = Math.min(100, Math.max(0, entry.progress));
        return (
          <li key={entry.subjectId}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-ui text-base text-brand">
                {pathwayNameById(entry.subjectId, subjects)}
              </p>
              <p
                className="font-body text-xs tabular-nums text-brand/60"
                aria-label={`${percent} percent complete`}
              >
                {percent}%
              </p>
            </div>
            <div
              className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand/10"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-brand to-lavender transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
