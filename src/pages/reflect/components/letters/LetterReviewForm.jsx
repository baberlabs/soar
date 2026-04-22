import { Button } from "../../../../components/Button";
import { FormError } from "../shared/FormError";

export const LetterReviewForm = ({
  form,
  error,
  onFieldChange,
  onSubmit,
  onCancel,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-2xl border border-brand/15 bg-page/80 p-4"
    >
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/60">
        Month review
      </p>

      <ReviewTextarea
        id="review-what-happened"
        label="What actually happened this month?"
        value={form.whatHappened}
        onChange={(value) => onFieldChange("whatHappened", value)}
        placeholder="The shape of the month, in your own words."
      />

      <ReviewTextarea
        id="review-what-changed"
        label="What changed in your thinking or behaviour?"
        value={form.whatChanged}
        onChange={(value) => onFieldChange("whatChanged", value)}
        placeholder="Any shifts — subtle or seismic."
      />

      <ReviewTextarea
        id="review-carry-forward"
        label="What will you carry into next month?"
        value={form.carryForward}
        onChange={(value) => onFieldChange("carryForward", value)}
        placeholder="One habit, belief, or intention to take with you."
      />

      <FormError message={error} />

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Save review"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          text="Cancel"
          onClick={onCancel}
        />
      </div>
    </form>
  );
};

const ReviewTextarea = ({ id, label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="font-body text-sm text-brand/70">
      {label} <span className="text-rose-500">*</span>
    </label>
    <textarea
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows="3"
      className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-sm text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
    />
  </div>
);
