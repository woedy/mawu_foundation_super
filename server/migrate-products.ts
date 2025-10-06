#!/usr/bin/env tsx
/**
 * Migration script to update existing products with proper variations structure
 * This script ensures all existing products have the correct variations field format
 */

import { storage } from './storage-factory';

async function migrateProductVariations() {
  console.log('Starting product variations migration...');
  
  try {
    // Get all existing products
    const products = await storage.getAllProducts();
    console.log(`Found ${products.length} products to check`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let updatedVariations = product.variations || [];
      
      // Ensure variations is an array
      if (!Array.isArray(updatedVariations)) {
        updatedVariations = [];
        needsUpdate = true;
      }
      
      // Validate and fix any malformed variations
      const validVariations = updatedVariations.filter(variation => {
        if (!variation || typeof variation !== 'object') return false;
        if (!['color', 'size', 'style'].includes(variation.type)) return false;
        if (!variation.name || typeof variation.name !== 'string') return false;
        if (!Array.isArray(variation.options)) return false;
        
        // Validate options
        variation.options = variation.options.filter(option => {
          return option && 
                 typeof option === 'object' && 
                 option.value && 
                 typeof option.value === 'string' &&
                 option.label && 
                 typeof option.label === 'string';
        });
        
        return variation.options.length > 0;
      });
      
      if (validVariations.length !== updatedVariations.length) {
        updatedVariations = validVariations;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await storage.updateProduct(product.id, {
          variations: updatedVariations
        });
        updatedCount++;
        console.log(`Updated product: ${product.name} (ID: ${product.id})`);
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} products.`);
    
    // Example: Add sample variations to a product if none exist
    const sampleProduct = products.find(p => p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('tee'));
    if (sampleProduct && (!sampleProduct.variations || sampleProduct.variations.length === 0)) {
      console.log(`Adding sample variations to product: ${sampleProduct.name}`);
      
      await storage.updateProduct(sampleProduct.id, {
        variations: [
          {
            type: 'color',
            name: 'Color',
            options: [
              { value: 'red', label: 'Red', inventory: 10 },
              { value: 'blue', label: 'Blue', inventory: 15 },
              { value: 'green', label: 'Green', inventory: 8 }
            ]
          },
          {
            type: 'size',
            name: 'Size',
            options: [
              { value: 'small', label: 'Small', inventory: 12 },
              { value: 'medium', label: 'Medium', inventory: 20 },
              { value: 'large', label: 'Large', inventory: 15 },
              { value: 'xl', label: 'Extra Large', inventory: 8 }
            ]
          }
        ]
      });
      console.log('Sample variations added successfully');
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateProductVariations()
    .then(() => {
      console.log('Migration script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateProductVariations };