
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { User, Package, LogOut } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const mockOrders = [
  { id: '#ORD-2931', date: 'Oct 24, 2023', total: 145.00, status: 'Processing' },
  { id: '#ORD-2819', date: 'Sep 12, 2023', total: 320.00, status: 'Delivered' },
  { id: '#ORD-2755', date: 'Aug 30, 2023', total: 89.50, status: 'Delivered' },
];

const Account: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray-100 text-brand-gray-900 pt-24">
      <Breadcrumbs />
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="font-serif text-5xl italic animate-reveal">
            My Archive
          </h1>
          <p className="text-brand-gray-500 animate-reveal" style={{ animationDelay: '0.2s' }}>Welcome back, Alex.</p>
        </header>

        <div className="space-y-12">
          {/* Account Details */}
          <section className="animate-reveal" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Account Details</h2>
            <div className="bg-white p-8 rounded-[2rem] border border-brand-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gray-400">Name</span>
                <span className="font-medium">Alex Doe</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gray-400">Email</span>
                <span className="font-medium">alex.doe@example.com</span>
              </div>
              <button className="w-full text-center mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-brand-tan hover:text-brand-gray-900 transition-colors">Edit Details</button>
            </div>
          </section>

          {/* Order History */}
          <section className="animate-reveal" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Order History</h2>
            <div className="bg-white p-6 rounded-[2rem] border border-brand-gray-200 shadow-sm space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center border-b border-brand-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-gray-100 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-brand-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold font-mono text-sm">{order.id}</p>
                      <p className="text-xs text-brand-gray-400">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-serif italic text-lg">${order.total.toFixed(2)}</p>
                    <p className={`text-xs font-bold ${order.status === 'Processing' ? 'text-yellow-600' : 'text-green-600'}`}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-8 animate-reveal" style={{ animationDelay: '0.8s' }}>
            <Link to="/login" className="w-full flex items-center justify-center gap-3 text-center text-xs font-bold uppercase tracking-widest text-brand-gray-400 hover:text-brand-gray-900 transition-colors">
              <LogOut size={14} />
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;