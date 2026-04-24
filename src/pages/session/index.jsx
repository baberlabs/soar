import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Button } from "../../components/Button";
import { getButtonClasses } from "../../components/buttonStyles";
import { getSubjectById } from "../../data/subjects";
import { useSOARDispatch, useSOARState } from "../../store";

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
  const canComplete =
    isCurrent && showResult && isCorrect && completeStatus !== "loading";

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
    if (!content) return;

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
              <p className="font-ui text-4xl leading-none">{visual.emoji}</p>
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
                  placeholder="Write a short reflection from this session..."
                  className="mt-2 min-h-32 w-full rounded-2xl border border-brand/16 px-4 py-3 font-body text-sm leading-relaxed text-brand placeholder:text-brand/40 focus:border-brand/28 focus:outline-none"
                />

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth={false}
                    text="Save Reflection"
                    loadingText="Saving reflection..."
                    status={reflectionStatus}
                    onClick={handleSaveReflection}
                    disabled={!reflectionText.trim()}
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
              </div>
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
      lens: "voice, image, and narrative movement",
      habit: "draft first, then shape language around one live idea",
      evidence: "a stronger draft with one clear emotional center",
      distractors: [
        "Rewrite each sentence immediately so no rough lines remain",
        "Collect notes indefinitely before drafting a first version",
        "Use broad abstractions so the piece sounds universally relatable",
      ],
    },
    "javascript-fundamentals": {
      lens: "inputs, logic, and visible output",
      habit: "turn each concept into a tiny working interaction",
      evidence: "a small runnable snippet with predictable behavior",
      distractors: [
        "Memorize syntax lists before trying any implementation",
        "Build the UI first and postpone logic until the very end",
        "Copy code blocks unchanged without checking understanding",
      ],
    },
    "mindfulness-and-meditation": {
      lens: "attention, breath, and response",
      habit: "return to a short practice at the first sign of drift",
      evidence: "one logged moment where reactivity turned into choice",
      distractors: [
        "Force perfect silence before practicing for five minutes",
        "Track your practice only when sessions feel easy",
        "Add longer sessions immediately instead of building consistency",
      ],
    },
    "cooking-fundamentals": {
      lens: "flavor balance, timing, and texture",
      habit: "change one variable at a time and taste intentionally",
      evidence: "notes that connect one change to one flavor result",
      distractors: [
        "Add several new ingredients at once to discover what works",
        "Cook from memory and skip tasting until plating",
        "Change heat, salt, and acid together so the dish evolves faster",
      ],
    },
    "graphic-design": {
      lens: "hierarchy, contrast, and spacing",
      habit: "guide the eye by simplifying and prioritizing",
      evidence: "a layout where message order is obvious at a glance",
      distractors: [
        "Add extra elements to avoid empty space",
        "Set all text in similar size to keep visual consistency",
        "Delay alignment decisions until final export",
      ],
    },
    "ecology-and-sustainability": {
      lens: "systems, leverage points, and tradeoffs",
      habit: "map one loop, then test one realistic intervention",
      evidence: "tracked behavior data connected to one local system",
      distractors: [
        "Study global policy only and postpone local action",
        "Pick the largest intervention possible before mapping constraints",
        "Change goals weekly so progress stays flexible",
      ],
    },
    "public-speaking": {
      lens: "message clarity, structure, and delivery",
      habit: "practice one idea with one clear arc",
      evidence: "a rehearsal recording with one measurable improvement",
      distractors: [
        "Write a long script and memorize every word before speaking",
        "Focus on slide design first and postpone message decisions",
        "Practice silently and skip recording to reduce pressure",
      ],
    },
  };

  const frame = subjectFrames[subject.id] ?? {
    lens: "clear focus, concrete action, and reflection",
    habit: "make one deliberate attempt and review the result",
    evidence: "a visible before-and-after of your approach",
    distractors: [
      "Delay practice until all resources are perfect",
      "Jump ahead before checking what this session teaches",
      "Repeat work without noting what changed",
    ],
  };

  const paragraphs = [
    `${lesson.summary} In this ${focusLabel.toLowerCase()} stage, focus on ${frame.lens} instead of trying to optimize everything at once. Depth comes from precision, not volume.`,
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
      emoji: "📷",
      panel: "bg-sky/20",
      title: "Visual framing",
      body: "Look for contrast, depth, and story in each scene you capture.",
    },
    "creative-writing": {
      emoji: "✍️",
      panel: "bg-yellow/25",
      title: "Drafting mode",
      body: "Move from raw thought to shaped language, one paragraph at a time.",
    },
    "javascript-fundamentals": {
      emoji: "💻",
      panel: "bg-brand/10",
      title: "Code in context",
      body: "Make each concept concrete by applying it to a small working example.",
    },
    "mindfulness-and-meditation": {
      emoji: "🧘",
      panel: "bg-sage/16",
      title: "Steady attention",
      body: "Slow down, observe clearly, and return to intention with less friction.",
    },
    "cooking-fundamentals": {
      emoji: "🍳",
      panel: "bg-yellow/22",
      title: "Flavor and timing",
      body: "Notice how simple ingredient choices shift the result of a whole dish.",
    },
    "graphic-design": {
      emoji: "🎨",
      panel: "bg-sky/22",
      title: "Hierarchy first",
      body: "Guide the eye with spacing, type contrast, and intentional rhythm.",
    },
    "ecology-and-sustainability": {
      emoji: "🌿",
      panel: "bg-sage/18",
      title: "Systems thinking",
      body: "Map connections, identify leverage points, and act where impact is real.",
    },
    "public-speaking": {
      emoji: "🎤",
      panel: "bg-brand/10",
      title: "Message and delivery",
      body: "Shape one clear idea and practice saying it with confidence.",
    },
  };

  return (
    visuals[subjectId] ?? {
      emoji: "✨",
      panel: "bg-page",
      title: "Focused session",
      body: "Work through the core action, then reflect and move forward.",
    }
  );
};
