import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Order processing function
export const processOrder = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;

    try {
      // Update analytics
      await admin.firestore().collection('analytics').doc('overview').update({
        totalOrders: admin.firestore.FieldValue.increment(1),
        totalRevenue: admin.firestore.FieldValue.increment(order.total)
      });

      // Log order for admin tracking
      console.log(`New order processed: ${orderId}`, {
        customer: order.customerName,
        total: order.total,
        items: order.items.length
      });

    } catch (error) {
      console.error('Order processing failed:', error);
    }
  });

// Inventory management function
export const updateInventory = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();

    try {
      const batch = admin.firestore().batch();

      for (const item of order.items) {
        const productRef = admin.firestore().collection('products').doc(item.productId);
        const productDoc = await productRef.get();
        
        if (productDoc.exists) {
          const product = productDoc.data()!;
          const variant = product.variants.find((v: any) => v.id === item.variantId);
          
          if (variant) {
            const newStock = Math.max(0, variant.stock_quantity - item.quantity);
            
            // Update variant stock
            const updatedVariants = product.variants.map((v: any) => 
              v.id === item.variantId ? { ...v, stock_quantity: newStock } : v
            );
            
            batch.update(productRef, { variants: updatedVariants });

            // Log low stock warning
            if (newStock <= 5 && newStock > 0) {
              console.warn(`Low stock alert: ${product.title} - ${newStock} remaining`);
            }
          }
        }
      }

      await batch.commit();

    } catch (error) {
      console.error('Inventory update failed:', error);
    }
  });

// Customer creation function
export const createCustomerProfile = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.firestore().collection('customers').add({
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'Customer',
      phone: user.phoneNumber || null,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActive: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Customer profile created for: ${user.email}`);

  } catch (error) {
    console.error('Customer profile creation failed:', error);
  }
});

// Analytics function
export const updateAnalytics = functions.pubsub
  .schedule('0 0 * * *') // Run daily at midnight
  .onRun(async (context) => {
    try {
      const [ordersSnapshot, customersSnapshot] = await Promise.all([
        admin.firestore().collection('orders').get(),
        admin.firestore().collection('customers').get()
      ]);

      const orders = ordersSnapshot.docs.map(doc => doc.data());
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const totalCustomers = customersSnapshot.size;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      await admin.firestore().collection('analytics').doc('overview').set({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log('Analytics updated successfully');

    } catch (error) {
      console.error('Analytics update failed:', error);
    }
  });

// Contact form handler (stores in database, no email sending)
export const handleContactForm = functions.https.onCall(async (data, context) => {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    // Save to database
    await admin.firestore().collection('contactForms').add({
      name,
      email,
      subject,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'new'
    });

    console.log(`Contact form submitted by: ${name} (${email})`);

    return { success: true };

  } catch (error) {
    console.error('Contact form handling failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process contact form');
  }
});