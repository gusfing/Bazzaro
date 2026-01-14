// Production store service using Firestore
import {
  ProductsService,
  OrdersService,
  CustomersService,
  AbandonedCartsService,
  AnalyticsService,
  ReviewsService,
  CouponsService
} from './database_supabase';
import { Product, Order, CartItem, AbandonedCart } from '../types';

import { MOCK_PRODUCTS } from '../constants';

// Products Store
export async function getProducts(): Promise<Product[]> {
  console.log('URGENT DEBUG: getProducts function called');
  console.error('URGENT DEBUG: getProducts function called (using error for visibility)');
  try {
    console.log('getProducts: Starting...');

    // Attempt to fetch from Supabase
    const products = await ProductsService.getAll();

    // If Supabase returns empty array (empty DB), fall back to mock data
    if (!products || products.length === 0) {
      console.log('Supabase returned no products, using MOCK_PRODUCTS as fallback');
      return MOCK_PRODUCTS;
    }
    return products;
  } catch (error) {
    console.error('getProducts: Failed to fetch, using MOCK_PRODUCTS as fallback:', error);
    return MOCK_PRODUCTS;
  }
}

export function getProductBySlug(slug: string): Promise<Product | null> {
  return ProductsService.getBySlug(slug);
}

export function saveProducts(products: Product[]): Promise<void> {
  // This would typically be handled by individual create/update operations
  throw new Error('Bulk save not supported. Use individual product operations.');
}

export function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  return ProductsService.create(product);
}

export function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  return ProductsService.update(productId, updates);
}

export function deleteProduct(productId: string): Promise<void> {
  return ProductsService.delete(productId);
}

// Orders Store
export interface StoredOrder extends Order {
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  email?: string;
  phone?: string;
}

export function getOrders(userId?: string): Promise<StoredOrder[]> {
  return OrdersService.getAll(userId) as Promise<StoredOrder[]>;
}

export function saveOrder(order: Omit<StoredOrder, 'id'>): Promise<string> {
  return OrdersService.create(order);
}

export function updateOrderStatus(orderId: string, status: string): Promise<void> {
  return OrdersService.updateStatus(orderId, status);
}

// Customers Store
export interface Customer {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: any;
  lastActive: any;
}

export function getCustomers(): Promise<Customer[]> {
  return CustomersService.getAll();
}

export function getCustomerByUid(uid: string): Promise<Customer | null> {
  return CustomersService.getByUid(uid);
}

export function createCustomer(customer: {
  uid: string;
  email: string;
  name: string;
  phone?: string;
}): Promise<void> {
  return CustomersService.create(customer);
}

export function updateCustomerProfile(uid: string, updates: Partial<Customer>): Promise<void> {
  return CustomersService.updateProfile(uid, updates);
}

// Abandoned Carts Store
export function getAbandonedCarts(): Promise<AbandonedCart[]> {
  return getCachedData('abandonedCarts', () => AbandonedCartsService.getAll());
}

export async function saveAbandonedCart(cart: Omit<AbandonedCart, 'id'>): Promise<string> {
  clearCache('abandonedCarts');
  return AbandonedCartsService.create(cart);
}

export async function updateAbandonedCartStatus(cartId: string, status: AbandonedCart['status']): Promise<void> {
  clearCache('abandonedCarts');
  return AbandonedCartsService.updateStatus(cartId, status);
}

export async function removeAbandonedCart(cartId: string): Promise<void> {
  clearCache('abandonedCarts');
  return AbandonedCartsService.delete(cartId);
}

// Analytics Store
export function getAnalytics(): Promise<{
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}> {
  return AnalyticsService.getOverview();
}

// Reviews Store
export function getProductReviews(productId: string): Promise<any[]> {
  return ReviewsService.getByProduct(productId);
}

export function createReview(review: {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  author: string;
}): Promise<string> {
  return ReviewsService.create(review);
}

// Coupons Store
export function getCouponByCode(code: string): Promise<any | null> {
  return CouponsService.getByCode(code);
}

export function getCoupons(): Promise<any[]> {
  return CouponsService.getAll();
}

export function createCoupon(coupon: any): Promise<string> {
  return CouponsService.create(coupon);
}

export function addCoupon(coupon: any): Promise<string> {
  return createCoupon(coupon);
}

export function updateCoupon(couponId: string, updates: any): Promise<void> {
  // For now, this would need to be implemented in CouponsService
  // Placeholder implementation
  return Promise.resolve();
}

export function deleteCoupon(couponId: string): Promise<void> {
  // For now, this would need to be implemented in CouponsService
  // Placeholder implementation
  return Promise.resolve();
}

// Coupon interface for compatibility
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

// Utility functions for backward compatibility
export async function initializeStore(): Promise<void> {
  // Initialize any required data or check database connection
  try {
    await getAnalytics();
    console.log('Store initialized successfully');
  } catch (error) {
    console.error('Store initialization failed:', error);
  }
}

// Cache management for better performance
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return Promise.resolve(cached.data);
  }

  return fetcher().then(data => {
    cache.set(key, { data, timestamp: now });
    return data;
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Additional utility functions for backward compatibility
export function addOrUpdateCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<void> {
  return CustomersService.create({
    uid: customer.email, // Use email as UID for guest customers
    email: customer.email,
    name: customer.name,
    phone: customer.phone
  });
}

// Coupon validation utility
export async function validateCoupon(code: string, cartTotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
  try {
    const coupon = await getCouponByCode(code);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, discount: 0, message: 'Coupon has expired' };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return { valid: false, discount: 0, message: `Minimum purchase of ₹${coupon.minPurchase} required` };
    }

    const discount = coupon.discountType === 'percentage'
      ? (cartTotal * coupon.discountValue) / 100
      : coupon.discountValue;

    return { valid: true, discount, message: `Coupon applied! You save ₹${discount.toFixed(0)}` };
  } catch (error) {
    return { valid: false, discount: 0, message: 'Error validating coupon' };
  }
}

// Settings Store Interface
export interface StoreSettings {
  storeName: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  enableReviews: boolean;
  enableWishlist: boolean;
  enableGuestCheckout: boolean;
}

// Mock settings for now - in production, these would be stored in Firestore
export function getSettings(): StoreSettings {
  return {
    storeName: 'BAZZARO',
    currency: 'INR',
    taxRate: 18,
    shippingFee: 500,
    freeShippingThreshold: 5000,
    lowStockThreshold: 5,
    enableReviews: true,
    enableWishlist: true,
    enableGuestCheckout: true,
  };
}
