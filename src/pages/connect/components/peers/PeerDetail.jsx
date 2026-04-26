import { Link } from "react-router-dom";
import { Button } from "../../../../components/Button";
import { Avatar } from "../shared/Avatar";
import { StatusDot } from "../shared/StatusDot";
import { PeerPathways } from "./PeerPathways";
import { PeerInterests } from "./PeerInterests";
import { PeerCreations } from "./PeerCreations";

/**
 * Full peer profile, rendered as a detail panel inside the peers tab.
 *
 * Action model (three possible states for the primary button):
 *   - No connection: primary = "Send request"
 *   - Connection pending: primary = "Accept as them" (breaks fourth wall
 *     honestly — there's no real peer to accept), with secondary ghost
 *     showing request-sent state
 *   - Connection accepted: primary = "Message"
 */
export const PeerDetail = ({
  peer,
  subjects,
  isConnected,
  connectionStatus,
  onClose,
  onSendRequest,
  onAcceptAsThem,
  onOpenChat,
}) => {
  const availabilityLabel = peer.onlineNow
    ? "Online now"
    : peer.lastActiveLabel;

  return (
    <article className="relative overflow-hidden rounded-3xl">
      {/* Back control — only visible on mobile where the detail replaces the list. */}
      <button
        type="button"
        onClick={onClose}
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-brand/18 px-3 py-1.5 font-ui text-xs text-brand backdrop-blur transition hover:border-brand/35 lg:hidden"
        aria-label="Back to peers list"
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>

      {/* Close control — only visible on desktop where both panels are present. */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 hidden h-fit p-2 items-center justify-center rounded-full border border-brand/18 font-ui text-base text-brand backdrop-blur transition hover:border-brand/35 lg:inline-flex"
        aria-label="Close profile"
      >
        Close
      </button>

      <header className="relative px-6 pt-14 pb-6 md:px-8 md:pt-12">
        <div className="flex flex-wrap items-start gap-5">
          <Avatar avatar={peer.avatar} size="xl" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-[0.95] text-brand">
              {peer.name}
            </h2>
            <p className="font-body text-sm text-brand/72">
              {peer.city}
              {peer.availability ? ` · ${peer.availability}` : ""}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <StatusDot online={peer.onlineNow} label={availabilityLabel} />
              <ConnectionBadge status={connectionStatus} />
            </div>
          </div>
        </div>

        {peer.bio ? (
          <p className="mt-5 max-w-3xl font-body text-sm leading-relaxed text-brand/80">
            {peer.bio}
          </p>
        ) : null}

        <ActionRow
          isConnected={isConnected}
          connectionStatus={connectionStatus}
          peerName={peer.name}
          onSendRequest={onSendRequest}
          onAcceptAsThem={onAcceptAsThem}
          onOpenChat={onOpenChat}
        />
      </header>

      <div className="grid gap-6 border-t border-brand/10 px-6 py-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section aria-labelledby="peer-pathways-heading">
          <h3
            id="peer-pathways-heading"
            className="font-ui text-sm uppercase tracking-[0.14em] text-brand/55"
          >
            Pathways
          </h3>
          <div className="mt-3">
            {peer.pathwayProgress && peer.pathwayProgress.length > 0 ? (
              <PeerPathways
                pathwayProgress={peer.pathwayProgress}
                subjects={subjects}
              />
            ) : (
              <p className="font-body text-sm text-brand/55">
                Not enrolled yet.
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="peer-interests-heading">
          <h3
            id="peer-interests-heading"
            className="font-ui text-sm uppercase tracking-[0.14em] text-brand/55"
          >
            Interests
          </h3>
          <div className="mt-3">
            <PeerInterests
              interests={peer.interests}
              sharedInterests={peer.sharedInterests ?? []}
            />
          </div>
        </section>
      </div>

      {peer.creations && peer.creations.length > 0 ? (
        <section
          aria-labelledby="peer-creations-heading"
          className="border-t border-brand/10 px-6 py-6 md:px-8"
        >
          <h3
            id="peer-creations-heading"
            className="font-ui text-sm uppercase tracking-[0.14em] text-brand/55"
          >
            Creations
          </h3>
          <div className="mt-3">
            <PeerCreations creations={peer.creations} />
          </div>
        </section>
      ) : null}
    </article>
  );
};

const ActionRow = ({
  isConnected,
  connectionStatus,
  peerName,
  onSendRequest,
  onAcceptAsThem,
  onOpenChat,
}) => {
  if (isConnected) {
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Message"
          onClick={onOpenChat}
        />
        <Link
          to="/connect/all-events"
          className="inline-flex items-center rounded-full border border-brand/18 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
        >
          Meet at an event
        </Link>
      </div>
    );
  }

  if (connectionStatus === "pending") {
    const firstName = peerName?.split(" ")[0] ?? "them";
    return (
      <div className="mt-5 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            fullWidth={false}
            text={`Accept as ${firstName}`}
            onClick={onAcceptAsThem}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth={false}
            text="Request sent"
            disabled
          />
        </div>
        <p className="font-body text-xs text-brand/55">
          {peerName} is a mock profile. Accept on their behalf to start the
          conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Button
        type="button"
        variant="primary"
        size="sm"
        fullWidth={false}
        text="Send request"
        onClick={onSendRequest}
      />
      <Link
        to="/connect/all-events"
        className="inline-flex items-center rounded-full border border-brand/18 px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
      >
        Meet at an event
      </Link>
    </div>
  );
};

const ConnectionBadge = ({ status }) => {
  if (status === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage/10 px-2.5 py-1 font-body text-[0.62rem] font-medium uppercase tracking-widest text-sage">
        Connected
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow/50 bg-yellow/30 px-2.5 py-1 font-body text-[0.62rem] font-medium uppercase tracking-widest text-brand">
        Request pending
      </span>
    );
  }
  return null;
};
