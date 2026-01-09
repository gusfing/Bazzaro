
import React, { useEffect } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode }> = ({ title, value, sub, icon }) => (
  <div className="bg-white p-6 border border-brand-gray-200 rounded-lg shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xs font-bold uppercase text-brand-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1 text-brand-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-brand-gray-100 rounded-full text-brand-gray-900">{icon}</div>
    </div>
    <p className="text-xs text-brand-success font-medium">{sub}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    document.title = 'Admin Dashboard | BAZZARO';
  }, []);
  
  return (
    <div className="p-8">
       <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold uppercase text-brand-gray-900">Dashboard Overview</h1>
         <div className="flex gap-2">
            <button className="bg-brand-gray-900 text-brand-gray-50 px-4 py-2 text-sm font-bold uppercase rounded-lg hover:bg-brand-gray-800 transition-colors">Export Reports</button>
         </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatCard title="Total Sales" value="$12,450.00" sub="+15% from last month" icon={<TrendingUp size={20} />} />
         <StatCard title="Active Orders" value="45" sub="12 pending processing" icon={<ShoppingCart size={20} />} />
         <StatCard title="Low Stock" value="3 Items" sub="Restock needed immediately" icon={<AlertCircle size={20} />} />
       </div>

       {/* Recent Orders Table */}
       <div className="bg-white border border-brand-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-brand-gray-200 flex justify-between items-center">
             <h3 className="font-bold uppercase text-sm text-brand-gray-900">Recent Orders</h3>
             <button className="text-xs font-bold uppercase text-brand-gray-900 underline">View All</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-brand-gray-50 text-brand-gray-500 font-medium uppercase text-xs">
                   <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-100">
                   <tr>
                      <td className="px-6 py-4 font-mono text-brand-gray-600">#ORD-2931</td>
                      <td className="px-6 py-4 font-bold text-brand-gray-900">Alex Doe</td>
                      <td className="px-6 py-4 text-brand-gray-500">Oct 24, 2023</td>
                      <td className="px-6 py-4 font-bold text-brand-gray-900">$145.00</td>
                      <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-bold uppercase rounded-sm">Processing</span></td>
                   </tr>
                   <tr>
                      <td className="px-6 py-4 font-mono text-brand-gray-600">#ORD-2930</td>
                      <td className="px-6 py-4 font-bold text-brand-gray-900">Sarah Smith</td>
                      <td className="px-6 py-4 text-brand-gray-500">Oct 23, 2023</td>
                      <td className="px-6 py-4 font-bold text-brand-gray-900">$89.50</td>
                      <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-800 px-2 py-1 text-xs font-bold uppercase rounded-sm">Shipped</span></td>
                   </tr>
                   <tr>
                      <td className="px-6 py-4 font-mono text-brand-gray-600">#ORD-2929</td>
                      <td className="px-6 py-4 font-bold text-brand-gray-900">Mike Jordan</td>
                      <td className="px-6 py-4 text-brand-gray-500">Oct 23, 2023</td>
                      <td className="px-6 py-4 font-bold text-brand-gray-900">$210.00</td>
                      <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-bold uppercase rounded-sm">Delivered</span></td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
