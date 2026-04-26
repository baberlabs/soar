import { useSOARDispatch, useSOARState } from "../../store";
import { useVisionComposer } from "../reflect/hooks/useVisionComposer";
import { useReflectOrchestrator } from "../reflect/hooks/useReflectOrchestrator";
import { formatMonthLabel } from "../reflect/utils/month";
import { ConfirmDialog } from "../reflect/components/shared/ConfirmDialog";
import { EditingBanner } from "../reflect/components/shared/EditingBanner";
import { VisionTabPanel } from "../reflect/components/vision/VisionTabPanel";
import Page from "../../layout/Page";

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
    <Page
      heading="Vision Board"
      description="Capture where you are heading this month. Images, notes, and links
          arranged on a single canvas. One board per month."
      contentClassName="mx-auto space-y-6"
    >
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
            visionComposer.mode.kind === "edit" ? confirmDeleteBoard : undefined
          }
        />
      ) : null}

      <ConfirmDialog {...confirmState} />

      <VisionTabPanel
        composer={visionComposer}
        onConfirmDelete={confirmDelete}
      />
    </Page>
  );
}
