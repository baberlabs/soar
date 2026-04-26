import { Link } from "react-router-dom";
import { LinkButton } from "../../components/LinkButton";
import { useSOARState } from "../../store";

export default function About() {
  const state = useSOARState();

  return (
    <main className="relative min-h-screen bg-page text-brand">
      <div className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24">
          <HeroSection />
          <ManifestoSection />
          <CoreShiftsSection />
          <OriginSection />
          <CurriculumSection />
          <GovernanceSection />
          <AccreditationSection />
          {!state.user && <FinalSection />}
        </div>
      </div>
    </main>
  );
}

/* ── Hero ── */
const HeroSection = () => (
  <section className="space-y-8">
    <div className="soft-enter space-y-6">
      <p className="font-ui text-sm tracking-wider text-brand/55">SOAR</p>
      <h1 className="max-w-4xl font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.2] text-brand">
        Nutritious use, collective-ownership and decentralised networks.
      </h1>
    </div>
    <div className="soft-enter soft-delay-1 max-w-3xl space-y-5 font-body text-base leading-relaxed text-brand/78 md:text-lg">
      <p>
        We imagine a world where users of technology have absolute digital
        autonomy to control their online identity. Technology should be a force
        for good, utilised for nutritional purposes, not passive consumption.
      </p>
      <p className="opacity-85">
        Join a community benefit society where you own a share, hold equal
        voting power, and help shape a platform designed to help you build your
        potential rather than harvest your attention.
      </p>
    </div>
  </section>
);

/* ── Manifesto ── */
const ManifestoSection = () => (
  <section className="soft-enter grid gap-6 md:grid-cols-2">
    <div className="rounded-2xl sm:rounded-4xl border border-brand/12 bg-cream p-4 shadow-[0_24px_48px_rgba(75,81,149,0.06)] sm:p-10">
      <p className="font-ui text-sm tracking-[0.2em] text-brand/50">MISSION</p>
      <h2 className="mt-2 font-ui text-3xl text-brand md:text-4xl">
        What we do
      </h2>
      <p className="mt-5 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        To create a digital platform that challenges the current market. Rather
        than encouraging mindless scrolling and easily accessible solutions,
        SOAR empowers users to take control into their own hands, helping to
        unlock their potential while engaging in mentally stimulating
        activities.
      </p>
    </div>

    <div className="rounded-2xl sm:rounded-4xl border border-brand/12 bg-page p-4 sm:p-10">
      <p className="font-ui text-sm tracking-[0.2em] text-brand/50">VISION</p>
      <h2 className="mt-2 font-ui text-3xl text-brand md:text-4xl">
        Where we're going
      </h2>
      <p className="mt-5 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        SOAR envisions a world where digital platforms prioritise collective
        ownership over private profit, encouraging individuals to take back
        agency and drive change in the digital sphere of social networking
        platforms for the future.
      </p>
    </div>
  </section>
);

/* ── Core Shifts ── */
const CoreShiftsSection = () => (
  <section className="soft-enter rounded-2xl sm:rounded-4xl border border-brand/12 bg-brand/5 p-4 md:p-10">
    <div className="space-y-6">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        The Five Core Shifts
      </h2>
      <p className="max-w-2xl font-body text-sm leading-relaxed text-brand/78 md:text-base">
        SOAR replaces passive consumption with structured, intentional use. The
        platform is designed around five non-negotiable architectural shifts:
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-4">
        <ShiftCard from="Scrolling" to="Completion" />
        <ShiftCard from="Consumption" to="Creation" />
        <ShiftCard from="Users" to="Peers" />
        <ShiftCard from="Central Control" to="Shared Governance" />
        <ShiftCard from="Data Extraction" to="Data Ownership" />
      </div>
    </div>
  </section>
);

const ShiftCard = ({ from, to }) => (
  <div className="rounded-xl sm:rounded-2xl border border-brand/10 bg-page p-3 sm:p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand/10">
    <p className="font-body text-xs text-brand/55 uppercase tracking-wider">
      From
    </p>
    <p className="mt-1 font-ui text-lg text-brand/70 line-through decoration-rose-400/60">
      {from}
    </p>
    <p className="mt-4 font-body text-xs text-brand/55 uppercase tracking-wider">
      To
    </p>
    <p className="mt-1 font-ui text-xl text-brand">{to}</p>
  </div>
);

/* ── Origin ── */
const OriginSection = () => (
  <section className="soft-enter rounded-2xl sm:rounded-4xl border border-brand/12 bg-page p-4 md:p-10">
    <div className="max-w-3xl space-y-8">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        How the idea came about
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <OriginCard
          number="01"
          title="Challenging Passivity"
          body="To combat the detrimental effects of 'brain rot' and the accelerated use of passive AI, SOAR constantly challenges consumers to engage in deliberate activities. We encourage users to exercise autonomy rather than lapsing into passivity."
        />
        <OriginCard
          number="02"
          title="A Secure Creative Outlet"
          body="We wanted to offer a space where users have absolute trust in the system, making them comfortable to creatively engage their brains and achieve true freedom of expression."
        />
        <OriginCard
          number="03"
          title="Create Community"
          body="Community is as important as ever as society navigates an unpredictable social, political and economic environment. Through its collective ownership, SOAR provides users with a community working together towards important common goals."
        />
        <OriginCard
          number="04"
          title="Big Tech Distrust"
          body="According to the ONS, around 1 in 2 adults report little or no trust in 'Big Tech' companies, with more than half strongly stating they want more control over their online identity. SOAR provides a space away from extractive platforms, giving the power back to the individual."
        />
      </div>
    </div>
  </section>
);

const OriginCard = ({ number, title, body }) => (
  <div className="rounded-xl sm:rounded-2xl border border-brand/10 bg-cream p-3 sm:p-6 shadow-[0_8px_24px_rgba(75,81,149,0.04)]">
    <p className="font-ui text-2xl tracking-[0.18em] text-brand/30">{number}</p>
    <h3 className="mt-2 font-ui text-xl text-brand">{title}</h3>
    <p className="mt-3 font-body text-sm leading-relaxed text-brand/78">
      {body}
    </p>
  </div>
);

/* ── Curriculum ── */
const CurriculumSection = () => (
  <section className="soft-enter grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
    <div className="rounded-2xl sm:rounded-4xl border border-brand/12 bg-cream p-4 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-10">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        A Radical & Inclusive Curriculum
      </h2>
      <div className="mt-6 space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        <p>
          SOAR values run deeper than expanding surface-level knowledge. Our
          curriculum addresses topics currently ignored by traditional education
          but deeply linked to the human condition: fundamental, universal, and
          timeless practices like meditation and deep self-knowledge.
        </p>
        <p>
          This model aims to provide users with{" "}
          <strong>educational liberation</strong>. By aligning with this radical
          alternative, SOAR fosters an educational shift that propels users
          toward freedom and full awareness of the self. We embrace full
          consciousness, wisdom, and mastery in both personal and professional
          competencies.
        </p>
        <p>
          Our personal curriculum champions "life-long" and "ongoing" education.
          We challenge users to learn not just for the sake of hitting a
          milestone, but to constantly engage their brains and unlock a higher
          version of themselves.
        </p>
        <p>
          We believe education should pay attention to what is most important to
          human beings, not just what is given weight by a productivity-obsessed
          society. We champion the wing of our inner life: deconditioning
          individuals from Big Tech algorithmic control and awakening
          consciousness from "brain rotting" platforms.
        </p>
      </div>
    </div>

    <div className="relative isolate overflow-hidden rounded-2xl sm:rounded-4xl border border-brand/15 bg-navy px-4 py-5 sm:px-7 sm:py-8 shadow-[0_30px_60px_rgba(75,81,149,0.25)] md:px-10 md:py-10">
      <div className="relative z-10">
        <p className="font-ui text-sm tracking-[0.22em] text-cream/55">
          LEARNING PARAMETERS
        </p>
        <h3 className="mt-4 font-ui text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[0.95] text-cream">
          Built for rhythm, clarity, and long-term growth.
        </h3>
        <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-cream/75 md:text-base">
          Every learning path is structured to feel sustainable: short daily
          focus, deliberate time horizons, and visual environments that keep
          progress tangible.
        </p>

        <ul className="mt-8 grid gap-3">
          <LearningParameterCard
            index="01"
            label="Daily cadence"
            value="10–30 min"
            detail="Focused sessions that fit real routines without dissolving attention."
            accentClass="border-yellow/35 bg-yellow/15 text-yellow"
          />
          <LearningParameterCard
            index="02"
            label="Course arc"
            value="1–3 months"
            detail="Deliberate, finite journeys with enough time for depth and retention."
            accentClass="border-sky/35 bg-sky/15 text-sky"
          />
          <LearningParameterCard
            index="03"
            label="Learning horizon"
            value="Lifelong"
            detail="Education designed as an ongoing practice, not a one-off milestone."
            accentClass="border-cream/25 bg-cream/10 text-cream"
          />
          <LearningParameterCard
            index="04"
            label="Environment"
            value="Visual-first"
            detail="High-visual learning spaces that make ideas easier to grasp and revisit."
            accentClass="border-lavender/35 bg-lavender/15 text-lavender"
          />
        </ul>
      </div>
    </div>
  </section>
);

const LearningParameterCard = ({
  index,
  label,
  value,
  detail,
  accentClass,
}) => (
  <li className="rounded-xl sm:rounded-2xl border border-white/14 bg-white/10 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.15)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/14">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-ui text-[0.7rem] tracking-[0.18em] text-cream/50">
          {label}
        </p>
        <p className="mt-2 font-ui text-2xl leading-none text-cream">{value}</p>
      </div>
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-ui text-xs tracking-[0.12em] ${accentClass}`}
      >
        {index}
      </span>
    </div>
    <p className="mt-2 font-body text-sm leading-relaxed text-cream/70">
      {detail}
    </p>
  </li>
);

/* ── Governance ── */
const GovernanceSection = () => (
  <section className="soft-enter grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
    <div className="rounded-2xl sm:rounded-4xl border border-brand/12 bg-cream p-4 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-10">
      <p className="font-ui text-sm tracking-[0.2em] text-brand/50">PEERSHIP</p>
      <h2 className="mt-2 font-ui text-3xl text-brand md:text-4xl">
        Collective ownership
      </h2>
      <div className="mt-6 space-y-5 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        <p>
          SOAR is a Community Benefit Society. You join as an equal co-owner,
          not a user. Governance is functional and transparent.
        </p>
      </div>
      <div className="mt-6 rounded-xl sm:rounded-2xl bg-brand/5 p-4 sm:p-6 border border-brand/10">
        <ul className="space-y-3">
          <Bullet text="Minimum entry: £1 share" />
          <Bullet text="One peer = one vote" />
          <Bullet text="Profits are reinvested into the community" />
          <Bullet text="Additional donations do not increase voting power" />
        </ul>
      </div>
    </div>

    <div className="rounded-2xl sm:rounded-4xl border border-brand/12 bg-page p-4 md:p-10">
      <p className="font-ui text-sm tracking-[0.2em] text-brand/50">
        WHY THAT MATTERS
      </p>
      <h2 className="mt-2 font-ui text-3xl text-brand md:text-4xl">
        Decisions happen with you, not above you
      </h2>
      <div className="mt-6 space-y-5 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        <p>
          On most platforms, decisions are made behind closed doors. Here,
          governance is open. You can propose ideas in the Forum, vote on
          developments, and watch outcomes be implemented.
        </p>
        <p>
          This structure ensures the platform serves its community first. Every
          feature, every change, and every direction is shaped by the people who
          actually use it.
        </p>
      </div>
      <div className="mt-6 rounded-xl sm:rounded-3xl border border-brand/10 bg-cream p-4 sm:p-6">
        <p className="font-ui text-lg text-brand">
          "Your data is your property. Your voice is your power."
        </p>
      </div>
    </div>
  </section>
);

/* ── Accreditation ── */
const AccreditationSection = () => (
  <section className="soft-enter rounded-2xl sm:rounded-4xl border border-brand/12 bg-brand/5 p-4 md:p-10">
    <div className="max-w-3xl space-y-5">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        Accreditation & Real-World Value
      </h2>
      <div className="space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        <p>
          As a charitable Community Benefit Society, SOAR actively works with
          organisations that have a strong social purpose, such as the{" "}
          <strong>DPA, TechUK</strong>, and the government's{" "}
          <strong>IT Reuse for Good Charter</strong>.
        </p>
        <p>
          Because of these verifications, the time you spend on SOAR carries
          real-world weight. Upon completing a learning journey, you will be
          awarded an accreditation for your time spent developing that skill.
          This qualification can be exported and used in other areas of your
          professional life.
        </p>
      </div>
    </div>
  </section>
);

/* ── Final CTA ── */
const FinalSection = () => (
  <section className="soft-enter space-y-6">
    <div className="max-w-2xl space-y-3">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        Ready to take back your agency?
      </h2>
      <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
        Join a community working together towards meaningful, common goals. Own
        your data. Own your time. Own your future.
      </p>
    </div>
    <LinkButton text="Become a Peer (£1)" href="/join" fullWidth={false} />
  </section>
);

/* ── Shared Components ── */
const Bullet = ({ text }) => (
  <li className="flex gap-3">
    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/65" />
    <span className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
      {text}
    </span>
  </li>
);
