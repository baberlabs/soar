/**
 * The ballot itself. Three buttons: Yes, No, Abstain. The currently-cast
 * vote is visually distinguished (filled), others are outlined. Peers can
 * change their vote until the deadline -- we treat it as an update, not a
 * separate "change vote" flow.
 *
 * Copy under each button reminds peers what each option means. Abstain
 * especially -- peers often assume abstain == didn't vote, but here it
 * counts toward quorum while staying neutral on outcome.
 */

const OPTIONS = [
  {
    value: "yes",
    label: "Yes",
    description: "In favour",
    activeClass:
      "border-sage bg-sage text-cream shadow-[0_8px_20px_rgba(118,164,91,0.25)]",
    idleClass:
      "border-sage/40 bg-sage/5 text-sage hover:border-sage hover:bg-sage/10",
  },
  {
    value: "no",
    label: "No",
    description: "Opposed",
    activeClass:
      "border-rose-600 bg-rose-600 text-white shadow-[0_8px_20px_rgba(225,29,72,0.25)]",
    idleClass:
      "border-rose-400/40 bg-rose-50 text-rose-800 hover:border-rose-500 hover:bg-rose-100",
  },
  {
    value: "abstain",
    label: "Abstain",
    description: "Seen, no side",
    activeClass:
      "border-brand bg-brand text-cream shadow-[0_8px_20px_rgba(75,81,149,0.2)]",
    idleClass:
      "border-brand/30 bg-page text-brand/75 hover:border-brand hover:bg-brand/5",
  },
];

export const Ballot = ({ myVote, onVote, disabled }) => (
  <div className="space-y-3">
    <div className="grid gap-2 sm:grid-cols-3">
      {OPTIONS.map((option) => {
        const active = myVote === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onVote(option.value)}
            disabled={disabled}
            aria-pressed={active}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl border px-4 py-4 font-ui text-lg tracking-[0.04em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              active ? option.activeClass : option.idleClass
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`font-body text-[0.62rem] uppercase tracking-widest ${active ? "opacity-85" : "opacity-65"}`}
            >
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
    {myVote ? (
      <p className="font-body text-xs text-brand/60">
        You can change your vote until voting closes.
      </p>
    ) : null}
  </div>
);
