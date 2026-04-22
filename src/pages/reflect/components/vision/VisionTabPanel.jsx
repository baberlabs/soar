import { VisionBoardStage } from "./VisionBoardStage";
import { VisionLibrary } from "./VisionLibrary";
import { EmptyVisionState } from "./EmptyVisionState";

export const VisionTabPanel = ({ composer, onConfirmDelete }) => {
  const {
    form,
    error,
    isEditable,
    sortedBoards,
    carouselBoards,
    workingBoard,
    blockedMonthValues,
    selectBoard,
    beginCreate,
    beginEdit,
    setFormField,
    addItem,
    updateItem,
    removeItem,
    beginEditItem,
    cancelEditItem,
    bringItemForward,
    sendItemBack,
    setError,
    clearError,
  } = composer;

  if (!isEditable && sortedBoards.length === 0) {
    return (
      <section
        id="reflect-panel-vision"
        role="tabpanel"
        aria-labelledby="reflect-tab-vision"
      >
        <EmptyVisionState onCreate={beginCreate} />
      </section>
    );
  }

  return (
    <section
      id="reflect-panel-vision"
      role="tabpanel"
      aria-labelledby="reflect-tab-vision"
      className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]"
    >
      <VisionBoardStage
        board={workingBoard}
        isEditable={isEditable}
        form={form}
        error={error}
        blockedMonthValues={blockedMonthValues}
        onFieldChange={setFormField}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onRemoveItem={(id) =>
          onConfirmDelete({
            title: "Remove this item?",
            message:
              "It will be taken off the board. You can add it again later.",
            confirmText: "Remove",
            tone: "danger",
            onConfirm: () => removeItem(id),
          })
        }
        onBeginEditItem={beginEditItem}
        onCancelEditItem={cancelEditItem}
        onBringItemForward={bringItemForward}
        onSendItemBack={sendItemBack}
        onSetError={setError}
        onClearError={clearError}
        onBeginEdit={beginEdit}
        onCreate={beginCreate}
      />

      <VisionLibrary
        boards={carouselBoards}
        activeBoardId={workingBoard?.id ?? null}
        isEditable={isEditable}
        onSelectBoard={selectBoard}
        onCreate={beginCreate}
      />
    </section>
  );
};
