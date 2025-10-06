# Deployment Quick Reference

Quick reference for common deployment commands and operations.

## Build Commands

### Local Development
```bash
# Start development server (frontend + backend)
npm run dev

# Start only frontend
npm run dev --workspace @mawu/web

# Start only backend
npm run dev:server
```

### Production Build
```bash
# Build everything
npm run build

# Build frontend only
npm run build --workspace @mawu/web

# Build backend only
npm run build:server

# Verify production build
./scripts/verify-production-build.sh
# or on Windows:
.\scripts\verify-production-build.ps1
```

### Production Start
```bash
# Start production server
NODE_ENV=production npm run start:production

# or on Windows:
$env:NODE_ENV='production'; npm run start:production
```

## Database Commands

```bash
# Push schema changes to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed admin user
npm run seed:admin

# Seed admin user (production)
npm run seed:admin:production
```

## Testing Commands

```bash
# Test email configuration
npm run test:email

# Test email notifications
npm run test:email-notifications

# Test Stripe webhook
npm run test:webhook

# Test product variations
npm run test:variations
```

## Environment Setup

### Generate Session Secret
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Test Database Connection
```bash
# Using psql
psql "$DATABASE_URL" -c "SELECT 1;"

# Using Node.js
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT 1').then(() => console.log('Connected!')).catch(console.error);"
```

## Coolify Deployment

### Initial Setup
1. Create application in Coolify
2. Connect Git repository
3. Set build pack to "nixpacks"
4. Configure environment variables
5. Deploy

### Update Deployment
```bash
# Commit and push changes
git add .
git commit -m "Your commit message"
git push origin main

# Coolify will automatically rebuild and deploy
```

### Manual Deployment Operations
```bash
# SSH into Coolify container
# Then run:

# Rebuild application
npm run build

# Run migrations
npm run db:push

# Reseed admin
npm run seed:admin:production

# Restart server
# (Use Coolify dashboard to restart)
```

## Health Checks

### Application Health
```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-10-05T12:00:00.000Z",
#   "environment": "production",
#   "services": {
#     "database": "connected",
#     "stripe": "configured",
#     "email": "configured"
#   }
# }
```

### Service Checks
```bash
# Check if server is running
curl -I https://your-domain.com

# Check API endpoint
curl https://your-domain.com/api/products

# Check admin endpoint (should return 401)
curl https://your-domain.com/api/admin/me
```

## Stripe Configuration

### Webhook Testing (Local)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test webhook
stripe trigger payment_intent.succeeded
```

### Webhook Setup (Production)
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.succeeded`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Email Configuration

### Gmail SMTP Setup
1. Enable 2FA on Gmail account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate app password for "Mail"
4. Use in `EMAIL_PASS` environment variable

### Test Email
```bash
# Test email configuration
npm run test:email

# Check email logs
# (Check application logs in Coolify)
```

## Troubleshooting Commands

### View Logs
```bash
# In Coolify dashboard:
# Navigate to your application → Logs

# Or SSH into container and check:
pm2 logs
# or
journalctl -u your-service-name
```

### Database Debugging
```bash
# Connect to database
psql "$DATABASE_URL"

# List tables
\dt

# Check products
SELECT * FROM products LIMIT 5;

# Check orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

# Check admin users
SELECT id, email, name FROM admins;
```

### Clear Session Data
```bash
# Connect to database
psql "$DATABASE_URL"

# Clear sessions
DELETE FROM session;
```

## Common Issues

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist apps/web/dist
npm run build
```

### Database Connection Issues
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"

# Check if database exists
psql "$DATABASE_URL" -c "\l"
```

### Email Not Sending
```bash
# Test email configuration
npm run test:email

# Check environment variables
echo $EMAIL_USER
echo $EMAIL_PASS

# Verify Gmail app password is correct
# (Try logging in to Gmail with the app password)
```

### Stripe Webhook Issues
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded

# Check webhook logs in Stripe Dashboard
# Developers → Webhooks → [Your Endpoint] → Logs
```

## Performance Monitoring

### Check Response Times
```bash
# Test API response time
time curl https://your-domain.com/api/health

# Test page load time
time curl https://your-domain.com
```

### Monitor Database
```bash
# Check active connections
psql "$DATABASE_URL" -c "SELECT count(*) FROM pg_stat_activity;"

# Check database size
psql "$DATABASE_URL" -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

## Backup Commands

### Database Backup
```bash
# Create backup
pg_dump "$DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql "$DATABASE_URL" < backup_20251005_120000.sql
```

### Environment Variables Backup
```bash
# Export environment variables (remove sensitive data before sharing)
env | grep -E "DATABASE_URL|STRIPE|EMAIL|ADMIN|SESSION" > env_backup.txt
```

## Security Commands

### Generate Secure Passwords
```bash
# Generate random password
openssl rand -base64 32

# Generate alphanumeric password
openssl rand -hex 16
```

### Check for Vulnerabilities
```bash
# Check npm packages
npm audit

# Fix vulnerabilities
npm audit fix
```

## Useful Aliases

Add these to your `.bashrc` or `.zshrc`:

```bash
# Development
alias mawu-dev="npm run dev"
alias mawu-build="npm run build"
alias mawu-start="NODE_ENV=production npm run start:production"

# Database
alias mawu-db="npm run db:studio"
alias mawu-migrate="npm run db:push"
alias mawu-seed="npm run seed:admin"

# Testing
alias mawu-test-email="npm run test:email"
alias mawu-health="curl http://localhost:3000/api/health"
```

## Quick Deployment Checklist

- [ ] Code changes committed and pushed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Build tested locally
- [ ] Health check endpoint working
- [ ] Stripe webhook configured
- [ ] Email service tested
- [ ] Admin user seeded
- [ ] Monitoring setup
- [ ] Backup strategy in place

## Support Resources

- **Coolify Docs**: https://coolify.io/docs
- **Stripe Docs**: https://stripe.com/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **Express.js**: https://expressjs.com/
- **React**: https://react.dev/

---

**Tip**: Bookmark this page for quick access to common commands!
