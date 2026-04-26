import { Link } from "react-router-dom";

export const EmptyState = ({ title, message, ctaLabel, ctaTo }) => (
  <div className="rounded-3xl border border-dashed border-brand/25 bg-cream/60 p-10 text-center">
    <p className="font-ui text-lg text-brand">{title}</p>
    {message ? (
      <p className="mx-auto mt-2 max-w-md font-body text-sm text-brand/65">
        {message}
      </p>
    ) : null}
    {ctaLabel && ctaTo ? (
      <div className="mt-5 inline-flex">
        <Link
          to={ctaTo}
          className="inline-flex items-center rounded-full border border-brand/20 bg-cream px-4 py-2 font-ui text-sm tracking-[0.06em] text-brand transition hover:border-brand/35"
        >
          {ctaLabel}
        </Link>
      </div>
    ) : null}
  </div>
);
