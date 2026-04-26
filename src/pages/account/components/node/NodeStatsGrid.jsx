import { formatBytes, formatUptime } from "../../utils/nodeStats";

/**
 * At-a-glance stats for the node. Four tiles:
 *   Status · Peers · Storage · Uptime
 *
 * All values come from real data. Status is "online" while the app is
 * running (there's no other meaningful state for an in-browser node).
 */
export const NodeStatsGrid = ({ stats }) => {
  const tiles = [
    {
      label: "Status",
      value: "Online",
      hint: "Node is running",
      accent: "sage",
    },
    {
      label: "Peers",
      value: String(stats.connectedPeers),
      hint: `+${stats.dhtPeers} routing peers (DHT)`,
    },
    {
      label: "Storage",
      value: formatBytes(stats.totalBytes),
      hint: `${stats.pinCount} item${stats.pinCount === 1 ? "" : "s"} pinned`,
    },
    {
      label: "Uptime",
      value: formatUptime(stats.uptimeSince),
      hint: "Since you joined",
    },
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-2xl border border-brand/15 bg-page/60 p-4"
        >
          <dt className="font-body text-[0.65rem] uppercase tracking-[0.14em] text-brand/50">
            {tile.label}
          </dt>
          <dd className="mt-1.5 flex items-baseline gap-2">
            <span className="font-display text-3xl leading-none text-brand">
              {tile.value}
            </span>
            {tile.accent === "sage" ? (
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full bg-sage"
              />
            ) : null}
          </dd>
          <p className="mt-1.5 font-body text-[0.72rem] text-brand/55">
            {tile.hint}
          </p>
        </div>
      ))}
    </dl>
  );
};
