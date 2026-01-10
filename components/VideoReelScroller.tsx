
import React from 'react';
import { motion } from 'framer-motion';
import { VideoReel } from '../types';

interface VideoReelScrollerProps {
  videos: VideoReel[];
}

const VideoReelScroller: React.FC<VideoReelScrollerProps> = ({ videos }) => {
  return (
    <section className="py-24 bg-brand-gray-950 border-t border-brand-gray-900 overflow-hidden">
      <div className="px-10 lg:px-12 mb-12 text-center">
        <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block">Behind The Scenes</span>
        <h2 className="font-serif text-4xl text-brand-gray-50 italic">Visual Notes</h2>
        <p className="text-brand-gray-500 mt-2 text-sm max-w-md mx-auto">From the studio floor.</p>
      </div>
      
      <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-4 md:gap-8 px-6 md:px-12">
          {videos.map((reel, index) => (
            <motion.div
              key={reel.id}
              className="flex-shrink-0 w-48 md:w-56 snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
            >
              <article className="relative aspect-[9/16] rounded-3xl overflow-hidden group shadow-2xl border border-brand-gray-800">
                <video
                  src={reel.videoUrl}
                  poster={reel.posterUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-brand-gray-50 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    {reel.title}
                  </h3>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoReelScroller;
