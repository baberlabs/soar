import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/Button";
import { SubjectCard } from "../../components/SubjectCard";
import { useSOARState } from "../../store";
import { LEARNING_STYLE_LABELS } from "../../data/subjects";
import Page from "../../layout/Page";
import { ChevronRight, Sparkles } from "lucide-react";

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
    <Page
      heading="Learn"
      description="Resume your current curriculum, browse recommended subjects, and choose the next path."
      contentClassName="mx-auto space-y-6"
    >
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8">
        {state.user?.learningStyle && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand">
            <span className="opacity-60">Style</span>
            <span className="font-semibold">
              {LEARNING_STYLE_LABELS[state.user.learningStyle]}
            </span>
          </span>
        )}

        {state.user?.interests?.map((interest) => (
          <span
            key={interest}
            className="shrink-0 inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80"
          >
            {interest}
          </span>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-ui text-3xl text-brand">Your Curriculum</h2>
            <p className="font-body text-sm text-brand/72">
              Resume the next session or review what you have already finished.
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
              Start with recommendations based on your interests, or browse the
              full library.
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
    </Page>
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
      className="flex items-center gap-1 rounded-full border border-brand/20 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/40 hover:bg-brand/5"
    >
      Open the Forum
      <ChevronRight className="size-4" aria-hidden="true" />
    </Link>
  </div>
);
