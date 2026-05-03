# Migration Readiness Report — Unboks.org Public Website

**Date:** 2026-05-03
**Artifact:** `artifacts/wetakeyourjob` (`@workspace/wetakeyourjob`)
**Type:** Static SPA (Vite + React)

---

## 1. Required Secrets & Configuration

### Secrets

**None required.**

This is a fully static single-page application. It makes no API calls, has no backend, and uses no secret credentials. No `.env` files need to be copied.

### Environment Variables

All environment variables are infrastructure-level (set automatically by the Replit platform or the artifact runner), not application secrets.

| Variable | Source | Default if unset | Notes |
|---|---|---|---|
| `PORT` | Replit artifact runner / `artifact.toml` | `3000` | New workgroup will auto-assign a port via `artifact.toml`. No action needed. |
| `BASE_PATH` | Replit artifact runner / `artifact.toml` | `"/"` | Currently `"/"`. Safe default for a root-mounted app. |
| `NODE_ENV` | pnpm / Vite build tooling | `"development"` | Handled automatically by build scripts. |
| `REPL_ID` | Replit platform | `undefined` | Used only to conditionally enable dev-only Replit plugins (cartographer, dev-banner). Automatically set in any Replit Repl. |

### Custom `VITE_*` variables

**None found.** No custom application-level env vars are injected at build time.

---

## 2. Environment Variable Scan Results

Full search across all `.ts` / `.tsx` files in the artifact:

```
vite.config.ts:7   const rawPort = process.env.PORT;
vite.config.ts:10  const basePath = process.env.BASE_PATH ?? "/";
vite.config.ts:17  ...(process.env.NODE_ENV !== "production"
vite.config.ts:20  ...(process.env.NODE_ENV !== "production" &&
vite.config.ts:21  process.env.REPL_ID !== undefined

src/main.tsx:11    basename={import.meta.env.BASE_URL.replace(/\/$/, '')}
```

`import.meta.env.BASE_URL` is a Vite built-in automatically derived from the `base` config option (which reads `BASE_PATH`). It is not a custom variable.

**Result: No application secrets. No custom VITE_ variables. Nothing to copy.**

---

## 3. Routes Confirmed

| Route | Component | Status |
|---|---|---|
| `/` | `HomePage` | Confirmed in `App.tsx` |
| `/admin/*` | `AdminApp` | Confirmed in `App.tsx` |
| `/demo/bluemarlin/*` | `DemoApp` | Confirmed in `App.tsx` |
| `*` (catch-all) | `<Navigate to="/" replace />` | Confirmed — redirects to home, not to login |

SPA fallback rewrite rule in `artifact.toml`:
```toml
[[services.production.rewrites]]
from = "/*"
to   = "/index.html"
```
This must be preserved in the new workgroup's `artifact.toml`. The Replit artifact scaffold generates it automatically.

---

## 4. Login Button Destination

```
File: src/HomePage.tsx, line 113
Value: href="https://dashboard.unboks.org"
Attrs: target="_blank" rel="noopener noreferrer"
```

**Confirmed.** The Login button links externally to `https://dashboard.unboks.org` and opens in a new tab. No internal `/login` route exists.

> **DNS Note:** If `dashboard.unboks.org` is not yet live at migration time, the button will appear but lead to a dead link. The public website itself will be unaffected — it is fully self-contained.

---

## 5. Typecheck Result

```
pnpm --filter @workspace/wetakeyourjob run typecheck

> tsc -p tsconfig.json --noEmit

Exit code: 0 — PASS (0 errors)
```

---

## 6. Production Build Result

```
pnpm --filter @workspace/wetakeyourjob run build

✓ built in 11.24s
Output: artifacts/wetakeyourjob/dist/public/
  index-CvfTEY4K.css    61.21 kB │ gzip: 10.96 kB
  index-DKrMFE61.js    326.82 kB │ gzip: 102.16 kB
  + all image assets bundled

Exit code: 0 — PASS
```

---

## 7. Migration Blockers

**None.** The app is a self-contained static SPA with no backend, no database, and no secrets.

---

## 8. Items Requiring Attention After Migration

### A. `attached_assets/` folder — images (dev only, not a production blocker)

The Vite alias `@assets` resolves to `../../attached_assets` relative to the artifact directory (i.e., the workspace root `attached_assets/` folder, containing ~200 image files).

- **Production:** Not a concern. All images are bundled into `dist/public/assets/` at build time. The deployed app references only hashed asset paths.
- **Development (HMR):** The `attached_assets/` folder must exist at the same relative path in the new workspace. If it is missing, the dev server will fail to resolve image imports.

**Action:** Copy or re-upload the `attached_assets/` folder to the workspace root of the new Replit project. The folder is included in `wetakeyourjob.tar.gz` (present in `attached_assets/`).

### B. `artifact.toml` — port reassignment

The current `artifact.toml` hardcodes `PORT = "26169"`. The Replit platform assigns ports per-Repl, so this value will differ in the new workgroup. The Replit artifact scaffold sets this automatically when a new artifact is registered — no manual action needed.

### C. Admin password hardcoded in source

`src/admin/AdminApp.tsx` contains:
```ts
const ADMIN_SECRET = "unboks2025";
```
This is a static string in source code, not a secret. It will migrate as-is. Consider rotating it after migration if the old workgroup remains accessible to others.

### D. Google Fonts (CDN)

`index.html` and `index.css` both load fonts from `fonts.googleapis.com`. This works from any domain with no configuration changes.

### E. `dashboard.unboks.org` DNS

The Login button points to `https://dashboard.unboks.org`. This domain is independent of this project. Ensure DNS is configured and the dashboard project is deployed before directing users to log in.

---

## 9. DNS / Deployment Notes

| Item | Status |
|---|---|
| Custom domain for public site | Configure in new workgroup's Replit deployment settings |
| `dashboard.unboks.org` | Must be live and pointed at the dashboard Replit project separately |
| HTTPS | Handled automatically by Replit deployment |
| SPA routing | Requires the `[[services.production.rewrites]]` rule in `artifact.toml` — auto-generated by scaffold |

---

## 10. Rollback Recommendation

A checkpoint was created at commit `e773e38` (after the dashboard split was verified clean). If anything goes wrong during migration:

1. In the **current workgroup**, roll back to checkpoint `e773e38` — the project is in a known-good post-split state.
2. The `dist/public/` build output is deterministic — re-running `pnpm --filter @workspace/wetakeyourjob run build` after checkout will reproduce the identical bundle.

---

## Summary

| Check | Result |
|---|---|
| Secrets required | None |
| Custom env vars (VITE_*) | None |
| Routes | `/`, `/admin/*`, `/demo/bluemarlin/*` all confirmed |
| Login button | `https://dashboard.unboks.org` (external) confirmed |
| Typecheck | PASS — 0 errors |
| Production build | PASS — 11.24s |
| Migration blockers | None |
| Post-migration actions | Copy `attached_assets/` for dev; rotate admin password; verify `dashboard.unboks.org` DNS |
