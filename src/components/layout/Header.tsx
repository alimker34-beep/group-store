import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "../ui/IconButton";
import ResponsiveImage from "../ui/ResponsiveImage";

export interface StoreStory {
  id: string;
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface HeaderProps {
  storeName?: string;
  notificationCount?: number;
  cartCount?: number;
  avatarUrl?: string;
  isDark?: boolean;
  stories?: StoreStory[];
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
   STORY VIEWER
   ========================================================= */

function StoryViewer({
  avatarUrl,
  stories,
  onClose,
}: {
  avatarUrl: string;
  stories: StoreStory[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const hasStories = stories.length > 0;
  const story = stories[index];

  // عزل السكرول تماماً أثناء فتح القصة
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (hasStories && event.key === "ArrowRight") {
        setIndex((current) => Math.max(0, current - 1));
      }

      if (hasStories && event.key === "ArrowLeft") {
        setIndex((current) =>
          Math.min(stories.length - 1, current + 1)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStories, stories.length, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/55 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* خلفية زجاجية ضبابية وناعمة (Frosted Glass) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={avatarUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-150 object-cover blur-[70px] opacity-50"
        />
        <div className="absolute inset-0 bg-background/30 backdrop-blur-2xl" />
      </div>

      {/* زر الإغلاق */}
      <button
        type="button"
        aria-label="إغلاق القصة"
        onClick={onClose}
        className="absolute right-5 top-6 z-20 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-3xl text-white backdrop-blur-xl transition hover:bg-white/20"
      >
        ×
      </button>

      {!hasStories ? (
        /* لا توجد قصة: عرض الأفتار في المنتصف */
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.82, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="rounded-full bg-gradient-to-br from-sky-300 via-blue-400 to-violet-400 p-[3px] shadow-2xl shadow-black/30">
            <div className="rounded-full bg-white p-[4px]">
              <img
                src={avatarUrl}
                alt="صورة المتجر"
                className="size-36 rounded-full object-cover sm:size-44"
              />
            </div>
          </div>

          <span className="text-sm font-medium text-white/90">
            صورة المتجر
          </span>
        </motion.div>
      ) : (
        /* توجد قصة: عارض صورة أو فيديو */
        <motion.div
          className="relative z-10 h-[min(82dvh,760px)] w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28 }}
          onClick={(event) => event.stopPropagation()}
        >
          {/* مؤشرات القصص */}
          <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
            {stories.map((item, itemIndex) => (
              <div
                key={item.id}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"
              >
                <div
                  className={[
                    "h-full rounded-full bg-white",
                    itemIndex <= index ? "w-full" : "w-0",
                  ].join(" ")}
                />
              </div>
            ))}
          </div>

          {/* رأس القصة */}
          <div className="absolute left-3 right-3 top-7 z-20 flex items-center gap-2">
            <img
              src={avatarUrl}
              alt=""
              className="size-9 rounded-full border border-white/70 object-cover"
            />
            <span className="text-sm font-semibold text-white">
              قصة المتجر
            </span>
          </div>

          {/* محتوى القصة */}
          {story.type === "video" ? (
            <video
              key={story.id}
              src={story.src}
              autoPlay
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              key={story.id}
              src={story.src}
              alt={story.alt ?? "قصة المتجر"}
              className="h-full w-full object-contain"
            />
          )}

          {/* التنقل بين القصص */}
          <div className="absolute inset-y-16 left-0 right-0 z-10 flex">
            <button
              type="button"
              aria-label="القصة السابقة"
              className="h-full w-1/3"
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            />
            <div className="flex-1" />
            <button
              type="button"
              aria-label="القصة التالية"
              className="h-full w-1/3"
              onClick={() => {
                if (index < stories.length - 1) {
                  setIndex((current) => current + 1);
                } else {
                  onClose();
                }
              }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* =========================================================
   HEADER
   ========================================================= */

export function Header({
  notificationCount = 0,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  isDark = false,
  stories = [],
  onToggleTheme,
  onProfileClick,
  onNotificationsClick,
}: HeaderProps) {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  return (
    <header className="w-full bg-transparent px-4 pt-3 pb-6 relative">
      <div className="mx-auto flex h-14 max-w-[var(--content-max-width)] items-center justify-between">
        {/* =====================================================
            [1] الأزرار — يمين
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

          <span className="h-5 w-px bg-border/60" />

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

        {/* STORY */}
        <div className="relative z-10 flex translate-y-1">
          <button
            type="button"
            onClick={() => {
              setIsStoryOpen(true);
              onProfileClick?.();
            }}
            aria-label="عرض قصة المتجر"
            className="group flex items-center outline-none select-none"
          >
            <span className="relative flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_180deg,#e0f2fe,#7dd3fc,#38bdf8,#93c5fd,#e0f2fe)] p-[2px] shadow-[0_0_0_1px_rgba(56,189,248,0.12)] transition-transform duration-300 ease-out group-hover:scale-[1.04] group-active:scale-95">
              <span className="flex size-full items-center justify-center rounded-full bg-background p-[2px]">
                <span className="size-full overflow-hidden rounded-full">
                  <ResponsiveImage
                    src={avatarUrl}
                    alt="قصة المتجر"
                    priority={true}
                    decoding="async"
                    className="size-full object-cover"
                  />
                </span>
              </span>
            </span>
          </button>
        </div>

        {/* Story modal */}
        <AnimatePresence>
          {isStoryOpen && (
            <StoryViewer
              avatarUrl={avatarUrl}
              stories={stories}
              onClose={() => setIsStoryOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
