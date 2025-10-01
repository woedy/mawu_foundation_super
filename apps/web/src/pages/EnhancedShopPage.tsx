import { useCart } from "../contexts/CartContext";
import { fallbackShopCatalog } from "../data/shop-fallback";
import { Body, Button, Card, Heading, Section } from "../design-system";

export const EnhancedShopPage = () => {
  const { addItem } = useCart();
  const { products } = fallbackShopCatalog;

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      impactStatement: product.impactStatement,
    });
  };

  return (
    <>
      <Section background="default">
        <div className="space-y-4 text-center">
          <Heading level={1}>Impact Merchandise Shop</Heading>
          <Body className="mx-auto max-w-2xl" variant="muted">
            Every purchase fuels community-designed initiatives across the Mawu Foundation network. 
            Support local artisans and fund programs in education, health, and economic empowerment.
          </Body>
        </div>
      </Section>

      <Section background="muted">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map(product => {
            const stockClass = 
              product.availability === 'low_stock' ? 'text-orange-600' :
              product.availability === 'backorder' ? 'text-red-600' :
              'text-green-600';
            
            const stockText = 
              product.availability === 'low_stock' ? `Only ${product.inventory} left` :
              product.availability === 'backorder' ? 'Backorder' :
              'In Stock';

            return (
              <Card 
                key={product.id} 
                bleed 
                className="group overflow-hidden border border-ink-100/60 bg-white/80 shadow-soft"
              >
                <div className="relative">
                  <img
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                    src={product.images[0]}
                  />
                  <div className="absolute top-2 right-2">
                    {product.tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-block rounded-full bg-brand-600 px-2 py-1 text-xs text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <Heading className="text-xl" level={3}>
                      {product.name}
                    </Heading>
                    <p className="mt-1 text-sm text-brand-600">{product.category}</p>
                  </div>
                  <Body variant="muted" className="text-sm">
                    {product.description}
                  </Body>
                  {product.impactStatement && (
                    <div className="rounded-lg bg-brand-50 p-3">
                      <p className="text-sm font-medium text-brand-900">
                        Impact: {product.impactStatement}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-ink-100 pt-4">
                    <div>
                      <span className="text-2xl font-semibold text-brand-600">
                        GHS {product.price}
                      </span>
                      <p className={`text-sm ${stockClass}`}>{stockText}</p>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.availability === 'backorder'}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section background="default">
        <div className="mx-auto max-w-3xl text-center">
          <img
            src="/african_handmade_cra_e2c15a7f.jpg"
            alt="Artisan crafts supporting local communities"
            className="mb-6 w-full rounded-lg shadow-lg"
          />
          <Heading level={2}>Supporting Local Artisans</Heading>
          <Body className="mt-4" variant="muted">
            Each product is crafted by skilled artisans from the Volta Region and across Ghana. 
            Your purchase directly supports these communities and funds our educational and healthcare programs.
          </Body>
        </div>
      </Section>
    </>
  );
};
