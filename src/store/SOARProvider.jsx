import { useSOARHydrated } from "./selectors";

export function SOARProvider({ children, fallback = null }) {
  const hasHydrated = useSOARHydrated();

  if (!hasHydrated) {
    return fallback;
  }

  return children;
}
