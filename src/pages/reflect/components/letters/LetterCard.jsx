import { Badge } from "../../../../components/Badge";
import { Button } from "../../../../components/Button";
import { LETTER_STATUS } from "../../constants";
import { formatMonthLabel } from "../../utils/month";
import { LetterReviewForm } from "./LetterReviewForm";

export const LetterCard = ({
  letter,
  reviewForm,
  reviewError,
  isReviewing,
  onEdit,
  onDelete,
  onArchive,
  onBeginReview,
  onCancelReview,
  onReviewFieldChange,
  onSubmitReview,
}) => {
  const canEdit = letter.effectiveStatus !== LETTER_STATUS.REVIEWED;
  const canReview =
    letter.effectiveStatus === LETTER_STATUS.UNLOCKED ||
    letter.effectiveStatus === LETTER_STATUS.REVIEWED;
  const canArchive = letter.effectiveStatus === LETTER_STATUS.REVIEWED;

  return (
    <article className="rounded-3xl border border-brand/20 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.06)]">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-ui text-xl text-brand">
            {formatMonthLabel(letter.targetMonth)}
          </h3>
          <p className="mt-1 font-body text-xs text-brand/60">
            {letter.statusLabel}
            {letter.sealBroken ? " · Seal was broken early" : ""}
          </p>
        </div>
        <Badge variant={letter.statusTone}>{letter.effectiveStatus}</Badge>
      </header>

      <div className="mt-4 rounded-2xl border border-brand/12 bg-page/70 p-4">
        <p className="font-ui text-xs uppercase tracking-[0.12em] text-brand/55">
          Letter
        </p>
        <p className="mt-1 whitespace-pre-line font-body text-sm leading-relaxed text-brand/82">
          {letter.noteToSelf || "No letter content yet."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-brand/12 pt-4">
        {canEdit ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            text="Edit"
            onClick={() => onEdit(letter)}
          />
        ) : null}
        {canReview ? (
          <Button
            type="button"
            variant="primary"
            size="sm"
            fullWidth={false}
            text={
              letter.effectiveStatus === LETTER_STATUS.REVIEWED
                ? "Edit review"
                : "Add review"
            }
            onClick={() => onBeginReview(letter)}
          />
        ) : null}
        {onArchive ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            fullWidth={false}
            text="Archive"
            onClick={() => onArchive(letter)}
            disabled={!canArchive}
          />
        ) : null}
        <Button
          type="button"
          variant="danger"
          size="sm"
          fullWidth={false}
          text="Delete"
          onClick={() => onDelete(letter)}
        />
      </div>

      {!canArchive ? (
        <p className="mt-2 font-body text-xs text-brand/60">
          Add your reflection to unlock archiving.
        </p>
      ) : null}

      {isReviewing ? (
        <LetterReviewForm
          form={reviewForm}
          error={reviewError}
          onFieldChange={onReviewFieldChange}
          onSubmit={onSubmitReview}
          onCancel={onCancelReview}
        />
      ) : null}

      {letter.review && !isReviewing ? (
        <div className="mt-4 rounded-2xl border border-brand/15 bg-page p-4">
          <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/60">
            Review
          </p>
          <div className="mt-2 space-y-2">
            <LetterField
              label="What happened"
              value={letter.review.whatHappened}
              small
              preserveLineBreaks
            />
            <LetterField
              label="What changed"
              value={letter.review.whatChanged}
              small
              preserveLineBreaks
            />
            <LetterField
              label="Carrying forward"
              value={letter.review.carryForward}
              small
              preserveLineBreaks
            />
          </div>
        </div>
      ) : null}
    </article>
  );
};

const LetterField = ({ label, value, preserveLineBreaks, small }) => (
  <div>
    <dt
      className={`font-ui uppercase tracking-[0.12em] text-brand/55 ${
        small ? "text-[0.62rem]" : "text-xs"
      }`}
    >
      {label}
    </dt>
    <dd
      className={`mt-0.5 font-body text-brand/82 ${
        small ? "text-xs" : "text-sm"
      } ${preserveLineBreaks ? "whitespace-pre-line" : ""}`}
    >
      {value}
    </dd>
  </div>
);
