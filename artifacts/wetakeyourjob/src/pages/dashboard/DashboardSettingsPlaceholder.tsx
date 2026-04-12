// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED CODE FROM [WTYJ Operator Dashboard]
// Old route: /settings → New route: /dashboard/settings
// Import the settings view from the Operator Dashboard project.

export default function DashboardSettingsPlaceholder() {
  return (
    <div data-testid="dashboard-settings-placeholder">
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Ready for import</p>

      <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Settings view</p>
        <p className="mt-1 text-xs text-slate-400">Import from Operator Dashboard</p>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-5 text-xs text-slate-500 leading-relaxed">
        <p className="font-medium text-slate-700 mb-1">Route mapping</p>
        <p>Old: <code className="text-slate-600">/settings</code></p>
        <p>New: <code className="text-slate-600">/dashboard/settings</code></p>
      </div>
    </div>
  );
}
