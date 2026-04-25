import { Link } from "react-router-dom";
import { LinkButton } from "../../components/LinkButton";
import { useSOARState } from "../../store";

export default function About() {
  const state = useSOARState();
  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:gap-24">
        <HeroSection />
        <ManifestoSection />
        <CoreShiftsSection />
        <OriginSection />
        <CurriculumSection />
        <AccreditationSection />
        {!state.user && <FinalSection />}
      </div>
    </main>
  );
}

const HeroSection = () => (
  <section className="space-y-6">
    <p className="font-ui text-sm tracking-[0.24em] text-brand/60">
      YOUR DATA. YOUR RULES. YOUR NETWORK.
    </p>
    <h1 className="max-w-4xl font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-brand">
      SOAR is a pioneer in collective-ownership and decentralised networks.
    </h1>
    <div className="max-w-2xl space-y-4 font-body text-base leading-relaxed text-brand/82 md:text-lg">
      <p>
        We imagine a world where users of technology have absolute digital
        autonomy to control their online identity. Technology should be a force
        for good, utilised for nutritional purposes, not passive consumption.
      </p>
    </div>
  </section>
);

const ManifestoSection = () => (
  <section className="grid gap-6 md:grid-cols-2">
    <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-10">
      <h2 className="font-ui text-2xl text-brand md:text-3xl">Mission</h2>
      <p className="mt-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        To create a digital platform that challenges the current market. Rather
        than encouraging mindless scrolling and easily accessible solutions,
        SOAR empowers users to take control into their own hands, helping to
        unlock their potential while engaging in mentally stimulating
        activities.
      </p>
    </div>

    <div className="rounded-4xl border border-brand/12 bg-page p-7 md:p-10">
      <h2 className="font-ui text-2xl text-brand md:text-3xl">Vision</h2>
      <p className="mt-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
        SOAR envisions a world where digital technology and platforms prioritise
        collective ownership over private, encouraging individuals to take back
        agency and drive change in the digital sphere of social networking
        platforms for the future.
      </p>
    </div>
  </section>
);

const CoreShiftsSection = () => (
  <section className="rounded-4xl border border-brand/12 bg-brand/5 p-7 md:p-10">
    <div className="space-y-6">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        The Five Core Shifts
      </h2>
      <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
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
  <div className="rounded-2xl border border-brand/10 bg-page p-4">
    <p className="font-body text-xs text-brand/60 uppercase tracking-wider">
      From
    </p>
    <p className="font-ui text-lg text-brand/80 line-through decoration-rose-500/50">
      {from}
    </p>
    <p className="mt-2 font-body text-xs text-brand/60 uppercase tracking-wider">
      To
    </p>
    <p className="font-ui text-xl text-brand">{to}</p>
  </div>
);

const OriginSection = () => (
  <section className="rounded-4xl border border-brand/12 bg-page p-7 md:p-10">
    <div className="max-w-3xl space-y-6">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        How the idea came about
      </h2>

      <div className="space-y-6 pt-2">
        <div>
          <h3 className="font-ui text-xl text-brand">
            1. Challenging Passivity
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            To combat the detrimental effects of 'brain rot' and the accelerated
            use of passive AI, SOAR constantly challenges consumers to engage in
            deliberate activities. We encourage users to exercise autonomy
            rather than lapsing into passivity.
          </p>
        </div>

        <div>
          <h3 className="font-ui text-xl text-brand">
            2. A Secure Creative Outlet
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            We wanted to offer a space where users have absolute trust in the
            system, making them comfortable to creatively engage their brains
            and achieve true freedom of expression.
          </p>
        </div>

        <div>
          <h3 className="font-ui text-xl text-brand">3. Create Community</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            Community is as important as ever as society navigates an
            unpredictable social, political and economic environment. Through
            its collective ownership, SOAR is aiming to provides users with a
            community that is working together towards important common goals to
            have a positive impact on society.
          </p>
        </div>

        <div>
          <h3 className="font-ui text-xl text-brand">4. Big Tech Distrust</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-brand/78 md:text-base">
            According to the ONS, around{" "}
            <strong>
              1 in 2 adults report little or no trust in "Big Tech" companies
            </strong>
            , with more than half strongly stating they want more control over
            their online identity. SOAR provides a space away from extractive
            platforms, giving the power back to the individual.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CurriculumSection = () => (
  <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div className="rounded-4xl border border-brand/12 bg-cream p-7 shadow-[0_24px_48px_rgba(75,81,149,0.06)] md:p-10">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        A Radical & Inclusive Curriculum
      </h2>
      <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-brand/78 md:text-base">
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
          consciousness from 'brain rotting' platforms.
        </p>
      </div>
    </div>

    <div className="relative isolate overflow-hidden rounded-4xl border border-brand/15 bg-brand px-7 py-7 shadow-[0_30px_60px_rgba(75,81,149,0.2)] md:px-10 md:py-10">
      <div className="relative">
        <p className="font-ui text-sm tracking-[0.22em] text-brand-on/58">
          LEARNING PARAMETERS
        </p>
        <h3 className="mt-4 text-balance font-ui text-[clamp(2.25rem,4vw,3.25rem)] leading-[0.9] text-brand-on">
          Built for rhythm, clarity, and long-term growth.
        </h3>
        <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-brand-on/78 md:text-base">
          Every learning path is structured to feel sustainable: short daily
          focus, deliberate time horizons, and visual environments that keep
          progress tangible.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          <LearningParameterCard
            index="01"
            label="Daily cadence"
            value="10-30 min"
            detail="Focused sessions that fit real routines without dissolving attention."
            accentClass="border-yellow/35 bg-yellow/15 text-yellow"
          />
          <LearningParameterCard
            index="02"
            label="Course arc"
            value="1-3 months"
            detail="Deliberate, finite journeys with enough time for depth and retention."
            accentClass="border-sky/35 bg-sky/15 text-sky"
          />
          <LearningParameterCard
            index="03"
            label="Learning horizon"
            value="Lifelong"
            detail="Education designed as an ongoing practice, not a one-off milestone."
            accentClass="border-brand-on/25 bg-brand-on/10 text-brand-on"
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
  <li className="rounded-3xl border border-white/14 bg-white/10 p-4 shadow-[0_14px_30px_rgba(20,24,54,0.12)] backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/14">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-ui text-[0.7rem] tracking-[0.18em] text-brand-on/55">
          {label}
        </p>
        <p className="mt-2 font-ui text-3xl leading-none text-brand-on">
          {value}
        </p>
      </div>
      <span
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border font-ui text-sm tracking-[0.12em] ${accentClass}`}
      >
        {index}
      </span>
    </div>
    <p className="mt-3 font-body text-sm leading-relaxed text-brand-on/78">
      {detail}
    </p>
  </li>
);

const AccreditationSection = () => (
  <section className="rounded-4xl border border-brand/12 bg-brand/5 p-7 md:p-10">
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

const FinalSection = () => (
  <section className="space-y-6">
    <div className="max-w-2xl space-y-3">
      <h2 className="font-ui text-3xl text-brand md:text-4xl">
        Ready to take back your agency?
      </h2>
      <p className="font-body text-sm leading-relaxed text-brand/78 md:text-base">
        Join a community working together towards meaningful, common goals.
      </p>
    </div>
    <LinkButton text="Become a Peer (£1)" href="/join" fullWidth={false} />
  </section>
);
