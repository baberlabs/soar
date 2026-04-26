import { useMemo } from "react";
import {
  tallyVotes,
  computeQuorumThreshold,
  computeOutcome,
} from "../utils/quorum";

/**
 * Compute vote tallies, quorum threshold, and outcome in one place.
 *
 * `eligiblePeerCount` is used to derive the quorum threshold — pass the
 * total count of peers who could plausibly have voted (we use onboarded
 * peers for this in the shell).
 */
export const useVoteTally = ({ votes, eligiblePeerCount, isWithdrawn }) =>
  useMemo(() => {
    const counts = tallyVotes(votes);
    const quorumThreshold = computeQuorumThreshold(eligiblePeerCount);
    const reachedQuorum = counts.total >= quorumThreshold;

    const outcome = isWithdrawn
      ? "withdrawn"
      : computeOutcome({ counts, quorumThreshold });

    return {
      counts,
      quorumThreshold,
      reachedQuorum,
      outcome,
    };
  }, [votes, eligiblePeerCount, isWithdrawn]);
