import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";

const MIN_REFLECTION_CHARS = 50;

export const ReflectionStep = ({
  prompt,
  existingReflection,
  onSave,
  onContinue,
}) => {
  const [text, setText] = useState(existingReflection?.content ?? "");
  const [status, setStatus] = useState("idle");

  // Keep the textarea in sync when the persisted reflection updates.
  useEffect(() => {
    setText(existingReflection?.content ?? "");
    setStatus("idle");
  }, [existingReflection]);

  const trimmedLength = text.trim().length;
  const meetsMinimum = trimmedLength >= MIN_REFLECTION_CHARS;
  const hasSavedReflection =
    (existingReflection?.content?.trim().length ?? 0) >= MIN_REFLECTION_CHARS;

  const save = () => {
    if (!meetsMinimum) return;
    setStatus("loading");
    onSave(text.trim());
    setStatus("success");
    window.setTimeout(() => setStatus("idle"), 1100);
  };

  return (
    <section className="space-y-6 sm:rounded-4xl sm:border sm:border-brand/12 sm:bg-page sm:p-6 md:p-8">
      <header className="space-y-1">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
          Step 4 of 5
        </p>
        <h2 className="font-ui text-3xl text-brand">Reflection</h2>
      </header>

      <div className="rounded-3xl border border-brand/12 bg-cream/80 p-5">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
          Reflection prompt
        </p>
        <p className="mt-2 font-body text-base leading-relaxed text-brand/82">
          {prompt}
        </p>
      </div>

      <div>
        <label
          htmlFor="lesson-reflection"
          className="block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
        >
          Your reflection
          <span className="ml-1 text-brand/45">(required)</span>
        </label>
        <textarea
          id="lesson-reflection"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          aria-describedby="lesson-reflection-counter"
          placeholder="Write a short reflection from this session..."
          className="mt-2 min-h-32 w-full rounded-2xl border border-brand/16 bg-cream px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
        />
        <p
          id="lesson-reflection-counter"
          className={`mt-2 font-body text-xs ${
            meetsMinimum ? "text-sage" : "text-brand/55"
          }`}
          aria-live="polite"
        >
          {trimmedLength} / {MIN_REFLECTION_CHARS} characters
          {meetsMinimum ? " · ready to save" : " minimum"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-brand/10 pt-5">
        <Button
          type="button"
          variant="secondary"
          fullWidth={false}
          text="Save Reflection"
          loadingText="Saving reflection..."
          status={status}
          onClick={save}
          disabled={!meetsMinimum}
        />
        <Button
          type="button"
          fullWidth={false}
          text="Continue to challenge"
          onClick={onContinue}
          disabled={!hasSavedReflection}
        />
        {existingReflection?.savedAt ? (
          <p className="font-body text-xs text-brand/62">
            Last saved {new Date(existingReflection.savedAt).toLocaleString()}
          </p>
        ) : null}
      </div>
    </section>
  );
};
