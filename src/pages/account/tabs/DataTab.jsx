import { useCallback, useState } from "react";
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
  const [importError, setImportError] = useState("");

  const handleImport = useCallback(
    (data) => {
      try {
        replaceStore(data);
        setImportError("");
        return true;
      } catch {
        setImportError(
          "Import failed. The file may be corrupted or from a different version.",
        );
        return false;
      }
    },
    [replaceStore],
  );

  const clearImportError = useCallback(() => {
    setImportError("");
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
          store={rawStore}
          importError={importError}
          onImport={handleImport}
          onImportStart={clearImportError}
          onReset={handleReset}
        />
      </SectionCard>
    </section>
  );
}
