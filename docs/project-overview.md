# Project Overview

The Mawu Foundation monorepo powers a humanitarian storytelling platform for a pan-African collective united around arts, culture, spirituality, and charity. A React front end and Express.js API work together to surface programs, transparency resources, and calls to action while spotlighting the current season of field work in Ghana’s Volta Region.

## Mission & Storytelling Priorities
- Articulates the foundation’s continental vision to uplift communities across education, health, water access, economic empowerment, and community development while celebrating cultural roots.
- Presents the seasonal focus in the Volta Region with compelling narratives, imagery, and metrics that show how donations, schools, clinics, books, and infrastructure projects transform lives.
- Reinforces trust with investor-ready polish—responsive layouts, accessible patterns documented in `docs/accessibility.md`, and clear CTAs for donating, volunteering, and partnering.

## Platform Architecture
- **Front end (`apps/web`)**: Vite + React + TypeScript + Tailwind application featuring reusable design-system components, interactive program explorers, and resilient fallbacks when the API is offline.
- **API (`apps/api`)**: Express.js TypeScript service exposing health checks, program and impact data, and the groundwork for donation, volunteer, and commerce integrations.
- **Shared config (`packages/config`)**: Centralized environment validation using `dotenv` and `zod` to keep deployments consistent and secure as payment flows come online.

## Roadmap Emphasis
- Activate the Get Involved & Transparency hub to unlock Stripe-powered donations, volunteer outreach, and governance resources that cover the full African mandate.
- Extend the commerce experience with a Stripe-backed merch shop while clearly labeling future payment methods (crypto, PayPal, bank transfer, mobile money) as "Coming Soon."
- Ship engagement tooling—stories, testimonials, newsletters, and analytics—to keep supporters across the continent connected as the platform grows.
