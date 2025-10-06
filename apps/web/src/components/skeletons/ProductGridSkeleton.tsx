import { Card, Section } from "../../design-system";

export const ProductGridSkeleton = () => {
  return (
    <Section background="muted">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            bleed
            className="overflow-hidden border border-ink-100/60 bg-white/80 shadow-soft"
            data-testid="product-card-skeleton"
          >
            {/* Image skeleton */}
            <div className="h-64 w-full animate-pulse bg-ink-100" />
            
            {/* Content skeleton */}
            <div className="space-y-4 p-6">
              {/* Title and category */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 animate-pulse rounded bg-ink-100" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-ink-100" />
              </div>
              
              {/* Description lines */}
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-ink-100" />
              </div>
              
              {/* Impact statement box */}
              <div className="rounded-lg bg-brand-50 p-3">
                <div className="h-4 w-full animate-pulse rounded bg-brand-100" />
              </div>
              
              {/* Price and buttons */}
              <div className="flex items-center justify-between border-t border-ink-100 pt-4">
                <div className="space-y-2">
                  <div className="h-8 w-24 animate-pulse rounded bg-ink-100" />
                  <div className="h-4 w-20 animate-pulse rounded bg-ink-100" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 animate-pulse rounded-lg bg-ink-100" />
                  <div className="h-9 w-24 animate-pulse rounded-lg bg-ink-100" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};
