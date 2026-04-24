import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSOARDispatch,
  useSOARRawStore,
  useSOARReplaceStore,
} from "../../../store";
import { SectionCard } from "../components/shared/SectionCard";
import { DataPanels } from "../components/data/DataPanels";

export default function DataTab() {
  const dispatch = useSOARDispatch();
  const rawStore = useSOARRawStore();
  const replaceStore = useSOARReplaceStore();
  const navigate = useNavigate();

  const handleImport = useCallback(
    (data) => {
      try {
        replaceStore(data);
      } catch (error) {
        console.error("Failed to import:", error);
      }
    },
    [replaceStore],
  );

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
          store={rawStore}
          onImport={handleImport}
          onReset={handleReset}
        />
      </SectionCard>
    </section>
  );
}
