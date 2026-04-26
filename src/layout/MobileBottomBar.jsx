import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, X } from "lucide-react";

import { useSOARDispatch } from "../store";
import { MEMBER_PRIMARY_ITEMS, MEMBER_SECONDARY_ITEMS } from "./nav.config";
import { Button } from "../components/Button";

const MORE_ITEMS = MEMBER_SECONDARY_ITEMS;

export const MobileBottomBar = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useSOARDispatch();

  useEffect(() => {
    if (!isMoreOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMoreOpen]);

  const signOut = () => {
    dispatch({ type: "SIGN_OUT" });
    setIsMoreOpen(false);
    navigate("/login", { replace: true });
  };

  const moreIsActive = MORE_ITEMS.some(
    (item) =>
      location.pathname === item.to ||
      location.pathname.startsWith(`${item.to}/`),
  );

  return (
    <>
      <nav
        aria-label="Mobile app navigation"
        className="fixed inset-x-0 bottom-0 z-50 bg-brand pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid h-16 grid-cols-5 border-t border-cream/12">
          {MEMBER_PRIMARY_ITEMS.map((item) => (
            <BottomBarLink key={item.to} item={item} />
          ))}
          <button
            type="button"
            aria-label="More navigation"
            aria-expanded={isMoreOpen}
            aria-controls="mobile-more-sheet"
            onClick={() => setIsMoreOpen((current) => !current)}
            className={`flex flex-col items-center justify-center gap-1 font-ui text-[0.62rem] tracking-[0.04em] transition ${
              moreIsActive || isMoreOpen
                ? "text-accent"
                : "text-cream/58 hover:text-cream"
            }`}
          >
            <LayoutGrid size={20} strokeWidth={1.8} aria-hidden="true" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm transition md:hidden ${
          isMoreOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setIsMoreOpen(false)}
      />

      <div
        id="mobile-more-sheet"
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-[1.6rem] bg-cream px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-24px_56px_rgba(25,28,70,0.28)] motion-safe:transition-transform motion-safe:duration-200 md:hidden ${
          isMoreOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          aria-hidden="true"
          className="mx-auto h-1.5 w-12 rounded-full bg-brand/18"
        />
        <div className="mt-4 flex items-center justify-between gap-3">
          <h2 className="font-ui text-xl leading-none text-brand">More</h2>
          <button
            type="button"
            onClick={() => setIsMoreOpen(false)}
            className="hover:scale-110"
          >
            <X />
          </button>
        </div>

        <nav aria-label="More pages" className="mt-4">
          <ul className="grid grid-cols-3 gap-2" role="list">
            {MORE_ITEMS.map((item) => (
              <li key={item.to} className="bg-brand rounded-2xl">
                <MoreSheetLink
                  item={item}
                  onNavigate={() => setIsMoreOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <Button
          text="Sign out"
          variant="danger"
          className="mt-4"
          onClick={signOut}
        />
      </div>
    </>
  );
};

const BottomBarLink = ({ item }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center gap-1 font-ui text-[0.62rem] tracking-[0.04em] transition ${
        isActive ? "text-accent bg-black/25" : "text-cream/58 hover:text-cream"
      }`
    }
  >
    <img src={item.icon} alt="" aria-hidden="true" className="h-5 w-5" />
    <span>{item.label}</span>
  </NavLink>
);

const MoreSheetLink = ({ item, onNavigate }) => (
  <NavLink
    to={item.to}
    onClick={onNavigate}
    className={({ isActive }) =>
      `flex min-h-24 flex-col items-center justify-center rounded-2xl gap-2 border px-2 py-3 text-center font-ui text-xs tracking-[0.04em] transition ${
        isActive
          ? "text-yellow bg-black/25"
          : "text-cream/85 bg-white/5 hover:text-cream hover:bg-black/10"
      }`
    }
  >
    <img src={item.icon} alt="" aria-hidden="true" className="h-6 w-6" />
    <span>{item.label}</span>
  </NavLink>
);
