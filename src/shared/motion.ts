/* =========================================================
   MOTION — قيم موحّدة لكل أنيميشنات المشروع
   ========================================================= */

export const MOTION = {
  /* Durations (seconds — Framer Motion uses seconds) */
  fast: 0.12,
  normal: 0.22,
  smooth: 0.28,
  slow: 0.4,
  page: 0.34,
} as const;

/* Easing tuned for compositor-friendly feel (use transform + opacity) */
export const EASING = {
  emph: [0.16, 1, 0.3, 1] as const,
  standard: [0.2, 0, 0, 1] as const,
} as const;

/* TRANSITION factory that respects reduced-motion */
function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
    );
  } catch {
    return false;
  }
}

export function transitionFor(key: keyof typeof MOTION) {
  const reduced = prefersReducedMotion();
  const base = MOTION[key];
  return {
    duration: reduced ? Math.min(0.08, base) : base,
    ease: EASING.emph,
  };
}

export const TRANSITION = {
  fast: transitionFor("fast"),
  normal: transitionFor("normal"),
  smooth: transitionFor("smooth"),
  slow: transitionFor("slow"),
  page: transitionFor("page"),
} as const;

/* VARIANTS — keep transforms (translate/scale) and opacity only. */
export const VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  sheetFade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  riseUp: {
    initial: { y: 18, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 12, opacity: 0 },
  },

  card: {
    initial: { y: 12, opacity: 0, scale: 0.992 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 8, opacity: 0, scale: 0.992 },
  },

  pageSlide: {
    initial: { x: 24, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -24, opacity: 0 },
  },
} as const;

/* Export helper — components can call to quickly check reduced-motion. */
export function isReducedMotion() {
  return prefersReducedMotion();
     }
