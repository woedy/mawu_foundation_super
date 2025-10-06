import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../components/Toast";
import { Body, Button, Heading, Section } from "../design-system";
import { api, getErrorMessage } from "../lib/api";
import { validateCheckoutForm } from "../lib/validation";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shippingAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "GH",
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    // Validate form before submission
    const validation = validateCheckoutForm(formData);
    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        errors[error.field] = error.message;
      });
      setFieldErrors(errors);
      setErrorMessage('Please fix the errors in the form before continuing.');
      showToast('Please check all required fields', 'error');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      // Submit payment to Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const customerName = `${formData.firstName} ${formData.lastName}`;

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/shop/success?amount=${total.toFixed(2)}&email=${encodeURIComponent(formData.email)}`,
          payment_method_data: {
            billing_details: {
              name: customerName,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.shippingAddress.line1,
                line2: formData.shippingAddress.line2,
                city: formData.shippingAddress.city,
                state: formData.shippingAddress.state,
                postal_code: formData.shippingAddress.postalCode,
                country: formData.shippingAddress.country,
              },
            },
          },
        },
      });

      if (error) {
        // Handle specific Stripe error types
        if (error.type === 'card_error' || error.type === 'validation_error') {
          throw new Error(error.message);
        } else {
          throw new Error('Payment processing failed. Please try again.');
        }
      }

      // Clear cart on successful payment
      clearCart();
      showToast('Order placed successfully!', 'success');
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.firstName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-ink-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
            {fieldErrors.firstName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-1 ${
                fieldErrors.lastName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-ink-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
            {fieldErrors.lastName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-1 ${
              fieldErrors.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-ink-300 focus:border-brand-500 focus:ring-brand-500'
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-1 ${
              fieldErrors.phone
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-ink-300 focus:border-brand-500 focus:ring-brand-500'
            }`}
          />
          {fieldErrors.phone && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Street Address</label>
            <input
              type="text"
              name="address.line1"
              value={formData.shippingAddress.line1}
              onChange={handleChange}
              required
              className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Apartment, suite, etc. (optional)</label>
            <input
              type="text"
              name="address.line2"
              value={formData.shippingAddress.line2 || ''}
              onChange={handleChange}
              className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                required
                className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Region/State</label>
              <input
                type="text"
                name="address.state"
                value={formData.shippingAddress.state || ''}
                onChange={handleChange}
                className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Postal Code (optional)</label>
              <input
                type="text"
                name="address.postalCode"
                value={formData.shippingAddress.postalCode || ''}
                onChange={handleChange}
                className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Country</label>
              <select
                name="address.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                required
                className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="GH">Ghana</option>
                <option value="NG">Nigeria</option>
                <option value="KE">Kenya</option>
                <option value="ZA">South Africa</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Payment Information</h3>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="rounded-lg bg-brand-50 p-4">
        <p className="text-sm text-ink-600">
          Your payment will be processed securely through Stripe. All transactions are encrypted and secure.
        </p>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Place Order - GHS ${total.toFixed(2)}`}
      </Button>
    </form>
  );
}

export const ShopCheckoutPage = () => {
  const { items, total, validateCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate cart before creating payment intent
        const validationResults = await validateCart();
        const invalidItems = validationResults.filter(r => !r.valid);
        
        if (invalidItems.length > 0) {
          const errorMsg = invalidItems.map(r => r.message).join(', ');
          throw new Error(`Cart validation failed: ${errorMsg}`);
        }

        const response = await api.post(
          '/api/orders/create-payment-intent',
          {
            items: items.map(item => ({
              productId: item.productId || item.id,
              productName: item.name,
              quantity: item.quantity,
              price: item.price.toString(),
              selectedVariations: item.selectedVariations,
            })),
            customerEmail: '',
            customerName: '',
            shippingAddress: {},
            totalAmount: total,
            currency: 'GHS',
          },
          { maxRetries: 2 }
        );

        if (!response.clientSecret) {
          throw new Error('Invalid response from server');
        }

        setClientSecret(response.clientSecret);
      } catch (error: any) {
        const errorMsg = getErrorMessage(error);
        setError(errorMsg);
        showToast(errorMsg, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [items, total, navigate, validateCart, showToast]);

  if (isLoading) {
    return (
      <Section background="muted">
        <div className="mx-auto max-w-6xl text-center">
          <Heading level={1} className="mb-8">Checkout</Heading>
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
          </div>
          <Body className="mt-4" variant="muted">Preparing your checkout...</Body>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section background="muted">
        <div className="mx-auto max-w-2xl text-center">
          <Heading level={1} className="mb-8">Checkout Error</Heading>
          <div className="rounded-lg bg-red-50 p-6">
            <p className="text-red-800">{error}</p>
          </div>
          <Button 
            onClick={() => navigate('/cart')} 
            className="mt-6"
          >
            Return to Cart
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section background="muted">
      <div className="mx-auto max-w-6xl">
        <Heading level={1} className="mb-8">Checkout</Heading>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {clientSecret && (
              <Elements 
                stripe={stripePromise} 
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#D97706',
                      colorBackground: '#ffffff',
                      colorText: '#1F2937',
                      colorDanger: '#DC2626',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm />
              </Elements>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name} × {item.quantity}</span>
                      <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-ink-600">
                        {Object.entries(item.selectedVariations).map(([type, value]) => (
                          <span key={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-ink-200 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GHS {total.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>GHS {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
