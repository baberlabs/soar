import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
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

import { SessionProgress } from "./components/SessionProgress";
import { LessonStep } from "./components/LessonStep";
import { FlashcardsStep } from "./components/FlashcardsStep";
import { QuizStep } from "./components/QuizStep";
import { ReflectionStep } from "./components/ReflectionStep";
import { ChallengeStep } from "./components/ChallengeStep";
import Page from "../../layout/Page";

const STEPS = ["lesson", "flashcards", "quiz", "reflection", "challenge"];

const STEP_LABELS = {
  lesson: "Lesson",
  flashcards: "Flashcards",
  quiz: "Quiz",
  reflection: "Reflection",
  challenge: "Challenge",
};

export default function SessionPage() {
  const { subjectId, lessonId } = useParams();
  const state = useSOARState();
  const dispatch = useSOARDispatch();

  const subject = getSubjectById(subjectId, state.subjects);
  const lessonIndex =
    subject?.lessons.findIndex((entry) => entry.id === lessonId) ?? -1;
  const lesson = lessonIndex >= 0 ? subject.lessons[lessonIndex] : null;

  const enrollment = subject
    ? (state.curriculum.find((entry) => entry.subjectId === subject.id) ?? null)
    : null;

  const completedLessonIds = enrollment?.completedLessonIds ?? [];
  const completedCount = completedLessonIds.length;
  const isComplete = lesson ? completedLessonIds.includes(lesson.id) : false;
  const isCurrent = lessonIndex === completedCount;
  const isLocked = !enrollment || (!isComplete && !isCurrent);

  // Derived content — memoised so prop identity stays stable for steps.
  const lessonContent = useMemo(
    () =>
      subject && lesson
        ? buildLessonContent(subject, lesson, lessonIndex)
        : null,
    [subject, lesson, lessonIndex],
  );

  const media = useMemo(
    () =>
      subject && lesson
        ? getSessionMedia(subject.id, lessonIndex, lesson.title)
        : null,
    [subject, lesson, lessonIndex],
  );

  const keyFacts = useMemo(
    () =>
      subject && lesson && lessonContent
        ? buildKeyFacts(subject, lesson, lessonContent)
        : [],
    [subject, lesson, lessonContent],
  );

  const quiz = useMemo(
    () => (lesson && lessonContent ? buildQuiz(lesson, lessonContent) : null),
    [lesson, lessonContent],
  );

  const flashcards = useMemo(
    () =>
      lesson && lessonContent && keyFacts.length > 0
        ? buildFlashcards(lesson, keyFacts)
        : [],
    [lesson, lessonContent, keyFacts],
  );

  const existingReflection = useMemo(
    () =>
      subject && lesson
        ? ((state.reflections?.lessonEntries ?? []).find(
            (entry) =>
              entry.subjectId === subject.id && entry.lessonId === lesson.id,
          ) ?? null)
        : null,
    [state.reflections, subject, lesson],
  );

  // Early-return guards must run AFTER all hooks above to keep hook
  // order stable across renders.
  if (!subject || !lesson) {
    return <Navigate to="/404" replace />;
  }

  const visual = getSessionVisual(subject.id);

  const nextLesson =
    lessonIndex + 1 < subject.lessons.length
      ? subject.lessons[lessonIndex + 1]
      : null;

  return (
    <Page
      heading={lesson.title}
      description={lesson.summary}
      contentClassName="mx-auto space-y-6"
    >
      <div className="flex w-fit gap-4 items-center justify-between rounded-xl border border-brand/12 bg-page/80 px-3 py-2">
        {/* Left: Session identity */}
        <span className="text-xs font-medium text-brand/60">
          Session {lessonIndex + 1}
        </span>

        {/* Right: Status (dominant) */}
        {isComplete ? (
          <span className="rounded-full bg-sage px-3 py-1 text-[0.7rem] font-semibold text-white">
            Completed
          </span>
        ) : isCurrent ? (
          <span className="rounded-full bg-yellow px-3 py-1 text-[0.7rem] font-semibold text-brand">
            Current
          </span>
        ) : (
          <span className="rounded-full bg-brand/15 px-3 py-1 text-[0.7rem] font-medium text-brand/70">
            Locked
          </span>
        )}
      </div>

      {isLocked ? (
        <LockedPanel subjectId={subject.id} />
      ) : (
        <SessionExperience
          key={`${subject.id}:${lesson.id}`}
          subject={subject}
          lesson={lesson}
          enrollment={enrollment}
          isComplete={isComplete}
          media={media}
          lessonContent={lessonContent}
          keyFacts={keyFacts}
          flashcards={flashcards}
          quiz={quiz}
          existingReflection={existingReflection}
          nextLesson={nextLesson}
          dispatch={dispatch}
        />
      )}
    </Page>
  );
}

const SessionExperience = ({
  subject,
  lesson,
  enrollment,
  isComplete,
  media,
  lessonContent,
  keyFacts,
  flashcards,
  quiz,
  existingReflection,
  nextLesson,
  dispatch,
}) => {
  const [currentStep, setCurrentStep] = useState("lesson");
  const [completedSteps, setCompletedSteps] = useState(
    () => new Set(isComplete ? STEPS : []),
  );
  const [justFinished, setJustFinished] = useState(false);

  const advanceStep = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
    }
  };

  const goToStep = (stepId) => {
    if (completedSteps.has(stepId) || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleSaveReflection = (content) => {
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
  };

  const handleChallengeAcknowledge = () => {
    if (!isComplete && enrollment) {
      dispatch({
        type: "COMPLETE_LESSON",
        payload: { subjectId: subject.id, lessonId: lesson.id },
      });
    }
    setCompletedSteps((prev) => new Set([...prev, "challenge"]));
    setJustFinished(true);
  };

  return (
    <div className="space-y-6">
      <SessionProgress
        steps={STEPS}
        labels={STEP_LABELS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      {justFinished ? (
        <FinishedBanner subjectId={subject.id} nextLesson={nextLesson} />
      ) : null}

      {currentStep === "lesson" && (
        <LessonStep
          media={media}
          lessonContent={lessonContent}
          keyFacts={keyFacts}
          onContinue={advanceStep}
        />
      )}

      {currentStep === "flashcards" && (
        <FlashcardsStep flashcards={flashcards} onContinue={advanceStep} />
      )}

      {currentStep === "quiz" && (
        <QuizStep quiz={quiz} onContinue={advanceStep} />
      )}

      {currentStep === "reflection" && (
        <ReflectionStep
          prompt={lesson.reflectionPrompt}
          existingReflection={existingReflection}
          onSave={handleSaveReflection}
          onContinue={advanceStep}
        />
      )}

      {currentStep === "challenge" && (
        <ChallengeStep
          curatedChallenge={lesson.activity}
          alreadyComplete={isComplete}
          onAcknowledge={handleChallengeAcknowledge}
        />
      )}
    </div>
  );
};

// ---------- Inline subcomponents (page-local, not reused elsewhere) ----------

const LockedPanel = ({ subjectId }) => (
  <section className="rounded-4xl border border-brand/12 bg-page p-6">
    <h2 className="font-ui text-2xl text-brand">Session locked</h2>
    <p className="mt-2 font-body text-sm leading-relaxed text-brand/74">
      Complete earlier sessions first, then come back to unlock this one.
    </p>
    <div className="mt-4">
      <Link
        to={`/learn/${subjectId}`}
        className={getButtonClasses({
          variant: "secondary",
          fullWidth: false,
        })}
      >
        Return To Subject Room
      </Link>
    </div>
  </section>
);

const FinishedBanner = ({ subjectId, nextLesson }) => (
  <div className="rounded-4xl border border-sage/35 bg-sage/12 p-6">
    <p className="font-ui text-sm tracking-[0.12em] text-sage">
      Session complete
    </p>
    <h3 className="mt-2 font-display text-3xl leading-[0.95] text-brand">
      Nice work! That one&rsquo;s done.
    </h3>
    <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-brand/75">
      Your progress is saved. Take a break, or move into the next session.
    </p>
    <div className="mt-4 flex flex-wrap gap-3">
      {nextLesson ? (
        <Link
          to={`/learn/${subjectId}/sessions/${nextLesson.id}`}
          className={getButtonClasses({
            variant: "primary",
            size: "md",
            fullWidth: false,
          })}
        >
          Next session
        </Link>
      ) : null}
      <Link
        to={`/learn/${subjectId}`}
        className={getButtonClasses({
          variant: "secondary",
          size: "md",
          fullWidth: false,
        })}
      >
        Back to subject room
      </Link>
    </div>
  </div>
);

// ---------- Content builders ----------

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

/**
 * Builds four flashcards from the lesson content + key facts so we
 * don't need to add new fields to subjects.js. Each card has a short
 * front prompt and a longer back answer.
 */
const buildFlashcards = (lesson, keyFacts) => [
  {
    front: "What is this session about?",
    back: lesson.summary,
    frontLabel: "Concept",
    backLabel: "Summary",
  },
  {
    front: "What is the core method?",
    back: keyFacts[1].body,
    frontLabel: "Method",
    backLabel: "Approach",
  },
  {
    front: "How will you know it worked?",
    back: keyFacts[2].body,
    frontLabel: "Evidence",
    backLabel: "Signal",
  },
  {
    front: "What's your hands-on practice?",
    back: lesson.activity,
    frontLabel: "Practice",
    backLabel: "Activity",
  },
];

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
