import { NavLink } from "react-router-dom";
import { useRef } from "react";

/**
 * Vertical sidebar nav for the account page. Follows the WAI-ARIA vertical
 * tabs pattern — arrow keys move focus between links, Home/End jump to ends.
 *
 * Sign-out lives in the footer of the sidebar because it's contextually an
 * "account" action but not a content section. Keeps it reachable from every
 * sub-page without cluttering the main content area.
 */

const ITEMS = [
  { to: "/account/profile", label: "Profile" },
  { to: "/account/activity", label: "Activity" },
  { to: "/account/peers", label: "Peers" },
  { to: "/account/node", label: "Node" },
  { to: "/account/data", label: "Data" },
  { to: "/account/coming-soon", label: "Coming soon" },
];

export const AccountSidebar = ({ onSignOut, peerCount, pinCount }) => {
  const refs = useRef({});

  const handleKeyDown = (event, index) => {
    let next = null;
    if (event.key === "ArrowDown") next = (index + 1) % ITEMS.length;
    if (event.key === "ArrowUp") next = (index - 1 + ITEMS.length) % ITEMS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ITEMS.length - 1;

    if (next !== null) {
      event.preventDefault();
      refs.current[ITEMS[next].to]?.focus();
    }
  };

  return (
    <nav
      aria-label="Account sections"
      className="sticky top-28 flex flex-col gap-1 self-start rounded-3xl border border-brand/15 bg-cream p-3 shadow-[0_14px_36px_rgba(75,81,149,0.05)]"
    >
      <ul role="tablist" aria-orientation="vertical" className="flex flex-col gap-0.5">
        {ITEMS.map((item, index) => (
          <li key={item.to} role="presentation">
            <NavLink
              ref={(node) => {
                refs.current[item.to] = node;
              }}
              to={item.to}
              role="tab"
              aria-selected={undefined /* NavLink sets aria-current="page" */}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl px-3 py-2 font-ui text-sm tracking-[0.04em] transition duration-150 ${
                  isActive
                    ? "bg-brand text-cream shadow-[0_6px_14px_rgba(75,81,149,0.18)]"
                    : "text-brand/70 hover:bg-brand/8 hover:text-brand"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  <SidebarCounter item={item} active={isActive} peerCount={peerCount} pinCount={pinCount} />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-2 border-t border-brand/12 pt-3">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center justify-between rounded-2xl px-3 py-2 font-ui text-sm tracking-[0.04em] text-brand/70 transition hover:bg-brand/8 hover:text-brand"
        >
          <span>Sign out</span>
          <span aria-hidden="true" className="text-brand/40">→</span>
        </button>
      </div>
    </nav>
  );
};

const SidebarCounter = ({ item, active, peerCount, pinCount }) => {
  let count = null;
  if (item.to === "/account/peers") count = peerCount;
  if (item.to === "/account/node") count = pinCount;

  if (count === null || count === undefined || count === 0) return null;

  return (
    <span
      className={`rounded-full px-2 py-0.5 font-body text-[0.62rem] font-semibold ${
        active ? "bg-cream/25 text-cream" : "bg-brand/10 text-brand/70"
      }`}
    >
      {count}
    </span>
  );
};
