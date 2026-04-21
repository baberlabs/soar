import { useSOARState } from "../../../hooks/useSOARState";
import { SectionCard } from "../components/shared/SectionCard";
import {
  CreationsSummary,
  LearningSummary,
  ReflectionsSummary,
} from "../components/activity/ActivitySummary";

export default function ActivityTab() {
  const [state] = useSOARState();

  return (
    <section
      id="account-panel-activity"
      role="tabpanel"
      aria-labelledby="account-tab-activity"
      className="space-y-6"
    >
      <SectionCard
        title="Activity"
        description="Headlines from your time on SOAR. Each card links to the page where you can dig in."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <LearningSummary
            curriculum={state.curriculum}
            subjects={state.subjects}
          />
          <CreationsSummary creations={state.creations} />
          <ReflectionsSummary reflections={state.reflections} />
        </div>
      </SectionCard>
    </section>
  );
}
