import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSOARState } from "../../../store";
import { ProposalCard } from "../components/shared/ProposalCard";
import { EmptyState } from "../components/shared/EmptyState";
import { getPhaseFilter } from "../utils/phase";
import { buildForumAuthorMap } from "../utils/authors";

/**
 * One tab component, four routes. The `:filter` path param determines
 * which phase(s) we render. Sort order prioritises relevance per tab:
 *
 *   discussion → newest publish first (recent activity matters)
 *   voting     → soonest deadline first (peers should see what closes next)
 *   closed     → newest closure first
 *   all        → newest publish first
 */
export default function FilteredListTab({ routeFilter }) {
  const { filter: paramFilter } = useParams();
  const state = useSOARState();
  const filter = routeFilter ?? paramFilter ?? "all";

  const predicate = getPhaseFilter(filter);

  const peersById = useMemo(() => {
    return buildForumAuthorMap(state.peers);
  }, [state.peers]);

  const filtered = useMemo(
    () => (state.forum ?? []).filter(predicate),
    [state.forum, predicate],
  );

  const sorted = useMemo(() => {
    const list = filtered.slice();
    if (filter === "voting") {
      list.sort((a, b) => {
        const ad = a.votingDeadline
          ? new Date(a.votingDeadline).getTime()
          : Infinity;
        const bd = b.votingDeadline
          ? new Date(b.votingDeadline).getTime()
          : Infinity;
        return ad - bd;
      });
    } else if (filter === "closed") {
      list.sort((a, b) => {
        const ad = new Date(
          a.closedAt ?? a.votingDeadline ?? a.createdAt,
        ).getTime();
        const bd = new Date(
          b.closedAt ?? b.votingDeadline ?? b.createdAt,
        ).getTime();
        return bd - ad;
      });
    } else {
      list.sort((a, b) => {
        const ad = new Date(a.publishedAt ?? a.createdAt).getTime();
        const bd = new Date(b.publishedAt ?? b.createdAt).getTime();
        return bd - ad;
      });
    }
    return list;
  }, [filtered, filter]);

  if (sorted.length === 0) {
    const empties = {
      all: {
        title: "No proposals yet",
        message: "Start the first one — propose a change to how SOAR works.",
        ctaLabel: "New proposal",
        ctaTo: "/forum/new",
      },
      discussion: {
        title: "Nothing being discussed",
        message: "Published proposals awaiting voting will appear here.",
      },
      voting: {
        title: "No active votes",
        message: "Proposals open for voting will appear here when they land.",
      },
      closed: {
        title: "No closed proposals yet",
        message: "Once proposals finish voting, their outcomes live here.",
      },
    };
    const config = empties[filter] ?? empties.all;
    return <EmptyState {...config} />;
  }

  return (
    <ul className="space-y-3">
      {sorted.map((proposal) => (
        <li key={proposal.id}>
          <ProposalCard
            proposal={proposal}
            authorName={peersById[proposal.authorId]?.fullName}
          />
        </li>
      ))}
    </ul>
  );
}
