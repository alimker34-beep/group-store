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
    <header className="sticky top-0 z-[var(--z-header)] bg-[var(--header-surface)] pt-3 pb-8 px-4">
      <div className="mx-auto flex h-14 max-w-[var(--content-max-width)] items-center justify-between">
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
            [2] القصة فقط (بدون كبسولة) — بحجم أكبر
            ===================================================== */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="عرض قصة المتجر"
            className="group flex items-center outline-none"
          >
            {/* Story — تم تكبيرها إلى 52px */}
            <span
              className={[
                "relative flex size-[52px] shrink-0 items-center justify-center rounded-full",
                "bg-[conic-gradient(from_180deg,#e0f2fe,#bae6fd,#7dd3fc,#e0f2fe)]",
                "p-[2px]",
                "shadow-[0_0_0_1px_rgba(186,230,253,0.15)]",
                "transition-transform duration-200",
                "group-hover:scale-[1.03]",
                "group-active:scale-95",
              ].join(" ")}
            >
              {/* Outer soft pulse */}
              <span
                aria-hidden
                className={[
                  "absolute -inset-[2px] rounded-full",
                  "border border-sky-200/30",
                  "opacity-0",
                  "group-hover:opacity-100",
                  "transition-opacity duration-300",
                ].join(" ")}
              />

              {/* Image */}
              <span className="relative flex size-full items-center justify-center rounded-full bg-background p-[2px]">
                <span className="size-full overflow-hidden rounded-full">
                  <ResponsiveImage
                    src={avatarUrl}
                    alt="قصة المتجر"
                    priority={true}
                    decoding="async"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
      }
