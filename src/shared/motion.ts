/* =========================================================
   MOTION — قيم موحّدة لكل أنيميشنات المشروع
   ========================================================= */

export const MOTION = {
  /* Durations (بالثواني — لأن Framer Motion يستخدم ثواني) */
  fast: 0.16,
  normal: 0.24,
  smooth: 0.36,
  slow: 0.5,
  page: 0.42,

  /* Easing */
  ease: [0.16, 1, 0.3, 1] as const,        // easeOutExpo ناعم
  easeStandard: [0.2, 0, 0, 1] as const,   // مطابق لـ --ease-standard
  easeSoft: [0.25, 1, 0.5, 1] as const,    // أشد نعومة
} as const;

/* انتقالات جاهزة */
export const TRANSITION = {
  fast: { duration: MOTION.fast, ease: MOTION.ease },
  normal: { duration: MOTION.normal, ease: MOTION.ease },
  smooth: { duration: MOTION.smooth, ease: MOTION.ease },
  slow: { duration: MOTION.slow, ease: MOTION.ease },
  page: { duration: MOTION.page, ease: MOTION.ease },
} as const;

/* أنماط الدخول/الخروج */
export const VARIANTS = {
  /* ظهور عام */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  /* ظهور + انزلاق من الأسفل (للـ Sheets) */
  sheetUp: {
    initial: { y: "100%", opacity: 0.6 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0.4 },
  },

  /* ظهور + انزلاق من الأسفل (للأقسام) */
  riseUp: {
    initial: { y: 22, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 12, opacity: 0 },
  },

  /* ظهور + انزلاق ناعم (للبطاقات) */
  card: {
    initial: { y: 14, opacity: 0, scale: 0.985 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 8, opacity: 0, scale: 0.985 },
  },

  /* انزلاق أفقي (للصفحات) */
  pageSlide: {
    initial: { x: 28, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -28, opacity: 0 },
  },
} as const;