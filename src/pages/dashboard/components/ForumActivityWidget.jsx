import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSOARState } from "../../../store";
import {
  PHASES,
  computeEffectivePhase,
  getPhaseLabel,
} from "../../forum/utils/phase";
import { WidgetCard, WidgetHeader } from "./WidgetCard";

/**
 * Shows up to three proposals currently in Discussion or Voting. Voting
 * proposals get the closest-deadline-first treatment so peers see what
 * needs their vote next.
 */
export const ForumActivityWidget = () => {
  const state = useSOARState();

  const activeProposals = useMemo(() => {
    const proposals = state.forum ?? [];
    const active = proposals.filter((proposal) => {
      const phase = computeEffectivePhase(proposal);
      return phase === PHASES.DISCUSSION || phase === PHASES.VOTING;
    });

    return active
      .sort((a, b) => {
        const phaseA = computeEffectivePhase(a);
        const phaseB = computeEffectivePhase(b);
        // Voting proposals first, by soonest deadline.
        if (phaseA === PHASES.VOTING && phaseB !== PHASES.VOTING) return -1;
        if (phaseB === PHASES.VOTING && phaseA !== PHASES.VOTING) return 1;
        if (phaseA === PHASES.VOTING && phaseB === PHASES.VOTING) {
          const deadlineA = new Date(a.votingDeadline ?? 0).getTime();
          const deadlineB = new Date(b.votingDeadline ?? 0).getTime();
          return deadlineA - deadlineB;
        }
        // Both in discussion → newest first.
        const updatedA = new Date(a.publishedAt ?? a.createdAt ?? 0).getTime();
        const updatedB = new Date(b.publishedAt ?? b.createdAt ?? 0).getTime();
        return updatedB - updatedA;
      })
      .slice(0, 3);
  }, [state.forum]);

  return (
    <WidgetCard>
      <WidgetHeader
        eyebrow="Forum"
        title="Active proposals"
        aside={
          activeProposals.length > 0 ? (
            <span className="rounded-full bg-brand/8 px-3 py-1 font-body text-xs text-brand/72">
              {activeProposals.length}{" "}
              {activeProposals.length === 1 ? "proposal" : "proposals"}
            </span>
          ) : null
        }
      />

      <div className="mt-4 flex-1">
        {activeProposals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand/25 bg-page p-6 text-center">
            <p className="font-body text-sm text-brand/72">
              No active proposals right now. Start one to shape what comes next.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {activeProposals.map((proposal) => (
              <ProposalRow key={proposal.id} proposal={proposal} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-brand/10 pt-4">
        <Link
          to="/forum"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          Open the Forum
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </WidgetCard>
  );
};

const ProposalRow = ({ proposal }) => {
  const phase = computeEffectivePhase(proposal);
  const isVoting = phase === PHASES.VOTING;

  return (
    <li>
      <Link
        to={`/forum/${proposal.id}`}
        className="flex items-start justify-between gap-3 rounded-2xl border border-brand/12 bg-page p-3 transition hover:border-brand/30 hover:bg-page/60"
      >
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-ui text-sm leading-snug text-brand">
            {proposal.title}
          </p>
          {isVoting && proposal.votingDeadline ? (
            <p className="mt-1 font-body text-xs text-brand/65">
              Vote before {formatShortDate(proposal.votingDeadline)}
            </p>
          ) : null}
        </div>
        <PhaseBadge phase={phase} />
      </Link>
    </li>
  );
};

const PhaseBadge = ({ phase }) => {
  const tone =
    phase === PHASES.VOTING
      ? "bg-yellow/30 text-brand"
      : phase === PHASES.DISCUSSION
        ? "bg-sky/25 text-brand"
        : "bg-brand/8 text-brand/72";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 font-body text-[0.62rem] font-semibold uppercase tracking-[0.08em] ${tone}`}
    >
      {getPhaseLabel(phase)}
    </span>
  );
};

const formatShortDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};
