# Payment Service

This service handles payment processing for the Mawu Foundation platform using Stripe.

## Features

- Create payment intents for one-time donations and commerce checkouts.
- Persist transaction status updates as Stripe webhooks are received (stored in `apps/api/data/payment-ledger.json`).
- Expose an API-only payment method catalogue with inactive placeholders for future providers.
- Centralised logging for all payment-related activities via Pino.

## Environment Variables

- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_test_` for test mode).
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret (starts with `whsec_`).

## API Endpoints

All endpoints are mounted from the API server under the `/api/payments` prefix.

### Create Payment Intent

```http
POST /api/payments/intent
```

**Request Body**

```json
{
  "amount": 150.5,
  "currency": "GHS",
  "customerEmail": "donor@example.com",
  "description": "Donation to Mawu Foundation",
  "metadata": {
    "programId": "volta-water",
    "donationType": "monthly"
  },
  "paymentMethodTypes": ["card"]
}
```

`amount` is specified in major currency units (e.g. 150.50 Ghanaian Cedi) and is converted to the smallest units internally before sending to Stripe.

**Response**

```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_123_secret_456",
    "id": "pi_123",
    "status": "requires_payment_method"
  }
}
```

If Stripe is not configured, the API responds with HTTP 503 and an explanatory error.

### Handle Webhook Events

```http
POST /api/payments/webhook
```

This endpoint verifies the Stripe signature and records the latest payment intent status in the ledger. The service currently reacts to:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Additional events are logged but ignored.

### Retrieve Payment Methods

```http
GET /api/payments/methods
```

Returns static metadata describing available payment methods. Only Stripe card payments are active at launch; other providers are marked as inactive.

## Data Ledger

Stripe webhook receipts are written to `apps/api/data/payment-ledger.json`. The file is created automatically the first time a webhook is processed and contains a history of each payment intent (status transitions, metadata, and timestamps). This helps investor demos showcase near-real-time transaction state without a full database.

## Testing

1. Set up a Stripe test account at <https://dashboard.stripe.com/test/dashboard>.
2. Create a `.env.local` (or `.env`) file with:
   ```
   STRIPE_SECRET_KEY=sk_test_your_test_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```
3. Run the API locally:
   ```bash
   npm run dev --workspace @mawu/api
   ```
4. Use the Stripe CLI to forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```
5. Trigger payment intents with the Stripe CLI or dashboard and confirm that `apps/api/data/payment-ledger.json` updates with each event.

