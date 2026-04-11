interface BadgeProps {
  children: string;
  'data-testid'?: string;
}

export default function Badge({ children, 'data-testid': testId }: BadgeProps) {
  return (
    <span
      data-testid={testId || 'badge'}
      className="inline-block rounded-full bg-slate-100 px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-slate-500"
    >
      {children}
    </span>
  );
}
