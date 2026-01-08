
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link, Navigate } = ReactRouterDOM as any;
import { CheckCircle } from 'lucide-react';
import { CartItem } from '../types';

interface Order {
    id: string;
    items: CartItem[];
    total: number;
    date: string;
}

interface OrderSuccessProps {
  order: Order | null;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ order }) => {

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-gray-100 text-brand-gray-900 pt-24 flex flex-col">
      <div className="px-8 py-12 text-center flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-xl">
          <div className="animate-reveal">
            <CheckCircle size={48} className="mx-auto text-brand-success mb-6" />
            <h1 className="font-serif text-4xl italic mb-4">
              Thank You
            </h1>
            <p className="text-brand-gray-600 mb-2">Your order has been placed successfully.</p>
            <p className="font-bold font-mono text-lg mb-8">{order.id}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-gray-200 shadow-sm text-left space-y-4 mb-12 animate-reveal" style={{animationDelay: '0.2s'}}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-gray-400 mb-2">Order Summary</h2>
              {order.items.map(item => (
                  <div key={item.variantId} className="flex justify-between items-center text-sm">
                      <div>
                          <p className="font-bold">{item.title}</p>
                          <p className="text-xs text-brand-gray-500">{item.color} / {item.size}</p>
                      </div>
                      <span className="font-medium">${item.price.toFixed(2)} x {item.quantity}</span>
                  </div>
              ))}
              <div className="border-t border-brand-gray-200 pt-4 flex justify-between items-center font-bold text-lg">
                  <span>Total Paid</span>
                  <span>${order.total.toFixed(2)}</span>
              </div>
          </div>

          <div className="animate-reveal" style={{animationDelay: '0.4s'}}>
              <Link to="/shop" className="bg-brand-gray-900 text-brand-gray-50 px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-brand-gray-800 active:scale-95 inline-block">
                  Continue Shopping
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;