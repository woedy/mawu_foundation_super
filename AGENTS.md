# Mawu Foundation Build Plan

## Working Agreement
- Follow a modern, clean, minimalistic design language that feels creative yet trustworthy.
- Keep the React (Vite + Tailwind CSS) front-end and Express.js back-end within this single workspace under a monorepo-style structure.
- Stripe must be the only active payment processor at launch; include placeholders for crypto, PayPal, bank transfer, and mobile money, but mark them as inactive.
- Ensure every deliverable is investor-demo ready with compelling storytelling, strong usability, and clear calls to action.

## Delivery Checklist
Use the following user stories to guide implementation. Check off items as they are completed.

### Foundation Setup
- [x] **Story: Initialize the monorepo scaffold**
  **As a** developer
  **I want** a structured workspace containing both the front-end and back-end apps with shared configuration
  **So that** the team can develop, build, and deploy services consistently.
  **Acceptance Criteria:**  
  - Vite + React + TypeScript + Tailwind project created under `apps/web`.  
  - Express.js TypeScript API created under `apps/api` with shared env config support.  
  - Root-level package manager tooling (pnpm or npm workspaces) configured for both apps.  
  - Shared scripts for install, build, and dev flows documented in README.

- [x] **Story: Establish design system foundations**
  **As a** UI/UX designer  
  **I want** global styling tokens and reusable components  
  **So that** the interface feels cohesive, modern, and accessible.  
  **Acceptance Criteria:**  
  - Tailwind theme extended with brand colors, typography, spacing, and elevation tokens.  
  - Global layout primitives (e.g., `Container`, `Section`, `Button`, `Card`, `Typography`) implemented.  
  - Accessibility guidelines captured (contrast, focus states, keyboard navigation).  
  - Component documentation or Storybook preview available for investor demos.

### Core Experience
- [x] **Story: Craft the mission-driven home experience**
  **As a** prospective donor or partner  
  **I want** to instantly grasp Mawu Foundation's vision and current impact  
  **So that** I feel confident engaging further.  
  **Acceptance Criteria:**  
  - Hero section with mission statement, primary CTAs, and looping impact metrics.  
  - Seasonal spotlight for Volta Region projects including stats and storytelling media.  
  - Snapshot panels for Programs, Impact, Get Involved, and Shop.  
  - Mobile-responsive layout validated across breakpoints.

- [x] **Story: Build the programs & impact explorer**
  **As a** community stakeholder  
  **I want** to explore continental programs and current Volta initiatives  
  **So that** I understand where support is going.  
  **Acceptance Criteria:**  
  - Filterable program list with categories (Education, Health, Water & Sanitation, Economic Empowerment, Community Development).  
  - Interactive map or region selector toggling between Pan-African view and Volta focus.  
  - Impact metrics cards sourced from API mock data.  
  - Detail pages featuring narratives, galleries, and CTA strips.

- [x] **Story: Implement the Get Involved & Transparency hub**
  **As a** supporter  
  **I want** clear pathways to donate, volunteer, or partner and verify legitimacy  
  **So that** I can take action with confidence.  
  **Acceptance Criteria:**  
  - Donation options with Stripe checkout for single and recurring gifts.  
  - Volunteer and partnership inquiry forms with validation and backend endpoints.  
  - Transparency resources section (financial reports, governance, partners).  
  - Confirmation and follow-up messaging flows.

### Commerce & Payments
- [x] **Story: Launch the merch shop experience**
  **As a** supporter  
  **I want** to purchase branded merchandise easily  
  **So that** I can represent the foundation while contributing financially.  
  - Product catalog UI with categories, filters, and featured items.  
  - Product detail page with gallery, description, impact statement, and add-to-cart.  
  - Shopping cart and checkout flow using Stripe payment intent.  
  - Placeholder toggles for future payment methods labeled "Coming Soon".

- [x] **Story: Implement secure payment and donation APIs**  
  **As a** back-end engineer  
  **I want** robust endpoints handling payments, donations, and order lifecycle  
  **So that** financial transactions remain secure and auditable.  
  **Acceptance Criteria:**  
  - [x] Stripe SDK integrated with environment-based secrets management.  
  - [x] Donation and order endpoints with validation, error handling, and logging.  
  - [x] Webhook listener storing transaction status updates.  
  - [x] Payment methods enum with inactive states for future providers.

### Engagement & Content
- [ ] **Story: Deliver storytelling and community updates**  
  **As a** returning visitor  
  **I want** fresh stories, media, and data  
{{ ... }}
  **Acceptance Criteria:**  
  - Blog/news module powered by markdown or headless CMS placeholder.  
  - Testimonials carousel featuring donor, volunteer, and beneficiary voices.  
  - Newsletter sign-up integrated with backend mailing list endpoint.  
  - Analytics hooks (e.g., Plausible or GA) for visitor tracking configured.

- [ ] **Story: Prepare investor demo toolkit**  
  **As a** foundation leader  
  **I want** a polished demo package  
  **So that** investors can quickly understand the product vision and traction.  
  **Acceptance Criteria:**  
  - Demo scripts and walkthrough notes compiled in `/docs/demo`.  
  - Seed data and content enabling an impressive guided tour.  
  - Deployment or local run instructions for both apps verified.  
  - KPI highlights and roadmap slide templates provided.

## Definition of Done
A task is complete when code, tests, documentation, and demo assets satisfy the acceptance criteria and all relevant checkboxes are marked in this file.

