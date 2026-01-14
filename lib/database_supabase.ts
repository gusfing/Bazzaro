import { supabase } from './supabase';
import { Product, Order, CartItem, AbandonedCart, User, Review } from '../types';

// Products Service
export const ProductsService = {
    async getAll(): Promise<Product[]> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }

        return data.map(mapDatabaseProduct);
    },

    async getById(id: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return mapDatabaseProduct(data);
    },

    async getBySlug(slug: string): Promise<Product | null> {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) return null;
        return mapDatabaseProduct(data);
    },

    async create(product: Omit<Product, 'id'>): Promise<string> {
        const dbProduct = mapAppProductToDb(product);
        const { data, error } = await supabase
            .from('products')
            .insert(dbProduct)
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    },

    async update(id: string, updates: Partial<Product>): Promise<void> {
        // Partial mapping logic would be needed here, for now simpler approach
        const { error } = await supabase
            .from('products')
            .update(updates) // This needs proper mapping too in real usage
            .eq('id', id);

        if (error) throw error;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Orders Service
export const OrdersService = {
    async create(order: Omit<Order, 'id'>): Promise<string> {
        // 1. Create Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: (await supabase.auth.getUser()).data.user?.id, // Assumes logged in, otherwise handle guest
                total_amount: order.total,
                status: 'processing',
                payment_status: 'pending' // Default
            })
            .select('id')
            .single();

        if (orderError) throw orderError;
        const orderId = orderData.id;

        // 2. Create Order Items
        const items = order.items.map(item => ({
            order_id: orderId,
            product_id: item.productId,
            quantity: item.quantity,
            price_at_purchase: item.price,
            variant_name: `${item.size} ${item.color}`
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(items);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // In real app, rollback order here
        }

        return orderId;
    },

    async getAll(userId?: string): Promise<Order[]> {
        let query = supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) return [];

        return data.map(mapDatabaseOrder);
    },

    async updateStatus(id: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    }
};

// Customers Service
export const CustomersService = {
    async getAll(): Promise<any[]> {
        // Supabase auth users are not directly queryable via client if strict RLS. 
        // We query the public.users table which mirrors auth.users
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) return [];
        return data.map(u => ({
            id: u.id,
            uid: u.id,
            name: u.full_name || 'Unknown',
            email: u.email,
            phone: u.phone,
            totalOrders: 0,
            totalSpent: 0,
            createdAt: u.created_at,
            lastActive: u.updated_at
        }));
    },

    async getByUid(uid: string): Promise<any | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single();

        if (error) return null;
        return data;
    },

    async create(customer: { uid: string; email: string; name: string; phone?: string }): Promise<void> {
        // Typically handled by Auth Trigger, but for guest/manual creation:
        const { error } = await supabase
            .from('users')
            .upsert({
                id: customer.uid,
                email: customer.email,
                full_name: customer.name,
                phone: customer.phone
            });

        if (error) throw error;
    },

    async updateProfile(uid: string, updates: any): Promise<void> {
        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', uid);

        if (error) throw error;
    }
};

// Abandoned Carts Service
export const AbandonedCartsService = {
    async getAll(): Promise<AbandonedCart[]> {
        const { data, error } = await supabase
            .from('abandoned_carts')
            .select('*')
            .limit(50);

        if (error) return [];
        return data.map(d => ({
            id: d.id,
            customerName: d.guest_email || 'Unknown', // Simplification
            customerPhone: '',
            lastActive: d.last_active,
            items: d.items,
            totalValue: d.total_value,
            status: d.email_sent ? 'Reminder Sent' : 'Pending'
        }));
    },

    async create(cart: Omit<AbandonedCart, 'id'>): Promise<string> {
        const { data, error } = await supabase
            .from('abandoned_carts')
            .insert({
                guest_email: cart.customerName, // Storing name in email field temporarily or needing schema update
                items: cart.items,
                total_value: cart.totalValue,
                last_active: new Date().toISOString()
            })
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    },

    async updateStatus(id: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('abandoned_carts')
            .update({ email_sent: status === 'Reminder Sent' })
            .eq('id', id);
        if (error) throw error;
    },

    async delete(id: string): Promise<void> {
        await supabase.from('abandoned_carts').delete().eq('id', id);
    }
};



// Analytics Service
export const AnalyticsService = {
    async getOverview() {
        // In SQL this is easy with count(), sum()
        // For now, getting basics
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: customerCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

        // For revenue, we need to sum. Supabase client doesn't do sum() directly well without RPC.
        // We'll fetch orders total_amount for now (inefficient for 10k users, but okay for start)
        const { data: orders } = await supabase.from('orders').select('total_amount');
        const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

        return {
            totalRevenue,
            totalOrders: orderCount || 0,
            totalCustomers: customerCount || 0,
            averageOrderValue: orderCount ? totalRevenue / orderCount : 0
        };
    }
};

// Reviews Service
export const ReviewsService = {
    async getByProduct(productId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId);
        if (error) return [];
        return data;
    },

    async create(review: any): Promise<string> {
        const { data, error } = await supabase.from('reviews').insert({
            product_id: review.productId,
            user_id: review.userId,
            rating: review.rating,
            title: review.title,
            content: review.content
        }).select('id').single();

        if (error) throw error;
        return data.id;
    }
}

// Coupons Service
export const CouponsService = {
    async getByCode(code: string): Promise<any | null> {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code)
            .single();
        if (error) return null;
        return data;
    },

    async getAll(): Promise<any[]> {
        const { data, error } = await supabase.from('coupons').select('*');
        return data || [];
    },

    async create(coupon: any): Promise<string> {
        const { data, error } = await supabase.from('coupons').insert(coupon).select('id').single();
        if (error) throw error;
        return data.id;
    }
}


// --- Mappers ---

function mapDatabaseProduct(dbProduct: any): Product {
    return {
        id: dbProduct.id,
        title: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        base_price: dbProduct.price,
        category_id: dbProduct.category,
        image_url: dbProduct.images?.[0] || '',
        other_images: dbProduct.images || [],
        is_active: dbProduct.is_active,
        variants: [], // Populate if we decide to store variants in specific way or separate table
        stock_quantity: dbProduct.stock_quantity
    } as Product;
}

function mapAppProductToDb(product: any): any {
    return {
        name: product.title,
        slug: product.slug,
        description: product.description,
        price: product.base_price,
        category: product.category_id,
        images: product.other_images?.length ? product.other_images : [product.image_url],
        is_active: product.is_active,
        stock_quantity: product.stock_quantity || 0 // Default
    };
}

function mapDatabaseOrder(dbOrder: any): Order {
    return {
        id: dbOrder.id,
        items: dbOrder.order_items?.map((item: any) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.price_at_purchase,
            title: 'Product', // Need join to get name, or store snapshot
            variantId: 'default' // Placeholder
        })) || [],
        total: dbOrder.total_amount,
        date: dbOrder.created_at,
        customerName: dbOrder.guest_email || 'Customer',
        status: dbOrder.status
    } as Order;
}
