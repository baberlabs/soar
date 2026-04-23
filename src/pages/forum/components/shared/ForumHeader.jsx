export const ForumHeader = () => (
  <header className="relative overflow-hidden rounded-4xl border border-brand/18 bg-cream px-6 pt-8 pb-6 shadow-[0_22px_44px_rgba(75,81,149,0.08)] md:px-10 md:pt-10 md:pb-8">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-lavender/40 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-yellow/30 blur-3xl"
    />

    <div className="relative">
      <p className="font-body text-xs uppercase tracking-[0.2em] text-brand/55">
        Governance
      </p>
      <h1 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.92] text-brand">
        Forum
      </h1>
      <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-brand/75">
        Propose, discuss, and vote on how SOAR evolves.
      </p>
    </div>
  </header>
);
