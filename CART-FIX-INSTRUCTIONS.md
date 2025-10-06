# Fix Cart Validation Error - Quick Instructions

## The Issue
You're seeing "Unable to validate item availability" because the items currently in your cart were added before the fix and don't have the `productSlug` field needed for validation.

## Quick Fix (Choose One)

### Option 1: Clear Cart via Browser Console (Fastest)
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Paste this command and press Enter:
```javascript
localStorage.removeItem('mawu_cart_items'); location.reload();
```
4. Your cart will be cleared and page will reload
5. Add items again - they'll work now! ✅

### Option 2: Use the Clear Cart Page
1. Navigate to: `http://localhost:5173/clear-cart.html`
2. Click "Clear Cart" button
3. Click "Go to Shop" to add items again

### Option 3: Clear via Application Tab
1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:5173`
4. Find the key `mawu_cart_items` and delete it
5. Refresh the page

## Why This Happened

**Old cart items (before fix):**
```json
{
  "productId": "1",
  // Missing productSlug ❌
}
```

**New cart items (after fix):**
```json
{
  "productId": "1",
  "productSlug": "volta-region-tote-bag" ✅
}
```

The validation needs the `productSlug` to fetch product data from the API.

## Test the Fix

After clearing your cart:

1. Go to the shop page
2. Add any product to cart
3. The validation error should be gone! ✅
4. You should see proper inventory validation

## What's Fixed

The cart now properly validates:
- ✅ Product availability
- ✅ Current inventory levels
- ✅ Price changes
- ✅ Low stock warnings
- ✅ Out of stock detection

## If You Still See Issues

If you still see the error after clearing the cart:

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear browser cache** completely
3. Check that the dev server is running: `npm run dev`
4. Check browser console for any other errors

## Files That Were Fixed

- `apps/web/src/contexts/CartContext.tsx` - Added productSlug support
- `apps/web/src/pages/ProductDetailPage.tsx` - Passes productSlug when adding to cart
- `apps/web/src/pages/EnhancedShopPage.tsx` - Passes productSlug from shop page

## Summary

**Quick Fix:** Run this in browser console:
```javascript
localStorage.removeItem('mawu_cart_items'); location.reload();
```

Then add items to cart again - the error will be gone! 🎉
