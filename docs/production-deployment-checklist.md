# Production Deployment Checklist

Use this checklist to ensure the Mawu Foundation platform is ready for production deployment.

## Pre-Deployment Checklist

### 1. Environment Configuration ✓

- [ ] All environment variables configured in production `.env`
- [ ] `NODE_ENV=production`
- [ ] Production database URL configured
- [ ] Production Stripe keys (`sk_live_...`) configured
- [ ] Stripe webhook secret configured
- [ ] Gmail SMTP credentials configured
- [ ] Strong session secret (32+ characters)
- [ ] Admin credentials set (not default password)
- [ ] Frontend URL configured correctly

### 2. Database Setup ✓

- [ ] Production database created
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Admin user seeded (`npm run seed:admin`)
- [ ] Products added to database
- [ ] Database backups configured
- [ ] Database connection tested

### 3. Stripe Configuration ✓

- [ ] Stripe account in production mode
- [ ] Production API keys obtained
- [ ] Webhook endpoint configured in Stripe Dashboard
- [ ] Webhook secret obtained and configured
- [ ] Test payment processed successfully
- [ ] Webhook events receiving correctly

### 4. Email Configuration ✓

- [ ] Gmail SMTP enabled
- [ ] App-specific password generated
- [ ] Email credentials configured
- [ ] Test email sent successfully
- [ ] Email templates reviewed
- [ ] Sender email verified

### 5. Security Configuration ✓

- [ ] HTTPS enabled on production server
- [ ] Session cookies using HttpOnly flag
- [ ] Session cookies using Secure flag (HTTPS only)
- [ ] CORS properly configured
- [ ] Admin password changed from default
- [ ] Session secret is strong and unique
- [ ] No sensitive data in logs
- [ ] Error messages don't expose system details

### 6. Testing Completed ✓

- [ ] All critical tests passing
- [ ] User journey tests passing
- [ ] Email notification tests passing
- [ ] Security tests passing
- [ ] Production readiness tests passing
- [ ] Final comprehensive test suite passing
- [ ] Manual testing of critical flows completed

### 7. Code Quality ✓

- [ ] No demo/placeholder content in code
- [ ] All console.logs removed or appropriate
- [ ] Error handling implemented
- [ ] Input validation in place
- [ ] Code linted and formatted
- [ ] TypeScript compilation successful
- [ ] No TypeScript errors

### 8. Content Review ✓

- [ ] All demo text removed from UI
- [ ] Footer updated (no "demo preview" text)
- [ ] Product descriptions finalized
- [ ] Program pages content complete
- [ ] About/Contact information accurate
- [ ] Legal pages (Privacy, Terms) present
- [ ] Images optimized and appropriate

### 9. Performance ✓

- [ ] Frontend build optimized
- [ ] Images compressed
- [ ] Lazy loading implemented where appropriate
- [ ] Database queries optimized
- [ ] API response times acceptable
- [ ] Page load times acceptable

### 10. Monitoring & Logging ✓

- [ ] Error logging configured
- [ ] Application logs accessible
- [ ] Stripe webhook logs accessible
- [ ] Email delivery logs accessible
- [ ] Database logs accessible
- [ ] Monitoring/alerting set up (optional)

## Deployment Steps

### 1. Pre-Deployment

```bash
# Ensure you're on the correct branch
git status
git pull origin main

# Install dependencies
npm install

# Build the application
npm run build

# Run final tests
npm run test:final
```

### 2. Deploy to Production

```bash
# Using Coolify or your deployment platform
# Follow platform-specific deployment instructions

# For manual deployment:
npm run build
npm run start:production
```

### 3. Post-Deployment Verification

Immediately after deployment:

- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Products display correctly
- [ ] Shopping cart works
- [ ] Checkout flow works
- [ ] Donation flow works
- [ ] Admin login works
- [ ] Admin dashboard accessible

### 4. Integration Testing

Test all integrations in production:

- [ ] Process a test order (small amount)
- [ ] Verify order confirmation email received
- [ ] Check order appears in admin dashboard
- [ ] Process a test donation (small amount)
- [ ] Verify donation receipt email received
- [ ] Check donation appears in admin dashboard
- [ ] Verify Stripe webhook events processing
- [ ] Check Stripe Dashboard for transactions

### 5. Monitoring

First 24 hours after deployment:

- [ ] Monitor error logs
- [ ] Check Stripe webhook logs
- [ ] Verify email delivery
- [ ] Monitor database performance
- [ ] Check for any user-reported issues
- [ ] Verify all critical flows working

## Rollback Plan

If critical issues are discovered:

1. **Immediate Actions:**
   - Put up maintenance page if needed
   - Stop processing new orders/donations
   - Document the issue

2. **Rollback Steps:**
   - Revert to previous deployment
   - Restore database backup if needed
   - Verify previous version working
   - Communicate with users if needed

3. **Post-Rollback:**
   - Investigate and fix the issue
   - Test thoroughly in staging
   - Re-run all tests
   - Deploy again when ready

## Emergency Contacts

Keep these handy during deployment:

- **Technical Lead:** [Contact Info]
- **Database Admin:** [Contact Info]
- **Stripe Support:** https://support.stripe.com
- **Hosting Support:** [Platform Support]
- **Email Service Support:** Gmail/Google Workspace Support

## Post-Deployment Tasks

Within first week:

- [ ] Monitor conversion rates
- [ ] Review error logs daily
- [ ] Check email delivery rates
- [ ] Verify Stripe reconciliation
- [ ] Gather user feedback
- [ ] Address any minor issues
- [ ] Document any lessons learned

## Success Criteria

Deployment is successful when:

- ✅ All critical functionality working
- ✅ No critical errors in logs
- ✅ Orders processing successfully
- ✅ Donations processing successfully
- ✅ Emails sending reliably
- ✅ Admin dashboard accessible and functional
- ✅ Stripe webhooks processing correctly
- ✅ No security vulnerabilities
- ✅ Performance acceptable
- ✅ Users able to complete transactions

## Notes

- Always test in staging/development first
- Never deploy on Friday afternoon
- Have rollback plan ready
- Monitor closely after deployment
- Document any issues and resolutions
- Keep stakeholders informed

---

**Last Updated:** [Date]
**Deployment Date:** [Date]
**Deployed By:** [Name]
**Version:** [Version Number]
