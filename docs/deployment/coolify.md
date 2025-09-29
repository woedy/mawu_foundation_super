# Coolify Deployment Guide (Nixpacks)

This guide explains how to deploy the Mawu Foundation monorepo to a self-hosted Coolify instance using its Nixpacks builder. The repository now ships dedicated Nixpacks plans for both the API (`apps/api/nixpacks.toml`) and the web client (`apps/web/nixpacks.toml`) so each service can be deployed independently with sensible defaults.

## 1. Prerequisites
- Coolify v4 or newer with the **Nixpacks** build system enabled.
- Stripe API keys (secret + webhook signing secret) for the environment you are targeting.
- Domains or subdomains reserved for the public web app (e.g. `app.example.com`) and the API (e.g. `api.example.com`).
- Repository access for Coolify (GitHub, GitLab, or a private Git endpoint).

## 2. Environment configuration
Create a production env file locally to mirror the variables you will add to Coolify:

```bash
cp .env.production.example .env.production
```

Update `.env.production` with your real secrets and URLs:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Set to `production` when running in Coolify. |
| `API_PORT` | External API port. When running on Coolify it will automatically mirror the platform `PORT`. |
| `STRIPE_SECRET_KEY` | Stripe secret key for live payments or a restricted test key. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook endpoint configured in Stripe. |
| `CLIENT_URL` | Public URL of the web app (used by the API CORS policy). |
| `VITE_API_URL` | Public URL of the API (embedded in the static web build). |

> **Tip:** When deploying with Nixpacks you only need to add `API_PORT` if you are running locally. In Coolify the platform `PORT` is passed through automatically.

## 3. Repository files relevant to deployment
- `apps/api/nixpacks.toml` – installs workspace dependencies, builds the TypeScript API, and boots it with `API_PORT` sourced from the platform.
- `apps/web/nixpacks.toml` – installs dependencies, runs the Vite production build, and serves it via `vite preview` bound to the platform port.
- `.env.production.example` – reference file containing the minimum environment required for the production stack.

## 4. Deploying the API service
1. In Coolify create a new **Application** and select **Nixpacks** as the build pack.
2. Point the repository root to this project and set the **Root Directory** to `apps/api`.
3. Add the following environment variables:
   - `NODE_ENV=production`
   - `CLIENT_URL=https://app.example.com`
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `API_PORT=3001` *(optional – Coolify will inject `PORT` automatically)*
4. Expose the service on port `3001` (or whichever value you set for `API_PORT`) and map it to your API domain (e.g. `api.example.com`).
5. Deploy. The bundled Nixpacks plan runs `npm install --include=dev`, compiles the API with `npm run build`, and starts it with `npm run start`.

## 5. Deploying the web client
1. Create a second Coolify **Application** using the same repository with the **Root Directory** set to `apps/web`.
2. Add the following environment variables:
   - `NODE_ENV=production`
   - `VITE_API_URL=https://api.example.com`
3. Map the service to your desired domain (e.g. `app.example.com`). Coolify will proxy HTTPS and forward requests to the internal port exposed by Nixpacks.
4. Deploy. The provided plan runs `npm run build` to emit the Vite bundle and serves it through `npm run preview -- --host 0.0.0.0 --port $PORT`.

## 6. Local verification before pushing
You can reproduce the Nixpacks build locally by using the `npx nixpacks build` command (requires Nixpacks CLI):

```bash
# API
npx nixpacks build apps/api --name mawu-api --no-cache

# Web
npx nixpacks build apps/web --name mawu-web --no-cache
```

To launch the containers locally, use `docker run` with the resulting images and mount your `.env.production` file as needed.

## 7. Post-deployment checklist
- Hit `https://api.example.com/health` to ensure the API boots with Stripe configured and reports `status: "ok"`.
- Walk through donation and shop flows to confirm Stripe Checkout sessions are created successfully.
- Submit a volunteer or partnership inquiry and verify the API responds with a success payload.
- Review Coolify logs for both services to ensure all environment variables are detected and no TypeScript build errors slip through.
