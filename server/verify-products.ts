#!/usr/bin/env tsx
/**
 * Verification script to check seeded products
 */

import { storage } from './storage-factory';

async function verifyProducts() {
  console.log('Verifying seeded products...\n');
  
  try {
    const products = await storage.getAllProducts();
    
    console.log(`Total products in database: ${products.length}\n`);
    
    if (products.length === 0) {
      console.log('No products found. Run: npm run seed:products');
      return;
    }
    
    console.log('=== Product List ===\n');
    
    for (const product of products) {
      console.log(`📦 ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Price: ${product.price} ${product.currency}`);
      console.log(`   Inventory: ${product.inventory}`);
      console.log(`   Tags: ${Array.isArray(product.tags) ? product.tags.join(', ') : product.tags}`);
      
      if (product.variations && Array.isArray(product.variations) && product.variations.length > 0) {
        console.log(`   Variations:`);
        for (const variation of product.variations) {
          console.log(`     - ${variation.name} (${variation.type}): ${variation.options.length} options`);
        }
      }
      
      if (product.impactStatement) {
        console.log(`   Impact: ${product.impactStatement}`);
      }
      
      console.log('');
    }
    
    // Test retrieving a specific product
    console.log('=== Testing Product Retrieval ===\n');
    const testProduct = await storage.getProductBySlug('mawu-foundation-tshirt');
    
    if (testProduct) {
      console.log('✓ Successfully retrieved product by slug');
      console.log(`  Product: ${testProduct.name}`);
      console.log(`  Variations: ${JSON.stringify(testProduct.variations, null, 2)}`);
    } else {
      console.log('✗ Failed to retrieve product by slug');
    }
    
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  verifyProducts()
    .then(() => {
      console.log('\nVerification complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Verification failed:', error);
      process.exit(1);
    });
}

export { verifyProducts };
