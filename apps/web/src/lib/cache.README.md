# Cache Utility

A comprehensive caching layer for product data with in-memory and localStorage persistence, expiration management, and request deduplication.

## Features

- ✅ **Dual-layer caching**: In-memory cache for fast access + localStorage for persistence
- ✅ **Configurable TTL**: 5 minutes for product lists, 10 minutes for product details
- ✅ **Automatic expiration**: Expired entries are automatically cleaned up
- ✅ **Request deduplication**: Prevents duplicate simultaneous API calls
- ✅ **Type-safe**: Full TypeScript support with generics
- ✅ **Graceful degradation**: Handles localStorage errors and quota exceeded scenarios

## Usage

### Basic Cache Operations

```typescript
import {
  setCacheEntry,
  getCacheEntry,
  removeCacheEntry,
} from '@/lib/cache';

// Set cache entry with 5 minute TTL
setCacheEntry('my-key', { data: 'value' }, 5 * 60 * 1000);

// Get cache entry (returns null if expired or not found)
const data = getCacheEntry<{ data: string }>('my-key');

// Remove cache entry
removeCacheEntry('my-key');
```

### Product-Specific Helpers

```typescript
import {
  cacheProductsList,
  getCachedProductsList,
  cacheProduct,
  getCachedProduct,
  invalidateProductCache,
} from '@/lib/cache';

// Cache products list (5 min TTL)
cacheProductsList(products);

// Get cached products list
const products = getCachedProductsList<Product[]>();

// Cache individual product (10 min TTL)
cacheProduct('product-slug', product);

// Get cached product
const product = getCachedProduct<Product>('product-slug');

// Invalidate product cache
invalidateProductCache('product-slug'); // Specific product
invalidateProductCache(); // All products list
```

### Request Deduplication

```typescript
import { fetchWithDedup } from '@/lib/cache';

// Multiple simultaneous calls will only execute fetcher once
const data = await fetchWithDedup('unique-key', async () => {
  const response = await fetch('/api/products');
  return response.json();
});
```

### Cache Management

```typescript
import {
  cleanExpiredCache,
  clearProductCache,
  getCacheStats,
} from '@/lib/cache';

// Clean up expired entries
cleanExpiredCache();

// Clear all product cache
clearProductCache();

// Get cache statistics
const stats = getCacheStats();
console.log(stats);
// {
//   memoryEntries: 5,
//   pendingRequests: 0,
//   localStorageEntries: 5,
//   localStorageSize: 12345
// }
```

## Configuration

Cache TTL values are configured in the utility:

```typescript
const CACHE_CONFIG = {
  PRODUCTS_LIST_TTL: 5 * 60 * 1000, // 5 minutes
  PRODUCT_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
};
```

Cache keys follow a consistent naming pattern:

```typescript
export const CACHE_KEYS = {
  ALL_PRODUCTS: 'mawu_products_all',
  PRODUCT_PREFIX: 'mawu_product_',
};
```

## How It Works

### Cache Entry Structure

Each cache entry contains:

```typescript
interface CacheEntry<T> {
  data: T;              // The cached data
  timestamp: number;    // When it was cached
  expiresAt: number;    // When it expires
}
```

### Cache Lookup Flow

1. Check in-memory cache first (fastest)
2. If not found or expired, check localStorage
3. If found in localStorage and valid, restore to memory
4. If expired, remove from both caches
5. Return null if not found or expired

### Request Deduplication

When multiple components request the same data simultaneously:

1. First request creates a promise and stores it
2. Subsequent requests return the same promise
3. All requests receive the same result
4. Promise is cleaned up after completion

### Automatic Cleanup

- Expired entries are removed when accessed
- `cleanExpiredCache()` is called on module initialization
- Manual cleanup can be triggered anytime
- Handles corrupted entries gracefully

## Error Handling

The cache utility handles various error scenarios:

- **localStorage quota exceeded**: Attempts cleanup and retry
- **Corrupted cache entries**: Removes invalid entries
- **localStorage unavailable**: Falls back to memory-only cache
- **JSON parse errors**: Removes corrupted entries

## Testing

Run the verification script to test cache functionality:

```typescript
import { verifyCacheUtility } from '@/lib/verify-cache';

// In browser console or component
await verifyCacheUtility();
```

Or use the test suite:

```bash
tsx apps/web/src/lib/cache.test.ts
```

## Integration with Hooks

Example usage in a custom hook:

```typescript
import { useEffect, useState } from 'react';
import { getCachedProductsList, cacheProductsList, fetchWithDedup } from '@/lib/cache';
import { api } from '@/lib/api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache first
    const cached = getCachedProductsList<Product[]>();
    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }

    // Fetch with deduplication
    fetchWithDedup('products-list', async () => {
      const response = await api.get('/api/products');
      const data = response.products;
      
      // Cache the result
      cacheProductsList(data);
      setProducts(data);
      setLoading(false);
      
      return data;
    });
  }, []);

  return { products, loading };
}
```

## Performance Considerations

- **Memory cache**: O(1) lookup time
- **localStorage**: Slightly slower but persists across page reloads
- **Deduplication**: Prevents unnecessary network requests
- **Automatic cleanup**: Prevents memory leaks and stale data

## Browser Compatibility

- Requires localStorage support (all modern browsers)
- Falls back gracefully if localStorage is unavailable
- Uses standard JavaScript APIs (Map, Promise, etc.)

## Best Practices

1. **Use product-specific helpers** for consistency
2. **Invalidate cache** when data changes on the server
3. **Clean expired cache** periodically in long-running apps
4. **Monitor cache stats** to optimize TTL values
5. **Handle null returns** from cache getters gracefully

## Future Enhancements

- [ ] IndexedDB support for larger datasets
- [ ] Cache versioning for schema changes
- [ ] Compression for large cache entries
- [ ] Cache warming strategies
- [ ] Real-time cache invalidation via WebSocket
