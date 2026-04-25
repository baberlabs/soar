import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSOARState } from "../../../store";
import { SubjectCard } from "../../../components/SubjectCard";
import { WidgetCard, WidgetHeader } from "./WidgetCard";

/**
 * Reuses SubjectCard, which already renders progress, "X of Y sessions",
 * the target completion date, and a Continue CTA pointing at the next
 * incomplete session (Task 3 wired that up).
 */
export const CurriculumWidget = () => {
  const state = useSOARState();

  const enrolledMap = useMemo(
    () =>
      new Map(
        (state.curriculum ?? []).map((entry) => [entry.subjectId, entry]),
      ),
    [state.curriculum],
  );

  const enrolledSubjects = useMemo(
    () =>
      (state.subjects ?? []).filter((subject) => enrolledMap.has(subject.id)),
    [state.subjects, enrolledMap],
  );

  return (
    <WidgetCard>
      <WidgetHeader
        eyebrow="Curriculum"
        title="Your active subjects"
        aside={
          enrolledSubjects.length > 0 ? (
            <span className="rounded-full bg-brand/8 px-3 py-1 font-body text-xs text-brand/72">
              {enrolledSubjects.length} enrolled
            </span>
          ) : null
        }
      />

      <div className="mt-5 flex-1">
        {enrolledSubjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/25 bg-page p-8 text-center">
            <p className="font-body text-sm leading-relaxed text-brand/72">
              Your curriculum is empty — add your first subject in Learn.
            </p>
            <Link
              to="/learn"
              className="mt-4 inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
            >
              Open Learn
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {enrolledSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                enrollment={enrolledMap.get(subject.id)}
              />
            ))}
          </div>
        )}
      </div>

      {enrolledSubjects.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-brand/10 pt-4">
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
          >
            Browse the subject library
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </WidgetCard>
  );
};
