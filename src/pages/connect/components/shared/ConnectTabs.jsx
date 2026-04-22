import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/connect/peers", label: "Peers" },
  { to: "/connect/chats", label: "Chats" },
  { to: "/connect/events", label: "Events" },
];

/**
 * Tab navigation backed by the URL pathname, not component state.
 * `NavLink` handles aria-current="page" automatically when active.
 *
 * We duplicate that with role=tab / aria-selected so screen readers that
 * interpret the tabs pattern get the right semantics either way.
 */
export const ConnectTabs = ({ counts = {} }) => (
  <nav
    role="tablist"
    aria-label="Connect sections"
    className="inline-flex rounded-full border border-brand/15 bg-cream p-1 shadow-[0_8px_24px_rgba(75,81,149,0.06)]"
  >
    {TABS.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        role="tab"
        className={({ isActive }) =>
          `inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-sm tracking-[0.08em] transition duration-200 ${
            isActive
              ? "bg-brand text-cream shadow-[0_8px_18px_rgba(75,81,149,0.22)]"
              : "text-brand/65 hover:text-brand"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span>{tab.label}</span>
            {typeof counts[tab.to] === "number" ? (
              <span
                className={`rounded-full px-2 py-0.5 font-body text-[0.62rem] font-semibold ${
                  isActive ? "bg-cream/25 text-cream" : "bg-brand/10 text-brand/75"
                }`}
              >
                {counts[tab.to]}
              </span>
            ) : null}
          </>
        )}
      </NavLink>
    ))}
  </nav>
);
