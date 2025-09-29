import { Link } from "react-router-dom";

import { Body, Button, Card, Eyebrow, Heading, Section } from "../design-system";
import { VisionHero } from "../components/VisionHero";

const overviewCards = [
  {
    title: "Vision",
    description:
      "Discover how we partner with communities to co-create resilient futures across the continent.",
    to: "/vision",
  },
  {
    title: "Volta Focus",
    description:
      "Explore this season's pilots in Ghana's Volta Region and how they unlock scalable models.",
    to: "/volta-focus",
  },
  {
    title: "Programs",
    description:
      "Dive into education, health, water, and livelihoods initiatives shaping measurable impact.",
    to: "/programs",
  },
];

const storytellingHighlights = [
  {
    eyebrow: "Stories",
    heading: "See the movement in motion",
    body: "Track immersive narratives from classrooms, clinics, and cooperatives driving lasting change.",
    to: "/stories",
    cta: "Read latest stories",
  },
  {
    eyebrow: "Voices",
    heading: "Hear from our community",
    body: "Volunteers, donors, and residents share why they trust the Mawu Foundation to deliver with integrity.",
    to: "/voices",
    cta: "Meet the voices",
  },
  {
    eyebrow: "Support",
    heading: "Invest in resilient futures",
    body: "Shop limited-run merch or make a secure donation to keep the constellation of programs thriving.",
    to: "/donate",
    cta: "Support today",
  },
];

export const LandingPage = () => (
  <>
    <VisionHero />
    <Section>
      <div className="space-y-6 text-center">
        <Eyebrow>Navigate the platform</Eyebrow>
        <Heading level={2}>Find the depth you are looking for</Heading>
        <Body className="mx-auto max-w-2xl" variant="muted">
          The landing page highlights the essentials. Follow the links below to
          explore each focus area in detail, from the foundation's mission to
          the programs, stories, and ways to engage.
        </Body>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {overviewCards.map((card) => (
          <Card className="flex h-full flex-col justify-between border border-ink-100/60 bg-white/80 p-6 shadow-soft" key={card.title}>
            <div className="space-y-4">
              <Heading className="text-xl" level={3}>
                {card.title}
              </Heading>
              <Body variant="muted">{card.description}</Body>
            </div>
            <Button as={Link} className="mt-6 self-start" to={card.to} variant="secondary">
              Read more
            </Button>
          </Card>
        ))}
      </div>
    </Section>
    <Section background="tinted">
      <div className="grid gap-6 md:grid-cols-3">
        {storytellingHighlights.map((item) => (
          <Card className="flex h-full flex-col justify-between border border-brand-100/60 bg-white/80 p-6 shadow-soft" key={item.to}>
            <div className="space-y-3">
              <Eyebrow>{item.eyebrow}</Eyebrow>
              <Heading className="text-xl" level={3}>
                {item.heading}
              </Heading>
              <Body variant="muted">{item.body}</Body>
            </div>
            <Button as={Link} className="mt-6 self-start" to={item.to}>
              {item.cta}
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  </>
);
