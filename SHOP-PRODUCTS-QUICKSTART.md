# Shop Products - Quick Start Guide

## Add Demo Products to Your Shop

### Step 1: Seed the Products
```bash
npm run seed:products
```

This will add 10 culturally-relevant products to your database.

### Step 2: Verify Products Were Added
```bash
npm run verify:products
```

This will list all products and their details.

### Step 3: Start Your Server
```bash
npm run dev:server
```

### Step 4: Access Products via API
- **All products**: `GET http://localhost:5000/api/products`
- **Single product**: `GET http://localhost:5000/api/products/mawu-foundation-tshirt`

## What Products Were Added?

1. **Mawu Foundation T-Shirt** - 45 GHS (with color & size options)
2. **Volta Region Tote Bag** - 35 GHS (eco-friendly)
3. **Kente Pattern Notebook** - 25 GHS (stationery)
4. **African Print Face Mask** - 15 GHS (4 pattern options)
5. **Handwoven Bolga Basket** - 85 GHS (artisan, 3 sizes)
6. **Mawu Foundation Water Bottle** - 40 GHS (3 colors)
7. **Adinkra Symbols Art Print** - 30 GHS (3 sizes)
8. **Volta Region Coffee Blend** - 55 GHS (organic)
9. **Ghanaian Folk Tales Book Set** - 65 GHS (children's books)
10. **Handmade Beaded Bracelet** - 20 GHS (4 color schemes)

All products include:
- ✅ Impact statements showing how purchases help
- ✅ Realistic inventory levels
- ✅ Product variations (colors, sizes, styles)
- ✅ Cultural relevance to Ghana and the Volta Region

## Product Categories
- Apparel
- Accessories
- Stationery
- Home & Living
- Art & Decor
- Food & Beverage
- Books & Media
- Jewelry

## Need Help?

- **Full documentation**: See `server/README-PRODUCTS.md`
- **Implementation details**: See `docs/shop-products-seeding.md`
- **Database management**: Run `npm run db:studio`

## Reseed Products

To clear and reseed products:
1. Delete existing products via Drizzle Studio (`npm run db:studio`)
2. Run `npm run seed:products` again

## Product Images

✅ All products now have professional images from Unsplash
- 2 images per product (20 total images)
- Hosted on Unsplash CDN (fast, free, reliable)
- Optimized at 800px width for web display

View all images: `npx tsx server/show-product-images.ts`

## Next Steps

1. Display products on your shop page (images included!)
2. Test the checkout flow with these products
3. Customize products via the admin panel
4. (Optional) Replace with custom images later

---

**Note**: All prices are in GHS (Ghanaian Cedi) to match the local context.
