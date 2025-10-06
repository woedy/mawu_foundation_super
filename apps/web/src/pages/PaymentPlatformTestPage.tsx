/**
 * Payment Platform Management Test Page
 * 
 * This page demonstrates the payment platform management implementation
 * showing Stripe as the only active payment method with others as "coming soon"
 */

import { Body, Button, Card, CardContent, CardHeader, Heading, Section } from "../design-system";

const paymentPlatforms = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Credit cards, debit cards, Apple Pay, Google Pay',
    status: 'active',
    icon: '💳',
    features: [
      'Instant payment processing',
      'Secure PCI-compliant checkout',
      'Support for 135+ currencies',
      'Mobile wallet integration',
    ],
  },
  {
    id: 'mobile-money',
    name: 'Mobile Money',
    description: 'MTN MoMo, Vodafone Cash, AirtelTigo Money',
    status: 'coming_soon',
    icon: '📱',
    features: [
      'Local payment method for Ghana',
      'No bank account required',
      'Instant mobile transfers',
      'Wide accessibility',
    ],
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Bitcoin, Ethereum, USDC, and other cryptocurrencies',
    status: 'coming_soon',
    icon: '₿',
    features: [
      'Decentralized payments',
      'Low transaction fees',
      'Global accessibility',
      'Transparent blockchain records',
    ],
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfers (Ghana and international)',
    status: 'coming_soon',
    icon: '🏦',
    features: [
      'Traditional banking method',
      'Large donation support',
      'No processing fees',
      'Audit-friendly records',
    ],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'PayPal balance or linked accounts',
    status: 'coming_soon',
    icon: '🅿️',
    features: [
      'International payment support',
      'Buyer protection',
      'Easy account linking',
      'Familiar interface',
    ],
  },
];

export const PaymentPlatformTestPage = () => {
  const activePlatforms = paymentPlatforms.filter(p => p.status === 'active');
  const comingSoonPlatforms = paymentPlatforms.filter(p => p.status === 'coming_soon');

  return (
    <>
      <Section background="default">
        <div className="space-y-4 text-center">
          <Heading level={1}>Payment Platform Management</Heading>
          <Body className="mx-auto max-w-2xl" variant="muted">
            This page demonstrates how payment platforms are managed on the Mawu Foundation platform.
            Stripe is currently the only active payment processor, with additional platforms coming soon.
          </Body>
        </div>
      </Section>

      <Section background="muted">
        <div className="space-y-12">
          {/* Active Payment Platforms */}
          <div className="space-y-6">
            <div className="text-center">
              <Heading level={2}>Active Payment Methods</Heading>
              <Body variant="muted" className="mt-2">
                These payment methods are currently available for donations and purchases
              </Body>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activePlatforms.map((platform) => (
                <Card key={platform.id} className="border-2 border-brand-500 bg-white shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="text-4xl">{platform.icon}</div>
                        <Heading level={3} className="text-xl">
                          {platform.name}
                        </Heading>
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                          Active
                        </span>
                      </div>
                    </div>
                    <Body variant="muted" className="text-sm">
                      {platform.description}
                    </Body>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-ink-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-4 w-full" size="sm">
                      Use {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon Payment Platforms */}
          <div className="space-y-6">
            <div className="text-center">
              <Heading level={2}>Coming Soon</Heading>
              <Body variant="muted" className="mt-2">
                These payment methods will be available after compliance reviews are complete
              </Body>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {comingSoonPlatforms.map((platform) => (
                <Card key={platform.id} className="border border-ink-200 bg-white/70 opacity-75">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="text-4xl opacity-50">{platform.icon}</div>
                      <Heading level={3} className="text-xl text-ink-700">
                        {platform.name}
                      </Heading>
                      <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                        Coming Soon
                      </span>
                    </div>
                    <Body variant="muted" className="text-sm">
                      {platform.description}
                    </Body>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-ink-400">○</span>
                          <span className="text-ink-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="mt-4 w-full" 
                      size="sm" 
                      variant="ghost"
                      disabled
                    >
                      Not Available Yet
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Implementation Details */}
          <Card className="bg-brand-50 border-brand-200">
            <CardHeader>
              <Heading level={3}>Implementation Details</Heading>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Heading level={4} className="text-base mb-2">
                  ✓ Stripe Integration
                </Heading>
                <Body className="text-sm text-ink-600">
                  All donations and shop purchases are processed through Stripe's secure payment infrastructure.
                  Stripe handles PCI compliance, fraud detection, and payment processing.
                </Body>
              </div>

              <div>
                <Heading level={4} className="text-base mb-2">
                  ✓ Payment Method Validation
                </Heading>
                <Body className="text-sm text-ink-600">
                  The backend validates that only Stripe payment intents are created. Attempts to use other
                  payment methods are rejected with clear error messages.
                </Body>
              </div>

              <div>
                <Heading level={4} className="text-base mb-2">
                  ✓ User Experience
                </Heading>
                <Body className="text-sm text-ink-600">
                  Users see Stripe as the active payment method with clear "Coming Soon" indicators for other
                  platforms. This sets expectations while showing the roadmap for future payment options.
                </Body>
              </div>

              <div>
                <Heading level={4} className="text-base mb-2">
                  ✓ Error Handling
                </Heading>
                <Body className="text-sm text-ink-600">
                  Comprehensive error handling ensures users receive clear feedback for validation errors,
                  payment failures, and configuration issues.
                </Body>
              </div>
            </CardContent>
          </Card>

          {/* Testing Information */}
          <Card className="bg-ink-900 text-white">
            <CardHeader>
              <Heading level={3} className="text-white">
                Testing & Verification
              </Heading>
            </CardHeader>
            <CardContent className="space-y-4">
              <Body className="text-white/90">
                The payment platform management implementation has been tested for:
              </Body>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand-300">✓</span>
                  <span>Donation page shows only Stripe as active payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-300">✓</span>
                  <span>Shop checkout only processes through Stripe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-300">✓</span>
                  <span>Other payment platforms displayed as "coming soon"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-300">✓</span>
                  <span>Payment method validation and error handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-300">✓</span>
                  <span>Backend API validates Stripe-only payment intents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-300">✓</span>
                  <span>Clear error messages for invalid payment data</span>
                </li>
              </ul>
              <div className="mt-6 rounded-lg bg-white/10 p-4">
                <Body className="text-sm text-white/90">
                  <strong>Test Command:</strong> <code className="text-brand-200">npm run test:payment-platforms</code>
                </Body>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
};
