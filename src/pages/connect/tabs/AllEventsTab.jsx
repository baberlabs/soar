import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { useSOARState, useSOARDispatch } from "../../../store";
import { Modal } from "../../../components/Modal";
import { EventListItem } from "../components/events/EventListItem";
import { EventDetail } from "../components/events/EventDetail";
import { usePanelParam } from "../hooks/usePanelParam";
import { LOCAL_EVENTS } from "../utils/events";

export default function AllEventsTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const [eventId, setEventId] = usePanelParam("eventId");

  const rsvps = state.rsvps ?? [];
  const activeEvent = useMemo(
    () => LOCAL_EVENTS.find((e) => e.id === eventId),
    [eventId],
  );

  const toggleRsvp = (id) =>
    dispatch({ type: "TOGGLE_RSVP", payload: { eventId: id } });

  return (
    <div className="space-y-8">
      {LOCAL_EVENTS.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LOCAL_EVENTS.map((event) => (
            <li key={event.id}>
              <EventListItem
                event={event}
                isActive={event.id === eventId}
                isRsvped={rsvps.includes(event.id)}
                onSelect={setEventId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand/20 bg-brand/5">
          <CalendarDays
            size={40}
            className="mb-4 text-brand/30"
            strokeWidth={1.5}
          />
          <p className="font-body text-sm text-brand/60">No events found.</p>
        </div>
      )}

      <Modal
        isOpen={Boolean(activeEvent)}
        onClose={() => setEventId(null)}
        size="lg"
        ariaLabel="Event detail"
      >
        {activeEvent && (
          <EventDetail
            event={activeEvent}
            isRsvped={rsvps.includes(activeEvent.id)}
            onRsvp={toggleRsvp}
            onClose={() => setEventId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
