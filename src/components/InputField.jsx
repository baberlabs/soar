import { useId } from "react";

export const InputField = ({
  label,
  type = "text",
  name,
  placeholder,
  onValueChange,
  onChange,
  value,
  autoComplete = "off", // Default to off to help suppress warnings
  required = true,
  className = "",
  error,
  ...props
}) => {
  const generatedId = useId();
  const inputId = name ?? generatedId;

  const handleChange = (e) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };

  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="font-body text-navy/60">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
        className={`w-full rounded-2xl border bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:ring-2 focus:ring-brand/15 ${
          error
            ? "border-rose-500 focus:border-rose-500"
            : "border-black/15 focus:border-brand"
        } ${className}`}
      />
      {/* Inline Error Message */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-body text-xs text-rose-600 mt-0.5"
        >
          {error}
        </p>
      )}
    </div>
  );
};
