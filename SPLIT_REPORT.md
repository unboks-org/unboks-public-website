# SPLIT REPORT — Unboks.org Public Website

## 1. Files Kept for Public Website

| File | Purpose |
|---|---|
| `src/HomePage.tsx` | Public homepage — unchanged |
| `src/homepage.css` | Homepage styles — unchanged |
| `src/i18n.ts` | Multi-language translations — unchanged |
| `src/main.tsx` | App entry point — unchanged |
| `src/App.tsx` | Router — rewritten, dashboard routes removed |
| `src/index.css` | Tailwind base styles (used by demo & admin) |
| `src/admin/AdminApp.tsx` | Internal Unboks admin panel — unchanged |
| `src/demo/bluemarlin/` | Blue Marlin demo site — unchanged |

## 2. Dashboard Files Removed

- `src/dashboard/` — entire directory deleted (~90 files)
  - `pages/` — 16 dashboard pages including Login
  - `components/auth/` — AuthProvider, ProtectedRoute, useAuthContext
  - `components/layout/AppLayout.tsx` — Dashboard shell
  - `components/ui/` — ~60 shadcn UI components
  - `components/PlatformFilterBar.tsx`
  - `hooks/` — 8 dashboard hooks (use-client-api, use-toast, etc.)
  - `lib/api.ts` — Dashboard API client (api.wetakeyourjob.com)
  - `lib/theme.ts`, `lib/feature-toggles.tsx`, `lib/tenant.ts`, `lib/channel-map.ts`, `lib/error.ts`, `lib/utils.ts`

## 3. Shared Files Kept

| File | Reason |
|---|---|
| `src/index.css` | Tailwind base — used by demo and admin |
| `lucide-react` | Used by AdminApp |
| `react-router-dom` | Used by all routes |
| `react-helmet-async` | Used in main.tsx |
| `react-icons` | Used by demo/bluemarlin/components/Footer.tsx |
| `tailwindcss` | Used by demo and admin |

## 4. Routes Removed

| Route | Component |
|---|---|
| `/login` | LoginShell → dashboard Login page |
| `/dashboard/*` | DashboardShell → all 13+ dashboard sub-routes |

## 5. Routes Remaining

| Route | Component |
|---|---|
| `/` | `HomePage` |
| `/admin/*` | `AdminApp` |
| `/demo/bluemarlin/*` | `DemoApp` |
| `*` (catch-all) | Redirects to `/` |

## 6. Login Link Destination

**Before:** `href="/login"` (internal route rendering dashboard Login page)

**After:** `href="https://dashboard.unboks.org"` (external link, opens in new tab)

> TODO: point this to final dashboard deployment URL if different.

## 7. Dependencies Removed

| Package | Reason |
|---|---|
| `@tanstack/react-query` | Dashboard only (QueryClient, QueryClientProvider) |
| `@hookform/resolvers` | Dashboard forms only |
| `@radix-ui/*` (24 packages) | Dashboard shadcn UI only |
| `@tailwindcss/typography` | Dashboard only |
| `@workspace/api-client-react` | Dashboard API client |
| `class-variance-authority` | Dashboard shadcn only |
| `clsx` | Dashboard only |
| `cmdk` | Dashboard command menu |
| `date-fns` | Dashboard only |
| `embla-carousel-react` | Dashboard carousel |
| `framer-motion` | Dashboard animations |
| `input-otp` | Dashboard OTP input |
| `next-themes` | Dashboard theme toggle |
| `react-day-picker` | Dashboard calendar |
| `react-hook-form` | Dashboard forms |
| `react-resizable-panels` | Dashboard layout |
| `recharts` | Dashboard analytics charts |
| `sonner` | Dashboard Toaster |
| `tailwind-merge` | Dashboard shadcn only |
| `tw-animate-css` | Dashboard animations |
| `vaul` | Dashboard drawer |
| `wouter` | Dashboard routing (unused at project level) |
| `zod` | Dashboard validation |

## 8. Build Result

- TypeScript typecheck: **PASS** (0 errors)
- `@dashboard` Vite alias: **removed** from `vite.config.ts`
- All dashboard imports in `App.tsx`: **removed**
- `src/dashboard/` directory: **deleted**
