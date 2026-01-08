import React from 'react';
import { Package, Users, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; sub: string; icon: React.ReactNode }> = ({ title, value, sub, icon }) => (
  <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xs font-bold uppercase text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="p-2 bg-gray-50 rounded-full text-black">{icon}</div>
    </div>
    <p className="text-xs text-green-600 font-medium">{sub}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-screen sticky top-0 border-r border-gray-200 hidden lg:block">
           <div className="p-6">
             <h2 className="font-display text-2xl font-bold uppercase">Admin Panel</h2>
           </div>
           <nav className="mt-6">
             <a href="#" className="flex items-center gap-3 px-6 py-3 bg-gray-100 border-r-4 border-black font-bold text-sm uppercase">
                <TrendingUp size={18} /> Dashboard
             </a>
             <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-sm uppercase transition-colors">
                <Package size={18} /> Products
             </a>
             <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-sm uppercase transition-colors">
                <ShoppingCart size={18} /> Orders
             </a>
             <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-black font-medium text-sm uppercase transition-colors">
                <Users size={18} /> Customers
             </a>
           </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
           <div className="flex justify-between items-center mb-8">
             <h1 className="text-2xl font-bold uppercase">Dashboard Overview</h1>
             <div className="flex gap-2">
                <button className="bg-black text-white px-4 py-2 text-sm font-bold uppercase">Export Reports</button>
             </div>
           </div>

           {/* Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <StatCard title="Total Sales" value="$12,450.00" sub="+15% from last month" icon={<TrendingUp size={20} />} />
             <StatCard title="Active Orders" value="45" sub="12 pending processing" icon={<ShoppingCart size={20} />} />
             <StatCard title="Low Stock" value="3 Items" sub="Restock needed immediately" icon={<AlertCircle size={20} />} />
           </div>

           {/* Recent Orders Table */}
           <div className="bg-white border border-gray-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold uppercase text-sm">Recent Orders</h3>
                 <button className="text-xs font-bold uppercase underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                       <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       <tr>
                          <td className="px-6 py-4 font-mono">#ORD-2931</td>
                          <td className="px-6 py-4 font-bold">Alex Doe</td>
                          <td className="px-6 py-4 text-gray-500">Oct 24, 2023</td>
                          <td className="px-6 py-4">$145.00</td>
                          <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-bold uppercase rounded-sm">Processing</span></td>
                       </tr>
                       <tr>
                          <td className="px-6 py-4 font-mono">#ORD-2930</td>
                          <td className="px-6 py-4 font-bold">Sarah Smith</td>
                          <td className="px-6 py-4 text-gray-500">Oct 23, 2023</td>
                          <td className="px-6 py-4">$89.50</td>
                          <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-bold uppercase rounded-sm">Shipped</span></td>
                       </tr>
                       <tr>
                          <td className="px-6 py-4 font-mono">#ORD-2929</td>
                          <td className="px-6 py-4 font-bold">Mike Jordan</td>
                          <td className="px-6 py-4 text-gray-500">Oct 23, 2023</td>
                          <td className="px-6 py-4">$210.00</td>
                          <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-bold uppercase rounded-sm">Delivered</span></td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;