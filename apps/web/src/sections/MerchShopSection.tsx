import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Body,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Container,
  Eyebrow,
  Heading,
  Section
} from '../design-system';
import { cn } from '../lib/cn';
import { fallbackShopCatalog } from '../data/shop-fallback';
import type { ShopPaymentMethod, ShopProduct } from '../types/shop';


interface FetchState {
  state: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
}

interface CartLine {
  productId: string;
  quantity: number;
}

interface CheckoutResult {
  status: string;
  message: string;
  clientSecret?: string;
  paymentIntentId?: string;
  order?: {
    currency: string;
    subtotal: number;
    shipping: number;
    total: number;
    lines?: Array<{
      productId: string;
      name: string;
      quantity: number;
      unitAmount: number;
      lineTotal: number;
    }>;
  };
}

const defaultFetchState: FetchState = { state: 'idle', message: null };

const shippingRates: Record<string, number> = {
  'Ghana – Volta Region Pickup': 0,
  'Ghana – Nationwide Courier': 32,
  'West Africa – Regional Shipping': 68,
  'International – Custom Quote': 0
};

const availabilityStyles: Record<ShopProduct['availability'], { label: string; className: string }> = {
  in_stock: { label: 'In stock', className: 'bg-emerald-50 text-emerald-700' },
  low_stock: { label: 'Low stock', className: 'bg-amber-50 text-amber-700' },
  backorder: { label: 'Backorder', className: 'bg-ink-100 text-ink-700' }
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);



const MerchShopSection = () => {
  const catalog = fallbackShopCatalog;
  const catalogState: FetchState = {
    state: 'success',
    message: null,
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedShippingRegion, setSelectedShippingRegion] = useState<string>(
    fallbackShopCatalog.shippingRegions[0] ?? ''
  );
  const [buyerEmail, setBuyerEmail] = useState('');
  const [checkoutNote, setCheckoutNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<ShopPaymentMethod['id']>('stripe');
  const [checkoutState, setCheckoutState] = useState<FetchState>(defaultFetchState);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);

  const featuredProductSet = useMemo(
    () => new Set(catalog.featuredProductSlugs),
    [catalog.featuredProductSlugs]
  );

  const productBySlug = useMemo(() => {
    const map = new Map<string, ShopProduct>();
    for (const product of catalog.products) {
      map.set(product.slug, product);
    }

    return map;
  }, [catalog.products]);

  const productById = useMemo(() => {
    const map = new Map<string, ShopProduct>();
    for (const product of catalog.products) {
      map.set(product.id, product);
    }

    return map;
  }, [catalog.products]);

  useEffect(() => {
    setSelectedProductSlug((current) => {
      if (current && productBySlug.has(current)) {
        return current;
      }

      for (const slug of catalog.featuredProductSlugs) {
        if (productBySlug.has(slug)) {
          return slug;
        }
      }

      return catalog.products[0]?.slug ?? null;
    });
  }, [catalog.featuredProductSlugs, catalog.products, productBySlug]);

  useEffect(() => {
    setSelectedShippingRegion((current) => {
      if (catalog.shippingRegions.includes(current)) {
        return current;
      }

      return catalog.shippingRegions[0] ?? current;
    });
  }, [catalog.shippingRegions]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(catalog.categories))],
    [catalog.categories]
  );

  const filteredProducts = useMemo(() => {
    const base = catalog.products.filter((product) =>
      selectedCategory === 'All' ? true : product.category === selectedCategory
    );

    return [...base].sort((a, b) => {
      const aFeatured = featuredProductSet.has(a.slug);
      const bFeatured = featuredProductSet.has(b.slug);

      if (aFeatured && !bFeatured) {
        return -1;
      }

      if (!aFeatured && bFeatured) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });
  }, [catalog.products, featuredProductSet, selectedCategory]);

  const selectedProduct = useMemo(() => {
    if (!catalog.products.length) {
      return null;
    }

    if (selectedProductSlug) {
      const match = productBySlug.get(selectedProductSlug);
      if (match) {
        return match;
      }
    }

    if (filteredProducts.length) {
      return filteredProducts[0];
    }

    return catalog.products[0];
  }, [catalog.products, filteredProducts, productBySlug, selectedProductSlug]);

  useEffect(() => {
    setSelectedQuantity(1);
  }, [selectedProduct?.id]);

  useEffect(() => {
    setCart((current) => {
      let mutated = false;
      const next: CartLine[] = [];

      for (const line of current) {
        const product = productById.get(line.productId);
        if (!product) {
          mutated = true;
          continue;
        }

        if (product.inventory <= 0) {
          mutated = true;
          continue;
        }

        const maxQuantity = Math.max(product.inventory, 1);
        const quantity = Math.min(line.quantity, maxQuantity);

        if (quantity !== line.quantity) {
          mutated = true;
        }

        next.push({ productId: line.productId, quantity });
      }

      return mutated ? next : current;
    });
  }, [productById]);

  const cartDetails = useMemo(() => {
    return cart
      .map((line) => {
        const product = productById.get(line.productId);
        if (!product) {
          return null;
        }

        const lineTotal = product.price * line.quantity;

        return {
          ...line,
          product,
          lineTotal
        };
      })
      .filter((entry): entry is { product: ShopProduct; productId: string; quantity: number; lineTotal: number } =>
        Boolean(entry)
      );
  }, [cart, productById]);

  const subtotal = useMemo(
    () => cartDetails.reduce((total, line) => total + line.lineTotal, 0),
    [cartDetails]
  );

  const shippingEstimate = shippingRates[selectedShippingRegion] ?? 0;
  const estimatedTotal = subtotal + shippingEstimate;

  const handleAddToCart = () => {
    if (!selectedProduct) {
      return;
    }

    if (selectedProduct.inventory <= 0) {
      return;
    }

    const quantityToAdd = Math.max(1, Math.min(selectedQuantity, selectedProduct.inventory));

    setCart((current) => {
      const existing = current.find((line) => line.productId === selectedProduct.id);

      if (existing) {
        return current.map((line) =>
          line.productId === selectedProduct.id
            ? {
                ...line,
                quantity: Math.min(line.quantity + quantityToAdd, selectedProduct.inventory)
              }
            : line
        );
      }

      return [...current, { productId: selectedProduct.id, quantity: quantityToAdd }];
    });
  };

  const handleQuantityChange = (value: string) => {
    if (!selectedProduct) {
      return;
    }

    const next = Number(value);
    const parsed = Number.isNaN(next) ? 1 : next;
    const clamped = Math.min(Math.max(parsed, 1), Math.max(selectedProduct.inventory, 1));
    setSelectedQuantity(clamped);
  };

  const updateLineQuantity = (productId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? {
                productId,
                quantity: (() => {
                  const product = productById.get(productId);
                  if (!product) {
                    return line.quantity;
                  }

                  const parsed = Number.isNaN(quantity) ? 1 : quantity;
                  const max = Math.max(product.inventory, 1);
                  return Math.min(Math.max(parsed, 1), max);
                })()
              }
            : line
        )
        .filter((line) => (productById.get(line.productId)?.inventory ?? 0) > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((line) => line.productId !== productId));
  };

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cartDetails.length) {
      setCheckoutState({ state: 'error', message: 'Add items to your cart before checking out.' });
      return;
    }

    setCheckoutState({ state: 'loading', message: 'Preparing secure Stripe checkout session…' });
    setCheckoutResult(null);

    try {
      // TODO: Replace with actual Stripe integration
      const orderLines = cartDetails.map((line) => ({
        productId: line.productId,
        name: line.product.name,
        quantity: line.quantity,
        unitAmount: line.product.price,
        lineTotal: line.lineTotal
      }));

      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result: CheckoutResult = {
        status: 'success',
        message: 'Order processed successfully! You will receive a confirmation email shortly.',
        order: {
          currency: catalog.currency,
          subtotal,
          shipping: shippingEstimate,
          total: estimatedTotal,
          lines: orderLines
        }
      };

      setCheckoutResult(result);
      setCheckoutState({
        state: 'success',
        message: 'Order completed successfully! Check your email for confirmation.'
      });
      setCart([]);
    } catch (error) {
      setCheckoutState({
        state: 'error',
        message: 'Payment processing failed. Please try again or contact support.'
      });
    }
  };

  const canCheckout =
    cartDetails.length > 0 && buyerEmail.length > 3 && paymentMethod === 'stripe' && checkoutState.state !== 'loading';

  const inactiveMethods = useMemo(
    () => catalog.paymentMethods.filter((method) => method.status !== 'active'),
    [catalog.paymentMethods]
  );

  const activePaymentMethod = catalog.paymentMethods.find((method) => method.id === paymentMethod);

  const paymentSupportCopy = activePaymentMethod
    ? activePaymentMethod.description
    : 'Select Stripe to activate secure checkout.';

  return (
    <Section id="shop" background="muted" paddedContainer={false}>
      <Container className="flex flex-col gap-16" padded>
        <div className="grid gap-10 lg:grid-cols-[1.6fr,1fr]">
          <div className="space-y-8">
            <div className="space-y-3">
              <Eyebrow>Merch shop</Eyebrow>
              <Heading className="max-w-3xl text-ink-900" level={2}>
                {catalog.hero.title}
              </Heading>
              <Body className="max-w-2xl text-lg text-ink-700">
                {catalog.hero.description}
              </Body>
              {catalogState.message && (
                <Body
                  className={`rounded-2xl border p-4 text-sm ${
                    catalogState.state === 'error'
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-brand-200/70 bg-brand-50 text-brand-800'
                  }`}
                >
                  {catalogState.message}
                </Body>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-semibold transition',
                    selectedCategory === category
                      ? 'border-brand-500 bg-brand-500 text-white shadow-elevated'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-600'
                  )}
                  onClick={() => setSelectedCategory(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {filteredProducts.map((product) => {
                const availability = availabilityStyles[product.availability];
                const isFeatured = featuredProductSet.has(product.slug);

                return (
                  <Card
                    key={product.id}
                    className={cn(
                      'relative h-full overflow-hidden border border-ink-100/80 bg-white/90 backdrop-blur transition',
                      selectedProduct?.id === product.id && 'ring-2 ring-brand-500'
                    )}
                  >
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Heading className="text-xl text-ink-900" level={4}>
                          {product.name}
                        </Heading>
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                            availability.className
                          )}
                        >
                          {availability.label}
                        </span>
                      </div>
                      <Body className="text-base font-semibold text-ink-800">
                        {formatCurrency(product.price, product.currency)}
                      </Body>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                          Featured
                        </span>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-ink-600">
                      <Body className="text-sm text-ink-600">{product.impactStatement}</Body>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <Button
                        onClick={() => setSelectedProductSlug(product.slug)}
                        size="sm"
                        variant={selectedProduct?.id === product.id ? 'primary' : 'secondary'}
                      >
                        View details
                      </Button>
                      <Body className="text-xs text-ink-500">
                        {product.category}
                      </Body>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="h-fit space-y-6">
            {selectedProduct ? (
              <>
                <div className="overflow-hidden rounded-3xl bg-ink-900/5">
                  <img
                    alt={selectedProduct.name}
                    className="h-64 w-full object-cover"
                    src={selectedProduct.images[0]}
                  />
                </div>
                <div className="space-y-3">
                  <Heading className="text-ink-900" level={3}>
                    {selectedProduct.name}
                  </Heading>
                  <Body className="text-lg font-semibold text-ink-800">
                    {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                  </Body>
                  <Body>{selectedProduct.description}</Body>
                  <Body className="text-sm text-brand-700">{selectedProduct.impactStatement}</Body>
                  <div className="flex flex-wrap gap-2 text-xs text-ink-500">
                    <span className="rounded-full bg-ink-100 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-ink-600">
                      {availabilityStyles[selectedProduct.availability].label}
                    </span>
                    <span className="rounded-full bg-ink-100 px-3 py-1 font-semibold uppercase tracking-[0.14em] text-ink-600">
                      {selectedProduct.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-ink-700">
                    Quantity
                    <input
                      aria-label="Quantity"
                      className="w-24 rounded-full border border-ink-200 px-4 py-2 text-center text-base font-semibold text-ink-800 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-200"
                      max={Math.max(selectedProduct.inventory, 1)}
                      min={1}
                      onChange={(event) => handleQuantityChange(event.target.value)}
                      type="number"
                      value={selectedQuantity}
                    />
                  </label>
                  <Button
                    disabled={selectedProduct.inventory <= 0}
                    onClick={handleAddToCart}
                  >
                    {selectedProduct.inventory > 0 ? 'Add to cart' : 'Out of stock'}
                  </Button>
                  {selectedProduct.availability === 'low_stock' && (
                    <Body className="text-sm text-amber-600">
                      Only {selectedProduct.inventory} left — these pieces move fast!
                    </Body>
                  )}
                  {selectedProduct.availability === 'backorder' && (
                    <Body className="text-sm text-ink-600">
                      Ships in 3-4 weeks as artisans prepare the next batch. We will keep you updated every step of the way.
                    </Body>
                  )}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <Body>No products available at the moment. Check back soon.</Body>
              </div>
            )}
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
          <Card className="space-y-6">
            <CardHeader>
              <Heading className="text-ink-900" level={3}>
                Your cart
              </Heading>
              <Body className="text-sm text-ink-600">
                {cartDetails.length > 0
                  ? 'Review your selections before securing your Stripe checkout link.'
                  : 'Add favourite pieces to see your impact summary here.'}
              </Body>
            </CardHeader>
            <CardContent className="space-y-5">
              {cartDetails.length === 0 && <Body variant="muted">Your cart is currently empty.</Body>}

              {cartDetails.map((line) => (
                <div
                  key={line.productId}
                  className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 pb-4"
                >
                  <div className="max-w-sm space-y-1">
                    <Heading className="text-lg text-ink-800" level={5}>
                      {line.product.name}
                    </Heading>
                    <Body className="text-sm text-ink-600">{line.product.impactStatement}</Body>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                      <span>{line.product.category}</span>
                      <span>•</span>
                      <span>{availabilityStyles[line.product.availability].label}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <input
                      aria-label={`Quantity for ${line.product.name}`}
                      className="w-20 rounded-full border border-ink-200 px-3 py-1.5 text-center text-sm font-semibold text-ink-800 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-200"
                      min={1}
                      onChange={(event) => updateLineQuantity(line.productId, Number(event.target.value))}
                      type="number"
                      value={line.quantity}
                    />
                    <Body className="text-sm font-semibold text-ink-700">
                      {formatCurrency(line.lineTotal, line.product.currency)}
                    </Body>
                    <button
                      className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 hover:text-brand-700"
                      onClick={() => removeFromCart(line.productId)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex w-full flex-col gap-4 text-sm text-ink-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal, catalog.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shippingEstimate === 0
                    ? selectedShippingRegion === 'International – Custom Quote'
                      ? 'To be confirmed'
                      : 'Included'
                    : formatCurrency(shippingEstimate, catalog.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Estimated total</span>
                <span>{formatCurrency(estimatedTotal, catalog.currency)}</span>
              </div>
            </CardFooter>
          </Card>

          <Card className="space-y-6">
            <CardHeader>
              <Heading className="text-ink-900" level={3}>
                Checkout
              </Heading>
              <Body className="text-sm text-ink-600">{paymentSupportCopy}</Body>
            </CardHeader>
            <form className="space-y-5" onSubmit={handleCheckout}>
              <label className="flex flex-col gap-2 text-sm font-semibold text-ink-700">
                Email for receipt
                <input
                  className="rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-800 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-200"
                  onChange={(event) => setBuyerEmail(event.target.value)}
                  placeholder="you@example.org"
                  required
                  type="email"
                  value={buyerEmail}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-ink-700">
                Shipping or pickup preference
                <select
                  className="rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-800 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-200"
                  onChange={(event) => setSelectedShippingRegion(event.target.value)}
                  value={selectedShippingRegion}
                >
                  {catalog.shippingRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-ink-700">Payment method</legend>
                <div className="grid gap-3">
                  {catalog.paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition',
                        method.status === 'active'
                          ? paymentMethod === method.id
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/60'
                          : 'border-dashed border-ink-200 bg-white/70 text-ink-400'
                      )}
                    >
                      <input
                        checked={paymentMethod === method.id}
                        className="mt-1"
                        disabled={method.status !== 'active'}
                        name="payment-method"
                        onChange={() => method.status === 'active' && setPaymentMethod(method.id)}
                        type="radio"
                        value={method.id}
                      />
                      <div className="space-y-1">
                        <span className="block font-semibold uppercase tracking-[0.14em] text-ink-700">
                          {method.label}
                        </span>
                        <Body className="text-xs text-ink-500">{method.description}</Body>
                        {method.status !== 'active' && (
                          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                            Coming soon
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="flex flex-col gap-2 text-sm font-semibold text-ink-700">
                Add a note (optional)
                <textarea
                  className="min-h-[120px] rounded-3xl border border-ink-200 px-4 py-3 text-sm text-ink-800 focus:border-brand-500 focus:outline-none focus:ring focus:ring-brand-200"
                  maxLength={800}
                  onChange={(event) => setCheckoutNote(event.target.value)}
                  placeholder="Share sizing details, gifting instructions, or community stories that inspired your purchase."
                  value={checkoutNote}
                />
              </label>

              <div className="space-y-3">
                <Button disabled={!canCheckout} type="submit">
                  {checkoutState.state === 'loading' ? 'Preparing Stripe…' : 'Secure checkout with Stripe'}
                </Button>
                {checkoutState.state === 'error' && checkoutState.message && (
                  <Body className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {checkoutState.message}
                  </Body>
                )}
                {checkoutState.state === 'success' && checkoutState.message && (
                  <Body className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {checkoutState.message}
                  </Body>
                )}
              </div>
            </form>

            {checkoutResult && (
              <div className="space-y-4 rounded-3xl border border-brand-200 bg-brand-50 p-5 text-sm text-ink-700">
                <Heading className="text-base text-brand-800" level={5}>
                  Checkout summary
                </Heading>
                <Body className="text-sm text-ink-700">{checkoutResult.message}</Body>
                {checkoutResult.paymentIntentId && (
                  <div className="space-y-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                      Payment intent ID
                    </span>
                    <code className="block rounded-2xl bg-white px-4 py-2 text-xs text-ink-700">
                      {checkoutResult.paymentIntentId}
                    </code>
                  </div>
                )}
                {checkoutResult.clientSecret && (
                  <div className="space-y-1">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                      Client secret
                    </span>
                    <code className="block overflow-x-auto rounded-2xl bg-white px-4 py-2 text-xs text-ink-700">
                      {checkoutResult.clientSecret}
                    </code>
                  </div>
                )}
                {checkoutResult.order && (
                  <div className="space-y-2">
                    <Heading className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-600" level={6}>
                      Order values
                    </Heading>
                    <div className="grid grid-cols-2 gap-2 text-xs text-ink-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-ink-700">
                        {formatCurrency(checkoutResult.order.subtotal, checkoutResult.order.currency)}
                      </span>
                      <span>Shipping</span>
                      <span className="font-semibold text-ink-700">
                        {checkoutResult.order.shipping === 0
                          ? 'Included'
                          : formatCurrency(checkoutResult.order.shipping, checkoutResult.order.currency)}
                      </span>
                      <span>Total</span>
                      <span className="font-semibold text-ink-700">
                        {formatCurrency(checkoutResult.order.total, checkoutResult.order.currency)}
                      </span>
                    </div>
                  </div>
                )}
                {inactiveMethods.length > 0 && (
                  <Body className="text-xs text-ink-500">
                    Coming soon: {inactiveMethods.map((method) => method.label).join(', ')}.
                  </Body>
                )}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </Section>
  );
};

export default MerchShopSection;
