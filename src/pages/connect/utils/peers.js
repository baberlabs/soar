import { PEER_DIRECTORY } from "../../../data/peers";

/**
 * Rank peers by shared interests + pathways with the current user.
 * Returns a new array of peers annotated with score and overlap metadata.
 */
export const buildRecommendedPeers = ({
  interests = [],
  pathwayIds = [],
  pathwayFilter = "all",
  searchTerm = "",
  connections = [],
}) => {
  const needle = searchTerm.trim().toLowerCase();

  return PEER_DIRECTORY.map((peer) => {
    const sharedInterests = peer.interests.filter((tag) =>
      interests.includes(tag),
    );
    const sharedPathways = peer.pathways.filter((pathway) =>
      pathwayIds.includes(pathway),
    );
    const score = sharedInterests.length * 3 + sharedPathways.length * 4;
    const alreadyConnected = connections.some((connection) =>
      (connection.peers ?? []).includes(peer.id),
    );

    return {
      ...peer,
      sharedInterests,
      sharedPathways,
      score,
      alreadyConnected,
    };
  })
    .filter((peer) => {
      if (pathwayFilter !== "all" && !peer.pathways.includes(pathwayFilter)) {
        return false;
      }
      if (!needle) return true;

      const haystack = [
        peer.name,
        peer.city,
        peer.bio,
        ...peer.interests,
        ...peer.pathways,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
};

export const pathwayNameById = (subjectId, subjects) =>
  subjects.find((subject) => subject.id === subjectId)?.name ?? subjectId;

/**
 * Build a pathway filter option list from the current user's pathways
 * plus every pathway the peer directory references.
 */
export const buildPathwayOptions = (pathwayIds, subjects) => {
  const ids = new Set([
    ...pathwayIds,
    ...PEER_DIRECTORY.flatMap((peer) => peer.pathways),
  ]);

  return [
    { id: "all", name: "All pathways" },
    ...Array.from(ids).map((id) => ({
      id,
      name: pathwayNameById(id, subjects),
    })),
  ];
};
