export default function BenefitCard({ title, index }: { title: string; index: number }) {
  return (
    <article data-testid={`benefit-card-${index}`} className="surface-card p-6 md:p-8 flex flex-col items-start">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-border text-sm font-semibold text-accent shadow-sm mb-4">
        {index}
      </div>
      <h3 className="text-lg font-medium text-accent leading-snug">{title}</h3>
    </article>
  );
}
