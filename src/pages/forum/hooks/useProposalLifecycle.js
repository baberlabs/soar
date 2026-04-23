import { useMemo } from "react";
import {
  PHASES,
  computeEffectivePhase,
  canVote,
  canComment,
  areVotesRevealed,
} from "../utils/phase";

/**
 * Given a proposal and the current user, return a view model covering:
 *   - effective phase (time-aware)
 *   - author-only action affordances
 *   - voter-only affordances
 *
 * Components don't need to care about status/deadline interplay; this
 * hook normalizes it into booleans they can consume directly.
 */
export const useProposalLifecycle = ({ proposal, currentUserId }) =>
  useMemo(() => {
    if (!proposal) return null;

    const phase = computeEffectivePhase(proposal);
    const isAuthor = proposal.authorId === currentUserId;

    // Author affordances: what can *this* user do as the author in
    // the current phase.
    const authorCanEdit =
      isAuthor && (phase === PHASES.DRAFT || phase === PHASES.DISCUSSION);
    const authorCanPublish = isAuthor && phase === PHASES.DRAFT;
    const authorCanOpenVoting = isAuthor && phase === PHASES.DISCUSSION;
    const authorCanWithdraw =
      isAuthor &&
      [PHASES.DRAFT, PHASES.DISCUSSION, PHASES.VOTING].includes(phase);
    const authorCanMarkImplemented = isAuthor && phase === PHASES.CLOSED;
    const authorCanDelete = isAuthor && phase === PHASES.DRAFT;

    // Generic affordances.
    const voting = canVote(phase);
    const commenting = canComment(phase);
    const votesVisible = areVotesRevealed(phase);

    const myVote = currentUserId
      ? (proposal.votes?.[currentUserId]?.value ?? null)
      : null;

    return {
      phase,
      isAuthor,
      // author
      authorCanEdit,
      authorCanPublish,
      authorCanOpenVoting,
      authorCanWithdraw,
      authorCanMarkImplemented,
      authorCanDelete,
      // general
      canVote: voting,
      canComment: commenting,
      votesRevealed: votesVisible,
      myVote,
    };
  }, [proposal, currentUserId]);
