
import React, { useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { X, Instagram, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const mainNav = [
    { label: 'Shop', path: '/shop' },
    { label: 'Design Your Own', path: '/custom-tote' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'About', path: '/about' },
    { label: 'Editorial', path: '/editorial' },
    { label: 'Contact', path: '/contact' },
    { label: 'Account', path: '/login' },
    { label: 'Admin', path: '/admin' },
  ];

  const secondaryNav = [ 
    { label: 'Boutiques', path: '/contact' },
    { label: 'Support', path: '/contact' },
    { label: 'Shipping', path: '/contact' },
    { label: 'Privacy', path: '/contact' } 
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const drawerVariants = {
    open: { x: 0 },
    closed: { x: '100%' },
  };
  
  const navItemsContainerVariants = {
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const navItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        // FIX: Framer motion `ease` property expects a specific tuple type for cubic-bezier, so we cast it.
        ease: [0.22, 1, 0.36, 1] as const
      }
    },
    closed: {
      y: 30,
      opacity: 0,
      transition: {
        duration: 0.5,
        // FIX: Framer motion `ease` property expects a specific tuple type for cubic-bezier, so we cast it.
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-brand-gray-950/70 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-brand-gray-950 z-[100] border-l border-brand-gray-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-brand-gray-800">
              <Link to="/" onClick={onClose}>
                <img 
                  src="/BAZZARO DARK LOGO (1).png" 
                  alt="BAZZARO" 
                  className="h-5 w-auto object-contain" 
                />
              </Link>
              <button onClick={onClose} className="p-2 text-brand-gray-400 hover:text-brand-gray-50 transition-colors" aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            {/* Main Navigation */}
            <motion.nav 
              variants={navItemsContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex-grow p-8 space-y-4"
            >
              {mainNav.map((item) => (
                <motion.div key={item.label} variants={navItemVariants}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="block text-2xl font-serif italic text-brand-gray-200 hover:text-brand-sand transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Footer */}
            <div className="p-8 border-t border-brand-gray-800">
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                    {secondaryNav.map((item) => (
                        <Link key={item.label} to={item.path} onClick={onClose} className="text-xs text-brand-gray-500 hover:text-brand-gray-50 transition-colors">
                            {item.label}
                        </Link>
                    ))}
                </div>
                <div className="flex gap-6 text-brand-gray-400">
                    <a href="#" aria-label="Instagram" className="hover:text-brand-gray-50 transition-colors cursor-pointer"><Instagram size={20} /></a>
                    <a href="#" aria-label="Twitter" className="hover:text-brand-gray-50 transition-colors cursor-pointer"><Twitter size={20} /></a>
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
