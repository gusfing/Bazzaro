
import React, { useState } from 'react';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const mockOrdersData = [
  { id: '#ORD-2931', customer: 'Alex Doe', date: 'Oct 24, 2023', total: 145.00, status: 'Processing' as OrderStatus },
  { id: '#ORD-2930', customer: 'Sarah Smith', date: 'Oct 23, 2023', total: 89.50, status: 'Shipped' as OrderStatus },
  { id: '#ORD-2929', customer: 'Mike Jordan', date: 'Oct 23, 2023', total: 210.00, status: 'Delivered' as OrderStatus },
  { id: '#ORD-2928', customer: 'Jane Foster', date: 'Oct 22, 2023', total: 450.00, status: 'Delivered' as OrderStatus },
  { id: '#ORD-2927', customer: 'Chris Evans', date: 'Oct 21, 2023', total: 120.00, status: 'Cancelled' as OrderStatus },
];

const statusColors: { [key in OrderStatus]: string } = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-brand-gray-200 text-brand-gray-800',
};

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState(mockOrdersData);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold uppercase text-brand-gray-900">Orders</h1>
      </div>

      <div className="bg-white border border-brand-gray-200 rounded-lg overflow-hidden">
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
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-mono text-brand-gray-600">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-brand-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-brand-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-brand-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                     <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold uppercase rounded-sm border-none focus:ring-0 ${statusColors[order.status]}`}
                     >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                     </select>
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

export default AdminOrders;