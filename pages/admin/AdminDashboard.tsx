import React, { useEffect, useState } from 'react';
import { getAnalytics, getOrders, StoredOrder } from '../../lib/store';
import {
  TrendingUp, ShoppingCart, Users, DollarSign, Package,
  Clock, AlertCircle, ArrowUp, ArrowDown, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string; sub?: string; icon: any; color: string; bgColor: string; trend?: { value: number; isPositive: boolean } }> = ({ title, value, sub, icon: Icon, color, bgColor, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 hover:shadow-lg hover:border-brand-gray-300 transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon size={24} className={color} strokeWidth={2.5} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {trend.value}%
        </div>
      )}
    </div>
    <h3 className="text-sm font-semibold uppercase text-brand-gray-500 tracking-wide mb-2">
      {title}
    </h3>
    <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">{value}</p>
    {sub && <p className="text-xs text-brand-gray-400 mt-2">{sub}</p>}
  </div>
);

interface StatCard {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: { value: number; isPositive: boolean };
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<StoredOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard | BAZZARO Admin';
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, ordersData] = await Promise.all([
        getAnalytics(),
        getOrders()
      ]);
      setAnalytics(analyticsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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

  const statCards: StatCard[] = [
    {
      title: 'Total Revenue',
      value: analytics ? `₹${analytics.totalRevenue.toLocaleString('en-IN')}` : '—',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders?.toString() || '—',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Total Customers',
      value: analytics?.totalCustomers?.toString() || '—',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: { value: 3.1, isPositive: false }
    },
    {
      title: 'Average Order',
      value: analytics ? `₹${analytics.averageOrderValue.toLocaleString('en-IN')}` : '—',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: { value: 5.7, isPositive: true }
    },
  ];


  const quickStats = [
    { label: 'Orders Today', value: '12', color: 'text-blue-600' },
    { label: 'Pending Shipments', value: '8', color: 'text-yellow-600' },
    { label: 'Low Stock Items', value: '3', color: 'text-orange-600' },
    { label: 'Abandoned Carts', value: '5', color: 'text-red-600' },
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <div className="h-8 bg-brand-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-brand-gray-100 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-brand-gray-200 animate-pulse">
              <div className="h-4 bg-brand-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-brand-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-900">Dashboard</h1>
        <p className="text-brand-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-brand-gray-200 hover:shadow-lg hover:border-brand-gray-300 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} strokeWidth={2.5} />
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {stat.trend.value}%
                </div>
              )}
            </div>
            <h3 className="text-sm font-semibold uppercase text-brand-gray-500 tracking-wide mb-2">
              {stat.title}
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-gray-200 overflow-hidden">
          <div className="p-6 border-b border-brand-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-brand-gray-900">Recent Orders</h2>
              </div>
              <Link
                to="/admin/orders"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <Eye size={16} />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-brand-gray-50 hover:bg-brand-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-brand-gray-200">
                        <Package size={18} className="text-brand-gray-600" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-gray-900">{order.customerName}</p>
                        <p className="text-sm text-brand-gray-500">{order.items.length} items · {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-gray-900 mb-1">₹{order.total.toLocaleString('en-IN')}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
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
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-brand-gray-300 mb-3" />
                <p className="text-brand-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats & Alerts */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-brand-gray-900">Quick Stats</h2>
            </div>
            <div className="space-y-4">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-brand-gray-600 font-medium">{stat.label}</span>
                  <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-lg">
                <AlertCircle size={20} className="text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-brand-gray-900">Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-orange-100">
                <p className="text-sm font-semibold text-orange-900">3 products low on stock</p>
                <p className="text-xs text-orange-700 mt-1">Restock soon to avoid stockouts</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-red-100">
                <p className="text-sm font-semibold text-red-900">5 abandoned carts</p>
                <p className="text-xs text-red-700 mt-1">Send recovery emails to customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
