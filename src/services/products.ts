import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../components/products/ProductCard";

export interface Category {
  id: string;
  label: string;
  isVisible?: boolean;
}

// جلب المنتجات
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
    console.error("خطأ في جلب المنتجات:", error);
    return [];
  }
}

// جلب التخفيضات
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
    console.error("خطأ في جلب التخفيضات:", error);
    return [];
  }
}

// جلب الأقسام
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
    return [{ id: "all", label: "الكل" }];
  }
}

/* =========================================================
   إدارة لوحة التحكم (إضافة وحذف المنتجات)
   ========================================================= */

// إضافة منتج جديد لقاعدة البيانات
export async function addProduct(productData: Omit<Product, "id">) {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    return docRef.id;
  } catch (error) {
    console.error("خطأ في إضافة المنتج:", error);
    throw error;
  }
}

// حذف منتج من قاعدة البيانات
export async function deleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    console.error("خطأ في حذف المنتج:", error);
    throw error;
  }
}
