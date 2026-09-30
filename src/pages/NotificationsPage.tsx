import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
  cartCount?: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function NotificationsPage({
  onNavigate,
  cartCount = 0,
  isDark,
  onToggleTheme,
}: NotificationsPageProps) {
  // ===== SERVER: NOTIFICATIONS =====
  const notifications = [
    {
      id: "1",
      title: "عرض جديد متاح",
      message: "خصم خاص على مجموعة الشتاء لفترة محدودة.",
      time: "منذ 10 دقائق",
      unread: true,
    },
    {
      id: "2",
      title: "منتج جديد",
      message: "تمت إضافة منتجات جديدة إلى المتجر.",
      time: "منذ ساعتين",
      unread: false,
    },
    {
      id: "3",
      title: "مرحبًا بك",
      message: "نتمنى لك تجربة تسوق ممتعة.",
      time: "اليوم",
      unread: false,
    },
  ];
  // ===== END SERVER: NOTIFICATIONS =====

  return (
    <main className="min-h-[100dvh] bg-background">
      <Header
        storeName="الإشعارات"
        notificationCount={2}
        cartCount={cartCount}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onCartClick={() => onNavigate("/checkout")}
      />

      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[var(--page-padding-mobile)] pb-[calc(var(--bottom-nav-height)+2rem)] pt-6 md:px-[var(--page-padding-tablet)] lg:px-[var(--page-padding-desktop)]">
        <section className="mb-6">
          <p className="text-sm text-muted">
            آخر التحديثات
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            الإشعارات
          </h1>
        </section>

        <section className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
          {notifications.map((notification, index) => (
            <article
              key={notification.id}
              className={[
                "flex gap-3 px-4 py-4",
                index !== notifications.length - 1
                  ? "border-b border-border"
                  : "",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                  notification.unread
                    ? "bg-primary"
                    : "bg-border-strong",
                ].join(" ")}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    {notification.title}
                  </h2>

                  <span className="shrink-0 text-[11px] text-muted">
                    {notification.time}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {notification.message}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>

      <BottomNav
        active="notifications"
        notificationCount={2}
        cartCount={cartCount}
        shifted={cartCount > 0}
        onNavigate={(id) => {
          if (id === "home") onNavigate("/store");
          if (id === "favorites") onNavigate("/favorites");
          if (id === "notifications") onNavigate("/notifications");
          if (id === "cart") onNavigate("/checkout");
        }}
      />
    </main>
  );
}