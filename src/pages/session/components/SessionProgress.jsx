import { Check } from "lucide-react";

export const SessionProgress = ({
  steps,
  labels,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <nav aria-label="Session progress" className="space-y-3">
      <ol className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const isCurrent = step === currentStep;
          const isCompleted = completedSteps.has(step);
          const isReachable = isCurrent || isCompleted;

          return (
            <li key={step}>
              <button
                type="button"
                onClick={isReachable ? () => onStepClick(step) : undefined}
                disabled={!isReachable}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex w-full flex-col gap-1.5 rounded-2xl border px-3 py-2.5 text-left transition ${
                  isCurrent
                    ? "border-brand bg-brand/8 text-brand shadow-[0_8px_18px_rgba(75,81,149,0.10)]"
                    : isCompleted
                      ? "border-sage/35 bg-sage/8 text-brand hover:border-sage/55"
                      : "cursor-not-allowed border-brand/12 bg-page text-brand/45"
                }`}
              >
                <span className="flex items-center gap-1.5 font-ui text-[0.62rem] uppercase tracking-[0.14em]">
                  <span>Step {index + 1}</span>
                  {isCompleted && !isCurrent ? (
                    <Check size={12} strokeWidth={2.5} className="text-sage" />
                  ) : null}
                </span>
                <span className="font-ui text-sm">{labels[step]}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="h-1 overflow-hidden rounded-full bg-brand/10">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500"
          style={{
            width: `${((currentIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>
    </nav>
  );
};
