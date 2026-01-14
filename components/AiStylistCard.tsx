
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { motion } from 'framer-motion';
import { Product } from '../types';

interface AiStylistCardProps {
  product: Product;
}

const AiStylistCard: React.FC<AiStylistCardProps> = ({ product }) => {
  return (
    <Link to={`/products/${product.slug}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="aspect-[3/4] bg-brand-gray-800 rounded-lg overflow-hidden mb-3 relative">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            loading="lazy"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-gray-200 group-hover:text-brand-sand transition-colors truncate">
          {product.title}
        </h4>
        <p className="text-xs text-brand-gray-500 font-mono">${product.base_price.toFixed(2)}</p>
      </motion.div>
    </Link>
  );
};

export default AiStylistCard;
