
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Lock } from 'lucide-react';
import { CartItem } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
}

const InputField: React.FC<{ label: string; placeholder: string; type?: string; fullWidth?: boolean }> = ({ label, placeholder, type = "text", fullWidth }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
    />
  </div>
);

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder }) => {
  const navigate = useNavigate();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder();
    navigate('/order-success');
  };

  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24 flex flex-col items-center justify-center text-center px-8">
            <h1 className="font-serif text-3xl italic mb-4">Your Bag is Empty</h1>
            <p className="text-brand-gray-500 mb-8 text-sm">Add items to your bag to proceed to checkout.</p>
            <Link to="/shop" className="bg-brand-gray-50 text-brand-gray-950 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-white active:scale-95">
                Return to Shop
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
      <Breadcrumbs />
      <div className="px-8 py-12 max-w-screen-xl mx-auto">
        <header className="mb-12">
          <h1 className="font-serif text-5xl italic animate-reveal">Checkout</h1>
        </header>

        <form onSubmit={handleOrderSubmit} className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
          <div className="lg:col-span-7 space-y-12">
            {/* Shipping */}
            <section className="animate-reveal" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" placeholder="Alex" />
                <InputField label="Last Name" placeholder="Doe" />
                <InputField label="Address" placeholder="123 Main Street" fullWidth />
                <InputField label="City" placeholder="New York" />
                <InputField label="ZIP Code" placeholder="10001" />
              </div>
            </section>

            {/* Payment */}
            <section className="animate-reveal" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Payment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Card Number" placeholder="**** **** **** 1234" fullWidth />
                <InputField label="Expiry Date" placeholder="MM / YY" />
                <InputField label="CVC" placeholder="123" />
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-5 lg:sticky lg:top-32 mt-12 lg:mt-0">
            {/* Order Summary */}
            <section className="animate-reveal" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Order Summary</h2>
              <div className="bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-2xl p-6 space-y-4">
                {cartItems.map(item => (
                  <div key={item.variantId} className="flex justify-between items-center text-sm">
                    <span className="text-brand-gray-300">{item.title} x {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-brand-gray-50/10 pt-4 flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
            
            <div className="pt-8 animate-reveal" style={{ animationDelay: '0.8s' }}>
              <button type="submit" className="w-full bg-brand-gold text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-40 flex items-center justify-center gap-3">
                <Lock size={14} />
                Place Order Securely
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;