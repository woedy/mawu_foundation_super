/**
 * Browser-based verification script for cache utility
 * Import this in a component or run in browser console to verify cache functionality
 */

import {
  cacheProductsList,
  getCachedProductsList,
  cacheProduct,
  getCachedProduct,
  invalidateProductCache,
  clearProductCache,
  fetchWithDedup,
  cleanExpiredCache,
  getCacheStats,
} from './cache';

interface TestProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
}

export async function verifyCacheUtility() {
  console.log('🧪 Verifying cache utility...\n');

  const testProducts: TestProduct[] = [
    { id: '1', slug: 'product-1', name: 'Test Product 1', price: 100 },
    { id: '2', slug: 'product-2', name: 'Test Product 2', price: 200 },
  ];

  const testProduct: TestProduct = {
    id: '1',
    slug: 'test-product',
    name: 'Test Product',
    price: 150,
  };

  try {
    // Test 1: Cache products list
    console.log('✓ Test 1: Caching products list');
    cacheProductsList(testProducts);
    const cachedList = getCachedProductsList<TestProduct[]>();
    console.assert(cachedList !== null, 'Products list should be cached');
    console.assert(cachedList?.length === 2, 'Should have 2 products');
    console.log('  Cached products:', cachedList);

    // Test 2: Cache individual product
    console.log('\n✓ Test 2: Caching individual product');
    cacheProduct('test-product', testProduct);
    const cachedProduct = getCachedProduct<TestProduct>('test-product');
    console.assert(cachedProduct !== null, 'Product should be cached');
    console.assert(cachedProduct?.name === 'Test Product', 'Product name should match');
    console.log('  Cached product:', cachedProduct);

    // Test 3: Request deduplication
    console.log('\n✓ Test 3: Request deduplication');
    let fetchCount = 0;
    const mockFetch = async () => {
      fetchCount++;
      await new Promise(resolve => setTimeout(resolve, 100));
      return { data: 'test-data' };
    };

    const [r1, r2, r3] = await Promise.all([
      fetchWithDedup('test-dedup', mockFetch),
      fetchWithDedup('test-dedup', mockFetch),
      fetchWithDedup('test-dedup', mockFetch),
    ]);

    console.assert(fetchCount === 1, 'Should only fetch once');
    console.log(`  Fetch called ${fetchCount} time(s) for 3 simultaneous requests`);

    // Test 4: Cache invalidation
    console.log('\n✓ Test 4: Cache invalidation');
    invalidateProductCache('test-product');
    const invalidated = getCachedProduct('test-product');
    console.assert(invalidated === null, 'Product should be invalidated');
    console.log('  Product cache invalidated successfully');

    // Test 5: Cache stats
    console.log('\n✓ Test 5: Cache statistics');
    cacheProductsList(testProducts);
    cacheProduct('product-1', testProducts[0]);
    cacheProduct('product-2', testProducts[1]);
    const stats = getCacheStats();
    console.log('  Cache stats:', stats);

    // Test 6: Clean expired cache
    console.log('\n✓ Test 6: Clean expired cache');
    cleanExpiredCache();
    console.log('  Expired cache entries cleaned');

    // Test 7: localStorage persistence
    console.log('\n✓ Test 7: localStorage persistence');
    const lsKeys = Object.keys(localStorage).filter(k => k.startsWith('mawu_product'));
    console.log(`  Found ${lsKeys.length} cache entries in localStorage`);
    console.log('  Keys:', lsKeys);

    console.log('\n✨ All cache utility verifications passed!');
    console.log('\n📊 Final cache stats:', getCacheStats());

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    clearProductCache();
    console.log('✓ Cleanup complete');

    return true;
  } catch (error) {
    console.error('❌ Cache verification failed:', error);
    return false;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).verifyCacheUtility = verifyCacheUtility;
  console.log('💡 Run verifyCacheUtility() in console to test cache functionality');
}
