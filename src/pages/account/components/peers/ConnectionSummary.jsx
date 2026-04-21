import { Link } from "react-router-dom";
import { getPeerById } from "../../../../data/peers";
import { Avatar } from "../shared/Avatar";

/**
 * Peers tab content. Shows a compact list of the user's connections with
 * a clear link into /connect for the rich experience. Splits by status
 * so pending requests stay visible (the user can remember to follow up).
 */
export const ConnectionSummary = ({ connections = [], currentUserId }) => {
  const resolved = connections.map((connection) => {
    const peerId = (connection.peers ?? []).find((id) => id !== currentUserId);
    const peer = getPeerById(peerId) ?? connection.peer ?? null;
    return { ...connection, peerId, peer };
  });

  const accepted = resolved.filter((c) => c.status === "accepted");
  const pending = resolved.filter((c) => c.status === "pending");

  if (resolved.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand/25 bg-page/60 p-10 text-center">
        <p className="font-ui text-xl text-brand">No connections yet</p>
        <p className="mt-2 font-body text-sm text-brand/65">
          Find peers whose interests overlap with yours.
        </p>
        <div className="mt-5 inline-flex">
          <Link
            to="/connect/peers"
            className="inline-flex items-center rounded-full border border-brand/20 bg-cream px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
          >
            Find peers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {accepted.length > 0 ? (
        <section>
          <header className="mb-3 flex items-baseline justify-between">
            <h3 className="font-ui text-sm uppercase tracking-[0.14em] text-brand/55">
              Connected
            </h3>
            <Link
              to="/connect/chats"
              className="font-body text-xs text-brand/65 transition hover:text-brand"
            >
              Open chats →
            </Link>
          </header>
          <ul className="grid gap-2 sm:grid-cols-2">
            {accepted.map((connection) => (
              <ConnectionRow key={connection.id} connection={connection} />
            ))}
          </ul>
        </section>
      ) : null}

      {pending.length > 0 ? (
        <section>
          <h3 className="mb-3 font-ui text-sm uppercase tracking-[0.14em] text-brand/55">
            Pending
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pending.map((connection) => (
              <ConnectionRow
                key={connection.id}
                connection={connection}
                muted
              />
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex justify-end border-t border-brand/10 pt-4">
        <Link
          to="/connect/peers"
          className="inline-flex items-center gap-1.5 font-ui text-sm tracking-[0.04em] text-brand transition hover:text-brand/80"
        >
          Find more peers
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

const ConnectionRow = ({ connection, muted }) => {
  const { peer } = connection;

  return (
    <li>
      <Link
        to={`/connect/peers?peerId=${connection.peerId}`}
        className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
          muted
            ? "border-brand/10 bg-page/50 hover:border-brand/25"
            : "border-brand/15 bg-page/60 hover:border-brand/30 hover:bg-page"
        }`}
      >
        <Avatar user={peer} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-ui text-base text-brand">
            {peer?.name ?? "Peer"}
          </p>
          {peer?.city ? (
            <p className="truncate font-body text-xs text-brand/60">
              {peer.city}
            </p>
          ) : null}
        </div>
        {muted ? (
          <span className="shrink-0 rounded-full bg-yellow/30 px-2 py-0.5 font-body text-[0.62rem] font-medium uppercase tracking-[0.1em] text-brand/80">
            Pending
          </span>
        ) : null}
      </Link>
    </li>
  );
};
