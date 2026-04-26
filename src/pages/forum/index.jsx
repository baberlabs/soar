import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useSOARState } from "../../store";
import { ForumTabs } from "./components/shared/ForumTabs";
import { PHASES, computeEffectivePhase } from "./utils/phase";
import Page from "../../layout/Page";

export default function Forum() {
  const state = useSOARState();
  const userId = state.user?.id;

  const counts = useMemo(() => {
    const c = { all: 0, discussion: 0, voting: 0, closed: 0, drafts: 0 };
    (state.forum ?? []).forEach((proposal) => {
      const phase = computeEffectivePhase(proposal);
      if (phase === PHASES.DRAFT) {
        if (proposal.authorId === userId) c.drafts += 1;
        return; // drafts don't contribute to the 'all' count
      }
      c.all += 1;
      if (phase === PHASES.DISCUSSION) c.discussion += 1;
      else if (phase === PHASES.VOTING) c.voting += 1;
      else if (
        phase === PHASES.CLOSED ||
        phase === PHASES.IMPLEMENTED ||
        phase === PHASES.WITHDRAWN
      ) {
        c.closed += 1;
      }
    });
    return c;
  }, [state.forum, userId]);

  if (!state.user) return null;

  return (
    <Page
      heading="Forum"
      description="Propose, discuss, and vote on how SOAR evolves."
      contentClassName="mx-auto space-y-6"
    >
      <ForumTabs counts={counts} />

      <div className="mt-4">
        <Outlet />
      </div>
    </Page>
  );
}
