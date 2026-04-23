import { NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "../../../../components/Button";

const TABS = [
  { to: "/forum/all", label: "All", key: "all" },
  { to: "/forum/discussion", label: "Discussion", key: "discussion" },
  { to: "/forum/voting", label: "Voting", key: "voting" },
  { to: "/forum/closed", label: "Closed", key: "closed" },
  { to: "/forum/drafts", label: "My drafts", key: "drafts" },
];

export const ForumTabs = ({ counts = {} }) => {
  const navigate = useNavigate();
  const refs = useRef({});

  const handleKeyDown = (event, index) => {
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + TABS.length) % TABS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = TABS.length - 1;

    if (next !== null) {
      event.preventDefault();
      refs.current[TABS[next].to]?.focus();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <nav
        role="tablist"
        aria-label="Proposal filters"
        className="inline-flex flex-wrap rounded-full border border-brand/15 bg-cream p-1 shadow-[0_8px_24px_rgba(75,81,149,0.06)]"
      >
        {TABS.map((tab, index) => (
          <NavLink
            key={tab.to}
            ref={(node) => {
              refs.current[tab.to] = node;
            }}
            to={tab.to}
            role="tab"
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-full px-4 py-2 font-ui text-sm tracking-[0.06em] transition duration-200 ${
                isActive
                  ? "bg-brand text-cream shadow-[0_8px_18px_rgba(75,81,149,0.22)]"
                  : "text-brand/65 hover:text-brand"
              }`
            }
          >
            {({ isActive }) => {
              const count = counts[tab.key];
              const showCount =
                tab.key === "drafts" ? count > 0 : typeof count === "number";

              return (
                <>
                  <span>{tab.label}</span>
                  {showCount ? (
                    <span
                      className={`rounded-full px-2 py-0.5 font-body text-[0.62rem] font-semibold ${
                        isActive
                          ? "bg-cream/25 text-cream"
                          : "bg-brand/10 text-brand/75"
                      }`}
                    >
                      {count}
                    </span>
                  ) : null}
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>

      <Button
        type="button"
        variant="primary"
        size="sm"
        fullWidth={false}
        text="New proposal"
        onClick={() => navigate("/forum/new")}
      />
    </div>
  );
};
