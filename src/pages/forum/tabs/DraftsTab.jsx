import { useMemo } from "react";
import { useSOARState } from "../../../hooks/useSOARState";
import { ProposalCard } from "../components/shared/ProposalCard";
import { EmptyState } from "../components/shared/EmptyState";
import { PHASES, computeEffectivePhase } from "../utils/phase";

/**
 * Current user's drafts only; filters the forum list to proposals the
 * user authored AND that are still in draft phase. Used on /forum/drafts.
 */
export default function DraftsTab() {
  const [state] = useSOARState();
  const userId = state.user.id;

  const drafts = useMemo(
    () =>
      (state.forum ?? [])
        .filter(
          (p) =>
            p.authorId === userId && computeEffectivePhase(p) === PHASES.DRAFT,
        )
        .sort((a, b) => {
          const ad = new Date(a.updatedAt ?? a.createdAt).getTime();
          const bd = new Date(b.updatedAt ?? b.createdAt).getTime();
          return bd - ad;
        }),
    [state.forum, userId],
  );

  if (drafts.length === 0) {
    return (
      <EmptyState
        title="No drafts"
        message="Draft proposals are private to you until you publish them."
        ctaLabel="Start a draft"
        ctaTo="/forum/new"
      />
    );
  }

  return (
    <ul className="space-y-3">
      {drafts.map((proposal) => (
        <li key={proposal.id}>
          <ProposalCard proposal={proposal} authorName={state.user.fullName} />
        </li>
      ))}
    </ul>
  );
}
