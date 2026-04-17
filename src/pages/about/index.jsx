import { Link } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { getButtonClasses } from "../../components/buttonStyles";

export default function About() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <article className="mx-auto max-w-6xl space-y-10">
        <section className="relative overflow-hidden rounded-4xl border border-brand/15 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-10">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky/45 blur-2xl" />
          <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-yellow/35 blur-2xl" />

          <div className="relative space-y-5">
            <Badge variant="cream">About SOAR</Badge>
            <h1 className="max-w-4xl font-display text-[clamp(3rem,8vw,5.8rem)] leading-[0.9] text-brand">
              A peer-owned platform for people who want progress.
            </h1>
            <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
              SOAR is designed around a simple idea: your time online should
              leave behind something useful. A completed learning session. A
              draft. A reflection. A conversation that moves you forward.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <AboutCard
            title="Own your direction"
            body="Choose subject paths intentionally and complete focused sessions instead of drifting through infinite content."
          />
          <AboutCard
            title="Own your output"
            body="Store reflections, creations, and learning history as your personal record of growth in this local-first prototype."
          />
          <AboutCard
            title="Own the roadmap"
            body="Use the forum to propose and vote on changes so product direction is shaped by peers, not engagement metrics."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-brand/12 bg-cream/85 p-6">
            <h2 className="font-ui text-3xl text-brand">
              What SOAR is built to avoid
            </h2>
            <ul className="mt-5 space-y-4">
              <Bullet text="No endless feed designed to maximize dwell time." />
              <Bullet text="No hidden ranking system deciding what you should care about." />
              <Bullet text="No confusing ownership story where your contribution becomes platform exhaust." />
            </ul>
          </div>

          <div className="rounded-3xl border border-brand/12 bg-cream p-6">
            <h2 className="font-ui text-3xl text-brand">Three principles</h2>
            <div className="mt-5 space-y-3">
              <PrincipleLink
                title="No Scroll"
                body="Destinations over distraction."
                to="/principles/no-scroll"
              />
              <PrincipleLink
                title="Data Ownership"
                body="Clarity over lock-in."
                to="/principles/data-ownership"
              />
              <PrincipleLink
                title="Governance"
                body="Peer voice over black-box roadmaps."
                to="/principles/governance"
              />
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/join"
            className={getButtonClasses({
              variant: "primary",
              fullWidth: false,
            })}
          >
            Join the Platform
          </Link>
        </footer>
      </article>
    </main>
  );
}

const AboutCard = ({ title, body }) => (
  <article className="rounded-3xl border border-brand/12 bg-page p-5">
    <h2 className="font-ui text-2xl text-brand">{title}</h2>
    <p className="mt-3 font-body text-sm leading-relaxed text-brand/76">
      {body}
    </p>
  </article>
);

const PrincipleLink = ({ title, body, to }) => (
  <Link
    to={to}
    className="block rounded-[1.2rem] border border-brand/12 bg-page p-4 transition hover:-translate-y-0.5 hover:border-brand/22"
  >
    <h3 className="font-ui text-xl text-brand">{title}</h3>
    <p className="mt-1 font-body text-sm text-brand/72">{body}</p>
  </Link>
);

const Bullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.45em] h-1.5 w-1.5 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/76">
      {text}
    </span>
  </li>
);
