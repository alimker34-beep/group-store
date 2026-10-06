import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// Lenis is optional; keep lazy to avoid loading unless explicitly enabled.
// Toggle via env var or feature flag below.
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

// Feature flag: false by default => prefer native browser scrolling.
// To enable for experiments set VITE_USE_LENIS=true in env (optional).
const FLAG_USE_LENIS = import.meta.env.VITE_USE_LENIS === "true";

type LenisType = any;

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

    // If Lenis is active (optional), use its scrollTo to avoid mismatch.
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      // jump to top immediately without animation when navigating route-change:
      lenis.scrollTo(0, { immediate: true });
    } else {
      // Native jump — keeps pipeline native (best performance)
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* ---------------------------------------------
     SMOOTH SCROLL (Lenis) — optional and controlled
     Default: OFF. Prefer native browser scroll for best compositor behavior.
     If enabled (VITE_USE_LENIS=true), load Lenis lazily and run its RAF.
     --------------------------------------------- */
  useEffect(() => {
    // respect reduced motion: never init Lenis if user requested reduced motion
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    if (!FLAG_USE_LENIS) {
      // Ensure page uses native scroll; do not hijack scroll pipeline.
      return;
    }

    let rafId = 0;
    let lenisInstance: LenisType | null = null;
    let cancelled = false;

    // Lazy import so the library is not part of initial JS if not used.
    (async () => {
      try {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;

        lenisInstance = new Lenis({
          duration: 1.05,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
        });

        const frame = (time: number) => {
          if (!lenisInstance) return;
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);

        // store to window for debugging/optional use
        (window as any).__lenis = lenisInstance;
      } catch (err) {
        // fail gracefully: continue with native scrolling
        // console.warn("Lenis failed to load:", err);
      }
    })();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      // if lenisInstance exists it will be garbage-collected, or caller may provide destroy.
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.destroy === "function") {
        lenis.destroy();
        delete (window as any).__lenis;
      }
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
      <AnimatePresence initial={false}>
        <motion.div
          key={routeKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: {
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
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
