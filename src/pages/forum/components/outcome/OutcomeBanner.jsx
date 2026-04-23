import { formatDeadline } from "../../utils/voting";
import { getOutcomeLabel } from "../../utils/quorum";

/**
 * Prominent banner at the top of a closed/implemented/withdrawn proposal.
 * Colour-keyed to outcome and includes context for why the outcome is
 * what it is (quorum reached or not, for example).
 */

const TONE_STYLES = {
  passed: "from-sage/15 via-sage/5 to-transparent border-sage/40 text-sage",
  rejected:
    "from-rose-100 via-rose-50 to-transparent border-rose-200 text-rose-900",
  inconclusive:
    "from-brand/10 via-brand/5 to-transparent border-brand/20 text-brand",
  withdrawn:
    "from-brand/8 via-brand/4 to-transparent border-brand/15 text-brand/80",
};

export const OutcomeBanner = ({
  outcome,
  reachedQuorum,
  counts,
  closedAt,
  deadline,
}) => {
  const tone = TONE_STYLES[outcome] ?? TONE_STYLES.inconclusive;

  const subcopy = (() => {
    if (outcome === "withdrawn") {
      return "The author withdrew this proposal before voting concluded.";
    }
    if (outcome === "inconclusive") {
      return `Below quorum — ${counts.total} vote${counts.total === 1 ? "" : "s"} cast. Outcome deferred.`;
    }
    const margin = Math.abs(counts.yes - counts.no);
    if (outcome === "passed") {
      return `Carried by ${margin} vote${margin === 1 ? "" : "s"}${reachedQuorum ? " with quorum met" : ""}.`;
    }
    if (outcome === "rejected") {
      return margin === 0
        ? "Tied — the proposal did not pass."
        : `Rejected by ${margin} vote${margin === 1 ? "" : "s"}${reachedQuorum ? " with quorum met" : ""}.`;
    }
    return null;
  })();

  return (
    <div
      className={`rounded-3xl border bg-linear-to-b p-5 ${tone}`}
      role="status"
    >
      <p className="font-ui text-xs uppercase tracking-[0.18em] opacity-75">
        Outcome
      </p>
      <h2 className="mt-1 font-display text-3xl leading-none">
        {getOutcomeLabel(outcome)}
      </h2>
      {subcopy ? (
        <p className="mt-2 font-body text-sm leading-relaxed opacity-85">
          {subcopy}
        </p>
      ) : null}
      {(closedAt || deadline) && outcome !== "withdrawn" ? (
        <p className="mt-2 font-body text-xs opacity-65">
          Closed {formatDeadline(closedAt ?? deadline)}
        </p>
      ) : null}
    </div>
  );
};
