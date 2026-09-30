import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "default" | "primary" | "ghost";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    "bg-surface text-foreground border border-border hover:bg-secondary",
  primary:
    "bg-primary text-inverse hover:bg-primary-hover active:bg-primary-active",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary",
};

const sizeClasses = {
  sm: "size-9",
  md: "size-10",
  lg: "size-11",
};

export function IconButton({
  children,
  label,
  variant = "default",
  size = "md",
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "inline-flex shrink-0 items-center justify-center",
        "rounded-full",
        "transition-all duration-[var(--motion-normal)]",
        "ease-[var(--ease-standard)]",
        "active:scale-95",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}