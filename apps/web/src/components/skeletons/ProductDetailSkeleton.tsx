import { Section } from "../../design-system";

export const ProductDetailSkeleton = () => {
  return (
    <>
      <Section background="default">
        {/* Back button skeleton */}
        <div className="mb-6">
          <div className="h-5 w-32 animate-pulse rounded bg-ink-100" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
              <div className="h-[500px] w-full animate-pulse bg-ink-100" />
            </div>
            
            {/* Thumbnail grid */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border-2 border-ink-100"
                >
                  <div className="h-20 w-full animate-pulse bg-ink-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Category and title */}
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-ink-100" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-ink-100" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-ink-100" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-ink-100" />
              </div>
            </div>

            {/* Price section */}
            <div className="border-t border-b border-ink-100 py-4">
              <div className="flex items-baseline gap-2">
                <div className="h-10 w-32 animate-pulse rounded bg-ink-100" />
                <div className="h-5 w-20 animate-pulse rounded bg-ink-100" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-ink-100" />
            </div>

            {/* Impact statement box */}
            <div className="rounded-lg bg-brand-50 p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-brand-100" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-brand-100" />
            </div>

            {/* Variations section */}
            <div className="border-t border-ink-100 pt-6">
              <div className="space-y-4">
                <div className="h-5 w-20 animate-pulse rounded bg-ink-100" />
                <div className="flex gap-2">
                  <div className="h-10 w-16 animate-pulse rounded-lg bg-ink-100" />
                  <div className="h-10 w-16 animate-pulse rounded-lg bg-ink-100" />
                  <div className="h-10 w-16 animate-pulse rounded-lg bg-ink-100" />
                </div>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="border-t border-ink-100 pt-6">
              <div className="mb-3 h-4 w-16 animate-pulse rounded bg-ink-100" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-ink-100" />
                <div className="h-10 w-20 animate-pulse rounded-lg bg-ink-100" />
                <div className="h-10 w-10 animate-pulse rounded-lg bg-ink-100" />
              </div>
            </div>

            {/* Add to cart button */}
            <div className="h-12 w-full animate-pulse rounded-lg bg-ink-100" />
          </div>
        </div>
      </Section>

      {/* Additional info section skeleton */}
      <Section background="muted">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 h-8 w-64 animate-pulse rounded bg-ink-100" />
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6">
              <div className="mb-2 h-5 w-48 animate-pulse rounded bg-ink-100" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-ink-100" />
              </div>
            </div>
            <div className="rounded-lg bg-white p-6">
              <div className="mb-2 h-5 w-48 animate-pulse rounded bg-ink-100" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-ink-100" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
