/**
 * Example usage of ErrorState and ErrorBanner components
 * 
 * This file demonstrates how to integrate error handling components
 * with the data fetching hooks for the shop integration.
 */

import { ErrorState, ErrorBanner } from './index';
import { useProducts } from '../hooks';
import { Section } from '../design-system';

/**
 * Example 1: Full-page error state with retry
 * Use when API fails and no fallback data is available
 */
export const ShopPageWithErrorState = () => {
  const { products, loading, error, refetch } = useProducts();

  // Show error state when API fails and no products available
  if (error && products.length === 0) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Unable to Load Products"
      />
    );
  }

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render products
  return (
    <Section>
      <div>Products: {products.length}</div>
    </Section>
  );
};

/**
 * Example 2: Inline error banner with fallback data
 * Use when API fails but fallback/cached data is available
 */
export const ShopPageWithErrorBanner = () => {
  const { products, loading, error } = useProducts();

  return (
    <Section>
      {/* Show banner when using fallback data */}
      {error && products.length > 0 && (
        <ErrorBanner
          error={error}
          message="Unable to load latest products. Showing cached data."
        />
      )}

      {/* Render products (from API or fallback) */}
      <div>Products: {products.length}</div>
    </Section>
  );
};

/**
 * Example 3: Dismissible error banner
 * Use for non-critical errors that users can dismiss
 */
export const ShopPageWithDismissibleBanner = () => {
  const { products, loading, error } = useProducts();
  const [showError, setShowError] = React.useState(true);

  return (
    <Section>
      {/* Show dismissible banner */}
      {error && products.length > 0 && showError && (
        <ErrorBanner
          error={error}
          message="Some product information may be outdated."
          showDismiss={true}
          onDismiss={() => setShowError(false)}
        />
      )}

      {/* Render products */}
      <div>Products: {products.length}</div>
    </Section>
  );
};

/**
 * Example 4: Combined error handling strategy
 * Use both ErrorState and ErrorBanner based on scenario
 */
export const ShopPageWithCombinedErrorHandling = () => {
  const { products, loading, error, refetch } = useProducts();

  // Critical error: No data available at all
  if (error && products.length === 0 && !loading) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Unable to Load Products"
      />
    );
  }

  return (
    <Section>
      {/* Non-critical error: Using fallback data */}
      {error && products.length > 0 && (
        <ErrorBanner
          error={error}
          message="Unable to connect to server. Showing cached products."
        />
      )}

      {/* Loading state */}
      {loading && <div>Loading products...</div>}

      {/* Products list */}
      {!loading && products.length > 0 && (
        <div>
          <h2>Products ({products.length})</h2>
          {/* Render product grid */}
        </div>
      )}
    </Section>
  );
};

/**
 * Example 5: Product detail page with 404 handling
 */
export const ProductDetailPageWithErrorHandling = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error, refetch } = useProduct(slug || '');

  // 404 error: Product not found
  if (error && (error as any).statusCode === 404) {
    return (
      <ErrorState
        error={new Error('Product not found')}
        title="Product Not Found"
        showRetry={false}
      />
    );
  }

  // Other errors: Show with retry
  if (error && !product) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Unable to Load Product"
      />
    );
  }

  // Loading state
  if (loading) {
    return <div>Loading product...</div>;
  }

  // No product found
  if (!product) {
    return <div>Product not found</div>;
  }

  // Render product
  return (
    <Section>
      {/* Show banner if using fallback data */}
      {error && product && (
        <ErrorBanner
          error={error}
          message="Unable to load latest product information. Showing cached data."
        />
      )}

      <div>
        <h1>{product.name}</h1>
        {/* Render product details */}
      </div>
    </Section>
  );
};

// Note: Import React and useParams at the top of actual implementation
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks';
