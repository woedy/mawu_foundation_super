import type { ReactNode } from 'react';
import {
  Body,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Container,
  Eyebrow,
  Heading,
  Section
} from './design-system';

const App = () => {
  const impactStats = [
    { label: 'Communities served across Africa', value: '48', accent: 'bg-brand-500/20 text-brand-100' },
    { label: 'People gaining daily access to clean water', value: '32K', accent: 'bg-white/10 text-white' },
    { label: 'Youth enrolled in future-ready classrooms', value: '12.4K', accent: 'bg-brand-500/20 text-brand-100' },
    { label: 'Volunteers mobilised this season', value: '2.1K', accent: 'bg-white/10 text-white' }
  ];

  const voltaInitiatives = [
    {
      title: 'Solar Learning Labs',
      description:
        'Off-grid classrooms in Keta and Hohoe blending digital curricula with local mentorship to accelerate STEM pathways.',
      image:
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Water & Wellness Corridors',
      description:
        'Rain-harvesting towers and mobile clinics travelling between Anloga, Sogakope, and Akatsi ensuring continuity of care.',
      image:
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Resilient Livelihoods',
      description:
        'Cooperative agribusiness and microfinance studios helping families pilot climate-smart farming and artisan ventures.',
      image:
        'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const experienceHighlights = [
    {
      title: 'For Donors',
      description:
        'Transparent dashboards and immersive storytelling showcase exactly how each contribution powers change in the Volta Region and beyond.',
      icon: '🤝'
    },
    {
      title: 'For Partners',
      description:
        'Collaborative pilots with local leaders, governments, and innovators help scale successful models across the continent.',
      icon: '🌍'
    },
    {
      title: 'For Communities',
      description:
        'Human-centred design keeps every initiative co-created with residents, ensuring dignity, ownership, and long-term resilience.',
      icon: '✨'
    }
  ];

  const shopItems = [
    {
      name: 'Aurora Impact Tee',
      description: 'Organic cotton with hand-illustrated constellation of our partner communities.',
      price: '$38',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Unity Canvas Tote',
      description: 'Carry hope with a limited-run print celebrating African artisanship.',
      price: '$28',
      image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Volta Sunrise Hoodie',
      description: 'Cozy fleece dyed in sunrise gradients funding solar microgrid installations.',
      price: '$68',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-100 text-ink-900">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-lg">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-semibold text-white shadow-soft">
              MF
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-ink-900">Mawu Foundation</p>
              <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Humanity in Motion</p>
            </div>
          </div>
          <nav aria-label="Primary">
            <ul className="hidden items-center gap-8 text-sm font-semibold text-ink-600 md:flex">
              <li>
                <a className="transition hover:text-brand-600" href="#vision">
                  Vision
                </a>
              </li>
              <li>
                <a className="transition hover:text-brand-600" href="#volta">
                  Volta Focus
                </a>
              </li>
              <li>
                <a className="transition hover:text-brand-600" href="#programs">
                  Programs
                </a>
              </li>
              <li>
                <a className="transition hover:text-brand-600" href="#shop">
                  Shop
                </a>
              </li>
              <li>
                <a className="transition hover:text-brand-600" href="#donate">
                  Donate
                </a>
              </li>
            </ul>
          </nav>
          <Button as="a" href="#donate">
            Give Today
          </Button>
        </Container>
      </header>

      <main className="flex flex-col" id="main">
        <Section
          background="inverted"
          bleed
          className="overflow-hidden shadow-soft"
          containerClassName="relative flex flex-col gap-12 pb-16 pt-28 lg:flex-row lg:items-end lg:gap-16"
          id="vision"
          padding="none"
        >
          <div className="absolute inset-0">
            <img
              alt="Community celebrating impact"
              className="h-full w-full object-cover object-center opacity-70"
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-900/80 to-brand-600/70" />
          </div>
          <div className="relative flex-1 space-y-6">
            <Eyebrow className="text-brand-100">Pan-African Mission</Eyebrow>
            <Heading className="text-white" level={1}>
              We co-create resilient futures with communities across Africa.
            </Heading>
            <Body className="max-w-xl text-white/80" variant="light">
              From schools and clinics to regenerative water systems and thriving micro-enterprises, Mawu Foundation invests in
              holistic impact ecosystems. This season we are activating a constellation of initiatives in Ghana’s Volta Region to
              prototype solutions ready to travel continent-wide.
            </Body>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="#donate">
                Fuel the mission
              </Button>
              <Button as="a" href="#volta" variant="secondary">
                Tour Volta initiatives
              </Button>
            </div>
          </div>
          <Card
            bleed
            className="relative flex flex-1 flex-col gap-4 border-white/15 bg-white/10 p-6 backdrop-blur"
          >
            <CaptionBlock title="Impact signals" />
            <div className="grid grid-cols-2 gap-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 p-4">
                  <p className={`text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
            <Body className="text-xs text-white/70" variant="light">
              Data refreshed quarterly with auditing partners to keep investors and supporters informed in real time.
            </Body>
          </Card>
        </Section>

        <Section background="tinted" id="volta">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Eyebrow>Seasonal Spotlight</Eyebrow>
              <Heading>Volta Region, Ghana</Heading>
            </div>
            <Body className="max-w-xl" variant="muted">
              A braided journey across education, health, water, and livelihoods—designed with chiefs, educators, and youth leaders
              to ensure dignity and sustainability.
            </Body>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {voltaInitiatives.map((initiative) => (
              <Card bleed className="group overflow-hidden" key={initiative.title}>
                <img
                  alt={initiative.title}
                  className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
                  src={initiative.image}
                />
                <div className="space-y-4 p-6">
                  <Heading className="text-xl" level={3}>
                    {initiative.title}
                  </Heading>
                  <Body variant="muted">{initiative.description}</Body>
                  <Button as="a" className="mt-2" href="#impact" size="sm" variant="ghost">
                    Explore impact
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="programs">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div className="space-y-6">
              <Eyebrow>Experience Design</Eyebrow>
              <Heading level={2}>A mission-driven experience for every supporter</Heading>
              <Body>
                We are building a digital ecosystem that meets donors, partners, and communities where they are. From real-time
                telemetry to immersive storytelling, every interaction is crafted to inspire trust and collective action.
              </Body>
              <div className="grid gap-6 sm:grid-cols-3">
                {experienceHighlights.map((highlight) => (
                  <Card className="text-center" key={highlight.title}>
                    <span aria-hidden className="text-3xl">
                      {highlight.icon}
                    </span>
                    <Heading className="text-lg" level={4}>
                      {highlight.title}
                    </Heading>
                    <Body variant="muted">{highlight.description}</Body>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="bg-gradient-to-br from-brand-500 via-brand-500/90 to-brand-700 text-white shadow-elevated">
              <CardHeader>
                <Heading className="text-white" level={3}>
                  Pan-African Impact Framework
                </Heading>
                <Body className="text-white/80">
                  Our integrated approach spans education, health, water, livelihoods, and climate resilience—sequenced with
                  communities to deliver lasting change.
                </Body>
              </CardHeader>
              <CardContent className="space-y-3 text-white/80">
                <ChecklistItem>Education studios igniting digital literacy and future-ready skills.</ChecklistItem>
                <ChecklistItem>Community health networks blending clinics, telemedicine, and mobile care.</ChecklistItem>
                <ChecklistItem>Water security corridors with regenerative infrastructure and training.</ChecklistItem>
                <ChecklistItem>Economic empowerment through microfinance, cooperatives, and creative hubs.</ChecklistItem>
              </CardContent>
              <CardFooter>
                <Button as="a" href="#donate" size="sm" variant="secondary">
                  Back the framework
                </Button>
                <Button as="a" href="#contact" size="sm" variant="ghost">
                  Partner with us
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <Section background="muted" id="shop">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Eyebrow>Impact Merch</Eyebrow>
              <Heading>Shop the foundation capsule</Heading>
            </div>
            <Body className="max-w-xl" variant="muted">
              Each purchase fuels community-designed initiatives. Limited-run drops celebrate local artisanship and regenerative
              materials.
            </Body>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {shopItems.map((item) => (
              <Card bleed className="group overflow-hidden" key={item.name}>
                <img
                  alt={item.name}
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                  src={item.image}
                />
                <div className="space-y-4 p-6">
                  <Heading className="text-xl" level={3}>
                    {item.name}
                  </Heading>
                  <Body variant="muted">{item.description}</Body>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-600">{item.price}</span>
                    <Button size="sm" variant="ghost">
                      Add to capsule
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section background="tinted" id="donate">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="space-y-6">
              <Eyebrow>Donate</Eyebrow>
              <Heading level={2}>Stripe-secured giving for immediate impact</Heading>
              <Body>
                Select a focus area, choose a one-time or recurring cadence, and receive transparent reporting in your inbox. Stripe
                handles secure payments today while we prepare to launch crypto, PayPal, bank transfer, and MoMo options soon.
              </Body>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">Donate with Stripe</Button>
                <Button size="lg" variant="ghost">
                  Coming soon: Crypto · PayPal · Bank · MoMo
                </Button>
              </div>
            </div>
            <Card className="bg-white/80 backdrop-blur">
              <CardHeader>
                <Heading level={3}>Ways to amplify change</Heading>
                <Body variant="muted">
                  Whether you are an individual donor or corporate ally, we tailor partnership tracks aligned to your goals.
                </Body>
              </CardHeader>
              <CardContent className="space-y-4">
                <ChecklistItem>Recurring donor circles with quarterly immersion briefings.</ChecklistItem>
                <ChecklistItem>Corporate collaborations for infrastructure and innovation pilots.</ChecklistItem>
                <ChecklistItem>Angel alliances underwriting rapid-response relief.</ChecklistItem>
              </CardContent>
              <CardFooter>
                <Button as="a" href="mailto:partnerships@mawufoundation.org" size="sm" variant="secondary">
                  Start a conversation
                </Button>
                <Button as="a" href="#newsletter" size="sm" variant="ghost">
                  Join newsletter
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Section>

        <footer className="bg-ink-900 py-16 text-white">
          <Container className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <Heading className="text-white" level={3}>
                Stay connected to the movement
              </Heading>
              <Body className="text-white/75" variant="light">
                Receive quarterly impact letters, volunteering opportunities, and regional expansion news as we scale across
                Africa.
              </Body>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  className="h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/60 focus:border-brand-200 focus:ring-brand-200 focus:outline-none"
                  id="newsletter-email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button size="md" type="submit" variant="secondary">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-white/50">
                © {new Date().getFullYear()} Mawu Foundation. Crafted for investor previews—content subject to change.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm text-white/80 sm:grid-cols-3">
              <div className="space-y-3">
                <p className="font-semibold uppercase tracking-[0.18em] text-white/60">Explore</p>
                <a className="transition hover:text-brand-200" href="#vision">
                  Vision
                </a>
                <a className="transition hover:text-brand-200" href="#volta">
                  Volta focus
                </a>
                <a className="transition hover:text-brand-200" href="#programs">
                  Programs
                </a>
              </div>
              <div className="space-y-3">
                <p className="font-semibold uppercase tracking-[0.18em] text-white/60">Engage</p>
                <a className="transition hover:text-brand-200" href="#donate">
                  Donate
                </a>
                <a className="transition hover:text-brand-200" href="#shop">
                  Shop
                </a>
                <a className="transition hover:text-brand-200" href="#newsletter">
                  Newsletter
                </a>
              </div>
              <div className="space-y-3">
                <p className="font-semibold uppercase tracking-[0.18em] text-white/60">Connect</p>
                <a className="transition hover:text-brand-200" href="mailto:hello@mawufoundation.org">
                  hello@mawufoundation.org
                </a>
                <a className="transition hover:text-brand-200" href="tel:+233000000000">
                  +233 000 000 000
                </a>
                <a className="transition hover:text-brand-200" href="#transparency">
                  Transparency hub
                </a>
              </div>
            </div>
          </Container>
        </footer>
      </main>
    </div>
  );
};

const ChecklistItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-3 text-sm text-ink-600">
    <span aria-hidden className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
      ✓
    </span>
    <span className="flex-1 text-left text-ink-700">{children}</span>
  </div>
);

const CaptionBlock = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">{title}</p>
    <span className="text-xs text-white/60">Live insights</span>
  </div>
);

export default App;
