/**
 * Tests for monitoring and logging utilities
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
} from '../monitoring';
import { ApiError } from '../api';

describe('Monitoring Utilities', () => {
  beforeEach(() => {
    // Reset metrics before each test
    resetMetrics();
    // Clear console spies
    vi.clearAllMocks();
  });

  describe('logApiError', () => {
    it('should log ApiError with structured format', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new ApiError('Test error', 404, 'NOT_FOUND', { detail: 'test' });
      logApiError(error, 'TestContext', { extra: 'data' });
      
      expect(consoleSpy).toHaveBeenCalled();
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
      consoleSpy.mockRestore();
    });
  });

  describe('logFallbackUsage', () => {
    it('should log fallback data usage as warning', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logFallbackUsage('TestContext', 'API failed', { error: 'Network error' });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('measureApiCall', () => {
    it('should measure successful API call duration', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' });
      const result = await measureApiCall('Test API Call', mockApiCall);
      
      expect(result).toEqual({ data: 'test' });
      expect(mockApiCall).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should measure failed API call and rethrow error', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const mockApiCall = vi.fn().mockRejectedValue(new Error('API failed'));
      
      await expect(
        measureApiCall('Test API Call', mockApiCall)
      ).rejects.toThrow('API failed');
      
      expect(mockApiCall).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should log warning for slow API calls', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Mock a slow API call (>3000ms)
      const slowApiCall = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 3100))
      );
      
      await measureApiCall('Slow API Call', slowApiCall);
      
      // Should log warning for slow call
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Cache Statistics', () => {
    it('should track cache hits', () => {
      recordCacheHit('test-key-1');
      recordCacheHit('test-key-2');
      
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(0);
      expect(stats.totalRequests).toBe(2);
      expect(stats.hitRate).toBe(100);
    });

    it('should track cache misses', () => {
      recordCacheMiss('test-key-1');
      recordCacheMiss('test-key-2');
      
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(2);
      expect(stats.totalRequests).toBe(2);
      expect(stats.hitRate).toBe(0);
    });

    it('should calculate correct hit rate', () => {
      recordCacheHit('test-key-1');
      recordCacheHit('test-key-2');
      recordCacheMiss('test-key-3');
      recordCacheMiss('test-key-4');
      
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.totalRequests).toBe(4);
      expect(stats.hitRate).toBe(50);
    });

    it('should handle zero requests', () => {
      const stats = getCacheStatistics();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.totalRequests).toBe(0);
      expect(stats.hitRate).toBe(0);
    });
  });

  describe('Performance Statistics', () => {
    it('should track performance metrics', async () => {
      const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' });
      
      await measureApiCall('Test Call 1', mockApiCall);
      await measureApiCall('Test Call 2', mockApiCall);
      
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(2);
      expect(stats.averageDuration).toBeGreaterThan(0);
      expect(stats.successRate).toBe(100);
    });

    it('should track failed calls in success rate', async () => {
      const successCall = vi.fn().mockResolvedValue({ data: 'test' });
      const failCall = vi.fn().mockRejectedValue(new Error('Failed'));
      
      await measureApiCall('Success Call', successCall);
      
      try {
        await measureApiCall('Fail Call', failCall);
      } catch {
        // Expected to fail
      }
      
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(2);
      expect(stats.successRate).toBe(50);
    });

    it('should handle no performance data', () => {
      const stats = getPerformanceStatistics();
      expect(stats.count).toBe(0);
      expect(stats.averageDuration).toBe(0);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('resetMetrics', () => {
    it('should reset all metrics', () => {
      recordCacheHit('test-key');
      recordCacheMiss('test-key');
      
      resetMetrics();
      
      const cacheStats = getCacheStatistics();
      expect(cacheStats.hits).toBe(0);
      expect(cacheStats.misses).toBe(0);
      
      const perfStats = getPerformanceStatistics();
      expect(perfStats.count).toBe(0);
    });
  });
});
