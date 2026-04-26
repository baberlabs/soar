import { useEffect, useRef } from "react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  size = "md",
  dismissOnOverlay = true,
}) => {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Focus management.
  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;

    // Focus the first focusable element inside the dialog.
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = dialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length) {
        focusables[0].focus();
      } else {
        dialog.focus();
      }
    }

    return () => {
      // Restore focus.
      const previous = previouslyFocusedRef.current;
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [isOpen]);

  // Escape + focus trap.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusables = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const widthClass =
    size === "lg" ? "max-w-4xl" : size === "sm" ? "max-w-md" : "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      aria-hidden="false"
    >
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={dismissOnOverlay ? onClose : undefined}
        className="absolute inset-0 cursor-default bg-navy/70 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        className={`relative z-10 w-full ${widthClass} max-h-full overflow-y-auto rounded-3xl border border-brand/10 bg-page p-4 shadow-[0_30px_60px_rgba(75,81,149,0.25)] sm:p-6 vision-library-scrollbar`}
      >
        {title ? (
          <h2 className="mb-4 font-ui text-2xl text-brand">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
};
