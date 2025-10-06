/**
 * Tests for monitoring utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  logApiError,
  logWarning,
  logInfo,
  measureApiCall,
  recordCacheHit,
  recordCacheMiss,
  getCacheStatistics,
  getPerformanceStatistics,
  logFallbackUsage,
  resetMetrics,
} from './monitoring';
import { ApiError } from './api';

describe('Monitoring', () => {
  beforeEach(() => {
    // Reset metrics before each test
    resetMetrics();
    // Clear console spies
    vi.clearAllMocks();
  });

  describe('logApiError', () => {
    it('should log ApiError with structured format', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new ApiError('Test error', 500, 'TEST_ERROR', { detail: 'test' });
      logApiError(error, 'TestContext');
      
      expect(consoleSpy).toHaveBeenCalled();
      const call = consoleSpy.mock.calls[0];
      expect(call[0]).toContain('[ERROR]');
      expect(call[0]).toContain('TestContext');
      expect(call[0]).toContain('Test error');
      
      consoleSpy.mockRestore();
    });

    it('should log regular Error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Regular error');
      logApiError(error, 'TestContext');
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('logWarning', () => {
    it('should log warning messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logWarning('Test warning', 'TestContext', { detail: 'test' });
      
      expect(consoleSpy).toHaveBeenCalled();
      const call = consoleSpy.mock.calls[0];
      expect(call[0]).toContain('[WARN]');
      expect(call[0]).toContain('TestContext');
      expect(call[0]).toContain('Test warning');
      
      consoleSpy.mockRestore();
    });
  });

  describe('measureApiCall', () => {
    it('should measure successful API call duration', async () => {
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' });
      
      const result = await measureApiCall('test-api', mockApiCall);
      
      expect(result).toEqual({ data: 'test' });
      expect(mockApiCall).toHaveBeenCalledTimes(1);
      
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(1);
      expect(stats.successRate).toBe(100);
    });

    it('should measure failed API call', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('API failed'));
      
      await expect(measureApiCall('test-api', mockApiCall)).rejects.toThrow('API failed');
      
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(1);
      expect(stats.successRate).toBe(0);
    });

    it('should track cached calls separately', async () => {
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' });
      
      await measureApiCall('test-api', mockApiCall, true);
      
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(1);
    });
  });

  describe('Cache metrics', () => {
    it('should track cache hits', () => {
      recordCacheHit('test-key');
      recordCacheHit('test-key-2');
      
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(0);
      expect(stats.totalRequests).toBe(2);
      expect(stats.hitRate).toBe(100);
    });

    it('should track cache misses', () => {
      recordCacheMiss('test-key');
      recordCacheMiss('test-key-2');
      
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(2);
      expect(stats.totalRequests).toBe(2);
      expect(stats.hitRate).toBe(0);
    });

    it('should calculate hit rate correctly', () => {
      recordCacheHit('key-1');
      recordCacheHit('key-2');
      recordCacheHit('key-3');
      recordCacheMiss('key-4');
      
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(1);
      expect(stats.totalRequests).toBe(4);
      expect(stats.hitRate).toBe(75);
    });
  });

  describe('Performance statistics', () => {
    it('should return empty stats when no calls recorded', () => {
      const stats = getPerformanceStatistics();
      
      expect(stats.count).toBe(0);
      expect(stats.averageDuration).toBe(0);
      expect(stats.minDuration).toBe(0);
      expect(stats.maxDuration).toBe(0);
      expect(stats.successRate).toBe(0);
    });

    it('should calculate statistics correctly', async () => {
      const mockCall1 = vi.fn().mockResolvedValue('result1');
      const mockCall2 = vi.fn().mockResolvedValue('result2');
      const mockCall3 = vi.fn().mockRejectedValue(new Error('failed'));
      
      await measureApiCall('call-1', mockCall1);
      await measureApiCall('call-2', mockCall2);
      await expect(measureApiCall('call-3', mockCall3)).rejects.toThrow();
      
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(3);
      expect(stats.successRate).toBe(67); // 2 out of 3 succeeded
      expect(stats.averageDuration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('logFallbackUsage', () => {
    it('should log fallback usage as warning', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logFallbackUsage('TestContext', 'API failed', { error: 'Network error' });
      
      expect(consoleSpy).toHaveBeenCalled();
      const call = consoleSpy.mock.calls[0];
      expect(call[0]).toContain('Using fallback data');
      expect(call[0]).toContain('API failed');
      
      consoleSpy.mockRestore();
    });
  });

  describe('resetMetrics', () => {
    it('should reset all metrics', async () => {
      // Add some metrics
      recordCacheHit('key-1');
      recordCacheMiss('key-2');
      await measureApiCall('test', () => Promise.resolve('result'));
      
      // Verify metrics exist
      let cacheStats = getCacheStatistics();
      let perfStats = getPerformanceStatistics();
      expect(cacheStats.totalRequests).toBeGreaterThan(0);
      expect(perfStats.count).toBeGreaterThan(0);
      
      // Reset
      resetMetrics();
      
      // Verify metrics are cleared
      cacheStats = getCacheStatistics();
      perfStats = getPerformanceStatistics();
      expect(cacheStats.totalRequests).toBe(0);
      expect(perfStats.count).toBe(0);
    });
  });
});
