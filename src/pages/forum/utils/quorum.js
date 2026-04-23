/**
 * Quorum threshold: max(3 votes, 10% of active peer count).
 * "Active" = peers who have completed onboarding, to avoid counting
 * dormant signups. Not perfect, real governance would use attendance
 * data, but the best we have client-side.
 */
const MIN_VOTES = 3;
const QUORUM_FRACTION = 0.1;

export const computeQuorumThreshold = (eligiblePeerCount) => {
  const fractional = Math.ceil((eligiblePeerCount || 0) * QUORUM_FRACTION);
  return Math.max(MIN_VOTES, fractional);
};

/**
 * Turn a votes map into counts. The Votes shape is:
 *   { userId: { value: "yes" | "no" | "abstain", castAt } }
 */
export const tallyVotes = (votes = {}) => {
  const counts = { yes: 0, no: 0, abstain: 0, total: 0 };
  Object.values(votes).forEach((vote) => {
    if (vote?.value === "yes") counts.yes += 1;
    else if (vote?.value === "no") counts.no += 1;
    else if (vote?.value === "abstain") counts.abstain += 1;
    counts.total += 1;
  });
  return counts;
};

/**
 * Given tallied votes and a quorum threshold, determine the outcome.
 *   - below quorum → "inconclusive"
 *   - yes > no     → "passed"
 *   - no ≥ yes     → "rejected"
 * Abstain votes count toward quorum but not toward the yes/no contest.
 */
export const computeOutcome = ({ counts, quorumThreshold }) => {
  if (counts.total < quorumThreshold) return "inconclusive";
  if (counts.yes > counts.no) return "passed";
  return "rejected";
};

/**
 * Presentation for each outcome.
 */
export const getOutcomeLabel = (outcome) => {
  switch (outcome) {
    case "passed":
      return "Passed";
    case "rejected":
      return "Rejected";
    case "inconclusive":
      return "Inconclusive";
    case "withdrawn":
      return "Withdrawn";
    default:
      return outcome;
  }
};

export const getOutcomeTone = (outcome) => {
  switch (outcome) {
    case "passed":
      return "sage";
    case "rejected":
      return "rose";
    case "inconclusive":
      return "neutral";
    case "withdrawn":
      return "neutral";
    default:
      return "neutral";
  }
};
