import { useState } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { ProductDetailsSheet } from "./ProductDetailsSheet";
import { getMockProducts } from "./mockProducts";

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  isInCart?: (productId: string) => boolean;
  isFavorite?: (productId: string) => boolean;
  onQuickAdd?: (
    product: Product,
    selections?: Record<string, string>,
  ) => void;
  onRemoveFromCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[0.86] rounded-[var(--radius-lg)] bg-surface-muted" />
      <div className="mt-3 h-4 w-3/4 rounded-full bg-surface-muted" />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-surface-muted" />
    </div>
  );
}

export function ProductGrid({
  products,
  loading = false,
  isInCart,
  isFavorite,
  onQuickAdd,
  onRemoveFromCart,
  onToggleFavorite,
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const items = products ?? getMockProducts();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // client-side incremental render to avoid huge initial DOM
  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleItems = items.slice(0, visibleCount);

  function prefetchProductImages(product: Product) {
    // preload main image and a couple gallery images
    const images = product.images && product.images.length ? product.images : [product.image];
    for (let i = 0; i < Math.min(images.length, 3); i++) {
      const img = new Image();
      img.src = images[i];
    }
  }

  // When user hovers a card, prefetch that product + next 4 products
  function handlePrefetch(index: number) {
    const start = index;
    const end = Math.min(items.length, index + 5);
    for (let i = start; i < end; i++) {
      const p = items[i];
      if (!p) continue;
      prefetchProductImages(p);
    }
  }

  return (
    <>
      <div
        dir="rtl"
        className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9"
      >
        {visibleItems.map((product, idx) => (
          <div key={product.id} className="content-auto">
            <ProductCard
              product={product}
              inCart={isInCart?.(product.id) ?? false}
              favorite={isFavorite?.(product.id) ?? false}
              onSelect={setSelectedProduct}
              onQuickAdd={onQuickAdd}
              onRemoveFromCart={onRemoveFromCart}
              onFavorite={onToggleFavorite}
              priority={idx < 15}
              onMouseEnter={() => handlePrefetch(idx)}
              onFocus={() => handlePrefetch(idx)}
            />
          </div>
        ))}
      </div>

      {visibleCount < items.length ? (
        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => Math.min(items.length, v + PAGE_SIZE))}
            className="rounded-md px-4 py-2 bg-primary text-inverse shadow-sm"
          >
            تحميل المزيد
          </button>
        </div>
      ) : null}

      <ProductDetailsSheet
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, selections) => {
          onQuickAdd?.(product, selections);
        }}
      />
    </>
  );
}
