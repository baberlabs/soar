export const LEARNING_STYLE_LABELS = {
  V: "Visual",
  A: "Auditory",
  R: "Reading/Writing",
  K: "Kinesthetic",
};

export const SUBJECTS = [
  {
    id: "digital-photography",
    name: "Digital Photography",
    description: "Frame a story, shoot with intention, and edit a final mini-series.",
    commitment: "3 guided sessions",
    interestTags: ["Photography", "Film", "Design"],
    outcomes: [
      "Build a visual reference board",
      "Shoot a short storytelling sequence",
      "Edit and caption a final set",
    ],
    lessons: [
      {
        id: "see-before-you-shoot",
        title: "See Before You Shoot",
        summary: "Choose a theme, collect references, and decide what kind of scene you want to notice.",
        activity:
          "Create a reference board with six images and write a one-sentence theme for your shoot.",
        reflectionPrompt: "What details do you notice once you start looking with intention?",
      },
      {
        id: "light-and-composition",
        title: "Work With Light And Composition",
        summary: "Use framing, distance, and available light to make one subject feel deliberate.",
        activity:
          "Shoot ten photos of one subject from different angles, then keep your best three.",
        reflectionPrompt: "Which choice changed the feeling of the image most: light, angle, or distance?",
      },
      {
        id: "edit-a-mini-series",
        title: "Edit A Mini-Series",
        summary: "Turn a handful of images into something that feels finished instead of accidental.",
        activity:
          "Choose three final images, crop them, adjust contrast, and write a caption for the set.",
        reflectionPrompt: "What story does the sequence tell that one image alone could not?",
      },
    ],
  },
  {
    id: "creative-writing",
    name: "Creative Writing",
    description: "Move from loose ideas to a short piece with a clear voice and structure.",
    commitment: "3 guided sessions",
    interestTags: ["Writing", "Philosophy", "Film"],
    outcomes: [
      "Collect a bank of raw ideas",
      "Draft a focused short piece",
      "Revise for rhythm and clarity",
    ],
    lessons: [
      {
        id: "collect-material",
        title: "Collect Raw Material",
        summary: "Gather images, memories, phrases, and questions worth writing from.",
        activity:
          "Freewrite for ten minutes, then highlight three lines that feel alive.",
        reflectionPrompt: "Which idea still pulls at you after the timer ends?",
      },
      {
        id: "shape-a-scene",
        title: "Shape A Scene",
        summary: "Pick one moment and give it a beginning, a turn, and a final image.",
        activity:
          "Write a 300-500 word scene or short reflection built around one vivid moment.",
        reflectionPrompt: "Where does the piece start feeling specific instead of generic?",
      },
      {
        id: "revise-with-purpose",
        title: "Revise With Purpose",
        summary: "Cut what is fuzzy, keep what is sharp, and make the voice sound like you.",
        activity:
          "Read the piece aloud once, revise it once, and name the line you most want to keep.",
        reflectionPrompt: "What changed when you stopped drafting and started listening?",
      },
    ],
  },
  {
    id: "javascript-fundamentals",
    name: "JavaScript Fundamentals",
    description: "Learn the building blocks of interactive web apps by making something small.",
    commitment: "4 guided sessions",
    interestTags: ["JavaScript", "AI & Data", "Design"],
    outcomes: [
      "Understand values, arrays, and objects",
      "Write reusable functions",
      "Handle user input",
      "Ship a tiny browser project",
    ],
    lessons: [
      {
        id: "work-with-data",
        title: "Work With Values And Data",
        summary: "Get comfortable with the pieces that programs read and change.",
        activity:
          "Create a small list of favorite tools or ideas using arrays and objects.",
        reflectionPrompt: "Which data shape felt easiest to reason about and why?",
      },
      {
        id: "write-functions",
        title: "Write Small Functions",
        summary: "Turn repeated steps into named bits of logic you can reuse.",
        activity:
          "Write two functions that transform or summarize the data from session one.",
        reflectionPrompt: "What became clearer once you gave the logic a name?",
      },
      {
        id: "respond-to-input",
        title: "Respond To User Input",
        summary: "Make the page react to a click, a form field, or a small choice.",
        activity:
          "Add a button or input that changes what the page shows on screen.",
        reflectionPrompt: "What part of the code connects your intent to the browser?",
      },
      {
        id: "ship-a-mini-tool",
        title: "Ship A Mini Tool",
        summary: "Package the pieces into one tiny, useful interaction.",
        activity:
          "Build a simple browser tool such as a timer, checklist, or prompt generator.",
        reflectionPrompt: "What did you learn by finishing something small instead of perfect?",
      },
    ],
  },
  {
    id: "mindfulness-and-meditation",
    name: "Mindfulness & Meditation",
    description: "Build a steady personal practice that helps you notice, reset, and respond.",
    commitment: "3 guided sessions",
    interestTags: ["Meditation", "Leadership", "Philosophy"],
    outcomes: [
      "Name what pulls your attention",
      "Practice a short breathing routine",
      "Design a repeatable reflection habit",
    ],
    lessons: [
      {
        id: "notice-patterns",
        title: "Notice Your Patterns",
        summary: "Start by observing when your attention feels scattered, steady, or overloaded.",
        activity:
          "Track three moments in a day when your attention shifts sharply.",
        reflectionPrompt: "What tends to happen right before you lose your center?",
      },
      {
        id: "build-a-short-practice",
        title: "Build A Short Practice",
        summary: "Use a short breathing or grounding exercise that you can return to easily.",
        activity:
          "Practice a five-minute breathing routine once, then note what changed.",
        reflectionPrompt: "What became more available to you after slowing down?",
      },
      {
        id: "carry-it-forward",
        title: "Carry It Forward",
        summary: "Turn a one-off exercise into a habit that fits your real life.",
        activity:
          "Write a realistic plan for when and where you will use this practice next week.",
        reflectionPrompt: "What will help this stay humane rather than becoming another obligation?",
      },
    ],
  },
  {
    id: "cooking-fundamentals",
    name: "Cooking Fundamentals",
    description: "Build confidence with flavor, timing, and a repeatable weeknight meal.",
    commitment: "3 guided sessions",
    interestTags: ["Cooking", "Leadership", "Ecology"],
    outcomes: [
      "Understand a base flavor pattern",
      "Cook one dependable meal",
      "Adjust and improve it the second time",
    ],
    lessons: [
      {
        id: "build-a-base",
        title: "Build A Base",
        summary: "Learn how salt, acid, heat, and texture change a simple dish.",
        activity:
          "Taste one ingredient in two or three states and note what changed.",
        reflectionPrompt: "Which adjustment had the biggest effect on flavor?",
      },
      {
        id: "cook-a-core-meal",
        title: "Cook A Core Meal",
        summary: "Choose one simple meal and cook it from start to finish with attention.",
        activity:
          "Make one dependable meal using a short ingredient list and note your timing.",
        reflectionPrompt: "Where did you feel confident and where did you improvise?",
      },
      {
        id: "improve-on-purpose",
        title: "Improve On Purpose",
        summary: "Cook the same meal again and change one thing intentionally.",
        activity:
          "Repeat the meal, improve one step, and record what you would keep next time.",
        reflectionPrompt: "What did repetition teach you that novelty did not?",
      },
    ],
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    description: "Use hierarchy, type, and layout to make an idea clearer and more memorable.",
    commitment: "3 guided sessions",
    interestTags: ["Design", "Photography", "Writing"],
    outcomes: [
      "Collect visual references",
      "Design one simple composition",
      "Refine it with hierarchy and spacing",
    ],
    lessons: [
      {
        id: "study-visual-language",
        title: "Study Visual Language",
        summary: "Notice what makes a layout feel calm, loud, playful, or trustworthy.",
        activity:
          "Save six reference pieces and label what each one teaches you about hierarchy.",
        reflectionPrompt: "What patterns show up across designs you keep returning to?",
      },
      {
        id: "build-a-first-layout",
        title: "Build A First Layout",
        summary: "Arrange type, image, and space so the main idea lands first.",
        activity:
          "Design a one-page poster, card, or tile with one clear message.",
        reflectionPrompt: "Where does the eye go first, and is that what you intended?",
      },
      {
        id: "refine-the-system",
        title: "Refine The System",
        summary: "Polish contrast, spacing, and alignment until the layout feels intentional.",
        activity:
          "Revise the design once with fewer elements and stronger spacing decisions.",
        reflectionPrompt: "What got better when you removed rather than added?",
      },
    ],
  },
  {
    id: "ecology-and-sustainability",
    name: "Ecology & Sustainability",
    description: "Understand a local system, notice the tradeoffs, and act on one small change.",
    commitment: "3 guided sessions",
    interestTags: ["Ecology", "Gardening", "Leadership"],
    outcomes: [
      "Map a local environmental system",
      "Research one practical intervention",
      "Commit to a change you can measure",
    ],
    lessons: [
      {
        id: "map-a-system",
        title: "Map A System",
        summary: "Pick one local system such as waste, food, transport, or water and trace it.",
        activity:
          "Write or sketch a simple map of how that system moves through your daily life.",
        reflectionPrompt: "Where do you feel most connected to the system you mapped?",
      },
      {
        id: "find-a-leverage-point",
        title: "Find A Leverage Point",
        summary: "Look for one place where a small behavior or design change matters.",
        activity:
          "Research one action, tool, or habit that could improve the system you chose.",
        reflectionPrompt: "What tradeoff makes this change harder than it first sounds?",
      },
      {
        id: "make-one-change",
        title: "Make One Change",
        summary: "Choose a realistic action and commit to tracking it for one week.",
        activity:
          "Write a one-week plan and decide what evidence will tell you it worked.",
        reflectionPrompt: "What would make the change easier to sustain with other people involved?",
      },
    ],
  },
  {
    id: "public-speaking",
    name: "Public Speaking",
    description: "Clarify your message, structure a short talk, and deliver it with more ease.",
    commitment: "3 guided sessions",
    interestTags: ["Leadership", "Writing", "Design"],
    outcomes: [
      "Define a message worth sharing",
      "Outline a short talk with a clear arc",
      "Practice delivery with feedback",
    ],
    lessons: [
      {
        id: "find-the-message",
        title: "Find The Message",
        summary: "Choose one idea you care about and define why it matters to a listener.",
        activity:
          "Write a one-sentence talk promise: what the audience will leave with.",
        reflectionPrompt: "What message feels important enough to stand up and say aloud?",
      },
      {
        id: "shape-the-arc",
        title: "Shape The Arc",
        summary: "Give the talk an opening, a central point, and a memorable close.",
        activity:
          "Outline a three-part talk and add one story or example that makes it concrete.",
        reflectionPrompt: "Which part needs more clarity before it can sound confident?",
      },
      {
        id: "rehearse-with-feedback",
        title: "Rehearse With Feedback",
        summary: "Practice once, listen back, and make one specific improvement.",
        activity:
          "Record a short rehearsal and note one thing to tighten and one thing to keep.",
        reflectionPrompt: "What changed once you heard yourself as a listener would?",
      },
    ],
  },
];

export const getSubjectById = (subjectId, subjects = SUBJECTS) =>
  subjects.find((subject) => subject.id === subjectId) ?? null;

export const calculateSubjectProgress = (enrollment, subject) => {
  if (!enrollment || !subject?.lessons?.length) return 0;

  const completedCount = enrollment.completedLessonIds?.length ?? 0;
  return Math.round((completedCount / subject.lessons.length) * 100);
};
