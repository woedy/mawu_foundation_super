# Mawu Foundation Investor Demo

The Mawu Foundation investor demo is now a self-contained React + Vite + Tailwind site that ships with curated storytelling data. It spotlights Ghana's Volta Region work, highlights pan-African initiatives, and keeps donation, volunteer, and commerce flows clearly marked as upcoming capabilities—perfect for showing founders and supporters without provisioning a backend.

## Workspace Structure
- `apps/web` – Vite + React + TypeScript + Tailwind client application.

The repo uses npm workspaces so dependencies install and scripts run from the repository root.

## Getting Started
1. (Optional) Copy `.env.example` to `.env` if you want to enable Plausible analytics locally.
2. Install dependencies for the workspace:
   ```bash
   npm install
   ```
3. Start the front end:
   ```bash
   npm run dev --workspace @mawu/web
   ```
   Vite will print the local preview URL (typically `http://localhost:5173`).

## Common Scripts
Run these from the repository root.

| Command | Description |
| --- | --- |
| `npm run dev --workspace @mawu/web` | Starts the static investor demo in development mode. |
| `npm run build --workspace @mawu/web` | Produces a production build of the static site. |
| `npm run lint --workspace @mawu/web` | Runs ESLint. |
| `npm run format --workspace @mawu/web` | Checks code formatting with Prettier. |
| `npm run storybook --workspace @mawu/web` | Opens the design system workbench for component previews. |

## Deployment
- Deploy the Vite build output (`apps/web/dist`) to any static host such as Coolify, Netlify, or Vercel—no Express servers or Node backends are needed.
- Follow the platform-specific docs for step-by-step guidance (the root `vercel.json` already configures the static build for
  Vercel):
  - [`docs/deployment/vercel.md`](docs/deployment/vercel.md) for Vercel’s static hosting workflow.
  - [`docs/deployment/coolify.md`](docs/deployment/coolify.md) for a single-service Coolify setup.
- If you set `VITE_ANALYTICS_DOMAIN`, ensure the host exposes the same domain so Plausible can receive events.

## Static Architecture FAQ
- **Is the `api` folder part of an Express backend?** No. The checked-in source only contains the static front end inside `apps/web` plus documentation under `docs`. Any `api` directories you might notice live inside dependencies (for example, Storybook packages) and are not used at runtime when deploying the static site.

## Current Focus
- **Story: Implement the Get Involved & Transparency hub** – maintain polished static copy for donations, volunteering, partnerships, and governance so supporters understand what will launch next.
- **Up Next:** Continue polishing the merch shop showcase, Stripe-ready messaging, and storytelling modules while keeping the demo fully offline-capable.

## Design System Foundations
- Tailwind theme extends brand palettes (`brand`, `ink`, `sand`), refined typography scales, spacing tokens, and elevation shadows.
- Reusable primitives (`Container`, `Section`, `Button`, `Card`, `Typography`) ensure consistent layouts, CTAs, and storytelling blocks.
- Accessibility guidelines live in `docs/accessibility.md` and the UI ships with skip links, focus-visible rings, and semantic navigation landmarks.
- Storybook (`npm run storybook --workspace @mawu/web`) documents tokens and components for investor demos and collaboration.

## Front-End Vision Highlights
- Mission-driven hero experience with impact metrics and focused storytelling for the Volta Region spotlight.
- Program showcases covering Education, Health, Water & Sanitation, Economic Empowerment, and Community Development.
- Get Involved pathways for donations (Stripe enabled), volunteering, partnerships, and merchandise from the upcoming shop.
- Transparency hub surfacing financial reports, governance insights, and trust-building narratives.
- Storytelling modules, blog updates, and multimedia galleries to keep supporters engaged.

## Roadmap Notes
- Enrich the programs and impact explorer with data visualizations and regional filtering.
- Polish donation, volunteer, and partnership messaging while flagging them as forthcoming capabilities.
- Showcase the commerce experience with static data and clearly signposted payment roadmap.
- Assemble an investor demo toolkit with scripts, sample data, and deployment instructions.
