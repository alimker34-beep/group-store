import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../components/products/ProductCard";

export interface Category {
  id: string;
  label: string;
  isVisible?: boolean;
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
   [4] إضافة منتج جديد (كود المهندس المعتمد)
   --------------------------------------------------------- */
export async function addProduct(productData: Omit<Product, "id">) {
  console.log("[Firestore] 1. بدء عملية الإضافة");

  try {
    console.log("[Firestore] 2. البيانات:", productData);
    console.log("[Firestore] 3. إرسال الطلب إلى products");

    const docRef = await addDoc(
      collection(db, "products"),
      productData
    );

    console.log("[Firestore] 4. نجحت الإضافة!");
    console.log("[Firestore] Document ID:", docRef.id);

    return docRef.id;

  } catch (error: any) {
    console.error("[Firestore] فشلت الإضافة!");
    console.error("Error code:", error?.code);
    console.error("Error message:", error?.message);
    console.error("Full error:", error);

    throw error;
  }
}

/* ---------------------------------------------------------
   [5] حذف منتج (خاص بلوحة التحكم)
   --------------------------------------------------------- */
export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    console.error("خطأ في حذف المنتج:", error);
    throw error;
  }
}
