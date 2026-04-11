import React from 'react';

export default function Badge({ children, className = '', 'data-testid': testId }: { children: React.ReactNode; className?: string; 'data-testid'?: string }) {
  return (
    <span
      data-testid={testId || 'badge'}
      className={`inline-flex items-center rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent border border-border ${className}`}
    >
      {children}
    </span>
  );
}
