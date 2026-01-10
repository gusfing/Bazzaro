
import React, { useState, useMemo, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams } = ReactRouterDOM as any;
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { Product, ProductVariant } from '../types';

interface ShopProps {
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  toggleWishlist: (productId: string, productTitle: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const PRODUCTS_PER_PAGE = 8;

const Shop: React.FC<ShopProps> = ({ onAddToCart, toggleWishlist, isWishlisted }) => {
  const [searchParams] = useSearchParams();
  
  const activeCategorySlug = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(activeCategorySlug || null);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  
  const activeCategory = useMemo(() => MOCK_CATEGORIES.find(c => c.slug === selectedCategory), [selectedCategory]);

  useEffect(() => {
    const pageTitle = `${activeCategory ? activeCategory.name : 'The Collection'} | BAZZARO`;
    const pageDescription = `Explore the full archive of BAZZARO objects of desire. Timeless design and artisanal craft in every piece.`;
    
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, [selectedCategory, activeCategory]);

  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];
    if (selectedCategory) {
      const cat = MOCK_CATEGORIES.find(c => c.slug === selectedCategory);
      if (cat) products = products.filter(p => p.category_id === cat.id);
    }
    return products;
  }, [selectedCategory]);

  useEffect(() => {
    // Reset visible count when category changes
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [selectedCategory]);
  
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + PRODUCTS_PER_PAGE);
  };

  const canLoadMore = visibleCount < filteredProducts.length;

  return (
    <div className="relative w-full min-h-screen bg-brand-gray-950 flex flex-col">
      <div className="relative h-64 md:h-80 bg-brand-espresso w-full pt-24">
        <img src={activeCategory?.image_url || 'https://images.unsplash.com/photo-1599371300803-344436254b42?auto=format&fit=crop&q=80&w=1920'} alt={activeCategory?.name || 'The Collection'} className="absolute inset-0 w-full h-full object-cover opacity-30"/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-brand-gray-50 z-10 p-4 pt-24">
          <h1 className="font-serif text-5xl italic">{activeCategory?.name || 'The Collection'}</h1>
          <p className="mt-2 text-sm text-brand-gray-300">Designed for repeat use, not occasions.</p>
        </div>
      </div>

      <div className="px-8 lg:px-12 z-30">
        <Breadcrumbs />

        <div className="flex justify-between items-end mt-4 max-w-screen-xl mx-auto">
          <div className="opacity-0 animate-reveal">
            <h1 className="font-serif text-4xl text-brand-gray-50 font-bold tracking-tighter">
              The <span className="italic font-normal text-brand-gray-400">Collection</span>
            </h1>
          </div>
          <div className="hidden xs:flex flex-col items-end opacity-0 animate-reveal stagger-1">
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-gray-500">{filteredProducts.length} Objects Total</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide py-1 pointer-events-auto max-w-screen-xl mx-auto">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all border ${!selectedCategory ? 'bg-brand-gray-50 border-brand-gray-50 text-brand-gray-950 shadow-lg' : 'bg-brand-gray-50/5 border-brand-gray-50/10 text-brand-gray-400 hover:border-brand-gray-50/20'}`}
          >
            All
          </button>
          {MOCK_CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition-all border ${selectedCategory === cat.slug ? 'bg-brand-gray-50 border-brand-gray-50 text-brand-gray-950 shadow-lg' : 'bg-brand-gray-50/5 border-brand-gray-50/10 text-brand-gray-400 hover:border-brand-gray-50/20'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow px-6 lg:px-12 py-8 z-20 max-w-screen-xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {visibleProducts.map((p, idx) => (
            <div 
              key={p.id}
              className={`${idx % 2 !== 0 ? 'mt-12' : ''} md:mt-0`}
            >
              <ProductCard product={p} onAddToCart={onAddToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted(p.id)} />
            </div>
          ))}
        </div>
        {canLoadMore && (
          <div className="mt-16 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-brand-gray-50/10 border border-brand-gray-50/20 text-brand-gray-50 h-14 px-10 rounded-full font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-brand-gray-50/20"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;