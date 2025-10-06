# Testing Suite Documentation

Comprehensive testing suite for the Mawu Foundation platform to ensure production readiness.

## Quick Start

### Run All Tests (Recommended)

```bash
# Start the server first
npm run dev:server

# In another terminal, run all tests
npm run test:final
```

This runs the complete test suite and provides a production readiness report.

## Test Suites Overview

### 1. Final Production Readiness Test
**Script:** `npm run test:final`  
**File:** `server/test-final-production-readiness.ts`

Orchestrates all test suites and provides a comprehensive production readiness assessment.

**What it does:**
- Checks prerequisites (server, database, environment)
- Runs all test suites in sequence
- Generates final go/no-go decision
- Provides detailed report with recommendations

**When to run:**
- Before every production deployment
- After major changes
- As part of CI/CD pipeline

### 2. User Journey Tests
**Script:** `npm run test:user-journeys`  
**File:** `server/test-user-journeys.ts`

Tests complete end-to-end user flows.

**Journeys tested:**
1. **Product Purchase Journey**
   - Browse products
   - View product details
   - Create payment intent
   - Verify order creation

2. **Donation Journey**
   - Create donation payment intent
   - Verify donation creation
   - Validate donation amount

3. **Admin Management Journey**
   - Admin login
   - Verify session
   - View orders
   - View donations
   - Admin logout

**When to run:**
- After changes to checkout flow
- After changes to donation flow
- After changes to admin functionality
- Before deployment

### 3. Email Notification Tests
**Script:** `npm run test:email-notifications`  
**File:** `server/test-email-notifications.ts`

Validates all email types and delivery.

**Emails tested:**
- Order confirmation emails
- Donation receipt emails
- Order status update emails
- Admin notification emails (new orders)
- Admin notification emails (new donations)
- Simple test email

**When to run:**
- After email template changes
- After email service configuration changes
- To verify email delivery
- Before deployment

**Note:** Check your inbox for test emails!

### 4. Security Tests
**Script:** `npm run test:security`  
**File:** `server/test-security.ts`

Comprehensive security and vulnerability assessment.

**Security checks:**
- Authentication & Authorization
  - Admin endpoint protection
  - Invalid credential rejection
  - Session security (HttpOnly cookies)

- Input Validation
  - SQL injection prevention
  - XSS prevention
  - Email format validation
  - Amount validation (negative numbers)

- Webhook Security
  - Stripe signature verification

- Environment Security
  - Session secret strength
  - Admin password security
  - Stripe keys configuration
  - Email configuration
  - Database configuration

- Security Headers
  - CORS configuration
  - Content-Type headers

**When to run:**
- Before every deployment
- After security-related changes
- Regularly as part of security audits
- After dependency updates

### 5. Production Readiness Tests
**Script:** `npm run test:production-readiness`  
**File:** `server/test-production-readiness.ts`

Validates environment configuration and integrations.

**Tests:**
- Environment variable configuration
- Database connectivity
- Stripe integration
- Email service
- API endpoints
- Security configuration
- Data validation

**When to run:**
- Before deployment
- After environment changes
- After configuration updates
- When troubleshooting integration issues

## Test Results

### Understanding Output

#### ✓ Green Checkmarks
Test passed successfully. No action needed.

#### ✗ Red X Marks
Test failed. Review error message and fix the issue.

#### ⚠️ Yellow Warnings
Non-critical issue. Consider addressing before deployment.

### Severity Levels

**Critical** 🚨
- Must be fixed before deployment
- Security vulnerabilities
- Core functionality broken

**High** ⚠️
- Should be fixed before deployment
- Important security issues
- Significant functionality issues

**Medium** ⚡
- Should be addressed soon
- Minor security concerns
- Non-critical functionality issues

**Low** ℹ️
- Nice to fix
- Optimization opportunities
- Minor improvements

## Prerequisites

### 1. Server Running
```bash
npm run dev:server
```

### 2. Environment Variables
All required variables in `.env`:
```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SESSION_SECRET=long-random-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
```

### 3. Database Setup
```bash
npm run db:push
npm run seed:admin
```

## Common Issues

### "Server is not running"
**Solution:** Start server with `npm run dev:server`

### "Missing environment variables"
**Solution:** Copy `.env.example` to `.env` and configure

### "Database connection failed"
**Solution:** 
- Check `DATABASE_URL`
- Ensure PostgreSQL is running
- Run `npm run db:push`

### "Admin user not found"
**Solution:** Run `npm run seed:admin`

### "Email service failed"
**Solution:**
- Verify Gmail SMTP credentials
- Use app-specific password
- Check network/firewall

### "Stripe integration failed"
**Solution:**
- Verify `STRIPE_SECRET_KEY`
- Check Stripe dashboard
- Ensure correct environment (test/live)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Setup database
        run: npm run db:push
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Seed admin
        run: npm run seed:admin
        env:
          ADMIN_EMAIL: admin@test.com
          ADMIN_PASSWORD: test-password
      
      - name: Start server
        run: npm run dev:server &
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_TEST_KEY }}
          STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET }}
          EMAIL_USER: ${{ secrets.EMAIL_USER }}
          EMAIL_PASS: ${{ secrets.EMAIL_PASS }}
          SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
      
      - name: Wait for server
        run: sleep 10
      
      - name: Run tests
        run: npm run test:final
```

## Test Development

### Adding New Tests

#### User Journey Test
Add to `server/test-user-journeys.ts`:

```typescript
async testNewJourney() {
  const journey: JourneyResult = {
    journey: 'New Journey Name',
    steps: [],
    totalDuration: 0,
    success: true
  };

  // Add test steps
  journey.steps.push({
    step: 'Step Name',
    passed: true,
    message: 'Step completed',
    duration: 100
  });

  this.results.push(journey);
  this.printJourneyResults(journey);
}
```

#### Security Test
Add to `server/test-security.ts`:

```typescript
async testNewSecurityCheck() {
  this.addResult(
    'Category',
    'Test Name',
    passed,
    'critical', // or 'high', 'medium', 'low'
    'Test result message'
  );
}
```

## Best Practices

### Before Deployment
1. Run `npm run test:final`
2. Fix all critical issues
3. Address high-priority issues
4. Document any warnings
5. Get approval for deployment

### During Development
1. Run relevant test suite after changes
2. Fix issues immediately
3. Don't commit failing tests
4. Update tests when adding features

### After Deployment
1. Run smoke tests on production
2. Monitor logs for errors
3. Verify critical flows manually
4. Check integration logs (Stripe, Email)

## Maintenance

### Regular Tasks
- Review and update tests monthly
- Add tests for new features
- Remove obsolete tests
- Update documentation
- Review security checks

### When to Update Tests
- New features added
- API changes
- Security requirements change
- Integration changes
- Bug fixes that need test coverage

## Support

For issues with the test suite:

1. Check this documentation
2. Review test output carefully
3. Verify prerequisites
4. Check environment configuration
5. Review relevant integration docs

## Related Documentation

- [Final Testing Guide](./final-testing-guide.md) - Detailed testing procedures
- [Production Deployment Checklist](./production-deployment-checklist.md) - Deployment steps
- [Project Overview](./project-overview.md) - Platform overview

## Summary

The testing suite provides:
- ✅ Comprehensive coverage of critical functionality
- ✅ Security vulnerability assessment
- ✅ Integration validation
- ✅ Production readiness verification
- ✅ Clear go/no-go decision for deployment

Always run tests before deployment and address all critical issues.
