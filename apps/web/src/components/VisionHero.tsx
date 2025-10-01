import { Link } from "react-router-dom";

import { Body, Button, Card, Eyebrow, Heading, Section } from "../design-system";

const impactStats = [
  {
    label: "Communities served across Africa",
    value: "48",
    accent: "bg-brand-500/20 text-brand-100",
  },
  {
    label: "People gaining daily access to clean water",
    value: "32K",
    accent: "bg-white/10 text-white",
  },
  {
    label: "Youth enrolled in future-ready classrooms",
    value: "12.4K",
    accent: "bg-brand-500/20 text-brand-100",
  },
  {
    label: "Volunteers mobilised this season",
    value: "2.1K",
    accent: "bg-white/10 text-white",
  },
];

const CaptionBlock = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-100">
      {title}
    </p>
    <span className="text-xs text-white/60">Live insights</span>
  </div>
);

export const VisionHero = ({
  showMetrics = false,
}: {
  showMetrics?: boolean;
}) => (
  <Section
    background="inverted"
    bleed
    className="overflow-hidden shadow-soft"
    containerClassName="relative flex flex-col gap-12 pb-16 pt-28 lg:flex-row lg:items-end lg:gap-16"
    padding="none"
  >
    <div className="absolute inset-0">
      <img
        alt="Community celebrating impact"
        className="h-full w-full object-cover object-center opacity-70"
        src="https://images.unsplash.com/photo-1740986188963-f99c42d5bad4?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900/60 via-ink-900/50 to-brand-600/40" />
    </div>
    <div className="relative flex-1 space-y-6">
      <Eyebrow className="text-brand-100">Pan-African Mission</Eyebrow>
      <Heading className="text-white" level={1}>
        We co-create resilient futures with communities across Africa.
      </Heading>
      <Body className="max-w-xl text-white/80" variant="light">
        From schools and clinics to regenerative water systems and thriving
        micro-enterprises, Mawu Foundation invests in holistic impact
        ecosystems. This season we are activating a constellation of initiatives
        in Ghana's Volta Region to prototype solutions ready to travel
        continent-wide.
      </Body>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button as={Link} to="/donate">
          Fuel the mission
        </Button>
        <Button as={Link} to="/volta-focus" variant="secondary">
          Tour Volta initiatives
        </Button>
      </div>
    </div>
    {showMetrics ? (
      <Card
        bleed
        className="relative flex flex-1 flex-col gap-4 border-white/15 bg-white/10 p-6 backdrop-blur"
      >
        <CaptionBlock title="Impact signals" />
        <div className="grid grid-cols-2 gap-4">
          {impactStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 p-4">
              <p className={`text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <Body className="text-xs text-white/70" variant="light">
          Data refreshed quarterly with auditing partners to keep investors and
          supporters informed in real time.
        </Body>
      </Card>
    ) : null}
  </Section>
);
