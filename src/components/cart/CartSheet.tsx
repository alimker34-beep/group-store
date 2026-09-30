import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { MOTION, TRANSITION, VARIANTS } from "../../shared/motion";
import type { CartItem } from "./types";

interface CartSheetProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onIncrement: (key: string) => void;
  onDecrement: (key: string) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartSheet({
  open,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: CartSheetProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cart-sheet-root"
          className="fixed inset-0 z-[var(--z-modal)]"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.button
            type="button"
            aria-label="إغلاق السلة"
            onClick={onClose}
            variants={VARIANTS.fadeIn}
            transition={TRANSITION.normal}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          <motion.section
            dir="rtl"
            variants={VARIANTS.sheetUp}
            transition={{ duration: MOTION.smooth, ease: MOTION.ease }}
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[var(--radius-2xl)] bg-surface shadow-[var(--shadow-xl)] sm:bottom-4 sm:rounded-[var(--radius-2xl)]"
          >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <IconButton label="إغلاق" variant="ghost" size="sm" onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <span className="text-sm font-semibold text-foreground">
            سلة التسوق
          </span>

          <span className="min-w-9 text-center text-xs font-medium text-muted">
            {items.length}
          </span>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 py-16">
            <p className="text-sm text-muted">سلتك فارغة حاليًا</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.96 }}
                    transition={{
                      duration: MOTION.normal,
                      ease: MOTION.ease,
                    }}
                  >
                    <CartRow
                      item={item}
                      onIncrement={() => onIncrement(item.key)}
                      onDecrement={() => onDecrement(item.key)}
                      onRemove={() => onRemove(item.key)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 ? (
          <div className="shrink-0 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-xl sm:px-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">المجموع</span>
              <span className="text-lg font-semibold text-price">
                {formatPrice(total)}
              </span>
            </div>

            <Button fullWidth size="lg" onClick={onCheckout}>
              متابعة الطلب
            </Button>
          </div>
        ) : null}
      </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* =========================================================
   CART ROW
   ========================================================= */

interface CartRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

function CartRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartRowProps) {
  const lineTotal = item.product.price * item.quantity;

  const summary = Object.entries(item.selections)
    .filter(([_, v]) => v && v !== "1")
    .map(([_, v]) => v)
    .join(" · ");

  return (
    <article className="relative flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-surface p-3">
      {/* صورة المنتج — عرض فقط */}
      <div className="size-16 shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-surface-muted">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="size-full object-cover"
        />
      </div>

      {/* التفاصيل */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-foreground">
          {item.product.name}
        </h3>

        {summary ? (
          <p className="mt-0.5 truncate text-[11px] text-muted">{summary}</p>
        ) : null}

        <p className="mt-1.5 text-sm font-semibold text-price">
          {formatPrice(lineTotal)}
        </p>
      </div>

      {/* الكمية */}
      <div className="flex shrink-0 items-center rounded-full border border-border bg-surface">
        <button
          type="button"
          aria-label="تقليل الكمية"
          onClick={onDecrement}
          disabled={item.quantity <= 1}
          className="flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          −
        </button>

        <span className="min-w-6 text-center text-xs font-medium text-foreground">
          {item.quantity}
        </span>

        <button
          type="button"
          aria-label="زيادة الكمية"
          onClick={onIncrement}
          className="flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:scale-90"
        >
          +
        </button>
      </div>

      {/* زر الحذف */}
      <button
        type="button"
        aria-label={`حذف ${item.product.name}`}
        onClick={onRemove}
        className="absolute left-3 top-3 flex size-6 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all duration-[var(--motion-normal)] hover:border-danger hover:bg-danger-soft hover:text-danger active:scale-90"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </article>
  );
}