import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq, desc } from 'drizzle-orm';
import * as schema from '../shared/schema';
import bcrypt from 'bcryptjs';

const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });

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

  deserializeProduct(product: any) {
    if (!product) return product;
    
    return {
      ...product,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      variations: typeof product.variations === 'string' ? JSON.parse(product.variations) : product.variations,
    };
  },

  async getAllProducts() {
    const products = await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
    return products.map(p => this.deserializeProduct(p));
  },

  async getProductById(id: number) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
    return this.deserializeProduct(product);
  },

  async getProductBySlug(slug: string) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.slug, slug)).limit(1);
    return this.deserializeProduct(product);
  },

  serializeProductData(data: any) {
    const serialized: any = { ...data };
    
    // Serialize JSON fields for SQLite storage
    if (data.tags !== undefined) {
      serialized.tags = typeof data.tags === 'string' ? data.tags : JSON.stringify(data.tags || []);
    }
    if (data.images !== undefined) {
      serialized.images = typeof data.images === 'string' ? data.images : JSON.stringify(data.images || []);
    }
    if (data.variations !== undefined) {
      serialized.variations = typeof data.variations === 'string' ? data.variations : JSON.stringify(data.variations || []);
    }
    
    return serialized;
  },

  async createProduct(data: schema.NewProduct) {
    // Validate variations if provided
    if (data.variations && Array.isArray(data.variations)) {
      this.validateProductVariations(data.variations);
    }
    
    const serializedData = this.serializeProductData(data);
    const [product] = await db.insert(schema.products).values(serializedData).returning();
    return this.deserializeProduct(product);
  },

  async updateProduct(id: number, data: Partial<schema.NewProduct>) {
    // Validate variations if provided
    if (data.variations && Array.isArray(data.variations)) {
      this.validateProductVariations(data.variations);
    }
    
    const serializedData = this.serializeProductData(data);
    const [product] = await db.update(schema.products)
      .set({ ...serializedData, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return this.deserializeProduct(product);
  },

  validateProductVariations(variations: schema.ProductVariation[]) {
    for (const variation of variations) {
      // Validate variation type
      if (!['color', 'size', 'style'].includes(variation.type)) {
        throw new Error(`Invalid variation type: ${variation.type}. Must be 'color', 'size', or 'style'.`);
      }
      
      // Validate variation has a name
      if (!variation.name || typeof variation.name !== 'string') {
        throw new Error('Variation must have a valid name.');
      }
      
      // Validate options array
      if (!Array.isArray(variation.options) || variation.options.length === 0) {
        throw new Error('Variation must have at least one option.');
      }
      
      // Validate each option
      for (const option of variation.options) {
        if (!option.value || typeof option.value !== 'string') {
          throw new Error('Variation option must have a valid value.');
        }
        if (!option.label || typeof option.label !== 'string') {
          throw new Error('Variation option must have a valid label.');
        }
        if (option.priceModifier !== undefined && typeof option.priceModifier !== 'number') {
          throw new Error('Variation option priceModifier must be a number.');
        }
        if (option.inventory !== undefined && (typeof option.inventory !== 'number' || option.inventory < 0)) {
          throw new Error('Variation option inventory must be a non-negative number.');
        }
        if (option.images !== undefined && !Array.isArray(option.images)) {
          throw new Error('Variation option images must be an array.');
        }
      }
    }
  },

  async deleteProduct(id: number) {
    await db.delete(schema.products).where(eq(schema.products.id, id));
  },

  async validateOrderItems(items: schema.OrderItem[]) {
    for (const item of items) {
      // Validate product exists
      const product = await this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found.`);
      }
      
      // Validate selected variations if any
      if (item.selectedVariations && Object.keys(item.selectedVariations).length > 0) {
        if (!product.variations || product.variations.length === 0) {
          throw new Error(`Product ${product.name} does not have variations.`);
        }
        
        // Check each selected variation
        for (const [variationType, selectedValue] of Object.entries(item.selectedVariations)) {
          const variation = product.variations.find(v => v.type === variationType);
          if (!variation) {
            throw new Error(`Product ${product.name} does not have ${variationType} variation.`);
          }
          
          const option = variation.options.find(o => o.value === selectedValue);
          if (!option) {
            throw new Error(`Invalid ${variationType} option '${selectedValue}' for product ${product.name}.`);
          }
          
          // Check inventory for this specific variation option
          if (option.inventory !== undefined && option.inventory < item.quantity) {
            throw new Error(`Insufficient inventory for ${product.name} (${variationType}: ${selectedValue}). Available: ${option.inventory}, Requested: ${item.quantity}`);
          }
        }
      }
      
      // Validate general inventory if no variation-specific inventory
      if (!item.selectedVariations || Object.keys(item.selectedVariations).length === 0) {
        if (product.inventory < item.quantity) {
          throw new Error(`Insufficient inventory for ${product.name}. Available: ${product.inventory}, Requested: ${item.quantity}`);
        }
      }
    }
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
