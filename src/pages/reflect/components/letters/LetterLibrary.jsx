import { LETTER_STATUS } from "../../constants";
import { EmptyLettersState } from "./EmptyLettersState";
import { LetterCard } from "./LetterCard";
import { SealedLetterCard } from "./SealedLetterCard";

export const LetterLibrary = ({
  letters,
  reviewForm,
  reviewError,
  onEdit,
  onDelete,
  onBreakSeal,
  onArchive,
  onBeginReview,
  onCancelReview,
  onReviewFieldChange,
  onSubmitReview,
}) => {
  if (letters.length === 0) {
    return <EmptyLettersState />;
  }

  return (
    <section className="space-y-4">
      {letters.map((letter) => {
        if (letter.effectiveStatus === LETTER_STATUS.SEALED) {
          return (
            <SealedLetterCard
              key={letter.id}
              letter={letter}
              onBreakSeal={onBreakSeal}
              onDelete={onDelete}
              onArchive={onArchive}
            />
          );
        }

        return (
          <LetterCard
            key={letter.id}
            letter={letter}
            reviewForm={reviewForm}
            reviewError={reviewError}
            isReviewing={reviewForm.letterId === letter.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onBeginReview={onBeginReview}
            onCancelReview={onCancelReview}
            onReviewFieldChange={onReviewFieldChange}
            onSubmitReview={onSubmitReview}
          />
        );
      })}
    </section>
  );
};
