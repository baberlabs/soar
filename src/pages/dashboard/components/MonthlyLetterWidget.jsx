import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useSOARState } from "../../../store";
import {
  formatMonthLabel,
  getCurrentMonthValue,
  isMonthUnlocked,
} from "../../reflect/utils/month";
import { LETTER_STATUS } from "../../reflect/constants";
import { WidgetCard, WidgetHeader } from "./WidgetCard";

/**
 * Status derivation kept simple. Looks at the most recent non-archived
 * letter and maps to one of: write / draft / sealed-locked / ready-to-read /
 * complete. The Reflect page's letter composer has richer logic; we don't
 * need it here, just the headline state for one widget.
 */
export const MonthlyLetterWidget = () => {
  const state = useSOARState();

  const currentMonthValue = useMemo(getCurrentMonthValue, []);
  const currentMonthLabel = useMemo(
    () => formatMonthLabel(currentMonthValue),
    [currentMonthValue],
  );

  const activeLetter = useMemo(() => {
    const letters = state.reflections?.letters ?? [];
    const candidates = letters.filter(
      (letter) => letter.status !== LETTER_STATUS.ARCHIVED,
    );
    if (candidates.length === 0) return null;
    // Most recent target month wins. ISO "YYYY-MM" sorts lexicographically.
    return [...candidates].sort((a, b) =>
      String(b.targetMonth || "").localeCompare(String(a.targetMonth || "")),
    )[0];
  }, [state.reflections?.letters]);

  const view = deriveLetterView(activeLetter, currentMonthLabel);
  const visual = getWidgetVisual(view.kind);

  return (
    <WidgetCard>
      <WidgetHeader
        eyebrow="Monthly Letter"
        title={view.headline}
        aside={
          view.statusLabel ? (
            <span
              className={`rounded-full px-3 py-1 font-body text-xs ${view.statusTone}`}
            >
              {view.statusLabel}
            </span>
          ) : null
        }
      />

      <div className="mt-4 flex-1 space-y-3">
        <div className="rounded-2xl border border-brand/12 bg-page/70 p-3">
          <p className="font-body text-[0.68rem] uppercase tracking-[0.12em] text-brand/55">
            Next step
          </p>
          <p className="mt-1 font-ui text-base text-brand">{view.cta}</p>
        </div>

        <div className={`rounded-2xl border p-4 ${visual.surfaceTone}`}>
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${visual.iconTone}`}
            >
              <Mail size={18} strokeWidth={1.6} />
            </span>
            <div>
              <p className="font-body text-[0.68rem] uppercase tracking-[0.12em] text-brand/55">
                Focus
              </p>
              <p className="mt-1 font-body text-sm leading-relaxed text-brand/82">
                {view.body}
              </p>
            </div>
          </div>
        </div>

        {view.note ? (
          <p className="font-body text-xs leading-relaxed text-brand/62">
            {view.note}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-brand/10 pt-4">
        <Link
          to="/monthly-letter"
          className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand px-4 py-2 font-ui text-sm tracking-[0.04em] text-cream transition hover:bg-brand/90"
        >
          {view.cta}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </WidgetCard>
  );
};

const deriveLetterView = (letter, currentMonthLabel) => {
  if (!letter) {
    return {
      kind: "empty",
      headline: currentMonthLabel,
      statusLabel: null,
      statusTone: "",
      body: `Write your letter for ${currentMonthLabel}. A short note to your future self; you'll read it next month.`,
      cta: "Write your letter",
      note: "One letter stays active at a time. Archive the last one after reflection to open a new cycle.",
    };
  }

  const targetLabel = letter.targetMonth
    ? formatMonthLabel(letter.targetMonth)
    : "next month";

  if (letter.status === LETTER_STATUS.DRAFT) {
    return {
      kind: "draft",
      headline: targetLabel,
      statusLabel: "Draft",
      statusTone: "bg-yellow/30 text-brand",
      body: "You've started a letter for your future self. Finish it and seal it to keep it safe until the target month.",
      cta: "Finish and seal",
      note: "Drafts can still be edited before sealing.",
    };
  }

  if (letter.status === LETTER_STATUS.SEALED) {
    if (isMonthUnlocked(letter.targetMonth)) {
      return {
        kind: "sealed-ready",
        headline: targetLabel,
        statusLabel: "Ready",
        statusTone: "bg-sage/15 text-sage",
        body: "Your sealed letter is ready to read. Open it and decide what to carry into next month.",
        cta: "Read your letter",
        note: "Reflection is required before archiving.",
      };
    }
    return {
      kind: "sealed-locked",
      headline: targetLabel,
      statusLabel: "Sealed",
      statusTone: "bg-brand/8 text-brand/72",
      body: `Sealed until ${targetLabel}. You committed to waiting; your past self trusts you to keep it.`,
      cta: "View letter",
      note: "You can break the seal early, and it will be recorded on the letter.",
    };
  }

  if (letter.status === LETTER_STATUS.UNLOCKED) {
    return {
      kind: "opened",
      headline: targetLabel,
      statusLabel: letter.sealBroken ? "Opened early" : "Opened",
      statusTone: "bg-sage/15 text-sage",
      body: letter.sealBroken
        ? "You opened this letter early. Add your reflection before you can archive it and move to a new one."
        : "Your letter is open. Add your reflection before you archive it and move to a new one.",
      cta: "Read and reflect",
      note: "A new letter stays locked until this one is reflected on and archived.",
    };
  }

  if (letter.status === LETTER_STATUS.REVIEWED) {
    return {
      kind: "reviewed",
      headline: targetLabel,
      statusLabel: "Reviewed",
      statusTone: "bg-sage/12 text-sage",
      body: "Reflection complete. Archive this letter to start a new one for the month ahead.",
      cta: "Open archive",
      note: "Archiving closes this cycle and unlocks the next letter.",
    };
  }

  // Fallback for any unknown status; treat as needing attention.
  return {
    kind: "unknown",
    headline: targetLabel,
    statusLabel: null,
    statusTone: "",
    body: "Open your letter to see where things stand.",
    cta: "Open letter",
    note: null,
  };
};

const getWidgetVisual = (kind) => {
  switch (kind) {
    case "draft":
      return {
        surfaceTone: "border-yellow/40 bg-yellow/12",
        iconTone: "border-yellow/45 bg-yellow/25 text-brand",
      };
    case "sealed-locked":
      return {
        surfaceTone: "border-brand/20 bg-brand/6",
        iconTone: "border-brand/25 bg-brand/12 text-brand",
      };
    case "sealed-ready":
    case "opened":
    case "reviewed":
      return {
        surfaceTone: "border-sage/30 bg-sage/12",
        iconTone: "border-sage/35 bg-sage/22 text-sage",
      };
    case "empty":
    case "unknown":
    default:
      return {
        surfaceTone: "border-brand/12 bg-page",
        iconTone: "border-brand/18 bg-brand/6 text-brand/65",
      };
  }
};
