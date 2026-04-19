/**
 * Page header. Intentionally lean — no "here is what this section does"
 * prose. Connect's purpose is communicated by the tabs and content below.
 *
 * The atmospheric blur shapes are purely decorative and feel consistent
 * with the rest of the SOAR design language (used on Reflect, Dashboard).
 */
export const ConnectHeader = ({ stats }) => (
  <header className="relative overflow-hidden rounded-4xl border border-brand/18 bg-cream px-6 pt-8 pb-6 shadow-[0_22px_44px_rgba(75,81,149,0.08)] md:px-10 md:pt-10 md:pb-8">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-sky/40 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-yellow/30 blur-3xl"
    />

    <div className="relative flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-brand/55">
          Peer network
        </p>
        <h1 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.92] text-brand">
          Connect
        </h1>
      </div>

      {stats ? (
        <dl className="flex flex-wrap gap-6 font-body text-brand/70">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[0.68rem] uppercase tracking-[0.14em] text-brand/50">
                {label}
              </dt>
              <dd className="mt-0.5 font-ui text-2xl text-brand">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  </header>
);
