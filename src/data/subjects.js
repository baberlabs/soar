export const LEARNING_STYLE_LABELS = {
  V: "Visual",
  A: "Auditory",
  R: "Reading/Writing",
  K: "Kinesthetic",
};

export const SUBJECTS = [
  {
    id: "digital-autonomy",
    name: "Digital Autonomy",
    description:
      "Understand how platforms shape attention, collect data, influence behaviour, and how to regain control of your digital life.",
    commitment: "12 guided sessions",
    interestTags: [
      "Technology",
      "Data",
      "Media",
      "Critical Thinking",
      "Digital Literacy",
      "Self-Knowledge",
    ],
    outcomes: [
      "Understand how attention becomes a business asset",
      "Recognise persuasive design patterns",
      "Audit personal app usage and digital habits",
      "Understand what personal data is and how it is used",
      "Review app permissions and privacy settings",
      "Identify algorithmic influence in feeds and recommendations",
      "Build healthier notification and screen-use boundaries",
      "Practise independent information judgement",
      "Create a personal digital autonomy plan",
      "Use technology for learning, creation, and community instead of passive consumption",
    ],
    lessons: [
      {
        id: "what-is-digital-autonomy",
        title: "What Is Digital Autonomy?",
        summary:
          "Digital autonomy means being able to use technology deliberately, understand what happens to your data, and make choices that are not silently shaped by platforms.",
        activity:
          "Write a one-page digital life map: list your five most-used apps, what you use each one for, and whether each use feels chosen, automatic, or pressured.",
        reflectionPrompt:
          "Where in your digital life do you currently feel most in control, and where do you feel least in control?",
      },
      {
        id: "attention-as-a-resource",
        title: "Attention As A Resource",
        summary:
          "Your attention is limited. Many platforms are designed to capture, extend, and monetise that attention through repeated engagement.",
        activity:
          "Track your screen time for one full day and separate each session into useful, social, learning, entertainment, or automatic use.",
        reflectionPrompt:
          "Which category took more time than you expected, and what were you usually feeling before opening those apps?",
      },
      {
        id: "persuasive-design-patterns",
        title: "Persuasive Design Patterns",
        summary:
          "Features such as infinite scrolling, autoplay, streaks, likes, notifications, and algorithmic recommendations can make behaviour feel voluntary while quietly steering it.",
        activity:
          "Choose one app and identify at least five design features that encourage you to stay longer, return sooner, or check more often.",
        reflectionPrompt:
          "Which design feature has the strongest pull on your behaviour, and why does it work on you?",
      },
      {
        id: "notifications-and-interruptions",
        title: "Notifications And Interruptions",
        summary:
          "Notifications can fragment attention by turning other people’s priorities, platform nudges, and automated alerts into immediate demands.",
        activity:
          "Turn off all non-essential notifications for 48 hours, keeping only urgent communication, calendar, banking, and safety-related alerts.",
        reflectionPrompt:
          "What changed in your focus, mood, or checking behaviour when fewer things interrupted you?",
      },
      {
        id: "personal-data-basics",
        title: "What Counts As Personal Data?",
        summary:
          "Personal data is not just your name or email. It can include location, identifiers, behaviour, preferences, device information, and anything that can connect back to you.",
        activity:
          "Review three apps or services and list the types of personal data they may collect, including obvious data and less obvious behavioural data.",
        reflectionPrompt:
          "Which type of data felt most personal once you looked at it closely?",
      },
      {
        id: "permissions-audit",
        title: "Audit Your App Permissions",
        summary:
          "Apps often request access to location, camera, microphone, contacts, photos, or files. Digital autonomy requires knowing what access you have granted and whether it is justified.",
        activity:
          "Open your phone or browser privacy settings and review permissions for five apps. Revoke at least one permission that is not necessary.",
        reflectionPrompt:
          "Which permission had you forgotten about, and what does that reveal about passive consent?",
      },
      {
        id: "data-rights-in-practice",
        title: "Your Data Rights In Practice",
        summary:
          "Data protection rights can include being informed, accessing your personal data, correcting inaccurate data, and requesting erasure or restriction in some situations.",
        activity:
          "Choose one service you use and find where it explains privacy rights, account deletion, data download, or privacy controls.",
        reflectionPrompt:
          "Was the process clear and easy, or hidden and difficult? What does that say about the service’s attitude to user control?",
      },
      {
        id: "algorithmic-feeds",
        title: "Algorithmic Feeds",
        summary:
          "Recommendation systems shape what you see next. They can help discovery, but they can also narrow attention, amplify emotion, and make feeds feel more natural than they are.",
        activity:
          "For one day, notice every recommended post, video, or product you click. Write down what the system seemed to learn from your behaviour.",
        reflectionPrompt:
          "Did the feed reflect your values, your curiosity, your habits, or your weakest impulses?",
      },
      {
        id: "media-literacy-and-framing",
        title: "Media Literacy And Framing",
        summary:
          "Digital autonomy includes judging information well. Headlines, images, source choices, emotional wording, and platform context all shape interpretation.",
        activity:
          "Compare two pieces of content about the same issue from different sources. Note differences in headline, evidence, tone, missing context, and emotional framing.",
        reflectionPrompt:
          "How did presentation affect what seemed important, believable, or urgent?",
      },
      {
        id: "digital-identity",
        title: "Digital Identity",
        summary:
          "Your digital identity is built from profiles, posts, habits, search history, purchases, messages, and metadata. Some of it is chosen; some of it is inferred.",
        activity:
          "Search your public profiles and review what a stranger, employer, or platform might infer from them. Remove or update one thing that no longer represents you.",
        reflectionPrompt:
          "Which parts of your online identity feel authored by you, and which feel accumulated without intention?",
      },
      {
        id: "from-consumption-to-creation",
        title: "From Consumption To Creation",
        summary:
          "A healthier digital life is not only about using technology less. It is about using it for learning, creation, reflection, community, and meaningful action.",
        activity:
          "Replace one passive scrolling session with a 20-minute creation block: write, design, code, photograph, plan, research, or build something small.",
        reflectionPrompt:
          "What did you gain from creating that you would not have gained from consuming?",
      },
      {
        id: "your-autonomy-system",
        title: "Build Your Digital Autonomy System",
        summary:
          "Digital autonomy becomes sustainable when it is designed into your environment: defaults, permissions, routines, boundaries, and review habits.",
        activity:
          "Create a personal digital autonomy plan with five rules: one for notifications, one for social media, one for data privacy, one for learning, and one for rest.",
        reflectionPrompt:
          "Which rule will be hardest to keep, and what support or design change would make it easier?",
      },
    ],
  },

  {
    id: "media-literacy",
    name: "Media Literacy",
    description:
      "Understand how information is shaped, distributed, and interpreted.",
    commitment: "6 guided sessions",
    interestTags: ["Media", "Critical Thinking"],
    outcomes: [
      "Identify bias",
      "Evaluate sources",
      "Understand framing",
      "Recognise misinformation",
      "Think critically about narratives",
      "Form independent opinions",
    ],
    lessons: [
      {
        id: "source-evaluation",
        title: "Evaluate Sources",
        summary: "Distinguish credible sources from unreliable ones.",
        activity:
          "Compare two articles on the same topic and analyse differences.",
        reflectionPrompt:
          "What made one source more trustworthy than the other?",
      },
      {
        id: "bias-detection",
        title: "Detect Bias",
        summary: "Identify bias in language and framing.",
        activity: "Highlight emotionally loaded words in an article.",
        reflectionPrompt: "How did language influence your perception?",
      },
      {
        id: "information-flow",
        title: "How Information Spreads",
        summary: "Understand how content travels across platforms.",
        activity: "Trace one trending topic across 3 platforms.",
        reflectionPrompt: "How did the narrative change across platforms?",
      },
      {
        id: "misinformation",
        title: "Spot Misinformation",
        summary: "Recognise misleading or false content.",
        activity: "Analyse one viral post and fact-check it.",
        reflectionPrompt: "What signals indicated the content was unreliable?",
      },
      {
        id: "algorithm-awareness",
        title: "Algorithms and Feeds",
        summary: "Understand how feeds are curated.",
        activity:
          "Interact differently with content for one day and observe feed changes.",
        reflectionPrompt: "How quickly did your feed adapt to your behaviour?",
      },
      {
        id: "independent-thinking",
        title: "Form Independent Views",
        summary: "Build opinions based on reasoning, not exposure.",
        activity:
          "Write your own perspective on a current topic after research.",
        reflectionPrompt: "What influenced your final view most?",
      },
    ],
  },

  {
    id: "psychology-and-behaviour",
    name: "Psychology & Behaviour",
    description:
      "Understand how thoughts, habits, and environments shape behaviour.",
    commitment: "6 guided sessions",
    interestTags: ["Psychology", "Self"],
    outcomes: [
      "Understand habit loops",
      "Recognise triggers",
      "Improve behaviour awareness",
      "Break negative patterns",
      "Build better habits",
      "Understand decision-making",
    ],
    lessons: [
      {
        id: "habit-loop",
        title: "The Habit Loop",
        summary: "Understand cue, routine, reward cycles.",
        activity: "Identify one habit and map its loop.",
        reflectionPrompt: "What triggers this behaviour most often?",
      },
      {
        id: "environment-impact",
        title: "Environment Shapes Behaviour",
        summary: "Your surroundings influence decisions.",
        activity:
          "Change one aspect of your environment and observe behaviour change.",
        reflectionPrompt: "What changed when your environment changed?",
      },
      {
        id: "decision-making",
        title: "How Decisions Are Made",
        summary: "Explore conscious vs automatic decisions.",
        activity: "Track 10 decisions in a day and classify them.",
        reflectionPrompt: "How many decisions were automatic?",
      },
      {
        id: "breaking-patterns",
        title: "Breaking Patterns",
        summary: "Interrupt unwanted behaviour cycles.",
        activity: "Pause and delay one recurring behaviour.",
        reflectionPrompt: "What happened when you interrupted the pattern?",
      },
      {
        id: "building-habits",
        title: "Building Better Habits",
        summary: "Create habits that align with goals.",
        activity: "Start one small habit and repeat it daily.",
        reflectionPrompt: "What made the habit easier or harder to maintain?",
      },
      {
        id: "identity-and-behaviour",
        title: "Identity and Behaviour",
        summary: "Behaviour aligns with identity.",
        activity:
          "Define the identity you want and one action that supports it.",
        reflectionPrompt: "What actions reinforce that identity?",
      },
    ],
  },

  {
    id: "self-awareness",
    name: "Self Awareness",
    description:
      "Develop a deeper understanding of thoughts, emotions, and behaviour.",
    commitment: "6 guided sessions",
    interestTags: ["Reflection", "Philosophy"],
    outcomes: [
      "Recognise emotional patterns",
      "Understand internal dialogue",
      "Improve clarity of thought",
      "Build reflection habits",
      "Reduce reactivity",
      "Strengthen self-knowledge",
    ],
    lessons: [
      {
        id: "observe-thoughts",
        title: "Observe Your Thoughts",
        summary: "Notice your thinking patterns.",
        activity: "Write down recurring thoughts over a day.",
        reflectionPrompt: "Which thoughts repeat most often?",
      },
      {
        id: "emotional-awareness",
        title: "Understand Emotions",
        summary: "Identify emotional responses.",
        activity: "Track emotional highs and lows.",
        reflectionPrompt: "What triggered each emotion?",
      },
      {
        id: "internal-dialogue",
        title: "Internal Dialogue",
        summary: "Examine how you talk to yourself.",
        activity: "Write your internal dialogue in a stressful moment.",
        reflectionPrompt: "Was your internal voice helpful or limiting?",
      },
      {
        id: "reflection-practice",
        title: "Build Reflection Habit",
        summary: "Make reflection consistent.",
        activity: "Write a daily reflection for 3 days.",
        reflectionPrompt: "What patterns are emerging?",
      },
      {
        id: "reduce-reactivity",
        title: "Reduce Reactivity",
        summary: "Pause before reacting.",
        activity: "Pause for 10 seconds before responding in a situation.",
        reflectionPrompt: "What changed when you paused?",
      },
      {
        id: "clarity-of-self",
        title: "Clarity of Self",
        summary: "Understand your core values.",
        activity: "Write your top 5 values and why they matter.",
        reflectionPrompt: "How aligned are your actions with your values?",
      },
    ],
  },

  // Remaining subjects (shortened for space but fully structured)

  {
    id: "film-studies",
    name: "Film Studies",
    description: "Understand storytelling through film.",
    commitment: "6 guided sessions",
    interestTags: ["Film", "Storytelling"],
    outcomes: ["Analyse scenes", "Understand narrative"],
    lessons: [
      {
        id: "scene-analysis",
        title: "Scene Analysis",
        summary: "Break down a film scene.",
        activity: "Analyse one scene.",
        reflectionPrompt: "What stood out most?",
      },
      {
        id: "cinematography",
        title: "Cinematography",
        summary: "Study visuals.",
        activity: "Observe lighting.",
        reflectionPrompt: "How did visuals affect tone?",
      },
      {
        id: "editing",
        title: "Editing",
        summary: "Understand pacing.",
        activity: "Analyse cuts.",
        reflectionPrompt: "How did pacing change emotion?",
      },
      {
        id: "sound",
        title: "Sound Design",
        summary: "Role of sound.",
        activity: "Focus on audio.",
        reflectionPrompt: "What did sound add?",
      },
      {
        id: "themes",
        title: "Themes",
        summary: "Identify themes.",
        activity: "Write themes.",
        reflectionPrompt: "What message emerged?",
      },
      {
        id: "create",
        title: "Create Analysis",
        summary: "Final piece.",
        activity: "Write full analysis.",
        reflectionPrompt: "What improved?",
      },
    ],
  },

  {
    id: "music-production",
    name: "Music Production",
    description: "Create and structure sound.",
    commitment: "6 guided sessions",
    interestTags: ["Music"],
    outcomes: ["Understand sound", "Create track"],
    lessons: [
      {
        id: "sound-basics",
        title: "Sound Basics",
        summary: "Understand sound.",
        activity: "Explore sounds.",
        reflectionPrompt: "What did you notice?",
      },
      {
        id: "rhythm",
        title: "Rhythm",
        summary: "Understand beats.",
        activity: "Create rhythm.",
        reflectionPrompt: "What worked?",
      },
      {
        id: "melody",
        title: "Melody",
        summary: "Create melody.",
        activity: "Build melody.",
        reflectionPrompt: "What stood out?",
      },
      {
        id: "structure",
        title: "Structure",
        summary: "Song structure.",
        activity: "Arrange track.",
        reflectionPrompt: "What improved flow?",
      },
      {
        id: "mixing",
        title: "Mixing",
        summary: "Balance audio.",
        activity: "Adjust levels.",
        reflectionPrompt: "What changed?",
      },
      {
        id: "final",
        title: "Final Track",
        summary: "Complete track.",
        activity: "Export track.",
        reflectionPrompt: "What did you learn?",
      },
    ],
  },

  {
    id: "politics-and-power",
    name: "Politics & Power",
    description: "Understand systems of power.",
    commitment: "6 guided sessions",
    interestTags: ["Politics"],
    outcomes: ["Understand systems"],
    lessons: [
      {
        id: "power",
        title: "Power Structures",
        summary: "Who holds power.",
        activity: "Map power.",
        reflectionPrompt: "Who influences most?",
      },
      {
        id: "systems",
        title: "Political Systems",
        summary: "Types of systems.",
        activity: "Compare systems.",
        reflectionPrompt: "What differences matter?",
      },
      {
        id: "media",
        title: "Media Influence",
        summary: "Media role.",
        activity: "Analyse media.",
        reflectionPrompt: "What bias exists?",
      },
      {
        id: "policy",
        title: "Policy",
        summary: "How policy works.",
        activity: "Review policy.",
        reflectionPrompt: "Who benefits?",
      },
      {
        id: "citizenship",
        title: "Citizenship",
        summary: "Role of citizens.",
        activity: "Define role.",
        reflectionPrompt: "What responsibility do you have?",
      },
      {
        id: "action",
        title: "Action",
        summary: "Engage actively.",
        activity: "Take one civic action.",
        reflectionPrompt: "What impact did it have?",
      },
    ],
  },

  {
    id: "history-and-society",
    name: "History & Society",
    description: "Understand how societies evolve.",
    commitment: "6 guided sessions",
    interestTags: ["History"],
    outcomes: ["Understand patterns"],
    lessons: [
      {
        id: "patterns",
        title: "Patterns",
        summary: "Recurring patterns.",
        activity: "Identify pattern.",
        reflectionPrompt: "What repeats?",
      },
      {
        id: "events",
        title: "Key Events",
        summary: "Major events.",
        activity: "Analyse event.",
        reflectionPrompt: "What changed?",
      },
      {
        id: "culture",
        title: "Culture",
        summary: "Cultural shifts.",
        activity: "Compare cultures.",
        reflectionPrompt: "What differs?",
      },
      {
        id: "economy",
        title: "Economy",
        summary: "Economic systems.",
        activity: "Review system.",
        reflectionPrompt: "Who benefits?",
      },
      {
        id: "conflict",
        title: "Conflict",
        summary: "Conflict causes.",
        activity: "Analyse conflict.",
        reflectionPrompt: "What caused it?",
      },
      {
        id: "modern",
        title: "Modern Society",
        summary: "Today’s world.",
        activity: "Connect past to present.",
        reflectionPrompt: "What carries forward?",
      },
    ],
  },
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
