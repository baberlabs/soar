import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";

/**
 * Event detail panel. Matches PeerDetail's structural pattern: close
 * control top-right on desktop, back button top-left on mobile, then
 * a header block and sections below.
 */
export const EventDetail = ({ event, userInterests = [], onClose }) => {
  const shared = event.tags.filter((tag) => userInterests.includes(tag));
  const otherTags = event.tags.filter((tag) => !userInterests.includes(tag));

  return (
    <article className="relative overflow-hidden rounded-3xl border border-brand/15 bg-cream shadow-[0_24px_48px_rgba(75,81,149,0.08)] lg:sticky lg:top-28">
      <button
        type="button"
        onClick={onClose}
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-brand/18 px-3 py-1.5 font-ui text-xs text-brand backdrop-blur transition hover:border-brand/35 lg:hidden"
        aria-label="Back to events"
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-brand/18 font-ui text-base text-brand backdrop-blur transition hover:border-brand/35 lg:inline-flex"
        aria-label="Close event"
      >
        ×
      </button>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-yellow/20 to-transparent"
      />

      <header className="relative px-6 pt-14 pb-5 md:px-8 md:pt-12">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-brand/55">
          {event.format}
        </p>
        <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.95] text-brand">
          {event.title}
        </h2>
        <p className="mt-3 font-body text-sm text-brand/72">
          {event.city} · {event.dateLabel}
        </p>
      </header>

      <section className="border-t border-brand/10 px-6 py-5 md:px-8">
        <p className="font-body text-sm leading-relaxed text-brand/82">
          {event.summary}
        </p>
      </section>

      <section
        aria-labelledby="event-tags-heading"
        className="border-t border-brand/10 px-6 py-5 md:px-8"
      >
        <h3
          id="event-tags-heading"
          className="font-ui text-sm uppercase tracking-[0.14em] text-brand/55"
        >
          Topics
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[...shared, ...otherTags].map((tag) => {
            const isShared = shared.includes(tag);
            return (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 font-body text-xs ${
                  isShared
                    ? "border-sage/40 bg-sage/10 text-sage"
                    : "border-brand/18 text-brand/75"
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap gap-2 border-t border-brand/10 px-6 py-5 md:px-8">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Add to calendar"
        />
        <Link
          to="/connect/peers"
          className="inline-flex items-center rounded-full border border-brand/18 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
        >
          Find peers going
        </Link>
      </section>
    </article>
  );
};
