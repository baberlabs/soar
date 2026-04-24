import { Link } from "react-router-dom";

import Logo from "./components/Logo";
import BackgroundLayer1Image from "../../assets/images/background-layer-1.svg";
import BackgroundLayer2Image from "../../assets/images/background-layer-2.svg";
import { LinkButton } from "../../components/LinkButton";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <PageBackground />
      <div className="mx-auto w-full max-w-360 px-6 pb-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24">
          <HeroSection />
          <ProblemSection />
          <WhatSOARChangesSection />
          <NoScrollSection />
          <WhatYouDoSection />
          <DataOwnershipSection />
          <PeershipSection />
          <LearningSection />
          <FinalCtaSection />
        </div>
      </div>
    </main>
  );
}

const PageBackground = () => (
  <div className="pointer-events-none absolute inset-0">
    <img
      src={BackgroundLayer1Image}
      alt=""
      aria-hidden="true"
      className="absolute inset-x-0 top-0 -z-20 w-full select-none"
    />
    <img
      src={BackgroundLayer2Image}
      alt=""
      aria-hidden="true"
      className="absolute inset-x-0 top-0 -z-10 w-full select-none"
    />
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative mx-auto px-6 mt-32 md:py-16 w-full max-w-6xl">
      <div className="max-w-3xl">
        <Logo className="text-brand size-64" />
        <h1 className="font-display text-3xl mb-6">
          YOUR DATA. YOUR RULES. YOUR NETWORK
        </h1>

        <p className="text-xl mb-4">
          SOAR believes that users of digital platforms should be in control of
          their data. We are a pioneer in collective-ownership and open-source
          decentralised networks, imagining a world where users of technology
          have digital autonomy to control their online identity.
        </p>
        <p className="opacity-80 mb-2">
          We believe that technology should be a force for good and utilised for
          nutritional purposes. We refuse to let technology ruin our focus and
          attention by providing users with the opportunity to expand knowledge
          through our personal curriculum lessons, challenging yourselves and
          your brains and as a result watch your potential SOAR.
        </p>
        <p className="opacity-80 mb-6">
          Join to become a <Link to="/terms">peer</Link> of our community and
          become a part of something special with SOAR.
        </p>
        <div className="flex flex-wrap gap-4">
          <LinkButton
            text="Become a Peer (£1)"
            href="/join"
            fullWidth={false}
          />
          <LinkButton
            text="See How SOAR Works"
            href="/about"
            fullWidth={false}
            variant="ghost"
          />
        </div>
      </div>
    </section>
  );
};

const ProblemSection = () => (
  <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
    <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-8">
      <div className="max-w-2xl space-y-5">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">
          The problem with Big Tech
        </h2>
        <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
          <p>
            You go online to do something. You end up stuck in algorithmic
            feeds. Time passes, and nothing gets finished.
          </p>
          <p>
            This passivity isn't accidental. The longer you stay scrolling, the
            more your attention and data are worth to private shareholders.
          </p>
          <div className="rounded-2xl bg-brand/5 p-4 border border-brand/10">
            <p className="font-semibold text-brand">
              According to the ONS, around 1 in 2 adults report little or no
              trust in "Big Tech" companies.
            </p>
            <p className="mt-2">
              More than half strongly state they want more control over their
              identity online. SOAR provides exactly that.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="rounded-4xl border border-brand/12 bg-page p-7 md:p-8">
      <div className="space-y-5">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">
          What their model does
        </h2>
        <ul className="space-y-4">
          <Bullet text="Pushes passive behavioural loops and 'brain rot'." />
          <Bullet text="Turns attention into engagement metrics and revenue." />
          <Bullet text="Collects personal data with zero transparency." />
          <Bullet text="Leaves you with endless activity, but no real progress." />
        </ul>
      </div>
    </div>
  </section>
);

const WhatSOARChangesSection = () => (
  <section className="rounded-4xl border border-brand/12 bg-brand/4 p-7 md:p-9">
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">
          What SOAR changes
        </h2>
        <p className="max-w-xl font-body text-sm leading-relaxed text-brand/78 md:text-base">
          SOAR changes both how you use the platform and how the infrastructure
          works underneath.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ValueCard
          title="From scrolling to completion"
          body="You move through structured sessions instead of endless content loops."
        />
        <ValueCard
          title="From consumption to creation"
          body="You make something instead of only taking things in."
        />
        <ValueCard
          title="From extraction to ownership"
          body="The system does not depend on selling your data or your attention."
        />
        <ValueCard
          title="From users to peers"
          body="You take part in decisions about where the platform goes via shared governance."
        />
      </div>
    </div>
  </section>
);

const NoScrollSection = () => (
  <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <div className="rounded-4xl border border-brand/12 bg-page p-7 md:p-8">
      <div className="space-y-4">
        <p className="font-ui text-sm uppercase tracking-[0.2em] text-brand/55">
          No Scroll
        </p>
        <h2 className="font-ui text-3xl text-brand md:text-4xl">
          Destination-led by design
        </h2>
        <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
          There are no infinite feeds. You choose where you're going, complete
          your session, and finish.
        </p>
      </div>
    </div>
    <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_20px_40px_rgba(75,81,149,0.05)] md:p-8">
      <div className="space-y-5">
        <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
          Each space has a clear purpose. Each session ends. That's what makes
          it easier to focus and decondition from algorithmic control.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <MiniCard label="Learn" />
          <MiniCard label="Create" />
          <MiniCard label="Reflect" />
          <MiniCard label="Connect" />
        </div>
      </div>
    </div>
  </section>
);

const WhatYouDoSection = () => (
  <section className="space-y-6">
    <div className="max-w-2xl space-y-3">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        What you do on SOAR
      </h2>
      <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
        You do more than consume content. You build your potential.
      </p>
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <ActionCard
        title="Build your curriculum"
        body="Choose what you want to learn and shape your own direction through 10-30 min daily sessions."
      />
      <ActionCard
        title="Create as you learn"
        body="Turn sessions into notes, drafts, ideas, and finished pieces of work."
      />
      <ActionCard
        title="Reflect properly"
        body="Pause, think, and achieve self-knowledge. Connect past, present, and future behaviour."
      />
      <ActionCard
        title="Earn Accreditations"
        body="Complete courses to earn verifications backed by DPA and TechUK."
      />
      <ActionCard
        title="Contribute ideas"
        body="Take part in discussions and vote on how the platform should evolve."
      />
      <ActionCard
        title="Control your node"
        body="Manage your IPFS data node. Your identity and work stay entirely in your hands."
      />
    </div>
  </section>
);

const DataOwnershipSection = () => (
  <section className="grid gap-6 lg:grid-cols-2">
    <div className="rounded-4xl border border-brand/12 bg-page p-7 md:p-8">
      <div className="space-y-5">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">Big Tech</h2>
        <ul className="space-y-4">
          <Bullet text="Tracks your activity" />
          <Bullet text="Stores your data centrally" />
          <Bullet text="Uses data to power ads and manipulate behavior" />
          <Bullet text="Keeps control over what you create" />
        </ul>
      </div>
    </div>
    <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_20px_40px_rgba(75,81,149,0.05)] md:p-8">
      <div className="space-y-5">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">SOAR</h2>
        <ul className="space-y-4">
          <Bullet text="Your data is your property" />
          <Bullet text="Your work is yours (stored on your local node)" />
          <Bullet text="There is no advertising model" />
          <Bullet text="Absolute data portability" />
        </ul>
      </div>
    </div>
  </section>
);

const PeershipSection = () => (
  <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
    <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-8">
      <div className="space-y-5">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">Peership</h2>
        <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
          <p>
            SOAR is a community benefit society. You join as an equal co-owner.
          </p>
        </div>
        <div className="rounded-3xl bg-brand/5 p-5">
          <ul className="space-y-3">
            <Bullet text="Minimum entry: £1 share" />
            <Bullet text="One peer = one vote" />
            <Bullet text="Profits are reinvested into the community" />
            <Bullet text="Additional donations do not increase voting power" />
          </ul>
        </div>
      </div>
    </div>
    <div className="rounded-4xl border border-brand/12 bg-page p-7 md:p-8">
      <div className="space-y-5">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">
          Why that matters
        </h2>
        <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
          <p>
            On most platforms, decisions happen above you. Here, governance is
            functional.
          </p>
          <p>
            You can propose ideas in the Forum, vote on developments, and watch
            outcomes be implemented.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const LearningSection = () => (
  <section className="rounded-4xl border border-brand/12 bg-brand/5 p-7 md:p-10">
    <div className="max-w-3xl space-y-5">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        Learning, differently
      </h2>
      <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        <p>
          SOAR provides educational liberation. We don't just focus on technical
          skills; we make space for reflection, self-knowledge, and sustained
          attention.
        </p>
        <p>
          This is life-long, ongoing education designed to unlock a higher
          version of yourself, completely detached from the hyper-speed
          consumption loops of the modern web.
        </p>
      </div>
    </div>
  </section>
);

const FinalCtaSection = () => (
  <section className="rounded-4xl border border-brand/12 bg-page p-7 md:p-10">
    <div className="max-w-3xl space-y-6">
      <div className="space-y-3">
        <h2 className="font-ui text-3xl text-brand md:text-4xl">
          Use your time online to build something real.
        </h2>
        <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
          Join a platform built for focus, ownership, and participation.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <LinkButton text="Become a Peer (£1)" href="/join" fullWidth={false} />
        <LinkButton
          text="Read the Manifesto"
          href="/about"
          fullWidth={false}
          variant="ghost"
        />
      </div>
    </div>
  </section>
);

const Bullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
      {text}
    </span>
  </li>
);

const ValueCard = ({ title, body }) => (
  <article className="rounded-3xl border border-brand/10 bg-page/70 p-5">
    <h3 className="font-ui text-xl text-brand">{title}</h3>
    <p className="mt-2 font-body text-sm leading-relaxed text-brand/76">
      {body}
    </p>
  </article>
);

const MiniCard = ({ label }) => (
  <div className="rounded-2xl border border-brand/10 bg-page px-4 py-4 font-ui text-brand">
    {label}
  </div>
);

const ActionCard = ({ title, body }) => (
  <article className="rounded-3xl border border-brand/12 bg-cream p-5 shadow-[0_12px_24px_rgba(75,81,149,0.04)]">
    <h3 className="font-ui text-xl text-brand">{title}</h3>
    <p className="mt-3 font-body text-sm leading-relaxed text-brand/76">
      {body}
    </p>
  </article>
);
