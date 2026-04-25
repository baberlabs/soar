export const LOCAL_EVENTS = [
  {
    id: "evt_london_01",
    title: "Community Classroom: Radical Curriculum Seminar",
    city: "London",
    dateLabel: "Sat 12 June",
    timeLabel: "10:00 AM",
    format: "University Seminar",
    tags: ["Digital Autonomy", "Decentralisation"],
    summary:
      "An educational networking workshop designed to restore digital autonomy. Learn how to use the SOAR platform, reclaim ownership of your data, and participate in shared digital governance.",
    impact: null,
    learningOutcomes: [
      "Dismantle algorithm-driven social media habits.",
      "Initialize your decentralised node.",
      "Build your first personal curriculum.",
    ],
    governance: "Includes an onboarding session to purchase a £1 share.",
  },
  {
    id: "evt_brum_01",
    title: "Community Classroom: Digital Literacy & Device Drop",
    city: "Birmingham",
    dateLabel: "Tue 15 June",
    timeLabel: "1:00 PM",
    format: "DPA Workshop",
    tags: ["Digital Literacy", "Data Ownership"],
    summary:
      "Overcome digital barriers with core tech skills taught by DPA personnel and receive a refurbished device to help tackle digital poverty.",
    impact: {
      partner: "Digital Poverty Alliance",
      initiative: "IT Reuse for Good Charter",
      perks: "Refurbished electronic devices available.",
    },
    learningOutcomes: [
      "Master core digital literacy skills.",
      "Understand online safety and data rights.",
      "Navigate SOAR's learning environment.",
    ],
    governance: "Optional £1 share onboarding available post-session.",
  },
  {
    id: "evt_mcr_01",
    title: "Community Classroom: Neo-Collectivist Network",
    city: "Manchester",
    dateLabel: "Thu 24 June",
    timeLabel: "6:30 PM",
    format: "Community Meetup",
    tags: ["Governance", "Community"],
    summary:
      "Join fellow community seekers to discuss cooperative governance, the one-peer-one-vote system, and how to shape community-owned platforms.",
    impact: null,
    learningOutcomes: [
      "Understand cooperative platform governance.",
      "Learn how to propose and vote.",
      "Connect meaningfully with local peers.",
    ],
    governance:
      "Active onboarding: purchase your £1 share and cast your first platform vote.",
  },
];

export const getEventById = (eventId) =>
  LOCAL_EVENTS.find((event) => event.id === eventId) ?? null;
