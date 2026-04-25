export function ProgressBar({
  value = 0,
  max = 100,
  size = "md",
  label = null,
  showPercent = true,
}) {
  const safeMax = Math.max(max, 1);
  const percentage = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }[size];

  return (
    <div className="w-full space-y-1">
      {(label || showPercent) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <span className="font-body text-xs text-brand/70">{label}</span>
          )}
          {showPercent && (
            <span className="font-body text-xs font-semibold text-navy">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className={`w-full rounded-full bg-navy/10 ${heightClass}`}
      >
        <div
          className={`rounded-full transition-all ${heightClass}`}
          style={{
            width: `${percentage}%`,
            backgroundImage:
              "linear-gradient(90deg, var(--color-brand), rgba(75, 81, 149, 0.7))",
          }}
        />
      </div>
    </div>
  );
}
