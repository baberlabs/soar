import { formatMonthLabel, formatMonthShort } from "../../utils/month";
import { getBoardMonthValue } from "../../utils/moodboard";

export const VisionLibraryCard = ({
  board,
  isActive,
  isDisabled,
  onSelect,
}) => {
  const monthValue = getBoardMonthValue(board);
  const itemCount = board.items?.length || 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(board.id)}
      disabled={isDisabled}
      aria-current={isActive ? "true" : undefined}
      className={`flex w-full items-center gap-2 rounded-2xl border p-2.5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:gap-4 sm:rounded-3xl sm:p-3 ${
        isActive
          ? "border-brand/30"
          : "border-brand/12 hover:border-brand/25 opacity-62 hover:opacity-100"
      } ${board.isDraft ? "ring-2 ring-yellow/60" : ""} ${
        isDisabled ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand/20 to-brand/5 font-ui text-lg tracking-wide text-brand sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl">
        {formatMonthShort(monthValue)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-ui text-base text-brand sm:text-lg">
            {formatMonthLabel(monthValue)}
          </p>
          {board.isDraft ? (
            <span className="rounded-full bg-yellow/60 px-2 py-0.5 font-body text-[0.56rem] uppercase tracking-widest text-brand sm:text-[0.62rem]">
              Draft
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 font-body text-[0.68rem] leading-relaxed text-brand/58 sm:text-xs">
          {board.prompt ||
            board.playlistNote ||
            `${itemCount} item${itemCount === 1 ? "" : "s"}`}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="rounded-full px-2 py-0.5 font-body text-[0.56rem] font-semibold uppercase tracking-[0.08em] sm:px-2.5 sm:py-1 sm:text-[0.62rem] bg-brand/10 text-brand">
          {itemCount}
        </span>
      </div>
    </button>
  );
};
