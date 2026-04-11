interface BenefitCardProps {
  title: string;
  brief: string;
  'data-testid'?: string;
}

export default function BenefitCard({ title, brief, 'data-testid': testId }: BenefitCardProps) {
  return (
    <article data-testid={testId || 'benefit-card'} className="border-t border-slate-100 pt-6">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{brief}</p>
    </article>
  );
}
