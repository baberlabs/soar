export const fileToDataURL = (
  file,
  { maxBytes, acceptedMimePrefix = "" } = {},
) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided."));
      return;
    }

    if (
      acceptedMimePrefix &&
      !String(file.type || "").startsWith(acceptedMimePrefix)
    ) {
      reject(new Error("Please upload a valid image file."));
      return;
    }

    if (typeof maxBytes === "number" && file.size > maxBytes) {
      reject(new Error("Image is too large. Please choose a smaller file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export const toExternalUrl = (url) => {
  const normalized = String(url || "").trim();
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `https://${normalized}`;
};
