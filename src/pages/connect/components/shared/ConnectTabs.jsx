import { NavLink } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const TABS = [
  { to: "/connect/chats", label: "Chats" },
  { to: "/connect/my-peers", label: "My Peers" },
  { to: "/connect/find-peers", label: "Find Peers" },
  { to: "/connect/my-events", label: "My Events" },
  { to: "/connect/all-events", label: "All Events" },
];

export const ConnectTabs = ({ counts = {} }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to toggle the fade masks
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Use a small threshold (e.g., 2px) to prevent precision bugs where it never quite reaches 0
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    // Re-check on window resize
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div className="relative -mx-6 sm:mx-0">
      {/* Left Fade Indicator */}
      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-linear-to-r from-page to-transparent transition-opacity duration-300 sm:hidden ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Right Fade Indicator */}
      <div
        className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-linear-to-l from-page to-transparent transition-opacity duration-300 sm:hidden ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="w-full overflow-x-auto px-6 pb-2 sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <nav
          role="tablist"
          aria-label="Connect sections"
          className="inline-flex w-max items-center gap-1.5 rounded-full border border-brand/15 bg-cream/80 p-1.5 shadow-sm backdrop-blur-md"
        >
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              role="tab"
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-ui text-[0.85rem] tracking-[0.04em] transition-all duration-200 sm:px-5 sm:text-sm ${
                  isActive
                    ? "bg-brand text-cream shadow-md"
                    : "text-brand/70 hover:bg-brand/5 hover:text-brand"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{tab.label}</span>
                  {typeof counts[tab.to] === "number" ? (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-body text-[0.65rem] font-bold ${
                        isActive
                          ? "bg-cream/25 text-cream"
                          : "bg-brand/10 text-brand/80"
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
      </div>
    </div>
  );
};
