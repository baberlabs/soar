import { useCallback } from "react";
import { useSOARDispatch, useSOARState } from "../../store";
import { useLetterComposer } from "../reflect/hooks/useLetterComposer";
import { useConfirmDialog } from "../reflect/hooks/useConfirmDialog";
import { ConfirmDialog } from "../reflect/components/shared/ConfirmDialog";
import { LetterTabPanel } from "../reflect/components/letters/LetterTabPanel";

/**
 * Monthly Letter page (spec 8.12). Thin orchestrator that wires the global
 * store to the letter composer and hosts the ConfirmDialog instance.
 *
 * The hard state logic lives in useLetterComposer. The UI lives in the
 * `letters` feature folder. This file is intentionally short.
 */
export default function MonthlyLetter() {
  const state = useSOARState();
  const dispatchStore = useSOARDispatch();

  const rawLetters = state.reflections?.letters ?? [];

  const letterComposer = useLetterComposer({ rawLetters, dispatchStore });
  const { confirm, confirmState } = useConfirmDialog();

  // -- Confirmation adapters for destructive / commitment actions.
  const confirmDelete = useCallback(
    async ({ title, message, confirmText, tone, onConfirm }) => {
      const ok = await confirm({ title, message, confirmText, tone });
      if (ok) onConfirm();
    },
    [confirm],
  );

  const confirmSeal = useCallback(
    async ({ onConfirm }) => {
      const ok = await confirm({
        title: "Seal this letter?",
        message:
          "Once sealed, the letter is hidden until its target month. You can break the seal early, but it will be recorded.",
        confirmText: "Seal it",
      });
      if (ok) onConfirm();
    },
    [confirm],
  );

  const confirmBreakSeal = useCallback(
    async ({ onConfirm }) => {
      const ok = await confirm({
        title: "Break the seal early?",
        message:
          "You committed to waiting. Breaking the seal will reveal the letter now, and be noted on the letter so your review stays honest.",
        confirmText: "Break seal",
        tone: "danger",
      });
      if (ok) onConfirm();
    },
    [confirm],
  );

  // Guard: no user, no page. Render nothing (NOT before the hooks).
  if (!state.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-brand/55">
            Reflection
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Monthly Letter
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Write a letter to your future self. Seal it for a month. When it
            opens, read it honestly, and decide what to carry forward.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 font-body text-[0.68rem] text-brand/55 sm:text-xs">
          <span>
            {letterComposer.letters.length}{" "}
            {letterComposer.letters.length === 1 ? "letter" : "letters"}
          </span>
        </div>

        <LetterTabPanel
          composer={letterComposer}
          onConfirmDelete={confirmDelete}
          onConfirmSeal={confirmSeal}
          onConfirmBreakSeal={confirmBreakSeal}
        />
      </div>

      <ConfirmDialog {...confirmState} />
    </main>
  );
}
