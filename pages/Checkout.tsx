
import React, { useState, useMemo } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Lock, Tag, X } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { MOCK_COUPONS } from '../constants';
import CouponCard from '../components/CouponCard';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: () => void;
  addNotification: (message: string) => void;
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

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, addNotification }) => {
  const navigate = useNavigate();
  
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - discount;
  
  const applicableCoupons = MOCK_COUPONS.filter(coupon => !coupon.min_purchase || subtotal >= coupon.min_purchase);

  const handleApplyCoupon = () => {
    const codeToApply = couponCodeInput.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === codeToApply);

    if (coupon) {
      if (!coupon.min_purchase || subtotal >= coupon.min_purchase) {
        setAppliedCoupon(coupon);
        // Mock 10% discount for BAZZARO10
        const newDiscount = coupon.code === 'BAZZARO10' ? subtotal * 0.10 : 0;
        setDiscount(newDiscount);
        addNotification(`Coupon "${coupon.code}" applied successfully!`);
      } else {
        addNotification(`Cart total must be at least $${coupon.min_purchase} to use this coupon.`);
      }
    } else {
      addNotification('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    addNotification(`Coupon "${appliedCoupon?.code}" removed.`);
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCodeInput('');
  };

  const handleCouponCopy = (code: string) => {
    setCouponCodeInput(code);
  };
  
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

            {/* Discount Code */}
             <section className="animate-reveal" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Discount Code</h2>
                <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter code"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-grow bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                    />
                    <button type="button" onClick={handleApplyCoupon} className="bg-brand-tan/10 border border-brand-tan text-brand-tan px-6 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-tan/20 transition-colors">Apply</button>
                </div>
                {applicableCoupons.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {applicableCoupons.map(coupon => (
                            <CouponCard key={coupon.id} coupon={coupon} addNotification={addNotification} onCopy={handleCouponCopy} />
                        ))}
                    </div>
                )}
            </section>
          </div>
          
          <div className="lg:col-span-5 lg:sticky lg:top-32 mt-12 lg:mt-0">
            {/* Order Summary */}
            <section className="animate-reveal" style={{ animationDelay: '0.8s' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Order Summary</h2>
              <div className="bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-2xl p-6 space-y-4">
                {cartItems.map(item => (
                  <div key={item.variantId} className="flex justify-between items-center text-sm">
                    <span className="text-brand-gray-300">{item.title} x {item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-brand-gray-50/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-brand-gray-300">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                         <div className="flex justify-between items-center text-sm text-brand-success">
                             <div className="flex items-center gap-2">
                                <Tag size={14} />
                                <span>Discount ({appliedCoupon.code})</span>
                                <button onClick={handleRemoveCoupon}><X size={12} className="text-brand-gray-500 hover:text-white" /></button>
                             </div>
                            <span className="font-medium">-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-brand-gray-300">Shipping</span>
                        <span className="font-medium text-brand-success">FREE</span>
                    </div>
                </div>
                <div className="border-t border-brand-gray-50/10 pt-4 flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
            
            <div className="pt-8 animate-reveal" style={{ animationDelay: '1s' }}>
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
