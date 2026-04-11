import { useMemo, useState } from "react";

import { Button } from "../../components/Button";
import { SubjectCard } from "../../components/SubjectCard";
import { useSOARState } from "../../hooks/useSOARState";
import { LEARNING_STYLE_LABELS } from "../../data/subjects";

const countCompletedSessions = (curriculum) =>
  curriculum.reduce(
    (total, entry) => total + (entry.completedLessonIds?.length ?? 0),
    0,
  );

export const Learn = () => {
  const [state] = useSOARState();
  const [filter, setFilter] = useState("recommended");

  const enrolledBySubjectId = useMemo(
    () => new Map(state.curriculum.map((entry) => [entry.subjectId, entry])),
    [state.curriculum],
  );

  const currentSubjects = state.subjects.filter((subject) =>
    enrolledBySubjectId.has(subject.id),
  );

  const availableSubjects = state.subjects.filter(
    (subject) => !enrolledBySubjectId.has(subject.id),
  );

  const normalizedInterests = (state.user?.interests ?? []).map((interest) =>
    String(interest).trim().toLowerCase(),
  );

  const hasInterestPreferences = normalizedInterests.length > 0;

  const recommendedSubjects =
    filter === "all"
      ? availableSubjects
      : availableSubjects.filter((subject) => {
          const tags = subject.interestTags ?? [];

          // If no interests are set yet, keep recommendations usable.
          if (!hasInterestPreferences) {
            return true;
          }

          return tags.some((tag) =>
            normalizedInterests.includes(String(tag).trim().toLowerCase()),
          );
        });

  const completedSessions = countCompletedSessions(state.curriculum);

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="grid gap-6 rounded-4xl border border-brand/15 bg-white/70 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:grid-cols-[1.5fr_0.9fr] md:p-8">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-sky/35 px-3 py-1 font-ui text-[0.7rem] tracking-[0.14em] text-brand">
              Learn
            </span>
            <div className="space-y-3">
              <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-brand">
                Build a path that feels worth returning to.
              </h1>
              <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
                Pick one subject, move through short guided sessions, and let
                your progress reflect real work instead of time spent on a feed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {state.user?.learningStyle ? (
                <span className="rounded-full border border-brand/15 px-4 py-2 font-body text-sm text-brand/75">
                  Learning style:{" "}
                  <strong>
                    {LEARNING_STYLE_LABELS[state.user.learningStyle]}
                  </strong>
                </span>
              ) : null}
              {state.user?.interests?.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-brand/12 px-4 py-2 font-body text-sm text-brand/70"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            <StatCard label="Active paths" value={state.curriculum.length} />
            <StatCard label="Sessions finished" value={completedSessions} />
            <StatCard
              label="Reflections saved"
              value={
                (state.reflections.visionBoards?.length ?? 0) +
                (state.reflections.letters?.length ?? 0)
              }
            />
          </div>
        </header>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-ui text-3xl text-brand">Current Paths</h2>
              <p className="font-body text-sm text-brand/72">
                Resume the next session or review what you have already
                finished.
              </p>
            </div>
          </div>

          {currentSubjects.length === 0 ? (
            <EmptyPanel
              title="No learning paths yet"
              copy="Choose one subject below to set a target date, start your first session, and build momentum."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {currentSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  enrollment={enrolledBySubjectId.get(subject.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section id="subject-library" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-ui text-3xl text-brand">Subject Library</h2>
              <p className="font-body text-sm text-brand/72">
                Start with recommendations based on your interests, or browse
                the full library.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                fullWidth={false}
                variant={filter === "recommended" ? "primary" : "secondary"}
                onClick={() => setFilter("recommended")}
              >
                Recommended
              </Button>
              <Button
                size="sm"
                fullWidth={false}
                variant={filter === "all" ? "primary" : "secondary"}
                onClick={() => setFilter("all")}
              >
                All Subjects
              </Button>
            </div>
          </div>

          {recommendedSubjects.length === 0 ? (
            <EmptyPanel
              title="No direct matches yet"
              copy="Your interests are saved, but none of the remaining subjects line up exactly. Browse the full library to pick the next useful path."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendedSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-3xl border border-brand/12 bg-page p-5">
    <p className="font-body text-sm text-brand/70">{label}</p>
    <p className="mt-2 font-display text-5xl leading-none text-brand">
      {value}
    </p>
  </div>
);

const EmptyPanel = ({ title, copy }) => (
  <div className="rounded-4xl border border-dashed border-brand/25 bg-page p-8 text-center">
    <h3 className="font-ui text-2xl text-brand">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-relaxed text-brand/72">
      {copy}
    </p>
  </div>
);
