import React, { useEffect, useState } from 'react';
import { OrdersService } from '../../lib/database_supabase';
import { Order, OrderStatus } from '../../types';
import { Eye, Trash2 } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await OrdersService.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.DELIVERED: return <span className="badge badge-success">Delivered</span>;
      case OrderStatus.PROCESSING: return <span className="badge badge-warning">Processing</span>;
      case OrderStatus.SHIPPED: return <span className="badge badge-primary">Shipped</span>;
      case OrderStatus.CANCELLED: return <span className="badge badge-danger">Cancelled</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Order List</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
              <table className="table table-responsive-md">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}><strong>#</strong></th>
                    <th><strong>ORDER ID</strong></th>
                    <th><strong>DATE</strong></th>
                    <th><strong>CUSTOMER</strong></th>
                    <th><strong>TOTAL</strong></th>
                    <th><strong>STATUS</strong></th>
                    <th><strong>ACTION</strong></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={order.id}>
                      <td><strong>{i + 1}</strong></td>
                      <td>#{order.id.substring(0, 8)}...</td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.customerName}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>{getStatusBadge(order.status as OrderStatus || order.status)}</td>
                      <td>
                        <div className="d-flex">
                          <button className="btn btn-primary shadow btn-xs sharp me-1">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">No recent orders.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
