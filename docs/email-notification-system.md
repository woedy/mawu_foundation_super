# Email Notification System

## Overview

The Mawu Foundation platform includes a comprehensive email notification system that sends automated emails for orders, donations, status updates, and admin notifications. The system uses Gmail SMTP with nodemailer and includes retry logic, error handling, and professional email templates.

## Features

### 1. Order Confirmation Emails
- Sent automatically when an order payment is completed
- Includes order details, items with variations, pricing, and shipping address
- Professional branded template with Mawu Foundation styling
- Sent to customer email address

### 2. Donation Receipt Emails
- Sent automatically when a donation payment is completed
- Includes donation amount, transaction ID, and tax receipt information
- Supports anonymous donations
- Includes optional donor message
- Sent to donor email address

### 3. Order Status Update Emails
- Sent when admin updates order status
- Supports statuses: processing, shipped, delivered, cancelled
- Includes tracking number and estimated delivery (when available)
- Only sent when status actually changes
- Sent to customer email address

### 4. Admin Notification Emails
- Sent to admin when new orders are placed
- Sent to admin when new donations are received
- Includes quick links to admin dashboard
- Sent to configured admin email address

## Configuration

### Environment Variables

Required environment variables in `.env`:

```bash
# Gmail SMTP Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-app-specific-password

# Admin Email (receives notifications)
ADMIN_EMAIL=admin@mawufoundation.org

# Test Email (for testing)
TEST_EMAIL=your-test-email@example.com

# Frontend URL (for email links)
FRONTEND_URL=https://mawufoundation.org
```

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App-Specific Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail" application
   - Use this password as `EMAIL_PASS`

3. **Configure Environment Variables**:
   - Set `EMAIL_USER` to your Gmail address
   - Set `EMAIL_PASS` to the app-specific password
   - Set `ADMIN_EMAIL` to receive admin notifications

For detailed setup instructions, see [Gmail SMTP Setup Guide](./gmail-smtp-setup.md).

## Email Templates

### Order Confirmation Template
- **Subject**: `Order Confirmation - {orderNumber}`
- **Content**:
  - Personalized greeting
  - Order number and date
  - Itemized list with variations
  - Total amount
  - Shipping address
  - Foundation branding and mission statement

### Donation Receipt Template
- **Subject**: `Donation Receipt - {amount} {currency}`
- **Content**:
  - Personalized greeting (or "Anonymous Donor")
  - Donation amount and date
  - Transaction ID for records
  - Tax receipt information
  - Impact statement
  - Optional donor message
  - Foundation contact information

### Order Status Update Template
- **Subject**: `Order Update - {orderNumber} ({status})`
- **Content**:
  - Personalized greeting
  - Order number
  - Status update message
  - Tracking number (if available)
  - Estimated delivery (if available)
  - Foundation contact information

### Admin Notification Templates
- **New Order Subject**: `New Order: {orderNumber} - {amount} {currency}`
- **New Donation Subject**: `New Donation: {amount} {currency} from {donorName}`
- **Content**:
  - Order/Donation details
  - Customer/Donor information
  - Amount and date
  - Link to admin dashboard

## Integration Points

### 1. Stripe Webhook Handler
Location: `server/routes.ts` - `/api/webhooks/stripe`

When `payment_intent.succeeded` event is received:
- **For Orders**:
  - Updates order status to 'completed'
  - Sends order confirmation to customer
  - Sends admin notification for new order
- **For Donations**:
  - Updates donation status to 'completed'
  - Sends donation receipt to donor
  - Sends admin notification for new donation

### 2. Admin Order Status Update
Location: `server/routes.ts` - `PUT /api/admin/orders/:id`

When admin updates order status:
- Checks if status actually changed
- Sends status update email for: processing, shipped, delivered, cancelled
- Includes tracking number and estimated delivery if provided
- Gracefully handles email failures without blocking status update

### 3. Test Email Endpoint
Location: `server/routes.ts` - `POST /api/admin/test-email`

Admin-only endpoint to test email configuration:
- Verifies email service connection
- Sends test email to specified address
- Returns success/failure status
- Useful for troubleshooting email setup

## Error Handling

### Retry Logic
- **Automatic Retries**: Up to 3 attempts for failed email sends
- **Exponential Backoff**: Delay increases with each retry (1s, 2s, 4s)
- **Error Logging**: All failures are logged to console
- **Graceful Degradation**: Email failures don't block order/donation processing

### Error Scenarios
1. **SMTP Connection Failure**: Retries with backoff, logs error
2. **Invalid Email Address**: Validation before sending
3. **Network Timeout**: Retries automatically
4. **Authentication Failure**: Logs error with details
5. **Rate Limiting**: Exponential backoff helps prevent

## Testing

### Manual Testing

Run the comprehensive test script:

```bash
npm run test:email-notifications
```

This will:
- Test SMTP connection
- Send sample order confirmation
- Send sample donation receipt
- Send sample status update
- Send admin notifications
- Send simple test email

### Test via Admin Dashboard

1. Log in to admin dashboard
2. Navigate to Settings or Email section
3. Use "Send Test Email" feature
4. Enter test email address
5. Verify email delivery

### Test via API

```bash
# Test email endpoint (requires admin authentication)
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Monitoring

### Email Delivery Logs

All email operations are logged to console:
- ✅ Successful sends: `Email sent successfully: {messageId}`
- ❌ Failed attempts: `Email send attempt {n} failed: {error}`
- 🔄 Retries: `Retrying email send in {ms}ms...`
- 📧 Specific emails: `Order confirmation sent to {email} for order {orderNumber}`

### Monitoring Checklist

- [ ] Check server logs for email errors
- [ ] Verify Gmail SMTP credentials are valid
- [ ] Ensure app-specific password hasn't expired
- [ ] Check spam folders for missing emails
- [ ] Verify `EMAIL_USER` and `ADMIN_EMAIL` are correct
- [ ] Test email delivery after deployment

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**:
   ```bash
   echo $EMAIL_USER
   echo $EMAIL_PASS
   ```

2. **Test SMTP Connection**:
   ```bash
   npm run test:email-notifications
   ```

3. **Check Gmail Settings**:
   - 2FA enabled?
   - App-specific password generated?
   - Less secure app access disabled (use app password instead)

4. **Check Server Logs**:
   - Look for authentication errors
   - Check for network timeouts
   - Verify email addresses are valid

### Emails Going to Spam

1. **SPF/DKIM Records**: Configure for your domain
2. **Sender Reputation**: Use established Gmail account
3. **Email Content**: Avoid spam trigger words
4. **Volume**: Don't send too many emails too quickly

### Common Errors

**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`
- **Solution**: Generate new app-specific password in Gmail

**Error**: `Connection timeout`
- **Solution**: Check network connectivity, firewall rules

**Error**: `Recipient address rejected`
- **Solution**: Verify email address format is valid

## Production Deployment

### Pre-Deployment Checklist

- [ ] Gmail SMTP credentials configured in production environment
- [ ] `ADMIN_EMAIL` set to receive notifications
- [ ] `FRONTEND_URL` set to production domain
- [ ] Test email delivery in staging environment
- [ ] Verify email templates render correctly
- [ ] Check spam folder behavior

### Environment Variables

Ensure these are set in production:

```bash
EMAIL_USER=foundation@mawufoundation.org
EMAIL_PASS=<app-specific-password>
ADMIN_EMAIL=admin@mawufoundation.org
FRONTEND_URL=https://mawufoundation.org
```

### Monitoring in Production

- Set up email delivery monitoring
- Track email send success/failure rates
- Monitor for authentication errors
- Set up alerts for email service failures

## API Reference

### EmailService Methods

#### `sendOrderConfirmation(data: OrderConfirmationData): Promise<void>`
Sends order confirmation email to customer.

#### `sendDonationReceipt(data: DonationReceiptData): Promise<void>`
Sends donation receipt email to donor.

#### `sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<void>`
Sends order status update email to customer.

#### `sendAdminNotification(data: AdminNotificationData): Promise<void>`
Sends notification email to admin.

#### `testConnection(): Promise<boolean>`
Tests SMTP connection and returns success status.

#### `sendTestEmail(recipientEmail: string): Promise<void>`
Sends a test email to verify configuration.

## Future Enhancements

Potential improvements for the email system:

1. **Email Templates**:
   - HTML email builder/editor
   - Customizable templates per email type
   - Multi-language support

2. **Advanced Features**:
   - Email scheduling
   - Bulk email sending
   - Email analytics and tracking
   - Unsubscribe management

3. **Alternative Providers**:
   - SendGrid integration
   - AWS SES integration
   - Mailgun integration
   - Resend integration (already partially configured)

4. **Enhanced Notifications**:
   - SMS notifications
   - Push notifications
   - Webhook notifications

## Related Documentation

- [Gmail SMTP Setup Guide](./gmail-smtp-setup.md)
- [Production Deployment Guide](./production-deployment.md)
- [Admin Dashboard Documentation](./admin-dashboard.md)
- [Stripe Integration Guide](./stripe-integration.md)

## Support

For issues with the email notification system:

1. Check this documentation
2. Review server logs
3. Test with the test script
4. Verify Gmail SMTP configuration
5. Contact development team if issues persist
