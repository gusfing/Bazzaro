
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { Product, Bundle } from '../types';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

interface BundleDisplayProps {
  bundle: Bundle;
  allProducts: Product[];
  onAddBundle: (productIds: string[], bundleTitle: string) => void;
}

const BundleDisplay: React.FC<BundleDisplayProps> = ({ bundle, allProducts, onAddBundle }) => {
  const bundleProducts = bundle.productIds
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (bundleProducts.length !== bundle.productIds.length) {
    return null; // Don't render if a product is missing
  }

  const originalTotal = bundleProducts.reduce((acc, p) => acc + p.base_price, 0);

  return (
    <div className="my-12 py-8 border-y border-brand-gray-800">
      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400 mb-6">
        Complete the Look
      </h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Product Images */}
        <div className="flex items-center -space-x-8">
          {bundleProducts.map((product, index) => (
            <Link key={product.id} to={`/products/${product.slug}`} className="group relative">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-24 h-24 object-cover rounded-full bg-brand-gray-800 border-4 border-brand-gray-950 transition-all duration-300 group-hover:scale-110 group-hover:z-10"
                style={{ zIndex: bundleProducts.length - index }}
              />
            </Link>
          ))}
        </div>

        {/* Details */}
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-serif italic text-xl text-brand-gray-50 mb-1">{bundle.title}</h4>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <span className="font-serif italic text-lg text-brand-gray-500 line-through">
              ₹{originalTotal.toLocaleString('en-IN')}
            </span>
            <span className="font-serif italic text-2xl text-brand-sand">
              ₹{bundle.bundle_price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => onAddBundle(bundle.productIds, bundle.title)}
            className="bg-brand-tan text-brand-gray-950 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-white active:scale-95 flex items-center gap-2"
          >
            Add Bundle to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleDisplay;
