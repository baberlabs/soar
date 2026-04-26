export const Stats = ({ stats }) => (
  <div>
    {stats ? (
      <dl className="grid grid-cols-3 gap-2">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-brand/5 px-3 py-2.5 text-center"
          >
            <dt className="text-[0.6rem] uppercase tracking-[0.12em] text-brand/50">
              {label}
            </dt>
            <dd className="mt-1 font-ui text-lg font-semibold text-brand">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    ) : null}
  </div>
);
