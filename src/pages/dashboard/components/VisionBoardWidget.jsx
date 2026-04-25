import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";
import { useSOARState } from "../../../store";
import {
  formatMonthLabel,
  getCurrentMonthValue,
} from "../../reflect/utils/month";
import { getBoardMonthValue } from "../../reflect/utils/moodboard";
import { WidgetCard, WidgetHeader } from "./WidgetCard";

/**
 * Two states:
 *   - Has a board for the current month → show item count + a 4-tile
 *     image preview (or a focus-statement preview if no image items).
 *   - No board for the current month → prompt.
 */
export const VisionBoardWidget = () => {
  const state = useSOARState();

  const currentMonthValue = useMemo(getCurrentMonthValue, []);
  const currentMonthLabel = useMemo(
    () => formatMonthLabel(currentMonthValue),
    [currentMonthValue],
  );

  const currentBoard = useMemo(
    () =>
      (state.reflections?.visionBoards ?? []).find(
        (board) => getBoardMonthValue(board) === currentMonthValue,
      ) ?? null,
    [state.reflections?.visionBoards, currentMonthValue],
  );

  return (
    <WidgetCard>
      <WidgetHeader
        eyebrow="Vision Board"
        title={currentMonthLabel}
        aside={
          currentBoard ? (
            <span className="rounded-full bg-brand/8 px-3 py-1 font-body text-xs text-brand/72">
              {currentBoard.items?.length ?? 0} item
              {(currentBoard.items?.length ?? 0) === 1 ? "" : "s"}
            </span>
          ) : null
        }
      />

      <div className="mt-4 flex-1">
        {currentBoard ? (
          <BoardPreview board={currentBoard} />
        ) : (
          <EmptyBoard month={currentMonthLabel} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-brand/10 pt-4">
        <Link
          to="/vision-board"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          {currentBoard
            ? "Open this month's board"
            : `Start your ${currentMonthLabel} board`}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </WidgetCard>
  );
};

const EmptyBoard = ({ month }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand/25 bg-page p-6 text-center">
    <ImageIcon size={20} strokeWidth={1.5} className="text-brand/45" />
    <p className="font-body text-sm leading-relaxed text-brand/72">
      Start your {month} Vision Board.
    </p>
  </div>
);

const BoardPreview = ({ board }) => {
  const imageItems = (board.items ?? [])
    .filter((item) => item.imageData)
    .slice(0, 4);

  return (
    <div className="space-y-3">
      {imageItems.length > 0 ? (
        <div className="grid grid-cols-4 gap-1.5">
          {imageItems.map((item) => (
            <div
              key={item.id}
              className="aspect-square overflow-hidden rounded-xl border border-brand/12 bg-page"
            >
              <img
                src={item.imageData}
                alt={item.caption || "Board item"}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - imageItems.length) }).map(
            (_, index) => (
              <div
                key={`placeholder-${index}`}
                className="aspect-square rounded-xl border border-dashed border-brand/15 bg-page/60"
              />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-brand/12 bg-page p-4">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
            No images yet
          </p>
          <p className="mt-1 font-body text-sm text-brand/72">
            Add photos, notes, and links to bring this month into focus.
          </p>
        </div>
      )}

      {board.prompt ? (
        <p className="line-clamp-2 font-body text-sm leading-relaxed text-brand/78">
          {board.prompt}
        </p>
      ) : null}
    </div>
  );
};
