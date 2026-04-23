/**
 * Voting window presets offered when an author opens voting.
 * Custom option lets the author pick an exact deadline date.
 */
export const VOTING_PRESETS = [
  { id: "3d", label: "3 days", days: 3 },
  { id: "7d", label: "7 days", days: 7 },
  { id: "14d", label: "14 days", days: 14 },
];

/**
 * Given a preset ID, return the resulting ISO deadline.
 * Deadline is end-of-day UTC on the Nth day out, so peers across
 * timezones see a consistent close time.
 */
export const presetToDeadline = (presetId) => {
  const preset = VOTING_PRESETS.find((p) => p.id === presetId);
  if (!preset) return null;
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + preset.days);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
};

/**
 * Given a YYYY-MM-DD string (from an <input type="date">), return the
 * corresponding end-of-day ISO deadline.
 */
export const dateInputToDeadline = (dateString) => {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

/**
 * Countdown formatter. Returns the time until deadline in a friendly
 * form: "2 days", "4 hours", "23 minutes", "1 minute", "Ended".
 */
export const formatCountdown = (deadline) => {
  if (!deadline) return "";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Ended";

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Under a minute";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
};

/**
 * Absolute deadline formatter — shows the date and local time.
 * Used alongside the countdown so peers can see the wall-clock close.
 */
export const formatDeadline = (deadline) => {
  if (!deadline) return "";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Returns the YYYY-MM-DD value three days from today, used as the
 * minimum for the custom date picker (prevents zero-day voting windows).
 */
export const getMinCustomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};
