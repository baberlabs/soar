import { useRef, useState } from "react";
import { Button } from "../../../../components/Button";
import { DangerConfirm } from "../shared/DangerConfirm";
import {
  downloadJSON,
  estimateStoreBytes,
  readJSONFile,
} from "../../utils/dataTransfer";
import { formatBytes } from "../../utils/nodeStats";

/**
 * Three stacked cards for the Data tab:
 *   1. Export — download the full local store as JSON
 *   2. Import — load a previously exported JSON file back in
 *   3. Reset  — wipe device data (DangerConfirm gated)
 *
 * Storage usage is rendered at the top of the section so the user knows
 * how much localStorage their account is occupying before they export.
 */
export const DataPanels = ({ store, onImport, onReset }) => {
  const storeBytes = estimateStoreBytes(store);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand/15 bg-page/60 p-4">
        <p className="font-body text-[0.65rem] uppercase tracking-[0.14em] text-brand/50">
          Local storage
        </p>
        <p className="mt-1 font-ui text-2xl leading-none text-brand">
          {formatBytes(storeBytes)}
        </p>
        <p className="mt-1.5 font-body text-xs text-brand/60">
          Everything SOAR knows about you lives on this device.
        </p>
      </div>

      <ExportCard store={store} />
      <ImportCard onImport={onImport} />
      <ResetCard onReset={onReset} />
    </div>
  );
};

const ExportCard = ({ store }) => {
  const [lastFilename, setLastFilename] = useState(null);

  const handleExport = () => {
    const filename = downloadJSON(store, "soar-export");
    setLastFilename(filename);
  };

  return (
    <article className="rounded-2xl border border-brand/15 bg-cream p-5">
      <h3 className="font-ui text-base tracking-[0.03em] text-brand">
        Export
      </h3>
      <p className="mt-1 font-body text-sm text-brand/70">
        Download a JSON snapshot of your profile, curriculum, creations, and
        reflections.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <Button
          type="button"
          variant="primary"
          size="sm"
          fullWidth={false}
          text="Download JSON"
          onClick={handleExport}
        />
        {lastFilename ? (
          <p className="font-body text-xs text-brand/60">
            Saved <span className="font-mono text-brand/80">{lastFilename}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
};

const ImportCard = ({ onImport }) => {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState({ kind: "idle" });

  const openPicker = () => fileInputRef.current?.click();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setStatus({ kind: "loading" });
    try {
      const data = await readJSONFile(file);
      onImport(data);
      setStatus({ kind: "success", filename: file.name });
      setTimeout(() => setStatus({ kind: "idle" }), 2600);
    } catch (error) {
      setStatus({ kind: "error", message: error.message });
    }
  };

  return (
    <article className="rounded-2xl border border-brand/15 bg-cream p-5">
      <h3 className="font-ui text-base tracking-[0.03em] text-brand">
        Import
      </h3>
      <p className="mt-1 font-body text-sm text-brand/70">
        Restore from a JSON export. This replaces everything currently on this
        device.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth={false}
          text={status.kind === "loading" ? "Loading…" : "Choose file"}
          onClick={openPicker}
          disabled={status.kind === "loading"}
        />
        {status.kind === "success" ? (
          <p className="font-body text-xs text-sage">
            Restored from{" "}
            <span className="font-mono text-sage/90">{status.filename}</span>
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p role="alert" className="font-body text-xs text-rose-700">
            {status.message}
          </p>
        ) : null}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFile}
        className="hidden"
      />
    </article>
  );
};

const ResetCard = ({ onReset }) => (
  <DangerConfirm
    title="Reset device data"
    description="Permanently erases your profile, pathways, creations, reflections, and connections on this device. An export first is strongly recommended."
    confirmString="RESET"
    actionLabel="Reset everything"
    onConfirm={onReset}
  />
);
