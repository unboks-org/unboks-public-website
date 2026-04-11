import React from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Section({ id, eyebrow, title, description, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="container-shell">
        {(eyebrow || title || description) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow ? (
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-glow">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2> : null}
            {description ? <p className="mt-4 text-base leading-7 text-slate-300">{description}</p> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
