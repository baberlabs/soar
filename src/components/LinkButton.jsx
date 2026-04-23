import { Link } from "react-router-dom";
import { getButtonClasses } from "./buttonStyles";

export const LinkButton = ({
  text,
  href,
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
    <Link
      {...props}
      to={href}
      disabled={isDisabled}
      className={getButtonClasses({
        variant,
        size,
        fullWidth,
        className,
      })}
    >
      {label}
    </Link>
  );
};
