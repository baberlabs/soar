import { useEffect, useState } from "react";
import { Badge } from "../../../../components/Badge";
import { Button } from "../../../../components/Button";
import { formatMonthLabel } from "../../utils/month";

export const SealedLetterCard = ({
  letter,
  onBreakSeal,
  onDelete,
  onArchive,
}) => (
  <SealedLetterShell
    letter={letter}
    onBreakSeal={onBreakSeal}
    onDelete={onDelete}
    onArchive={onArchive}
  />
);

const SealedLetterShell = ({ letter, onBreakSeal, onDelete, onArchive }) => {
  const [isBreaking, setIsBreaking] = useState(false);

  useEffect(() => {
    if (!isBreaking) return undefined;
    const timeoutId = setTimeout(() => {
      onBreakSeal(letter);
    }, 260);
    return () => clearTimeout(timeoutId);
  }, [isBreaking, letter, onBreakSeal]);

  const handleBreakSeal = () => {
    if (isBreaking) return;
    setIsBreaking(true);
  };

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-brand/20 bg-linear-to-br from-sky/20 via-cream to-lavender/15 p-6 shadow-[0_14px_36px_rgba(75,81,149,0.1)] transition duration-300 ${
        isBreaking ? "scale-[0.98] opacity-90" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-sky/25 blur-2xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-6 bottom-20 rounded-2xl border border-dashed border-brand/20"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h3 className="font-ui text-xl text-brand">
            {formatMonthLabel(letter.targetMonth)}
          </h3>
          <p className="mt-1 font-body text-xs text-brand/60">
            {letter.unlockHint}
          </p>
        </div>
        <Badge variant={letter.statusTone}>Sealed</Badge>
      </div>

      <div className="relative mt-8 text-center">
        <div className="relative mx-auto max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-page/85 px-4 pb-5 pt-7 shadow-[0_14px_30px_rgba(75,81,149,0.12)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-linear-to-b from-white/80 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-px left-1/2 h-20 w-20 -translate-x-1/2 rotate-45 border border-brand/18 bg-cream"
            />
            <p className="relative font-ui text-[0.68rem] uppercase tracking-[0.14em] text-brand/55">
              Sealed correspondence
            </p>
            <p className="relative mt-2 font-body text-sm leading-relaxed text-brand/72">
              Your letter stays sealed until you break it open yourself.
            </p>
          </div>

          <div
            className={`absolute left-1/2 top-13 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-brand/25 bg-linear-to-br from-brand/90 to-brand font-display text-lg text-cream shadow-[0_12px_24px_rgba(75,81,149,0.35)] transition duration-300 ${
              isBreaking ? "scale-110 rotate-6" : ""
            }`}
          >
            ✶
          </div>
        </div>
        <p className="mt-4 font-ui text-sm uppercase tracking-[0.14em] text-brand/60">
          Letter sealed
        </p>
        <p className="mx-auto mt-1 max-w-xs font-body text-xs leading-relaxed text-brand/62">
          Break the seal only when you're ready to revisit this promise.
        </p>
      </div>

      <div className="relative mt-6 flex flex-wrap justify-center gap-2 border-t border-brand/12 pt-4">
        <Button
          type="button"
          variant={isBreaking ? "secondary" : "ghost"}
          size="sm"
          fullWidth={false}
          text={isBreaking ? "Opening..." : "Break seal"}
          onClick={handleBreakSeal}
          disabled={isBreaking}
        />
        <Button
          type="button"
          variant="danger"
          size="sm"
          fullWidth={false}
          text="Delete"
          onClick={() => onDelete(letter)}
        />
        {onArchive ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            text="Archive"
            onClick={() => onArchive(letter)}
          />
        ) : null}
      </div>
    </article>
  );
};
