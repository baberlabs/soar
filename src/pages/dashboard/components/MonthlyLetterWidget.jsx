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

      <div className="mt-4 flex-1">
        <div className="flex items-start gap-3 rounded-2xl border border-brand/12 bg-page p-4">
          <Mail
            size={20}
            strokeWidth={1.5}
            className="mt-0.5 shrink-0 text-brand/55"
          />
          <p className="font-body text-sm leading-relaxed text-brand/78">
            {view.body}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-brand/10 pt-4">
        <Link
          to="/monthly-letter"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
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
      headline: currentMonthLabel,
      statusLabel: null,
      statusTone: "",
      body: `Write your letter for ${currentMonthLabel}. A short note to your future self — you'll read it next month.`,
      cta: "Write your letter",
    };
  }

  const targetLabel = letter.targetMonth
    ? formatMonthLabel(letter.targetMonth)
    : "next month";

  if (letter.status === LETTER_STATUS.DRAFT) {
    return {
      headline: targetLabel,
      statusLabel: "Draft",
      statusTone: "bg-yellow/30 text-brand",
      body: "You've started a letter for your future self. Finish it and seal it to keep it safe until the target month.",
      cta: "Finish and seal",
    };
  }

  if (letter.status === LETTER_STATUS.SEALED) {
    if (isMonthUnlocked(letter.targetMonth)) {
      return {
        headline: targetLabel,
        statusLabel: "Ready",
        statusTone: "bg-sage/15 text-sage",
        body: "Your sealed letter is ready to read. Open it and decide what to carry into next month.",
        cta: "Read your letter",
      };
    }
    return {
      headline: targetLabel,
      statusLabel: "Sealed",
      statusTone: "bg-brand/8 text-brand/72",
      body: `Sealed until ${targetLabel}. You committed to waiting — your past self trusts you to keep it.`,
      cta: "View letter",
    };
  }

  if (letter.status === LETTER_STATUS.UNLOCKED) {
    return {
      headline: targetLabel,
      statusLabel: "Ready",
      statusTone: "bg-sage/15 text-sage",
      body: "Your letter has unlocked. Read it, then write a short reflection on what your past self got right.",
      cta: "Read and reflect",
    };
  }

  if (letter.status === LETTER_STATUS.REVIEWED) {
    return {
      headline: targetLabel,
      statusLabel: "Reviewed",
      statusTone: "bg-sage/12 text-sage",
      body: "You've reflected on this letter. Archive it and start a new one for the month ahead.",
      cta: "Open archive",
    };
  }

  // Fallback for any unknown status — treat as needing attention.
  return {
    headline: targetLabel,
    statusLabel: null,
    statusTone: "",
    body: "Open your letter to see where things stand.",
    cta: "Open letter",
  };
};
