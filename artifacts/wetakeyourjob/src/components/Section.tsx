import { type ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  center?: boolean;
}

export default function Section({ id, eyebrow, title, subtitle, children, className = '', center }: SectionProps) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`} data-testid={`section-${id || 'default'}`}>
      <div className="wrap">
        {(eyebrow || title || subtitle) && (
          <div className={`mb-14 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
            {eyebrow && <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-400">{eyebrow}</p>}
            {title && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-4 text-lg text-slate-500 leading-relaxed">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
