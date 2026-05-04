# Unboks.org — Migration Audit Report

**Date:** May 2026
**Instruction:** Read-only audit. No code was changed.

---

## 1. Project Identity

| Item | Value |
|------|-------|
| Project name | Unboks.org public website |
| Internal package name | `@workspace/wetakeyourjob` |
| Replit stack | pnpm monorepo (`PNPM_WORKSPACE`) |
| What this project contains | Public website + a stub admin panel + one client demo (Blue Marlin Tours) + a separate API server artifact |
| Is this only the public website? | **Yes.** The dashboard was fully split out into a separate project. No dashboard code remains here. |
| Does it contain dashboard/API code? | No dashboard code. A lightweight API server artifact (`artifacts/api-server`) exists in the same monorepo but is only used by the Blue Marlin demo at `/demo/bluemarlin/*`. It is not used by the public pages. |

### Important folders

| Folder | Purpose |
|--------|---------|
| `artifacts/wetakeyourjob/src/` | All public website source code |
| `artifacts/wetakeyourjob/src/i18n.ts` | All copy/translations for all 5 languages |
| `artifacts/wetakeyourjob/src/faq-data.ts` | All FAQ questions and answers |
| `artifacts/wetakeyourjob/src/homepage.css` | All custom CSS for the public site |
| `artifacts/wetakeyourjob/src/admin/` | Stub admin panel at `/admin/*` — hardcoded, no real backend |
| `artifacts/wetakeyourjob/src/demo/bluemarlin/` | Blue Marlin Tours demo site at `/demo/bluemarlin/*` |
| `artifacts/api-server/` | API server used only by the Blue Marlin demo |
| `attached_assets/` | **All images used by the website.** Lives at monorepo root. Vite alias `@assets` points here. Must migrate with the project. |
| `public/` (inside `artifacts/wetakeyourjob/`) | Static files: `favicon.png`, `favicon.svg`, `opengraph.jpg` |

---

## 2. Framework and Build

| Item | Value |
|------|-------|
| Framework | React 19 + Vite 6 + TypeScript + Tailwind CSS v4 |
| Package manager | pnpm (workspace) |
| Node version | **24.13.0** (declared as `nodejs-24` in `replit.nix`) |
| Dev command | `pnpm --filter @workspace/wetakeyourjob run dev` |
| Build command | `pnpm --filter @workspace/wetakeyourjob run build` |
| Output folder | `artifacts/wetakeyourjob/dist/public` |
| Static or backend? | **Fully static SPA.** The website has no backend routes. It builds to a `dist/public` folder and is served as static files. The production deployment in `artifact.toml` confirms `serve = "static"`. |
| SPA routing | All paths rewrite to `/index.html` (configured in `artifact.toml` rewrites) |

---

## 3. Routes and Pages

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | `HomePage` | Main public landing page |
| `/contact` | `ContactPage` | WhatsApp + email contact page |
| `/faq` | `FAQPage` | 28-question accordion FAQ, 6 categories |
| `/admin/*` | `AdminApp` | Stub admin panel. **Password is hardcoded: `unboks2025`.** No real authentication backend. |
| `/demo/bluemarlin/*` | `DemoApp` | Blue Marlin Tours booking demo. Calls `/api/*` on the API server. |
| `*` (catch-all) | — | Redirects to `/` |

### Login button behavior
- **Current target:** `https://dashboard.unboks.org` (no `/login` suffix)
- Present on: `HomePage.tsx`, `ContactPage.tsx`, `FAQPage.tsx` — all three pages
- It opens in a new tab (`target="_blank"`)
- It does **not** point to any old Replit URL or `/dashboard/login`

### Recommended final login URL
The current URL `https://dashboard.unboks.org` will work if the dashboard routes to a login page automatically. If the dashboard needs a specific path, update to `https://dashboard.unboks.org/login`. **No change made — awaiting approval.**

### Hardcoded domain references
| Domain | File(s) | Used for |
|--------|---------|---------|
| `https://dashboard.unboks.org` | `HomePage.tsx`, `ContactPage.tsx`, `FAQPage.tsx` | Login button in nav |
| `https://wa.me/59996881585` | `HomePage.tsx`, `ContactPage.tsx`, `FAQPage.tsx` | All WhatsApp CTAs |
| `hello@unboks.org` | `i18n.ts` (footer copy), `ContactPage.tsx` | Email contact |
| `hello@wetakeyourjob.com` | `demo/bluemarlin/components/Footer.tsx` | Old WTYJ email — in demo only, not on public pages |
| No `api.unboks.org` references found | — | — |

---

## 4. Environment Variables and Secrets

**No secrets are required to run or deploy the public website.**

The website is a fully static React SPA. It makes no server-side API calls and has no authentication of its own.

| Check | Result |
|-------|--------|
| `.env` files | None found |
| `VITE_*` variables | None used in source code |
| API keys | None |
| Analytics keys | None — no analytics installed |
| Contact form keys | None — contact page links to WhatsApp/email directly, no form service |
| Email service keys | None |
| `SESSION_SECRET` (Replit secret) | Present in this workspace but **not referenced** by the website code. It was used by a previous server-side component that has since been removed. It does not need to be recreated in the new workspace for the public website. |
| `import.meta.env.BASE_URL` | Used in `main.tsx` for the router basename. This is a Vite built-in — no configuration needed. |
| `PORT` / `BASE_PATH` | Set automatically by the Replit artifact system in `artifact.toml`. Not secret. |

---

## 5. Assets

All assets live in `attached_assets/` at the **monorepo root**. The Vite alias `@assets` resolves to this folder. This folder must be migrated together with the project — it is not inside `artifacts/`.

### Assets actively used by the public website

| File | Used by | Purpose |
|------|---------|---------|
| `image_1777095356119.png` | All 3 public pages (nav) | **Main Unboks logo** (default, all languages except Papiamentu) |
| `image_1777081806501.png` | All 3 public pages (nav) | **Unboks logo — Papiamentu variant** |
| `image_1777081964209.png` | `HomePage.tsx` | Hero illustration |
| `wtyj_panel_smart_automation_human_oversight_premium_1777003358272.png` | `HomePage.tsx` | Feature section — default language |
| `wtyj_panel_faster_replies_clean_1777003337352.png` | `HomePage.tsx` | Feature section — default language |
| `smart_automation_papia_1777004242843.png` | `HomePage.tsx` | Feature section — Papiamentu |
| `chica_PAPIA_1777004355009.png` | `HomePage.tsx` | Feature section — Papiamentu |
| `smart_automation_swedish_1777004242843.png` | `HomePage.tsx` | Feature section — Swedish |
| `chica_swedish_1777004355009.png` | `HomePage.tsx` | Feature section — Swedish |
| `image_1777435198078.png` | `admin/AdminApp.tsx` | Unboks logo in admin stub |

### Assets used by the Blue Marlin demo only (not public pages)
| File | Used by |
|------|---------|
| `bluemarlin_logo_clean.png` | Demo logo |
| `stock_images/klein_curacao_catamaran.jpg` | Demo booking |
| `stock_images/klein_curacao_trip.jpg` | Demo booking |
| `stock_images/snorkeling_trip.jpg` | Demo booking |
| `stock_images/west_coast_beach.jpg` | Demo booking |
| `stock_images/sunset_cruise.jpg` | Demo booking |
| `stock_images/jetski_excursion.jpg` | Demo booking |
| `Klein-Curacao-beach-via-Canva.jpg_1775488974762.webp` | Demo hero |

### Public folder assets (inside `artifacts/wetakeyourjob/public/`)
- `favicon.png`
- `favicon.svg`
- `opengraph.jpg`

### Are all assets included in the project?
**Yes.** All referenced assets are present in `attached_assets/`. Nothing is linked from an external Replit project or CDN (except Google Fonts — see Section 9).

---

## 6. i18n / Languages

| Item | Value |
|------|-------|
| Supported languages | Papiamentu (`pap`), English (`en`), Spanish (`es`), Dutch (`nl`), Swedish (`sv`) |
| Translation file | `artifacts/wetakeyourjob/src/i18n.ts` — single file, all 5 languages, all copy |
| FAQ data file | `artifacts/wetakeyourjob/src/faq-data.ts` — FAQ questions and answers (English only) |
| Language selector | Stored in `localStorage` under key `unboks_language` |
| Fallback | Browser language auto-detection (`navigator.languages`) — falls back to `en` if no match |
| Logo variants | Separate logo image is shown for `pap` (Papiamentu). Feature images also have separate `pap` and `sv` variants. |
| All five languages included? | **Yes** — Papiamentu, English, Spanish, Dutch, and Swedish are all fully translated. |

---

## 7. Domain Setup

| Item | Value |
|------|-------|
| Intended domain | `https://unboks.org` |
| Current status | Domain is connected to this Replit project and live |
| Deployment target | Replit Autoscale |
| Serve mode | Static (pre-built Vite output) |
| SSL | Active (Replit manages SSL automatically for connected custom domains) |
| `www.unboks.org` | Status unknown from audit — cannot confirm from code alone. Recommend verifying in the Replit Deployments > Custom Domains panel. |

### DNS record type for new workspace
When connecting `unboks.org` to the new workspace, Replit will ask for:
- **A record** (for the apex domain `unboks.org`) pointing to Replit's IP, **plus**
- **TXT record** for domain ownership verification

If using `www.unboks.org`: a **CNAME** record pointing to the Replit deployment hostname.

**Important:** The domain must be disconnected from the old workspace before it can be connected to the new one. Do not disconnect until the new workspace is fully deployed and ready.

---

## 8. Login / Dashboard Link

| Item | Value |
|------|-------|
| Current Login button target | `https://dashboard.unboks.org` |
| Points to old Replit URL? | No |
| Points to `/dashboard/login`? | No |
| Points to `dashboard.unboks.org`? | **Yes — correct** |
| Recommendation | If the dashboard requires a specific login path, update to `https://dashboard.unboks.org/login`. Currently it points to the root. No change made. |

---

## 9. External Dependencies

| Dependency | Type | Used for | Required? |
|------------|------|---------|-----------|
| Google Fonts CDN | CSS `@import` in `index.css` | Inter, DM Mono, Manrope, Playfair Display fonts | Yes — requires internet access at build/render time |
| `wa.me/59996881585` | Outbound link | All WhatsApp CTA buttons | Yes — WhatsApp number must remain valid |
| `dashboard.unboks.org` | Outbound link | Login button | Yes — dashboard must be live at that domain |
| Replit Vite plugins | Dev-only | `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-dev-banner` | Dev only. Active only when `REPL_ID` env var is set. Do not affect production build. |
| `/api/*` (API server) | Internal | Blue Marlin demo booking only — not used by public pages | Only needed for the demo |
| Analytics (GA, Hotjar, etc.) | — | **None installed** | — |
| Contact form service (Formspree, etc.) | — | **None — contact is WhatsApp + email link only** | — |
| Sentry / error tracking | — | **None installed** | — |
| Zernio | Mentioned in admin stub placeholder text only — no actual integration | — | No |
| Meta / WhatsApp Business API | Not directly integrated in this project | — | No |

---

## 10. Migration Risks

| Risk | Severity | Detail |
|------|----------|--------|
| `attached_assets/` is at monorepo root, not inside `artifacts/` | **HIGH** | If only `artifacts/wetakeyourjob/` is copied, all images break. The entire monorepo must be migrated. |
| Domain cutover window | **HIGH** | The domain must be disconnected from the old workspace and re-connected in the new workspace. There will be a brief downtime window. Plan this carefully. |
| `www.unboks.org` configuration unknown | **MEDIUM** | Verify in the Deployments panel whether `www.unboks.org` is currently configured and redirecting. If it is, recreate that in the new workspace. |
| Login URL missing `/login` | **LOW** | `https://dashboard.unboks.org` (no path) is the current login button target. If the dashboard does not redirect root to login, users may land on the wrong page. Recommend confirming this before migration. |
| Google Fonts requires internet | **LOW** | Fonts load from `fonts.googleapis.com`. Will work in any environment with outbound internet. No action needed. |
| `hello@wetakeyourjob.com` in demo footer | **LOW** | Old WTYJ email appears in `demo/bluemarlin/components/Footer.tsx`. Not visible on public pages. Update if the demo is ever shown publicly. |
| Replit-specific Vite plugins | **LOW** | `@replit/vite-plugin-cartographer` and friends are in `devDependencies`. They only activate when `REPL_ID` is set, so they are harmless in a non-Replit build. No action needed. |
| Hardcoded admin password | **LOW** | `unboks2025` is hardcoded in `admin/AdminApp.tsx`. The admin panel at `/admin/*` is a stub with no real backend. Low risk but should be noted. |
| `SESSION_SECRET` not needed | **INFO** | Present in this workspace's secrets but unused by the website. Do not copy it unless needed. |
| pnpm monorepo structure | **INFO** | The project is a pnpm workspace. Standard `npm install` will not work. Must use `pnpm install` in the monorepo root. |

---

## 11. New Workspace Migration Checklist

Follow this order exactly.

### Step 1 — Import the project
- [ ] Fork or import the entire Replit project into the new company workspace
- [ ] Confirm the full monorepo structure is present, including `attached_assets/` at the root

### Step 2 — Install dependencies
- [ ] Run `pnpm install` at the monorepo root
- [ ] Confirm no lockfile errors (`pnpm install --frozen-lockfile` to be safe)

### Step 3 — Run the dev server
- [ ] Start the workflow: `pnpm --filter @workspace/wetakeyourjob run dev`
- [ ] Open the Replit preview and confirm the homepage loads
- [ ] Confirm the logo appears, hero image loads, language switcher works
- [ ] Navigate to `/contact` — confirm it loads
- [ ] Navigate to `/faq` — confirm accordion opens and closes

### Step 4 — Build
- [ ] Run `pnpm --filter @workspace/wetakeyourjob run build`
- [ ] Confirm `artifacts/wetakeyourjob/dist/public/index.html` exists
- [ ] Confirm no build errors

### Step 5 — Publish (deploy)
- [ ] In the new workspace, click **Publish / Deploy**
- [ ] Confirm the Replit-generated `.replit.app` domain loads the site correctly
- [ ] Test the homepage on the `.replit.app` domain before touching DNS

### Step 6 — Add custom domain `unboks.org`
- [ ] In the new workspace Deployments panel, add `unboks.org` as a custom domain
- [ ] Replit will show you the required DNS records (A record + TXT record)
- [ ] **Do not update DNS yet** — prepare the records first

### Step 7 — Disconnect domain from old workspace
- [ ] In the **old** workspace, go to Deployments > Custom Domains
- [ ] Remove `unboks.org` from the old workspace
- [ ] Wait for the removal to confirm

### Step 8 — Update DNS
- [ ] Add the A record provided by the new workspace to your DNS registrar
- [ ] Add the TXT verification record
- [ ] If `www.unboks.org` was configured: add a CNAME for `www` pointing to the Replit deployment hostname
- [ ] DNS propagation typically takes 5–30 minutes (up to 48 hours maximum)

### Step 9 — Verify SSL
- [ ] Once DNS propagates, confirm `https://unboks.org` loads with a valid SSL certificate
- [ ] Replit provisions SSL automatically after the domain verifies

### Step 10 — Functional tests
- [ ] **Homepage** — loads at `unboks.org`, logo visible, hero image visible
- [ ] **Language selector** — switch to Dutch, Spanish, Swedish, Papiamentu — all copy changes
- [ ] **Language persistence** — reload page — language selection is remembered
- [ ] **Contact page** — navigate to `unboks.org/contact` — both cards visible, WhatsApp link works
- [ ] **FAQ page** — navigate to `unboks.org/faq` — accordion expands and collapses
- [ ] **Login button** — click "Log in" — opens `dashboard.unboks.org` in new tab
- [ ] **WhatsApp CTA** — click "Get started" — opens `wa.me/59996881585` in new tab
- [ ] **Navigation** — all nav links work (`/#services`, `/#how`, `/faq`, `/contact`)
- [ ] **Mobile layout** — test on a mobile device or browser dev tools at 375px width

### Step 11 — Final checks
- [ ] Confirm `www.unboks.org` either resolves or redirects correctly
- [ ] Confirm old workspace is no longer serving `unboks.org`
- [ ] Confirm opengraph image appears when the URL is shared on WhatsApp or Telegram

---

## Summary

This project is a clean, fully static React SPA. There are no secrets, no backend, and no third-party service integrations required for the public pages. The migration is straightforward with two main risks to manage carefully: the `attached_assets/` folder must travel with the monorepo (not just the `artifacts/` folder), and the domain cutover requires a brief coordinated step between the old and new workspace. Everything else is standard.
