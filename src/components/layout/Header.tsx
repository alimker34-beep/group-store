import { IconButton } from "../ui/IconButton";
import ResponsiveImage from "../ui/ResponsiveImage";

interface HeaderProps {
  notificationCount?: number;
  avatarUrl?: string;
  isDark?: boolean;
  hasUnseenStory?: boolean;
  storyBadgeText?: string;
  onToggleTheme?: () => void;
  onProfileStoryClick?: () => void;
  onNotificationsClick?: () => void;
}

// أيقونة الهلال المطفية
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 transition-transform duration-300 group-hover:-rotate-12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// أيقونة الشمس المطفية
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-amber-500 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
    </svg>
  );
}

// أيقونة الجرس النحيفة
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  );
}

export function Header({
  notificationCount = 2,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  isDark = false,
  hasUnseenStory = true,
  storyBadgeText = "حالة اليوم",
  onToggleTheme,
  onProfileStoryClick,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-header)] pt-2 pb-1 bg-gradient-to-b from-background via-background/90 to-transparent backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6">
        
        {/* 1. القصة المنحوتة بجانبها كبسولة تفاعلية في الجانب الأيمن */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onProfileStoryClick}
            aria-label="مشاهدة القصة"
            className="group flex items-center gap-2.5 rounded-full bg-surface/60 p-1.5 pl-4 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:bg-surface/90 hover:shadow-md active:scale-95"
          >
            {/* إطار الأفاتار مع حلقة النبض الفخمة */}
            <div className="relative flex size-10 shrink-0 items-center justify-center">
              {hasUnseenStory && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-500 opacity-75 blur-[2px] animate-pulse" />
              )}
              
              <div
                className={`relative size-full rounded-full p-[2px] transition-all duration-300 ${
                  hasUnseenStory
                    ? "bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500"
                    : "bg-border/40"
                }`}
              >
                <div className="size-full overflow-hidden rounded-full bg-background p-[1.5px]">
                  <div className="size-full overflow-hidden rounded-full bg-muted">
                    <ResponsiveImage
                      src={avatarUrl}
                      alt="قصة المتجر"
                      priority={true}
                      decoding="async"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>

              {/* شارة حية صغيرة بداخل الأفاتار */}
              {hasUnseenStory && (
                <span className="absolute -top-0.5 -right-0.5 flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-rose-500 ring-2 ring-background" />
                </span>
              )}
            </div>

            {/* النص داخل الكبسولة المنحوتة */}
            <div className="flex flex-col text-right">
              <span className="text-[12px] font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                {storyBadgeText}
              </span>
              <span className="mt-1 text-[9px] font-medium text-muted-foreground/80 leading-none">
                {hasUnseenStory ? "🔥 شاهد العرض الحصري" : "تمت المشاهدة"}
              </span>
            </div>
          </button>
        </div>

        {/* 2. أزرار دائرية مطفية مطعمة بالظلال (Matte Floating Buttons) */}
        <div className="flex items-center gap-2.5">
          
          {/* زر الوضع الليلي/النهاري الدائري المطفي */}
          <IconButton
            label={isDark ? "الوضع النهاري" : "الوضع الليلي"}
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="group size-10 rounded-full bg-surface/60 border border-white/10 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-2xl transition-all duration-300 hover:bg-surface hover:scale-105 active:scale-95"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </IconButton>

          {/* زر الجرس الدائري المطفي مع شارة الإشعارات */}
          <div className="relative">
            <IconButton
              label="الإشعارات"
              variant="ghost"
              size="sm"
              onClick={onNotificationsClick}
              className="group size-10 rounded-full bg-surface/60 border border-white/10 dark:border-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-2xl transition-all duration-300 hover:bg-surface hover:scale-105 active:scale-95"
            >
              <BellIcon />
            </IconButton>

            {/* شارة الإشعارات المنحوتة بدقة */}
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-background shadow-sm">
                {notificationCount > 9 ? "+9" : notificationCount}
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
