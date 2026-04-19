/**
 * Small presence indicator. `online` is a boolean; optionally set `label`
 * to render the label alongside (e.g. "Online" / "Last active 2h ago").
 */
export const StatusDot = ({ online, label, className = "" }) => (
  <span className={`inline-flex items-center gap-1.5 ${className}`}>
    <span
      aria-hidden="true"
      className={`h-1.5 w-1.5 rounded-full ${online ? "bg-sage" : "bg-brand/35"}`}
    />
    {label ? (
      <span
        className={`font-body text-[0.68rem] uppercase tracking-[0.14em] ${online ? "text-sage" : "text-brand/55"}`}
      >
        {label}
      </span>
    ) : null}
  </span>
);
