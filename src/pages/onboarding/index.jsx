import { createElement, useMemo, useState } from "react";
import {
  BookOpenCheck,
  BookOpenText,
  CalendarDays,
  CircleCheck,
  Layers,
  Milestone,
  Route,
  SmilePlus,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { useSOARDispatch, useSOARState } from "../../store";

const ONBOARDING_FLOW_STEPS = [
  { id: "how-soar-works", label: "How SOAR Works", shortLabel: "How" },
  { id: "vark", label: "Session Style", shortLabel: "Style" },
  { id: "interests", label: "Interests", shortLabel: "Interests" },
  { id: "commitment", label: "Rhythm", shortLabel: "Rhythm" },
  { id: "curriculum", label: "Subjects", shortLabel: "Subjects" },
];

const STEP_ORDER = ONBOARDING_FLOW_STEPS.map((flowStep) => flowStep.id);

const SOAR_LOOP_STEPS = [
  {
    phase: "01",
    title: "You joined as a peer",
    body: "You are part of a peer-owned platform where one peer has one vote and your contribution supports shared progress.",
    icon: Route,
  },
  {
    phase: "02",
    title: "Onboarding sets your direction",
    body: "You choose interests and your preferred learning style so SOAR can shape your first curriculum around what matters to you.",
    icon: Milestone,
  },
  {
    phase: "03",
    title: "You build your first curriculum",
    body: "You choose your availability, your subjects, and enter focused sessions with clear outcomes instead of endless feed behaviour.",
    icon: BookOpenText,
  },
  {
    phase: "04",
    title: "Contribute with peers",
    body: "You produce work, review progress monthly, connect with peers, and influence platform direction through shared governance.",
    icon: SmilePlus,
  },
];

const SETUP_OUTCOMES = [
  { label: "Session style", value: "Guidance tuned to you", icon: Layers },
  { label: "Weekly rhythm", value: "A realistic pace", icon: CalendarDays },
  {
    label: "First subjects",
    value: "A dashboard with direction",
    icon: CircleCheck,
  },
];

export default function Onboarding() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("how-soar-works");

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  if (state.user.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  const stepIndex = Math.max(STEP_ORDER.indexOf(step), 0);

  const goToStep = (nextStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0 });
  };

  // Saves a partial user update and either advances to a named next step
  // or, if no next step is given, completes onboarding and lands the
  // peer on the Dashboard.
  const saveAndContinue = (payload, nextStep) => {
    if (payload) {
      dispatch({
        type: "UPDATE_USER",
        payload,
      });
    }

    if (nextStep) {
      goToStep(nextStep);
      return;
    }

    dispatch({
      type: "UPDATE_USER",
      payload: { onboardingComplete: true },
    });
    navigate("/dashboard", { replace: true });
  };

  // Final step handler. Enrols the chosen subjects with a sensible
  // target date derived from sessions-per-week, then completes
  // onboarding and lands on the Dashboard so the curriculum widget
  // is populated on day one.
  const completeWithCurriculum = (selectedSubjects) => {
    const learningStyle = state.user?.learningStyle ?? "general";
    const daysPerWeek = state.user?.daysPerWeek ?? 3;

    selectedSubjects.forEach((subject) => {
      const sessions = subject.lessons?.length ?? 0;
      const weeks = sessions
        ? Math.max(1, Math.ceil(sessions / daysPerWeek))
        : 0;
      const targetDate = weeks ? addWeeksISO(weeks) : "";

      dispatch({
        type: "ADD_CURRICULUM_SUBJECT",
        payload: {
          subjectId: subject.id,
          targetDate,
          learningNotes: "",
          learningStyle,
        },
      });
    });

    dispatch({
      type: "UPDATE_USER",
      payload: { onboardingComplete: true },
    });

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="relative isolate min-h-dvh bg-page">
      <div className="fixed inset-x-0 top-0 z-20 bg-page/85 backdrop-blur-sm">
        <div className="mx-auto max-w-360 px-6 py-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-ui text-[0.72rem] tracking-[0.16em] text-brand/82">
                PEER SETUP
              </p>
              <p className="font-body text-xs text-brand/82">
                Step {stepIndex + 1} of {ONBOARDING_FLOW_STEPS.length}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {ONBOARDING_FLOW_STEPS.map((flowStep, index) => {
                const isActive = flowStep.id === step;
                const isComplete = index < stepIndex;

                return (
                  <div key={flowStep.id} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-400 ${
                        isActive || isComplete ? "bg-brand" : "bg-brand/18"
                      }`}
                    />
                    <p
                      className={`font-body text-[0.62rem] leading-tight sm:text-[0.68rem] ${
                        isActive
                          ? "text-brand"
                          : isComplete
                            ? "text-brand/78"
                            : "text-brand/78"
                      }`}
                    >
                      <span className="sm:hidden">{flowStep.shortLabel}</span>
                      <span className="hidden sm:inline">{flowStep.label}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
        <div className="mx-auto sm:rounded-4xl sm:border sm:border-brand/15 sm:p-6 sm:shadow-[0_24px_48px_rgba(75,81,149,0.08)] sm:backdrop-blur-sm">
          {step === "how-soar-works" ? (
            <OnboardingHowSOARWorks onNext={() => goToStep("vark")} />
          ) : null}

          {step === "vark" ? (
            <OnboardingVARK
              onBack={() => goToStep("how-soar-works")}
              onNext={(learningStyle) =>
                saveAndContinue({ learningStyle }, "interests")
              }
            />
          ) : null}

          {step === "interests" ? (
            <OnboardingInterests
              onBack={() => goToStep("vark")}
              onComplete={(interests) =>
                saveAndContinue({ interests }, "commitment")
              }
            />
          ) : null}

          {step === "commitment" ? (
            <OnboardingCommitment
              initialDays={state.user?.daysPerWeek ?? 3}
              onBack={() => goToStep("interests")}
              onComplete={(daysPerWeek) =>
                saveAndContinue({ daysPerWeek }, "curriculum")
              }
            />
          ) : null}

          {step === "curriculum" ? (
            <OnboardingCurriculum
              interests={state.user?.interests ?? []}
              daysPerWeek={state.user?.daysPerWeek ?? 3}
              subjects={state.subjects ?? []}
              onBack={() => goToStep("commitment")}
              onComplete={completeWithCurriculum}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

const OnboardingHowSOARWorks = ({ onNext }) => (
  <article className="space-y-8">
    <div className="grid gap-8 ">
      <div className="space-y-6">
        <header className="space-y-3">
          <p className="font-ui text-sm tracking-[0.16em] text-brand/82">
            How SOAR works
          </p>
          <h1 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-brand">
            Welcome
          </h1>
          <p className="max-w-3xl font-body text-base leading-relaxed text-brand/75">
            You are now a peer. This is one continous journey from joining
            through onboarding and into your first session.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SOAR_LOOP_STEPS.map((item) => (
            <JourneyItem key={item.phase} {...item} />
          ))}
        </div>
      </div>

      <aside className="rounded-3xl bg-brand p-5 text-cream shadow-[0_20px_42px_rgba(75,81,149,0.16)] md:rounded-3xl md:p-6">
        <p className="font-ui text-xs uppercase tracking-[0.16em] text-cream/72">
          Your setup creates
        </p>
        <h2 className="mt-3 font-display text-[clamp(2.1rem,5vw,3.3rem)] leading-[0.92] text-cream">
          Your curriculum
        </h2>
        <p className="mt-6 font-body text-sm leading-relaxed text-cream/82">
          The next screens only collect signal SOAR can use immediately: session
          style, interests, weekly rhythm, and first subjects.
        </p>
      </aside>
    </div>

    <StepActions>
      <Button fullWidth={false} text="Start Setup" onClick={onNext} />
    </StepActions>
  </article>
);

const OnboardingVARK = ({ onBack, onNext }) => {
  const [answers, setAnswers] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const varkQuestions = useMemo(
    () => [
      {
        id: 1,
        question: "When you are learning something new, what helps first?",
        options: [
          {
            label: "Seeing examples, diagrams, or visual references",
            value: "V",
          },
          {
            label: "Talking it through or hearing someone explain it",
            value: "A",
          },
          { label: "Reading clear written instructions", value: "R" },
          { label: "Trying it yourself and adjusting as you go", value: "K" },
        ],
      },
      {
        id: 2,
        question: "If you need to remember a process, what do you do?",
        options: [
          { label: "Sketch it, map it, or picture it", value: "V" },
          { label: "Say it aloud or discuss it", value: "A" },
          { label: "Write it down in steps", value: "R" },
          { label: "Repeat it physically until it clicks", value: "K" },
        ],
      },
      {
        id: 3,
        question: "What kind of practice keeps you engaged longest?",
        options: [
          { label: "Looking closely at visuals and patterns", value: "V" },
          { label: "Listening, debating, or hearing feedback", value: "A" },
          { label: "Reading, annotating, and drafting", value: "R" },
          { label: "Making, moving, and testing in real time", value: "K" },
        ],
      },
      {
        id: 4,
        question: "When a topic feels hard, what unlocks it?",
        options: [
          { label: "A visual model or worked example", value: "V" },
          { label: "A conversation or explanation", value: "A" },
          { label: "A detailed written breakdown", value: "R" },
          { label: "A concrete exercise or simulation", value: "K" },
        ],
      },
    ],
    [],
  );

  const allAnswered = Object.values(answers).every(Boolean);

  const handleContinue = () => {
    const counts = { V: 0, A: 0, R: 0, K: 0 };
    Object.values(answers).forEach((value) => {
      counts[value] += 1;
    });

    const [learningStyle] = Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )[0];
    onNext(learningStyle);
  };

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-ui text-sm tracking-[0.16em] text-brand/82">
          Session style
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
          How should sessions be shaped for you?
        </h1>
        <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82">
          Choose what helps when a topic is new.
        </p>
      </header>

      <div className="space-y-6">
        {varkQuestions.map((question) => (
          <fieldset key={question.id} className="space-y-3">
            <legend className="font-ui text-lg text-brand">
              {question.question}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {question.options.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 transition ${
                    answers[question.id] === option.value
                      ? "border-brand bg-brand/8"
                      : "border-brand/12 bg-page hover:border-brand/24"
                  }`}
                >
                  <input
                    type="radio"
                    name={`vark-question-${question.id}`}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={(event) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: event.target.value,
                      }))
                    }
                    className="mt-1 accent-brand"
                  />
                  <span className="font-body text-sm leading-relaxed text-brand/80">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <StepActions>
        <Button
          variant="secondary"
          fullWidth={false}
          text="Back"
          onClick={onBack}
        />
        <Button
          fullWidth={false}
          text="Save Preferences"
          onClick={handleContinue}
          disabled={!allAnswered}
        />
      </StepActions>
    </article>
  );
};

const OnboardingInterests = ({ onBack, onComplete }) => {
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState("idle");

  const interests = [
    "Photography",
    "Writing",
    "JavaScript",
    "Meditation",
    "Cooking",
    "Philosophy",
    "Music",
    "Design",
    "Ecology",
    "Gardening",
    "Film",
    "Leadership",
    "AI & Data",
    "Public Speaking",
  ];

  const toggleInterest = (interest) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  };

  const finish = async () => {
    if (selected.size < 3) {
      return;
    }

    setStatus("loading");
    onComplete(Array.from(selected));
  };

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-ui text-sm tracking-[0.16em] text-brand/82">
          Interests
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
          What do you want more time for?
        </h1>
        <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82">
          Choose at least three interests. We will use them to prioritize
          subjects and make the learn library feel less generic on day one.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => {
          const isSelected = selected.has(interest);

          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              aria-pressed={isSelected}
              className={`rounded-[1.25rem] border px-4 py-3 text-left font-body text-sm transition ${
                isSelected
                  ? "border-brand bg-brand text-cream shadow-[0_10px_20px_rgba(75,81,149,0.12)]"
                  : "border-brand/12 bg-page text-brand/78 hover:border-brand/28 hover:text-brand"
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <p className="font-body text-sm text-brand/78">
        {selected.size} selected. Choose at least 3 to unlock your
        recommendations.
      </p>

      <StepActions>
        <Button
          variant="secondary"
          fullWidth={false}
          text="Back"
          onClick={onBack}
        />
        <Button
          fullWidth={false}
          text="Continue"
          status={status}
          loadingText="Saving..."
          onClick={finish}
          disabled={selected.size < 3}
        />
      </StepActions>
    </article>
  );
};

/**
 * Step 4: Commitment.
 * Segmented 1–7 day selector with a dynamic projection beneath it. The
 * projection is intentionally hedged, sessions per subject vary, and
 * peers should not feel committed to a precise calendar before they have
 * done a single session.
 */
const OnboardingCommitment = ({ initialDays, onBack, onComplete }) => {
  const [days, setDays] = useState(initialDays);

  const projection = useMemo(() => projectWeeksRange(days), [days]);

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-ui text-sm tracking-[0.16em] text-brand/82">
          Commitment
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
          How many days a week can you commit?
        </h1>
        <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82">
          Pick a number that feels honest, not aspirational. You can change this
          later. Missing a day is fine.
        </p>
      </header>

      <div
        role="radiogroup"
        aria-label="Days per week commitment"
        className="grid grid-cols-7 gap-2"
      >
        {Array.from({ length: 7 }, (_, index) => index + 1).map((value) => {
          const active = value === days;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setDays(value)}
              className={`rounded-2xl border px-2 py-4 font-ui text-lg transition ${
                active
                  ? "border-brand bg-brand text-cream shadow-[0_8px_18px_rgba(75,81,149,0.18)]"
                  : "border-brand/15 bg-page text-brand/78 hover:border-brand/35 hover:text-brand"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-brand/12 bg-page p-5">
        <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/82">
          Projection
        </p>
        <p className="mt-2 font-body text-base leading-relaxed text-brand/82">
          {formatProjection(days, projection)}
        </p>
        <p className="mt-2 font-body text-xs text-brand/78">
          This is approximate. Sessions vary in length and some subjects are
          shorter than others.
        </p>
      </div>

      <StepActions>
        <Button
          variant="secondary"
          fullWidth={false}
          text="Back"
          onClick={onBack}
        />
        <Button
          fullWidth={false}
          text="Continue"
          onClick={() => onComplete(days)}
        />
      </StepActions>
    </article>
  );
};

/**
 * Step 5: Build Your Curriculum.
 * Filter the subject library by the peer's interests, allow 1–2 picks,
 * then enrol them. Falls back to all subjects when no tag matches so the
 * step is never an empty grid.
 */
const OnboardingCurriculum = ({
  interests,
  daysPerWeek,
  subjects,
  onBack,
  onComplete,
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const filteredSubjects = useMemo(() => {
    const normalized = (interests ?? []).map((tag) =>
      String(tag).trim().toLowerCase(),
    );
    if (normalized.length === 0) return subjects;

    const matches = subjects.filter((subject) =>
      (subject.interestTags ?? []).some((tag) =>
        normalized.includes(String(tag).trim().toLowerCase()),
      ),
    );

    // No tag overlap. Fall back to the full library so the step still works.
    return matches.length > 0 ? matches : subjects;
  }, [subjects, interests]);

  const toggleSubject = (subjectId) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(subjectId)) {
        next.delete(subjectId);
        return next;
      }
      // Cap at 2. Selecting a third quietly does nothing. The disabled
      // visual on remaining cards already signals the limit.
      if (next.size >= 2) return current;
      next.add(subjectId);
      return next;
    });
  };

  const handleStart = () => {
    if (selectedIds.size === 0) return;
    const chosen = subjects.filter((subject) => selectedIds.has(subject.id));
    onComplete(chosen);
  };

  const limitReached = selectedIds.size >= 2;

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="font-ui text-sm tracking-[0.16em] text-brand/82">
          Curriculum
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
          Now let&rsquo;s build your curriculum.
        </h1>
        <p className="max-w-3xl font-body text-base leading-relaxed text-brand/82">
          Pick one or two subjects to start. You can add more from Learn at any
          time.
        </p>
      </header>

      {filteredSubjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand/25 bg-page p-8 text-center">
          <p className="font-body text-sm text-brand/78">
            No subjects available yet. You can pick one later from Learn.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredSubjects.map((subject) => {
            const isSelected = selectedIds.has(subject.id);
            const isDisabled = !isSelected && limitReached;
            const sessions = subject.lessons?.length ?? 0;
            const weeks = sessions
              ? Math.max(1, Math.ceil(sessions / daysPerWeek))
              : null;

            return (
              <SubjectSelectCard
                key={subject.id}
                subject={subject}
                sessions={sessions}
                weeks={weeks}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onToggle={() => toggleSubject(subject.id)}
              />
            );
          })}
        </div>
      )}

      <p className="font-body text-sm text-brand/78">
        {selectedIds.size} of 2 selected.
      </p>

      <StepActions>
        <Button
          variant="secondary"
          fullWidth={false}
          text="Back"
          onClick={onBack}
        />
        <Button
          fullWidth={false}
          text="Start Learning"
          onClick={handleStart}
          disabled={selectedIds.size === 0}
        />
      </StepActions>
    </article>
  );
};

const SubjectSelectCard = ({
  subject,
  sessions,
  weeks,
  isSelected,
  isDisabled,
  onToggle,
}) => {
  const completion = weeks ? formatWeeksFromNow(weeks) : null;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-disabled={isDisabled}
      onClick={isDisabled ? undefined : onToggle}
      className={`flex flex-col gap-3 rounded-3xl border p-5 text-left transition ${
        isSelected
          ? "border-brand bg-brand/8 shadow-[0_12px_28px_rgba(75,81,149,0.12)]"
          : isDisabled
            ? "cursor-not-allowed border-brand/10 bg-page opacity-55"
            : "border-brand/15 bg-page hover:border-brand/35"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-ui text-lg text-brand">{subject.name}</h3>
        <span
          aria-hidden="true"
          className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            isSelected
              ? "border-brand bg-brand text-cream"
              : "border-brand/30 bg-page"
          }`}
        >
          {isSelected ? "✓" : ""}
        </span>
      </div>

      <p className="font-body text-sm leading-relaxed text-brand/78">
        {subject.description}
      </p>

      <div className="flex flex-wrap gap-x-3 gap-y-1 font-body text-xs text-brand/82">
        {sessions ? (
          <span>
            {sessions} session{sessions === 1 ? "" : "s"}
          </span>
        ) : null}
        {completion ? <span aria-hidden="true">·</span> : null}
        {completion ? <span>finish around {completion}</span> : null}
      </div>

      {(subject.interestTags ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(subject.interestTags ?? []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-brand/12 px-2.5 py-0.5 font-body text-[0.68rem] text-brand/82"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
};

const JourneyItem = ({ phase, title, body, icon: Icon }) => (
  <article className="rounded-2xl border border-brand/12 bg-page p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brand/24">
    <div className="flex items-center justify-between gap-3">
      <p className="font-ui text-[0.7rem] uppercase tracking-[0.15em] text-brand/82">
        {phase}
      </p>
      {createElement(Icon, {
        className: "size-5 text-brand/82",
        "aria-hidden": "true",
      })}
    </div>
    <h2 className="mt-3 font-ui text-xl text-brand">{title}</h2>
    <p className="mt-2 font-body text-sm leading-relaxed text-brand/78">
      {body}
    </p>
  </article>
);

const StepActions = ({ children }) => (
  <div className="flex flex-col gap-2 md:flex-row">{children}</div>
);

// ---------- helpers ----------

// Average subject is 4–6 sessions; use the range for the projection.
const TYPICAL_MIN_SESSIONS = 4;
const TYPICAL_MAX_SESSIONS = 6;

const projectWeeksRange = (daysPerWeek) => {
  const safe = Math.max(1, Math.min(7, daysPerWeek));
  return {
    min: Math.max(1, Math.ceil(TYPICAL_MIN_SESSIONS / safe)),
    max: Math.max(1, Math.ceil(TYPICAL_MAX_SESSIONS / safe)),
  };
};

const formatProjection = (days, { min, max }) => {
  const dayLabel = `${days} day${days === 1 ? "" : "s"} a week`;
  if (min === max) {
    return `At ${dayLabel}, a typical subject takes around ${min} week${min === 1 ? "" : "s"}.`;
  }
  return `At ${dayLabel}, a typical subject takes around ${min}–${max} weeks.`;
};

const addWeeksISO = (weeks) => {
  const date = new Date();
  date.setDate(date.getDate() + weeks * 7);
  return date.toISOString();
};

const formatWeeksFromNow = (weeks) => {
  const date = new Date();
  date.setDate(date.getDate() + weeks * 7);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};
