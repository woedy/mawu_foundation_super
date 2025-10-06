# Shop Backend Integration - Test Checklist

Quick reference checklist for manual testing. Check off each item as you complete it.

## Pre-Testing Setup

- [ ] Backend server is running (`npm run dev:server`)
- [ ] Frontend is running (`npm run dev --workspace @mawu/web`)
- [ ] Browser DevTools are open (F12)
- [ ] localStorage is cleared (`localStorage.clear()`)
- [ ] Verification script passed (`npx tsx scripts/verify-shop-integration.ts`)

---

## Core Functionality Tests

### User Flow
- [ ] Navigate to `/shop` page
- [ ] Products load and display correctly
- [ ] Click on a product card
- [ ] Product detail page loads
- [ ] Select variations (if available)
- [ ] Adjust quantity
- [ ] Add to cart successfully
- [ ] Cart icon updates with count
- [ ] Cart displays correct product details

### Loading States
- [ ] Shop page shows skeleton loader initially
- [ ] Skeleton has 6 animated cards
- [ ] Product detail shows skeleton loader
- [ ] Smooth transition from loading to content
- [ ] No layout shift during loading

### Error Handling (Stop Backend Server)
- [ ] Shop page shows error banner
- [ ] Fallback products are displayed
- [ ] "Try again" button is visible
- [ ] Product detail shows error banner
- [ ] No application crashes
- [ ] Console shows structured error logs

### Fallback Data
- [ ] All 6 fallback products display
- [ ] Product images load correctly
- [ ] Product details are accurate
- [ ] Add to cart works with fallback data
- [ ] Error banner indicates fallback usage

---

## Caching Tests

### Cache Creation
- [ ] `mawu_products_all` key in localStorage
- [ ] Cache has `data`, `timestamp`, `expiresAt` fields
- [ ] Individual product cache keys created (`mawu_product_{slug}`)
- [ ] Cache data structure is valid JSON

### Cache Usage
- [ ] Refresh page - no new API request
- [ ] Products load instantly from cache
- [ ] Console shows "Cache hit" messages
- [ ] Cache persists across page reloads

### Cache Expiration
- [ ] Edit `expiresAt` to past timestamp
- [ ] Refresh page - new API request made
- [ ] Cache updates with fresh data
- [ ] New expiration time is set

---

## Performance Tests

### Request Deduplication
- [ ] Only ONE request to `/api/products` on shop load
- [ ] Only ONE request per unique product slug
- [ ] No duplicate simultaneous requests
- [ ] Network tab confirms deduplication

### Image Lazy Loading
- [ ] Images load as they enter viewport
- [ ] Images have `loading="lazy"` attribute
- [ ] Fade-in transition when images load
- [ ] Images outside viewport not loaded initially
- [ ] Smooth scrolling experience

---

## Product Features

### Variations
- [ ] Variation selectors display all options
- [ ] Price updates with variation selection
- [ ] Images update for variation-specific images
- [ ] Cannot add to cart without selecting all variations
- [ ] Cart shows variation details
- [ ] Inventory checked per variation

### Inventory
- [ ] Stock status displays correctly (In Stock, Low Stock, Backorder)
- [ ] Quantity selector respects max inventory
- [ ] Cannot add more than available inventory
- [ ] Out of stock products cannot be added to cart

---

## Cart Validation

- [ ] Add product to cart
- [ ] Cart validates against current inventory
- [ ] Quantity adjusted if exceeds inventory
- [ ] Price changes detected and displayed
- [ ] Out of stock items show warning
- [ ] Cannot checkout with invalid items

---

## Error Scenarios

### 404 Handling
- [ ] Navigate to `/shop/product/invalid-slug`
- [ ] "Product Not Found" message displays
- [ ] "Back to Shop" button works
- [ ] No application crash
- [ ] Console shows 404 error logged

### API Errors
- [ ] Network errors logged with context
- [ ] Fallback usage logged
- [ ] Cache hit/miss logged
- [ ] Performance metrics logged
- [ ] No sensitive data in logs

---

## Configuration Tests

### Environment Variables
- [ ] `VITE_API_URL` in `.env` file
- [ ] Requests go to correct URL
- [ ] Fallback URL works when env var not set
- [ ] No hardcoded URLs in code

---

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Accessibility

- [ ] Loading states announced to screen readers
- [ ] Error messages are accessible
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] Images have proper alt text
- [ ] Color contrast meets WCAG standards

---

## Performance Metrics

- [ ] Initial page load < 2 seconds (with cache)
- [ ] API response time < 500ms
- [ ] No layout shift during loading
- [ ] Smooth transitions between states
- [ ] No memory leaks

---

## Final Verification

- [ ] All test scenarios completed
- [ ] All issues documented
- [ ] Screenshots captured for issues
- [ ] Test results recorded
- [ ] Stakeholder sign-off obtained

---

## Sign-Off

**Tester Name**: ___________________________

**Date**: ___________________________

**Environment**: [ ] Development [ ] Staging [ ] Production

**Overall Status**: [ ] PASS [ ] FAIL [ ] PASS WITH ISSUES

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## Quick Commands

```bash
# Clear localStorage in browser console
localStorage.clear()

# Check cache keys
Object.keys(localStorage).filter(k => k.startsWith('mawu_'))

# View cache entry
JSON.parse(localStorage.getItem('mawu_products_all'))

# Start backend
npm run dev:server

# Start frontend
npm run dev --workspace @mawu/web

# Run verification script
npx tsx scripts/verify-shop-integration.ts
```
