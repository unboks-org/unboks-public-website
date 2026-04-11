# Workspace

## Overview

pnpm workspace monorepo with a marketing website for wetakeyourjob.com. Frontend-only React + Vite + Tailwind CSS site.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Routing**: react-router-dom v6
- **SEO**: react-helmet-async
- **Icons**: lucide-react
- **Font**: Sora (Google Fonts)
- **API framework**: Express 5 (shared backend, not used by wetakeyourjob)

## wetakeyourjob.com

Frontend-only marketing website at root path `/`. Premium dark SaaS visual style with cyan/teal glow accents.

### Routes
- `/` — Homepage with hero, problem section, services, how it works, audience, benefits, differentiator, CTA
- `/services` — Services page with detailed service cards, human-in-the-loop operations, outcomes
- `/about` — About page with philosophy cards and practice description
- `/contact` — Contact form with strategy call info and direct contact details

### Positioning
- AI tools that save time on repetitive communication
- Human + AI symbiosis (humans always in control)
- Manager dashboard oversight
- Teams become more productive
- NOT "AI replaces the whole team"

### Design System
- Dark background: `#050b14` (night), `#0b1422` (ink), `#111d30` (panel)
- Accent: `#36d1ff` (glow/cyan), `#2dd4bf` (teal)
- Glass-morphism panels with backdrop blur
- Rounded corners (1.5rem on panels)
- Gradient backgrounds with radial glow effects

### Key Files
- `artifacts/wetakeyourjob/src/` — all source code
- `artifacts/wetakeyourjob/src/data/siteContent.ts` — centralized content data
- `artifacts/wetakeyourjob/src/components/` — reusable UI components
- `artifacts/wetakeyourjob/src/pages/` — page components
- `artifacts/wetakeyourjob/src/layout/` — Navbar, Footer, SiteLayout

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/wetakeyourjob run dev` — run the website locally
