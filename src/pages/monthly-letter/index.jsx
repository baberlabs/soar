import { useSOARDispatch, useSOARState } from "../../store";
import { useLetterComposer } from "../reflect/hooks/useLetterComposer";
import { useReflectOrchestrator } from "../reflect/hooks/useReflectOrchestrator";
import { ConfirmDialog } from "../reflect/components/shared/ConfirmDialog";
import { LetterTabPanel } from "../reflect/components/letters/LetterTabPanel";
import Page from "../../layout/Page";

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
  const { confirmState, confirmDelete, confirmSeal, confirmBreakSeal } =
    useReflectOrchestrator({ letterComposer });

  // Guard: no user, no page. Render nothing (NOT before the hooks).
  if (!state.user) {
    return null;
  }

  return (
    <Page
      heading="Monthly Letter"
      description="Write a letter to your future self. Seal it for a month. When it
          opens, read it honestly, and decide what to carry forward."
      contentClassName="mx-auto space-y-6"
    >
      <ConfirmDialog {...confirmState} />

      <LetterTabPanel
        composer={letterComposer}
        onConfirmDelete={confirmDelete}
        onConfirmSeal={confirmSeal}
        onConfirmBreakSeal={confirmBreakSeal}
      />
    </Page>
  );
}
