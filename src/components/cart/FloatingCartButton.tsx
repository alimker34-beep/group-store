interface FloatingCartButtonProps {
  visible: boolean;
  count: number;
  onClick: () => void;
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h2l2.1 10.2a2 2 0 0 0 2 1.6h6.8a2 2 0 0 0 2-1.6L20 8H7" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

export function FloatingCartButton({
  visible,
  count,
  onClick,
}: FloatingCartButtonProps) {
  return (
    <div
      dir="rtl"
      aria-hidden={!visible}
      className={[
        "fixed bottom-4 left-3 z-[var(--z-sticky)] md:hidden",
        "pointer-events-none",
        "transition-all duration-[var(--motion-slow)]",
        "ease-[var(--ease-emphasized)]",
        visible
          ? "translate-y-0 opacity-100 blur-0 scale-100"
          : "translate-y-4 opacity-0 blur-sm scale-90",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label={`عرض السلة (${count})`}
        onClick={onClick}
        className={[
          "pointer-events-auto relative",
          "flex h-16 min-w-[80px] items-center justify-center gap-2",
          "rounded-full bg-neutral-900/85 px-5",
          "text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
          "ring-1 ring-white/20 backdrop-blur-2xl",
          "transition-transform duration-[var(--motion-normal)]",
          "ease-[var(--ease-emphasized)]",
          "hover:bg-neutral-900/95 active:scale-95",
        ].join(" ")}
      >
        <CartIcon />

        {count > 0 ? (
          <span
            className={[
              "flex min-w-6 h-6 items-center justify-center",
              "rounded-full bg-white px-1.5",
              "text-[11px] font-bold text-neutral-900",
            ].join(" ")}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
    </div>
  );
}