import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";
import { ProductDetailsSheet } from "../components/products/ProductDetailsSheet";
import type { Product } from "../components/products/ProductCard";
import { MOTION } from "../shared/motion";

interface FavoritesPageProps {
  onNavigate: (path: string) => void;
  cartCount: number;
  favoriteIds: string[];
  onToggleFavorite: (product: Product) => void;
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (
    product: Product,
    selections?: Record<string, string>,
  ) => void;
  onRemoveFromCart: (product: Product) => void;
  isInCart: (productId: string) => boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

// ===== SERVER: PRODUCTS =====
// Replace with server-provided products.
// ملاحظة: هذه نسخة مؤقتة. في المرحلة القادمة ستأتي من server/products.
import { getMockProducts } from "./../components/products/mockProducts";
// ===== END SERVER: PRODUCTS =====

function HeartBrokenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8.2 9.6 6a4.8 4.8 0 0 0-6.4 7.2c1.4 1.6 4 3.9 8.8 7.2" />
      <path d="M12 8.2 14.4 6a4.8 4.8 0 0 1 6.4 7.2c-1.4 1.6-4 3.9-8.8 7.2" />
      <path d="m12 12-2 3 3 2" />
    </svg>
  );
}

export default function FavoritesPage({
  onNavigate,
  cartCount,
  favoriteIds,
  onToggleFavorite,
  onRemoveFavorite,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
  isDark,
  onToggleTheme,
}: FavoritesPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const allProducts = useMemo(() => getMockProducts(), []);

  /**
   * الفلترة:
   * 1. نجمع المنتجات التي مُعرّفاتها في favorites.
   * 2. أي ID غير موجود في allProducts → يُحذف تلقائيًا.
   */
  const favoriteProducts = useMemo(() => {
    const map = new Map(allProducts.map((p) => [p.id, p]));

    const valid: Product[] = [];
    const stale: string[] = [];

    favoriteIds.forEach((id) => {
      const product = map.get(id);
      if (product) {
        valid.push(product);
      } else {
        stale.push(id);
      }
    });

    // تنظيف المفضلة من المعرّفات الميتة (بدون loop)
    if (stale.length > 0) {
      // تأجيل التنظيف للـ microtask لتفادي setState أثناء render
      queueMicrotask(() => {
        stale.forEach((id) => onRemoveFavorite(id));
      });
    }

    return valid;
  }, [favoriteIds, allProducts, onRemoveFavorite]);

  return (
    <main className="min-h-[100dvh] bg-background">
      <Header
        storeName="المفضلة"
        notificationCount={2}
        cartCount={cartCount}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNotificationsClick={() => onNavigate("/notifications")}
        onCartClick={() => onNavigate("/checkout")}
      />

      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[var(--page-padding-mobile)] pb-[calc(var(--bottom-nav-height)+2rem)] pt-6 md:px-[var(--page-padding-tablet)] lg:px-[var(--page-padding-desktop)]">
        {/* العنوان */}
        <motion.section
          className="mb-6 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.smooth, ease: MOTION.ease }}
        >
          <p className="text-sm text-muted">اختياراتك المحفوظة</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            المفضلة
          </h1>
        </motion.section>

        {/* الحالة الفارغة */}
        {favoriteProducts.length === 0 ? (
          <section className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-border bg-surface px-6 py-16 text-center">
            <span className="text-muted">
              <HeartBrokenIcon />
            </span>
            <p className="text-sm text-muted">
              لا توجد منتجات في المفضلة بعد.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("/store")}
              className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              تصفح المنتجات
            </button>
          </section>
        ) : (
          /* شبكة الصور */
          <section
            dir="rtl"
            className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {favoriteProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: MOTION.normal,
                    ease: MOTION.ease,
                  }}
                >
                  <FavoriteTile
                    product={product}
                    onOpen={() => setSelectedProduct(product)}
                    onRemove={() => onToggleFavorite(product)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        )}
      </div>

      <BottomNav
        active="favorites"
        notificationCount={2}
        cartCount={cartCount}
        shifted={cartCount > 0}
        onNavigate={(id) => {
          if (id === "home") onNavigate("/store");
          if (id === "favorites") onNavigate("/favorites");
          if (id === "notifications") onNavigate("/notifications");
          if (id === "cart") onNavigate("/checkout");
        }}
      />

      {/* Sheet المنتج — يعمل داخل صفحة المفضلة */}
      <ProductDetailsSheet
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, selections) => {
          onAddToCart(product, selections);
        }}
      />
    </main>
  );
}

/* =========================================================
   FAVORITE TILE — بطاقة صورة مع قلب ممتلئ
   ========================================================= */

interface FavoriteTileProps {
  product: Product;
  onOpen: () => void;
  onRemove: () => void;
}

function FavoriteTile({ product, onOpen, onRemove }: FavoriteTileProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`عرض ${product.name}`}
        className={[
          "relative block w-full overflow-hidden rounded-[var(--radius-lg)]",
          "bg-surface-muted",
          "transition-[transform,box-shadow] duration-[var(--motion-slow)]",
          "ease-[var(--ease-emphasized)]",
          "group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-md)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        ].join(" ")}
      >
        <div className="relative aspect-[0.85] w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            draggable={false}
            className={[
              "absolute inset-0 h-full w-full object-cover object-center",
              "transition-transform duration-[var(--motion-slow)]",
              "ease-[var(--ease-emphasized)]",
              "group-hover:scale-[1.04]",
            ].join(" ")}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/15 to-transparent opacity-70"
          />
        </div>
      </button>

      {/* زر القلب الممتلئ — طبقة فوق الصورة */}
      <button
        type="button"
        aria-label={`إزالة ${product.name} من المفضلة`}
        onClick={onRemove}
        className={[
          "absolute left-2 top-2 z-20",
          "flex size-8 items-center justify-center rounded-full",
          "border-0 bg-[color:var(--theme-surface)]/85 backdrop-blur-md",
          "shadow-[var(--shadow-xs)] text-[color:var(--theme-text)]",
          "transition-transform duration-[var(--motion-normal)]",
          "ease-[var(--ease-emphasized)]",
          "hover:bg-[color:var(--theme-surface)] hover:scale-105 active:scale-90",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        >
          <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" />
        </svg>
      </button>
    </div>
  );
}