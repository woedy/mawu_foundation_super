# Technology Stack

## Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom brand theme
- **Routing**: React Router DOM v7
- **Payment Integration**: Stripe (React Stripe.js)
- **Design System**: Storybook for component documentation

## Backend Stack (Optional/Development)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with session management
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt password hashing
- **Email**: Resend for transactional emails
- **Payment Processing**: Stripe server-side integration

## Development Tools
- **Package Manager**: npm with workspaces
- **Type Checking**: TypeScript ~5.6.3
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier
- **Process Manager**: tsx for development server

## Common Commands

### Development
```bash
# Start frontend development server
npm run dev --workspace @mawu/web

# Start backend development server (if needed)
npm run dev:server

# Run all workspace dev commands
npm run dev
```

### Building & Testing
```bash
# Build frontend for production
npm run build --workspace @mawu/web

# Build all workspaces
npm run build

# Run linting
npm run lint --workspace @mawu/web

# Format code
npm run format --workspace @mawu/web
```

### Database Operations
```bash
# Push schema changes to database
npm run db:push

# Open Drizzle Studio
npm run db:studio

# Seed admin user
npm run seed:admin
```

### Design System
```bash
# Start Storybook
npm run storybook --workspace @mawu/web

# Build Storybook
npm run build-storybook --workspace @mawu/web
```

## Deployment
- **Primary**: Static site deployment (Vercel, Netlify, Coolify)
- **Output**: `apps/web/dist` directory
- **Configuration**: `vercel.json` for Vercel-specific settings
- **Environment**: Uses `VITE_` prefixed environment variables for frontend

## Key Dependencies
- **UI**: React, React DOM, React Router
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Development**: Vite, TypeScript, ESLint, Prettier
- **Backend**: Express, Drizzle ORM, PostgreSQL driver
- **Payments**: Stripe SDK for both frontend and backend
- **Security**: bcryptjs, express-session, CORS