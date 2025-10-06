# Final Testing and Production Readiness Guide

This guide covers the comprehensive testing process to validate that the Mawu Foundation platform is ready for production deployment.

## Overview

The final testing suite validates all critical functionality across multiple dimensions:

1. **User Journeys** - Complete end-to-end user flows
2. **Email Notifications** - All email types and delivery
3. **Security** - Authentication, authorization, and vulnerability assessment
4. **Production Configuration** - Environment setup and integrations
5. **Data Integrity** - Database validation and consistency

## Prerequisites

Before running the final tests, ensure:

### 1. Server is Running
```bash
npm run dev:server
```

The server must be running on `http://localhost:3000` (or your configured `VITE_API_URL`).

### 2. Environment Variables Configured

All required environment variables must be set in your `.env` file:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Stripe
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
TEST_EMAIL=test-recipient@example.com  # Optional: for email tests

# Admin
ADMIN_EMAIL=admin@mawufoundation.org
ADMIN_PASSWORD=secure-password-here
SESSION_SECRET=long-random-string-at-least-32-characters

# Application
NODE_ENV=production  # or development
VITE_API_URL=http://localhost:3000
```

### 3. Database Seeded

Ensure you have:
- Products in the database
- Admin user created (run `npm run seed:admin` if needed)

## Running Tests

### Quick Start - Run All Tests

Run the comprehensive test suite that orchestrates all tests:

```bash
npm run test:final
```

This will:
1. Check prerequisites (server, database, environment)
2. Run all test suites in sequence
3. Generate a final production readiness report
4. Provide a go/no-go decision for deployment

### Individual Test Suites

You can also run individual test suites:

#### 1. User Journey Tests
Tests complete user flows from start to finish.

```bash
npx tsx server/test-user-journeys.ts
```

**What it tests:**
- Product browsing and detail viewing
- Shopping cart and checkout flow
- Payment intent creation
- Order creation and storage
- Donation flow from amount selection to payment
- Admin login and session management
- Admin order and donation viewing

#### 2. Email Notification Tests
Validates all email types and delivery.

```bash
npx tsx server/test-email-notifications.ts
```

**What it tests:**
- Email service connection (Gmail SMTP)
- Order confirmation emails
- Donation receipt emails
- Order status update emails
- Admin notification emails (new orders, donations)
- Email template rendering
- Error handling and retry logic

**Note:** Check your inbox (and spam folder) for test emails.

#### 3. Security Tests
Comprehensive security and vulnerability assessment.

```bash
npx tsx server/test-security.ts
```

**What it tests:**
- Authentication and authorization
- Admin endpoint protection
- Invalid credential rejection
- Session security (HttpOnly cookies)
- SQL injection prevention
- XSS (Cross-Site Scripting) prevention
- Input validation (email, amounts)
- Stripe webhook signature verification
- Environment security (secrets, passwords)
- Security headers (CORS, Content-Type)

#### 4. Production Readiness Tests
Environment configuration and integration validation.

```bash
npx tsx server/test-production-readiness.ts
```

**What it tests:**
- Environment variable configuration
- Database connectivity and data validation
- Stripe API integration
- Email service configuration
- API endpoint accessibility
- Security configuration
- Production vs. development settings

## Test Results Interpretation

### Success Criteria

For production deployment, the following must pass:

#### Critical Requirements (Must Pass)
- ✅ All environment variables configured
- ✅ Database connection successful
- ✅ Admin user exists
- ✅ Stripe integration working
- ✅ Authentication and authorization working
- ✅ No critical security vulnerabilities
- ✅ User journeys complete successfully

#### Important Requirements (Should Pass)
- ✅ Email service configured and working
- ✅ All email types sending correctly
- ✅ No high-priority security issues
- ✅ Input validation working
- ✅ Webhook signature verification

### Understanding Test Output

#### ✓ Green Checkmarks
Tests passed successfully. No action needed.

#### ✗ Red X Marks
Tests failed. Review the error message and fix the issue.

#### ⚠️ Yellow Warnings
Non-critical issues. Consider addressing before deployment.

### Common Issues and Solutions

#### Issue: "Server is not running"
**Solution:** Start the server with `npm run dev:server`

#### Issue: "Missing environment variables"
**Solution:** Copy `.env.example` to `.env` and fill in all values

#### Issue: "Database connection failed"
**Solution:** 
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Run `npm run db:push` to sync schema

#### Issue: "Admin user not found"
**Solution:** Run `npm run seed:admin` to create admin user

#### Issue: "Email service connection failed"
**Solution:**
- Verify Gmail SMTP credentials
- Ensure you're using an app-specific password (not your regular Gmail password)
- Check firewall/network settings

#### Issue: "Stripe integration failed"
**Solution:**
- Verify `STRIPE_SECRET_KEY` is correct
- Check Stripe dashboard for API key status
- Ensure you're using the correct key for your environment (test vs. live)

#### Issue: "Webhook signature verification failed"
**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Get the webhook secret from Stripe Dashboard → Webhooks
- Ensure the webhook endpoint is configured in Stripe

## Production Deployment Checklist

Before deploying to production, verify:

### Configuration
- [ ] All environment variables set for production
- [ ] Using production Stripe keys (`sk_live_...`)
- [ ] Using production database
- [ ] `NODE_ENV=production`
- [ ] Strong session secret (32+ characters)
- [ ] Admin password changed from default
- [ ] Email service configured with production credentials

### Testing
- [ ] All critical tests passing
- [ ] User journeys working end-to-end
- [ ] Email notifications sending correctly
- [ ] No critical or high-priority security issues
- [ ] Stripe webhooks configured and verified

### Security
- [ ] HTTPS enabled
- [ ] Secure session cookies (HttpOnly, Secure flags)
- [ ] CORS properly configured
- [ ] Input validation working
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified

### Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Stripe webhook logs accessible
- [ ] Email delivery monitoring
- [ ] Database backup strategy in place

## Continuous Testing

### During Development
Run individual test suites as you make changes:
```bash
npm run test:user-journeys
npm run test:security
```

### Before Each Deployment
Always run the full test suite:
```bash
npm run test:final
```

### After Deployment
1. Run smoke tests on production
2. Verify Stripe webhooks are receiving events
3. Check email delivery
4. Monitor error logs
5. Test critical user journeys manually

## Test Maintenance

### Adding New Tests

When adding new features, update the relevant test files:

- **User flows:** `server/test-user-journeys.ts`
- **Email types:** `server/test-email-notifications.ts`
- **Security checks:** `server/test-security.ts`
- **Configuration:** `server/test-production-readiness.ts`

### Test Data

Tests use:
- Real database (ensure test data doesn't interfere with production)
- Stripe test mode (when using test keys)
- Real email sending (to configured test addresses)

Consider using a separate test database for comprehensive testing.

## Support

If tests fail and you need help:

1. Review the error messages carefully
2. Check the relevant documentation section
3. Verify your environment configuration
4. Check Stripe dashboard for payment/webhook issues
5. Review email service logs
6. Check database logs and connectivity

## Summary

The final testing suite provides comprehensive validation of:
- ✅ Complete user journeys work end-to-end
- ✅ All integrations (Stripe, Email, Database) functioning
- ✅ Security measures in place and working
- ✅ Production configuration correct
- ✅ No critical vulnerabilities

Only deploy to production when all critical tests pass and you've addressed any warnings.
