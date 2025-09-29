import {
  Body,
  Button,
  Card,
  CardContent,
  CardHeader,
  Eyebrow,
  Heading,
  Section,
} from "../design-system";
import type { ProgramDetail } from "../types/programs";

export const ProgramDetailSection = ({
  program,
}: {
  program: ProgramDetail;
}) => (
  <Section
    background={program.focus === "volta" ? "tinted" : "default"}
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
              Season highlight
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-700">
              {program.spotlightStatistic}
            </p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200/80">
              Community voice
            </p>
            <p className="text-lg leading-relaxed text-white/90 italic">
              "{program.highlightQuote.quote}"
            </p>
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
                  variant={cta.tone === "primary" ? "primary" : "secondary"}
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
