import { Check } from "lucide-react";

export const SessionProgress = ({
  steps,
  labels,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  return (
    <nav aria-label="Session progress">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {steps.map((step, i) => {
          const isCurrent = step === currentStep;
          const isCompleted = completedSteps.has(step);
          const isReachable = isCurrent || isCompleted;

          return (
            <li key={step}>
              <button
                type="button"
                onClick={isReachable ? () => onStepClick(step) : undefined}
                disabled={!isReachable}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  isCurrent
                    ? "bg-brand text-white"
                    : isCompleted
                      ? "bg-sage/15 text-brand"
                      : "bg-brand/5 text-brand/50"
                }`}
              >
                {/* Label */}
                <span className="truncate text-left">
                  {i + 1}. {labels[step]}
                </span>

                {/* Status */}
                {isCompleted && !isCurrent && (
                  <Check size={14} className="text-sage" />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
