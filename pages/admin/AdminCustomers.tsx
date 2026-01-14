import React, { useEffect, useState } from 'react';
import { getCustomers, Customer } from '../../lib/store';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Manage Customers | BAZZARO Admin';
    loadCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredCustomers(customers.filter(customer =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query))
      ));
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchQuery]);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-gray-900 mb-8">Customers</h1>
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
          <h1 className="text-2xl font-bold text-brand-gray-900">Customers</h1>
          <p className="text-sm text-brand-gray-500 mt-1">{customers.length} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray-200 mb-6">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-brand-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none text-sm text-brand-gray-900 placeholder-brand-gray-400"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-brand-gray-200 rounded-xl overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-brand-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-brand-gray-700 mb-2">No Customers Found</h3>
            <p className="text-brand-gray-500">
              {customers.length === 0
                ? 'No customers have registered yet.'
                : 'No customers match your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-brand-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gray-200 flex items-center justify-center">
                          <span className="font-bold text-brand-gray-600 text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-bold text-brand-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-brand-gray-600">
                          <Mail size={14} />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-brand-gray-500">
                            <Phone size={14} />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-gray-900">{customer.totalOrders || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-brand-gray-900">
                        ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-brand-gray-600">
                        <Calendar size={14} />
                        <span className="text-sm">{formatDate(customer.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-gray-500 text-sm">
                      {formatDate(customer.lastActive)}
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

export default AdminCustomers;