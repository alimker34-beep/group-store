import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TRANSITION } from "../../shared/motion";
import ResponsiveImage from "../ui/ResponsiveImage";

export type ProductOptionType = "select" | "color" | "quantity" | "text";

export interface ProductOption {
  id: string;
  label: string;
  type: ProductOptionType;
  values: string[];
  /** للـ color فقط: map من value إلى hex اختياري */
  colorMap?: Record<string, string>;
  /** نص مساعد يظهر أسفل الخيار */
  hint?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  category?: string;
  description?: string;
  images?: string[];
  options?: ProductOption[];
}

interface ProductCardProps {
  product: Product;
  favorite?: boolean;
  onFavorite?: (product: Product) => void;
  onSelect?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  priority?: boolean;
}

/* =========================================================
   ICONS
   ========================================================= */

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 overflow-visible"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* =========================================================
   PRICE FORMATTER (placeholder — سيُستبدل بـ shared/formatPrice)
   ========================================================= */

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

/* =========================================================
   PRODUCT CARD
   ========================================================= */

export const ProductCard = memo(function ProductCard({
  product,
  favorite = false,
  onFavorite,
  onSelect,
  onQuickAdd,
  priority = false,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [favPulse, setFavPulse] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(favorite);
  const addedTimer = useRef<number | null>(null);
  const favTimer = useRef<number | null>(null);

  useEffect(() => {
    setLocalFavorite(favorite);
  }, [favorite]);

  useEffect(() => {
    return () => {
      if (addedTimer.current) window.clearTimeout(addedTimer.current);
      if (favTimer.current) window.clearTimeout(favTimer.current);
    };
  }, []);

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (added) return;

    setAdded(true);
    onQuickAdd?.(product);

    addedTimer.current = window.setTimeout(() => setAdded(false), 1200);
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();

    const next = !localFavorite;
    setLocalFavorite(next);
    setFavPulse(true);
    onFavorite?.(product);

    if (favTimer.current) window.clearTimeout(favTimer.current);
    favTimer.current = window.setTimeout(() => setFavPulse(false), 700);
  };

  const hasDiscount =
    product.originalPrice !== undefined &&
    product.originalPrice > product.price;

  return (
    <article className="group min-w-0" tabIndex={0}>
      {/* =====================================================
          MEDIA FRAME
          صورة تملأ الكرت بالكامل، بدون padding أو حواف داخلية
          ===================================================== */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`عرض تفاصيل ${product.name}`}
        onClick={() => onSelect?.(product)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(product);
          }
        }}
        className={[
          "relative cursor-pointer overflow-hidden rounded-[var(--radius-lg)]",
          "bg-surface-muted",
          "group-hover:shadow-[var(--shadow-md)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        ].join(" ")}
      >
        {/* ---------------------------------------------------
            IMAGE — تملأ الإطار بالكامل
            --------------------------------------------------- */}
        <div className="relative aspect-[0.85] w-full overflow-hidden">
          <ResponsiveImage
            src={product.image}
            alt={product.name}
            priority={priority}
            decoding="async"
            loading={priority ? "eager" : "lazy"}
            className={[
              "absolute inset-0 h-full w-full object-cover object-center",
              "transition-transform duration-[var(--motion-normal)]",
              "ease-[var(--ease-emphasized)]",
              "group-hover:scale-[1.035]",
            ].join(" ")}
          />

          {/* Subtle gradient overlay for icons legibility */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/15 to-transparent opacity-70"
          />
        </div>

        {/* ---------------------------------------------------
            FAVORITE (top-left)
            قلب يبقى ممتلئًا، ويرجع للفراغ عند النقر مرة أخرى
            --------------------------------------------------- */}
        <div className="absolute left-2 top-2 z-20">
          <motion.button
            type="button"
            aria-label={
              localFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"
            }
            aria-pressed={localFavorite}
            onClick={handleFavorite}
            animate={favPulse ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={TRANSITION.fast}
            className={[
              "relative flex size-8 items-center justify-center rounded-full",
              "border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/90",
              "shadow-[var(--shadow-xs)]",
              "text-[color:var(--theme-text)]",
              "transition-colors duration-[var(--motion-normal)]",
              "ease-[var(--ease-emphasized)]",
              "hover:bg-[color:var(--theme-surface)] active:scale-[0.94]",
            ].join(" ")}
          >
            <span className="">
              <HeartIcon filled={localFavorite || favPulse} />
            </span>
          </motion.button>
        </div>

        {/* ---------------------------------------------------
            QUICK ADD — CARVED SPIRAL NOTCH
            الانحناء الحلزوني الناعم + لون يتدرج من خلفية الكرت
            --------------------------------------------------- */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20">
          {/* الحلقة الخارجية: قوس ناعم + تدرج لوني خفيف */}
          <div
            className={[
              "relative",
              "w-[68px] h-[68px]",
              "rounded-tl-[68px]",
              "bg-[linear-gradient(135deg,transparent_35%,color-mix(in_srgb,var(--theme-background)_85%,transparent)_65%,var(--theme-background)_100%)]",
            ].join(" ")}
          >
            {/* الطبقة الداخلية: تتلاشى تدريجيًا نحو لون الصفحة */}
            <div
              aria-hidden
              className={[
                "absolute inset-0 rounded-tl-[68px]",
                "bg-[radial-gradient(circle_at_bottom_right,var(--theme-background)_0%,color-mix(in_srgb,var(--theme-background)_70%,transparent)_55%,transparent_75%)]",
              ].join(" ")}
            />

            {/* زر الإضافة داخل الحلزون */}
            <button
              type="button"
              aria-label={`إضافة ${product.name} للسلة`}
              aria-pressed={added}
              onClick={handleQuickAdd}
              className={[
                "pointer-events-auto absolute bottom-2 right-2",
                "flex size-9 items-center justify-center rounded-full",
                "shadow-[var(--shadow-sm)] active:scale-[0.94]",
                "transition-colors duration-[var(--motion-normal)]",
                "ease-[var(--ease-emphasized)]",
                added
                  ? "bg-[color:var(--theme-surface)] text-[color:var(--theme-text)] border border-[color:var(--theme-border-strong)]"
                  : "bg-[color:var(--theme-primary)] text-[color:var(--theme-text-inverse)] border border-transparent",
              ].join(" ")}
            >
              {/* Check */}
              <span
                className={[
                  "absolute transition-[transform,opacity] duration-[var(--motion-normal)]",
                  added
                    ? "scale-100 opacity-100 rotate-0"
                    : "scale-50 opacity-0 -rotate-90",
                ].join(" ")}
              >
                <CheckIcon />
              </span>

              {/* Plus */}
              <span
                className={[
                  "absolute transition-[transform,opacity] duration-[var(--motion-normal)]",
                  added
                    ? "scale-50 opacity-0 rotate-90"
                    : "scale-100 opacity-100 rotate-0",
                ].join(" ")}
              >
                <PlusIcon />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          META (below image)
          ===================================================== */}
      <button
        type="button"
        onClick={() => onSelect?.(product)}
        className="mt-3 block w-full text-left"
      >
        <h3 className="truncate text-sm font-medium text-foreground">
          {product.name}
        </h3>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="text-sm font-semibold text-price">
              {formatPrice(product.price)}
            </span>

            {hasDiscount ? (
              <span className="truncate text-[11px] text-muted line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            ) : null}
          </div>

          {product.rating ? (
            <span
              className="flex shrink-0 items-center text-muted"
              aria-label="تقييم المنتج"
            >
              <StarIcon />
            </span>
          ) : null}
        </div>
      </button>
    </article>
  );
});
