import { IconButton } from "../ui/IconButton";
import ResponsiveImage from "../ui/ResponsiveImage";

interface HeaderProps {
  storeName?: string;
  notificationCount?: number;
  cartCount?: number;
  avatarUrl?: string;
  storyUrl?: string;
  storyCount?: number;
  hasNewStory?: boolean;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onProfileClick?: () => void;
  onStoryClick?: () => void;
  onNotificationsClick?: () => void;
  onCartClick?: () => void;
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 transition-transform duration-300 hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-amber-500 transition-transform duration-300 rotate-90 hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  );
}

export function Header({
  notificationCount = 0,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  storyUrl = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80",
  storyCount = 0,
  hasNewStory = true,
  isDark = false,
  onToggleTheme,
  onProfileClick,
  onStoryClick,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] bg-background/88 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--content-max-width)] items-center justify-between gap-2 px-3.5 sm:px-4">

        {/* 1. Avatar المتجر (يمين في RTL) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="صورة المتجر"
            className="group relative size-11 shrink-0 rounded-full p-[2px] ring-2 ring-primary/80 transition-all duration-300 hover:ring-primary active:scale-95 shadow-sm"
          >
            <div className="size-full overflow-hidden rounded-full bg-surface">
              <ResponsiveImage
                src={avatarUrl}
                alt="المتجر"
                priority={true}
                decoding="async"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </button>
        </div>

        {/* 2. القصة (يسار في RTL) — شريط منحوت + قصة واحدة */}
        <button
          type="button"
          onClick={onStoryClick}
          aria-label="عرض قصة اليوم"
          className="group relative flex items-center gap-2.5 transition-transform duration-300 active:scale-[0.97]"
        >
          {/* النص: "قصة اليوم" + مؤشر */}
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-medium text-muted">
              قصة اليوم
            </span>
            <span className="mt-0.5 text-[11px] font-semibold text-foreground">
              عرض خاص 🔥
            </span>
          </div>

          {/* الشريط المنحوت + القصة */}
          <div className="relative">
            {/* الحلقة الخارجية: إطار متدرج متحرك (Gradient ring) */}
            {hasNewStory ? (
              <span
                aria-hidden
                className="absolute -inset-[3px] rounded-full opacity-90 blur-[0.5px] animate-[storySpin_4s_linear_infinite]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #f59e0b, #ec4899, #8b5cf6, #06b6d4, #f59e0b)",
                }}
              />
            ) : (
              <span
                aria-hidden
                className="absolute -inset-[3px] rounded-full bg-border"
              />
            )}

            {/* الطبقة الفاصلة (خلفية الصفحة) — تعطي "حفر" بصري */}
            <span
              aria-hidden
              className="absolute -inset-[1px] rounded-full bg-background"
            />

            {/* الإطار الداخلي: القصة */}
            <div className="relative size-11 overflow-hidden rounded-full bg-surface">
              <ResponsiveImage
                src={storyUrl}
                alt="قصة اليوم"
                priority={true}
                decoding="async"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
              />
            </div>

            {/* شارة عدد القصص (اختياري) */}
            {storyCount > 1 ? (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background ring-2 ring-background">
                {storyCount > 9 ? "9+" : storyCount}
              </span>
            ) : null}
          </div>
        </button>

        {/* 3. كبسولة الثيم + الجرس (وسط البصري) */}
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

      </div>
    </header>
  );
            }
