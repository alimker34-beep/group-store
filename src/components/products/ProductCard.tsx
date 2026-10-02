import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MOTION, TRANSITION } from "../../shared/motion";

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
  inCart?: boolean;
  onFavorite?: (product: Product) => void;
  onSelect?: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  onRemoveFromCart?: (product: Product) => void;
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

export function ProductCard({
  product,
  favorite = false,
  inCart = false,
  onFavorite,
  onSelect,
  onQuickAdd,
  onRemoveFromCart,
  priority = false,
}: ProductCardProps) {
  const [burst, setBurst] = useState(false);
  const [added, setAdded] = useState(false);
  const [favPulse, setFavPulse] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(favorite);
  const burstTimer = useRef<number | null>(null);
  const addedTimer = useRef<number | null>(null);
  const favTimer = useRef<number | null>(null);

  useEffect(() => {
    setLocalFavorite(favorite);
  }, [favorite]);

  useEffect(() => {
    return () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
      if (addedTimer.current) window.clearTimeout(addedTimer.current);
      if (favTimer.current) window.clearTimeout(favTimer.current);
    };
  }, []);

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (added) return;

    setAdded(true);
    setBurst(true);
    onQuickAdd?.(product);

    burstTimer.current = window.setTimeout(() => setBurst(false), 650);
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
    <article
      className="group min-w-0 transform-gpu transition-transform duration-[var(--motion-fast)] ease-[var(--ease-emphasized)]"
      // small hover translate using transform (GPU compositing)
      onMouseEnter={() => {}}
      // no JS-side motion needed for hover; CSS handles it
    >
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
            loading={priority ? "eager" : "lazy"}
            decoding="async"
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
            whileTap={{ scale: 0.94 }}
            animate={favPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={TRANSITION.fast}
            className={[
              "relative flex size-8 items-center justify-center rounded-full",
              "border-0 bg-[color:var(--theme-surface)]/85 backdrop-blur-md",
              "shadow-[var(--shadow-xs)]",
              "text-[color:var(--theme-text)]",
              "transition-colors duration-[var(--motion-normal)]",
              "ease-[var(--ease-emphasized)]",
              "hover:bg-[color:var(--theme-surface)]",
            ].join(" ")}
          >
            <span className="">
              <HeartIcon filled={localFavorite || favPulse} />
            </span>

            {/* Ping ring on pulse */}
            {favPulse ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[color:var(--theme-text)]/30 animate-[ping_600ms_ease-out]"
              />
            ) : null}
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
              "backdrop-blur-[2px]",
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
            <motion.button
              type="button"
              aria-label={`إضافة ${product.name} للسلة`}
              aria-pressed={added}
              onClick={handleQuickAdd}
              whileTap={{ scale: 0.94 }}
              transition={TRANSITION.fast}
              className={[
                "pointer-events-auto absolute bottom-2 right-2",
                "flex size-9 items-center justify-center rounded-full",
                "shadow-[var(--shadow-sm)]",
                "transition-colors duration-[var(--motion-normal)]",
                "ease-[var(--ease-emphasized)]",
                added
                  ? "bg-[color:var(--theme-surface)] text-[color:var(--theme-text)] border border-[color:var(--theme-border-strong)]"
                  : "bg-[color:var(--theme-primary)] text-[color:var(--theme-text-inverse)] border border-transparent",
              ].join(" ")}
            >
              {/* Burst ring */}
              {burst ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-[color:var(--theme-text)]/25 animate-[ping_600ms_ease-out]"
                />
              ) : null}

              {/* Check */}
              <span
                className={[
                  "absolute transition-all duration-[var(--motion-normal)]",
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
                  "absolute transition-all duration-[var(--motion-normal)]",
                  added
                    ? "scale-50 opacity-0 rotate-90"
                    : "scale-100 opacity-100 rotate-0",
                ].join(" ")}
              >
                <PlusIcon />
              </span>
            </motion.button>
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
}


/* =========================================================
   RESPONSIVE IMAGE
   مكوّن صورة محسّن للاستخدام داخل البطاقات
   ========================================================= */

interface ResponsiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  className,
  loading = "lazy",
  decoding = "async",
  priority,
  ...rest
}: ResponsiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      draggable={false}
      className={className}
      {...rest}
    />
  );
  }
