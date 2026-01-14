import React, { useEffect, useState } from 'react';
import { getCoupons, createCoupon, deleteCoupon, Coupon } from '../../lib/store';
import { Tag, Plus, Search, Trash2, X, Percent, DollarSign } from 'lucide-react';

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minPurchase: 0,
    maxUses: 0,
    expiresAt: ''
  });

  useEffect(() => {
    document.title = 'Manage Coupons | BAZZARO Admin';
    loadCoupons();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredCoupons(coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(query) ||
        coupon.description.toLowerCase().includes(query)
      ));
    } else {
      setFilteredCoupons(coupons);
    }
  }, [coupons, searchQuery]);

  const loadCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.description || newCoupon.discountValue <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const couponData = {
        ...newCoupon,
        code: newCoupon.code.toUpperCase(),
        usedCount: 0,
        isActive: true,
        minPurchase: newCoupon.minPurchase || undefined,
        maxUses: newCoupon.maxUses || undefined,
        expiresAt: newCoupon.expiresAt || undefined
      };

      await createCoupon(couponData);
      await loadCoupons();
      setIsModalOpen(false);
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minPurchase: 0,
        maxUses: 0,
        expiresAt: ''
      });
    } catch (error) {
      console.error('Failed to create coupon:', error);
      alert('Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await deleteCoupon(couponId);
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-gray-900 mb-8">Coupons</h1>
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
          <h1 className="text-2xl font-bold text-brand-gray-900">Coupons</h1>
          <p className="text-sm text-brand-gray-500 mt-1">{coupons.length} coupons</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-gray-900 text-brand-gray-50 px-4 py-2 text-sm font-bold rounded-lg hover:bg-brand-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Coupon
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray-200 mb-6">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-brand-gray-400" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none text-sm text-brand-gray-900 placeholder-brand-gray-400"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-brand-gray-200 rounded-xl overflow-hidden">
        {filteredCoupons.length === 0 ? (
          <div className="p-12 text-center">
            <Tag size={48} className="mx-auto text-brand-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-brand-gray-700 mb-2">No Coupons Found</h3>
            <p className="text-brand-gray-500">
              {coupons.length === 0
                ? 'No coupons have been created yet.'
                : 'No coupons match your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Min. Purchase</th>
                  <th className="px-6 py-4">Usage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {filteredCoupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-brand-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-brand-gray-900 bg-brand-gray-100 px-2 py-1 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-gray-600 max-w-[200px] truncate">
                      {coupon.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-brand-gray-900">
                        {coupon.discountType === 'percentage' ? (
                          <>
                            <Percent size={14} />
                            {coupon.discountValue}%
                          </>
                        ) : (
                          <>₹{coupon.discountValue}</>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-gray-600">
                      {coupon.minPurchase ? `₹${coupon.minPurchase.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-brand-gray-600">
                      {coupon.usedCount || 0}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${coupon.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                        }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-gray-900">Create Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-brand-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="SUMMER20"
                  className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="20% off summer collection"
                  className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-gray-700 mb-1">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-gray-700 mb-1">Value *</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    placeholder="20"
                    className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-brand-gray-700 mb-1">Min. Purchase</label>
                  <input
                    type="number"
                    value={newCoupon.minPurchase || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, minPurchase: Number(e.target.value) }))}
                    placeholder="₹1000"
                    className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={newCoupon.maxUses || ''}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUses: Number(e.target.value) }))}
                    placeholder="100"
                    className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-gray-700 mb-1">Expires At</label>
                <input
                  type="date"
                  value={newCoupon.expiresAt}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full border border-brand-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-brand-gray-200 rounded-lg text-sm font-bold text-brand-gray-700 hover:bg-brand-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="flex-1 px-4 py-2 bg-brand-gray-900 text-white rounded-lg text-sm font-bold hover:bg-brand-gray-800 transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
