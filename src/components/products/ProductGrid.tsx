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

  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleItems = (products ?? getMockProducts()).slice(0, visibleCount);

  function prefetchProductImages(product: Product) {
    const imgs = product.images && product.images.length ? product.images : [product.image];
    for (let i = 0; i < Math.min(imgs.length, 3); i++) {
      const img = new Image();
      img.src = imgs[i];
    }
  }

  function handlePrefetch(index: number) {
    const itemsAll = products ?? getMockProducts();
    const start = index;
    const end = Math.min(itemsAll.length, index + 6);
    for (let i = start; i < end; i++) {
      prefetchProductImages(itemsAll[i]);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
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
              priority={idx < PAGE_SIZE}
              onMouseEnter={() => handlePrefetch(idx)}
              onFocus={() => handlePrefetch(idx)}
            />
          </div>
        ))}
      </div>

      {visibleCount < (products ?? getMockProducts()).length ? (
        <div className="mt-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount(v => Math.min((products ?? getMockProducts()).length, v + PAGE_SIZE))}
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
