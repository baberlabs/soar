import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuIcon, X } from "lucide-react";

import { useScrolled } from "./hooks/useScrolled";
import Logo from "../components/Logo";

const PUBLIC_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Donate", to: "/donate" },
  { label: "Login", to: "/login" },
  { label: "Join", to: "/join" },
];

export const PublicHeader = () => {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);

  // lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const getNavClass = ({ isActive }) =>
    `inline-flex h-10 items-center justify-center rounded-full px-4 font-ui text-sm tracking-[0.08em] transition ${
      isActive
        ? "bg-page text-brand shadow-[0_8px_18px_rgba(75,81,149,0.10)]"
        : "text-brand/72 hover:bg-page/70 hover:text-brand"
    }`;

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-2 z-50 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 rounded-full border px-3 backdrop-blur-xl transition border-brand/18 bg-page/96 shadow-[0_18px_48px_rgba(75,81,149,0.14)]">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Go to home"
          className="inline-flex h-12 w-20 shrink-0 items-center justify-center rounded-full hover:bg-brand/6 focus-visible:outline-2 focus-visible:outline-brand/50"
          onClick={closeMenu}
        >
          <Logo className="h-10 w-auto text-brand" />
        </Link>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((p) => !p)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand hover:bg-brand/10 sm:hidden"
        >
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>

        {/* Desktop nav */}
        <nav
          aria-label="Public navigation"
          className="hidden rounded-full bg-brand/7 p-1 ring-1 ring-brand/8 sm:flex"
        >
          {PUBLIC_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={getNavClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-40 sm:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* panel */}
          <div className="absolute inset-x-3 top-20 rounded-2xl border border-brand/18 bg-page p-4 shadow-xl">
            <nav className="flex flex-col gap-2">
              {PUBLIC_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `w-full rounded-xl px-4 py-3 text-left font-ui text-sm tracking-[0.08em] transition ${
                      isActive
                        ? "bg-brand text-white"
                        : "text-brand/80 hover:bg-brand/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
