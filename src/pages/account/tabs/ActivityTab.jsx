import { useSOARState } from "../../../store";
import { SectionCard } from "../components/shared/SectionCard";
import {
  CreationsSummary,
  GovernanceSummary,
  LearningSummary,
  ReflectionsSummary,
} from "../components/activity/ActivitySummary";

export default function ActivityTab() {
  const state = useSOARState();

  return (
    <section
      id="account-panel-activity"
      role="tabpanel"
      aria-labelledby="account-tab-activity"
      className="space-y-6"
    >
      <SectionCard
        title="Activity"
        description="Headlines from your time on SOAR, including governance activity. Each card links to where you can dig in."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LearningSummary
            curriculum={state.curriculum}
            subjects={state.subjects}
          />
          <CreationsSummary creations={state.creations} />
          <ReflectionsSummary reflections={state.reflections} />
          <GovernanceSummary forum={state.forum} userId={state.user.id} />
        </div>
      </SectionCard>
    </section>
  );
}
