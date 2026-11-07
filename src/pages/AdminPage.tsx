import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStoreProducts,
  addProduct,
  deleteProduct,
} from "../services/products";
import type { Product } from "../components/products/ProductCard";

interface AdminPageProps {
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  // 🔐 نظام حماية بكلمة مرور (غيّر الرقم السري كما تريد)
  const SECRET_PIN = "12345"; 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<"dashboard" | "products">("dashboard");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  // حقول نموذج إضافة منتج جديد
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("clothing");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const categoryOptions = [
    { value: "clothing", label: "ملابس" },
    { value: "perfume", label: "عطور" },
    { value: "bags", label: "حقائب" },
    { value: "electronics", label: "إلكترونيات" },
    { value: "food", label: "أغذية" },
    { value: "stationery", label: "مكتبيات" },
  ];

  const selectedCategory =
    categoryOptions.find((item) => item.value === category)?.label ?? "اختر القسم";

  // جلب المنتجات عند تسجيل الدخول
  const loadProducts = async () => {
    setLoading(true);
    setErrorMessage(null); // مسح أي خطأ سابق

    try {
      const data = await getStoreProducts("all");
      setProducts(data);
    } catch (error: any) {
      console.error("فشل تحميل المنتجات:", error);
      // عرض الخطأ الحقيقي على شاشة الهاتف مباشرة
      setErrorMessage(`خطأ في التحميل: ${error?.message || JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  // معالجة تسجيل الدخول للوحة التحكم
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === SECRET_PIN) {
      setIsAuthenticated(true);
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  };

  // إضافة منتج جديد
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!name.trim() || !price || !image.trim()) {
      alert("الرجاء ملء الحقول الأساسية (الاسم، السعر، الصورة)");
      return;
    }

    const numericPrice = Number(price);
    const numericOriginalPrice = originalPrice
      ? Number(originalPrice)
      : undefined;

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      alert("يرجى إدخال سعر صحيح");
      return;
    }

    if (
      numericOriginalPrice !== undefined &&
      (!Number.isFinite(numericOriginalPrice) ||
        numericOriginalPrice <= numericPrice)
    ) {
      alert("السعر الأصلي يجب أن يكون أكبر من السعر الحالي");
      return;
    }

    setIsSubmitting(true);

    try {
      const productId = await addProduct({
        name: name.trim(),
        price: numericPrice,
        originalPrice: numericOriginalPrice,
        category,
        image: image.trim(),
        description: description.trim(),
        options: [],
      });

      console.log("تم حفظ المنتج في Firestore، المعرف:", productId);

      setName("");
      setPrice("");
      setOriginalPrice("");
      setImage("");
      setDescription("");
      setErrorMessage(null);

      await loadProducts();

      alert("تمت إضافة المنتج بنجاح!");
    } catch (error: any) {
      console.error("فشل نشر المنتج:", error);
      // التقاط رسالة الخطأ التقنية الحقيقية من فايربيز أو الشبكة وعرضها على الشاشة
      const exactError = error?.message || JSON.stringify(error) || "خطأ غير معروف في الاتصال";
      setErrorMessage(`خطأ فايربيز/الشبكة: ${exactError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // حذف منتج
  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  // إذا لم يتم تسجيل الدخول، أظهر شاشة كلمة المرور السرية
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] text-[#111] p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
          <h2 className="text-2xl font-bold mb-6 text-center">🔐 لوحة التحكم السرية</h2>
          <p className="text-gray-400 text-sm mb-4 text-center">أدخل الرمز السري للوصول إلى إدارة المتجر:</p>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="الرمز السري..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
          >
            دخول للوحة التحكم
          </button>
          <button
            type="button"
            onClick={() => onNavigate("/store")}
            className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-xl transition text-sm"
          >
            العودة للمتجر
          </button>
        </form>
      </div>
    );
  }

  if (currentView === "products") {
    return (
      <div dir="rtl" className="min-h-screen bg-[#f5f5f5] px-4 py-5 text-[#111] md:px-8 md:py-8">
        <div className="mx-auto max-w-5xl">

          <div className="mb-7 flex items-center justify-between rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-sm">
            <div>
              <h1 className="text-lg font-bold">منتجات المتجر</h1>
              <p className="mt-1 text-xs text-[#888]">
                {products.length} منتج
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView("dashboard")}
              className="rounded-full bg-[#111] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#292929] active:scale-95"
            >
              العودة
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white py-12 text-center text-sm text-[#888]">
              جارٍ تحميل المنتجات...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl bg-white py-12 text-center text-sm text-[#888]">
              لا توجد منتجات حتى الآن.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((prod) => (
                <motion.article
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.035)]"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#f2f2f2]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="truncate text-sm font-bold">
                      {prod.name}
                    </h3>

                    <p className="mt-1 text-sm font-semibold tabular-nums">
                      ${prod.price}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#888]">
                      {categoryOptions.find((item) => item.value === prod.category)?.label ?? prod.category}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProductToDelete(prod.id);
                          setShowDeleteModal(true);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95"
                      >
                        <span>حذف</span>
                        <span>⌫</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          // سنربط التعديل بعد التأكد من خدمة updateProduct
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#111] py-2.5 text-xs font-semibold text-white transition hover:bg-[#292929] active:scale-95"
                      >
                        <span>تعديل</span>
                        <span>✎</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* نافذة تأكيد الحذف */}
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  onClick={(event) => event.stopPropagation()}
                  className="w-full max-w-sm rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-2xl"
                >
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
                    !
                  </div>

                  <h3 className="text-center text-lg font-bold">
                    حذف المنتج؟
                  </h3>

                  <p className="mt-2 text-center text-sm leading-6 text-[#777]">
                    هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="rounded-xl border border-black/10 py-3 text-sm font-semibold transition hover:bg-[#f5f5f5]"
                    >
                      إلغاء
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!productToDelete) return;

                        try {
                          await deleteProduct(productToDelete);
                          setProducts((prev) =>
                            prev.filter((item) => item.id !== productToDelete)
                          );
                          setShowDeleteModal(false);
                          setProductToDelete(null);
                        } catch {
                          alert("فشل حذف المنتج");
                        }
                      }}
                      className="rounded-xl bg-[#111] py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
                    >
                      تأكيد الحذف
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    );
  }

  // واجهة لوحة التحكم بعد الدخول بنجاح
  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f5f5] px-4 py-5 text-[#111] md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header Capsule */}
        <div className="mb-7 flex min-h-[76px] items-center justify-between gap-3 rounded-[22px] border border-black/[0.06] bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.035)] sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#111] text-white">
              <span className="text-lg">✦</span>
            </span>

            <h1 className="whitespace-nowrap text-base font-bold tracking-tight sm:text-lg">
              لوحة التحكم
            </h1>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("/store")}
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#111] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#292929] active:scale-[0.97]"
          >
            <span>المتجر</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>

        {/* صندوق عرض الأخطاء الحقيقية على الهاتف */}
        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-right shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-red-700">⚠️ كشف الخطأ التقني:</span>
              <button 
                type="button" 
                onClick={() => setErrorMessage(null)}
                className="text-xs font-bold text-red-500 hover:text-red-800"
              >
                إغلاق ✕
              </button>
            </div>
            <p className="text-xs font-mono text-red-600 break-all select-all">
              {errorMessage}
            </p>
          </div>
        )}

        {/* نموذج إضافة منتج */}
        <div className="mb-7 rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_5px_25px_rgba(0,0,0,0.035)] sm:p-7">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#111] text-sm text-white">+</span>
            إضافة منتج
          </h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="اسم المنتج (مثلاً: ساعة يد)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[13px] border border-black/[0.09] bg-[#fafafa] px-4 py-3.5 text-sm text-[#111] outline-none transition-all duration-200 placeholder:text-[#999] hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.045]"
            />
            <input
              type="number"
              placeholder="السعر الحالي (مثلاً: 50)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-[13px] border border-black/[0.09] bg-[#fafafa] px-4 py-3.5 text-sm text-[#111] outline-none transition-all duration-200 placeholder:text-[#999] hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.045]"
            />
            <input
              type="number"
              placeholder="السعر الأصلي قبل التخفيض (اختياري)"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full rounded-[13px] border border-black/[0.09] bg-[#fafafa] px-4 py-3.5 text-sm text-[#111] outline-none transition-all duration-200 placeholder:text-[#999] hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.045]"
            />

            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-[13px] border border-black/[0.09] bg-[#fafafa] px-4 py-3.5 text-sm transition-all duration-200 hover:border-black/20 focus:border-black"
              >
                <span>{selectedCategory}</span>
                <motion.span
                  animate={{ rotate: categoryOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#777]"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
                  >
                    {categoryOptions.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setCategory(item.value);
                          setCategoryOpen(false);
                        }}
                        className={[
                          "flex w-full items-center justify-between rounded-xl px-4 py-3 text-right text-sm transition-colors",
                          category === item.value
                            ? "bg-[#111] font-semibold text-white"
                            : "text-[#333] hover:bg-[#f3f3f3]",
                        ].join(" ")}
                      >
                        {item.label}
                        {category === item.value && <span>✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <input
              type="text"
              placeholder="رابط صورة المنتج"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-[13px] border border-black/[0.09] bg-[#fafafa] px-4 py-3.5 text-sm text-[#111] outline-none transition-all duration-200 placeholder:text-[#999] hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.045] md:col-span-2"
            />
            <textarea
              placeholder="وصف المنتج..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-[13px] border border-black/[0.09] bg-[#fafafa] px-4 py-3.5 text-sm text-[#111] outline-none transition-all duration-200 placeholder:text-[#999] hover:border-black/20 focus:border-black focus:bg-white focus:ring-4 focus:ring-black/[0.045] md:col-span-2"
            />

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="md:col-span-2 relative flex min-h-[52px] items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[#111] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(0,0,0,0.12)] transition-colors duration-200 hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  جارٍ النشر...
                </>
              ) : (
                <>
                  <span>نشر المنتج</span>
                  <span>↗</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentView("products");
            loadProducts();
          }}
          className="flex w-full items-center justify-between rounded-[20px] border border-black/[0.06] bg-white p-5 text-right shadow-[0_4px_20px_rgba(0,0,0,0.035)] transition-all duration-200 hover:border-black/15 hover:shadow-md active:scale-[0.99]"
        >
          <div>
            <h2 className="text-base font-bold">منتجات المتجر</h2>
            <p className="mt-1 text-sm text-[#888]">
              عرض المنتجات وإدارتها وتعديلها
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#f1f1f1] px-3 py-1.5 text-sm font-semibold tabular-nums">
              {products.length}
            </span>
            <span className="text-xl text-[#555]">←</span>
          </div>
        </button>
      </div>
    </div>
  );
}
