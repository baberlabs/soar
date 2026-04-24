import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import LogoIcon from "../assets/icons";
import { useSOARState } from "../store";
import { MEMBER_NAV_ITEMS, PUBLIC_NAV_ITEMS } from "./nav.config";

export const Header = () => {
  const state = useSOARState();
  const [isOpen, setIsOpen] = useState(false);

  const items = useMemo(
    () => (state.user ? MEMBER_NAV_ITEMS : PUBLIC_NAV_ITEMS),
    [state.user],
  );

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3">
      <div className="mx-auto flex h-16 w-full max-w-360 items-center justify-between rounded-2xl bg-brand px-4 shadow-[inset_0_1px_0_rgba(180,220,245,0.25),0_4px_24px_rgba(75,81,149,0.18)]">
        <SiteLogo onNavigate={closeMenu} />

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-on/20 text-brand-on md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <span className="flex flex-col gap-1">
            <span
              className={`h-0.5 w-5 rounded-full bg-brand-on transition ${isOpen ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-brand-on transition ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-brand-on transition ${isOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>

        <div className="hidden md:block">
          <SiteNav items={items} onNavigate={closeMenu} />
        </div>
      </div>

      {isOpen ? (
        <div className="mx-auto mt-2 w-full max-w-360 rounded-2xl border border-brand/20 bg-cream p-3 shadow-[0_20px_40px_rgba(75,81,149,0.2)] md:hidden">
          <SiteNav items={items} mobile onNavigate={closeMenu} />
        </div>
      ) : null}
    </header>
  );
};

const SiteLogo = ({ onNavigate }) => (
  <Link to="/" aria-label="Go to home" onClick={onNavigate}>
    <img className="h-9 w-auto shrink-0" src={LogoIcon} alt="SOAR" />
  </Link>
);

const SiteNav = ({ items, mobile = false, onNavigate }) => (
  <nav aria-label="Main">
    <ul
      className={
        mobile
          ? "m-0 grid list-none grid-cols-2 gap-2 p-0"
          : "m-0 flex list-none items-center gap-1 p-0"
      }
    >
      {items.map((item) =>
        item.type === "separator" ? (
          mobile ? null : (
            <NavDivider key={item.id} />
          )
        ) : (
          <NavItem
            key={item.to}
            mobile={mobile}
            onNavigate={onNavigate}
            {...item}
          />
        ),
      )}
    </ul>
  </nav>
);

const NavDivider = () => (
  <li aria-hidden="true">
    <div className="mx-1 h-9 w-px bg-linear-to-b from-transparent via-brand-rim to-transparent" />
  </li>
);

const NavItem = ({ label, icon, to, mobile, onNavigate }) => (
  <li>
    <NavLink
      to={to}
      className={(args) => navItemClass(args, mobile)}
      onClick={onNavigate}
    >
      <img
        src={icon}
        className="h-4 w-4 opacity-70 transition duration-200 group-hover:scale-[1.15] group-hover:opacity-100"
        alt=""
        aria-hidden="true"
      />
      <span>{label}</span>
    </NavLink>
  </li>
);

const navItemClass = ({ isActive }, mobile) =>
  [
    "group relative flex items-center justify-center gap-2 rounded-[10px] px-[11px] py-[8px] font-ui text-xs tracking-[0.08em] transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
    mobile
      ? "w-full border border-brand/12 text-cream hover:bg-brand/80 bg-brand"
      : "flex-col text-brand-on/60 hover:-translate-y-px hover:bg-brand-fill hover:text-brand-on",
    !mobile &&
      "after:absolute after:-bottom-px after:left-1/2 after:h-[2.5px] after:w-5 after:-translate-x-1/2 after:origin-center after:rounded-full after:bg-accent after:shadow-[0_0_8px_rgba(238,237,147,0.5)] after:transition after:content-['']",
    isActive
      ? mobile
        ? "bg-brand/80"
        : "bg-accent-fill text-accent after:scale-x-100 after:opacity-100"
      : !mobile
        ? "after:scale-x-0 after:opacity-0"
        : "",
  ]
    .filter(Boolean)
    .join(" ");
