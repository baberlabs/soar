import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSOARState } from "../../../store";
import { PEER_DIRECTORY } from "../../../data/peers";
import { NetworkCreationCard } from "./NetworkCreationCard";
import { ChevronRight, Search } from "lucide-react";
import { LinkButton } from "../../../components/LinkButton";

const PAGE_SIZE = 6;

export const NetworkFeed = () => {
  const state = useSOARState();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const connectedPeers = useMemo(() => {
    const userId = state.user?.id;
    const acceptedPeerIds = new Set(
      (state.connections ?? [])
        .filter((connection) => connection.status === "accepted")
        .flatMap((connection) => connection.peers ?? [])
        .filter((id) => id && id !== userId),
    );
    return PEER_DIRECTORY.filter((peer) => acceptedPeerIds.has(peer.id));
  }, [state.connections, state.user?.id]);

  const allCreations = useMemo(() => {
    const flattened = connectedPeers.flatMap((peer) =>
      (peer.creations ?? []).map((creation) => ({ peer, creation })),
    );

    return flattened.sort((a, b) => {
      const dateA = new Date(a.creation.publishedAt ?? 0).getTime();
      const dateB = new Date(b.creation.publishedAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [connectedPeers]);

  const visibleCreations = allCreations.slice(0, visibleCount);
  const hasMore = visibleCount < allCreations.length;

  // Lazy load — observe the sentinel and bump visibleCount when it
  // enters the viewport. Pure native, no extra dependency.
  useEffect(() => {
    if (!hasMore) return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) =>
            Math.min(current + PAGE_SIZE, allCreations.length),
          );
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, allCreations.length]);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-ui text-xs uppercase tracking-[0.16em] text-brand/55">
            Your network
          </p>
          <h2 className="mt-1 font-ui text-3xl text-brand">
            What peers are making
          </h2>
        </div>
        {connectedPeers.length > 0 ? (
          <span className="rounded-full bg-brand/8 px-3 py-1 font-body text-xs text-brand/72">
            {connectedPeers.length} connected
            {connectedPeers.length === 1 ? "" : ""}
          </span>
        ) : null}
      </header>

      {connectedPeers.length === 0 ? (
        <EmptyState
          message="Connect with peers to see their creations."
          ctaLabel="Find peers"
          ctaTo="/connect/find-peers"
        />
      ) : allCreations.length === 0 ? (
        <EmptyState
          message="Your network hasn't shared anything yet. Check back soon."
          ctaLabel="View peers"
          ctaTo="/connect/my-peers"
        />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleCreations.map(({ peer, creation }) => (
              <NetworkCreationCard
                key={`${peer.id}-${creation.id}`}
                peer={peer}
                creation={creation}
              />
            ))}
          </div>

          {hasMore ? (
            <div ref={sentinelRef} aria-hidden="true" className="h-12 w-full" />
          ) : null}
        </>
      )}
    </section>
  );
};

const EmptyState = ({ message, ctaLabel, ctaTo }) => (
  <div className="rounded-[1.75rem] border border-dashed border-brand/24 bg-page p-12 text-center">
    <p className="mx-auto max-w-xl font-body text-sm sm:text-base leading-relaxed text-brand/76">
      {message}
    </p>
    <LinkButton
      href={ctaTo}
      variant="ghost"
      size="sm"
      fullWidth={false}
      className="mt-4"
    >
      {ctaLabel}
      <span aria-hidden="true"></span>
      <ChevronRight aria-hidden="true" className="size-4" />
    </LinkButton>
  </div>
);
