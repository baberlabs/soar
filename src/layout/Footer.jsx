import { Link } from "react-router-dom";

import LogoIcon from "../assets/icons/logo.svg";

const GROUPS = [
  {
    heading: "Platform",
    links: [
      { label: "Learn", to: "/learn" },
      { label: "Create", to: "/create" },
      { label: "Reflect", to: "/reflect" },
      { label: "Connect", to: "/connect" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Forum", to: "/feedback" },
      { label: "About", to: "/about" },
      { label: "Join", to: "/join" },
    ],
  },
  {
    heading: "Transparency",
    links: [
      { label: "Data Manifesto", to: "/data-manifesto" },
      { label: "Terms of Peership", to: "/terms" },
      { label: "Accessibility", to: "/accessibility" },
    ],
  },
];

export const Footer = () => (
  <footer className="mt-auto bg-navy text-cream">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-12 pt-16 md:grid-cols-[1.4fr_1fr] md:gap-16">
      <div className="flex flex-col gap-5">
        <Link to="/" aria-label="SOAR home">
          <img className="h-12 w-auto" src={LogoIcon} alt="SOAR" />
        </Link>
        <p className="max-w-[32ch] font-body text-sm font-light leading-relaxed text-cream/60">
          A community-owned platform for people who want to use their time well.
        </p>
        <div className="w-fit rounded-full border border-sage px-3 py-1 text-xs text-sage">
          Community Benefit Society
        </div>
      </div>

      <nav
        className="grid grid-cols-1 gap-8 sm:grid-cols-3"
        aria-label="Footer navigation"
      >
        {GROUPS.map(({ heading, links }) => (
          <div key={heading} className="flex flex-col gap-4">
            <span className="font-ui text-lg tracking-[0.12em] text-yellow">
              {heading}
            </span>
            <ul className="flex flex-col gap-3">
              {links.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-body text-sm font-light text-cream/50 transition-colors duration-200 hover:text-cream"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>

    {/* Bottom bar */}
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
      <span className="font-ui text-[0.65rem] tracking-[0.2em] text-cream/30">
        © {new Date().getFullYear()} SOAR Community Benefit Society
      </span>
      <span className="font-ui text-[0.65rem] tracking-[0.2em] text-cream/30">
        No ads · No tracking · Built with intention
      </span>
    </div>
  </footer>
);
