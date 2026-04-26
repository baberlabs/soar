import { NavIcons } from "../assets/icons";

/** @typedef {{ type: "link", label: string, icon: string, to: string }} NavLink */
/** @typedef {{ type: "separator", id: string }} NavSeparator */
/** @typedef {NavLink | NavSeparator} NavItem */

/**
 * The four core platform destinations — always visible in the primary nav
 * on both desktop and mobile.
 *
 * @type {NavLink[]}
 */
export const MEMBER_PRIMARY_ITEMS = [
  {
    type: "link",
    label: "Dashboard",
    icon: NavIcons.dashboard,
    to: "/dashboard",
  },
  { type: "link", label: "Learn", icon: NavIcons.learn, to: "/learn" },
  { type: "link", label: "Create", icon: NavIcons.create, to: "/create" },
  { type: "link", label: "Connect", icon: NavIcons.connect, to: "/connect" },
];

/**
 * Supporting destinations — accessible via the "More" dropdown on desktop
 * and a clearly labelled secondary section in the mobile drawer.
 *
 * @type {NavLink[]}
 */
export const MEMBER_SECONDARY_ITEMS = [
  {
    type: "link",
    label: "Vision Board",
    icon: NavIcons.visionBoard,
    to: "/vision-board",
  },
  {
    type: "link",
    label: "Monthly Letter",
    icon: NavIcons.monthlyLetter,
    to: "/monthly-letter",
  },
  { type: "link", label: "Forum", icon: NavIcons.feedback, to: "/forum" },
  { type: "link", label: "About", icon: NavIcons.about, to: "/about" },
  { type: "link", label: "Donate", icon: NavIcons.donate, to: "/donate" },
  { type: "link", label: "Account", icon: NavIcons.account, to: "/account" },
];

/**
 * Public (unauthenticated) nav. Kept flat — only five items, no overflow needed.
 *
 * @type {NavItem[]}
 */
export const PUBLIC_NAV_ITEMS = [
  { type: "link", label: "Home", icon: NavIcons.home, to: "/" },
  { type: "link", label: "About", icon: NavIcons.about, to: "/about" },
  { type: "link", label: "Donate", icon: NavIcons.donate, to: "/donate" },
  { type: "separator", id: "sep-0" },
  { type: "link", label: "Join", icon: NavIcons.account, to: "/join" },
  { type: "link", label: "Log In", icon: NavIcons.feedback, to: "/login" },
];

// Backward-compatible flat list — used by any legacy import.
export const MEMBER_NAV_ITEMS = [
  ...MEMBER_PRIMARY_ITEMS,
  ...MEMBER_SECONDARY_ITEMS,
];

export const NAV_ITEMS = MEMBER_NAV_ITEMS;
