import { motion } from "framer-motion";

export interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onChange: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="relative w-full">
      {/* حاوية التمرير الأفقي */}
      <div
        dir="rtl"
        className={[
          "flex w-full gap-2 overflow-x-auto px-4 pb-2 pt-1",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "[-ms-overflow-style:none]",
          "overscroll-x-none",
        ].join(" ")}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={[
                "relative flex shrink-0 items-center justify-center",
                "h-10 rounded-full px-5",
                "text-sm font-medium transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isActive
                  ? "text-inverse"
                  : "bg-surface text-foreground/90 hover:bg-secondary hover:text-foreground border border-border/90 shadow-xs",
              ].join(" ")}
            >
              {/* الخلفية المتحركة للزر النشط */}
              {isActive && (
                <motion.span
                  layoutId="active-category-bg"
                  className="absolute inset-0 rounded-full bg-primary shadow-md"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 34,
                    mass: 0.65,
                  }}
                  style={{
                    willChange: "transform",
                  }}
                />
              )}

              {/* نص الزر (يظهر فوق الخلفية المتحركة) */}
              <span className="relative z-10">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
                }
