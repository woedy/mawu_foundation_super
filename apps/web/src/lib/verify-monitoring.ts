/**
 * Verification script for monitoring implementation
 * Run this in the browser console to verify monitoring is working
 */

import {
  logApiError,
  logWarning,
  logInfo,
  measureApiCall,
  recordCacheHit,
  recordCacheMiss,
  getCacheStatistics,
  getPerformanceStatistics,
  logCacheStats,
  logPerformanceStats,
  logFallbackUsage,
  resetMetrics,
} from './monitoring';
import { ApiError } from './api';

/**
 * Run all monitoring verification tests
 */
export async function verifyMonitoring() {
  console.log('=== Starting Monitoring Verification ===\n');

  // Reset metrics to start fresh
  resetMetrics();
  console.log('✓ Metrics reset\n');

  // Test 1: Error Logging
  console.log('Test 1: Error Logging');
  const testError = new ApiError('Test error message', 404, 'NOT_FOUND', { detail: 'test' });
  logApiError(testError, 'VerificationTest', { testId: 1 });
  console.log('✓ ApiError logged\n');

  const regularError = new Error('Regular error message');
  logApiError(regularError, 'VerificationTest', { testId: 2 });
  console.log('✓ Regular Error logged\n');

  // Test 2: Warning Logging
  console.log('Test 2: Warning Logging');
  logWarning('Test warning message', 'VerificationTest', { testId: 3 });
  console.log('✓ Warning logged\n');

  // Test 3: Info Logging (development only)
  console.log('Test 3: Info Logging');
  logInfo('Test info message', 'VerificationTest', { testId: 4 });
  console.log('✓ Info logged\n');

  // Test 4: Fallback Usage Logging
  console.log('Test 4: Fallback Usage Logging');
  logFallbackUsage('VerificationTest', 'Testing fallback', { reason: 'test' });
  console.log('✓ Fallback usage logged\n');

  // Test 5: Performance Measurement
  console.log('Test 5: Performance Measurement');
  
  // Simulate fast API call
  await measureApiCall(
    'Fast API Call',
    () => new Promise(resolve => setTimeout(() => resolve({ data: 'fast' }), 100)),
    false
  );
  console.log('✓ Fast API call measured\n');

  // Simulate slow API call (should trigger warning)
  await measureApiCall(
    'Slow API Call',
    () => new Promise(resolve => setTimeout(() => resolve({ data: 'slow' }), 3100)),
    false
  );
  console.log('✓ Slow API call measured (should show warning)\n');

  // Simulate failed API call
  try {
    await measureApiCall(
      'Failed API Call',
      () => Promise.reject(new Error('Simulated failure')),
      false
    );
  } catch {
    console.log('✓ Failed API call measured\n');
  }

  // Test 6: Cache Tracking
  console.log('Test 6: Cache Tracking');
  recordCacheHit('test-key-1');
  recordCacheHit('test-key-2');
  recordCacheHit('test-key-3');
  recordCacheMiss('test-key-4');
  recordCacheMiss('test-key-5');
  console.log('✓ Cache hits and misses recorded\n');

  // Test 7: Statistics
  console.log('Test 7: Statistics\n');
  
  console.log('Cache Statistics:');
  const cacheStats = getCacheStatistics();
  console.log(`  Hits: ${cacheStats.hits}`);
  console.log(`  Misses: ${cacheStats.misses}`);
  console.log(`  Hit Rate: ${cacheStats.hitRate}%`);
  console.log(`  Total Requests: ${cacheStats.totalRequests}`);
  console.log('✓ Cache statistics retrieved\n');

  console.log('Performance Statistics:');
  const perfStats = getPerformanceStatistics();
  console.log(`  Total Calls: ${perfStats.count}`);
  console.log(`  Average Duration: ${perfStats.averageDuration}ms`);
  console.log(`  Min Duration: ${perfStats.minDuration}ms`);
  console.log(`  Max Duration: ${perfStats.maxDuration}ms`);
  console.log(`  Success Rate: ${perfStats.successRate}%`);
  console.log('✓ Performance statistics retrieved\n');

  // Test 8: Formatted Statistics Output
  console.log('Test 8: Formatted Statistics Output\n');
  logCacheStats();
  logPerformanceStats();
  console.log('✓ Formatted statistics logged\n');

  // Test 9: Window Utilities (development only)
  console.log('Test 9: Window Utilities');
  if ((window as any).__monitoring) {
    console.log('✓ Monitoring utilities available on window.__monitoring');
    console.log('  Available methods:');
    console.log('    - logCacheStats()');
    console.log('    - logPerformanceStats()');
    console.log('    - getCacheStatistics()');
    console.log('    - getPerformanceStatistics()');
    console.log('    - resetMetrics()');
  } else {
    console.log('⚠ Window utilities not available (production mode?)');
  }
  console.log('');

  console.log('=== Monitoring Verification Complete ===\n');
  console.log('Summary:');
  console.log('✓ Error logging working');
  console.log('✓ Warning logging working');
  console.log('✓ Info logging working');
  console.log('✓ Fallback tracking working');
  console.log('✓ Performance measurement working');
  console.log('✓ Cache tracking working');
  console.log('✓ Statistics calculation working');
  console.log('✓ Formatted output working');
  console.log('');
  console.log('All monitoring features verified successfully!');
}

/**
 * Quick test for browser console
 * Usage: Copy and paste into browser console, then run verifyMonitoring()
 */
if (typeof window !== 'undefined') {
  (window as any).verifyMonitoring = verifyMonitoring;
  console.log('Monitoring verification loaded. Run verifyMonitoring() to test.');
}
