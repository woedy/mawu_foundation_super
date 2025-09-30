# Vercel Deployment Guide (Static Site)

This walkthrough publishes the Mawu Foundation investor demo as a fully static site on Vercel. No Express server or serverless functions are required—the build ships pre-rendered HTML, CSS, and JS powered entirely by the demo data bundled in `apps/web`.

## 1. Prerequisites
- Vercel account with access to create new projects.
- GitHub (or GitLab/Bitbucket) repository containing this workspace.
- Optional: Plausible analytics domain if you plan to enable client-side analytics events.

## 2. Prepare the repository
1. Ensure your local branch is pushed to a remote that Vercel can access.
2. Confirm the production build succeeds locally:
   ```bash
   npm install
   npm run build --workspace @mawu/web
   ```
   The output in `apps/web/dist` is what Vercel will serve statically.

## 3. Create the Vercel project
1. In the Vercel dashboard click **Add New… → Project** and import this repository.
2. When prompted for the **Framework Preset**, choose **Vite**.
3. If you prefer configuring the project entirely from the repo, keep the **Root Directory** as the repository root—`vercel.json`
   now instructs Vercel to install workspace dependencies, run `npm run build --workspace @mawu/web`, publish the static bundle
   from `apps/web/dist`, and rewrite deep links back to `index.html` so the single-page app router works on refresh.
4. Alternatively, you can point the **Root Directory** to `apps/web` and keep the default Vite settings; both approaches build
   the same static output.

## 4. Environment variables (optional)
If you plan to stream Plausible analytics events:
- Add `VITE_ANALYTICS_DOMAIN` with your Plausible domain under **Settings → Environment Variables**.
- No other variables are required—Stripe keys or API endpoints are intentionally omitted for this static demo.

## 5. Deploy
1. Click **Deploy**. Vercel installs dependencies, runs the Vite build, and uploads the static assets.
2. Once live, open the preview domain and verify:
   - Hero, program explorer, stories, and testimonials render with the seeded demo content.
   - Newsletter form displays the simulated success banner.
   - Merch section highlights “Demo mode” messaging instead of live checkout.
3. Promote the deployment to production when you’re satisfied.

## 6. Subsequent updates
- Push changes to the tracked branch. Vercel rebuilds only the static assets—no backend services restart.
- For analytics-enabled demos, confirm the Plausible script loads by checking the browser network tab.

## 7. Troubleshooting
- **Build fails:** Confirm the project uses the repo's `vercel.json` (or sets `apps/web` as the root) so the build output ends up
  in `apps/web/dist`.
- **Rollup native module errors:** If the build log mentions `@rollup/rollup-linux-x64-gnu`, make sure the deployment is using the
  updated build script (or set `ROLLUP_SKIP_NODEJS_NATIVE=true`) so Rollup falls back to its WASM bundle—this repo now ships a
  `patch-package` fallback, so running `npm install` end-to-end will automatically apply it even on Node 22 builders.
- **SWC binding failures:** Vercel's Linux builders occasionally skip the optional `@swc/core` binaries. The workspace pins the
  `@swc/core-linux-x64-gnu` package to guarantee the React SWC plugin loads—double-check the dependency is present if you override
  the default install command.
- **Missing styles or data:** Confirm `npm run build --workspace @mawu/web` succeeds locally and that no runtime fetches are pointing to removed APIs.
- **Analytics not firing:** Verify `VITE_ANALYTICS_DOMAIN` is defined and that any ad blockers allow Plausible.

With this configuration Vercel hosts the investor demo purely as static files, making it fast to spin up investor previews without maintaining any Express servers or backend infrastructure.
