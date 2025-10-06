import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { fallbackShopCatalog } from '../data/shop-fallback';
import type { ShopProduct } from '../types/shop';
import { validateProducts, logValidationError, isProductValidationError } from '../utils/productValidation';
import { 
  logApiError, 
  measureApiCall, 
  recordCacheHit, 
  recordCacheMiss,
  logFallbackUsage 
} from '../lib/monitoring';

interface UseProductsResult {
  products: ShopProduct[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const CACHE_KEY = 'mawu_products_all';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Get cached products from localStorage
const getCachedProducts = (): ShopProduct[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const entry: CacheEntry<ShopProduct[]> = JSON.parse(cached);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
};

// Cache products in localStorage
const cacheProducts = (products: ShopProduct[]): void => {
  try {
    const entry: CacheEntry<ShopProduct[]> = {
      data: products,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache products:', error);
  }
};

// Track pending requests to prevent duplicates
let pendingRequest: Promise<ShopProduct[]> | null = null;

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async (): Promise<ShopProduct[]> => {
    // Check cache first
    const cached = getCachedProducts();
    if (cached) {
      recordCacheHit(CACHE_KEY);
      return cached;
    }

    recordCacheMiss(CACHE_KEY);

    // Deduplicate requests
    if (pendingRequest) {
      return pendingRequest;
    }

    pendingRequest = (async () => {
      try {
        const response = await measureApiCall(
          'GET /api/products',
          () => api.get('/api/products'),
          false
        );
        const rawProducts = response.products || [];
        
        // Validate API response
        let validatedProducts: ShopProduct[];
        try {
          validatedProducts = validateProducts(rawProducts);
          
          if (validatedProducts.length === 0 && rawProducts.length > 0) {
            logFallbackUsage(
              'useProducts',
              'All products failed validation',
              { rawCount: rawProducts.length }
            );
            return fallbackShopCatalog.products;
          }
        } catch (err) {
          if (isProductValidationError(err)) {
            logValidationError(err, 'useProducts - validateProducts');
          }
          logFallbackUsage(
            'useProducts',
            'Product validation failed',
            { error: err instanceof Error ? err.message : 'Unknown error' }
          );
          return fallbackShopCatalog.products;
        }
        
        // Cache the validated results
        cacheProducts(validatedProducts);
        
        return validatedProducts;
      } catch (err) {
        logApiError(
          err instanceof Error ? err : new Error('Failed to fetch products'),
          'useProducts',
          { endpoint: '/api/products' }
        );
        logFallbackUsage(
          'useProducts',
          'API request failed',
          { error: err instanceof Error ? err.message : 'Unknown error' }
        );
        // Fall back to static data
        return fallbackShopCatalog.products;
      } finally {
        pendingRequest = null;
      }
    })();

    return pendingRequest;
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch products');
      setError(errorObj);
      // Still set fallback products on error
      setProducts(fallbackShopCatalog.products);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        if (isActive) {
          setProducts(fetchedProducts);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          const errorObj = err instanceof Error ? err : new Error('Failed to fetch products');
          setError(errorObj);
          // Use fallback data on error
          setProducts(fallbackShopCatalog.products);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch,
  };
};
