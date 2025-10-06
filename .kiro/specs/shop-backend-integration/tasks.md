# Implementation Plan

- [x] 1. Create data fetching hooks
  - Create `useProducts` hook that fetches from `/api/products` endpoint
  - Create `useProduct` hook that fetches from `/api/products/:slug` endpoint
  - Implement loading, error, and data states for both hooks
  - Add refetch capability to both hooks
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Implement caching layer
  - Create cache utility functions for storing and retrieving product data

  - Implement in-memory cache with expiration (5 min for list, 10 min for details)
  - Add localStorage persistence for cache across page reloads
  - Implement cache cleanup function for expired entries
  - Add request deduplication to prevent duplicate simultaneous API calls
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 3. Create loading skeleton components
  - Create `ProductGridSkeleton` component with animated placeholders
  - Create `ProductDetailSkeleton` component for product detail page
  - Style skeletons to match actual product card and detail layouts
  - Add pulse animation for loading effect
  - _Requirements: 2.1, 2.5_

- [x] 4. Create error handling components
  - Create `ErrorState` component for displaying API errors
  - Implement user-friendly error messages using existing `getErrorMessage` utility
  - Add retry button functionality to error state
  - Create inline error banner for fallback data scenarios
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 5. Update EnhancedShopPage to use API data
  - Replace `fallbackShopCatalog` import with `useProducts` hook
  - Add loading state rendering with `ProductGridSkeleton`
  - Add error state rendering with fallback to static data
  - Update product mapping to use API response structure
  - Test that add to cart functionality works with API data
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 4.1, 4.2_

- [x] 6. Update ProductDetailPage to use API data
  - Import and use `useProduct` hook with slug from URL params

  - Add loading state rendering with `ProductDetailSkeleton`
  - Handle 404 case when product is not found
  - Add error state with fallback behavior
  - Ensure variation selector works with API data
  - Test add to cart with variations from API
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.3_

- [x] 7. Enhance cart validation with real-time API data
  - Update `CartContext.validateCart()` to fetch current product data from API
  - Validate product availability against current stock levels
  - Check for price changes and notify user
  - Handle out of stock scenarios
  - Update cart items with suggested quantities when inventory is low
  - _Requirements: 4.4, 4.5_

- [x] 8. Add data validation for API responses
  - Create `validateProduct` function to ensure API response structure is correct

  - Add type guards for product data
  - Handle malformed API responses gracefully
  - Log validation errors for debugging
  - _Requirements: 1.5, 3.6_

- [x] 9. Implement image lazy loading
  - Create `ProductImage` component with intersection observer
  - Add lazy loading to product grid images
  - Add lazy loading to product detail gallery
  - Implement fade-in transition when images load
  - _Requirements: 6.5_

- [x] 10. Add error logging and monitoring
  - Create `logApiError` function for structured error logging
  - Add performance measurement for API calls

  - Log cache hit/miss rates for optimization insights
  - Add console warnings for fallback data usage
  - _Requirements: 2.2, 2.4_

- [x] 11. Write unit tests for hooks
  - Test `useProducts` hook fetches data correctly
  - Test `useProducts` hook handles errors and uses fallback
  - Test `useProducts` hook caches data properly
  - Test `useProduct` hook fetches individual product
  - Test `useProduct` hook handles 404 scenarios
  - Test cache expiration and refresh logic
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.5, 6.1, 6.2, 6.3_

- [x] 12. Write component integration tests
  - Test `EnhancedShopPage` displays loading skeleton initially

  - Test `EnhancedShopPage` displays products after loading
  - Test `EnhancedShopPage` displays error state on API failure
  - Test `ProductDetailPage` loads and displays product details
  - Test `ProductDetailPage` shows 404 for invalid slug
  - Test cart validation with API data
  - _Requirements: 2.1, 2.2, 2.5, 3.1, 3.5, 4.4_

- [x] 13. Update environment configuration
  - Verify `VITE_API_URL` is set correctly in `.env` file
  - Document API URL configuration in README
  - Test with different API URLs (localhost, production)
  - Ensure fallback to localhost:3001 works when env var is not set
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 14. Manual testing and verification
  - Test complete user flow: browse shop → view product → add to cart

  - Verify loading states appear correctly
  - Test error scenarios by stopping backend server
  - Verify fallback data works when API is unavailable
  - Test cache persistence across page reloads
  - Verify no duplicate API requests are made
  - Test cart validation with out of stock products
  - Verify images lazy load properly
  - _Requirements: All requirements_
