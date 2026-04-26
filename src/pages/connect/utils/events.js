export const LOCAL_EVENTS = [
  {
    id: "evt_london_01",
    title: "Community Classroom: Digital Autonomy & Platform Onboarding",
    city: "London",
    dateLabel: "Sat 12 June",
    timeLabel: "10:00 AM",
    format: "University Seminar",
    tags: ["Digital Autonomy", "Data Ownership", "Platform Intro"],
    summary:
      "A full Community Classroom session introducing SOAR’s mission, digital autonomy, and how to use the platform. Includes a guided learning experience, discussion on data ownership, and onboarding into the community.",
    impact: {
      partner: "Digital Poverty Alliance",
      initiative: "IT Reuse for Good Charter",
      perks:
        "Digital literacy materials, guided onboarding, and optional refurbished device access.",
    },
    learningOutcomes: [
      "Understand how platforms influence attention and behaviour.",
      "Learn what digital autonomy means in practice.",
      "Set up a SOAR account and begin a learning pathway.",
      "Experience a structured 20-minute learning session.",
      "Understand community ownership and governance.",
    ],
    governance:
      "Includes introduction to community ownership and optional £1 share onboarding.",
  },

  {
    id: "evt_brum_01",
    title: "Community Classroom: Digital Literacy & Device Access",
    city: "Birmingham",
    dateLabel: "Tue 15 June",
    timeLabel: "1:00 PM",
    format: "DPA Workshop",
    tags: ["Digital Literacy", "Inclusion", "Skills"],
    summary:
      "A practical workshop focused on improving digital confidence. Delivered in partnership with Digital Poverty Alliance, including hands-on support and access to refurbished devices.",
    impact: {
      partner: "Digital Poverty Alliance",
      initiative: "IT Reuse for Good Charter",
      perks:
        "Refurbished devices distributed and take-home digital literacy materials.",
    },
    learningOutcomes: [
      "Build confidence using digital tools.",
      "Understand online safety and privacy basics.",
      "Navigate essential digital services.",
      "Begin structured learning on SOAR.",
    ],
    governance: "Optional onboarding into SOAR community after session.",
  },

  {
    id: "evt_mcr_01",
    title: "Community Classroom: Governance & Collective Ownership",
    city: "Manchester",
    dateLabel: "Thu 24 June",
    timeLabel: "6:30 PM",
    format: "Community Meetup",
    tags: ["Governance", "Community", "Ownership"],
    summary:
      "A community-focused session exploring cooperative governance, decentralised platforms, and how users can shape digital systems through participation.",
    impact: null,
    learningOutcomes: [
      "Understand one-peer-one-vote governance.",
      "Learn how proposals and voting work on SOAR.",
      "Discuss alternatives to Big Tech platforms.",
      "Connect with local peers.",
    ],
    governance:
      "Active onboarding: participants can purchase a £1 share and vote.",
  },

  {
    id: "evt_cardiff_01",
    title: "Community Classroom: Media Literacy & Critical Thinking",
    city: "Cardiff",
    dateLabel: "Sat 3 July",
    timeLabel: "11:00 AM",
    format: "Library Workshop",
    tags: ["Media Literacy", "Critical Thinking"],
    summary:
      "A workshop focused on understanding how information is shaped online. Includes exercises on bias detection, misinformation, and independent thinking.",
    impact: null,
    learningOutcomes: [
      "Identify bias in digital content.",
      "Recognise misinformation patterns.",
      "Compare sources critically.",
      "Develop independent judgement.",
    ],
    governance: "Optional onboarding to SOAR learning pathways after session.",
  },

  {
    id: "evt_plymouth_01",
    title: "Community Classroom: Focus, Attention & Learning",
    city: "Plymouth",
    dateLabel: "Wed 7 July",
    timeLabel: "2:00 PM",
    format: "Community Centre Session",
    tags: ["Focus", "Learning", "Self-Development"],
    summary:
      "A session exploring attention, distraction, and how to build effective learning habits. Includes a live SOAR lesson demonstration.",
    impact: null,
    learningOutcomes: [
      "Understand attention fragmentation.",
      "Experience a 20-minute structured learning session.",
      "Learn how to build consistent study habits.",
      "Shift from passive to active learning.",
    ],
    governance: "Introduction to SOAR community and learning model.",
  },

  {
    id: "evt_london_02",
    title: "Community Classroom: Creative Expression & Identity",
    city: "London",
    dateLabel: "Sun 11 July",
    timeLabel: "4:00 PM",
    format: "Cafe Workshop",
    tags: ["Creativity", "Expression", "Identity"],
    summary:
      "A relaxed creative session where participants explore writing, photography, and expression as tools for reflection and identity building.",
    impact: null,
    learningOutcomes: [
      "Use creativity as a reflection tool.",
      "Develop confidence in expression.",
      "Share ideas within a supportive group.",
      "Connect with other creative peers.",
    ],
    governance: "Optional onboarding into SOAR creative pathways.",
  },

  {
    id: "evt_brum_02",
    title: "Community Classroom: Personal Finance & Real-World Skills",
    city: "Birmingham",
    dateLabel: "Sat 17 July",
    timeLabel: "12:00 PM",
    format: "Workshop",
    tags: ["Finance", "Life Skills"],
    summary:
      "A practical session on budgeting, saving, and financial awareness, aligned with SOAR’s real-world learning pathways.",
    impact: null,
    learningOutcomes: [
      "Understand basic budgeting.",
      "Track spending habits.",
      "Identify financial goals.",
      "Connect financial literacy to long-term autonomy.",
    ],
    governance: "Optional pathway enrolment after session.",
  },

  {
    id: "evt_mcr_02",
    title: "Community Classroom: Technology, AI & Society",
    city: "Manchester",
    dateLabel: "Tue 20 July",
    timeLabel: "6:00 PM",
    format: "University Talk",
    tags: ["AI", "Technology", "Society"],
    summary:
      "An educational session exploring how AI and modern technologies shape society, behaviour, and decision-making.",
    impact: null,
    learningOutcomes: [
      "Understand AI basics and limitations.",
      "Recognise where AI influences daily life.",
      "Discuss ethical implications.",
      "Explore human vs automated decision-making.",
    ],
    governance: "Discussion-based onboarding into SOAR community.",
  },
];

export const getEventById = (eventId) =>
  LOCAL_EVENTS.find((event) => event.id === eventId) ?? null;
