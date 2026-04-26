import { useState } from "react";
import { Modal } from "../../../../components/Modal";
import { Button } from "../../../../components/Button";
import {
  VOTING_PRESETS,
  dateInputToDeadline,
  formatDeadline,
  getMinCustomDate,
  presetToDeadline,
} from "../../utils/voting";

/**
 * Modal for choosing the voting window when an author opens voting.
 *
 * Three preset chips + a custom date input. Live preview shows the exact
 * resolved deadline (end-of-day UTC) so authors understand what they're
 * committing to before confirming.
 */
export const OpenVotingDialog = ({ isOpen, onClose, onConfirm }) => {
  const [mode, setMode] = useState("preset"); // preset | custom
  const [presetId, setPresetId] = useState("7d");
  const [customDate, setCustomDate] = useState(getMinCustomDate());

  const deadline =
    mode === "preset"
      ? presetToDeadline(presetId)
      : dateInputToDeadline(customDate);

  const handleConfirm = () => {
    if (!deadline) return;
    onConfirm(deadline);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Open voting"
      ariaLabel="Open voting — choose a deadline"
    >
      <p className="font-body text-sm leading-relaxed text-brand/75">
        Pick how long peers have to vote. Once voting is open, the proposal
        becomes read-only and the deadline can't be changed.
      </p>

      <fieldset className="mt-5 space-y-3">
        <legend className="sr-only">Voting window</legend>

        <div className="flex flex-wrap gap-1.5">
          {VOTING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setMode("preset");
                setPresetId(preset.id);
              }}
              aria-pressed={mode === "preset" && presetId === preset.id}
              className={`rounded-full border px-3 py-1.5 font-body text-xs transition duration-150 ${
                mode === "preset" && presetId === preset.id
                  ? "border-brand bg-brand text-cream shadow-[0_6px_14px_rgba(75,81,149,0.18)]"
                  : "border-brand/20 bg-cream text-brand/70 hover:border-brand/40 hover:bg-brand/5"
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMode("custom")}
            aria-pressed={mode === "custom"}
            className={`rounded-full border px-3 py-1.5 font-body text-xs transition duration-150 ${
              mode === "custom"
                ? "border-brand bg-brand text-cream shadow-[0_6px_14px_rgba(75,81,149,0.18)]"
                : "border-brand/20 bg-cream text-brand/70 hover:border-brand/40 hover:bg-brand/5"
            }`}
          >
            Custom
          </button>
        </div>

        {mode === "custom" ? (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="voting-deadline-date"
              className="font-body text-xs text-brand/65"
            >
              Close on (end of day, UTC)
            </label>
            <input
              id="voting-deadline-date"
              type="date"
              value={customDate}
              min={getMinCustomDate()}
              onChange={(event) => setCustomDate(event.target.value)}
              className="rounded-2xl border border-black/15 bg-cream px-4 py-2.5 font-body text-sm text-navy outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>
        ) : null}
      </fieldset>

      <div className="mt-5 rounded-2xl border border-brand/15 bg-page/60 px-4 py-3">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.14em] text-brand/55">
          Voting closes
        </p>
        <p className="mt-0.5 font-ui text-base text-brand">
          {formatDeadline(deadline) || "Pick a date"}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          fullWidth={false}
          text="Cancel"
          onClick={onClose}
        />
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Open voting"
          onClick={handleConfirm}
          disabled={!deadline}
        />
      </div>
    </Modal>
  );
};
