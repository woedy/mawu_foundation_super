export type ShopAvailability = 'in_stock' | 'low_stock' | 'backorder';

export interface VariationOption {
  value: string;
  label: string;
  priceModifier?: number;
  inventory?: number;
  images?: string[];
}

export interface ProductVariation {
  type: 'color' | 'size' | 'style';
  name: string;
  options: VariationOption[];
}

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  tags: string[];
  impactStatement: string;
  description: string;
  images: string[];
  availability: ShopAvailability;
  inventory: number;
  variations?: ProductVariation[];
}


export interface ShopPaymentMethod {
  id: 'stripe' | 'mobile-money' | 'bank-transfer' | 'paypal' | 'crypto';
  label: string;
  status: 'active' | 'coming_soon';
  description: string;
}

export interface ShopCatalogPayload {
  hero: {
    title: string;
    description: string;
  };
  currency: string;
  categories: string[];
  featuredProductSlugs: string[];
  products: ShopProduct[];
  paymentMethods: ShopPaymentMethod[];
  shippingRegions: string[];
  lastUpdated: string;
}
