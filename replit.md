# Mawu Foundation Investor Demo

## Overview
The Mawu Foundation investor demo is a React + Vite + TypeScript + Tailwind static site showcasing Ghana's Volta Region work and pan-African initiatives. The site features curated storytelling data, impact metrics, and clearly marked upcoming capabilities for donations, volunteering, and commerce.

## Recent Changes
- **2025-10-02**: GitHub import setup completed for Replit environment
  - Installed Node.js 20 and all npm dependencies (423 packages)
  - Verified Vite config with port 5000, host 0.0.0.0, and strictPort enabled
  - HMR configured with clientPort 443 for Replit proxy compatibility
  - Development workflow configured and running successfully
  - Deployment configured for autoscale with build and preview commands
  - Website verified working with all pages and features functional
  - Project is ready for development and deployment

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
