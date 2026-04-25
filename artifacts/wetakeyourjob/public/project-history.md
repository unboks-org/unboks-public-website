# Unboks.org — Project History & Reasoning

## What is this project?

**Unboks.org** is a marketing homepage for a B2B AI communication tool. The product helps small businesses and lean teams manage all their messages — WhatsApp, email, socials — from one unified inbox, with AI handling routine replies and routing.

The site is built as a **React + Vite** single-page app inside a pnpm monorepo. It uses plain CSS (no Tailwind), and all CTAs link directly to WhatsApp (+59996881585) for a frictionless contact flow.

---

## Language Strategy

The site supports **five languages**:

| Flag | Code | Language |
|------|------|----------|
| 🇨🇼 | `pap` | Papiamentu (default) |
| 🇬🇧 | `en` | English |
| 🇪🇸 | `es` | Español |
| 🇳🇱 | `nl` | Nederlands |
| 🇸🇪 | `sv` | Svenska |

**Why Papiamentu as default?** The business is based in Curaçao. Papiamentu is the local language and the primary audience. Switching to other languages is done via a flag-only dropdown in the nav — no text labels, just flags.

All copy lives in `src/i18n.ts` as a single typed record keyed by language code. This makes it easy to update text per language without touching any layout code.

---

## Visual Design Decisions

### Logo
- **Papiamentu pages** use `image_1777081806501.png` — a wide wordmark version of the Unboks logo.
- **All other languages** use `image_1777095356119.png` — an alternative wordmark.
- Both logos use the `.nav-logo-img--wide` CSS class (max-height: 72px, max-width: 260px). The desktop logo size was intentionally kept larger than default after feedback — this is a sensitive setting, do not reduce.

### Hero Section
- Desktop: flex row — text on the left, an envelope illustration on the right (offset with `translateX(-40%)` to bleed slightly off-canvas for visual interest).
- Mobile: stacked column, centered, with `overflow-x: hidden` to prevent horizontal scroll from the illustration.
- The headline is split across two keys (`hero_h1a` and `hero_h1b`) so each line can be styled independently.

### Channel Pills
The channels row below the hero shows colored SVG icons for WhatsApp, Instagram, email, etc. These replaced a plain text list to make the multi-channel value prop immediately visual.

### Feature Section
Each language uses different feature panel images:
- **Papiamentu**: `smart_automation_papia` + `chica_PAPIA` (local imagery)
- **Swedish**: Swedish-specific variants
- **English/Spanish/Dutch**: `wtyj_panel_smart_automation_human_oversight_premium` + `wtyj_panel_faster_replies_clean`

### How It Works Steps
Three numbered steps in a bordered card stack. Padding was reduced from `26px` to `16px` top/bottom after user feedback that there was too much white space between steps.

### CTA Section (Bottom)
Originally had two buttons: a white "Book a call" button and a green WhatsApp button. The white button was removed at the user's request — only the WhatsApp button remains. This simplifies the CTA to a single action.

---

## Copy Evolution

The copy went through several rounds of revision, language by language. The core messaging shifted over time:

### Early version (all languages)
- Positioned as a "communication layer" built for teams.
- B2B framing: "your team," "managers review and approve."
- Focused on workflow efficiency.

### Revised version (final)
- More direct and personal: "your messages," "you stay in control."
- Dropped the team/manager framing in favor of speaking directly to the business owner.
- Added the 24/7 multilingual angle: *"Your communication keeps running 24/7, in multiple languages, while you only see what needs attention."*
- Outcomes reframed: from "More clients / More life" to "More overview / Less hassle" — more grounded and credible.
- Stats reframed: from abstract metrics ("average response time") to benefit-oriented labels ("Faster replies," "Always reachable," "Fewer missed messages").

### Dutch `feat_sub` note
The Dutch feature description intentionally uses `\n\n` inside the string to create a paragraph break between two distinct ideas. This renders as a visual paragraph break in the component. The `\n\n` is a valid TypeScript string escape — do not remove it.

---

## Bug History

### Blank Dutch page (recurring)
The Dutch (`nl`) language block was accidentally omitted from `i18n.ts` during a full-file rewrite. When a language key is missing from the translations record, the app receives `undefined` for all text fields, causing the entire page to crash silently and render blank white.

**Fix**: Always ensure all five language blocks (`pap`, `en`, `es`, `nl`, `sv`) are present in `i18n.ts`. The TypeScript type `Record<Lang, Record<string, string>>` will catch this at build time if the type is respected.

### Envelope illustration disappearing
At one point the hero-right illustration (envelope/inbox graphic) was accidentally removed during a layout refactor. It was restored by re-adding the `<img>` tag inside `.hero-right` with the correct asset import.

### Mobile overflow
Early mobile versions had a horizontal scroll issue caused by the hero illustration's `translateX(-40%)` offset exceeding the viewport. Fixed by adding `overflow-x: hidden` to `.hero` and the page wrapper.

---

## File Structure

```
artifacts/wetakeyourjob/
├── src/
│   ├── i18n.ts          # All copy for all 5 languages
│   ├── HomePage.tsx     # Main marketing page component
│   ├── homepage.css     # All homepage styles (scoped to .hp-site)
│   ├── App.tsx          # Root, language state, routing
│   └── main.tsx         # Entry point
├── public/              # Static assets served directly
└── vite.config.ts       # Vite config, @assets alias
```

All homepage styles are scoped under `.hp-site` to avoid leaking into other parts of the app (dashboard, demo pages) that share the same build.

---

## Stack

- **React 18** + **Vite** — fast dev server, HMR
- **Plain CSS** — no Tailwind, no CSS-in-JS
- **pnpm monorepo** — shared workspace with API server and mockup sandbox
- **No new packages** — constraint maintained throughout to keep the bundle lean
- **WhatsApp deep links** (`https://wa.me/59996881585`) — all CTAs

---

*Last updated: April 2026*
