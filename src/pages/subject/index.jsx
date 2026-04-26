import { Link, Navigate, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { getButtonClasses } from "../../components/buttonStyles";
import { InputField } from "../../components/InputField";
import { ProgressBar } from "../../components/ProgressBar";
import { getSubjectById } from "../../data/subjects";
import { useSOARDispatch, useSOARState } from "../../store";
import { useEnrollment } from "./hooks/useEnrollment";
import Page from "../../layout/Page";

export default function SubjectRoom() {
  const { subjectId } = useParams();
  const state = useSOARState();
  const dispatch = useSOARDispatch();

  const subject = getSubjectById(subjectId, state.subjects);
  const { form, setField, submit, status } = useEnrollment({
    subject,
    dispatch,
    user: state.user,
  });
  const enrollment = state.curriculum.find(
    (entry) => entry.subjectId === subjectId,
  );

  const completedLessonIds = enrollment?.completedLessonIds ?? [];
  const completedCount = completedLessonIds.length;
  const lessonCards = subject
    ? subject.lessons.map((lesson, index) => {
        const isComplete = completedLessonIds.includes(lesson.id);
        const isCurrent = !isComplete && index === completedCount;

        return {
          ...lesson,
          status: isComplete ? "complete" : isCurrent ? "current" : "upcoming",
          number: index + 1,
        };
      })
    : [];

  if (!subject) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Page
      heading={subject.name}
      description={subject.description}
      contentClassName="mx-auto space-y-6"
    >
      <div className="grid gap-6 sm:rounded-4xl sm:border sm:border-brand/15p-6 sm:shadow-[0_24px_48px_rgba(75,81,149,0.08)] sm:backdrop-blur-sm md:grid-cols-[1.4fr_0.9fr] md:p-8">
        <div className="space-y-4">
          <div className="relative -mx-6 sm:mx-0">
            {/* Left fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-page to-transparent opacity-0 group-has-scroll-left:opacity-100 sm:hidden" />

            {/* Right fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-page to-transparent opacity-100 group-has-scroll-right:opacity-0 sm:hidden" />

            <div className="flex items-center gap-2 overflow-x-auto px-6 sm:px-0 no-scrollbar">
              {/* Primary chip (commitment) */}
              <span className="shrink-0 inline-flex items-center rounded-full bg-brand/10 px-3 py-1.5 font-ui text-[0.65rem] font-medium tracking-[0.12em] text-brand">
                {subject.commitment}
              </span>

              {/* Secondary chips (tags) */}
              {subject.interestTags.map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 inline-flex items-center rounded-full bg-muted px-3 py-1.5 font-body text-xs font-medium text-foreground/80"
                >
                  {tag}
                </span>
              ))}

              {subject.interestTags.length > 5 && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  +{subject.interestTags.length - 5}
                </span>
              )}
            </div>
          </div>

          <ul className="grid gap-2.5 sm:grid-cols-2">
            {subject.outcomes.map((outcome, i) => (
              <li
                key={outcome}
                className="flex items-start gap-3 rounded-xl bg-muted/60 px-4 py-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[0.7rem] font-semibold text-brand">
                  {i + 1}
                </span>

                <p className="font-body text-sm leading-relaxed text-foreground/85">
                  {outcome}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-3xl border border-brand/12 bg-page p-5">
          {enrollment ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-brand/55">
                    Your progress
                  </p>
                </div>

                <span className="text-xs font-medium text-brand/60">
                  {completedCount}/{subject.lessons.length}
                </span>
              </div>

              {/* Progress */}
              <ProgressBar value={enrollment.progress} />

              {/* Meta */}
              {(enrollment.targetDate || enrollment.learningNotes) && (
                <div className="space-y-3 pt-1">
                  {enrollment.targetDate && (
                    <p className="text-sm text-brand/70">
                      <span className="text-brand/55">Target</span>{" "}
                      <span className="font-medium text-brand">
                        {new Date(enrollment.targetDate).toLocaleDateString()}
                      </span>
                    </p>
                  )}

                  {enrollment.learningNotes && (
                    <div className="rounded-xl bg-muted/60 px-3 py-2.5">
                      <p className="text-[0.65rem] uppercase tracking-[0.12em] text-brand/55">
                        Note
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                        {enrollment.learningNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <h2 className="font-ui text-2xl text-brand">Start this path</h2>
                <p className="font-body text-sm leading-relaxed text-brand/72">
                  Set a gentle target, add a note if it helps, and unlock the
                  first session.
                </p>
              </div>

              <InputField
                label="Target date"
                type="date"
                name="target-date"
                value={form.targetDate}
                onValueChange={(value) => setField("targetDate", value)}
                required={false}
              />

              <div className="space-y-2">
                <label
                  htmlFor="learning-note"
                  className="font-body text-sm text-navy/70"
                >
                  Why this path matters to you
                </label>
                <textarea
                  id="learning-note"
                  value={form.learningNotes}
                  onChange={(event) =>
                    setField("learningNotes", event.target.value)
                  }
                  rows="4"
                  placeholder="What do you want to get from this subject?"
                  className="w-full rounded-2xl border border-black/15 px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </div>

              <Button
                type="submit"
                status={status}
                loadingText="Setting up..."
                text="Start This Path"
              />
            </form>
          )}
        </aside>
      </div>

      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="font-ui text-3xl text-brand">Sessions</h2>
          <p className="font-body text-sm text-brand/72">
            Open each session in its own learning page with content, highlighted
            facts, and a quick check-in quiz.
          </p>
        </div>

        <div className="space-y-4">
          {lessonCards.map((lesson) => (
            <LessonCard
              key={lesson.id}
              subjectId={subject.id}
              lesson={lesson}
              canOpen={
                Boolean(enrollment) &&
                (lesson.status === "current" || lesson.status === "complete")
              }
            />
          ))}
        </div>
      </section>

      {enrollment?.progress === 100 ? (
        <section className="rounded-4xl border border-sage/35 bg-sage/12 p-6">
          <div className="space-y-3">
            <p className="font-ui text-sm tracking-[0.12em] text-sage">
              Path complete
            </p>
            <h2 className="font-display text-4xl leading-[0.95] text-brand">
              You finished the core sessions.
            </h2>
            <p className="max-w-3xl font-body text-sm leading-relaxed text-brand/75">
              Capture what you made, save a reflection, or revisit any session
              if you want to deepen the work.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/create?subject=${subject.id}`}
                className={getButtonClasses({
                  variant: "primary",
                  size: "md",
                  fullWidth: false,
                })}
              >
                Share A Creation
              </Link>
              <Link
                to="/vision-board"
                className={getButtonClasses({
                  variant: "secondary",
                  size: "md",
                  fullWidth: false,
                })}
              >
                Save A Reflection
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </Page>
  );
}

const STATUS_STYLES = {
  complete: {
    badge: "bg-sage/18 text-sage",
    panel: "border-sage/28 bg-sage/8",
    label: "Completed",
  },
  current: {
    badge: "bg-sky/35 text-brand",
    panel: "border-brand/18 bg-brand/10",
    label: "Current",
  },
  upcoming: {
    badge: "bg-brand/8 text-brand/65",
    panel: "border-brand/12 bg-page",
    label: "Upcoming",
  },
};
const LessonCard = ({ subjectId, lesson, canOpen }) => {
  const style = STATUS_STYLES[lesson.status];
  const sessionLink = `/learn/${subjectId}/sessions/${lesson.id}`;

  return (
    <article
      className={`rounded-3xl border border-brand/12 p-5 ${style.panel}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.65rem] font-medium tracking-widest ${style.badge}`}
            >
              {lesson.number}
            </span>

            <span className="text-[0.65rem] uppercase tracking-[0.12em] text-brand/55">
              {style.label}
            </span>
          </div>

          <h3 className="font-ui text-xl leading-tight text-brand">
            {lesson.title}
          </h3>

          <p className="max-w-xl text-sm leading-relaxed text-brand/75">
            {lesson.summary}
          </p>
        </div>

        <div className="md:pt-1">
          {canOpen ? (
            <Link
              to={sessionLink}
              className={getButtonClasses({
                variant: "primary",
                size: "sm",
                fullWidth: false,
              })}
            >
              Open Session
            </Link>
          ) : (
            <Button size="sm" fullWidth={false} disabled text="Locked" />
          )}
        </div>
      </div>
    </article>
  );
};
