# Technical Handover — Unboks.org Public Website
**Prepared for: Jr**
**Date: 2026-05-03**
**Author: Agent inspection — read-only, no code modified**

---

## 1. Project Overview

### What this project IS
- The **public-facing marketing website** for Unboks.org
- A fully static Single Page Application (SPA) — no server, no database, no authentication
- Contains three sub-apps mounted under one React router:
  1. **Public homepage** (`/`) — marketing website in 5 languages
  2. **Internal admin panel** (`/admin/*`) — Unboks staff only, password-protected client list
  3. **Blue Marlin demo** (`/demo/bluemarlin/*`) — a demo site showing Unboks in action for a boat-tour client

### What this project is NOT
- Not the customer dashboard (that was split out; lives at `dashboard.unboks.org`)
- Not the backend/API server (that is a separate artifact in the same monorepo: `artifacts/api-server`)
- Not where LLM or channel integration logic should live
- Not connected to any database directly

### In one sentence
This repo serves **unboks.org** — the marketing site that explains what Unboks does and sends potential customers to WhatsApp or the external dashboard.

---

## 2. Current App Architecture

| Item | Value |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite 5 |
| Package manager | pnpm (workspace monorepo) |
| CSS | Tailwind CSS v4 + plain CSS (homepage.css) |
| Routing | React Router v7 (client-side, BrowserRouter) |
| Deployment type | **Static SPA** — pre-built HTML/JS/CSS, no runtime server |
| Deployment serve | Replit static file server via `artifact.toml` |
| Monorepo root | `/home/runner/workspace/` |
| Artifact directory | `artifacts/wetakeyourjob/` |

### Folder Structure
```
artifacts/wetakeyourjob/
├── src/
│   ├── App.tsx                        ← Root router (3 routes only)
│   ├── main.tsx                       ← Entry point, BrowserRouter + HelmetProvider
│   ├── index.css                      ← Tailwind base + demo/admin CSS vars
│   ├── HomePage.tsx                   ← Public marketing homepage
│   ├── homepage.css                   ← Homepage-only styles
│   ├── i18n.ts                        ← All translations (pap/en/es/nl/sv)
│   ├── admin/
│   │   └── AdminApp.tsx               ← Internal admin panel (standalone)
│   └── demo/
│       └── bluemarlin/
│           ├── DemoApp.tsx            ← Demo site root
│           ├── components/            ← Navbar, Footer, Logo
│           ├── config/resources.ts   ← Trip data (hardcoded)
│           ├── hooks/use-mobile.tsx   ← Responsive hook
│           ├── lib/queryClient.ts     ← Plain fetch wrapper (no React Query)
│           └── pages/                 ← home, trips, booking, book, about, not-found
├── public/
│   ├── favicon.png
│   ├── favicon.svg
│   └── opengraph.jpg
├── index.html                         ← SPA shell
├── vite.config.ts                     ← Build config + path aliases
├── package.json                       ← 15 dependencies only
└── .replit-artifact/artifact.toml    ← Replit deploy config
```

### Entry Points
- **Dev:** `pnpm --filter @workspace/wetakeyourjob run dev` → Vite HMR server
- **Build:** `pnpm --filter @workspace/wetakeyourjob run build` → `dist/public/`
- **HTML shell:** `artifacts/wetakeyourjob/index.html`
- **JS entry:** `src/main.tsx`

### Path Aliases (vite.config.ts)
| Alias | Resolves to |
|---|---|
| `@` | `src/` |
| `@demo` | `src/demo/bluemarlin/` |
| `@assets` | `../../attached_assets/` (workspace root) |

---

## 3. Current Routes

| Path | Component | File | Purpose | Public? |
|---|---|---|---|---|
| `/` | `HomePage` | `src/HomePage.tsx` | Marketing homepage, 5 languages | Yes |
| `/admin/*` | `AdminApp` | `src/admin/AdminApp.tsx` | Internal Unboks client management | No — password-gated |
| `/demo/bluemarlin/*` | `DemoApp` | `src/demo/bluemarlin/DemoApp.tsx` | Blue Marlin boat tour demo site | Yes |
| `*` (catch-all) | `<Navigate to="/">` | `src/App.tsx` | Redirects unknown paths to home | — |

### Demo Sub-routes (under `/demo/bluemarlin/`)
| Sub-path | Component |
|---|---|
| `/` (index) | `pages/home.tsx` |
| `/trips` | `pages/trips.tsx` |
| `/booking` | `pages/booking.tsx` |
| `/book` | `pages/book.tsx` |
| `/about` | `pages/about.tsx` |
| `*` | `pages/not-found.tsx` |

### Admin Sub-routes (under `/admin/`)
| Sub-path | Component |
|---|---|
| `/` (index) | `AdminHome` — client list |
| `/clients` | Placeholder |
| `/intake` | Placeholder |
| `/channels` | Placeholder |
| `/monitor` | Placeholder |
| `/settings` | Placeholder |
| `*` | Redirects to `/admin` |

---

## 4. Dashboard Split Status

**The dashboard has been fully removed from this project.**

Search results for all dashboard-related terms:

| Search term | Found? | File | Line | Status |
|---|---|---|---|---|
| `dashboard` | Yes — but safe | `src/admin/AdminApp.tsx:206` | "Channels Setup" placeholder description text | Dead UI placeholder, not code |
| `/dashboard` | No | — | — | Route does not exist |
| `login` | Yes — translation only | `src/i18n.ts:16,69,122,175,228` | `nav_login` string labels in 5 languages | Translation text, not a route |
| `/login` route | No | — | — | Route does not exist |
| `dashboard.unboks.org` | Yes — intentional | `src/HomePage.tsx:113` | External href on Login button | Correct — points to separate dashboard project |
| `AuthProvider` | No | — | — | Completely removed |
| `ProtectedRoute` | No | — | — | Completely removed |
| `useAuth` | No | — | — | Completely removed |
| `api.wetakeyourjob.com` | No | — | — | Completely removed |
| `wtyj_token` | No | — | — | Completely removed |
| `wtyj_client` | No | — | — | Completely removed |
| `@dashboard` alias | No | — | — | Removed from vite.config.ts |
| `src/dashboard/` | No | — | — | Entire directory deleted |

**Conclusion: Zero dashboard code remains. The split is clean.**

---

## 5. Public Website State

**File:** `src/HomePage.tsx`
**CSS:** `src/homepage.css` (dedicated, scoped to `.hp-site`)

### Languages / i18n
File: `src/i18n.ts`
Supported: `pap` (Papiamentu), `en` (English), `es` (Español), `nl` (Nederlands), `sv` (Svenska)
Detection: Browser `navigator.languages`, with localStorage persistence under key `unboks_language`

### Login Button
```html
<a href="https://dashboard.unboks.org"
   class="btn-ghost"
   target="_blank"
   rel="noopener noreferrer">
  Log in
</a>
```
Opens the external dashboard in a new tab. No internal route involved.

### External Links on Homepage
| Link | Destination | Purpose |
|---|---|---|
| Login button | `https://dashboard.unboks.org` | External dashboard |
| "Get started" CTA | `https://wa.me/59996881585` | WhatsApp contact |
| "Chat on WhatsApp" | `https://wa.me/59996881585` | WhatsApp contact |
| Footer WhatsApp chip | `https://wa.me/59996881585` | WhatsApp contact |

### Forms / Contact Actions
**None.** The homepage has no forms. All contact goes via WhatsApp link (`wa.me`). No email form, no API submission.

### Images used on Homepage
All imported from `@assets` (= `attached_assets/` at workspace root). Bundled at build time.
| Import | File |
|---|---|
| `logo` | `image_1777095356119.png` (default logo) |
| `logoPap` | `image_1777081806501.png` (Papiamentu logo) |
| `heroIllustration` | `image_1777081964209.png` |
| `imgSmartAutoPap` | `smart_automation_papia_1777004242843.png` |
| `imgFasterRepliesPap` | `chica_PAPIA_1777004355009.png` |
| `imgSmartAutoSv` | `smart_automation_swedish_1777004242843.png` |
| `imgFasterRepliesSv` | `chica_swedish_1777004355009.png` |
| `imgSmartAutoDefault` | `wtyj_panel_smart_automation_human_oversight_premium_1777003358272.png` |
| `imgFasterRepliesDefault` | `wtyj_panel_faster_replies_clean_1777003337352.png` |

---

## 6. Admin Panel State

**Route:** `/admin/*`
**File:** `src/admin/AdminApp.tsx` (single file, 214 lines, fully self-contained)

### Purpose
Internal Unboks tool for staff to view and manage client accounts. Currently mostly placeholder pages.

### Auth Method
Client-side only. Password stored as a **hardcoded string in source code**:
```ts
// src/admin/AdminApp.tsx, lines 6-7
const ADMIN_PASS_KEY = "unboks_admin_token";
const ADMIN_SECRET   = "unboks2025";        // ← HARDCODED — SECURITY RISK
```
On correct entry, sets `localStorage.setItem("unboks_admin_token", "1")`.
On page load, checks `localStorage.getItem("unboks_admin_token")`.

### Backend/API Usage
**None.** Admin panel is entirely static. No API calls. No database queries. Client list is hardcoded:
```ts
const CLIENTS = [
  { id: "bluemarlin",          name: "Blue Marlin Tours", ... },
  { id: "adamus",              name: "Adamus", ... },
  { id: "consultadespertares", name: "Consulta Despertares", ... },
  { id: "unboks",              name: "Unboks (internal)", ... },
];
```

### Risks
- Password `unboks2025` is visible to anyone who reads the source code or opens browser DevTools
- Anyone who sets `localStorage.setItem("unboks_admin_token","1")` in the browser console bypasses auth completely
- Not suitable for real sensitive operations — treat as a low-security internal convenience tool only

---

## 7. Demo State

**Route:** `/demo/bluemarlin/*`
**Directory:** `src/demo/bluemarlin/`
**Purpose:** A full demo website for "Blue Marlin Tours" (a real boat-tour client in Curaçao). Shows potential customers what an Unboks-powered website looks like.

### Data
Trip/resource data is **hardcoded** in `src/demo/bluemarlin/config/resources.ts`. No CMS, no database reads.

### API Calls
The demo **does** make API calls — to the separate API server artifact in this monorepo:

| File | Line | Call | Endpoint |
|---|---|---|---|
| `pages/booking.tsx` | 65 | `fetch('/api/check-availability', ...)` | POST |
| `pages/booking.tsx` | 125 | `fetch('/api/process-booking', ...)` | POST |
| `pages/book.tsx` | 32 | `apiRequest('POST', '/api/submit-booking', ...)` | POST |

These calls go to the `artifacts/api-server` service (also in this monorepo), routed via the shared Replit proxy at `/api`. The `apiRequest` helper is in `src/demo/bluemarlin/lib/queryClient.ts` — it is a plain `fetch` wrapper, **not** React Query.

### Social Links (Demo Footer)
Real Blue Marlin social accounts:
- WhatsApp: `https://wa.me/15155005577`
- Instagram: `https://www.instagram.com/bluemarlincharters/`
- Facebook: `https://www.facebook.com/profile.php?id=61587067585897`

### Dependencies specific to demo
- `react-icons` (for social icons in Footer)
- Tailwind CSS (all demo UI)

---

## 8. API / Backend Usage

### From the public website (`/` route)
**None whatsoever.** Zero API calls. Zero fetch calls. Zero env vars read at runtime.

### From the demo (`/demo/bluemarlin/*`)
Three `POST` calls to the API server (see Section 7). The API server is a separate artifact (`artifacts/api-server`) in the same monorepo.

### Environment Variables Read at Runtime
**None.** No `import.meta.env.VITE_*` variables are used in any component. The only env reads happen in `vite.config.ts` at **build time**:

| Variable | Where | Value | Purpose |
|---|---|---|---|
| `process.env.PORT` | `vite.config.ts:7` | `26169` (set by artifact.toml) | Dev server port |
| `process.env.BASE_PATH` | `vite.config.ts:10` | `"/"` (set by artifact.toml) | Vite `base` config |
| `process.env.NODE_ENV` | `vite.config.ts:17,20` | Build tooling | Conditionally loads dev-only plugins |
| `process.env.REPL_ID` | `vite.config.ts:21` | Set by Replit platform | Conditionally loads Replit dev plugins |
| `import.meta.env.BASE_URL` | `src/main.tsx:11` | Vite built-in | BrowserRouter basename |

### Shared Monorepo Libs (used by API server, not by this artifact)
The monorepo `lib/` folder contains:
| Package | Purpose |
|---|---|
| `@workspace/api-client-react` | React Query hooks auto-generated from OpenAPI spec |
| `@workspace/api-spec` | OpenAPI spec + Orval codegen config |
| `@workspace/api-zod` | Zod schemas auto-generated from OpenAPI spec |
| `@workspace/db` | Drizzle ORM schema + PostgreSQL client |

**None of these are imported by the public website.** They belong to the API server and dashboard.

### Is this project static or backend-connected?
The **public website itself** (`/`) is **100% static** — no backend connection.
The **demo** (`/demo/bluemarlin/*`) **does** call the API server for booking flows.

---

## 9. Dependencies

Full `package.json` for `@workspace/wetakeyourjob`:

| Package | Version | Required by | Classification |
|---|---|---|---|
| `react` | 19.1.0 | Everything | Core — keep |
| `react-dom` | 19.1.0 | Everything | Core — keep |
| `react-router-dom` | ^7.14.0 | App routing | Core — keep |
| `react-helmet-async` | ^3.0.0 | `main.tsx` HelmetProvider | Keep (SEO) |
| `react-icons` | ^5.4.0 | Demo footer social icons | Demo — keep |
| `lucide-react` | catalog | Admin nav icons | Admin — keep |
| `tailwindcss` | catalog | Demo + Admin UI | Keep |
| `@tailwindcss/vite` | catalog | Tailwind build plugin | Build — keep |
| `vite` | catalog | Build tool | Build — keep |
| `@vitejs/plugin-react` | catalog | Vite React plugin | Build — keep |
| `@types/react` | catalog | TypeScript types | Dev — keep |
| `@types/react-dom` | catalog | TypeScript types | Dev — keep |
| `@types/node` | catalog | TypeScript types | Dev — keep |
| `@replit/vite-plugin-cartographer` | catalog | Replit dev tool | Dev only |
| `@replit/vite-plugin-dev-banner` | catalog | Replit dev tool | Dev only |
| `@replit/vite-plugin-runtime-error-modal` | catalog | Replit dev tool | Dev only |

**Total: 15 packages.** This is a very lean dependency tree — all dashboard packages were removed in the split.

---

## 10. Assets

### Source
All images are imported via the `@assets` alias, which resolves to `attached_assets/` at the workspace root (202 files total).

### At build time
Vite processes all `@assets` imports and bundles the files into `dist/public/assets/` with content-hashed filenames. After a build, the deployed site has **no dependency on `attached_assets/`**.

### Images used in production
| Component | Image file |
|---|---|
| HomePage — default logo | `image_1777095356119.png` |
| HomePage — Papiamentu logo | `image_1777081806501.png` |
| HomePage — hero illustration | `image_1777081964209.png` |
| HomePage — smart auto (default) | `wtyj_panel_smart_automation_human_oversight_premium_1777003358272.png` |
| HomePage — faster replies (default) | `wtyj_panel_faster_replies_clean_1777003337352.png` |
| HomePage — smart auto (Papiamentu) | `smart_automation_papia_1777004242843.png` |
| HomePage — faster replies (Papiamentu) | `chica_PAPIA_1777004355009.png` |
| HomePage — smart auto (Swedish) | `smart_automation_swedish_1777004242843.png` |
| HomePage — faster replies (Swedish) | `chica_swedish_1777004355009.png` |
| Admin — Unboks logo | `image_1777435198078.png` |
| Demo — Blue Marlin logo | `bluemarlin_logo_clean.png` |
| Demo — hero image | `Klein-Curacao-beach-via-Canva.jpg_1775488974762.webp` |
| Demo — trip images | `stock_images/klein_curacao_catamaran.jpg`, `snorkeling_trip.jpg`, `west_coast_beach.jpg`, `sunset_cruise.jpg`, `jetski_excursion.jpg` |

### Public folder assets
Located at `artifacts/wetakeyourjob/public/` — served as-is at the root URL:
- `favicon.png`
- `favicon.svg`
- `opengraph.jpg`

---

## 11. Build / Deployment

### Commands
```bash
# Development (HMR)
pnpm --filter @workspace/wetakeyourjob run dev

# Type checking
pnpm --filter @workspace/wetakeyourjob run typecheck

# Production build
pnpm --filter @workspace/wetakeyourjob run build

# Preview production build locally
pnpm --filter @workspace/wetakeyourjob run serve
```

### Output
Production build output: `artifacts/wetakeyourjob/dist/public/`
```
dist/public/
├── index.html           ← SPA shell (copied from root index.html)
├── favicon.png
├── opengraph.jpg
└── assets/
    ├── index-[hash].js  ← 326 kB (102 kB gzipped)
    ├── index-[hash].css ← 61 kB (11 kB gzipped)
    └── [all images]     ← content-hashed, bundled
```

### artifact.toml Settings
```toml
kind = "web"
previewPath = "/"
title = "We Take Your Job"
router = "path"

[[services]]
name = "web"
paths = ["/"]
localPort = 26169

[services.production]
build = ["pnpm", "--filter", "@workspace/wetakeyourjob", "run", "build"]
publicDir = "artifacts/wetakeyourjob/dist/public"
serve = "static"

[[services.production.rewrites]]
from = "/*"
to   = "/index.html"    ← SPA fallback — required for React Router

[services.env]
PORT = "26169"
BASE_PATH = "/"
```

### Custom Domain / DNS
- No custom domain is configured in code or artifact.toml
- The Login button links to `https://dashboard.unboks.org` — this domain must be live and pointed at the dashboard project separately
- Replit handles HTTPS automatically on deployment

---

## 12. Current Secrets / Env Requirements

### Secrets required to run this project
**None.**

### Secrets required to deploy this project
**None.**

### Platform-managed variables (set automatically by Replit)
| Variable | Set by | Value |
|---|---|---|
| `PORT` | `artifact.toml` | `26169` |
| `BASE_PATH` | `artifact.toml` | `"/"` |
| `REPL_ID` | Replit platform | Auto |
| `NODE_ENV` | Build process | `production` in builds |

### When migrating to another workspace
Nothing to copy. No `.env` files. No secrets manager entries.

---

## 13. LLM / Channel Integration Readiness

### What code exists for channels RIGHT NOW in this project

| Location | What exists | Nature |
|---|---|---|
| `src/HomePage.tsx` | Channel pills (Email, WhatsApp, Instagram, Facebook, Telegram, Messenger, X) | **Marketing UI only** — static labels, no code |
| `src/HomePage.tsx` | WhatsApp `wa.me` links | **External link only** — opens WhatsApp, no integration |
| `src/admin/AdminApp.tsx` | Client list with channel names as strings | **Hardcoded display data** — no integration |
| `src/admin/AdminApp.tsx` | "Channels Setup" placeholder page | **Empty placeholder** — zero implementation |
| `src/demo/bluemarlin/components/Footer.tsx` | WhatsApp/Instagram/Facebook/X social links | **Demo site external links** — no integration |

### What does NOT exist (what Jr needs to build)
- No WhatsApp API integration (WhatsApp Business API / Cloud API)
- No Instagram Messaging API
- No Facebook Messenger API
- No Email SMTP/IMAP integration
- No Telegram Bot API
- No LLM/AI pipeline (no OpenAI, Anthropic, or similar calls)
- No webhook receivers
- No message queue
- No conversation storage
- No channel routing logic

### Where LLM/Channel work should live

| Component | Where it belongs | Why |
|---|---|---|
| WhatsApp webhook receiver | API server (`artifacts/api-server`) | Needs a running server, not static |
| Instagram/Facebook Graph API webhook | API server | Requires server-side token validation |
| Email ingestion (IMAP/SMTP) | API server or separate worker | Server process required |
| Telegram bot polling/webhook | API server | Server process required |
| LLM routing / AI response generation | API server | Needs secrets, not safe in browser |
| Channel state per client | Database (`lib/db`) | Needs persistence |
| Message history | Database (`lib/db`) | Needs persistence |
| Customer dashboard (agents seeing messages) | `dashboard.unboks.org` project | Separate Replit project |

### What should NOT be added to this public website project
- No API keys or secrets (this repo has none and should stay that way)
- No LLM calls from the browser
- No webhook routes (static SPA cannot receive webhooks)
- No channel connection logic
- No message storage
- The `/admin` panel should remain a lightweight read-only view — real channel management belongs in the dashboard project

---

## 14. Risks / Warnings

### CRITICAL — Hardcoded admin password
```ts
// src/admin/AdminApp.tsx:7
const ADMIN_SECRET = "unboks2025";
```
- Visible in browser DevTools → Sources
- Bypassable via `localStorage.setItem("unboks_admin_token","1")` in console
- Anyone with source access knows the password
- **Recommendation:** Replace with a server-side auth check before using admin for anything sensitive

### MEDIUM — Demo API calls may fail if API server is down
The demo booking pages (`/demo/bluemarlin/booking` and `/book`) POST to `/api/check-availability`, `/api/process-booking`, `/api/submit-booking`. If the `artifacts/api-server` workflow is not running, these calls fail. The demo form will show an error. The public homepage is unaffected.

### LOW — `dashboard.unboks.org` not yet confirmed live
The Login button links to `https://dashboard.unboks.org`. If that domain is not deployed, the button leads to a dead link. The website itself continues to work normally.

### LOW — `attached_assets/` needed for dev, not for production
In a new workspace, if `attached_assets/` is missing, the Vite dev server fails to resolve image imports. Production deploy is fine (images are bundled). See migration report for details.

### LOW — Admin client list is hardcoded
```ts
const CLIENTS = [
  { id: "bluemarlin", ... },
  { id: "adamus", ... },
  { id: "consultadespertares", ... },
  { id: "unboks", ... },
];
```
Adding a new client requires a code change and redeployment.

### INFO — All admin sub-pages are placeholders
Clients, Intake, Channels Setup, Monitoring, Settings all show "This section will be built in a future session." No functionality has been built yet.

---

## 15. Build / Typecheck Results

### Typecheck
```
pnpm --filter @workspace/wetakeyourjob run typecheck

> tsc -p tsconfig.json --noEmit

Exit code: 0 ✓ — ZERO ERRORS
```

### Production Build
```
pnpm --filter @workspace/wetakeyourjob run build

✓ built in 12.35s

Output: artifacts/wetakeyourjob/dist/public/
  index-CvfTEY4K.css    61.21 kB │ gzip:  10.96 kB
  index-DKrMFE61.js    326.82 kB │ gzip: 102.16 kB
  + 16 image assets bundled

Exit code: 0 ✓ — BUILD PASSES
```

---

## 16. Final Summary For Jr

### What this repo currently does
It serves **unboks.org** — a public marketing website. When someone visits the site, they see what Unboks does, can switch between 5 languages, and can click through to WhatsApp or to the external customer dashboard at `dashboard.unboks.org`. There is also an internal admin panel at `/admin` (password `unboks2025`) that shows a static list of 4 clients, and a demo site at `/demo/bluemarlin/` showing a boat-tour client's website powered by Unboks.

### What Jr should touch
- **Nothing in this project** for the LLM/channel integration phase
- The channel and AI work belongs entirely in the **API server** (`artifacts/api-server`) and the **dashboard** (`dashboard.unboks.org`)
- If the admin panel needs real functionality (connecting channels per client, viewing status), that work goes in `src/admin/AdminApp.tsx` — but it currently has no backend and all pages are placeholders

### What Jr should NOT touch
- `src/HomePage.tsx` — do not change the public website design or content
- `src/homepage.css` — do not touch public website styles
- `src/i18n.ts` — translations are complete; only edit if adding a new language or fixing copy
- `src/demo/bluemarlin/` — the demo is a finished, working site; leave it alone unless the client requests changes
- Do not add any LLM API keys, webhook receivers, or backend logic to this static SPA

### Where LLM/channel work should happen
| Work | Where |
|---|---|
| WhatsApp Business API webhook | `artifacts/api-server` |
| Instagram / Facebook Graph API | `artifacts/api-server` |
| Email ingestion | `artifacts/api-server` |
| Telegram / Messenger bots | `artifacts/api-server` |
| LLM response generation | `artifacts/api-server` |
| Message routing per client | `artifacts/api-server` + `lib/db` |
| Agent dashboard (human-in-the-loop) | `dashboard.unboks.org` (separate project) |
| Showing channel status to admin | `src/admin/AdminApp.tsx` (once API exists) |

The public website (`this project`) is done. It is stable, clean, and ready. Jr's work starts in the API server.

---

*Report generated by read-only inspection — no files were modified.*
