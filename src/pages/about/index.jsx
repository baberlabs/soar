import { Link } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { getButtonClasses } from "../../components/buttonStyles";

export default function About() {
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <article className="mx-auto max-w-6xl space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-4xl border border-brand/15 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-10">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky/45 blur-2xl" />
          <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-yellow/35 blur-2xl" />

          <div className="relative space-y-5">
            <Badge variant="cream">About SOAR</Badge>
            <h1 className="max-w-4xl font-display text-[clamp(3rem,8vw,5.8rem)] leading-[0.9] text-brand">
              A peer-owned platform for people who want progress.
            </h1>
            <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
              Your time online should produce something real. SOAR is designed
              so every interaction in learning, creating, and reflection leaves
              behind something lasting. You complete a session, draft a piece of
              work, clarify a decision, and contribute a view. This platform
              helps you own your growth and shape the system you use.
            </p>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand/12 bg-page p-6 space-y-4">
            <h2 className="font-ui text-3xl text-brand">
              The problem with how we spend time online
            </h2>
            <div className="space-y-3 font-body text-sm leading-relaxed text-brand/76">
              <p>
                Modern platforms optimise for attention rather than outcomes.
                They rely on infinite scrolling, hidden ranking, and engagement
                loops that maximise time spent instead of progress made.
              </p>
              <p>
                You lose focus and your attention fragments. Cognitive overload
                becomes normal. You create less, think less deeply, and lose
                control of your direction. Your time produces little lasting
                value, while your data becomes someone else's asset.
              </p>
              <p>In that model, the platform treats people as the product.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-brand/12 bg-cream p-6 space-y-4">
            <h2 className="font-ui text-3xl text-brand">
              What SOAR prevents by design
            </h2>
            <ul className="space-y-4">
              <Bullet text="Finite, destination-led journeys replace endless feed loops." />
              <Bullet text="Transparent structure replaces hidden ranking systems." />
              <Bullet text="Peer ownership replaces extractive data models." />
              <Bullet text="Shared governance replaces closed roadmap decisions." />
            </ul>
          </div>
        </section>

        {/* The Solution Section */}
        <section className="space-y-6">
          <div className="rounded-3xl border border-brand/12 bg-brand/3 p-6 md:p-8">
            <h2 className="font-ui text-3xl text-brand mb-5">
              SOAR replaces passive consumption with intentional progress
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-ui text-lg text-brand">
                  From scrolling → to completion
                </h3>
                <p className="font-body text-sm text-brand/76">
                  Choose what you want to learn. Follow a structured path.
                  Complete focused sessions instead of drifting through infinite
                  content.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-ui text-lg text-brand">
                  From consumption → to creation
                </h3>
                <p className="font-body text-sm text-brand/76">
                  Every learning session connects to something you create: a
                  draft, a reflection, a project. Your progress is visible. Your
                  work is stored.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-ui text-lg text-brand">
                  From users → to peers
                </h3>
                <p className="font-body text-sm text-brand/76">
                  You join as a peer in a community benefit society. One peer,
                  one share, one vote. You own a stake and hold a clear voice in
                  decisions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-ui text-lg text-brand">
                  From algorithms → to transparency
                </h3>
                <p className="font-body text-sm text-brand/76">
                  Transparent product rules replace hidden optimisation. You
                  decide what matters, and peers shape the platform through
                  visible consensus.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-ui text-lg text-brand">
                  From extraction → to ownership
                </h3>
                <p className="font-body text-sm text-brand/76">
                  Your data is yours. Your learning history is yours. Your
                  creations are yours. Your reflections are yours. You control
                  it all.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-ui text-lg text-brand">
                  From isolation → to meaningful connection
                </h3>
                <p className="font-body text-sm text-brand/76">
                  Connect with peers who share your interests and intentions.
                  Direct collaboration and local community building replace
                  algorithmic matching.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ownership Cards */}
        <section className="space-y-4">
          <h2 className="font-ui text-2xl text-brand">What you own on SOAR</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <AboutCard
              title="Your direction"
              body="You choose subjects intentionally, define your learning path, and decide what to study and when. Your goals guide your time."
            />
            <AboutCard
              title="Your output"
              body="Every session, creation, and reflection is stored as your personal record. Your learning history belongs to you. Your work stays with you, always accessible and portable."
            />
            <AboutCard
              title="The roadmap"
              body="Use the forum to propose ideas and vote on changes. SOAR evolves through peer consensus, and your vote helps decide what comes next."
            />
          </div>
        </section>

        {/* Three Principles */}
        <section className="space-y-4">
          <h2 className="font-ui text-2xl text-brand">
            Built on three core principles
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <PrincipleCard
              title="No Scroll"
              subtitle="Destinations over distraction"
              body="SOAR removes infinite feeds and algorithmic recommendations. All interactions are destination-based: learning sessions, creation spaces, reflection tools, governance areas. You move between purposes, not through endless content."
              to="/principles/no-scroll"
            />
            <PrincipleCard
              title="Data Ownership"
              subtitle="Clarity over lock-in"
              body="You own your learning history, creations, reflections, and identity. Data is treated as personal property, not platform residue. Complete portability. No vendor lock-in. Your information stays yours."
              to="/principles/data-ownership"
            />
            <PrincipleCard
              title="Governance"
              subtitle="Peer voice over black-box systems"
              body="SOAR operates democratically. One peer, one share, one vote. Peers propose ideas. Peers vote on decisions. Outcomes are visible and implemented. Governance is functional, not symbolic."
              to="/principles/governance"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="rounded-3xl border border-brand/12 bg-page p-6 md:p-8 space-y-6">
          <div>
            <h2 className="font-ui text-3xl text-brand mb-2">How SOAR works</h2>
            <p className="font-body text-sm text-brand/76 max-w-2xl">
              SOAR follows a deliberate journey. Understanding comes before
              participation. Ownership underpins participation.
            </p>
          </div>

          <div className="space-y-4">
            <FlowStep
              number="1"
              title="Discover & understand"
              body="Read about SOAR's model and mission. Understand what peer-ownership means."
            />
            <FlowStep
              number="2"
              title="Create your account"
              body="Set up your identity on the platform. Begin your peer journey."
            />
            <FlowStep
              number="3"
              title="Become a peer"
              body="Purchase a £1+ share. You now own a piece of SOAR and have one vote in all decisions."
            />
            <FlowStep
              number="4"
              title="Complete onboarding"
              body="Tell us about your interests. Define your learning preferences. Set your direction."
            />
            <FlowStep
              number="5"
              title="Choose your path"
              body="Select subjects you want to learn. Build your personal curriculum. Own your direction."
            />
            <FlowStep
              number="6"
              title="Learn, create, reflect"
              body="Complete focused learning sessions. Create work. Reflect monthly through vision boards and letters to your future self."
            />
            <FlowStep
              number="7"
              title="Connect with peers"
              body="Find others with shared interests. Collaborate. Build meaningful relationships. Participate in local events."
            />
            <FlowStep
              number="8"
              title="Shape the platform"
              body="Propose ideas. Vote on changes. Participate in governance. Help SOAR evolve based on peer consensus."
            />
          </div>
        </section>

        {/* The Peership Model */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand/12 bg-cream p-6 space-y-4">
            <h2 className="font-ui text-3xl text-brand">The peership model</h2>
            <div className="space-y-3 font-body text-sm leading-relaxed text-brand/76">
              <p>
                SOAR is structured as a community benefit society. It is not
                owned by venture capital or a private company extracting value
                from your attention.
              </p>
              <p>
                <strong className="text-brand/95">
                  Peers own SOAR together.
                </strong>
              </p>
              <div className="bg-brand/5 p-4 rounded-2xl space-y-2 mt-4">
                <p className="font-ui text-sm text-brand font-semibold">
                  How it works:
                </p>
                <ul className="space-y-2">
                  <li>• Minimum entry: £1 share</li>
                  <li>• One peer = one vote</li>
                  <li>• Equal ownership and power</li>
                  <li>• Profits reinvested in the platform</li>
                  <li>• Optional donations support development</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand/12 bg-brand/3 p-6 space-y-4">
            <h2 className="font-ui text-3xl text-brand">
              What this means for you
            </h2>
            <div className="space-y-3 font-body text-sm leading-relaxed text-brand/76">
              <p>
                You are not a customer at the edge of the system. You are an
                owner inside it. Your feedback informs decisions that you help
                make.
              </p>
              <p>
                You do not pay to remove advertising or unlock influence. You
                participate as an equal peer. Your participation funds
                development and keeps the platform aligned with what peers
                value.
              </p>
              <p>
                SOAR succeeds when you succeed through learning, creating,
                growing, and being heard.
              </p>
              <p>
                The platform's success and your wellbeing move in the same
                direction.
              </p>
            </div>
          </div>
        </section>

        {/* What You'll Do */}
        <section className="rounded-3xl border border-brand/12 bg-page p-6 md:p-8 space-y-6">
          <h2 className="font-ui text-3xl text-brand">
            What you'll actually do on SOAR
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-ui text-xl text-brand">Learn deliberately</h3>
              <p className="font-body text-sm text-brand/76">
                Choose subjects that matter to you. Follow structured paths with
                clear outcomes. Complete focused sessions instead of getting
                lost in infinite content. Track your progress. See how far
                you've come.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-ui text-xl text-brand">
                Create tangible work
              </h3>
              <p className="font-body text-sm text-brand/76">
                Every learning session connects to something you create. Write.
                Design. Build. Reflect. Your work is stored as proof of
                progress. You're building a personal body of work, not feeding
                an algorithm.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-ui text-xl text-brand">
                Reflect on your direction
              </h3>
              <p className="font-body text-sm text-brand/76">
                Monthly reflection cycles help you connect past, present, and
                future. Vision boards. Letters to your future self. Intention
                setting. Pause points in a busy life.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-ui text-xl text-brand">
                Connect meaningfully
              </h3>
              <p className="font-body text-sm text-brand/76">
                Find peers who share your interests and intentions. Collaborate.
                Build friendships. Discover local events and workshops.
                Community is intentional and human-led.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-ui text-xl text-brand">
                Participate in governance
              </h3>
              <p className="font-body text-sm text-brand/76">
                Propose ideas for how SOAR should evolve. Vote on changes. See
                your suggestions implemented. Be heard by people with power to
                act on your feedback.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-ui text-xl text-brand">
                Build something real
              </h3>
              <p className="font-body text-sm text-brand/76">
                Unlike platforms built on infinite scroll, SOAR is designed so
                your time produces lasting value. Every session, creation,
                reflection, and conversation moves you forward. That is the
                purpose.
              </p>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="relative overflow-hidden rounded-4xl border border-brand/15 bg-brand/5 p-7 shadow-[0_24px_48px_rgba(75,81,149,0.04)] md:p-10">
          <div className="space-y-6">
            <h2 className="font-ui text-3xl text-brand max-w-2xl">
              Why peer-owned platforms matter
            </h2>

            <div className="space-y-4 font-body text-sm leading-relaxed text-brand/76">
              <p>
                Right now, your attention is a commodity. Your data is
                extracted. Your behaviour is analysed. You're optimised for
                engagement, not wellbeing. The best minds in the world are paid
                to make you spend more time online, regardless of whether it's
                good for you.
              </p>

              <p>
                SOAR is built on a different premise: your time online should
                leave behind something useful. Something you own. Something you
                control. Something that matters.
              </p>

              <p>
                When you act as a peer, the platform's incentives align with
                yours. SOAR succeeds when you learn, create, and grow.
              </p>

              <p>
                Peer-ownership is the only model where a digital platform can
                honestly say: your wellbeing is our success.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-ui text-3xl text-brand">
              Ready to own your growth?
            </h2>
            <p className="font-body text-base text-brand/82 max-w-2xl">
              SOAR is built for people who want to think, create, and grow with
              focus. People who value ownership. People who want to be heard.
              People who believe time online should produce something real.
            </p>
          </div>

          <footer className="flex flex-wrap gap-3">
            <Link
              to="/join"
              className={getButtonClasses({
                variant: "primary",
                fullWidth: false,
              })}
            >
              Become a Peer
            </Link>
          </footer>
        </section>
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

const PrincipleCard = ({ title, subtitle, body, to }) => (
  <Link
    to={to}
    className="block rounded-3xl border border-brand/12 bg-page p-5 transition hover:-translate-y-0.5 hover:border-brand/22 h-full"
  >
    <h3 className="font-ui text-xl text-brand">{title}</h3>
    <p className="mt-1 font-ui text-xs text-brand/65 uppercase tracking-wide">
      {subtitle}
    </p>
    <p className="mt-3 font-body text-sm leading-relaxed text-brand/76">
      {body}
    </p>
  </Link>
);

const FlowStep = ({ number, title, body }) => (
  <div className="flex gap-4">
    <div className="shrink-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/15 font-ui font-semibold text-brand">
        {number}
      </div>
    </div>
    <div className="flex-1">
      <h3 className="font-ui text-lg text-brand">{title}</h3>
      <p className="mt-1 font-body text-sm text-brand/76">{body}</p>
    </div>
  </div>
);

const Bullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.45em] h-1.5 w-1.5 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/76">
      {text}
    </span>
  </li>
);
