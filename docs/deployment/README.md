# Deployment Documentation

This directory contains comprehensive deployment documentation for the Mawu Foundation platform.

## Available Guides

### [Coolify Deployment Guide](./coolify-deployment-guide.md)
Complete step-by-step guide for deploying to Coolify on Ubuntu server. Covers:
- Prerequisites and setup
- Environment variable configuration
- Stripe webhook setup
- Gmail SMTP configuration
- Deployment process
- Post-deployment verification
- Troubleshooting

### [Production Checklist](./production-checklist.md)
Comprehensive checklist for production deployment. Includes:
- Pre-deployment preparation
- Configuration verification
- Post-deployment testing
- Security verification
- Monitoring setup
- Documentation requirements

## Quick Start

1. **Review Prerequisites**: Ensure you have all required services and credentials
2. **Configure Environment**: Set up all environment variables
3. **Follow Deployment Guide**: Use the Coolify deployment guide
4. **Complete Checklist**: Work through the production checklist
5. **Monitor**: Set up monitoring and verify everything works

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Coolify                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Application                          │ │
│  │  ┌──────────────┐         ┌──────────────┐            │ │
│  │  │   Frontend   │         │   Backend    │            │ │
│  │  │  (React SPA) │◄────────┤  (Express)   │            │ │
│  │  └──────────────┘         └──────┬───────┘            │ │
│  │                                   │                     │ │
│  └───────────────────────────────────┼─────────────────────┘ │
│                                      │                       │
│  ┌───────────────────────────────────▼─────────────────────┐ │
│  │              PostgreSQL Database                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    │                    │
        ┌───────────▼──────────┐  ┌─────▼──────────┐
        │   Stripe API         │  │  Gmail SMTP    │
        │  (Payments)          │  │  (Emails)      │
        └──────────────────────┘  └────────────────┘
```

## Build Process

The deployment uses nixpacks with the following phases:

1. **Setup**: Install system dependencies (PostgreSQL client)
2. **Install**: Install npm dependencies
3. **Build**: 
   - Build React frontend (`npm run build --workspace @mawu/web`)
   - Compile TypeScript backend (`npm run build:server`)
4. **Deploy**: 
   - Push database schema (`npm run db:push`)
   - Seed admin user (`npm run seed:admin:production`)
5. **Start**: Run production server (`npm run start:production`)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `STRIPE_SECRET_KEY` | Stripe secret key (live) | `sk_live_...` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key (live) | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `EMAIL_USER` | Gmail address | `foundation@mawufoundation.org` |
| `EMAIL_PASS` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `ADMIN_EMAIL` | Admin user email | `admin@mawufoundation.org` |
| `ADMIN_PASSWORD` | Admin user password | `secure_password` |
| `SESSION_SECRET` | Session encryption key | `random_string` |
| `VITE_API_URL` | API base URL | `https://your-domain.com` |
| `FRONTEND_URL` | Frontend URL | `https://your-domain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `ADMIN_NAME` | Admin display name | `Admin User` |

## Key Files

### Configuration Files
- `nixpacks.toml` - Coolify build configuration
- `tsconfig.server.json` - TypeScript configuration for server build
- `package.json` - Build scripts and dependencies
- `.env.production.example` - Production environment template

### Deployment Scripts
- `scripts/deploy-production.sh` - Manual deployment helper script

### Server Files
- `server/index.ts` - Main server entry point
- `server/routes.ts` - API routes and health check
- `server/seed-admin.ts` - Admin user seeding

## Monitoring

### Health Check Endpoint

The application provides a health check endpoint at `/api/health`:

```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-05T12:00:00.000Z",
  "environment": "production",
  "services": {
    "database": "connected",
    "stripe": "configured",
    "email": "configured"
  }
}
```

### What to Monitor

1. **Application Health**: Use `/api/health` endpoint
2. **Database**: Connection pool and query performance
3. **Email Delivery**: Success/failure rates
4. **Stripe Webhooks**: Delivery and processing
5. **Error Logs**: Application errors and warnings
6. **Response Times**: API and page load times

## Troubleshooting

### Common Issues

1. **Build Fails**: Check environment variables and build logs
2. **Database Connection**: Verify DATABASE_URL and network access
3. **Email Not Sending**: Check Gmail SMTP credentials and app password
4. **Stripe Webhooks**: Verify webhook secret and endpoint URL
5. **Admin Login Fails**: Ensure admin user was seeded correctly

See the [Coolify Deployment Guide](./coolify-deployment-guide.md) for detailed troubleshooting steps.

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use strong passwords**: For admin and session secret
3. **Enable HTTPS**: Always use SSL in production
4. **Restrict database access**: Only allow application access
5. **Monitor logs**: Watch for suspicious activity
6. **Keep dependencies updated**: Regular security updates
7. **Use Stripe production keys**: Only in production environment

## Backup and Recovery

### What to Backup

1. **Database**: Regular PostgreSQL backups
2. **Environment Variables**: Secure copy of all variables
3. **Uploaded Assets**: Any user-uploaded files

### Recovery Process

1. Restore database from backup
2. Redeploy application with same environment variables
3. Verify all services are working
4. Test critical user flows

## Support and Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Stripe Documentation**: https://stripe.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

## Updates and Maintenance

### Regular Maintenance Tasks

- [ ] Review and update dependencies monthly
- [ ] Check security advisories
- [ ] Monitor error logs weekly
- [ ] Verify backup integrity monthly
- [ ] Review performance metrics
- [ ] Update documentation as needed

### Deployment Updates

To deploy updates:

1. Test changes locally
2. Commit and push to repository
3. Coolify will automatically rebuild and deploy
4. Monitor logs for any issues
5. Verify critical functionality

## Getting Help

If you encounter issues:

1. Check the troubleshooting section in the deployment guide
2. Review application logs in Coolify
3. Verify environment variables are correct
4. Test locally with production-like settings
5. Contact the development team

---

**Last Updated**: 2025-10-05
**Version**: 1.0.0
