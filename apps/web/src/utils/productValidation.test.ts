import { describe, it, expect } from 'vitest';
import {
  validateProduct,
  validateProducts,
  validateProductVariation,
  validateVariationOption,
  isValidAvailability,
  isValidVariationType,
  ProductValidationError,
  isProductValidationError,
} from './productValidation';

describe('productValidation', () => {
  describe('isValidAvailability', () => {
    it('should return true for valid availability values', () => {
      expect(isValidAvailability('in_stock')).toBe(true);
      expect(isValidAvailability('low_stock')).toBe(true);
      expect(isValidAvailability('backorder')).toBe(true);
    });

    it('should return false for invalid availability values', () => {
      expect(isValidAvailability('invalid')).toBe(false);
      expect(isValidAvailability('')).toBe(false);
      expect(isValidAvailability(null)).toBe(false);
      expect(isValidAvailability(undefined)).toBe(false);
    });
  });

  describe('isValidVariationType', () => {
    it('should return true for valid variation types', () => {
      expect(isValidVariationType('color')).toBe(true);
      expect(isValidVariationType('size')).toBe(true);
      expect(isValidVariationType('style')).toBe(true);
    });

    it('should return false for invalid variation types', () => {
      expect(isValidVariationType('invalid')).toBe(false);
      expect(isValidVariationType('')).toBe(false);
      expect(isValidVariationType(null)).toBe(false);
    });
  });

  describe('validateVariationOption', () => {
    it('should validate a valid variation option', () => {
      const option = {
        value: 'red',
        label: 'Red',
      };

      const result = validateVariationOption(option);
      expect(result).toEqual(option);
    });

    it('should validate a variation option with optional fields', () => {
      const option = {
        value: 'large',
        label: 'Large',
        priceModifier: 5,
        inventory: 10,
        images: ['image1.jpg', 'image2.jpg'],
      };

      const result = validateVariationOption(option);
      expect(result).toEqual(option);
    });

    it('should throw error for missing required fields', () => {
      expect(() => validateVariationOption({ value: 'red' })).toThrow(ProductValidationError);
      expect(() => validateVariationOption({ label: 'Red' })).toThrow(ProductValidationError);
      expect(() => validateVariationOption({})).toThrow(ProductValidationError);
    });

    it('should throw error for invalid types', () => {
      expect(() => validateVariationOption(null)).toThrow(ProductValidationError);
      expect(() => validateVariationOption('string')).toThrow(ProductValidationError);
      expect(() => validateVariationOption({ value: 123, label: 'Test' })).toThrow(ProductValidationError);
    });
  });

  describe('validateProductVariation', () => {
    it('should validate a valid product variation', () => {
      const variation = {
        type: 'color' as const,
        name: 'Color',
        options: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
        ],
      };

      const result = validateProductVariation(variation);
      expect(result).toEqual(variation);
    });

    it('should throw error for invalid variation type', () => {
      const variation = {
        type: 'invalid',
        name: 'Test',
        options: [{ value: 'test', label: 'Test' }],
      };

      expect(() => validateProductVariation(variation)).toThrow(ProductValidationError);
    });

    it('should throw error for empty options array', () => {
      const variation = {
        type: 'color' as const,
        name: 'Color',
        options: [],
      };

      expect(() => validateProductVariation(variation)).toThrow(ProductValidationError);
    });
  });

  describe('validateProduct', () => {
    const validProduct = {
      id: '1',
      slug: 'test-product',
      name: 'Test Product',
      category: 'Test Category',
      price: 100,
      currency: 'GHS',
      tags: ['tag1', 'tag2'],
      impactStatement: 'Test impact',
      description: 'Test description',
      images: ['image1.jpg', 'image2.jpg'],
      availability: 'in_stock' as const,
      inventory: 10,
    };

    it('should validate a valid product', () => {
      const result = validateProduct(validProduct);
      expect(result).toEqual(validProduct);
    });

    it('should validate a product with numeric id', () => {
      const product = { ...validProduct, id: 123 };
      const result = validateProduct(product);
      expect(result.id).toBe('123');
    });

    it('should handle missing optional fields', () => {
      const minimalProduct = {
        id: '1',
        slug: 'test',
        name: 'Test',
        price: 100,
        inventory: 10,
      };

      const result = validateProduct(minimalProduct);
      expect(result.category).toBe('');
      expect(result.currency).toBe('GHS');
      expect(result.tags).toEqual([]);
      expect(result.images).toEqual([]);
      expect(result.availability).toBe('in_stock');
    });

    it('should validate product with variations', () => {
      const productWithVariations = {
        ...validProduct,
        variations: [
          {
            type: 'color' as const,
            name: 'Color',
            options: [{ value: 'red', label: 'Red' }],
          },
        ],
      };

      const result = validateProduct(productWithVariations);
      expect(result.variations).toBeDefined();
      expect(result.variations?.length).toBe(1);
    });

    it('should throw error for missing required fields', () => {
      expect(() => validateProduct({})).toThrow(ProductValidationError);
      expect(() => validateProduct({ id: '1' })).toThrow(ProductValidationError);
      expect(() => validateProduct({ id: '1', slug: 'test' })).toThrow(ProductValidationError);
    });

    it('should throw error for invalid price', () => {
      const product = { ...validProduct, price: -10 };
      expect(() => validateProduct(product)).toThrow(ProductValidationError);
    });

    it('should throw error for invalid inventory', () => {
      const product = { ...validProduct, inventory: -5 };
      expect(() => validateProduct(product)).toThrow(ProductValidationError);
    });

    it('should throw error for invalid availability', () => {
      const product = { ...validProduct, availability: 'invalid' };
      expect(() => validateProduct(product)).toThrow(ProductValidationError);
    });

    it('should throw error for non-array images', () => {
      const product = { ...validProduct, images: 'not-an-array' };
      expect(() => validateProduct(product)).toThrow(ProductValidationError);
    });

    it('should throw error for non-string image items', () => {
      const product = { ...validProduct, images: [123, 456] };
      expect(() => validateProduct(product)).toThrow(ProductValidationError);
    });
  });

  describe('validateProducts', () => {
    const validProduct1 = {
      id: '1',
      slug: 'product-1',
      name: 'Product 1',
      price: 100,
      inventory: 10,
    };

    const validProduct2 = {
      id: '2',
      slug: 'product-2',
      name: 'Product 2',
      price: 200,
      inventory: 20,
    };

    it('should validate an array of valid products', () => {
      const products = [validProduct1, validProduct2];
      const result = validateProducts(products);
      expect(result).toHaveLength(2);
    });

    it('should skip invalid products and return valid ones', () => {
      const products = [
        validProduct1,
        { invalid: 'product' }, // Invalid product
        validProduct2,
      ];

      const result = validateProducts(products);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty array for all invalid products', () => {
      const products = [
        { invalid: 'product1' },
        { invalid: 'product2' },
      ];

      const result = validateProducts(products);
      expect(result).toHaveLength(0);
    });

    it('should throw error for non-array input', () => {
      expect(() => validateProducts('not-an-array')).toThrow(ProductValidationError);
      expect(() => validateProducts(null)).toThrow(ProductValidationError);
      expect(() => validateProducts({})).toThrow(ProductValidationError);
    });
  });

  describe('isProductValidationError', () => {
    it('should return true for ProductValidationError', () => {
      const error = new ProductValidationError('Test error');
      expect(isProductValidationError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = new Error('Test error');
      expect(isProductValidationError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isProductValidationError('string')).toBe(false);
      expect(isProductValidationError(null)).toBe(false);
      expect(isProductValidationError(undefined)).toBe(false);
    });
  });
});
