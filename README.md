# Mawu Foundation Monorepo

The Mawu Foundation platform combines a modern React web experience with an Express.js API so that supporters, donors, and partners can explore our pan-African humanitarian vision while acting on the current focus in Ghana's Volta Region.

## Workspace Structure
- `apps/web` – Vite + React + TypeScript + Tailwind client application.
- `apps/api` – Express.js TypeScript API responsible for payments, forms, and operational data.
- `packages/config` – Shared environment configuration utilities powered by `dotenv` and `zod`.

All projects are managed with npm workspaces so dependencies install and scripts run from the repository root.

## Getting Started
1. Copy `.env.example` to `.env` and update the placeholder values (Stripe test keys are required along with `VITE_API_URL` pointing to your API, e.g., `http://localhost:3001`).
2. Install dependencies for every workspace:
   ```bash
   npm install
   ```
3. Start the front end and API in separate terminals:
   ```bash
   npm run dev --workspace @mawu/web
   npm run dev --workspace @mawu/api
   ```
   > If the API is offline the web app now falls back to a demo snapshot for the programs explorer and surfaces an inline notice.

### Running both apps together
Follow these steps to serve real API data in the web client:

1. **Verify environment variables.** Ensure `.env` contains a `VITE_API_URL` that matches your API base URL (default `http://localhost:3001`).
2. **Launch the API first.** In one terminal run:
   ```bash
   npm run dev --workspace @mawu/api
   ```
   Wait for the `ts-node-dev` banner and the `Listening on` log to confirm the Express server is ready.
3. **Start the web client in a second terminal.**
   ```bash
   npm run dev --workspace @mawu/web
   ```
   Vite will print the local preview URL (typically `http://localhost:5173`).
4. **Open the browser preview.** Navigate to the Vite URL and the landing page will fetch `/programs` from the running API. If the API stops, the UI reverts to the built-in demo snapshot and displays an offline notice until the server comes back online.

## Common Scripts
Run these from the repository root.

| Command | Description |
| --- | --- |
| `npm run dev --workspace <name>` | Starts the selected app in development mode. |
| `npm run build --workspace <name>` | Produces a production build for the chosen workspace. |
| `npm run lint --workspace <name>` | Runs ESLint in the specified workspace. |
| `npm run format --workspace <name>` | Checks code formatting with Prettier. |
| `npm run storybook --workspace @mawu/web` | Opens the design system workbench for component previews. |

## Current Focus
- **Story: Implement the Get Involved & Transparency hub** – activate Stripe-powered donation paths, launch volunteer and partnership inquiries, and surface governance resources so supporters can take action with confidence.
- **Up Next:** After the hub is live we will introduce the merch shop experience with Stripe checkout and placeholders for future payment methods.

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
