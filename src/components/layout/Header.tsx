import { IconButton } from "../ui/IconButton";

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

// أيقونة الهلال (مكبرة ومحسنة)
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 transition-transform duration-300 hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// أيقونة الشمس (مكبرة ومحسنة)
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-amber-500 transition-transform duration-300 rotate-90 hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
    </svg>
  );
}

// أيقونة الجرس (مكبرة ومحسنة)
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
  isDark = false,
  onToggleTheme,
  onProfileClick,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--content-max-width)] items-center justify-between px-3.5 sm:px-4">
        
        {/* 1. الأفاتار المستقل الاحترافي (جاهز لميزة القصص مستقبلاً) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="صورة المتجر والحساب"
            className="group relative size-11 shrink-0 rounded-full p-[2px] ring-2 ring-primary/80 transition-all duration-300 hover:ring-primary active:scale-95 shadow-sm"
          >
            <div className="size-full overflow-hidden rounded-full bg-surface">
              <img
                src={avatarUrl}
                alt="المتجر"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            {/* مؤشر متصل الآن / قصة جديدة مستقبلياً */}
            <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </button>
        </div>

        {/* 2. الحاوية الكبسولية التي تجمع (الوضع الليلي + زر الجرس) */}
        <div className="flex items-center gap-1 rounded-full border border-border/80 bg-surface/90 p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
          {/* زر التبديل بين الوضع الليلي والنهاري */}
          <IconButton
            label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="size-9 rounded-full hover:bg-secondary/80"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </IconButton>

          {/* خط فاصل بين الزرين ليعطي طابع كبسولي متناسق */}
          <span className="h-5 w-[1px] bg-border/60" />

          {/* زر الجرس مع التنبيه */}
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