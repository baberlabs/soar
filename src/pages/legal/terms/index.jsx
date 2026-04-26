export default function Terms() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-12 md:gap-16">
        <header className="space-y-6">
          <p className="font-ui text-sm tracking-[0.24em] text-brand/60">
            TRANSPARENCY
          </p>
          <h1 className="font-display text-[clamp(3rem,6vw,5rem)] leading-[0.92] text-brand">
            Terms of Peership.
          </h1>
          <p className="max-w-2xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
            You are not a "user" on SOAR; you are a Peer. These terms outline
            how our Community Benefit Society operates, and the rights you hold
            within it.
          </p>
        </header>

        <section className="space-y-6 rounded-4xl border border-brand/12 bg-page p-7 md:p-10">
          <h2 className="font-ui text-3xl text-brand">
            1. Community Benefit Society
          </h2>
          <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            <p>
              SOAR operates as a registered Community Benefit Society. We are
              legally bound to reinvest any surplus back into the platform and
              the community, rather than extracting profits for private
              shareholders.
            </p>
          </div>
        </section>

        <section className="space-y-6 rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-10">
          <h2 className="font-ui text-3xl text-brand">
            2. The £1 Peership Share
          </h2>
          <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            <p>
              To join the platform, you must purchase a lifetime share for £1.
              This transforms you from a consumer into a co-owner of the
              network.
            </p>
            <p>
              While members can choose to donate more to support our operational
              costs,{" "}
              <strong>financial contributions do not buy influence</strong>. The
              system is strictly democratic.
            </p>
          </div>
        </section>

        <section className="space-y-6 rounded-4xl border border-brand/12 bg-page p-7 md:p-10">
          <h2 className="font-ui text-3xl text-brand">
            3. Democratic Governance
          </h2>
          <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            <p>
              The platform is governed by a strict{" "}
              <strong>One-Peer-One-Vote</strong> protocol.
            </p>
            <ul className="space-y-3 pt-2">
              <Bullet text="Peers have the right to propose changes, feature additions, or curriculum updates via the Forum." />
              <Bullet text="Peers vote on active proposals, directly shaping the evolution of the platform." />
              <Bullet text="Governance is functional, not symbolic. Outcomes are visible, documented, and implemented." />
            </ul>
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
