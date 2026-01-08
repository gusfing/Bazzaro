
import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SalesBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('salesBannerDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('salesBannerDismissed', 'true');
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('bannerClosed'));
  };
  
  const bannerAnimation = {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...bannerAnimation}
          className="fixed top-0 left-0 w-full bg-brand-gold text-brand-gray-950 h-10 flex items-center justify-center text-center z-[70]"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 px-12">
            <Star size={12} className="opacity-70 hidden sm:block" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em]">
              Limited Offer: Free Global Shipping on Orders Over $150
            </p>
            <Star size={12} className="opacity-70 hidden sm:block" />
          </div>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss sales banner"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesBanner;
