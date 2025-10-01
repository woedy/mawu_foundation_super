import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Body, Button, Heading, Section } from "../design-system";

export const DonationCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = searchParams.get("amount") || "0";
  const type = searchParams.get("type") || "one-time";
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/donate/success?amount=${amount}&type=${type}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Section background="muted">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <Heading level={1}>Complete Your Donation</Heading>
          <Body className="mt-2" variant="muted">
            You're donating ${amount} {type === "monthly" && "per month"}
          </Body>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
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
              <label className="mb-1 block text-sm font-medium text-ink-700">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Payment Information</h3>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-ink-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                placeholder="1234 5678 9012 3456"
                className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700">Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  placeholder="MM/YY"
                  className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  placeholder="123"
                  className="w-full rounded border border-ink-300 px-3 py-2 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-brand-50 p-4">
            <p className="text-sm text-ink-600">
              This is a demo checkout. No actual payment will be processed.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Complete Donation - ${amount}
          </Button>
        </form>
      </div>
    </Section>
  );
};
