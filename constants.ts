
import { Category, Product, ProductVariant, BlogPost, Review, Coupon } from './types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Tote Bags', slug: 'totes', image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800' },
  { id: 'c2', name: 'Crossbody', slug: 'crossbody', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' },
  { id: 'c3', name: 'Backpacks', slug: 'backpacks', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800' },
  { id: 'c4', name: 'Clutches', slug: 'clutches', image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?auto=format&fit=crop&q=80&w=800' },
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'BAZZARO10',
    description: 'Get an EXTRA 10% OFF on your first order. Welcome to the archive.',
  },
  {
    id: 'c2',
    code: 'FREEGLB',
    description: 'FREE Global Shipping on all orders above $150.',
    min_purchase: 150
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Architecture of the Perfect Tote',
    category: 'Craft',
    date: 'Jan 12, 2025',
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Exploring the dialogue between volume, structure, and the tactile nature of full-grain Italian leather.'
  },
  {
    id: 'b2',
    title: 'L’Hiver: A Winter Intervention',
    category: 'Editorial',
    date: 'Dec 28, 2024',
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    excerpt: 'When monochrome meets the silent winter. A visual essay on our latest seasonal drop.'
  },
  {
    id: 'b3',
    title: 'Archive Notes: The Obsidian Series',
    category: 'Archive',
    date: 'Nov 15, 2024',
    image_url: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Tracing back the lineage of our most coveted matte finishes and the technical precision required for Obsidian hide.'
  }
];

export const MOCK_INSTAGRAM_POSTS = [
  { id: 'ig1', url: 'https://images.unsplash.com/photo-1579631383387-9257007567b5?auto=format&fit=crop&q=80&w=800' },
  { id: 'ig2', url: 'https://images.unsplash.com/photo-1599371300803-344436254b42?auto=format&fit=crop&q=80&w=800' },
  { id: 'ig3', url: 'https://images.unsplash.com/photo-1612199103986-2800c8b6a35a?auto=format&fit=crop&q=80&w=800' },
  { id: 'ig4', url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800' },
  { id: 'ig5', url: 'https://images.unsplash.com/photo-1559563458-52792b35588f?auto=format&fit=crop&q=80&w=800' },
  { id: 'ig6', url: 'https://images.unsplash.com/photo-1572196285227-31238b165434?auto=format&fit=crop&q=80&w=800' },
];

const createVariants = (productId: string, colors: {name: string, hex: string}[]): ProductVariant[] => 
  colors.map(c => ({
    id: `${productId}-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
    product_id: productId,
    size: 'OS',
    color: c.name,
    hex: c.hex,
    stock_quantity: Math.random() > 0.2 ? Math.floor(Math.random() * 50) + 1 : 0, // 80% chance of being in stock
    sku: `${productId}-${c.name.substring(0, 3).toUpperCase()}`
  }));

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Minimalist Leather Tote',
    slug: 'minimalist-leather-tote',
    description: 'Grain leather tote with raw edges and internal pocket. A testament to simplicity, designed for the modern essentialist. Its unstructured form allows for versatile use, from daily commutes to weekend escapes.',
    base_price: 290,
    category_id: 'c1',
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    other_images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591561954555-607ef358dcc2?auto=format&fit=crop&q=80&w=800'
    ],
    is_active: true,
    variants: createVariants('p1', [{name: 'Onyx', hex: '#111111'}, {name: 'Cream', hex: '#F5F5DC'}, {name: 'Cognac', hex: '#8B4513'}]),
    tags: ['Leather', 'Handmade', 'Minimalist'],
    rating: 4.9,
    reviews_count: 124,
    materials: '100% Full-Grain Italian Leather, Unlined Suede Interior',
    dimensions: '35cm H x 45cm W x 15cm D',
    is_new: true,
    reviews: [
      { id: 'r1', author: 'Sophia L.', rating: 5, title: 'Perfectly understated.', content: 'The quality of the leather is exceptional. It’s my new everyday bag and it holds everything I need without feeling bulky. Truly a timeless piece.', date: '2023-10-15' },
      { id: 'r2', author: 'James K.', rating: 5, title: 'Masterpiece of minimalism.', content: 'I appreciate the raw edges and the unlined interior. It feels authentic and incredibly well-made. Worth every penny.', date: '2023-09-28' },
      { id: 'r3', author: 'Chloe R.', rating: 4, title: 'Beautiful but simple.', content: 'A gorgeous bag. My only wish is that it had a small clasp or magnet at the top, but the open design is part of its aesthetic.', date: '2023-09-12' },
    ],
    faq: [
        { question: 'How do I care for the leather?', answer: 'Wipe with a soft, dry cloth. For deeper cleaning, use a leather conditioner. Avoid prolonged exposure to direct sunlight and water.' },
        { question: 'Is the internal pocket large enough for a phone?', answer: 'Yes, the internal pocket is designed to comfortably fit most modern smartphones, including larger models.' },
    ]
  },
  {
    id: 'p3',
    title: 'Sculptural Satchel',
    slug: 'sculptural-satchel',
    description: 'Hand-crafted structured satchel with silver-tone hardware. Its architectural form is a statement piece, blending traditional craftsmanship with avant-garde design. Features a magnetic clasp and a detachable shoulder strap.',
    base_price: 450,
    category_id: 'c2',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    other_images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?auto=format&fit=crop&q=80&w=800'
    ],
    is_active: true,
    variants: createVariants('p3', [{name: 'Obsidian', hex: '#000000'}, {name: 'Midnight Blue', hex: '#191970'}]),
    tags: ['Luxury', 'Limited Edition', 'Couture'],
    rating: 5.0,
    reviews_count: 56,
    materials: 'Box Calfskin Leather, Polished Titanium Hardware',
    dimensions: '22cm H x 28cm W x 12cm D',
    reviews: [
      { id: 'r4', author: 'Isabella M.', rating: 5, title: 'A work of art.', content: 'This is more than a bag; it\'s a piece of sculpture. The lines are incredible and the hardware is exquisite. I receive compliments every time I wear it.', date: '2023-11-02' },
      { id: 'r5', author: 'Ava Chen', rating: 5, title: 'Beyond expectations.', content: 'The craftsmanship is flawless. It feels incredibly luxurious and the structured shape is very sophisticated. A true investment piece.', date: '2023-10-21' },
    ],
    faq: [
      { question: 'Can the shoulder strap be adjusted?', answer: 'Yes, the detachable shoulder strap is fully adjustable for crossbody or shoulder wear.' },
      { question: 'What is Box Calfskin?', answer: 'It is a type of firm, fine-grained leather known for its smooth finish and ability to hold a rigid shape, making it ideal for structured bags.' },
    ]
  },
  // Add other products without full reviews/faq to save space
  {
    id: 'p2', title: 'The Neo-Backpack', slug: 'neo-backpack', description: 'Weatherproof technical fabric with magnetic closures.', base_price: 185, category_id: 'c3', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', other_images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800'], is_active: true, variants: createVariants('p2', [{name: 'Stealth Black', hex: '#0A0A0A'}, {name: 'Ghost Gray', hex: '#A9A9A9'}]), tags: ['Techwear', 'Waterproof', 'Urban'], rating: 4.7, reviews_count: 89, is_new: true
  },
  {
    id: 'p4', title: 'Obsidian Pouch', slug: 'obsidian-pouch', description: 'Sleek, slim-profile evening clutch in matte finish.', base_price: 120, category_id: 'c4', image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?auto=format&fit=crop&q=80&w=800', other_images: ['https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800'], is_active: true, variants: createVariants('p4', [{name: 'Matte Onyx', hex: '#1C1C1C'}]), tags: ['Evening', 'Matte', 'Essentials'], rating: 4.8, reviews_count: 210
  },
  {
    id: 'p5', title: 'Utility Duffel', slug: 'utility-duffel', description: 'Oversized travel bag with reinforced straps.', base_price: 320, category_id: 'c1', image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800', other_images: ['https://images.unsplash.com/photo-1605309424345-3d88b4c7336a?auto=format&fit=crop&q=80&w=800'], is_active: true, variants: createVariants('p5', [{name: 'Carbon', hex: '#333333'}, {name: 'Olive', hex: '#556B2F'}]), tags: ['Travel', 'Durable', 'Large'], rating: 4.6, reviews_count: 42
  },
  {
    id: 'p6', title: 'Miniature Crossbody', slug: 'mini-crossbody', description: 'Compact essential bag with adjustable chain strap.', base_price: 160, category_id: 'c2', image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800', other_images: ['https://images.unsplash.com/photo-1610290499424-9368d374d758?auto=format&fit=crop&q=80&w=800'], is_active: true, variants: createVariants('p6', [{name: 'Gold Glow', hex: '#C9A050'}, {name: 'Rose Dust', hex: '#BC8F8F'}]), tags: ['Mini', 'Summer', 'Chain'], rating: 4.9, reviews_count: 178
  },
  {
    id: 'p7', title: 'Brutalist Briefcase', slug: 'brutalist-briefcase', description: 'Square-cut professional bag for the modern creative.', base_price: 380, category_id: 'c1', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', other_images: [], is_active: true, variants: createVariants('p7', [{name: 'Steel', hex: '#708090'}]), tags: ['Professional', 'Unisex', 'Architecture'], rating: 4.7, reviews_count: 29
  },
  {
    id: 'p8', title: 'Cloud Tote', slug: 'cloud-tote', description: 'Padded, ultra-lightweight fabric tote for daily use.', base_price: 95, category_id: 'c1', image_url: 'https://images.unsplash.com/photo-1606170033648-5d55a3df3045?auto=format&fit=crop&q=80&w=800', other_images: [], is_active: true, variants: createVariants('p8', [{name: 'White Cloud', hex: '#FFFFFF'}, {name: 'Soft Blue', hex: '#ADD8E6'}]), tags: ['Lightweight', 'Everyday', 'Padded'], rating: 4.5, reviews_count: 312
  },
  {
    id: 'p9', title: 'Architectural Sling', slug: 'architectural-sling', description: 'Sharp-angled crossbody bag with hidden compartments.', base_price: 210, category_id: 'c2', image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800', other_images: ['https://images.unsplash.com/photo-1591561954555-607ef358dcc2?auto=format&fit=crop&q=80&w=800'], is_active: true, variants: createVariants('p9', [{name: 'Ash', hex: '#B2B2B2'}, {name: 'Charcoal', hex: '#363636'}]), tags: ['Sling', 'Geometric', 'Modern'], rating: 4.8, reviews_count: 67
  },
  {
    id: 'p10', title: 'Canvas Monolith Tote', slug: 'canvas-monolith', description: 'Heavyweight waxed canvas tote with industrial rivets.', base_price: 145, category_id: 'c1', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', other_images: [], is_active: true, variants: createVariants('p10', [{name: 'Ecru', hex: '#F0EAD6'}, {name: 'Slate', hex: '#708090'}]), tags: ['Canvas', 'Industrial', 'Oversized'], rating: 4.7, reviews_count: 142
  },
  {
    id: 'p11', title: 'Modular Commuter', slug: 'modular-commuter', description: 'Technical backpack with detachable utility pouches.', base_price: 265, category_id: 'c3', image_url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&q=80&w=800', other_images: [], is_active: true, variants: createVariants('p11', [{name: 'Nightshade', hex: '#1C1C1C'}, {name: 'Tundra', hex: '#EAEAEA'}]), tags: ['Technical', 'Modular', 'Work'], rating: 4.9, reviews_count: 31
  },
  {
    id: 'p12', title: 'Geometric Frame Clutch', slug: 'geometric-frame-clutch', description: 'Hard-shell clutch with an asymmetrical clasp.', base_price: 340, category_id: 'c4', image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?auto=format&fit=crop&q=80&w=800', other_images: [], is_active: true, variants: createVariants('p12', [{name: 'Obsidian', hex: '#000000'}, {name: 'Bone', hex: '#E3DAC9'}]), tags: ['Evening', 'Structured', 'Artistic'], rating: 5.0, reviews_count: 24
  },
];