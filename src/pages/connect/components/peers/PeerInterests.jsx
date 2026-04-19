/**
 * Interest tags. Shared interests (highlighted) come first so users can
 * see common ground at a glance.
 */
export const PeerInterests = ({ interests = [], sharedInterests = [] }) => {
  const shared = new Set(sharedInterests);

  // Deterministic order: shared first, then the rest in declared order.
  const ordered = [
    ...interests.filter((interest) => shared.has(interest)),
    ...interests.filter((interest) => !shared.has(interest)),
  ];

  if (ordered.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {ordered.map((interest) => {
        const isShared = shared.has(interest);
        return (
          <span
            key={interest}
            className={`rounded-full border px-3 py-1 font-body text-xs transition ${
              isShared
                ? "border-sage/40 bg-sage/10 text-sage"
                : "border-brand/18 opacity-80 text-brand/75"
            }`}
            title={isShared ? "Shared with you" : undefined}
          >
            {interest}
          </span>
        );
      })}
    </div>
  );
};
