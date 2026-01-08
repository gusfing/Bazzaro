
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Heart } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { Product, ProductVariant } from '../types';

interface WishlistProps {
  wishlistProductIds: string[];
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  toggleWishlist: (productId: string, productTitle: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlistProductIds, onAddToCart, toggleWishlist, isWishlisted }) => {
  const wishlistProducts = MOCK_PRODUCTS.filter(p => wishlistProductIds.includes(p.id));

  return (
    <div className="relative w-full min-h-screen bg-brand-gray-950 flex flex-col">
      <div className="pt-24 px-8 lg:px-12 z-30">
        <Breadcrumbs />
        <header className="mt-4 mb-8 animate-reveal max-w-screen-xl mx-auto">
          <h1 className="font-serif text-4xl text-brand-gray-50 font-bold tracking-tighter">
            Your <span className="italic font-normal text-brand-gray-400">Wishlist</span>
          </h1>
        </header>
      </div>

      <div className="flex-grow px-6 lg:px-12 py-2 z-20 max-w-screen-xl mx-auto w-full">
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-96 text-brand-gray-500">
            <Heart size={48} className="opacity-20 stroke-1 mb-4" />
            <h2 className="font-serif text-2xl text-brand-gray-200 mb-2">Your Wishlist is Empty</h2>
            <p className="text-sm max-w-xs mb-6">Add items you love to your wishlist to keep track of them here.</p>
            <Link to="/shop" className="bg-brand-gray-50 text-brand-gray-950 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-white active:scale-95">
              Discover the Archive
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {wishlistProducts.map((p, idx) => (
              <div
                key={p.id}
                className={`${idx % 2 !== 0 ? 'mt-12' : ''} md:mt-0`}
                style={{
                  opacity: 0,
                  animation: 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  animationDelay: `${idx * 0.08}s`
                }}
              >
                <ProductCard product={p} onAddToCart={onAddToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted(p.id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;