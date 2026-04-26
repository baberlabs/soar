import { useMemo } from "react";
import { Ticket } from "lucide-react";
import { useSOARState, useSOARDispatch } from "../../../store";
import { Modal } from "../../../components/Modal";
import { EventListItem } from "../components/events/EventListItem";
import { EventDetail } from "../components/events/EventDetail";
import { usePanelParam } from "../hooks/usePanelParam";
import { LOCAL_EVENTS } from "../utils/events";

export default function MyEventsTab() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const [eventId, setEventId] = usePanelParam("eventId");

  const rsvps = state.rsvps ?? [];
  const myEvents = useMemo(
    () => LOCAL_EVENTS.filter((e) => rsvps.includes(e.id)),
    [rsvps],
  );
  const activeEvent = useMemo(
    () => myEvents.find((e) => e.id === eventId),
    [eventId, myEvents],
  );

  const toggleRsvp = (id) =>
    dispatch({ type: "TOGGLE_RSVP", payload: { eventId: id } });

  return (
    <div className="space-y-8">
      <div className="mb-6 border-b border-brand/10 pb-4">
        <h2 className="font-display text-2xl text-brand">Your Itinerary</h2>
        <p className="mt-1 font-body text-sm text-brand/60">
          Events you are registered to attend.
        </p>
      </div>

      {myEvents.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myEvents.map((event) => (
            <li key={event.id}>
              <EventListItem
                event={event}
                isActive={event.id === eventId}
                isRsvped={true}
                onSelect={setEventId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand/20 bg-brand/5">
          <Ticket size={40} className="mb-4 text-brand/30" strokeWidth={1.5} />
          <p className="font-body text-sm text-brand/60">
            You have no upcoming events.
          </p>
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
            isRsvped={true}
            onRsvp={toggleRsvp}
            onClose={() => setEventId(null)}
          />
        )}
      </Modal>
    </div>
  );
}
