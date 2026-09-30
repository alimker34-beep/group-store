import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        className={[
          "min-h-11 w-full rounded-[var(--radius-md)]",
          "border bg-surface px-4",
          "text-sm text-foreground",
          "placeholder:text-muted",
          "transition-colors duration-[var(--motion-fast)]",
          "outline-none",
          error
            ? "border-danger focus:border-danger"
            : "border-border focus:border-primary",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-xs text-danger"
        >
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${inputId}-hint`}
          className="mt-2 text-xs text-muted"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}