import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button } from "../../components/Button";
import { useSOARDispatch, useSOARState } from "../../store";

const STEP_ORDER = ["welcome", "setup", "vark", "interests"];

export default function Onboarding() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("welcome");

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  if (state.user.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  const stepIndex = STEP_ORDER.indexOf(step);

  const saveAndContinue = (payload, nextStep) => {
    if (payload) {
      dispatch({
        type: "UPDATE_USER",
        payload,
      });
    }

    if (nextStep) {
      setStep(nextStep);
      return;
    }

    dispatch({
      type: "UPDATE_USER",
      payload: { onboardingComplete: true },
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="relative isolate min-h-dvh bg-page">
      <div className="fixed inset-x-0 top-0 z-20 bg-page/85 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-ui text-[0.72rem] tracking-[0.16em] text-brand/58">
                Peer setup
              </p>
              <p className="mt-1 font-body text-sm text-brand/72">
                Step {stepIndex + 1} of {STEP_ORDER.length}
              </p>
            </div>
            <div className="flex max-w-sm flex-1 gap-2">
              {STEP_ORDER.map((currentStep, index) => (
                <div
                  key={currentStep}
                  className={`h-1 flex-1 rounded-full ${
                    index <= stepIndex ? "bg-brand" : "bg-brand/16"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
        <div className="mx-auto max-w-4xl rounded-4xl border border-brand/15 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-8">
          {step === "welcome" ? (
            <OnboardingWelcome onNext={() => setStep("setup")} />
          ) : null}

          {step === "setup" ? (
            <OnboardingSetup
              onBack={() => setStep("welcome")}
              onNext={() => setStep("vark")}
            />
          ) : null}

          {step === "vark" ? (
            <OnboardingVARK
              onBack={() => setStep("setup")}
              onNext={(learningStyle) =>
                saveAndContinue({ learningStyle }, "interests")
              }
            />
          ) : null}

          {step === "interests" ? (
            <OnboardingInterests
              onBack={() => setStep("vark")}
              onComplete={(interests) => saveAndContinue({ interests })}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

const OnboardingWelcome = ({ onNext }) => (
  <article className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
    <div className="space-y-5">
      <div className="space-y-4">
        <p className="font-ui text-sm tracking-[0.16em] text-brand/58">
          Welcome
        </p>
        <h1 className="font-display text-[clamp(3rem,7vw,5rem)] leading-[0.92] text-brand">
          Welcome to SOAR.
        </h1>
        <p className="max-w-2xl font-body text-base leading-relaxed text-brand/82 md:text-lg">
          This short setup gives your account a real starting point: a learning
          preference, a few interests, and enough context to recommend useful
          subjects instead of generic content.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SetupCard
          title="Set direction"
          body="Choose a few interests so the library starts in the right neighborhood."
        />
        <SetupCard
          title="Pick a learning style"
          body="We use a lightweight preference check to shape how guidance feels."
        />
        <SetupCard
          title="Start a path"
          body="After setup, you can choose a subject and complete your first session right away."
        />
      </div>
    </div>

    <aside className="rounded-[1.75rem] border border-brand/12 bg-page p-5">
      <h2 className="font-ui text-2xl text-brand">What happens next</h2>
      <ol className="mt-4 space-y-4">
        <StepListItem
          number="01"
          text="Choose how you like to learn and what currently interests you."
        />
        <StepListItem
          number="02"
          text="Open a subject room, set a target date, and unlock your first session."
        />
        <StepListItem
          number="03"
          text="Track progress honestly, then capture what you made or learned."
        />
      </ol>
      <Button className="mt-6" text="Begin Setup" onClick={onNext} />
    </aside>
  </article>
);

const OnboardingSetup = ({ onBack, onNext }) => (
  <article className="space-y-8">
    <header className="space-y-3">
      <p className="font-ui text-sm tracking-[0.16em] text-brand/58">
        How this works
      </p>
      <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
        A calmer setup, not a personality test.
      </h1>
      <p className="max-w-3xl font-body text-base leading-relaxed text-brand/78">
        We are not trying to define you permanently. We just need enough signal
        to recommend better starting points than a blank dashboard or an endless
        feed.
      </p>
    </header>

    <div className="grid gap-4 md:grid-cols-3">
      <SetupCard
        title="Short"
        body="Four steps, a few minutes, and no hidden scoring beyond what you can see."
      />
      <SetupCard
        title="Editable"
        body="You can update your interests and profile later as your focus changes."
      />
      <SetupCard
        title="Grounded"
        body="The goal is to get you to a useful subject room quickly, not keep you onboarding."
      />
    </div>

    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        fullWidth={false}
        text="Back"
        onClick={onBack}
      />
      <Button fullWidth={false} text="Continue" onClick={onNext} />
    </div>
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
        <p className="font-ui text-sm tracking-[0.16em] text-brand/58">
          Learning style
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
          How do you like to learn?
        </h1>
        <p className="max-w-3xl font-body text-base leading-relaxed text-brand/78">
          This is a lightweight preference check, not a fixed identity. We use
          it to shape how a subject room introduces practice and reflection.
        </p>
      </header>

      <div className="space-y-6">
        {varkQuestions.map((question) => (
          <fieldset key={question.id} className="space-y-3">
            <legend className="font-ui text-lg text-brand">
              {question.question}
            </legend>
            <div className="grid gap-3">
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

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          fullWidth={false}
          text="Back"
          onClick={onBack}
        />
        <Button
          fullWidth={false}
          text="Save And Continue"
          onClick={handleContinue}
          disabled={!allAnswered}
        />
      </div>
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
        <p className="font-ui text-sm tracking-[0.16em] text-brand/58">
          Interests
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6vw,4.2rem)] leading-[0.94] text-brand">
          What do you want more time for?
        </h1>
        <p className="max-w-3xl font-body text-base leading-relaxed text-brand/78">
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
              className={`rounded-[1.25rem] border px-4 py-3 text-left font-body text-sm transition ${
                isSelected
                  ? "border-brand bg-brand/8 text-brand"
                  : "border-brand/12 bg-page text-brand/72 hover:border-brand/24"
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <p className="font-body text-sm text-brand/65">
        {selected.size} selected. Choose at least 3 to unlock your
        recommendations.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          fullWidth={false}
          text="Back"
          onClick={onBack}
        />
        <Button
          fullWidth={false}
          text="Finish Setup"
          status={status}
          loadingText="Saving..."
          onClick={finish}
          disabled={selected.size < 3}
        />
      </div>
    </article>
  );
};

const SetupCard = ({ title, body }) => (
  <article className="rounded-3xl border border-brand/12 bg-page p-4">
    <h2 className="font-ui text-xl text-brand">{title}</h2>
    <p className="mt-2 font-body text-sm leading-relaxed text-brand/72">
      {body}
    </p>
  </article>
);

const StepListItem = ({ number, text }) => (
  <li className="flex gap-4">
    <span className="font-ui text-sm tracking-[0.14em] text-brand/55">
      {number}
    </span>
    <span className="font-body text-sm leading-relaxed text-brand/75">
      {text}
    </span>
  </li>
);
