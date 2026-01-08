
import React, { useState, useEffect, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS } from '../constants';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setSearchTerm(''), 300);
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return MOCK_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Fix: Extracted framer-motion props to an object to bypass type-checking errors.
  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    // FIX: Framer motion `ease` property expects a literal type, so we cast it.
    transition: { duration: 0.5, ease: 'easeInOut' as const }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...overlayAnimation}
          className="fixed inset-0 z-[90] bg-brand-gray-950/80 backdrop-blur-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 flex justify-between items-center">
             <div className="ui-card-light px-5 py-3.5 flex flex-col items-center justify-center leading-none">
                <img src="/BAZZARO DARK LOGO (1).png" alt="BAZZARO" className="h-4 w-auto object-contain" />
            </div>
            <button onClick={onClose} className="ui-card-light w-10 h-10 flex items-center justify-center active:scale-90 transition-transform shadow-xl">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="px-6 mt-4">
             <div className="relative">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gray-900/20" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for objects..."
                    autoFocus
                    className="w-full h-16 bg-brand-cloud text-brand-gray-900 rounded-2xl pl-16 pr-6 text-sm font-bold tracking-wide focus:outline-none placeholder:text-brand-gray-900/30"
                />
             </div>
          </div>
          
          {/* Results */}
          <div className="flex-grow overflow-y-auto p-6 mt-4 scrollbar-hide">
            {searchTerm && filteredProducts.length === 0 && (
                <div className="text-center text-brand-gray-500 pt-16">
                    <p>No results found for "{searchTerm}"</p>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                    <Link to={`/product/${product.slug}`} onClick={onClose} key={product.id} className="block group">
                        <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-brand-espresso">
                            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="text-brand-gray-50 text-xs font-bold mt-3 truncate">{product.title}</h3>
                        <p className="text-brand-gray-500 text-xs">${product.base_price.toFixed(2)}</p>
                    </Link>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;