# Run & Deploy Checklist

These steps were verified against the current monorepo build (see commands at the end) so facilitators can trust the setup before every investor session.

## 1. Install dependencies
```bash
npm install
```
This bootstraps all npm workspaces (`apps/web`, `apps/api`, `packages/config`).

## 2. Configure environment
Create `.env` at the repository root:
```bash
cp .env.example .env
```
Populate the following keys:
```ini
# API
STRIPE_SECRET_KEY=sk_test_xxx              # optional with graceful fallback
STRIPE_WEBHOOK_SECRET=whsec_xxx            # optional but enables webhook logging
CLIENT_URL=http://localhost:5173

# Web client
VITE_API_URL=http://localhost:3001
VITE_ANALYTICS_DOMAIN=demo.mawufoundation.org
```

## 3. Start services locally
In separate terminals run:
```bash
npm run dev --workspace @mawu/api
npm run dev --workspace @mawu/web
```
- API listens on `localhost:3001` and logs webhook/payment status.
- Web client boots at `localhost:5173` and consumes live API endpoints.

## 4. Seed demo content
Follow [`seed-data-notes.md`](./seed-data-notes.md) to refresh stories, testimonials, and newsletter entries. Confirm the footer form returns a success banner.

## 5. Plausible analytics (optional)
If demonstrating analytics:
1. Ensure the Plausible script loads (network tab shows `script.tagged-events.outbound-links.js`).
2. Open the Plausible dashboard in another tab to watch `story_opened`, `testimonial_cycle`, and `newsletter_subscribed` events stream in live.

## 6. Production build smoke test
Before recording or shipping demo assets:
```bash
npm run build --workspace @mawu/api
npm run build --workspace @mawu/web
```
- Confirms TypeScript passes on both workspaces.
- Produces `apps/web/dist` for static hosting previews.

## 7. Deployment pointers
- **API:** Package `apps/api` with Node 18+, install with `npm ci`, then `npm run build` followed by `npm start`. Environment keys mirror local `.env`.
- **Web:** Deploy contents of `apps/web/dist` to any static host (Vercel, Netlify, S3 + CloudFront). Ensure `VITE_API_URL` points to the hosted API before building.
- **Config package:** Already bundled via workspace symlinks—no extra steps needed.

## 8. Quick regression checklist
- [ ] `/health` endpoint reports `stripeConfigured` correctly.
- [ ] Programs explorer fetches live data (no offline banner).
- [ ] Stories & testimonials render without console errors.
- [ ] Newsletter submission returns HTTP 201 and logs to `newsletter-signups.json`.
- [ ] Plausible events appear (if configured).

---
_Build verification (latest run):_
```
npm run build --workspace @mawu/api
npm run build --workspace @mawu/web
```
Both commands succeed (see CI logs or run locally before the demo).
