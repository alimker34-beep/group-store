import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../ui/IconButton";
import { MOTION, TRANSITION } from "../../shared/motion";

type NavId = "home" | "favorites" | "notifications" | "cart";

interface BottomNavProps {
  active?: NavId;
  cartCount?: number;
  notificationCount?: number;
  shifted?: boolean;
  onNavigate?: (id: NavId) => void;
}

interface NavItem {
  id: NavId;
  label: string;
  icon: ReactNode;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-9Z" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5h2l2.1 10.2a2 2 0 0 0 2 1.6h6.8a2 2 0 0 0 2-1.6L20 8H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

export function BottomNav({
  active = "home",
  cartCount = 0,
  notificationCount = 0,
  shifted = false,
  onNavigate,
}: BottomNavProps) {
  const items: NavItem[] = [
    { id: "home", label: "الرئيسية", icon: <HomeIcon /> },
    { id: "favorites", label: "المفضلة", icon: <HeartIcon /> },
    { id: "notifications", label: "التنبيهات", icon: <BellIcon /> },
    { id: "cart", label: "السلة", icon: <CartIcon /> },
  ];

  return (
    <nav
      className={[
        "fixed inset-x-0 bottom-4 z-[var(--z-sticky)] flex px-4 md:hidden pointer-events-none",
        "transition-[transform] duration-[var(--motion-slow)] ease-[var(--ease-emphasized)]",
        shifted ? "justify-start" : "justify-center",
      ].join(" ")}
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-neutral-900/60 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300">
        {items.map((item) => {
          const isActive = active === item.id;
          const count =
            item.id === "cart"
              ? cartCount
              : item.id === "notifications"
                ? notificationCount
                : 0;

          return (
            <div key={item.id} className="relative">
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={TRANSITION.normal}
              >
                <IconButton
                  label={item.label}
                  size="lg"
                  variant="ghost"
                  onClick={() => onNavigate?.(item.id)}
                  className={[
                    "!size-12 rounded-full border-0 relative overflow-hidden",
                    isActive
                      ? "!text-white shadow-md ring-1 ring-white/20"
                      : "!text-white/70 hover:!text-white",
                  ].join(" ")}
                >
                  {/* الخلفية المتحركة بين الأيقونات */}
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 rounded-full bg-black"
                      transition={{
                        duration: MOTION.smooth,
                        ease: MOTION.ease,
                      }}
                    />
                  )}

                  {/* التوهج عند الـ hover (غير النشط) */}
                  {!isActive && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/0"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      transition={TRANSITION.fast}
                    />
                  )}

                  <span className="relative z-10">{item.icon}</span>
                </IconButton>
              </motion.div>

              {count > 0 && (
                <span className="pointer-events-none absolute -top-1 -right-1 z-10 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-neutral-900 shadow-sm animate-pulse">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}