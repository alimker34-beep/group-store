import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { MOTION } from "../../shared/motion";
import type { Product, ProductOption } from "./ProductCard";

interface ProductDetailsSheetProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (
    product: Product,
    selections: Record<string, string>,
  ) => void;
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4-5.6 2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

export function ProductDetailsSheet({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailsSheetProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  /**
   * كل ما يفتح المنتج، نهيّئ selections بقيم افتراضية:
   * - select / color / text  → أول قيمة
   * - quantity               → "1"
   */
  useEffect(() => {
    if (!product) return;

    const defaults: Record<string, string> = {};

    (product.options ?? []).forEach((option) => {
      if (option.type === "quantity") {
        defaults[option.id] = "1";
      } else if (option.values.length > 0) {
        defaults[option.id] = option.values[0];
      }
    });

    setSelections(defaults);
  }, [product]);

  useEffect(() => {
    setAdded(false);
  }, [product]);

  const setOption = (id: string, value: string) => {
    setSelections((prev) => ({ ...prev, [id]: value }));
  };

  const options = useMemo<ProductOption[]>(
    () => product?.options ?? [],
    [product],
  );

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

  const gallery = product?.images?.length
    ? product.images
    : product
      ? [product.image]
      : [];

  return (
    <AnimatePresence>
      {open && product ? (
        <motion.div
          key="product-sheet-root"
          className="fixed inset-0 z-[var(--z-modal)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.button
            type="button"
            aria-label="إغلاق تفاصيل المنتج"
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <motion.section
            dir="rtl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.82,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              willChange: "opacity",
            }}
            className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[var(--radius-2xl)] bg-surface shadow-[var(--shadow-xl)] sm:bottom-4 sm:rounded-[var(--radius-2xl)]"
          >
            <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-5">
              <IconButton
                label="إغلاق"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>

              <span className="text-xs font-medium text-muted">
                تفاصيل المنتج
              </span>

              <IconButton
                label="إضافة للمفضلة"
                variant="ghost"
                size="sm"
              >
                <HeartIcon />
              </IconButton>
            </div>

            <div className="overflow-y-auto px-4 pb-28 sm:px-5">
              <div className="flex snap-x gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="aspect-[0.9] w-full shrink-0 snap-center overflow-hidden rounded-[var(--radius-xl)] bg-surface-muted"
                  >
                    <img
                      src={image}
                      alt={index === 0 ? product.name : ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                {/* ============================================
                    العنوان + السعر (صف واحد)
                    ============================================ */}
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                    {product.name}
                  </h2>

                  <span className="shrink-0 text-lg font-semibold text-price">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                {/* ============================================
                    التقييم
                    ============================================ */}
                {product.rating ? (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                    <StarIcon />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                ) : null}

                {/* ============================================
                    الوصف — بكسافة مدروسة تحت العنوان مباشرة
                    ============================================ */}
                {product.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {product.description}
                  </p>
                ) : null}

                {options.length > 0 ? (
                  <div className="mt-6 space-y-6">
                    {options.map((option) => (
                      <OptionField
                        key={option.id}
                        option={option}
                        value={selections[option.id] ?? ""}
                        onChange={(value) => setOption(option.id, value)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 border-t border-border bg-surface/95 p-4 backdrop-blur-xl sm:p-5">
              <Button
                fullWidth
                size="lg"
                onClick={() => {
                  if (added) return;
                  onAddToCart?.(product, selections);
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1500);
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={added ? "added" : "idle"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-flex items-center gap-2"
                  >
                    {added ? "✓ تمت الإضافة" : "إضافة إلى السلة"}
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* =========================================================
   OPTION FIELD — يرسم خيارًا واحدًا حسب نوعه
   ========================================================= */

interface OptionFieldProps {
  option: ProductOption;
  value: string;
  onChange: (value: string) => void;
}

function OptionField({ option, value, onChange }: OptionFieldProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {option.label}
        </span>

        {option.hint ? (
          <span className="text-xs text-muted">{option.hint}</span>
        ) : null}
      </div>

      {option.type === "select" ? (
        <div className="grid grid-cols-4 gap-2">
          {option.values.map((v) => {
            const selected = value === v;

            return (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                className={[
                  "h-11 rounded-[var(--radius-md)] border text-sm font-medium transition-all",
                  selected
                    ? "border-primary bg-primary text-inverse"
                    : "border-border bg-surface text-foreground hover:bg-secondary",
                ].join(" ")}
              >
                {v}
              </button>
            );
          })}
        </div>
      ) : null}

      {option.type === "color" ? (
        <div className="flex flex-wrap items-center gap-2">
          {option.values.map((v) => {
            const selected = value === v;
            const hex = option.colorMap?.[v] ?? v;

            return (
              <button
                key={v}
                type="button"
                aria-label={`لون ${v}`}
                onClick={() => onChange(v)}
                className={[
                  "size-9 rounded-full border-2 p-1 transition-all",
                  selected ? "border-primary" : "border-transparent",
                ].join(" ")}
              >
                <span
                  className="block size-full rounded-full border border-black/10"
                  style={{ backgroundColor: hex }}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {option.type === "quantity" ? (
        <QuantityControl
          value={value || "1"}
          onChange={onChange}
        />
      ) : null}

      {option.type === "text" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={option.hint ?? ""}
          className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />
      ) : null}
    </div>
  );
}

/* =========================================================
   QUANTITY CONTROL
   ========================================================= */

interface QuantityControlProps {
  value: string;
  onChange: (value: string) => void;
}

function QuantityControl({ value, onChange }: QuantityControlProps) {
  const current = Math.max(1, parseInt(value || "1", 10) || 1);

  const dec = () => onChange(String(Math.max(1, current - 1)));
  const inc = () => onChange(String(current + 1));

  return (
    <div className="inline-flex items-center rounded-[var(--radius-md)] border border-border bg-surface">
      <button
        type="button"
        aria-label="تقليل الكمية"
        onClick={dec}
        className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-secondary"
      >
        −
      </button>

      <span className="min-w-10 text-center text-sm font-medium text-foreground">
        {current}
      </span>

      <button
        type="button"
        aria-label="زيادة الكمية"
        onClick={inc}
        className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-secondary"
      >
        +
      </button>
    </div>
  );
}