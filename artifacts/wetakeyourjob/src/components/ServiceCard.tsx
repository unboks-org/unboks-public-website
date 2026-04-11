import { type ReactNode } from 'react';

interface ServiceCardProps {
  title: string;
  brief: string;
  icon?: ReactNode;
}

export default function ServiceCard({ title, brief, icon }: ServiceCardProps) {
  return (
    <article data-testid={`service-${title.replace(/\W/g, '')}`} className="rounded-2xl border border-slate-100 bg-white p-6 hover:border-slate-200 transition-colors">
      {icon && <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{brief}</p>
    </article>
  );
}
