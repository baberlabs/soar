import { Avatar } from "./Avatar";
import { makePeerID, shortenId } from "../../utils/ipfs";

/**
 * Slim hero at the top of the account page. Surfaces identity (avatar +
 * name + email) and three at-a-glance stats so the page feels inhabited
 * the moment you land on it — before touching any sidebar tab.
 *
 * Deliberately short: modern account pages lean on the sidebar for
 * navigation. A 200px tall hero with prose would push the real content
 * below the fold.
 */
export const AccountHeader = ({ user, stats }) => {
  const peerId = makePeerID(user?.id);

  return (
    <header className="relative overflow-hidden rounded-4xl border border-brand/18 bg-cream px-6 pt-7 pb-6 shadow-[0_22px_44px_rgba(75,81,149,0.08)] md:px-8">
      {/* Ambient colour — consistent with Connect / Reflect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 left-20 h-36 w-36 rounded-full bg-yellow/30 blur-3xl"
      />

      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Avatar user={user} size="xl" />
          <div className="min-w-0">
            <p className="font-body text-[0.68rem] uppercase tracking-[0.2em] text-brand/55">
              Account
            </p>
            <h1 className="mt-1 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.95] text-brand">
              {user?.fullName || "Unnamed peer"}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-brand/68">
              <span>{user?.email}</span>
              {user?.location ? (
                <>
                  <span aria-hidden="true" className="text-brand/30">
                    ·
                  </span>
                  <span>{user.location}</span>
                </>
              ) : null}
              <span aria-hidden="true" className="text-brand/30">
                ·
              </span>
              <code className="rounded-md bg-brand/6 px-2 py-0.5 font-mono text-[0.72rem] text-brand/70">
                {shortenId(peerId)}
              </code>
            </div>
          </div>
        </div>

        {stats?.length ? (
          <dl className="flex flex-wrap gap-x-6 gap-y-3">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-body text-[0.65rem] uppercase tracking-[0.14em] text-brand/50">
                  {label}
                </dt>
                <dd className="mt-0.5 font-ui text-2xl leading-none text-brand">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </header>
  );
};
