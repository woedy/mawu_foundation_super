# Stripe Webhook Setup Guide

## Overview

This guide explains how to configure and test Stripe webhooks for the Mawu Foundation platform. Webhooks are essential for receiving real-time notifications about payment events and automatically updating order and donation statuses.

## Webhook Implementation

### Endpoint Configuration

**Webhook URL:** `https://your-domain.com/api/webhooks/stripe`

The webhook endpoint is implemented in `server/routes.ts` and handles the following events:

- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment was canceled
- `charge.refunded` - Payment was refunded

### Security Features

✅ **Signature Verification**: All webhook requests are verified using Stripe's signature verification
✅ **Raw Body Parsing**: Uses `express.raw()` middleware to preserve request body for signature verification
✅ **Secret Validation**: Requires `STRIPE_WEBHOOK_SECRET` environment variable
✅ **Error Handling**: Proper error responses with retry mechanism (500 status for processing errors)
✅ **Logging**: Comprehensive logging for debugging and monitoring

## Setup Instructions

### 1. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### 2. Set Up Webhook in Stripe Dashboard

#### For Test Mode:

1. Go to [Stripe Dashboard - Webhooks (Test Mode)](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - Local development: Use Stripe CLI (see below)
   - Staging/Production: `https://your-domain.com/api/webhooks/stripe`
4. Select the following events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

#### For Production:

1. Go to [Stripe Dashboard - Webhooks (Live Mode)](https://dashboard.stripe.com/webhooks)
2. Follow the same steps as test mode
3. Use your production domain URL
4. Use live mode API keys (`sk_live_...` and `pk_live_...`)

### 3. Local Development with Stripe CLI

For local testing, use the Stripe CLI to forward webhook events:

#### Install Stripe CLI:

**Windows:**
```bash
scoop install stripe
```

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download from https://github.com/stripe/stripe-cli/releases
```

#### Forward Webhooks Locally:

```bash
# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe

# The CLI will output a webhook signing secret (whsec_...)
# Add this to your .env file as STRIPE_WEBHOOK_SECRET
```

#### Trigger Test Events:

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test failed payment
stripe trigger payment_intent.payment_failed

# Test canceled payment
stripe trigger payment_intent.canceled

# Test refund
stripe trigger charge.refunded
```

## Testing Webhooks

### Automated Test Script

Run the webhook integration test:

```bash
npm run test:webhook
```

This script will:
- ✅ Verify environment configuration
- ✅ Check Stripe API connectivity
- ✅ List configured webhook endpoints
- ✅ Validate event handler coverage
- ✅ Verify security implementation
- ✅ Provide setup instructions

### Manual Testing

1. **Start your server:**
   ```bash
   npm run dev:server
   ```

2. **In another terminal, start Stripe CLI:**
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

3. **Trigger test events:**
   ```bash
   stripe trigger payment_intent.succeeded
   ```

4. **Check server logs** for webhook processing messages

### Testing with Real Payments

1. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

2. Complete a test purchase or donation on your site

3. Monitor webhook events in Stripe Dashboard:
   - Go to **Developers → Webhooks**
   - Click on your endpoint
   - View **Recent events** tab

## Webhook Event Handling

### payment_intent.succeeded

**Triggers when:** Payment is successfully completed

**Actions:**
- Updates order/donation status to `completed`
- Sends confirmation email to customer/donor
- Sends admin notification email
- Updates payment intent ID in database

**Metadata Required:**
- `orderId` or `donationId`
- `customerEmail` or `donorEmail`
- `customerName` or `donorName`

### payment_intent.payment_failed

**Triggers when:** Payment fails

**Actions:**
- Updates order status to `cancelled`
- Updates donation status to `failed`
- Logs failure reason

### payment_intent.canceled

**Triggers when:** Payment is canceled

**Actions:**
- Updates order status to `cancelled`
- Updates donation status to `failed`

### charge.refunded

**Triggers when:** Payment is refunded

**Actions:**
- Finds order/donation by payment intent ID
- Updates order status to `cancelled`
- Updates donation status to `failed`

## Monitoring and Debugging

### Check Webhook Logs

**In Stripe Dashboard:**
1. Go to **Developers → Webhooks**
2. Click on your endpoint
3. View **Recent events** tab
4. Click on individual events to see:
   - Request body
   - Response status
   - Retry attempts
   - Error messages

**In Your Server Logs:**
Look for messages prefixed with `[Webhook]`:
```
[Webhook] Received event: payment_intent.succeeded (ID: evt_...)
[Webhook] Processing payment_intent.succeeded: pi_...
[Webhook] Updating order 123 to completed
[Webhook] Successfully sent order emails for MF-00000123
```

### Common Issues

#### 1. Signature Verification Failed

**Error:** `Webhook signature verification failed`

**Solutions:**
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure webhook endpoint uses `express.raw()` middleware
- Check that the secret matches your Stripe dashboard endpoint

#### 2. Webhook Secret Not Configured

**Error:** `Webhook secret not configured`

**Solution:**
- Add `STRIPE_WEBHOOK_SECRET` to your `.env` file
- Restart your server

#### 3. Order/Donation Not Found

**Error:** `Order not found: 123`

**Solutions:**
- Verify the order/donation was created before payment
- Check that metadata is correctly passed to Stripe
- Ensure database connection is working

#### 4. Email Sending Failed

**Error:** `Failed to send order emails`

**Note:** This is logged but doesn't fail the webhook
**Solutions:**
- Check email service configuration
- Verify `EMAIL_USER` and `EMAIL_PASS` are set
- Test email service separately with `npm run test:email`

## Production Checklist

Before going live, ensure:

- [ ] Production webhook endpoint is configured in Stripe Dashboard (live mode)
- [ ] `STRIPE_WEBHOOK_SECRET` is set with live mode secret
- [ ] `STRIPE_SECRET_KEY` uses live mode key (`sk_live_...`)
- [ ] Server is accessible from Stripe's webhook servers
- [ ] HTTPS is enabled (required for production webhooks)
- [ ] Webhook endpoint returns 200 status for successful processing
- [ ] Error handling is tested and working
- [ ] Email notifications are configured and tested
- [ ] Database is properly configured for production
- [ ] Monitoring/logging is set up to track webhook events

## Webhook Retry Behavior

Stripe automatically retries failed webhooks:

- **Retry Schedule:** Exponential backoff over 3 days
- **Success Criteria:** HTTP 2xx response
- **Failure Criteria:** HTTP 4xx/5xx response or timeout

**Best Practices:**
- Return 200 status as quickly as possible
- Process webhooks asynchronously if needed
- Use idempotency to handle duplicate events
- Log all webhook events for debugging

## Security Best Practices

1. **Always verify webhook signatures** - Never trust webhook data without verification
2. **Use HTTPS in production** - Stripe requires HTTPS for production webhooks
3. **Keep webhook secret secure** - Never commit secrets to version control
4. **Validate metadata** - Verify order/donation IDs exist before processing
5. **Handle errors gracefully** - Return appropriate status codes for retry behavior
6. **Log security events** - Monitor for suspicious webhook activity
7. **Rate limiting** - Consider implementing rate limiting for webhook endpoint

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
