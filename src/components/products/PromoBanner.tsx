import { Button } from "../ui/Button";
import ResponsiveImage from "../ui/ResponsiveImage";

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  imageUrl?: string;
  badgeText?: string;
  onAction?: () => void;
}

export function PromoBanner({
  title = "خصم 50% على الجاكيتات",
  subtitle = "لفترة محدودة فقط - استمتع بأفضل العروض الشتوية",
  buttonLabel = "تصفح العرض",
  badgeText = "اليوم فقط",
  imageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85",
  onAction,
}: PromoBannerProps) {
  return (
    <section className="relative min-h-[220px] w-full overflow-hidden rounded-[var(--radius-2xl)] bg-neutral-900 shadow-xl transition-all duration-300 sm:min-h-[260px] content-auto">
      {/* 1. خلفية الصورة الممتدة بالكامل باحترافية */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <ResponsiveImage
          src={imageUrl}
          alt={title}
          priority={true}
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-out will-change-transform"
        />

        {/* 2. طبقات التدرج الضوئي لتأمين تباين النصوص بالكامل (Dark Overlay with Directional Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent dir-rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* 3. حاوية المحتوى الذكية بداخل مساحة احترافية */}
      <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-center px-6 py-6 sm:min-h-[260px] sm:px-10 sm:py-8 max-w-[85%] sm:max-w-[65%] md:max-w-[55%]">
        {/* الشارة العلوية متكيفة التباين */}
        {badgeText && (
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md border border-white/20">
            {badgeText}
          </span>
        )}

        {/* 4. معالجة العنوان وحجم النص للوقاية من التشوّه (Text Clamping & Adaptive Drop Shadows) */}
        <h2 className="text-xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl line-clamp-2 [text-shadow:_0_1px_12px_rgba(0,0,0,0.6)]">
          {title}
        </h2>

        {/* النص الفرعي */}
        {subtitle && (
          <p className="mt-2 text-xs font-medium text-gray-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-sm line-clamp-2">
            {subtitle}
          </p>
        )}

        {/* 5. الزر الزجاجي الذكي التكيّفي (Adaptive Glassmorphic Button) */}
        <div className="mt-5">
          <Button
            size="sm"
            onClick={onAction}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-white/30 bg-white/20 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-black active:scale-95"
          >
            {/* لمعان خفيف خلف الزر */}
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
      }
