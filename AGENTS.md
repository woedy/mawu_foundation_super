# Mawu Foundation Build Plan

## Working Agreement
- Deliver the investor demo as a standalone Vite + React + Tailwind experience backed entirely by curated static data.
- Preserve the polished, trustworthy visual language: generous whitespace, spiritual accent colors, and accessible interactions.
- Keep inactive payment or partner flows clearly labeled as demo-only messaging so the walkthrough never depends on backend APIs.
- Ensure every change is production-quality for static hosting targets such as Coolify, Netlify, or Vercel.

## Delivery Checklist
Use these stories as reminders when expanding the site. Update them if priorities change.

### Static Investor Demo
- [x] **Story: Ship the static front end**
  **As a** founder preparing a demo
  **I want** a self-contained site I can run with `npm run dev`
  **So that** stakeholder previews never depend on backend availability.
  **Acceptance Criteria:**
  - Vite + React + Tailwind project under `apps/web` builds without external APIs.
  - Demo data for programs, impact, engagement, and shop content lives alongside the front-end code.
  - Calls to action make it clear that checkout, donations, and partner flows are showcased as future capabilities.
  - Documentation explains how to install dependencies, run the dev server, and deploy the static bundle.

### Storytelling Foundations
- [x] **Story: Maintain the design system**
  **As a** UI/UX designer
  **I want** reusable typography, layout, and button primitives
  **So that** every section of the investor demo feels cohesive and accessible.
  **Acceptance Criteria:**
  - Tailwind tokens remain the single source of truth for color, type, and spacing scales.
  - Components expose intuitive props and retain focus-visible affordances.
  - Storybook (or equivalent documentation) stays in sync with the production UI.

### Demo Data Stewardship
- [x] **Story: Curate demo content**
  **As a** storyteller guiding supporters
  **I want** believable copy, metrics, and testimonials baked into the repo
  **So that** demos stay compelling without live data feeds.
  **Acceptance Criteria:**
  - Programs, testimonials, stories, and merch items live in TypeScript data modules or markdown files under `apps/web`.
  - Update guides in `docs/demo` explain how to refresh demo content before a walkthrough.
  - Analytics hooks, if enabled, operate purely on the client with optional environment configuration.

## Definition of Done
A task is complete when the static site builds successfully, documentation is refreshed, and the investor demo remains smooth in offline scenarios.
