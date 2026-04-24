import { Outlet, useLocation } from "react-router-dom";
import { useSOARState } from "../../store";
import { ConnectHeader } from "./components/shared/ConnectHeader";
import { ConnectTabs } from "./components/shared/ConnectTabs";
import { buildEvents } from "./utils/events";

/**
 * Connect shell. Renders the page chrome (header + tabs) and an <Outlet />
 * for the active tab's content.
 *
 * Header stats are derived once here rather than per-tab so the numbers
 * stay stable as the user switches tabs.
 */
export default function Connect() {
  const state = useSOARState();
  const location = useLocation();

  // All hooks must run unconditionally — guard the render, not the hooks.
  const user = state.user;
  const connections = state.connections ?? [];
  const interests = user?.interests ?? [];

  // buildEvents is O(n) on a 3-item array; useMemo would be more overhead
  // than the work it avoids.
  const eventCount = buildEvents(interests).length;
  const accepted = connections.filter((c) => c.status === "accepted").length;
  const pending = connections.filter((c) => c.status === "pending").length;

  if (!user) return null;

  const stats = [
    { label: "Connected", value: accepted },
    { label: "Pending", value: pending },
    { label: "Events", value: eventCount },
  ];

  const counts = {
    "/connect/peers": undefined, // no count — encourages exploration
    "/connect/chats": connections.length || undefined,
    "/connect/events": eventCount || undefined,
  };

  // Screenreader-friendly announcement of the current tab on change.
  const tabLabel = location.pathname.startsWith("/connect/chats")
    ? "Chats"
    : location.pathname.startsWith("/connect/events")
      ? "Events"
      : "Peers";

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="space-y-8">
        <ConnectHeader stats={stats} />

        <div className="flex items-center justify-between gap-4">
          <ConnectTabs counts={counts} />
          <p aria-live="polite" className="sr-only">
            Active section: {tabLabel}
          </p>
        </div>

        <Outlet />
      </div>
    </main>
  );
}
