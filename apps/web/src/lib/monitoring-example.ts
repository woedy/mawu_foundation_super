/**
 * Example usage of monitoring utilities
 * This file demonstrates how to use the monitoring system
 */

import { api } from './api';
import {
  logApiError,
  logWarning,
  logInfo,
  measureApiCall,
  recordCacheHit,
  recordCacheMiss,
  logFallbackUsage,
  getCacheStatistics,
  getPerformanceStatistics,
} from './monitoring';

// Example 1: Measuring API call performance
export async function fetchProductsWithMonitoring() {
  try {
    const response = await measureApiCall(
      'GET /api/products',
      () => api.get('/api/products'),
      false // not cached
    );
    
    logInfo(
      'Products fetched successfully',
      'fetchProductsWithMonitoring',
      { count: response.products.length }
    );
    
    return response.products;
  } catch (error) {
    logApiError(
      error instanceof Error ? error : new Error('Failed to fetch products'),
      'fetchProductsWithMonitoring',
      { endpoint: '/api/products' }
    );
    throw error;
  }
}

// Example 2: Cache tracking
export async function fetchWithCache(key: string, fetcher: () => Promise<any>) {
  // Check cache
  const cached = localStorage.getItem(key);
  
  if (cached) {
    recordCacheHit(key);
    logInfo('Using cached data', 'fetchWithCache', { key });
    return JSON.parse(cached);
  }
  
  recordCacheMiss(key);
  
  try {
    const data = await measureApiCall(
      `Fetch ${key}`,
      fetcher,
      false
    );
    
    // Cache the result
    localStorage.setItem(key, JSON.stringify(data));
    
    return data;
  } catch (error) {
    logApiError(
      error instanceof Error ? error : new Error('Fetch failed'),
      'fetchWithCache',
      { key }
    );
    throw error;
  }
}

// Example 3: Fallback data usage
export async function fetchProductsWithFallback(fallbackData: any[]) {
  try {
    const response = await measureApiCall(
      'GET /api/products',
      () => api.get('/api/products'),
      false
    );
    
    return response.products;
  } catch (error) {
    logApiError(
      error instanceof Error ? error : new Error('API failed'),
      'fetchProductsWithFallback',
      { endpoint: '/api/products' }
    );
    
    logFallbackUsage(
      'fetchProductsWithFallback',
      'API request failed, using fallback data',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackCount: fallbackData.length 
      }
    );
    
    return fallbackData;
  }
}

// Example 4: Warning for edge cases
export function validateCartItem(item: any) {
  if (!item.productId) {
    logWarning(
      'Cart item missing productId',
      'validateCartItem',
      { itemId: item.id, itemName: item.name }
    );
    return false;
  }
  
  if (item.quantity <= 0) {
    logWarning(
      'Cart item has invalid quantity',
      'validateCartItem',
      { itemId: item.id, quantity: item.quantity }
    );
    return false;
  }
  
  return true;
}

// Example 5: Getting monitoring statistics
export function logMonitoringStats() {
  console.log('=== Monitoring Statistics ===');
  
  const cacheStats = getCacheStatistics();
  console.log('Cache Statistics:', {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate: `${cacheStats.hitRate}%`,
    totalRequests: cacheStats.totalRequests,
  });
  
  const perfStats = getPerformanceStatistics();
  console.log('Performance Statistics:', {
    totalCalls: perfStats.count,
    averageDuration: `${perfStats.averageDuration}ms`,
    minDuration: `${perfStats.minDuration}ms`,
    maxDuration: `${perfStats.maxDuration}ms`,
    successRate: `${perfStats.successRate}%`,
  });
}

// Example 6: Complex operation with multiple monitoring points
export async function complexOperationWithMonitoring() {
  logInfo('Starting complex operation', 'complexOperationWithMonitoring');
  
  try {
    // Step 1: Fetch products
    const products = await measureApiCall(
      'GET /api/products',
      () => api.get('/api/products'),
      false
    );
    
    logInfo(
      'Products fetched',
      'complexOperationWithMonitoring',
      { count: products.products.length }
    );
    
    // Step 2: Process each product
    for (const product of products.products) {
      // Check cache for product details
      const cacheKey = `product_${product.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        recordCacheHit(cacheKey);
      } else {
        recordCacheMiss(cacheKey);
        
        // Fetch product details
        const details = await measureApiCall(
          `GET /api/products/${product.slug}`,
          () => api.get(`/api/products/${product.slug}`),
          false
        );
        
        localStorage.setItem(cacheKey, JSON.stringify(details));
      }
    }
    
    logInfo(
      'Complex operation completed',
      'complexOperationWithMonitoring'
    );
    
    // Log final statistics
    logMonitoringStats();
    
  } catch (error) {
    logApiError(
      error instanceof Error ? error : new Error('Complex operation failed'),
      'complexOperationWithMonitoring'
    );
    throw error;
  }
}
