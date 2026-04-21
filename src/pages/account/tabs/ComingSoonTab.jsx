import { SectionCard } from "../components/shared/SectionCard";
import { ComingSoonSection } from "../components/coming-soon/ComingSoonSection";

export default function ComingSoonTab() {
  return (
    <section
      id="account-panel-coming-soon"
      role="tabpanel"
      aria-labelledby="account-tab-coming-soon"
      className="space-y-6"
    >
      <SectionCard
        title="Coming soon"
        description="These settings are planned and will appear here as they land."
      >
        <ComingSoonSection />
      </SectionCard>
    </section>
  );
}
