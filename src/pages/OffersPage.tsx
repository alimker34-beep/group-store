import { useState } from "react";
import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";
import { ProductDetailsSheet } from "../components/products/ProductDetailsSheet";
import type { Product } from "../components/products/ProductCard";
import ResponsiveImage from "../components/ui/ResponsiveImage";

interface OffersPageProps {
  onNavigate: (path: string) => void;
  cartCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onAddToCart: (product: Product, selections?: Record<string, string>) => void;
}

// ===== SERVER: OFFERS / PRODUCTS =====
// بيانات تجريبية للعروضات (يُفضل لاحقاً جلبها من السيرفر)
const mockOffers = [
  {
    id: "offer-1",
    product: {
      id: "product-2", // مرتبط بمنتج موجود في mockProducts
      name: "Oud Perfume",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
      price: 120,
      rating: 4.8,
      description: "عطر عود فاخر بثبات عالٍ ورائحة شرقية دافئة.",
      options: [],
    } as Product,
    title: "خصم خاص على العطور",
    description: "احصل على عطرك المفضل الآن بخصم يصل إلى 30%. العرض لفترة محدودة جداً.",
  },
  {
    id: "offer-2",
    product: {
      id: "product-1", // مرتبط بمنتج موجود في mockProducts
      name: "Winter Jacket",
      image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
      price: 30,
      originalPrice: 45,
      rating: 4.9,
      description: "جاكيت شتوي أنيق بتصميم عملي وخامة مريحة للاستخدام اليومي.",
      options: [
        { id: "size", label: "المقاس", type: "select", values: ["S", "M", "L", "XL"] },
        { id: "color", label: "اللون", type: "color", values: ["أسود", "رمادي"], colorMap: { "أسود": "#111111", "رمادي": "#8f908a" } },
      ],
    } as Product,
    title: "تخفيضات الشتاء",
    description: "استعد للبرد مع تشكيلتنا الجديدة من الجاكيتات. خصم 40% لفترة محدودة.",
  },
];
// ===== END SERVER: OFFERS =====

export default function OffersPage({
  onNavigate,
  cartCount,
  isDark,
  onToggleTheme,
  onAddToCart,
}: OffersPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="min-h-[100dvh] bg-background">
      <Header
        storeName="العروضات"
        notificationCount={2}
        cartCount={cartCount}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onNotificationsClick={() => onNavigate("/notifications")}
        onCartClick={() => onNavigate("/checkout")}
      />

      <div className="mx-auto w-full max-w-2xl px-[var(--page-padding-mobile)] pb-[calc(var(--bottom-nav-height)+2rem)] pt-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            العروضات الحالية
          </h1>
          <p className="mt-1 text-sm text-muted">اكتشف أحدث العروض والتخفيضات</p>
        </div>

        {/* قائمة العروض بنمط إنستغرام */}
        <div className="space-y-10">
          {mockOffers.map((offer) => (
            <article
              key={offer.id}
              className="group cursor-pointer overflow-hidden rounded-[var(--radius-xl)] bg-surface shadow-sm transition-shadow hover:shadow-md"
              onClick={() => setSelectedProduct(offer.product)}
            >
              {/* الصورة */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted">
                <ResponsiveImage
                  src={offer.product.image}
                  alt={offer.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* العنوان والوصف تحت الصورة */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-foreground">{offer.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {offer.description}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-primary">تسوق العرض الآن ←</span>
                  <span className="text-sm font-bold text-price">
                    ${offer.product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <BottomNav
        active="home"
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

      {/* فتح تفاصيل المنتج عند النقر */}
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
