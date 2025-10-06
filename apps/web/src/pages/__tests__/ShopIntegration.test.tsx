import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedShopPage } from '../EnhancedShopPage';
import { CartProvider } from '../../contexts/CartContext';
import { api } from '../../lib/api';

// Mock the api module
vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock the monitoring module
vi.mock('../../lib/monitoring', () => ({
  logApiError: vi.fn(),
  measureApiCall: vi.fn((name, fn) => fn()),
  recordCacheHit: vi.fn(),
  recordCacheMiss: vi.fn(),
  logFallbackUsage: vi.fn(),
  logWarning: vi.fn(),
}));

// Mock the product validation module
vi.mock('../../utils/productValidation', () => ({
  validateProducts: vi.fn((products) => products),
  validateProduct: vi.fn((product) => product),
  logValidationError: vi.fn(),
  isProductValidationError: vi.fn(() => false),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;

const mockProducts = [
  {
    id: 'product-1',
    slug: 'product-1',
    name: 'Test Product 1',
    category: 'Apparel',
    price: 100,
    currency: 'GHS',
    tags: ['handmade'],
    impactStatement: 'Supports local artisans',
    description: 'A beautiful handmade product',
    images: ['/image1.jpg'],
    availability: 'in_stock' as const,
    inventory: 10,
  },
  {
    id: 'product-2',
    slug: 'product-2',
    name: 'Test Product 2',
    category: 'Accessories',
    price: 50,
    currency: 'GHS',
    tags: ['eco-friendly'],
    impactStatement: 'Funds education programs',
    description: 'An eco-friendly accessory',
    images: ['/image2.jpg'],
    availability: 'low_stock' as const,
    inventory: 3,
  },
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>{component}</CartProvider>
    </BrowserRouter>
  );
};

describe('Shop Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('EnhancedShopPage - Loading States', () => {
    it('should display loading skeleton initially', () => {
      vi.mocked(api.get).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithProviders(<EnhancedShopPage />);

      // Check for skeleton animation
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should display products after loading', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

      renderWithProviders(<EnhancedShopPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });
  });

  describe('EnhancedShopPage - Error Handling', () => {
    it('should display error state on API failure', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));
      
      // Mock validation to return empty array
      const { validateProducts } = await import('../../utils/productValidation');
      vi.mocked(validateProducts).mockReturnValueOnce([]);

      renderWithProviders(<EnhancedShopPage />);

      await waitFor(() => {
        expect(screen.getByText('Unable to Load Products')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('EnhancedShopPage - Product Display', () => {
    it('should display product information correctly', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

      renderWithProviders(<EnhancedShopPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check product details
      expect(screen.getByText('Apparel')).toBeInTheDocument();
      expect(screen.getByText('GHS 100')).toBeInTheDocument();
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('should display low stock warning', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

      renderWithProviders(<EnhancedShopPage />);

      await waitFor(() => {
        expect(screen.getByText('Only 3 left')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('EnhancedShopPage - Caching', () => {
    it('should use cached products when available', async () => {
      const cacheEntry = {
        data: mockProducts,
        timestamp: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
      localStorage.setItem('mawu_products_all', JSON.stringify(cacheEntry));

      renderWithProviders(<EnhancedShopPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      }, { timeout: 3000 });

      // API should not be called when cache is available
      expect(api.get).not.toHaveBeenCalled();
    });
  });
});
