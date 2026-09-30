import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <button
        type="button"
        aria-label="إغلاق النافذة"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className={[
          "relative w-full bg-surface",
          "rounded-t-[var(--radius-2xl)] sm:rounded-[var(--radius-2xl)]",
          "p-5 sm:p-6",
          "shadow-[var(--shadow-xl)]",
          "animate-in fade-in slide-in-from-bottom-3 duration-200",
          sizeClasses[size],
        ].join(" ")}
      >
        {title ? (
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-secondary hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}