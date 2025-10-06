# Loading Skeleton Components

This directory contains skeleton loading components for the shop pages.

## Components

### ProductGridSkeleton
Displays a loading skeleton for the shop product grid. Shows 6 placeholder cards in a responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop).

**Usage:**
```tsx
import { ProductGridSkeleton } from '../components/skeletons';

// In your component
if (loading) {
  return <ProductGridSkeleton />;
}
```

**Features:**
- Matches the actual product card layout
- Includes animated pulse effect
- Shows placeholders for image, title, description, impact statement, price, and buttons
- Responsive grid layout

### ProductDetailSkeleton
Displays a loading skeleton for the product detail page. Shows a two-column layout with image gallery and product information placeholders.

**Usage:**
```tsx
import { ProductDetailSkeleton } from '../components/skeletons';

// In your component
if (loading) {
  return <ProductDetailSkeleton />;
}
```

**Features:**
- Matches the actual product detail layout
- Two-column responsive layout
- Image gallery with main image and thumbnails
- Product info section with all details
- Additional info section at bottom
- Animated pulse effect throughout

## Design Principles

1. **Match Real Layout**: Skeletons closely match the actual component layouts to prevent layout shift
2. **Pulse Animation**: Uses Tailwind's `animate-pulse` utility for smooth loading effect
3. **Semantic Structure**: Maintains proper spacing and hierarchy
4. **Accessibility**: Uses appropriate ARIA attributes where needed

## Styling

All skeletons use:
- `bg-ink-100` for light gray placeholder backgrounds
- `bg-brand-50` and `bg-brand-100` for branded sections
- `animate-pulse` for the loading animation
- Consistent spacing matching the actual components
