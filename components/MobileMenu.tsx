
import React, { useEffect, useState } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { X, Instagram, Twitter } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mainNav = [
    { label: 'Archive', path: '/shop' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'About', path: '/about' },
    { label: 'Editorial', path: '/editorial' },
    { label: 'Contact', path: '/contact' },
    { label: 'Admin', path: '/admin' },
  ];

  const secondaryNav = [ 'Boutiques', 'Support', 'Shipping', 'Privacy' ];

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      setMousePos({ x: clientX, y: clientY });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchstart', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchstart', handleMove);
    };
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-700 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 liquid-glass transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
      
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isOpen ? 'opacity-20' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(240, 238, 233, 0.35), transparent 40%)`
        }}
      />

      <div className={`relative z-10 px-6 py-6 flex justify-between items-center transition-all duration-700 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="ui-card-light px-5 py-3.5 flex flex-col items-center justify-center leading-none">
          <img 
            src="BAZZARO DARK LOGO (1).png" 
            alt="BAZZARO" 
            className="h-4 w-auto object-contain" 
          />
        </div>
        <button onClick={onClose} className="ui-card-light w-10 h-10 flex items-center justify-center active:scale-90 transition-transform shadow-xl">
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      <div className="relative z-10 px-8 pt-12 flex flex-col gap-1">
        {mainNav.map((item, idx) => (
          <Link key={item.label} to={item.path} onClick={onClose} className={`group flex items-baseline gap-4 transition-all duration-700 ${isOpen ? 'animate-reveal-left-blur stagger-' + (idx + 1) : 'opacity-0'}`}>
            <span className="text-[10px] font-black text-brand-gray-50/40 group-hover:text-brand-gray-50 transition-colors font-mono">0{idx + 1}</span>
            <span className="nav-text-heavy block text-[15vw] md:text-[64px] hover:translate-x-2 transition-transform cursor-pointer">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div className={`absolute bottom-12 left-0 w-full px-8 space-y-10 transition-all duration-1000 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex flex-wrap gap-2">
          {secondaryNav.map((label) => (
            <button key={label} className="bg-brand-gray-50/10 backdrop-blur-md border border-brand-gray-50/5 rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-gray-50/60 hover:text-brand-gray-50 transition-all">
              {label}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-end border-t border-brand-gray-50/5 pt-8">
          <div className="space-y-1">
            <span className="text-brand-cloud text-[9px] font-black uppercase tracking-[0.4em] block">Exclusive Drop</span>
            <h4 className="text-brand-gray-50 font-serif italic text-lg tracking-tight">Winter '25 Collection Available</h4>
          </div>
          <div className="flex gap-4 text-brand-gray-400">
            <Instagram size={18} className="hover:text-brand-gray-50 transition-colors cursor-pointer" />
            <Twitter size={18} className="hover:text-brand-gray-50 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;