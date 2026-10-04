import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";
import { PromoBanner } from "../components/products/PromoBanner";
import { ProductGrid } from "../components/products/ProductGrid";
import type { Product } from "../components/products/ProductCard";

interface HomePageProps {
  onNavigate: (path: string) => void;
  cartCount: number;
  onAddToCart: (
    product: Product,
    selections?: Record<string, string>,
  ) => void;
  onRemoveFromCart: (product: Product) => void;
  isInCart: (productId: string) => boolean;
  favorites: string[];
  onToggleFavorite: (product: Product) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function HomePage({
  onNavigate,
  cartCount,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
  favorites,
  onToggleFavorite,
  isDark,
  onToggleTheme,
}: HomePageProps) {
  const showFloating = cartCount > 0;

  return (
    <main className="min-h-[100dvh] bg-background">
      <Header
        storeName="GROUP STORE"
        notificationCount={2}
        cartCount={cartCount}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNotificationsClick={() => onNavigate("/notifications")}
        onCartClick={() => onNavigate("/checkout")}
      />

      <div
        className="mx-auto w-full max-w-[var(--content-max-width)] px-[var(--page-padding-mobile)] pb-[calc(var(--bottom-nav-height)+2rem)] pt-[calc(var(--header-curve-height)+1rem)] md:px-[var(--page-padding-tablet)] lg:px-[var(--page-padding-desktop)]"
        style={{ contain: "layout style" }}
      >
        <div className="mb-6">
          <p className="text-sm font-medium text-muted">اكتشف الجديد</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            منتجات تستحق أن تراها
          </h1>
        </div>

        <section className="mb-8" style={{ contain: "layout paint" }}>
          <PromoBanner
            title="خصم اليوم فقط"
            subtitle="اكتشف تشكيلتنا الجديدة واحصل على عروض مميزة."
            buttonLabel="تصفح العرض"
          />
        </section>

        <section style={{ contain: "layout" }}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-muted">مختاراتنا</p>

              <h2 className="mt-1 text-xl font-semibold text-foreground">
                الأكثر طلبًا
              </h2>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-muted transition-[color] duration-[var(--motion-normal)] hover:text-foreground"
            >
              عرض الكل
            </button>
          </div>

          <ProductGrid
            isInCart={isInCart}
            isFavorite={(id) => favorites.includes(id)}
            onQuickAdd={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            onToggleFavorite={onToggleFavorite}
          />
        </section>
      </div>

      <BottomNav
        active="home"
        notificationCount={2}
        cartCount={cartCount}
        shifted={showFloating}
        onNavigate={(id) => {
          if (id === "home") onNavigate("/store");
          if (id === "favorites") onNavigate("/favorites");
          if (id === "notifications") onNavigate("/notifications");
          if (id === "cart") onNavigate("/checkout");
        }}
      />
    </main>
  );
}
