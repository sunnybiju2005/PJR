/* PJR Dynamic Categories & Expanded Product Catalog */

export const BRANDS = [
  { id: 'pjr-exclusive', name: 'PJR Exclusive' },
  { id: 'calvin-klein', name: 'Calvin Klein' },
  { id: 'ajio-luxe', name: 'AJIO Luxe' },
  { id: 'zara', name: 'Zara' },
  { id: 'nike', name: 'Nike' },
  { id: 'hm', name: 'H&M' },
  { id: 'uniqlo', name: 'Uniqlo' },
  { id: 'puma', name: 'Puma' }
];

export const CATEGORIES = [
  {
    id: 'men',
    name: 'Men',
    subtitle: 'Tailored Luxury & Modern Fit',
    image: 'assets/images/hero-men.png',
    count: '240+ Items'
  },
  {
    id: 'women',
    name: 'Women',
    subtitle: 'Haute Couture & Elegance',
    image: 'assets/images/hero-women.png',
    count: '310+ Items'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subtitle: 'High-End Watches, Leather & Eyewear',
    image: 'assets/images/hero-accessories.png',
    count: '150+ Items'
  }
];

export const MOCK_REVIEWS = [
  {
    user: 'Aarav Sharma',
    rating: 5,
    date: '2 days ago',
    comment: 'The quality of the Deep Navy blazer is incredible! Perfect fit right out of the box. PJR really delivers on its tagline!'
  },
  {
    user: 'Priya Verma',
    rating: 5,
    date: '1 week ago',
    comment: 'Exquisite silk finish on the dress. Fast 2-day delivery and immaculate luxury packaging. Highly recommended!'
  }
];

export const MEN_SUBCATEGORIES = [
  { id: 't-shirts', name: 'T-Shirts', group: 'Apparel' },
  { id: 'shirts', name: 'Shirts', group: 'Apparel' },
  { id: 'jeans', name: 'Jeans', group: 'Apparel' },
  { id: 'cargo-pants', name: 'Cargo Pants', group: 'Apparel' },
  { id: 'hoodies', name: 'Hoodies & Sweatshirts', group: 'Apparel' },
  { id: 'jackets', name: 'Jackets & Blazers', group: 'Apparel' },
  { id: 'shorts', name: 'Shorts', group: 'Apparel' },
  { id: 'innerwear', name: 'Innerwear & Nightwear', group: 'Apparel' },
  { id: 'sneakers', name: 'Sneakers & Sports Shoes', group: 'Footwear' },
  { id: 'formal-shoes', name: 'Formal Shoes & Sandals', group: 'Footwear' },
  { id: 'watches', name: 'Watches & Accessories', group: 'Accessories' },
  { id: 'wallets', name: 'Wallets, Belts & Caps', group: 'Accessories' }
];

export const WOMEN_SUBCATEGORIES = [
  { id: 'tops', name: 'Tops & T-Shirts', group: 'Apparel' },
  { id: 'dresses', name: 'Dresses & Kurtis', group: 'Apparel' },
  { id: 'jeans', name: 'Jeans & Leggings', group: 'Apparel' },
  { id: 'skirts', name: 'Skirts & Palazzos', group: 'Apparel' },
  { id: 'jackets', name: 'Jackets & Sweaters', group: 'Apparel' },
  { id: 'nightwear', name: 'Nightwear & Lingerie', group: 'Apparel' },
  { id: 'heels', name: 'Heels & Sandals', group: 'Footwear' },
  { id: 'sneakers', name: 'Sneakers', group: 'Footwear' },
  { id: 'handbags', name: 'Handbags & Tote Bags', group: 'Accessories' },
  { id: 'jewellery', name: 'Jewellery & Scarves', group: 'Accessories' },
  { id: 'perfumes', name: 'Perfumes', group: 'Accessories' },
  { id: 'watches', name: 'Watches', group: 'Accessories' }
];

export const ACCESSORIES_SUBCATEGORIES = [
  { id: 'bags', name: 'Handbags & Backpacks', group: 'Bags' },
  { id: 'travel-bags', name: 'Laptop & Travel Bags', group: 'Bags' },
  { id: 'wallets', name: 'Wallets & Cardholders', group: 'Leather' },
  { id: 'belts', name: 'Belts & Caps', group: 'Wearables' },
  { id: 'watches', name: 'Luxury Watches', group: 'Wearables' },
  { id: 'sunglasses', name: 'Eyewear & Sunglasses', group: 'Wearables' },
  { id: 'jewellery', name: 'Fine Jewellery', group: 'Jewellery' },
  { id: 'perfumes', name: 'Perfumes & Fragrances', group: 'Beauty' }
];

export const PRODUCTS = [
  /* Men Products */
  {
    id: 'pjr-001',
    title: 'Minimalist Monogram Navy Blazer',
    brand: 'PJR Exclusive',
    gender: 'men',
    category: 'jackets',
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    rating: 4.9,
    reviewsCount: 128,
    isNew: true,
    isBestSeller: true,
    images: [
      'assets/images/hero-men.png',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Deep Navy', hex: '#001B2A' }, { name: 'Dark Slate', hex: '#1F2937' }],
    stock: 5,
    description: 'Crafted from Italian wool blend with custom tailored fit. Notch lapel, dual phone pockets.',
    specifications: { Material: '70% Wool, 30% Viscose', Fit: 'Perfect Fit', Care: 'Dry Clean' }
  },
  {
    id: 'pjr-004',
    title: 'Unisex Oversized Heavyweight Hoodie',
    brand: 'PJR Exclusive',
    gender: 'men',
    category: 'hoodies',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.7,
    reviewsCount: 340,
    isNew: true,
    isBestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Dark Slate', hex: '#1F2937' }, { name: 'PJR Teal', hex: '#006C6E' }],
    stock: 12,
    description: 'Heavyweight 450GSM organic French terry cotton hoodie featuring dropped shoulders.',
    specifications: { Material: '100% Organic Heavy Cotton', Fit: 'Oversized Fit' }
  },
  {
    id: 'pjr-007',
    title: 'Tailored Egyptian Cotton Dress Shirt',
    brand: 'Calvin Klein',
    gender: 'men',
    category: 'shirts',
    price: 4299,
    originalPrice: 5999,
    discount: 28,
    rating: 4.8,
    reviewsCount: 89,
    isNew: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['39', '40', '42', '44'],
    colors: [{ name: 'Pure White', hex: '#FFFFFF' }, { name: 'Ice Blue', hex: '#E5E7EB' }],
    stock: 8,
    description: '100% 120s 2-ply Egyptian Giza Cotton dress shirt featuring stiff French cuffs and mother-of-pearl buttons.',
    specifications: { Material: '100% Giza Cotton', Collar: 'Spread Collar' }
  },
  {
    id: 'pjr-008',
    title: 'Vintage Tapered Italian Raw Denim Jeans',
    brand: 'Zara',
    gender: 'men',
    category: 'jeans',
    price: 3999,
    originalPrice: 5499,
    discount: 27,
    rating: 4.6,
    reviewsCount: 178,
    isNew: false,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [{ name: 'Indigo Navy', hex: '#001B2A' }],
    stock: 15,
    description: 'Selvedge raw Japanese indigo denim woven on traditional vintage shuttle looms.',
    specifications: { Denim: '14oz Selvedge', Cut: 'Perfect Tapered' }
  },
  {
    id: 'pjr-009',
    title: 'Minimalist White Leather Low-Top Sneakers',
    brand: 'Nike',
    gender: 'men',
    category: 'sneakers',
    price: 6999,
    originalPrice: 8999,
    discount: 22,
    rating: 4.9,
    reviewsCount: 420,
    isNew: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: [{ name: 'White & Navy Accent', hex: '#FFFFFF' }],
    stock: 9,
    description: 'Calfskin leather exterior with cushioned ortholite memory foam insoles for all-day luxury comfort.',
    specifications: { Upper: 'Full Grain Leather', Sole: 'Vibram Rubber' }
  },

  /* Women Products */
  {
    id: 'pjr-002',
    title: 'Teal Elegance Silk Evening Gown',
    brand: 'AJIO Luxe',
    gender: 'women',
    category: 'dresses',
    price: 12499,
    originalPrice: 16999,
    discount: 26,
    rating: 5.0,
    reviewsCount: 94,
    isNew: true,
    isBestSeller: true,
    images: [
      'assets/images/hero-women.png',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'PJR Teal', hex: '#006C6E' }],
    stock: 3,
    description: 'Teal silk satin gown designed with waist draping, high leg slit, and fluid silhouette.',
    specifications: { Material: '100% Mulberry Silk', Fit: 'Evening Fit' }
  },
  {
    id: 'pjr-006',
    title: 'Sleek Double-Breasted Trench Coat',
    brand: 'H&M',
    gender: 'women',
    category: 'jackets',
    price: 7499,
    originalPrice: 9999,
    discount: 25,
    rating: 4.6,
    reviewsCount: 156,
    isNew: true,
    isBestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1548624149-f1af3492b83a?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Beige Sand', hex: '#E5E7EB' }, { name: 'Deep Navy', hex: '#001B2A' }],
    stock: 7,
    description: 'Double-breasted trench coat with waist belt, storm flap back, and horn finish buttons.',
    specifications: { Material: 'Cotton Gabardine', Fit: 'Tailored' }
  },
  {
    id: 'pjr-010',
    title: 'Designer Floral Silk Embroidered Kurti',
    brand: 'PJR Exclusive',
    gender: 'women',
    category: 'dresses',
    price: 4999,
    originalPrice: 6999,
    discount: 28,
    rating: 4.8,
    reviewsCount: 112,
    isNew: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Teal Green', hex: '#006C6E' }, { name: 'Blush Rose', hex: '#E5E7EB' }],
    stock: 10,
    description: 'Hand-embroidered silk chanderi kurti with delicate zari thread work and organza dupatta.',
    specifications: { Material: 'Chanderi Silk', Work: 'Hand Zari Embroidery' }
  },
  {
    id: 'pjr-011',
    title: 'Leather Stiletto Strappy Heels',
    brand: 'Zara',
    gender: 'women',
    category: 'heels',
    price: 5499,
    originalPrice: 7499,
    discount: 26,
    rating: 4.7,
    reviewsCount: 64,
    isNew: true,
    isBestSeller: false,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: [{ name: 'Midnight Black', hex: '#1F2937' }, { name: 'Gold Accent', hex: '#F59E0B' }],
    stock: 6,
    description: '3.5 inch architectural stiletto heels with padded leather insoles and anti-slip rubber outsole.',
    specifications: { HeelHeight: '3.5 inches', Upper: 'Nappa Leather' }
  },

  /* Accessories Products */
  {
    id: 'pjr-003',
    title: 'Chronograph Steel & Sapphire Watch',
    brand: 'Calvin Klein',
    gender: 'accessories',
    category: 'watches',
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    rating: 4.8,
    reviewsCount: 210,
    isNew: false,
    isBestSeller: true,
    images: [
      'assets/images/hero-accessories.png',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Standard'],
    colors: [{ name: 'Gunmetal Navy', hex: '#001B2A' }],
    stock: 8,
    description: 'Swiss quartz chronograph movement with sapphire crystal glass and leather strap.',
    specifications: { Case: '316L Stainless Steel', Water: '50 Meters' }
  },
  {
    id: 'pjr-005',
    title: 'Luxury Leather Saddle Crossbody Bag',
    brand: 'Zara',
    gender: 'accessories',
    category: 'bags',
    price: 5999,
    originalPrice: 7999,
    discount: 25,
    rating: 4.9,
    reviewsCount: 88,
    isNew: false,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Standard'],
    colors: [{ name: 'Teal Leather', hex: '#006C6E' }],
    stock: 4,
    description: 'Full-grain leather handbag with brushed gold magnetic clasp hardware.',
    specifications: { Material: 'Calf Leather', Dimensions: '24 x 18 x 7 cm' }
  },
  {
    id: 'pjr-012',
    title: 'Polarized Titanium Aviator Sunglasses',
    brand: 'PJR Exclusive',
    gender: 'accessories',
    category: 'sunglasses',
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    rating: 4.9,
    reviewsCount: 145,
    isNew: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Standard Fit'],
    colors: [{ name: 'Matte Navy', hex: '#001B2A' }, { name: 'Brushed Gold', hex: '#F59E0B' }],
    stock: 14,
    description: 'Ultra-lightweight Japanese Grade-5 Titanium frame with UV400 anti-glare polarized lenses.',
    specifications: { Frame: 'Japanese Titanium', Lenses: 'UV400 Polarized' }
  }
];
