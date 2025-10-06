import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Body, Button, Card, Heading, Section } from "../design-system";
import { useProducts } from "../hooks/useProducts";
import { ProductGridSkeleton } from "../components/skeletons/ProductGridSkeleton";
import { ErrorState } from "../components/ErrorState";
import { ProductImage } from "../components/ProductImage";

export const EnhancedShopPage = () => {
  const { addItem } = useCart();
  const { products, loading, error, refetch } = useProducts();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      impactStatement: product.impactStatement,
      productId: product.id,
      productSlug: product.slug,
      maxInventory: product.inventory,
    });
  };

  // Show loading skeleton while fetching products
  if (loading) {
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
        <ProductGridSkeleton />
      </>
    );
  }

  // Show error state if API failed and no fallback products available
  if (error && products.length === 0) {
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
        <ErrorState 
          error={error} 
          onRetry={refetch}
          title="Unable to Load Products"
        />
      </>
    );
  }

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

      {/* Show inline error banner if using fallback data */}
      {error && products.length > 0 && (
        <Section background="default" padding="sm">
          <div className="mx-auto max-w-4xl rounded-lg bg-orange-50 border border-orange-200 p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">
                  Unable to load latest products. Showing cached data.
                </p>
                <button
                  onClick={refetch}
                  className="mt-2 text-sm font-medium text-orange-700 hover:text-orange-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </Section>
      )}

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
                <Link to={`/shop/product/${product.slug}`}>
                  <div className="relative">
                    <ProductImage
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
                </Link>
                <div className="space-y-4 p-6">
                  <div>
                    <Link to={`/shop/product/${product.slug}`}>
                      <Heading className="text-xl hover:text-brand-600 transition-colors" level={3}>
                        {product.name}
                      </Heading>
                    </Link>
                    <p className="mt-1 text-sm text-brand-600">{product.category}</p>
                  </div>
                  <Body variant="muted" className="text-sm line-clamp-2">
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
                    <div className="flex gap-2">
                      <Link to={`/shop/product/${product.slug}`}>
                        <Button 
                          size="sm"
                          variant="secondary"
                        >
                          View Details
                        </Button>
                      </Link>
                      {!product.variations && (
                        <Button 
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.availability === 'backorder'}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section background="default">
        <div className="mx-auto max-w-3xl text-center">
          <ProductImage
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
