import { Link, useSearchParams } from "react-router-dom";
import { Body, Button, Heading, Section } from "../design-system";

export const ShopSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "MF-00000000";
  const amount = searchParams.get("amount") || "0";

  return (
    <Section background="muted">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <Heading level={1}>Order Confirmed!</Heading>
        
        <Body className="mt-4" variant="muted">
          Thank you for your purchase. Your order has been successfully placed.
        </Body>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 text-sm text-ink-500">Order Number</div>
          <div className="text-2xl font-bold text-brand-600">{orderNumber}</div>
          <div className="mt-4 text-lg">Total: GHS {amount}</div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-ink-900">What's Next?</h3>
          <div className="space-y-3 text-left text-sm text-ink-600">
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              You'll receive an order confirmation email shortly
            </p>
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              Your items will be prepared for shipping within 2-3 business days
            </p>
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              Track your order status through the email we'll send you
            </p>
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              Your purchase supports community programs across the Volta Region
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-brand-50 p-6">
          <img
            src="/african_handmade_cra_8821aebc.jpg"
            alt="Handmade crafts from local artisans"
            className="mb-4 w-full rounded-lg"
          />
          <Body className="text-brand-900">
            Every purchase supports local artisans and funds community development programs, from education to healthcare.
          </Body>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button as={Link} to="/" size="lg">
            Return to Homepage
          </Button>
          <Button as={Link} to="/shop" variant="secondary" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </Section>
  );
};
