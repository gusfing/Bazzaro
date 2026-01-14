import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, StoredOrder } from '../../lib/store';
import { Package, Search, Filter, ChevronDown } from 'lucide-react';

type OrderStatusFilter = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Manage Orders | BAZZARO Admin';
    loadOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order =>
        order.customerName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Fallback to empty array
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as StoredOrder['status'] }
          : order
      ));
      setOpenDropdown(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions: OrderStatusFilter[] = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-gray-900 mb-8">Orders</h1>
        <div className="bg-white p-6 rounded-xl border border-brand-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-brand-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-brand-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Orders</h1>
          <p className="text-sm text-brand-gray-500 mt-1">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={18} className="text-brand-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none text-sm text-brand-gray-900 placeholder-brand-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-brand-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatusFilter)}
              className="border border-brand-gray-200 rounded-lg px-3 py-2 text-sm text-brand-gray-700 outline-none focus:border-brand-gray-400"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-brand-gray-200 rounded-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-brand-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-brand-gray-700 mb-2">No Orders Found</h3>
            <p className="text-brand-gray-500">
              {orders.length === 0
                ? 'No orders have been placed yet.'
                : 'No orders match your current filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-brand-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-brand-gray-900">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-brand-gray-900 block">{order.customerName}</span>
                        {order.email && <span className="text-xs text-brand-gray-500">{order.email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-gray-600">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-brand-gray-600">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-gray-900">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                          className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md flex items-center gap-1 ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                          <ChevronDown size={14} />
                        </button>
                        {openDropdown === order.id && (
                          <div className="absolute z-10 mt-1 right-0 bg-white border border-brand-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(order.id, status)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-brand-gray-50 ${order.status === status ? 'font-bold text-brand-gray-900' : 'text-brand-gray-600'
                                  }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;