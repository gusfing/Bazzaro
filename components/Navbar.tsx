
import React, { useState, useEffect, useRef } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
// Fix: Removed file extensions from local component imports
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';

interface NavbarProps {
  cartCount: number;
  isBannerVisible: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, isBannerVisible }) => {
  const [scrolled, setScrolled] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust scroll trigger based on whether the banner is visible
      const scrollThreshold = isBannerVisible ? 90 : 50;
      setScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBannerVisible]);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <>
      <nav className={`fixed left-0 w-full z-[60] transition-all duration-700 pt-6 px-6 lg:px-12 ${isBannerVisible ? 'top-10' : 'top-0'} ${scrolled ? 'opacity-95 -translate-y-1' : ''}`}>
        <div className="flex justify-between items-center w-full max-w-screen-2xl mx-auto">
          
          {/* Logo Section */}
          <Link to="/" className="ui-card-light px-6 py-4 flex items-center justify-center shadow-2xl active:scale-95 transition-transform">
            <img 
              src="/BAZZARO DARK LOGO (1).png" 
              alt="BAZZARO" 
              className="h-4 md:h-5 w-auto object-contain" 
            />
          </Link>

          {/* Actions Section */}
          <div className="flex gap-2 items-center">
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="ui-card-light w-11 h-11 flex items-center justify-center active:scale-90 shadow-xl"
            >
              <Search size={18} strokeWidth={2} />
            </button>
            <Link to="/login" className="ui-card-light w-11 h-11 flex items-center justify-center active:scale-90 shadow-xl">
              <User size={18} strokeWidth={2} />
            </Link>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="ui-card-light w-11 h-11 flex items-center justify-center active:scale-90 shadow-xl"
            >
              <Menu size={18} strokeWidth={2} />
            </button>
            <Link 
              to="/cart" 
              className={`ui-card-light px-3.5 h-11 flex items-center gap-3 active:scale-90 transition-all shadow-xl ${animateCart ? 'bg-brand-sand text-brand-gray-950' : ''}`}
            >
              <ShoppingBag size={18} strokeWidth={2} className={animateCart ? 'animate-bounce' : ''} />
              <div className="bg-brand-gray-900 text-brand-gray-50 min-w-[1.6rem] h-6 px-1.5 rounded-md flex items-center justify-center text-[10px] font-black shadow-inner">
                {cartCount}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;