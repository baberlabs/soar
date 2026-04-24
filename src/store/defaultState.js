import { SUBJECTS } from "../data/subjects";

export const STORE_VERSION = 2;

export const createDefaultStore = () => ({
  version: STORE_VERSION,
  session: { currentUserId: null },
  peers: [],
  subjects: SUBJECTS,
  forum: [],
  connections: [],
  newsletterSubscribers: [],
});
