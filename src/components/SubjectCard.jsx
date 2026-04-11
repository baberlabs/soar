import { Button } from "./Button";
import { Link } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { getButtonClasses } from "./buttonStyles";

export function SubjectCard({
  subject,
  enrollment,
  isEnrolled,
  progress,
  onEnroll,
  onContinue,
}) {
  const enrolled = isEnrolled ?? Boolean(enrollment);
  const computedProgress =
    progress ??
    enrollment?.progress ??
    (subject?.lessons?.length
      ? Math.round(
          ((enrollment?.completedLessonIds?.length ?? 0) /
            subject.lessons.length) *
            100,
        )
      : 0);
  const hasLearnPath =
    Array.isArray(subject?.lessons) && subject.lessons.length > 0;

  return (
    <div className="rounded-2xl border border-navy/20 bg-cream p-6 transition-all hover:border-navy/40 hover:shadow-md">
      <h3 className="font-ui mb-2 text-lg text-navy">{subject.name}</h3>
      <p className="font-body mb-4 text-sm text-brand/80">
        {subject.description}
      </p>

      {enrolled ? (
        <div className="space-y-3">
          <ProgressBar value={computedProgress} label="Progress" />

          {hasLearnPath ? (
            <Link
              to={`/learn/${subject.id}`}
              className={getButtonClasses({ variant: "primary", size: "md" })}
            >
              Continue Path
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
      ) : hasLearnPath ? (
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
  );
}
