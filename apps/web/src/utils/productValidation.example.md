# Product Validation Utilities

This module provides comprehensive validation for product data received from API responses. It ensures data integrity and type safety throughout the application.

## Features

- **Type Guards**: Runtime type checking for product data
- **Validation Functions**: Validate individual products or arrays of products
- **Error Handling**: Structured error reporting with field-level details
- **Graceful Degradation**: Skip invalid products in arrays rather than failing completely
- **Debug Logging**: Detailed error logs for troubleshooting

## Usage

### Validating a Single Product

```typescript
import { validateProduct, isProductValidationError, logValidationError } from '../utils/productValidation';

try {
  const rawProduct = await api.get('/api/products/my-product');
  const validatedProduct = validateProduct(rawProduct.product);
  
  // Use validatedProduct safely - all fields are guaranteed to be valid
  console.log(validatedProduct.name);
} catch (error) {
  if (isProductValidationError(error)) {
    logValidationError(error, 'ProductDetailPage');
    // Handle validation error - use fallback data
  }
}
```

### Validating Multiple Products

```typescript
import { validateProducts } from '../utils/productValidation';

const rawProducts = await api.get('/api/products');

// validateProducts will skip invalid products and return only valid ones
const validatedProducts = validateProducts(rawProducts.products);

// If some products failed validation, warnings will be logged automatically
console.log(`Loaded ${validatedProducts.length} valid products`);
```

### Type Guards

```typescript
import { isValidAvailability, isValidVariationType } from '../utils/productValidation';

// Check if a value is a valid availability status
if (isValidAvailability(product.availability)) {
  // TypeScript knows this is 'in_stock' | 'low_stock' | 'backorder'
}

// Check if a value is a valid variation type
if (isValidVariationType(variation.type)) {
  // TypeScript knows this is 'color' | 'size' | 'style'
}
```

### Custom Error Handling

```typescript
import { ProductValidationError, isProductValidationError } from '../utils/productValidation';

try {
  const product = validateProduct(rawData);
} catch (error) {
  if (isProductValidationError(error)) {
    console.error('Validation failed:', {
      message: error.message,
      field: error.field,      // Which field failed validation
      value: error.value,      // The invalid value
    });
  }
}
```

## Validation Rules

### Required Fields

- `id`: string or number (converted to string)
- `slug`: non-empty string
- `name`: non-empty string
- `price`: non-negative number
- `inventory`: non-negative number

### Optional Fields with Defaults

- `category`: defaults to empty string
- `currency`: defaults to 'GHS'
- `tags`: defaults to empty array
- `images`: defaults to empty array
- `availability`: defaults to 'in_stock'
- `impactStatement`: defaults to empty string
- `description`: defaults to empty string
- `variations`: optional, validated if present

### Variation Validation

Each variation must have:
- `type`: one of 'color', 'size', or 'style'
- `name`: non-empty string
- `options`: non-empty array of variation options

Each variation option must have:
- `value`: non-empty string
- `label`: non-empty string
- `priceModifier`: optional number
- `inventory`: optional non-negative number
- `images`: optional array of strings

## Error Types

### ProductValidationError

Custom error class that extends `Error` with additional context:

```typescript
class ProductValidationError extends Error {
  field?: string;    // The field that failed validation
  value?: unknown;   // The invalid value
}
```

## Integration with Hooks

The validation utilities are automatically integrated into the data fetching hooks:

- `useProducts`: Validates all products from the API, skips invalid ones
- `useProduct`: Validates individual product, falls back to static data on error

Both hooks will:
1. Fetch data from API
2. Validate the response
3. Log any validation errors
4. Fall back to static data if validation fails
5. Cache only validated data

## Best Practices

1. **Always validate API responses**: Never trust external data
2. **Use type guards**: Leverage TypeScript's type narrowing
3. **Log validation errors**: Help debug issues in production
4. **Provide fallbacks**: Ensure the app works even with invalid data
5. **Test validation**: Write tests for edge cases

## Testing

The validation utilities include comprehensive unit tests. Run them with:

```bash
npx vitest run productValidation.test.ts
```

Tests cover:
- Valid data scenarios
- Invalid data scenarios
- Edge cases (empty arrays, null values, etc.)
- Type coercion (numeric IDs to strings)
- Optional field handling
- Nested validation (variations and options)
