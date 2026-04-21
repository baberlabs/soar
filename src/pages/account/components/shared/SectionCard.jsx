/**
 * Consistent wrapper for a titled section on an account tab. Keeps spacing
 * and borders uniform across every tab so the page feels coherent even
 * though different tabs render very different content.
 */
export const SectionCard = ({ title, description, children, action, className = "" }) => (
  <section
    className={`rounded-3xl border border-brand/15 bg-cream p-6 shadow-[0_14px_36px_rgba(75,81,149,0.05)] md:p-7 ${className}`}
  >
    {(title || action) && (
      <header className="flex flex-wrap items-start justify-between gap-3">
        {title && (
          <div className="min-w-0">
            <h2 className="font-ui text-xl tracking-[0.02em] text-brand">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 max-w-xl font-body text-sm text-brand/65">
                {description}
              </p>
            ) : null}
          </div>
        )}
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
    )}
    <div className={title ? "mt-5" : ""}>{children}</div>
  </section>
);
