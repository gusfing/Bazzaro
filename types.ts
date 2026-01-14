
// Enums mirroring SQL Enums
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

// User Entity
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

// Category Entity
export interface Category {
  id:string;
  name: string;
  image_url: string;
  slug: string;
}

// Product Variant Entity
export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock_quantity: number;
  sku: string;
  hex?: string; // Hex code for visual representation
}

// Review Entity
export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
}

// Product Entity
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  category_id: string;
  image_url: string; // Simplified for frontend demo
  other_images: string[];
  is_active: boolean;
  variants: ProductVariant[];
  tags?: string[];
  rating?: number;
  reviews_count?: number;
  is_new?: boolean; // Label for new arrivals
  dimensions?: string;
  materials?: string;
  reviews?: Review[];
  faq?: { question: string; answer: string; }[];
  benefits?: string[];
  lifestyle_images?: string[];
  care_instructions?: string;
}

// Blog Post Entity
/* Added missing image_url and excerpt fields and closed the interface */
export interface BlogPost {
  id: string;
  title: string;
  category: 'Editorial' | 'Intervention' | 'Archive' | 'Craft';
  date: string;
  image_url: string;
  excerpt: string;
}

// Cart Item Entity
/* Added CartItem interface which was being imported but not exported from this file */
export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

// Order Entity
export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    date: string;
    customerName: string;
    walletCreditUsed?: number;
    creditsEarned?: number;
}

// Coupon Entity
export interface Coupon {
  id: string;
  code: string;
  description: string;
  min_purchase?: number;
}

// Abandoned Cart Entity
export interface AbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  lastActive: string; // ISO 8601 date string
  items: CartItem[];
  totalValue: number;
  status: 'Pending' | 'Reminder Sent';
}

// Video Reel Entity
export interface VideoReel {
  id: string;
  videoUrl: string;
  posterUrl: string;
  title: string;
}

// Chat Message Entity
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

// Bundle Entity
export interface Bundle {
  id: string;
  title: string;
  productIds: string[];
  bundle_price: number;
}
