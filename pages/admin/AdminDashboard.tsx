import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Orders count & Sales
        const { count: ordersCount, data: orders } = await supabase
          .from('orders')
          .select('total_amount');

        // Customers count
        const { count: customersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const totalSales = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

        setStats({
          totalSales,
          totalOrders: ordersCount || 0,
          totalProducts: productsCount || 0,
          totalCustomers: customersCount || 0
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="row">
        <div className="col-12 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        {/* Total Sales */}
        <div className="col-xl-3 col-lg-6">
          <div className="card ic-chart-card">
            <div className="card-header d-block border-0 pb-0">
              <div className="d-flex justify-content-between">
                <h6 className="mb-0">Total Sales</h6>
                <span className="badge badge-sm badge-success light">
                  <DollarSign size={14} />
                </span>
              </div>
              <span className="data-value">₹{stats.totalSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="card-body p-0">
              <div style={{ height: '80px', width: '100%', opacity: 0.5 }} className="d-flex align-items-end px-3 pb-3">
                <div className="bg-success w-100" style={{ height: '40%', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-xl-3 col-lg-6">
          <div className="card ic-chart-card">
            <div className="card-header d-block border-0 pb-0">
              <div className="d-flex justify-content-between">
                <h6 className="mb-0">Total Orders</h6>
                <span className="badge badge-sm badge-info light">
                  <ShoppingBag size={14} />
                </span>
              </div>
              <span className="data-value">{stats.totalOrders}</span>
            </div>
            <div className="card-body p-0">
              <div style={{ height: '80px', width: '100%', opacity: 0.5 }} className="d-flex align-items-end px-3 pb-3">
                <div className="bg-info w-100" style={{ height: '50%', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Products (Replaces Market Share) */}
        <div className="col-xl-3 col-lg-6">
          <div className="card ic-chart-card">
            <div className="card-header d-block border-0 pb-0">
              <div className="d-flex justify-content-between">
                <h6 className="mb-0">Total Products</h6>
                <span className="badge badge-sm badge-warning light">
                  <Package size={14} />
                </span>
              </div>
              <span className="data-value">{stats.totalProducts}</span>
            </div>
            <div className="card-body p-0">
              <div style={{ height: '80px', width: '100%', opacity: 0.5 }} className="d-flex align-items-end px-3 pb-3">
                <div className="bg-warning w-100" style={{ height: '60%', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="col-xl-3 col-lg-6">
          <div className="card ic-chart-card">
            <div className="card-header d-block border-0 pb-0">
              <div className="d-flex justify-content-between">
                <h6 className="mb-0">Total Customers</h6>
                <span className="badge badge-sm badge-primary light">
                  <Users size={14} />
                </span>
              </div>
              <span className="data-value">{stats.totalCustomers}</span>
            </div>
            <div className="card-body p-0">
              <div style={{ height: '80px', width: '100%', opacity: 0.5 }} className="d-flex align-items-end px-3 pb-3">
                <div className="bg-primary w-100" style={{ height: '70%', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
