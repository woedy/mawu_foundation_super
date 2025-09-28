import { useEffect, useMemo, useState } from "react";
import {
  Body,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Eyebrow,
  Heading,
  Section,
} from "../design-system";
import { testimonials } from "../data/testimonials";
import { trackEvent } from "../lib/analytics";

const ROTATION_INTERVAL_MS = 9000;

type Direction = "next" | "previous";

export const TestimonialsSection = () => {
  const items = useMemo(() => testimonials, []);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [items.length]);

  if (!items.length) {
    return null;
  }

  const activeTestimonial = items[activeIndex];

  const move = (direction: Direction) => {
    trackEvent("testimonial_cycle", {
      direction,
      segment: activeTestimonial.segment,
    });

    setActiveIndex((current) => {
      if (direction === "next") {
        return (current + 1) % items.length;
      }

      return (current - 1 + items.length) % items.length;
    });
  };

  return (
    <Section
      aria-labelledby="testimonials-heading"
      background="tinted"
      id="voices"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="space-y-5">
          <Eyebrow>Community Voices</Eyebrow>
          <Heading id="testimonials-heading" level={2}>
            Why the Mawu movement keeps growing
          </Heading>
          <Body variant="muted">
            Supporters, volunteers, and program participants share how the
            foundation's transparency and co-creation ethos are transforming
            lives across the Volta Region. Cycle through their stories below.
          </Body>
          <div className="flex items-center gap-3">
            <Button onClick={() => move("previous")} size="sm" variant="ghost">
              Previous
            </Button>
            <Button onClick={() => move("next")} size="sm">
              Next
            </Button>
          </div>
        </div>
        <Card className="relative overflow-hidden border border-brand-100/70 bg-white/80 shadow-soft">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <img
              alt={`Portrait of ${activeTestimonial.name}`}
              className="h-20 w-20 rounded-2xl object-cover shadow-soft"
              src={activeTestimonial.avatar}
            />
            <div className="space-y-1">
              <Heading className="text-lg" level={3}>
                {activeTestimonial.name}
              </Heading>
              <p className="text-sm font-semibold text-brand-700">
                {activeTestimonial.role}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-ink-400">
                {activeTestimonial.location}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <blockquote className="text-lg leading-relaxed text-ink-800">
              "{activeTestimonial.quote}"
            </blockquote>
            <Body className="text-sm font-semibold text-brand-700">
              {activeTestimonial.highlight}
            </Body>
          </CardContent>
          <CardFooter className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-ink-400">
            <span>{activeTestimonial.segment}</span>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
          </CardFooter>
        </Card>
      </div>
    </Section>
  );
};
