# Run & Deploy Checklist

These steps were verified against the current static build so facilitators can trust the setup before every investor session.

## 1. Install dependencies
```bash
npm install
```
This bootstraps the `apps/web` workspace.

## 2. Configure environment (optional)
If you want Plausible analytics during the walkthrough:
```bash
cp .env.example .env
```
Uncomment `VITE_ANALYTICS_DOMAIN` and set it to the domain connected to your Plausible site.

## 3. Start the demo locally
```bash
npm run dev --workspace @mawu/web
```
- Vite boots at `http://localhost:5173`.
- All data loads from TypeScript modules and markdown files bundled with the repo—no backend required.

## 4. Refresh demo content
Follow [`seed-data-notes.md`](./seed-data-notes.md) to update stories, testimonials, programs, and merch copy before each session.

## 5. Plausible analytics spot-check (optional)
If analytics are enabled:
1. Confirm the network tab loads `script.tagged-events.outbound-links.js` from Plausible.
2. Watch `story_opened`, `testimonial_cycle`, and `newsletter_subscribed` events arrive in the Plausible dashboard.

## 6. Production build smoke test
Before recording or shipping demo assets:
```bash
npm run build --workspace @mawu/web
```
- Confirms TypeScript passes and emits `apps/web/dist` for static hosting previews.

## 7. Deployment pointers
- Deploy the contents of `apps/web/dist` to any static host (Coolify, Netlify, Vercel, S3 + CloudFront).
- For Coolify, see the single-service guide in [`../deployment/coolify.md`](../deployment/coolify.md).
- Ensure any configured `VITE_ANALYTICS_DOMAIN` matches the production domain before building.

## 8. Quick regression checklist
- [ ] Programs explorer renders all curated initiatives.
- [ ] Stories & testimonials cycle without console errors.
- [ ] Newsletter submission shows the simulated confirmation banner.
- [ ] Merch showcase highlights inventory and "Coming Soon" payment messaging.
- [ ] Plausible events appear (if configured).

---
_Build verification (latest run):_
```
npm run build --workspace @mawu/web
```
The command succeeds locally and in CI.
