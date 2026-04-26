import { useEffect, useState } from "react";

export const useScrolled = (threshold = 60) => {
  const [scrolled, setScrolled] = useState(() =>
    typeof window === "undefined" ? false : window.scrollY > threshold,
  );

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [threshold]);

  return scrolled;
};
