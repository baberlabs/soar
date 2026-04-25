import { useMemo } from "react";
import { Clock3, HardDrive, Network, Server, Waypoints } from "lucide-react";
import { useSOARState } from "../../../store";
import { LinkButton } from "../../../components/LinkButton";
import {
  deriveNodeStats,
  formatBytes,
  formatUptime,
} from "../../account/utils/nodeStats";
import { WidgetCard, WidgetHeader } from "./WidgetCard";

/**
 * Dashboard summary for the user's browser node. Pulls the same derived
 * stats used in Account, but compresses them into a more glanceable
 * dashboard card with one clear route into the detailed node view.
 */
export const NodeStatusWidget = () => {
  const state = useSOARState();

  const stats = useMemo(
    () =>
      deriveNodeStats({
        user: state.user,
        creations: state.creations,
        reflections: state.reflections,
        connections: state.connections,
      }),
    [state.user, state.creations, state.reflections, state.connections],
  );

  const tiles = [
    {
      label: "Peers",
      value: String(stats.connectedPeers),
      hint: `+${stats.dhtPeers} routing peers`,
      icon: <Network size={14} strokeWidth={1.8} />,
    },
    {
      label: "Pinned",
      value: String(stats.pinCount),
      hint: "Items stored on this node",
      icon: <Waypoints size={14} strokeWidth={1.8} />,
    },
    {
      label: "Storage",
      value: formatBytes(stats.totalBytes),
      hint: "Estimated local footprint",
      icon: <HardDrive size={14} strokeWidth={1.8} />,
    },
    {
      label: "Uptime",
      value: formatUptime(stats.uptimeSince),
      hint: "Since you joined",
      icon: <Clock3 size={14} strokeWidth={1.8} />,
    },
  ];

  return (
    <WidgetCard>
      <WidgetHeader
        eyebrow="Node"
        title="Your node"
        aside={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/12 px-3 py-1 font-body text-xs font-semibold text-sage">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-sage"
            />
            Online
          </span>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="rounded-[1.75rem] border border-sage/18 bg-sage/8 p-5">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sage/20 bg-cream text-sage shadow-[0_10px_24px_rgba(118,164,91,0.14)]"
            >
              <Server size={20} strokeWidth={1.75} />
            </span>

            <div className="min-w-0">
              <p className="font-ui text-[1.65rem] leading-none text-brand">
                Personal storage, live in your browser.
              </p>
              <p className="mt-2 max-w-[44ch] font-body text-sm leading-relaxed text-brand/74">
                Your creations, letters, and reflections stay pinned to your
                node instead of a central server. Open the node panel to inspect
                your identity, peer addresses, and stored content.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-brand/12 bg-cream/80 px-3 py-1 font-body text-xs text-brand/70">
              {stats.pinCount} item{stats.pinCount === 1 ? "" : "s"} pinned
            </span>
            <span className="rounded-full border border-brand/12 bg-cream/80 px-3 py-1 font-body text-xs text-brand/70">
              {stats.connectedPeers} direct connection
              {stats.connectedPeers === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          {tiles.map((tile) => (
            <NodeMetricTile
              key={tile.label}
              label={tile.label}
              value={tile.value}
              hint={tile.hint}
              icon={tile.icon}
            />
          ))}
        </dl>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-brand/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm leading-relaxed text-brand/62">
          See your peer ID, copy addresses, review pinned items, and export
          your data from the full node view.
        </p>
        <LinkButton
          href="/account/node"
          variant="primary"
          size="sm"
          fullWidth={false}
          className="gap-1.5"
        >
          Open node details
          <span aria-hidden="true">→</span>
        </LinkButton>
      </div>
    </WidgetCard>
  );
};

const NodeMetricTile = ({ icon, label, value, hint }) => (
  <div className="rounded-2xl border border-brand/12 bg-page/70 p-4">
    <dt className="flex items-center gap-2 font-body text-[0.68rem] uppercase tracking-[0.14em] text-brand/50">
      <span
        aria-hidden="true"
        className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-brand/8 text-brand/72"
      >
        {icon}
      </span>
      {label}
    </dt>
    <dd className="mt-3 font-display text-[2rem] leading-none text-brand">
      {value}
    </dd>
    <p className="mt-2 font-body text-xs text-brand/58">{hint}</p>
  </div>
);
