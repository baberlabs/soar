export const PageSkeleton = () => (
  <main
    className="mx-auto w-full max-w-360 px-6 pb-24 pt-28 md:pb-32 md:pt-34"
    aria-label="Loading page"
  >
    <div className="mx-auto max-w-6xl space-y-6 motion-safe:animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-28 rounded-full bg-brand/10" />
        <div className="h-16 w-full max-w-3xl rounded-2xl bg-brand/10 md:h-20" />
        <div className="h-4 w-full max-w-2xl rounded-full bg-brand/8" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <SkeletonBlock className="min-h-72" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <SkeletonBlock className="min-h-34" />
          <SkeletonBlock className="min-h-34" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <SkeletonBlock className="min-h-48" />
        <SkeletonBlock className="min-h-48" />
        <SkeletonBlock className="min-h-48" />
      </div>
    </div>
  </main>
);

const SkeletonBlock = ({ className = "" }) => (
  <div
    className={`rounded-[1.35rem] border border-brand/8 bg-cream/80 p-5 shadow-[0_16px_38px_rgba(75,81,149,0.04)] ${className}`}
  >
    <div className="space-y-3">
      <div className="h-3 w-20 rounded-full bg-brand/10" />
      <div className="h-7 w-2/3 rounded-full bg-brand/10" />
      <div className="h-3 w-full rounded-full bg-brand/8" />
      <div className="h-3 w-4/5 rounded-full bg-brand/8" />
    </div>
  </div>
);
