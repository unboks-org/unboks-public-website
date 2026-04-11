import Button from './Button';

interface CTAProps {
  title: string;
  description: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
}

export default function CTASection({ title, description, primary, secondary }: CTAProps) {
  return (
    <section className="py-24 sm:py-32" data-testid="cta-section">
      <div className="layout-container">
        <div className="surface-card relative overflow-hidden px-6 py-16 sm:px-16 sm:py-24 text-center flex flex-col items-center">
          <h2 className="text-3xl font-semibold sm:text-5xl max-w-3xl leading-tight text-accent tracking-tight">{title}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl">{description}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button to={primary.to}>{primary.label}</Button>
            <Button to={secondary.to} variant="secondary">
              {secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
