import { Link, useSearchParams } from "react-router-dom";
import { Body, Button, Heading, Section } from "../design-system";

export const DonationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  const type = searchParams.get("type") || "one-time";
  const paymentIntent = searchParams.get("payment_intent");

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

        <Heading level={1}>Thank You for Your Generosity!</Heading>
        
        <Body className="mt-4 text-lg" variant="muted">
          Your {type === "monthly" ? "monthly recurring" : "one-time"} donation of GHS {parseFloat(amount).toFixed(2)} has been successfully processed.
        </Body>

        {paymentIntent && (
          <p className="mt-2 text-xs text-ink-500">
            Transaction ID: {paymentIntent.substring(0, 20)}...
          </p>
        )}

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-ink-900">What Happens Next?</h3>
          <div className="space-y-3 text-left text-sm text-ink-600">
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              You'll receive a confirmation email with your donation receipt
            </p>
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              Your contribution will be allocated to programs in the Volta Region
            </p>
            <p className="flex items-start">
              <span className="mr-2 text-brand-600">✓</span>
              {type === "monthly" 
                ? "You'll receive quarterly impact reports showing how your monthly support is making a difference"
                : "You'll receive impact updates showing how your donation is transforming lives"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-brand-50 p-6">
          <img
            src="/happy_african_family_c0cb0f9b.jpg"
            alt="Happy community members"
            className="mb-4 w-full rounded-lg"
          />
          <Body className="text-brand-900">
            Your support is powering clean water access, IT literacy programs, healthcare services, and educational opportunities across Africa.
          </Body>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button as={Link} to="/" size="lg">
            Return to Homepage
          </Button>
          <Button as={Link} to="/programs" variant="secondary" size="lg">
            Explore Our Programs
          </Button>
        </div>
      </div>
    </Section>
  );
};
