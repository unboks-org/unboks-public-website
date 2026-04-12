// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED CODE FROM [WTYJ Operator Dashboard]
// Old route: /escalations → New route: /dashboard/escalations
// Import the escalations view component from the Operator Dashboard project.

export default function DashboardEscalationsPlaceholder() {
  return (
    <div data-testid="dashboard-escalations-placeholder">
      <h1 className="text-2xl font-semibold text-slate-900">Escalations</h1>
      <p className="mt-1 text-sm text-slate-500">Ready for import</p>

      <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Escalations view</p>
        <p className="mt-1 text-xs text-slate-400">Import from Operator Dashboard</p>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-5 text-xs text-slate-500 leading-relaxed">
        <p className="font-medium text-slate-700 mb-1">Route mapping</p>
        <p>Old: <code className="text-slate-600">/escalations</code></p>
        <p>New: <code className="text-slate-600">/dashboard/escalations</code></p>
      </div>
    </div>
  );
}
