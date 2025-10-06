import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../components/Toast";
import { Body, Button, Heading, Section } from "../design-system";

export const CartPage = () => {
  const { items, removeItem, updateQuantity, total, itemCount, validateCart } = useCart();
  const { showToast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validate cart on mount and when items change
  useEffect(() => {
    const validate = async () => {
      const results = await validateCart();
      const errors: Record<string, string> = {};
      
      results.forEach(result => {
        if (!result.valid && result.message) {
          errors[result.itemId] = result.message;
        }
      });
      
      setValidationErrors(errors);
    };
    
    if (items.length > 0) {
      validate();
    }
  }, [items, validateCart]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    
    if (item?.maxInventory && newQuantity > item.maxInventory) {
      const errorMsg = `Only ${item.maxInventory} available in stock`;
      setValidationErrors(prev => ({
        ...prev,
        [itemId]: errorMsg
      }));
      showToast(errorMsg, 'warning');
      return;
    }
    
    try {
      // Clear validation error for this item
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
      
      updateQuantity(itemId, newQuantity);
    } catch (error: any) {
      showToast(error.message || 'Failed to update quantity', 'error');
    }
  };

  if (itemCount === 0) {
    return (
      <Section background="muted">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-24 w-24 text-ink-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <Heading level={1}>Your Cart is Empty</Heading>
          <Body className="mt-4" variant="muted">
            Explore our impact merchandise and add items to support the mission.
          </Body>
          <Button as={Link} to="/shop" size="lg" className="mt-6">
            Continue Shopping
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section background="muted">
      <div className="mx-auto max-w-6xl">
        <Heading level={1} className="mb-8">Shopping Cart ({itemCount} items)</Heading>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="rounded-lg bg-white p-4 shadow">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink-900">{item.name}</h3>
                      {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Object.entries(item.selectedVariations).map(([type, value]) => (
                            <span key={type} className="text-xs text-ink-600">
                              {type.charAt(0).toUpperCase() + type.slice(1)}: <span className="font-medium">{value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {item.impactStatement && (
                        <p className="mt-1 text-sm text-brand-600">{item.impactStatement}</p>
                      )}
                      {item.maxInventory && (
                        <p className="mt-1 text-xs text-ink-500">
                          {item.maxInventory} available
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 rounded border border-ink-300 hover:bg-ink-50"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded border border-ink-300 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={item.maxInventory ? item.quantity >= item.maxInventory : false}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold">GHS {item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        showToast('Item removed from cart', 'info');
                      }}
                      className="text-ink-400 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {validationErrors[item.id] && (
                    <div className="mt-2 rounded bg-red-50 p-2 text-sm text-red-600">
                      {validationErrors[item.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
              <div className="space-y-2 border-b border-ink-200 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GHS {total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>GHS {total.toFixed(2)}</span>
              </div>
              {Object.keys(validationErrors).length > 0 ? (
                <>
                  <div className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
                    Please resolve cart issues before checkout
                  </div>
                  <Button 
                    size="lg" 
                    className="mt-6 w-full opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Proceed to Checkout
                  </Button>
                </>
              ) : (
                <Button 
                  as={Link} 
                  to="/shop/checkout" 
                  size="lg" 
                  className="mt-6 w-full"
                >
                  Proceed to Checkout
                </Button>
              )}
              <Button
                as={Link}
                to="/shop"
                variant="ghost"
                size="lg"
                className="mt-2 w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
