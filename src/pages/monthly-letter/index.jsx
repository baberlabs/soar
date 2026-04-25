import { useSOARDispatch, useSOARState } from "../../store";
import { useLetterComposer } from "../reflect/hooks/useLetterComposer";
import { useReflectOrchestrator } from "../reflect/hooks/useReflectOrchestrator";
import { ConfirmDialog } from "../reflect/components/shared/ConfirmDialog";
import { LetterTabPanel } from "../reflect/components/letters/LetterTabPanel";

const EMPTY_ARRAY = [];

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

  const rawLetters = state.reflections?.letters ?? EMPTY_ARRAY;

  const letterComposer = useLetterComposer({ rawLetters, dispatchStore });
  const {
    confirmState,
    confirmDelete,
    confirmSeal,
    confirmBreakSeal,
  } = useReflectOrchestrator({ letterComposer });

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
