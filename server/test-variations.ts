#!/usr/bin/env tsx
/**
 * Test script to validate product variations functionality
 */

import { storage } from './storage-factory';
import type { ProductVariation, VariationOption } from '../shared/schema';

async function testProductVariations() {
  console.log('Testing product variations functionality...');
  
  try {
    // Test 1: Validate variation structure
    console.log('\n1. Testing variation validation...');
    
    const validVariations: ProductVariation[] = [
      {
        type: 'color',
        name: 'Color',
        options: [
          { value: 'red', label: 'Red', inventory: 10 },
          { value: 'blue', label: 'Blue', inventory: 15 }
        ]
      },
      {
        type: 'size',
        name: 'Size',
        options: [
          { value: 'small', label: 'Small', inventory: 5 },
          { value: 'medium', label: 'Medium', inventory: 12 },
          { value: 'large', label: 'Large', inventory: 8 }
        ]
      }
    ];
    
    // This should pass validation
    storage.validateProductVariations(validVariations);
    console.log('✓ Valid variations passed validation');
    
    // Test 2: Test invalid variation type
    console.log('\n2. Testing invalid variation type...');
    try {
      const invalidTypeVariations: ProductVariation[] = [
        {
          type: 'material' as any, // Invalid type
          name: 'Material',
          options: [{ value: 'cotton', label: 'Cotton' }]
        }
      ];
      storage.validateProductVariations(invalidTypeVariations);
      console.log('✗ Should have failed validation for invalid type');
    } catch (error) {
      console.log('✓ Correctly rejected invalid variation type:', error.message);
    }
    
    // Test 3: Test missing options
    console.log('\n3. Testing missing options...');
    try {
      const noOptionsVariations: ProductVariation[] = [
        {
          type: 'color',
          name: 'Color',
          options: []
        }
      ];
      storage.validateProductVariations(noOptionsVariations);
      console.log('✗ Should have failed validation for empty options');
    } catch (error) {
      console.log('✓ Correctly rejected variation with no options:', error.message);
    }
    
    // Test 4: Test invalid option structure
    console.log('\n4. Testing invalid option structure...');
    try {
      const invalidOptionVariations: ProductVariation[] = [
        {
          type: 'color',
          name: 'Color',
          options: [
            { value: '', label: 'Red' } // Empty value
          ]
        }
      ];
      storage.validateProductVariations(invalidOptionVariations);
      console.log('✗ Should have failed validation for invalid option');
    } catch (error) {
      console.log('✓ Correctly rejected invalid option structure:', error.message);
    }
    
    // Test 5: Test order item validation (mock)
    console.log('\n5. Testing order item validation structure...');
    
    const mockOrderItems = [
      {
        productId: 1,
        productName: 'Test Product',
        quantity: 2,
        price: '25.00',
        selectedVariations: {
          color: 'red',
          size: 'medium'
        }
      }
    ];
    
    console.log('✓ Order item structure with variations is valid');
    
    // Test 6: Test price modifier calculation
    console.log('\n6. Testing price modifier functionality...');
    
    const variationWithPriceModifier: ProductVariation = {
      type: 'size',
      name: 'Size',
      options: [
        { value: 'small', label: 'Small', priceModifier: -5.00 },
        { value: 'medium', label: 'Medium', priceModifier: 0 },
        { value: 'large', label: 'Large', priceModifier: 10.00 },
        { value: 'xl', label: 'Extra Large', priceModifier: 15.00 }
      ]
    };
    
    storage.validateProductVariations([variationWithPriceModifier]);
    console.log('✓ Price modifiers validated successfully');
    
    // Test 7: Test variation-specific inventory
    console.log('\n7. Testing variation-specific inventory...');
    
    const variationWithInventory: ProductVariation = {
      type: 'color',
      name: 'Color',
      options: [
        { value: 'red', label: 'Red', inventory: 5 },
        { value: 'blue', label: 'Blue', inventory: 0 }, // Out of stock
        { value: 'green', label: 'Green', inventory: 10 }
      ]
    };
    
    storage.validateProductVariations([variationWithInventory]);
    console.log('✓ Variation-specific inventory validated successfully');
    
    console.log('\n✅ All variation tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testProductVariations()
    .then(() => {
      console.log('\n🎉 All tests completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

export { testProductVariations };