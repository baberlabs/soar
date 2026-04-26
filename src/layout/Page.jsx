import { Fragment, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const ROUTE_LABELS = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/learn": "Learn",
  "/create": "Create",
  "/connect": "Connect",
  "/vision-board": "Vision Board",
  "/monthly-letter": "Monthly Letter",
  "/forum": "Forum",
  "/account": "Account",
  "/about": "About",
  "/donate": "Donate",
};

const SEGMENT_LABELS = {
  all: "All",
  chats: "Chats",
  closed: "Closed",
  data: "Data",
  drafts: "Drafts",
  edit: "Edit",
  profile: "Profile",
  sessions: "Sessions",
  voting: "Voting",
};

const NON_NAVIGABLE_SEGMENTS = ["sessions"];

const normalizePath = (path) => {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "");
};

const formatSegment = (segment) => {
  const decoded = decodeURIComponent(segment);
  return decoded
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getCrumbLabel = ({ path, segment, labels }) => {
  return (
    labels?.[path] ??
    labels?.[segment] ??
    ROUTE_LABELS[path] ??
    SEGMENT_LABELS[segment] ??
    formatSegment(segment)
  );
};

const buildBreadcrumbs = ({ pathname, labels, rootLabel, rootTo }) => {
  const normalizedPath = normalizePath(pathname);
  const normalizedRoot = normalizePath(rootTo);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments.length === 0 || normalizedPath === normalizedRoot) {
    return [{ label: rootLabel, to: rootTo, current: true }];
  }

  const crumbs = [{ label: rootLabel, to: rootTo, current: false }];
  let path = "";

  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const isCurrent = index === segments.length - 1;

    if (path === normalizedRoot) return;

    const isNavigable = !NON_NAVIGABLE_SEGMENTS.includes(segment);

    crumbs.push({
      label: getCrumbLabel({ path, segment, labels }),
      to: isNavigable ? path : undefined,
      current: isCurrent,
    });
  });

  return crumbs;
};

const normalizeManualBreadcrumbs = (breadcrumbs) =>
  breadcrumbs.map((breadcrumb, index) => ({
    ...breadcrumb,
    current: breadcrumb.current ?? index === breadcrumbs.length - 1,
  }));

export default function Page({
  children,
  heading,
  eyebrow,
  description,
  actions,
  breadcrumbs,
  breadcrumbLabels,
  rootLabel = "Dashboard",
  rootTo = "/dashboard",
  className = "",
  contentClassName = "",
}) {
  const { pathname } = useLocation();

  const resolvedBreadcrumbs = useMemo(() => {
    if (breadcrumbs?.length) {
      return normalizeManualBreadcrumbs(breadcrumbs);
    }

    return buildBreadcrumbs({
      pathname,
      labels: breadcrumbLabels,
      rootLabel,
      rootTo,
    });
  }, [breadcrumbs, breadcrumbLabels, pathname, rootLabel, rootTo]);

  const pageTitle =
    heading ??
    resolvedBreadcrumbs.at(-1)?.label ??
    ROUTE_LABELS[pathname] ??
    "Page";

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-brand/12 bg-page/92 backdrop-blur-md">
        <div className="mx-auto w-full max-w-360 px-6 py-6">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex min-w-0 flex-wrap items-center gap-1.5">
              {resolvedBreadcrumbs.map((breadcrumb, index) => {
                const isLast = index === resolvedBreadcrumbs.length - 1;
                const canNavigate = breadcrumb.to && !breadcrumb.current;

                return (
                  <Fragment
                    key={`${breadcrumb.label}-${breadcrumb.to ?? index}`}
                  >
                    {index > 0 && (
                      <li aria-hidden="true" className="text-brand/40">
                        <ChevronRight className="size-3.5" />
                      </li>
                    )}
                    <li className="min-w-0">
                      {canNavigate ? (
                        <Link
                          to={breadcrumb.to}
                          className="inline-flex max-w-44 items-center rounded-full px-2 py-1 font-body text-xs font-medium text-brand/82 transition hover:bg-brand/8 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                        >
                          <span className="truncate">{breadcrumb.label}</span>
                        </Link>
                      ) : (
                        <span
                          aria-current={isLast ? "page" : undefined}
                          className="inline-flex max-w-56 items-center rounded-full bg-brand/8 px-2 py-1 font-body text-xs font-semibold text-brand"
                        >
                          <span className="truncate">{breadcrumb.label}</span>
                        </span>
                      )}
                    </li>
                  </Fragment>
                );
              })}
            </ol>
          </nav>

          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 space-y-4">
              <h1 className="font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.92] text-brand">
                {pageTitle}
              </h1>
              {description && (
                <p className="max-w-3xl font-body text-sm leading-relaxed text-brand/82 md:text-base">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        className={`mx-auto w-full max-w-360 px-6 pb-24 pt-8 md:pb-8 md:pt-10 ${className}`}
      >
        <div className={contentClassName}>{children}</div>
      </main>
    </>
  );
}
