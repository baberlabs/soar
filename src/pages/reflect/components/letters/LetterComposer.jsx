import { Button } from "../../../../components/Button";
import { FormError } from "../shared/FormError";

export const LetterComposer = ({
  form,
  error,
  onFieldChange,
  onSaveDraft,
  onSeal,
  onStartNew,
  onClearError,
  onRequestSeal,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSaveDraft();
  };

  const handleSeal = () => {
    onRequestSeal(onSeal);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-brand/20 bg-cream/80 p-6 shadow-[0_18px_50px_rgba(55,62,112,0.06)]"
    >
      <header>
        <h2 className="font-ui text-2xl text-brand">
          {form.activeLetterId ? "Edit your letter" : "Write your letter"}
        </h2>
        <p className="mt-1 font-body text-sm text-brand/65">
          Write one letter to next month's you. Seal it, then open it when
          you're ready.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="letter-body"
          className="font-body text-sm text-brand/70"
        >
          Letter <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="letter-body"
          value={form.letter}
          onChange={(event) => onFieldChange("letter", event.target.value)}
          placeholder="Dear next-month me..."
          rows="10"
          className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <FormError message={error} onDismiss={onClearError} />

      <div className="flex flex-wrap gap-2 border-t border-brand/12 pt-4">
        <Button
          type="submit"
          variant="secondary"
          size="md"
          fullWidth={false}
          text="Save draft"
        />
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth={false}
          text="Seal letter"
          onClick={handleSeal}
        />
        {form.activeLetterId ? (
          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth={false}
            text="Start over"
            onClick={onStartNew}
          />
        ) : null}
      </div>
    </form>
  );
};
