// src/pages/connect/index.jsx
import { Outlet } from "react-router-dom";
import { useSOARState } from "../../store";
import { Stats } from "./components/shared/Stats";
import { ConnectTabs } from "./components/shared/ConnectTabs";
import { LOCAL_EVENTS } from "./utils/events";
import Page from "../../layout/Page";

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
    <Page
      heading="Connect"
      description="Find peers who share your passion and interests. Explore SOAR events happening this year."
      contentClassName="mx-auto space-y-6"
    >
      <Stats stats={stats} />
      <ConnectTabs counts={counts} />
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </div>
    </Page>
  );
}
