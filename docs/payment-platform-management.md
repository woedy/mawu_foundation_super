# Payment Platform Management Implementation

## Overview

This document describes the implementation of payment platform management for the Mawu Foundation platform. The system ensures that Stripe is the only active payment processor while displaying other payment platforms as "coming soon" to users.

## Requirements Addressed

- **Requirement 2.6**: Display other payment platforms as inactive/coming soon
- **Requirement 7.1**: Process all transactions through Stripe integration
- **Requirement 7.6**: Provide clear error messages and payment validation

## Implementation Details

### 1. Donation Page Payment Methods

**Location**: `apps/web/src/pages/DonationCheckoutPage.tsx`

The donation checkout page displays Stripe as the active payment method with other platforms shown as disabled buttons:

```typescript
<Button type="submit" variant="primary" size="lg" className="w-full">
  Continue to Stripe Payment
</Button>
<button type="button" disabled className="...">
  Pay with Mobile Money (Coming Soon)
</button>
<button type="button" disabled className="...">
  Pay with Crypto (Coming Soon)
</button>
<button type="button" disabled className="...">
  Pay with Bank Transfer (Coming Soon)
</button>
<button type="button" disabled className="...">
  Pay with PayPal (Coming Soon)
</button>
```

**Features**:
- Only Stripe button is enabled and functional
- Other payment methods are visually disabled with "Coming Soon" labels
- Clear messaging: "Stripe is the only active processor today. Additional channels will unlock once compliance reviews are complete."

### 2. Get Involved Section

**Location**: `apps/web/src/sections/GetInvolvedSection.tsx`

The donation form in the Get Involved section shows:

```typescript
<Button disabled={donationStatus.state === 'loading'} size="lg" type="submit">
  Donate {donationAmountDisplay} with Stripe
</Button>
<Button disabled size="lg" variant="ghost">
  Coming soon: Crypto · PayPal · Bank Transfer · Mobile Money
</Button>
```

**Features**:
- Primary Stripe donation button
- Disabled button showing upcoming payment methods
- Informational text about Stripe being the only active processor

### 3. Shop Checkout Payment Methods

**Location**: `apps/web/src/sections/MerchShopSection.tsx`

The shop checkout uses a payment method selection interface:

```typescript
{catalog.paymentMethods.map((method) => (
  <label key={method.id} className={...}>
    <input
      type="radio"
      name="payment-method"
      value={method.id}
      checked={paymentMethod === method.id}
      disabled={method.status !== 'active'}
      onChange={() => method.status === 'active' && setPaymentMethod(method.id)}
    />
    <div>
      <span>{method.label}</span>
      <Body>{method.description}</Body>
      {method.status !== 'active' && (
        <span>Coming soon</span>
      )}
    </div>
  </label>
))}
```

**Payment Methods Configuration**:
```typescript
paymentMethods: [
  {
    id: 'stripe',
    label: 'Stripe',
    description: 'Credit card, debit card, or mobile wallet via Stripe',
    status: 'active'
  },
  {
    id: 'momo',
    label: 'Mobile Money',
    description: 'MTN, Vodafone, AirtelTigo',
    status: 'coming_soon'
  },
  {
    id: 'crypto',
    label: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, stablecoins',
    status: 'coming_soon'
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    description: 'Direct bank transfer (Ghana)',
    status: 'coming_soon'
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'PayPal balance or linked accounts',
    status: 'coming_soon'
  }
]
```

### 4. Shop Checkout Page

**Location**: `apps/web/src/pages/ShopCheckoutPage.tsx`

The dedicated shop checkout page uses Stripe Elements for payment processing:

```typescript
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm />
</Elements>
```

**Features**:
- Direct Stripe integration with PaymentElement
- No alternative payment method selection (Stripe only)
- Secure payment processing with Stripe's PCI-compliant components

### 5. Backend Payment Validation

**Location**: `server/routes.ts`

#### Donation Payment Intent Creation

```typescript
app.post('/api/donations/create-payment-intent', async (req, res) => {
  // Validate Stripe configuration
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  // Validate amount
  if (!amount || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid donation amount' });
  }

  // Validate email
  if (!donorEmail || !donorEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  // Validate donor name
  if (!donorName || donorName.trim().length === 0) {
    return res.status(400).json({ error: 'Donor name is required' });
  }

  // Validate frequency
  const validFrequencies = ['one-time', 'monthly', 'quarterly', 'annually'];
  if (!validFrequencies.includes(donationFrequency)) {
    return res.status(400).json({ error: 'Invalid donation frequency' });
  }

  // Validate currency
  const validCurrencies = ['GHS', 'USD', 'EUR', 'GBP'];
  if (!validCurrencies.includes(donationCurrency)) {
    return res.status(400).json({ error: 'Invalid currency' });
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(donationAmount * 100),
    currency: donationCurrency.toLowerCase(),
    metadata: { donationId, donorEmail, donorName },
    description: `Donation to Mawu Foundation - ${donationFrequency}`,
  });
});
```

#### Order Payment Intent Creation

```typescript
app.post('/api/orders/create-payment-intent', async (req, res) => {
  // Validate Stripe configuration
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  // Validate amount
  if (!totalAmount || parseFloat(totalAmount) <= 0) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }

  // Validate order items and variations
  await storage.validateOrderItems(items);

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(parseFloat(totalAmount) * 100),
    currency: currency?.toLowerCase() || 'ghs',
    metadata: { orderId, customerEmail, customerName },
    description: `Order #MF-${order.id.toString().padStart(8, '0')}`,
  });
});
```

## Error Handling

### Frontend Error Handling

1. **Payment Form Validation**:
   - Email format validation
   - Amount validation (positive numbers only)
   - Required field validation
   - Real-time error messages

2. **Payment Processing Errors**:
   - Stripe API errors are caught and displayed to users
   - Network errors trigger retry mechanisms
   - Clear, user-friendly error messages

3. **Example Error Display**:
```typescript
{error && (
  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
    {error}
  </div>
)}
```

### Backend Error Handling

1. **Validation Errors** (400 status):
   - Invalid amounts
   - Invalid email addresses
   - Missing required fields
   - Invalid currencies or frequencies

2. **Configuration Errors** (500 status):
   - Stripe not configured
   - Missing API keys

3. **Payment Processing Errors**:
   - Stripe API failures
   - Database errors
   - Transaction rollbacks

## Testing

### Manual Testing Checklist

- [ ] Donation page shows Stripe as active, others as "coming soon"
- [ ] Shop checkout only allows Stripe payment selection
- [ ] Invalid donation amounts are rejected with clear error messages
- [ ] Invalid email addresses are rejected
- [ ] Missing required fields show validation errors
- [ ] Successful payments redirect to confirmation pages
- [ ] Failed payments show appropriate error messages
- [ ] Payment intents are created with correct metadata

### Automated Testing

Run the payment platform test suite:

```bash
npm run test:payment-platforms
```

This tests:
- Stripe configuration validation
- Donation payment intent creation
- Order payment intent creation
- Input validation and error handling
- Payment method restrictions

## Configuration

### Environment Variables

Required for payment processing:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...           # Stripe secret key
VITE_STRIPE_PUBLIC_KEY=pk_test_...      # Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...         # Stripe webhook secret (optional for dev)
```

### Payment Method Status

To add or modify payment methods, update the configuration in:
- `apps/web/src/data/shop-fallback.ts` (for shop)
- Component-level configurations (for donation pages)

Status values:
- `active`: Payment method is enabled and functional
- `coming_soon`: Payment method is displayed but disabled
- `inactive`: Payment method is hidden

## Future Enhancements

When adding new payment platforms:

1. **Update Configuration**:
   - Add new payment method to configuration with `status: 'active'`
   - Update payment method descriptions

2. **Backend Integration**:
   - Add new payment provider SDK
   - Create payment intent endpoints for new provider
   - Implement webhook handlers

3. **Frontend Integration**:
   - Add payment provider's UI components
   - Update payment flow logic
   - Add provider-specific validation

4. **Testing**:
   - Add test cases for new payment provider
   - Test payment flows end-to-end
   - Verify webhook processing

## Security Considerations

1. **PCI Compliance**:
   - All payment data is handled by Stripe
   - No credit card information is stored on our servers
   - Stripe Elements provide PCI-compliant payment forms

2. **Webhook Verification**:
   - All Stripe webhooks are verified using signature validation
   - Prevents unauthorized payment status updates

3. **Input Validation**:
   - All payment amounts are validated server-side
   - Email addresses are validated
   - Currency codes are restricted to allowed values

4. **Error Messages**:
   - Error messages don't expose sensitive system information
   - User-friendly messages guide users to resolution

## Support and Troubleshooting

### Common Issues

1. **"Stripe is not configured" error**:
   - Verify `STRIPE_SECRET_KEY` is set in environment variables
   - Check that the key starts with `sk_test_` or `sk_live_`

2. **Payment intent creation fails**:
   - Check Stripe dashboard for API errors
   - Verify amount is a positive number
   - Ensure currency code is valid

3. **Webhook not processing**:
   - Verify `STRIPE_WEBHOOK_SECRET` is configured
   - Check webhook signature validation
   - Review Stripe webhook logs in dashboard

### Contact

For payment-related issues:
- Email: support@mawufoundation.org
- Stripe Dashboard: https://dashboard.stripe.com

## Compliance Notes

- Stripe handles PCI DSS compliance for payment processing
- Additional payment platforms will be added after compliance reviews
- All payment data is encrypted in transit and at rest
- Transaction records are maintained for audit purposes
