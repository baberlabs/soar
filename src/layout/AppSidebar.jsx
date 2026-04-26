import { NavLink, useNavigate } from "react-router-dom";

import LogoIcon from "../assets/icons";
import { useSOARDispatch, useSOARState } from "../store";
import { MEMBER_PRIMARY_ITEMS, MEMBER_SECONDARY_ITEMS } from "./nav.config";
import Logo from "../components/Logo";

const SECONDARY_LABELS = new Set(["Vision Board", "Monthly Letter", "Forum"]);
const TERTIARY_LABELS = new Set(["About", "Donate"]);

const secondaryItems = MEMBER_SECONDARY_ITEMS.filter((item) =>
  SECONDARY_LABELS.has(item.label),
);

const tertiaryItems = MEMBER_SECONDARY_ITEMS.filter((item) =>
  TERTIARY_LABELS.has(item.label),
);

export const AppSidebar = () => {
  const { user } = useSOARState();
  const dispatch = useSOARDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch({ type: "SIGN_OUT" });
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-brand text-cream md:flex">
      <div className="flex h-full min-h-0 flex-col px-4 py-5">
        <NavLink
          to="/dashboard"
          aria-label="Go to dashboard"
          className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-cream/8"
        >
          <Logo className="size-18" />
        </NavLink>

        <nav aria-label="App navigation" className="mt-8 min-h-0 flex-1">
          <SidebarSection items={MEMBER_PRIMARY_ITEMS} />
          <SidebarDivider />
          <SidebarSection items={secondaryItems} secondary />
          <SidebarDivider />
          <SidebarSection items={tertiaryItems} tertiary />
        </nav>

        <div className="border-t border-cream/12 pt-4">
          <NavLink
            to="/account"
            className="flex items-center gap-3 rounded-2xl p-3 hover:bg-cream/7"
          >
            <UserAvatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-ui text-sm leading-none text-cream">
                {user?.fullName || "SOAR peer"}
              </p>
              <p className="mt-1 truncate font-body text-xs text-cream/52">
                {user?.email}
              </p>
            </div>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

const SidebarSection = ({ items, secondary = false, tertiary = false }) => (
  <ul className="space-y-1" role="list">
    {items.map((item) => (
      <li key={item.to}>
        <SidebarNavItem item={item} secondary={secondary} tertiary={tertiary} />
      </li>
    ))}
  </ul>
);

const SidebarNavItem = ({ item, secondary, tertiary }) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      [
        "group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 font-ui tracking-[0.04em] transition",
        tertiary ? "text-xs" : "text-sm",
        isActive
          ? "bg-cream/10 text-accent"
          : tertiary
            ? "text-cream/42 hover:bg-cream/7 hover:text-cream/72"
            : secondary
              ? "text-cream/58 hover:bg-cream/7 hover:text-cream"
              : "text-cream/72 hover:bg-cream/7 hover:text-cream",
      ].join(" ")
    }
  >
    {({ isActive }) => (
      <>
        <span
          aria-hidden="true"
          className={`absolute left-0 top-2 h-7 w-1 rounded-r-full bg-accent transition ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />
        <img
          src={item.icon}
          alt=""
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 transition ${
            isActive
              ? "opacity-100"
              : tertiary
                ? "opacity-38 group-hover:opacity-70"
                : "opacity-58 group-hover:opacity-90"
          }`}
        />
        <span className="truncate">{item.label}</span>
      </>
    )}
  </NavLink>
);

const SidebarDivider = () => (
  <div aria-hidden="true" className="my-4 h-px bg-cream/12" />
);

const UserAvatar = ({ user }) => {
  if (user?.avatarImage) {
    return (
      <img
        src={user.avatarImage}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full border border-cream/18 object-cover"
      />
    );
  }

  const initials = getInitials(user?.fullName);

  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/18 bg-accent/18"
    >
      <span className="font-ui text-sm tracking-[0.08em] text-accent">
        {initials}
      </span>
    </div>
  );
};

const getInitials = (fullName) => {
  if (!fullName) return "?";
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};
