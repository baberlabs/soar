import { Avatar } from "../shared/Avatar";
import { StatusDot } from "../shared/StatusDot";

/**
 * Compact peer card shown in the peers list. Designed to be dense enough
 * that ~8 fit in a laptop viewport, but still legible.
 *
 * The "shared" chip (when present) replaces the old verbose
 * "Why this match: Interests: X, Y | Pathways: Z" row. One number
 * that a user can instantly rank.
 */
export const PeerListItem = ({ peer, isActive, onSelect }) => {
  const sharedCount = peer.sharedInterests.length + peer.sharedPathways.length;

  return (
    <button
      type="button"
      onClick={() => onSelect(peer.id)}
      aria-current={isActive ? "true" : undefined}
      className={`group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        isActive
          ? "border-brand shadow-[0_12px_28px_rgba(75,81,149,0.14)]"
          : "border-brand/12 opacity-80 hover:-translate-y-0.5 hover:border-brand/25 hover:opacity-100"
      }`}
    >
      <Avatar avatar={peer.avatar} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-ui text-lg leading-tight text-brand">
              {peer.name}
            </p>
            <p className="mt-0.5 truncate font-body text-xs text-brand/65">
              {peer.city}
            </p>
          </div>
          <StatusDot
            online={peer.onlineNow}
            className={
              peer.onlineNow ? "" : "opacity-0 group-hover:opacity-100"
            }
          />
        </div>

        <div className="mt-2 flex items-center gap-2">
          {peer.alreadyConnected ? (
            <span className="rounded-full bg-sage/15 px-2 py-0.5 font-body text-[0.62rem] font-medium uppercase tracking-widest text-sage">
              Connected
            </span>
          ) : sharedCount > 0 ? (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 font-body text-[0.62rem] font-medium uppercase tracking-widest text-brand/75">
              {sharedCount} shared
            </span>
          ) : null}
          {peer.availability ? (
            <span className="truncate font-body text-[0.68rem] text-brand/55">
              {peer.availability}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};
