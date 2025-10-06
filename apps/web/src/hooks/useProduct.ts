import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { fallbackShopCatalog } from '../data/shop-fallback';
import type { ShopProduct } from '../types/shop';
import { validateProduct, logValidationError, isProductValidationError } from '../utils/productValidation';
import { 
  logApiError, 
  measureApiCall, 
  recordCacheHit, 
  recordCacheMiss,
  logFallbackUsage 
} from '../lib/monitoring';

interface UseProductResult {
  product: ShopProduct | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const CACHE_KEY_PREFIX = 'mawu_product_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Get cached product from localStorage
const getCachedProduct = (slug: string): ShopProduct | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${slug}`);
    if (!cached) return null;

    const entry: CacheEntry<ShopProduct> = JSON.parse(cached);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${slug}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
};

// Cache product in localStorage
const cacheProduct = (slug: string, product: ShopProduct): void => {
  try {
    const entry: CacheEntry<ShopProduct> = {
      data: product,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };
    localStorage.setItem(`${CACHE_KEY_PREFIX}${slug}`, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache product:', error);
  }
};

// Track pending requests to prevent duplicates
const pendingRequests = new Map<string, Promise<ShopProduct | null>>();

export const useProduct = (slug: string): UseProductResult => {
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async (productSlug: string): Promise<ShopProduct | null> => {
    const cacheKey = `${CACHE_KEY_PREFIX}${productSlug}`;
    
    // Check cache first
    const cached = getCachedProduct(productSlug);
    if (cached) {
      recordCacheHit(cacheKey);
      return cached;
    }

    recordCacheMiss(cacheKey);

    // Deduplicate requests
    if (pendingRequests.has(productSlug)) {
      return pendingRequests.get(productSlug)!;
    }

    const request = (async () => {
      try {
        const response = await measureApiCall(
          `GET /api/products/${productSlug}`,
          () => api.get(`/api/products/${productSlug}`),
          false
        );
        const rawProduct = response.product || null;
        
        if (!rawProduct) {
          return null;
        }
        
        // Validate API response
        let validatedProduct: ShopProduct;
        try {
          validatedProduct = validateProduct(rawProduct);
        } catch (err) {
          if (isProductValidationError(err)) {
            logValidationError(err, `useProduct - ${productSlug}`);
          }
          logFallbackUsage(
            'useProduct',
            `Product validation failed for ${productSlug}`,
            { error: err instanceof Error ? err.message : 'Unknown error' }
          );
          
          // Fall back to static data on validation error
          const fallbackProduct = fallbackShopCatalog.products.find(
            (p) => p.slug === productSlug
          );
          return fallbackProduct || null;
        }
        
        // Cache the validated result
        cacheProduct(productSlug, validatedProduct);
        
        return validatedProduct;
      } catch (err: any) {
        logApiError(
          err instanceof Error ? err : new Error(`Failed to fetch product ${productSlug}`),
          'useProduct',
          { endpoint: `/api/products/${productSlug}`, slug: productSlug }
        );
        
        // Check if it's a 404 error
        if (err.statusCode === 404) {
          return null;
        }
        
        logFallbackUsage(
          'useProduct',
          `API request failed for ${productSlug}`,
          { error: err instanceof Error ? err.message : 'Unknown error' }
        );
        
        // Fall back to static data for other errors
        const fallbackProduct = fallbackShopCatalog.products.find(
          (p) => p.slug === productSlug
        );
        return fallbackProduct || null;
      } finally {
        pendingRequests.delete(productSlug);
      }
    })();

    pendingRequests.set(productSlug, request);
    return request;
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedProduct = await fetchProduct(slug);
      setProduct(fetchedProduct);
      
      if (!fetchedProduct) {
        setError(new Error('Product not found'));
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch product');
      setError(errorObj);
      
      // Try fallback data
      const fallbackProduct = fallbackShopCatalog.products.find(
        (p) => p.slug === slug
      );
      setProduct(fallbackProduct || null);
    } finally {
      setLoading(false);
    }
  }, [slug, fetchProduct]);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      setError(new Error('No product slug provided'));
      return;
    }

    let isActive = true;

    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(slug);
        
        if (isActive) {
          setProduct(fetchedProduct);
          
          if (!fetchedProduct) {
            setError(new Error('Product not found'));
          } else {
            setError(null);
          }
        }
      } catch (err) {
        if (isActive) {
          const errorObj = err instanceof Error ? err : new Error('Failed to fetch product');
          setError(errorObj);
          
          // Try fallback data
          const fallbackProduct = fallbackShopCatalog.products.find(
            (p) => p.slug === slug
          );
          setProduct(fallbackProduct || null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [slug, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch,
  };
};
