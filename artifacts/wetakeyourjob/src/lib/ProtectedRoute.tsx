import { Outlet } from 'react-router-dom';

// TODO: REPLACE THIS PLACEHOLDER WITH IMPORTED AUTH LOGIC FROM [WTYJ Operator Dashboard]
//
// This is a merge-ready placeholder for the authentication wrapper.
// When importing the real dashboard code:
// 1. Replace the passthrough below with actual auth state check
// 2. Redirect unauthenticated users to /dashboard/login
// 3. Wire up to the existing API auth on api.wetakeyourjob.com
//
// Do NOT change API contracts — auth endpoints remain on api.wetakeyourjob.com

export default function ProtectedRoute() {
  // Placeholder: always renders children. Replace with real auth guard after import.
  return <Outlet />;
}
