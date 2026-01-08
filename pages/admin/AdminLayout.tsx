
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Outlet, Link } = ReactRouterDOM as any;
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ArrowLeft } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-brand-gray-100 text-brand-gray-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white h-screen sticky top-0 border-r border-brand-gray-200 flex flex-col">
        <div className="p-6 border-b border-brand-gray-200">
          <h2 className="font-display text-2xl font-bold uppercase text-brand-gray-900">BAZZARO</h2>
          <span className="text-xs text-brand-gray-400 font-semibold tracking-wider">ADMIN PANEL</span>
        </div>
        <nav className="flex-grow mt-6">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive } : {isActive: boolean}) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-bold uppercase transition-colors ${
                  isActive
                    ? 'bg-brand-gray-100 border-r-4 border-brand-gray-900 text-brand-gray-900'
                    : 'text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-gray-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-brand-gray-200">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-gray-900 rounded-lg transition-colors">
                <ArrowLeft size={18} />
                Back to Store
            </Link>
            <Link to="/login" className="flex items-center gap-3 mt-2 px-4 py-3 text-sm font-bold uppercase text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-gray-900 rounded-lg transition-colors">
                <LogOut size={18} />
                Logout
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;