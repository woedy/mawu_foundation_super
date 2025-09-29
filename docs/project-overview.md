# Project Overview

The Mawu Foundation static investor demo powers a humanitarian storytelling platform for a pan-African collective united around arts, culture, spirituality, and charity. A React front end backed by curated demo data surfaces programs, transparency resources, and calls to action while spotlighting the current season of field work in Ghana’s Volta Region—no backend services required.

## Mission & Storytelling Priorities
- Articulates the foundation’s continental vision to uplift communities across education, health, water access, economic empowerment, and community development while celebrating cultural roots.
- Presents the seasonal focus in the Volta Region with compelling narratives, imagery, and metrics that show how donations, schools, clinics, books, and infrastructure projects transform lives.
- Reinforces trust with investor-ready polish—responsive layouts, accessible patterns documented in `docs/accessibility.md`, and clear CTAs for donating, volunteering, and partnering.


## Platform Architecture
- **Front end (`apps/web`)**: Vite + React + TypeScript + Tailwind application featuring reusable design-system components and immersive program explorers powered entirely by TypeScript demo data modules and markdown stories.
- **Static hosting**: The site builds to static assets that can be deployed to Coolify, Netlify, Vercel, or any CDN. Optional Plausible analytics can be toggled through `VITE_ANALYTICS_DOMAIN`.

## Roadmap Emphasis
- Prepare the Get Involved & Transparency hub for a future Stripe integration by refining static copy, CTA placement, and trust-building artifacts.
- Extend the merch shop showcase with richer impact storytelling while keeping "Coming Soon" payment methods clearly flagged.
- Expand engagement tooling—stories, testimonials, newsletters, and lightweight analytics—to keep supporters connected while the platform remains backend-free.
