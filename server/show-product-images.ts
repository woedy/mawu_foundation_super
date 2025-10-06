#!/usr/bin/env tsx
/**
 * Script to display product images for verification
 */

import { storage } from './storage-factory';

async function showProductImages() {
  console.log('Product Images Overview\n');
  console.log('='.repeat(80));
  
  try {
    const products = await storage.getAllProducts();
    
    for (const product of products) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Images (${product.images.length}):`);
      
      product.images.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal: ${products.length} products with images`);
    console.log('\nAll images are hosted on Unsplash (free stock photos)');
    console.log('Images are optimized at 800px width for web display');
    
  } catch (error) {
    console.error('Failed to show images:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  showProductImages()
    .then(() => {
      console.log('\nImage display completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { showProductImages };
