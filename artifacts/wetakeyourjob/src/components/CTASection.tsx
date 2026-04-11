import Button from './Button';

interface CTAProps {
  title: string;
  subtitle?: string;
}

export default function CTASection({ title, subtitle }: CTAProps) {
  return (
    <section className="py-24 sm:py-32 border-t border-slate-100" data-testid="cta-section">
      <div className="wrap text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">{subtitle}</p>}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button to="/contact">Get started</Button>
          <Button to="/services" variant="secondary">Learn more</Button>
        </div>
      </div>
    </section>
  );
}
