import { type ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-20" data-testid="page-header">
      <div className="wrap max-w-3xl">
        {eyebrow && <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">{eyebrow}</p>}
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl leading-[1.1]">{title}</h1>
        {subtitle && <p className="mt-5 text-lg text-slate-500 leading-relaxed">{subtitle}</p>}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
