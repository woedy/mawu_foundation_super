/**
 * Manual test script for cart validation with real-time API data
 * 
 * This script demonstrates the cart validation functionality by:
 * 1. Simulating cart items with different scenarios
 * 2. Testing validation against API product data
 * 3. Verifying all validation rules work correctly
 * 
 * Run with: npx tsx server/test-cart-validation.ts
 */

import { api } from '../apps/web/src/lib/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  impactStatement?: string;
  selectedVariations?: Record<string, string>;
  productId?: string;
  maxInventory?: number;
}

interface ValidationResult {
  itemId: string;
  valid: boolean;
  message?: string;
  suggestedQuantity?: number;
}

interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  tags: string[];
  impactStatement: string;
  description: string;
  images: string[];
  availability: 'in_stock' | 'low_stock' | 'backorder';
  inventory: number;
  variations?: any[];
}

// Simulate the validateCart function from CartContext
async function validateCart(items: CartItem[]): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  for (const item of items) {
    try {
      // Skip validation if no productId is available
      if (!item.productId) {
        results.push({
          itemId: item.id,
          valid: true,
          message: 'Unable to validate - no product ID',
        });
        continue;
      }

      // Fetch current product data from API
      const response = await api.get(`/api/products/${item.productId}`);
      const product: ShopProduct = response.product;
      
      const result: ValidationResult = {
        itemId: item.id,
        valid: true,
      };
      
      // Validate product availability
      if (product.availability === 'backorder') {
        result.valid = false;
        result.message = 'Item is currently on backorder';
      }
      
      // Validate inventory against requested quantity
      if (product.inventory <= 0) {
        result.valid = false;
        result.message = 'Item is out of stock';
        result.suggestedQuantity = 0;
      } else if (item.quantity > product.inventory) {
        result.valid = false;
        result.message = `Only ${product.inventory} available`;
        result.suggestedQuantity = product.inventory;
      }
      
      // Check for price changes (notify user but don't invalidate)
      const priceDifference = Math.abs(item.price - product.price);
      if (priceDifference > 0.01) {
        // Price changed - notify user
        if (!result.message) {
          result.message = `Price updated from GHS ${item.price.toFixed(2)} to GHS ${product.price.toFixed(2)}`;
        } else {
          result.message += ` (Price also changed to GHS ${product.price.toFixed(2)})`;
        }
      }
      
      // Warn about low stock (but still valid)
      if (product.availability === 'low_stock' && result.valid) {
        result.message = `Low stock - only ${product.inventory} remaining`;
      }
      
      results.push(result);
    } catch (error) {
      console.error(`Failed to validate cart item ${item.id}:`, error);
      results.push({
        itemId: item.id,
        valid: false,
        message: 'Unable to validate item availability',
      });
    }
  }
  
  return results;
}

async function runTests() {
  console.log('🧪 Testing Cart Validation with Real-Time API Data\n');
  console.log('=' .repeat(60));
  
  try {
    // First, fetch all products to get real product IDs
    console.log('\n📦 Fetching products from API...');
    const productsResponse = await api.get('/api/products');
    const products = productsResponse.products || [];
    
    if (products.length === 0) {
      console.log('❌ No products found in API. Please seed the database first.');
      return;
    }
    
    console.log(`✅ Found ${products.length} products\n`);
    
    // Test Case 1: Valid cart item with correct quantity
    console.log('Test 1: Valid cart item with available inventory');
    console.log('-'.repeat(60));
    const testProduct1 = products[0];
    const cartItems1: CartItem[] = [{
      id: testProduct1.id,
      name: testProduct1.name,
      price: testProduct1.price,
      quantity: 1,
      image: testProduct1.images[0],
      productId: testProduct1.id,
      maxInventory: testProduct1.inventory,
    }];
    
    const results1 = await validateCart(cartItems1);
    console.log('Cart Item:', {
      name: cartItems1[0].name,
      quantity: cartItems1[0].quantity,
      price: cartItems1[0].price,
    });
    console.log('Validation Result:', results1[0]);
    console.log(results1[0].valid ? '✅ PASS' : '❌ FAIL');
    
    // Test Case 2: Cart item with quantity exceeding inventory
    console.log('\n\nTest 2: Cart item exceeding available inventory');
    console.log('-'.repeat(60));
    const testProduct2 = products[0];
    const cartItems2: CartItem[] = [{
      id: testProduct2.id,
      name: testProduct2.name,
      price: testProduct2.price,
      quantity: testProduct2.inventory + 10, // Exceed inventory
      image: testProduct2.images[0],
      productId: testProduct2.id,
      maxInventory: testProduct2.inventory,
    }];
    
    const results2 = await validateCart(cartItems2);
    console.log('Cart Item:', {
      name: cartItems2[0].name,
      requestedQuantity: cartItems2[0].quantity,
      availableInventory: testProduct2.inventory,
    });
    console.log('Validation Result:', results2[0]);
    console.log(!results2[0].valid && results2[0].suggestedQuantity ? '✅ PASS' : '❌ FAIL');
    
    // Test Case 3: Cart item with price change
    console.log('\n\nTest 3: Cart item with price change');
    console.log('-'.repeat(60));
    const testProduct3 = products[0];
    const cartItems3: CartItem[] = [{
      id: testProduct3.id,
      name: testProduct3.name,
      price: testProduct3.price - 10, // Old price
      quantity: 1,
      image: testProduct3.images[0],
      productId: testProduct3.id,
      maxInventory: testProduct3.inventory,
    }];
    
    const results3 = await validateCart(cartItems3);
    console.log('Cart Item:', {
      name: cartItems3[0].name,
      oldPrice: cartItems3[0].price,
      currentPrice: testProduct3.price,
    });
    console.log('Validation Result:', results3[0]);
    console.log(results3[0].message?.includes('Price updated') ? '✅ PASS' : '❌ FAIL');
    
    // Test Case 4: Multiple items validation
    console.log('\n\nTest 4: Multiple cart items validation');
    console.log('-'.repeat(60));
    const cartItems4: CartItem[] = products.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: p.images[0],
      productId: p.id,
      maxInventory: p.inventory,
    }));
    
    const results4 = await validateCart(cartItems4);
    console.log(`Validating ${cartItems4.length} items...`);
    results4.forEach((result, index) => {
      console.log(`\nItem ${index + 1}: ${cartItems4[index].name}`);
      console.log('  Valid:', result.valid);
      if (result.message) console.log('  Message:', result.message);
    });
    console.log(results4.length === cartItems4.length ? '\n✅ PASS' : '\n❌ FAIL');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All cart validation tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

// Run the tests
runTests().catch(console.error);
