import { useId } from "react";

export const InputField = ({
  label,
  type = "text",
  name,
  placeholder,
  onValueChange,
  onChange,
  value,
  autoComplete,
  required = true,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = name ?? generatedId;

  const handleChange = (e) => {
    onValueChange?.(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="font-body text-navy/60">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        name={name}
        autoComplete={autoComplete ?? type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        {...props}
        className={`w-full rounded-2xl border border-black/15 bg-cream px-4 py-3 font-body text-base text-navy outline-none placeholder:text-navy/35 transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/15 ${className}`}
      />
    </div>
  );
};
