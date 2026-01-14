
import React from 'react';
import { motion } from 'framer-motion';

interface LifestyleScrollerProps {
  images: string[];
}

const LifestyleScroller: React.FC<LifestyleScrollerProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <motion.section
      className="bg-brand-gray-950 py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-4 md:gap-8 px-6 md:px-12">
            {images.map((url, index) => (
              <div key={index} className="flex-shrink-0 w-3/4 md:w-1/3 snap-center">
                <div className="aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-brand-espresso">
                  <img 
                    src={url} 
                    alt={`Lifestyle image ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LifestyleScroller;
