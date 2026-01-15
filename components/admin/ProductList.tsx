
import React from 'react';
import { Product } from '../../types';
import {
    Edit2, Trash2, Eye, AlertTriangle, CheckCircle, XCircle, Search, Package
} from 'lucide-react';

interface ProductListProps {
    products: Product[];
    isLoading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onView: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading, onEdit, onDelete, onView }) => {
    const [filter, setFilter] = React.useState('');

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
        if (stock <= 10) return { label: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle };
        return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.category_id?.toLowerCase().includes(filter.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Table Header / Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    />
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Showing {filteredProducts.length} products
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No products found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(product => {
                                const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
                                const stockStatus = getStockStatus(totalStock);
                                const StockIcon = stockStatus.icon;

                                return (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Package size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                                                    <p className="text-xs text-gray-500">{product.variants?.length || 0} variants</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{product.base_price.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.bg.replace('50', '50/50')} border-${stockStatus.color.split('-')[1]}-200/50`}>
                                                <StockIcon size={12} className={stockStatus.color} />
                                                <span className={stockStatus.color}>{totalStock} in stock</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {product.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => onView(product)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => onEdit(product)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => onDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductList;
