import { Body, Button, Card, Heading, Section } from "../design-system";

const shopItems = [
  {
    name: "Aurora Impact Tee",
    description:
      "Organic cotton with a hand-illustrated constellation of our partner communities.",
    price: "$38",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Unity Canvas Tote",
    description:
      "Carry hope with a limited-run print celebrating African artisanship.",
    price: "$28",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Volta Sunrise Hoodie",
    description:
      "Cozy fleece dyed in sunrise gradients funding solar microgrid installations.",
    price: "$68",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  },
];

export const ShopPage = () => (
  <>
    <Section background="default">
      <div className="space-y-4 text-center">
        <Heading level={1}>Impact merch capsule</Heading>
        <Body className="mx-auto max-w-2xl" variant="muted">
          Every purchase fuels community-designed initiatives across the Mawu Foundation network. Limited-run drops celebrate
          local artisanship and regenerative materials.
        </Body>
      </div>
    </Section>
    <Section background="muted">
      <div className="grid gap-6 md:grid-cols-3">
        {shopItems.map((item) => (
          <Card bleed className="group overflow-hidden border border-ink-100/60 bg-white/80 shadow-soft" key={item.name}>
            <img
              alt={item.name}
              className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
              src={item.image}
            />
            <div className="space-y-4 p-6">
              <Heading className="text-xl" level={3}>
                {item.name}
              </Heading>
              <Body variant="muted">{item.description}</Body>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-600">{item.price}</span>
                <Button size="sm" variant="ghost">
                  Add to capsule
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  </>
);
