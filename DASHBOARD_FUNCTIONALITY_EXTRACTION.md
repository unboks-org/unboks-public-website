# DASHBOARD FUNCTIONALITY EXTRACTION

> **Important architectural note:** The backend API that powers this dashboard is a **remote server** running at `https://api.wetakeyourjob.com/{client}/dashboard/api`. It is **not** inside this monorepo. The `artifacts/api-server` folder in this repo is an unrelated skeleton with only a health-check route. Everything described below lives entirely on the frontend side (React + Vite) plus the remote backend that it calls.

---

## SECTION 1 — Executive Summary

The dashboard is a multi-tenant React SPA that lets operators for up to four clients (bluemarlin, adamus, consultadespertares, unboks) manage AI-driven social media content, customer conversations, escalations, bookings/availability, and brand training — all through a shared codebase that points at per-client API endpoints on a remote server.

**What it does:**

- **Inbox / Messages** — Lists all inbound conversations across WhatsApp, Instagram DM, Facebook DM, X DM, and email. Supports filtering by platform, read/unread state (client-only localStorage), and conversation deletion. An AI "suggest reply" endpoint generates draft responses.
- **Escalations** — Lists AI-flagged cases that need a human. Operators can reply (which sends via email or WhatsApp relay), resolve, or delete escalations. The compose modal generates a suggested email reply body from the backend.
- **Bookings / Capacity** — Reads live availability slots from the backend booking system. Displays capacity by trip/service and date range.
- **Social Media / Content Pipeline** — Operators review AI-generated post drafts (pending → approve/reject → publish to Instagram/Facebook). Supports manual post creation, image generation, AI graphics compositing, scheduling, and platform targeting.
- **Brand Training** — Operators upload example posts and instruct the AI on brand voice. The backend analyses examples and produces brand rules. A separate "Brand Learnings" page shows auto-distilled rules from past approval/rejection patterns.
- **Asset Library** — Upload, tag, and manage photos. Supports Google Drive sync.
- **Channels** — Displays the source configuration for the client (read from the backend config endpoint).
- **Settings** — Schedule slots for auto-posting, dry-run toggle, email client preference, sidebar feature toggles (Social, Create), bookings label rename, analytics view.
- **Analytics** — Charts of message volume, escalation status, and 14-day activity trends built from local aggregation of conversations + escalations data already fetched for other pages.

**Architecture at a glance:**

```
Browser (React SPA)
  └─ api.ts (fetch wrapper with Bearer token auth)
       └─ https://api.wetakeyourjob.com/{client}/dashboard/api/*
            └─ Remote backend (not in this repo)
```

There is no backend code to migrate. Everything to carry over is frontend-only: the API client, data types, auth flow, hooks, and functional logic files.

---

## SECTION 2 — Files To Copy Into New Dashboard Project

All paths are relative to `artifacts/wetakeyourjob/src/dashboard/`.

### Core API & Types

| File | Label | Notes |
|---|---|---|
| `lib/api.ts` | **REQUIRED** | The entire API client. All 60+ endpoint calls, auth token logic, 401 guard, error normalisation, and all TypeScript types live here. This is the single most important file. |
| `lib/error.ts` | **REQUIRED** | `getErrorMessage()` helper used by every mutation hook. |
| `lib/channel-map.ts` | **REQUIRED** | Platform key definitions (whatsapp, x, instagram, tiktok, facebook), channel string → platform key mapping, and the filter predicate used by the inbox. |
| `lib/tenant.ts` | **REQUIRED** | `PRODUCT_NAME`, `CLIENT_NAME`, `AGENT_NAME` constants. Replace values for the new project's identity. |
| `lib/utils.ts` | **REQUIRED** | `cn()` (clsx + tailwind-merge). Standard shadcn/ui utility; may already exist in the new project. |
| `lib/feature-toggles.tsx` | **REQUIRED** | React context + localStorage persistence for the Social/Create sidebar module toggles. |
| `lib/theme.ts` | OPTIONAL | Theme preference helpers. Only needed if the new dashboard supports dark/light switching. |

### Auth

| File | Label | Notes |
|---|---|---|
| `components/auth/useAuthContext.ts` | **REQUIRED** | Defines the `AuthContext` shape and `useAuthContext()` hook. |
| `components/auth/AuthProvider.tsx` | **REQUIRED** | Wraps the app. Stores the per-client Bearer token in localStorage, registers the 401 callback, handles logout navigation. |
| `components/auth/ProtectedRoute.tsx` | **REQUIRED** | React Router guard that redirects unauthenticated users to `/login`. |
| `pages/Login.tsx` | DO NOT COPY | This is a UI page. The new project has its own login UI. Copy only the **logic**: `useAuth()` hook from `hooks/use-client-api.ts`, `getClient()` / `setClient()` from `lib/api.ts`, and the client selector pattern. |

### React Query Hooks

| File | Label | Notes |
|---|---|---|
| `hooks/use-client-api.ts` | **REQUIRED** | All React Query hooks: `useAuth`, `useStatus`, `useDrafts`, `useDraftMutations`, `useEscalations`, `useEscalationMutations`, `useConversations`, `useConversation`, `useDeleteConversation`, `useSuggestReply`, `useScheduleSlots`, `useUpcomingSchedule`, `useLearnings`, `useLearningMutations`, `useAvailability`, `useConfig`, `usePhotos`, `usePhotoMutations`, `useGoogleDriveMutations`, `useDryRun`, `useBrandProfile`, `useBrandProfileMutations`, `useTrainingExamples`, `useTrainingMutations`, and more. |
| `hooks/use-platform-filter.tsx` | **REQUIRED** | React context + toggle for the inbox channel filter bar. Needed by Messages and Escalations. |
| `hooks/use-read-status.ts` | **REQUIRED** | localStorage-backed read/unread + hidden set tracking for conversations. No server state. |
| `hooks/use-email-settings.ts` | **REQUIRED** | localStorage preference for Gmail vs mailto compose. Used by Escalations reply modal. |
| `hooks/use-bookings-label.ts` | **REQUIRED** | localStorage + custom event for renaming "Bookings" ↔ "Orders" in the nav. |
| `hooks/use-go-back.ts` | **REQUIRED** | Tiny helper for back-navigation with history fallback. |
| `hooks/use-mobile.tsx` | OPTIONAL | Breakpoint hook. The new project may already have one. |
| `hooks/use-toast.ts` | DO NOT COPY | Shadcn toast hook. The project uses `sonner` via `use-client-api.ts` instead; this file is a shadcn artefact. |

### Functional UI Components (carry logic, replace shell)

| File | Label | Notes |
|---|---|---|
| `components/ui/auth-image.tsx` | **REQUIRED** | Fetches authenticated image blobs via React Query and renders them as `<img>` with object URLs. Used by ContentPipeline, AssetLibrary, PublishedPosts, BrandTraining. |
| `components/PlatformFilterBar.tsx` | OPTIONAL | The channel filter pill-row UI. Bring it if the new project doesn't have its own. The logic inside it (`usePlatformFilter`) is what matters. |

### Pages (functional logic only — replace visual shells)

These pages contain all the business logic, data wiring, and state management. **Do not copy the JSX/layout wholesale** — the new project has its own design. Study each page for its hooks, state, filtering logic, and mutation calls, then wire those into the new UI.

| Page File | Label | Key functional content |
|---|---|---|
| `pages/Messages.tsx` | REQUIRED (logic) | Conversation list, platform filter, read/unread/hidden state, conversation detail panel, suggest-reply, delete. |
| `pages/Escalations.tsx` | REQUIRED (logic) | Escalation list, status filter (open/semi/resolved), compose email modal, reply/resolve/delete mutations, `isSemi()` helper. |
| `pages/BookingsPage.tsx` | REQUIRED (logic) | Availability slot display, days-ahead selector, group-by logic. |
| `pages/ContentPipeline.tsx` | REQUIRED (logic) | Status filter, draft selection, approve/reject/publish/schedule/delete mutations, image generation, platform targeting, compose mode. |
| `pages/BrandTraining.tsx` | REQUIRED (logic) | Training example upload, image viewing, brand profile CRUD, visual style analysis. |
| `pages/BrandLearnings.tsx` | REQUIRED (logic) | Learnings list, distill, delete. |
| `pages/AssetLibrary.tsx` | REQUIRED (logic) | Photo upload, tagging, service key filter, Google Drive connect/sync/folder selection, delete. |
| `pages/Create.tsx` | REQUIRED (logic) | Manual draft creation form with platform toggle. |
| `pages/Settings.tsx` | REQUIRED (logic) | Schedule slot editor, dry-run toggle, email client preference, feature toggles, bookings label selector, config viewer. |
| `pages/Analytics.tsx` | REQUIRED (logic) | Data aggregation from conversations + escalations + status; chart data computation. |
| `pages/Overview.tsx` | OPTIONAL | Summary cards wired to `useStatus()`. |
| `pages/CapacityChecker.tsx` | OPTIONAL | Alternative availability view. Wraps `useAvailability()`. |
| `pages/PublishedPosts.tsx` | OPTIONAL | Published posts gallery. Wraps `useDrafts("published")`. |
| `pages/Login.tsx` | DO NOT COPY | New project has its own login UI. |
| `pages/not-found.tsx` | DO NOT COPY | New project has its own 404 page. |

### Do Not Copy

- `components/layout/AppLayout.tsx` — sidebar/header shell. New project has its own layout.
- All `components/ui/*.tsx` — shadcn primitive components. New project has its own.
- `components/ui/skeleton.tsx`, `badge.tsx`, `button.tsx`, etc. — UI atoms only.
- Any CSS, `index.css`, Tailwind config — styling is entirely new.
- `lib/theme.ts` — only if the new project doesn't support theming.

---

## SECTION 3 — API Contract

All endpoints are under `https://api.wetakeyourjob.com/{client}/dashboard/api`. Auth is required on all endpoints except `POST /login`.

### Authentication

| Method | Path | Purpose | Auth | Request Body | Response |
|---|---|---|---|---|---|
| POST | `/login` | Exchange password for Bearer token | No | `{ password: string }` | `{ token: string }` |

### Status / Overview

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/status` | Content pipeline status counts + season | Yes | — | `{ pending, approved, rejected, published, deleted, learnings: number, season: string }` |

### Drafts (Social Media / Content Pipeline)

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/drafts?status=&limit=` | List drafts, filtered by status | Yes | query params | `Draft[]` |
| GET | `/drafts/:id` | Get single draft | Yes | — | `Draft` |
| POST | `/drafts/generate` | AI-generate new post drafts | Yes | `{ count: number }` | `{ drafts: Draft[], count: number }` |
| POST | `/drafts/manual` | Create a manual draft | Yes | `{ instagram_caption, facebook_caption?, hashtags?, content_class?, visual_suggestion?, platforms? }` | `{ ok: boolean, id: number }` |
| PUT | `/drafts/:id` | Edit draft fields | Yes | `{ instagram_caption?, facebook_caption?, hashtags?, visual_suggestion?, reasoning?, status? }` | `{ ok: boolean }` |
| DELETE | `/drafts/:id` | Hard-delete a draft | Yes | — | `{ ok: boolean }` |
| POST | `/drafts/:id/approve` | Approve a draft | Yes | — | `{ ok: boolean }` |
| POST | `/drafts/:id/reject` | Reject a draft with reason | Yes | `{ reason: string }` | `{ ok: boolean }` |
| POST | `/drafts/:id/publish` | Publish approved draft to Instagram/Facebook | Yes | — | `{ ok: boolean, post_url: string }` |
| POST | `/drafts/:id/graphics` | AI-generate image for draft | Yes | — | `{ ok: boolean, image_path: string }` |
| POST | `/drafts/:id/compose` | Compose final image (AI or from photo) | Yes | `{ mode: string, photo_id?: number }` | `{ ok: boolean, image_path: string, ai_generated: boolean }` |
| GET | `/drafts/:id/image` | Fetch draft image blob (auth-gated) | Yes | — | Binary image blob |
| PUT | `/drafts/:id/platforms` | Set target platforms for draft | Yes | `{ platforms: string[] }` | `{ ok: boolean, platforms: string[] }` |
| POST | `/drafts/:id/schedule` | Schedule a draft for later publishing | Yes | `{ scheduled_at?: string }` | `{ ok: boolean }` |
| POST | `/drafts/:id/unschedule` | Remove schedule from draft | Yes | — | `{ ok: boolean }` |

**Frontend files using drafts:** `ContentPipeline.tsx`, `PublishedPosts.tsx`, `Overview.tsx`, `Analytics.tsx`, `Create.tsx`, `hooks/use-client-api.ts`

### Learnings (Brand Rules from Feedback)

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/learnings` | List distilled learning rules | Yes | — | `Learning[]` |
| POST | `/learnings/distill` | AI-distil new rules from rejection feedback | Yes | — | `{ learnings: Learning[], count: number }` |
| DELETE | `/learnings/:id` | Deactivate a learning rule | Yes | — | `{ ok: boolean }` |

**Frontend files:** `BrandLearnings.tsx`

### Messages / Conversations

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/messages/conversations` | List all conversations | Yes | — | `Conversation[]` |
| GET | `/messages/conversations/:phone` | Get conversation detail with message thread | Yes | — | `ConversationDetail` |
| DELETE | `/messages/conversations/:phone` | Hard-delete conversation + booking state | Yes | — | `{ ok: boolean, deleted_rows: number, phone: string }` |
| POST | `/messages/suggest-reply` | AI-suggest reply text | Yes | `{ phone: string, draft_text?: string }` | `{ subject: string, body: string }` |

**Frontend files:** `Messages.tsx`, `Analytics.tsx`

### Customers

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/customers/by-identifier/:type/:value` | Resolve customer by identifier | Yes | — | `CustomerFile \| null` |

**Frontend files:** `Messages.tsx`

### Escalations

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/escalations` | List all escalations | Yes | — | `Escalation[]` |
| POST | `/escalations/:id/resolve` | Mark escalation resolved | Yes | — | `{ ok: boolean }` |
| DELETE | `/escalations/:id` | Hard-delete escalation | Yes | — | `{ ok: boolean, id: number }` |
| POST | `/escalations/:id/reply` | Send reply to customer (via email/WhatsApp relay) | Yes | `{ answer: string }` | `{ ok: boolean, reply: string }` |

**Frontend files:** `Escalations.tsx`, `Analytics.tsx`

### Availability / Bookings

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/availability?days=N` | Get availability slots for next N days | Yes | query param | `AvailabilitySlot[]` |

**Frontend files:** `BookingsPage.tsx`, `CapacityChecker.tsx`

### Schedule (Auto-post Slots)

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/schedule/slots` | Get configured posting schedule slots | Yes | — | `ScheduleSlot[]` |
| PUT | `/schedule/slots` | Replace all schedule slots | Yes | `{ slots: { day_of_week, time_utc }[] }` | `{ ok: boolean, slots: ScheduleSlot[] }` |
| GET | `/schedule/upcoming` | Get upcoming scheduled drafts | Yes | — | `Draft[]` |

**Frontend files:** `Settings.tsx`

### Platforms

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/platforms/available` | List platforms enabled for this client | Yes | — | `{ platforms: string[] }` |

**Frontend files:** `ContentPipeline.tsx`

### Photos / Asset Library

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| POST | `/photos/upload` | Upload photo (multipart) | Yes | FormData: `file`, `tags`, `service_key` | `{ ok: boolean, photo: Photo }` |
| GET | `/photos?service_key=&limit=` | List photos | Yes | query params | `Photo[]` |
| GET | `/photos/stats` | Photo counts by trip/service | Yes | — | `PhotoStats` |
| GET | `/photos/:id/image` | Fetch photo blob (auth-gated) | Yes | — | Binary image blob |
| PUT | `/photos/:id` | Update photo tags/service key | Yes | `{ tags?, service_key? }` | `{ ok: boolean }` |
| DELETE | `/photos/:id` | Delete photo | Yes | — | `{ ok: boolean }` |

**Frontend files:** `AssetLibrary.tsx`, `ContentPipeline.tsx`

### Google Drive Integration

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/google/auth?redirect_to=` | Get OAuth redirect URL (navigated to, not fetched) | Yes | query param | Redirect URL string |
| GET | `/google/status` | Check if Drive is connected | Yes | — | `{ connected: boolean, folder_id?, updated_at? }` |
| POST | `/google/disconnect` | Disconnect Drive | Yes | — | `{ ok: boolean }` |
| GET | `/google/folders` | List Drive folders | Yes | — | `{ id, name }[]` |
| POST | `/google/folder` | Set active Drive folder | Yes | `{ folder_id: string }` | `{ ok: boolean }` |
| POST | `/google/sync` | Pull photos from Drive into asset library | Yes | — | `{ ok: boolean, synced: number, total_in_folder: number }` |

**Frontend files:** `AssetLibrary.tsx`

### Settings

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/settings/dry-run` | Get dry-run state | Yes | — | `{ dry_run: boolean }` |
| POST | `/settings/dry-run` | Toggle dry-run | Yes | — | `{ dry_run: boolean }` |
| GET | `/config` | Get client config/context text | Yes | — | `{ context: string }` |

**Frontend files:** `Settings.tsx`, `Channels.tsx`

### Brand Training

| Method | Path | Purpose | Auth | Request | Response |
|---|---|---|---|---|---|
| GET | `/training/examples` | List training examples | Yes | — | `TrainingExample[]` |
| POST | `/training/examples` | Upload training example (multipart) | Yes | FormData: `caption_text`, `platform`, `file?` | `{ ok: boolean, id: number }` |
| DELETE | `/training/examples/:id` | Delete training example | Yes | — | `{ ok: boolean }` |
| GET | `/training/examples/:id/image` | Fetch training image blob | Yes | — | Binary image blob |
| POST | `/training/analyze` | AI-analyse examples to extract brand rules | Yes | — | `{ ok: boolean, categories_analyzed: number }` |
| POST | `/training/analyze-visual` | AI-analyse photo library for visual rules | Yes | — | `{ ok: boolean, visual_rules: string[], count: number }` |
| GET | `/training/profile` | Get full brand profile (rules by category) | Yes | — | `Record<string, BrandRule[]>` |
| POST | `/training/profile` | Add manual brand rule | Yes | `{ category: string, rule: string }` | `{ ok: boolean, id: number }` |
| PUT | `/training/profile/:id` | Edit brand rule | Yes | `{ rule: string }` | `{ ok: boolean }` |
| DELETE | `/training/profile/:id` | Delete brand rule | Yes | — | `{ ok: boolean }` |

**Frontend files:** `BrandTraining.tsx`, `BrandLearnings.tsx`

---

## SECTION 4 — Auth Flow

### Login flow

1. User enters a **client slug** (e.g. `bluemarlin`) and a **password** on the login page.
2. `setClient(slug)` is called, which writes the slug to `localStorage["wtyj_client"]` and updates the in-memory `BASE_URL` to `https://api.wetakeyourjob.com/{slug}/dashboard/api`.
3. `api.login(password)` sends `POST /login` with `{ password }` (no auth header). On success the server returns `{ token: string }`.
4. `AuthProvider.login(token)` writes `token` to `localStorage["wtyj_token_{slug}"]` and sets React state.
5. All subsequent API calls include `Authorization: Bearer {token}` headers via `getHeaders()`.

### Token storage

- Key pattern: `wtyj_token_{clientSlug}` — namespaced per client to prevent session bleed when switching clients.
- Client slug: `wtyj_client`.
- Both keys live in `localStorage`.

### Protected route logic

`ProtectedRoute` (React Router) checks `isAuthenticated` (truthy token in AuthContext). If false, redirects to `/login` preserving the intended destination in `location.state.from`. After login, the app navigates to `location.state.from || "/dashboard"`.

### 401 handling (two-strike guard)

`api.ts` maintains a counter. A single 401 within a 60-second window is ignored (transient). A second 401 within the same window — or any 401 when no token is stored — triggers `onUnauthorized()`, which clears both localStorage keys and navigates to `/login`. This is registered in `AuthProvider.useEffect`.

### Logout

`AuthProvider.logout()` calls `clearAuth()` (removes both localStorage keys, sets token state to null) then navigates to `/login`.

### Required environment variables for auth

None on the frontend. The password is validated by the remote backend. No env vars are needed client-side.

---

## SECTION 5 — Data Types / Models

All defined in `lib/api.ts`.

### Conversation (inbox list item)

```typescript
interface Conversation {
  phone: string;              // unique identifier (may be phone, email, or DM handle)
  customer_name: string;
  last_message: string;
  last_message_role: string;  // "user" | "assistant"
  last_message_at: string;    // ISO datetime
  status: string;             // conversation status
  message_count: number;
  channel?: string;           // "whatsapp" | "email" | "instagram_dm" | "facebook_dm" | "twitter_dm"
}
```

### ConversationDetail (thread view)

```typescript
interface ConversationDetail {
  phone: string;
  messages: { role: string; text: string; created_at: string }[];
  booking_state: {
    fields: Record<string, unknown>;
    flags: Record<string, unknown>;
    completed_bookings: unknown[];
    last_activity: string | null;
  };
}
```

### CustomerFile (customer record)

```typescript
interface CustomerFile {
  id: number;
  display_name: string;
  summary: string;
  notes: string;
  first_seen: string;
  last_seen: string;
  identifiers: { type: string; value: string; first_seen: string }[];
  recent_interactions: { channel: string; summary: string; created_at: string }[];
}
```

### Escalation

```typescript
interface Escalation {
  id: number;
  notification_type: string;  // "email" | "semi_automated" | ... determines reply UI
  relay_token: string | null;  // WhatsApp relay token if applicable
  channel: string;
  customer_id: string;
  customer_name: string;
  subject: string;
  body: string;
  status: string;             // "open" | "resolved"
  created_at: string;
  contact_type?: "email" | "whatsapp" | "phone" | "unknown";
  customer_contact?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
}
```

### Draft (social media post)

```typescript
type DraftStatus = "pending" | "approved" | "rejected" | "published" | "deleted" | "scheduled";
type ContentClass = "A" | "B" | "C" | "D";

interface Draft {
  id: number;
  content_class: ContentClass;
  instagram_caption: string;
  facebook_caption: string;
  twitter_caption: string;
  hashtags: string[];
  visual_suggestion: string;
  reasoning: string;
  status: DraftStatus;
  rejection_reason?: string;
  created_at: string;
  approved_at?: string;
  published_at?: string;
  image_path?: string;
  late_post_id?: string;
  instagram_url?: string;
  platforms?: string[];
  facebook_url?: string;
  scheduled_at?: string;
}
```

### StatusResponse (overview counts)

```typescript
interface StatusResponse {
  pending: number;
  approved: number;
  rejected: number;
  published: number;
  deleted: number;
  learnings: number;
  season: string;
}
```

### Learning (auto-distilled brand rule)

```typescript
interface Learning {
  id: number;
  rule: string;
  source_draft_ids: number[];
  created_at: string;
}
```

### AvailabilitySlot (bookings)

```typescript
interface AvailabilitySlot {
  service_key: string;
  date: string;
  slot_time: string;
  booked_guests: number;
  capacity: number;
  spots_remaining: number;
}
```

### ScheduleSlot (auto-post schedule)

```typescript
interface ScheduleSlot {
  id: number;
  day_of_week: string;  // "Monday" | "Tuesday" | ...
  time_utc: string;     // "HH:MM"
}
```

### Photo (asset library)

```typescript
interface Photo {
  id: number;
  filename: string;
  original_filename: string;
  tags: string[];
  service_key: string;
  source: string;
  width: number;
  height: number;
  file_size: number;
  used_count: number;
  uploaded_at: string;
}

interface PhotoStats {
  total: number;
  by_trip: Record<string, number>;
}
```

### TrainingExample (brand training)

```typescript
interface TrainingExample {
  id: number;
  caption_text: string;
  image_path: string;
  platform: string;
  created_at: string;
}
```

### ConfigResponse (client config / channels)

```typescript
interface ConfigResponse {
  context: string;  // free-text system context shown in Channels page
}
```

### Channels / Platforms

```typescript
type PlatformKey = "whatsapp" | "x" | "instagram" | "tiktok" | "facebook";

interface PlatformDef {
  key: PlatformKey;
  label: string;
  channels: string[];  // raw channel strings that map to this platform
  color: string;
}
```

### Email settings (client-only, localStorage)

```typescript
interface EmailSettings {
  enabled: boolean;
  client: "gmail" | "mailto";
}
```

### Feature toggles (client-only, localStorage)

```typescript
interface Features {
  showSocial: boolean;   // whether Content Pipeline appears in nav
  showCreate: boolean;   // whether Create page appears in nav
}
```

---

## SECTION 6 — Functional Mapping For New Dashboard

### Inbox page

**Needs:**
- `hooks/use-client-api.ts` → `useConversations()`, `useConversation(phone)`, `useDeleteConversation()`, `useSuggestReply()`
- `hooks/use-platform-filter.tsx` → `PlatformFilterProvider`, `usePlatformFilter()`
- `hooks/use-read-status.ts` → `useReadStatus()`, `useHiddenSet()`
- `lib/channel-map.ts` → `matchesPlatformFilter()`, `PLATFORMS`, `channelToPlatformKey()`
- `lib/api.ts` → `Conversation`, `ConversationDetail`, `CustomerFile` types
- Endpoint: `GET /messages/conversations`, `GET /messages/conversations/:phone`, `DELETE /messages/conversations/:phone`, `POST /messages/suggest-reply`
- Optional: `useCustomerByIdentifier()` to resolve a contact's display name from a non-phone identifier

**Key client-side logic to preserve:**
- Read status is stored in localStorage only, not synced to server.
- Hidden/archived conversations are stored in localStorage only.
- The `phone` field is used as the unique conversation key (may contain non-phone identifiers for DM channels).
- Platform filter is an OR filter: empty selection = show all; one or more = show matching channels only.

### Escalations page

**Needs:**
- `hooks/use-client-api.ts` → `useEscalations()`, `useEscalationMutations()` (resolve), `useEscalationReply()`, `useDeleteEscalation()`
- `hooks/use-email-settings.ts` → `useEmailSettings()`, `openEmailCompose()`
- `lib/api.ts` → `Escalation` type
- Endpoints: `GET /escalations`, `POST /escalations/:id/resolve`, `POST /escalations/:id/reply`, `DELETE /escalations/:id`

**Key client-side logic to preserve:**
- `isSemi(notification_type)` — determines whether the reply compose modal sends via WhatsApp relay (semi-automated) or composes an email. The specific notification_type strings must be checked against the current `Escalations.tsx` implementation (look for the `isSemi` function definition).
- The reply modal calls `useSuggestReply()` to pre-fill the answer body from the AI, then lets the operator edit before sending.
- Email compose opens Gmail or mailto depending on `EmailSettings.client`.

### Bookings / Orders page

**Needs:**
- `hooks/use-client-api.ts` → `useAvailability(days)`
- `lib/api.ts` → `AvailabilitySlot` type
- Endpoint: `GET /availability?days=N`

**Key client-side logic to preserve:**
- Days-ahead selector (7 / 14 / 30 days).
- Group-by selector (by service, by date).
- Capacity calculation: `spots_remaining = capacity - booked_guests`.

### Channels page

**Needs:**
- `hooks/use-client-api.ts` → `useConfig()`
- `lib/channel-map.ts` → `PLATFORMS` list for display
- Endpoint: `GET /config`

### Settings page

**Needs:**
- `hooks/use-client-api.ts` → `useScheduleSlots()`, `useUpcomingSchedule()`, `useScheduleSlotMutations()`, `useDryRun()`
- `hooks/use-email-settings.ts` → `useEmailSettings()`
- `hooks/use-bookings-label.ts` → `useBookingsLabel()`
- `lib/feature-toggles.tsx` → `useFeatureToggles()`
- Endpoints: `GET /schedule/slots`, `PUT /schedule/slots`, `GET /schedule/upcoming`, `GET /settings/dry-run`, `POST /settings/dry-run`

### Analytics page

**Needs:**
- `hooks/use-client-api.ts` → `useConversations()`, `useEscalations()`, `useStatus()`
- `lib/api.ts` → `Conversation`, `Escalation`, `StatusResponse` types
- No dedicated analytics endpoints — all charts are derived locally from data already fetched for other pages

**Key client-side logic to preserve:**
- Platform message counts: count conversations per channel using `channelToPlatformKey()`.
- Escalation status breakdown: count open vs resolved.
- 14-day trend: group conversations and escalations by `last_message_at` / `created_at` date.

### Social Media / Content Pipeline page

**Needs:**
- `hooks/use-client-api.ts` → `useDrafts()`, `useDraftMutations()`, `useStatus()`, `useAvailablePlatforms()`, `useUpcomingSchedule()`, `useScheduleSlots()`
- `components/ui/auth-image.tsx`
- Endpoints: all `/drafts/*` endpoints, `GET /platforms/available`, `GET /schedule/*`

### Brand Training page

**Needs:**
- `hooks/use-client-api.ts` → `useTrainingExamples()`, `useTrainingMutations()`, `useBrandProfile()`, `useBrandProfileMutations()`, `useAnalyzeVisual()`
- Endpoints: all `/training/*` endpoints

### Brand Learnings page

**Needs:**
- `hooks/use-client-api.ts` → `useLearnings()`, `useLearningMutations()`
- Endpoints: `GET /learnings`, `POST /learnings/distill`, `DELETE /learnings/:id`

### Asset Library page

**Needs:**
- `hooks/use-client-api.ts` → `usePhotos()`, `usePhotoStats()`, `usePhotoMutations()`, `useGoogleDriveStatus()`, `useGoogleDriveFolders()`, `useGoogleDriveMutations()`
- `components/ui/auth-image.tsx` (adapted for photos via `api.getPhotoImageBlob`)
- Endpoints: all `/photos/*` and `/google/*` endpoints

---

## SECTION 7 — Environment Variables

There are **no client-side environment variables** required by the dashboard. The API base URL is hard-coded in `lib/api.ts` and is mutated at runtime by `setClient()`.

All secrets (database credentials, Instagram API keys, WhatsApp tokens, Google OAuth client IDs, AI model API keys) live **exclusively on the remote backend server** and are never exposed to the browser.

The one value that could be made configurable is the base URL root:

| Conceptual variable | Current value (hard-coded) | Where used |
|---|---|---|
| API base URL template | `https://api.wetakeyourjob.com/{client}/dashboard/api` | `lib/api.ts`, line 21 |

If the new project needs to point at a different backend (e.g. staging vs production), extract this into a `VITE_API_BASE_URL_TEMPLATE` environment variable at build time.

---

## SECTION 8 — Migration Instructions

These steps bring dashboard functionality into a new React + Vite project **without touching its design**.

**Step 1 — Install required packages**

Ensure the new project has these dependencies:
```
@tanstack/react-query
react-router-dom
sonner
date-fns
```

**Step 2 — Copy the functional core files**

Copy the following into the new project (adapting import aliases as needed):
```
lib/api.ts
lib/error.ts
lib/channel-map.ts
lib/feature-toggles.tsx
lib/tenant.ts
lib/utils.ts (if not already present)
components/auth/useAuthContext.ts
components/auth/AuthProvider.tsx
components/auth/ProtectedRoute.tsx
hooks/use-client-api.ts
hooks/use-platform-filter.tsx
hooks/use-read-status.ts
hooks/use-email-settings.ts
hooks/use-bookings-label.ts
hooks/use-go-back.ts
components/ui/auth-image.tsx
```

**Step 3 — Update `lib/tenant.ts`**

Replace `PRODUCT_NAME`, `CLIENT_NAME`, `AGENT_NAME` with the new project's identity values.

**Step 4 — Update `lib/api.ts`**

If the valid client list changes, update `VALID_CLIENTS`. If the API base URL changes, update line 21.

**Step 5 — Wrap the app with providers**

In the new project's root component (or router setup), add:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthProvider";
import { FeatureTogglesProvider } from "./lib/feature-toggles";
import { PlatformFilterProvider } from "./hooks/use-platform-filter";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <AuthProvider>
      <FeatureTogglesProvider>
        <PlatformFilterProvider>
          {/* new project routes */}
        </PlatformFilterProvider>
      </FeatureTogglesProvider>
    </AuthProvider>
  </BrowserRouter>
</QueryClientProvider>
```

**Step 6 — Add ProtectedRoute to the new router**

```tsx
import { ProtectedRoute } from "./auth/ProtectedRoute";

<Routes>
  <Route path="/login" element={<YourNewLoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<YourNewLayout />}>
      <Route index element={<YourNewInboxPage />} />
      {/* ... */}
    </Route>
  </Route>
</Routes>
```

**Step 7 — Wire the Login page**

In the new login page UI, call:
```tsx
import { setClient } from "./lib/api";
import { useAuth } from "./hooks/use-client-api";

const { login, isAuthenticated } = useAuth();

// On submit:
setClient(selectedClientSlug);
login.mutate(password);
```

**Step 8 — Wire each functional page**

For each new dashboard page, import the relevant hook(s) from `hooks/use-client-api.ts` and connect the data to the new UI. Do not copy old page JSX — only extract the hook calls, filter logic, and mutation handlers.

Example for Inbox:
```tsx
import { useConversations, useDeleteConversation } from "./hooks/use-client-api";
import { usePlatformFilter } from "./hooks/use-platform-filter";
import { useReadStatus } from "./hooks/use-read-status";
import { matchesPlatformFilter } from "./lib/channel-map";

const { data: conversations } = useConversations();
const { selected } = usePlatformFilter();
const { readSet, markRead } = useReadStatus();

const filtered = conversations?.filter(c => matchesPlatformFilter(c.channel, selected)) ?? [];
```

**Step 9 — Add toast notifications**

Install and configure `sonner`. The mutation hooks use `toast.success()` and `toast.error()` from sonner directly. Add `<Toaster />` to the new app root.

**Step 10 — Test auth flow end-to-end**

1. Open `/login` → enter a client slug and password → verify redirect to `/dashboard`.
2. Open `/dashboard` directly without a token → verify redirect to `/login`.
3. Check localStorage for `wtyj_token_{slug}` and `wtyj_client` keys.
4. Trigger a logout → verify both keys are cleared.

---

## SECTION 9 — Risk List

### Breaking risks

| Risk | Detail |
|---|---|
| **Import path aliases** | The old project uses `@dashboard/lib/...`, `@dashboard/hooks/...`, `@dashboard/components/...` aliases. The new project must configure matching aliases in `vite.config.ts` (or tsconfig `paths`) or update all import paths. |
| **React Query version** | All hooks assume `@tanstack/react-query` v5 API (object syntax for `queryFn`, `mutationFn`, etc.). If the new project uses v4, hooks need syntax adjustments. |
| **react-router-dom version** | The code uses v7 (`Navigate`, `Outlet`, `useLocation`, `useNavigate`). Confirm the new project uses v6+ compatible API. |
| **`sonner` toast** | Mutation hooks import `toast` from `sonner` directly. If the new project uses a different toast library, every `onSuccess`/`onError` callback in `use-client-api.ts` must be updated. |
| **`AuthProvider` requires `BrowserRouter`** | `AuthProvider` calls `useNavigate()`, which requires a React Router context. It must be rendered inside `<BrowserRouter>`. |
| **`FeatureTogglesProvider` wrapping** | `useFeatureToggles()` throws if not inside `FeatureTogglesProvider`. Settings page and AppLayout both use it; the provider must be at the root. |
| **`PlatformFilterProvider` scope** | `usePlatformFilter()` throws if not inside `PlatformFilterProvider`. Must wrap at least the Messages and Escalations pages. |
| **Token namespace collision** | If the new project also uses localStorage and happens to use the same key names (`wtyj_token_*`, `wtyj_client`), there will be collisions. Review and rename if needed. |

### Missing pieces (not in this repo)

| Item | Notes |
|---|---|
| **Backend server code** | Entirely absent from this repo. The remote backend at `api.wetakeyourjob.com` handles all auth, DB, AI calls, WhatsApp/Meta integrations, and Google OAuth. The new project consumes the same API; no backend migration is needed unless the URL changes. |
| **WhatsApp / Meta integration** | Handled entirely server-side. No client code to migrate. |
| **Google OAuth flow** | The frontend only constructs a redirect URL via `api.getGoogleAuthUrl()`. The OAuth callback and token storage are server-side. |
| **Instagram / Facebook publishing** | Handled server-side. The frontend only calls `POST /drafts/:id/publish`. |
| **AI generation (drafts, images, brand rules)** | Handled server-side. The frontend only triggers the endpoints. |

### Hardcoded values / assumptions

| Item | Location | Note |
|---|---|---|
| `VALID_CLIENTS` list | `lib/api.ts` line 4 | Hard-coded: `["bluemarlin", "adamus", "consultadespertares", "unboks"]`. Must be updated if new clients are added. |
| API base URL | `lib/api.ts` line 21 | Hard-coded to `https://api.wetakeyourjob.com`. Not an env var. |
| `wtyj_` localStorage key prefix | Throughout `lib/api.ts`, `AuthProvider.tsx`, `hooks/*.ts` | Namespacing prefix is hard-coded. Update if the new project needs a different namespace. |
| `unboks_features` localStorage key | `lib/feature-toggles.tsx` | Feature toggle storage key. |
| `unboks_read_conversations` localStorage key | `hooks/use-read-status.ts` | Read status storage key. |
| `isSemi()` logic | `pages/Escalations.tsx` | The set of `notification_type` strings treated as "semi-automated" (WhatsApp relay) vs email escalations. This logic is embedded in the page component, not extracted to a utility. It must be ported explicitly. |

---

## SECTION 10 — Final Rule

> **The new dashboard project must keep its new design. Only the functional logic, API connections, auth, data models, and backend integrations should be migrated.**
>
> Specifically: copy `lib/api.ts`, `lib/error.ts`, `lib/channel-map.ts`, `lib/feature-toggles.tsx`, `lib/tenant.ts`, all auth files, all hooks, and `components/ui/auth-image.tsx`. Do not copy any page JSX, layout components, CSS, or shadcn primitives from the old project. Wire the copied hooks into the new project's own pages and UI components.
