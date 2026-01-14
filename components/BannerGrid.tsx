
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Banner {
  subtitle: string;
  title: string;
  imageUrl: string;
  linkPath: string;
}

interface BannerGridProps {
  banners: Banner[];
}

const BannerGrid: React.FC<BannerGridProps> = ({ banners }) => {
  return (
    <section className="bg-brand-gray-950 py-12 border-b border-brand-gray-900">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
          >
            <Link to={banner.linkPath} className="block relative aspect-[4/3] rounded-[2.5rem] overflow-hidden group">
              <img 
                src={banner.imageUrl} 
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-950/70 via-transparent to-brand-gray-950/10 group-hover:from-brand-gray-950/80 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-brand-gray-50">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-tan mb-2 block">{banner.subtitle}</span>
                <h3 className="font-serif text-3xl italic mb-4">{banner.title}</h3>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  Shop Now
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BannerGrid;
