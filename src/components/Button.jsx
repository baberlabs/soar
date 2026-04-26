import { getButtonClasses } from "./buttonStyles";

export const Button = ({
  type = "button",
  text,
  loadingText,
  status,
  children,
  variant = "primary",
  size = "md",
  fullWidth = true,
  className = "",
  disabled,
  ...props
}) => {
  const label =
    status === "loading" ? (loadingText ?? text) : (text ?? children);
  const isDisabled = Boolean(disabled) || status === "loading";

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={status === "loading" ? "true" : undefined}
      className={getButtonClasses({
        variant,
        size,
        fullWidth,
        className,
      })}
    >
      {label}
    </button>
  );
};
