
import React, { useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link, Navigate } = ReactRouterDOM as any;
import { CheckCircle, Star } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessProps {
  order: Order | null;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ order }) => {

  useEffect(() => {
    if (order) {
      const pageTitle = `Order ${order.id} Confirmed | BAZZARO`;
      const pageDescription = 'Thank you for your purchase. Your order has been placed successfully and is being processed.';
      
      document.title = pageTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', window.location.href);
      }
    }
  }, [order]);

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
          
          {order.creditsEarned && order.creditsEarned > 0 && (
             <div className="bg-brand-tan/10 border border-brand-tan/20 p-4 rounded-2xl flex items-center justify-center gap-4 mb-8 animate-reveal" style={{animationDelay: '0.1s'}}>
                 <Star size={18} className="text-brand-tan" />
                 <p className="text-xs font-bold text-brand-sepia">
                     You've earned <span className="font-serif italic text-base">₹{order.creditsEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> in credits for your next purchase!
                 </p>
             </div>
          )}

          <div className="bg-white p-6 rounded-3xl border border-brand-gray-200 shadow-sm text-left space-y-4 mb-12 animate-reveal" style={{animationDelay: '0.2s'}}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-gray-400 mb-2">Order Summary</h2>
              {order.items.map(item => (
                  <div key={item.variantId} className="flex justify-between items-center text-sm">
                      <div>
                          <p className="font-bold">{item.title}</p>
                          <p className="text-xs text-brand-gray-500">{item.color} / {item.size}</p>
                      </div>
                      <span className="font-medium">₹{item.price.toLocaleString('en-IN')} x {item.quantity}</span>
                  </div>
              ))}
              <div className="border-t border-brand-gray-200 pt-4">
                  {order.walletCreditUsed && order.walletCreditUsed > 0 && (
                    <div className="flex justify-between items-center text-sm mb-2 text-brand-success">
                        <span>Wallet Credit Used</span>
                        <span>-₹{order.walletCreditUsed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total Paid</span>
                      <span>₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
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
