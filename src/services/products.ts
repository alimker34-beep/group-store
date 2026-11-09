import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../components/products/ProductCard";

export interface Category {
  id: string;
  label: string;
  isVisible?: boolean;
}

// رابط الـ Worker مباشرة بدون الحاجة لملفات الـ env
const WORKER_URL = "https://nexus-gate.smart346965.workers.dev";

// دالة مساعدة لجلب رمز الـ PIN الخاص بالأدمن من الذاكرة المحلية
function getAdminPin(): string {
  return localStorage.getItem("admin_pin") || "12345";
}

/* ---------------------------------------------------------
   [1] جلب المنتجات (الكل أو المفلترة حسب القسم)
   --------------------------------------------------------- */
export async function getStoreProducts(categoryId: string = "all"): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    let q = query(productsRef);

    if (categoryId !== "all") {
      q = query(productsRef, where("category", "==", categoryId));
    }

    const snapshot = await getDocs(q);
    const products: Product[] = [];

    snapshot.forEach((docItem) => {
      products.push({ id: docItem.id, ...docItem.data() } as Product);
    });

    return products;
  } catch (error) {
    console.error("خطأ في جلب المنتجات من فايربيز:", error);
    return [];
  }
}

/* ---------------------------------------------------------
   [2] جلب المنتجات المخفضة فقط (قسم التخفيضات / العروض)
   --------------------------------------------------------- */
export async function getDiscountedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const discounted: Product[] = [];

    snapshot.forEach((docItem) => {
      const product = { id: docItem.id, ...docItem.data() } as Product;
      if (product.originalPrice && product.originalPrice > product.price) {
        discounted.push(product);
      }
    });

    return discounted;
  } catch (error) {
    console.error("خطأ في جلب التخفيضات من فايربيز:", error);
    return [];
  }
}

/* ---------------------------------------------------------
   [3] جلب الأقسام الفعالة فقط للتحكم بالإظهار والإخفاء
   --------------------------------------------------------- */
export async function getStoreCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);
    const categories: Category[] = [{ id: "all", label: "الكل" }];

    snapshot.forEach((docItem) => {
      const data = docItem.data() as Category;
      if (data.isVisible !== false) {
        categories.push({ id: docItem.id, label: data.label });
      }
    });

    return categories;
  } catch (error) {
    console.error("خطأ في جلب الأقسام:", error);
    return [
      { id: "all", label: "الكل" },
      { id: "clothing", label: "ملابس" },
      { id: "perfume", label: "عطور" },
      { id: "bags", label: "حقائب" },
      { id: "electronics", label: "إلكترونيات" },
      { id: "food", label: "أغذية" },
      { id: "stationery", label: "مكتبيات" },
    ];
  }
}

/* ---------------------------------------------------------
   [4] إضافة منتج جديد (عبر الـ Worker السحابي لتجاوز تعليق الشبكة)
   --------------------------------------------------------- */
export async function addProduct(productData: Omit<Product, "id">) {
  console.log("[Worker] 1. بدء إرسال المنتج عبر الـ Worker...", productData);

  try {
    const response = await fetch(`${WORKER_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Pin": getAdminPin()
      },
      body: JSON.stringify(productData)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "فشل إرسال المنتج عبر الـ Worker");
    }

    console.log("[Worker] 4. نجحت الإضافة بنجاح! المعرف:", result.id);
    return result.id;

  } catch (error: any) {
    console.error("[Worker] فشلت الإضافة:", error);
    throw error;
  }
}

/* ---------------------------------------------------------
   [5] حذف منتج (عبر الـ Worker السحابي)
   --------------------------------------------------------- */
export async function deleteProduct(productId: string) {
  console.log("[Worker] جاري حذف المنتج عبر الـ Worker...", productId);

  try {
    const response = await fetch(`${WORKER_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "X-Admin-Pin": getAdminPin()
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "فشل حذف المنتج عبر الـ Worker");
    }

    console.log("[Worker] تم الحذف بنجاح:", result.deletedId);
    return result.deletedId;

  } catch (error: any) {
    console.error("[Worker] خطأ في حذف المنتج:", error);
    throw error;
  }
}
