import { Body, Card, Eyebrow, Heading, Section } from "../design-system";
import { VisionHero } from "../components/VisionHero";

const visionPillars = [
  {
    title: "Community-first design",
    description:
      "Every initiative starts with listening sessions and co-creation labs so that solutions honour culture and context.",
  },
  {
    title: "Radical transparency",
    description:
      "Quarterly reporting, open data dashboards, and third-party audits keep donors and partners informed at every step.",
  },
  {
    title: "Scalable prototypes",
    description:
      "Seasonal pilots in the Volta Region allow us to test and refine models before replicating them across Africa.",
  },
];

export const VisionPage = () => (
  <>
    <VisionHero showMetrics />
    <Section background="default">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-6">
          <Eyebrow>Our philosophy</Eyebrow>
          <Heading level={2}>Humanity in motion</Heading>
          <Body variant="muted">
            The Mawu Foundation exists to demonstrate what happens when
            communities, innovators, and investors chart a shared path forward.
            Our work spans education, health, water, economic resilience, and
            storytelling so that each program reinforces the others.
          </Body>
          <Body variant="muted">
            We anchor impact in dignity. From safeguarding data privacy to
            designing for accessibility, we ensure that progress is measured by
            how people feel, not just the metrics we publish.
          </Body>
        </div>
        <Card className="border border-brand-100/60 bg-white/80 p-6 shadow-soft">
          <Heading className="text-lg" level={3}>
            Investor takeaway
          </Heading>
          <Body className="mt-3" variant="muted">
            Your partnership fuels a platform built for longevity. We invest in
            local leadership, resilient infrastructure, and measurement systems
            that prove exactly where support flows. Together we are building a
            blueprint capable of scaling across the continent.
          </Body>
        </Card>
      </div>
    </Section>
    <Section background="tinted">
      <div className="grid gap-6 md:grid-cols-3">
        {visionPillars.map((pillar) => (
          <Card className="border border-ink-100/60 bg-white/80 p-6 shadow-soft" key={pillar.title}>
            <Heading className="text-lg" level={3}>
              {pillar.title}
            </Heading>
            <Body className="mt-3" variant="muted">
              {pillar.description}
            </Body>
          </Card>
        ))}
      </div>
    </Section>
  </>
);
