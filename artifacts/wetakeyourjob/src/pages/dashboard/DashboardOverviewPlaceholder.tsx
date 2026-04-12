// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED CODE FROM [WTYJ Operator Dashboard]
// Old route: / (dashboard root) → New route: /dashboard
// Import the main dashboard overview component from the Operator Dashboard project.

export default function DashboardOverviewPlaceholder() {
  return (
    <div data-testid="dashboard-overview-placeholder">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview — ready for import</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {['Messages today', 'Pending escalations', 'Avg response time'].map((label) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-300">--</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-5 text-xs text-slate-500 leading-relaxed">
        <p className="font-medium text-slate-700 mb-1">Route mapping</p>
        <p>Old: <code className="text-slate-600">/</code> (dashboard root)</p>
        <p>New: <code className="text-slate-600">/dashboard</code></p>
      </div>
    </div>
  );
}
