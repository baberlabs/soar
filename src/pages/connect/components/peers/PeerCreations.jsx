const formatPublishedDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * Grid of a peer's published creations. Rendered only when non-empty;
 * empty-state handling belongs to the parent (PeerDetail).
 */
export const PeerCreations = ({ creations = [] }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {creations.map((creation) => (
      <article
        key={creation.id}
        className="group rounded-2xl border border-brand/14 opacity-80 p-4 transition hover:border-brand/28 hover:opacity-100"
      >
        <p className="font-body text-[0.62rem] uppercase tracking-[0.14em] text-brand/55">
          {creation.format}
        </p>
        <h4 className="mt-1 font-ui text-lg text-brand">{creation.title}</h4>
        {creation.summary ? (
          <p className="mt-1.5 line-clamp-3 font-body text-xs leading-relaxed text-brand/70">
            {creation.summary}
          </p>
        ) : null}
        {creation.publishedAt ? (
          <p className="mt-2 font-body text-[0.65rem] text-brand/50">
            {formatPublishedDate(creation.publishedAt)}
          </p>
        ) : null}
      </article>
    ))}
  </div>
);
