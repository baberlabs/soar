/**
 * Shared shell for dashboard widgets. `flex h-full flex-col` makes the
 * card stretch within its grid cell so adjacent widgets line up at the
 * bottom even when their content heights differ.
 */
export const WidgetCard = ({ children, className = "" }) => (
  <article
    className={`flex h-full flex-col rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)] ${className}`}
  >
    {children}
  </article>
);

export const WidgetHeader = ({ eyebrow, title, aside }) => (
  <header className="flex items-start justify-between gap-3">
    <div>
      <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-ui text-xl text-brand">{title}</h2>
    </div>
    {aside ?? null}
  </header>
);
