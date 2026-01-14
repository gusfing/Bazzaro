
import React, { useState } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Link } = ReactRouterDOM as any;
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft,
  History, Tag, Settings, BarChart3, Menu, X
} from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Abandonment', path: '/admin/cart-abandonment', icon: History },
  ];

  return (
    <div className="min-h-screen bg-brand-gray-50 text-brand-gray-800 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-brand-gray-200"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-brand-gray-200 flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-brand-gray-200">
          <h2 className="font-display text-2xl font-bold uppercase text-brand-gray-900">BAZZARO</h2>
          <span className="text-xs text-brand-gray-400 font-semibold tracking-wider">ADMIN PANEL</span>
        </div>
        <nav className="flex-grow mt-4 px-3 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-4 py-3 mb-1 text-sm font-bold rounded-xl transition-all ${isActive
                  ? 'bg-brand-gray-900 text-white shadow-lg'
                  : 'text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-gray-200 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900 rounded-xl transition-all"
          >
            <ArrowLeft size={20} />
            Back to Store
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {children || (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-brand-gray-900">Welcome to Admin Panel</h1>
            <p className="text-brand-gray-500 mt-2">Select a section from the sidebar to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLayout;