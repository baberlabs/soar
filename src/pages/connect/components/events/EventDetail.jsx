import { Link } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Handshake,
  CheckCircle,
  Accessibility,
} from "lucide-react";
import { Button } from "../../../../components/Button";

export const EventDetail = ({ event, isRsvped, onRsvp, onClose }) => {
  const ctaText = isRsvped
    ? "Cancel Registration"
    : event.impact
      ? "Register & Request Device"
      : "RSVP & Begin Peership";

  return (
    <article className="relative rounded-xl">
      <button
        onClick={onClose}
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-brand/18 px-3 py-1.5 font-ui text-xs text-brand backdrop-blur transition hover:border-brand/35 lg:hidden"
      >
        <ArrowLeft size={14} /> <span>Back</span>
      </button>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-brand/18 font-ui text-base text-brand backdrop-blur transition hover:border-brand/35 lg:inline-flex"
      >
        <X size={16} />
      </button>

      <header className="relative px-6 pt-14 pb-5 md:px-8 md:pt-12">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-brand/55">
          {event.format}
        </p>
        <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.95] text-brand">
          {event.title}
        </h2>
        <p className="mt-3 font-body text-sm text-brand/72">
          {event.city} · {event.dateLabel} @ {event.timeLabel}
        </p>
      </header>

      {event.impact && (
        <section className="border-t border-brand/10 bg-sage/5 px-6 py-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage/20 text-sage">
              <Handshake size={12} strokeWidth={2.5} />
            </span>
            <h3 className="font-ui text-sm font-medium text-brand">
              Partnership: {event.impact.partner}
            </h3>
          </div>
          <p className="mt-2 font-body text-sm text-brand/80">
            <strong>{event.impact.initiative}:</strong> {event.impact.perks}
          </p>
        </section>
      )}

      <section className="border-t border-brand/10 px-6 py-5 md:px-8">
        <p className="font-body text-sm leading-relaxed text-brand/82">
          {event.summary}
        </p>
      </section>

      <section className="border-t border-brand/10 px-6 py-5 md:px-8">
        <h3 className="font-ui text-sm uppercase tracking-[0.14em] text-brand/55">
          Session Outcomes
        </h3>
        <ul className="mt-3 space-y-2">
          {event.learningOutcomes.map((outcome, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm text-brand/82"
            >
              <CheckCircle size={16} className="mt-0.5 shrink-0 text-sage/70" />
              <span className="font-body leading-relaxed">{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-wrap items-center gap-3 border-t border-brand/10 px-6 py-5 md:px-8">
        <Button
          type="button"
          variant={isRsvped ? "secondary" : "primary"}
          size="sm"
          fullWidth={false}
          text={ctaText}
          onClick={() => onRsvp(event.id)}
        />
        <Link
          to="/connect/find-peers"
          className="inline-flex items-center rounded-full border border-brand/18 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
        >
          Find peers going
        </Link>
      </section>
    </article>
  );
};
