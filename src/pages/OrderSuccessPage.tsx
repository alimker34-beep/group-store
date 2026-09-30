import { Button } from "../components/ui/Button";

interface OrderSuccessPageProps {
  onNavigate: (path: string) => void;
}

export default function OrderSuccessPage({
  onNavigate,
}: OrderSuccessPageProps) {
  return (
    <main className="min-h-[100dvh] bg-background px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col">
        <div className="flex flex-1 items-center justify-center">
          <section className="w-full text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-soft text-3xl text-success">
              ✓
            </div>

            <p className="mt-7 text-sm font-medium text-success">
              تم استلام طلبك
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              شكرًا لطلبك
            </h1>

            <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              تم تسجيل طلبك بنجاح، وسنقوم بالتواصل معك لتأكيد التفاصيل.
            </p>

            <div className="mx-auto mt-6 w-full rounded-[var(--radius-xl)] bg-surface-muted p-4 text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  رقم الطلب
                </span>

                <span className="text-sm font-semibold text-foreground">
                  #GS-1024
                </span>
              </div>
            </div>
          </section>
        </div>

        <Button
          type="button"
          size="lg"
          fullWidth
          onClick={() => onNavigate("/store")}
        >
          العودة إلى المتجر
        </Button>
      </div>
    </main>
  );
}