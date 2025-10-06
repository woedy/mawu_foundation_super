# Donation Processing Implementation

## Overview

The donation processing system has been fully implemented with Stripe integration, email receipts via Gmail SMTP, and comprehensive validation.

## Features Implemented

### 1. Donation Form (GetInvolvedSection)
- **Location**: `apps/web/src/sections/GetInvolvedSection.tsx`
- **Features**:
  - Preset donation amounts (GHS 50, 150, 300, 500)
  - Custom amount input
  - Donation frequency selection (one-time, monthly)
  - Focus area selection (Education, Health, Water, Economic Empowerment, Community Resilience)
  - Email collection for receipts
  - Form validation
  - Redirects to checkout page with parameters

### 2. Enhanced Donate Page
- **Location**: `apps/web/src/pages/EnhancedDonatePage.tsx`
- **Features**:
  - Donation type tabs (one-time vs monthly)
  - Preset donation tiers with impact statements
  - Custom amount input
  - Impact preview based on selected amount
  - Redirects to checkout with donation details

### 3. Donation Checkout Page
- **Location**: `apps/web/src/pages/DonationCheckoutPage.tsx`
- **Features**:
  - Two-step checkout process:
    1. **Personal Information**: Collect donor name, email, optional message, anonymous option
    2. **Payment**: Stripe Elements integration for secure payment
  - Pre-fills email if provided from previous page
  - Displays focus area if selected
  - Shows inactive payment methods (Mobile Money, Crypto, Bank Transfer, PayPal) as "Coming Soon"
  - Comprehensive validation:
    - Amount validation
    - Email format validation
    - Name validation
  - Error handling with user-friendly messages
  - Creates payment intent via API
  - Processes payment through Stripe

### 4. Donation Success Page
- **Location**: `apps/web/src/pages/DonationSuccessPage.tsx`
- **Features**:
  - Success confirmation with checkmark icon
  - Displays donation amount and type
  - Shows transaction ID
  - Explains next steps (email receipt, impact reports)
  - Links to homepage and programs page

### 5. Backend API
- **Location**: `server/routes.ts`
- **Endpoint**: `POST /api/donations/create-payment-intent`
- **Features**:
  - Validates all input fields:
    - Amount (must be positive number)
    - Email (must be valid format)
    - Donor name (required)
    - Frequency (one-time, monthly, quarterly, annually)
    - Currency (GHS, USD, EUR, GBP)
  - Creates donation record in database
  - Creates Stripe payment intent
  - Updates donation status to 'processing'
  - Returns client secret for Stripe Elements

### 6. Webhook Handler
- **Location**: `server/routes.ts`
- **Endpoint**: `POST /api/webhooks/stripe`
- **Features**:
  - Verifies Stripe webhook signature
  - Handles `payment_intent.succeeded` events
  - Updates donation status to 'completed'
  - Sends donation receipt email via Gmail SMTP
  - Includes donor information, amount, transaction ID

### 7. Email Service
- **Location**: `server/email-service.ts`
- **Features**:
  - Sends donation receipt emails
  - Professional HTML email template
  - Includes:
    - Donor name (or "Anonymous Donor")
    - Donation amount and currency
    - Transaction ID
    - Donation date
    - Optional message from donor
    - Foundation contact information
    - Tax receipt information

### 8. Database Schema
- **Location**: `shared/schema.ts`
- **Table**: `donations`
- **Fields**:
  - `id`: Serial primary key
  - `donorEmail`: Text, required
  - `donorName`: Text, required
  - `amount`: Decimal(10,2), required
  - `currency`: Text, default 'USD'
  - `frequency`: Text, default 'one-time'
  - `message`: Text, optional
  - `anonymous`: Boolean, default false
  - `stripePaymentIntentId`: Text, optional
  - `status`: Text, default 'pending' (pending, processing, completed, failed)
  - `createdAt`: Timestamp, auto-generated

## User Flow

1. **Donation Selection**:
   - User visits Get Involved section or Donate page
   - Selects donation amount (preset or custom)
   - Chooses frequency (one-time or monthly)
   - Optionally selects focus area
   - Enters email for receipt
   - Clicks "Donate with Stripe"

2. **Checkout**:
   - Redirected to `/donate/checkout` with parameters
   - Enters personal information (name, email, optional message)
   - Can choose to make donation anonymous
   - Clicks "Continue to Stripe Payment"
   - API creates donation record and payment intent
   - Stripe Elements form appears for payment details

3. **Payment**:
   - User enters card information in Stripe Elements
   - Clicks "Complete Donation"
   - Stripe processes payment securely
   - On success, redirected to success page

4. **Confirmation**:
   - Success page displays confirmation
   - Stripe webhook triggers
   - Backend updates donation status
   - Email receipt sent to donor
   - User sees next steps and impact information

## Validation & Error Handling

### Frontend Validation
- Amount must be positive number
- Email must be valid format
- Name fields required
- Clear error messages displayed to user

### Backend Validation
- Amount validation (positive, numeric)
- Email format validation
- Name presence validation
- Frequency validation (allowed values)
- Currency validation (supported currencies)
- Returns 400 status with descriptive error messages

### Payment Error Handling
- Stripe payment errors caught and displayed
- Network errors handled gracefully
- Retry mechanisms available
- User-friendly error messages

## Currency Support

Currently supported currencies:
- **GHS** (Ghanaian Cedi) - Default
- **USD** (US Dollar)
- **EUR** (Euro)
- **GBP** (British Pound)

## Payment Methods

### Active
- **Stripe**: Credit/debit cards, Apple Pay, Google Pay

### Coming Soon (Displayed as Inactive)
- Mobile Money
- Cryptocurrency
- Bank Transfer
- PayPal

## Email Receipts

Donation receipts are sent via Gmail SMTP and include:
- Professional HTML formatting
- Donor name (or "Anonymous Donor" if anonymous)
- Donation amount and currency
- Transaction ID for records
- Donation date
- Optional donor message
- Foundation contact information
- Tax receipt information

## Testing

### Test Donation Flow
1. Set up environment variables:
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Navigate to donation page:
   - Visit `/` and scroll to Get Involved section
   - Or visit `/donate` directly

4. Test with Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date and any CVC

5. Verify:
   - Donation record created in database
   - Payment intent created in Stripe dashboard
   - Email receipt sent (check inbox)
   - Success page displays correctly

### Webhook Testing
1. Install Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. Copy webhook signing secret to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. Trigger test payment:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

4. Verify:
   - Donation status updated to 'completed'
   - Email receipt sent

## Admin Management

Admins can view all donations via:
- **Endpoint**: `GET /api/admin/donations`
- **Authentication**: Required (session-based)
- **Returns**: List of all donations with full details

## Security Considerations

1. **PCI Compliance**: Stripe handles all card data, never touches our servers
2. **Webhook Verification**: All webhooks verified with signature
3. **Input Validation**: All user inputs validated and sanitized
4. **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
5. **Email Security**: App-specific passwords for Gmail SMTP
6. **Session Security**: Secure session configuration for admin access

## Future Enhancements

1. **Recurring Donations**: Implement Stripe subscriptions for monthly/recurring donations
2. **Additional Payment Methods**: Integrate Mobile Money, Crypto, Bank Transfer, PayPal
3. **Donation Campaigns**: Create specific campaigns with goals and progress tracking
4. **Donor Portal**: Allow donors to view donation history and manage recurring donations
5. **Impact Tracking**: Show donors specific impact of their contributions
6. **Tax Receipts**: Generate official tax-deductible receipts with foundation tax ID
7. **Multi-currency**: Automatic currency conversion based on donor location
8. **Donation Matching**: Corporate matching gift programs

## Related Files

- Frontend:
  - `apps/web/src/sections/GetInvolvedSection.tsx`
  - `apps/web/src/pages/EnhancedDonatePage.tsx`
  - `apps/web/src/pages/DonationCheckoutPage.tsx`
  - `apps/web/src/pages/DonationSuccessPage.tsx`

- Backend:
  - `server/routes.ts`
  - `server/storage.ts`
  - `server/email-service.ts`

- Schema:
  - `shared/schema.ts`

- Configuration:
  - `.env.example`
  - `package.json`
