import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../components/Toast";
import { Body, Button, Heading, Section } from "../design-system";
import { VariationSelector } from "../components/VariationSelector";
import { validateQuantity } from "../lib/validation";
import { useProduct } from "../hooks/useProduct";
import { ProductDetailSkeleton } from "../components/skeletons/ProductDetailSkeleton";
import { ErrorState } from "../components/ErrorState";
import { ProductImage } from "../components/ProductImage";

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();

  // Fetch product data from API
  const { product, loading, error, refetch } = useProduct(slug || '');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  // Calculate final price based on variation modifiers
  const finalPrice = useMemo(() => {
    if (!product) return 0;
    
    let price = product.price;
    
    if (product.variations) {
      product.variations.forEach((variation) => {
        const selectedValue = selectedVariations[variation.type];
        if (selectedValue) {
          const option = variation.options.find((opt) => opt.value === selectedValue);
          if (option?.priceModifier) {
            price += option.priceModifier;
          }
        }
      });
    }
    
    return price;
  }, [product, selectedVariations]);

  // Check if all required variations are selected
  const allVariationsSelected = useMemo(() => {
    if (!product?.variations || product.variations.length === 0) return true;
    return product.variations.every((variation) => selectedVariations[variation.type]);
  }, [product, selectedVariations]);

  // Get current inventory based on selected variations
  const currentInventory = useMemo(() => {
    if (!product) return 0;
    
    if (!product.variations || product.variations.length === 0) {
      return product.inventory;
    }

    // If variations exist, check the inventory of selected options
    let minInventory = product.inventory;
    
    product.variations.forEach((variation) => {
      const selectedValue = selectedVariations[variation.type];
      if (selectedValue) {
        const option = variation.options.find((opt) => opt.value === selectedValue);
        if (option?.inventory !== undefined) {
          minInventory = Math.min(minInventory, option.inventory);
        }
      }
    });
    
    return minInventory;
  }, [product, selectedVariations]);

  // Show loading skeleton while fetching
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // Show 404 page if product not found
  if (!product) {
    return (
      <Section background="default">
        <div className="text-center">
          <Heading level={2}>Product Not Found</Heading>
          <Body className="mt-4" variant="muted">
            The product you're looking for doesn't exist.
          </Body>
          <Button className="mt-6" onClick={() => navigate("/shop")}>
            Back to Shop
          </Button>
        </div>
      </Section>
    );
  }

  // Show error state with fallback if there was an error but we have fallback data
  const hasError = error && error.message !== 'Product not found';

  const handleVariationChange = (type: string, value: string) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [type]: value,
    }));

    // If the variation has specific images, update the selected image
    if (product?.variations) {
      const variation = product.variations.find((v) => v.type === type);
      const option = variation?.options.find((opt) => opt.value === value);
      if (option?.images && option.images.length > 0) {
        // Find the index of the first variation-specific image in the product images
        const imageIndex = product.images.findIndex((img) => option.images?.includes(img));
        if (imageIndex !== -1) {
          setSelectedImage(imageIndex);
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (!allVariationsSelected) {
      showToast('Please select all product options', 'warning');
      return;
    }

    // Validate quantity
    const validation = validateQuantity(quantity, currentInventory);
    if (!validation.isValid) {
      showToast(validation.errors[0].message, 'error');
      return;
    }

    // Check if out of stock
    if (isOutOfStock) {
      showToast('This product is currently out of stock', 'error');
      return;
    }

    try {
      const cartItemId = product.variations && Object.keys(selectedVariations).length > 0
        ? `${product.id}-${Object.values(selectedVariations).sort().join("-")}`
        : product.id;

      // Add items based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: cartItemId,
          name: product.name,
          price: finalPrice,
          image: product.images[selectedImage],
          impactStatement: product.impactStatement,
          selectedVariations: product.variations && Object.keys(selectedVariations).length > 0 
            ? selectedVariations 
            : undefined,
          productId: product.id,
          productSlug: product.slug,
          maxInventory: currentInventory,
        });
      }

      showToast(
        `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`,
        'success'
      );
      
      // Reset quantity after adding
      setQuantity(1);
    } catch (error) {
      showToast('Failed to add item to cart. Please try again.', 'error');
    }
  };

  const stockClass =
    product.availability === "low_stock"
      ? "text-orange-600"
      : product.availability === "backorder"
      ? "text-red-600"
      : "text-green-600";

  const stockText =
    product.availability === "low_stock"
      ? `Only ${currentInventory} left`
      : product.availability === "backorder"
      ? "Backorder"
      : "In Stock";

  const isOutOfStock = currentInventory <= 0 || product.availability === "backorder";

  return (
    <>
      {/* Show error banner if using fallback data */}
      {hasError && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-orange-600"
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
                <span className="text-sm text-orange-800">
                  Unable to load latest product data. Showing cached information.
                </span>
              </div>
              <button
                onClick={() => refetch()}
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <Section background="default">
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm text-brand-600 hover:text-brand-700"
          >
            ← Back to Shop
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-[500px] w-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      overflow-hidden rounded-lg border-2 transition-all
                      ${
                        selectedImage === index
                          ? "border-brand-600"
                          : "border-ink-100 hover:border-brand-300"
                      }
                    `}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-brand-600">{product.category}</p>
              <Heading level={1} className="mt-2">
                {product.name}
              </Heading>
              <div className="mt-2 flex items-center gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-b border-ink-100 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-brand-600">
                  {product.currency} {finalPrice.toFixed(2)}
                </span>
                <span className={`text-sm font-medium ${stockClass}`}>
                  {stockText}
                </span>
              </div>
            </div>

            <Body>{product.description}</Body>

            {product.impactStatement && (
              <div className="rounded-lg bg-brand-50 p-4">
                <p className="text-sm font-semibold text-brand-900">
                  Your Impact
                </p>
                <p className="mt-1 text-sm text-brand-800">
                  {product.impactStatement}
                </p>
              </div>
            )}

            {/* Variation Selector */}
            {product.variations && product.variations.length > 0 && (
              <div className="border-t border-ink-100 pt-6">
                <VariationSelector
                  variations={product.variations}
                  selectedVariations={selectedVariations}
                  onVariationChange={handleVariationChange}
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-ink-100 pt-6">
              <label className="mb-3 block text-sm font-medium text-ink-900">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 hover:border-brand-300"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={currentInventory}
                  value={quantity}
                  onChange={(e) => {
                    const newQty = parseInt(e.target.value) || 1;
                    const validatedQty = Math.max(1, Math.min(currentInventory, newQty));
                    setQuantity(validatedQty);
                    
                    if (newQty > currentInventory) {
                      showToast(`Only ${currentInventory} items available`, 'warning');
                    }
                  }}
                  className="h-10 w-20 rounded-lg border border-ink-200 text-center"
                />
                <button
                  onClick={() => setQuantity(Math.min(currentInventory, quantity + 1))}
                  disabled={quantity >= currentInventory}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 hover:border-brand-300 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || !allVariationsSelected}
                className="w-full"
                size="lg"
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : !allVariationsSelected
                  ? "Select Options"
                  : "Add to Cart"}
              </Button>
              
              {!allVariationsSelected && product.variations && (
                <p className="text-center text-sm text-ink-600">
                  Please select all options above
                </p>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Additional Product Info */}
      <Section background="muted">
        <div className="mx-auto max-w-3xl">
          <Heading level={2} className="mb-6">
            About This Product
          </Heading>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6">
              <h3 className="mb-2 font-semibold text-ink-900">
                Supporting Local Communities
              </h3>
              <Body variant="muted">
                Every purchase directly supports artisans and communities in Ghana's
                Volta Region. Your contribution helps fund education, healthcare, and
                economic empowerment programs.
              </Body>
            </div>
            <div className="rounded-lg bg-white p-6">
              <h3 className="mb-2 font-semibold text-ink-900">
                Quality & Sustainability
              </h3>
              <Body variant="muted">
                We work with local cooperatives to ensure fair trade practices and
                sustainable production methods. Each item is crafted with care and
                respect for traditional techniques.
              </Body>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
