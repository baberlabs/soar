const VARIANTS = {
  navy: "bg-navy text-cream",
  yellow: "bg-yellow text-navy",
  sky: "bg-sky text-navy border border-sky/60",
  sage: "bg-sage/10 text-sage border border-sage/40",
  cream: "bg-cream text-navy border border-navy/20",
};

export const Badge = ({ variant = "navy", className = "", children }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-ui text-[0.65rem] tracking-[0.12em] ${VARIANTS[variant]} ${className}`}
  >
    {children}
  </span>
);
