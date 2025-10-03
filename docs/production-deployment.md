# Production Deployment Guide

## Overview

This guide covers deploying the Mawu Foundation platform to production using Coolify on Ubuntu server.

## Prerequisites

- Ubuntu server with Docker and Coolify installed
- PostgreSQL database
- Stripe account with production keys
- Email service (Resend) account
- Domain name configured

## Environment Configuration

1. Copy `.env.production.example` to `.env.production`
2. Update all placeholder values with actual production credentials:

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mawu_foundation_prod

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_your_actual_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_actual_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Email Service
RESEND_API_KEY=re_your_actual_resend_api_key
EMAIL_FROM=Mawu Foundation <hello@mawufoundation.org>

# Admin Configuration
ADMIN_EMAIL=admin@mawufoundation.org
ADMIN_PASSWORD=secure_random_password_here
ADMIN_NAME=Foundation Admin

# Session Security
SESSION_SECRET=generate_secure_random_string_here

# API Configuration
VITE_API_URL=https://api.mawufoundation.org
FRONTEND_URL=https://mawufoundation.org
```

## Deployment Steps

### 1. Database Setup

```bash
# Create production database
createdb mawu_foundation_prod

# Run database migrations
npm run db:push
```

### 2. Build Application

```bash
# Install dependencies
npm install

# Build frontend
npm run build --workspace @mawu/web
```

### 3. Coolify Configuration

The `nixpacks.toml` file is configured for Coolify deployment:

- PostgreSQL client is installed during setup
- Frontend is built during the build phase
- Database migrations run during deploy phase
- Server starts with production configuration

### 4. SSL and Domain Configuration

- Configure SSL certificate for your domain
- Update DNS records to point to your server
- Ensure HTTPS is enforced

### 5. Stripe Webhook Configuration

1. In Stripe Dashboard, create a webhook endpoint pointing to:
   `https://yourdomain.com/api/webhooks/stripe`

2. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`

3. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Post-Deployment Tasks

### 1. Create Admin User

```bash
npm run seed:admin
```

### 2. Test Core Functionality

- [ ] Homepage loads correctly
- [ ] Shop displays products
- [ ] Donation form works
- [ ] Contact forms submit successfully
- [ ] Admin dashboard accessible

### 3. Email Configuration

- Test email delivery for:
  - Newsletter subscriptions
  - Contact form submissions
  - Order confirmations (when implemented)
  - Donation receipts (when implemented)

## Security Considerations

1. **Environment Variables**: Ensure all sensitive data is in environment variables, not committed to code
2. **Database**: Use strong passwords and restrict database access
3. **Session Security**: Use a strong, random session secret
4. **HTTPS**: Enforce HTTPS for all traffic
5. **Stripe**: Use production keys only in production environment

## Monitoring and Maintenance

1. **Logs**: Monitor application and server logs
2. **Database**: Regular backups of production database
3. **Updates**: Keep dependencies updated
4. **Performance**: Monitor page load times and server resources

## Rollback Plan

1. Keep previous deployment available
2. Database backup before each deployment
3. Quick rollback procedure documented
4. Health checks to verify deployment success

## Support

For deployment issues:
- Check server logs: `docker logs <container_name>`
- Verify environment variables are set correctly
- Ensure database connectivity
- Check Stripe webhook configuration