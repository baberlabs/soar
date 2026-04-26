import { useSOARDispatch, useSOARState } from "../../store";
import { useVisionComposer } from "../reflect/hooks/useVisionComposer";
import { useReflectOrchestrator } from "../reflect/hooks/useReflectOrchestrator";
import { formatMonthLabel } from "../reflect/utils/month";
import { ConfirmDialog } from "../reflect/components/shared/ConfirmDialog";
import { EditingBanner } from "../reflect/components/shared/EditingBanner";
import { VisionTabPanel } from "../reflect/components/vision/VisionTabPanel";

const EMPTY_ARRAY = [];

export default function VisionBoard() {
  const state = useSOARState();
  const dispatchStore = useSOARDispatch();

  const visionBoards = state.reflections?.visionBoards ?? EMPTY_ARRAY;

  const visionComposer = useVisionComposer({ visionBoards, dispatchStore });
  const { autosaveStatus, confirmState, confirmDelete, confirmDeleteBoard } =
    useReflectOrchestrator({ visionComposer, visionBoards });

  // Guard: no user, no page. Render nothing (NOT before the hooks).
  if (!state.user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-4 pb-24 pt-8 sm:px-6 md:pb-8 md:pt-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-brand/55">
            Reflection
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Vision Board
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80">
            Capture where you are heading this month. Images, notes, and links
            arranged on a single canvas. One board per month.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 font-body text-[0.68rem] text-brand/55 sm:text-xs">
          <span>
            {visionBoards.length}{" "}
            {visionBoards.length === 1 ? "board" : "boards"}
          </span>
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

        <VisionTabPanel
          composer={visionComposer}
          onConfirmDelete={confirmDelete}
        />
      </div>

      <ConfirmDialog {...confirmState} />
    </main>
  );
}
