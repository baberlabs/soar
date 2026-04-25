import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { getButtonClasses } from "../../components/buttonStyles";
import { getSubjectById } from "../../data/subjects";
import { useSOARDispatch, useSOARState } from "../../store";

import {
  Brain,
  Camera,
  ChefHat,
  Code2,
  Leaf,
  Mic,
  Palette,
  PenLine,
  Sparkles,
} from "lucide-react";

import BackgroundLayer1Image from "../../assets/images/background-layer-1.svg";
import BackgroundLayer2Image from "../../assets/images/background-layer-2.svg";
import LearnImage1 from "./imagery/1.jpg";
import LearnImage2 from "./imagery/2.jpg";
import LearnImage3 from "./imagery/3.jpg";
import LearnImage4 from "./imagery/4.jpg";
import LearnImage5 from "./imagery/5.jpg";
import LearnImage6 from "./imagery/6.jpg";
import LearnImage7 from "./imagery/7.jpg";
import LearnCreateImage from "./imagery/create-imagery.jpg";
import LearnMeditationImage from "./imagery/meditation-image.jpg";
import LearnPhotographyImage from "./imagery/photography-image.jpg";

// Reflection minimum. Long enough to ensure a real thought, short
// enough to fit a single deliberate sentence.
const MIN_REFLECTION_CHARS = 50;

export default function SessionPage() {
  const { subjectId, lessonId } = useParams();
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [completeStatus, setCompleteStatus] = useState("idle");
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionStatus, setReflectionStatus] = useState("idle");

  const subject = getSubjectById(subjectId, state.subjects);

  if (!subject) {
    return <Navigate to="/404" replace />;
  }

  const lessonIndex = subject.lessons.findIndex(
    (lesson) => lesson.id === lessonId,
  );
  const lesson = lessonIndex >= 0 ? subject.lessons[lessonIndex] : null;

  if (!lesson) {
    return <Navigate to="/404" replace />;
  }

  const enrollment = state.curriculum.find(
    (entry) => entry.subjectId === subject.id,
  );
  const completedLessonIds = enrollment?.completedLessonIds ?? [];
  const completedCount = completedLessonIds.length;
  const isComplete = completedLessonIds.includes(lesson.id);
  const isCurrent = lessonIndex === completedCount;
  const isLocked = !enrollment || (!isComplete && !isCurrent);

  const lessonContent = useMemo(
    () => buildLessonContent(subject, lesson, lessonIndex),
    [subject, lesson, lessonIndex],
  );
  const media = useMemo(
    () => getSessionMedia(subject.id, lessonIndex, lesson.title),
    [subject.id, lessonIndex, lesson.title],
  );
  const quiz = useMemo(
    () => buildQuiz(lesson, lessonContent),
    [lesson, lessonContent],
  );
  const keyFacts = useMemo(
    () => buildKeyFacts(subject, lesson, lessonContent),
    [subject, lesson, lessonContent],
  );
  const visual = getSessionVisual(subject.id);
  const existingReflection = useMemo(
    () =>
      (state.reflections?.lessonEntries ?? []).find(
        (entry) =>
          entry.subjectId === subject.id && entry.lessonId === lesson.id,
      ) ?? null,
    [state.reflections, subject.id, lesson.id],
  );

  useEffect(() => {
    setReflectionText(existingReflection?.content ?? "");
    setReflectionStatus("idle");
  }, [existingReflection]);

  const isCorrect = selectedAnswer === quiz.correctIndex;

  // Reflection gating (spec 8.8 step 4 — mandatory after pass).
  // hasSavedReflection looks at what's actually persisted, not the
  // current textarea value — that way deleting unsaved text doesn't
  // undo the gate.
  const reflectionLength = reflectionText.trim().length;
  const meetsMinimum = reflectionLength >= MIN_REFLECTION_CHARS;
  const hasSavedReflection =
    (existingReflection?.content?.trim().length ?? 0) >= MIN_REFLECTION_CHARS;

  const showReflectionStep = showResult && isCorrect;

  const canComplete =
    isCurrent &&
    showResult &&
    isCorrect &&
    hasSavedReflection &&
    completeStatus !== "loading";

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
  };

  const handleCompleteSession = () => {
    if (!canComplete) return;

    setCompleteStatus("loading");
    dispatch({
      type: "COMPLETE_LESSON",
      payload: {
        subjectId: subject.id,
        lessonId: lesson.id,
      },
    });

    setCompleteStatus("success");
    window.setTimeout(() => setCompleteStatus("idle"), 700);
  };

  const handleSaveReflection = () => {
    const content = reflectionText.trim();
    if (content.length < MIN_REFLECTION_CHARS) return;

    setReflectionStatus("loading");
    dispatch({
      type: "UPSERT_LESSON_REFLECTION",
      payload: {
        subjectId: subject.id,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        prompt: lesson.reflectionPrompt,
        content,
      },
    });

    setReflectionStatus("success");
    window.setTimeout(() => setReflectionStatus("idle"), 1100);
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link
          to={`/learn/${subject.id}`}
          className="inline-flex items-center gap-2 font-ui text-sm tracking-[0.08em] text-brand/70 hover:text-brand"
        >
          ← Back to subject room
        </Link>

        <header className="relative overflow-hidden rounded-4xl border border-brand/15 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.08)] backdrop-blur-sm md:p-8">
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

          <div className="grid gap-6 md:grid-cols-[1.25fr_0.75fr] md:items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky/35 px-3 py-1 font-ui text-[0.7rem] tracking-[0.14em] text-brand">
                  {subject.name}
                </span>
                <span className="rounded-full border border-brand/12 bg-page px-3 py-1 font-body text-xs text-brand/72">
                  Session {lessonIndex + 1}
                </span>
                {isComplete ? (
                  <span className="rounded-full bg-sage/18 px-3 py-1 font-body text-xs text-sage">
                    Completed
                  </span>
                ) : isCurrent ? (
                  <span className="rounded-full bg-yellow/30 px-3 py-1 font-body text-xs text-brand">
                    Current session
                  </span>
                ) : (
                  <span className="rounded-full bg-brand/8 px-3 py-1 font-body text-xs text-brand/65">
                    Locked
                  </span>
                )}
              </div>

              <h1 className="font-display text-[clamp(2.6rem,7vw,4.8rem)] leading-[0.94] text-brand">
                {lesson.title}
              </h1>
              <p className="max-w-3xl font-body text-base leading-relaxed text-brand/80 md:text-lg">
                {lesson.summary}
              </p>
            </div>

            <aside
              className={`rounded-3xl border border-brand/12 p-5 ${visual.panel}`}
              aria-label="Session visual"
            >
              <visual.Icon size={32} strokeWidth={1.5} className="text-brand" />
              <p className="mt-3 font-ui text-sm tracking-[0.08em] text-brand">
                {visual.title}
              </p>
              <p className="mt-2 font-body text-sm leading-relaxed text-brand/75">
                {visual.body}
              </p>
            </aside>
          </div>
        </header>

        {isLocked ? (
          <section className="rounded-4xl border border-brand/12 bg-page p-6">
            <h2 className="font-ui text-2xl text-brand">Session locked</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-brand/74">
              Complete earlier sessions first, then come back to unlock this
              one.
            </p>
            <div className="mt-4">
              <Link
                to={`/learn/${subject.id}`}
                className={getButtonClasses({
                  variant: "secondary",
                  fullWidth: false,
                })}
              >
                Return To Subject Room
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="rounded-4xl border border-brand/12 bg-cream/75 p-6">
              <h2 className="font-ui text-3xl text-brand">
                1. Session content
              </h2>

              <figure className="mt-4 overflow-hidden rounded-3xl border border-brand/12 bg-page">
                <img
                  src={media.hero.src}
                  alt={media.hero.alt}
                  className="h-56 w-full object-cover md:h-72"
                  loading="lazy"
                />
                <figcaption className="px-4 py-3 font-body text-xs text-brand/64">
                  {media.hero.caption}
                </figcaption>
              </figure>

              <div className="mt-5 space-y-4">
                {lessonContent.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-body text-sm leading-relaxed text-brand/78"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-brand/10 bg-page p-5">
                <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
                  Practice flow
                </p>
                <ol className="mt-3 space-y-3">
                  {lessonContent.practiceSteps.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 font-body text-sm leading-relaxed text-brand/78"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 font-ui text-xs text-brand">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="rounded-4xl border border-brand/12 bg-page p-6">
              <h2 className="font-ui text-3xl text-brand">
                2. Highlighted key facts
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {media.supporting.map((image) => (
                  <figure
                    key={image.caption}
                    className="overflow-hidden rounded-3xl border border-brand/12"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                    <figcaption className="px-4 py-3 font-body text-xs text-brand/64">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {keyFacts.map((fact) => (
                  <article
                    key={fact.title}
                    className="rounded-3xl border border-brand/12 p-4"
                  >
                    <p className="font-ui text-sm tracking-[0.08em] text-brand">
                      {fact.title}
                    </p>
                    <p className="mt-2 font-body text-sm leading-relaxed text-brand/74">
                      {fact.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-4xl border border-brand/12 p-6 shadow-[0_24px_48px_rgba(75,81,149,0.06)]">
              <h2 className="font-ui text-3xl text-brand">3. Quick quiz</h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-brand/76">
                {quiz.question}
              </p>

              <div className="mt-4 grid gap-3">
                {quiz.options.map((option, index) => {
                  const selected = selectedAnswer === index;
                  const showCorrect = showResult && index === quiz.correctIndex;
                  const showWrong = showResult && selected && !isCorrect;

                  return (
                    <button
                      key={`${option}-${index}`}
                      type="button"
                      onClick={() => {
                        if (showResult) {
                          setShowResult(false);
                        }
                        setSelectedAnswer(index);
                      }}
                      className={`rounded-2xl border px-4 py-3 text-left font-body text-sm transition ${
                        showCorrect
                          ? "border-sage/40 bg-sage/10 text-brand"
                          : showWrong
                            ? "border-rose-300 bg-rose-50 text-brand"
                            : selected
                              ? "border-brand bg-brand/8 text-brand"
                              : "border-brand/12 bg-page text-brand/75 hover:border-brand/24"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  fullWidth={false}
                  text="Check Answer"
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                />
                {isCurrent ? (
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth={false}
                    text="Mark Session Complete"
                    status={completeStatus}
                    loadingText="Saving..."
                    onClick={handleCompleteSession}
                    disabled={!canComplete}
                  />
                ) : null}
              </div>

              {showResult ? (
                <div
                  className={`mt-4 rounded-2xl border p-4 ${
                    isCorrect
                      ? "border-sage/30 bg-sage/10"
                      : "border-yellow/35 bg-yellow/15"
                  }`}
                >
                  <p className="font-ui text-sm text-brand">
                    {isCorrect ? "Correct" : "Not quite"}
                  </p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-brand/74">
                    {quiz.explanation}
                  </p>
                </div>
              ) : null}

              {/* Reflection — visible only after passing the quiz, and
                  required (50-char minimum) to mark the session complete. */}
              {showReflectionStep ? (
                <div className="mt-4 rounded-2xl border border-brand/12 bg-page p-4">
                  <p className="font-body text-xs uppercase tracking-[0.12em] text-brand/55">
                    Reflection prompt
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-brand/78">
                    {lesson.reflectionPrompt}
                  </p>

                  <label
                    htmlFor="lesson-reflection"
                    className="mt-4 block font-body text-xs uppercase tracking-[0.12em] text-brand/55"
                  >
                    Your reflection
                    <span className="ml-1 text-brand/45">(required)</span>
                  </label>
                  <textarea
                    id="lesson-reflection"
                    value={reflectionText}
                    onChange={(event) => {
                      setReflectionText(event.target.value);
                      if (reflectionStatus !== "idle") {
                        setReflectionStatus("idle");
                      }
                    }}
                    aria-describedby="lesson-reflection-counter"
                    placeholder="Write a short reflection from this session..."
                    className="mt-2 min-h-32 w-full rounded-2xl border border-brand/16 px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
                  />

                  <p
                    id="lesson-reflection-counter"
                    className={`mt-2 font-body text-xs ${
                      meetsMinimum ? "text-sage" : "text-brand/55"
                    }`}
                    aria-live="polite"
                  >
                    {reflectionLength} / {MIN_REFLECTION_CHARS} characters
                    {meetsMinimum ? " · ready to save" : " minimum"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth={false}
                      text="Save Reflection"
                      loadingText="Saving reflection..."
                      status={reflectionStatus}
                      onClick={handleSaveReflection}
                      disabled={!meetsMinimum}
                    />
                    {existingReflection?.savedAt ? (
                      <p className="font-body text-xs text-brand/62">
                        Last saved{" "}
                        {new Date(existingReflection.savedAt).toLocaleString()}
                      </p>
                    ) : (
                      <p className="font-body text-xs text-brand/62">
                        Saved to your account on this device.
                      </p>
                    )}
                  </div>

                  {isCurrent && !hasSavedReflection ? (
                    <p className="mt-3 font-body text-xs text-brand/65">
                      Save your reflection to mark this session complete.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

const buildKeyFacts = (subject, lesson, lessonContent) => [
  {
    title: "What this session trains",
    body: lesson.summary,
  },
  {
    title: "Core method",
    body: `Use the ${lessonContent.focusLabel.toLowerCase()} loop: plan the focus, execute one concrete pass, and capture what changed.`,
  },
  {
    title: "Evidence of progress",
    body: lessonContent.evidenceNote,
  },
];

const buildQuiz = (lesson, lessonContent) => ({
  question: `Which choice best follows this session's ${lessonContent.focusLabel.toLowerCase()} method?`,
  options: [lessonContent.correctAction, ...lessonContent.distractors],
  correctIndex: 0,
  explanation: `The method in this lesson is action plus reflection: ${lesson.activity}`,
});

const buildLessonContent = (subject, lesson, lessonIndex) => {
  const focusStages = ["Foundation", "Application", "Refinement", "Delivery"];
  const focusLabel = focusStages[Math.min(lessonIndex, focusStages.length - 1)];

  const subjectFrames = {
    "digital-photography": {
      lens: "scene, light, and framing",
      habit: "make deliberate framing choices before pressing the shutter",
      evidence: "a contact sheet that shows purposeful variation",
      distractors: [
        "Shoot quickly without changing angle so you can save editing time",
        "Wait for perfect gear before testing composition decisions",
        "Keep every image and skip selection until the final session",
      ],
    },
    "creative-writing": {
      lens: "voice, structure, and revision",
      habit: "draft fast, then shape the line that carries the most weight",
      evidence: "a paragraph where one sentence does more work than before",
      distractors: [
        "Polish a single sentence until it feels perfect before drafting",
        "Avoid revising so the original feeling stays intact",
        "Write only when inspiration strikes and skip practice sessions",
      ],
    },
    "javascript-fundamentals": {
      lens: "syntax, behaviour, and debugging",
      habit: "run small experiments to confirm what the language actually does",
      evidence: "a working snippet that proves the concept",
      distractors: [
        "Memorise syntax tables instead of running real code",
        "Skip console output and assume the result you expected",
        "Copy a tutorial verbatim without changing any variable",
      ],
    },
    "mindfulness-and-meditation": {
      lens: "breath, body, and attention",
      habit: "return gently when attention wanders rather than forcing focus",
      evidence: "a session log that names what pulled your attention",
      distractors: [
        "Push attention harder until distractions disappear entirely",
        "Skip practice on busy days to make up later",
        "Judge each session by how relaxed you felt at the end",
      ],
    },
    "cooking-fundamentals": {
      lens: "heat, salt, and timing",
      habit: "taste at each stage and adjust before plating",
      evidence: "a dish you can describe in terms of the choices you made",
      distractors: [
        "Follow the recipe without tasting to keep the result consistent",
        "Add all seasoning at the start so the flavour develops on its own",
        "Plate immediately and adjust only at the table",
      ],
    },
    "graphic-design": {
      lens: "hierarchy, contrast, and rhythm",
      habit: "decide what the eye reaches for first, then defend that choice",
      evidence: "a layout where one element clearly leads",
      distractors: [
        "Apply more decoration so every element feels important",
        "Match every spacing value to a default grid without judgement",
        "Pick a font you like and reuse it across every weight",
      ],
    },
    "ecology-and-sustainability": {
      lens: "systems, flows, and feedback",
      habit: "trace a single resource through one full cycle",
      evidence: "a map that shows where impact concentrates",
      distractors: [
        "Focus on individual choices and ignore the system around them",
        "Treat sustainability as a marketing label rather than a behaviour",
        "Wait for global consensus before changing local practice",
      ],
    },
    "public-speaking": {
      lens: "message, presence, and pace",
      habit: "rehearse aloud and adjust to what your ear actually hears",
      evidence: "a talk outline tightened around one clear idea",
      distractors: [
        "Memorise the script word for word so nothing surprises you",
        "Avoid recording rehearsals so you can stay confident",
        "Add more slides so the audience has more to look at",
      ],
    },
  };

  const frame = subjectFrames[subject.id] ?? {
    lens: "focus, action, and review",
    habit: "do one concrete pass and capture what changed",
    evidence: "a small artefact that shows what you practised",
    distractors: [
      "Read the material once and call the session done",
      "Skip the practice step and rely on intuition next time",
      "Defer the work until you feel more prepared",
    ],
  };

  const paragraphs = [
    `This session focuses on ${frame.lens}. You are not trying to cover everything — you are practising one specific move that compounds over time. Depth comes from precision, not volume.`,
    `Start by naming a single target for this session. Then run one concentrated pass where you ${frame.habit}. This keeps your effort anchored to a result you can evaluate, rather than vague momentum.`,
    `Close by documenting evidence. Your goal is ${frame.evidence}. Treat this evidence as a baseline for the next session so each step in ${subject.name} builds on reality, not memory.`,
  ];

  const practiceSteps = [
    `Set a 20-30 minute block and define one outcome you can finish in this session.`,
    lesson.activity,
    `Review what you produced and write one sentence about what improved and what still needs work.`,
  ];

  return {
    focusLabel,
    paragraphs,
    practiceSteps,
    correctAction: lesson.activity,
    distractors: frame.distractors,
    evidenceNote: `Look for ${frame.evidence}. If you can point to proof, the session worked.`,
  };
};

const getSessionMedia = (subjectId, lessonIndex, lessonTitle) => {
  const imageSets = {
    "digital-photography": [
      LearnPhotographyImage,
      LearnImage1,
      LearnImage2,
      LearnImage4,
    ],
    "creative-writing": [
      LearnCreateImage,
      LearnImage3,
      LearnImage5,
      LearnImage7,
    ],
    "javascript-fundamentals": [
      LearnImage2,
      LearnImage4,
      LearnImage6,
      LearnImage1,
    ],
    "mindfulness-and-meditation": [
      LearnMeditationImage,
      LearnImage6,
      LearnImage5,
      LearnImage3,
    ],
    "cooking-fundamentals": [
      LearnImage4,
      LearnImage1,
      LearnImage5,
      LearnImage2,
    ],
    "graphic-design": [LearnCreateImage, LearnImage3, LearnImage2, LearnImage6],
    "ecology-and-sustainability": [
      LearnImage5,
      LearnImage6,
      LearnImage1,
      LearnImage4,
    ],
    "public-speaking": [LearnImage7, LearnImage2, LearnImage3, LearnImage5],
  };

  const selectedSet = imageSets[subjectId] ?? [
    LearnImage1,
    LearnImage2,
    LearnImage3,
  ];
  const hero = selectedSet[lessonIndex % selectedSet.length];
  const supportOne = selectedSet[(lessonIndex + 1) % selectedSet.length];
  const supportTwo = selectedSet[(lessonIndex + 2) % selectedSet.length];

  return {
    hero: {
      src: hero,
      alt: `${lessonTitle} visual reference`,
      caption:
        "Use this image as a visual anchor: identify one detail that mirrors the session focus before you begin.",
    },
    supporting: [
      {
        src: supportOne,
        alt: `${lessonTitle} supporting example one`,
        caption:
          "Example A: notice one design choice or decision pattern you can borrow in your own practice.",
      },
      {
        src: supportTwo,
        alt: `${lessonTitle} supporting example two`,
        caption:
          "Example B: compare this with your output and note one adjustment for your next pass.",
      },
    ],
  };
};

const getSessionVisual = (subjectId) => {
  const visuals = {
    "digital-photography": {
      Icon: Camera,
      panel: "bg-sky/20",
      title: "Visual framing",
      body: "Look for contrast, depth, and story in each scene you capture.",
    },
    "creative-writing": {
      Icon: PenLine,
      panel: "bg-yellow/25",
      title: "Drafting mode",
      body: "Move from raw thought to shaped language, one paragraph at a time.",
    },
    "javascript-fundamentals": {
      Icon: Code2,
      panel: "bg-brand/10",
      title: "Code in context",
      body: "Make each concept concrete by applying it to a small working example.",
    },
    "mindfulness-and-meditation": {
      Icon: Brain,
      panel: "bg-sage/16",
      title: "Steady attention",
      body: "Slow down, observe clearly, and return to intention with less friction.",
    },
    "cooking-fundamentals": {
      Icon: ChefHat,
      panel: "bg-yellow/22",
      title: "Flavor and timing",
      body: "Notice how simple ingredient choices shift the result of a whole dish.",
    },
    "graphic-design": {
      Icon: Palette,
      panel: "bg-sky/22",
      title: "Hierarchy first",
      body: "Guide the eye with spacing, type contrast, and intentional rhythm.",
    },
    "ecology-and-sustainability": {
      Icon: Leaf,
      panel: "bg-sage/18",
      title: "Systems thinking",
      body: "Map connections, identify leverage points, and act where impact is real.",
    },
    "public-speaking": {
      Icon: Mic,
      panel: "bg-brand/10",
      title: "Message and delivery",
      body: "Shape one clear idea and practice saying it with confidence.",
    },
  };

  return (
    visuals[subjectId] ?? {
      Icon: Sparkles,
      panel: "bg-page",
      title: "Focused session",
      body: "Work through the core action, then reflect and move forward.",
    }
  );
};
