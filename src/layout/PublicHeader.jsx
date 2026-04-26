import { Link, NavLink } from "react-router-dom";

import LogoIcon from "../assets/icons";
import { useScrolled } from "./hooks/useScrolled";
import Logo from "../components/Logo";

const PUBLIC_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Donate",
    to: "/donate",
    className: "hidden min-[430px]:inline-flex",
  },
];

export const PublicHeader = () => {
  const scrolled = useScrolled(60);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-2 sm:px-3">
      <div
        className={`mx-auto grid h-14 w-full max-w-360 grid-cols-[auto_1fr_auto] items-center gap-1.5 rounded-full px-2 transition duration-200 sm:h-16 sm:gap-3 sm:px-3 md:px-4 ${
          scrolled
            ? "bg-brand/95 shadow-[inset_0_1px_0_rgba(180,220,245,0.25),0_4px_24px_rgba(75,81,149,0.18)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <Link
          to="/"
          aria-label="Go to home"
          className="inline-flex items-center"
        >
          <Logo
            className={`size-11 sm:size-14 ${scrolled ? "text-cream" : "text-brand"}`}
          />
        </Link>

        <nav
          aria-label="Public navigation"
          className="flex min-w-0 justify-center gap-0.5 sm:gap-1"
        >
          {PUBLIC_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `${item.className ?? "inline-flex"} rounded-full px-1.5 py-2 font-ui text-[0.78rem] tracking-[0.04em] transition sm:px-4 sm:text-base sm:tracking-[0.06em]  ${
                  isActive
                    ? scrolled
                      ? "bg-cream/12 text-accent"
                      : "bg-brand/8 text-brand"
                    : scrolled
                      ? "text-cream/78 hover:bg-cream/8 hover:text-cream"
                      : "text-brand/82 hover:bg-brand/8 hover:text-brand"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `inline-flex min-h-9 items-center justify-center rounded-full border px-2.5 font-ui text-[0.78rem] tracking-[0.04em] transition sm:min-h-10 sm:px-4 sm:text-base sm:tracking-[0.06em] ${
                isActive
                  ? scrolled
                    ? "border-accent/70 bg-cream/10 text-accent"
                    : "border-brand/22 bg-brand/8 text-brand"
                  : scrolled
                    ? "border-cream/18 text-cream/75 hover:border-cream/34 hover:text-cream"
                    : "border-brand/18 text-brand/82 hover:border-brand/34 hover:text-brand"
              }`
            }
          >
            Log In
          </NavLink>
          <NavLink
            to="/join"
            className="inline-flex min-h-9 items-center justify-center rounded-full bg-accent px-2.5 font-ui text-[0.78rem] tracking-[0.04em] text-brand transition hover:bg-cream sm:min-h-10 sm:px-4 sm:text-base sm:tracking-[0.06em]"
          >
            Join
          </NavLink>
        </div>
      </div>
    </header>
  );
};
