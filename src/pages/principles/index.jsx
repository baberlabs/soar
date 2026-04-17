import { Link } from "react-router-dom";

import { getButtonClasses } from "../../components/buttonStyles";

const PRINCIPLES = {
  "no-scroll": {
    eyebrow: "Principle",
    title: "No Scroll",
    intro:
      "SOAR is designed around destinations, not endless content. The point is to leave with a skill, a draft, a reflection, or a conversation that mattered.",
    sections: [
      {
        heading: "Why it matters",
        body: "A feed is excellent at giving you the next thing. It is much worse at helping you decide what is worth your time. SOAR keeps the next step small and visible instead of turning attention into an infinite surface.",
      },
      {
        heading: "How it shows up in this prototype",
        body: "You choose a subject, work through short sessions, and see a clear measure of progress. The product has sections and paths, but it avoids an algorithmic home feed on purpose.",
      },
      {
        heading: "What we are protecting",
        body: "Finite time, clearer intent, and a relationship with the product that does not depend on compulsion. The goal is to support momentum, then get out of the way.",
      },
    ],
  },
  "data-ownership": {
    eyebrow: "Principle",
    title: "Data Ownership",
    intro:
      "Peer-owned products should not quietly treat personal work as platform exhaust. Your learning history, creations, reflections, and account data should be legible and movable.",
    sections: [
      {
        heading: "What is true in this prototype",
        body: "This prototype stores data locally in your browser. Signing out ends the active session, and each local account keeps its own private learning data on this device.",
      },
      {
        heading: "What we are building toward",
        body: "The longer-term vision is peer-controlled storage and clearer export paths, so people are not trapped by the platform that helped them start.",
      },
      {
        heading: "What good ownership feels like",
        body: "It means knowing what data exists, why it exists, and how to leave with it. Ownership is less about slogans and more about reducing hidden dependency.",
      },
    ],
  },
  governance: {
    eyebrow: "Principle",
    title: "Governance",
    intro:
      "SOAR is trying to align product decisions with peer needs instead of engagement pressure. Governance is how that alignment stays real over time.",
    sections: [
      {
        heading: "One peer, one vote",
        body: "The forum is where peers can propose changes and cast votes. Influence should come from participation and clarity, not from spending power or proximity to the team.",
      },
      {
        heading: "What this prototype supports",
        body: "Peers can submit proposals, vote once per proposal, and close proposals as authors. It is a small starting point, but it makes decision-making visible instead of implied.",
      },
      {
        heading: "What good governance requires next",
        body: "Published decision rules, clearer moderation responsibilities, and better records of why a change shipped. Governance becomes trustworthy when peers can follow the logic, not just the outcome.",
      },
    ],
  },
};

export default function PrinciplePage({ slug }) {
  const principle = PRINCIPLES[slug];

  if (!principle) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <article className="mx-auto max-w-4xl space-y-10">
        <header className="rounded-4xl border border-brand/15 bg-white/70 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-8">
          <p className="font-ui text-sm tracking-[0.18em] text-brand/60">
            {principle.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.92] text-brand">
            {principle.title}
          </h1>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
            {principle.intro}
          </p>
        </header>

        <div className="grid gap-5">
          {principle.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-[1.75rem] border border-brand/12 bg-cream/80 p-6"
            >
              <h2 className="font-ui text-2xl text-brand">{section.heading}</h2>
              <p className="mt-3 font-body text-base leading-relaxed text-brand/78">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/about"
            className={getButtonClasses({
              variant: "secondary",
              fullWidth: false,
            })}
          >
            Back To About
          </Link>
          <Link
            to="/join"
            className={getButtonClasses({
              variant: "primary",
              fullWidth: false,
            })}
          >
            Try The Peer Flow
          </Link>
        </footer>
      </article>
    </main>
  );
}
