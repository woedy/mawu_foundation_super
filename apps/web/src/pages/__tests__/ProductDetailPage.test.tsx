import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

// Mock IntersectionObserver for ProductImage component
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;

const mockProduct = {
  id: 'test-product-1',
  slug: 'test-product-1',
  name: 'Test Product',
  category: 'Test Category',
  price: 100,
  currency: 'GHS',
  tags: ['test', 'featured'],
  impactStatement: 'Test impact statement',
  description: 'This is a detailed test description',
  images: ['/test-image-1.jpg', '/test-image-2.jpg'],
  availability: 'in_stock' as const,
  inventory: 10,
};

const mockProductWithVariations = {
  ...mockProduct,
  id: 'test-product-2',
  slug: 'test-product-2',
  name: 'Test Product with Variations',
  variations: [
    {
      type: 'Size',
      options: [
        { value: 'Small', priceModifier: 0, inventory: 5 },
        { value: 'Large', priceModifier: 10, inventory: 3 },
      ],
    },
    {
      type: 'Color',
      options: [
        { value: 'Red', priceModifier: 0 },
        { value: 'Blue', priceModifier: 5 },
      ],
    },
  ],
};

// This function is not used, remove it

// Helper to render with a specific route
const renderProductDetail = (slug: string) => {
  window.history.pushState({}, '', `/shop/product/${slug}`);
  return render(
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/shop/product/:slug" element={<ProductDetailPage />} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should load and display product details', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed test description')).toBeInTheDocument();
    expect(screen.getByText('GHS 100.00')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('Test impact statement')).toBeInTheDocument();
  });

  it('should show 404 for invalid slug', async () => {
    const notFoundError = new Error('Product not found');
    vi.mocked(api.get).mockRejectedValueOnce(notFoundError);
    
    // Mock validateProduct to return null for not found
    const { validateProduct } = await import('../../utils/productValidation');
    vi.mocked(validateProduct).mockReturnValueOnce(null);

    renderProductDetail('invalid-slug');

    await waitFor(() => {
      expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    });

    expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to shop/i })).toBeInTheDocument();
  });

  it('should display loading skeleton initially', () => {
    // Mock API to delay response
    vi.mocked(api.get).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ product: mockProduct }), 1000);
        })
    );

    renderProductDetail('test-product-1');

    // Check for loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should display product tags', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    expect(screen.getByText('featured')).toBeInTheDocument();
  });

  it('should display multiple product images', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check for image thumbnails (should have 2 images)
    const images = screen.getAllByAlt(/Test Product/i);
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it('should display variation selector for products with variations', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProductWithVariations });

    renderProductDetail('test-product-2');

    await waitFor(() => {
      expect(screen.getByText('Test Product with Variations')).toBeInTheDocument();
    });

    // Check for variation selectors
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
  });

  it('should update price when variation with price modifier is selected', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProductWithVariations });

    renderProductDetail('test-product-2');

    await waitFor(() => {
      expect(screen.getByText('Test Product with Variations')).toBeInTheDocument();
    });

    // Initial price
    expect(screen.getByText('GHS 100.00')).toBeInTheDocument();

    // Select Large size (adds 10 to price)
    const largeButton = screen.getByRole('button', { name: /large/i });
    fireEvent.click(largeButton);

    // Price should update to 110
    await waitFor(() => {
      expect(screen.getByText('GHS 110.00')).toBeInTheDocument();
    });
  });

  it('should disable "Add to Cart" button when variations are not selected', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProductWithVariations });

    renderProductDetail('test-product-2');

    await waitFor(() => {
      expect(screen.getByText('Test Product with Variations')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByRole('button', { name: /select options/i });
    expect(addToCartButton).toBeDisabled();
  });

  it('should enable "Add to Cart" button when all variations are selected', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProductWithVariations });

    renderProductDetail('test-product-2');

    await waitFor(() => {
      expect(screen.getByText('Test Product with Variations')).toBeInTheDocument();
    });

    // Select Size
    const smallButton = screen.getByRole('button', { name: /small/i });
    fireEvent.click(smallButton);

    // Select Color
    const redButton = screen.getByRole('button', { name: /red/i });
    fireEvent.click(redButton);

    // Button should now be enabled
    await waitFor(() => {
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).not.toBeDisabled();
    });
  });

  it('should display quantity selector', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('Quantity')).toBeInTheDocument();
    
    // Check for quantity input
    const quantityInput = screen.getByRole('spinbutton');
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput).toHaveValue(1);
  });

  it('should allow increasing and decreasing quantity', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    const increaseButton = screen.getByRole('button', { name: '+' });
    const decreaseButton = screen.getByRole('button', { name: '−' });

    // Increase quantity
    fireEvent.click(increaseButton);
    expect(quantityInput.value).toBe('2');

    // Increase again
    fireEvent.click(increaseButton);
    expect(quantityInput.value).toBe('3');

    // Decrease quantity
    fireEvent.click(decreaseButton);
    expect(quantityInput.value).toBe('2');
  });

  it('should not allow quantity below 1', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    const decreaseButton = screen.getByRole('button', { name: '−' });

    // Try to decrease below 1
    fireEvent.click(decreaseButton);
    expect(quantityInput.value).toBe('1');
  });

  it('should not allow quantity above inventory', async () => {
    const lowStockProduct = {
      ...mockProduct,
      inventory: 3,
      availability: 'low_stock' as const,
    };
    
    vi.mocked(api.get).mockResolvedValueOnce({ product: lowStockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const quantityInput = screen.getByRole('spinbutton') as HTMLInputElement;
    const increaseButton = screen.getByRole('button', { name: '+' });

    // Increase to max inventory
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    
    expect(quantityInput.value).toBe('3');

    // Try to increase beyond inventory
    fireEvent.click(increaseButton);
    expect(quantityInput.value).toBe('3');
    expect(increaseButton).toBeDisabled();
  });

  it('should disable "Add to Cart" for out of stock products', async () => {
    const outOfStockProduct = {
      ...mockProduct,
      inventory: 0,
      availability: 'backorder' as const,
    };
    
    vi.mocked(api.get).mockResolvedValueOnce({ product: outOfStockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addToCartButton).toBeDisabled();
  });

  it('should display error banner when using fallback data', async () => {
    const mockError = new Error('API error');
    vi.mocked(api.get).mockRejectedValueOnce(mockError);
    
    // Mock validateProduct to return fallback product
    const { validateProduct } = await import('../../utils/productValidation');
    vi.mocked(validateProduct).mockReturnValueOnce(mockProduct);

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText(/Unable to load latest product data/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Showing cached information/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should use cached product when available', async () => {
    // Pre-populate cache
    const cacheEntry = {
      data: mockProduct,
      timestamp: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    localStorage.setItem('mawu_product_test-product-1', JSON.stringify(cacheEntry));

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Should not call API when cache is available
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should display "Back to Shop" link', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    renderProductDetail('test-product-1');

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const backLink = screen.getByRole('link', { name: /back to shop/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/shop');
  });
});
