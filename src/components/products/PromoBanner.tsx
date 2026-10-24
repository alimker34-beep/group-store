import ResponsiveImage from "../ui/ResponsiveImage";

interface PromoBannerProps {
  imageUrl?: string;
  onClick?: () => void;
}

export function PromoBanner({
  imageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=75&fm=webp",
  onClick,
}: PromoBannerProps) {
  return (
    <section
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={[
        "relative min-h-[220px] w-full overflow-hidden rounded-[var(--radius-2xl)] bg-black shadow-xl sm:min-h-[260px]",
        onClick ? "cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]" : "",
      ].join(" ")}
    >
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden [contain:paint]">
        <ResponsiveImage
          src={imageUrl}
          alt="عرض ترويجي"
          priority
          sizes="(max-width: 640px) 100vw, 1280px"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent dir-rtl:bg-gradient-to-l" />
      </div>
    </section>
  );
}
