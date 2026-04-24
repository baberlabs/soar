import { useMemo } from "react";
import { useSOARState } from "../../../store";
import { SectionCard } from "../components/shared/SectionCard";
import { NodeIdentityCard } from "../components/node/NodeIdentityCard";
import { NodeStatsGrid } from "../components/node/NodeStatsGrid";
import { PinnedContentList } from "../components/node/PinnedContentList";
import { deriveNodeStats } from "../utils/nodeStats";

/**
 * Node tab. Shows a decentralised node's worth of information, all of it
 * computed from real data in the store:
 *   - PeerID and multiaddrs derived from user.id
 *   - Peer count from accepted connections + DHT baseline
 *   - Storage used = byte sum of pinned content
 *   - Pinned content = creations + moodboards + letters + lesson reflections
 */
export default function NodeTab() {
  const state = useSOARState();

  const stats = useMemo(
    () =>
      deriveNodeStats({
        user: state.user,
        creations: state.creations,
        reflections: state.reflections,
        connections: state.connections,
      }),
    [state.user, state.creations, state.reflections, state.connections],
  );

  return (
    <section
      id="account-panel-node"
      role="tabpanel"
      aria-labelledby="account-tab-node"
      className="space-y-6"
    >
      <SectionCard
        title="Your node"
        description="A peer-to-peer node running in your browser, storing your content locally."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <NodeStatsGrid stats={stats} />
          <NodeIdentityCard
            peerId={stats.peerId}
            multiaddrs={stats.multiaddrs}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Pinned content"
        description={`${stats.pinCount} item${stats.pinCount === 1 ? "" : "s"} stored on this node.`}
      >
        <PinnedContentList pins={stats.pins} />
      </SectionCard>
    </section>
  );
}
