export default function Accessibility() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 md:gap-16">
        <header className="space-y-6">
          <p className="font-ui text-sm tracking-[0.24em] text-brand/60">
            TRANSPARENCY
          </p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] text-brand">
            Accessibility Statement.
          </h1>
          <p className="max-w-2xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
            Accessibility is a core requirement of SOAR, not an afterthought. We
            are building a platform that is inclusive across disability,
            neurodivergence, and cognitive load limits.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-8">
            <h2 className="font-ui text-2xl text-brand md:text-3xl">
              Technical Standards
            </h2>
            <div className="mt-4 space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
              <p>
                We are actively working to ensure the SOAR platform meets the{" "}
                <strong>WCAG 2.1 AA</strong> standard. Our current technical
                commitments include:
              </p>
              <ul className="space-y-3 pt-2">
                <Bullet text="Full keyboard navigation across all interactive elements." />
                <Bullet text="Semantic HTML structure to support screen readers." />
                <Bullet text="High-contrast color palettes (tested for WCAG AA compliance)." />
                <Bullet text="Descriptive alt-text mandatory for all visual assets." />
              </ul>
            </div>
          </div>

          <div className="rounded-4xl border border-brand/12 bg-page p-7 md:p-8">
            <h2 className="font-ui text-2xl text-brand md:text-3xl">
              Cognitive Accessibility
            </h2>
            <div className="mt-4 space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
              <p>
                Standard social media relies on behavioral loops that overwhelm
                the brain. We consider cognitive load to be a major
                accessibility issue.
              </p>
              <ul className="space-y-3 pt-2">
                <Bullet text="No infinite scrolling or auto-playing feeds." />
                <Bullet text="Clear, predictable destination-based navigation." />
                <Bullet text="Simplified, plain-English language across all platform copy." />
                <Bullet text="Calm visual design to reduce sensory overload." />
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const Bullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
      {text}
    </span>
  </li>
);
