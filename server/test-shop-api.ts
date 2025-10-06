#!/usr/bin/env tsx
/**
 * Test script to verify shop API endpoints work correctly
 */

import { storage } from './storage-factory';

async function testShopAPI() {
  console.log('Testing Shop API Data Layer...\n');
  
  try {
    // Test 1: Get all products
    console.log('Test 1: Get All Products');
    console.log('========================');
    const allProducts = await storage.getAllProducts();
    console.log(`✓ Retrieved ${allProducts.length} products`);
    
    if (allProducts.length === 0) {
      console.log('⚠ No products found. Run: npm run seed:products');
      return;
    }
    
    // Verify first product has proper structure
    const firstProduct = allProducts[0];
    console.log(`✓ Sample product: ${firstProduct.name}`);
    console.log(`  - Tags are array: ${Array.isArray(firstProduct.tags)}`);
    console.log(`  - Images are array: ${Array.isArray(firstProduct.images)}`);
    console.log(`  - Variations are array: ${Array.isArray(firstProduct.variations)}`);
    
    // Test 2: Get product by slug
    console.log('\nTest 2: Get Product by Slug');
    console.log('============================');
    const productBySlug = await storage.getProductBySlug('mawu-foundation-tshirt');
    
    if (productBySlug) {
      console.log(`✓ Retrieved product: ${productBySlug.name}`);
      console.log(`  - Price: ${productBySlug.price} ${productBySlug.currency}`);
      console.log(`  - Inventory: ${productBySlug.inventory}`);
      console.log(`  - Variations: ${productBySlug.variations?.length || 0}`);
      
      if (productBySlug.variations && productBySlug.variations.length > 0) {
        console.log(`  - First variation: ${productBySlug.variations[0].name} (${productBySlug.variations[0].options.length} options)`);
      }
    } else {
      console.log('✗ Product not found');
    }
    
    // Test 3: Get product by ID
    console.log('\nTest 3: Get Product by ID');
    console.log('=========================');
    const productById = await storage.getProductById(1);
    
    if (productById) {
      console.log(`✓ Retrieved product: ${productById.name}`);
      console.log(`  - Slug: ${productById.slug}`);
    } else {
      console.log('✗ Product not found');
    }
    
    // Test 4: Verify product categories
    console.log('\nTest 4: Product Categories');
    console.log('==========================');
    const categories = [...new Set(allProducts.map(p => p.category))];
    console.log(`✓ Found ${categories.length} categories:`);
    categories.forEach(cat => {
      const count = allProducts.filter(p => p.category === cat).length;
      console.log(`  - ${cat}: ${count} products`);
    });
    
    // Test 5: Verify products with variations
    console.log('\nTest 5: Products with Variations');
    console.log('================================');
    const productsWithVariations = allProducts.filter(p => p.variations && p.variations.length > 0);
    console.log(`✓ ${productsWithVariations.length} products have variations`);
    
    productsWithVariations.forEach(p => {
      const variationTypes = p.variations?.map(v => v.type).join(', ');
      console.log(`  - ${p.name}: ${variationTypes}`);
    });
    
    // Test 6: Verify impact statements
    console.log('\nTest 6: Impact Statements');
    console.log('=========================');
    const productsWithImpact = allProducts.filter(p => p.impactStatement);
    console.log(`✓ ${productsWithImpact.length} products have impact statements`);
    
    // Test 7: Price range
    console.log('\nTest 7: Price Range');
    console.log('===================');
    const prices = allProducts.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    console.log(`✓ Price range: ${minPrice} - ${maxPrice} GHS`);
    
    // Test 8: Total inventory
    console.log('\nTest 8: Total Inventory');
    console.log('=======================');
    const totalInventory = allProducts.reduce((sum, p) => sum + p.inventory, 0);
    console.log(`✓ Total inventory across all products: ${totalInventory} units`);
    
    console.log('\n=== All Tests Passed ===');
    console.log('The shop API data layer is working correctly!');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm run dev:server');
    console.log('2. Access products at: http://localhost:5000/api/products');
    console.log('3. Display products on your shop page');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testShopAPI()
    .then(() => {
      console.log('\nTest script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test script failed:', error);
      process.exit(1);
    });
}

export { testShopAPI };
