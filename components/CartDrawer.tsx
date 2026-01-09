
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemove: (variantId: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const drawerVariants = {
    open: { y: 0 },
    closed: { y: '100%' },
  };

  const itemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
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
            onClick={onClose}
            className="fixed inset-0 bg-brand-gray-950/50 backdrop-blur-md z-[80]"
          />
          
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white z-[90] rounded-t-[2rem] flex flex-col max-h-[85vh] shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-brand-gray-200 rounded-full mx-auto mt-3" />
            <div className="px-6 py-4 flex justify-between items-center border-b border-brand-gray-200">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-gray-900">Bag</h2>
              <button onClick={onClose} className="p-2 text-brand-gray-400 hover:text-brand-gray-900 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-gray-400 space-y-4">
                  <ShoppingBag size={48} className="opacity-50 stroke-1" />
                  <p className="text-sm">Your bag is empty.</p>
                  <button onClick={onClose} className="text-brand-tan text-xs font-bold uppercase tracking-widest hover:underline">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-4"
                    >
                      <img src={item.image} alt={item.title} className="w-20 h-24 object-cover rounded-lg bg-brand-gray-100" />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm text-brand-gray-900 leading-tight pr-4">{item.title}</h3>
                            <button onClick={() => onRemove(item.variantId)} className="text-brand-gray-400 hover:text-brand-error transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-brand-gray-500 mt-1">{item.color} / {item.size}</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center bg-brand-gray-100 rounded-full">
                            <button onClick={() => onUpdateQuantity(item.variantId, -1)} disabled={item.quantity <= 1} className="p-2 disabled:opacity-50"><Minus size={14} /></button>
                            <span className="px-3 text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.variantId, 1)} className="p-2"><Plus size={14} /></button>
                          </div>
                          <span className="font-serif italic text-lg text-brand-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-brand-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-brand-gray-600">Subtotal</span>
                  <span className="font-serif italic text-2xl text-brand-gray-900">${total.toFixed(2)}</span>
                </div>
                <Link to="/checkout" onClick={onClose} className="w-full bg-brand-gray-900 text-brand-gray-50 h-14 rounded-xl uppercase font-bold text-sm tracking-wider shadow-lg active:scale-[0.98] transition-all hover:bg-brand-gray-800 flex items-center justify-center">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
