import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../../constants';
import { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AdminProducts: Component mounted');
    document.title = 'Manage Products | BAZZARO Admin';
    
    // Directly use MOCK_PRODUCTS for now
    setTimeout(() => {
      console.log('AdminProducts: Loading MOCK_PRODUCTS', MOCK_PRODUCTS.length);
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-gray-900">Products</h1>
        <p className="text-brand-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Products</h1>
          <p className="text-sm text-brand-gray-500 mt-1">{products.length} total products</p>
        </div>
        <button className="bg-brand-gray-900 text-brand-gray-50 px-4 py-2 text-sm font-bold rounded-lg hover:bg-brand-gray-800 transition-colors">
          Add Product
        </button>
      </div>

      <div className="bg-white border border-brand-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-100">
              {products.map(product => {
                const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
                return (
                  <tr key={product.id} className="hover:bg-brand-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image_url} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                        <div>
                          <span className="font-bold text-brand-gray-900 block">{product.title}</span>
                          <span className="text-xs text-brand-gray-500">{product.variants?.length || 0} variants</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-gray-900">₹{(product.base_price || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${totalStock > 10 ? 'text-green-600' : totalStock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;