import { Link } from 'react-router-dom';

interface ButtonProps {
  children: string;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'data-testid'?: string;
}

const base = 'inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-colors';

const variants = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
};

export default function Button({ children, to, href, variant = 'primary', className = '', 'data-testid': testId, ...rest }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={cls} data-testid={testId || `button-${to.replace(/\W/g, '')}`}>{children}</Link>;
  if (href) return <a href={href} className={cls} data-testid={testId || 'button-href'} {...rest}>{children}</a>;
  return <button className={cls} data-testid={testId || 'button'} {...rest}>{children}</button>;
}
