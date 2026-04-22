import { InputField } from "../../../../components/InputField";
import { MonthPicker } from "../shared/MonthPicker";

export const VisionBoardMeta = ({
  form,
  onFieldChange,
  blockedMonthValues,
}) => (
  <div className="grid gap-4 rounded-3xl border border-brand/15 bg-page/80 p-5 backdrop-blur-sm">
    <div className="grid gap-4 md:grid-cols-2">
      <MonthPicker
        id="vision-month"
        label="Month"
        value={form.month}
        onValueChange={(value) => onFieldChange("month", value)}
        required
        disabledValues={blockedMonthValues}
      />

      <InputField
        label="Playlist / song"
        type="text"
        name="vision-playlist"
        placeholder="One track that fits this month"
        value={form.playlistNote}
        onValueChange={(value) => onFieldChange("playlistNote", value)}
        required={false}
      />
    </div>

    <div className="flex flex-col gap-2">
      <label
        htmlFor="vision-prompt"
        className="font-body text-sm text-brand/70"
      >
        Focus statement
      </label>
      <textarea
        id="vision-prompt"
        value={form.prompt}
        onChange={(event) => onFieldChange("prompt", event.target.value)}
        placeholder="What do you want this month to feel like?"
        rows="3"
        className="w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  </div>
);
