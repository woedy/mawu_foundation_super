# Mawu Foundation Monorepo

The Mawu Foundation platform combines a modern React web experience with an Express.js API so that supporters, donors, and partners can explore our pan-African humanitarian vision while acting on the current focus in Ghana's Volta Region.

## Workspace Structure
- `apps/web` – Vite + React + TypeScript + Tailwind client application.
- `apps/api` – Express.js TypeScript API responsible for payments, forms, and operational data.
- `packages/config` – Shared environment configuration utilities powered by `dotenv` and `zod`.

All projects are managed with npm workspaces so dependencies install and scripts run from the repository root.

## Getting Started
1. Copy `.env.example` to `.env` and update the placeholder values (a Stripe test key is required to boot the API).
2. Install dependencies for every workspace:
   ```bash
   npm install
   ```
3. Start the front end and API in separate terminals:
   ```bash
   npm run dev --workspace @mawu/web
   npm run dev --workspace @mawu/api
   ```

## Common Scripts
Run these from the repository root.

| Command | Description |
| --- | --- |
| `npm run dev --workspace <name>` | Starts the selected app in development mode. |
| `npm run build --workspace <name>` | Produces a production build for the chosen workspace. |
| `npm run lint --workspace <name>` | Runs ESLint in the specified workspace. |
| `npm run format --workspace <name>` | Checks code formatting with Prettier. |
| `npm run storybook --workspace @mawu/web` | Opens the design system workbench for component previews. |

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
- Implement the Get Involved and Transparency hub with live Stripe checkout and validated forms.
- Launch the commerce experience with Stripe payment intents and placeholders for future payment methods (crypto, PayPal, bank transfer, MoMo).
- Assemble an investor demo toolkit with scripts, sample data, and deployment instructions.
