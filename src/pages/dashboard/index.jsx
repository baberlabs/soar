import { useState } from "react";
import { useSOARState } from "../../hooks/useSOARState";
import { SubjectCard } from "../../components/SubjectCard";
import { EnrollmentForm } from "../../components/EnrollmentForm";
import { Button } from "../../components/Button";

export default function Dashboard() {
  const [state, dispatch] = useSOARState();
  const [enrollmentSubject, setEnrollmentSubject] = useState(null);
  const [filterInterests, setFilterInterests] = useState(false);

  if (!state.user) {
    return (
      <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="text-center text-brand">Not logged in</div>
      </main>
    );
  }

  const enrolledSubjectIds = state.curriculum.map((c) => c.subjectId);
  const enrolledSubjects = state.curriculum;
  const availableSubjects = state.subjects.filter(
    (s) => !enrolledSubjectIds.includes(s.id),
  );

  const displayAvailable = filterInterests
    ? availableSubjects.filter((s) =>
        state.user.interests.some((interest) =>
          s.name.toLowerCase().includes(interest.toLowerCase()),
        ),
      )
    : availableSubjects;

  const handleEnroll = (curriculumData) => {
    const curriculum = {
      id: `c${Date.now()}`,
      ...curriculumData,
    };

    dispatch({
      type: "ADD_CURRICULUM_SUBJECT",
      payload: curriculum,
    });

    setEnrollmentSubject(null);
  };

  const handleUpdateProgress = (subjectId, newProgress) => {
    dispatch({
      type: "UPDATE_CURRICULUM_PROGRESS",
      payload: { id: subjectId, progress: newProgress },
    });
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-4xl space-y-16">
        <section>
          <h1 className="font-display mb-2 text-5xl text-brand">
            Your Curriculum
          </h1>
          <p className="font-body text-base text-brand/80">
            {state.user.learningStyle &&
              `Learning style: ${state.user.learningStyle}`}
          </p>
        </section>

        {enrolledSubjects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-ui text-2xl text-navy">Currently Learning</h2>
              <span className="font-body text-sm text-brand/70">
                {enrolledSubjects.length} enrolled
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledSubjects.map((curriculum) => {
                const subject = state.subjects.find(
                  (s) => s.id === curriculum.subjectId,
                );
                return (
                  <div
                    key={curriculum.id}
                    className="rounded-lg border border-navy/20 bg-cream p-6"
                  >
                    <h3 className="font-ui mb-2 text-lg text-navy">
                      {subject.name}
                    </h3>
                    <p className="font-body mb-4 text-sm text-brand/80">
                      {subject.description}
                    </p>

                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-body text-xs text-brand/70">
                          Progress
                        </span>
                        <span className="font-body text-xs font-semibold text-navy">
                          {curriculum.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-navy/10">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${curriculum.progress}%`,
                            backgroundImage:
                              "linear-gradient(90deg, var(--color-brand), rgba(75, 81, 149, 0.7))",
                          }}
                        />
                      </div>
                    </div>

                    {curriculum.targetDate && (
                      <p className="font-body mb-4 text-xs text-brand/70">
                        Target: {curriculum.targetDate}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" size="sm" onClick={() => {}}>
                        Continue →
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateProgress(
                            curriculum.id,
                            Math.min(curriculum.progress + 10, 100),
                          )
                        }
                      >
                        +10%
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-ui text-2xl text-navy">Browse Subjects</h2>
            <div className="flex gap-2">
              <Button
                variant={filterInterests ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilterInterests(!filterInterests)}
              >
                {filterInterests ? "All Subjects" : "My Interests"}
              </Button>
            </div>
          </div>

          {displayAvailable.length === 0 ? (
            <div className="rounded-lg border border-navy/20 bg-cream p-12 text-center">
              <p className="font-body text-brand/80">
                {filterInterests
                  ? "No subjects match your interests. Try browsing all subjects."
                  : "No more subjects available to enroll in!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayAvailable.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  isEnrolled={false}
                  onEnroll={() => setEnrollmentSubject(subject)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {enrollmentSubject && (
        <EnrollmentForm
          subject={enrollmentSubject}
          learningStyle={state.user.learningStyle}
          onEnroll={handleEnroll}
          onCancel={() => setEnrollmentSubject(null)}
        />
      )}
    </main>
  );
}
