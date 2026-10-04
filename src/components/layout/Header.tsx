import { IconButton } from "../ui/IconButton";
import ResponsiveImage from "../ui/ResponsiveImage";

interface HeaderProps {
  storeName?: string;
  notificationCount?: number;
  cartCount?: number;
  avatarUrl?: string;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onCartClick?: () => void;
}

/* =========================================================
   ICONS
   ========================================================= */

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 transition-transform duration-300 hover:-rotate-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-amber-500 transition-transform duration-300 rotate-90 hover:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        strokeLinejoin="round"
      />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

export function Header({
  notificationCount = 0,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  isDark = false,
  onToggleTheme,
  onProfileClick,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] bg-background/88 transition-colors duration-300 will-change-transform">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--content-max-width)] items-center justify-between px-3.5 sm:px-4">
        {/* =====================================================
            [1] الأزرار (الثيم + الإشعارات) — يمين
            ===================================================== */}
        <div className="flex items-center gap-1 rounded-full border border-border/80 bg-surface/90 p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          <IconButton
            label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="size-9 rounded-full hover:bg-secondary/80"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </IconButton>

          <span className="h-5 w-[1px] bg-border/60" />

          <div className="relative">
            <IconButton
              label="الإشعارات والتنبيهات"
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              className="size-9 rounded-full hover:bg-secondary/80"
            >
              <BellIcon />
            </IconButton>

            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger ring-2 ring-background animate-pulse" />
            )}
          </div>
        </div>

        {/* =====================================================
            [2] كبسولة "قصتي" — يسار
            ===================================================== */}
        <button
          type="button"
          onClick={onProfileClick}
          aria-label="عرض قصة المتجر"
          className={[
            "group relative flex items-center gap-2",
            "h-10 rounded-full pl-1 pr-3",
            "border border-border/70 bg-surface/90",
            "shadow-[0_2px_12px_rgba(0,0,0,0.05)]",
            "backdrop-blur-md",
            "transition-all duration-300",
            "hover:border-border hover:bg-surface hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)]",
            "active:scale-[0.97]",
          ].join(" ")}
        >
          {/* حلقة متدرجة حول الصورة */}
          <span
            aria-hidden
            className={[
              "relative flex size-8 items-center justify-center rounded-full",
              "bg-[conic-gradient(from_140deg,var(--theme-primary),var(--theme-danger),var(--theme-warning),var(--theme-primary))]",
              "p-[2px]",
            ].join(" ")}
          >
            {/* حد فاصل رقيق يفصل الحلقة عن الصورة */}
            <span className="flex size-full items-center justify-center rounded-full bg-surface p-[1.5px]">
              <span className="size-full overflow-hidden rounded-full">
                <ResponsiveImage
                  src={avatarUrl}
                  alt="قصة المتجر"
                  priority={true}
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </span>
            </span>
          </span>

          {/* النص */}
          <span className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-medium text-muted">
              جديد
            </span>
            <span className="mt-0.5 text-xs font-semibold text-foreground">
              قصتي
            </span>
          </span>

          {/* سهم الانتقال */}
          <span className="text-muted transition-transform duration-300 group-hover:-translate-x-0.5">
            <ChevronLeftIcon />
          </span>
        </button>
      </div>
    </header>
  );
              }
