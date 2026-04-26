import { Link } from "react-router-dom";
import { PhaseBadge } from "./PhaseBadge";
import {
  computeEffectivePhase,
  PHASES,
  areVotesRevealed,
} from "../../utils/phase";
import { formatCountdown, formatDeadline } from "../../utils/voting";
import { tallyVotes } from "../../utils/quorum";

/**
 * Card rendered in every list view. Shows the title, a one-line preview,
 * the effective phase, and phase-specific context:
 *   - Voting phase: countdown to deadline + vote participation
 *   - Closed/Implemented: final tally (votes are revealed)
 *   - Discussion: comment count (low-friction signal of activity)
 *
 * The whole card is a link to the detail page.
 */
export const ProposalCard = ({ proposal, authorName }) => {
  const phase = computeEffectivePhase(proposal);
  const counts = tallyVotes(proposal.votes);

  return (
    <Link
      to={`/forum/${proposal.id}`}
      className="group block rounded-3xl border border-brand/15 bg-cream p-5 shadow-[0_14px_36px_rgba(75,81,149,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_22px_48px_rgba(75,81,149,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-ui text-lg leading-tight text-brand md:text-xl">
            {proposal.title || "Untitled proposal"}
          </h3>
          <p className="mt-1 font-body text-xs text-brand/60">
            by {authorName || "Unknown peer"}
          </p>
        </div>
        <PhaseBadge phase={phase} />
      </header>

      {proposal.description ? (
        <p className="mt-3 line-clamp-2 font-body text-sm leading-relaxed text-brand/75">
          {proposal.description}
        </p>
      ) : null}

      <footer className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-brand/10 pt-3 font-body text-xs text-brand/60">
        <PhaseFooter phase={phase} proposal={proposal} counts={counts} />
      </footer>
    </Link>
  );
};

/**
 * Phase-specific footer copy. Kept internal since it's always paired
 * with ProposalCard — moving it out would add a file for no gain.
 */
const PhaseFooter = ({ phase, proposal, counts }) => {
  const attachmentCount = proposal.attachments?.length ?? 0;
  const attachmentMeta =
    attachmentCount > 0
      ? `${attachmentCount} attachment${attachmentCount === 1 ? "" : "s"}`
      : null;

  if (phase === PHASES.DRAFT) {
    return (
      <>
        <span>Only visible to you. Publish to share it with peers.</span>
        {attachmentMeta ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{attachmentMeta}</span>
          </>
        ) : null}
      </>
    );
  }

  if (phase === PHASES.DISCUSSION) {
    const comments = proposal.comments?.length ?? 0;
    return (
      <>
        <span>
          {comments} comment{comments === 1 ? "" : "s"}
        </span>
        <span aria-hidden="true">·</span>
        <span>Voting not yet open</span>
        {attachmentMeta ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{attachmentMeta}</span>
          </>
        ) : null}
      </>
    );
  }

  if (phase === PHASES.VOTING) {
    return (
      <>
        <span>
          {counts.total} vote{counts.total === 1 ? "" : "s"} cast
        </span>
        <span aria-hidden="true">·</span>
        <span>
          Closes in{" "}
          <span className="text-brand/80">
            {formatCountdown(proposal.votingDeadline)}
          </span>
        </span>
        {attachmentMeta ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{attachmentMeta}</span>
          </>
        ) : null}
      </>
    );
  }

  if (phase === PHASES.WITHDRAWN) {
    return (
      <>
        <span>Withdrawn by the author</span>
        {attachmentMeta ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{attachmentMeta}</span>
          </>
        ) : null}
      </>
    );
  }

  // Closed or Implemented — votes are revealed.
  if (areVotesRevealed(phase)) {
    return (
      <>
        <span>
          Yes {counts.yes} · No {counts.no} · Abstain {counts.abstain}
        </span>
        {proposal.votingDeadline ? (
          <>
            <span aria-hidden="true">·</span>
            <span>Closed {formatDeadline(proposal.votingDeadline)}</span>
          </>
        ) : null}
        {attachmentMeta ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{attachmentMeta}</span>
          </>
        ) : null}
      </>
    );
  }

  return null;
};
