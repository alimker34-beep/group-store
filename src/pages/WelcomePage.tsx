import { Button } from "../components/ui/Button";

interface WelcomePageProps {
  onContinue: () => void;
}

export default function WelcomePage({ onContinue }: WelcomePageProps) {
  return (
    <main className="min-h-[100dvh] bg-background px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col">
        <div className="flex flex-1 items-center justify-center">
          <section className="w-full text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary text-2xl font-semibold text-inverse shadow-lg">
              GS
            </div>

            <p className="mb-3 text-sm font-medium tracking-wide text-muted">
              GROUP STORE
            </p>

            <h1 className="text-3xl font-semibold leading-tight text-foreground">
              مرحبًا بك في
              <br />
              تجربة تسوق مختلفة
            </h1>

            <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-text-secondary">
              اكتشف منتجاتك بسهولة، تصفح العروض، واختر ما يناسبك في تجربة بسيطة
              وأنيقة.
            </p>
          </section>
        </div>

        <div className="pb-2">
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={onContinue}
          >
            ابدأ التسوق
          </Button>
        </div>
      </div>
    </main>
  );
}