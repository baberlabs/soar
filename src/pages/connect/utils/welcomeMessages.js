/**
 * Pool of plausible opening messages a peer might send on accepting a request.
 *
 * Kept varied and slightly personalised via {peerFirstName} placeholder that
 * the caller resolves. The pool is intentionally modest — 8 entries — so the
 * mock feels hand-written rather than generated.
 */
const WELCOME_MESSAGES = [
  "Hey! Thanks for the connection. What are you working on at the moment?",
  "Good to meet you here. Saw we share a few interests — happy to swap notes any time.",
  "Thanks for the request. I've been looking for people to learn alongside — feel free to share what you're exploring.",
  "Appreciate the connect. I'm quite active in the evenings (UK time) if you ever want to compare pathway notes.",
  "Thanks for reaching out. Always glad to meet another SOAR member — what drew you to join?",
  "Nice to connect. Let me know if you ever want a second pair of eyes on something you're building.",
  "Thanks for the request. I've been meaning to find more collaborators — what's on your plate this month?",
  "Good to have you in the network. Feel free to drop in about anything you're stuck on.",
];

/**
 * Pick a welcome message for a peer. Deterministic per peer ID so the same
 * peer always greets with the same message — avoids feeling random on
 * repeated test runs, and survives reloads without drift.
 */
export const pickWelcomeMessage = (peerId) => {
  if (!peerId) return WELCOME_MESSAGES[0];

  // Simple deterministic hash: sum of char codes mod pool length.
  let hash = 0;
  for (let i = 0; i < peerId.length; i += 1) {
    hash = (hash + peerId.charCodeAt(i)) % WELCOME_MESSAGES.length;
  }
  return WELCOME_MESSAGES[hash];
};
