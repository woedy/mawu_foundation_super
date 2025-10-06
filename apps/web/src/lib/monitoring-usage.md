# Monitoring and Logging Usage Guide

This document describes how to use the monitoring and logging utilities in the Mawu Foundation application.

## Overview

The monitoring system provides:
- **Structured error logging** with context and details
- **Performance measurement** for API calls
- **Cache analytics** (hit/miss rates)
- **Fallback data usage tracking**
- **Development debugging utilities**

## Initialization

The monitoring system is automatically initialized in `main.tsx`:

```typescript
import { initializeMonitoring } from './lib/monitoring';

initializeMonitoring();
```

## API Error Logging

### Basic Usage

```typescript
import { logApiError } from '../lib/monitoring';

try {
  const response = await api.get('/api/products');
} catch (error) {
  logApiError(
    error instanceof Error ? error : new Error('Failed to fetch'),
    'ProductList',
    { endpoint: '/api/products' }
  );
}
```

### With Additional Context

```typescript
logApiError(
  error,
  'CartContext.validateCart',
  { 
    itemId: item.id, 
    itemName: item.name,
    productId: item.productId 
  }
);
```

## Performance Measurement

### Measuring API Calls

```typescript
import { measureApiCall } from '../lib/monitoring';

const response = await measureApiCall(
  'GET /api/products',
  () => api.get('/api/products'),
  false // cached = false
);
```

### Measuring Cached Calls

```typescript
const response = await measureApiCall(
  'GET /api/products (cached)',
  () => getCachedData(),
  true // cached = true
);
```

## Cache Analytics

### Recording Cache Hits/Misses

```typescript
import { recordCacheHit, recordCacheMiss } from '../lib/monitoring';

const cached = getCachedProducts();
if (cached) {
  recordCacheHit('mawu_products_all');
  return cached;
}

recordCacheMiss('mawu_products_all');
// Fetch from API...
```

### Getting Cache Statistics

```typescript
import { getCacheStatistics, logCacheStats } from '../lib/monitoring';

// Get stats programmatically
const stats = getCacheStatistics();
console.log(`Cache hit rate: ${stats.hitRate}%`);

// Or log formatted stats
logCacheStats();
```

## Fallback Data Usage

### Logging Fallback Usage

```typescript
import { logFallbackUsage } from '../lib/monitoring';

logFallbackUsage(
  'useProducts',
  'API request failed',
  { error: err instanceof Error ? err.message : 'Unknown error' }
);
```

## Warning and Info Logging

### Logging Warnings

```typescript
import { logWarning } from '../lib/monitoring';

logWarning(
  'Cart item missing productId',
  'CartContext.validateCart',
  { itemId: item.id, itemName: item.name }
);
```

### Logging Info (Development Only)

```typescript
import { logInfo } from '../lib/monitoring';

logInfo(
  'Products loaded successfully',
  'useProducts',
  { count: products.length }
);
```

## Development Debugging

In development mode, monitoring utilities are exposed on the window object:

```javascript
// Open browser console and use:

// View cache statistics
window.__monitoring.logCacheStats();

// View performance statistics
window.__monitoring.logPerformanceStats();

// Get raw statistics
const cacheStats = window.__monitoring.getCacheStatistics();
const perfStats = window.__monitoring.getPerformanceStatistics();

// Reset metrics
window.__monitoring.resetMetrics();
```

## Console Output Examples

### Development Mode

```
[Performance] ✓ GET /api/products: 245.32ms
[Cache] ✗ Miss: mawu_products_all
[Cache] ✓ Hit: mawu_product_kente-tee
[WARN] useProducts: Using fallback data: API request failed
[ERROR] CartContext.validateCart: Failed to validate cart item
```

### Cache Statistics

```
[Cache Stats] {
  hits: 15,
  misses: 3,
  hitRate: '83.33%',
  totalRequests: 18
}
```

### Performance Statistics

```
[Performance Stats] {
  totalCalls: 25,
  averageDuration: '312ms',
  minDuration: '89ms',
  maxDuration: '1245ms',
  successRate: '96%'
}
```

## Production Behavior

In production mode:
- Error logs are sent to error tracking service (placeholder for Sentry/LogRocket)
- Performance warnings are logged for slow API calls (>3000ms)
- Info logs are suppressed
- Cache and performance stats are tracked but not logged to console
- Structured error data is still logged for debugging

## Integration Points

The monitoring system is integrated in:

1. **useProducts hook** (`hooks/useProducts.ts`)
   - API call measurement
   - Cache hit/miss tracking
   - Error logging
   - Fallback usage tracking

2. **useProduct hook** (`hooks/useProduct.ts`)
   - API call measurement
   - Cache hit/miss tracking
   - Error logging
   - Fallback usage tracking

3. **CartContext** (`contexts/CartContext.tsx`)
   - Cart validation API calls
   - Error logging
   - Warning for missing product IDs

## Best Practices

1. **Always wrap API calls with measureApiCall** for performance tracking
2. **Log errors with context** to help with debugging
3. **Track cache operations** to optimize cache strategy
4. **Use appropriate log levels** (error, warn, info)
5. **Include relevant details** in log entries
6. **Test monitoring in development** using window.__monitoring utilities

## Future Enhancements

- Integration with Sentry for error tracking
- Integration with analytics service (Google Analytics, Mixpanel)
- Real-time monitoring dashboard
- Automated alerting for high error rates
- Performance regression detection
