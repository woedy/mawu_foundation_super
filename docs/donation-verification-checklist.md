# Donation Processing System - Verification Checklist

## Pre-Deployment Verification

Use this checklist to verify the donation processing system is working correctly before deploying to production.

## Environment Setup

- [ ] `STRIPE_SECRET_KEY` is set (use test key for testing)
- [ ] `VITE_STRIPE_PUBLIC_KEY` is set (use test key for testing)
- [ ] `STRIPE_WEBHOOK_SECRET` is set
- [ ] `EMAIL_USER` is configured with Gmail address
- [ ] `EMAIL_PASS` is configured with Gmail app-specific password
- [ ] `DATABASE_URL` is configured and database is accessible
- [ ] `FRONTEND_URL` is set correctly

## Database Verification

- [ ] `donations` table exists in database
- [ ] Table has all required columns (id, donor_email, donor_name, amount, currency, frequency, message, anonymous, stripe_payment_intent_id, status, created_at)
- [ ] Database connection is working

## Frontend Testing

### Get Involved Section (/)
- [ ] Donation form displays correctly
- [ ] Preset amounts (50, 150, 300, 500) are clickable
- [ ] Custom amount input works
- [ ] Frequency selector (once/monthly) works
- [ ] Focus area dropdown displays all options
- [ ] Email input field works
- [ ] Form validation shows errors for invalid inputs
- [ ] Submit button redirects to checkout page with correct parameters

### Enhanced Donate Page (/donate)
- [ ] Page loads without errors
- [ ] One-time/Monthly tabs work
- [ ] Preset donation tiers display correctly
- [ ] Custom amount input works
- [ ] Impact statement shows for selected amount
- [ ] Donate button redirects to checkout with correct parameters

### Donation Checkout Page (/donate/checkout)
- [ ] Page loads with amount and type from URL parameters
- [ ] Email pre-fills if provided in URL
- [ ] Focus area displays if provided in URL
- [ ] First name and last name inputs work
- [ ] Email validation works (shows error for invalid email)
- [ ] Message textarea works
- [ ] Anonymous checkbox works
- [ ] Payment method buttons display correctly
- [ ] "Coming Soon" buttons are disabled
- [ ] Form validation prevents submission with invalid data
- [ ] "Continue to Stripe Payment" button creates payment intent
- [ ] Stripe Elements form loads after clicking continue
- [ ] Error messages display correctly

### Stripe Payment Form
- [ ] Stripe Elements loads without errors
- [ ] Card number input works
- [ ] Expiry date input works
- [ ] CVC input works
- [ ] Test card (4242 4242 4242 4242) processes successfully
- [ ] Decline card (4000 0000 0000 0002) shows error
- [ ] Success redirects to success page

### Donation Success Page (/donate/success)
- [ ] Page displays success message
- [ ] Checkmark icon shows
- [ ] Donation amount displays correctly
- [ ] Donation type (one-time/monthly) displays correctly
- [ ] Transaction ID displays (if available in URL)
- [ ] Next steps section displays
- [ ] Links to homepage and programs work

## Backend Testing

### API Endpoint: POST /api/donations/create-payment-intent
- [ ] Endpoint is accessible
- [ ] Returns 400 for invalid amount (0, negative, non-numeric)
- [ ] Returns 400 for invalid email (missing @, empty)
- [ ] Returns 400 for empty donor name
- [ ] Returns 400 for invalid frequency
- [ ] Returns 400 for invalid currency
- [ ] Returns 200 with clientSecret for valid request
- [ ] Creates donation record in database with status 'pending'
- [ ] Updates donation status to 'processing' after creating payment intent
- [ ] Stripe payment intent is created successfully

### Webhook: POST /api/webhooks/stripe
- [ ] Endpoint is accessible
- [ ] Verifies webhook signature
- [ ] Returns 400 for invalid signature
- [ ] Handles payment_intent.succeeded event
- [ ] Updates donation status to 'completed'
- [ ] Sends email receipt to donor

## Email Testing

### Donation Receipt Email
- [ ] Email is sent after successful payment
- [ ] Email arrives in donor's inbox (check spam folder too)
- [ ] Email has professional HTML formatting
- [ ] Donor name displays correctly (or "Anonymous Donor" if anonymous)
- [ ] Donation amount and currency display correctly
- [ ] Transaction ID is included
- [ ] Donation date is formatted correctly
- [ ] Optional message is included (if provided)
- [ ] Foundation contact information is present
- [ ] Email is sent from configured EMAIL_USER address

## Database Verification

### After Successful Donation
- [ ] Donation record exists in database
- [ ] donor_email is correct
- [ ] donor_name is correct
- [ ] amount is correct (as decimal)
- [ ] currency is correct
- [ ] frequency is correct
- [ ] message is stored (if provided)
- [ ] anonymous flag is correct
- [ ] stripe_payment_intent_id is stored
- [ ] status is 'completed' after webhook
- [ ] created_at timestamp is set

## Error Handling Testing

### Frontend Errors
- [ ] Invalid amount shows error message
- [ ] Invalid email shows error message
- [ ] Empty name shows error message
- [ ] Network errors show user-friendly message
- [ ] Stripe errors display correctly

### Backend Errors
- [ ] Missing Stripe configuration returns 500
- [ ] Invalid request data returns 400 with error message
- [ ] Database errors are logged and return 500
- [ ] Stripe API errors are caught and returned

## Security Testing

- [ ] Card data never touches our servers (handled by Stripe)
- [ ] Webhook signature is verified
- [ ] SQL injection attempts are prevented (parameterized queries)
- [ ] XSS attempts are sanitized
- [ ] Email inputs are validated and sanitized
- [ ] Amount inputs are validated as numbers

## Performance Testing

- [ ] Page loads quickly (< 2 seconds)
- [ ] Stripe Elements loads quickly
- [ ] API responses are fast (< 1 second)
- [ ] Email sends don't block webhook response
- [ ] Database queries are optimized

## Browser Compatibility

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile browsers

## Accessibility Testing

- [ ] Form labels are properly associated with inputs
- [ ] Error messages are announced to screen readers
- [ ] Keyboard navigation works throughout flow
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards

## Production Readiness

- [ ] All test keys replaced with live keys
- [ ] Webhook endpoint configured in Stripe dashboard
- [ ] Email service tested with production credentials
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Monitoring set up for donation flow
- [ ] Documentation is complete and up-to-date

## Test Scenarios

### Scenario 1: One-Time Donation from Get Involved Section
1. Navigate to homepage
2. Scroll to Get Involved section
3. Select GHS 150
4. Select "Education & Creative Labs" focus
5. Enter email address
6. Click "Donate GHS 150 with Stripe"
7. Verify redirect to checkout with correct parameters
8. Enter name and optional message
9. Click "Continue to Stripe Payment"
10. Enter test card: 4242 4242 4242 4242
11. Complete payment
12. Verify success page displays
13. Check email for receipt
14. Verify database record

### Scenario 2: Monthly Donation from Donate Page
1. Navigate to /donate
2. Click "Monthly Recurring" tab
3. Select GHS 500
4. Click "Start Monthly Donation"
5. Verify redirect to checkout
6. Enter donor information
7. Complete payment with test card
8. Verify success page shows "monthly recurring"
9. Check email receipt
10. Verify database record has frequency='monthly'

### Scenario 3: Custom Amount Anonymous Donation
1. Navigate to Get Involved section
2. Click "Custom" amount
3. Enter 1000
4. Enter email
5. Click donate
6. Check "Make this donation anonymous"
7. Complete payment
8. Verify email shows "Anonymous Donor"
9. Verify database has anonymous=true

### Scenario 4: Payment Failure
1. Start donation flow
2. Use decline test card: 4000 0000 0000 0002
3. Verify error message displays
4. Verify user can retry
5. Verify donation status remains 'processing' or 'failed'

### Scenario 5: Validation Errors
1. Try to submit with amount = 0
2. Verify error message
3. Try to submit with invalid email
4. Verify error message
5. Try to submit without name
6. Verify error message

## Notes

- Use Stripe test cards for testing: https://stripe.com/docs/testing
- Success card: 4242 4242 4242 4242
- Decline card: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC
- Test in Stripe test mode before switching to live mode
- Monitor Stripe dashboard for test payments
- Check email spam folder if receipts don't arrive

## Sign-Off

- [ ] All checklist items verified
- [ ] Test donations completed successfully
- [ ] Email receipts received
- [ ] Database records confirmed
- [ ] Ready for production deployment

**Verified By:** _________________
**Date:** _________________
**Notes:** _________________
