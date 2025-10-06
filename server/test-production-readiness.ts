/**
 * Production Readiness Test Suite
 * 
 * This script tests all critical user journeys and system functionality
 * to ensure the platform is ready for production deployment.
 */

import { config } from 'dotenv';
config();

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

class ProductionReadinessTest {
  private results: TestResult[] = [];
  private baseUrl: string;

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

  private addResult(name: string, passed: boolean, message: string, details?: any) {
    this.results.push({ name, passed, message, details });
    if (passed) {
      this.log(`✓ ${name}: ${message}`, 'success');
    } else {
      this.log(`✗ ${name}: ${message}`, 'error');
      if (details) {
        console.log('  Details:', details);
      }
    }
  }

  // Test 1: Environment Configuration
  async testEnvironmentConfiguration() {
    this.log('\n=== Testing Environment Configuration ===', 'info');
    
    const requiredVars = [
      'DATABASE_URL',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'EMAIL_USER',
      'EMAIL_PASS',
      'SESSION_SECRET',
      'ADMIN_EMAIL',
      'ADMIN_PASSWORD'
    ];

    const missingVars = requiredVars.filter(v => !process.env[v]);
    
    if (missingVars.length === 0) {
      this.addResult(
        'Environment Variables',
        true,
        'All required environment variables are configured'
      );
    } else {
      this.addResult(
        'Environment Variables',
        false,
        'Missing required environment variables',
        { missing: missingVars }
      );
    }

    // Check for production-specific settings
    if (process.env.NODE_ENV === 'production') {
      const hasLiveStripeKey = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');
      this.addResult(
        'Stripe Production Keys',
        hasLiveStripeKey || false,
        hasLiveStripeKey 
          ? 'Using production Stripe keys' 
          : 'WARNING: Not using production Stripe keys'
      );
    }
  }

  // Test 2: Database Connectivity
  async testDatabaseConnectivity() {
    this.log('\n=== Testing Database Connectivity ===', 'info');
    
    try {
      const { db } = await import('./storage.js');
      const { products, orders, donations, admins } = await import('../shared/schema.js');
      
      // Test basic queries
      const productCount = await db.select().from(products);
      const orderCount = await db.select().from(orders);
      const donationCount = await db.select().from(donations);
      const adminCount = await db.select().from(admins);

      this.addResult(
        'Database Connection',
        true,
        'Successfully connected to database',
        {
          products: productCount.length,
          orders: orderCount.length,
          donations: donationCount.length,
          admins: adminCount.length
        }
      );

      // Verify admin exists
      if (adminCount.length === 0) {
        this.addResult(
          'Admin User',
          false,
          'No admin user found. Run: npm run seed:admin'
        );
      } else {
        this.addResult(
          'Admin User',
          true,
          `Admin user configured (${adminCount.length} admin(s))`
        );
      }

    } catch (error: any) {
      this.addResult(
        'Database Connection',
        false,
        'Failed to connect to database',
        { error: error.message }
      );
    }
  }

  // Test 3: Stripe Integration
  async testStripeIntegration() {
    this.log('\n=== Testing Stripe Integration ===', 'info');
    
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-12-18.acacia'
      });

      // Test API connectivity
      const account = await stripe.accounts.retrieve();
      this.addResult(
        'Stripe API Connection',
        true,
        'Successfully connected to Stripe API',
        { accountId: account.id }
      );

      // Test payment intent creation
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'usd',
        metadata: { test: 'production-readiness' }
      });

      this.addResult(
        'Payment Intent Creation',
        paymentIntent.status === 'requires_payment_method',
        'Successfully created test payment intent',
        { intentId: paymentIntent.id }
      );

      // Clean up test payment intent
      await stripe.paymentIntents.cancel(paymentIntent.id);

    } catch (error: any) {
      this.addResult(
        'Stripe Integration',
        false,
        'Stripe integration test failed',
        { error: error.message }
      );
    }
  }

  // Test 4: Email Service
  async testEmailService() {
    this.log('\n=== Testing Email Service ===', 'info');
    
    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Verify SMTP connection
      await transporter.verify();
      this.addResult(
        'Email SMTP Connection',
        true,
        'Successfully connected to Gmail SMTP'
      );

      // Test email sending (if TEST_EMAIL is configured)
      if (process.env.TEST_EMAIL) {
        const info = await transporter.sendMail({
          from: `"Mawu Foundation" <${process.env.EMAIL_USER}>`,
          to: process.env.TEST_EMAIL,
          subject: 'Production Readiness Test',
          text: 'This is a test email from the production readiness test suite.',
          html: '<p>This is a test email from the production readiness test suite.</p>',
        });

        this.addResult(
          'Email Sending',
          true,
          'Successfully sent test email',
          { messageId: info.messageId }
        );
      } else {
        this.addResult(
          'Email Sending',
          true,
          'Email service configured (skipped sending - no TEST_EMAIL set)'
        );
      }

    } catch (error: any) {
      this.addResult(
        'Email Service',
        false,
        'Email service test failed',
        { error: error.message }
      );
    }
  }

  // Test 5: API Endpoints
  async testAPIEndpoints() {
    this.log('\n=== Testing API Endpoints ===', 'info');
    
    const endpoints = [
      { path: '/api/products', method: 'GET', requiresAuth: false },
      { path: '/api/admin/me', method: 'GET', requiresAuth: true },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`, {
          method: endpoint.method,
        });

        if (endpoint.requiresAuth && response.status === 401) {
          this.addResult(
            `API: ${endpoint.path}`,
            true,
            'Endpoint properly requires authentication'
          );
        } else if (!endpoint.requiresAuth && response.ok) {
          this.addResult(
            `API: ${endpoint.path}`,
            true,
            'Endpoint accessible and responding'
          );
        } else {
          this.addResult(
            `API: ${endpoint.path}`,
            false,
            `Unexpected response: ${response.status}`,
            { status: response.status }
          );
        }
      } catch (error: any) {
        this.addResult(
          `API: ${endpoint.path}`,
          false,
          'Failed to reach endpoint',
          { error: error.message }
        );
      }
    }
  }

  // Test 6: Security Configuration
  async testSecurityConfiguration() {
    this.log('\n=== Testing Security Configuration ===', 'info');
    
    // Check session secret strength
    const sessionSecret = process.env.SESSION_SECRET || '';
    const isStrongSecret = sessionSecret.length >= 32;
    
    this.addResult(
      'Session Secret Strength',
      isStrongSecret,
      isStrongSecret 
        ? 'Session secret is sufficiently strong' 
        : 'WARNING: Session secret should be at least 32 characters'
    );

    // Check for default passwords
    const hasDefaultPassword = process.env.ADMIN_PASSWORD === 'changeme';
    this.addResult(
      'Admin Password Security',
      !hasDefaultPassword,
      hasDefaultPassword 
        ? 'WARNING: Using default admin password' 
        : 'Admin password has been changed from default'
    );

    // Check NODE_ENV
    const isProduction = process.env.NODE_ENV === 'production';
    this.addResult(
      'Environment Mode',
      true,
      `Running in ${process.env.NODE_ENV || 'development'} mode`,
      { isProduction }
    );
  }

  // Test 7: Data Validation
  async testDataValidation() {
    this.log('\n=== Testing Data Validation ===', 'info');
    
    try {
      const { db } = await import('./storage.js');
      const { products } = await import('../shared/schema.js');
      
      const allProducts = await db.select().from(products);
      
      // Check for required product fields
      let validProducts = 0;
      let invalidProducts = 0;
      
      for (const product of allProducts) {
        const hasRequiredFields = 
          product.name && 
          product.slug && 
          product.price && 
          product.category;
        
        if (hasRequiredFields) {
          validProducts++;
        } else {
          invalidProducts++;
        }
      }

      this.addResult(
        'Product Data Validation',
        invalidProducts === 0,
        `${validProducts} valid products, ${invalidProducts} invalid products`,
        { total: allProducts.length, valid: validProducts, invalid: invalidProducts }
      );

    } catch (error: any) {
      this.addResult(
        'Data Validation',
        false,
        'Failed to validate data',
        { error: error.message }
      );
    }
  }

  // Generate Report
  generateReport() {
    this.log('\n=== Production Readiness Report ===', 'info');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Pass Rate: ${passRate}%`);
    console.log('='.repeat(60));

    if (failedTests > 0) {
      this.log('\n⚠️  Failed Tests:', 'warn');
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  - ${r.name}: ${r.message}`);
        });
    }

    if (passedTests === totalTests) {
      this.log('\n✓ All tests passed! Platform is ready for production.', 'success');
      return true;
    } else {
      this.log('\n✗ Some tests failed. Please address issues before deploying.', 'error');
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    this.log('Starting Production Readiness Tests...', 'info');
    this.log('='.repeat(60), 'info');

    await this.testEnvironmentConfiguration();
    await this.testDatabaseConnectivity();
    await this.testStripeIntegration();
    await this.testEmailService();
    await this.testAPIEndpoints();
    await this.testSecurityConfiguration();
    await this.testDataValidation();

    return this.generateReport();
  }
}

// Run tests
const tester = new ProductionReadinessTest();
tester.runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
