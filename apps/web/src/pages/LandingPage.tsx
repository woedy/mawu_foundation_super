import { Link } from "react-router-dom";

import { Body, Button, Card, Eyebrow, Heading, Section } from "../design-system";
import { fallbackProgramsPayload } from "../data/programs-fallback";

const heroStats = [
  {
    label: "Countries collaborating",
    value: "11",
    description: "Grassroots partners spanning West, East, and Southern Africa advancing shared blueprints.",
  },
  {
    label: "Residents reached",
    value: "42k",
    description: "Families across the continent supported with health, education, and climate resources.",
  },
  {
    label: "Seasonal pilots",
    value: "9",
    description: "Volta Region initiatives stress-testing solutions before scaling to new regions.",
  },
];

const strategicPillars = [
  {
    eyebrow: "Community-first",
    title: "We listen before we build",
    description:
      "Every initiative is co-designed with local leaders so investments strengthen existing wisdom and power community ownership.",
    to: "/vision",
    cta: "Explore our vision",
  },
  {
    eyebrow: "Integrated systems",
    title: "Programs unlock each other",
    description:
      "Education, health, climate resilience, and livelihoods connect as one ecosystem to keep families thriving long term.",
    to: "/programs",
    cta: "See active programs",
  },
  {
    eyebrow: "Radical transparency",
    title: "Supporters stay informed",
    description:
      "Field diaries, budgets, and open dashboards keep donors and partners aligned with community priorities.",
    to: "/stories",
    cta: "Read latest updates",
  },
];

const engagementActions = [
  {
    title: "Fuel resilient futures",
    description:
      "Back the seasonal priorities in Ghana's Volta Region and help prove models ready to scale across the continent.",
    primaryCta: { label: "Donate now", to: "/donate" },
    secondaryCta: { label: "Why your gift matters", to: "/vision" },
  },
  {
    title: "Shop the movement",
    description:
      "Our limited-run merch celebrates artists and makers who champion equitable development across Africa.",
    primaryCta: { label: "Browse the shop", to: "/shop" },
    secondaryCta: { label: "Meet the creators", to: "/stories" },
  },
  {
    title: "Amplify community voices",
    description:
      "Hear from ambassadors, volunteers, and beneficiaries who shape our roadmap and keep us accountable.",
    primaryCta: { label: "Visit voices hub", to: "/voices" },
    secondaryCta: { label: "Share your story", to: "/stories" },
  },
];

const highlightPrograms = [
  fallbackProgramsPayload.programs[0], // Volta Learning Labs
  fallbackProgramsPayload.programs[1], // Riverine Health Bridge
  fallbackProgramsPayload.programs[4]  // Digital Empowerment Labs (IT & Digital Literacy)
];

export const LandingPage = () => (
  <>
    <Section
      as="header"
      background="inverted"
      className="relative overflow-hidden py-20 -mx-4 md:-mx-6 lg:-mx-8 px-0"
      containerClassName="relative z-10 grid gap-12 lg:grid-cols-[1.4fr,1fr] lg:items-center max-w-none"
    >
      {/* Background image */}
      <div className="absolute inset-0 -inset-x-4 md:-inset-x-6 lg:-inset-x-8 -top-20 -bottom-20 sm:-top-24 sm:-bottom-24">
        <img
          alt="Beautiful African landscape with golden sunset"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1738860283720-baaf8c8418b8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          loading="eager"
        />
      </div>
      

      
      {/* Gradient overlay */}
      <div className="absolute inset-0 -top-20 -bottom-20 sm:-top-24 sm:-bottom-24 bg-gradient-to-br from-ink-900/90 via-ink-900/60 to-brand-700/50" />
      
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-24 top-0 hidden h-96 w-96 rounded-full bg-brand-500/25 blur-3xl lg:block" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-sand-300/20 blur-3xl" />

      {/* Cultural motif elements */}
      <div className="pointer-events-none absolute left-8 top-32 hidden h-16 w-16 rounded-full border-2 border-brand-200/30 lg:block" style={{background: 'conic-gradient(from 0deg, transparent 0deg, #f59e0b20 90deg, transparent 180deg)'}}></div>
      <div className="pointer-events-none absolute right-16 top-48 hidden h-12 w-12 rounded-full border border-white/20 lg:block" style={{background: 'radial-gradient(circle, #10b98130 0%, transparent 70%)'}}></div>
      <div className="relative space-y-8">
        <Eyebrow className="text-brand-100">Arts & Culture • Spiritual Guidance • Pan-African Service • Volta Region Season</Eyebrow>
        <Heading className="text-balance text-white" level={1}>
          Scale community power across Africa
        </Heading>
        <Body className="max-w-2xl text-lg" variant="light">
          Born from the union of artists, cultural custodians, spiritual guides, educators, and technologists across Africa, Mawu Foundation embodies the collective spirit of humanitarian service. We advance arts and culture, spiritual wellbeing, quality education, IT literacy, and comprehensive charity work throughout the continent. This season, our diverse teams unite in Ghana's Volta Region, delivering holistic humanitarian services across health, education, water access, economic empowerment, cultural preservation, and spiritual support—creating models that will inspire pan-African transformation.
        </Body>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button as={Link} size="lg" to="/donate" variant="primary">
            Donate today
          </Button>
          <Button as={Link} size="lg" to="/programs" variant="secondary">
            Explore our programs
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heroStats.map((stat) => (
            <div
              className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur"
              key={stat.label}
            >
              <p className="text-3xl font-semibold text-white sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-100/80">
                {stat.label}
              </p>
              <Body className="mt-3 text-sm text-white/70" variant="light">
                {stat.description}
              </Body>
            </div>
          ))}
        </div>
      </div>
      <Card className="relative overflow-hidden border-white/20 bg-white/95 text-ink-900 shadow-elevated">
        <div className="pointer-events-none absolute -top-20 right-0 h-52 w-52 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="relative space-y-4">
          <Eyebrow>Impact spotlight</Eyebrow>
          <Heading level={3}>Your support powers lasting change across Africa</Heading>
          <Body variant="muted">
            See how gifts translate into thriving schools, healthier families, and resilient livelihoods. Every donation is
            stewarded alongside community leaders to ensure progress that outlives our interventions and readies expansion to
            new regions.
          </Body>
          <ul className="mt-6 space-y-4 text-sm text-ink-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              <div>
                <Link className="font-semibold text-ink-800 transition hover:text-brand-600" to="/volta-focus">
                  Clean water restored
                </Link>
                <p className="text-ink-600">
                  Solar pumping stations now serve 9 river communities with reliable drinking water and irrigation, laying the
                  groundwork for similar upgrades in Malawi and Côte d'Ivoire.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              <div>
                <Link className="font-semibold text-ink-800 transition hover:text-brand-600" to="/programs">
                  Students back in class
                </Link>
                <p className="text-ink-600">
                  Mobile learning hubs provide tutoring, meals, and digital literacy to 1,200 young people each term with
                  roadmaps ready for partners in Tanzania and Nigeria.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
              <div>
                <Link className="font-semibold text-ink-800 transition hover:text-brand-600" to="/stories">
                  Farmers earning more
                </Link>
                <p className="text-ink-600">
                  Climate-smart training and cooperative financing lifted yields by 38% during the last harvest season and are
                  being adapted with partners in Uganda and Rwanda.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </Card>
    </Section>

    <Section>
      <div className="grid gap-8 lg:grid-cols-[3fr,2fr] lg:items-center">
        <div className="space-y-6">
          <Eyebrow>Our foundation</Eyebrow>
          <Heading level={2}>A holistic approach to dignity, opportunity, and cultural preservation</Heading>
          <Body className="text-lg text-ink-700" variant="muted">
            Mawu Foundation emerges from the collective wisdom of artists, cultural custodians, spiritual leaders, educators, and technologists across Africa. We advance arts and culture, spiritual wellbeing, quality education, IT literacy, and comprehensive humanitarian services throughout the continent. This season, our diverse teams—representing many faiths, artistic traditions, and technical expertise—unite in Ghana's Volta Region, delivering holistic support across health, education, water access, economic empowerment, cultural preservation, and spiritual guidance, creating models that honor both tradition and innovation.
          </Body>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/volta-focus">
              See the Volta roadmap
            </Button>
            <Button as={Link} to="/programs" variant="secondary">
              Browse programs
            </Button>
          </div>
        </div>
        <Card className="border-brand-100/60 bg-brand-50/60">
          <Eyebrow className="text-brand-600">Core commitments</Eyebrow>
          <Heading className="text-xl">Designed with accountability at the center</Heading>
          <Body variant="muted">
            We pair every investment with local stewardship committees, shared dashboards, and public updates so supporters see
            the full journey from planning through maintenance across every geography we enter.
          </Body>
        </Card>
      </div>
    </Section>

    <Section background="tinted">
      <div className="space-y-10">
        <div className="text-center">
          <Eyebrow>Our approach</Eyebrow>
          <Heading level={2}>Built with trust, co-creation, and measurable outcomes</Heading>
          <Body className="mx-auto mt-4 max-w-3xl" variant="muted">
            Dive deeper into the philosophy guiding every partnership. These pillars help supporters understand why Mawu Foundation
            continues to earn community trust across the continent.
          </Body>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {strategicPillars.map((pillar) => (
            <Card className="flex h-full flex-col justify-between border border-brand-100/70 bg-white/80" key={pillar.title}>
              <div className="space-y-4">
                <Eyebrow>{pillar.eyebrow}</Eyebrow>
                <Heading className="text-2xl" level={3}>
                  {pillar.title}
                </Heading>
                <Body variant="muted">{pillar.description}</Body>
              </div>
              <Button as={Link} className="mt-6 self-start" to={pillar.to} variant="tertiary">
                {pillar.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Section>

    <Section background="muted">
      <div className="grid gap-8 lg:grid-cols-[2fr,3fr] lg:items-stretch">
        <Card
          bleed
          className="relative flex min-h-[20rem] flex-col justify-end overflow-hidden border-ink-100/60 bg-ink-900"
        >
          <img
            alt="Illustrated Volta Region community fields"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src="https://images.unsplash.com/photo-1680200023508-5289ae3de157?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <div className="relative space-y-4 p-8 text-white">
            <Eyebrow className="text-brand-100">Season focus</Eyebrow>
            <Heading level={3}>
              Volta Region pilots model the resilience we aim to scale continent-wide
            </Heading>
            <Body variant="light">
              Navigate floating classrooms, riverine health bridges, and regenerative water systems that are co-funded with
              local cooperatives. Each program is a blueprint for what the rest of Africa can adapt next.
            </Body>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/volta-focus">
                Tour focus area
              </Button>
              <Button as={Link} to="/stories" variant="secondary">
                Read field updates
              </Button>
            </div>
          </div>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          {highlightPrograms.map((program) => (
            <Card className="flex h-full flex-col border border-ink-100/60 bg-white/90" key={program.slug}>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900/5">
                <img
                  alt={program.title}
                  className="h-full w-full object-cover"
                  src={program.heroImage}
                />
              </div>
              <div className="mt-6 space-y-3">
                <Eyebrow>{program.category}</Eyebrow>
                <Heading className="text-xl" level={3}>
                  {program.title}
                </Heading>
                <Body variant="muted">{program.summary}</Body>
              </div>
              <Button as={Link} className="mt-6 self-start" to="/programs" variant="secondary">
                Explore in programs
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Section>

    <Section>
      <div className="grid gap-8 lg:grid-cols-[3fr,2fr] lg:items-center">
        <div className="space-y-4">
          <Eyebrow>Stories & voices</Eyebrow>
          <Heading level={2}>Transparency is a practice, not a page</Heading>
          <Body className="text-lg text-ink-700" variant="muted">
            From in-depth narratives to rapid voice notes, we invite stakeholders into the process. Meet volunteers, parents,
            health workers, and artisans who hold us accountable to the outcomes we promise.
          </Body>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/stories">
              Discover stories
            </Button>
            <Button as={Link} to="/voices" variant="secondary">
              Hear community voices
            </Button>
          </div>
        </div>
        <Card className="border-ink-100/60 bg-white/90">
          <Eyebrow>Why stories matter</Eyebrow>
          <Body variant="muted">
            The Stories and Voices libraries elevate the people behind every statistic—parents, volunteers, health workers, and
            artisans who protect the progress we celebrate together.
          </Body>
          <Body className="mt-4 text-sm text-ink-500">
            Follow their journeys to understand how resources are used, what challenges remain, and where partnership can unlock
            the next wave of impact across the Volta basin.
          </Body>
        </Card>
      </div>
    </Section>

    <Section background="tinted">
      <div className="space-y-10">
        <div className="text-center">
          <Eyebrow>Get involved</Eyebrow>
          <Heading level={2}>Choose how you will help write the next chapter</Heading>
          <Body className="mx-auto mt-4 max-w-3xl" variant="muted">
            Whether you give, advocate, or collaborate, there is a clear pathway to stand with the communities shaping a more
            just future across the Volta basin and the continent it inspires.
          </Body>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {engagementActions.map((action) => (
            <Card className="flex h-full flex-col justify-between border border-brand-100/70 bg-white/90" key={action.title}>
              <div className="space-y-4">
                <Heading className="text-2xl" level={3}>
                  {action.title}
                </Heading>
                <Body variant="muted">{action.description}</Body>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button as={Link} to={action.primaryCta.to}>
                  {action.primaryCta.label}
                </Button>
                <Button as={Link} to={action.secondaryCta.to} variant="tertiary">
                  {action.secondaryCta.label}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  </>
);

