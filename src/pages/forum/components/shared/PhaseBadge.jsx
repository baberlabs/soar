import { getPhaseLabel, getPhaseTone } from "../../utils/phase";

const TONE_CLASSES = {
  neutral: "bg-brand/8 text-brand/75 border-brand/15",
  sky: "bg-sky/25 text-brand border-sky/50",
  yellow: "bg-yellow/35 text-brand border-yellow/60",
  brand: "bg-brand/10 text-brand border-brand/25",
  sage: "bg-sage/15 text-sage border-sage/35",
  rose: "bg-rose-100 text-rose-800 border-rose-200",
};

export const PhaseBadge = ({ phase, className = "" }) => {
  const tone = getPhaseTone(phase);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-body text-[0.62rem] font-medium uppercase tracking-[0.12em] ${TONE_CLASSES[tone] ?? TONE_CLASSES.neutral} ${className}`}
    >
      {getPhaseLabel(phase)}
    </span>
  );
};
