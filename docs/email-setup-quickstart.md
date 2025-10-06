# Email Notification System - Quick Start Guide

## Overview

This guide will help you quickly set up the email notification system for the Mawu Foundation platform.

## Prerequisites

- Gmail account with 2-Factor Authentication enabled
- Access to server environment variables

## Setup Steps

### 1. Enable Gmail SMTP Access

1. **Enable 2-Factor Authentication**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App-Specific Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Mawu Foundation"
   - Click "Generate"
   - Copy the 16-character password (you won't see it again!)

### 2. Configure Environment Variables

Add these variables to your `.env` file:

```bash
# Email Service (Gmail SMTP)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password

# Admin Email (receives notifications)
ADMIN_EMAIL=admin@mawufoundation.org

# Test Email (for testing)
TEST_EMAIL=your-test-email@example.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5000
```

**Important**: 
- Use the app-specific password, NOT your regular Gmail password
- Remove spaces from the app-specific password
- Keep these credentials secure and never commit them to version control

### 3. Test Email Configuration

Run the test script to verify everything works:

```bash
npm run test:email-notifications
```

Expected output:
```
✅ Email service connection successful
✅ Order confirmation email sent successfully
✅ Donation receipt email sent successfully
✅ Order status update email sent successfully
✅ Admin order notification email sent successfully
✅ Admin donation notification email sent successfully
✅ Test email sent successfully
```

### 4. Check Your Inbox

Check the email addresses you configured:
- `TEST_EMAIL` should receive all test emails
- `ADMIN_EMAIL` should receive admin notifications
- Check spam folder if emails are missing

## Quick Troubleshooting

### Connection Failed

**Error**: `Connection closed` or `Connection timeout`

**Solutions**:
1. Verify 2FA is enabled on Gmail account
2. Generate a new app-specific password
3. Check `EMAIL_USER` is correct Gmail address
4. Ensure `EMAIL_PASS` has no spaces
5. Check firewall/network allows SMTP on port 587

### Authentication Failed

**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solutions**:
1. Generate a new app-specific password
2. Verify you're using app-specific password, not regular password
3. Check for typos in `EMAIL_USER` and `EMAIL_PASS`
4. Ensure 2FA is enabled on the Gmail account

### Emails Going to Spam

**Solutions**:
1. Add sender to contacts
2. Mark test emails as "Not Spam"
3. Use an established Gmail account (not brand new)
4. Consider setting up SPF/DKIM records for production

## Production Setup

For production deployment:

1. **Use Foundation Email**:
   ```bash
   EMAIL_USER=foundation@mawufoundation.org
   EMAIL_PASS=production-app-specific-password
   ```

2. **Set Production URLs**:
   ```bash
   FRONTEND_URL=https://mawufoundation.org
   ```

3. **Configure Admin Email**:
   ```bash
   ADMIN_EMAIL=admin@mawufoundation.org
   ```

4. **Test in Staging First**:
   - Deploy to staging environment
   - Run test script
   - Verify all email types
   - Check spam folder behavior

5. **Monitor in Production**:
   - Check server logs for email errors
   - Set up alerts for email failures
   - Monitor delivery rates

## Email Types

The system sends these email types automatically:

### 1. Order Confirmation
- **Trigger**: Order payment succeeds
- **Recipient**: Customer email
- **Content**: Order details, items, shipping address

### 2. Donation Receipt
- **Trigger**: Donation payment succeeds
- **Recipient**: Donor email
- **Content**: Donation amount, tax receipt info

### 3. Order Status Update
- **Trigger**: Admin updates order status
- **Recipient**: Customer email
- **Content**: Status change, tracking info

### 4. Admin Notifications
- **Trigger**: New order or donation
- **Recipient**: Admin email
- **Content**: Order/donation summary, dashboard link

## Testing Individual Email Types

### Test via Admin Dashboard

1. Log in to admin dashboard
2. Navigate to Settings or Email section
3. Click "Send Test Email"
4. Enter test email address
5. Click "Send"

### Test via API

```bash
# Requires admin authentication
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{"email": "test@example.com"}'
```

### Test via Webhook

1. Create a test order or donation
2. Complete payment with Stripe test card
3. Check customer/donor email for confirmation
4. Check admin email for notification

## Support

For detailed documentation, see:
- [Email Notification System Documentation](./email-notification-system.md)
- [Gmail SMTP Setup Guide](./gmail-smtp-setup.md)
- [Production Deployment Guide](./production-deployment.md)

## Common Questions

**Q: Can I use a different email provider?**  
A: Yes, but you'll need to modify `server/email-service.ts` with the new SMTP settings.

**Q: How many emails can I send?**  
A: Gmail has sending limits (500/day for free accounts, 2000/day for Google Workspace). For high volume, consider SendGrid or AWS SES.

**Q: Are emails sent synchronously?**  
A: Yes, but with retry logic. Email failures don't block order/donation processing.

**Q: Can I customize email templates?**  
A: Yes, edit the template generators in `server/email-service.ts`.

**Q: How do I test without sending real emails?**  
A: Use a test email service like Mailtrap or Ethereal Email for development.

---

**Need Help?** Check the full documentation or contact the development team.
