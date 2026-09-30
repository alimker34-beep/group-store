import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { MOTION, TRANSITION } from "./shared/motion";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import NotificationsPage from "./pages/NotificationsPage";
import FavoritesPage from "./pages/FavoritesPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import { CartSheet } from "./components/cart/CartSheet";
import { FloatingCartButton } from "./components/cart/FloatingCartButton";
import {
  makeCartKey,
  type CartItem,
} from "./components/cart/types";
import type { Product } from "./components/products/ProductCard";

type Route =
  | { name: "welcome" }
  | { name: "home" }
  | { name: "favorites" }
  | { name: "product"; id: string }
  | { name: "notifications" }
  | { name: "checkout" }
  | { name: "success" };

function resolveRoute(pathname: string): Route {
  if (pathname === "/" || pathname === "/welcome") return { name: "welcome" };
  if (pathname === "/store") return { name: "home" };
  if (pathname === "/favorites") return { name: "favorites" };
  if (pathname === "/notifications") return { name: "notifications" };
  if (pathname === "/checkout") return { name: "checkout" };
  if (pathname === "/success") return { name: "success" };

  if (pathname.startsWith("/product/")) {
    const id = pathname.replace("/product/", "").trim();
    if (id) return { name: "product", id };
  }

  return { name: "home" };
}

/* =========================================================
   STORAGE KEYS
   ========================================================= */

const CART_STORAGE_KEY = "gs:cart:v1";
const FAVORITES_STORAGE_KEY = "gs:favorites:v1";
const THEME_STORAGE_KEY = "gs:theme:v1";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function readTheme(): boolean {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "dark") return true;
    if (raw === "light") return false;
    return (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches === true
    );
  } catch {
    return false;
  }
}

function App() {
  const [route, setRoute] = useState<Route>(() =>
    resolveRoute(window.location.pathname),
  );

  const [cart, setCart] = useState<CartItem[]>(() => readCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => readFavorites());
  const [isDark, setIsDark] = useState<boolean>(() => readTheme());

  /* ---------------------------------------------
     NAVIGATION
     --------------------------------------------- */
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    setRoute(resolveRoute(path));
    /* Lenis يعترض scrollTo افتراضيًا في v1.1+ */
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* ---------------------------------------------
     LENIS SMOOTH SCROLL
     يشتغل مرة واحدة، ويوقف عند unmount.
     --------------------------------------------- */
  useEffect(() => {
    /* احترام تفضيل تقليل الحركة */
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  /* ---------------------------------------------
     PERSIST CART
     --------------------------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  /* ---------------------------------------------
     PERSIST FAVORITES
     --------------------------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites),
      );
    } catch {
      /* ignore */
    }
  }, [favorites]);

  /* ---------------------------------------------
     DARK MODE
     --------------------------------------------- */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        isDark ? "dark" : "light",
      );
    } catch {
      /* ignore */
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  /* ---------------------------------------------
     CART ACTIONS
     --------------------------------------------- */
  const addToCart = useCallback(
    (product: Product, selections: Record<string, string> = {}) => {
      const key = makeCartKey(product.id, selections);

      setCart((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { key, product, selections, quantity: 1 }];
      });
    },
    [],
  );

  const increment = useCallback((key: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decrement = useCallback((key: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const removeFromCartByProduct = useCallback((product: Product) => {
    setCart((prev) =>
      prev.filter((item) => item.product.id !== product.id),
    );
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const isInCart = useCallback(
    (productId: string) =>
      cart.some((item) => item.product.id === productId),
    [cart],
  );

  /* ---------------------------------------------
     FAVORITES ACTIONS
     --------------------------------------------- */
  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id],
    );
  }, []);

  const removeFavoriteById = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
  }, []);

  const showFloating =
    cartCount > 0 &&
    route.name !== "checkout" &&
    route.name !== "success";

  /* مفتاح فريد لكل صفحة ليعمل AnimatePresence */
  const routeKey =
    route.name === "product" ? `product:${route.id}` : route.name;

  /* ---------------------------------------------
     RENDER
     --------------------------------------------- */
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={routeKey}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={TRANSITION.page}
        >
          {(() => {
            switch (route.name) {
              case "welcome":
                return <WelcomePage onContinue={() => navigate("/store")} />;

              case "home":
                return (
                  <HomePage
                    onNavigate={navigate}
                    cartCount={cartCount}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCartByProduct}
                    isInCart={isInCart}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                  />
                );

              case "favorites":
                return (
                  <FavoritesPage
                    onNavigate={navigate}
                    cartCount={cartCount}
                    favoriteIds={favorites}
                    onToggleFavorite={toggleFavorite}
                    onRemoveFavorite={removeFavoriteById}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCartByProduct}
                    isInCart={isInCart}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                  />
                );

              case "product":
                return (
                  <ProductPage
                    productId={route.id}
                    onNavigate={navigate}
                    onAddToCart={addToCart}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                  />
                );

              case "notifications":
                return (
                  <NotificationsPage
                    onNavigate={navigate}
                    cartCount={cartCount}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                  />
                );

              case "checkout":
                return (
                  <CheckoutPage
                    onNavigate={navigate}
                    cart={cart}
                    onIncrement={increment}
                    onDecrement={decrement}
                    onRemove={remove}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                  />
                );

              case "success":
                return <OrderSuccessPage onNavigate={navigate} />;

              default:
                return (
                  <HomePage
                    onNavigate={navigate}
                    cartCount={cartCount}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCartByProduct}
                    isInCart={isInCart}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    isDark={isDark}
                    onToggleTheme={toggleTheme}
                  />
                );
            }
          })()}
        </motion.div>
      </AnimatePresence>

      <FloatingCartButton
        visible={showFloating && !cartOpen}
        count={cartCount}
        onClick={() => setCartOpen(true)}
      />

      <CartSheet
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={remove}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/checkout");
        }}
      />
    </>
  );
}

export default App;