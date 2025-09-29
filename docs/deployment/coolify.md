# Coolify Deployment Guide (Static Site)

This guide explains how to deploy the Mawu Foundation static investor demo to a self-hosted Coolify instance using its Nixpacks builder. Only the web client is required—the site ships as static assets powered entirely by curated demo data.

## 1. Prerequisites
- Coolify v4 or newer with the **Nixpacks** build system enabled.
- Domain or subdomain reserved for the public web app (e.g. `demo.mawufoundation.org`).
- Repository access for Coolify (GitHub, GitLab, or a private Git endpoint).

## 2. Environment configuration
Create a production env file locally to mirror the variables you will add to Coolify (optional, only needed for Plausible analytics):
```bash
cp .env.production.example .env.production
```
Update `.env.production` if you plan to forward analytics events:

| Variable | Description |
| --- | --- |
| `VITE_ANALYTICS_DOMAIN` | Plausible domain that should receive tagged events (optional). |

## 3. Repository files relevant to deployment
- `apps/web/nixpacks.toml` – installs dependencies, runs the Vite production build, and serves it via `vite preview` bound to the platform port.
- `.env.production.example` – reference file containing the optional analytics environment variable.

## 4. Deploying the web client
1. In Coolify create a new **Application** and select **Nixpacks** as the build pack.
2. Point the repository root to this project and set the **Root Directory** to `apps/web`.
3. Add environment variables as needed (e.g. `NODE_ENV=production`, `VITE_ANALYTICS_DOMAIN=demo.mawufoundation.org`).
4. Map the service to your desired domain (e.g. `demo.mawufoundation.org`). Coolify will proxy HTTPS and forward requests to the internal port exposed by Nixpacks.
5. Deploy. The provided plan runs `npm install`, `npm run build`, and serves the bundle via `npm run preview -- --host 0.0.0.0 --port $PORT`.

## 5. Local verification before pushing
You can reproduce the Nixpacks build locally by using the `npx nixpacks build` command (requires the Nixpacks CLI):
```bash
npx nixpacks build apps/web --name mawu-web --no-cache
```
To launch the container locally, use `docker run` with the resulting image and mount your `.env.production` file if analytics are enabled.

## 6. Post-deployment checklist
- Visit the deployed domain and confirm programs, stories, and merch sections render correctly.
- Submit the newsletter form to see the simulated confirmation banner.
- Verify Plausible events arrive (if `VITE_ANALYTICS_DOMAIN` is configured).
- Review Coolify logs to ensure the Vite preview server started without errors.
