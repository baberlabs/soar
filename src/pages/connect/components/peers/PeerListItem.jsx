import { Avatar } from "../shared/Avatar";

export const PeerListItem = ({ peer, isActive, onSelect }) => {
  const sharedCount =
    (peer.sharedInterests?.length || 0) + (peer.sharedPathways?.length || 0);

  return (
    <button
      type="button"
      onClick={() => onSelect(peer.id)}
      aria-current={isActive ? "true" : undefined}
      className={`group relative flex w-full flex-col gap-4 rounded-3xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        isActive
          ? "border-brand bg-brand/5 shadow-[0_8px_32px_rgba(75,81,149,0.12)]"
          : "border-brand/10 bg-cream hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_12px_40px_rgba(75,81,149,0.08)]"
      }`}
    >
      <div className="flex w-full items-start gap-4">
        <div className="relative">
          <Avatar avatar={peer.avatar} size="lg" />
          {peer.onlineNow && (
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-cream bg-sage"></span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-ui text-lg font-medium tracking-tight text-brand">
            {peer.name}
          </h3>
          <p className="truncate font-body text-xs text-brand/60">
            {peer.city}
          </p>
        </div>
      </div>

      <p className="line-clamp-2 font-body text-sm leading-relaxed text-brand/75">
        {peer.bio}
      </p>

      <div className="mt-auto flex items-center gap-2 pt-2">
        {peer.alreadyConnected ? (
          <span className="rounded-full bg-sage/10 border border-sage/20 px-2.5 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-widest text-sage">
            Connected
          </span>
        ) : sharedCount > 0 ? (
          <span className="rounded-full bg-brand/5 border border-brand/10 px-2.5 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-widest text-brand/70">
            {sharedCount} Shared Links
          </span>
        ) : null}
      </div>
    </button>
  );
};
