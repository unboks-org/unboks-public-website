import { type ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  'data-testid'?: string;
}

export default function InfoCard({ title, description, icon, 'data-testid': testId }: InfoCardProps) {
  return (
    <article data-testid={testId || `card-${title.replace(/\W/g, '')}`} className="rounded-2xl border border-slate-100 bg-white p-6">
      {icon && <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
    </article>
  );
}
