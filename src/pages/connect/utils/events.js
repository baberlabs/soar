// Sourced from the original Connect page. Kept as a module constant so the
// events tab can import it without carrying a fake fetch layer.
export const LOCAL_EVENTS = [
  {
    id: "evt_1",
    title: "SOAR Skill Exchange: Build and Share",
    city: "Manchester",
    dateLabel: "Sat 27 Apr, 11:00",
    format: "Workshop",
    tags: ["Design", "JavaScript", "Writing"],
    summary:
      "Peer-led practical session where each person teaches one repeatable skill and leaves with a finished output.",
  },
  {
    id: "evt_2",
    title: "Monthly Reflection Walk",
    city: "Bristol",
    dateLabel: "Sun 5 May, 09:30",
    format: "In-person meetup",
    tags: ["Meditation", "Leadership", "Philosophy"],
    summary:
      "Structured reflection walk with monthly prompts, intention setting, and accountability pairing.",
  },
  {
    id: "evt_3",
    title: "Creative Practice Evening",
    city: "London",
    dateLabel: "Thu 9 May, 18:30",
    format: "Studio session",
    tags: ["Photography", "Film", "Writing"],
    summary:
      "Focused practice blocks and critique rounds for draft visuals, short writing, and storytelling.",
  },
];

export const buildEvents = (interests = []) =>
  LOCAL_EVENTS.map((event) => ({
    ...event,
    relevance: event.tags.filter((tag) => interests.includes(tag)).length,
  })).sort((a, b) => b.relevance - a.relevance);

export const getEventById = (eventId) =>
  LOCAL_EVENTS.find((event) => event.id === eventId) ?? null;
