// All month values are stored as "YYYY-MM" strings throughout the app.

export const getCurrentMonthValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const getNextMonthValue = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
};

export const formatMonthLabel = (monthValue) => {
  if (!monthValue) return "Current Month";

  const [year, month] = monthValue.split("-");
  if (!year || !month) {
    const parsed = new Date(`${monthValue} 1`);
    if (Number.isNaN(parsed.getTime())) return "Current Month";
    return parsed.toLocaleString("en-GB", { month: "long", year: "numeric" });
  }

  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return "Current Month";

  return date.toLocaleString("en-GB", { month: "long", year: "numeric" });
};

export const formatMonthShort = (monthValue) => {
  const [year, month] = (monthValue || "").split("-");
  if (!year || !month) return "???";

  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return "???";

  return date.toLocaleString("en-GB", { month: "short" });
};

// Robust month parser — handles both "YYYY-MM" input strings and legacy
// "May 2026" labels that older data might contain.
export const toMonthInputValue = (maybeLabel, fallbackIso) => {
  const fallback = getCurrentMonthValue();

  if (!maybeLabel) {
    return fallbackIso ? isoDateToMonth(fallbackIso) : fallback;
  }

  if (/^\d{4}-\d{2}$/.test(maybeLabel)) {
    return maybeLabel;
  }

  const parsed = new Date(`${maybeLabel} 1`);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  }

  return fallbackIso ? isoDateToMonth(fallbackIso) : fallback;
};

export const isoDateToMonth = (isoValue) => {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return getCurrentMonthValue();
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

export const monthToDate = (monthValue) => {
  const [year, month] = (monthValue || "").split("-");
  if (!year || !month) return null;

  const date = new Date(Number(year), Number(month) - 1, 1);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isMonthUnlocked = (monthValue) => {
  const target = monthToDate(monthValue);
  if (!target) return true;

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return target.getTime() <= currentMonthStart.getTime();
};

export const daysUntilMonth = (monthValue) => {
  const target = monthToDate(monthValue);
  if (!target) return 0;

  const delta = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(delta / (1000 * 60 * 60 * 24)));
};

// Generate a list of months for the custom picker (from N months ago to N months ahead)
export const generateMonthOptions = (pastMonths = 12, futureMonths = 12) => {
  const now = new Date();
  const options = [];

  for (let offset = -pastMonths; offset <= futureMonths; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    options.push({ value, label: formatMonthLabel(value) });
  }

  return options;
};
