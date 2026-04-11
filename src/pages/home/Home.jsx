import { Link } from "react-router-dom";

import BackgroundLayer1Image from "../../assets/images/background-layer-1.svg";
import BackgroundLayer2Image from "../../assets/images/background-layer-2.svg";

export const Home = () => (
  <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-16 md:pb-32 md:pt-28">
    <HeroSection />
  </main>
);

/* ── Sections ────────────────────────────────────────────── */

const HeroSection = () => (
  <section className="mx-auto flex max-w-6xl flex-col gap-8">
    <CloudBackground />
    <HeroText />
    <HeroCta />
  </section>
);

const CloudBackground = () => {
  return (
    <div className="pointer-events-none">
      <img
        src={BackgroundLayer1Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 w-full select-none"
      />
      <img
        src={BackgroundLayer2Image}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 w-full select-none"
      />
    </div>
  );
};

const HeroText = () => (
  <div className="flex flex-col gap-4 mt-16">
    <p className="font-ui text-sm tracking-[0.24em] text-brand/60">
      Community-owned learning, making, and connection.
    </p>
    <h1 className="font-display text-[clamp(3.5rem,8vw,6.75rem)] leading-[0.92] text-brand">
      {/* Your Time. Your Terms. Your Growth. */}
      SOAR with us
    </h1>
    <h2 className="max-w-2xl font-ui text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.08] tracking-[0.04em] text-brand/90">
      Learn what excites you. Create what matters. Connect with people who get
      it.
    </h2>
    <p className="max-w-2xl font-body text-base leading-relaxed text-brand/80 md:text-lg">
      SOAR is a community-owned platform built around one idea: your time online
      should leave you with something. A skill learned. Something made. A person
      met. Not just another hour gone.
    </p>
    <p className="max-w-2xl font-body text-base leading-relaxed text-brand/80 md:text-lg">
      You own your data, your content, and your corner of the network. You have
      a vote in how SOAR runs. This place belongs to the people who show up in
      it.
    </p>
    <p className="max-w-2xl font-body text-base leading-relaxed text-brand/80 md:text-lg">
      No feeds. No algorithms pulling you nowhere. Just a clear, quiet space to
      work on what you actually care about.
    </p>
  </div>
);

const HeroCta = () => {
  return (
    <div className="flex flex-row gap-4">
      <Link
        to="/join"
        className="cursor-pointer w-fit rounded-xl bg-navy px-6 py-3 font-ui text-cream border transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(238,237,147,0.35)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Join the Community
      </Link>
      <Link
        to="/about"
        className="cursor-pointer w-fit rounded-xl bg-cream px-6 py-3 font-ui text-navy border border-navy/50 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(238,237,147,0.35)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        See How SOAR Works
      </Link>
    </div>
  );
};
