# Workspace

## Overview

pnpm workspace monorepo hosting the BlueMarlin operator dashboard for wetakeyourjob.com. The marketing site has been removed — the root path `/` now redirects directly to the dashboard login. A separate BlueMarlin Tours Curaçao booking demo is also kept for prospective clients.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Routing**: react-router-dom v6
- **Icons**: lucide-react
- **Font**: Inter (Google Fonts)
- **API framework**: Express 5 (separate api-server artifact)
- **Dashboard deps**: @tanstack/react-query, sonner, framer-motion, shadcn/radix UI, recharts, date-fns, cmdk

## wetakeyourjob.com app

### Routes

**Root**
- `/` — Redirects to `/dashboard/login`
- Any unmatched URL — Redirects to `/dashboard/login`

**Dashboard (BlueMarlin operator dashboard)**
- `/dashboard/login` — Login page (workspace code + access key, dark theme)
- `/dashboard` — OmniInbox (primary view, Gmail-style conversation list with PlatformFilterBar)
- `/dashboard/bookings` — Bookings/Orders page (wraps CapacityChecker)
- `/dashboard/settings` — Settings (feature toggles, analytics shortcut, bookings/orders label toggle, email)
- `/dashboard/settings/analytics` — Analytics charts (platform counts, escalation status, 14-day trend via recharts)
- `/dashboard/overview` — Legacy overview (hidden from nav, accessible by direct URL)
- `/dashboard/social` — Social media content pipeline (hidden from nav)
- `/dashboard/create` — Manual post creation (hidden from nav)
- `/dashboard/training` — Brand training examples (hidden from nav)
- `/dashboard/published` — Published posts archive (hidden from nav)
- `/dashboard/learnings` — Brand learnings manager (hidden from nav)
- `/dashboard/assets` — Photo/video asset library (hidden from nav)
- Legacy redirects: `/dashboard/messages` → `/dashboard`, `/dashboard/capacity` → `/dashboard/bookings`, `/dashboard/escalations` → `/dashboard?view=escalations`

**Demo — BlueMarlin Tours Curaçao (booking site)**
- `/demo/bluemarlin/` — Homepage (hero, packages, stats, FAQ, CTA)
- `/demo/bluemarlin/trips` — All trip packages with images and details
- `/demo/bluemarlin/booking` — Operator booking desk (check availability, reserve hold via API proxy)
- `/demo/bluemarlin/book` — Customer-facing booking form (multi-step: trip, date, guests, contact)
- `/demo/bluemarlin/about` — About BlueMarlin Tours

### Architecture

**Dashboard** is a self-contained sub-app under `/dashboard/*` with its own:
- `ThemeProvider` (dark/light, scoped to `#dashboard-root` div)
- `FeatureTogglesProvider` (showSocial, showCreate flags in localStorage)
- `AuthProvider` (token-based, localStorage `wtyj_token_{client}`, multi-client: bluemarlin/adamus/consultadespertares)
- `QueryClientProvider` (@tanstack/react-query for API data)
- `TooltipProvider` + `ThemedToaster` (sonner)
- `AppLayout` with sidebar navigation + TopBar
- `ProtectedRoute` redirects unauthenticated users to `/dashboard/login`

API base: `https://api.wetakeyourjob.com/{client}/dashboard/api`

### CSS Theme System
- Dashboard: HSL CSS custom properties on `:root` (light) and `.dark` (dark mode), scoped via `#dashboard-root`
- Demo: teal-themed HSL variables scoped via `#demo-root`, Manrope + Playfair Display fonts
- `@custom-variant dark (&:is(.dark *))` for Tailwind dark variant
- Shared utilities: `.glass-card`, `.glass-panel`, `.text-gradient-ocean`, `.scrollbar-none`
- Demo utilities: `.demo-section-shell`, `.demo-input`, `#demo-root .font-serif`

### Path Aliases
- `@/` → `src/`
- `@dashboard/` → `src/dashboard/` (dashboard-only imports)
- `@demo/` → `src/demo/bluemarlin/` (demo-only imports)
- `@assets/` → `../../attached_assets/` (shared images)

### Source Layout
- `artifacts/wetakeyourjob/src/App.tsx` — Root router (redirects `/` → `/dashboard/login`, mounts dashboard + demo)
- `artifacts/wetakeyourjob/src/main.tsx` — App entry point
- `artifacts/wetakeyourjob/src/index.css` — Global styles + theme tokens for dashboard and demo
- `artifacts/wetakeyourjob/src/dashboard/` — full BlueMarlin operator dashboard
- `artifacts/wetakeyourjob/src/dashboard/components/` — auth, layout, ui (58+ shadcn components)
- `artifacts/wetakeyourjob/src/dashboard/hooks/` — use-bluemarlin, use-read-status, use-email-settings, use-go-back, use-mobile, use-platform-filter, use-bookings-label
- `artifacts/wetakeyourjob/src/dashboard/lib/` — api, theme, feature-toggles, channel-map, utils, error
- `artifacts/wetakeyourjob/src/dashboard/pages/` — Login, Overview, Messages (OmniInbox), Escalations, BookingsPage, Analytics, ContentPipeline, Create, BrandTraining, Settings, + legacy pages
- `artifacts/wetakeyourjob/src/dashboard/components/PlatformFilterBar.tsx` — shared platform channel filter
- `artifacts/wetakeyourjob/src/demo/bluemarlin/` — BlueMarlin Tours booking demo
- `artifacts/wetakeyourjob/src/demo/bluemarlin/DemoApp.tsx` — Demo shell (Navbar + Footer + Routes)
- `artifacts/wetakeyourjob/src/demo/bluemarlin/pages/` — home, trips, booking, book, about, not-found
- `artifacts/wetakeyourjob/src/demo/bluemarlin/components/` — Navbar, Footer, Logo
- `artifacts/wetakeyourjob/src/demo/bluemarlin/config/resources.ts` — trip packages and boat data
- `artifacts/wetakeyourjob/public/` — favicon.svg, opengraph.jpg only
- `attached_assets/stock_images/` — trip photos (catamaran, snorkeling, beach, sunset, jetski)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/wetakeyourjob run dev` — run the website locally
