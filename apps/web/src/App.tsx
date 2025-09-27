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

  const shellPadding = 'px-6 sm:px-8 lg:px-12';
  const container = `mx-auto w-full max-w-[120rem] ${shellPadding}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-50 via-white to-sand-100 text-ink-900">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-lg">
        <nav className={`${container} flex items-center justify-between py-4`}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-semibold text-white shadow-soft">
              MF
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-ink-900">Mawu Foundation</p>
              <p className="text-xs uppercase tracking-[0.24em] text-ink-400">Humanity in Motion</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm font-semibold text-ink-600 md:flex">
            <a className="transition hover:text-brand-600" href="#vision">
              Vision
            </a>
            <a className="transition hover:text-brand-600" href="#volta">
              Volta Focus
            </a>
            <a className="transition hover:text-brand-600" href="#programs">
              Programs
            </a>
            <a className="transition hover:text-brand-600" href="#shop">
              Shop
            </a>
            <a className="transition hover:text-brand-600" href="#donate">
              Donate
            </a>
          </div>
          <a
            className="rounded-full bg-brand-500 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-brand-600"
            href="#donate"
          >
            Give Today
          </a>
        </nav>
      </header>

      <main className="flex flex-col gap-20 pb-24">
        <section id="vision" className="relative w-full overflow-hidden bg-ink-900 text-white shadow-soft">
          <div className="absolute inset-0">
            <img
              alt="Community celebrating impact"
              className="h-full w-full object-cover object-center opacity-70"
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-900/80 to-brand-600/70" />
          </div>
          <div className={`${container} relative flex flex-col gap-12 pb-16 pt-28 lg:flex-row lg:items-end lg:gap-16`}>
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-100">
                Pan-African Mission
              </span>
              <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                We co-create resilient futures with communities across Africa.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-white/80">
                From schools and clinics to regenerative water systems and thriving micro-enterprises, Mawu Foundation invests in
                holistic impact ecosystems. This season we are activating a constellation of initiatives in Ghana’s Volta Region to
                prototype solutions ready to travel continent-wide.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  className="rounded-full bg-brand-500 px-7 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-brand-600"
                  href="#donate"
                >
                  Fuel the mission
                </a>
                <a
                  className="rounded-full border border-white/40 px-7 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white transition hover:border-brand-300 hover:text-brand-100"
                  href="#volta"
                >
                  Tour Volta initiatives
                </a>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100">Impact signals</p>
              <div className="grid grid-cols-2 gap-4">
                {impactStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 p-4">
                    <p className={`text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/70">
                Data refreshed quarterly with auditing partners to keep investors and supporters informed in real time.
              </p>
            </div>
          </div>
        </section>

        <section
          id="volta"
          className={`${container} flex flex-col gap-12 rounded-[2.5rem] bg-white/70 p-10 shadow-soft`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Seasonal Spotlight</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 md:text-4xl">Volta Region, Ghana</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-ink-600">
              A braided journey across education, health, water, and livelihoods—designed with chiefs, educators, and youth leaders
              to ensure dignity and sustainability.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {voltaInitiatives.map((initiative) => (
              <article
                key={initiative.title}
                className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft/40"
              >
                <img
                  alt={initiative.title}
                  className="h-48 w-full object-cover transition duration-700 group-hover:scale-105"
                  src={initiative.image}
                />
                <div className="space-y-4 p-6">
                  <h3 className="font-display text-xl font-semibold text-ink-900">{initiative.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-600">{initiative.description}</p>
                  <a className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600" href="#impact">
                    Explore the story <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="programs" className={`relative ${container} overflow-hidden rounded-[2.5rem]`}>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/15 via-sand-100 to-white" />
          <div className="relative grid gap-12 p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Core Programs</p>
              <h2 className="font-display text-3xl font-semibold text-ink-900 md:text-4xl">
                A network of programs designed to unlock possibility at every life stage.
              </h2>
              <p className="text-sm leading-relaxed text-ink-600">
                Education, health, water, economic empowerment, and community development interweave to form a resilient support
                lattice. Each initiative is designed to scale across regions with context-aware adaptations.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {experienceHighlights.map((highlight) => (
                  <div key={highlight.title} className="rounded-2xl border border-brand-500/20 bg-white/60 p-5 shadow-soft/30">
                    <div className="text-2xl">{highlight.icon}</div>
                    <h3 className="mt-3 text-lg font-semibold text-ink-900">{highlight.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-8 shadow-soft">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">How you can engage</p>
                <ul className="space-y-3 text-sm leading-relaxed text-ink-600">
                  <li>
                    <span className="font-semibold text-ink-900">Invest:</span> Sponsor solar classrooms, medical outreach, or
                    community finance labs via flexible giving tiers.
                  </li>
                  <li>
                    <span className="font-semibold text-ink-900">Collaborate:</span> Co-design pilot programs with universities,
                    NGOs, and social enterprises seeking regional partners.
                  </li>
                  <li>
                    <span className="font-semibold text-ink-900">Volunteer:</span> Contribute skills remotely or on the ground—from
                    UX research to health screenings and mentorship.
                  </li>
                </ul>
              </div>
              <a
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-brand-600"
                href="#get-involved"
              >
                View engagement pathways <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="shop"
          className={`${container} space-y-10 rounded-[2.5rem] bg-ink-900 px-10 py-14 text-white shadow-soft`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-100">Foundation Merch</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Shop the impact-forward capsule</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              Each piece funds a critical project milestone—from teacher training kits to water quality labs—so you can wear your
              impact proudly.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {shopItems.map((item) => (
              <article key={item.name} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <img
                  alt={item.name}
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                  src={item.image}
                />
                <div className="space-y-3 p-6">
                  <h3 className="font-display text-lg font-semibold text-white">{item.name}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{item.description}</p>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{item.price}</span>
                    <button className="rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-white/20">
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="donate"
          className={`${container} flex flex-col items-center gap-6 rounded-[2.5rem] bg-white px-10 py-14 text-center shadow-soft`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">Stripe-enabled Giving</p>
          <h2 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Ready to activate hope? Join the movement with a secure Stripe donation.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-600">
            Choose one-time or recurring contributions, receive impact updates tailored to your interests, and unlock exclusive
            access to immersive field briefings.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-soft transition hover:bg-brand-600"
              href="/donate"
            >
              Donate with Stripe
            </a>
            <a
              className="rounded-full border border-ink-200 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-ink-700 transition hover:border-brand-400 hover:text-brand-600"
              href="#get-involved"
            >
              Other ways to engage
            </a>
          </div>
          <div className="flex flex-col items-center gap-2 text-xs text-ink-500">
            <p>Crypto · PayPal · Bank Transfer · Mobile Money — Coming Soon</p>
            <p>All transactions encrypted and audited with global compliance partners.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-100/40 bg-white/70 px-6 py-8 2xl:px-10">
        <div className={`${container} flex flex-col gap-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <p className="font-semibold text-ink-700">© {new Date().getFullYear()} Mawu Foundation</p>
            <p>Building regenerative impact across Africa with radical transparency.</p>
          </div>
          <div className="flex flex-col items-start gap-2 text-xs text-ink-400 sm:items-end">
            <span className="font-semibold text-ink-600">Stripe active</span>
            <span>Crypto · PayPal · Bank Transfer · Mobile Money — Coming Soon</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
