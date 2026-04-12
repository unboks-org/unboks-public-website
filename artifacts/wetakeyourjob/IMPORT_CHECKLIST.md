# Import Checklist

## Operator Dashboard

### Where to paste code
- **Login page**: Replace `src/pages/dashboard/DashboardLoginPlaceholder.tsx`
- **Overview page**: Replace `src/pages/dashboard/DashboardOverviewPlaceholder.tsx`
- **Messages page**: Replace `src/pages/dashboard/DashboardMessagesPlaceholder.tsx`
- **Escalations page**: Replace `src/pages/dashboard/DashboardEscalationsPlaceholder.tsx`
- **Content page**: Replace `src/pages/dashboard/DashboardContentPlaceholder.tsx`
- **Settings page**: Replace `src/pages/dashboard/DashboardSettingsPlaceholder.tsx`
- **Auth guard**: Replace `src/lib/ProtectedRoute.tsx` with real auth logic
- **Dashboard layout**: Update `src/layout/DashboardLayout.tsx` if needed
- **Shared components**: Place in `src/dashboard/components/`
- **Dashboard routes**: Place in `src/dashboard/routes/`
- **Dashboard utils/lib**: Place in `src/dashboard/lib/`
- **Dashboard hooks**: Place in `src/dashboard/hooks/`
- **Dashboard styles**: Place in `src/dashboard/styles/`

### Route mapping (old → new)
| Old route | New route |
|-----------|-----------|
| `/login` | `/dashboard/login` |
| `/` (dashboard) | `/dashboard` |
| `/messages` | `/dashboard/messages` |
| `/escalations` | `/dashboard/escalations` |
| `/content` | `/dashboard/content` |
| `/settings` | `/dashboard/settings` |

---

## BlueMarlin Demo

### Where to paste code
- **Demo page**: Replace `src/pages/demo/BlueMarlinDemoPlaceholder.tsx`
- **Demo components**: Place in `src/demo/components/`
- **Demo utils/lib**: Place in `src/demo/lib/`

### Route mapping (old → new)
| Old domain | New route |
|-----------|-----------|
| `bluemarlin.wetakeyourjob.com` | `/demo/bluemarlin` |

---

## Routes to verify after import
1. `/` — marketing homepage still works
2. `/services`, `/about`, `/contact` — marketing pages intact
3. `/dashboard/login` — real login form renders
4. `/dashboard` — overview loads after auth
5. `/dashboard/messages` — messages view works
6. `/dashboard/escalations` — escalations view works
7. `/dashboard/content` — content view works
8. `/dashboard/settings` — settings view works
9. `/demo/bluemarlin` — demo loads (hidden, direct URL only)

## Important notes
- Dashboard placeholders are currently publicly reachable (no auth). After importing the Operator Dashboard code and replacing `src/lib/ProtectedRoute.tsx` with real auth, unauthenticated users will be redirected to `/dashboard/login`.
- Unknown/404 paths redirect to `/` (homepage). This is intentional SPA behavior.

## Domains that can be retired after testing
- Old dashboard domain (if separate) — all routes now under `/dashboard/*`
- `bluemarlin.wetakeyourjob.com` — now served at `/demo/bluemarlin`
- API remains unchanged at `api.wetakeyourjob.com`
