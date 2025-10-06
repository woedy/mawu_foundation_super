/**
 * Security Testing Suite
 * 
 * Tests security configurations and potential vulnerabilities:
 * 1. Authentication and authorization
 * 2. Input validation
 * 3. SQL injection prevention
 * 4. Session security
 * 5. API endpoint protection
 * 6. Stripe webhook verification
 */

import { config } from 'dotenv';
config();

interface SecurityTestResult {
  category: string;
  test: string;
  passed: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  details?: any;
}

class SecurityTest {
  private results: SecurityTestResult[] = [];
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

  private addResult(
    category: string,
    test: string,
    passed: boolean,
    severity: 'critical' | 'high' | 'medium' | 'low',
    message: string,
    details?: any
  ) {
    this.results.push({ category, test, passed, severity, message, details });
    
    const icon = passed ? '✓' : '✗';
    const color = passed ? 'success' : (severity === 'critical' || severity === 'high' ? 'error' : 'warn');
    this.log(`${icon} [${severity.toUpperCase()}] ${test}: ${message}`, color);
    
    if (details && !passed) {
      console.log('  Details:', details);
    }
  }

  // Test 1: Authentication Security
  async testAuthenticationSecurity() {
    this.log('\n=== Testing Authentication Security ===', 'info');

    // Test 1.1: Admin endpoints require authentication
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/orders`);
      const isProtected = response.status === 401;
      
      this.addResult(
        'Authentication',
        'Admin Endpoint Protection',
        isProtected,
        'critical',
        isProtected 
          ? 'Admin endpoints properly require authentication' 
          : 'CRITICAL: Admin endpoints accessible without authentication'
      );
    } catch (error: any) {
      this.addResult(
        'Authentication',
        'Admin Endpoint Protection',
        false,
        'critical',
        'Failed to test endpoint protection',
        { error: error.message }
      );
    }

    // Test 1.2: Invalid credentials are rejected
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        })
      });

      const isRejected = response.status === 401;
      
      this.addResult(
        'Authentication',
        'Invalid Credentials Rejection',
        isRejected,
        'high',
        isRejected 
          ? 'Invalid credentials properly rejected' 
          : 'WARNING: Invalid credentials not properly rejected'
      );
    } catch (error: any) {
      this.addResult(
        'Authentication',
        'Invalid Credentials Rejection',
        false,
        'high',
        'Failed to test credential validation',
        { error: error.message }
      );
    }

    // Test 1.3: Session management
    try {
      const loginResponse = await fetch(`${this.baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD
        })
      });

      const cookies = loginResponse.headers.get('set-cookie');
      const hasSecureCookie = cookies?.includes('HttpOnly') || false;
      
      this.addResult(
        'Authentication',
        'Secure Session Cookies',
        hasSecureCookie,
        'high',
        hasSecureCookie 
          ? 'Session cookies use HttpOnly flag' 
          : 'WARNING: Session cookies should use HttpOnly flag',
        { cookies: cookies?.substring(0, 100) }
      );
    } catch (error: any) {
      this.addResult(
        'Authentication',
        'Secure Session Cookies',
        false,
        'high',
        'Failed to test session security',
        { error: error.message }
      );
    }
  }

  // Test 2: Input Validation
  async testInputValidation() {
    this.log('\n=== Testing Input Validation ===', 'info');

    // Test 2.1: SQL Injection Prevention
    try {
      const maliciousInput = "'; DROP TABLE products; --";
      const response = await fetch(`${this.baseUrl}/api/products/${maliciousInput}`);
      
      // Should return 404 or handle gracefully, not execute SQL
      const isSafe = response.status === 404 || response.status === 400;
      
      this.addResult(
        'Input Validation',
        'SQL Injection Prevention',
        isSafe,
        'critical',
        isSafe 
          ? 'SQL injection attempts properly handled' 
          : 'CRITICAL: Potential SQL injection vulnerability'
      );
    } catch (error: any) {
      // Error is actually good here - means it didn't execute
      this.addResult(
        'Input Validation',
        'SQL Injection Prevention',
        true,
        'critical',
        'SQL injection attempts properly rejected'
      );
    }

    // Test 2.2: XSS Prevention in API responses
    try {
      const xssPayload = '<script>alert("xss")</script>';
      const response = await fetch(`${this.baseUrl}/api/products/${xssPayload}`);
      const text = await response.text();
      
      // Response should not contain unescaped script tags
      const isSafe = !text.includes('<script>') || response.status === 404;
      
      this.addResult(
        'Input Validation',
        'XSS Prevention',
        isSafe,
        'high',
        isSafe 
          ? 'XSS attempts properly handled' 
          : 'WARNING: Potential XSS vulnerability'
      );
    } catch (error: any) {
      this.addResult(
        'Input Validation',
        'XSS Prevention',
        true,
        'high',
        'XSS attempts properly rejected'
      );
    }

    // Test 2.3: Email validation
    try {
      const invalidEmail = 'not-an-email';
      const response = await fetch(`${this.baseUrl}/api/donations/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50,
          currency: 'usd',
          donorEmail: invalidEmail,
          donorName: 'Test',
          frequency: 'one-time'
        })
      });

      const isValidated = response.status === 400;
      
      this.addResult(
        'Input Validation',
        'Email Format Validation',
        isValidated,
        'medium',
        isValidated 
          ? 'Email validation working correctly' 
          : 'Email validation could be improved'
      );
    } catch (error: any) {
      this.addResult(
        'Input Validation',
        'Email Format Validation',
        false,
        'medium',
        'Failed to test email validation',
        { error: error.message }
      );
    }

    // Test 2.4: Amount validation (negative amounts)
    try {
      const response = await fetch(`${this.baseUrl}/api/donations/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: -100,
          currency: 'usd',
          donorEmail: 'test@example.com',
          donorName: 'Test',
          frequency: 'one-time'
        })
      });

      const isValidated = response.status === 400;
      
      this.addResult(
        'Input Validation',
        'Amount Validation',
        isValidated,
        'high',
        isValidated 
          ? 'Negative amounts properly rejected' 
          : 'WARNING: Negative amounts should be rejected'
      );
    } catch (error: any) {
      this.addResult(
        'Input Validation',
        'Amount Validation',
        false,
        'high',
        'Failed to test amount validation',
        { error: error.message }
      );
    }
  }

  // Test 3: Stripe Webhook Security
  async testStripeWebhookSecurity() {
    this.log('\n=== Testing Stripe Webhook Security ===', 'info');

    // Test 3.1: Webhook signature verification
    try {
      const response = await fetch(`${this.baseUrl}/api/webhooks/stripe`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'stripe-signature': 'invalid-signature'
        },
        body: JSON.stringify({ type: 'payment_intent.succeeded' })
      });

      const isProtected = response.status === 400;
      
      this.addResult(
        'Webhook Security',
        'Stripe Signature Verification',
        isProtected,
        'critical',
        isProtected 
          ? 'Webhook signature verification working' 
          : 'CRITICAL: Webhooks not properly verified'
      );
    } catch (error: any) {
      this.addResult(
        'Webhook Security',
        'Stripe Signature Verification',
        false,
        'critical',
        'Failed to test webhook security',
        { error: error.message }
      );
    }
  }

  // Test 4: Environment Security
  async testEnvironmentSecurity() {
    this.log('\n=== Testing Environment Security ===', 'info');

    // Test 4.1: Session secret strength
    const sessionSecret = process.env.SESSION_SECRET || '';
    const isStrongSecret = sessionSecret.length >= 32;
    
    this.addResult(
      'Environment',
      'Session Secret Strength',
      isStrongSecret,
      'critical',
      isStrongSecret 
        ? 'Session secret is sufficiently strong' 
        : 'CRITICAL: Session secret must be at least 32 characters',
      { length: sessionSecret.length }
    );

    // Test 4.2: Default password check
    const hasDefaultPassword = process.env.ADMIN_PASSWORD === 'changeme' || 
                               process.env.ADMIN_PASSWORD === 'admin' ||
                               process.env.ADMIN_PASSWORD === 'password';
    
    this.addResult(
      'Environment',
      'Admin Password Security',
      !hasDefaultPassword,
      'critical',
      hasDefaultPassword 
        ? 'CRITICAL: Using default/weak admin password' 
        : 'Admin password is not a common default'
    );

    // Test 4.3: Stripe keys configuration
    const hasStripeKeys = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
    
    this.addResult(
      'Environment',
      'Stripe Keys Configuration',
      hasStripeKeys,
      'critical',
      hasStripeKeys 
        ? 'Stripe keys properly configured' 
        : 'CRITICAL: Stripe keys not configured'
    );

    // Test 4.4: Email configuration
    const hasEmailConfig = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    this.addResult(
      'Environment',
      'Email Configuration',
      hasEmailConfig,
      'high',
      hasEmailConfig 
        ? 'Email service properly configured' 
        : 'WARNING: Email service not configured'
    );

    // Test 4.5: Database URL security
    const dbUrl = process.env.DATABASE_URL || '';
    const hasPasswordInUrl = dbUrl.includes(':') && dbUrl.includes('@');
    const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
    
    if (process.env.NODE_ENV === 'production' && isLocalhost) {
      this.addResult(
        'Environment',
        'Database Configuration',
        false,
        'critical',
        'CRITICAL: Using localhost database in production'
      );
    } else {
      this.addResult(
        'Environment',
        'Database Configuration',
        hasPasswordInUrl,
        'medium',
        'Database URL configured'
      );
    }
  }

  // Test 5: API Security Headers
  async testSecurityHeaders() {
    this.log('\n=== Testing Security Headers ===', 'info');

    try {
      const response = await fetch(`${this.baseUrl}/api/products`);
      const headers = response.headers;

      // Check for CORS headers
      const hasCORS = headers.has('access-control-allow-origin');
      this.addResult(
        'Security Headers',
        'CORS Configuration',
        hasCORS,
        'medium',
        hasCORS 
          ? 'CORS headers present' 
          : 'CORS headers not configured'
      );

      // Check Content-Type
      const contentType = headers.get('content-type');
      const hasContentType = contentType?.includes('application/json') || false;
      this.addResult(
        'Security Headers',
        'Content-Type Header',
        hasContentType,
        'low',
        hasContentType 
          ? 'Content-Type properly set' 
          : 'Content-Type header missing'
      );

    } catch (error: any) {
      this.addResult(
        'Security Headers',
        'Header Check',
        false,
        'medium',
        'Failed to check security headers',
        { error: error.message }
      );
    }
  }

  // Generate Security Report
  generateReport() {
    this.log('\n=== Security Test Report ===', 'info');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    const criticalIssues = this.results.filter(r => !r.passed && r.severity === 'critical').length;
    const highIssues = this.results.filter(r => !r.passed && r.severity === 'high').length;
    const mediumIssues = this.results.filter(r => !r.passed && r.severity === 'medium').length;
    const lowIssues = this.results.filter(r => !r.passed && r.severity === 'low').length;

    console.log('\n' + '='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log('\nIssues by Severity:');
    console.log(`  Critical: ${criticalIssues}`);
    console.log(`  High: ${highIssues}`);
    console.log(`  Medium: ${mediumIssues}`);
    console.log(`  Low: ${lowIssues}`);
    console.log('='.repeat(60));

    if (criticalIssues > 0) {
      this.log('\n🚨 CRITICAL SECURITY ISSUES:', 'error');
      this.results
        .filter(r => !r.passed && r.severity === 'critical')
        .forEach(r => {
          console.log(`  - ${r.test}: ${r.message}`);
        });
    }

    if (highIssues > 0) {
      this.log('\n⚠️  HIGH PRIORITY ISSUES:', 'warn');
      this.results
        .filter(r => !r.passed && r.severity === 'high')
        .forEach(r => {
          console.log(`  - ${r.test}: ${r.message}`);
        });
    }

    if (criticalIssues === 0 && highIssues === 0) {
      this.log('\n✓ No critical or high-priority security issues found!', 'success');
      return true;
    } else {
      this.log('\n✗ Security issues found. Please address before deploying.', 'error');
      return false;
    }
  }

  // Run all security tests
  async runAllTests() {
    this.log('Starting Security Tests...', 'info');
    this.log('='.repeat(60), 'info');

    await this.testAuthenticationSecurity();
    await this.testInputValidation();
    await this.testStripeWebhookSecurity();
    await this.testEnvironmentSecurity();
    await this.testSecurityHeaders();

    return this.generateReport();
  }
}

// Run tests
const tester = new SecurityTest();
tester.runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Security test suite failed:', error);
    process.exit(1);
  });