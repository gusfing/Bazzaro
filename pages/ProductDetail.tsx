
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, useNavigate, Link } = ReactRouterDOM as any;
import { Heart, ChevronLeft, Minus, Plus, Star, ChevronDown, Share2, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Fix: Removed file extensions from local component imports
import { MOCK_PRODUCTS, MOCK_COUPONS } from '../constants';
import { Product, ProductVariant, Review } from '../types';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import CouponCard from '../components/CouponCard';
import TrustAndSupport from '../components/TrustAndSupport';
import AiStylist from '../components/AiStylist';

interface ProductDetailProps {
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  addNotification: (message: string) => void;
  toggleWishlist: (productId: string, productTitle: string) => void;
  isWishlisted: (productId: string) => boolean;
}

const ProductSchema: React.FC<{ product: Product; selectedVariant: ProductVariant | undefined }> = ({ product, selectedVariant }) => {
  const productUrl = window.location.href;
  const stockStatus = selectedVariant && selectedVariant.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.image_url, ...product.other_images],
    "description": product.description,
    "sku": selectedVariant?.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": "BAZZARO"
    },
    ...(product.reviews && product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toFixed(1),
        "reviewCount": product.reviews_count || product.reviews.length
      }
    }),
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "USD",
      "price": product.base_price.toFixed(2),
      "priceValidUntil": nextYear.toISOString().split('T')[0],
      "availability": stockStatus,
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />;
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // Fix: Extracted framer-motion props to an object to bypass type-checking errors.
  const accordionAnimation = {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    // FIX: Framer motion `ease` property expects a literal type, so we cast it.
    transition: { duration: 0.3, ease: "easeInOut" as const }
  };
  return (
    <div className="border-b border-brand-gray-800">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-6 text-left">
        <span className="text-brand-gray-50 font-bold uppercase tracking-widest text-xs">{title}</span>
        <ChevronDown size={16} className={`text-brand-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>{isOpen && <motion.div {...accordionAnimation} className="overflow-hidden"><div className="pb-6 text-brand-gray-400 text-xs leading-relaxed font-medium">{children}</div></motion.div>}</AnimatePresence>
    </div>
  );
};

const ReviewsSection: React.FC<{ product: Product }> = ({ product }) => {
  if (!product.reviews || product.reviews.length === 0) return null;
  const ratingCounts = [0,0,0,0,0];
  product.reviews.forEach(r => ratingCounts[r.rating - 1]++);

  return (
    <div className="border-b border-brand-gray-800 py-6">
        <div className="flex items-start gap-8 mb-6">
            <div className="text-center shrink-0">
                <p className="text-5xl font-bold font-serif text-brand-gray-50">{product.rating?.toFixed(1)}</p>
                <div className="flex justify-center mt-1">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.round(product.rating!) ? "text-brand-tan fill-current" : "text-brand-gray-700 fill-current"} />)}</div>
                <p className="text-xs text-brand-gray-400 mt-2">{product.reviews_count} Reviews</p>
            </div>
            <div className="w-full">
                {ratingCounts.reverse().map((count, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-brand-gray-400 font-mono">{5-i} ★</span>
                        <div className="w-full bg-brand-gray-800 rounded-full h-1.5"><div className="bg-brand-tan h-1.5 rounded-full" style={{width: `${(count / product.reviews!.length) * 100}%`}}></div></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="space-y-6">
            {product.reviews.map(review => (
                <div key={review.id} className="border-t border-brand-gray-800 pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm text-brand-gray-50">{review.author}</p>
                        <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < review.rating ? "text-brand-tan fill-current" : "text-brand-gray-700 fill-current"} />)}</div>
                    </div>
                    <p className="font-bold text-brand-gray-200 mb-2">{review.title}</p>
                    <p className="text-brand-gray-400 text-xs leading-relaxed">{review.content}</p>
                </div>
            ))}
        </div>
    </div>
  );
}

const ProductBenefits: React.FC<{ benefits: string[] }> = ({ benefits }) => (
  <div className="my-8">
    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400 mb-4">Why You’ll Like It</h3>
    <ul className="space-y-2">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3 text-sm text-brand-gray-300">
          <CheckCircle size={14} className="text-brand-tan shrink-0" />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ onAddToCart, addNotification, toggleWishlist, isWishlisted }) => {
  // FIX: Because `useParams` is cast to `any`, we cannot use generics. Cast the result instead.
  const { slug } = useParams() as { slug: string };
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const galleryImages = product ? [product.image_url, ...product.other_images] : [];
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, galleryImages.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };
  
  const goToSlide = (slideIndex: number) => {
    const newDirection = slideIndex > imageIndex ? 1 : -1;
    setPage([slideIndex, newDirection]);
  };

  // Helper function to create/update meta tags
  const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    let element = document.querySelector(`meta[${attr}='${key}']`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  useEffect(() => {
    if (product) {
      // Set default variant
      const firstAvailable = product.variants.find(v => v.stock_quantity > 0);
      if (firstAvailable) setSelectedVariantId(firstAvailable.id);
      else setSelectedVariantId(product.variants[0]?.id || null);
      
      // SEO Meta Tags
      const pageTitle = `${product.title} | BAZZARO`;
      const pageDescription = product.description.substring(0, 155).trim().concat('...');
      const pageUrl = window.location.href;
      const imageUrl = new URL(product.image_url, window.location.origin).href;

      // Standard Meta Tags
      document.title = pageTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
      
      // Canonical Tag
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', pageUrl);
      } else {
        const newCanonicalLink = document.createElement('link');
        newCanonicalLink.rel = 'canonical';
        newCanonicalLink.href = pageUrl;
        document.head.appendChild(newCanonicalLink);
      }

      // Open Graph / Facebook Meta Tags
      setMetaTag('property', 'og:title', pageTitle);
      setMetaTag('property', 'og:description', pageDescription);
      setMetaTag('property', 'og:url', pageUrl);
      setMetaTag('property', 'og:image', imageUrl);
      setMetaTag('property', 'og:type', 'product');
      setMetaTag('property', 'og:site_name', 'BAZZARO');
      setMetaTag('property', 'product:price:amount', product.base_price.toString());
      setMetaTag('property', 'product:price:currency', 'USD');

      // Twitter Card Meta Tags
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', pageTitle);
      setMetaTag('name', 'twitter:description', pageDescription);
      setMetaTag('name', 'twitter:image', imageUrl);
    }
  }, [product]);

  const allOtherProducts = product ? MOCK_PRODUCTS.filter(p => p.id !== product.id) : [];
  const relatedProducts = product ? allOtherProducts.filter(p => p.category_id === product.category_id).slice(0, 4) : [];

  if (!product) return <div className="min-h-screen bg-brand-gray-950 flex flex-col items-center justify-center p-6 text-center"><h2 className="font-serif text-3xl mb-6">Object not found</h2><button onClick={() => navigate('/')} className="text-brand-gray-100 uppercase tracking-[0.3em] text-[11px] font-black">Return to Archive</button></div>;

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const stockLevel = selectedVariant?.stock_quantity ?? 0;

  const applicableCoupons = MOCK_COUPONS.filter(coupon => !coupon.min_purchase || product.base_price >= coupon.min_purchase);

  const handleAddToCart = () => { if (selectedVariant) onAddToCart(product, selectedVariant, quantity); };
  const handleBuyNow = () => { if (selectedVariant) { onAddToCart(product, selectedVariant, quantity); navigate('/checkout'); }};
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out the ${product.title} from BAZZARO`,
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Share API failed:', error);
          // Fallback to clipboard for other errors
          navigator.clipboard.writeText(window.location.href);
          addNotification("Link copied to clipboard");
        }
      });
    } else {
      // Fallback for browsers that don't support the Share API
      navigator.clipboard.writeText(window.location.href);
      addNotification("Link copied to clipboard");
    }
  };

  return (
    <>
      <ProductSchema product={product} selectedVariant={selectedVariant} />
      <div className="relative min-h-screen bg-brand-gray-950 pt-24">
        <Breadcrumbs />
        <div className="relative flex flex-col overflow-hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start max-w-screen-xl mx-auto lg:px-12">
            <div className="absolute lg:hidden top-0 left-0 w-full px-6 py-8 z-50 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="w-12 h-12 bg-brand-gray-950/40 backdrop-blur-md rounded-xl flex items-center justify-center text-brand-gray-50 active:scale-90 transition-transform border border-brand-gray-50/10"><ChevronLeft size={24} /></button>
                <div className="flex gap-3">
                <button onClick={handleShare} className="w-12 h-12 bg-brand-gray-950/40 backdrop-blur-md rounded-xl flex items-center justify-center text-brand-gray-50 active:scale-90 transition-transform border border-brand-gray-50/10"><Share2 size={20} /></button>
                <button onClick={() => toggleWishlist(product.id, product.title)} className={`w-12 h-12 bg-brand-gray-950/40 backdrop-blur-md rounded-xl flex items-center justify-center transition-all active:scale-90 border border-brand-gray-50/10 text-brand-gray-50`}><Heart size={20} fill={isWishlisted(product.id) ? "currentColor" : "none"} /></button>
                </div>
            </div>
            
            {/* Image Carousel Column */}
            <div className="pt-12 lg:pt-0 lg:sticky lg:top-32">
                <div className="relative aspect-[4/5] w-full bg-brand-gray-900 rounded-2xl overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={page}
                            src={galleryImages[imageIndex]}
                            alt={`${product.title} - Image ${imageIndex + 1}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                if (offset.x < -50) paginate(1);
                                else if (offset.x > 50) paginate(-1);
                            }}
                            className="absolute h-full w-full object-contain"
                        />
                    </AnimatePresence>
                    <button onClick={() => paginate(-1)} className="absolute top-1/2 left-4 -translate-y-1/2 z-10 w-12 h-12 bg-brand-gray-950/40 backdrop-blur-md rounded-full flex items-center justify-center text-brand-gray-50 active:scale-90 transition-all border border-brand-gray-50/10 hover:bg-brand-gray-950/60"><ChevronLeft size={24} /></button>
                    <button onClick={() => paginate(1)} className="absolute top-1/2 right-4 -translate-y-1/2 z-10 w-12 h-12 bg-brand-gray-950/40 backdrop-blur-md rounded-full flex items-center justify-center text-brand-gray-50 active:scale-90 transition-all border border-brand-gray-50/10 hover:bg-brand-gray-950/60"><ChevronRight size={24} /></button>
                    <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 z-10">
                        {galleryImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${imageIndex === i ? 'bg-brand-gray-50 scale-125' : 'bg-brand-gray-500/50 hover:bg-brand-gray-500'}`}
                            />
                        ))}
                    </div>
                </div>
                {/* Thumbnail Gallery */}
                <div className="mt-4 hidden lg:flex items-center justify-center gap-3">
                    {galleryImages.map((img, i) => (
                        <button
                            key={`thumb-${i}`}
                            onClick={() => goToSlide(i)}
                            className={`w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 border-2 ${imageIndex === i ? 'border-brand-gray-50 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <img src={img} alt={`${product.title} - Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Details Column */}
            <div className="bg-brand-gray-950 rounded-t-[3.5rem] p-10 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] z-30 -mt-16 relative lg:mt-0 lg:bg-transparent lg:shadow-none lg:rounded-none lg:p-0">
                <div className="max-w-md mx-auto lg:max-w-none">
                  <div className="hidden lg:flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gray-400 hover:text-brand-gray-50 transition-colors"><ChevronLeft size={16} /> Back</button>
                    <div className="flex gap-3">
                      <button onClick={handleShare} className="w-12 h-12 bg-brand-gray-50/5 backdrop-blur-md rounded-xl flex items-center justify-center text-brand-gray-50 active:scale-90 transition-transform border border-brand-gray-50/10"><Share2 size={20} /></button>
                      <button onClick={() => toggleWishlist(product.id, product.title)} className={`w-12 h-12 bg-brand-gray-50/5 backdrop-blur-md rounded-xl flex items-center justify-center transition-all active:scale-90 border border-brand-gray-50/10 text-brand-gray-50`}><Heart size={20} fill={isWishlisted(product.id) ? "currentColor" : "none"} /></button>
                    </div>
                  </div>
                  <div className="mb-6"><h1 className="text-brand-gray-50 text-3xl lg:text-5xl font-serif italic mb-2">{product.title}</h1>{product.rating && (<div className="flex items-center gap-2"><div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.round(product.rating!) ? "text-brand-tan fill-current" : "text-brand-gray-700 fill-current"} />)}</div><span className="text-xs text-brand-gray-400 font-mono">{product.rating.toFixed(1)} ({product.reviews_count} reviews)</span></div>)}</div>
                  <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-3">{product.variants.map((v) => <button key={v.id} onClick={() => setSelectedVariantId(v.id)} className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedVariantId === v.id ? 'border-brand-gray-50' : 'border-transparent'}`} style={{ backgroundColor: v.hex || '#333' }} />)}</div>
                      <div className="bg-brand-gray-800 rounded-full px-2 py-1 flex items-center gap-4 border border-brand-gray-50/5"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-brand-gray-400 hover:text-brand-gray-50 transition-colors"><Minus size={14} /></button><span className="text-brand-gray-50 text-sm font-bold w-4 text-center">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-brand-gray-400 hover:text-brand-gray-50 transition-colors"><Plus size={14} /></button></div>
                  </div>
                  <div className="mb-4 h-4">
                      <div className="flex items-center justify-end gap-2 text-right text-[10px] font-bold uppercase tracking-widest">
                        {stockLevel > 10 && (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
                                </span>
                                <span className="text-brand-success">In Stock</span>
                            </>
                        )}
                        {stockLevel <= 10 && stockLevel > 0 && (
                            <>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-brand-warning opacity-75" style={{ animationDuration: '1s'}}></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-warning"></span>
                                </span>
                                <span className="text-brand-warning">Low Stock ({stockLevel} left)</span>
                            </>
                        )}
                        {stockLevel === 0 && <span className="text-brand-error">Out of Stock</span>}
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="flex justify-between items-center gap-4">
                      <div className="flex flex-col"><span className="text-brand-gray-400 text-xs">Price</span><span className="text-brand-gray-50 text-2xl font-bold leading-none">${product.base_price.toFixed(2)}</span></div>
                      <button onClick={handleAddToCart} disabled={!selectedVariant || stockLevel === 0} className="flex-grow bg-brand-gray-50/10 border border-brand-gray-50/20 text-brand-gray-50 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-brand-gray-50/20 disabled:opacity-40 disabled:cursor-not-allowed">Add to Cart</button>
                      </div>
                      <button onClick={handleBuyNow} disabled={!selectedVariant || stockLevel === 0} className="w-full bg-brand-gold text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed">Buy Now</button>
                  </div>

                  {product.benefits && <ProductBenefits benefits={product.benefits} />}

                  {applicableCoupons.length > 0 && (
                    <div className="my-8">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400 mb-4">Save extra with these offers</h3>
                      <div className="space-y-3">
                        {applicableCoupons.map(coupon => (
                          <CouponCard key={coupon.id} coupon={coupon} addNotification={addNotification} />
                        ))}
                      </div>
                    </div>
                  )}

                  <AiStylist currentProduct={product} allProducts={allOtherProducts} />

                  <div>
                      <AccordionItem title="Description" defaultOpen><p>{product.description}</p></AccordionItem>
                      {(product.materials || product.dimensions || product.care_instructions) && (
                        <AccordionItem title="Details">
                          <ul className="space-y-2 list-disc list-inside">
                            {product.materials && <li><strong>Material:</strong> {product.materials}</li>}
                            {product.dimensions && <li><strong>Size:</strong> {product.dimensions}</li>}
                            {product.care_instructions && <li><strong>Care:</strong> {product.care_instructions}</li>}
                          </ul>
                        </AccordionItem>
                      )}
                      {product.reviews && <AccordionItem title={`Reviews (${product.reviews_count})`}><ReviewsSection product={product} /></AccordionItem>}
                      {product.faq && <AccordionItem title="Common Questions"><ul className="space-y-4">{product.faq.map(f => (<li key={f.question}><strong>{f.question}</strong><p className="mt-1 text-brand-gray-500">{f.answer}</p></li>))}</ul></AccordionItem>}
                  </div>
                </div>
            </div>
        </div>
      </div>
      
      {product.lifestyle_images && product.lifestyle_images.length > 0 && (
        <section className="bg-brand-gray-950 py-24">
            <div className="px-8 lg:px-12 max-w-screen-xl mx-auto mb-12 text-center">
                <h2 className="font-serif text-4xl text-brand-gray-50 italic">How It's Worn</h2>
                <p className="text-brand-gray-500 mt-2 text-sm max-w-md mx-auto">Real-life inspiration for your next Bazzaro piece.</p>
            </div>
            <div className="px-6 lg:px-12 max-w-screen-xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                    {product.lifestyle_images.map((url, index) => (
                        <motion.div
                            key={index}
                            className={`aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-brand-espresso group ${index % 2 === 1 ? 'md:mt-16' : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                        >
                            <img 
                                src={url} 
                                alt={`${product.title} - Lifestyle inspiration ${index + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      )}

      <TrustAndSupport />

      {relatedProducts.length > 0 && (
        <section className="bg-brand-gray-950 py-24">
          <div className="px-8 lg:px-12 max-w-screen-xl mx-auto mb-12"><h2 className="font-serif text-4xl text-brand-gray-50 italic">You May Also Like</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 lg:px-12 max-w-screen-xl mx-auto">
            {relatedProducts.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} onAddToCart={onAddToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted(p.id)} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetail;