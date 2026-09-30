import type { Product } from "./ProductCard";

// ===== SERVER: PRODUCTS =====
// Replace mockProducts with server-provided products.

export const mockProducts: Product[] = [
  /* -------------------------------------------------------
     ملابس — مقاس + لون
     ------------------------------------------------------- */
  {
    id: "product-1",
    name: "Winter Jacket",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    price: 30,
    originalPrice: 45,
    rating: 4.9,
    category: "clothing",
    description: "جاكيت شتوي أنيق بتصميم عملي وخامة مريحة للاستخدام اليومي.",
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
        values: ["أسود", "رمادي", "بيج"],
        colorMap: {
          "أسود": "#111111",
          "رمادي": "#8f908a",
          "بيج": "#d8d4ca",
        },
      },
    ],
  },

  /* عطور */
  {
    id: "product-2",
    name: "Oud Perfume",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    price: 120,
    rating: 4.8,
    category: "perfume",
    description: "عطر عود فاخر بثبات عالٍ ورائحة شرقية دافئة.",
    options: [],
  },

  /* أغذية */
  {
    id: "product-3",
    name: "Organic Honey",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85",
    price: 25,
    originalPrice: 32,
    rating: 4.9,
    category: "food",
    description: "عسل طبيعي 100% من مرتفعات اليمن.",
    options: [
      {
        id: "weight",
        label: "الوزن",
        type: "select",
        values: ["250g", "500g", "1kg"],
      },
      {
        id: "quantity",
        label: "الكمية",
        type: "quantity",
        values: [],
      },
    ],
  },

  /* حقائب */
  {
    id: "product-4",
    name: "Leather Bag",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    price: 95,
    rating: 4.7,
    category: "bags",
    description: "حقيبة جلدية أنيقة بتصميم عملي.",
    options: [
      {
        id: "color",
        label: "اللون",
        type: "color",
        values: ["أسود", "بني", "بيج"],
        colorMap: {
          "أسود": "#111111",
          "بني": "#6b4423",
          "بيج": "#d8c8a8",
        },
      },
    ],
  },

  /* إلكترونيات */
  {
    id: "product-5",
    name: "Wireless Earbuds",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85",
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    category: "electronics",
    description: "سماعات لاسلكية بجودة صوت عالية.",
    options: [
      {
        id: "color",
        label: "اللون",
        type: "color",
        values: ["أسود", "أبيض"],
        colorMap: {
          "أسود": "#111111",
          "أبيض": "#ffffff",
        },
      },
    ],
  },

  /* مكتبيات */
  {
    id: "product-6",
    name: "Notebook",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85",
    price: 12,
    category: "stationery",
    description: "دفتر ملاحظات بغلاف صلب.",
    options: [
      {
        id: "quantity",
        label: "عدد القطع",
        type: "quantity",
        values: [],
      },
    ],
  },
];

// ===============================

export function getMockProducts(): Product[] {
  return mockProducts;
}