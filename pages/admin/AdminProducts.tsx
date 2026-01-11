
import React, { useEffect } from 'react';
import { MOCK_PRODUCTS } from '../../constants';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminProducts: React.FC = () => {
  useEffect(() => {
    document.title = 'Manage Products | BAZZARO Admin';
  }, []);
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase text-brand-gray-900">Products</h1>
        <button className="bg-brand-gray-900 text-brand-gray-50 px-4 py-2 text-sm font-bold uppercase rounded-lg hover:bg-brand-gray-800 transition-colors flex items-center gap-2">
          <PlusCircle size={16} /> New Product
        </button>
      </div>

      <div className="bg-white border border-brand-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-100">
              {MOCK_PRODUCTS.map(product => {
                const primaryVariant = product.variants[0];
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock_quantity, 0);
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image_url} alt={product.title} className="w-10 h-10 object-cover rounded-md" />
                        <span className="font-bold text-brand-gray-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-brand-gray-600">{primaryVariant?.sku || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-brand-gray-900">₹{product.base_price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${totalStock > 10 ? 'text-green-600' : totalStock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {totalStock} in stock
                      </span>
                      <span className="text-brand-gray-500 text-xs"> for {product.variants.length} variants</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-brand-gray-400 hover:text-brand-gray-900 hover:bg-brand-gray-100 rounded-md transition-colors"><Edit size={16} /></button>
                        <button className="p-2 text-brand-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
