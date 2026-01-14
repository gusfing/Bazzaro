
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import {
  Plus, Search, Filter, Edit2, Trash2, Eye,
  Package, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import AddProductModal from '../../components/admin/AddProductModal';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  initializeProducts
} from '../../lib/productsService';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    document.title = 'Manage Products | BAZZARO Admin';
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, statusFilter, stockFilter]);

  const loadProducts = async () => {
    try {
      // Initialize products if needed
      await initializeProducts();

      // Load all products
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let result = products;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(p =>
        statusFilter === 'active' ? p.is_active : !p.is_active
      );
    }

    // Stock filter
    if (stockFilter !== 'all') {
      result = result.filter(p => {
        const totalStock = p.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
        if (stockFilter === 'out-of-stock') return totalStock === 0;
        if (stockFilter === 'low-stock') return totalStock > 0 && totalStock <= 10;
        if (stockFilter === 'in-stock') return totalStock > 10;
        return true;
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
    if (stock <= 10) return { label: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle };
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'slug' | 'variants'>) => {
    try {
      setIsLoading(true);

      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, newProduct);
      } else {
        // Add new product
        const productWithSlug = {
          ...newProduct,
          slug: newProduct.title.toLowerCase().replace(/\s+/g, '-'),
          variants: []
        };
        await addProduct(productWithSlug);
      }

      // Reload products
      await loadProducts();
      setIsAddModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await deleteProduct(productId);
        alert('Product deleted successfully!');
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewProduct = (product: Product) => {
    window.open(`/product/${product.slug}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="h-8 bg-brand-gray-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-brand-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-900">Products</h1>
          <p className="text-brand-gray-500 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-gray-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-brand-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 flex items-center gap-3 px-4 py-2 bg-brand-gray-50 rounded-xl">
            <Search size={20} className="text-brand-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-brand-gray-900 placeholder-brand-gray-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-brand-gray-50 border-none rounded-xl text-brand-gray-700 font-medium outline-none focus:ring-2 focus:ring-brand-gray-300"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-4 py-2 bg-brand-gray-50 border-none rounded-xl text-brand-gray-700 font-medium outline-none focus:ring-2 focus:ring-brand-gray-300"
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-gray-200 p-12 text-center">
          <Package size={64} className="mx-auto text-brand-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-brand-gray-700 mb-2">No Products Found</h3>
          <p className="text-brand-gray-500">
            {products.length === 0 ? 'Start by adding your first product.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-gray-50 border-b border-brand-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-gray-600">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-gray-600">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-brand-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-brand-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {filteredProducts.map(product => {
                  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
                  const stockStatus = getStockStatus(totalStock);
                  const StockIcon = stockStatus.icon;

                  return (
                    <tr key={product.id} className="hover:bg-brand-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-xl border border-brand-gray-200"
                          />
                          <div>
                            <p className="font-bold text-brand-gray-900">{product.title}</p>
                            <p className="text-sm text-brand-gray-500">{product.variants?.length || 0} variants</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-brand-gray-900">
                          ₹{(product.base_price || 0).toLocaleString('en-IN')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${stockStatus.bg}`}>
                          <StockIcon size={16} className={stockStatus.color} />
                          <span className={`font-bold text-sm ${stockStatus.color}`}>
                            {totalStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg ${product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-brand-gray-600 hover:bg-brand-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onAddProduct={handleAddProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default AdminProducts;
