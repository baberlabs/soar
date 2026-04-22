/**
 * Compact event row. The date and format live in the eyebrow so the title
 * has room to breathe. Tags are rendered with subtle emphasis on any the
 * user shares interests with.
 */
export const EventListItem = ({
  event,
  isActive,
  userInterests = [],
  onSelect,
}) => {
  const sharedTags = event.tags.filter((tag) => userInterests.includes(tag));

  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      aria-current={isActive ? "true" : undefined}
      className={`flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        isActive
          ? "border-brand shadow-[0_12px_28px_rgba(75,81,149,0.14)]"
          : "border-brand/12 hover:-translate-y-0.5 hover:border-brand/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-[0.62rem] uppercase tracking-[0.14em] text-brand/55">
            {event.format}
          </p>
          <h3 className="mt-0.5 font-ui text-lg leading-tight text-brand">
            {event.title}
          </h3>
          <p className="mt-1 font-body text-xs text-brand/65">
            {event.city} · {event.dateLabel}
          </p>
        </div>
        {sharedTags.length > 0 ? (
          <span className="shrink-0 rounded-full bg-sage/10 px-2 py-0.5 font-body text-[0.62rem] font-medium uppercase tracking-widest text-sage">
            {sharedTags.length} match
          </span>
        ) : null}
      </div>
    </button>
  );
};
