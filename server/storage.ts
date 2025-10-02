import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, desc } from 'drizzle-orm';
import * as schema from '../shared/schema';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export const storage = {
  async createAdmin(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [admin] = await db.insert(schema.admins).values({
      email,
      password: hashedPassword,
      name,
    }).returning();
    return admin;
  },

  async findAdminByEmail(email: string) {
    const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.email, email)).limit(1);
    return admin;
  },

  async verifyAdminPassword(admin: schema.Admin, password: string) {
    return bcrypt.compare(password, admin.password);
  },

  async getAllProducts() {
    return db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
  },

  async getProductById(id: number) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
    return product;
  },

  async getProductBySlug(slug: string) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1);
    return product;
  },

  async createProduct(data: schema.NewProduct) {
    const [product] = await db.insert(schema.products).values(data).returning();
    return product;
  },

  async updateProduct(id: number, data: Partial<schema.NewProduct>) {
    const [product] = await db.update(schema.products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return product;
  },

  async deleteProduct(id: number) {
    await db.delete(schema.products).where(eq(schema.products.id, id));
  },

  async createOrder(data: schema.NewOrder) {
    const [order] = await db.insert(schema.orders).values(data).returning();
    return order;
  },

  async updateOrderStatus(id: number, status: string, stripePaymentIntentId?: string) {
    const updateData: any = { status, updatedAt: new Date() };
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    const [order] = await db.update(schema.orders)
      .set(updateData)
      .where(eq(schema.orders.id, id))
      .returning();
    return order;
  },

  async getAllOrders() {
    return db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  },

  async getOrderById(id: number) {
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    return order;
  },

  async createDonation(data: schema.NewDonation) {
    const [donation] = await db.insert(schema.donations).values(data).returning();
    return donation;
  },

  async updateDonationStatus(id: number, status: string, stripePaymentIntentId?: string) {
    const updateData: any = { status };
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    const [donation] = await db.update(schema.donations)
      .set(updateData)
      .where(eq(schema.donations.id, id))
      .returning();
    return donation;
  },

  async getAllDonations() {
    return db.select().from(schema.donations).orderBy(desc(schema.donations.createdAt));
  },

  async getDonationById(id: number) {
    const [donation] = await db.select().from(schema.donations).where(eq(schema.donations.id, id)).limit(1);
    return donation;
  },
};
