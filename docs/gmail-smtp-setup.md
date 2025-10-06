# Gmail SMTP Setup Guide

This guide explains how to configure Gmail SMTP for the Mawu Foundation email service.

## Prerequisites

- A Gmail account (preferably a dedicated account for the foundation)
- Two-factor authentication enabled on the Gmail account

## Setup Steps

### 1. Enable Two-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2FA if not already enabled

### 2. Generate App-Specific Password

1. In your Google Account security settings, find "App passwords"
2. Click on "App passwords" (you may need to sign in again)
3. Select "Mail" as the app and "Other (custom name)" as the device
4. Enter "Mawu Foundation Website" as the custom name
5. Click "Generate"
6. Copy the 16-character password that appears (this is your EMAIL_PASS)

### 3. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Email (Gmail SMTP)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
TEST_EMAIL=your-test-email@example.com  # Optional, for testing
```

**Important Notes:**
- Use the full Gmail address for EMAIL_USER
- Use the 16-character app password (not your regular Gmail password) for EMAIL_PASS
- Never commit these credentials to version control

### 4. Test the Configuration

Run the email service test:

```bash
npm run test:email
```

This will:
1. Test the SMTP connection
2. Send a test order confirmation email (if TEST_EMAIL is set)
3. Send a test donation receipt email (if TEST_EMAIL is set)

## Production Setup

For production, use a dedicated Gmail account for the foundation:

1. Create a new Gmail account: `foundation@mawufoundation.org` (or similar)
2. Enable 2FA on this account
3. Generate an app-specific password
4. Update your production environment variables

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Ensure 2FA is enabled on the Gmail account
   - Verify you're using the app-specific password, not the regular password
   - Check that the EMAIL_USER is the complete Gmail address

2. **"Less secure app access" error**
   - This shouldn't occur with app-specific passwords
   - If it does, ensure you're using the correct app password

3. **Connection timeout**
   - Check your internet connection
   - Verify firewall settings allow SMTP traffic on port 587
   - Try using port 465 with secure: true in the configuration

### Testing Individual Components

You can test the email service programmatically:

```typescript
import { emailService } from './server/email-service.js';

// Test connection
const isConnected = await emailService.testConnection();
console.log('Connected:', isConnected);

// Send test order confirmation
await emailService.sendOrderConfirmation({
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  orderNumber: 'TEST-001',
  // ... other required fields
});
```

## Security Best Practices

1. **Use a dedicated Gmail account** for the foundation's email service
2. **Rotate app passwords regularly** (every 6-12 months)
3. **Monitor email sending** for unusual activity
4. **Use environment variables** to store credentials securely
5. **Enable email notifications** for the Gmail account to monitor access

## Email Templates

The service includes two main email templates:

### Order Confirmation
- Professional HTML and text versions
- Includes order details, items with variations, and shipping address
- Branded with Mawu Foundation styling

### Donation Receipt
- Tax receipt information included
- Impact messaging highlighting foundation work
- Support for anonymous donations
- Transaction details for record keeping

Both templates are responsive and include fallback text versions for email clients that don't support HTML.