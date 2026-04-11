import React from 'react';

export default function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-glow/20 bg-glow/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-glow ${className}`}
    >
      {children}
    </span>
  );
}
