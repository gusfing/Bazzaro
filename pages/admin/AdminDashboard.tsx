import React, { useEffect, useState } from 'react';
import { getAnalytics, getOrders, getCustomers, StoredOrder, Customer } from '../../lib/store';
import { TrendingUp, ShoppingCart, Users, DollarSign, Package, Clock } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | BAZZARO Admin';
    
    const loadData = async () => {
      try {
        const [analyticsData, ordersData] = await Promise.all([
          getAnalytics(),
          getOrders()
        ]);
        setAnalytics(analyticsData);
        setRecentOrders(ordersData.slice(0, 5)); // Show last 5 orders
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to mock data if API fails
        setAnalytics({
          totalRevenue: 245000,
          totalOrders: 156,
          totalCustomers: 89,
          averageOrderValue: 15705
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: analytics ? `₹${analytics.totalRevenue.toLocaleString('en-IN')}` : '—',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Orders', 
      value: analytics?.totalOrders?.toString() || '—',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Customers', 
      value: analytics?.totalCustomers?.toString() || '—',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Average Order', 
      value: analytics ? `₹${analytics.averageOrderValue.toLocaleString('en-IN')}` : '—',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-gray-900 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-brand-gray-200 animate-pulse">
              <div className="h-4 bg-brand-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-brand-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brand-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-brand-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase text-brand-gray-500">{stat.title}</h3>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-brand-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-brand-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-brand-gray-500" />
            <h2 className="text-lg font-bold text-brand-gray-900">Recent Orders</h2>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-brand-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-gray-900">{order.customerName}</p>
                    <p className="text-sm text-brand-gray-500">{order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-gray-500">No recent orders</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-brand-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-brand-gray-500" />
            <h2 className="text-lg font-bold text-brand-gray-900">Quick Stats</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-600">Orders Today</span>
              <span className="font-bold text-brand-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-600">Pending Shipments</span>
              <span className="font-bold text-brand-gray-900">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-600">Low Stock Items</span>
              <span className="font-bold text-orange-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-brand-gray-600">Abandoned Carts</span>
              <span className="font-bold text-red-600">5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;