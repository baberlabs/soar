import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Reads/writes a single search param that represents an open detail panel.
 * Returns [value, setValue] where setValue(null) clears the param.
 *
 * We write with replace:true so opening/closing a panel doesn't pollute
 * browser history — panels are overlays on the list, not separate pages.
 *
 * Example: const [peerId, setPeerId] = usePanelParam("peerId")
 */
export const usePanelParam = (key) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key);

  const setValue = useCallback(
    (next) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === null || next === undefined || next === "") {
            params.delete(key);
          } else {
            params.set(key, next);
          }
          return params;
        },
        { replace: true },
      );
    },
    [key, setSearchParams],
  );

  return [value, setValue];
};
