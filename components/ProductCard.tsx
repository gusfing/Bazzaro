
import React, { useState, useEffect, useMemo } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Heart, ArrowUpRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductVariant } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  toggleWishlist: (productId: string, productTitle: string) => void;
  isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, toggleWishlist, isWishlisted }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState(product.image_url);

  useEffect(() => {
    // Reset image when mouse leaves the card
    if (!isHovered) {
      setActiveImageUrl(product.image_url);
    }
  }, [isHovered, product.image_url]);

  const stockStatus = useMemo(() => {
    const totalStock = product.variants.reduce((acc, v) => acc + v.stock_quantity, 0);
    if (totalStock > 10) return { text: 'In Stock', color: 'bg-brand-success', textColor: 'text-brand-gray-400' };
    if (totalStock > 0) return { text: 'Low Stock', color: 'bg-brand-warning', textColor: 'text-brand-warning' };
    return { text: 'Out of Stock', color: 'bg-brand-error', textColor: 'text-brand-error' };
  }, [product.variants]);

  const variantImages = useMemo(() => {
    const images = [product.image_url, ...product.other_images];
    return product.variants.map((variant, index) => ({
      ...variant,
      imageUrl: images[index] || product.image_url, // Fallback to main image
    }));
  }, [product]);

  const uniqueColorVariants = useMemo(() => {
    // This is to prevent rendering multiple dots for the same color if variants differ by size only
    const seen = new Set();
    return variantImages.filter(v => {
      if (!v.hex || seen.has(v.hex)) {
        return false;
      }
      seen.add(v.hex);
      return true;
    });
  }, [variantImages]);

  const newBadgeMotionProps = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.5, duration: 0.5 },
  };

  const imageMotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
// FIX: Framer motion `ease` property expects a literal type, so we cast it.
    transition: { opacity: { duration: 0.4, ease: "easeOut" as const } },
  };

  return (
    <motion.div 
      className="break-inside-avoid block group relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id, product.title);
        }}
        className={`absolute top-6 right-6 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-xl border ${
          isWishlisted 
            ? 'bg-brand-gray-50 border-brand-gray-50 text-brand-gray-950 scale-110 shadow-2xl' 
            : 'bg-brand-gray-950/40 border-brand-gray-50/10 text-brand-gray-50 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90'
        }`}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={1.5} />
      </button>

      <Link to={`/product/${product.slug}`} className="relative block">
        {/* New Badge */}
        {product.is_new && (
          <motion.div
            {...newBadgeMotionProps}
            className="absolute top-6 left-6 z-30 bg-brand-gray-50 text-brand-gray-950 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em]"
          >
            New
          </motion.div>
        )}

        <div className="relative rounded-[3rem] overflow-hidden bg-brand-gray-900 shadow-2xl aspect-[2/3] transition-all duration-700 border border-brand-gray-800">
          
          <div 
            className={`absolute inset-0 bg-brand-gray-900 transition-opacity duration-1000 z-10 pointer-events-none ${
              imageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-tr from-transparent via-brand-gray-50/5 to-transparent animate-pulse" />
          </div>

          <AnimatePresence>
            <motion.img 
              key={activeImageUrl}
              src={activeImageUrl} 
              alt={product.title} 
              onLoad={() => { if(activeImageUrl === product.image_url) setImageLoaded(true) }}
              {...imageMotionProps}
              style={{ scale: isHovered ? 1.1 : 1, transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              className="absolute inset-0 w-full h-full object-cover will-change-transform grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" 
              loading="lazy" 
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-b from-brand-gray-950/10 via-transparent to-brand-gray-950/90 opacity-40 group-hover:opacity-80 transition-opacity"></div>
          <div className={`absolute inset-0 bg-brand-gray-950 transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`} />

          <div className="absolute inset-x-4 bottom-4 z-20">
            <motion.div 
              className="bg-brand-gray-950/40 text-brand-gray-50 rounded-[2.5rem] p-6 border border-brand-gray-50/10 shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              <div className="relative z-10">
                <AnimatePresence initial={false}>
                  {imageLoaded ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight mb-1.5 truncate">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[9px] font-mono tracking-tighter">
                            <div className="flex items-center gap-2 text-brand-gray-400">
                              <Star size={10} className="text-brand-tan fill-brand-tan" />
                              <span>{product.rating?.toFixed(1)} / 5.0</span>
                            </div>
                            <div className="w-px h-2 bg-brand-gray-50/10"></div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${stockStatus.color}`} />
                              <span className={`${stockStatus.textColor}`}>{stockStatus.text}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end">
                          <span className="text-2xl font-serif italic leading-none">${product.base_price}</span>
                        </div>
                      </div>

                      <div className="border-t border-brand-gray-50/10 pt-4 mt-4 h-10 flex items-center">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex gap-2.5 items-center">
                            {uniqueColorVariants.slice(0, 3).map((v) => (
                              <div 
                                key={v.id}
                                onMouseEnter={() => setActiveImageUrl(v.imageUrl)}
                                className="w-3.5 h-3.5 rounded-full border border-brand-gray-50/20 shadow-inner transition-transform hover:scale-125 cursor-pointer"
                                style={{ backgroundColor: v.hex || '#333' }}
                                title={v.color}
                              />
                            ))}
                          </div>
                          
                          <div className="w-10 h-10 rounded-full bg-brand-gray-900 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-tan">
                            <ArrowUpRight size={16} className="text-brand-gray-50" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="skeleton">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-4 space-y-2">
                            <div className="h-3 bg-brand-gray-800/80 rounded w-3/4 animate-pulse"></div>
                            <div className="flex gap-4">
                                <div className="h-2 bg-brand-gray-800/80 rounded w-16 animate-pulse"></div>
                                <div className="h-2 bg-brand-gray-800/80 rounded w-12 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <div className="h-5 bg-brand-gray-800/80 rounded w-12 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="border-t border-brand-gray-50/10 pt-4 mt-4 h-10 flex items-center">
                          <div className="flex justify-between items-center w-full">
                              <div className="flex gap-2.5 items-center">
                                  <div className="w-3.5 h-3.5 rounded-full bg-brand-gray-800/80 animate-pulse"></div>
                                  <div className="w-3.5 h-3.5 rounded-full bg-brand-gray-800/80 animate-pulse"></div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-brand-gray-800/80 animate-pulse"></div>
                          </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
