import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { admins } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@mawufoundation.org';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Admin User';

    const [existingAdmin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await client.end();
      process.exit(0);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [admin] = await db.insert(admins).values({
      email,
      password: hashedPassword,
      name,
    }).returning();
    
    console.log('Admin user created successfully:', admin.email);
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
