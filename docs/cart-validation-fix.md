# Cart Validation Fix

## Issue
Users were getting "Unable to validate item availability" error when adding items to cart.

## Root Cause
The cart validation was trying to fetch products using the numeric `productId`, but the API endpoint `/api/products/:slug` expects a **slug** (e.g., `mawu-foundation-tshirt`), not a numeric ID.

## Solution
Updated the cart system to store and use the product `slug` for validation:

### Changes Made

#### 1. CartContext.tsx
- Added `productSlug?: string` to `CartItem` interface
- Updated validation logic to use `productSlug` (with fallback to `productId`)
- Changed API call from `/api/products/${item.productId}` to `/api/products/${productIdentifier}`

#### 2. ProductDetailPage.tsx
- Added `productSlug: product.slug` when adding items to cart
- Ensures cart items have the correct slug for validation

#### 3. EnhancedShopPage.tsx
- Added `productSlug: product.slug` when adding items to cart from shop page
- Maintains consistency across all add-to-cart flows

## How It Works Now

### Before (Broken)
```typescript
addItem({
  productId: product.id,  // e.g., "1"
  // ...
});

// Validation tries: GET /api/products/1 ❌ (endpoint doesn't exist)
```

### After (Fixed)
```typescript
addItem({
  productId: product.id,
  productSlug: product.slug,  // e.g., "mawu-foundation-tshirt"
  // ...
});

// Validation uses: GET /api/products/mawu-foundation-tshirt ✅
```

## Testing

### Manual Test
1. Start the development server: `npm run dev`
2. Navigate to shop page
3. Add a product to cart
4. Cart should validate successfully without errors

### Validation Features
The cart validation now correctly:
- ✅ Checks product availability
- ✅ Validates inventory levels
- ✅ Detects price changes
- ✅ Warns about low stock
- ✅ Identifies out-of-stock items

## API Endpoints Used

### Product Fetching
- `GET /api/products` - List all products
- `GET /api/products/:slug` - Get single product by slug

### Cart Validation
- Uses `GET /api/products/:slug` to validate each cart item
- Compares cart data with current product data
- Returns validation results for each item

## Backward Compatibility

The fix maintains backward compatibility:
- Old cart items without `productSlug` will fall back to `productId`
- Warning logged for items missing both identifiers
- Graceful degradation if validation fails

## Future Improvements

Consider these enhancements:
1. Batch validation API endpoint to reduce requests
2. Cache product data to minimize API calls
3. Real-time inventory updates via WebSocket
4. Optimistic UI updates with background validation

## Related Files

- `apps/web/src/contexts/CartContext.tsx` - Cart state management
- `apps/web/src/pages/ProductDetailPage.tsx` - Product detail add-to-cart
- `apps/web/src/pages/EnhancedShopPage.tsx` - Shop page add-to-cart
- `apps/web/src/types/shop.ts` - Product type definitions
