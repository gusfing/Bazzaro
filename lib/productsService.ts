import { ProductsService } from './database_supabase';
import { uploadImage } from './supabase';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// Initialize products (No-op for Supabase as we don't want to auto-seed every time, or we can make it checking count)
export const initializeProducts = async (): Promise<void> => {
  // Optional: Check if empty and seed
  const products = await ProductsService.getAll();
  if (products.length === 0) {
    console.log('Seeding initial products...');
    for (const product of MOCK_PRODUCTS) {
      await ProductsService.create(product);
    }
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return ProductsService.getAll();
};

// Get active products only
export const getActiveProducts = async (): Promise<Product[]> => {
  const all = await ProductsService.getAll();
  return all.filter(p => p.is_active);
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  return ProductsService.getById(id);
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return ProductsService.getBySlug(slug);
};

// Upload image to Supabase Storage
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  const url = await uploadImage(file, 'product-images');
  if (!url) throw new Error('Image upload failed');
  return url;
};

// Add new product
export const addProduct = async (
  productData: Omit<Product, 'id'>,
  imageFile?: File
): Promise<string> => {
  let imageUrl = productData.image_url;

  // We need ID to upload image if we want folder structure, but for now we upload first or generic
  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile, 'new-product');
  }

  return ProductsService.create({
    ...productData,
    image_url: imageUrl
  });
};

// Update product
export const updateProduct = async (
  id: string,
  productData: Partial<Product>,
  imageFile?: File
): Promise<void> => {
  let updates = { ...productData };

  if (imageFile) {
    const imageUrl = await uploadProductImage(imageFile, id);
    updates.image_url = imageUrl;
  }

  return ProductsService.update(id, updates);
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  return ProductsService.delete(id);
};

// Search products
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const allProducts = await getAllProducts();
  const term = searchTerm.toLowerCase();

  return allProducts.filter(product =>
    product.title.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term) ||
    product.tags?.some(tag => tag.toLowerCase().includes(term))
  );
};
