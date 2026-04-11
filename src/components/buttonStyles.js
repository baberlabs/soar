const VARIANT_CLASSES = {
  primary:
    "bg-brand text-cream shadow-[0_16px_32px_rgba(75,81,149,0.14)] hover:bg-brand/90 hover:shadow-[0_20px_36px_rgba(75,81,149,0.18)]",
  secondary:
    "border border-brand/25 bg-transparent text-brand hover:bg-brand/5",
  ghost: "bg-brand/8 text-brand hover:bg-brand/12",
  cream:
    "border border-brand/15 bg-cream text-brand hover:border-brand/35 hover:bg-cream/80",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const SIZE_CLASSES = {
  sm: "min-h-10 px-4 py-2 text-sm tracking-[0.06em]",
  md: "min-h-11 px-6 py-3 text-base tracking-[0.08em]",
  lg: "min-h-12 px-7 py-3.5 text-base tracking-widest",
};

export const getButtonClasses = ({
  variant = "primary",
  size = "md",
  fullWidth = true,
  className = "",
}) =>
  [
    "inline-flex items-center justify-center rounded-full font-ui transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-55",
    "active:scale-[0.98]",
    fullWidth ? "w-full" : "w-auto",
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    className,
  ].join(" ");
