import { useRef } from "react";

export const ReflectTabs = ({ tab, onTabChange }) => {
  const refs = useRef({});

  const tabs = [
    { id: "vision", label: "Moodboards" },
    { id: "letters", label: "Future Letters" },
  ];

  const handleKeyDown = (event, index) => {
    let nextIndex = null;

    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      const nextId = tabs[nextIndex].id;
      onTabChange(nextId);
      refs.current[nextId]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Reflect sections"
      className="inline-flex max-w-full overflow-x-auto rounded-full border border-brand/15 bg-cream p-1 shadow-[0_2px_12px_rgba(75,81,149,0.06)]"
    >
      {tabs.map((entry, index) => {
        const isActive = tab === entry.id;
        return (
          <button
            key={entry.id}
            ref={(node) => {
              refs.current[entry.id] = node;
            }}
            type="button"
            role="tab"
            id={`reflect-tab-${entry.id}`}
            aria-selected={isActive}
            aria-controls={`reflect-panel-${entry.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(entry.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`whitespace-nowrap rounded-full px-3 py-2 font-ui text-[0.68rem] tracking-[0.08em] transition duration-200 sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-widest ${
              isActive
                ? "bg-brand text-cream shadow-[0_8px_20px_rgba(75,81,149,0.22)]"
                : "text-brand/65 hover:text-brand"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
};
