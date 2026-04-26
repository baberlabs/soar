export const INITIAL_PROPOSALS = [
  {
    id: "prop_001",
    title: "Introduce Digital Autonomy as Core Learning Pathway",
    description:
      "Propose making Digital Autonomy a mandatory introductory pathway for all new peers to ensure awareness of attention, data usage, and platform influence before engaging with other subjects.",
    authorId: "m2",
    status: "voting",
    votes: {
      m1: { value: "yes", castAt: "2026-04-01T10:00:00.000Z" },
      m3: { value: "yes", castAt: "2026-04-01T11:00:00.000Z" },
      m5: { value: "no", castAt: "2026-04-01T12:00:00.000Z" },
    },
    comments: [
      {
        id: "c1",
        body: "Strongly support this. Without this foundation, people will fall back into passive habits.",
        authorId: "m3",
        at: "2026-04-01T11:05:00.000Z",
      },
      {
        id: "c2",
        body: "Agree in principle, but making it mandatory might reduce accessibility.",
        authorId: "m5",
        at: "2026-04-01T12:10:00.000Z",
      },
    ],
    attachments: [],
    createdAt: "2026-03-30T09:00:00.000Z",
    updatedAt: "2026-04-01T12:15:00.000Z",
    publishedAt: "2026-03-30T10:00:00.000Z",
    votingOpenedAt: "2026-04-01T09:00:00.000Z",
    votingDeadline: "2026-04-05T09:00:00.000Z",
  },

  {
    id: "prop_002",
    title: "Add Media Literacy Pathway",
    description:
      "Introduce a structured Media Literacy pathway focused on bias detection, misinformation, and independent thinking.",
    authorId: "m8",
    status: "discussion",
    votes: {},
    comments: [
      {
        id: "c3",
        body: "This complements Digital Autonomy well. Should be strongly recommended.",
        authorId: "m2",
        at: "2026-04-02T14:00:00.000Z",
      },
    ],
    attachments: [],
    createdAt: "2026-04-02T13:30:00.000Z",
    updatedAt: "2026-04-02T14:00:00.000Z",
    publishedAt: "2026-04-02T13:45:00.000Z",
  },

  {
    id: "prop_003",
    title: "Community Classroom Expansion to 10 Cities",
    description:
      "Expand Community Classrooms beyond initial rollout to reach 10 cities within the first year, prioritising areas with high digital exclusion.",
    authorId: "m6",
    status: "discussion",
    votes: {},
    comments: [],
    attachments: [],
    createdAt: "2026-04-03T09:00:00.000Z",
    updatedAt: "2026-04-03T09:00:00.000Z",
    publishedAt: "2026-04-03T10:00:00.000Z",
  },

  {
    id: "prop_004",
    title: "Require Reflection Completion for Accreditation",
    description:
      "Ensure that accreditation is only granted when users complete reflection steps, not just lessons, reinforcing deeper learning.",
    authorId: "m4",
    status: "closed",
    votes: {
      m1: { value: "yes", castAt: "2026-03-25T10:00:00.000Z" },
      m2: { value: "yes", castAt: "2026-03-25T10:10:00.000Z" },
      m3: { value: "yes", castAt: "2026-03-25T10:20:00.000Z" },
    },
    comments: [
      {
        id: "c4",
        body: "Reflection is the core of learning here. This should absolutely be required.",
        authorId: "m2",
        at: "2026-03-25T10:15:00.000Z",
      },
    ],
    attachments: [],
    createdAt: "2026-03-24T09:00:00.000Z",
    updatedAt: "2026-03-26T09:00:00.000Z",
    publishedAt: "2026-03-24T10:00:00.000Z",
    votingOpenedAt: "2026-03-25T09:00:00.000Z",
    votingDeadline: "2026-03-26T09:00:00.000Z",
    closedAt: "2026-03-26T09:00:00.000Z",
    implementedAt: "2026-03-27T12:00:00.000Z",
    implementationNote:
      "Reflection step now required before marking lessons complete.",
  },

  {
    id: "prop_005",
    title: "Limit Infinite Scroll in Platform UI",
    description:
      "Introduce strict limits on infinite scroll and replace with intentional navigation to align with anti-passive design principles.",
    authorId: "m3",
    status: "implemented",
    votes: {
      m1: { value: "yes", castAt: "2026-03-10T09:00:00.000Z" },
      m2: { value: "yes", castAt: "2026-03-10T09:10:00.000Z" },
      m6: { value: "yes", castAt: "2026-03-10T09:20:00.000Z" },
    },
    comments: [],
    attachments: [],
    createdAt: "2026-03-09T08:00:00.000Z",
    updatedAt: "2026-03-11T10:00:00.000Z",
    publishedAt: "2026-03-09T09:00:00.000Z",
    votingOpenedAt: "2026-03-10T08:00:00.000Z",
    votingDeadline: "2026-03-11T08:00:00.000Z",
    closedAt: "2026-03-11T08:00:00.000Z",
    implementedAt: "2026-03-12T12:00:00.000Z",
    implementationNote:
      "Infinite scroll removed and replaced with paginated learning sections.",
  },

  {
    id: "prop_006",
    title: "Introduce Peer-Led Study Circles",
    description:
      "Allow peers to create and host study circles based on subjects they are learning, encouraging collaboration and accountability.",
    authorId: "m7",
    status: "discussion",
    votes: {},
    comments: [],
    attachments: [],
    createdAt: "2026-04-04T10:00:00.000Z",
    updatedAt: "2026-04-04T10:00:00.000Z",
    publishedAt: "2026-04-04T10:30:00.000Z",
  },
];

const cloneProposal = (proposal) => ({
  ...proposal,
  votes: Object.fromEntries(
    Object.entries(proposal.votes ?? {}).map(([peerId, vote]) => [
      peerId,
      { ...vote },
    ]),
  ),
  comments: (proposal.comments ?? []).map((comment) => ({ ...comment })),
  attachments: (proposal.attachments ?? []).map((attachment) => ({
    ...attachment,
  })),
});

export const createInitialProposals = () => INITIAL_PROPOSALS.map(cloneProposal);

export const mergeInitialProposals = (proposals = []) => {
  const existingProposals = Array.isArray(proposals) ? proposals : [];
  const existingIds = new Set(
    existingProposals.map((proposal) => proposal?.id),
  );
  const missingSeeds = createInitialProposals().filter(
    (proposal) => !existingIds.has(proposal.id),
  );

  return [...existingProposals, ...missingSeeds];
};
