import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { getButtonClasses } from "../../components/buttonStyles";
import { InputField } from "../../components/InputField";
import { ProgressBar } from "../../components/ProgressBar";
import { getSubjectById } from "../../data/subjects";
import { useSOARState } from "../../hooks/useSOARState";

export const SubjectRoom = () => {
  const { subjectId } = useParams();
  const [state, dispatch] = useSOARState();
  const [targetDate, setTargetDate] = useState("");
  const [learningNotes, setLearningNotes] = useState("");
  const [status, setStatus] = useState("idle");

  const subject = getSubjectById(subjectId, state.subjects);
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

  const handleEnroll = async (event) => {
    event.preventDefault();
    setStatus("loading");

    dispatch({
      type: "ADD_CURRICULUM_SUBJECT",
      payload: {
        subjectId: subject.id,
        targetDate,
        learningNotes,
        learningStyle: state.user?.learningStyle ?? "general",
      },
    });

    setStatus("success");
    setTimeout(() => setStatus("idle"), 600);
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-4">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 font-ui text-sm tracking-[0.08em] text-brand/70 hover:text-brand"
          >
            ← Back to library
          </Link>

          <header className="grid gap-6 rounded-4xl border border-brand/15 bg-white/70 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:grid-cols-[1.4fr_0.9fr] md:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky/35 px-3 py-1 font-ui text-[0.7rem] tracking-[0.14em] text-brand">
                  {subject.commitment}
                </span>
                {subject.interestTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand/12 px-3 py-1 font-body text-xs text-brand/72"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-[clamp(2.7rem,7vw,5rem)] leading-[0.94] text-brand">
                  {subject.name}
                </h1>
                <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
                  {subject.description}
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3">
                {subject.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="rounded-2xl border border-brand/12 bg-page px-4 py-3 font-body text-sm text-brand/76"
                  >
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-3xl border border-brand/12 bg-page p-5">
              {enrollment ? (
                <div className="space-y-4">
                  <div>
                    <p className="font-body text-sm text-brand/70">
                      Your progress
                    </p>
                    <p className="mt-1 font-ui text-3xl text-brand">
                      {enrollment.progress}% complete
                    </p>
                  </div>

                  <ProgressBar
                    value={enrollment.progress}
                    label={`${completedCount} of ${subject.lessons.length} sessions done`}
                  />

                  {enrollment.targetDate ? (
                    <p className="font-body text-sm text-brand/72">
                      Target date: <strong>{enrollment.targetDate}</strong>
                    </p>
                  ) : null}

                  {enrollment.learningNotes ? (
                    <div className="rounded-2xl border border-brand/12 bg-white px-4 py-3">
                      <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
                        Your note
                      </p>
                      <p className="mt-2 font-body text-sm text-brand/75">
                        {enrollment.learningNotes}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <form onSubmit={handleEnroll} className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-ui text-2xl text-brand">
                      Start this path
                    </h2>
                    <p className="font-body text-sm leading-relaxed text-brand/72">
                      Set a gentle target, add a note if it helps, and unlock
                      the first session.
                    </p>
                  </div>

                  <InputField
                    label="Target date"
                    type="date"
                    name="target-date"
                    value={targetDate}
                    onValueChange={setTargetDate}
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
                      value={learningNotes}
                      onChange={(event) => setLearningNotes(event.target.value)}
                      rows="4"
                      placeholder="What do you want to get from this subject?"
                      className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/15"
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
          </header>
        </div>

        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="font-ui text-3xl text-brand">Sessions</h2>
            <p className="font-body text-sm text-brand/72">
              Open each session in its own learning page with content,
              highlighted facts, and a quick check-in quiz.
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
                  to="/reflect"
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
      </div>
    </main>
  );
};

const STATUS_STYLES = {
  complete: {
    badge: "bg-sage/18 text-sage",
    panel: "border-sage/28 bg-sage/8",
    label: "Completed",
  },
  current: {
    badge: "bg-sky/35 text-brand",
    panel: "border-brand/18 bg-white",
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
    <article className={`rounded-[1.75rem] border p-5 ${style.panel}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 font-ui text-[0.7rem] tracking-[0.12em] ${style.badge}`}
            >
              Session {lesson.number}
            </span>
            <span className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
              {style.label}
            </span>
          </div>
          <h3 className="font-ui text-2xl text-brand">{lesson.title}</h3>
          <p className="font-body text-sm leading-relaxed text-brand/78">
            {lesson.summary}
          </p>
        </div>

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

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-brand/10 bg-page/70 p-4">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
            Practice
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/78">
            {lesson.activity}
          </p>
        </div>
        <div className="rounded-2xl border border-brand/10 bg-page/70 p-4">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
            Reflection prompt
          </p>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/78">
            {lesson.reflectionPrompt}
          </p>
        </div>
      </div>
    </article>
  );
};
