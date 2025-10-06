#!/usr/bin/env tsx
/**
 * Script to clear all products from the database
 * Use this before reseeding with updated data
 */

import { db } from './storage-factory';
import { products } from '../shared/schema';

async function clearProducts() {
  console.log('Clearing all products from database...');
  
  try {
    const result = await db.delete(products);
    console.log('✓ All products cleared successfully');
    console.log('You can now run: npm run seed:products');
  } catch (error) {
    console.error('Failed to clear products:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  clearProducts()
    .then(() => {
      console.log('\nClear products script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Clear products script failed:', error);
      process.exit(1);
    });
}

export { clearProducts };
