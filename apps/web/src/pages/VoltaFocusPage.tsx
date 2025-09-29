import { Body, Button, Card, Eyebrow, Heading, Section } from "../design-system";
import { Link } from "react-router-dom";

const voltaInitiatives = [
  {
    title: "Solar Learning Labs",
    description:
      "Off-grid classrooms in Keta and Hohoe blend digital curricula with local mentorship to accelerate STEM pathways.",
    image:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Water & Wellness Corridors",
    description:
      "Rain-harvesting towers and mobile clinics travel between Anloga, Sogakope, and Akatsi ensuring continuity of care.",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Resilient Livelihoods",
    description:
      "Cooperative agribusiness and microfinance studios help families pilot climate-smart farming and artisan ventures.",
    image:
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80",
  },
];

export const VoltaFocusPage = () => (
  <>
    <Section background="tinted">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow>Seasonal Spotlight</Eyebrow>
          <Heading level={1}>Volta Region, Ghana</Heading>
        </div>
        <Body className="max-w-xl" variant="muted">
          A braided journey across education, health, water, and livelihoods—designed with chiefs, educators, and youth leaders
          to ensure dignity and sustainability.
        </Body>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {voltaInitiatives.map((initiative) => (
          <Card className="group overflow-hidden border border-ink-100/60 bg-white/80 shadow-soft" key={initiative.title}>
            <img
              alt={initiative.title}
              className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
              src={initiative.image}
            />
            <div className="space-y-4 p-6">
              <Heading className="text-xl" level={3}>
                {initiative.title}
              </Heading>
              <Body variant="muted">{initiative.description}</Body>
              <Button as={Link} size="sm" to="/programs" variant="ghost">
                View related programs
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
    <Section background="default">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-5">
          <Heading level={2}>Why Volta now?</Heading>
          <Body variant="muted">
            The Volta Region is our proving ground. Island communities face
            unique challenges reaching healthcare, technology, and stable income
            opportunities. By piloting integrated solutions here, we generate
            playbooks ready to share across the continent.
          </Body>
          <Body variant="muted">
            Local leaders co-govern each initiative. Chiefs, educators, youth,
            and entrepreneurs shape milestones, ensuring that solutions can be
            maintained long after launch.
          </Body>
        </div>
        <Card className="border border-brand-100/70 bg-white/80 p-6 shadow-soft">
          <Heading className="text-lg" level={3}>
            Ready to go deeper?
          </Heading>
          <Body className="mt-3" variant="muted">
            Explore the full portfolio of programs or invest directly in the
            initiatives making the Volta Region a lighthouse for the continent.
          </Body>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button as={Link} to="/programs">
              Explore programs
            </Button>
            <Button as={Link} to="/donate" variant="secondary">
              Donate to Volta
            </Button>
          </div>
        </Card>
      </div>
    </Section>
  </>
);
