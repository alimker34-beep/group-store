import type { Product } from "../components/products/ProductCard";

export interface Category {
  id: string;
  label: string;
  isVisible?: boolean;
}

// رابط الـ Worker السحابي الخاص بك
const WORKER_URL = "https://nexus-gate.smart346965.workers.dev";
const CACHE_KEY = "group_store_products_cache_v1";

// دالة لجلب رمز الـ PIN الخاص بالأدمن من الذاكرة المحلية
function getAdminPin(): string {
  return localStorage.getItem("admin_pin") || "12345";
}

/* ---------------------------------------------------------
   [1] جلب المنتجات (مع التخزين المحلي والاستشعار الذكي للتحديثات)
   --------------------------------------------------------- */
export async function getStoreProducts(categoryId: string = "all"): Promise<Product[]> {
  try {
    // 1. محاولة القراءة السريعة من الذاكرة المحلية (LocalStorage) لظهور الفوري
    const cachedData = localStorage.getItem(CACHE_KEY);
    let products: Product[] = cachedData ? JSON.parse(cachedData) : [];

    // 2. جلب التحديثات الحية من الـ Worker في الخلفية لتجاوز قيود الشبكة
    const response = await fetch(`${WORKER_URL}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.products)) {
        products = result.products;
        // حفظ التحديثات الجديدة في القرص الصلب محلياً
        localStorage.setItem(CACHE_KEY, JSON.stringify(products));
      }
    }

    // التصفية حسب القسم إذا طُلب ذلك
    if (categoryId !== "all") {
      products = products.filter((p) => p.category === categoryId);
    }

    return products;
  } catch (error) {
    console.error("خطأ في جلب المنتجات عبر الـ Worker، يتم الاعتماد على الكاش المحلي:", error);
    
    // في حال انقطاع الشبكة تماماً، نعتمد على المخزن محلياً لكي لا يتوقف المتجر
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      let products: Product[] = JSON.parse(cachedData);
      if (categoryId !== "all") {
        products = products.filter((p) => p.category === categoryId);
      }
      return products;
    }

    return [];
  }
}

/* ---------------------------------------------------------
   [2] جلب المنتجات المخفضة فقط
   --------------------------------------------------------- */
export async function getDiscountedProducts(): Promise<Product[]> {
  try {
    const products = await getStoreProducts("all");
    return products.filter((product) => product.originalPrice && product.originalPrice > product.price);
  } catch (error) {
    console.error("خطأ في جلب التخفيضات:", error);
    return [];
  }
}

/* ---------------------------------------------------------
   [3] جلب الأقسام الفعالة
   --------------------------------------------------------- */
export async function getStoreCategories(): Promise<Category[]> {
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

/* ---------------------------------------------------------
   [4] إضافة منتج جديد عبر الـ Worker السحابي
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
    
    // مسح الكاش المحلي لتجبار النظام على جلب القائمة المحدثة فوراً في المرة القادمة
    localStorage.removeItem(CACHE_KEY);

    return result.id;

  } catch (error: any) {
    console.error("[Worker] فشلت الإضافة:", error);
    throw error;
  }
}

/* ---------------------------------------------------------
   [5] حذف منتج عبر الـ Worker السحابي
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

    // مسح الكاش المحلي لتحديث البيانات
    localStorage.removeItem(CACHE_KEY);

    return result.deletedId;

  } catch (error: any) {
    console.error("[Worker] خطأ في حذف المنتج:", error);
    throw error;
  }
}
