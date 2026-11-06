import { useState, useEffect } from "react";
import { getStoreProducts, addProduct, deleteProduct } from "../services/products";
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

  // حقول نموذج إضافة منتج جديد
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("clothing");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // جلب المنتجات عند تسجيل الدخول
  const loadProducts = async () => {
    setLoading(true);
    const data = await getStoreProducts("all");
    setProducts(data);
    setLoading(false);
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
    if (!name || !price || !image) {
      alert("الرجاء ملء الحقول الأساسية (الاسم، السعر، الصورة)");
      return;
    }

    try {
      await addProduct({
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        image,
        description,
        options: [],
      });

      alert("تمت إضافة المنتج بنجاح!");
      // تفريغ الحقول
      setName("");
      setPrice("");
      setOriginalPrice("");
      setImage("");
      setDescription("");
      // تحديث القائمة
      loadProducts();
    } catch (err) {
      alert("حدث خطأ أثناء الإضافة");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
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

  // واجهة لوحة التحكم بعد الدخول بنجاح
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 dir-rtl">
      <div className="max-w-5xl mx-auto">
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-8 bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <h1 className="text-xl font-bold">⚡ لوحة إدارة متجر </h1>
          <button
            onClick={() => onNavigate("/store")}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition"
          >
            عرض المتجر الحي 🛒
          </button>
        </div>

        {/* نموذج إضافة منتج */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">➕ إضافة منتج جديد بكل سهولة</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="اسم المنتج (مثلاً: ساعة يد)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
            />
            <input
              type="number"
              placeholder="السعر الحالي (مثلاً: 50)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
            />
            <input
              type="number"
              placeholder="السعر الأصلي قبل التخفيض (اختياري)"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white"
            >
              <option value="clothing">ملابس</option>
              <option value="perfume">عطور</option>
              <option value="bags">حقائب</option>
              <option value="electronics">إلكترونيات</option>
              <option value="food">أغذية</option>
              <option value="stationery">مكتبيات</option>
            </select>
            <input
              type="text"
              placeholder="رابط الصورة (من Unsplash أو رابط مباشر)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white md:col-span-2"
            />
            <textarea
              placeholder="وصف المنتج المختصر..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white md:col-span-2"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition shadow-md"
            >
              حفظ ونشر المنتج في المتجر فوراً 🚀
            </button>
          </form>
        </div>

        {/* قائمة المنتجات مع زر الحذف */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-purple-400">📦 المنتجات الحالية في المتجر ({products.length})</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-6">جاري التحميل...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-400 text-center py-6">لا توجد منتجات حالياً. أضف أول منتج بالأعلى!</p>
          ) : (
            <div className="space-y-3">
              {products.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-semibold text-white">{prod.name}</h4>
                      <p className="text-sm text-gray-400">${prod.price} | القسم: {prod.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    حذف 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
