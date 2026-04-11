import React from 'react';
import Badge from './Badge';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ badge, title, description, actions }: PageHeaderProps) {
  return (
    <section className="container-shell pt-28 pb-16 sm:pt-32">
      <div className="panel relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow/60 to-transparent" />
        {badge ? <Badge className="mb-6">{badge}</Badge> : null}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
        </div>
        {actions ? <div className="mt-8 flex flex-wrap gap-4">{actions}</div> : null}
      </div>
    </section>
  );
}
