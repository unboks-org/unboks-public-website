# wetakeyourjob.com — Complete Project Reference

> Last updated: April 12, 2026
> Hosted on: Replit (pnpm monorepo)
> Live at: wetakeyourjob.com

---

## 1. Project Overview

A **frontend-only** React + Vite + Tailwind CSS v4 marketing website that serves as a container for three distinct sub-applications:

| Sub-app | Path | Purpose | Theme |
|---------|------|---------|-------|
| **Marketing Site** | `/` | Landing pages for the "We Take Your Job" AI service | Apple/AWS light (white, Inter font, slate) |
| **Operator Dashboard** | `/dashboard/*` | BlueMarlin operator console for managing comms, social, escalations | Dark navy / light toggle |
| **Booking Demo** | `/demo/bluemarlin/*` | BlueMarlin Tours Curaçao charter booking site | Teal Caribbean (Manrope + Playfair Display) |

All three are CSS-isolated via scoped root elements (`body`, `#dashboard-root`, `#demo-root`) so themes never leak between them.

---

## 2. Tech Stack

| Category | Technology |
|----------|------------|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 24 |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Routing | react-router-dom v6 |
| SEO | react-helmet-async |
| Icons | lucide-react |
| Dashboard UI | shadcn/ui (Radix primitives), framer-motion |
| Dashboard data | @tanstack/react-query |
| Dashboard charts | recharts |
| Dashboard toasts | sonner |
| Dashboard utils | date-fns, cmdk, class-variance-authority |
| Forms | react-hook-form + zod |

---

## 3. Directory Structure

```
artifacts/wetakeyourjob/src/
├── App.tsx                          # Root router (marketing + dashboard + demo)
├── index.css                        # All CSS: Tailwind config, themes, utilities
├── main.tsx                         # React entry point
│
├── components/                      # Marketing reusable components
│   ├── Badge.tsx
│   ├── BenefitCard.tsx
│   ├── Button.tsx
│   ├── CTASection.tsx
│   ├── HeroPanel.tsx
│   ├── InfoCard.tsx
│   ├── PageHeader.tsx
│   ├── Section.tsx
│   ├── Seo.tsx
│   ├── ServiceCard.tsx
│   ├── StepCard.tsx
│   └── ui/                          # 50+ shadcn primitives (button, card, dialog, etc.)
│
├── data/
│   └── siteContent.ts               # Centralized marketing copy & content data
│
├── layout/
│   ├── Footer.tsx                   # Marketing footer
│   ├── Navbar.tsx                   # Marketing navbar
│   └── SiteLayout.tsx               # Wraps marketing pages (Navbar + Outlet + Footer)
│
├── pages/                           # Marketing page components
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
│
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/
│   └── seo.ts
│
├── dashboard/                       # Full BlueMarlin operator dashboard
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx      # Token-based auth, multi-client
│   │   │   ├── ProtectedRoute.tsx    # Redirects to /dashboard/login
│   │   │   └── useAuthContext.ts
│   │   ├── layout/
│   │   │   └── AppLayout.tsx         # Sidebar + TopBar + content area
│   │   └── ui/                       # 70+ dashboard-specific shadcn components
│   │       ├── status-badge.tsx      # DraftStatus + ContentClass badges
│   │       ├── auth-image.tsx        # Authenticated image loader
│   │       ├── error-state.tsx       # Error boundary UI
│   │       └── ... (accordion, button, card, dialog, table, etc.)
│   │
│   ├── hooks/
│   │   ├── use-bluemarlin.ts         # All API queries/mutations (TanStack Query)
│   │   ├── use-read-status.ts        # Read/unread + archive state (localStorage)
│   │   ├── use-go-back.ts            # Safe back navigation
│   │   ├── use-email-settings.ts     # Gmail vs mailto preference
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── api.ts                    # API client, multi-client routing, token mgmt
│   │   ├── theme.ts                  # Dark/light mode toggle (localStorage)
│   │   ├── feature-toggles.tsx       # Show/hide dashboard modules
│   │   ├── error.ts                  # Error message extraction
│   │   └── utils.ts                  # cn() class merger
│   │
│   └── pages/
│       ├── Login.tsx
│       ├── Overview.tsx              # Summary cards, urgent bar, recent activity
│       ├── Messages.tsx              # WhatsApp/SMS/email inbox
│       ├── Escalations.tsx           # Human intervention queue
│       ├── ContentPipeline.tsx       # Social media drafts/approval/publishing
│       ├── Create.tsx                # Manual post creation
│       ├── BrandTraining.tsx         # Brand voice rules + example uploads
│       ├── BrandLearnings.tsx        # AI-distilled brand rules
│       ├── Settings.tsx              # Feature toggles, Drive, schedule, email
│       ├── PublishedPosts.tsx        # Published content archive
│       ├── AssetLibrary.tsx          # Photo/video gallery + Drive sync
│       ├── CapacityChecker.tsx       # Trip occupancy viewer
│       └── not-found.tsx
│
└── demo/
    └── bluemarlin/                   # BlueMarlin Tours booking demo
        ├── DemoApp.tsx               # Demo shell (Navbar + Routes + Footer)
        ├── components/
        │   ├── Navbar.tsx            # Sticky nav with "Demo" badge
        │   ├── Footer.tsx            # Contact, social links, nav
        │   └── Logo.tsx              # BlueMarlin fish logo
        ├── config/
        │   └── resources.ts          # Trip packages + boat fleet data
        ├── hooks/
        │   └── use-mobile.tsx
        ├── lib/
        │   └── queryClient.ts        # Fetch wrapper (apiRequest)
        └── pages/
            ├── home.tsx              # Hero, stats, featured packages, FAQ
            ├── trips.tsx             # All 5 trip package cards
            ├── booking.tsx           # Operator availability checker
            ├── book.tsx              # Customer booking form (multi-step)
            ├── about.tsx             # Company info + 3 value cards
            └── not-found.tsx
```

---

## 4. Routing Map

### Marketing (public, wrapped in SiteLayout)
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Hero, services overview, how it works, benefits, audience, CTA |
| `/services` | `ServicesPage` | Service cards, human-in-the-loop controls, outcomes |
| `/about` | `AboutPage` | Philosophy cards, practice description |
| `/contact` | `ContactPage` | Contact form, strategy call info, direct email |
| `*` | Redirects to `/` | Catch-all |

### Dashboard (protected, wrapped in DashboardShell → AppLayout)
| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard/login` | `Login` | Client selector + access key (public) |
| `/dashboard` | `Overview` | Summary cards, urgent bar, recent activity |
| `/dashboard/messages` | `Messages` | Multi-channel conversation inbox |
| `/dashboard/escalations` | `Escalations` | Human intervention queue (semi/full) |
| `/dashboard/social` | `ContentPipeline` | Social drafts, approval, scheduling, publishing |
| `/dashboard/create` | `Create` | Manual post creation |
| `/dashboard/training` | `BrandTraining` | Brand voice rules + example analysis |
| `/dashboard/settings` | `Settings` | Feature toggles, Drive, schedule, email |
| `/dashboard/published` | `PublishedPosts` | Published content archive |
| `/dashboard/learnings` | `BrandLearnings` | AI-distilled brand rules |
| `/dashboard/assets` | `AssetLibrary` | Photo/video gallery with Drive sync |
| `/dashboard/capacity` | `CapacityChecker` | Trip occupancy checker |
| `/dashboard/content` | Redirects to `/dashboard/social` | Legacy redirect |

### Demo — BlueMarlin Tours Curaçao (wrapped in DemoApp)
| Path | Component | Description |
|------|-----------|-------------|
| `/demo/bluemarlin/` | `HomePage` | Hero image, stats, featured packages, FAQ, CTA |
| `/demo/bluemarlin/trips` | `TripsPage` | All 5 trip cards with images and prices |
| `/demo/bluemarlin/booking` | `BookingPage` | Operator desk: check availability, reserve holds |
| `/demo/bluemarlin/book` | `BookPage` | Customer booking form (trip, date, guests, contact) |
| `/demo/bluemarlin/about` | `AboutPage` | Company story, 3 value cards |

---

## 5. CSS Theme System

### Architecture
- **Tailwind CSS v4** with `@import "tailwindcss"` and `@theme inline {}` block in `index.css`
- **Custom dark variant**: `@custom-variant dark (&:is(.dark *))`
- Three scoped theme zones isolated by ID selectors

### Marketing Theme (`:root` / `body`)
- Background: white `#ffffff`
- Text: slate `#475569`
- Font: Inter
- Container: `.wrap` class (max-width 72rem)
- Accent: slate-900 `#0f172a`
- Cards: rounded-2xl, subtle borders

### Dashboard Theme (`#dashboard-root`)
**Light mode (`:root` defaults):**
- Background: `hsl(210 30% 96%)`
- Primary: `hsl(217 89% 58%)` (blue)
- Radius: 0.75rem

**Dark mode (`.dark` class):**
- Background: `hsl(228 37% 7%)` (deep navy)
- Primary: `hsl(41 57% 75%)` (gold/champagne)
- Surfaces: semi-transparent RGBA
- Radial gradient background
- Glass effects: `.glass-card`, `.glass-panel`
- Text gradient: `.text-gradient-ocean` (gold linear gradient)

### Demo Theme (`#demo-root`)
- Primary: `hsl(190 80% 38%)` (ocean teal)
- Font sans: Manrope
- Font serif: Playfair Display
- Utilities: `.demo-section-shell` (72rem container), `.demo-input` (styled inputs)
- Animations: `demo-fadeup`, `demo-shimmer`

---

## 6. Path Aliases (Vite + TypeScript)

| Alias | Resolves To |
|-------|-------------|
| `@/` | `src/` |
| `@dashboard/` | `src/dashboard/` |
| `@demo/` | `src/demo/bluemarlin/` |
| `@assets/` | `../../attached_assets/` |

---

## 7. Dashboard Architecture

### Authentication
- Token-based via `AuthProvider`
- Tokens stored in `localStorage` as `wtyj_token_{client}`
- Multi-client support: `bluemarlin`, `adamus`, `consultadespertares`, `unboks`
- `ProtectedRoute` redirects unauthenticated users to `/dashboard/login`

### Providers (nested in DashboardShell)
1. `QueryClientProvider` — TanStack React Query for API data
2. `ThemeProvider` — Dark/light mode toggle
3. `AuthProvider` — Authentication state
4. `FeatureTogglesProvider` — Module visibility (showSocial, showCreate)
5. `TooltipProvider` + `ThemedToaster` — Tooltips and toast notifications

### API
- Base URL: `https://api.wetakeyourjob.com/{client}/dashboard/api`
- Client-specific routing (bluemarlin/adamus/consultadespertares/unboks)
- All requests include auth token header
- Queries via TanStack React Query hooks in `use-bluemarlin.ts`

### Key Features
- **Messages**: Multi-channel inbox (WhatsApp, Instagram, Facebook, Email), archive, read/unread tracking
- **Social Pipeline**: Content drafts with classes A/B/C/D, approval workflows, scheduling, publishing
- **Escalations**: Semi (relay) and Full escalation handling with suggested replies
- **Brand Training**: Example post uploads for AI analysis, manual voice/content/boundary rules
- **Brand Learnings**: Auto-generated rules from approval/rejection patterns
- **Asset Library**: Photo/video management with Google Drive sync and trip-based filtering
- **Capacity Checker**: Real-time trip occupancy from booking system
- **Settings**: Feature toggles, schedule automation, Drive connection, email preferences

### Layout
- `AppLayout` with collapsible sidebar navigation + TopBar
- Sidebar links: Overview, Messages, Escalations, Social Media, Create, Brand Training, Settings
- Mobile-responsive with hamburger menu

---

## 8. Demo Architecture (BlueMarlin Tours)

### Data Model (`config/resources.ts`)
**Boats (BOAT_RESOURCES):**
- BlueMarlin Catamaran (44 ft)
- Additional fleet vessels with IDs and capacities

**Trips (TRIP_PACKAGES) — 5 packages:**
| Trip | Price | Duration | Schedule |
|------|-------|----------|----------|
| Klein Curaçao Trip | $140/adult | 8.5 hours | Daily |
| Snorkeling Trip | $110/adult | 5 hours | Every Friday |
| Best of West Beach Trip | $140/adult | 8 hours | Sun & Wed |
| Sunset Cruise | $79/adult | 2.5 hours | Tue, Thu, Fri, Sat |
| Jet Ski Excursion | $135/adult | 1 hour | Daily |

### API Endpoints (no backend — graceful error states)
- `POST /api/check-availability` — Check boat schedule
- `POST /api/process-booking` — Create pending hold
- `POST /api/submit-booking` — Submit customer booking

### Navigation
- Internal links all prefixed with `/demo/bluemarlin`
- Navbar: Home, Trips, Booking, About, Book Now (CTA)
- Footer: Brand, nav links, social icons (Instagram, Facebook, X)
- "Demo" badge on navbar to indicate non-production

---

## 9. Marketing Content (siteContent.ts)

### Positioning
- AI tools that save time on repetitive communication
- Human + AI symbiosis (humans always in control)
- Manager dashboard oversight
- Teams become more productive
- NOT "AI replaces the whole team"

### Services
1. **AI Communication Layer** — Handles routine messages across channels
2. **Unified Inbox** — All channels in one view
3. **Control Dashboard** — Review, approve, escalate
4. **Workflow Analysis** — Study patterns, improve over time

### Supported Channels
WhatsApp, Instagram, Facebook, Email, Telegram, X

### Target Audiences
Restaurants, Tour companies, Salons, Real estate teams, Clinics, Rental businesses, Service businesses

### Key Benefits
- 70-80% less repetitive work
- Faster response times
- Nothing gets missed
- Humans stay in control

### Process (How It Works)
1. Study your workflow
2. Design the AI layer
3. Build and deploy
4. Your team gets faster

---

## 10. Design System (Marketing)

| Property | Value |
|----------|-------|
| Background | `#ffffff` (white) |
| Surface | `#f8fafc` (slate-50) |
| Accent | `#0f172a` (slate-900) |
| Border | `#e2e8f0` (slate-200) |
| Text body | `#475569` (slate-600) |
| Font | Inter (Google Fonts) |
| Card radius | rounded-2xl |
| Container | `.wrap` — max-width 72rem, auto margins |
| Style | Clean, minimal, Apple/AWS aesthetic |

---

## 11. Key Configuration Files

| File | Purpose |
|------|---------|
| `artifacts/wetakeyourjob/vite.config.ts` | Vite config with path aliases, Tailwind plugin, Replit plugins |
| `artifacts/wetakeyourjob/tsconfig.json` | TypeScript config with path mappings |
| `artifacts/wetakeyourjob/package.json` | All dependencies |
| `artifacts/wetakeyourjob/src/index.css` | Master CSS: Tailwind config, all 3 themes, utilities |
| `artifacts/wetakeyourjob/src/App.tsx` | Root router connecting all 3 sub-apps |

---

## 12. Build & Dev Commands

```bash
pnpm --filter @workspace/wetakeyourjob run dev    # Run dev server
pnpm run typecheck                                 # Full typecheck
pnpm run build                                     # Typecheck + build all
```

---

## 13. Image Assets

Located in `attached_assets/`:
- `bluemarlin-logo.png` — BlueMarlin Tours logo
- `klein-curacao-hero.jpg` — Hero background image
- `stock_images/` — Trip photos:
  - Catamaran sailing
  - Snorkeling reef
  - Beach/palm trees
  - Sunset ocean
  - Jet ski

Referenced via `@assets/` alias in Vite.

---

## 14. Important Notes

- **No backend**: The marketing site and demo are fully frontend-only. Dashboard API calls go to `api.wetakeyourjob.com`. Demo API calls gracefully fail with error states.
- **CSS isolation**: Each sub-app has its own scoped CSS. Marketing styles do not affect Dashboard or Demo and vice versa.
- **Multi-client dashboard**: The operator dashboard supports multiple clients (bluemarlin, adamus, roberto) via the login selector. Each client has its own API namespace.
- **The demo is hidden**: There is no link to `/demo/bluemarlin/` from the marketing navigation. It's accessed directly by URL.
- **Dashboard auth tokens**: Stored per-client in localStorage as `wtyj_token_{clientname}`.
