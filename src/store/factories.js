export const nowIso = () => new Date().toISOString();

export const createId = (prefix) =>
  `${prefix}_${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`;

export const createEnrollment = (subjectId, payload = {}) => ({
  id: payload.id ?? createId("curriculum"),
  subjectId,
  targetDate: payload.targetDate ?? "",
  learningNotes: payload.learningNotes ?? "",
  learningStyle: payload.learningStyle ?? "general",
  enrolledAt: payload.enrolledAt ?? nowIso(),
  completedLessonIds: Array.isArray(payload.completedLessonIds)
    ? [...new Set(payload.completedLessonIds.filter(Boolean))]
    : [],
  progress: Number.isFinite(payload.progress) ? payload.progress : 0,
  completedAt: payload.completedAt ?? null,
  lastActivityAt: payload.lastActivityAt ?? null,
});

export const createPeer = (payload = {}) => ({
  id: payload.id ?? createId("peer"),
  fullName: payload.fullName ?? "",
  email: payload.email ?? "",
  password: payload.password ?? "",
  joinedAt: payload.joinedAt ?? nowIso(),
  paid: payload.paid ?? true,
  onboardingComplete: payload.onboardingComplete ?? false,
  learningStyle: payload.learningStyle ?? null,
  interests: Array.isArray(payload.interests) ? payload.interests : [],
  curriculum: Array.isArray(payload.curriculum) ? payload.curriculum : [],
  creations: Array.isArray(payload.creations) ? payload.creations : [],
  reflections: payload.reflections ?? undefined,
  avatarImage: payload.avatarImage ?? null,
  bio: payload.bio ?? "",
  location: payload.location ?? "",
  timezone: payload.timezone ?? "",
  links: payload.links ?? { website: "", github: "", linkedin: "" },
  preferences: payload.preferences ?? { theme: "system", notifications: null },
});

export const createConnection = (payload = {}) => ({
  id: payload.id ?? createId("connection"),
  peers: Array.isArray(payload.peers)
    ? Array.from(new Set(payload.peers.filter(Boolean)))
    : [],
  status: payload.status ?? "pending",
  createdAt: payload.createdAt ?? nowIso(),
  acceptedAt: payload.acceptedAt ?? null,
  messages: Array.isArray(payload.messages) ? payload.messages : [],
});

export const createMessage = (payload = {}) => ({
  id: payload.id ?? createId("message"),
  at: payload.at ?? nowIso(),
  body: payload.body ?? "",
  fromUserId: payload.fromUserId ?? null,
});

export const createProposal = (payload = {}) => ({
  id: payload.id ?? createId("proposal"),
  title: payload.title ?? "",
  description: payload.description ?? "",
  authorId: payload.authorId ?? null,
  status: payload.status ?? "draft",
  votes: payload.votes ?? {},
  comments: Array.isArray(payload.comments) ? payload.comments : [],
  attachments: Array.isArray(payload.attachments) ? payload.attachments : [],
  createdAt: payload.createdAt ?? nowIso(),
  updatedAt: payload.updatedAt ?? payload.createdAt ?? nowIso(),
  publishedAt: payload.publishedAt ?? null,
  votingOpenedAt: payload.votingOpenedAt ?? null,
  votingDeadline: payload.votingDeadline ?? null,
  closedAt: payload.closedAt ?? null,
  implementedAt: payload.implementedAt ?? null,
  implementationNote: payload.implementationNote ?? "",
  withdrawnAt: payload.withdrawnAt ?? null,
});

export const createProposalComment = (payload = {}) => ({
  id: payload.id ?? createId("comment"),
  body: payload.body ?? "",
  authorId: payload.authorId ?? null,
  at: payload.at ?? nowIso(),
});

export const createNewsletterSubscriber = (payload = {}) => ({
  id: payload.id ?? createId("dispatch"),
  email: payload.email ?? "",
  subscribedAt: payload.subscribedAt ?? nowIso(),
});
