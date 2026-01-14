# Admin Panel & Frontend Connection

## Overview
The admin panel and frontend are now connected through Firebase Firestore, allowing real-time synchronization of product data.

## What Was Implemented

### 1. Products Service (`lib/productsService.ts`)
Created a centralized service to manage all product operations:
- `getAllProducts()` - Fetch all products from Firestore
- `getActiveProducts()` - Fetch only active products
- `getProductById()` - Get single product by ID
- `getProductBySlug()` - Get product by slug for URLs
- `addProduct()` - Add new product with image upload
- `updateProduct()` - Update existing product
- `deleteProduct()` - Remove product
- `uploadProductImage()` - Upload images to Firebase Storage
- `initializeProducts()` - Initialize Firestore with mock data on first run

### 2. Updated Components

#### Admin Panel (`pages/admin/AdminProducts.tsx`)
- Now uses Firestore instead of local state
- Products added/edited in admin are saved to Firebase
- Changes reflect immediately across the app

#### Shop Page (`pages/Shop.tsx`)
- Loads products from Firestore
- Displays only active products
- Auto-initializes with mock data if database is empty

#### Home Page (`pages/Home.tsx`)
- Fetches featured products from Firestore
- Shows real-time product updates

## How It Works

1. **First Load**: When the app starts, it checks if Firestore has products
2. **Initialization**: If empty, it populates with MOCK_PRODUCTS data
3. **Admin Changes**: Any product added/edited/deleted in admin panel saves to Firestore
4. **Frontend Updates**: Shop and Home pages load products from Firestore
5. **Image Storage**: Product images are uploaded to Firebase Storage

## Data Flow

```
Admin Panel → Firebase Firestore → Frontend Pages
     ↓              ↓                    ↓
  Add/Edit      Storage Layer        Display
  Delete        (Cloud Database)     Products
```

## Benefits

✅ **Real-time Sync**: Changes in admin appear immediately on frontend
✅ **Persistent Data**: Products saved in cloud database
✅ **Image Storage**: Product images stored in Firebase Storage
✅ **Scalable**: Can handle thousands of products
✅ **Offline Support**: Firebase provides offline caching

## Testing

1. Go to admin panel: http://localhost:3000/admin/products
2. Add a new product
3. Visit shop page: http://localhost:3000/shop
4. Your new product should appear!

## Environment Variables Required

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

All these are already configured in your `.env.local` file.
