import { Outlet, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useSOARDispatch, useSOARState } from "../../store";
import { AccountHeader } from "./components/shared/AccountHeader";
import { AccountSidebar } from "./components/shared/AccountSidebar";
import { deriveNodeStats } from "./utils/nodeStats";

/**
 * Account shell. Renders:
 *   - AccountHeader: identity + three at-a-glance stats
 *   - AccountSidebar: vertical section nav + sign-out footer
 *   - <Outlet />: the active tab's content
 *
 * Header stats and sidebar counters are derived here once so they stay
 * consistent across every sub-route. Derivation is the same as NodeTab's;
 * shared between shell and tab via the deriveNodeStats utility.
 */
export default function Account() {
  const state = useSOARState();
  const dispatch = useSOARDispatch();
  const navigate = useNavigate();

  const user = state.user;
  const connections = state.connections ?? [];
  const acceptedCount = connections.filter(
    (c) => c.status === "accepted",
  ).length;

  const nodeStats = useMemo(
    () =>
      user
        ? deriveNodeStats({
            user,
            creations: state.creations,
            reflections: state.reflections,
            connections,
          })
        : null,
    [user, state.creations, state.reflections, connections],
  );

  const handleSignOut = () => {
    dispatch({ type: "SIGN_OUT" });
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const headerStats = [
    { label: "Peers", value: acceptedCount },
    { label: "Pinned", value: nodeStats?.pinCount ?? 0 },
    { label: "Storage", value: formatCompactBytes(nodeStats?.totalBytes ?? 0) },
  ];

  return (
    <main className="mx-auto w-full max-w-360 px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="space-y-8">
        <AccountHeader user={user} stats={headerStats} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
          <AccountSidebar
            onSignOut={handleSignOut}
            peerCount={acceptedCount}
            pinCount={nodeStats?.pinCount ?? 0}
          />

          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Compact byte formatter for the header (short strings only, no decimals).
 * The Node tab uses the precise formatBytes; the header wants "12 KB" not
 * "12.4 KB" — visual density matters more than precision here.
 */
const formatCompactBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${Math.round(value)} ${units[unit]}`;
};
