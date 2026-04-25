import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useSOARState } from "../../../store";
import { PEER_DIRECTORY } from "../../../data/peers";
import { WidgetCard, WidgetHeader } from "./WidgetCard";

/**
 * Pulls creations from peers the user has actually connected with
 * (status: accepted), flattens them into a single list, and shows the
 * three most recent. Empty states for "no network yet" and "network has
 * no creations" are distinct so the CTA points peers somewhere useful.
 */
export const RecentCreationsWidget = () => {
  const state = useSOARState();

  const connectedPeerIds = useMemo(() => {
    const userId = state.user?.id;
    return new Set(
      (state.connections ?? [])
        .filter((connection) => connection.status === "accepted")
        .flatMap((connection) => connection.peers ?? [])
        .filter((id) => id && id !== userId),
    );
  }, [state.connections, state.user?.id]);

  const networkPeers = useMemo(
    () => PEER_DIRECTORY.filter((peer) => connectedPeerIds.has(peer.id)),
    [connectedPeerIds],
  );

  const recentCreations = useMemo(() => {
    const all = networkPeers.flatMap((peer) =>
      (peer.creations ?? []).map((creation) => ({
        ...creation,
        peer,
      })),
    );

    return all
      .sort((a, b) => {
        const dateA = new Date(
          a.publishedAt ?? a.createdAt ?? a.date ?? 0,
        ).getTime();
        const dateB = new Date(
          b.publishedAt ?? b.createdAt ?? b.date ?? 0,
        ).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [networkPeers]);

  const hasNetwork = networkPeers.length > 0;

  return (
    <WidgetCard>
      <WidgetHeader
        eyebrow="Network"
        title="Recent creations"
        aside={
          hasNetwork ? (
            <span className="rounded-full bg-brand/8 px-3 py-1 font-body text-xs text-brand/72">
              {networkPeers.length} peer
              {networkPeers.length === 1 ? "" : "s"}
            </span>
          ) : null
        }
      />

      <div className="mt-4 flex-1">
        {!hasNetwork ? (
          <EmptyState
            message="Connect with peers to see their creations."
            ctaLabel="Find peers"
            ctaTo="/connect/find-peers"
          />
        ) : recentCreations.length === 0 ? (
          <EmptyState
            message="Your network hasn't shared anything yet. Check back soon."
            ctaLabel="View peers"
            ctaTo="/connect/my-peers"
          />
        ) : (
          <ul className="space-y-2">
            {recentCreations.map((creation) => (
              <CreationRow
                key={`${creation.peer.id}-${creation.id ?? creation.title}`}
                creation={creation}
              />
            ))}
          </ul>
        )}
      </div>

      {hasNetwork && recentCreations.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3 border-t border-brand/10 pt-4">
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
          >
            Open Create
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </WidgetCard>
  );
};

const CreationRow = ({ creation }) => (
  <li>
    <div className="flex items-start gap-3 rounded-2xl border border-brand/12 bg-page p-3">
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-yellow/30 text-brand"
      >
        <Sparkles size={14} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-ui text-sm text-brand">
          {creation.title || "Untitled creation"}
        </p>
        <p className="mt-0.5 font-body text-xs text-brand/65">
          {creation.peer.name}
          {creation.type ? ` · ${creation.type}` : ""}
          {formatRelative(
            creation.publishedAt ?? creation.createdAt ?? creation.date,
          )
            ? ` · ${formatRelative(creation.publishedAt ?? creation.createdAt ?? creation.date)}`
            : ""}
        </p>
      </div>
    </div>
  </li>
);

const EmptyState = ({ message, ctaLabel, ctaTo }) => (
  <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand/25 bg-page p-6 text-center">
    <p className="font-body text-sm leading-relaxed text-brand/72">{message}</p>
    <Link
      to={ctaTo}
      className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
    >
      {ctaLabel}
      <span aria-hidden="true">→</span>
    </Link>
  </div>
);

// Compact relative-time formatter — "2d", "3w", or a short date if older.
const formatRelative = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};
