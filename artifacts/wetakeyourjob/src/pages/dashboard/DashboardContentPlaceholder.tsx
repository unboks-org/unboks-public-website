// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED CODE FROM [WTYJ Operator Dashboard]
// Old route: /content → New route: /dashboard/content
// Import the content management view from the Operator Dashboard project.

export default function DashboardContentPlaceholder() {
  return (
    <div data-testid="dashboard-content-placeholder">
      <h1 className="text-2xl font-semibold text-slate-900">Content</h1>
      <p className="mt-1 text-sm text-slate-500">Ready for import</p>

      <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Content management view</p>
        <p className="mt-1 text-xs text-slate-400">Import from Operator Dashboard</p>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-5 text-xs text-slate-500 leading-relaxed">
        <p className="font-medium text-slate-700 mb-1">Route mapping</p>
        <p>Old: <code className="text-slate-600">/content</code></p>
        <p>New: <code className="text-slate-600">/dashboard/content</code></p>
      </div>
    </div>
  );
}
