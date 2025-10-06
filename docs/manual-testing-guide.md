# Manual Testing Guide - Shop Backend Integration

This guide provides step-by-step instructions for manually testing the shop backend integration feature. Follow each test scenario to verify that all requirements are met.

## Prerequisites

Before starting the tests:

1. **Backend Server**: Ensure the backend server is running on `http://localhost:3000`
   ```bash
   npm run dev:server
   ```

2. **Frontend Application**: Ensure the frontend is running
   ```bash
   npm run dev --workspace @mawu/web
   ```

3. **Browser DevTools**: Open browser developer tools (F12) to monitor:
   - Network tab for API requests
   - Console tab for logs and errors
   - Application tab for localStorage cache

4. **Clear Cache**: Start with a clean slate
   - Clear localStorage: `localStorage.clear()` in console
   - Clear browser cache or use incognito mode

---

## Test Scenarios

### ✅ Test 1: Complete User Flow (Browse → View → Add to Cart)

**Objective**: Verify the complete shopping experience works end-to-end

**Steps**:
1. Navigate to `/shop` page
2. Wait for products to load
3. Click on any product card
4. Select product variations (if available)
5. Adjust quantity
6. Click "Add to Cart"
7. Verify cart icon updates with item count
8. Open cart to verify product details

**Expected Results**:
- ✓ Products load and display correctly
- ✓ Product detail page shows accurate information
- ✓ Variations can be selected
- ✓ Quantity can be adjusted
- ✓ Item is added to cart successfully
- ✓ Cart displays correct product name, price, and image
- ✓ Toast notification confirms addition

**Requirements Verified**: 1.1, 1.2, 3.1, 3.2, 4.1, 4.2

---

### ✅ Test 2: Loading States Display Correctly

**Objective**: Verify loading skeletons appear during data fetching

**Steps**:
1. Clear localStorage: `localStorage.clear()`
2. Refresh the `/shop` page
3. Observe the initial loading state
4. Navigate to a product detail page
5. Observe the product detail loading state

**Expected Results**:
- ✓ Shop page shows `ProductGridSkeleton` with 6 animated cards
- ✓ Skeleton cards have pulse animation
- ✓ Product detail page shows `ProductDetailSkeleton`
- ✓ Loading states match the layout of actual content
- ✓ Smooth transition from loading to content

**Requirements Verified**: 2.1, 2.5

---

### ✅ Test 3: Error Scenarios (Backend Server Down)

**Objective**: Verify graceful error handling when API is unavailable

**Steps**:
1. Stop the backend server (Ctrl+C in server terminal)
2. Clear localStorage: `localStorage.clear()`
3. Refresh the `/shop` page
4. Observe the error handling
5. Navigate to a product detail page
6. Observe the error handling

**Expected Results**:
- ✓ Shop page displays error banner: "Unable to load latest products. Showing cached data."
- ✓ Fallback products from `shop-fallback.ts` are displayed
- ✓ "Try again" button is visible
- ✓ Product detail page shows error banner if fallback data exists
- ✓ Console shows error logs with context
- ✓ No application crashes or blank pages

**Requirements Verified**: 2.2, 2.3, 2.4

---

### ✅ Test 4: Fallback Data Works When API Unavailable

**Objective**: Verify fallback data provides a working experience

**Steps**:
1. Ensure backend server is stopped
2. Clear localStorage
3. Navigate to `/shop`
4. Verify products are displayed (from fallback)
5. Click on a product
6. Verify product details are shown
7. Add product to cart
8. Verify cart functionality works

**Expected Results**:
- ✓ Fallback products display correctly
- ✓ All 6 fallback products are visible
- ✓ Product images, names, and prices are correct
- ✓ Product detail pages work with fallback data
- ✓ Add to cart functionality works
- ✓ Error banner indicates using fallback data
- ✓ Console logs show "Fallback data usage" messages

**Requirements Verified**: 1.4, 2.3, 4.1

---

### ✅ Test 5: Cache Persistence Across Page Reloads

**Objective**: Verify cached data persists and is reused

**Steps**:
1. Start backend server
2. Clear localStorage
3. Navigate to `/shop` and wait for products to load
4. Open DevTools → Application → Local Storage
5. Verify `mawu_products_all` key exists
6. Note the timestamp
7. Refresh the page
8. Check Network tab - should see no new API request
9. Navigate to a product detail page
10. Verify `mawu_product_{slug}` key is created
11. Refresh the product page
12. Check Network tab - should see no new API request

**Expected Results**:
- ✓ `mawu_products_all` is stored in localStorage
- ✓ Cache entry contains `data`, `timestamp`, and `expiresAt` fields
- ✓ On refresh, cached data is used (no API call)
- ✓ Products load instantly from cache
- ✓ Individual product cache keys are created
- ✓ Cache expires after 5 minutes (products list)
- ✓ Cache expires after 10 minutes (product details)
- ✓ Console shows "Cache hit" messages

**Requirements Verified**: 6.1, 6.2, 6.3

---

### ✅ Test 6: No Duplicate API Requests

**Objective**: Verify request deduplication prevents unnecessary API calls

**Steps**:
1. Clear localStorage
2. Open DevTools → Network tab
3. Filter by "products"
4. Navigate to `/shop`
5. Count the number of requests to `/api/products`
6. Open multiple product detail pages in quick succession
7. Count requests to `/api/products/{slug}`

**Expected Results**:
- ✓ Only ONE request to `/api/products` on shop page load
- ✓ Only ONE request per unique product slug
- ✓ No duplicate simultaneous requests
- ✓ Pending requests are reused
- ✓ Console shows request deduplication working

**Requirements Verified**: 6.4

---

### ✅ Test 7: Cart Validation with Out of Stock Products

**Objective**: Verify cart validates against current inventory

**Steps**:
1. Add a product to cart
2. Using backend admin or database, set product inventory to 0
3. Navigate to cart page
4. Observe validation messages
5. Try to proceed to checkout

**Expected Results**:
- ✓ Cart shows validation warning for out of stock items
- ✓ Quantity is adjusted if exceeds available inventory
- ✓ User is notified of inventory changes
- ✓ Cannot proceed to checkout with invalid items
- ✓ Price changes are detected and displayed

**Requirements Verified**: 4.3, 4.4, 4.5

---

### ✅ Test 8: Images Lazy Load Properly

**Objective**: Verify images use lazy loading for performance

**Steps**:
1. Navigate to `/shop` page
2. Open DevTools → Network tab
3. Filter by "images"
4. Scroll slowly down the page
5. Observe when images are loaded
6. Navigate to product detail page
7. Observe image gallery loading

**Expected Results**:
- ✓ Images load as they enter viewport
- ✓ Images have `loading="lazy"` attribute
- ✓ Fade-in transition when images load
- ✓ Intersection Observer is used
- ✓ Images outside viewport are not loaded initially
- ✓ Smooth loading experience

**Requirements Verified**: 6.5

---

### ✅ Test 9: API Configuration with Different URLs

**Objective**: Verify API URL configuration works correctly

**Steps**:
1. Check `.env` file for `VITE_API_URL`
2. Test with `VITE_API_URL=http://localhost:3000`
3. Verify products load correctly
4. Remove `VITE_API_URL` from `.env`
5. Restart dev server
6. Verify fallback to `http://localhost:3001` works

**Expected Results**:
- ✓ API URL is read from environment variable
- ✓ Requests go to correct URL
- ✓ Fallback URL works when env var not set
- ✓ No hardcoded URLs in code
- ✓ Configuration is documented

**Requirements Verified**: 5.1, 5.2, 5.3, 5.4, 5.5

---

### ✅ Test 10: Product Variations Work with API Data

**Objective**: Verify product variations are handled correctly

**Steps**:
1. Navigate to a product with variations (e.g., Kente Heritage Tee)
2. Verify variation options are displayed
3. Select different variations
4. Observe price changes
5. Observe image changes (if variation has specific images)
6. Add to cart with selected variations
7. Verify cart shows variation details

**Expected Results**:
- ✓ Variation selectors display all options
- ✓ Price updates based on variation modifiers
- ✓ Images update for variation-specific images
- ✓ Cannot add to cart without selecting all variations
- ✓ Cart item includes variation details
- ✓ Inventory is checked per variation

**Requirements Verified**: 3.2, 3.3, 4.2

---

### ✅ Test 11: Error Logging and Monitoring

**Objective**: Verify errors are logged properly for debugging

**Steps**:
1. Open browser console
2. Stop backend server
3. Navigate to `/shop`
4. Observe console logs
5. Navigate to product detail page
6. Observe console logs
7. Check for structured error information

**Expected Results**:
- ✓ API errors are logged with context
- ✓ Logs include endpoint, status code, and error message
- ✓ Fallback usage is logged
- ✓ Cache hit/miss is logged
- ✓ Performance metrics are logged
- ✓ Validation errors are logged
- ✓ No sensitive data in logs

**Requirements Verified**: 2.2, 2.4

---

### ✅ Test 12: 404 Handling for Invalid Product Slugs

**Objective**: Verify proper handling of non-existent products

**Steps**:
1. Navigate to `/shop/product/invalid-slug-12345`
2. Observe the page content
3. Verify error handling
4. Click "Back to Shop" button

**Expected Results**:
- ✓ "Product Not Found" message is displayed
- ✓ User-friendly 404 page is shown
- ✓ "Back to Shop" button works
- ✓ No application crash
- ✓ Console shows 404 error logged

**Requirements Verified**: 3.5

---

### ✅ Test 13: Cache Expiration and Refresh

**Objective**: Verify cache expires and refreshes correctly

**Steps**:
1. Navigate to `/shop` and wait for products to load
2. Open DevTools → Application → Local Storage
3. Find `mawu_products_all` entry
4. Note the `expiresAt` timestamp
5. Manually edit `expiresAt` to a past timestamp
6. Refresh the page
7. Observe Network tab for new API request
8. Verify cache is updated with new data

**Expected Results**:
- ✓ Expired cache is detected
- ✓ New API request is made
- ✓ Cache is updated with fresh data
- ✓ New expiration time is set
- ✓ Products display correctly

**Requirements Verified**: 6.3

---

### ✅ Test 14: Multiple Components Using Same Data

**Objective**: Verify data sharing between components

**Steps**:
1. Clear localStorage
2. Open `/shop` in one browser tab
3. Open `/shop/product/kente-heritage-tee` in another tab
4. Check Network tab in both tabs
5. Verify request deduplication across components

**Expected Results**:
- ✓ Data is shared between components
- ✓ No duplicate requests for same data
- ✓ Cache is shared across components
- ✓ Both components display correct data

**Requirements Verified**: 6.4

---

## Performance Checklist

- [ ] Initial page load < 2 seconds (with cache)
- [ ] API response time < 500ms
- [ ] Images lazy load properly
- [ ] No layout shift during loading
- [ ] Smooth transitions between states
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] Cache reduces subsequent load times

---

## Accessibility Checklist

- [ ] Loading states are announced to screen readers
- [ ] Error messages are accessible
- [ ] All interactive elements are keyboard accessible
- [ ] Focus management works correctly
- [ ] Images have proper alt text
- [ ] Color contrast meets WCAG standards

---

## Browser Compatibility

Test in the following browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Common Issues and Solutions

### Issue: Products not loading
**Solution**: 
- Check backend server is running
- Verify `VITE_API_URL` in `.env`
- Check browser console for errors
- Verify network connectivity

### Issue: Cache not working
**Solution**:
- Check localStorage is enabled
- Verify cache keys are being created
- Check for localStorage quota errors
- Clear cache and retry

### Issue: Images not loading
**Solution**:
- Verify image URLs are correct
- Check CORS configuration
- Verify image files exist
- Check network tab for 404s

### Issue: Variations not working
**Solution**:
- Verify product has variations in database
- Check variation data structure
- Verify variation selector component
- Check console for validation errors

---

## Test Results Template

Use this template to record your test results:

```
## Test Session: [Date/Time]
**Tester**: [Name]
**Environment**: [Development/Staging/Production]
**Browser**: [Browser Name and Version]

### Test Results

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Complete User Flow | ✅ PASS | |
| 2 | Loading States | ✅ PASS | |
| 3 | Error Scenarios | ✅ PASS | |
| 4 | Fallback Data | ✅ PASS | |
| 5 | Cache Persistence | ✅ PASS | |
| 6 | No Duplicate Requests | ✅ PASS | |
| 7 | Cart Validation | ✅ PASS | |
| 8 | Image Lazy Loading | ✅ PASS | |
| 9 | API Configuration | ✅ PASS | |
| 10 | Product Variations | ✅ PASS | |
| 11 | Error Logging | ✅ PASS | |
| 12 | 404 Handling | ✅ PASS | |
| 13 | Cache Expiration | ✅ PASS | |
| 14 | Data Sharing | ✅ PASS | |

### Issues Found
[List any issues discovered during testing]

### Recommendations
[List any recommendations for improvements]
```

---

## Next Steps

After completing all manual tests:

1. ✅ Document any issues found
2. ✅ Create bug reports for failures
3. ✅ Update requirements if needed
4. ✅ Perform regression testing after fixes
5. ✅ Get stakeholder sign-off
6. ✅ Prepare for production deployment

---

## Contact

For questions or issues during testing, contact the development team.
