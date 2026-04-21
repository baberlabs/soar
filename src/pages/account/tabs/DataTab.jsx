import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSOARState } from "../../../hooks/useSOARState";
import { SectionCard } from "../components/shared/SectionCard";
import { DataPanels } from "../components/data/DataPanels";

/**
 * Data tab. Export / import / reset for the user's local store.
 *
 * Import: replaces the entire localStorage snapshot. Simplest reliable
 * approach is to write the JSON directly and reload — avoids needing a
 * matching LOAD_STORE reducer action. The reducer already reads from
 * localStorage on init, so a reload picks up the imported data.
 *
 * Reset: dispatches RESET_DEVICE_DATA then navigates to /login since the
 * current user has just ceased to exist.
 */
const STORAGE_KEY = "soar_state";

export default function DataTab() {
  const [state, dispatch] = useSOARState();
  const navigate = useNavigate();

  // `state` from useSOARState is the derived view. For export + storage sizing
  // we want the actual persisted blob. Reading it from localStorage gives us
  // exactly what would be imported back.
  const getRawStore = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : state;
    } catch {
      return state;
    }
  };

  const handleImport = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Reload so the reducer re-initialises from the imported state.
      window.location.reload();
    } catch (error) {
      console.error("Failed to import:", error);
    }
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_DEVICE_DATA" });
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  return (
    <section
      id="account-panel-data"
      role="tabpanel"
      aria-labelledby="account-tab-data"
      className="space-y-6"
    >
      <SectionCard
        title="Data"
        description="Export, restore, or wipe everything stored on this device."
      >
        <DataPanels
          store={getRawStore()}
          onImport={handleImport}
          onReset={handleReset}
        />
      </SectionCard>
    </section>
  );
}
