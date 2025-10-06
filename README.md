# Mawu Foundation Investor Demo

The Mawu Foundation investor demo is now a self-contained React + Vite + Tailwind site that ships with curated storytelling data. It spotlights Ghana's Volta Region work, highlights pan-African initiatives, and keeps donation, volunteer, and commerce flows clearly marked as upcoming capabilities—perfect for showing founders and supporters without provisioning a backend.

## Workspace Structure

- `apps/web` – Vite + React + TypeScript + Tailwind client application.

The repo uses npm workspaces so dependencies install and scripts run from the repository root.

## Getting Started

1. (Optional) Copy `.env.example` to `.env` if you want to enable Plausible analytics locally or configure API settings.
2. Install dependencies for the workspace:
   ```bash
   npm install
   ```
3. Start the front end:
   ```bash
   npm run dev --workspace @mawu/web
   ```
   Vite will print the local preview URL (typically `http://localhost:5173`).

## API Configuration

The frontend can connect to a backend API for dynamic product data, donations, and other features. Configure the API URL using environment variables.

### Quick Start

1. Copy `.env.example` to `.env` (if not already done)
2. Update `VITE_API_URL` to match your backend server
3. Restart the dev server

### Environment Variables

- **`VITE_API_URL`** - The base URL for the backend API
  - **Development default**: `http://localhost:3001`
  - **Production example**: `https://api.mawufoundation.org`
  - **Fallback**: If not set, defaults to `http://localhost:3001`

### Configuration Examples

**Local Development (default):**
```bash
VITE_API_URL=http://localhost:3001
```

**Custom Local Port:**
```bash
VITE_API_URL=http://localhost:3000
```

**Production:**
```bash
VITE_API_URL=https://api.mawufoundation.org
```

**Important Notes:**
- Environment variables must start with `VITE_` prefix to be accessible in the frontend
- Changes to `.env` require restarting the dev server
- The application gracefully falls back to static data if the API is unavailable

### Testing API Connection

The frontend will automatically fall back to static data if the API is unavailable, ensuring the demo works without a backend. To test different API configurations:

1. Update `VITE_API_URL` in your `.env` file
2. Restart the development server (`npm run dev --workspace @mawu/web`)
3. Check the browser console for API connection status

**Testing Different Configurations:**

```bash
# Test with default fallback (no VITE_API_URL set)
# Remove or comment out VITE_API_URL in .env
# Expected: Falls back to http://localhost:3001

# Test with custom local port
VITE_API_URL=http://localhost:3000

# Test with production API
VITE_API_URL=https://api.mawufoundation.org

# Test with unavailable API (to verify fallback behavior)
VITE_API_URL=http://localhost:9999
```

**Verification Steps:**

1. **Check API URL**: Open browser console and look for API configuration logs
2. **Test Product Loading**: Navigate to the shop page and verify products load
3. **Test Fallback**: Stop the backend server and verify the app still works with static data
4. **Test Error Handling**: Check that error messages are user-friendly when API is unavailable

The application gracefully handles API failures and displays user-friendly error messages while falling back to cached or static data.

## Testing Shop Backend Integration

The shop pages integrate with the backend API to fetch dynamic product data. Comprehensive testing documentation is available:

### Quick Verification

Run the automated verification script to check that all components are in place:

```bash
npx tsx scripts/verify-shop-integration.ts
```

This script checks:
- ✅ Data fetching hooks exist and are implemented correctly
- ✅ Loading skeleton components are in place
- ✅ Error handling components are configured
- ✅ Caching layer is implemented
- ✅ Request deduplication is working
- ✅ Environment configuration is correct

### Manual Testing

For comprehensive manual testing, follow these guides:

1. **Detailed Testing Guide**: [`docs/manual-testing-guide.md`](docs/manual-testing-guide.md)
   - Complete test scenarios with step-by-step instructions
   - Expected results for each test
   - Performance and accessibility checklists
   - Browser compatibility testing
   - Common issues and solutions

2. **Quick Checklist**: [`docs/shop-integration-test-checklist.md`](docs/shop-integration-test-checklist.md)
   - Quick reference checklist for testing
   - Check off items as you complete them
   - Sign-off template for test results

### Testing Scenarios Covered

- ✅ Complete user flow (browse → view → add to cart)
- ✅ Loading states and skeleton loaders
- ✅ Error handling and fallback data
- ✅ Cache persistence across page reloads
- ✅ Request deduplication
- ✅ Cart validation with real-time inventory
- ✅ Image lazy loading
- ✅ Product variations
- ✅ 404 handling for invalid products
- ✅ API configuration with different URLs

### Before Testing

1. Start the backend server: `npm run dev:server`
2. Start the frontend: `npm run dev --workspace @mawu/web`
3. Run verification script: `npx tsx scripts/verify-shop-integration.ts`
4. Follow the manual testing guide

## Common Scripts

Run these from the repository root.

| Command                                   | Description                                               |
| ----------------------------------------- | --------------------------------------------------------- |
| `npm run dev --workspace @mawu/web`       | Starts the static investor demo in development mode.      |
| `npm run build --workspace @mawu/web`     | Produces a production build of the static site.           |
| `npm run lint --workspace @mawu/web`      | Runs ESLint.                                              |
| `npm run format --workspace @mawu/web`    | Checks code formatting with Prettier.                     |
| `npm run storybook --workspace @mawu/web` | Opens the design system workbench for component previews. |
| `npx tsx scripts/verify-shop-integration.ts` | Verifies shop backend integration is working correctly. |

## Deployment

- Deploy the Vite build output (`apps/web/dist`) to any static host such as Coolify, Netlify, or Vercel—no Express servers or Node backends are needed.
- Follow the platform-specific docs for step-by-step guidance (the root `vercel.json` now pins the workspace commands, output
  directory, and single-page-app fallback that Vercel needs to serve the static build correctly):
  - [`docs/deployment/vercel.md`](docs/deployment/vercel.md) for Vercel’s static hosting workflow.
  - [`docs/deployment/coolify.md`](docs/deployment/coolify.md) for a single-service Coolify setup.
- If you set `VITE_ANALYTICS_DOMAIN`, ensure the host exposes the same domain so Plausible can receive events.

### Production API Configuration

When deploying to production, configure the API URL as an environment variable in your hosting platform:

**Vercel:**
```bash
vercel env add VITE_API_URL production
# Enter: https://api.mawufoundation.org
```

**Netlify:**
Add to your site's environment variables:
```
VITE_API_URL=https://api.mawufoundation.org
```

**Coolify:**
Set in the environment variables section of your service configuration.

The frontend will automatically use the production API URL when built with these environment variables.

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
