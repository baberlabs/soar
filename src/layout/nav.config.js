import { NavIcons } from "../assets/icons";

/** @typedef {{ type: "link", label: string, icon: string, to: string }} NavLink */
/** @typedef {{ type: "separator", id: string }} NavSeparator */
/** @typedef {NavLink | NavSeparator} NavItem */

/** @type {NavItem[]} */
export const PUBLIC_NAV_ITEMS = [
  { type: "link", label: "Home", icon: NavIcons.home, to: "/" },
  { type: "link", label: "About", icon: NavIcons.about, to: "/about" },
  { type: "separator", id: "sep-0" },
  { type: "link", label: "Join", icon: NavIcons.account, to: "/join" },
  { type: "link", label: "Log In", icon: NavIcons.feedback, to: "/login" },
];

/** @type {NavItem[]} */
export const MEMBER_NAV_ITEMS = [
  { type: "link", label: "Home", icon: NavIcons.home, to: "/" },
  { type: "link", label: "About", icon: NavIcons.about, to: "/about" },
  { type: "link", label: "Forum", icon: NavIcons.feedback, to: "/forum" },
  { type: "separator", id: "sep-1" },
  { type: "link", label: "Learn", icon: NavIcons.learn, to: "/learn" },
  { type: "link", label: "Create", icon: NavIcons.create, to: "/create" },
  { type: "link", label: "Reflect", icon: NavIcons.reflect, to: "/reflect" },
  { type: "link", label: "Connect", icon: NavIcons.connect, to: "/connect" },
  { type: "separator", id: "sep-2" },
  { type: "link", label: "Account", icon: NavIcons.account, to: "/account" },
];

// Backward-compatible export used by older imports.
export const NAV_ITEMS = MEMBER_NAV_ITEMS;
