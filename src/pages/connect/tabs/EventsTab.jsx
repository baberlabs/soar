import { useMemo } from "react";
import { useSOARState } from "../../../hooks/useSOARState";
import { SplitPane } from "../components/shared/SplitPane";
import { EventListItem } from "../components/events/EventListItem";
import { EventDetail } from "../components/events/EventDetail";
import { usePanelParam } from "../hooks/usePanelParam";
import { buildEvents, getEventById } from "../utils/events";

export default function EventsTab() {
  const [state] = useSOARState();
  const [eventId, setEventId] = usePanelParam("eventId");
  const interests = state.user.interests ?? [];

  const events = useMemo(() => buildEvents(interests), [interests]);
  const activeEvent = useMemo(
    () => events.find((event) => event.id === eventId) ?? getEventById(eventId),
    [events, eventId],
  );

  return (
    <SplitPane
      isDetailOpen={Boolean(activeEvent)}
      listLabel="Local events"
      detailLabel="Event detail"
      emptyDetail={
        <p className="max-w-xs text-center font-body text-sm text-brand/55">
          Select an event to see details.
        </p>
      }
      list={
        <ul className="space-y-2  h-130 overflow-y-scroll vision-library-scrollbar">
          {events.map((event) => (
            <li key={event.id}>
              <EventListItem
                event={event}
                isActive={event.id === eventId}
                userInterests={interests}
                onSelect={setEventId}
              />
            </li>
          ))}
        </ul>
      }
      detail={
        activeEvent ? (
          <EventDetail
            event={activeEvent}
            userInterests={interests}
            onClose={() => setEventId(null)}
          />
        ) : null
      }
    />
  );
}
