import dotenv from 'dotenv';
import { storage } from './storage-factory';

dotenv.config();

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@mawufoundation.org';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await storage.findAdminByEmail(email);
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = await storage.createAdmin(email, password, name);
    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
  process.exit(0);
}

seedAdmin();
