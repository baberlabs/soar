import { Link } from "react-router-dom";
import { LinkButton } from "../components/LinkButton";

export const Donation = () => {
  return (
    <aside className="px-6 py-16 bg-linear-to-br from-brand/5 to-transparent border-t border-brand/20">
      <div className="max-w-6xl mx-auto">
        <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl space-y-4">
            <p className="font-ui text-xs tracking-[0.2em] text-sage">
              COMMUNITY BENEFIT SOCIETY
            </p>
            <h2 className="font-display text-3xl text-brand md:text-4xl">
              Fund the platform
            </h2>
            <p className="font-body text-base leading-relaxed text-brand/80">
              A £1 share makes you an equal peer with one vote. Additional
              donations fund our infrastructure, curriculum, and decentralised
              nodes. But they do not buy extra influence. Fairness is hardcoded
              into the platform.
            </p>
            <LinkButton
              text="Donate"
              href="/donate"
              fullWidth={false}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
