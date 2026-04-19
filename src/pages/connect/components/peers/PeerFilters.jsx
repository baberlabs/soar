/**
 * Search + pathway filter for the peers list.
 *
 * Deliberately terse — the label text IS the field's purpose. The old
 * "Recommendations are ranked by shared interests..." explainer is gone;
 * users who squint at a search box understand what to type.
 */
export const PeerFilters = ({
  searchTerm,
  onSearchChange,
  pathwayFilter,
  onPathwayChange,
  pathwayOptions,
  resultCount,
}) => (
  <div className="space-y-3">
    <div className="relative">
      <input
        type="search"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search peers"
        aria-label="Search peers by name, city, interest, or pathway"
        className="w-full rounded-2xl border border-brand/15 px-4 py-2.5 pr-10 font-body text-sm text-brand outline-none transition placeholder:text-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-ui text-xs text-brand/45"
      >
        ⌕
      </span>
    </div>

    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <select
          value={pathwayFilter}
          onChange={(event) => onPathwayChange(event.target.value)}
          aria-label="Filter by pathway"
          className="w-full appearance-none rounded-2xl border border-brand/15 px-4 py-2.5 pr-10 font-body text-sm text-brand outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {pathwayOptions.map((option) => (
            <option key={option.id} value={option.id} className="bg-cream">
              {option.name}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-ui text-xs text-brand/45"
        >
          ▼
        </span>
      </div>

      <p
        className="shrink-0 font-body text-xs text-brand/55"
        aria-live="polite"
      >
        {resultCount}{" "}
        <span className="uppercase tracking-widest">
          {resultCount === 1 ? "match" : "matches"}
        </span>
      </p>
    </div>
  </div>
);
