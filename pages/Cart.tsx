
import React, { useState } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { MOCK_PRODUCTS } from '../constants';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemove: (variantId: string) => void;
}

const CartPage: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemove = (variantId: string) => {
    setDeletingId(variantId);
    setTimeout(() => {
      onRemove(variantId);
      setDeletingId(null);
    }, 400);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24 flex flex-col">
        <Breadcrumbs />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-8">
            <ShoppingBag size={48} className="opacity-20 stroke-1 mb-4" />
            <h1 className="font-serif text-3xl italic mb-4">Your Bag is Empty</h1>
            <p className="text-brand-gray-500 mb-8 text-sm">Looks like you haven't added anything to your bag yet.</p>
            <Link to="/shop" className="bg-brand-gray-50 text-brand-gray-950 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-white active:scale-95">
                Explore The Archive
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24 flex flex-col">
      <Breadcrumbs />
      <header className="px-8 lg:px-12 py-4 mb-4 max-w-screen-xl mx-auto w-full">
        <h1 className="font-serif text-5xl italic animate-reveal">Shopping Bag</h1>
      </header>
      
      <div className="max-w-screen-xl mx-auto px-8 lg:px-12 py-4 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start w-full">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-8">
          {items.map((item, idx) => (
            <div 
              key={item.variantId} 
              className={`flex gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                deletingId === item.variantId ? 'opacity-0 scale-90' : 'opacity-0 animate-reveal'
              }`}
              style={{animationDelay: `${idx * 0.1}s`}}
            >
              <Link to={`/product/${MOCK_PRODUCTS.find(p => p.id === item.productId)?.slug}`} className="w-24 h-32 bg-brand-gray-900 rounded-2xl overflow-hidden shrink-0 shadow-sm transition-transform hover:scale-105">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-700" />
              </Link>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[11px] uppercase tracking-wider text-brand-gray-50 leading-tight pr-4">{item.title}</h3>
                    <button 
                      onClick={() => handleRemove(item.variantId)} 
                      className="text-brand-gray-300 hover:text-brand-gray-50 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[9px] text-brand-gray-400 mt-1 uppercase font-black tracking-[0.2em]">{item.color} — {item.size}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center bg-brand-gray-50/5 rounded-full p-1 border border-brand-gray-50/10">
                    <button 
                      onClick={() => onUpdateQuantity(item.variantId, -1)}
                      className="p-1.5 hover:bg-brand-gray-50/10 rounded-full transition-colors disabled:opacity-20"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} className="text-brand-gray-50" />
                    </button>
                    <span key={item.quantity} className="px-4 text-xs font-black text-brand-gray-50 animate-pop inline-block">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.variantId, 1)}
                      className="p-1.5 hover:bg-brand-gray-50/10 rounded-full transition-colors"
                    >
                      <Plus size={12} className="text-brand-gray-50" />
                    </button>
                  </div>
                  <span className="font-serif italic text-lg text-brand-gray-50">${(item.price * item.quantity).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary Section */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 mt-12 lg:mt-0">
          <div className="p-8 pb-12 border border-brand-gray-800 bg-brand-gray-950/50 backdrop-blur-xl rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-brand-gray-400 uppercase text-[9px] font-black tracking-[0.3em] block mb-1">Subtotal</span>
                <span className="text-[10px] text-brand-gray-400 font-bold">Tax & Shipping calculated at checkout</span>
              </div>
              <span className="font-serif italic text-3xl text-brand-gray-50">${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="w-full bg-brand-gray-50 text-brand-gray-950 h-16 rounded-2xl uppercase font-black text-[10px] tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all hover:bg-white group flex items-center justify-center">
              Proceed to Checkout <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;