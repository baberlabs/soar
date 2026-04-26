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
    <div className="space-y-3">
      {/* Tabs (scrollable) */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-page to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-page to-transparent sm:hidden" />

        <nav
          role="tablist"
          aria-label="Proposal filters"
          className="flex w-full overflow-x-auto px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-cream/80 p-1 shadow-sm backdrop-blur-md">
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
                  `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand text-cream shadow-md"
                      : "text-brand/70 hover:text-brand hover:bg-brand/5"
                  }`
                }
              >
                {({ isActive }) => {
                  const count = counts[tab.key];
                  const showCount =
                    tab.key === "drafts"
                      ? count > 0
                      : typeof count === "number";

                  return (
                    <>
                      <span className="whitespace-nowrap">{tab.label}</span>

                      {showCount && (
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-semibold ${
                            isActive
                              ? "bg-cream/25 text-cream"
                              : "bg-brand/10 text-brand/75"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* CTA (separate row on mobile) */}
      <div className="flex justify-end sm:justify-start mt-6">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="New proposal"
          onClick={() => navigate("/forum/new")}
        />
      </div>
    </div>
  );
};
