import { useMemo } from "react";
import { generateMonthOptions } from "../../utils/month";

/**
 * Custom month picker that renders as a styled <select>. Avoids the
 * browser-inconsistent <input type="month"> widget.
 *
 * Value is always "YYYY-MM".
 */
export const MonthPicker = ({
  id,
  label,
  value,
  onValueChange,
  pastMonths = 12,
  futureMonths = 18,
  required = false,
  className = "",
  disabledValues = [],
}) => {
  const options = useMemo(
    () => generateMonthOptions(pastMonths, futureMonths),
    [pastMonths, futureMonths],
  );

  const selectId =
    id || `month-picker-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  // If the current value isn't in the range, include it explicitly so the
  // select doesn't silently snap to a different month.
  const hasCurrent = options.some((opt) => opt.value === value);
  const disabledSet = useMemo(() => new Set(disabledValues), [disabledValues]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label ? (
        <label htmlFor={selectId} className="font-body text-sm text-brand/70">
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          required={required}
          className="w-full appearance-none rounded-2xl border border-black/15 bg-cream px-4 py-3 pr-10 font-body text-base text-navy outline-none transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          {!hasCurrent && value ? (
            <option value={value} disabled={disabledSet.has(value)}>
              {value}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={disabledSet.has(option.value)}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-ui text-xs text-brand/55"
        >
          ▼
        </span>
      </div>
    </div>
  );
};
