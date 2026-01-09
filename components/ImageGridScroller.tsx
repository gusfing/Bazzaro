
import React from 'react';
import { motion } from 'framer-motion';

interface ImageGridScrollerProps {
  imageSets: { id: string; url: string; alt: string }[][];
  caption: string;
}

const ImageGridScroller: React.FC<ImageGridScrollerProps> = ({ imageSets, caption }) => {
  return (
    <motion.section 
      className="py-24 bg-brand-gray-950"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* The horizontal scroller container */}
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-4 md:gap-8 px-6 md:px-12">
            {imageSets.map((set, setIndex) => (
              <div key={`set-${setIndex}`} className="flex-shrink-0 w-[calc(100vw-3rem)] md:w-[calc(100vw-6rem)] max-w-screen-xl snap-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-8 aspect-square md:aspect-[16/9]">
                  {set.map((image) => (
                    <div key={image.id} className="rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-brand-espresso">
                      <img 
                        src={image.url} 
                        alt={image.alt} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center px-6 md:px-12">
          <p className="text-brand-gray-400 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
            {caption}
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default ImageGridScroller;
