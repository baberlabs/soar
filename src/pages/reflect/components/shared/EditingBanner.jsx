import { Button } from "../../../../components/Button";

export const EditingBanner = ({
  mode,
  boardLabel,
  autosaveStatus,
  onSave,
  onCancel,
  onDelete,
}) => {
  const label =
    mode === "create"
      ? "Creating new moodboard"
      : `Editing board for ${boardLabel || "this month"}`;

  const statusCopy =
    autosaveStatus === "pending"
      ? "Saving draft..."
      : autosaveStatus === "saved"
        ? "Draft saved"
        : null;

  return (
    <div className="sticky top-20 z-30 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-yellow/50 bg-yellow/30 px-3 py-3 shadow-[0_12px_28px_rgba(75,81,149,0.12)] backdrop-blur-sm sm:top-24 sm:items-center sm:rounded-full sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-brand"
        />
        <div className="flex min-w-0 flex-col">
          <p className="truncate font-ui text-[0.68rem] uppercase tracking-[0.12em] text-brand/80 sm:text-xs sm:tracking-[0.14em]">
            {label}
          </p>
          {statusCopy ? (
            <p className="font-body text-[0.7rem] text-brand/65 sm:text-xs">
              {statusCopy}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Save"
          onClick={onSave}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          text="Cancel"
          onClick={onCancel}
        />
        {mode === "edit" && onDelete ? (
          <Button
            type="button"
            variant="danger"
            size="sm"
            fullWidth={false}
            text="Delete"
            onClick={onDelete}
          />
        ) : null}
      </div>
    </div>
  );
};
