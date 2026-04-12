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
    description:
      "Frame a story, shoot with intention, and edit a final mini-series.",
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
        summary:
          "Choose a theme, collect references, and decide what kind of scene you want to notice.",
        activity:
          "Create a reference board with six images and write a one-sentence theme for your shoot.",
        reflectionPrompt:
          "What details do you notice once you start looking with intention?",
      },
      {
        id: "light-and-composition",
        title: "Work With Light And Composition",
        summary:
          "Use framing, distance, and available light to make one subject feel deliberate.",
        activity:
          "Shoot ten photos of one subject from different angles, then keep your best three.",
        reflectionPrompt:
          "Which choice changed the feeling of the image most: light, angle, or distance?",
      },
      {
        id: "edit-a-mini-series",
        title: "Edit A Mini-Series",
        summary:
          "Turn a handful of images into something that feels finished instead of accidental.",
        activity:
          "Choose three final images, crop them, adjust contrast, and write a caption for the set.",
        reflectionPrompt:
          "What story does the sequence tell that one image alone could not?",
      },
    ],
  },
  {
    id: "creative-writing",
    name: "Creative Writing",
    description:
      "Move from loose ideas to a short piece with a clear voice and structure.",
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
        summary:
          "Gather images, memories, phrases, and questions worth writing from.",
        activity:
          "Freewrite for ten minutes, then highlight three lines that feel alive.",
        reflectionPrompt: "Which idea still pulls at you after the timer ends?",
      },
      {
        id: "shape-a-scene",
        title: "Shape A Scene",
        summary:
          "Pick one moment and give it a beginning, a turn, and a final image.",
        activity:
          "Write a 300-500 word scene or short reflection built around one vivid moment.",
        reflectionPrompt:
          "Where does the piece start feeling specific instead of generic?",
      },
      {
        id: "revise-with-purpose",
        title: "Revise With Purpose",
        summary:
          "Cut what is fuzzy, keep what is sharp, and make the voice sound like you.",
        activity:
          "Read the piece aloud once, revise it once, and name the line you most want to keep.",
        reflectionPrompt:
          "What changed when you stopped drafting and started listening?",
      },
    ],
  },
  {
    id: "javascript-fundamentals",
    name: "JavaScript Fundamentals",
    description:
      "Learn the building blocks of interactive web apps by making something small.",
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
        summary:
          "Get comfortable with the pieces that programs read and change.",
        activity:
          "Create a small list of favorite tools or ideas using arrays and objects.",
        reflectionPrompt:
          "Which data shape felt easiest to reason about and why?",
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
        summary:
          "Make the page react to a click, a form field, or a small choice.",
        activity:
          "Add a button or input that changes what the page shows on screen.",
        reflectionPrompt:
          "What part of the code connects your intent to the browser?",
      },
      {
        id: "ship-a-mini-tool",
        title: "Ship A Mini Tool",
        summary: "Package the pieces into one tiny, useful interaction.",
        activity:
          "Build a simple browser tool such as a timer, checklist, or prompt generator.",
        reflectionPrompt:
          "What did you learn by finishing something small instead of perfect?",
      },
    ],
  },
  {
    id: "mindfulness-and-meditation",
    name: "Mindfulness & Meditation",
    description:
      "Build a steady personal practice that helps you notice, reset, and respond.",
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
        summary:
          "Start by observing when your attention feels scattered, steady, or overloaded.",
        activity:
          "Track three moments in a day when your attention shifts sharply.",
        reflectionPrompt:
          "What tends to happen right before you lose your center?",
      },
      {
        id: "build-a-short-practice",
        title: "Build A Short Practice",
        summary:
          "Use a short breathing or grounding exercise that you can return to easily.",
        activity:
          "Practice a five-minute breathing routine once, then note what changed.",
        reflectionPrompt:
          "What became more available to you after slowing down?",
      },
      {
        id: "carry-it-forward",
        title: "Carry It Forward",
        summary:
          "Turn a one-off exercise into a habit that fits your real life.",
        activity:
          "Write a realistic plan for when and where you will use this practice next week.",
        reflectionPrompt:
          "What will help this stay humane rather than becoming another obligation?",
      },
    ],
  },
  {
    id: "cooking-fundamentals",
    name: "Cooking Fundamentals",
    description:
      "Build confidence with flavor, timing, and a repeatable weeknight meal.",
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
        summary:
          "Learn how salt, acid, heat, and texture change a simple dish.",
        activity:
          "Taste one ingredient in two or three states and note what changed.",
        reflectionPrompt: "Which adjustment had the biggest effect on flavor?",
      },
      {
        id: "cook-a-core-meal",
        title: "Cook A Core Meal",
        summary:
          "Choose one simple meal and cook it from start to finish with attention.",
        activity:
          "Make one dependable meal using a short ingredient list and note your timing.",
        reflectionPrompt:
          "Where did you feel confident and where did you improvise?",
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
    description:
      "Use hierarchy, type, and layout to make an idea clearer and more memorable.",
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
        summary:
          "Notice what makes a layout feel calm, loud, playful, or trustworthy.",
        activity:
          "Save six reference pieces and label what each one teaches you about hierarchy.",
        reflectionPrompt:
          "What patterns show up across designs you keep returning to?",
      },
      {
        id: "build-a-first-layout",
        title: "Build A First Layout",
        summary: "Arrange type, image, and space so the main idea lands first.",
        activity:
          "Design a one-page poster, card, or tile with one clear message.",
        reflectionPrompt:
          "Where does the eye go first, and is that what you intended?",
      },
      {
        id: "refine-the-system",
        title: "Refine The System",
        summary:
          "Polish contrast, spacing, and alignment until the layout feels intentional.",
        activity:
          "Revise the design once with fewer elements and stronger spacing decisions.",
        reflectionPrompt: "What got better when you removed rather than added?",
      },
    ],
  },
  {
    id: "ecology-and-sustainability",
    name: "Ecology & Sustainability",
    description:
      "Understand a local system, notice the tradeoffs, and act on one small change.",
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
        summary:
          "Pick one local system such as waste, food, transport, or water and trace it.",
        activity:
          "Write or sketch a simple map of how that system moves through your daily life.",
        reflectionPrompt:
          "Where do you feel most connected to the system you mapped?",
      },
      {
        id: "find-a-leverage-point",
        title: "Find A Leverage Point",
        summary:
          "Look for one place where a small behavior or design change matters.",
        activity:
          "Research one action, tool, or habit that could improve the system you chose.",
        reflectionPrompt:
          "What tradeoff makes this change harder than it first sounds?",
      },
      {
        id: "make-one-change",
        title: "Make One Change",
        summary:
          "Choose a realistic action and commit to tracking it for one week.",
        activity:
          "Write a one-week plan and decide what evidence will tell you it worked.",
        reflectionPrompt:
          "What would make the change easier to sustain with other people involved?",
      },
    ],
  },
  {
    id: "public-speaking",
    name: "Public Speaking",
    description:
      "Clarify your message, structure a short talk, and deliver it with more ease.",
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
        summary:
          "Choose one idea you care about and define why it matters to a listener.",
        activity:
          "Write a one-sentence talk promise: what the audience will leave with.",
        reflectionPrompt:
          "What message feels important enough to stand up and say aloud?",
      },
      {
        id: "shape-the-arc",
        title: "Shape The Arc",
        summary:
          "Give the talk an opening, a central point, and a memorable close.",
        activity:
          "Outline a three-part talk and add one story or example that makes it concrete.",
        reflectionPrompt:
          "Which part needs more clarity before it can sound confident?",
      },
      {
        id: "rehearse-with-feedback",
        title: "Rehearse With Feedback",
        summary:
          "Practice once, listen back, and make one specific improvement.",
        activity:
          "Record a short rehearsal and note one thing to tighten and one thing to keep.",
        reflectionPrompt:
          "What changed once you heard yourself as a listener would?",
      },
    ],
  },
  {
    id: "data-structures-and-algorithms",
    name: "Data Structures & Algorithms",
    description:
      "Build core problem-solving ability by understanding how data is structured and manipulated.",
    commitment: "6 guided sessions",
    interestTags: ["Computer Science", "Problem Solving", "Engineering"],
    outcomes: [
      "Understand arrays, linked lists, stacks, and queues",
      "Apply recursion and iteration",
      "Analyse time and space complexity",
      "Solve structured coding problems",
      "Recognise common algorithm patterns",
      "Build confidence for technical interviews",
    ],
    lessons: [
      {
        id: "arrays-and-complexity",
        title: "Arrays And Complexity",
        summary:
          "Understand how data is stored and accessed, and how operations scale.",
        activity:
          "Implement basic operations on arrays and measure time complexity.",
        reflectionPrompt:
          "Which operations felt constant vs dependent on input size?",
      },
      {
        id: "linked-structures",
        title: "Linked Structures",
        summary: "Learn dynamic data structures and pointer-based thinking.",
        activity:
          "Implement a singly linked list with insert and delete operations.",
        reflectionPrompt: "What changed when memory was no longer contiguous?",
      },
      {
        id: "stacks-and-queues",
        title: "Stacks And Queues",
        summary: "Understand LIFO and FIFO behaviour and their applications.",
        activity:
          "Solve a problem using a stack (e.g., parentheses validation).",
        reflectionPrompt: "Where does order of operations become critical?",
      },
      {
        id: "recursion-basics",
        title: "Recursion Basics",
        summary: "Break problems into smaller instances of themselves.",
        activity: "Write recursive solutions for factorial and Fibonacci.",
        reflectionPrompt:
          "What makes a recursive solution elegant vs inefficient?",
      },
      {
        id: "sorting-and-searching",
        title: "Sorting And Searching",
        summary: "Explore fundamental algorithms and their trade-offs.",
        activity: "Implement bubble sort and binary search.",
        reflectionPrompt: "Why does binary search outperform linear search?",
      },
      {
        id: "problem-patterns",
        title: "Problem Patterns",
        summary: "Recognise patterns like sliding window and two pointers.",
        activity: "Solve 2–3 problems using pattern-based approaches.",
        reflectionPrompt: "What signals which pattern to use?",
      },
    ],
  },
  {
    id: "web-development-foundations",
    name: "Web Development Foundations",
    description:
      "Understand how the web works and build structured, interactive interfaces.",
    commitment: "5 guided sessions",
    interestTags: ["Web", "JavaScript", "Design"],
    outcomes: [
      "Understand HTML structure",
      "Style interfaces with CSS",
      "Add interactivity with JavaScript",
      "Work with APIs",
      "Build a small full-page project",
    ],
    lessons: [
      {
        id: "html-structure",
        title: "HTML Structure",
        summary: "Learn semantic structure and document flow.",
        activity:
          "Build a structured page using headings, sections, and forms.",
        reflectionPrompt:
          "How does structure affect readability and accessibility?",
      },
      {
        id: "css-layout",
        title: "CSS Layout",
        summary: "Use spacing, flexbox, and grid to organise content.",
        activity: "Recreate a simple layout using flexbox.",
        reflectionPrompt: "What makes a layout feel balanced vs cluttered?",
      },
      {
        id: "javascript-interactivity",
        title: "JavaScript Interactivity",
        summary: "Manipulate the DOM and respond to user actions.",
        activity: "Create a dynamic list or toggle interaction.",
        reflectionPrompt: "What connects logic to user experience?",
      },
      {
        id: "api-integration",
        title: "API Integration",
        summary: "Fetch and display external data.",
        activity: "Build a small UI that displays API data.",
        reflectionPrompt: "How does asynchronous behaviour affect flow?",
      },
      {
        id: "mini-project",
        title: "Mini Project",
        summary: "Combine all parts into one small app.",
        activity: "Build a simple web app (e.g., notes or tracker).",
        reflectionPrompt: "What did building end-to-end reveal?",
      },
    ],
  },
  {
    id: "artificial-intelligence-basics",
    name: "Artificial Intelligence Basics",
    description:
      "Understand how modern AI systems work and where they succeed or fail.",
    commitment: "5 guided sessions",
    interestTags: ["AI & Data", "Programming", "Philosophy"],
    outcomes: [
      "Understand supervised vs unsupervised learning",
      "Work with datasets",
      "Train a simple model",
      "Evaluate model performance",
      "Understand limitations and bias",
    ],
    lessons: [
      {
        id: "ai-overview",
        title: "AI Overview",
        summary:
          "Understand what AI is and how it differs from traditional programming.",
        activity: "Map real-world applications of AI systems.",
        reflectionPrompt: "Where is AI useful vs misleading?",
      },
      {
        id: "data-and-features",
        title: "Data And Features",
        summary: "Understand how data shapes model output.",
        activity: "Explore a small dataset and define features.",
        reflectionPrompt: "How does input shape influence results?",
      },
      {
        id: "simple-model",
        title: "Train A Simple Model",
        summary: "Train a basic classification or regression model.",
        activity: "Use a library to train and test a model.",
        reflectionPrompt: "What patterns did the model detect?",
      },
      {
        id: "evaluation",
        title: "Model Evaluation",
        summary: "Measure accuracy, precision, and recall.",
        activity: "Evaluate model performance on test data.",
        reflectionPrompt: "What does accuracy fail to capture?",
      },
      {
        id: "limits-and-ethics",
        title: "Limits And Ethics",
        summary: "Understand bias, hallucination, and misuse.",
        activity: "Analyse a failure case of an AI system.",
        reflectionPrompt: "Where should human judgment remain central?",
      },
    ],
  },
  {
    id: "mathematics-for-problem-solving",
    name: "Mathematics for Problem Solving",
    description: "Strengthen logical thinking and quantitative reasoning.",
    commitment: "5 guided sessions",
    interestTags: ["Mathematics", "Logic", "Engineering"],
    outcomes: [
      "Apply algebraic reasoning",
      "Understand functions and graphs",
      "Use probability basics",
      "Solve structured problems",
      "Translate real-world problems into maths",
    ],
    lessons: [
      {
        id: "algebra-core",
        title: "Algebra Core",
        summary: "Manipulate equations and expressions.",
        activity: "Solve a set of algebraic problems.",
        reflectionPrompt: "Where do errors tend to occur?",
      },
      {
        id: "functions",
        title: "Functions",
        summary: "Understand input-output relationships.",
        activity: "Graph simple functions.",
        reflectionPrompt: "How does changing variables affect behaviour?",
      },
      {
        id: "probability",
        title: "Probability Basics",
        summary: "Understand likelihood and uncertainty.",
        activity: "Solve probability scenarios.",
        reflectionPrompt: "What feels intuitive vs counterintuitive?",
      },
      {
        id: "logic-and-proof",
        title: "Logic And Proof",
        summary: "Develop structured reasoning.",
        activity: "Write a simple proof or argument.",
        reflectionPrompt: "What makes reasoning valid?",
      },
      {
        id: "applied-problems",
        title: "Applied Problems",
        summary: "Translate real scenarios into maths.",
        activity: "Solve real-world modelling problems.",
        reflectionPrompt: "Where does abstraction help or hinder?",
      },
    ],
  },
  {
    id: "fitness-and-health",
    name: "Fitness & Health",
    description: "Build a sustainable approach to physical health and energy.",
    commitment: "4 guided sessions",
    interestTags: ["Health", "Discipline", "Lifestyle"],
    outcomes: [
      "Understand basic fitness principles",
      "Build a simple workout routine",
      "Improve nutrition awareness",
      "Track and adjust habits",
    ],
    lessons: [
      {
        id: "fitness-basics",
        title: "Fitness Basics",
        summary: "Understand strength, cardio, and recovery.",
        activity: "Assess current fitness level.",
        reflectionPrompt: "Where are you starting from?",
      },
      {
        id: "build-routine",
        title: "Build A Routine",
        summary: "Create a simple weekly plan.",
        activity: "Design a 3-day routine.",
        reflectionPrompt: "What makes a plan sustainable?",
      },
      {
        id: "nutrition",
        title: "Nutrition Basics",
        summary: "Understand calories, protein, and balance.",
        activity: "Track meals for one day.",
        reflectionPrompt: "What patterns emerge?",
      },
      {
        id: "consistency",
        title: "Consistency",
        summary: "Focus on long-term adherence.",
        activity: "Set a realistic weekly target.",
        reflectionPrompt: "What breaks consistency most often?",
      },
    ],
  },
  {
    id: "personal-finance",
    name: "Personal Finance",
    description:
      "Understand money, spending, saving, and long-term financial decisions.",
    commitment: "4 guided sessions",
    interestTags: ["Finance", "Economics", "Life Skills"],
    outcomes: [
      "Track income and expenses",
      "Build a simple budget",
      "Understand saving and investing",
      "Avoid common financial mistakes",
    ],
    lessons: [
      {
        id: "money-awareness",
        title: "Money Awareness",
        summary: "Understand where money goes.",
        activity: "Track spending for one week.",
        reflectionPrompt: "What surprised you?",
      },
      {
        id: "budgeting",
        title: "Budgeting",
        summary: "Create a structured plan for money.",
        activity: "Build a simple monthly budget.",
        reflectionPrompt: "Where can you optimise?",
      },
      {
        id: "saving",
        title: "Saving",
        summary: "Understand emergency funds and goals.",
        activity: "Set a savings target.",
        reflectionPrompt: "What makes saving difficult?",
      },
      {
        id: "investing-basics",
        title: "Investing Basics",
        summary: "Understand risk, return, and compounding.",
        activity: "Research one investment type.",
        reflectionPrompt: "What trade-offs exist?",
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
