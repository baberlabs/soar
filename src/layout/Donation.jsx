import { Link } from "react-router-dom";
import { Badge } from "../components/Badge";

export const Donation = () => {
  return (
    <section className="bg-sky px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-2xl border border-navy/15 bg-cream/60 p-7 md:p-10">
        <div className="flex max-w-4xl flex-col gap-5">
          <Badge variant="navy" className="self-start">
            Donation
          </Badge>

          <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.03] tracking-[-0.02em] text-navy">
            Keep SOAR Running Day To Day
          </h2>

          <p className="font-body text-base leading-relaxed text-navy/80 md:text-lg">
            Donations support the ongoing operation of the platform, including
            hosting, maintenance, moderation, and peer services required for
            day-to-day use.
          </p>

          <Link
            to="/donate"
            className="cursor-pointer inline-flex w-fit items-center justify-center rounded-xl border border-navy/40 bg-navy px-6 py-3 font-ui text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(238,237,147,0.35)] active:scale-[0.97]"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </section>
  );
};
