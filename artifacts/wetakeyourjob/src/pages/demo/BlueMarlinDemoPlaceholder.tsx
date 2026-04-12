import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';

// ============================================================
// HIDDEN ROUTE — /demo/bluemarlin
// This page is intentionally NOT linked from the public navbar
// or footer. It is only accessible via direct URL.
// Old domain: bluemarlin.wetakeyourjob.com
// New route:  /demo/bluemarlin
// ============================================================

// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED CODE FROM [BlueMarlin Demo Site]
// Import the full BlueMarlin demo UI, components, and assets from the
// separate BlueMarlin Demo Site project into this route.

export default function BlueMarlinDemoPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center" data-testid="bluemarlin-demo-placeholder">
      <Helmet>
        <title>BlueMarlin Demo | We Take Your Job</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16s9-15 20-4c0 0-11 15-20 4z"/></svg>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900">BlueMarlin Demo</h1>
        <p className="mt-2 text-sm text-slate-500">Ready for import</p>

        <div className="mt-8 rounded-xl bg-slate-50 border border-slate-100 p-5 text-left text-xs text-slate-500 leading-relaxed">
          <p className="font-medium text-slate-700 mb-2">About this route</p>
          <ul className="space-y-1">
            <li>This page is intentionally hidden from site navigation.</li>
            <li>Old domain: <code className="text-slate-600">bluemarlin.wetakeyourjob.com</code></li>
            <li>New route: <code className="text-slate-600">/demo/bluemarlin</code></li>
            <li>Content from the BlueMarlin Demo Site will be imported here.</li>
          </ul>
        </div>

        <NavLink
          to="/"
          className="mt-8 inline-block text-sm text-slate-400 hover:text-slate-600"
          data-testid="link-demo-back"
        >
          Back to site
        </NavLink>
      </div>
    </div>
  );
}
