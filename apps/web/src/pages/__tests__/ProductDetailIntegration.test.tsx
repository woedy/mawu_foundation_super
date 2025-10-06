import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductDetailPage } from '../ProductDetailPage';
import { CartProvider } from '../../contexts/CartContext';
import { ToastProvider } from '../../components/Toast';
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

const mockProduct = {
  id: 'test-product',
  slug: 'test-product',
  name: 'Test Product',
  category: 'Apparel',
  price: 100,
  currency: 'GHS',
  tags: ['handmade', 'eco-friendly'],
  impactStatement: 'Supports local communities',
  description: 'A beautiful handmade product',
  images: ['/image1.jpg', '/image2.jpg'],
  availability: 'in_stock' as const,
  inventory: 10,
};

const renderProductDetail = (slug: string) => {
  return render(
    <MemoryRouter initialEntries={[`/shop/product/${slug}`]}>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/shop/product/:slug" element={<ProductDetailPage />} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};

describe('ProductDetailPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Product Loading', () => {
    it('should load and display product details', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

      renderProductDetail('test-product');

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByText('Apparel')).toBeInTheDocument();
      expect(screen.getByText('GHS 100.00')).toBeInTheDocument();
    });

    it('should show 404 for invalid slug', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Product not found'));
      
      const { validateProduct } = await import('../../utils/productValidation');
      vi.mocked(validateProduct).mockReturnValueOnce(null);

      renderProductDetail('invalid-slug');

      await waitFor(() => {
        expect(screen.getByText('Product Not Found')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Product Display', () => {
    it('should display product images', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

      renderProductDetail('test-product');

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      }, { timeout: 3000 });

      const images = screen.getAllByAlt(/Test Product/i);
      expect(images.length).toBeGreaterThanOrEqual(1);
    });

    it('should display product description', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

      renderProductDetail('test-product');

      await waitFor(() => {
        expect(screen.getByText('A beautiful handmade product')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Caching', () => {
    it('should use cached product when available', async () => {
      const cacheEntry = {
        data: mockProduct,
        timestamp: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000,
      };
      localStorage.setItem('mawu_product_test-product', JSON.stringify(cacheEntry));

      renderProductDetail('test-product');

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      }, { timeout: 3000 });

      // API should not be called when cache is available
      expect(api.get).not.toHaveBeenCalled();
    });
  });
});
