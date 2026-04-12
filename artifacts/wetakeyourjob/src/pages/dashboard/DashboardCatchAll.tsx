import { useLocation } from 'react-router-dom';

// Future dashboard routes will be caught here until their placeholder or real page is added.

export default function DashboardCatchAll() {
  const location = useLocation();

  return (
    <div data-testid="dashboard-catchall">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Route <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{location.pathname}</code> is ready for future content.
      </p>
    </div>
  );
}
