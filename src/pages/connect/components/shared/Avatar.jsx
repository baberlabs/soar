const SIZE_CLASSES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
  xl: "h-22 w-22 text-2xl",
};

/**
 * Circular initials avatar. Consumes peer.avatar.{initials, colorClass}.
 * The colorClass comes from the peer record so each peer has a consistent
 * tint across the whole app.
 */
export const Avatar = ({ avatar, size = "md", className = "" }) => {
  const dimClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  const colorClass = avatar?.colorClass ?? "bg-brand/10";

  return (
    <div
      aria-hidden="true"
      className={`flex ${dimClass} shrink-0 items-center justify-center rounded-full border border-brand/18 ${colorClass} ${className}`}
    >
      <span className="font-ui tracking-wider text-brand">
        {avatar?.initials ?? "?"}
      </span>
    </div>
  );
};
