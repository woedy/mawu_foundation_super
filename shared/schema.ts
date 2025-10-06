import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Product variation type definitions
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

export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  currency: text('currency').notNull().default('GHS'),
  tags: text('tags').$type<string[]>().$defaultFn(() => []),
  impactStatement: text('impact_statement'),
  description: text('description').notNull(),
  images: text('images').$type<string[]>().$defaultFn(() => []),
  availability: text('availability').notNull().default('in_stock'),
  inventory: integer('inventory').notNull().default(0),
  variations: text('variations').$type<ProductVariation[]>().$defaultFn(() => []),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

// Order item type definition
export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: string;
  selectedVariations?: Record<string, string>;
}

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  items: text('items').$type<OrderItem[]>().notNull(),
  totalAmount: real('total_amount').notNull(),
  currency: text('currency').notNull().default('GHS'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  status: text('status').notNull().default('pending'),
  shippingAddress: text('shipping_address').$type<{
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  }>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export const donations = sqliteTable('donations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  donorEmail: text('donor_email').notNull(),
  donorName: text('donor_name').notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  frequency: text('frequency').notNull().default('one-time'),
  message: text('message'),
  anonymous: integer('anonymous', { mode: 'boolean' }).default(false),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
