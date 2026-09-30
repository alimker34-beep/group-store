import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Header } from "../components/layout/Header";
import { MOTION } from "../shared/motion";
import type { CartItem } from "../components/cart/types";

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  cart: CartItem[];
  onIncrement: (key: string) => void;
  onDecrement: (key: string) => void;
  onRemove: (key: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function CheckoutPage({
  onNavigate,
  cart,
  onIncrement,
  onDecrement,
  onRemove,
  isDark,
  onToggleTheme,
}: CheckoutPageProps) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-[100dvh] bg-background">
      <Header
        storeName="السلة"
        cartCount={cart.length}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      <div className="mx-auto w-full max-w-2xl px-[var(--page-padding-mobile)] pb-8 pt-6 md:px-[var(--page-padding-tablet)] lg:px-[var(--page-padding-desktop)]">
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.smooth, ease: MOTION.ease }}
        >
          <p className="text-sm text-muted">راجع طلبك قبل المتابعة</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            إتمام الطلب
          </h1>
        </motion.section>

        {cart.length === 0 ? (
          <section className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted">السلة فارغة</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => onNavigate("/store")}>تصفح المنتجات</Button>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            <AnimatePresence initial={false}>
            {cart.map((item) => {
              const summary = Object.entries(item.selections)
                .filter(([_, v]) => v && v !== "1")
                .map(([_, v]) => v)
                .join(" · ");

              return (
                <motion.article
                  key={item.key}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{
                    duration: MOTION.normal,
                    ease: MOTION.ease,
                  }}
                  className="flex gap-4 border-b border-border p-4"
                >
                  <div className="size-24 shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-surface-muted">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-foreground">
                      {item.product.name}
                    </h2>

                    {summary ? (
                      <p className="mt-1 text-xs text-muted">{summary}</p>
                    ) : null}

                    <p className="mt-4 text-sm font-semibold text-price">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between">
                    <div className="flex items-center rounded-full border border-border bg-surface">
                      <button
                        type="button"
                        aria-label="تقليل الكمية"
                        onClick={() => onDecrement(item.key)}
                        className="flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-xs font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="زيادة الكمية"
                        onClick={() => onIncrement(item.key)}
                        className="flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemove(item.key)}
                      className="text-[10px] text-muted transition-colors hover:text-danger"
                    >
                      إزالة
                    </button>
                  </div>
                </motion.article>
              );
            })}
            </AnimatePresence>

            <div className="space-y-3 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">المجموع</span>
                <span className="font-medium text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted">التوصيل</span>
                <span className="font-medium text-success">مجاني</span>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">الإجمالي</span>
                  <span className="text-xl font-semibold text-price">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {cart.length > 0 ? (
          <div className="mt-5">
            <Button
              type="button"
              size="lg"
              fullWidth
              onClick={() => onNavigate("/success")}
            >
              تأكيد الطلب
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}