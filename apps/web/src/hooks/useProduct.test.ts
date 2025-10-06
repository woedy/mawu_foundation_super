import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useProduct } from './useProduct';
import { api, ApiError } from '../lib/api';
import { fallbackShopCatalog } from '../data/shop-fallback';

// Mock the api module
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
  ApiError: class ApiError extends Error {
    statusCode?: number;
    code?: string;
    details?: any;

    constructor(message: string, statusCode?: number, code?: string, details?: any) {
      super(message);
      this.name = 'ApiError';
      this.statusCode = statusCode;
      this.code = code;
      this.details = details;
    }
  },
}));

// Mock the monitoring module
vi.mock('../lib/monitoring', () => ({
  logApiError: vi.fn(),
  measureApiCall: vi.fn((name, fn) => fn()),
  recordCacheHit: vi.fn(),
  recordCacheMiss: vi.fn(),
  logFallbackUsage: vi.fn(),
}));

// Mock the product validation module
vi.mock('../utils/productValidation', () => ({
  validateProducts: vi.fn((products) => products),
  validateProduct: vi.fn((product) => product),
  logValidationError: vi.fn(),
  isProductValidationError: vi.fn(() => false),
}));

describe('useProduct', () => {
  const mockProduct = {
    id: 'test-product',
    slug: 'test-product',
    name: 'Test Product',
    category: 'Test',
    price: 100,
    currency: 'GHS',
    tags: ['test'],
    impactStatement: 'Test impact',
    description: 'Test description',
    images: ['test.jpg'],
    availability: 'in_stock' as const,
    inventory: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should fetch individual product correctly', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    const { result } = renderHook(() => useProduct('test-product'));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/api/products/test-product');
  });

  it('should handle 404 scenarios', async () => {
    const notFoundError = new ApiError('Product not found', 404);
    vi.mocked(api.get).mockRejectedValueOnce(notFoundError);

    const { result } = renderHook(() => useProduct('non-existent-product'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should return null for 404
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Product not found');
  });

  it('should use fallback data on API error (non-404)', async () => {
    const mockError = new Error('API Error');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);

    // Use a slug that exists in fallback data
    const fallbackSlug = fallbackShopCatalog.products[0].slug;
    const { result } = renderHook(() => useProduct(fallbackSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use fallback data for this product
    const expectedProduct = fallbackShopCatalog.products.find(
      (p) => p.slug === fallbackSlug
    );
    expect(result.current.product).toEqual(expectedProduct);
  });

  it('should cache product in localStorage', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    const { result } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that product is cached
    const cached = localStorage.getItem('mawu_product_test-product');
    expect(cached).toBeTruthy();

    if (cached) {
      const parsedCache = JSON.parse(cached);
      expect(parsedCache.data).toEqual(mockProduct);
      expect(parsedCache.timestamp).toBeDefined();
      expect(parsedCache.expiresAt).toBeDefined();
    }
  });

  it('should use cached product when available', async () => {
    // Pre-populate cache
    const cacheEntry = {
      data: mockProduct,
      timestamp: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
    };
    localStorage.setItem('mawu_product_test-product', JSON.stringify(cacheEntry));

    const { result } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use cached data without calling API
    expect(result.current.product).toEqual(mockProduct);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should not use expired cache', async () => {
    // Pre-populate cache with expired data
    const expiredCacheEntry = {
      data: mockProduct,
      timestamp: Date.now() - 20 * 60 * 1000, // 20 minutes ago
      expiresAt: Date.now() - 10 * 60 * 1000, // Expired 10 minutes ago
    };
    localStorage.setItem('mawu_product_test-product', JSON.stringify(expiredCacheEntry));

    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    const { result } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should fetch fresh data when cache is expired
    expect(api.get).toHaveBeenCalledWith('/api/products/test-product');
    expect(result.current.product).toEqual(mockProduct);
  });

  it('should refetch product when refetch is called', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    const { result } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);

    // Clear the cache and mock, then set up new data
    localStorage.clear();
    vi.clearAllMocks();
    const updatedProduct = {
      ...mockProduct,
      name: 'Updated Product',
      price: 150,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: updatedProduct });

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.product).toEqual(updatedProduct);
    });

    expect(api.get).toHaveBeenCalledWith('/api/products/test-product');
  });

  it('should handle refetch errors gracefully', async () => {
    const fallbackSlug = fallbackShopCatalog.products[0].slug;
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    const { result } = renderHook(() => useProduct(fallbackSlug));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear the cache and mock, then set up error
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Refetch error'));

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use fallback data on refetch error
    const expectedProduct = fallbackShopCatalog.products.find(
      (p) => p.slug === fallbackSlug
    );
    expect(result.current.product).toEqual(expectedProduct);
  });

  it('should deduplicate simultaneous requests for same product', async () => {
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ product: mockProduct }), 100);
        })
    );

    // Render multiple hooks for the same product simultaneously
    const { result: result1 } = renderHook(() => useProduct('test-product'));
    const { result: result2 } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
      expect(result2.current.loading).toBe(false);
    });

    // API should only be called once despite multiple hooks
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(result1.current.product).toEqual(mockProduct);
    expect(result2.current.product).toEqual(mockProduct);
  });

  it('should handle empty slug', async () => {
    const { result } = renderHook(() => useProduct(''));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('No product slug provided');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should handle null product in API response', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: null });

    const { result } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Product not found');
  });

  it('should update when slug changes', async () => {
    const product1 = { ...mockProduct, slug: 'product-1', id: 'product-1' };
    const product2 = { ...mockProduct, slug: 'product-2', id: 'product-2' };

    vi.mocked(api.get).mockResolvedValueOnce({ product: product1 });

    const { result, rerender } = renderHook(
      ({ slug }) => useProduct(slug),
      { initialProps: { slug: 'product-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(product1);

    // Change slug and set up new mock
    vi.mocked(api.get).mockResolvedValueOnce({ product: product2 });
    rerender({ slug: 'product-2' });

    // Wait for loading to start and finish
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.product).toEqual(product2);
    });

    expect(api.get).toHaveBeenCalledWith('/api/products/product-1');
    expect(api.get).toHaveBeenCalledWith('/api/products/product-2');
  });

  it('should clean up on unmount', async () => {
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ product: mockProduct }), 100);
        })
    );

    const { result, unmount } = renderHook(() => useProduct('test-product'));

    expect(result.current.loading).toBe(true);

    // Unmount before data loads
    unmount();

    // Wait a bit to ensure no state updates after unmount
    await new Promise((resolve) => setTimeout(resolve, 150));

    // No errors should occur from state updates after unmount
  });

  it('should handle cache expiration correctly', async () => {
    // Set up cache that will expire soon
    const almostExpiredEntry = {
      data: mockProduct,
      timestamp: Date.now() - 9 * 60 * 1000, // 9 minutes ago
      expiresAt: Date.now() + 1 * 60 * 1000, // Expires in 1 minute
    };
    localStorage.setItem('mawu_product_test-product', JSON.stringify(almostExpiredEntry));

    const { result } = renderHook(() => useProduct('test-product'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still use cache since it hasn't expired yet
    expect(result.current.product).toEqual(mockProduct);
    expect(api.get).not.toHaveBeenCalled();

    // Now simulate cache expiration
    const expiredEntry = {
      ...almostExpiredEntry,
      expiresAt: Date.now() - 1000, // Expired 1 second ago
    };
    localStorage.setItem('mawu_product_test-product', JSON.stringify(expiredEntry));

    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    // Trigger refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });
});
