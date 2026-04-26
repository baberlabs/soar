import { useEffect, useState } from "react";
import { formatCountdown, formatDeadline } from "../../utils/voting";
import { QuorumBar } from "../shared/QuorumBar";

/**
 * Live-updating deadline countdown + participation indicator.
 *
 * Countdown re-renders every minute — a tighter interval would be
 * jittery and costly for very little visual gain (the countdown never
 * needs sub-minute precision since the shortest voting window is 1 day).
 *
 * Vote counts are shown only as a "total"; Yes/No/Abstain breakdown is
 * withheld until the phase flips to Closed, to match the "revealed on
 * close" model.
 */
export const VoteStatus = ({ deadline, totalVotes, quorumThreshold }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!deadline) return undefined;
    const interval = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(interval);
  }, [deadline]);

  const countdown = formatCountdown(deadline);
  const absolute = formatDeadline(deadline);

  return (
    <div className="space-y-3 rounded-2xl border border-brand/15 bg-cream p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
            Closes in
          </p>
          <p
            key={tick /* force a re-render tick for screenreader refresh */}
            className="mt-0.5 font-ui text-2xl text-brand"
          >
            {countdown}
          </p>
        </div>
        <p className="font-body text-xs text-brand/55">{absolute}</p>
      </div>

      <QuorumBar
        cast={totalVotes}
        threshold={quorumThreshold}
        label="Participation"
      />

      <p className="font-body text-xs text-brand/55">
        Individual votes stay hidden until voting closes.
      </p>
    </div>
  );
};
