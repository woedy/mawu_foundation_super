/**
 * API Error Logging and Performance Monitoring
 * Provides structured error logging, performance measurement, and cache analytics
 */

import { ApiError } from './api';

// Environment check
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

// Error log entry structure
interface ErrorLogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  statusCode?: number;
  code?: string;
  details?: any;
  stack?: string;
  userAgent?: string;
  url?: string;
}

// Performance measurement entry
interface PerformanceEntry {
  name: string;
  duration: number;
  timestamp: string;
  success: boolean;
  cached?: boolean;
}

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
}

// In-memory cache statistics tracking
const cacheMetrics = {
  hits: 0,
  misses: 0,
};

// Performance metrics storage (keep last 100 entries)
const performanceMetrics: PerformanceEntry[] = [];
const MAX_PERFORMANCE_ENTRIES = 100;

/**
 * Log API errors with structured format
 */
export function logApiError(
  error: ApiError | Error,
  context: string,
  additionalDetails?: Record<string, any>
): void {
  const entry: ErrorLogEntry = {
    timestamp: new Date().toISOString(),
    level: LogLevel.ERROR,
    context,
    message: error.message,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Add ApiError specific fields
  if (error instanceof ApiError) {
    entry.statusCode = error.statusCode;
    entry.code = error.code;
    entry.details = error.details;
  }

  // Add stack trace in development
  if (isDevelopment && error.stack) {
    entry.stack = error.stack;
  }

  // Merge additional details
  if (additionalDetails) {
    entry.details = { ...entry.details, ...additionalDetails };
  }

  // Console output with formatting
  const consoleMessage = `[${entry.level}] ${entry.context}: ${entry.message}`;
  
  if (isDevelopment) {
    console.error(consoleMessage, {
      statusCode: entry.statusCode,
      code: entry.code,
      details: entry.details,
      stack: entry.stack,
    });
  } else {
    console.error(consoleMessage);
  }

  // In production, send to error tracking service
  if (isProduction) {
    sendToErrorTracking(entry);
  }
}

/**
 * Log warnings (e.g., fallback data usage)
 */
export function logWarning(
  message: string,
  context: string,
  details?: Record<string, any>
): void {
  const entry: ErrorLogEntry = {
    timestamp: new Date().toISOString(),
    level: LogLevel.WARN,
    context,
    message,
    details,
    url: window.location.href,
  };

  const consoleMessage = `[${entry.level}] ${entry.context}: ${entry.message}`;
  
  if (isDevelopment && details) {
    console.warn(consoleMessage, details);
  } else {
    console.warn(consoleMessage);
  }

  // Track warnings in production for analytics
  if (isProduction) {
    sendToAnalytics('warning', entry);
  }
}

/**
 * Log info messages (e.g., successful operations)
 */
export function logInfo(
  message: string,
  context: string,
  details?: Record<string, any>
): void {
  if (!isDevelopment) return; // Only log info in development

  const consoleMessage = `[${LogLevel.INFO}] ${context}: ${message}`;
  
  if (details) {
    console.log(consoleMessage, details);
  } else {
    console.log(consoleMessage);
  }
}

/**
 * Measure API call performance
 */
export async function measureApiCall<T>(
  name: string,
  apiCall: () => Promise<T>,
  cached: boolean = false
): Promise<T> {
  const startTime = performance.now();
  let success = true;
  let result: T;

  try {
    result = await apiCall();
    return result;
  } catch (error) {
    success = false;
    throw error;
  } finally {
    const duration = performance.now() - startTime;
    
    const entry: PerformanceEntry = {
      name,
      duration,
      timestamp: new Date().toISOString(),
      success,
      cached,
    };

    // Store performance metric
    performanceMetrics.push(entry);
    if (performanceMetrics.length > MAX_PERFORMANCE_ENTRIES) {
      performanceMetrics.shift();
    }

    // Log performance in development
    if (isDevelopment) {
      const status = success ? '✓' : '✗';
      const cacheStatus = cached ? ' (cached)' : '';
      console.log(
        `[Performance] ${status} ${name}${cacheStatus}: ${duration.toFixed(2)}ms`
      );
    }

    // Track slow API calls
    if (duration > 3000 && !cached) {
      logWarning(
        `Slow API call detected: ${duration.toFixed(2)}ms`,
        'Performance',
        { name, duration, success }
      );
    }
  }
}

/**
 * Record cache hit
 */
export function recordCacheHit(key: string): void {
  cacheMetrics.hits++;
  
  if (isDevelopment) {
    console.log(`[Cache] ✓ Hit: ${key}`);
  }
}

/**
 * Record cache miss
 */
export function recordCacheMiss(key: string): void {
  cacheMetrics.misses++;
  
  if (isDevelopment) {
    console.log(`[Cache] ✗ Miss: ${key}`);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStatistics(): CacheStats {
  const totalRequests = cacheMetrics.hits + cacheMetrics.misses;
  const hitRate = totalRequests > 0 
    ? (cacheMetrics.hits / totalRequests) * 100 
    : 0;

  return {
    hits: cacheMetrics.hits,
    misses: cacheMetrics.misses,
    hitRate: Math.round(hitRate * 100) / 100,
    totalRequests,
  };
}

/**
 * Log cache statistics
 */
export function logCacheStats(): void {
  const stats = getCacheStatistics();
  
  console.log('[Cache Stats]', {
    hits: stats.hits,
    misses: stats.misses,
    hitRate: `${stats.hitRate}%`,
    totalRequests: stats.totalRequests,
  });
}

/**
 * Get performance statistics
 */
export function getPerformanceStatistics() {
  if (performanceMetrics.length === 0) {
    return {
      count: 0,
      averageDuration: 0,
      minDuration: 0,
      maxDuration: 0,
      successRate: 0,
    };
  }

  const durations = performanceMetrics.map(m => m.duration);
  const successCount = performanceMetrics.filter(m => m.success).length;

  return {
    count: performanceMetrics.length,
    averageDuration: Math.round(
      durations.reduce((a, b) => a + b, 0) / durations.length
    ),
    minDuration: Math.round(Math.min(...durations)),
    maxDuration: Math.round(Math.max(...durations)),
    successRate: Math.round((successCount / performanceMetrics.length) * 100),
  };
}

/**
 * Log performance statistics
 */
export function logPerformanceStats(): void {
  const stats = getPerformanceStatistics();
  
  if (stats.count === 0) {
    console.log('[Performance Stats] No API calls recorded yet');
    return;
  }

  console.log('[Performance Stats]', {
    totalCalls: stats.count,
    averageDuration: `${stats.averageDuration}ms`,
    minDuration: `${stats.minDuration}ms`,
    maxDuration: `${stats.maxDuration}ms`,
    successRate: `${stats.successRate}%`,
  });
}

/**
 * Log fallback data usage
 */
export function logFallbackUsage(
  context: string,
  reason: string,
  details?: Record<string, any>
): void {
  logWarning(
    `Using fallback data: ${reason}`,
    context,
    details
  );
}

/**
 * Reset metrics (useful for testing)
 */
export function resetMetrics(): void {
  cacheMetrics.hits = 0;
  cacheMetrics.misses = 0;
  performanceMetrics.length = 0;
}

/**
 * Send error to tracking service (placeholder for production)
 */
function sendToErrorTracking(entry: ErrorLogEntry): void {
  // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
  // Example:
  // Sentry.captureException(new Error(entry.message), {
  //   level: 'error',
  //   tags: {
  //     context: entry.context,
  //     code: entry.code,
  //   },
  //   extra: entry.details,
  // });
  
  // For now, just log to console in production
  console.error('[Error Tracking]', entry);
}

/**
 * Send analytics event (placeholder for production)
 */
function sendToAnalytics(eventName: string, data: any): void {
  // TODO: Integrate with analytics service (e.g., Google Analytics, Mixpanel)
  // Example:
  // gtag('event', eventName, data);
  
  // For now, just log in development
  if (isDevelopment) {
    console.log('[Analytics]', eventName, data);
  }
}

/**
 * Initialize monitoring (call on app startup)
 */
export function initializeMonitoring(): void {
  if (isDevelopment) {
    console.log('[Monitoring] Initialized in development mode');
    
    // Expose monitoring utilities to window for debugging
    (window as any).__monitoring = {
      logCacheStats,
      logPerformanceStats,
      getCacheStatistics,
      getPerformanceStatistics,
      resetMetrics,
    };
    
    console.log('[Monitoring] Debug utilities available at window.__monitoring');
  }
}
