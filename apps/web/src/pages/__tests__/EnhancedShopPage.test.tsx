import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { EnhancedShopPage } from '../EnhancedShopPage';
import { CartProvider } from '../../contexts/CartContext';
import { api } from '../../lib/api';
import { fallbackShopCatalog } from '../../data/shop-fallback';

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

// Mock IntersectionObserver for ProductImage component
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;

const mockProducts = [
  {
    id: 'test-product-1',
    slug: 'test-product-1',
    name: 'Test Product 1',
    category: 'Test Category',
    price: 100,
    currency: 'GHS',
    tags: ['test'],
    impactStatement: 'Test impact statement',
    description: 'Test description',
    images: ['/test-image-1.jpg'],
    availability: 'in_stock' as const,
    inventory: 10,
  },
  {
    id: 'test-product-2',
    slug: 'test-product-2',
    name: 'Test Product 2',
    category: 'Test Category',
    price: 200,
    currency: 'GHS',
    tags: ['featured'],
    impactStatement: 'Test impact statement 2',
    description: 'Test description 2',
    images: ['/test-image-2.jpg'],
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

describe('EnhancedShopPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should display loading skeleton initially', () => {
    // Mock API to delay response
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ products: mockProducts }), 1000);
        })
    );

    renderWithProviders(<EnhancedShopPage />);

    // Check for loading skeleton
    expect(screen.getByText('Impact Merchandise Shop')).toBeInTheDocument();
    
    // The skeleton should be present (checking for multiple skeleton cards)
    const skeletonCards = document.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('should display products after loading', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    renderWithProviders(<EnhancedShopPage />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('GHS 100')).toBeInTheDocument();
    expect(screen.getByText('GHS 200')).toBeInTheDocument();
  });

  it('should display error state on API failure with no fallback', async () => {
    const mockError = new Error('Network error');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);
    
    // Mock validateProducts to return empty array on error
    const { validateProducts } = await import('../../utils/productValidation');
    vi.mocked(validateProducts).mockReturnValueOnce([]);

    renderWithProviders(<EnhancedShopPage />);

    // Wait for error state to appear
    await waitFor(() => {
      expect(screen.getByText('Unable to Load Products')).toBeInTheDocument();
    });

    // Check for retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should display error banner when using fallback data', async () => {
    const mockError = new Error('API error');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);
    
    // Mock validateProducts to return fallback data
    const { validateProducts } = await import('../../utils/productValidation');
    vi.mocked(validateProducts).mockReturnValueOnce(fallbackShopCatalog.products);

    renderWithProviders(<EnhancedShopPage />);

    // Wait for fallback products to load
    await waitFor(() => {
      expect(screen.getByText(/Unable to load latest products/i)).toBeInTheDocument();
    });

    // Should still show products from fallback
    expect(screen.getByText(/Showing cached data/i)).toBeInTheDocument();
    
    // Check that at least one product is displayed
    const productCards = document.querySelectorAll('[class*="group"]');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('should display product availability status correctly', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Check for "In Stock" status
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    
    // Check for "Only 3 left" status (low stock)
    expect(screen.getByText('Only 3 left')).toBeInTheDocument();
  });

  it('should display product tags', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    expect(screen.getByText('featured')).toBeInTheDocument();
  });

  it('should display impact statements', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Check for impact statements in the rendered content (using getAllByText since there are multiple)
    const impactStatements = screen.getAllByText(/Test impact statement/);
    expect(impactStatements.length).toBeGreaterThan(0);
  });

  it('should show "View Details" button for all products', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i });
    expect(viewDetailsButtons.length).toBeGreaterThan(0);
  });

  it('should show "Add to Cart" button for products without variations', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ products: mockProducts });

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    expect(addToCartButtons.length).toBeGreaterThan(0);
  });

  it('should handle backorder products correctly', async () => {
    const backorderProduct = {
      ...mockProducts[0],
      availability: 'backorder' as const,
    };
    
    vi.mocked(api.get).mockResolvedValueOnce({ 
      products: [backorderProduct] 
    });

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });
    
    // The component should still render the product
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('GHS 100')).toBeInTheDocument();
  });

  it('should use cached products when available', async () => {
    // Pre-populate cache
    const cacheEntry = {
      data: mockProducts,
      timestamp: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    localStorage.setItem('mawu_products_all', JSON.stringify(cacheEntry));

    renderWithProviders(<EnhancedShopPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Should not call API when cache is available
    expect(api.get).not.toHaveBeenCalled();
  });
});
