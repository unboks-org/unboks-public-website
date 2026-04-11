import React from 'react';
import { Link } from 'react-router-dom';

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-glow to-cyan-400 text-slate-950 shadow-[0_12px_30px_rgba(54,209,255,0.25)] hover:translate-y-[-1px] hover:shadow-[0_16px_36px_rgba(54,209,255,0.35)]',
  secondary:
    'border border-white/10 bg-white/[0.04] text-white hover:border-glow/40 hover:bg-white/[0.08]',
  ghost: 'text-slate-200 hover:text-white',
};

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  variant?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const shared =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold outline-none ring-offset-2 ring-offset-night focus-visible:ring-2 focus-visible:ring-glow';

  if (to) {
    return (
      <Link to={to} className={`${shared} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`${shared} ${variants[variant]} ${className}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${shared} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
