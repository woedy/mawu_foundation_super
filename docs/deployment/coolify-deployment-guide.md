# Coolify Deployment Guide

This guide covers deploying the Mawu Foundation platform to Coolify on an Ubuntu server.

## Prerequisites

- Coolify instance running on Ubuntu server
- PostgreSQL database (can be provisioned through Coolify)
- Domain name configured and pointing to your server
- Stripe account with production API keys
- Gmail account with app-specific password for SMTP

## Deployment Steps

### 1. Database Setup

Create a PostgreSQL database in Coolify:

1. Navigate to your Coolify dashboard
2. Create a new PostgreSQL database service
3. Note the connection string (DATABASE_URL)
4. Ensure the database is accessible from your application

### 2. Environment Variables Configuration

Configure the following environment variables in Coolify:

#### Required Variables

```bash
# Node Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/mawu_foundation_prod

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_your_production_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_production_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Email Configuration
EMAIL_USER=foundation@mawufoundation.org
EMAIL_PASS=your_gmail_app_specific_password

# Admin User (Initial Setup)
ADMIN_EMAIL=admin@mawufoundation.org
ADMIN_PASSWORD=secure_production_password
ADMIN_NAME=Foundation Admin

# Session Security (Generate a secure random string)
SESSION_SECRET=generate_a_secure_random_string_here

# URLs
VITE_API_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

# Port (Coolify will set this automatically)
PORT=3000
```

#### Generating Secure Secrets

For SESSION_SECRET, generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Stripe Webhook Configuration

1. Log into Stripe Dashboard (Live Mode)
2. Navigate to Developers > Webhooks
3. Click "Add endpoint"
4. Enter webhook URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
6. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App-Specific Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail" on "Other (Custom name)"
3. Use this password for `EMAIL_PASS` environment variable

### 5. Deploy Application in Coolify

1. Create a new application in Coolify
2. Connect your Git repository
3. Set build pack to "nixpacks"
4. Configure environment variables (from step 2)
5. Set custom nixpacks configuration (already in repo as `nixpacks.toml`)
6. Deploy the application

### 6. Post-Deployment Verification

After deployment, verify:

1. **Database Connection**: Check logs for successful database connection
2. **Admin User**: Admin user should be seeded automatically
3. **Frontend Access**: Visit your domain and verify the site loads
4. **API Health**: Test API endpoints at `https://your-domain.com/api/`
5. **Stripe Integration**: Test a donation or purchase
6. **Email Delivery**: Verify confirmation emails are sent
7. **Webhook**: Test webhook by making a test payment

### 7. Testing Checklist

- [ ] Homepage loads correctly
- [ ] Shop page displays products
- [ ] Product detail pages work
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Stripe payment processes successfully
- [ ] Order confirmation email received
- [ ] Donation page works
- [ ] Donation confirmation email received
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Webhook receives Stripe events

## Build Process

The nixpacks.toml configuration handles:

1. **Setup Phase**: Installs PostgreSQL client
2. **Install Phase**: Installs npm dependencies
3. **Build Phase**: 
   - Builds frontend React application
   - Compiles TypeScript server code
4. **Deploy Phase**:
   - Pushes database schema
   - Seeds admin user
5. **Start Phase**: Runs production server

## Troubleshooting

### Database Connection Issues

If database connection fails:
- Verify DATABASE_URL is correct
- Check database is running and accessible
- Ensure PostgreSQL client is installed (handled by nixpacks)

### Build Failures

If build fails:
- Check build logs in Coolify
- Verify all environment variables are set
- Ensure TypeScript compilation succeeds

### Email Delivery Issues

If emails aren't sending:
- Verify Gmail SMTP credentials
- Check EMAIL_USER and EMAIL_PASS are correct
- Ensure app-specific password is used (not regular password)
- Check server logs for email errors

### Stripe Webhook Issues

If webhooks aren't working:
- Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
- Check webhook URL is accessible from internet
- Ensure webhook endpoint is registered in Stripe
- Use Stripe CLI to test webhooks locally first

### Admin Login Issues

If admin login fails:
- Check admin user was seeded (check logs)
- Verify ADMIN_EMAIL and ADMIN_PASSWORD are set
- Try rerunning seed script manually

## Manual Operations

### Reseed Admin User

If you need to recreate the admin user:

```bash
# SSH into your Coolify container
npm run seed:admin:production
```

### Run Database Migrations

To manually run migrations:

```bash
npm run db:push
```

### View Logs

Check application logs in Coolify dashboard for debugging.

## Security Considerations

1. **Environment Variables**: Never commit production secrets to Git
2. **HTTPS**: Always use HTTPS in production (Coolify handles this)
3. **Session Secret**: Use a strong, random session secret
4. **Database**: Ensure database is not publicly accessible
5. **Admin Password**: Use a strong admin password
6. **Stripe Keys**: Use production keys only in production environment

## Monitoring

Monitor the following:

- Application uptime
- Database connection pool
- Email delivery success rate
- Stripe webhook delivery
- Error logs
- Response times

## Backup Strategy

Ensure regular backups of:

1. PostgreSQL database
2. Environment variables configuration
3. Uploaded assets (if any)

## Scaling Considerations

For high traffic:

1. Enable database connection pooling
2. Consider CDN for static assets
3. Monitor server resources
4. Scale horizontally if needed

## Support

For deployment issues:
- Check Coolify documentation
- Review application logs
- Verify environment configuration
- Test locally with production-like settings
