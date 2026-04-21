/**
 * Grouped placeholders for sections that depend on backend work.
 *
 * Copy rules: no "mock" / "demo" / "for show" language. Just honest
 * statements of intent. Each item gets a short description of what will
 * live here once the backend is wired up.
 */

const ITEMS = [
  {
    title: "Security",
    description:
      "Password changes, session device list, and hardware key sign-in will live here.",
  },
  {
    title: "Notifications",
    description:
      "Choose which events notify you — and on which channels.",
  },
  {
    title: "Theme",
    description:
      "System, light, and dark modes, plus motion preferences.",
  },
];

export const ComingSoonSection = () => (
  <div className="space-y-3">
    {ITEMS.map((item) => (
      <article
        key={item.title}
        className="flex items-start justify-between gap-4 rounded-2xl border border-brand/12 bg-page/50 p-5"
      >
        <div className="min-w-0">
          <h3 className="font-ui text-base tracking-[0.03em] text-brand">
            {item.title}
          </h3>
          <p className="mt-1 font-body text-sm text-brand/68">
            {item.description}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-brand/15 bg-cream px-3 py-1 font-body text-[0.62rem] font-medium uppercase tracking-[0.12em] text-brand/60">
          Soon
        </span>
      </article>
    ))}
  </div>
);
