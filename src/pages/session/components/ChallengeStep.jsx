import { useState } from "react";
import { Button } from "../../../components/Button";

export const ChallengeStep = ({
  curatedChallenge,
  alreadyComplete,
  onAcknowledge,
}) => {
  const [mode, setMode] = useState("curated");
  const [customText, setCustomText] = useState("");

  const isCustomReady = mode === "custom" ? customText.trim().length > 0 : true;

  return (
    <section className="space-y-6 rounded-4xl border border-brand/12 bg-page p-6 md:p-8">
      <header className="space-y-1">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
          Step 5 of 5
        </p>
        <h2 className="font-ui text-3xl text-brand">Challenge</h2>
        <p className="font-body text-sm leading-relaxed text-brand/76">
          Pick a challenge to take into the rest of your week. You can come back
          to mark it done from Create — finishing this step doesn&rsquo;t
          require finishing the challenge itself.
        </p>
      </header>

      <fieldset>
        <legend className="sr-only">Challenge source</legend>

        <div className="flex flex-wrap gap-2">
          <ModeButton
            active={mode === "curated"}
            onClick={() => setMode("curated")}
            label="Use the curated challenge"
          />
          <ModeButton
            active={mode === "custom"}
            onClick={() => setMode("custom")}
            label="Define your own"
          />
        </div>
      </fieldset>

      {mode === "curated" ? (
        <div className="rounded-3xl border border-brand/15 bg-cream/80 p-5">
          <p className="font-ui text-xs uppercase tracking-[0.12em] text-brand/55">
            Suggested challenge
          </p>
          <p className="mt-2 font-body text-base leading-relaxed text-brand/82">
            {curatedChallenge}
          </p>
        </div>
      ) : (
        <div>
          <label
            htmlFor="custom-challenge"
            className="block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
          >
            Your challenge
          </label>
          <textarea
            id="custom-challenge"
            value={customText}
            onChange={(event) => setCustomText(event.target.value)}
            placeholder="Describe one concrete thing you'll do this week..."
            className="mt-2 min-h-28 w-full rounded-2xl border border-brand/16 bg-cream px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-brand/10 pt-5">
        <Button
          type="button"
          fullWidth={false}
          text={
            alreadyComplete
              ? "Already complete — review only"
              : "Acknowledge & finish session"
          }
          onClick={() =>
            onAcknowledge({
              mode,
              customText: customText.trim(),
            })
          }
          disabled={!isCustomReady || alreadyComplete}
        />
        {alreadyComplete ? (
          <p className="font-body text-xs text-brand/62">
            This session is already marked complete. Pick a fresh challenge
            anytime — your progress stays the same.
          </p>
        ) : null}
      </div>
    </section>
  );
};

const ModeButton = ({ active, onClick, label }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`rounded-full border px-4 py-2 font-ui text-sm tracking-[0.04em] transition ${
      active
        ? "border-brand bg-brand text-cream"
        : "border-brand/20 bg-page text-brand/72 hover:border-brand/40"
    }`}
  >
    {label}
  </button>
);
