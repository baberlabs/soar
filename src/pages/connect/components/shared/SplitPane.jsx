/**
 * Responsive split pane: on mobile/small, shows either list OR detail
 * based on `isDetailOpen`. On lg+, shows both side by side.
 *
 * This is the structural primitive that makes the three tabs feel
 * consistent — all share the same "list on left, panel on right" geometry.
 *
 * The detail panel gets `sticky top-6` on desktop so long peer lists
 * don't push the profile out of view when scrolling.
 */
export const SplitPane = ({
  list,
  detail,
  isDetailOpen,
  listLabel,
  detailLabel,
  emptyDetail,
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <aside
        aria-label={listLabel}
        className={`min-w-0 ${isDetailOpen ? "hidden lg:block" : "block"}`}
      >
        {list}
      </aside>

      <section
        aria-label={detailLabel}
        className={`min-w-0 ${isDetailOpen ? "block" : "hidden lg:block"}`}
      >
        {isDetailOpen ? (
          detail
        ) : (
          <div className="hidden h-full min-h-112 lg:flex lg:items-center lg:justify-center">
            {emptyDetail}
          </div>
        )}
      </section>
    </div>
  );
};
