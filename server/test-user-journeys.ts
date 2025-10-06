/**
 * User Journey Test Suite
 * 
 * Tests complete user flows from start to finish:
 * 1. Product browsing to purchase completion
 * 2. Donation flow from amount selection to receipt
 * 3. Admin management workflows
 */

import { config } from 'dotenv';
config();

interface JourneyResult {
  journey: string;
  steps: Array<{
    step: string;
    passed: boolean;
    message: string;
    duration?: number;
  }>;
  totalDuration: number;
  success: boolean;
}

class UserJourneyTest {
  private baseUrl: string;
  private results: JourneyResult[] = [];

  constructor() {
    this.baseUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warn: '\x1b[33m',
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}${message}${reset}`);
  }

  // Journey 1: Product Purchase Flow
  async testProductPurchaseJourney() {
    this.log('\n=== Testing Product Purchase Journey ===', 'info');
    
    const journey: JourneyResult = {
      journey: 'Product Purchase',
      steps: [],
      totalDuration: 0,
      success: true
    };

    const startTime = Date.now();

    try {
      // Step 1: Browse products
      const step1Start = Date.now();
      const productsResponse = await fetch(`${this.baseUrl}/api/products`);
      const products = await productsResponse.json();
      
      journey.steps.push({
        step: 'Browse Products',
        passed: productsResponse.ok && products.length > 0,
        message: `Found ${products.length} products`,
        duration: Date.now() - step1Start
      });

      if (!products.length) {
        throw new Error('No products available for testing');
      }

      // Step 2: View product details
      const step2Start = Date.now();
      const testProduct = products[0];
      const productResponse = await fetch(`${this.baseUrl}/api/products/${testProduct.slug}`);
      const productDetails = await productResponse.json();
      
      journey.steps.push({
        step: 'View Product Details',
        passed: productResponse.ok && productDetails.id === testProduct.id,
        message: `Loaded product: ${productDetails.name}`,
        duration: Date.now() - step2Start
      });

      // Step 3: Create payment intent (simulating add to cart + checkout)
      const step3Start = Date.now();
      const orderData = {
        items: [{
          productId: testProduct.id,
          productName: testProduct.name,
          quantity: 1,
          price: testProduct.price,
          selectedVariations: {}
        }],
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345',
          country: 'US'
        }
      };

      const paymentResponse = await fetch(`${this.baseUrl}/api/orders/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const paymentData = await paymentResponse.json();
      
      journey.steps.push({
        step: 'Create Payment Intent',
        passed: paymentResponse.ok && paymentData.clientSecret,
        message: paymentResponse.ok 
          ? `Payment intent created: ${paymentData.orderId}` 
          : `Failed: ${paymentData.error || 'Unknown error'}`,
        duration: Date.now() - step3Start
      });

      // Step 4: Verify order was created
      if (paymentResponse.ok && paymentData.orderId) {
        const step4Start = Date.now();
        const { db } = await import('./storage.js');
        const { orders } = await import('../shared/schema.js');
        const { eq } = await import('drizzle-orm');
        
        const [order] = await db.select().from(orders).where(eq(orders.id, paymentData.orderId));
        
        journey.steps.push({
          step: 'Verify Order Created',
          passed: !!order && order.status === 'pending',
          message: order ? `Order ${order.id} created with status: ${order.status}` : 'Order not found',
          duration: Date.now() - step4Start
        });
      }

    } catch (error: any) {
      journey.steps.push({
        step: 'Journey Error',
        passed: false,
        message: error.message,
        duration: 0
      });
      journey.success = false;
    }

    journey.totalDuration = Date.now() - startTime;
    journey.success = journey.steps.every(s => s.passed);
    this.results.push(journey);
    
    this.printJourneyResults(journey);
  }

  // Journey 2: Donation Flow
  async testDonationJourney() {
    this.log('\n=== Testing Donation Journey ===', 'info');
    
    const journey: JourneyResult = {
      journey: 'Donation Flow',
      steps: [],
      totalDuration: 0,
      success: true
    };

    const startTime = Date.now();

    try {
      // Step 1: Create donation payment intent
      const step1Start = Date.now();
      const donationData = {
        amount: 50.00,
        currency: 'usd',
        donorEmail: 'donor@example.com',
        donorName: 'Test Donor',
        frequency: 'one-time',
        message: 'Test donation for journey testing',
        anonymous: false
      };

      const paymentResponse = await fetch(`${this.baseUrl}/api/donations/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
      });

      const paymentData = await paymentResponse.json();
      
      journey.steps.push({
        step: 'Create Donation Payment Intent',
        passed: paymentResponse.ok && paymentData.clientSecret,
        message: paymentResponse.ok 
          ? `Payment intent created: ${paymentData.donationId}` 
          : `Failed: ${paymentData.error || 'Unknown error'}`,
        duration: Date.now() - step1Start
      });

      // Step 2: Verify donation was created
      if (paymentResponse.ok && paymentData.donationId) {
        const step2Start = Date.now();
        const { db } = await import('./storage.js');
        const { donations } = await import('../shared/schema.js');
        const { eq } = await import('drizzle-orm');
        
        const [donation] = await db.select().from(donations).where(eq(donations.id, paymentData.donationId));
        
        journey.steps.push({
          step: 'Verify Donation Created',
          passed: !!donation && donation.status === 'pending',
          message: donation 
            ? `Donation ${donation.id} created with amount: $${donation.amount}` 
            : 'Donation not found',
          duration: Date.now() - step2Start
        });

        // Step 3: Check donation amount validation
        const step3Start = Date.now();
        const amountMatches = donation && parseFloat(donation.amount) === donationData.amount;
        
        journey.steps.push({
          step: 'Validate Donation Amount',
          passed: amountMatches,
          message: amountMatches 
            ? 'Donation amount correctly stored' 
            : 'Amount mismatch',
          duration: Date.now() - step3Start
        });
      }

    } catch (error: any) {
      journey.steps.push({
        step: 'Journey Error',
        passed: false,
        message: error.message,
        duration: 0
      });
      journey.success = false;
    }

    journey.totalDuration = Date.now() - startTime;
    journey.success = journey.steps.every(s => s.passed);
    this.results.push(journey);
    
    this.printJourneyResults(journey);
  }

  // Journey 3: Admin Management Flow
  async testAdminJourney() {
    this.log('\n=== Testing Admin Management Journey ===', 'info');
    
    const journey: JourneyResult = {
      journey: 'Admin Management',
      steps: [],
      totalDuration: 0,
      success: true
    };

    const startTime = Date.now();

    try {
      // Step 1: Admin login
      const step1Start = Date.now();
      const loginResponse = await fetch(`${this.baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD
        })
      });

      const loginData = await loginResponse.json();
      const cookies = loginResponse.headers.get('set-cookie');
      
      journey.steps.push({
        step: 'Admin Login',
        passed: loginResponse.ok && loginData.admin,
        message: loginResponse.ok 
          ? `Logged in as: ${loginData.admin?.email}` 
          : `Failed: ${loginData.error || 'Unknown error'}`,
        duration: Date.now() - step1Start
      });

      if (!loginResponse.ok || !cookies) {
        throw new Error('Admin login failed - cannot continue journey');
      }

      // Step 2: Access admin dashboard (verify session)
      const step2Start = Date.now();
      const meResponse = await fetch(`${this.baseUrl}/api/admin/me`, {
        headers: { 'Cookie': cookies }
      });

      const meData = await meResponse.json();
      
      journey.steps.push({
        step: 'Verify Admin Session',
        passed: meResponse.ok && meData.admin,
        message: meResponse.ok 
          ? 'Session valid' 
          : 'Session invalid',
        duration: Date.now() - step2Start
      });

      // Step 3: View orders
      const step3Start = Date.now();
      const ordersResponse = await fetch(`${this.baseUrl}/api/admin/orders`, {
        headers: { 'Cookie': cookies }
      });

      const ordersData = await ordersResponse.json();
      
      journey.steps.push({
        step: 'View Orders',
        passed: ordersResponse.ok && Array.isArray(ordersData),
        message: ordersResponse.ok 
          ? `Found ${ordersData.length} orders` 
          : 'Failed to fetch orders',
        duration: Date.now() - step3Start
      });

      // Step 4: View donations
      const step4Start = Date.now();
      const donationsResponse = await fetch(`${this.baseUrl}/api/admin/donations`, {
        headers: { 'Cookie': cookies }
      });

      const donationsData = await donationsResponse.json();
      
      journey.steps.push({
        step: 'View Donations',
        passed: donationsResponse.ok && Array.isArray(donationsData),
        message: donationsResponse.ok 
          ? `Found ${donationsData.length} donations` 
          : 'Failed to fetch donations',
        duration: Date.now() - step4Start
      });

      // Step 5: Logout
      const step5Start = Date.now();
      const logoutResponse = await fetch(`${this.baseUrl}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Cookie': cookies }
      });

      journey.steps.push({
        step: 'Admin Logout',
        passed: logoutResponse.ok,
        message: logoutResponse.ok ? 'Logged out successfully' : 'Logout failed',
        duration: Date.now() - step5Start
      });

    } catch (error: any) {
      journey.steps.push({
        step: 'Journey Error',
        passed: false,
        message: error.message,
        duration: 0
      });
      journey.success = false;
    }

    journey.totalDuration = Date.now() - startTime;
    journey.success = journey.steps.every(s => s.passed);
    this.results.push(journey);
    
    this.printJourneyResults(journey);
  }

  private printJourneyResults(journey: JourneyResult) {
    console.log(`\n${journey.journey} Journey:`);
    console.log('-'.repeat(60));
    
    journey.steps.forEach((step, index) => {
      const icon = step.passed ? '✓' : '✗';
      const color = step.passed ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';
      console.log(`${color}${icon}${reset} Step ${index + 1}: ${step.step}`);
      console.log(`  ${step.message}`);
      if (step.duration) {
        console.log(`  Duration: ${step.duration}ms`);
      }
    });
    
    console.log('-'.repeat(60));
    console.log(`Total Duration: ${journey.totalDuration}ms`);
    console.log(`Status: ${journey.success ? '✓ PASSED' : '✗ FAILED'}`);
  }

  generateReport() {
    this.log('\n=== User Journey Test Report ===', 'info');
    
    const totalJourneys = this.results.length;
    const passedJourneys = this.results.filter(r => r.success).length;
    const failedJourneys = totalJourneys - passedJourneys;

    console.log('\n' + '='.repeat(60));
    console.log(`Total Journeys: ${totalJourneys}`);
    console.log(`Passed: ${passedJourneys}`);
    console.log(`Failed: ${failedJourneys}`);
    console.log('='.repeat(60));

    if (failedJourneys > 0) {
      this.log('\n⚠️  Failed Journeys:', 'warn');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.journey}`);
          r.steps
            .filter(s => !s.passed)
            .forEach(s => console.log(`    • ${s.step}: ${s.message}`));
        });
    }

    if (passedJourneys === totalJourneys) {
      this.log('\n✓ All user journeys completed successfully!', 'success');
      return true;
    } else {
      this.log('\n✗ Some user journeys failed. Please review and fix.', 'error');
      return false;
    }
  }

  async runAllJourneys() {
    this.log('Starting User Journey Tests...', 'info');
    this.log('='.repeat(60), 'info');

    await this.testProductPurchaseJourney();
    await this.testDonationJourney();
    await this.testAdminJourney();

    return this.generateReport();
  }
}

// Run tests
const tester = new UserJourneyTest();
tester.runAllJourneys()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
