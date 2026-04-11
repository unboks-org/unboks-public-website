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
- **Font**: Inter (Google Fonts)
- **API framework**: Express 5 (shared backend, not used by wetakeyourjob)

## wetakeyourjob.com

Frontend-only marketing website at root path `/`. Apple/AWS-inspired clean light design with minimal text.

### Routes
- `/` — Homepage with hero, services overview, how it works, benefits, audience, CTA
- `/services` — Services page with service cards, human-in-the-loop controls, outcomes
- `/about` — About page with philosophy cards and practice description
- `/contact` — Contact form with strategy call info and direct contact details

### Positioning
- AI tools that save time on repetitive communication
- Human + AI symbiosis (humans always in control)
- Manager dashboard oversight
- Teams become more productive
- NOT "AI replaces the whole team"

### Design System
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
- `artifacts/wetakeyourjob/src/data/siteContent.ts` — centralized content data
- `artifacts/wetakeyourjob/src/components/` — reusable UI components (Badge, Button, Section, CTASection, HeroPanel, InfoCard, ServiceCard, StepCard, BenefitCard, PageHeader, Seo)
- `artifacts/wetakeyourjob/src/pages/` — page components (HomePage, ServicesPage, AboutPage, ContactPage)
- `artifacts/wetakeyourjob/src/layout/` — Navbar, Footer, SiteLayout

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/wetakeyourjob run dev` — run the website locally
