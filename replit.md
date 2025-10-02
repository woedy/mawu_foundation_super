# Mawu Foundation Investor Demo

## Overview
The Mawu Foundation investor demo is a React + Vite + TypeScript + Tailwind static site showcasing Ghana's Volta Region work and pan-African initiatives. The site features curated storytelling data, impact metrics, and clearly marked upcoming capabilities for donations, volunteering, and commerce.

## Recent Changes
- **2025-10-02**: Payment system and backend implementation completed
  - Created PostgreSQL database with Drizzle ORM for products, orders, donations, and admins
  - Built Express.js backend server on port 3000 with full API endpoints
  - Integrated Stripe payment processing for both donations and shop purchases
  - Implemented email notifications using Resend (configurable via env vars)
  - Created admin authentication system with session management
  - Built admin dashboard to manage products, orders, and view donations
  - Updated frontend with Stripe integration and inactive payment method buttons (momo, crypto, bank transfer, PayPal)
  - Configured dual workflows: Backend (port 3000) and Frontend (port 5000)
  - Added Nixpacks configuration for Coolify deployment
  - Created comprehensive .env.example with all required environment variables
  - Default admin credentials: admin@mawufoundation.org / admin123

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.10
- **Styling**: Tailwind CSS 3.4.14
- **Routing**: React Router DOM 7.9.3
- **Package Manager**: npm workspaces

### Project Structure
```
apps/web/               # Main Vite application
├── src/
│   ├── components/     # Reusable UI components
│   ├── design-system/  # Design tokens and primitives
│   ├── pages/          # Route pages
│   ├── sections/       # Page sections
│   ├── data/           # Static data (programs, shop, testimonials)
│   └── hooks/          # React hooks
└── public/             # Static assets
```

### Key Features
- Mission-driven hero with impact metrics
- Program showcases (Education, Health, Water, Economic Empowerment)
- Get Involved pathways (donations, volunteering, partnerships)
- Storytelling modules and testimonials
- Storybook design system documentation

### Development
- Dev server runs on port 5000 (configured for Replit)
- HMR (Hot Module Replacement) enabled
- Storybook available on port 6006 for component development

### Deployment
- **Type**: Autoscale (static site)
- **Build**: `npm run build --workspace @mawu/web`
- **Preview**: Vite preview server on port 5000
- Output directory: `apps/web/dist`

### Environment Variables
- `VITE_ANALYTICS_DOMAIN` (optional): Enable Plausible analytics

## User Preferences
No specific user preferences recorded yet.
