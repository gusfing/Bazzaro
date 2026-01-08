
import React, { useState } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemove: (variantId: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemove = (variantId: string) => {
    setDeletingId(variantId);
    // Wait for the exit animation to complete before calling state update
    setTimeout(() => {
      onRemove(variantId);
      setDeletingId(null);
    }, 400);
  };

  return (
    <>
      {/* Backdrop with liquid-glass effect */}
      <div 
        className={`fixed inset-0 liquid-glass z-50 transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Bottom Sheet Drawer */}
      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white z-50 transform transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) rounded-t-[3rem] flex flex-col max-h-[90vh] ${isOpen ? 'translate-y-0 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)]' : 'translate-y-full'}`}>
        
        {/* Handle for dragging feel */}
        <div className="w-12 h-1.5 bg-brand-gray-200 rounded-full mx-auto mt-4 mb-2" />

        {/* Header */}
        <div className="px-8 py-4 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-gray-900">Shopping Bag</h2>
          <button onClick={onClose} className="p-3 bg-brand-gray-100 text-brand-gray-400 hover:text-brand-gray-900 hover:bg-brand-gray-200 rounded-full transition-all active:scale-90">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-brand-gray-400 space-y-4 animate-fade-in">
              <ShoppingBag size={48} className="opacity-20 stroke-1" />
              <p className="text-sm font-medium tracking-wide">Your collection is currently empty.</p>
              <button onClick={onClose} className="text-brand-gray-900 text-[10px] uppercase font-black tracking-[0.2em] underline underline-offset-8 decoration-brand-gray-200 hover:decoration-brand-gold transition-all">Discover Archive</button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div 
                key={item.variantId} 
                className={`flex gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  deletingId === item.variantId ? 'animate-item-exit' : 'opacity-0 animate-reveal-left stagger-' + ((idx % 3) + 1)
                }`}
              >
                <div className="w-24 h-32 bg-brand-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-sm transition-transform hover:scale-105">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[11px] uppercase tracking-wider text-brand-gray-900 leading-tight pr-4">{item.title}</h3>
                      <button 
                        onClick={() => handleRemove(item.variantId)} 
                        className="text-brand-gray-300 hover:text-brand-gray-900 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[9px] text-brand-gray-400 mt-1 uppercase font-black tracking-[0.2em]">{item.color} — {item.size}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center bg-brand-gray-100 rounded-full p-1 border border-brand-gray-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.variantId, -1)}
                        className="p-1.5 hover:bg-white rounded-full transition-colors disabled:opacity-20"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} className="text-brand-gray-900" />
                      </button>
                      <span key={item.quantity} className="px-4 text-xs font-black text-brand-gray-900 animate-pop inline-block">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.variantId, 1)}
                        className="p-1.5 hover:bg-white rounded-full transition-colors"
                      >
                        <Plus size={12} className="text-brand-gray-900" />
                      </button>
                    </div>
                    <span className="font-serif italic text-lg text-brand-gray-900">${(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 pb-12 border-t border-brand-gray-200 bg-white/50 backdrop-blur-xl rounded-t-3xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-brand-gray-500 uppercase text-[9px] font-black tracking-[0.3em] block mb-1">Subtotal</span>
                <span className="text-[10px] text-brand-gray-400 font-bold">Tax & Shipping calculated at checkout</span>
              </div>
              <span className="font-serif italic text-3xl text-brand-gray-900">${total.toFixed(0)}</span>
            </div>
            <Link to="/checkout" onClick={onClose} className="w-full bg-brand-gray-900 text-brand-gray-50 h-16 rounded-[2rem] uppercase font-black text-[10px] tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all hover:bg-brand-gold hover:text-brand-gray-900 group flex items-center justify-center">
              Confirm Order <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;