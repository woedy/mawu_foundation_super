/**
 * Cache utility for product data with in-memory and localStorage persistence
 * Implements expiration, cleanup, and request deduplication
 */

import { recordCacheHit, recordCacheMiss, logInfo } from './monitoring';

// Cache configuration
const CACHE_CONFIG = {
  PRODUCTS_LIST_TTL: 5 * 60 * 1000, // 5 minutes
  PRODUCT_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
} as const;

// Cache keys
export const CACHE_KEYS = {
  ALL_PRODUCTS: 'mawu_products_all',
  PRODUCT_PREFIX: 'mawu_product_',
} as const;

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// In-memory cache for fast access during session
const memoryCache = new Map<string, CacheEntry<any>>();

// Pending requests map for deduplication
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Get data from cache (checks memory first, then localStorage)
 */
export function getCacheEntry<T>(key: string): T | null {
  const now = Date.now();

  // Check memory cache first
  const memEntry = memoryCache.get(key);
  if (memEntry && memEntry.expiresAt > now) {
    recordCacheHit(key);
    return memEntry.data as T;
  }

  // Check localStorage
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const entry: CacheEntry<T> = JSON.parse(stored);
      
      // Check if expired
      if (entry.expiresAt > now) {
        // Restore to memory cache
        memoryCache.set(key, entry);
        recordCacheHit(key);
        return entry.data;
      } else {
        // Remove expired entry
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn(`Failed to read cache entry ${key}:`, error);
    // Clean up corrupted entry
    localStorage.removeItem(key);
  }

  recordCacheMiss(key);
  return null;
}

/**
 * Set data in cache (both memory and localStorage)
 */
export function setCacheEntry<T>(key: string, data: T, ttl: number): void {
  const now = Date.now();
  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiresAt: now + ttl,
  };

  // Store in memory
  memoryCache.set(key, entry);

  // Store in localStorage
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.warn(`Failed to write cache entry ${key}:`, error);
    // If localStorage is full, try to clean up and retry
    cleanExpiredCache();
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (retryError) {
      console.error(`Failed to write cache entry ${key} after cleanup:`, retryError);
    }
  }
}

/**
 * Remove a specific cache entry
 */
export function removeCacheEntry(key: string): void {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove cache entry ${key}:`, error);
  }
}

/**
 * Clean up expired cache entries from localStorage
 */
export function cleanExpiredCache(): void {
  const now = Date.now();
  const keysToRemove: string[] = [];

  try {
    // Iterate through localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mawu_product')) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry: CacheEntry<any> = JSON.parse(stored);
            if (entry.expiresAt < now) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // If we can't parse it, it's corrupted - remove it
          keysToRemove.push(key);
        }
      }
    }

    // Remove expired entries
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      memoryCache.delete(key);
    });

    if (keysToRemove.length > 0) {
      logInfo(
        `Cleaned up ${keysToRemove.length} expired cache entries`,
        'Cache',
        { count: keysToRemove.length }
      );
    }
  } catch (error) {
    console.error('Failed to clean expired cache:', error);
  }
}

/**
 * Clear all product cache entries
 */
export function clearProductCache(): void {
  // Clear memory cache
  const keysToDelete: string[] = [];
  memoryCache.forEach((_, key) => {
    if (key.startsWith('mawu_product')) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => memoryCache.delete(key));

  // Clear localStorage
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mawu_product')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear product cache:', error);
  }
}

/**
 * Fetch with request deduplication
 * Prevents duplicate simultaneous requests for the same resource
 */
export async function fetchWithDedup<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Check if there's already a pending request for this key
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  // Create new request
  const promise = fetcher().finally(() => {
    // Clean up pending request after completion
    pendingRequests.delete(key);
  });

  // Store pending request
  pendingRequests.set(key, promise);

  return promise;
}

/**
 * Get cache key for a specific product by slug
 */
export function getProductCacheKey(slug: string): string {
  return `${CACHE_KEYS.PRODUCT_PREFIX}${slug}`;
}

/**
 * Cache products list
 */
export function cacheProductsList<T>(products: T): void {
  setCacheEntry(CACHE_KEYS.ALL_PRODUCTS, products, CACHE_CONFIG.PRODUCTS_LIST_TTL);
}

/**
 * Get cached products list
 */
export function getCachedProductsList<T>(): T | null {
  return getCacheEntry<T>(CACHE_KEYS.ALL_PRODUCTS);
}

/**
 * Cache individual product
 */
export function cacheProduct<T>(slug: string, product: T): void {
  const key = getProductCacheKey(slug);
  setCacheEntry(key, product, CACHE_CONFIG.PRODUCT_DETAIL_TTL);
}

/**
 * Get cached product by slug
 */
export function getCachedProduct<T>(slug: string): T | null {
  const key = getProductCacheKey(slug);
  return getCacheEntry<T>(key);
}

/**
 * Invalidate product cache (useful when product is updated)
 */
export function invalidateProductCache(slug?: string): void {
  if (slug) {
    // Invalidate specific product
    const key = getProductCacheKey(slug);
    removeCacheEntry(key);
  }
  // Always invalidate products list when any product changes
  removeCacheEntry(CACHE_KEYS.ALL_PRODUCTS);
}

/**
 * Get cache statistics for debugging
 */
export function getCacheStats() {
  const stats = {
    memoryEntries: memoryCache.size,
    pendingRequests: pendingRequests.size,
    localStorageEntries: 0,
    localStorageSize: 0,
  };

  try {
    let totalSize = 0;
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mawu_product')) {
        count++;
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
    }
    stats.localStorageEntries = count;
    stats.localStorageSize = totalSize;
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
  }

  return stats;
}

// Initialize: Clean expired cache on module load
cleanExpiredCache();
