
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift, Copy } from 'lucide-react';
import { MOCK_COUPONS } from '../constants';

const WelcomePopup: React.FC<{ addNotification: (message: string) => void }> = ({ addNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem('welcomePopupShown');
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('welcomePopupShown', 'true');
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const firstOrderCoupon = MOCK_COUPONS.find(c => c.code === 'BAZZARO10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) { // simple validation
      setIsSubscribed(true);
    } else {
      addNotification("Please enter a valid email address.");
    }
  };

  const handleCopyCode = () => {
    if (firstOrderCoupon) {
      navigator.clipboard.writeText(firstOrderCoupon.code);
      addNotification(`Coupon "${firstOrderCoupon.code}" copied!`);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const modalVariants = {
    open: { opacity: 1, scale: 1, y: 0 },
    closed: { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.4 }}
            onClick={handleClose}
            className="fixed inset-0 bg-brand-gray-950/60 backdrop-blur-md z-[500]"
          />

          <motion.div
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-auto md:left-auto md:bottom-8 md:right-8 md:translate-x-0 md:translate-y-0 w-[calc(100vw-2rem)] sm:w-full max-w-lg z-[501]"
          >
            <div className="relative bg-brand-gray-950 border border-brand-gray-800 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center overflow-hidden">
              <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-brand-gray-500 hover:text-brand-gray-50 transition-colors rounded-full z-10">
                <X size={20} />
              </button>
              
              <div className="hidden md:block relative aspect-square rounded-2xl overflow-hidden bg-brand-espresso -ml-16 -my-16">
                 <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800" alt="Bazzaro Bag" className="w-full h-full object-cover scale-125" />
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-950/50 to-transparent"></div>
              </div>

              <div className="text-left relative">
                 <AnimatePresence mode="wait">
                  {!isSubscribed ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Gift size={24} className="text-brand-tan mb-4" />
                      <h2 className="font-serif italic text-3xl text-brand-gray-50 mb-2">Join The Archive</h2>
                      <p className="text-xs text-brand-gray-400 mb-6">Subscribe to receive 10% off your first order, plus access to private sales and new objects.</p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-500" />
                          <input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg h-12 pl-12 pr-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-500"
                            required
                          />
                        </div>
                        <button type="submit" className="w-full bg-brand-tan text-brand-gray-950 h-12 rounded-lg font-bold text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-white">
                          Claim My 10% Off
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Gift size={24} className="text-brand-success mb-4" />
                      <h2 className="font-serif italic text-3xl text-brand-gray-50 mb-2">Welcome!</h2>
                      <p className="text-xs text-brand-gray-400 mb-4">Your discount code is ready. Use it at checkout to enjoy 10% off your first purchase.</p>
                      
                      <div className="relative border-2 border-dashed border-brand-tan/30 rounded-lg p-4 flex items-center justify-between">
                        <span className="font-mono font-bold text-lg text-brand-tan tracking-widest">{firstOrderCoupon?.code}</span>
                        <button onClick={handleCopyCode} className="p-2 text-brand-tan hover:text-brand-sand transition-colors">
                          <Copy size={16} />
                        </button>
                      </div>
                       <button onClick={handleClose} className="w-full mt-4 bg-brand-gray-50/10 text-brand-gray-50 h-12 rounded-lg font-bold text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-brand-gray-50/20">
                          Start Shopping
                        </button>
                    </motion.div>
                  )}
                 </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
