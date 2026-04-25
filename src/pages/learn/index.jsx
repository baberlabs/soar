import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/Button";
import { SubjectCard } from "../../components/SubjectCard";
import { useSOARState } from "../../store";
import { LEARNING_STYLE_LABELS } from "../../data/subjects";

export default function Learn() {
  const state = useSOARState();
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

  const librarySubjects =
    filter === "all"
      ? availableSubjects
      : availableSubjects.filter((subject) => {
          const tags = subject.interestTags ?? [];
          // Without interest preferences, recommendations stay usable
          // by showing everything rather than an empty grid.
          if (!hasInterestPreferences) return true;
          return tags.some((tag) =>
            normalizedInterests.includes(String(tag).trim().toLowerCase()),
          );
        });

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-4 rounded-4xl border border-brand/15 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-8">
          <span className="inline-flex items-center rounded-full bg-sky/35 px-3 py-1 font-ui text-[0.7rem] tracking-[0.14em] text-brand">
            Learn
          </span>
          <div className="space-y-3">
            <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-brand">
              Build a path that feels worth returning to.
            </h1>
            <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
              Pick one subject, move through short guided sessions, and let your
              progress reflect real work instead of time spent on a feed.
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
        </header>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-ui text-3xl text-brand">Your Curriculum</h2>
              <p className="font-body text-sm text-brand/72">
                Resume the next session or review what you have already
                finished.
              </p>
            </div>
          </div>

          {currentSubjects.length === 0 ? (
            <EmptyPanel
              title="Your curriculum is empty"
              copy="Choose a subject below to begin."
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
            <div
              role="tablist"
              aria-label="Subject library filter"
              className="flex flex-wrap gap-2"
            >
              <Button
                size="sm"
                fullWidth={false}
                variant={filter === "recommended" ? "primary" : "secondary"}
                onClick={() => setFilter("recommended")}
                role="tab"
                aria-selected={filter === "recommended"}
              >
                Recommended
              </Button>
              <Button
                size="sm"
                fullWidth={false}
                variant={filter === "all" ? "primary" : "secondary"}
                onClick={() => setFilter("all")}
                role="tab"
                aria-selected={filter === "all"}
              >
                All Subjects
              </Button>
            </div>
          </div>

          {librarySubjects.length === 0 ? (
            <EmptyPanel
              title="No direct matches yet"
              copy="Your interests are saved, but none of the remaining subjects line up exactly. Switch to All Subjects to browse everything."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {librarySubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}

          <SubjectRequestCallout />
        </section>
      </div>
    </main>
  );
}

const EmptyPanel = ({ title, copy }) => (
  <div className="rounded-4xl border border-dashed border-brand/25 bg-page p-8 text-center">
    <h3 className="font-ui text-2xl text-brand">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-relaxed text-brand/72">
      {copy}
    </p>
  </div>
);

const SubjectRequestCallout = () => (
  <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-brand/15 bg-cream/60 px-6 py-5">
    <p className="font-body text-sm leading-relaxed text-brand/82 md:text-base">
      Don&rsquo;t see what you&rsquo;re looking for?{" "}
      <span className="text-brand">Vote for the next subject to be added.</span>
    </p>
    <Link
      to="/forum/all"
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand/20 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/40 hover:bg-brand/5"
    >
      Open the Forum
      <span aria-hidden="true">→</span>
    </Link>
  </div>
);
