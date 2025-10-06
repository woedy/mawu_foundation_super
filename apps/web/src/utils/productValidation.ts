import type { ShopProduct, ShopAvailability, ProductVariation, VariationOption } from '../types/shop';

/**
 * Validation error class for product data validation failures
 */
export class ProductValidationError extends Error {
  constructor(message: string, public field?: string, public value?: unknown) {
    super(message);
    this.name = 'ProductValidationError';
  }
}

/**
 * Type guard to check if a value is a valid ShopAvailability
 */
export function isValidAvailability(value: unknown): value is ShopAvailability {
  return value === 'in_stock' || value === 'low_stock' || value === 'backorder';
}

/**
 * Type guard to check if a value is a valid variation type
 */
export function isValidVariationType(value: unknown): value is 'color' | 'size' | 'style' {
  return value === 'color' || value === 'size' || value === 'style';
}

/**
 * Validates a variation option object
 */
export function validateVariationOption(option: unknown): VariationOption {
  if (!option || typeof option !== 'object') {
    throw new ProductValidationError('Variation option must be an object', 'variationOption', option);
  }

  const opt = option as Record<string, unknown>;

  if (typeof opt.value !== 'string' || !opt.value) {
    throw new ProductValidationError('Variation option value must be a non-empty string', 'variationOption.value', opt.value);
  }

  if (typeof opt.label !== 'string' || !opt.label) {
    throw new ProductValidationError('Variation option label must be a non-empty string', 'variationOption.label', opt.label);
  }

  const validated: VariationOption = {
    value: opt.value,
    label: opt.label,
  };

  // Optional fields
  if (opt.priceModifier !== undefined) {
    if (typeof opt.priceModifier !== 'number' || isNaN(opt.priceModifier)) {
      throw new ProductValidationError('Variation option priceModifier must be a number', 'variationOption.priceModifier', opt.priceModifier);
    }
    validated.priceModifier = opt.priceModifier;
  }

  if (opt.inventory !== undefined) {
    if (typeof opt.inventory !== 'number' || isNaN(opt.inventory) || opt.inventory < 0) {
      throw new ProductValidationError('Variation option inventory must be a non-negative number', 'variationOption.inventory', opt.inventory);
    }
    validated.inventory = opt.inventory;
  }

  if (opt.images !== undefined) {
    if (!Array.isArray(opt.images)) {
      throw new ProductValidationError('Variation option images must be an array', 'variationOption.images', opt.images);
    }
    if (!opt.images.every((img) => typeof img === 'string')) {
      throw new ProductValidationError('Variation option images must be an array of strings', 'variationOption.images', opt.images);
    }
    validated.images = opt.images;
  }

  return validated;
}

/**
 * Validates a product variation object
 */
export function validateProductVariation(variation: unknown): ProductVariation {
  if (!variation || typeof variation !== 'object') {
    throw new ProductValidationError('Product variation must be an object', 'variation', variation);
  }

  const v = variation as Record<string, unknown>;

  if (!isValidVariationType(v.type)) {
    throw new ProductValidationError('Product variation type must be "color", "size", or "style"', 'variation.type', v.type);
  }

  if (typeof v.name !== 'string' || !v.name) {
    throw new ProductValidationError('Product variation name must be a non-empty string', 'variation.name', v.name);
  }

  if (!Array.isArray(v.options) || v.options.length === 0) {
    throw new ProductValidationError('Product variation options must be a non-empty array', 'variation.options', v.options);
  }

  const validatedOptions = v.options.map((opt, index) => {
    try {
      return validateVariationOption(opt);
    } catch (error) {
      if (error instanceof ProductValidationError) {
        throw new ProductValidationError(
          `Invalid variation option at index ${index}: ${error.message}`,
          `variation.options[${index}]`,
          opt
        );
      }
      throw error;
    }
  });

  return {
    type: v.type,
    name: v.name,
    options: validatedOptions,
  };
}

/**
 * Validates and sanitizes a product object from API response
 * @param data - Raw data from API response
 * @returns Validated ShopProduct object
 * @throws ProductValidationError if validation fails
 */
export function validateProduct(data: unknown): ShopProduct {
  if (!data || typeof data !== 'object') {
    throw new ProductValidationError('Product data must be an object', 'product', data);
  }

  const product = data as Record<string, unknown>;

  // Validate required string fields
  if (typeof product.id !== 'string' && typeof product.id !== 'number') {
    throw new ProductValidationError('Product id must be a string or number', 'id', product.id);
  }

  if (typeof product.slug !== 'string' || !product.slug) {
    throw new ProductValidationError('Product slug must be a non-empty string', 'slug', product.slug);
  }

  if (typeof product.name !== 'string' || !product.name) {
    throw new ProductValidationError('Product name must be a non-empty string', 'name', product.name);
  }

  // Validate price
  const price = Number(product.price);
  if (isNaN(price) || price < 0) {
    throw new ProductValidationError('Product price must be a non-negative number', 'price', product.price);
  }

  // Validate inventory
  const inventory = Number(product.inventory);
  if (isNaN(inventory) || inventory < 0) {
    throw new ProductValidationError('Product inventory must be a non-negative number', 'inventory', product.inventory);
  }

  // Validate availability
  const availability = product.availability || 'in_stock';
  if (!isValidAvailability(availability)) {
    throw new ProductValidationError(
      'Product availability must be "in_stock", "low_stock", or "backorder"',
      'availability',
      availability
    );
  }

  // Validate arrays
  if (product.images !== undefined && !Array.isArray(product.images)) {
    throw new ProductValidationError('Product images must be an array', 'images', product.images);
  }

  if (product.tags !== undefined && !Array.isArray(product.tags)) {
    throw new ProductValidationError('Product tags must be an array', 'tags', product.tags);
  }

  // Validate images array contains only strings
  const images = Array.isArray(product.images) ? product.images : [];
  if (!images.every((img) => typeof img === 'string')) {
    throw new ProductValidationError('Product images must be an array of strings', 'images', product.images);
  }

  // Validate tags array contains only strings
  const tags = Array.isArray(product.tags) ? product.tags : [];
  if (!tags.every((tag) => typeof tag === 'string')) {
    throw new ProductValidationError('Product tags must be an array of strings', 'tags', product.tags);
  }

  // Validate variations if present
  let variations: ProductVariation[] | undefined;
  if (product.variations !== undefined) {
    if (!Array.isArray(product.variations)) {
      throw new ProductValidationError('Product variations must be an array', 'variations', product.variations);
    }

    variations = product.variations.map((v, index) => {
      try {
        return validateProductVariation(v);
      } catch (error) {
        if (error instanceof ProductValidationError) {
          throw new ProductValidationError(
            `Invalid variation at index ${index}: ${error.message}`,
            `variations[${index}]`,
            v
          );
        }
        throw error;
      }
    });
  }

  // Return validated and sanitized product
  return {
    id: String(product.id),
    slug: String(product.slug),
    name: String(product.name),
    category: String(product.category || ''),
    price,
    currency: String(product.currency || 'GHS'),
    tags,
    impactStatement: String(product.impactStatement || ''),
    description: String(product.description || ''),
    images,
    availability,
    inventory,
    variations,
  };
}

/**
 * Validates an array of products from API response
 * @param data - Raw data from API response
 * @returns Array of validated ShopProduct objects
 */
export function validateProducts(data: unknown): ShopProduct[] {
  if (!Array.isArray(data)) {
    throw new ProductValidationError('Products data must be an array', 'products', data);
  }

  const validatedProducts: ShopProduct[] = [];
  const errors: Array<{ index: number; error: ProductValidationError }> = [];

  data.forEach((item, index) => {
    try {
      validatedProducts.push(validateProduct(item));
    } catch (error) {
      if (error instanceof ProductValidationError) {
        errors.push({ index, error });
        console.error(`[Product Validation] Failed to validate product at index ${index}:`, {
          error: error.message,
          field: error.field,
          value: error.value,
        });
      } else {
        throw error;
      }
    }
  });

  // Log summary if there were errors
  if (errors.length > 0) {
    console.warn(`[Product Validation] ${errors.length} of ${data.length} products failed validation and were skipped`);
  }

  return validatedProducts;
}

/**
 * Logs validation errors in a structured format for debugging
 */
export function logValidationError(error: ProductValidationError, context: string): void {
  console.error(`[Product Validation Error] ${context}:`, {
    message: error.message,
    field: error.field,
    value: error.value,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Type guard to check if an error is a ProductValidationError
 */
export function isProductValidationError(error: unknown): error is ProductValidationError {
  return error instanceof ProductValidationError;
}
