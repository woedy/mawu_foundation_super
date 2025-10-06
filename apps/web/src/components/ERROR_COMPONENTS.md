# Error Handling Components

This directory contains reusable error handling components for displaying API errors and fallback scenarios.

## Components

### ErrorState

A full-page error state component for displaying critical API errors with optional retry functionality.

**Usage:**

```tsx
import { ErrorState } from '../components';
import { useProducts } from '../hooks';

const ShopPage = () => {
  const { products, loading, error, refetch } = useProducts();

  if (error && products.length === 0) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // Render products...
};
```

**Props:**

- `error` (Error, required): The error object to display
- `onRetry` (function, optional): Callback function when retry button is clicked
- `title` (string, optional): Custom error title (default: "Unable to Load Content")
- `showRetry` (boolean, optional): Whether to show the retry button (default: true)

**Features:**

- User-friendly error messages using `getErrorMessage` utility
- Accessible error icon
- Optional retry button
- Responsive layout
- Consistent with design system

### ErrorBanner

An inline error banner component for displaying non-critical errors or fallback data scenarios.

**Usage:**

```tsx
import { ErrorBanner } from '../components';
import { useProducts } from '../hooks';

const ShopPage = () => {
  const { products, loading, error } = useProducts();

  return (
    <Section>
      {error && products.length > 0 && (
        <ErrorBanner
          error={error}
          message="Unable to load latest products. Showing cached data."
          showDismiss={true}
          onDismiss={() => console.log('Dismissed')}
        />
      )}
      {/* Render products... */}
    </Section>
  );
};
```

**Props:**

- `error` (Error, required): The error object to display
- `message` (string, optional): Custom error message (overrides default from `getErrorMessage`)
- `onDismiss` (function, optional): Callback function when dismiss button is clicked
- `showDismiss` (boolean, optional): Whether to show the dismiss button (default: false)

**Features:**

- Inline warning banner style
- User-friendly error messages
- Optional custom message for fallback scenarios
- Optional dismiss button
- Accessible with ARIA attributes
- Warning icon for visual clarity

## Error Message Handling

Both components use the `getErrorMessage` utility from `lib/api.ts` to convert error objects into user-friendly messages. This utility handles:

- Network errors
- API errors with specific error codes
- Validation errors
- Payment errors
- Generic errors

**Example Error Codes:**

- `NETWORK_ERROR`: "Unable to connect. Please check your internet connection."
- `VALIDATION_ERROR`: "Please check your input and try again."
- `PAYMENT_FAILED`: "Payment failed. Please check your payment details and try again."
- `INSUFFICIENT_INVENTORY`: "Some items in your cart are no longer available."
- `UNAUTHORIZED`: "Please log in to continue."

## Storybook

View interactive examples of these components in Storybook:

```bash
npm run storybook --workspace @mawu/web
```

Navigate to:
- Components/ErrorState
- Components/ErrorBanner

## Accessibility

Both components follow accessibility best practices:

- Semantic HTML structure
- ARIA attributes for screen readers
- Keyboard navigation support
- Sufficient color contrast
- Clear visual hierarchy

## Design Tokens

The components use the following design tokens from the design system:

- Colors: `red-100`, `red-600`, `amber-50`, `amber-200`, `amber-600`, `amber-800`
- Spacing: Consistent with design system spacing scale
- Typography: Uses design system `Heading` and `Body` components
- Buttons: Uses design system `Button` component

## Testing

To test error scenarios:

1. Stop the backend API server to trigger network errors
2. Use the Storybook stories to view different error states
3. Test with different error codes and messages
4. Verify retry and dismiss functionality

## Future Enhancements

- Add animation for error state transitions
- Support for multiple error messages
- Toast notification integration
- Error logging to external service
- Customizable icons
