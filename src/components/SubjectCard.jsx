import { Link } from "react-router-dom";
import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";
import { getButtonClasses } from "./buttonStyles";

/**
 * Single, reusable card for a subject. Two visual modes:
 *
 *   - Enrolled: progress bar, "X of Y sessions", target date if set,
 *     Continue CTA that jumps directly to the next incomplete session.
 *   - Library: one-line description, session count, interest tags,
 *     View Path CTA that opens the subject overview.
 *
 * Both modes share the same card chrome so the grid stays uniform.
 *
 * Used by Learn (curriculum + library) and Dashboard (curriculum widget).
 */
export function SubjectCard({
  subject,
  enrollment,
  isEnrolled,
  progress,
  onEnroll,
  onContinue,
}) {
  const enrolled = isEnrolled ?? Boolean(enrollment);
  const lessons = subject?.lessons ?? [];
  const totalSessions = lessons.length;
  const completedCount = enrollment?.completedLessonIds?.length ?? 0;
  const computedProgress =
    progress ??
    enrollment?.progress ??
    (totalSessions ? Math.round((completedCount / totalSessions) * 100) : 0);
  const hasLearnPath = totalSessions > 0;

  // The next incomplete session is the lesson at index = completedCount
  // (since lessons complete sequentially). If everything's done, fall
  // back to the subject overview (which renders the Capstone state).
  const nextLesson =
    enrolled && hasLearnPath ? (lessons[completedCount] ?? null) : null;
  const continueHref = nextLesson
    ? `/learn/${subject.id}/sessions/${nextLesson.id}`
    : `/learn/${subject.id}`;

  return (
    <div className="rounded-2xl border border-navy/20 bg-cream p-6 transition-all hover:border-navy/40 hover:shadow-md">
      <h3 className="font-ui mb-2 text-lg text-navy">{subject.name}</h3>
      <p className="font-body mb-4 text-sm text-brand/80">
        {subject.description}
      </p>

      {enrolled ? (
        <div className="space-y-3">
          <ProgressBar value={computedProgress} label="Progress" />

          <SubjectMeta
            enrolled
            totalSessions={totalSessions}
            completedCount={completedCount}
            targetDate={enrollment?.targetDate}
          />

          {hasLearnPath ? (
            <Link
              to={continueHref}
              className={getButtonClasses({ variant: "primary", size: "md" })}
            >
              {nextLesson ? "Continue" : "Review Path"}
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={onContinue}>
                Continue →
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {}}>
                Details
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <SubjectMeta
            totalSessions={totalSessions}
            interestTags={subject.interestTags}
          />

          {hasLearnPath ? (
            <Link
              to={`/learn/${subject.id}`}
              className={getButtonClasses({ variant: "secondary", size: "md" })}
            >
              View Path
            </Link>
          ) : (
            <Button onClick={onEnroll} className="w-full">
              Enroll
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Tiny presentational helper for the meta line(s) under the title.
 * Kept inside this file because it has zero use outside SubjectCard.
 */
const SubjectMeta = ({
  enrolled,
  totalSessions,
  completedCount,
  targetDate,
  interestTags,
}) => {
  if (enrolled) {
    if (!totalSessions) return null;
    return (
      <p className="font-body text-xs text-brand/65">
        {completedCount} of {totalSessions} session
        {totalSessions === 1 ? "" : "s"} complete
        {targetDate ? ` · target ${formatTargetDate(targetDate)}` : ""}
      </p>
    );
  }

  const tags = (interestTags ?? []).slice(0, 3);
  return (
    <div className="space-y-2">
      {totalSessions > 0 ? (
        <p className="font-body text-xs text-brand/65">
          {totalSessions} session{totalSessions === 1 ? "" : "s"}
        </p>
      ) : null}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand/12 px-2.5 py-0.5 font-body text-[0.68rem] text-brand/72"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const formatTargetDate = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};
