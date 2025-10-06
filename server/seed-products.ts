#!/usr/bin/env tsx
/**
 * Seed script to populate the database with demo shop products
 * Products are themed around the Mawu Foundation's mission in Ghana's Volta Region
 */

import { storage } from './storage-factory';
import type { NewProduct } from '../shared/schema';

const demoProducts: NewProduct[] = [
  {
    slug: 'mawu-foundation-tshirt',
    name: 'Mawu Foundation T-Shirt',
    category: 'Apparel',
    price: 45.00,
    currency: 'GHS',
    tags: ['apparel', 'clothing', 'merchandise', 'cotton'],
    impactStatement: 'Every purchase supports education programs in the Volta Region',
    description: 'Premium cotton t-shirt featuring the Mawu Foundation logo. Comfortable, durable, and perfect for showing your support for development work in Ghana. Made with locally-sourced materials to support the community.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 100,
    variations: [
      {
        type: 'color',
        name: 'Color',
        options: [
          { value: 'white', label: 'White', inventory: 40 },
          { value: 'blue', label: 'Blue', inventory: 35 },
          { value: 'green', label: 'Green', inventory: 25 }
        ]
      },
      {
        type: 'size',
        name: 'Size',
        options: [
          { value: 'small', label: 'Small', inventory: 20 },
          { value: 'medium', label: 'Medium', inventory: 35 },
          { value: 'large', label: 'Large', inventory: 30 },
          { value: 'xl', label: 'Extra Large', inventory: 15 }
        ]
      }
    ]
  },
  {
    slug: 'volta-region-tote-bag',
    name: 'Volta Region Tote Bag',
    category: 'Accessories',
    price: 35.00,
    currency: 'GHS',
    tags: ['accessories', 'bag', 'eco-friendly', 'reusable'],
    impactStatement: 'Proceeds fund clean water initiatives in rural communities',
    description: 'Eco-friendly canvas tote bag featuring beautiful artwork inspired by the Volta Region. Spacious, durable, and perfect for daily use. Each bag is handcrafted by local artisans, supporting economic empowerment programs.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 75,
    variations: [
      {
        type: 'color',
        name: 'Color',
        options: [
          { value: 'natural', label: 'Natural Canvas', inventory: 45 },
          { value: 'indigo', label: 'Indigo Blue', inventory: 30 }
        ]
      }
    ]
  },
  {
    slug: 'kente-pattern-notebook',
    name: 'Kente Pattern Notebook',
    category: 'Stationery',
    price: 25.00,
    currency: 'GHS',
    tags: ['stationery', 'notebook', 'journal', 'kente'],
    impactStatement: 'Supports literacy programs and school supplies for children',
    description: 'Beautiful hardcover notebook featuring traditional Kente cloth patterns. 200 lined pages perfect for journaling, note-taking, or sketching. Celebrates Ghanaian heritage while supporting educational initiatives.',
    images: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 120,
    variations: []
  },
  {
    slug: 'african-print-face-mask',
    name: 'African Print Face Mask',
    category: 'Accessories',
    price: 15.00,
    currency: 'GHS',
    tags: ['accessories', 'mask', 'health', 'african-print'],
    impactStatement: 'Funds health and sanitation programs in the Volta Region',
    description: 'Reusable cotton face mask with vibrant African print designs. Comfortable, washable, and features adjustable ear loops. Made by local seamstresses as part of our economic empowerment program.',
    images: [
      'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=800&q=80',
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 200,
    variations: [
      {
        type: 'style',
        name: 'Pattern',
        options: [
          { value: 'ankara-red', label: 'Ankara Red', inventory: 50 },
          { value: 'ankara-blue', label: 'Ankara Blue', inventory: 50 },
          { value: 'kente-gold', label: 'Kente Gold', inventory: 50 },
          { value: 'adinkra-black', label: 'Adinkra Black', inventory: 50 }
        ]
      }
    ]
  },
  {
    slug: 'handwoven-basket',
    name: 'Handwoven Bolga Basket',
    category: 'Home & Living',
    price: 85.00,
    currency: 'GHS',
    tags: ['home', 'basket', 'handmade', 'artisan'],
    impactStatement: 'Directly supports women artisans and their families',
    description: 'Authentic handwoven basket from the Bolgatanga region of Ghana. Each basket is unique, crafted by skilled women artisans using traditional techniques passed down through generations. Perfect for storage, shopping, or as decorative art.',
    images: [
      'https://images.unsplash.com/photo-1594068797082-69da5fc8c3e8?w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 30,
    variations: [
      {
        type: 'size',
        name: 'Size',
        options: [
          { value: 'small', label: 'Small (10")', priceModifier: -20, inventory: 12 },
          { value: 'medium', label: 'Medium (14")', priceModifier: 0, inventory: 10 },
          { value: 'large', label: 'Large (18")', priceModifier: 25, inventory: 8 }
        ]
      }
    ]
  },
  {
    slug: 'mawu-water-bottle',
    name: 'Mawu Foundation Water Bottle',
    category: 'Accessories',
    price: 40.00,
    currency: 'GHS',
    tags: ['accessories', 'water-bottle', 'eco-friendly', 'reusable'],
    impactStatement: 'Every bottle sold provides clean water access for one family',
    description: 'Stainless steel insulated water bottle with Mawu Foundation branding. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly. A practical way to support our water and sanitation initiatives.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 90,
    variations: [
      {
        type: 'color',
        name: 'Color',
        options: [
          { value: 'silver', label: 'Silver', inventory: 30 },
          { value: 'blue', label: 'Ocean Blue', inventory: 30 },
          { value: 'green', label: 'Forest Green', inventory: 30 }
        ]
      }
    ]
  },
  {
    slug: 'adinkra-symbol-poster',
    name: 'Adinkra Symbols Art Print',
    category: 'Art & Decor',
    price: 30.00,
    currency: 'GHS',
    tags: ['art', 'poster', 'adinkra', 'cultural'],
    impactStatement: 'Supports cultural preservation and arts education programs',
    description: 'High-quality art print featuring traditional Adinkra symbols with their meanings. Printed on premium paper, perfect for framing. Celebrates Ghanaian wisdom and cultural heritage while supporting arts education in local schools.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
      'https://images.unsplash.com/photo-1582561833985-d8e8e6c2b9e0?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 60,
    variations: [
      {
        type: 'size',
        name: 'Size',
        options: [
          { value: '12x16', label: '12" x 16"', priceModifier: 0, inventory: 30 },
          { value: '18x24', label: '18" x 24"', priceModifier: 15, inventory: 20 },
          { value: '24x36', label: '24" x 36"', priceModifier: 30, inventory: 10 }
        ]
      }
    ]
  },
  {
    slug: 'ghana-coffee-blend',
    name: 'Volta Region Coffee Blend',
    category: 'Food & Beverage',
    price: 55.00,
    currency: 'GHS',
    tags: ['coffee', 'food', 'beverage', 'organic'],
    impactStatement: 'Supports local coffee farmers and agricultural development',
    description: 'Premium organic coffee beans sourced from small-scale farmers in the Volta Region. Medium roast with notes of chocolate and citrus. Each purchase directly supports our agricultural empowerment programs and fair trade practices.',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 80,
    variations: [
      {
        type: 'style',
        name: 'Grind',
        options: [
          { value: 'whole-bean', label: 'Whole Bean', inventory: 40 },
          { value: 'ground', label: 'Ground', inventory: 40 }
        ]
      }
    ]
  },
  {
    slug: 'childrens-book-set',
    name: 'Ghanaian Folk Tales Book Set',
    category: 'Books & Media',
    price: 65.00,
    currency: 'GHS',
    tags: ['books', 'children', 'education', 'stories'],
    impactStatement: 'Funds literacy programs and school libraries',
    description: 'Collection of three beautifully illustrated children\'s books featuring traditional Ghanaian folk tales. Stories include Anansi the Spider and other beloved characters. Perfect for children ages 4-10. Proceeds support literacy programs and school libraries in the Volta Region.',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 50,
    variations: []
  },
  {
    slug: 'beaded-bracelet',
    name: 'Handmade Beaded Bracelet',
    category: 'Jewelry',
    price: 20.00,
    currency: 'GHS',
    tags: ['jewelry', 'bracelet', 'handmade', 'beaded'],
    impactStatement: 'Empowers women artisans through fair trade practices',
    description: 'Beautiful handcrafted beaded bracelet made by women artisans in the Volta Region. Each bracelet features traditional patterns and colors. Adjustable size fits most wrists. Every purchase provides sustainable income for artisan families.',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
    ],
    availability: 'in_stock',
    inventory: 150,
    variations: [
      {
        type: 'color',
        name: 'Color Scheme',
        options: [
          { value: 'rainbow', label: 'Rainbow', inventory: 40 },
          { value: 'earth-tones', label: 'Earth Tones', inventory: 35 },
          { value: 'ocean-blue', label: 'Ocean Blue', inventory: 35 },
          { value: 'sunset', label: 'Sunset', inventory: 40 }
        ]
      }
    ]
  }
];

async function seedProducts() {
  console.log('Starting product seeding...');
  
  try {
    // Check if products already exist
    const existingProducts = await storage.getAllProducts();
    
    if (existingProducts.length > 0) {
      console.log(`Found ${existingProducts.length} existing products.`);
      console.log('Do you want to:');
      console.log('1. Skip seeding (products already exist)');
      console.log('2. Add new products anyway (may create duplicates)');
      console.log('\nSkipping seeding to avoid duplicates. Delete existing products first if you want to reseed.');
      return;
    }
    
    console.log('No existing products found. Creating demo products...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const productData of demoProducts) {
      try {
        const product = await storage.createProduct(productData);
        console.log(`✓ Created: ${product.name} (${product.slug})`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to create ${productData.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n=== Seeding Complete ===`);
    console.log(`Successfully created: ${successCount} products`);
    console.log(`Failed: ${errorCount} products`);
    console.log(`Total products in database: ${await storage.getAllProducts().then(p => p.length)}`);
    
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this script is executed directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('\nProduct seeding script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Product seeding script failed:', error);
      process.exit(1);
    });
}

export { seedProducts, demoProducts };
