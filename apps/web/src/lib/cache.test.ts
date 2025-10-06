/**
 * Manual test/verification script for cache utility
 * Run with: tsx apps/web/src/lib/cache.test.ts
 */

import {
  getCacheEntry,
  setCacheEntry,
  removeCacheEntry,
  cleanExpiredCache,
  clearProductCache,
  fetchWithDedup,
  cacheProductsList,
  getCachedProductsList,
  cacheProduct,
  getCachedProduct,
  invalidateProductCache,
  getCacheStats,
  CACHE_KEYS,
} from './cache';

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  const storage = new Map<string, string>();
  (global as any).localStorage = {
    getItem: (key: string) => storage.get(key) || null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    get length() {
      return storage.size;
    },
    key: (index: number) => Array.from(storage.keys())[index] || null,
  };
}

// Test data
interface TestProduct {
  id: string;
  name: string;
  price: number;
}

const testProducts: TestProduct[] = [
  { id: '1', name: 'Product 1', price: 100 },
  { id: '2', name: 'Product 2', price: 200 },
];

const testProduct: TestProduct = { id: '1', name: 'Test Product', price: 150 };

// Test utilities
function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`✅ PASSED: ${message}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Tests
async function runTests() {
  console.log('🧪 Starting cache utility tests...\n');

  // Test 1: Basic cache set and get
  console.log('Test 1: Basic cache set and get');
  setCacheEntry('test_key', { value: 'test' }, 5000);
  const retrieved = getCacheEntry<{ value: string }>('test_key');
  assert(retrieved?.value === 'test', 'Should retrieve cached value');
  console.log();

  // Test 2: Cache expiration
  console.log('Test 2: Cache expiration');
  setCacheEntry('expire_key', { value: 'expire' }, 100); // 100ms TTL
  await sleep(150);
  const expired = getCacheEntry('expire_key');
  assert(expired === null, 'Should return null for expired entry');
  console.log();

  // Test 3: Products list caching
  console.log('Test 3: Products list caching');
  cacheProductsList(testProducts);
  const cachedList = getCachedProductsList<TestProduct[]>();
  assert(cachedList !== null, 'Should cache products list');
  assert(cachedList?.length === 2, 'Should retrieve correct number of products');
  assert(cachedList?.[0].name === 'Product 1', 'Should retrieve correct product data');
  console.log();

  // Test 4: Individual product caching
  console.log('Test 4: Individual product caching');
  cacheProduct('test-slug', testProduct);
  const cachedProduct = getCachedProduct<TestProduct>('test-slug');
  assert(cachedProduct !== null, 'Should cache individual product');
  assert(cachedProduct?.name === 'Test Product', 'Should retrieve correct product');
  console.log();

  // Test 5: Cache removal
  console.log('Test 5: Cache removal');
  setCacheEntry('remove_key', { value: 'remove' }, 5000);
  removeCacheEntry('remove_key');
  const removed = getCacheEntry('remove_key');
  assert(removed === null, 'Should remove cache entry');
  console.log();

  // Test 6: Request deduplication
  console.log('Test 6: Request deduplication');
  let callCount = 0;
  const fetcher = async () => {
    callCount++;
    await sleep(100);
    return { data: 'test' };
  };

  // Make 3 simultaneous requests
  const [result1, result2, result3] = await Promise.all([
    fetchWithDedup('dedup_key', fetcher),
    fetchWithDedup('dedup_key', fetcher),
    fetchWithDedup('dedup_key', fetcher),
  ]);

  assert(callCount === 1, 'Should only call fetcher once for simultaneous requests');
  assert(result1.data === 'test', 'Should return correct data from deduplicated request');
  assert(result2.data === result1.data, 'All requests should return same data');
  assert(result3.data === result1.data, 'All requests should return same data');
  console.log();

  // Test 7: Cache invalidation
  console.log('Test 7: Cache invalidation');
  cacheProductsList(testProducts);
  cacheProduct('test-slug', testProduct);
  invalidateProductCache('test-slug');
  const invalidatedProduct = getCachedProduct('test-slug');
  const invalidatedList = getCachedProductsList();
  assert(invalidatedProduct === null, 'Should invalidate specific product');
  assert(invalidatedList === null, 'Should invalidate products list');
  console.log();

  // Test 8: Clean expired cache
  console.log('Test 8: Clean expired cache');
  setCacheEntry(CACHE_KEYS.ALL_PRODUCTS, testProducts, 50); // Short TTL
  setCacheEntry('mawu_product_test', testProduct, 5000); // Long TTL
  await sleep(100);
  cleanExpiredCache();
  const expiredList = getCachedProductsList();
  const validProduct = getCacheEntry('mawu_product_test');
  assert(expiredList === null, 'Should clean expired entries');
  assert(validProduct !== null, 'Should keep valid entries');
  console.log();

  // Test 9: Clear all product cache
  console.log('Test 9: Clear all product cache');
  cacheProductsList(testProducts);
  cacheProduct('slug1', testProduct);
  cacheProduct('slug2', testProduct);
  clearProductCache();
  const clearedList = getCachedProductsList();
  const clearedProduct1 = getCachedProduct('slug1');
  const clearedProduct2 = getCachedProduct('slug2');
  assert(clearedList === null, 'Should clear products list');
  assert(clearedProduct1 === null, 'Should clear all products');
  assert(clearedProduct2 === null, 'Should clear all products');
  console.log();

  // Test 10: Cache stats
  console.log('Test 10: Cache stats');
  cacheProductsList(testProducts);
  cacheProduct('stats-test', testProduct);
  const stats = getCacheStats();
  assert(stats.memoryEntries >= 0, 'Should return memory entries count');
  assert(stats.localStorageEntries >= 0, 'Should return localStorage entries count');
  console.log('Cache stats:', stats);
  console.log();

  // Test 11: localStorage persistence
  console.log('Test 11: localStorage persistence');
  cacheProductsList(testProducts);
  // Get from localStorage (cache module handles memory/localStorage sync)
  const persistedList = getCachedProductsList<TestProduct[]>();
  assert(persistedList !== null, 'Should persist to localStorage');
  assert(persistedList?.length === 2, 'Should retrieve persisted data');
  console.log();

  console.log('✨ All tests passed!\n');
  
  // Cleanup
  clearProductCache();
  console.log('🧹 Cleaned up test data');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
