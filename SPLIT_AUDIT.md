# SPLIT AUDIT — Unboks.org Public Website vs Dashboard

## A. Public Website Files — KEEP

| File | Notes |
|---|---|
| `src/HomePage.tsx` | Public homepage. No dashboard imports. |
| `src/homepage.css` | Homepage styles only. |
| `src/i18n.ts` | Translation strings for homepage only. |
| `src/main.tsx` | Entry point. No dashboard imports — only renders App. |
| `src/App.tsx` | Router — needs cleanup to remove dashboard/login routes. |
| `src/admin/AdminApp.tsx` | Internal Unboks admin panel. Standalone — no dashboard deps. |
| `src/demo/bluemarlin/DemoApp.tsx` | Blue Marlin demo site. Keep. |
| `src/demo/bluemarlin/components/*` | Demo site components. Keep. |
| `src/demo/bluemarlin/config/*` | Demo site config. Keep. |
| `src/demo/bluemarlin/hooks/*` | Demo site hooks. Keep. |
| `src/demo/bluemarlin/lib/queryClient.ts` | Demo site React Query client. Keep. |
| `src/demo/bluemarlin/pages/*` | Demo site pages. Keep. |

## B. Dashboard Files — REMOVE

| File/Folder | Notes |
|---|---|
| `src/dashboard/` | Entire directory. ~90 files. All dashboard-only. |
| `src/dashboard/pages/*` | All 16 dashboard pages including Login. |
| `src/dashboard/components/auth/*` | AuthProvider, ProtectedRoute, useAuthContext. |
| `src/dashboard/components/layout/AppLayout.tsx` | Dashboard sidebar/header shell. |
| `src/dashboard/components/ui/*` | ~60 shadcn UI components. Dashboard-only. |
| `src/dashboard/components/PlatformFilterBar.tsx` | Dashboard inbox filter. |
| `src/dashboard/hooks/*` | All 8 dashboard hooks. |
| `src/dashboard/lib/api.ts` | Dashboard API client to api.wetakeyourjob.com. |
| `src/dashboard/lib/channel-map.ts` | Platform key mapping. Dashboard-only. |
| `src/dashboard/lib/error.ts` | Dashboard error helper. |
| `src/dashboard/lib/feature-toggles.tsx` | Dashboard localStorage toggles. |
| `src/dashboard/lib/tenant.ts` | Dashboard product name constants. |
| `src/dashboard/lib/theme.ts` | Dashboard theme provider. |
| `src/dashboard/lib/utils.ts` | cn() utility — also exists as homepage-independent code. |

## C. Shared Files — How They Are Used

| File | Used by website? | Used by dashboard? | Action |
|---|---|---|---|
| `src/App.tsx` | Yes (owns router) | Yes (mounts dashboard routes) | Keep, strip dashboard routes |
| `src/index.css` | Yes (Tailwind base, used by demo/admin) | Yes | Keep — demo and admin still need it |
| `@tanstack/react-query` | Yes — demo/bluemarlin/lib/queryClient.ts uses it | Yes | Keep in package.json |
| `lucide-react` | No (homepage uses inline SVG) | Yes (admin also uses it) | Keep — AdminApp uses it |
| `react-router-dom` | Yes | Yes | Keep |
| `react-helmet-async` | Yes — main.tsx wraps with HelmetProvider | Yes | Keep |
| `sonner` | No (homepage doesn't use it) | Yes (dashboard toaster) | Remove from package.json |
| `framer-motion` | No | Yes | Remove from package.json |
| `recharts` | No | Yes | Remove from package.json |
| `react-hook-form` / `@hookform/resolvers` | No | Yes | Remove from package.json |
| `date-fns` | No (homepage uses no dates) | Yes | Check demo — keep if demo uses it |
| `zod` | No | Yes | Remove if demo doesn't use it |
| `next-themes` | No | Yes | Remove |
| `tailwindcss` | Yes (demo, admin) | Yes | Keep |
| `clsx` / `tailwind-merge` | No (homepage uses plain CSS) | Yes (dashboard cn()) | Check demo — keep if demo uses it |

## D. Dashboard-Only Dependencies to Remove

- `sonner`
- `framer-motion`
- `recharts`
- `react-hook-form`
- `@hookform/resolvers`
- `next-themes`
- All `@radix-ui/*` packages (used only by shadcn components inside `src/dashboard/`)
- `cmdk`
- `input-otp`
- `embla-carousel-react`
- `react-day-picker`
- `react-resizable-panels`
- `vaul`
- `tw-animate-css`

## E. Routes Currently Active

| Route | Component | Keep/Remove |
|---|---|---|
| `/` | `HomePage` | KEEP |
| `/login` | `LoginShell` (wraps dashboard `Login`) | REMOVE |
| `/dashboard/*` | `DashboardShell` (all dashboard pages) | REMOVE |
| `/admin/*` | `AdminApp` | KEEP |
| `/demo/bluemarlin/*` | `DemoApp` | KEEP |
| `*` (catch-all) | `Navigate to="/login"` | CHANGE → redirect to `/` |

## F. Login/Dashboard Links Currently Active

| Location | Current value | Action |
|---|---|---|
| `HomePage.tsx` line 112 | `href="/login"` | Change to `https://dashboard.unboks.org` |
| `App.tsx` catch-all | `<Navigate to="/login">` | Change to `<Navigate to="/">` |
