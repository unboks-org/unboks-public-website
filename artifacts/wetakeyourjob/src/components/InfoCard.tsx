import React from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function InfoCard({ title, description, icon, className = '' }: InfoCardProps) {
  return (
    <article className={`panel h-full p-6 ${className}`}>
      {icon ? (
        <div className="mb-4 inline-flex rounded-2xl border border-glow/20 bg-glow/10 p-3 text-glow">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7">{description}</p>
    </article>
  );
}
