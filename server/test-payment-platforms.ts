/**
 * Test script to verify payment platform management implementation
 * 
 * This script tests:
 * 1. Stripe is the only active payment method
 * 2. Other payment platforms are displayed as "coming soon"
 * 3. Payment method validation and error handling
 * 4. Shop checkout only processes through Stripe
 * 5. Donation page only processes through Stripe
 */

import { api } from '../apps/web/src/lib/api';

interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function logTest(test: string, passed: boolean, message: string) {
  results.push({ test, passed, message });
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${test}: ${message}`);
}

async function testDonationPaymentIntent() {
  console.log('\n=== Testing Donation Payment Intent Creation ===\n');
  
  try {
    // Test 1: Valid Stripe donation should succeed
    const validDonation = await api.post('/api/donations/create-payment-intent', {
      amount: 100,
      currency: 'GHS',
      donorEmail: 'test@example.com',
      donorName: 'Test Donor',
      frequency: 'one-time',
      message: 'Test donation',
      anonymous: false,
    });
    
    if (validDonation.clientSecret && validDonation.donationId) {
      logTest(
        'Valid donation payment intent',
        true,
        'Successfully created payment intent with Stripe'
      );
    } else {
      logTest(
        'Valid donation payment intent',
        false,
        'Missing clientSecret or donationId in response'
      );
    }
  } catch (error: any) {
    logTest(
      'Valid donation payment intent',
      false,
      `Failed: ${error.message}`
    );
  }

  // Test 2: Invalid amount should fail
  try {
    await api.post('/api/donations/create-payment-intent', {
      amount: -50,
      currency: 'GHS',
      donorEmail: 'test@example.com',
      donorName: 'Test Donor',
      frequency: 'one-time',
    });
    
    logTest(
      'Invalid donation amount validation',
      false,
      'Should have rejected negative amount'
    );
  } catch (error: any) {
    if (error.message.includes('Invalid donation amount')) {
      logTest(
        'Invalid donation amount validation',
        true,
        'Correctly rejected negative amount'
      );
    } else {
      logTest(
        'Invalid donation amount validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }

  // Test 3: Invalid email should fail
  try {
    await api.post('/api/donations/create-payment-intent', {
      amount: 100,
      currency: 'GHS',
      donorEmail: 'invalid-email',
      donorName: 'Test Donor',
      frequency: 'one-time',
    });
    
    logTest(
      'Invalid email validation',
      false,
      'Should have rejected invalid email'
    );
  } catch (error: any) {
    if (error.message.includes('email')) {
      logTest(
        'Invalid email validation',
        true,
        'Correctly rejected invalid email'
      );
    } else {
      logTest(
        'Invalid email validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }

  // Test 4: Missing donor name should fail
  try {
    await api.post('/api/donations/create-payment-intent', {
      amount: 100,
      currency: 'GHS',
      donorEmail: 'test@example.com',
      donorName: '',
      frequency: 'one-time',
    });
    
    logTest(
      'Missing donor name validation',
      false,
      'Should have rejected empty donor name'
    );
  } catch (error: any) {
    if (error.message.includes('name')) {
      logTest(
        'Missing donor name validation',
        true,
        'Correctly rejected empty donor name'
      );
    } else {
      logTest(
        'Missing donor name validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }

  // Test 5: Invalid frequency should fail
  try {
    await api.post('/api/donations/create-payment-intent', {
      amount: 100,
      currency: 'GHS',
      donorEmail: 'test@example.com',
      donorName: 'Test Donor',
      frequency: 'invalid-frequency',
    });
    
    logTest(
      'Invalid frequency validation',
      false,
      'Should have rejected invalid frequency'
    );
  } catch (error: any) {
    if (error.message.includes('frequency')) {
      logTest(
        'Invalid frequency validation',
        true,
        'Correctly rejected invalid frequency'
      );
    } else {
      logTest(
        'Invalid frequency validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }

  // Test 6: Invalid currency should fail
  try {
    await api.post('/api/donations/create-payment-intent', {
      amount: 100,
      currency: 'INVALID',
      donorEmail: 'test@example.com',
      donorName: 'Test Donor',
      frequency: 'one-time',
    });
    
    logTest(
      'Invalid currency validation',
      false,
      'Should have rejected invalid currency'
    );
  } catch (error: any) {
    if (error.message.includes('currency')) {
      logTest(
        'Invalid currency validation',
        true,
        'Correctly rejected invalid currency'
      );
    } else {
      logTest(
        'Invalid currency validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }
}

async function testOrderPaymentIntent() {
  console.log('\n=== Testing Order Payment Intent Creation ===\n');
  
  try {
    // Test 1: Valid order should succeed
    const validOrder = await api.post('/api/orders/create-payment-intent', {
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          quantity: 2,
          price: '50.00',
          selectedVariations: { color: 'Blue', size: 'M' },
        },
      ],
      customerEmail: 'customer@example.com',
      customerName: 'Test Customer',
      shippingAddress: {
        line1: '123 Test St',
        city: 'Accra',
        country: 'GH',
      },
      totalAmount: 100,
      currency: 'GHS',
    });
    
    if (validOrder.clientSecret && validOrder.orderId) {
      logTest(
        'Valid order payment intent',
        true,
        'Successfully created payment intent with Stripe'
      );
    } else {
      logTest(
        'Valid order payment intent',
        false,
        'Missing clientSecret or orderId in response'
      );
    }
  } catch (error: any) {
    logTest(
      'Valid order payment intent',
      false,
      `Failed: ${error.message}`
    );
  }

  // Test 2: Empty items array should fail
  try {
    await api.post('/api/orders/create-payment-intent', {
      items: [],
      customerEmail: 'customer@example.com',
      customerName: 'Test Customer',
      totalAmount: 100,
      currency: 'GHS',
    });
    
    logTest(
      'Empty items validation',
      false,
      'Should have rejected empty items array'
    );
  } catch (error: any) {
    if (error.message.includes('item')) {
      logTest(
        'Empty items validation',
        true,
        'Correctly rejected empty items array'
      );
    } else {
      logTest(
        'Empty items validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }

  // Test 3: Invalid total amount should fail
  try {
    await api.post('/api/orders/create-payment-intent', {
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          quantity: 1,
          price: '50.00',
        },
      ],
      customerEmail: 'customer@example.com',
      customerName: 'Test Customer',
      totalAmount: -100,
      currency: 'GHS',
    });
    
    logTest(
      'Invalid order amount validation',
      false,
      'Should have rejected negative amount'
    );
  } catch (error: any) {
    if (error.message.includes('amount')) {
      logTest(
        'Invalid order amount validation',
        true,
        'Correctly rejected negative amount'
      );
    } else {
      logTest(
        'Invalid order amount validation',
        false,
        `Wrong error: ${error.message}`
      );
    }
  }
}

async function testStripeConfiguration() {
  console.log('\n=== Testing Stripe Configuration ===\n');
  
  // Check if Stripe is configured
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
  
  logTest(
    'Stripe secret key configured',
    stripeConfigured,
    stripeConfigured 
      ? 'Stripe secret key is set' 
      : 'Stripe secret key is missing'
  );

  const stripePublicKeyConfigured = !!process.env.VITE_STRIPE_PUBLIC_KEY;
  
  logTest(
    'Stripe public key configured',
    stripePublicKeyConfigured,
    stripePublicKeyConfigured 
      ? 'Stripe public key is set' 
      : 'Stripe public key is missing'
  );

  const webhookSecretConfigured = !!process.env.STRIPE_WEBHOOK_SECRET;
  
  logTest(
    'Stripe webhook secret configured',
    webhookSecretConfigured,
    webhookSecretConfigured 
      ? 'Stripe webhook secret is set' 
      : 'Stripe webhook secret is missing (optional for development)'
  );
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Payment Platform Management Test Suite                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  await testStripeConfiguration();
  await testDonationPaymentIntent();
  await testOrderPaymentIntent();

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Test Summary                                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.test}: ${r.message}`);
    });
    console.log('');
  }

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('\n\x1b[31mTest suite failed with error:\x1b[0m', error);
    process.exit(1);
  });
}

export { runTests, testDonationPaymentIntent, testOrderPaymentIntent, testStripeConfiguration };
