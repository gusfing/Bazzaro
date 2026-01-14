import React, { useEffect, useState } from 'react';
import { getAbandonedCarts, updateAbandonedCartStatus, removeAbandonedCart } from '../../lib/store';
import { AbandonedCart } from '../../types';
import { ShoppingCart, Clock, Phone, Send, Trash2, ChevronDown } from 'lucide-react';

const AdminCartAbandonment: React.FC = () => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Cart Abandonment | BAZZARO Admin';
    loadCarts();
  }, []);

  const loadCarts = async () => {
    try {
      const data = await getAbandonedCarts();
      setCarts(data);
    } catch (error) {
      console.error('Failed to load abandoned carts:', error);
      setCarts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (cartId: string, newStatus: AbandonedCart['status']) => {
    try {
      await updateAbandonedCartStatus(cartId, newStatus);
      setCarts(prev => prev.map(cart =>
        cart.id === cartId
          ? { ...cart, status: newStatus }
          : cart
      ));
      setOpenDropdown(null);
    } catch (error) {
      console.error('Failed to update cart status:', error);
    }
  };

  const handleSendReminder = async (cart: AbandonedCart) => {
    // For now, just update the status to "Reminder Sent"
    await handleStatusChange(cart.id, 'Reminder Sent');
    alert(`Reminder sent to ${cart.customerPhone}`);
  };

  const handleDeleteCart = async (cartId: string) => {
    if (!confirm('Are you sure you want to remove this abandoned cart?')) return;

    try {
      await removeAbandonedCart(cartId);
      setCarts(prev => prev.filter(c => c.id !== cartId));
    } catch (error) {
      console.error('Failed to delete cart:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reminder Sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-gray-900 mb-8">Cart Abandonment</h1>
        <div className="bg-white p-6 rounded-xl border border-brand-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-brand-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-brand-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalValue = carts.reduce((sum, cart) => sum + cart.totalValue, 0);
  const pendingCount = carts.filter(c => c.status === 'Pending').length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Cart Abandonment</h1>
          <p className="text-sm text-brand-gray-500 mt-1">
            {carts.length} abandoned carts · ₹{totalValue.toLocaleString('en-IN')} potential revenue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-brand-gray-200">
          <p className="text-sm text-brand-gray-500 font-medium">Total Abandoned</p>
          <p className="text-2xl font-bold text-brand-gray-900">{carts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-gray-200">
          <p className="text-sm text-brand-gray-500 font-medium">Pending Follow-up</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-gray-200">
          <p className="text-sm text-brand-gray-500 font-medium">Potential Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-white border border-brand-gray-200 rounded-xl overflow-hidden">
        {carts.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart size={48} className="mx-auto text-brand-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-brand-gray-700 mb-2">No Abandoned Carts</h3>
            <p className="text-brand-gray-500">
              Great news! There are no abandoned carts at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {carts.map(cart => (
                  <tr key={cart.id} className="hover:bg-brand-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-gray-900">{cart.customerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-brand-gray-600">
                        <Phone size={14} />
                        <span>{cart.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {cart.items.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="text-brand-gray-600 text-xs">
                            {item.title} × {item.quantity}
                          </span>
                        ))}
                        {cart.items.length > 2 && (
                          <span className="text-brand-gray-400 text-xs">
                            +{cart.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-gray-900">
                      ₹{cart.totalValue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-brand-gray-500">
                        <Clock size={14} />
                        <span>{formatTimeAgo(cart.lastActive)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenDropdown(openDropdown === cart.id ? null : cart.id)}
                          className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md flex items-center gap-1 ${getStatusColor(cart.status)}`}
                        >
                          {cart.status}
                          <ChevronDown size={14} />
                        </button>
                        {openDropdown === cart.id && (
                          <div className="absolute z-10 mt-1 right-0 bg-white border border-brand-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                            {(['Pending', 'Reminder Sent'] as const).map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(cart.id, status)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-brand-gray-50 ${cart.status === status ? 'font-bold text-brand-gray-900' : 'text-brand-gray-600'
                                  }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendReminder(cart)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Send Reminder"
                        >
                          <Send size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCart(cart.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
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

export default AdminCartAbandonment;