import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useProducts } from './useProducts';
import { api } from '../lib/api';
import { fallbackShopCatalog } from '../data/shop-fallback';

// Mock the api module
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
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

describe('useProducts', () => {
  const mockProducts = [
    {
      id: 'test-product-1',
      slug: 'test-product-1',
      name: 'Test Product 1',
      category: 'Test',
      price: 100,
      currency: 'GHS',
      tags: ['test'],
      impactStatement: 'Test impact',
      description: 'Test description',
      images: ['test.jpg'],
      availability: 'in_stock' as const,
      inventory: 10,
    },
    {
      id: 'test-product-2',
      slug: 'test-product-2',
      name: 'Test Product 2',
      category: 'Test',
      price: 200,
      currency: 'GHS',
      tags: ['test'],
      impactStatement: 'Test impact 2',
      description: 'Test description 2',
      images: ['test2.jpg'],
      availability: 'in_stock' as const,
      inventory: 20,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should fetch products correctly on mount', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    const { result } = renderHook(() => useProducts());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/api/products');
  });

  it('should handle API errors and use fallback data', async () => {
    const mockError = new Error('API Error');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use fallback data on error
    expect(result.current.products).toEqual(fallbackShopCatalog.products);
    expect(result.current.error).toBeNull(); // Error is handled gracefully
  });

  it('should cache products in localStorage', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check that products are cached
    const cached = localStorage.getItem('mawu_products_all');
    expect(cached).toBeTruthy();

    if (cached) {
      const parsedCache = JSON.parse(cached);
      expect(parsedCache.data).toEqual(mockProducts);
      expect(parsedCache.timestamp).toBeDefined();
      expect(parsedCache.expiresAt).toBeDefined();
    }
  });

  it('should use cached products when available', async () => {
    // Pre-populate cache
    const cacheEntry = {
      data: mockProducts,
      timestamp: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    };
    localStorage.setItem('mawu_products_all', JSON.stringify(cacheEntry));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use cached data without calling API
    expect(result.current.products).toEqual(mockProducts);
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should not use expired cache', async () => {
    // Pre-populate cache with expired data
    const expiredCacheEntry = {
      data: mockProducts,
      timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
      expiresAt: Date.now() - 5 * 60 * 1000, // Expired 5 minutes ago
    };
    localStorage.setItem('mawu_products_all', JSON.stringify(expiredCacheEntry));

    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should fetch fresh data when cache is expired
    expect(api.get).toHaveBeenCalledWith('/api/products');
    expect(result.current.products).toEqual(mockProducts);
  });

  it('should refetch products when refetch is called', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);

    // Clear the cache and mock, then set up new data
    localStorage.clear();
    vi.clearAllMocks();
    const newProducts = [
      {
        ...mockProducts[0],
        name: 'Updated Product',
      },
    ];
    vi.mocked(api.get).mockResolvedValueOnce({ products: newProducts });

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.products).toEqual(newProducts);
    });

    expect(api.get).toHaveBeenCalledWith('/api/products');
  });

  it('should handle refetch errors gracefully', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    const { result } = renderHook(() => useProducts());

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
    expect(result.current.products).toEqual(fallbackShopCatalog.products);
  });

  it('should deduplicate simultaneous requests', async () => {
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ products: mockProducts }), 100);
        })
    );

    // Render multiple hooks simultaneously
    const { result: result1 } = renderHook(() => useProducts());
    const { result: result2 } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
      expect(result2.current.loading).toBe(false);
    });

    // API should only be called once despite multiple hooks
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(result1.current.products).toEqual(mockProducts);
    expect(result2.current.products).toEqual(mockProducts);
  });

  it('should handle empty products array', async () => {
    // Mock validateProducts to return fallback when empty
    const { validateProducts } = await import('../utils/productValidation');
    vi.mocked(validateProducts).mockReturnValueOnce(fallbackShopCatalog.products);
    
    vi.mocked(api.get).mockResolvedValueOnce({ products: [] });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // When API returns empty but validation returns fallback
    expect(result.current.products).toEqual(fallbackShopCatalog.products);
  });

  it('should handle malformed API response', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: 'invalid' });

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should handle missing products field gracefully
    expect(result.current.products).toEqual([]);
  });

  it('should clean up on unmount', async () => {
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ products: mockProducts }), 100);
        })
    );

    const { result, unmount } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    // Unmount before data loads
    unmount();

    // Wait a bit to ensure no state updates after unmount
    await new Promise((resolve) => setTimeout(resolve, 150));

    // No errors should occur from state updates after unmount
  });
});
