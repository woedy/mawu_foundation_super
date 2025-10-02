import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Body, Button, Heading, Section } from "../design-system";
import { api } from "../lib/api";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ amount, type }: { amount: string; type: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/success?amount=${amount}&type=${type}`,
        },
      });

      if (error) {
        setError(error.message || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || processing}>
        {processing ? "Processing..." : `Complete Donation - GHS ${amount}`}
      </Button>
    </form>
  );
};

export const DonationCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = searchParams.get("amount") || "0";
  const type = searchParams.get("type") || "one-time";
  
  const [clientSecret, setClientSecret] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    anonymous: false,
  });
  const [step, setStep] = useState<"info" | "payment">("info");

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/api/donations/create-payment-intent', {
        amount: parseFloat(amount),
        currency: 'GHS',
        donorEmail: formData.email,
        donorName: `${formData.firstName} ${formData.lastName}`,
        frequency: type,
        message: formData.message,
        anonymous: formData.anonymous,
      });
      
      setClientSecret(response.clientSecret);
      setStep("payment");
    } catch (err: any) {
      alert(err.message || "Failed to initialize payment");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    });
  };

  return (
    <Section background="muted">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Heading level={1}>Complete Your Donation</Heading>
          <Body className="mt-2" variant="muted">
            You're donating GHS {amount} {type === "monthly" && "per month"}
          </Body>
        </div>

        {step === "info" && (
          <form onSubmit={handleInfoSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-ink-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-ink-700">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm text-ink-700">Make this donation anonymous</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Select Payment Method</h3>
              <div className="grid gap-3">
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Pay with Stripe
                </Button>
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg border border-ink-200 bg-ink-50 px-6 py-3 text-ink-400 opacity-50 cursor-not-allowed"
                >
                  Pay with Mobile Money (Coming Soon)
                </button>
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg border border-ink-200 bg-ink-50 px-6 py-3 text-ink-400 opacity-50 cursor-not-allowed"
                >
                  Pay with Crypto (Coming Soon)
                </button>
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg border border-ink-200 bg-ink-50 px-6 py-3 text-ink-400 opacity-50 cursor-not-allowed"
                >
                  Pay with Bank Transfer (Coming Soon)
                </button>
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg border border-ink-200 bg-ink-50 px-6 py-3 text-ink-400 opacity-50 cursor-not-allowed"
                >
                  Pay with PayPal (Coming Soon)
                </button>
              </div>
            </div>
          </form>
        )}

        {step === "payment" && clientSecret && stripePromise && (
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-lg font-semibold">Payment Details</h3>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={amount} type={type} />
            </Elements>
          </div>
        )}

        {step === "payment" && !stripePromise && (
          <div className="rounded-lg bg-red-50 p-8 text-center">
            <p className="text-red-600">Stripe is not configured. Please contact support.</p>
          </div>
        )}
      </div>
    </Section>
  );
};
