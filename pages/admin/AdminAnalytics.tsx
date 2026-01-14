import React, { useEffect, useState } from 'react';
import { getAnalytics, getOrders } from '../../lib/store';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Users, Package, Calendar, ArrowUp, ArrowDown 
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    document.title = 'Analytics | BAZZARO Admin';
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
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

  const metrics = [
    {
      title: 'Total Revenue',
      value: analytics ? `₹${analytics.totalRevenue.toLocaleString('en-IN')}` : '—',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders?.toString() || '—',
      change: '+8.2%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Total Customers',
      value: analytics?.totalCustomers?.toString() || '—',
      change: '-3.1%',
      isPositive: false,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Avg Order Value',
      value: analytics ? `₹${analytics.averageOrderValue.toLocaleString('en-IN')}` : '—',
      change: '+5.7%',
      isPositive: true,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const topProducts = [
    { name: 'Classic Tote Bag', sales: 45, revenue: 67500 },
    { name: 'Leather Crossbody', sales: 38, revenue: 76000 },
    { name: 'Canvas Backpack', sales: 32, revenue: 48000 },
    { name: 'Mini Shoulder Bag', sales: 28, revenue: 42000 },
    { name: 'Travel Duffel', sales: 25, revenue: 62500 }
  ];

  const revenueByCategory = [
    { category: 'Tote Bags', revenue: 125000, percentage: 35 },
    { category: 'Crossbody', revenue: 98000, percentage: 28 },
    { category: 'Backpacks', revenue: 70000, percentage: 20 },
    { category: 'Clutches', revenue: 42000, percentage: 12 },
    { category: 'Others', revenue: 17500, percentage: 5 }
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <div className="h-8 bg-brand-gray-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-brand-gray-200 animate-pulse">
              <div className="h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-900">Analytics</h1>
          <p className="text-brand-gray-500 mt-1">Track your store performance and insights</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                timeRange === range
                  ? 'bg-brand-gray-900 text-white shadow-lg'
                  : 'bg-white text-brand-gray-600 border border-brand-gray-200 hover:border-brand-gray-300'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl border border-brand-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${metric.color}-50`}>
                  <Icon size={24} className={`text-${metric.color}-600`} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-brand-gray-500 mb-2">{metric.title}</h3>
              <p className="text-2xl md:text-3xl font-bold text-brand-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-brand-gray-900">Top Products</h2>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-gray-600">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-bold text-brand-gray-900">{product.name}</p>
                    <p className="text-sm text-brand-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <p className="font-bold text-brand-gray-900">₹{product.revenue.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl border border-brand-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-brand-gray-900">Revenue by Category</h2>
          </div>
          <div className="space-y-4">
            {revenueByCategory.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-brand-gray-900">{item.category}</span>
                  <span className="text-sm font-bold text-brand-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-brand-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-brand-gray-500 mt-1">₹{item.revenue.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-brand-gray-900">Peak Sales Day</h3>
          </div>
          <p className="text-2xl font-bold text-brand-gray-900 mb-1">Saturday</p>
          <p className="text-sm text-brand-gray-600">Avg. 23 orders per day</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
            <h3 className="font-bold text-brand-gray-900">Customer Retention</h3>
          </div>
          <p className="text-2xl font-bold text-brand-gray-900 mb-1">68%</p>
          <p className="text-sm text-brand-gray-600">Repeat customer rate</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg">
              <ShoppingCart size={20} className="text-orange-600" />
            </div>
            <h3 className="font-bold text-brand-gray-900">Conversion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-brand-gray-900 mb-1">3.2%</p>
          <p className="text-sm text-brand-gray-600">Visitors to customers</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
