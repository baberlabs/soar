import { SUBJECTS } from "../data/subjects";
import { createInitialProposals } from "../data/proposals";

export const STORE_VERSION = 2;

export const createDefaultStore = () => ({
  version: STORE_VERSION,
  session: { currentUserId: null },
  peers: [],
  subjects: SUBJECTS,
  forum: createInitialProposals(),
  connections: [],
  newsletterSubscribers: [],
  rsvps: [],
});
