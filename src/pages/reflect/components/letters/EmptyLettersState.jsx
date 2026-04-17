export const EmptyLettersState = () => (
  <div className="relative overflow-hidden rounded-3xl border border-dashed border-brand/25 bg-linear-to-br from-cream via-page to-yellow/20 p-10 text-center">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-50"
    >
      <span className="absolute left-[12%] top-[18%] block h-20 w-28 -rotate-6 rounded-xl border border-brand/15 bg-white/80 shadow-[0_10px_22px_rgba(75,81,149,0.1)]" />
      <span className="absolute right-[14%] top-[28%] block h-16 w-24 rotate-[8deg] rounded-xl border border-brand/15 bg-white/80 shadow-[0_10px_22px_rgba(75,81,149,0.1)]" />
      <span className="absolute bottom-[18%] left-[22%] block h-14 w-20 rotate-[4deg] rounded-xl border border-brand/15 bg-white/80 shadow-[0_10px_22px_rgba(75,81,149,0.1)]" />
    </div>

    <div className="relative">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-brand/55">
        No letter yet
      </p>
      <h3 className="mt-3 font-ui text-2xl text-brand">
        Write one letter to your future self
      </h3>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-brand/70">
        Write one letter, seal it, and come back later to break it open when
        you're ready to reflect.
      </p>
    </div>
  </div>
);
