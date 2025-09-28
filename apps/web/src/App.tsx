import { useEffect, useMemo, useState } from 'react';
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
import { fallbackProgramsPayload } from './data/programs-fallback';
import { cn } from './lib/cn';
import type {
  ProgramDetail,
  ProgramFilter,
  ProgramFocus,
  ProgramsPayload
} from './types/programs';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';


const App = () => {
  const [programsPayload, setProgramsPayload] = useState<ProgramsPayload | null>(null);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);
  const [programsError, setProgramsError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProgramFilter>('All');
  const [selectedProgramSlug, setSelectedProgramSlug] = useState<string | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<ProgramFocus>('volta');

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const loadPrograms = async () => {
      try {
        setProgramsLoading(true);
        const response = await fetch(`${API_BASE_URL}/programs`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as ProgramsPayload;

        if (!isActive) {
          return;
        }

        setProgramsPayload(payload);
        setProgramsError(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error('Failed to load program data', error);
        setProgramsPayload(fallbackProgramsPayload);
        setProgramsError(
          'Live program insights are unavailable, so we are showing a demo snapshot instead. Start the API to see the latest data.'
        );
      } finally {
        if (isActive) {
          setProgramsLoading(false);
        }
      }
    };

    void loadPrograms();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!programsPayload) {
      return;
    }

    setSelectedProgramSlug((current) => {
      if (current && programsPayload.programs.some((program) => program.slug === current)) {
        return current;
      }

      return programsPayload.programs[0]?.slug ?? null;
    });

    setSelectedFocus((current) => {
      if (programsPayload.regions.some((region) => region.id === current)) {
        return current;
      }

      return programsPayload.regions[0]?.id ?? current;
    });
  }, [programsPayload]);

  const categories = useMemo(() => programsPayload?.categories ?? [], [programsPayload]);
  const programs = useMemo(() => programsPayload?.programs ?? [], [programsPayload]);
  const regions = useMemo(() => programsPayload?.regions ?? [], [programsPayload]);
  const metrics = useMemo(() => programsPayload?.impactMetrics ?? [], [programsPayload]);

  const filteredPrograms = useMemo(() => {
    if (!programs.length) {
      return [] as ProgramDetail[];
    }

    if (selectedCategory === 'All') {
      return programs;
    }

    return programs.filter((program) => program.category === selectedCategory);
  }, [programs, selectedCategory]);

  useEffect(() => {
    if (!filteredPrograms.length) {
      return;
    }

    if (!selectedProgramSlug || !filteredPrograms.some((program) => program.slug === selectedProgramSlug)) {
      setSelectedProgramSlug(filteredPrograms[0].slug);
    }
  }, [filteredPrograms, selectedProgramSlug]);

  const activeRegion = useMemo(() => {
    if (!regions.length) {
      return null;
    }

    return regions.find((region) => region.id === selectedFocus) ?? regions[0];
  }, [regions, selectedFocus]);

  const selectedProgram = useMemo(() => {
    if (!programs.length) {
      return null;
    }

    if (selectedProgramSlug) {
      const match = programs.find((program) => program.slug === selectedProgramSlug);
      if (match) {
        return match;
      }
    }

    if (filteredPrograms.length) {
      return filteredPrograms[0];
    }

    return programs[0];
  }, [filteredPrograms, programs, selectedProgramSlug]);

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
          <div className="flex flex-col gap-12">
            <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div className="space-y-6">
                <Eyebrow>Programs &amp; Impact Explorer</Eyebrow>
                <Heading level={2}>Navigate the initiatives powering Mawu Foundation</Heading>
                <Body>
                  Discover how continent-spanning visions connect with our current Volta Region pilots. Filter by impact area,
                  explore focus regions, and dive into program narratives sourced directly from our field teams.
                </Body>
                <div
                  aria-label="Select focus region"
                  className="flex flex-wrap gap-3"
                  role="group"
                >
                  {regions.map((region) => (
                    <Button
                      key={region.id}
                      aria-pressed={activeRegion?.id === region.id}
                      onClick={() => setSelectedFocus(region.id)}
                      size="sm"
                      variant={activeRegion?.id === region.id ? 'primary' : 'ghost'}
                    >
                      {region.name}
                    </Button>
                  ))}
                </div>
              </div>
              <Card className="overflow-hidden border border-ink-100/60 bg-white/80 shadow-soft">
                {activeRegion ? (
                  <>
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        alt={activeRegion.hero.alt}
                        className="h-full w-full object-cover"
                        src={activeRegion.hero.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Seasonal focus</p>
                        <p className="mt-2 text-xl font-semibold">{activeRegion.name}</p>
                      </div>
                    </div>
                    <CardContent className="space-y-5">
                      <Body variant="muted">{activeRegion.description}</Body>
                      <div className="flex flex-wrap gap-6 text-sm font-semibold text-brand-700">
                        {activeRegion.stats.map((stat) => (
                          <div key={stat.label} className="flex flex-col">
                            <span className="text-2xl text-ink-900">{stat.value}</span>
                            <span className="text-xs uppercase tracking-[0.2em] text-ink-400">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-400">Current priorities</p>
                        <ul className="mt-3 space-y-2 text-sm text-ink-700">
                          {activeRegion.priorities.map((priority) => (
                            <li key={priority} className="flex gap-3">
                              <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                              <span>{priority}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="space-y-3">
                    <Heading level={3}>Loading focus regions…</Heading>
                    <Body variant="muted">Hold tight while we prepare the explorer.</Body>
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {programsError ? (
                <Card className="md:col-span-2 xl:col-span-4 border border-red-200 bg-red-50/70">
                  <CardContent className="space-y-2">
                    <Heading className="text-red-700" level={4}>
                      We could not reach the live impact service
                    </Heading>
                    <Body className="text-red-600" variant="muted">
                      {programsError}
                    </Body>
                  </CardContent>
                </Card>
              ) : null}
              {metrics.length
                ? metrics.map((metric) => (
                    <Card className="border border-ink-100/60 bg-white/80 p-6 shadow-soft" key={metric.label}>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-400">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-brand-700">{metric.value}</p>
                      {metric.trend ? (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{metric.trend}</p>
                      ) : null}
                      {metric.description ? (
                        <Body className="mt-3 text-xs" variant="muted">
                          {metric.description}
                        </Body>
                      ) : null}
                    </Card>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <Card
                      className="animate-pulse border border-ink-100/50 bg-white/60 p-6"
                      key={`metric-skeleton-${index}`}
                    >
                      <div className="h-3 w-24 rounded-full bg-ink-200/60" />
                      <div className="mt-4 h-8 w-32 rounded-full bg-brand-200/60" />
                      <div className="mt-5 h-3 w-full rounded-full bg-ink-100/60" />
                    </Card>
                  ))}
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-400">Filter by impact area</p>
                <div
                  aria-label="Filter programs by category"
                  className="mt-4 flex flex-wrap gap-3"
                  role="group"
                >
                  {['All', ...categories].map((category) => (
                    <Button
                      key={category}
                      aria-pressed={selectedCategory === category}
                      onClick={() => setSelectedCategory(category as ProgramFilter)}
                      size="sm"
                      variant={selectedCategory === category ? 'primary' : 'ghost'}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div className="space-y-4">
                  {programsLoading && !filteredPrograms.length ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Card className="animate-pulse border border-ink-100/50 bg-white/70 p-6" key={`program-skeleton-${index}`}>
                        <div className="h-4 w-2/3 rounded-full bg-ink-200/60" />
                        <div className="mt-3 h-3 w-1/2 rounded-full bg-ink-100/60" />
                        <div className="mt-4 h-3 w-full rounded-full bg-ink-100/60" />
                      </Card>
                    ))
                  ) : filteredPrograms.length ? (
                    filteredPrograms.map((program) => (
                      <Card
                        className={cn(
                          'border border-ink-100/60 bg-white/80 p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated focus-within:border-brand-400',
                          selectedProgram?.slug === program.slug && 'border-brand-500 shadow-elevated'
                        )}
                        key={program.slug}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Heading className="text-xl" level={3}>
                            {program.title}
                          </Heading>
                          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                            {program.category}
                          </span>
                        </div>
                        <Body className="mt-3" variant="muted">
                          {program.summary}
                        </Body>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-brand-700">
                          <span>{program.spotlightStatistic}</span>
                          <span className="rounded-full bg-ink-900/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                            {program.focus === 'volta' ? 'Volta Focus' : 'Pan-African'}
                          </span>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <Button
                            onClick={() => setSelectedProgramSlug(program.slug)}
                            size="sm"
                            variant={selectedProgram?.slug === program.slug ? 'primary' : 'ghost'}
                          >
                            Preview story
                          </Button>
                          <Button as="a" href={`#program-${program.slug}`} size="sm" variant="secondary">
                            Read full narrative
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="border border-ink-100/60 bg-white/70">
                      <CardContent>
                        <Body variant="muted">No programs match this filter yet.</Body>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <div>
                  {selectedProgram ? (
                    <Card className="overflow-hidden border border-ink-100/60 bg-white/80 shadow-elevated">
                      <div className="relative h-64 w-full overflow-hidden">
                        <img
                          alt={selectedProgram.title}
                          className="h-full w-full object-cover"
                          src={selectedProgram.heroImage}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Impact spotlight</p>
                          <p className="mt-2 text-lg font-semibold">{selectedProgram.spotlightStatistic}</p>
                        </div>
                      </div>
                      <CardContent className="space-y-4">
                        <Heading className="text-2xl" level={3}>
                          {selectedProgram.title}
                        </Heading>
                        <Body variant="muted">{selectedProgram.summary}</Body>
                        <blockquote className="rounded-2xl bg-brand-50/80 p-4 text-sm text-brand-800">
                          <p className="italic">“{selectedProgram.highlightQuote.quote}”</p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                            {selectedProgram.highlightQuote.attribution}
                          </p>
                        </blockquote>
                        <div className="flex flex-wrap gap-3">
                          <Button as="a" href={`#program-${selectedProgram.slug}`} size="sm" variant="secondary">
                            Deep dive into the program
                          </Button>
                          <Button as="a" href="#donate" size="sm" variant="ghost">
                            Fund this initiative
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border border-ink-100/60 bg-white/70">
                      <CardContent>
                        <Body variant="muted">Select a program to preview its story.</Body>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {experienceHighlights.map((highlight) => (
                <Card className="text-center" key={highlight.title}>
                  <span aria-hidden className="text-3xl">{highlight.icon}</span>
                  <Heading className="text-lg" level={4}>
                    {highlight.title}
                  </Heading>
                  <Body variant="muted">{highlight.description}</Body>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {programs.map((program) => (
          <ProgramDetailSection key={program.slug} program={program} />
        ))}

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

const ProgramDetailSection = ({ program }: { program: ProgramDetail }) => (
  <Section
    background={program.focus === 'volta' ? 'tinted' : 'default'}
    id={`program-${program.slug}`}
    paddedContainer
  >
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
      <div className="space-y-6">
        <Eyebrow>{program.category}</Eyebrow>
        <Heading level={2}>{program.title}</Heading>
        <Body>{program.excerpt}</Body>
        <Card className="overflow-hidden shadow-soft">
          <img alt={program.title} className="h-64 w-full object-cover" src={program.heroImage} />
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Season highlight</p>
            <p className="mt-2 text-lg font-semibold text-brand-700">{program.spotlightStatistic}</p>
          </div>
        </Card>
        <div className="space-y-4">
          <Heading className="text-lg" level={3}>
            Outcomes this season
          </Heading>
          <ul className="space-y-2 text-sm text-ink-700">
            {program.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-2 w-2 rounded-full bg-brand-500" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <Heading className="text-lg" level={3}>
            Program narrative
          </Heading>
          {program.narrative.map((paragraph, index) => (
            <Body key={index} variant="muted">
              {paragraph}
            </Body>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Card className="bg-ink-900 text-white shadow-soft">
          <CardContent className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200/80">Community voice</p>
            <p className="text-lg leading-relaxed text-white/90 italic">“{program.highlightQuote.quote}”</p>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100/90">
              {program.highlightQuote.attribution}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader>
            <Heading className="text-lg" level={3}>
              Support pathways
            </Heading>
            <Body variant="muted">Choose how you want to participate.</Body>
          </CardHeader>
          <CardContent className="space-y-3">
            {program.ctas.map((cta) => (
              <div key={cta.label} className="space-y-1">
                <Button
                  as="a"
                  href={cta.href}
                  size="sm"
                  variant={cta.tone === 'primary' ? 'primary' : 'secondary'}
                >
                  {cta.label}
                </Button>
                {cta.description ? (
                  <p className="text-xs text-ink-500">{cta.description}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardHeader>
            <Heading className="text-lg" level={3}>
              Field gallery
            </Heading>
          </CardHeader>
          <CardContent className="grid gap-3">
            {program.gallery.map((image) => (
              <div key={image.src} className="overflow-hidden rounded-2xl">
                <img alt={image.alt} className="h-40 w-full object-cover" src={image.src} />
                <p className="mt-2 text-xs text-ink-500">{image.alt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
);

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
