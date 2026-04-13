# Replit Import Prompt

Use this prompt in Replit after uploading the zip:

```md
This is the wetakeyourjob.com frontend project.

Stack:
- React
- Vite
- Tailwind CSS

Important context:
- This is an existing frontend migration, not a redesign from scratch
- Keep the site frontend-only
- Do not add a backend, CMS, database, auth system, dashboard app shell, blog, or testimonials
- Preserve existing routing and working code structure
- Keep the homepage bright, premium, calm, minimal, and outcome-first
- Do not shift it into dark SaaS, crypto, or generic enterprise software styling

Current homepage rules already implemented and must be preserved:
- The hero uses only `wtyj_panel_hero_main.png`
- The hero sits directly below the navbar
- The support grid uses five separate image files, not a composite screenshot
- Do not use `wtyj_grid_v1.png`, `wtyj_grid_v2.png`, or `wtyj_grid_v3.png` for the support section
- The support grid order is:
  1. `wtyj_panel_one_inbox_total_control.png`
  2. `wtyj_panel_less_busywork_more_business.png`
  3. `wtyj_panel_faster_replies.png`
  4. `wtyj_panel_24_7_coverage.png`
  5. `wtyj_panel_all_languages.png`
- Keep the big brand statement section:
  - `More time. More clients. More life.`
  - `All your messages. 1 Inbox. More time for what matters.`
- Keep the CTA section with:
  - `Get started`
  - `See how it works`

Navigation requirements:
- Keep links for:
  - Services
  - About
  - Contact
  - Login
- Keep the primary navbar CTA as `Get started`

Technical requirements:
1. Install dependencies with `npm install`
2. Run the dev server with `npm run dev`
3. Make sure the Vite preview works correctly in Replit
4. Keep imports clean and maintainable
5. Do not introduce dead imports or broken image references
6. Preserve responsive behavior
7. Preserve existing route structure:
  - `/`
  - `/services`
  - `/about`
  - `/contact`
  - `/login`

Success criteria:
- The project runs immediately
- The homepage hero and support grid use the exact intended assets
- No composite image is used for the support cards
- The page feels like one premium campaign, not disconnected sections
- Mobile and desktop layouts both work
```
