/**
 * Example usage of cache utility with API calls
 * This demonstrates how to integrate caching with the existing API client
 */

import { api } from './api';
import {
  getCachedProductsList,
  cacheProductsList,
  getCachedProduct,
  cacheProduct,
  fetchWithDedup,
  cleanExpiredCache,
} from './cache';

// Example product type (should match your actual product type)
interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  availability: string;
  inventory: number;
}

/**
 * Fetch products with caching
 * 1. Check cache first
 * 2. If not cached or expired, fetch from API
 * 3. Cache the result
 * 4. Use request deduplication to prevent duplicate calls
 */
export async function fetchProductsWithCache(): Promise<Product[]> {
  // Check cache first
  const cached = getCachedProductsList<Product[]>();
  if (cached) {
    console.log('✓ Using cached products list');
    return cached;
  }

  // Fetch with deduplication
  console.log('→ Fetching products from API...');
  return fetchWithDedup('products-list', async () => {
    try {
      const response = await api.get('/api/products');
      const products = response.products as Product[];
      
      // Cache the result
      cacheProductsList(products);
      console.log(`✓ Cached ${products.length} products`);
      
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  });
}

/**
 * Fetch single product with caching
 */
export async function fetchProductWithCache(slug: string): Promise<Product | null> {
  // Check cache first
  const cached = getCachedProduct<Product>(slug);
  if (cached) {
    console.log(`✓ Using cached product: ${slug}`);
    return cached;
  }

  // Fetch with deduplication
  console.log(`→ Fetching product from API: ${slug}`);
  return fetchWithDedup(`product-${slug}`, async () => {
    try {
      const response = await api.get(`/api/products/${slug}`);
      const product = response.product as Product;
      
      // Cache the result
      cacheProduct(slug, product);
      console.log(`✓ Cached product: ${slug}`);
      
      return product;
    } catch (error) {
      console.error(`Failed to fetch product ${slug}:`, error);
      return null;
    }
  });
}

/**
 * Initialize cache on app startup
 * Clean up expired entries
 */
export function initializeCache(): void {
  console.log('🔧 Initializing cache...');
  cleanExpiredCache();
  console.log('✓ Cache initialized');
}

/**
 * Example: Fetch products with automatic caching
 */
export async function exampleUsage() {
  console.log('📦 Cache Example Usage\n');

  // Initialize cache
  initializeCache();

  // First call - will fetch from API
  console.log('\n1. First call (should fetch from API):');
  const products1 = await fetchProductsWithCache();
  console.log(`   Retrieved ${products1.length} products`);

  // Second call - will use cache
  console.log('\n2. Second call (should use cache):');
  const products2 = await fetchProductsWithCache();
  console.log(`   Retrieved ${products2.length} products`);

  // Fetch individual product
  if (products1.length > 0) {
    const slug = products1[0].slug;
    
    console.log(`\n3. Fetch product detail (${slug}):`);
    const product1 = await fetchProductWithCache(slug);
    console.log(`   Retrieved: ${product1?.name}`);

    console.log(`\n4. Fetch same product again (should use cache):`);
    const product2 = await fetchProductWithCache(slug);
    console.log(`   Retrieved: ${product2?.name}`);
  }

  // Demonstrate deduplication
  console.log('\n5. Simultaneous requests (should deduplicate):');
  const [p1, p2, p3] = await Promise.all([
    fetchProductsWithCache(),
    fetchProductsWithCache(),
    fetchProductsWithCache(),
  ]);
  console.log(`   All requests returned ${p1.length} products`);

  console.log('\n✨ Example complete!');
}

// Export for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).cacheExample = exampleUsage;
  console.log('💡 Run cacheExample() in console to see cache in action');
}
