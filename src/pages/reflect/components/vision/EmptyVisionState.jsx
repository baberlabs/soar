import { Button } from "../../../../components/Button";

export const EmptyVisionState = ({ onCreate }) => (
  <div className="relative overflow-hidden rounded-3xl border border-dashed border-brand/25 bg-linear-to-br from-cream via-page to-sky/20 p-12 text-center">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-60"
    >
      <span className="absolute left-[8%] top-[15%] block h-16 w-16 rotate-[-8deg] rounded-2xl border border-brand/15 bg-white/70 shadow-[0_10px_20px_rgba(75,81,149,0.08)]" />
      <span className="absolute right-[12%] top-[22%] block h-14 w-14 rotate-6 rounded-2xl border border-brand/15 bg-yellow/30 shadow-[0_10px_20px_rgba(75,81,149,0.08)]" />
      <span className="absolute bottom-[14%] left-[16%] block h-12 w-12 rotate-12 rounded-2xl border border-brand/15 bg-sky/40 shadow-[0_10px_20px_rgba(75,81,149,0.08)]" />
      <span className="absolute bottom-[22%] right-[18%] block h-16 w-16 rotate-[-4deg] rounded-2xl border border-brand/15 bg-lavender/40 shadow-[0_10px_20px_rgba(75,81,149,0.08)]" />
    </div>

    <div className="relative">
      <p className="font-ui text-xs uppercase tracking-[0.2em] text-brand/55">
        Start here
      </p>
      <h3 className="mt-3 font-ui text-3xl text-brand">Your first moodboard</h3>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-brand/70">
        Collect images, notes, songs, and goals for the month ahead. Drag them
        around the canvas until the board feels like where you're heading.
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth={false}
          text="Create your first board"
          onClick={onCreate}
        />
      </div>
    </div>
  </div>
);
