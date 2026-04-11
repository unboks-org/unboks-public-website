interface StepCardProps {
  num: string;
  title: string;
  brief: string;
}

export default function StepCard({ num, title, brief }: StepCardProps) {
  return (
    <article data-testid={`step-${num}`} className="flex flex-col">
      <span className="text-xs font-medium text-slate-300 mb-3">{num}</span>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{brief}</p>
    </article>
  );
}
