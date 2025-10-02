import { pgTable, text, serial, integer, timestamp, boolean, decimal, jsonb } from 'drizzle-orm/pg-core';

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('GHS'),
  tags: jsonb('tags').$type<string[]>().default([]),
  impactStatement: text('impact_statement'),
  description: text('description').notNull(),
  images: jsonb('images').$type<string[]>().default([]),
  availability: text('availability').notNull().default('in_stock'),
  inventory: integer('inventory').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  items: jsonb('items').$type<Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: string;
  }>>().notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('GHS'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  status: text('status').notNull().default('pending'),
  shippingAddress: jsonb('shipping_address').$type<{
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorEmail: text('donor_email').notNull(),
  donorName: text('donor_name').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  frequency: text('frequency').notNull().default('one-time'),
  message: text('message'),
  anonymous: boolean('anonymous').default(false),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;
