import { Button } from "../../../../components/Button";
import { VisionLibraryCard } from "./VisionLibraryCard";

export const VisionLibrary = ({
  boards,
  activeBoardId,
  isEditable,
  onSelectBoard,
  onCreate,
}) => {
  return (
    <aside className="space-y-4 sm:rounded-3xl sm:border sm:border-brand/15 sm:shadow-[0_18px_50px_rgba(55,62,112,0.08)] sm:p-4 xl:sticky xl:top-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/60">
            All boards
          </p>
          <h3 className="mt-0.5 font-ui text-xl text-brand sm:text-2xl">
            Library
            <span className="ml-2 font-body text-sm text-brand/55 sm:text-base">
              ({boards.filter((board) => !board.isDraft).length})
            </span>
          </h3>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth={false}
          text="New"
          disabled={isEditable}
          title={
            isEditable
              ? "Save or cancel the current board before creating a new one."
              : "Create a new moodboard"
          }
          onClick={onCreate}
        />
      </div>

      {boards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand/25 bg-page/80 p-6 text-center font-body text-sm text-brand/70">
          No moodboards yet. Start one to capture this month.
        </div>
      ) : (
        <div className="vision-library-scrollbar max-h-112 space-y-2 overflow-y-auto pr-1 sm:max-h-132">
          {boards.map((board) => (
            <VisionLibraryCard
              key={board.id}
              board={board}
              isActive={board.id === activeBoardId}
              isDisabled={isEditable}
              onSelect={onSelectBoard}
            />
          ))}
        </div>
      )}
    </aside>
  );
};
