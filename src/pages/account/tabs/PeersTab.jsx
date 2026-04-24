import { useSOARState } from "../../../store";
import { SectionCard } from "../components/shared/SectionCard";
import { ConnectionSummary } from "../components/peers/ConnectionSummary";

export default function PeersTab() {
  const state = useSOARState();

  return (
    <section
      id="account-panel-peers"
      role="tabpanel"
      aria-labelledby="account-tab-peers"
      className="space-y-6"
    >
      <SectionCard
        title="Peers"
        description="Everyone you've connected with, grouped by status."
      >
        <ConnectionSummary
          connections={state.connections}
          currentUserId={state.user.id}
        />
      </SectionCard>
    </section>
  );
}
