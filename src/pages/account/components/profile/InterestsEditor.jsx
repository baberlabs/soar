import { useState } from "react";
import { Button } from "../../../../components/Button";

/**
 * Interest editor. Shows all suggested interests as toggleable chips, plus
 * a small input for adding custom ones. Changes flush to the store via
 * onChange — this is a controlled component, no local "save" button.
 *
 * SUGGESTED list matches what the peer directory and Connect use for
 * recommendation scoring; keep these two lists in sync if you rename any
 * interest.
 */

const SUGGESTED = [
  "Photography",
  "Film",
  "Writing",
  "Philosophy",
  "JavaScript",
  "Design",
  "Meditation",
  "Leadership",
  "Poetry",
  "Cooking",
  "Music",
  "Languages",
  "Fitness",
  "Reading",
  "Sketching",
  "Hiking",
];

export const InterestsEditor = ({ interests = [], onChange }) => {
  const [custom, setCustom] = useState("");

  const set = new Set(interests);

  const toggle = (tag) => {
    const next = new Set(set);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    onChange(Array.from(next));
  };

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    if (set.has(value)) {
      setCustom("");
      return;
    }
    onChange([...interests, value]);
    setCustom("");
  };

  // Custom tags = anything in state that isn't in SUGGESTED.
  const customInterests = interests.filter((tag) => !SUGGESTED.includes(tag));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED.map((tag) => {
          const active = set.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              aria-pressed={active}
              className={`rounded-full border px-3 py-1 font-body text-xs transition duration-150 ${
                active
                  ? "border-brand bg-brand text-cream shadow-[0_6px_14px_rgba(75,81,149,0.18)]"
                  : "border-brand/20 bg-cream text-brand/70 hover:border-brand/40 hover:bg-brand/5"
              }`}
            >
              {tag}
            </button>
          );
        })}

        {customInterests.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-sage/10 px-3 py-1 font-body text-xs text-sage"
          >
            {tag}
            <button
              type="button"
              onClick={() => toggle(tag)}
              aria-label={`Remove ${tag}`}
              className="text-sage/60 hover:text-sage"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder="Add your own"
          aria-label="Add a custom interest"
          className="flex-1 rounded-2xl border border-brand/15 bg-page/60 px-4 py-2 font-body text-sm text-brand outline-none transition placeholder:text-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth={false}
          text="Add"
          onClick={addCustom}
          disabled={!custom.trim()}
        />
      </div>
    </div>
  );
};
