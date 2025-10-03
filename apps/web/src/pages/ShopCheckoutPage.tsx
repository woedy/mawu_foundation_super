import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Body, Button, Heading, Section } from "../design-system";

export const ShopCheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = `MF-${Date.now().toString().slice(-8)}`;
    clearCart();
    navigate(`/shop/success?order=${orderNumber}&amount=${total}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Section background="muted">
      <div className="mx-auto max-w-6xl">
        <Heading level={1} className="mb-8">Checkout</Heading>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
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
                      className="w-full rounded border border-ink-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-ink-300 px-3 py-2"
                    />
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
                    className="w-full rounded border border-ink-300 px-3 py-2"
                  />
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded border border-ink-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full rounded border border-ink-300 px-3 py-2"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full rounded border border-ink-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Region</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        className="w-full rounded border border-ink-300 px-3 py-2"
                      >
                        <option value="">Select region</option>
                        <option value="volta">Volta Region</option>
                        <option value="greater-accra">Greater Accra</option>
                        <option value="ashanti">Ashanti Region</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded border border-ink-300 px-3 py-2"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        className="w-full rounded border border-ink-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        placeholder="123"
                        className="w-full rounded border border-ink-300 px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-brand-50 p-4">
                <p className="text-sm text-ink-600">
                  Your payment will be processed securely through Stripe.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Place Order - GHS {total}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>GHS {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-ink-200 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GHS {total}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>GHS {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
