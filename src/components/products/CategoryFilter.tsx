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
    <div className="relative w-full overflow-hidden">
      {/* التدرج الجانبي لإعطاء إيحاء بوجود المزيد من الأزرار */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#f0f2f5] to-transparent dark:from-background" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#f0f2f5] to-transparent dark:from-background" />

      {/* حاوية التمرير الأفقي */}
      <div
        dir="rtl"
        className="flex w-full gap-2 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                "text-sm font-medium transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isActive
                  ? "text-inverse"
                  : "bg-surface text-muted hover:bg-secondary hover:text-foreground border border-border/50",
              ].join(" ")}
            >
              {/* الخلفية المتحركة للزر النشط */}
              {isActive && (
                <motion.span
                  layoutId="active-category-bg"
                  className="absolute inset-0 rounded-full bg-primary shadow-md"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
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
