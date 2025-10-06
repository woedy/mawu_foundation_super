import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Body, Button, Heading, Section } from "../design-system";
import { api, getErrorMessage } from "../lib/api";
import { useToast } from "../components/Toast";
import { validateDonationForm } from "../lib/validation";
import type { FormEvent } from "react";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ amount, type }: { amount: string; type: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
        const errorMsg = error.type === 'card_error' || error.type === 'validation_error'
          ? error.message || "Payment failed"
          : "Payment processing failed. Please try again.";
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showToast(errorMsg, 'error');
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
  const { showToast } = useToast();
  const amount = searchParams.get("amount") || "0";
  const type = searchParams.get("type") || "one-time";
  const focus = searchParams.get("focus") || "";
  const prefilledEmail = searchParams.get("email") || "";
  
  const [clientSecret, setClientSecret] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: prefilledEmail,
    message: "",
    anonymous: false,
  });
  const [step, setStep] = useState<"info" | "payment">("info");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    
    // Validate amount
    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount <= 0) {
      const errorMsg = "Invalid donation amount. Please go back and select a valid amount.";
      setError(errorMsg);
      showToast(errorMsg, 'error');
      return;
    }

    // Validate form
    const validation = validateDonationForm({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      amount: donationAmount,
    });

    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        errors[error.field] = error.message;
      });
      setFieldErrors(errors);
      setError('Please fix the errors in the form before continuing.');
      showToast('Please check all required fields', 'error');
      return;
    }
    
    try {
      const response = await api.post(
        '/api/donations/create-payment-intent',
        {
          amount: donationAmount,
          currency: 'GHS',
          donorEmail: formData.email.trim(),
          donorName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          frequency: type,
          message: formData.message.trim() || undefined,
          anonymous: formData.anonymous,
        },
        { maxRetries: 2 }
      );
      
      if (!response.clientSecret) {
        throw new Error("Failed to initialize payment session");
      }
      
      setClientSecret(response.clientSecret);
      setStep("payment");
      showToast('Proceeding to payment...', 'success');
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value 
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
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {focus && (
              <div className="rounded-lg bg-brand-50 border border-brand-200 p-4">
                <p className="text-sm font-medium text-brand-900">
                  <span className="text-brand-600">Focus Area:</span> {focus}
                </p>
              </div>
            )}

            <div>
              <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                      fieldErrors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-ink-300 focus:border-brand-500 focus:ring-brand-200'
                    }`}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                      fieldErrors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-ink-300 focus:border-brand-500 focus:ring-brand-200'
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-ink-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 ${
                    fieldErrors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'border-ink-300 focus:border-brand-500 focus:ring-brand-200'
                  }`}
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                ) : (
                  <p className="mt-1 text-xs text-ink-500">We'll send your tax receipt to this email</p>
                )}
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-ink-700">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Share why you're supporting the Mawu Foundation..."
                  className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
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
                  Continue to Stripe Payment
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
              <p className="mt-3 text-xs text-center text-ink-500">
                Stripe is the only active processor today. Additional channels will unlock once compliance reviews are complete.
              </p>
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
