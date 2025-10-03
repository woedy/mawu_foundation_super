# Project Structure

## Workspace Organization
This is an npm workspace monorepo with the following structure:

```
├── apps/
│   └── web/                 # Main React frontend application
├── docs/                    # Project documentation
├── server/                  # Express backend (development/optional)
├── shared/                  # Shared TypeScript schemas
├── packages/                # Shared packages and configurations
└── attached_assets/         # Static assets and uploads
```

## Key Directories

### `apps/web/` - Frontend Application
- **Primary workspace**: Contains the main React + Vite application
- **Package name**: `@mawu/web`
- **Build output**: `dist/` directory for static deployment
- **Structure**: Standard Vite React app with TypeScript

### `server/` - Backend Services
- **Purpose**: Express API server (optional for static demo)
- **Key files**:
  - `index.ts` - Main server entry point
  - `routes.ts` - API route definitions
  - `seed-admin.ts` - Admin user seeding script
  - `storage.ts` - File storage utilities

### `shared/` - Common Code
- **`schema.ts`** - Drizzle ORM database schema definitions
- **Types**: Shared TypeScript types for database entities
- **Models**: Admin, Product, Order, Donation schemas

### `docs/` - Documentation
- **`project-overview.md`** - High-level project description
- **`accessibility.md`** - Accessibility guidelines and standards
- **`deployment/`** - Platform-specific deployment guides
- **Status files**: Project status, sync status, update logs

### `packages/` - Shared Configurations
- **`config/`** - Shared build and development configurations

## Configuration Files

### Root Level
- **`package.json`** - Workspace configuration and scripts
- **`drizzle.config.ts`** - Database ORM configuration
- **`vercel.json`** - Vercel deployment settings
- **`.env.example`** - Environment variable template

### Environment Files
- **`.env`** - Local development environment variables
- **`.env.example`** - Template for required environment variables
- **`.env.production.example`** - Production environment template

## Naming Conventions
- **Workspaces**: Use `@mawu/` namespace (e.g., `@mawu/web`)
- **Files**: Use kebab-case for configuration files
- **Components**: Use PascalCase for React components
- **Database**: Use snake_case for database columns and tables

## Import Patterns
- **Shared schemas**: Import from `../shared/schema.ts`
- **Workspace commands**: Use `--workspace @mawu/web` flag
- **Environment variables**: Use `VITE_` prefix for frontend variables

## Development Workflow
1. **Install dependencies**: Run `npm install` from root
2. **Start development**: Use workspace-specific commands
3. **Build for production**: Output goes to `apps/web/dist/`
4. **Deploy**: Static files from dist directory to hosting platform

## File Organization Best Practices
- Keep shared code in `shared/` directory
- Use workspace-specific scripts for build/dev commands
- Store documentation in `docs/` with clear categorization
- Place static assets in `attached_assets/` for organization