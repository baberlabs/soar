/**
 * Post-close vote breakdown. Two layers:
 *   1. Summary counts (Yes / No / Abstain) with a stacked bar
 *   2. Optional expanded list showing who voted what
 *
 * Accountability: once voting closes, every peer's vote becomes public.
 * This is deliberate per the "revealed on close" model.
 *
 * Peer name lookup is delegated so this component stays a pure presenter.
 */
export const VoteBreakdown = ({ votes = {}, counts, resolveAuthor }) => {
  const entries = Object.entries(votes).map(([userId, record]) => ({
    userId,
    value: record?.value ?? "unknown",
    castAt: record?.castAt,
  }));

  // Order: Yes → No → Abstain, alphabetised within each group.
  const order = { yes: 0, no: 1, abstain: 2 };
  const sorted = entries.slice().sort((a, b) => {
    const oa = order[a.value] ?? 99;
    const ob = order[b.value] ?? 99;
    if (oa !== ob) return oa - ob;
    const nameA = resolveAuthor?.(a.userId)?.fullName ?? a.userId;
    const nameB = resolveAuthor?.(b.userId)?.fullName ?? b.userId;
    return nameA.localeCompare(nameB);
  });

  const total = Math.max(1, counts.total);
  const pctYes = (counts.yes / total) * 100;
  const pctNo = (counts.no / total) * 100;
  const pctAbstain = (counts.abstain / total) * 100;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-ui text-xs uppercase tracking-[0.14em] text-brand/55">
          Final tally
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <TallyTile label="Yes" value={counts.yes} tone="sage" />
          <TallyTile label="No" value={counts.no} tone="rose" />
          <TallyTile label="Abstain" value={counts.abstain} tone="brand" />
        </div>

        <div
          className="mt-3 flex h-2 overflow-hidden rounded-full bg-brand/8"
          role="img"
          aria-label={`Vote distribution: yes ${counts.yes}, no ${counts.no}, abstain ${counts.abstain}`}
        >
          {counts.yes > 0 ? (
            <span className="h-full bg-sage" style={{ width: `${pctYes}%` }} />
          ) : null}
          {counts.no > 0 ? (
            <span
              className="h-full bg-rose-500"
              style={{ width: `${pctNo}%` }}
            />
          ) : null}
          {counts.abstain > 0 ? (
            <span
              className="h-full bg-brand/50"
              style={{ width: `${pctAbstain}%` }}
            />
          ) : null}
        </div>
      </div>

      <details className="group rounded-2xl border border-brand/15 bg-page/60 p-4">
        <summary className="cursor-pointer list-none font-ui text-sm tracking-[0.04em] text-brand/75 transition hover:text-brand">
          <span className="inline-flex items-center gap-2">
            <span
              className="transition group-open:rotate-90"
              aria-hidden="true"
            >
              ▸
            </span>
            How each peer voted
          </span>
        </summary>
        <ul className="mt-3 space-y-1.5 border-t border-brand/10 pt-3">
          {sorted.length === 0 ? (
            <li className="font-body text-sm text-brand/55">
              No votes were cast.
            </li>
          ) : (
            sorted.map((entry) => {
              const author = resolveAuthor?.(entry.userId);
              return (
                <li
                  key={entry.userId}
                  className="flex items-center justify-between gap-3 font-body text-sm"
                >
                  <span className="text-brand/80">
                    {author?.fullName ?? "Unknown peer"}
                  </span>
                  <VoteChip value={entry.value} />
                </li>
              );
            })
          )}
        </ul>
      </details>
    </div>
  );
};

const TILE_TONES = {
  sage: "border-sage/30 bg-sage/5 text-sage",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
  brand: "border-brand/20 bg-brand/5 text-brand",
};

const TallyTile = ({ label, value, tone }) => (
  <div
    className={`rounded-2xl border px-4 py-3 ${TILE_TONES[tone] ?? TILE_TONES.brand}`}
  >
    <p className="font-body text-[0.62rem] uppercase tracking-[0.14em] opacity-70">
      {label}
    </p>
    <p className="mt-1 font-ui text-2xl leading-none">{value}</p>
  </div>
);

const CHIP_TONES = {
  yes: "bg-sage/15 text-sage border-sage/30",
  no: "bg-rose-100 text-rose-800 border-rose-200",
  abstain: "bg-brand/8 text-brand/75 border-brand/20",
};

const VoteChip = ({ value }) => (
  <span
    className={`rounded-full border px-2.5 py-0.5 font-body text-[0.62rem] font-medium uppercase tracking-[0.12em] ${CHIP_TONES[value] ?? CHIP_TONES.abstain}`}
  >
    {value}
  </span>
);
