import { SUBJECTS } from "../data/subjects";
import { createDefaultStore } from "./defaultState";
import {
  createEnrollment,
  createId,
  createNewsletterSubscriber,
  createPeer,
  createProposal,
  createProposalComment,
  createConnection,
  createMessage,
} from "./factories";

const DEFAULT_LINKS = {
  website: "",
  github: "",
  linkedin: "",
};

const DEFAULT_PREFERENCES = {
  theme: "system",
  notifications: null,
};

export const DEFAULT_REFLECTIONS = {
  visionBoards: [],
  letters: [],
  lessonEntries: [],
};

export const normalizeReflections = (reflections) => ({
  visionBoards: Array.isArray(reflections?.visionBoards)
    ? reflections.visionBoards
    : [],
  letters: Array.isArray(reflections?.letters) ? reflections.letters : [],
  lessonEntries: Array.isArray(reflections?.lessonEntries)
    ? reflections.lessonEntries
    : [],
});

export const normalizeEnrollment = (entry = {}) =>
  createEnrollment(entry.subjectId ?? "", entry);

export const normalizePeer = (peer = {}) => {
  const base = createPeer(peer);

  return {
    ...base,
    interests: Array.isArray(base.interests) ? base.interests : [],
    curriculum: Array.isArray(base.curriculum)
      ? base.curriculum.map(normalizeEnrollment)
      : [],
    creations: Array.isArray(base.creations) ? base.creations : [],
    reflections: normalizeReflections(base.reflections),
    links: {
      ...DEFAULT_LINKS,
      ...(base.links ?? {}),
    },
    preferences: {
      ...DEFAULT_PREFERENCES,
      ...(base.preferences ?? {}),
    },
  };
};

export const normalizeVotes = (votes) => {
  if (!votes || typeof votes !== "object") return {};

  const out = {};

  Object.entries(votes).forEach(([userId, raw]) => {
    if (raw === true) {
      out[userId] = { value: "yes", castAt: null };
      return;
    }

    if (raw === false) {
      out[userId] = { value: "no", castAt: null };
      return;
    }

    if (raw && typeof raw === "object" && raw.value) {
      out[userId] = {
        value: raw.value,
        castAt: raw.castAt ?? null,
      };
    }
  });

  return out;
};

export const normalizeProposalAttachments = (attachments) => {
  if (!Array.isArray(attachments)) return [];

  return attachments
    .map((attachment) => ({
      id: attachment?.id ?? createId("attachment"),
      name: attachment?.name ?? "Attachment",
      type: attachment?.type ?? "application/octet-stream",
      size: Number.isFinite(attachment?.size) ? attachment.size : 0,
      dataUrl: attachment?.dataUrl ?? null,
    }))
    .filter((attachment) => Boolean(attachment.dataUrl));
};

export const normalizeProposalComment = (comment = {}) =>
  createProposalComment(comment);

export const normalizeProposal = (proposal = {}) => {
  const base = createProposal(proposal);

  return {
    ...base,
    status:
      base.status === "open"
        ? "discussion"
        : base.status === "closed"
          ? "closed"
          : (base.status ?? "draft"),
    votes: normalizeVotes(base.votes),
    comments: Array.isArray(base.comments)
      ? base.comments.map(normalizeProposalComment)
      : [],
    attachments: normalizeProposalAttachments(base.attachments),
  };
};

export const normalizeMessage = (message = {}) => createMessage(message);

export const normalizeConnection = (connection = {}) => {
  const base = createConnection(connection);

  return {
    ...base,
    peers: Array.from(new Set(base.peers.filter(Boolean))),
    messages: Array.isArray(base.messages)
      ? base.messages.map(normalizeMessage)
      : [],
  };
};

export const normalizeNewsletterSubscriber = (subscriber = {}) =>
  createNewsletterSubscriber({
    ...subscriber,
    email: subscriber?.email?.trim?.().toLowerCase?.() ?? "",
  });

export const sanitizePeer = (peer) => {
  const { password: _password, ...safePeer } = normalizePeer(peer);
  return safePeer;
};

export const normalizeRSVPs = (rsvps) => {
  if (!Array.isArray(rsvps)) return [];
  return Array.from(
    new Set(rsvps.filter((id) => typeof id === "string" && id.trim() !== "")),
  );
};

export const normalizeStore = (candidate = {}) => {
  const defaults = createDefaultStore();

  return {
    ...defaults,
    ...(candidate ?? {}),
    version: defaults.version,
    session: {
      ...defaults.session,
      ...(candidate?.session ?? {}),
    },
    peers: Array.isArray(candidate?.peers)
      ? candidate.peers.map(normalizePeer)
      : [],
    subjects: SUBJECTS,
    forum: Array.isArray(candidate?.forum)
      ? candidate.forum.map(normalizeProposal)
      : [],
    connections: Array.isArray(candidate?.connections)
      ? candidate.connections.map(normalizeConnection)
      : [],
    newsletterSubscribers: Array.isArray(candidate?.newsletterSubscribers)
      ? candidate.newsletterSubscribers.map(normalizeNewsletterSubscriber)
      : [],
    rsvps: normalizeRSVPs(candidate?.rsvps),
  };
};
