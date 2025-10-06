import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Body,
  Button,
  Card,
  CardContent,
  Eyebrow,
  Heading,
  Section,
} from "../design-system";
import { cn } from "../lib/cn";
import type {
  ProgramDetail,
  ProgramFilter,
  ProgramFocus,
  ProgramRegion,
  ProgramMetric,
} from "../types/programs";

const experienceHighlights = [
  {
    title: "For Donors",
    description:
      "Transparent dashboards and immersive storytelling showcase exactly how each contribution powers change in the Volta Region and beyond.",
    icon: "✨",
  },
  {
    title: "For Partners",
    description:
      "Collaborative pilots with local leaders, governments, and innovators help scale successful models across the continent.",
    icon: "🤝",
  },
  {
    title: "For Communities",
    description:
      "Human-centred design keeps every initiative co-created with residents, ensuring dignity, ownership, and long-term resilience.",
    icon: "🌍",
  },
];

interface ProgramExplorerProps {
  programs: ProgramDetail[];
  categories: string[];
  regions: ProgramRegion[];
  metrics: ProgramMetric[];
  loading: boolean;
  error: string | null;
}

export const ProgramExplorer = ({
  programs,
  categories,
  regions,
  metrics,
  loading,
  error,
}: ProgramExplorerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ProgramFilter>("All");
  const [selectedProgramSlug, setSelectedProgramSlug] = useState<string | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<ProgramFocus>("volta");

  const filteredPrograms = useMemo(() => {
    if (!programs.length) {
      return [] as ProgramDetail[];
    }

    if (selectedCategory === "All") {
      return programs;
    }

    return programs.filter((program) => program.category === selectedCategory);
  }, [programs, selectedCategory]);

  useEffect(() => {
    if (!filteredPrograms.length) {
      return;
    }

    if (
      !selectedProgramSlug ||
      !filteredPrograms.some((program) => program.slug === selectedProgramSlug)
    ) {
      setSelectedProgramSlug(filteredPrograms[0].slug);
    }
  }, [filteredPrograms, selectedProgramSlug]);

  useEffect(() => {
    if (!regions.length) {
      return;
    }

    setSelectedFocus((current) => {
      if (regions.some((region) => region.id === current)) {
        return current;
      }

      return regions[0]?.id ?? "volta";
    });
  }, [regions]);

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

  return (
    <Section background="tinted" id="programs">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow>Programs & Impact</Eyebrow>
          <Heading>Explore our active initiatives</Heading>
        </div>
        {error ? (
          <Card className="border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
            {error}
          </Card>
        ) : null}
      </div>

      {activeRegion ? (
        <Card className="mt-10 overflow-hidden border border-ink-100/60 bg-white/80">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4 p-6">
              <Eyebrow>{activeRegion.name}</Eyebrow>
              <Body variant="muted">{activeRegion.description}</Body>
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                {activeRegion.priorities.map((priority) => (
                  <span key={priority} className="rounded-full bg-brand-100 px-3 py-1">
                    {priority}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-72 w-full">
              <img
                alt={activeRegion.hero.alt}
                className="h-full w-full object-cover"
                src={activeRegion.hero.image}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent p-6 text-sm font-semibold text-white">
                <div className="flex flex-wrap gap-4">
                  {activeRegion.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                        {stat.label}
                      </p>
                      <p className="text-lg">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-ink-100/60 bg-white/70 p-4">
            <div className="flex flex-wrap gap-3">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  onClick={() => setSelectedFocus(region.id)}
                  size="sm"
                  variant={selectedFocus === region.id ? "primary" : "ghost"}
                >
                  {region.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      {metrics.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label} className="border border-ink-100/60 bg-white/80 p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
                {metric.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-brand-700">{metric.value}</p>
              {metric.description ? (
                <Body className="mt-3" variant="muted">
                  {metric.description}
                </Body>
              ) : null}
              {metric.trend ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  {metric.trend}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-400">
              Filter by impact area
            </p>
            <div aria-label="Filter programs by category" className="mt-4 flex flex-wrap gap-3" role="group">
              {["All", ...categories].map((category) => (
                <Button
                  key={category}
                  aria-pressed={selectedCategory === category}
                  onClick={() => setSelectedCategory(category as ProgramFilter)}
                  size="sm"
                  variant={selectedCategory === category ? "primary" : "ghost"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {loading && !filteredPrograms.length ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card
                  className="animate-pulse border border-ink-100/50 bg-white/70 p-6"
                  key={`program-skeleton-${index}`}
                >
                  <div className="h-4 w-2/3 rounded-full bg-ink-200/60" />
                  <div className="mt-3 h-3 w-1/2 rounded-full bg-ink-100/60" />
                  <div className="mt-4 h-3 w-full rounded-full bg-ink-100/60" />
                </Card>
              ))
            ) : filteredPrograms.length ? (
              filteredPrograms.map((program) => (
                <Card
                  className={cn(
                    "border border-ink-100/60 bg-white/80 p-6 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated focus-within:border-brand-400",
                    selectedProgram?.slug === program.slug && "border-brand-500 shadow-elevated",
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
                      {program.focus === "volta" ? "Volta Focus" : "Pan-African"}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button onClick={() => setSelectedProgramSlug(program.slug)} size="sm">
                      Preview story
                    </Button>
                    <Button as={Link} size="sm" to={`/programs/${program.slug}`} variant="secondary">
                      Read full details
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
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    Impact spotlight
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {selectedProgram.spotlightStatistic}
                  </p>
                </div>
              </div>
              <CardContent className="space-y-4">
                <Heading className="text-2xl" level={3}>
                  {selectedProgram.title}
                </Heading>
                <Body variant="muted">{selectedProgram.summary}</Body>
                <blockquote className="rounded-2xl bg-brand-50/80 p-4 text-sm text-brand-800">
                  <p className="italic">"{selectedProgram.highlightQuote.quote}"</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                    {selectedProgram.highlightQuote.attribution}
                  </p>
                </blockquote>
                <div className="flex flex-wrap gap-3">
                  <Button as={Link} size="sm" to={`/programs/${selectedProgram.slug}`} variant="secondary">
                    View program details
                  </Button>
                  <Button as={Link} size="sm" to="/donate" variant="ghost">
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

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
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
    </Section>
  );
};
