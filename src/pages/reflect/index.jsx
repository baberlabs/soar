import { useState } from "react";
import { useSOARDispatch, useSOARState } from "../../store";
import { useVisionComposer } from "./hooks/useVisionComposer";
import { useLetterComposer } from "./hooks/useLetterComposer";
import { useReflectOrchestrator } from "./hooks/useReflectOrchestrator";
import { formatMonthLabel } from "./utils/month";
import { ReflectHeader } from "./components/shared/ReflectHeader";
import { ReflectTabs } from "./components/shared/ReflectTabs";
import { ConfirmDialog } from "./components/shared/ConfirmDialog";
import { EditingBanner } from "./components/shared/EditingBanner";
import { VisionTabPanel } from "./components/vision/VisionTabPanel";
import { LetterTabPanel } from "./components/letters/LetterTabPanel";

const EMPTY_ARRAY = [];

export default function Reflect() {
  const state = useSOARState();
  const dispatchStore = useSOARDispatch();
  const [tab, setTab] = useState("vision");

  const visionBoards = state.reflections?.visionBoards ?? EMPTY_ARRAY;
  const rawLetters = state.reflections?.letters ?? EMPTY_ARRAY;

  const visionComposer = useVisionComposer({ visionBoards, dispatchStore });
  const letterComposer = useLetterComposer({ rawLetters, dispatchStore });
  const {
    autosaveStatus,
    confirmState,
    confirmDelete,
    confirmDeleteBoard,
    confirmSeal,
    confirmBreakSeal,
  } = useReflectOrchestrator({
    visionComposer,
    letterComposer,
    visionBoards,
  });

  // Guard: no user, no page. Render nothing (NOT before the hooks).
  if (!state.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-5xl space-y-8">
        <ReflectHeader />

        <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center sm:gap-4">
          <ReflectTabs tab={tab} onTabChange={setTab} />
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-body text-[0.68rem] text-brand/55 sm:text-xs">
            <span>{visionBoards.length} moodboards</span>
            <span aria-hidden="true">·</span>
            <span>{letterComposer.letters.length} letters</span>
          </div>
        </div>

        {visionComposer.isEditable ? (
          <EditingBanner
            mode={visionComposer.mode.kind}
            boardLabel={
              visionComposer.form?.month
                ? formatMonthLabel(visionComposer.form.month)
                : null
            }
            autosaveStatus={autosaveStatus}
            onSave={visionComposer.save}
            onCancel={visionComposer.cancel}
            onDelete={
              visionComposer.mode.kind === "edit"
                ? confirmDeleteBoard
                : undefined
            }
          />
        ) : null}

        {tab === "vision" ? (
          <VisionTabPanel
            composer={visionComposer}
            onConfirmDelete={confirmDelete}
          />
        ) : (
          <LetterTabPanel
            composer={letterComposer}
            onConfirmDelete={confirmDelete}
            onConfirmSeal={confirmSeal}
            onConfirmBreakSeal={confirmBreakSeal}
          />
        )}
      </div>

      <ConfirmDialog {...confirmState} />
    </main>
  );
}
