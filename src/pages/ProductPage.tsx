import { useState } from "react";
import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";
import { ProductDetailsSheet } from "../components/products/ProductDetailsSheet";
import type { Product } from "../components/products/ProductCard";

interface ProductPageProps {
  productId?: string;
  onNavigate: (path: string) => void;
  onAddToCart: (
    product: Product,
    selections?: Record<string, string>,
  ) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function ProductPage({
  productId,
  onNavigate,
  onAddToCart,
  isDark,
  onToggleTheme,
}: ProductPageProps) {
  const [open, setOpen] = useState(true);

  // ===== SERVER: PRODUCT =====
  const product: Product = {
    id: productId ?? "winter-jacket",
    name: "DS Winter Jacket",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=85",
    ],
    price: 120.99,
    originalPrice: 149.99,
    rating: 4.9,
    category: "clothing",
    description:
      "جاكيت شتوي بتصميم عصري وخامة مريحة مناسب للاستخدام اليومي.",
    options: [
      {
        id: "size",
        label: "المقاس",
        type: "select",
        values: ["S", "M", "L", "XL"],
      },
      {
        id: "color",
        label: "اللون",
        type: "color",
        values: ["رمادي", "أسود", "بيج"],
        colorMap: {
          "رمادي": "#8d8d8d",
          "أسود": "#111111",
          "بيج": "#d7c6b5",
        },
      },
    ],
  };
  // ===== END SERVER: PRODUCT =====

  return (
    <main className="min-h-[100dvh] bg-background">
      <Header
        storeName="تفاصيل المنتج"
        notificationCount={2}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNotificationsClick={() => onNavigate("/notifications")}
      />

      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[var(--content-max-width)] items-center justify-center px-[var(--page-padding-mobile)] pb-[calc(var(--bottom-nav-height)+1rem)] pt-4 md:px-[var(--page-padding-tablet)] lg:px-[var(--page-padding-desktop)]">
        <ProductDetailsSheet
          product={product}
          open={open}
          onClose={() => {
            setOpen(false);
            onNavigate("/store");
          }}
          onAddToCart={(p, selections) => {
            onAddToCart(p, selections);
          }}
        />
      </div>

      <BottomNav
        active="home"
        notificationCount={2}
        onNavigate={(id) => {
          if (id === "home") onNavigate("/store");
          if (id === "notifications") onNavigate("/notifications");
          if (id === "cart") onNavigate("/checkout");
        }}
      />
    </main>
  );
}