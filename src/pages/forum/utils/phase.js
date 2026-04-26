/**
 * Phase derivation + presentation for proposals.
 *
 * Effective phase is a computed value, not a stored one. A proposal stored
 * as `voting` whose `votingDeadline` has passed should be treated as
 * `closed` by the UI; but the stored status only flips on an explicit
 * action. This keeps the reducer simple (no time-triggered reducers) and
 * means the app stays honest without a background tick.
 */

export const PHASES = {
  DRAFT: "draft",
  DISCUSSION: "discussion",
  VOTING: "voting",
  CLOSED: "closed",
  IMPLEMENTED: "implemented",
  WITHDRAWN: "withdrawn",
};

/**
 * Given a stored proposal, return the phase the UI should render.
 * Only one transition is computed: voting → closed when deadline passes.
 * Everything else is a user-triggered transition captured in `status`.
 */
export const computeEffectivePhase = (proposal) => {
  if (!proposal) return PHASES.DRAFT;

  if (
    proposal.status === PHASES.VOTING &&
    proposal.votingDeadline &&
    new Date(proposal.votingDeadline) <= new Date()
  ) {
    return PHASES.CLOSED;
  }

  return proposal.status;
};

/**
 * Presentation: what to show users for a given phase.
 */
export const getPhaseLabel = (phase) => {
  switch (phase) {
    case PHASES.DRAFT:
      return "Draft";
    case PHASES.DISCUSSION:
      return "Discussion";
    case PHASES.VOTING:
      return "Voting";
    case PHASES.CLOSED:
      return "Closed";
    case PHASES.IMPLEMENTED:
      return "Implemented";
    case PHASES.WITHDRAWN:
      return "Withdrawn";
    default:
      return phase;
  }
};

/**
 * Colour tokens for the PhaseBadge. Maps to Tailwind classes in the
 * component so the utility stays framework-neutral.
 */
export const getPhaseTone = (phase) => {
  switch (phase) {
    case PHASES.DRAFT:
      return "neutral";
    case PHASES.DISCUSSION:
      return "sky";
    case PHASES.VOTING:
      return "yellow";
    case PHASES.CLOSED:
      return "brand";
    case PHASES.IMPLEMENTED:
      return "sage";
    case PHASES.WITHDRAWN:
      return "rose";
    default:
      return "neutral";
  }
};

/**
 * Tab filter — given a phase filter token from the URL, return a predicate
 * function over proposals. Keeps tab routing simple: each tab just supplies
 * its slug and we generate the filter.
 */
export const getPhaseFilter = (filter) => {
  switch (filter) {
    case "all":
      // Everything the public sees — excludes drafts.
      return (p) => computeEffectivePhase(p) !== PHASES.DRAFT;
    case "discussion":
      return (p) => computeEffectivePhase(p) === PHASES.DISCUSSION;
    case "voting":
      return (p) => computeEffectivePhase(p) === PHASES.VOTING;
    case "closed":
      // Closed + implemented + withdrawn — all finalised states.
      return (p) => {
        const phase = computeEffectivePhase(p);
        return (
          phase === PHASES.CLOSED ||
          phase === PHASES.IMPLEMENTED ||
          phase === PHASES.WITHDRAWN
        );
      };
    default:
      return () => false;
  }
};

/**
 * Does the given effective phase allow a new vote?
 * Deadline handling is in computeEffectivePhase already, so this is trivial.
 */
export const canVote = (phase) => phase === PHASES.VOTING;

/**
 * Does this phase allow comments (new ones)?
 */
export const canComment = (phase) =>
  phase === PHASES.DISCUSSION ||
  phase === PHASES.CLOSED ||
  phase === PHASES.IMPLEMENTED;

/**
 * Should individual peer votes be revealed?
 * Only after voting has effectively closed.
 */
export const areVotesRevealed = (phase) =>
  phase === PHASES.CLOSED ||
  phase === PHASES.IMPLEMENTED ||
  phase === PHASES.WITHDRAWN;
