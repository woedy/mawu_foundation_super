import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartProvider, useCart } from '../CartContext';
import { api } from '../../lib/api';
import type { ShopProduct } from '../../types/shop';

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
  logWarning: vi.fn(),
}));

const mockProduct: ShopProduct = {
  id: 'test-product-1',
  slug: 'test-product-1',
  name: 'Test Product',
  category: 'Test',
  price: 100,
  currency: 'GHS',
  tags: ['test'],
  impactStatement: 'Test impact',
  description: 'Test description',
  images: ['/test.jpg'],
  availability: 'in_stock',
  inventory: 10,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext - Cart Validation with API Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should validate cart items against current API data', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    expect(result.current.items).toHaveLength(1);

    // Mock API response for validation
    vi.mocked(api.get).mockResolvedValueOnce({ product: mockProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults).toHaveLength(1);
    expect(validationResults![0]).toEqual({
      itemId: 'test-product-1',
      valid: true,
    });

    expect(api.get).toHaveBeenCalledWith('/api/products/test-product-1');
  });

  it('should detect when product is on backorder', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Mock API response with backorder status
    const backorderProduct = {
      ...mockProduct,
      availability: 'backorder',
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: backorderProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0]).toEqual({
      itemId: 'test-product-1',
      valid: false,
      message: 'Item is currently on backorder',
    });
  });

  it('should detect when product is out of stock', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Mock API response with zero inventory
    const outOfStockProduct = {
      ...mockProduct,
      inventory: 0,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: outOfStockProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0]).toEqual({
      itemId: 'test-product-1',
      valid: false,
      message: 'Item is out of stock',
      suggestedQuantity: 0,
    });
  });

  it('should detect when requested quantity exceeds available inventory', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart with quantity 5
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Add more items to increase quantity
    act(() => {
      result.current.updateQuantity('test-product-1', 5);
    });

    // Mock API response with lower inventory
    const lowStockProduct = {
      ...mockProduct,
      inventory: 3,
      availability: 'low_stock' as const,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: lowStockProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0]).toEqual({
      itemId: 'test-product-1',
      valid: false,
      message: 'Only 3 available',
      suggestedQuantity: 3,
    });
  });

  it('should detect price changes', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart with original price
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Mock API response with updated price
    const updatedPriceProduct = {
      ...mockProduct,
      price: 120,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: updatedPriceProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0].valid).toBe(true);
    expect(validationResults![0].message).toContain('Price updated from GHS 100.00 to GHS 120.00');
  });

  it('should warn about low stock but still mark as valid', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Mock API response with low stock
    const lowStockProduct = {
      ...mockProduct,
      inventory: 5,
      availability: 'low_stock' as const,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: lowStockProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0].valid).toBe(true);
    expect(validationResults![0].message).toBe('Low stock - only 5 remaining');
  });

  it('should handle validation errors gracefully', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Mock API error
    vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'));

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0]).toEqual({
      itemId: 'test-product-1',
      valid: false,
      message: 'Unable to validate item availability',
    });
  });

  it('should validate multiple cart items', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add multiple items to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product 1',
        price: 100,
        image: '/test1.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });

      result.current.addItem({
        id: 'test-product-2',
        name: 'Test Product 2',
        price: 200,
        image: '/test2.jpg',
        productId: 'test-product-2',
        maxInventory: 5,
      });
    });

    expect(result.current.items).toHaveLength(2);

    // Mock API responses for both products
    const product2 = {
      ...mockProduct,
      id: 'test-product-2',
      slug: 'test-product-2',
      name: 'Test Product 2',
      price: 200,
      inventory: 5,
    };

    vi.mocked(api.get)
      .mockResolvedValueOnce({ product: mockProduct })
      .mockResolvedValueOnce({ product: product2 });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults).toHaveLength(2);
    expect(validationResults![0].valid).toBe(true);
    expect(validationResults![1].valid).toBe(true);
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should skip validation for items without productId', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item without productId
    act(() => {
      result.current.addItem({
        id: 'legacy-item',
        name: 'Legacy Product',
        price: 50,
        image: '/legacy.jpg',
      });
    });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0]).toEqual({
      itemId: 'legacy-item',
      valid: true,
      message: 'Unable to validate - no product ID',
    });

    // API should not be called
    expect(api.get).not.toHaveBeenCalled();
  });

  it('should combine multiple validation messages', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart with quantity 5
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
      result.current.updateQuantity('test-product-1', 5);
    });

    // Mock API response with lower inventory AND price change
    const updatedProduct = {
      ...mockProduct,
      inventory: 3,
      price: 110,
    };
    vi.mocked(api.get).mockResolvedValueOnce({ product: updatedProduct });

    // Validate cart
    let validationResults;
    await act(async () => {
      validationResults = await result.current.validateCart();
    });

    expect(validationResults![0].valid).toBe(false);
    expect(validationResults![0].message).toContain('Only 3 available');
    expect(validationResults![0].message).toContain('Price also changed to GHS 110.00');
    expect(validationResults![0].suggestedQuantity).toBe(3);
  });

  it('should persist cart to localStorage', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item to cart
    act(() => {
      result.current.addItem({
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      });
    });

    // Wait for localStorage to be updated
    await waitFor(() => {
      const stored = localStorage.getItem('mawu_cart_items');
      expect(stored).toBeTruthy();
    });

    const stored = localStorage.getItem('mawu_cart_items');
    const parsedCart = JSON.parse(stored!);
    expect(parsedCart).toHaveLength(1);
    expect(parsedCart[0].id).toBe('test-product-1');
  });

  it('should load cart from localStorage on mount', () => {
    // Pre-populate localStorage
    const cartItems = [
      {
        id: 'test-product-1',
        name: 'Test Product',
        price: 100,
        quantity: 2,
        image: '/test.jpg',
        productId: 'test-product-1',
        maxInventory: 10,
      },
    ];
    localStorage.setItem('mawu_cart_items', JSON.stringify(cartItems));

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('test-product-1');
    expect(result.current.items[0].quantity).toBe(2);
  });
});
