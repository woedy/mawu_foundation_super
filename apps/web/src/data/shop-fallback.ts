import type { ShopCatalogPayload } from '../types/shop';

export const fallbackShopCatalog: ShopCatalogPayload = {
  hero: {
    title: 'Wear the movement. Fund the mission.',
    description:
      'Every purchase pours back into holistic community programs across Africa while celebrating arts, culture, and the spirit of the Volta Region.'
  },
  currency: 'GHS',
  categories: ['Apparel', 'Accessories', 'Art & Culture', 'Stationery'],
  featuredProductSlugs: ['mawu-kente-heritage-tee', 'volta-water-bottle'],
  products: [
    {
      id: 'mawu-kente-heritage-tee',
      slug: 'mawu-kente-heritage-tee',
      name: 'Mawu Kente Heritage Tee',
      category: 'Apparel',
      price: 185,
      currency: 'GHS',
      tags: ['Organic Cotton', 'Unisex Fit'],
      impactStatement: 'Funds three art therapy circles for girls in the Volta Region.',
      description:
        'A soft organic cotton tee featuring a hand-illustrated Kente-inspired sunburst that honours ancestral craft while backing our creative learning labs.',
      images: [
        'https://images.unsplash.com/photo-1660695828403-b42e117e0b4f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
      ],
      availability: 'in_stock',
      inventory: 64,
      variations: [
        {
          type: 'color',
          name: 'Color',
          options: [
            { value: 'natural', label: 'Natural Beige', inventory: 20 },
            { value: 'indigo', label: 'Indigo Blue', inventory: 24 },
            { value: 'terracotta', label: 'Terracotta', inventory: 20 }
          ]
        },
        {
          type: 'size',
          name: 'Size',
          options: [
            { value: 'xs', label: 'XS', inventory: 10 },
            { value: 's', label: 'S', inventory: 15 },
            { value: 'm', label: 'M', inventory: 20 },
            { value: 'l', label: 'L', inventory: 12 },
            { value: 'xl', label: 'XL', inventory: 7 }
          ]
        }
      ]
    },
    {
      id: 'volta-horizon-hoodie',
      slug: 'volta-horizon-hoodie',
      name: 'Volta Horizon Hoodie',
      category: 'Apparel',
      price: 320,
      currency: 'GHS',
      tags: ['Limited Edition', 'Fair Trade'],
      impactStatement: 'Supports mobile clinic fuel for two community health outreaches.',
      description:
        'Cozy fleece hoodie dyed in riverbank indigo gradients, featuring embroidery crafted with Volta cooperatives and a hidden pocket for field journals.',
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=900&q=80'
      ],
      availability: 'low_stock',
      inventory: 18,
      variations: [
        {
          type: 'color',
          name: 'Color',
          options: [
            { value: 'indigo-gradient', label: 'Indigo Gradient', inventory: 10 },
            { value: 'sunset-fade', label: 'Sunset Fade', inventory: 8 }
          ]
        },
        {
          type: 'size',
          name: 'Size',
          options: [
            { value: 's', label: 'S', inventory: 4 },
            { value: 'm', label: 'M', inventory: 6 },
            { value: 'l', label: 'L', inventory: 5 },
            { value: 'xl', label: 'XL', inventory: 3 }
          ]
        }
      ]
    },
    {
      id: 'volta-water-bottle',
      slug: 'volta-water-bottle',
      name: 'Volta Flow Water Bottle',
      category: 'Accessories',
      price: 145,
      currency: 'GHS',
      tags: ['BPA Free', 'Keeps Cool 24hrs'],
      impactStatement: 'Delivers twelve litres of clean water via our borehole programme.',
      description:
        'Insulated stainless steel bottle wrapped with wave motifs by Ewe illustrators; keeps water cool on field days and reminds you of the communities you hydrate.',
      images: [
        'https://images.unsplash.com/photo-1526402466350-7a2010e6e33f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80'
      ],
      availability: 'in_stock',
      inventory: 120
    },
    {
      id: 'mawu-arts-print-series',
      slug: 'mawu-arts-print-series',
      name: 'Spirit of Mawu Print Series',
      category: 'Art & Culture',
      price: 260,
      currency: 'GHS',
      tags: ['Set of 3', 'Signed'],
      impactStatement: 'Funds one month of storytelling residencies with local artists.',
      description:
        'A trio of A3 risograph prints celebrating the elements—earth, water, and spirit—produced with archival inks and signed by our artist collective.',
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80'
      ],
      availability: 'backorder',
      inventory: 40
    },
    {
      id: 'community-weave-tote',
      slug: 'community-weave-tote',
      name: 'Community Weave Tote',
      category: 'Accessories',
      price: 95,
      currency: 'GHS',
      tags: ['Handwoven', '100% Local'],
      impactStatement: 'Provides entrepreneurship coaching for two women-led cooperatives.',
      description:
        'Durable tote woven with reclaimed fibres on traditional looms, finished with leather handles sourced from regenerative farms in northern Ghana.',
      images: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
      ],
      availability: 'in_stock',
      inventory: 75
    },
    {
      id: 'impact-journal-set',
      slug: 'impact-journal-set',
      name: 'Impact Journey Journal Set',
      category: 'Stationery',
      price: 110,
      currency: 'GHS',
      tags: ['Recycled Paper', 'Set of 2'],
      impactStatement: 'Covers literacy kits for ten learners in after-school clubs.',
      description:
        'Pair of lay-flat journals with tactile covers inspired by clay murals from our community hubs, perfect for capturing dreams and impact ideas.',
      images: [
        'https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=900&q=80'
      ],
      availability: 'in_stock',
      inventory: 150
    }
  ],
  paymentMethods: [
    {
      id: 'stripe',
      label: 'Stripe (Cards, Apple Pay, Google Pay)',
      status: 'active',
      description: 'Pay securely with major cards and digital wallets through our Stripe integration.'
    },
    {
      id: 'mobile-money',
      label: 'Mobile Money',
      status: 'coming_soon',
      description: 'Support for MTN MoMo and other wallets launches soon. Join the waitlist at checkout.'
    },
    {
      id: 'bank-transfer',
      label: 'Bank Transfer',
      status: 'coming_soon',
      description: 'We are setting up dedicated NGO accounts for direct transfers across the continent.'
    },
    {
      id: 'paypal',
      label: 'PayPal',
      status: 'coming_soon',
      description: 'International supporters will soon be able to contribute via PayPal.'
    },
    {
      id: 'crypto',
      label: 'Crypto & Web3',
      status: 'coming_soon',
      description: 'We are designing a responsible crypto-giving pathway with audit-friendly partners.'
    }
  ],
  shippingRegions: [
    'Ghana – Volta Region Pickup',
    'Ghana – Nationwide Courier',
    'West Africa – Regional Shipping',
    'International – Custom Quote'
  ],
  lastUpdated: '2024-04-05T00:00:00.000Z'
};
