import type { Product } from "../products/ProductCard";

export interface CartItem {
  key: string;
  product: Product;
  selections: Record<string, string>;
  quantity: number;
}

export function makeCartKey(
  productId: string,
  selections: Record<string, string>,
): string {
  const parts = Object.entries(selections)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`);
  return [productId, ...parts].join("|");
}