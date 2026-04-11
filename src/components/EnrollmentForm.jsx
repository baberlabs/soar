import { useState } from "react";
import { Button } from "./Button";
import { InputField } from "./InputField";

export function EnrollmentForm({ subject, learningStyle, onEnroll, onCancel }) {
  const [targetDate, setTargetDate] = useState("");
  const [learningNotes, setLearningNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetDate.trim()) {
      alert("Please set a target completion date");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onEnroll({
        subjectId: subject.id,
        title: subject.name,
        targetDate,
        learningNotes,
        progress: 0,
        learningStyle: learningStyle || "general",
      });
      setIsLoading(false);
      setTargetDate("");
      setLearningNotes("");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="max-h-screen w-full max-w-md overflow-y-auto rounded-lg bg-cream p-8 shadow-xl">
        <h2 className="font-display mb-2 text-3xl text-navy">{subject.name}</h2>
        <p className="font-body mb-6 text-sm text-brand/80">
          {subject.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {learningStyle && (
            <div className="rounded-lg bg-brand/10 p-4">
              <p className="font-ui text-xs uppercase tracking-widest text-brand">
                Your Learning Style
              </p>
              <p className="font-body mt-1 text-sm text-navy">
                Tailored content for {learningStyle}
              </p>
            </div>
          )}

          <InputField
            label="Target Completion Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />

          <div>
            <label className="font-ui block text-sm text-navy">
              Learning Notes (Optional)
            </label>
            <textarea
              value={learningNotes}
              onChange={(e) => setLearningNotes(e.target.value)}
              placeholder="What are your goals for this subject?"
              className="mt-2 w-full rounded-lg border border-navy/20 bg-page px-4 py-2 font-body text-sm text-navy placeholder-brand/50 focus:border-brand focus:outline-none"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              {isLoading ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
