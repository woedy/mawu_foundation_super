import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import {
  Body,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Eyebrow,
  Heading,
  Section
} from '../design-system';


type DonationFrequency = 'once' | 'monthly';

interface TransparencyResource {
  id: string;
  title: string;
  description: string;
  category: 'Financials' | 'Governance' | 'Partners';
  year: string;
  url: string;
}

const donationFocusAreas = [
  'Education & Creative Labs',
  'Health & Wellness Corridors',
  'Water & Sanitation',
  'Economic Empowerment',
  'Community Resilience Fund'
];

const donationPresetAmounts = [50, 150, 300, 500];

const fallbackTransparencyResources: TransparencyResource[] = [
  {
    id: 'fy2023-impact-report',
    title: 'FY2023 Impact & Financial Report',
    description:
      'Audited statements, program spend, and lessons learned from our multi-country portfolio including the Volta Region pilot.',
    category: 'Financials',
    year: '2023',
    url: 'https://mawufoundation.org/reports/fy2023-impact.pdf'
  },
  {
    id: 'governance-charter',
    title: 'Governance Charter & Board Directory',
    description:
      'Meet the trustees, regional advisors, and safeguarding committee guiding our pan-African mission with community accountability.',
    category: 'Governance',
    year: 'Updated Q3 2024',
    url: 'https://mawufoundation.org/transparency/governance-charter.pdf'
  },
  {
    id: 'volta-partners',
    title: 'Volta Region Partner & Vendor Ledger',
    description:
      'A transparent register of local cooperatives, artisans, clinics, and civic partners collaborating on this season’s initiatives.',
    category: 'Partners',
    year: '2024 Season',
    url: 'https://mawufoundation.org/transparency/volta-partners.pdf'
  }
];

const volunteerInterestOptions = [
  'Education & Creative Labs',
  'Health & Mobile Clinics',
  'Water & Sanitation',
  'Economic Empowerment',
  'Emergency Response Corps'
];

const partnershipTracks = [
  'Corporate Social Impact',
  'Foundation or Philanthropy',
  'Government or Agency',
  'Impact Investment',
  'Community Cooperative'
];

interface FetchStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
}

const defaultStatus: FetchStatus = { state: 'idle', message: null };

const GetInvolvedSection = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(donationPresetAmounts[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [donationFrequency, setDonationFrequency] = useState<DonationFrequency>('once');
  const [donationFocus, setDonationFocus] = useState(donationFocusAreas[0]);
  const [donorEmail, setDonorEmail] = useState('');
  const [donationStatus, setDonationStatus] = useState<FetchStatus>(defaultStatus);

  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerRegion, setVolunteerRegion] = useState('Volta Region');
  const [volunteerAvailability, setVolunteerAvailability] = useState('Weekends');
  const [volunteerInterests, setVolunteerInterests] = useState<string[]>(['Education & Creative Labs']);
  const [volunteerMessage, setVolunteerMessage] = useState('');
  const [volunteerStatus, setVolunteerStatus] = useState<FetchStatus>(defaultStatus);

  const [partnerName, setPartnerName] = useState('');
  const [partnerOrganisation, setPartnerOrganisation] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerTrack, setPartnerTrack] = useState(partnershipTracks[0]);
  const [partnerMessage, setPartnerMessage] = useState('');
  const [partnerStatus, setPartnerStatus] = useState<FetchStatus>(defaultStatus);

  const resources = fallbackTransparencyResources;
  const transparencyNotice: FetchStatus = {
    state: 'success',
    message: null,
  };

  const donationAmountDisplay = useMemo(() => {
    if (selectedAmount === 'custom') {
      return customAmount ? `GHS ${Number(customAmount).toLocaleString()}` : 'Custom amount';
    }

    return `GHS ${selectedAmount.toLocaleString()}`;
  }, [customAmount, selectedAmount]);

  const handleDonationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDonationStatus({ state: 'idle', message: null });

    const amountValue = selectedAmount === 'custom' ? Number.parseFloat(customAmount) : selectedAmount;
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setDonationStatus({ state: 'error', message: 'Enter a valid contribution amount to continue.' });
      return;
    }

    if (!donorEmail) {
      setDonationStatus({ state: 'error', message: 'We use your email to send tax receipts—please add it before giving.' });
      return;
    }

    // Redirect to donation checkout page with parameters
    const params = new URLSearchParams({
      amount: amountValue.toString(),
      type: donationFrequency === 'monthly' ? 'monthly' : 'one-time',
      focus: donationFocus,
      email: donorEmail,
    });
    
    window.location.href = `/donate/checkout?${params.toString()}`;
  };

  const toggleVolunteerInterest = (interest: string) => {
    setVolunteerInterests((current) => {
      if (current.includes(interest)) {
        return current.filter((item) => item !== interest);
      }

      return [...current, interest];
    });
  };

  const handleVolunteerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVolunteerStatus({ state: 'idle', message: null });
    if (!volunteerName || !volunteerEmail || volunteerInterests.length === 0) {
      setVolunteerStatus({
        state: 'error',
        message: 'Share your name, email, and at least one interest area so our field team can follow up.'
      });
      return;
    }

    setVolunteerStatus({ state: 'loading', message: 'Submitting your volunteer application…' });
    
    // TODO: Implement actual volunteer submission API
    setTimeout(() => {
      setVolunteerStatus({
        state: 'success',
        message: 'Thank you for your interest! Our volunteer coordinator will contact you within 48 hours.',
      });
      setVolunteerMessage('');
    }, 700);
  };

  const handlePartnerSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPartnerStatus({ state: 'idle', message: null });
    if (!partnerName || !partnerOrganisation || !partnerEmail) {
      setPartnerStatus({
        state: 'error',
        message: 'Tell us who you are partnering with and the best contact email to start planning together.'
      });
      return;
    }

    setPartnerStatus({ state: 'loading', message: 'Submitting your partnership inquiry…' });
    
    // TODO: Implement actual partnership submission API
    setTimeout(() => {
      setPartnerStatus({
        state: 'success',
        message: 'Thank you for your interest! Our partnerships team will reach out within 2 business days.',
      });
      setPartnerMessage('');
    }, 850);
  };

  return (
    <Section background="tinted" id="donate">
      <div className="space-y-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <Eyebrow>Get involved</Eyebrow>
            <Heading level={2}>Take action with secure giving and community pathways</Heading>
            <Body>
              Fuel season-long pilots in Ghana’s Volta Region or power continent-wide resilience funds. Stripe processes all
              gifts today while we prepare additional channels. You will immediately receive confirmation and quarterly
              transparency briefs.
            </Body>
            <Card className="bg-white/90 shadow-soft">
              <CardHeader>
                <Heading className="text-xl" level={3}>
                  Build your Stripe donation
                </Heading>
                <Body variant="muted">
                  Choose an amount, select a focus, and launch a secure checkout session. Recurring gifts sustain year-round
                  field teams.
                </Body>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleDonationSubmit}>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Contribution</p>
                    <div className="flex flex-wrap gap-3">
                      {donationPresetAmounts.map((amount) => (
                        <button
                          key={amount}
                          className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                            selectedAmount === amount
                              ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                              : 'border-ink-200 bg-white text-ink-700 hover:border-brand-400'
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            setSelectedAmount(amount);
                          }}
                          type="button"
                        >
                          GHS {amount.toLocaleString()}
                        </button>
                      ))}
                      <button
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                          selectedAmount === 'custom'
                            ? 'border-brand-500 bg-brand-100 text-brand-700'
                            : 'border-ink-200 bg-white text-ink-600 hover:border-brand-400'
                        }`}
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedAmount('custom');
                        }}
                        type="button"
                      >
                        Custom
                      </button>
                    </div>
                    {selectedAmount === 'custom' ? (
                      <input
                        aria-label="Custom donation amount in Ghanaian Cedis"
                        className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                        inputMode="decimal"
                        min={1}
                        onChange={(event) => setCustomAmount(event.target.value)}
                        placeholder="Enter amount"
                        value={customAmount}
                      />
                    ) : null}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-ink-600">
                      <span>Cadence</span>
                      <select
                        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                        onChange={(event) => setDonationFrequency(event.target.value as DonationFrequency)}
                        value={donationFrequency}
                      >
                        <option value="once">One-time gift</option>
                        <option value="monthly">Monthly circle</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm font-medium text-ink-600">
                      <span>Focus area</span>
                      <select
                        className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                        onChange={(event) => setDonationFocus(event.target.value)}
                        value={donationFocus}
                      >
                        {donationFocusAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Receipt email</span>
                    <input
                      aria-required
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setDonorEmail(event.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={donorEmail}
                    />
                  </label>

                  <div className="flex flex-col gap-2">
                    <Button disabled={donationStatus.state === 'loading'} size="lg" type="submit">
                      {donationStatus.state === 'loading'
                        ? 'Redirecting to checkout…'
                        : `Donate ${donationAmountDisplay} with Stripe`}
                    </Button>
                    <Button disabled size="lg" variant="ghost">
                      Coming soon: Crypto · PayPal · Bank Transfer · Mobile Money
                    </Button>
                  </div>
                  <p className="text-xs text-ink-500">Stripe is the only active processor today. Additional channels will unlock once compliance reviews are complete.</p>
                  {donationStatus.message && (
                    <p aria-live="polite" className={`text-sm font-medium ${donationStatus.state === 'error' ? 'text-red-600' : 'text-brand-700'}`}>
                      {donationStatus.message}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/90 shadow-soft">
            <CardHeader>
              <Heading className="text-xl" level={3}>
                Volunteer mobilisation
              </Heading>
              <Body variant="muted">
                Share your skills and we will match you with cultural, educational, or wellness activations in the Volta Region.
              </Body>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleVolunteerSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Full name</span>
                    <input
                      aria-required
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setVolunteerName(event.target.value)}
                      placeholder="Ama Mensah"
                      value={volunteerName}
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Email</span>
                    <input
                      aria-required
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setVolunteerEmail(event.target.value)}
                      placeholder="ama@example.com"
                      type="email"
                      value={volunteerEmail}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Phone (optional)</span>
                    <input
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setVolunteerPhone(event.target.value)}
                      placeholder="+233 55 555 5555"
                      value={volunteerPhone}
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Region base</span>
                    <input
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setVolunteerRegion(event.target.value)}
                      placeholder="Volta Region"
                      value={volunteerRegion}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Availability</span>
                    <select
                      className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setVolunteerAvailability(event.target.value)}
                      value={volunteerAvailability}
                    >
                      <option value="Weekends">Weekends</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Remote">Remote coordination</option>
                    </select>
                  </label>
                  <div className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Impact interests</span>
                    <div className="space-y-2 rounded-2xl border border-ink-200 p-3">
                      {volunteerInterestOptions.map((interest) => {
                        const selected = volunteerInterests.includes(interest);
                        return (
                          <label className="flex items-center gap-2 text-sm font-normal text-ink-600" key={interest}>
                            <input
                              checked={selected}
                              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                              onChange={() => toggleVolunteerInterest(interest)}
                              type="checkbox"
                            />
                            <span>{interest}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <label className="space-y-2 text-sm font-medium text-ink-600">
                  <span>How would you like to help?</span>
                  <textarea
                    className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    onChange={(event) => setVolunteerMessage(event.target.value)}
                    placeholder="Share skills, languages, transport, or resources you can offer."
                    rows={3}
                    value={volunteerMessage}
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <Button disabled={volunteerStatus.state === 'loading'} type="submit">
                    {volunteerStatus.state === 'loading' ? 'Submitting interest…' : 'Raise your hand'}
                  </Button>
                  <p aria-live="polite" className="text-sm font-medium text-brand-700">
                    {volunteerStatus.message}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <Card className="bg-white/90 shadow-soft">
            <CardHeader>
              <Heading className="text-xl" level={3}>
                Partnership brief
              </Heading>
              <Body variant="muted">
                Align your organisation’s goals with our regenerative infrastructure roadmap across Africa. We craft bespoke
                partnership decks within 48 hours.
              </Body>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handlePartnerSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Contact name</span>
                    <input
                      aria-required
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setPartnerName(event.target.value)}
                      placeholder="Kofi Agyeman"
                      value={partnerName}
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Organisation</span>
                    <input
                      aria-required
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setPartnerOrganisation(event.target.value)}
                      placeholder="Solar Futures Ltd."
                      value={partnerOrganisation}
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Email</span>
                    <input
                      aria-required
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setPartnerEmail(event.target.value)}
                      placeholder="partnerships@organisation.com"
                      type="email"
                      value={partnerEmail}
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-ink-600">
                    <span>Phone (optional)</span>
                    <input
                      className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                      onChange={(event) => setPartnerPhone(event.target.value)}
                      placeholder="+44 7700 900123"
                      value={partnerPhone}
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-ink-600">
                  <span>Collaboration track</span>
                  <select
                    className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    onChange={(event) => setPartnerTrack(event.target.value)}
                    value={partnerTrack}
                  >
                    {partnershipTracks.map((track) => (
                      <option key={track} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-ink-600">
                  <span>Partnership vision</span>
                  <textarea
                    className="w-full rounded-2xl border border-ink-200 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    onChange={(event) => setPartnerMessage(event.target.value)}
                    placeholder="Share goals, target communities, or impact metrics you want to unlock together."
                    rows={4}
                    value={partnerMessage}
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <Button disabled={partnerStatus.state === 'loading'} type="submit" variant="secondary">
                    {partnerStatus.state === 'loading' ? 'Preparing discovery call…' : 'Submit partnership brief'}
                  </Button>
                  <p aria-live="polite" className="text-sm font-medium text-brand-700">
                    {partnerStatus.message}
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Body className="text-xs" variant="muted">
                Once submitted, we send a calendar link for co-design sprints and share our due diligence pack (policies,
                registration, compliance).
              </Body>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="bg-ink-900 text-white shadow-soft">
              <CardHeader>
                <Heading className="text-xl text-white" level={3}>
                  Transparency registry
                </Heading>
                <Body className="text-white/80" variant="light">
                  Review our audited reports, governance practices, and partner network. We update this hub quarterly and upon
                  major program launches.
                </Body>
              </CardHeader>
              <CardContent className="space-y-4">
                {transparencyNotice.message ? (
                  <div
                    className={`rounded-2xl p-4 text-sm ${
                      transparencyNotice.state === 'error'
                        ? 'border border-white/30 bg-white/10 text-brand-100'
                        : 'border border-white/20 bg-white/5 text-brand-100'
                    }`}
                  >
                    {transparencyNotice.message}
                  </div>
                ) : null}
                <ul className="space-y-4">
                  {resources.map((resource) => (
                    <li className="rounded-2xl border border-white/20 bg-white/5 p-4" key={resource.id}>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200/80">{resource.category}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{resource.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/70">{resource.year}</p>
                      <p className="mt-3 text-sm text-white/80">{resource.description}</p>
                      <a
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-100 hover:text-brand-200"
                        href={resource.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        View document
                        <span aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Body className="text-xs text-white/70" variant="light">
                  Questions? Email <a className="underline" href="mailto:transparency@mawufoundation.org">transparency@mawufoundation.org</a>{' '}
                  and our compliance desk will respond within 24 hours.
                </Body>
              </CardFooter>
            </Card>

            <Card className="bg-white/90 shadow-soft">
              <CardHeader>
                <Heading className="text-xl" level={3}>
                  After you reach out
                </Heading>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-ink-600">
                <StepBullet>
                  Stripe donations generate instant receipts and impact dashboards. Monthly supporters join a quarterly
                  storytelling call with our field leads.
                </StepBullet>
                <StepBullet>
                  Volunteer coordinators schedule an orientation huddle (virtual or in-person) and pair you with a community host.
                </StepBullet>
                <StepBullet>
                  Partnerships receive a tailored proposal, budget scenarios, and measurable outcome map for executive review.
                </StepBullet>
              </CardContent>
              <CardFooter>
                <Body className="text-xs" variant="muted">
                  Need immediate assistance? Call +233 50 000 0000 for the Volta command centre or WhatsApp us at +233 20 000
                  0000.
                </Body>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
};

const StepBullet = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-3 text-left">
    <span aria-hidden className="mt-1.5 inline-flex h-3 w-3 flex-shrink-0 rounded-full bg-brand-500" />
    <span className="flex-1">{children}</span>
  </div>
);

export default GetInvolvedSection;
