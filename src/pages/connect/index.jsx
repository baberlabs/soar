// src/pages/connect/index.jsx
import { Outlet } from "react-router-dom";
import { useSOARState } from "../../store";
import { ConnectHeader } from "./components/shared/ConnectHeader";
import { ConnectTabs } from "./components/shared/ConnectTabs";
import { LOCAL_EVENTS } from "./utils/events";

export default function Connect() {
  const state = useSOARState();

  const user = state.user;
  const connections = state.connections ?? [];
  const rsvps = state.rsvps ?? [];

  const eventCount = LOCAL_EVENTS.length;
  const myEventCount = rsvps.length;
  const accepted = connections.filter((c) => c.status === "accepted").length;
  const pending = connections.filter((c) => c.status === "pending").length;

  if (!user) return null;

  const stats = [
    { label: "Connected Peers", value: accepted },
    { label: "Pending Requests", value: pending },
    { label: "Local Events", value: eventCount },
  ];

  const counts = {
    "/connect/chats": pending || undefined,
    "/connect/my-peers": accepted || undefined,
    "/connect/find-peers": undefined,
    "/connect/my-events": myEventCount || undefined,
    "/connect/all-events": eventCount || undefined,
  };

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-8 md:pb-8 md:pt-10">
      <div className="space-y-10">
        <ConnectHeader stats={stats} />
        <ConnectTabs counts={counts} />
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
