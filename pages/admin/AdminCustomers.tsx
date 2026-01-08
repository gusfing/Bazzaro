
import React from 'react';
import { Mail, Phone } from 'lucide-react';

const mockCustomers = [
  { id: 'u1', name: 'Alex Doe', email: 'alex.doe@example.com', totalOrders: 3, totalSpent: 554.50 },
  { id: 'u2', name: 'Sarah Smith', email: 'sarah.s@example.com', totalOrders: 1, totalSpent: 89.50 },
  { id: 'u3', name: 'Mike Jordan', email: 'mike.j@example.com', totalOrders: 5, totalSpent: 1250.00 },
  { id: 'u4', name: 'Jane Foster', email: 'jane.foster@example.com', totalOrders: 2, totalSpent: 890.00 },
  { id: 'u5', name: 'Chris Evans', email: 'chris.e@example.com', totalOrders: 1, totalSpent: 120.00 },
];

const AdminCustomers: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase text-brand-gray-900">Customers</h1>
      </div>

      <div className="bg-white border border-brand-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4 text-right">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-100">
              {mockCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-brand-gray-900">{customer.name}</div>
                    <div className="text-xs text-brand-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-brand-gray-700">{customer.totalOrders}</td>
                  <td className="px-6 py-4 font-bold text-brand-gray-900">${customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <a href={`mailto:${customer.email}`} className="p-2 text-brand-gray-400 hover:text-brand-gray-900 hover:bg-brand-gray-100 rounded-md transition-colors"><Mail size={16} /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;