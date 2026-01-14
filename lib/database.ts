// Production database service using Firestore
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, CartItem, AbandonedCart } from '../types';

// Collections
const COLLECTIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  ABANDONED_CARTS: 'abandonedCarts',
  COUPONS: 'coupons',
  ANALYTICS: 'analytics',
  REVIEWS: 'reviews',
  INVENTORY: 'inventory'
};

// Error handling wrapper
async function handleFirestoreOperation<T>(operation: () => Promise<T>): Promise<T> {
  if (!db) {
    console.error('Firestore not initialized. Check Firebase configuration.');
    throw new Error('Firestore not initialized. Check Firebase configuration.');
  }

  try {
    return await operation();
  } catch (error) {
    console.error('Firestore operation failed:', error);
    // For operations that should return arrays, we'll let the calling function handle the fallback
    throw error;
  }
}

// Products Service
export const ProductsService = {
  async getAll(): Promise<Product[]> {
    return handleFirestoreOperation(async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db!, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc'))
        );
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        console.log(`ProductsService.getAll() returned ${products.length} products`);
        return products;
      } catch (error) {
        console.error('ProductsService.getAll() failed:', error);
        // Return empty array instead of throwing, let store.ts handle fallback
        return [];
      }
    });
  },

  async getById(id: string): Promise<Product | null> {
    return handleFirestoreOperation(async () => {
      const docSnap = await getDoc(doc(db!, COLLECTIONS.PRODUCTS, id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Product : null;
    });
  },

  async getBySlug(slug: string): Promise<Product | null> {
    return handleFirestoreOperation(async () => {
      const q = query(collection(db!, COLLECTIONS.PRODUCTS), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Product;
    });
  },

  async create(product: Omit<Product, 'id'>): Promise<string> {
    return handleFirestoreOperation(async () => {
      const docRef = await addDoc(collection(db!, COLLECTIONS.PRODUCTS), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    });
  },

  async update(id: string, updates: Partial<Product>): Promise<void> {
    return handleFirestoreOperation(async () => {
      await updateDoc(doc(db!, COLLECTIONS.PRODUCTS, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    });
  },

  async delete(id: string): Promise<void> {
    return handleFirestoreOperation(async () => {
      await deleteDoc(doc(db!, COLLECTIONS.PRODUCTS, id));
    });
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    return handleFirestoreOperation(async () => {
      const q = query(
        collection(db!, COLLECTIONS.PRODUCTS),
        where('category_id', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    });
  }
};

// Orders Service
export const OrdersService = {
  async create(order: Omit<Order, 'id'>): Promise<string> {
    return handleFirestoreOperation(async () => {
      const docRef = await addDoc(collection(db!, COLLECTIONS.ORDERS), {
        ...order,
        status: 'processing',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Update inventory
      const batch = writeBatch(db!);
      for (const item of order.items) {
        const productRef = doc(db!, COLLECTIONS.PRODUCTS, item.productId);
        batch.update(productRef, {
          [`variants.${item.variantId}.stock_quantity`]: increment(-item.quantity)
        });
      }
      await batch.commit();

      return docRef.id;
    });
  },

  async getAll(userId?: string): Promise<Order[]> {
    return handleFirestoreOperation(async () => {
      let q = query(collection(db!, COLLECTIONS.ORDERS), orderBy('createdAt', 'desc'));

      if (userId) {
        q = query(collection(db!, COLLECTIONS.ORDERS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    });
  },

  async getById(id: string): Promise<Order | null> {
    return handleFirestoreOperation(async () => {
      const docSnap = await getDoc(doc(db!, COLLECTIONS.ORDERS, id));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Order : null;
    });
  },

  async updateStatus(id: string, status: string): Promise<void> {
    return handleFirestoreOperation(async () => {
      await updateDoc(doc(db!, COLLECTIONS.ORDERS, id), {
        status,
        updatedAt: Timestamp.now()
      });
    });
  }
};

// Customers Service
export const CustomersService = {
  async create(customer: {
    uid: string;
    email: string;
    name: string;
    phone?: string;
  }): Promise<void> {
    return handleFirestoreOperation(async () => {
      await addDoc(collection(db!, COLLECTIONS.CUSTOMERS), {
        ...customer,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now()
      });
    });
  },

  async getByUid(uid: string): Promise<any | null> {
    return handleFirestoreOperation(async () => {
      const q = query(collection(db!, COLLECTIONS.CUSTOMERS), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    });
  },

  async updateProfile(uid: string, updates: any): Promise<void> {
    return handleFirestoreOperation(async () => {
      const q = query(collection(db!, COLLECTIONS.CUSTOMERS), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const customerDoc = querySnapshot.docs[0];
        await updateDoc(customerDoc.ref, {
          ...updates,
          updatedAt: Timestamp.now()
        });
      }
    });
  },

  async getAll(): Promise<any[]> {
    return handleFirestoreOperation(async () => {
      const querySnapshot = await getDocs(
        query(collection(db!, COLLECTIONS.CUSTOMERS), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  }
};

// Abandoned Carts Service
export const AbandonedCartsService = {
  async create(cart: Omit<AbandonedCart, 'id'>): Promise<string> {
    return handleFirestoreOperation(async () => {
      const docRef = await addDoc(collection(db!, COLLECTIONS.ABANDONED_CARTS), {
        ...cart,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    });
  },

  async getAll(): Promise<AbandonedCart[]> {
    console.log('AbandonedCartsService.getAll() - Starting query...');
    return handleFirestoreOperation(async () => {
      try {
        console.log('AbandonedCartsService.getAll() - Querying Firestore (no orderBy)...');
        // Simple query without orderBy - avoids missing index issues
        const querySnapshot = await getDocs(
          query(
            collection(db!, COLLECTIONS.ABANDONED_CARTS),
            limit(50)
          )
        );
        console.log('AbandonedCartsService.getAll() - Query complete, found:', querySnapshot.size, 'documents');
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AbandonedCart));
        // Sort on client side (most recent first) using lastActive
        results.sort((a, b) => {
          const dateA = a.lastActive ? new Date(a.lastActive).getTime() : 0;
          const dateB = b.lastActive ? new Date(b.lastActive).getTime() : 0;
          return dateB - dateA;
        });
        return results;
      } catch (error) {
        console.error('AbandonedCartsService.getAll() FAILED:', error);
        return [];
      }
    });
  },

  async updateStatus(id: string, status: string): Promise<void> {
    return handleFirestoreOperation(async () => {
      await updateDoc(doc(db!, COLLECTIONS.ABANDONED_CARTS, id), {
        status,
        updatedAt: Timestamp.now()
      });
    });
  },

  async delete(id: string): Promise<void> {
    return handleFirestoreOperation(async () => {
      await deleteDoc(doc(db!, COLLECTIONS.ABANDONED_CARTS, id));
    });
  }
};

// Analytics Service
export const AnalyticsService = {
  async getOverview(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
  }> {
    return handleFirestoreOperation(async () => {
      const [ordersSnapshot, customersSnapshot] = await Promise.all([
        getDocs(collection(db!, COLLECTIONS.ORDERS)),
        getDocs(collection(db!, COLLECTIONS.CUSTOMERS))
      ]);

      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const totalCustomers = customersSnapshot.size;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue
      };
    });
  }
};

// Reviews Service
export const ReviewsService = {
  async create(review: {
    productId: string;
    userId: string;
    rating: number;
    title: string;
    content: string;
    author: string;
  }): Promise<string> {
    return handleFirestoreOperation(async () => {
      const docRef = await addDoc(collection(db!, COLLECTIONS.REVIEWS), {
        ...review,
        createdAt: Timestamp.now(),
        verified: false
      });
      return docRef.id;
    });
  },

  async getByProduct(productId: string): Promise<any[]> {
    return handleFirestoreOperation(async () => {
      const q = query(
        collection(db!, COLLECTIONS.REVIEWS),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  }
};

// Coupons Service
export const CouponsService = {
  async getByCode(code: string): Promise<any | null> {
    return handleFirestoreOperation(async () => {
      const q = query(collection(db!, COLLECTIONS.COUPONS), where('code', '==', code));
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    });
  },

  async getAll(): Promise<any[]> {
    return handleFirestoreOperation(async () => {
      const querySnapshot = await getDocs(
        query(collection(db!, COLLECTIONS.COUPONS), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  },

  async create(coupon: any): Promise<string> {
    return handleFirestoreOperation(async () => {
      const docRef = await addDoc(collection(db!, COLLECTIONS.COUPONS), {
        ...coupon,
        createdAt: Timestamp.now(),
        usedCount: 0
      });
      return docRef.id;
    });
  }
};