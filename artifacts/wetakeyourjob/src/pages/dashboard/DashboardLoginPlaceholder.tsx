import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';

// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED CODE FROM [WTYJ Operator Dashboard]
// Old route: /login → New route: /dashboard/login
// Import the login form, auth logic, and redirect behavior from the Operator Dashboard project.

export default function DashboardLoginPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Helmet>
        <title>Login | We Take Your Job</title>
      </Helmet>

      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm" data-testid="dashboard-login-placeholder">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-900">Operator Login</h1>
        <p className="mt-2 text-sm text-slate-500">Ready for import</p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-500 leading-relaxed">
          <p className="font-medium text-slate-700 mb-1">Route mapping</p>
          <p>Old: <code className="text-slate-600">/login</code></p>
          <p>New: <code className="text-slate-600">/dashboard/login</code></p>
        </div>

        <NavLink
          to="/"
          className="mt-6 inline-block text-sm text-slate-400 hover:text-slate-600"
          data-testid="link-login-back"
        >
          Back to site
        </NavLink>
      </div>
    </div>
  );
}
