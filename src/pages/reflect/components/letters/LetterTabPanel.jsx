import { useMemo, useState } from "react";
import { Button } from "../../../../components/Button";
import { LETTER_STATUS } from "../../constants";
import { isMonthUnlocked } from "../../utils/month";
import { LetterComposer } from "./LetterComposer";
import { LetterLibrary } from "./LetterLibrary";
import { SealedLetterCard } from "./SealedLetterCard";
import { LetterCard } from "./LetterCard";
import { EmptyLettersState } from "./EmptyLettersState";

export const LetterTabPanel = ({
  composer,
  onConfirmDelete,
  onConfirmSeal,
  onConfirmBreakSeal,
}) => {
  const [view, setView] = useState("active");

  const {
    letterForm,
    reviewForm,
    letterError,
    reviewError,
    letters,
    setLetterField,
    loadLetter,
    resetLetter,
    clearLetterError,
    saveDraft,
    seal,
    deleteLetter,
    breakSeal,
    archiveLetter,
    setReviewField,
    beginReview,
    cancelReview,
    saveReview,
  } = composer;

  const activeLetter = useMemo(
    () =>
      letters.find((letter) => letter.status !== LETTER_STATUS.ARCHIVED) ??
      null,
    [letters],
  );

  const archivedLetters = useMemo(
    () => letters.filter((letter) => letter.status === LETTER_STATUS.ARCHIVED),
    [letters],
  );

  const hideComposerUntilTargetMonth =
    !!activeLetter &&
    !isMonthUnlocked(activeLetter.targetMonth) &&
    activeLetter.effectiveStatus === LETTER_STATUS.SEALED;
  const shouldShowComposer =
    !activeLetter || activeLetter.effectiveStatus === LETTER_STATUS.DRAFT;

  const handleDelete = (letter) =>
    onConfirmDelete({
      title: "Delete this letter?",
      message: letter.noteToSelf
        ? `This will permanently remove your letter: "${letter.noteToSelf.slice(0, 60)}${letter.noteToSelf.length > 60 ? "..." : ""}".`
        : "This will permanently remove this letter.",
      confirmText: "Delete letter",
      tone: "danger",
      onConfirm: () => deleteLetter(letter.id),
    });

  const handleBreakSeal = (letter) =>
    onConfirmBreakSeal({
      onConfirm: () => breakSeal(letter.id),
    });

  const handleArchive = (letter) => archiveLetter(letter);

  const handleRequestSeal = (afterConfirm) =>
    onConfirmSeal({
      onConfirm: afterConfirm,
    });

  return (
    <section
      id="reflect-panel-letters"
      role="tabpanel"
      aria-labelledby="reflect-tab-letters"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 sm:pb-4">
        <Button
          type="button"
          variant={view === "active" ? "primary" : "ghost"}
          size="sm"
          fullWidth={false}
          text="Current"
          onClick={() => setView("active")}
        />
        <Button
          type="button"
          variant={view === "archive" ? "primary" : "ghost"}
          size="sm"
          fullWidth={false}
          text={`Archive (${archivedLetters.length})`}
          onClick={() => setView("archive")}
        />
      </div>

      {view === "archive" ? (
        archivedLetters.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand/25 bg-page/80 p-8 text-center font-body text-sm text-brand/70">
            No archived letters yet.
          </div>
        ) : (
          <LetterLibrary
            letters={archivedLetters}
            reviewForm={reviewForm}
            reviewError={reviewError}
            onEdit={loadLetter}
            onDelete={handleDelete}
            onBreakSeal={handleBreakSeal}
            onArchive={undefined}
            onBeginReview={beginReview}
            onCancelReview={cancelReview}
            onReviewFieldChange={setReviewField}
            onSubmitReview={saveReview}
          />
        )
      ) : activeLetter ? (
        hideComposerUntilTargetMonth ? (
          activeLetter.effectiveStatus === LETTER_STATUS.SEALED ? (
            <SealedLetterCard
              letter={activeLetter}
              onBreakSeal={handleBreakSeal}
              onDelete={handleDelete}
            />
          ) : (
            <LetterCard
              letter={activeLetter}
              reviewForm={reviewForm}
              reviewError={reviewError}
              isReviewing={reviewForm.letterId === activeLetter.id}
              onEdit={loadLetter}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onBeginReview={beginReview}
              onCancelReview={cancelReview}
              onReviewFieldChange={setReviewField}
              onSubmitReview={saveReview}
            />
          )
        ) : !shouldShowComposer ? (
          activeLetter.effectiveStatus === LETTER_STATUS.SEALED ? (
            <SealedLetterCard
              letter={activeLetter}
              onBreakSeal={handleBreakSeal}
              onDelete={handleDelete}
            />
          ) : (
            <LetterCard
              letter={activeLetter}
              reviewForm={reviewForm}
              reviewError={reviewError}
              isReviewing={reviewForm.letterId === activeLetter.id}
              onEdit={loadLetter}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onBeginReview={beginReview}
              onCancelReview={cancelReview}
              onReviewFieldChange={setReviewField}
              onSubmitReview={saveReview}
            />
          )
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <LetterComposer
              form={letterForm}
              error={letterError}
              onFieldChange={setLetterField}
              onSaveDraft={saveDraft}
              onSeal={seal}
              onStartNew={resetLetter}
              onClearError={clearLetterError}
              onRequestSeal={handleRequestSeal}
            />

            {activeLetter.effectiveStatus === LETTER_STATUS.SEALED ? (
              <SealedLetterCard
                letter={activeLetter}
                onBreakSeal={handleBreakSeal}
                onDelete={handleDelete}
              />
            ) : (
              <LetterCard
                letter={activeLetter}
                reviewForm={reviewForm}
                reviewError={reviewError}
                isReviewing={reviewForm.letterId === activeLetter.id}
                onEdit={loadLetter}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onBeginReview={beginReview}
                onCancelReview={cancelReview}
                onReviewFieldChange={setReviewField}
                onSubmitReview={saveReview}
              />
            )}
          </div>
        )
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <LetterComposer
            form={letterForm}
            error={letterError}
            onFieldChange={setLetterField}
            onSaveDraft={saveDraft}
            onSeal={seal}
            onStartNew={resetLetter}
            onClearError={clearLetterError}
            onRequestSeal={handleRequestSeal}
          />
          <EmptyLettersState />
        </div>
      )}
    </section>
  );
};
