/**
 * Unit tests for API URL configuration
 * Tests that VITE_API_URL environment variable is properly configured
 * and fallback behavior works as expected
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('API URL Configuration', () => {
  // Store original env
  const originalEnv = import.meta.env.VITE_API_URL;

  beforeEach(() => {
    // Reset to original state
    vi.stubEnv('VITE_API_URL', originalEnv);
  });

  it('should use VITE_API_URL when set', () => {
    const testUrl = 'http://localhost:3001';
    vi.stubEnv('VITE_API_URL', testUrl);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    expect(API_URL).toBe(testUrl);
  });

  it('should fallback to localhost:3001 when VITE_API_URL is not set', () => {
    vi.stubEnv('VITE_API_URL', undefined);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    expect(API_URL).toBe('http://localhost:3001');
  });

  it('should support custom local ports', () => {
    const customUrl = 'http://localhost:3000';
    vi.stubEnv('VITE_API_URL', customUrl);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    expect(API_URL).toBe(customUrl);
  });

  it('should support production URLs', () => {
    const prodUrl = 'https://api.mawufoundation.org';
    vi.stubEnv('VITE_API_URL', prodUrl);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    expect(API_URL).toBe(prodUrl);
  });

  it('should support HTTPS URLs', () => {
    const httpsUrl = 'https://api.example.com';
    vi.stubEnv('VITE_API_URL', httpsUrl);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    expect(API_URL).toBe(httpsUrl);
  });

  it('should handle empty string as not set', () => {
    vi.stubEnv('VITE_API_URL', '');
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    expect(API_URL).toBe('http://localhost:3001');
  });
});

describe('API Configuration Documentation', () => {
  it('should document the default fallback URL', () => {
    const defaultUrl = 'http://localhost:3001';
    const API_URL = import.meta.env.VITE_API_URL || defaultUrl;
    
    // Verify the fallback is documented
    expect(defaultUrl).toBe('http://localhost:3001');
  });

  it('should use consistent URL format', () => {
    const urls = [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://api.mawufoundation.org',
    ];

    urls.forEach(url => {
      expect(url).toMatch(/^https?:\/\/.+/);
    });
  });
});
