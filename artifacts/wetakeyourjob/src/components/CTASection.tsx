import Button from './Button';

interface CTAProps {
  title: string;
  description: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
}

export default function CTASection({ title, description, primary, secondary }: CTAProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-shell">
        <div className="panel relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(54,209,255,0.14),transparent_28%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button to={primary.to}>{primary.label}</Button>
              <Button to={secondary.to} variant="secondary">
                {secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
