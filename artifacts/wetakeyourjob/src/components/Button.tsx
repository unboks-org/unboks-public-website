import React from 'react';
import { Link } from 'react-router-dom';

const variants: Record<string, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover shadow-sm',
  secondary:
    'bg-surface text-accent hover:bg-border/50 border border-border',
  ghost: 'text-slate-600 hover:text-accent hover:bg-surface',
};

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  variant?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'data-testid'?: string;
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  'data-testid': testId,
  ...props
}: ButtonProps) {
  const shared =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-accent';

  if (to) {
    return (
      <Link data-testid={testId || `button-link-${to.replace(/[^a-zA-Z0-9]/g, '')}`} to={to} className={`${shared} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a data-testid={testId || 'button-href'} href={href} className={`${shared} ${variants[variant]} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button data-testid={testId || 'button'} className={`${shared} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
