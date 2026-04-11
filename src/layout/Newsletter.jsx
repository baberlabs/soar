import { useState } from "react";
import { Badge } from "../components/Badge";

const BENEFITS = [
  "Platform updates voted on by the community — before they ship",
  "Monthly member stories: what people are learning and making",
  "New subjects, seasonal themes, and Forum highlights",
];

const INPUT_CLASS =
  "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-body text-cream outline-none placeholder:text-cream/30 transition duration-200 focus:border-yellow focus:ring-2 focus:ring-yellow/20";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    /* TODO: wire to mailing list API */
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  return (
    <section className="bg-sage px-6 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <NewsletterCopy />
        <NewsletterForm
          email={email}
          onEmail={setEmail}
          onSubmit={handleSubmit}
          status={status}
        />
      </div>
    </section>
  );
};

/* ── Left: copy ── */
const NewsletterCopy = () => (
  <div className="flex flex-col gap-6">
    <Badge variant="cream" className="self-start">
      The SOAR dispatch
    </Badge>

    <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-cream">
      Stay in the loop.
      <br />
      Not in the feed.
    </h2>

    <p className="font-body font-light text-lg text-cream/70 leading-relaxed max-w-[38ch]">
      Occasional, intentional updates from the community. No noise — just the
      things that actually matter to members.
    </p>

    <ul className="flex flex-col gap-3">
      {BENEFITS.map((benefit) => (
        <li key={benefit} className="flex items-start gap-3">
          <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-yellow shadow-[0_0_8px_rgba(238,237,147,0.5)]" />
          <span className="font-body font-light text-sm text-cream/80 leading-relaxed">
            {benefit}
          </span>
        </li>
      ))}
    </ul>

    <p className="font-ui text-[0.65rem] tracking-[0.12em] text-cream/40">
      No ads · No data sold · Unsubscribe anytime
    </p>
  </div>
);

/* ── Right: form ── */
const NewsletterForm = ({ email, onEmail, onSubmit, status }) => (
  <div className="flex flex-col gap-6 rounded-2xl border border-white/15 bg-white/10 p-8 backdrop-blur-sm">
    {status === "success" ? (
      <SuccessState />
    ) : (
      <>
        <div className="flex flex-col gap-1">
          <h3 className="font-ui text-xl tracking-[0.06em] text-cream">
            Join the dispatch
          </h3>
          <p className="font-body font-light text-sm text-cream/50">
            One email. Worth reading.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="font-ui text-[0.65rem] tracking-[0.12em] text-cream/60"
              htmlFor="newsletter-email"
            >
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="newsletter-email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              required
              className={INPUT_CLASS}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="w-full rounded-xl bg-yellow px-6 py-3 font-ui tracking-[0.08em] text-navy transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(238,237,147,0.35)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading"
              ? "Subscribing…"
              : "Subscribe to the dispatch"}
          </button>
        </form>
      </>
    )}
  </div>
);

/* ── Success state ── */
const SuccessState = () => (
  <div className="flex flex-col items-center gap-4 py-6 text-center">
    <span className="font-display text-5xl text-yellow leading-none">✓</span>
    <h3 className="font-ui text-xl tracking-[0.06em] text-cream">You're in.</h3>
    <p className="font-body font-light text-sm text-cream/60 leading-relaxed max-w-[28ch]">
      Welcome to the dispatch. You'll hear from us when something worth saying
      happens — not before.
    </p>
  </div>
);
