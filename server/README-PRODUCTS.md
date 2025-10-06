# Product Seeding Guide

## Overview
This guide explains how to populate your database with demo shop products for the Mawu Foundation platform.

## Demo Products
The seed script creates 10 culturally-relevant products that align with the Mawu Foundation's mission:

1. **Mawu Foundation T-Shirt** - Apparel with color and size variations
2. **Volta Region Tote Bag** - Eco-friendly bags with color options
3. **Kente Pattern Notebook** - Stationery celebrating Ghanaian heritage
4. **African Print Face Mask** - Health accessories with pattern variations
5. **Handwoven Bolga Basket** - Artisan home goods with size options
6. **Mawu Foundation Water Bottle** - Insulated bottles with color variations
7. **Adinkra Symbols Art Print** - Cultural art with size options
8. **Volta Region Coffee Blend** - Organic coffee with grind options
9. **Ghanaian Folk Tales Book Set** - Educational children's books
10. **Handmade Beaded Bracelet** - Jewelry with color scheme variations

## Running the Seed Script

### Using npm script (recommended)
```bash
npm run seed:products
```

### Using tsx directly
```bash
tsx server/seed-products.ts
```

## Features

### Product Variations
Many products include variations such as:
- **Colors**: Different color options for apparel and accessories
- **Sizes**: Size options for clothing, baskets, and art prints
- **Styles**: Pattern or grind options for masks and coffee

### Impact Statements
Each product includes an impact statement showing how purchases support the foundation's work:
- Education programs
- Clean water initiatives
- Health and sanitation
- Economic empowerment
- Cultural preservation

### Inventory Management
- Products have realistic inventory levels
- Variations track individual inventory counts
- Total inventory ranges from 30-200 units per product

## Currency
All products are priced in **GHS (Ghanaian Cedi)** to reflect the local context.

## Safety Features
The seed script includes safety checks:
- Won't create duplicates if products already exist
- Validates all product data before insertion
- Provides detailed success/error reporting

## Clearing Products
To reseed products, you'll need to delete existing products first. You can do this through:
1. Database management tools (Drizzle Studio: `npm run db:studio`)
2. Custom deletion script
3. Database reset (will clear all data)

## Customization
To modify the demo products, edit the `demoProducts` array in `server/seed-products.ts`.

## Product Images
Note: The seed script references placeholder image paths. You'll need to:
1. Add actual product images to your public/images/products directory
2. Update the image paths in the seed data
3. Or use a placeholder image service for demo purposes
