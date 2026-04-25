import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { Button } from "../../../components/Button";

export const FlashcardsStep = ({ flashcards, onContinue }) => {
  const [index, setIndex] = useState(0);
  const [isBack, setIsBack] = useState(false);
  const [seenBacks, setSeenBacks] = useState(new Set());

  const total = flashcards.length;
  const card = flashcards[index];
  const isLast = index === total - 1;
  const allSeen = seenBacks.size === total;

  const flip = () => {
    const next = !isBack;
    setIsBack(next);
    if (next) {
      setSeenBacks((prev) => new Set([...prev, index]));
    }
  };

  const goPrev = () => {
    if (index === 0) return;
    setIndex(index - 1);
    setIsBack(false);
  };

  const goNext = () => {
    if (isLast) return;
    setIndex(index + 1);
    setIsBack(false);
  };

  return (
    <section className="space-y-6 rounded-4xl border border-brand/12 bg-page p-6 md:p-8">
      <header className="space-y-1">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
          Step 2 of 5
        </p>
        <h2 className="font-ui text-3xl text-brand">Flashcards</h2>
        <p className="font-body text-sm text-brand/72">
          Tap each card to flip it. View every back to continue to the quiz.
        </p>
      </header>

      <div className="space-y-3">
        <p className="font-body text-xs text-brand/55">
          Card {index + 1} of {total} · {seenBacks.size} of {total} seen
        </p>

        <button
          type="button"
          onClick={flip}
          aria-label={isBack ? "Show question side" : "Show answer side"}
          className="block w-full cursor-pointer perspective-distant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-4xl"
        >
          <div
            className={`relative h-64 w-full transition-transform duration-500 transform-3d ${
              isBack ? "transform-[rotateY(180deg)]" : ""
            }`}
          >
            {/* Front face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-4xl border border-brand/15 bg-cream p-6 text-center backface-hidden">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
                {card.frontLabel ?? "Term"}
              </p>
              <p className="font-display text-3xl leading-tight text-brand md:text-4xl">
                {card.front}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 font-body text-xs text-brand/55">
                <RotateCw size={12} strokeWidth={2} />
                Tap to reveal
              </p>
            </div>

            {/* Back face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-4xl border border-brand/15 bg-sky/15 p-6 text-center backface-hidden transform-[rotateY(180deg)]">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
                {card.backLabel ?? "Answer"}
              </p>
              <p className="font-body text-base leading-relaxed text-brand/85 md:text-lg">
                {card.back}
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-5">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            onClick={goPrev}
            disabled={index === 0}
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Previous
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            onClick={goNext}
            disabled={isLast}
          >
            Next
            <ChevronRight size={16} strokeWidth={2} />
          </Button>
        </div>

        <Button
          type="button"
          fullWidth={false}
          text="Done"
          onClick={onContinue}
          disabled={!allSeen}
          title={
            allSeen
              ? "Continue to the quiz"
              : "View every card's answer side to continue"
          }
        />
      </div>
    </section>
  );
};
