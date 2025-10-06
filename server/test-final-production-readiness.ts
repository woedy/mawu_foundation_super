/**
 * Final Production Readiness Test Suite
 * 
 * Comprehensive testing script that validates all critical functionality
 * before production deployment. This script orchestrates all test suites
 * and provides a final go/no-go decision.
 * 
 * Tests covered:
 * 1. Complete user journeys (product purchase, donations, admin)
 * 2. Email notification system
 * 3. Security and vulnerability assessment
 * 4. Production environment configuration
 * 5. Stripe webhook processing
 * 6. Database integrity
 */

import { config } from 'dotenv';
import { spawn } from 'child_process';
config();

interface TestSuite {
  name: string;
  script: string;
  critical: boolean;
  description: string;
}

interface TestSuiteResult {
  suite: string;
  passed: boolean;
  duration: number;
  output: string[];
}

class FinalProductionReadinessTest {
  private results: TestSuiteResult[] = [];
  private startTime: number = 0;

  private testSuites: TestSuite[] = [
    {
      name: 'Environment Configuration',
      script: 'test-production-readiness.ts',
      critical: true,
      description: 'Validates environment variables, database, Stripe, and email configuration'
    },
    {
      name: 'Security Assessment',
      script: 'test-security.ts',
      critical: true,
      description: 'Tests authentication, input validation, and security vulnerabilities'
    },
    {
      name: 'User Journeys',
      script: 'test-user-journeys.ts',
      critical: true,
      description: 'Tests complete user flows: product purchase, donations, and admin management'
    },
    {
      name: 'Email Notifications',
      script: 'test-email-notifications.ts',
      critical: false,
      description: 'Validates email delivery for orders, donations, and admin notifications'
    }
  ];

  private log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warn: '\x1b[33m',
    };
    const reset = '\x1b[0m';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`${colors[type]}[${timestamp}] ${message}${reset}`);
  }

  private async runTestSuite(suite: TestSuite): Promise<TestSuiteResult> {
    return new Promise((resolve) => {
      this.log(`\n${'='.repeat(70)}`, 'info');
      this.log(`Running: ${suite.name}`, 'info');
      this.log(`Description: ${suite.description}`, 'info');
      this.log(`Critical: ${suite.critical ? 'YES' : 'NO'}`, 'info');
      this.log('='.repeat(70), 'info');

      const startTime = Date.now();
      const output: string[] = [];

      const child = spawn('npx', ['tsx', `server/${suite.script}`], {
        stdio: 'pipe',
        shell: true
      });

      child.stdout.on('data', (data) => {
        const text = data.toString();
        output.push(text);
        process.stdout.write(text);
      });

      child.stderr.on('data', (data) => {
        const text = data.toString();
        output.push(text);
        process.stderr.write(text);
      });

      child.on('close', (code) => {
        const duration = Date.now() - startTime;
        const passed = code === 0;

        if (passed) {
          this.log(`\n✓ ${suite.name} completed successfully (${duration}ms)`, 'success');
        } else {
          this.log(`\n✗ ${suite.name} failed (${duration}ms)`, 'error');
        }

        resolve({
          suite: suite.name,
          passed,
          duration,
          output
        });
      });

      child.on('error', (error) => {
        this.log(`\n✗ ${suite.name} error: ${error.message}`, 'error');
        resolve({
          suite: suite.name,
          passed: false,
          duration: Date.now() - startTime,
          output: [error.message]
        });
      });
    });
  }

  private async checkPrerequisites(): Promise<boolean> {
    this.log('\n=== Checking Prerequisites ===', 'info');
    
    let allGood = true;

    // Check if server is running
    try {
      const baseUrl = process.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/products`);
      
      if (response.ok) {
        this.log('✓ Server is running and accessible', 'success');
      } else {
        this.log('✗ Server returned error status', 'error');
        allGood = false;
      }
    } catch (error) {
      this.log('✗ Server is not running. Please start the server first.', 'error');
      this.log('  Run: npm run dev:server', 'info');
      allGood = false;
    }

    // Check critical environment variables
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
      this.log('✓ All required environment variables are set', 'success');
    } else {
      this.log(`✗ Missing environment variables: ${missingVars.join(', ')}`, 'error');
      allGood = false;
    }

    // Check database connectivity
    try {
      const { db } = await import('./storage.js');
      const { products } = await import('../shared/schema.js');
      await db.select().from(products).limit(1);
      this.log('✓ Database connection successful', 'success');
    } catch (error: any) {
      this.log(`✗ Database connection failed: ${error.message}`, 'error');
      allGood = false;
    }

    return allGood;
  }

  private generateFinalReport() {
    const totalDuration = Date.now() - this.startTime;
    
    this.log('\n\n' + '='.repeat(70), 'info');
    this.log('FINAL PRODUCTION READINESS REPORT', 'info');
    this.log('='.repeat(70), 'info');

    const totalSuites = this.results.length;
    const passedSuites = this.results.filter(r => r.passed).length;
    const failedSuites = totalSuites - passedSuites;

    const criticalSuites = this.testSuites.filter(s => s.critical);
    const criticalResults = this.results.filter(r => 
      criticalSuites.some(s => s.name === r.suite)
    );
    const criticalPassed = criticalResults.filter(r => r.passed).length;
    const criticalFailed = criticalResults.length - criticalPassed;

    console.log('\n📊 Test Suite Summary:');
    console.log('-'.repeat(70));
    console.log(`Total Test Suites: ${totalSuites}`);
    console.log(`Passed: ${passedSuites}`);
    console.log(`Failed: ${failedSuites}`);
    console.log(`\nCritical Test Suites: ${criticalResults.length}`);
    console.log(`Critical Passed: ${criticalPassed}`);
    console.log(`Critical Failed: ${criticalFailed}`);
    console.log(`\nTotal Duration: ${(totalDuration / 1000).toFixed(2)}s`);

    console.log('\n📋 Detailed Results:');
    console.log('-'.repeat(70));
    this.results.forEach(result => {
      const icon = result.passed ? '✓' : '✗';
      const color = result.passed ? '\x1b[32m' : '\x1b[31m';
      const reset = '\x1b[0m';
      const isCritical = criticalSuites.some(s => s.name === result.suite);
      const criticalTag = isCritical ? ' [CRITICAL]' : '';
      
      console.log(`${color}${icon}${reset} ${result.suite}${criticalTag}`);
      console.log(`   Duration: ${(result.duration / 1000).toFixed(2)}s`);
    });

    // Production readiness decision
    console.log('\n' + '='.repeat(70));
    
    if (criticalFailed === 0 && failedSuites === 0) {
      this.log('✅ PRODUCTION READY', 'success');
      this.log('All tests passed! The platform is ready for production deployment.', 'success');
      console.log('\n✨ Next Steps:');
      console.log('   1. Review the test results above');
      console.log('   2. Ensure production environment variables are configured');
      console.log('   3. Deploy to production using: npm run deploy');
      console.log('   4. Monitor logs and metrics after deployment');
      return true;
    } else if (criticalFailed === 0) {
      this.log('⚠️  PRODUCTION READY WITH WARNINGS', 'warn');
      this.log('Critical tests passed, but some non-critical tests failed.', 'warn');
      console.log('\n⚠️  Warnings:');
      this.results
        .filter(r => !r.passed && !criticalSuites.some(s => s.name === r.suite))
        .forEach(r => {
          console.log(`   - ${r.suite}`);
        });
      console.log('\n💡 Recommendation:');
      console.log('   - Address warnings before production deployment');
      console.log('   - Or proceed with caution and monitor closely');
      return true;
    } else {
      this.log('❌ NOT PRODUCTION READY', 'error');
      this.log('Critical tests failed. DO NOT deploy to production.', 'error');
      console.log('\n🚨 Critical Failures:');
      this.results
        .filter(r => !r.passed && criticalSuites.some(s => s.name === r.suite))
        .forEach(r => {
          console.log(`   - ${r.suite}`);
        });
      console.log('\n🔧 Required Actions:');
      console.log('   1. Review failed test output above');
      console.log('   2. Fix all critical issues');
      console.log('   3. Re-run this test suite');
      console.log('   4. Only deploy after all critical tests pass');
      return false;
    }
  }

  async runAllTests() {
    this.startTime = Date.now();
    
    console.log('\n');
    this.log('╔═══════════════════════════════════════════════════════════════════╗', 'info');
    this.log('║     FINAL PRODUCTION READINESS TEST SUITE                         ║', 'info');
    this.log('║     Mawu Foundation Platform                                      ║', 'info');
    this.log('╚═══════════════════════════════════════════════════════════════════╝', 'info');
    
    // Check prerequisites
    const prerequisitesPassed = await this.checkPrerequisites();
    
    if (!prerequisitesPassed) {
      this.log('\n❌ Prerequisites check failed. Cannot proceed with tests.', 'error');
      this.log('Please fix the issues above and try again.', 'error');
      return false;
    }

    this.log('\n✓ Prerequisites check passed. Starting test suites...', 'success');

    // Run all test suites
    for (const suite of this.testSuites) {
      const result = await this.runTestSuite(suite);
      this.results.push(result);
      
      // If a critical test fails, we can optionally stop here
      if (!result.passed && suite.critical) {
        this.log(`\n⚠️  Critical test suite failed: ${suite.name}`, 'warn');
        this.log('Continuing with remaining tests for complete assessment...', 'info');
      }
    }

    // Generate final report
    return this.generateFinalReport();
  }
}

// Main execution
const tester = new FinalProductionReadinessTest();
tester.runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Test suite execution failed:', error);
    process.exit(1);
  });
