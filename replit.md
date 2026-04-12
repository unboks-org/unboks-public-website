# Workspace

## Overview

pnpm workspace monorepo with a marketing website and operator dashboard for wetakeyourjob.com. Frontend-only React + Vite + Tailwind CSS site with embedded BlueMarlin dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Routing**: react-router-dom v6
- **SEO**: react-helmet-async
- **Icons**: lucide-react
- **Font**: Inter (Google Fonts)
- **API framework**: Express 5 (shared backend, not used by wetakeyourjob)
- **Dashboard deps**: @tanstack/react-query, sonner, framer-motion, shadcn/radix UI, recharts, date-fns, cmdk

## wetakeyourjob.com

Frontend-only marketing website at root path `/`. Apple/AWS-inspired clean light design with minimal text.

### Routes

**Marketing (public, SiteLayout)**
- `/` — Homepage with hero, services overview, how it works, benefits, audience, CTA
- `/services` — Services page with service cards, human-in-the-loop controls, outcomes
- `/about` — About page with philosophy cards and practice description
- `/contact` — Contact form with strategy call info and direct contact details

**Dashboard (real BlueMarlin operator dashboard)**
- `/dashboard/login` — Login page (client selector + access key, dark theme)
- `/dashboard` — OmniInbox (primary view, dense Gmail-style conversation list with PlatformFilterBar)
- `/dashboard/escalations` — Escalation queue with PlatformFilterBar + delete in detail view
- `/dashboard/bookings` — Bookings/Orders page (wraps CapacityChecker)
- `/dashboard/analytics` — Analytics charts (platform counts, escalation status, 14-day trend via recharts)
- `/dashboard/settings` — Settings (feature toggles, analytics shortcut, bookings/orders label toggle, email, etc.)
- `/dashboard/overview` — Legacy overview (hidden from nav, accessible by direct URL)
- `/dashboard/social` — Social media content pipeline (hidden from nav)
- `/dashboard/create` — Manual post creation (hidden from nav)
- `/dashboard/training` — Brand training examples (hidden from nav)
- `/dashboard/published` — Published posts archive (hidden from nav)
- `/dashboard/learnings` — Brand learnings manager (hidden from nav)
- `/dashboard/assets` — Photo/video asset library (hidden from nav)
- Legacy redirects: `/dashboard/messages` → `/dashboard`, `/dashboard/capacity` → `/dashboard/bookings`

**Demo — BlueMarlin Tours Curaçao (booking site)**
- `/demo/bluemarlin/` — Homepage (hero, packages, stats, FAQ, CTA)
- `/demo/bluemarlin/trips` — All trip packages with images and details
- `/demo/bluemarlin/booking` — Operator booking desk (check availability, reserve hold via API proxy)
- `/demo/bluemarlin/book` — Customer-facing booking form (multi-step: trip, date, guests, contact)
- `/demo/bluemarlin/about` — About BlueMarlin Tours

### Architecture

**Marketing site** uses direct Tailwind slate colors (white bg, slate-900 accent) with SiteLayout (Navbar + Footer + Outlet).

**Dashboard** is a self-contained sub-app under `/dashboard/*` with its own:
- `ThemeProvider` (dark/light, scoped to `#dashboard-root` div)
- `FeatureTogglesProvider` (showSocial, showCreate flags in localStorage)
- `AuthProvider` (token-based, localStorage `wtyj_token_{client}`, multi-client: bluemarlin/adamus/roberto)
- `QueryClientProvider` (@tanstack/react-query for API data)
- `TooltipProvider` + `ThemedToaster` (sonner)
- `AppLayout` with sidebar navigation + TopBar
- `ProtectedRoute` redirects unauthenticated users to `/dashboard/login`

API base: `https://api.wetakeyourjob.com/{client}/dashboard/api`

### CSS Theme System
- Marketing: direct colors on body (`background: #fff`, `color: #475569`), `.wrap` container
- Dashboard: HSL CSS custom properties on `:root` (light) and `.dark` (dark mode), scoped via `#dashboard-root`
- Demo: teal-themed HSL variables scoped via `#demo-root`, Manrope + Playfair Display fonts
- `@custom-variant dark (&:is(.dark *))` for Tailwind dark variant
- Shared utilities: `.glass-card`, `.glass-panel`, `.text-gradient-ocean`, `.scrollbar-none`
- Demo utilities: `.demo-section-shell`, `.demo-input`, `#demo-root .font-serif`

### Path Aliases
- `@/` → `src/` (marketing + shared)
- `@dashboard/` → `src/dashboard/` (dashboard-only imports)
- `@demo/` → `src/demo/bluemarlin/` (demo-only imports)
- `@assets/` → `../../attached_assets/` (shared images)

### Positioning
- AI tools that save time on repetitive communication
- Human + AI symbiosis (humans always in control)
- Manager dashboard oversight
- Teams become more productive
- NOT "AI replaces the whole team"

### Design System (Marketing)
- Background: white (#ffffff)
- Surface: slate-50 (#f8fafc)
- Accent: slate-900 (#0f172a)
- Border: slate-200 (#e2e8f0)
- Clean, light, minimal — Apple/AWS aesthetic
- Inter font, rounded-2xl cards, subtle borders
- Tailwind v4 CSS-first config via `@theme inline` in index.css
- Layout container: `.wrap` class (max-w-72rem, auto margins)

### Key Files
- `artifacts/wetakeyourjob/src/` — all source code
- `artifacts/wetakeyourjob/src/data/siteContent.ts` — centralized marketing content data
- `artifacts/wetakeyourjob/src/components/` — reusable marketing UI components
- `artifacts/wetakeyourjob/src/pages/` — marketing page components
- `artifacts/wetakeyourjob/src/layout/` — Navbar, Footer, SiteLayout
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
- `attached_assets/stock_images/` — trip photos (catamaran, snorkeling, beach, sunset, jetski)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/wetakeyourjob run dev` — run the website locally
