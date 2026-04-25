const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB

export const fileToAvatarDataURL = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }
    if (!file.type.startsWith("image/")) {
      reject(new Error("That file isn't an image"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      reject(new Error("Image is larger than 2 MB"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read the image"));
    reader.readAsDataURL(file);
  });

/**
 * Generate initials from a full name. Takes up to two parts.
 */
export const getInitials = (fullName) => {
  if (!fullName) return "?";
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

/**
 * Deterministic tint for the fallback initials avatar — same user, same tint.
 * Picks from our theme palette rather than a free color space so fallbacks
 * feel on-brand.
 */
const AVATAR_TINTS = [
  { bg: "bg-sky/40", text: "text-brand" },
  { bg: "bg-yellow/50", text: "text-brand" },
  { bg: "bg-sage/25", text: "text-sage" },
  { bg: "bg-lavender/40", text: "text-brand" },
  { bg: "bg-brand/15", text: "text-brand" },
];

export const getAvatarTint = (seed) => {
  if (!seed) return AVATAR_TINTS[0];
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h + seed.charCodeAt(i)) | 0;
  return AVATAR_TINTS[Math.abs(h) % AVATAR_TINTS.length];
};
