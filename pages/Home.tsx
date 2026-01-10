
import React, { useState, useEffect, useCallback, useRef } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Instagram, Layers, Eye, Box, Scissors, Droplets, MoveRight, ChevronLeft, ChevronRight } from 'lucide-react';
// Fix: Removed file extensions from local component imports
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_INSTAGRAM_POSTS, MOCK_BLOG_POSTS, MOCK_VIDEO_REELS } from '../constants';
import ProductCard from '../components/ProductCard';
import ImageGridScroller from '../components/ImageGridScroller';
import BrandStorySection from '../components/BrandStorySection';
import { Product, ProductVariant } from '../types';
import VideoReelScroller from '../components/VideoReelScroller';
import BannerGrid from '../components/BannerGrid';

interface HomeProps {
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  toggleWishlist: (productId: string, productTitle: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const Home: React.FC<HomeProps> = ({ onAddToCart, toggleWishlist, isWishlisted }) => {
  useEffect(() => {
    const pageTitle = 'Bazzaro | Objects of Desire';
    const pageDescription = 'A curated archive where architectural precision meets timeless form. Each piece is a quiet statement, crafted for the discerning individual.';
    
    document.title = pageTitle;
    
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.origin);
    }
  }, []);
  
  const featuredProducts = MOCK_PRODUCTS.slice(0, 8);
  const featuredSatchel = MOCK_PRODUCTS.find(p => p.slug === 'sculptural-satchel');

  const gridImageSets = [
    [ // First page/grid
        { id: 'g1', url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800', alt: 'A person holding a black leather bag' },
        { id: 'g2', url: 'https://images.unsplash.com/photo-1559563458-52792b35588f?auto=format&fit=crop&q=80&w=800', alt: 'A woman in a stylish outfit with a handbag' },
        { id: 'g3', url: 'https://images.unsplash.com/photo-1572196285227-31238b165434?auto=format&fit=crop&q=80&w=800', alt: 'Close-up of a designer bag on a chair' },
        { id: 'g4', url: 'https://images.unsplash.com/photo-1599371300803-344436254b42?auto=format&fit=crop&q=80&w=800', alt: 'A collection of luxury bags on display' },
    ],
    [ // Second page/grid
        { id: 'g5', url: 'https://images.unsplash.com/photo-1579631383387-9257007567b5?auto=format&fit=crop&q=80&w=800', alt: 'Stylish woman with a bag' },
        { id: 'g6', url: 'https://images.unsplash.com/photo-1612199103986-2800c8b6a35a?auto=format&fit=crop&q=80&w=800', alt: 'A handbag on a textured surface' },
        { id: 'g7', url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800', alt: 'A brown tote bag' },
        { id: 'g8', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', alt: 'A cream colored tote bag' },
    ]
  ];
  const gridCaption = "Designed to fit into real days. Our objects are companions for life in motion, blending seamlessly with the rhythm of your routine.";
  
  const bannerData = [
    {
      subtitle: 'The Collection',
      title: 'Shop The Archive',
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      linkPath: '/shop'
    },
    {
      subtitle: 'The Atelier',
      title: 'Design Your Own',
      imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800',
      linkPath: '/custom-tote'
    }
  ];

  return (
    <div className="w-full overflow-hidden bg-brand-gray-950">
      
      {/* NEW HERO SECTION */}
      <section className="h-screen w-full bg-brand-gray-950 text-brand-gray-50 relative flex items-end justify-start">
        <div className="absolute inset-0 bg-brand-gray-950/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1576426863848-c2b6fd34342a?auto=format&fit=crop&q=80&w=1920"
          alt="Bazzaro Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 p-8 lg:p-16 mb-8 lg:mb-16">
            <div className="max-w-xl glass-dark rounded-3xl p-8 animate-slide-in-bottom">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-sand" />
                    <span className="text-brand-gray-50 text-[9px] font-black uppercase tracking-[0.5em]">Objects of Desire</span>
                </div>
                <h1 className="font-serif text-5xl lg:text-6xl text-brand-gray-50 font-bold tracking-tighter leading-none mb-6">
                    The Winter <span className='italic font-normal'>Intervention</span>
                </h1>
                <p className="max-w-lg text-brand-gray-400 text-sm leading-relaxed mb-10">
                    A curated archive where architectural precision meets timeless form. Each piece is a quiet statement, crafted for the discerning individual in the cold season.
                </p>
                <Link to="/shop" className="inline-flex items-center gap-4 px-10 py-5 bg-brand-gold text-brand-gray-950 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-white active:scale-95">
                    The Archive <ArrowRight size={14} />
                </Link>
            </div>
        </div>
      </section>

      {/* HERO BANNER */}
      <section className="bg-brand-espresso py-16 border-y border-brand-gray-800">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan">
              <Layers size={24} strokeWidth={1} />
            </div>
            <h3 className="text-brand-gray-50 font-serif italic text-xl mb-2">Timeless Design</h3>
            <p className="text-brand-gray-400 text-xs leading-relaxed">
              Architectural forms meet minimalist aesthetics for enduring style.
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan">
              <Scissors size={24} strokeWidth={1} />
            </div>
            <h3 className="text-brand-gray-50 font-serif italic text-xl mb-2">Artisanal Craft</h3>
            <p className="text-brand-gray-400 text-xs leading-relaxed">
              Hand-finished in Milan using full-grain Italian leather.
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          >
            <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan">
              <Globe size={24} strokeWidth={1} />
            </div>
            <h3 className="text-brand-gray-50 font-serif italic text-xl mb-2">Global Service</h3>
            <p className="text-brand-gray-400 text-xs leading-relaxed">
              Complimentary & carbon-neutral shipping worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BANNER GRID */}
      <BannerGrid banners={bannerData} />

      {/* MARQUEE */}
      <section className="bg-brand-gray-50 py-6 overflow-hidden border-y border-brand-gray-900/5">
        <div className="flex whitespace-nowrap animate-marquee">{[1, 2].map((_, i) => (<div key={i} className="flex items-center gap-16 px-12"><span className="text-brand-gray-900 font-black uppercase text-[10px] tracking-[0.5em] flex items-center gap-3"><Globe size={16} /> Global Logistics</span><span className="text-brand-gray-400 font-serif italic text-base">Forged in Milan</span><span className="text-brand-gray-900 font-black uppercase text-[10px] tracking-[0.5em] flex items-center gap-3"><ShieldCheck size={16} /> Secure Access</span><span className="text-brand-gray-400 font-serif italic text-base">Carbon Neutral</span></div>))}</div>
      </section>

      {/* FEATURED PRODUCT CAROUSEL */}
      <section className="py-24 bg-brand-gray-950 overflow-hidden border-b border-brand-gray-900">
        <div className="px-10 lg:px-12 mb-12 flex justify-between items-end">
          <div><span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block">Essential Objects</span><h2 className="font-serif text-4xl text-brand-gray-50 italic">Curated Series</h2></div>
          <Link to="/shop" className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-brand-gray-500 hover:text-brand-gray-50 transition-all">Full Archive <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee-products">{[...Array(2)].map((_, i) => (<React.Fragment key={i}>{featuredProducts.map((p) => (<div key={`${p.id}-${i}`} className="w-72 md:w-80 flex-shrink-0 px-3"><ProductCard product={p} onAddToCart={onAddToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted(p.id)} /></div>))}<div className="w-72 md:w-80 flex-shrink-0 px-3"><Link to="/shop" className="w-full h-full aspect-[2/3] rounded-[3rem] border border-brand-gray-800 bg-brand-espresso flex flex-col items-center justify-center gap-6 p-10 text-center hover:bg-brand-tan transition-colors"><div className="w-20 h-20 rounded-full bg-brand-gray-50/5 border border-brand-gray-50/10 flex items-center justify-center text-brand-gray-50"><MoveRight size={32} strokeWidth={1} /></div><div><h3 className="text-brand-gray-50 text-lg font-serif italic mb-2">Explore All</h3><p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-tan">24+ Objects Available</p></div></Link></div></React.Fragment>))}</div>
        </div>
      </section>

      {/* NEW PRODUCT SHOWCASE SECTION */}
      {featuredSatchel && (
        <section className="py-24 bg-brand-gray-950 border-b border-brand-gray-900">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                    className="aspect-square relative"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1, ease: 'circOut' }}
                >
                    <img src={featuredSatchel.other_images[0]} alt="Detail shot" className="absolute top-0 left-0 w-1/2 aspect-square rounded-3xl object-cover animate-float" />
                    <img src={featuredSatchel.image_url} alt={featuredSatchel.title} className="absolute bottom-0 right-0 w-3/4 aspect-square rounded-3xl object-cover animate-float" style={{animationDelay: '-3s'}} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1, ease: 'circOut', delay: 0.2 }}
                >
                    <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block">Signature Piece</span>
                    <h2 className="font-serif text-4xl lg:text-5xl text-brand-gray-50 italic mb-6">The Art of Form</h2>
                    <p className="text-brand-gray-400 mb-8 max-w-md">{featuredSatchel.description}</p>
                    <Link to={`/products/${featuredSatchel.slug}`} className="inline-flex items-center gap-4 px-10 py-5 border border-brand-gray-800 text-brand-gray-50 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-brand-gray-50 hover:text-brand-gray-950 active:scale-95 group">
                        View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
      )}

      {/* THE COLLECTION GRID */}
      <section className="py-24 bg-brand-gray-950">
        <div className="px-10 mb-16 flex flex-col items-center text-center"><span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4">Current Interventions</span><h2 className="font-serif text-4xl text-brand-gray-50 italic">The Collection</h2></div>
        <div className="px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">{MOCK_PRODUCTS.slice(4, 12).map((p, idx) => (<div key={p.id} className={idx % 2 !== 0 ? 'mt-12 md:mt-0' : ''}><ProductCard product={p} onAddToCart={onAddToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted(p.id)} /></div>))}</div>
        <div className="mt-20 flex justify-center px-10 md:px-12"><Link to="/shop" className="w-full max-w-screen-md flex items-center justify-between px-10 py-8 border border-brand-gray-800 rounded-[2.5rem] group hover:bg-brand-gray-50 hover:text-brand-gray-950 transition-all"><span className="text-[10px] font-black uppercase tracking-[0.5em]">Explore Full Archive</span><MoveRight className="group-hover:translate-x-2 transition-transform" /></Link></div>
      </section>

      {/* VIDEO REEL SCROLLER */}
      <VideoReelScroller videos={MOCK_VIDEO_REELS} />

      {/* NEW IMAGE GRID SCROLLER */}
      <ImageGridScroller imageSets={gridImageSets} caption={gridCaption} />

      {/* BRAND STORY SECTION */}
      <BrandStorySection />

      {/* EDITORIAL SECTION */}
      <section className="py-24 bg-brand-gray-950 border-t border-brand-gray-900">
        <div className="px-10 lg:px-12 mb-12 text-center">
            <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block">The Journal</span>
            <h2 className="font-serif text-4xl text-brand-gray-50 italic">From the Editorial Desk</h2>
        </div>
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {MOCK_BLOG_POSTS.map((post, idx) => (
                <Link 
                    to="/editorial"
                    key={post.id} 
                    className="block group animate-reveal" 
                    style={{ animationDelay: `${idx * 0.2}s` }}
                >
                    <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-brand-espresso mb-6 shadow-2xl border border-brand-gray-800">
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                    </div>
                    <div>
                        <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.4em] mb-3 block">
                            {post.category} &mdash; {post.date}
                        </span>
                        <h3 className="font-serif text-xl lg:text-2xl text-brand-gray-50 italic mb-3 group-hover:text-brand-sand transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-brand-gray-400 text-xs lg:text-sm leading-relaxed mb-4 line-clamp-2">
                            {post.excerpt}
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gray-500 group-hover:text-brand-gray-50 transition-colors">
                            Read More
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

       {/* INSTAGRAM FEED */}
       <section className="py-24 bg-brand-gray-950 border-t border-brand-gray-900">
        <div className="px-10 lg:px-12 mb-12 text-center">
            <h2 className="font-serif text-4xl text-brand-gray-50 italic mb-2">From the Studio</h2>
            <p className="text-brand-gray-500 text-xs font-medium">Follow our process @bazzaro_archive</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 px-2 md:px-12 max-w-screen-xl mx-auto">
            {MOCK_INSTAGRAM_POSTS.map(post => (
                <a href="#" key={post.id} className="block aspect-square rounded-2xl overflow-hidden group relative">
                    <img src={post.url} alt="Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" />
                    <div className="absolute inset-0 bg-brand-gray-950/20 group-hover:bg-brand-gray-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Instagram size={24} className="text-brand-gray-50" />
                    </div>
                </a>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;