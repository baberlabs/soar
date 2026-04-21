/**
 * Export the full SOAR state as a downloadable JSON file, and parse an
 * imported JSON file back into a store object for restoration.
 *
 * Storage-key awareness: this utility doesn't know the key — callers pass
 * the value. Keeps the helpers pure and testable.
 */

export const downloadJSON = (data, filenameHint = "soar-export") => {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${filenameHint}-${stamp}.json`;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
};

export const readJSONFile = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result ?? "")));
      } catch {
        reject(new Error("That file isn't valid JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read the file"));
    reader.readAsText(file);
  });

/**
 * Approx byte size of the current serialized state. Used by the Data tab to
 * show how much space is being used in localStorage.
 */
export const estimateStoreBytes = (store) => {
  try {
    return new Blob([JSON.stringify(store)]).size;
  } catch {
    return 0;
  }
};
