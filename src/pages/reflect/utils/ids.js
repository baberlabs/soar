// Collision-proof ID generation. Prefer crypto.randomUUID where available.
// Falls back to a random + timestamp combo for older environments.
export const createId = (prefix = "id") => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
};
