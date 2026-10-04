import { IconButton } from "../ui/IconButton";
import ResponsiveImage from "../ui/ResponsiveImage";

interface HeaderProps {
  storeName?: string;
  notificationCount?: number;
  avatarUrl?: string;
  isDark?: boolean;
  hasUnseenStory?: boolean; // هل توجد قصة جديدة غير مشاطرة؟
  storyTitle?: string; // عنوان القصة السريع (مثلاً: "عرض اليوم")
  onToggleTheme?: () => void;
  onProfileStoryClick?: () => void; // عند الضغط لفتح القصة الواحدة
  onNotificationsClick?: () => void;
}

// أيقونة الهلال
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 transition-transform duration-300 hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// أيقونة الشمس
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-amber-500 transition-transform duration-300 rotate-90 hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
    </svg>
  );
}

// أيقونة الجرس
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
  hasUnseenStory = true,
  storyTitle = "عرض اليوم 🔥",
  onToggleTheme,
  onProfileStoryClick,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] bg-background/85 backdrop-blur-md transition-colors duration-300 will-change-transform border-b border-border/40">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--content-max-width)] items-center justify-between px-3.5 sm:px-4">
        
        {/* 1. القصة الواحدة الاحترافية والملفتة جداً */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onProfileStoryClick}
            aria-label="مشاهدة القصة والعرض الحصري"
            className="group relative flex items-center gap-2 rounded-full p-0.5 transition-all duration-300 active:scale-95"
          >
            {/* الحلقة المتدرجة المتحركة للقصة (Gradient Ring) */}
            <div
              className={`relative flex size-12 shrink-0 items-center justify-center rounded-full p-[2.5px] transition-all duration-500 ${
                hasUnseenStory
                  ? "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-[0_0_15px_rgba(244,63,94,0.35)] animate-pulse"
                  : "bg-border/60"
              }`}
            >
              {/* الإطار الداخلي الفاصل */}
              <div className="size-full overflow-hidden rounded-full bg-background p-[2px]">
                <div className="size-full overflow-hidden rounded-full bg-surface">
                  <ResponsiveImage
                    src={avatarUrl}
                    alt="قصة المتجر"
                    priority={true}
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* شارة القصة أو البث الحي المدمجة */}
              {hasUnseenStory && (
                <span className="absolute -bottom-1 z-10 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-md ring-2 ring-background">
                  قصة
                </span>
              )}
            </div>

            {/* نص العرض/القصة الفرعي بجانب الأفاتار (يعزز نقر الزبون) */}
            <div className="hidden min-w-0 text-right sm:block">
              <span className="block text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                {storyTitle}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {hasUnseenStory ? "شاهد حالة اليوم" : "تمت المشاهدة"}
              </span>
            </div>
          </button>
        </div>

        {/* 2. الحاوية الكبسولية (الوضع الليلي + زر الجرس) */}
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

          {/* خط فاصل */}
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
