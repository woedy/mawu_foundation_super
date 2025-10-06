import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Body, Button, Card, CardContent, Heading, Section } from "../design-system";

type DonationType = "one-time" | "monthly";
type DonationTier = { amount: number; impact: string };

const donationTiers: DonationTier[] = [
  { amount: 250, impact: "Provides clean water for 5 families for a month" },
  { amount: 500, impact: "Funds IT literacy training for 3 students" },
  { amount: 1000, impact: "Supports a mobile health clinic for one day" },
  { amount: 2500, impact: "Equips a classroom with learning materials" },
  { amount: 5000, impact: "Installs a solar-powered borehole" },
];

export const EnhancedDonatePage = () => {
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const navigate = useNavigate();

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount) || 0;
    if (amount > 0) {
      const params = new URLSearchParams({
        amount: amount.toString(),
        type: donationType,
      });
      navigate(`/donate/checkout?${params.toString()}`);
    }
  };

  const activeAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : null);
  const selectedTier = donationTiers.find(t => t.amount === activeAmount);

  return (
    <>
      <Section background="default">
        <div className="space-y-4 text-center">
          <Heading level={1}>Make a Difference Today</Heading>
          <Body className="mx-auto max-w-2xl" variant="muted">
            Your generosity powers lasting change across Africa. Choose between one-time giving or join our community of monthly supporters making sustained impact in the Volta Region and beyond.
          </Body>
        </div>
      </Section>

      <Section background="muted">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex gap-4 border-b border-ink-200">
            <button
              className={`pb-4 px-6 font-semibold transition-colors ${
                donationType === "one-time"
                  ? "border-b-2 border-brand-600 text-brand-600"
                  : "text-ink-500 hover:text-ink-700"
              }`}
              onClick={() => setDonationType("one-time")}
            >
              One-Time Donation
            </button>
            <button
              className={`pb-4 px-6 font-semibold transition-colors ${
                donationType === "monthly"
                  ? "border-b-2 border-brand-600 text-brand-600"
                  : "text-ink-500 hover:text-ink-700"
              }`}
              onClick={() => setDonationType("monthly")}
            >
              Monthly Recurring
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-ink-900">
                {donationType === "monthly" ? "Monthly" : "One-Time"} Donation Amount
              </h3>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
                {donationTiers.map(tier => (
                  <button
                    key={tier.amount}
                    className={`rounded-lg border-2 p-4 text-center transition-all ${
                      selectedAmount === tier.amount
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-ink-200 bg-white hover:border-brand-300"
                    }`}
                    onClick={() => {
                      setSelectedAmount(tier.amount);
                      setCustomAmount("");
                    }}
                  >
                    <div className="text-xl font-bold">GHS {tier.amount}</div>
                    {donationType === "monthly" && (
                      <div className="text-xs text-ink-500">/month</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink-700">
                Or enter a custom amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500">GHS</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full rounded-lg border-2 border-ink-200 py-3 pl-16 pr-4 focus:border-brand-500 focus:outline-none"
                  placeholder="Enter amount"
                  min="1"
                />
              </div>
            </div>

            {selectedTier && (
              <Card className="bg-brand-50 border-brand-200">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-brand-900">
                    <span className="text-brand-600">Your Impact:</span> {selectedTier.impact}
                    {donationType === "monthly" && " every month"}
                  </p>
                </CardContent>
              </Card>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleDonate}
              disabled={!activeAmount || activeAmount <= 0}
            >
              {donationType === "monthly" ? "Start Monthly Donation" : "Donate Now"} 
              {activeAmount ? ` - GHS ${activeAmount}${donationType === "monthly" ? "/month" : ""}` : ""}
            </Button>

            <p className="text-center text-sm text-ink-500">
              Secure payment processing. You'll be redirected to complete your donation.
            </p>
          </div>
        </div>
      </Section>

      <Section background="default">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <Heading level={2}>Every Contribution Counts</Heading>
          <Body variant="muted">
            We partner with community leaders across the Volta Region to ensure every dollar creates lasting change. From clean water to IT literacy, your support transforms lives.
          </Body>
          <img
            src="/african_community_de_d959e7ff.jpg"
            alt="Community members celebrating together"
            className="w-full rounded-lg shadow-lg mt-6"
          />
        </div>
      </Section>
    </>
  );
};
