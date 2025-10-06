import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import type { ShopProduct } from '../types/shop';
import { logApiError, measureApiCall, logWarning } from '../lib/monitoring';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  impactStatement?: string;
  selectedVariations?: Record<string, string>;
  productId?: string;
  productSlug?: string;
  maxInventory?: number;
}

interface ValidationResult {
  itemId: string;
  valid: boolean;
  message?: string;
  suggestedQuantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  validateCart: () => Promise<ValidationResult[]>;
}

const CART_STORAGE_KEY = 'mawu_cart_items';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return [];
};

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      // Find existing item with same id (which includes variation info)
      const existingItem = current.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Check inventory limit if available
        const newQuantity = existingItem.quantity + 1;
        if (existingItem.maxInventory && newQuantity > existingItem.maxInventory) {
          console.warn(`Cannot add more items. Maximum inventory: ${existingItem.maxInventory}`);
          throw new Error(`Only ${existingItem.maxInventory} items available in stock`);
        }
        
        return current.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      // Check if new item has inventory limit
      if (newItem.maxInventory !== undefined && newItem.maxInventory <= 0) {
        throw new Error('This item is currently out of stock');
      }
      
      return [...current, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(current =>
      current.map(item => {
        if (item.id === id) {
          // Check inventory limit if available
          if (item.maxInventory && quantity > item.maxInventory) {
            console.warn(`Cannot set quantity to ${quantity}. Maximum inventory: ${item.maxInventory}`);
            throw new Error(`Only ${item.maxInventory} items available in stock`);
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Validate cart items against current product availability and inventory
  const validateCart = async (): Promise<ValidationResult[]> => {
    const results: ValidationResult[] = [];
    
    for (const item of items) {
      try {
        // Use productSlug if available, otherwise fall back to productId
        const productIdentifier = item.productSlug || item.productId;
        
        // Skip validation if no product identifier is available
        if (!productIdentifier) {
          logWarning(
            'Cart item missing product identifier',
            'CartContext.validateCart',
            { itemId: item.id, itemName: item.name }
          );
          results.push({
            itemId: item.id,
            valid: true,
            message: 'Unable to validate - no product identifier',
          });
          continue;
        }

        // Fetch current product data from API with performance measurement
        const response = await measureApiCall(
          `GET /api/products/${productIdentifier} (cart validation)`,
          () => api.get(`/api/products/${productIdentifier}`),
          false
        );
        const product: ShopProduct = response.product;
        
        const result: ValidationResult = {
          itemId: item.id,
          valid: true,
        };
        
        // Validate product availability
        if (product.availability === 'backorder') {
          result.valid = false;
          result.message = 'Item is currently on backorder';
        }
        
        // Validate inventory against requested quantity
        if (product.inventory <= 0) {
          result.valid = false;
          result.message = 'Item is out of stock';
          result.suggestedQuantity = 0;
        } else if (item.quantity > product.inventory) {
          result.valid = false;
          result.message = `Only ${product.inventory} available`;
          result.suggestedQuantity = product.inventory;
        }
        
        // Check for price changes (notify user but don't invalidate)
        const priceDifference = Math.abs(item.price - product.price);
        if (priceDifference > 0.01) {
          // Price changed - notify user
          if (!result.message) {
            result.message = `Price updated from GHS ${item.price.toFixed(2)} to GHS ${product.price.toFixed(2)}`;
          } else {
            result.message += ` (Price also changed to GHS ${product.price.toFixed(2)})`;
          }
        }
        
        // Warn about low stock (but still valid)
        if (product.availability === 'low_stock' && result.valid) {
          result.message = `Low stock - only ${product.inventory} remaining`;
        }
        
        results.push(result);
      } catch (error) {
        logApiError(
          error instanceof Error ? error : new Error(`Failed to validate cart item ${item.id}`),
          'CartContext.validateCart',
          { 
            itemId: item.id, 
            itemName: item.name,
            productId: item.productId 
          }
        );
        results.push({
          itemId: item.id,
          valid: false,
          message: 'Unable to validate item availability',
        });
      }
    }
    
    return results;
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
