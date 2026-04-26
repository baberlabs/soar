import { HeartHandshake, TicketCheck } from "lucide-react";

export const EventListItem = ({ event, isActive, isRsvped, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(event.id)}
      className={`group flex w-full overflow-hidden rounded-3xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        isActive
          ? "border-brand bg-brand/5 shadow-[0_8px_32px_rgba(75,81,149,0.12)]"
          : "border-brand/10 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_12px_40px_rgba(75,81,149,0.08)]"
      }`}
    >
      <div
        className={`flex w-24 flex-col items-center justify-center border-r border-brand/10 p-4 text-center transition-colors ${isActive ? "bg-brand/10" : "bg-brand/5 group-hover:bg-brand/10"}`}
      >
        <span className="font-ui text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand/60">
          {event.dateLabel.split(" ")[0]}
        </span>
        <span className="mt-1 font-display text-3xl font-medium text-brand">
          {event.dateLabel.split(" ")[1]}
        </span>
        <span className="mt-1 font-body text-[0.65rem] uppercase tracking-widest text-brand/60">
          {event.dateLabel.split(" ")[2]}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-ui text-[0.6rem] uppercase tracking-[0.15em] text-brand/50">
            {event.format}
          </span>
          {event.impact && (
            <span className="flex items-center gap-1 rounded bg-sage/10 px-1.5 py-0.5 font-ui text-[0.55rem] uppercase tracking-widest text-sage">
              <HeartHandshake size={10} strokeWidth={2.5} /> Tech for Good
            </span>
          )}
          {isRsvped && (
            <span className="flex items-center gap-1 rounded bg-brand/10 px-1.5 py-0.5 font-ui text-[0.55rem] uppercase tracking-widest text-brand">
              <TicketCheck size={10} strokeWidth={2.5} /> Registered
            </span>
          )}
        </div>
        <h3 className="mt-1.5 font-display text-xl leading-tight text-brand">
          {event.title}
        </h3>
        <p className="mt-2 font-body text-sm text-brand/60">
          {event.city} • {event.timeLabel}
        </p>
      </div>
    </button>
  );
};
