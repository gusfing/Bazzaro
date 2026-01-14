
import React, { useState, useEffect, useRef } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation } = ReactRouterDOM as any;
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
// Fix: Removed file extensions from local component imports
import SearchOverlay from './SearchOverlay';

interface NavbarProps {
  cartCount: number;
  isBannerVisible: boolean;
  onCartClick: () => void;
  onMenuClick: () => void;
  currentUser: FirebaseUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, isBannerVisible, onCartClick, onMenuClick, currentUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Custom Tote', path: '/custom-tote' },
    { label: 'Editorial', path: '/editorial' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const headerClasses = `
    fixed left-0 w-full z-[60] transition-all duration-500
    ${isBannerVisible ? 'top-10' : 'top-0'}
    ${scrolled || !isHomePage ? 'bg-brand-gray-950/80 backdrop-blur-lg border-b border-brand-gray-800 shadow-xl' : 'bg-transparent border-b border-transparent'}
  `;
  
  const contentWrapperClasses = `
    flex justify-between items-center w-full max-w-screen-xl mx-auto px-6 lg:px-12 py-4
  `;

  return (
    <>
      <header className={headerClasses}>
        <div className={contentWrapperClasses}>
          {/* Left: Logo */}
          <Link to="/" className="shrink-0">
            <img 
              src="/BAZZARO DARK LOGO (1).png" 
              alt="BAZZARO" 
              className="h-5 w-auto object-contain" 
            />
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gray-300 hover:text-brand-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-brand-gray-300 hover:text-brand-gray-50 transition-colors"
              aria-label="Open search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link to={currentUser ? "/account" : "/login"} className="hidden lg:block text-brand-gray-300 hover:text-brand-gray-50 transition-colors" aria-label="Account">
              <User size={20} strokeWidth={1.5} />
            </Link>
            
            <button 
              onClick={onMenuClick}
              className="lg:hidden text-brand-gray-300 hover:text-brand-gray-50 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            
            <button 
              onClick={onCartClick}
              className="flex items-center gap-2 text-brand-gray-300 hover:text-brand-gray-50 transition-colors"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.div
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-2 bg-brand-sand text-brand-gray-950 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
