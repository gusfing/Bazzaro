
import React, { useState, useMemo, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Lock, Tag, X, Wallet, Gift } from 'lucide-react';
import { CartItem, Coupon, Order } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import { MOCK_COUPONS } from '../constants';
import CouponCard from '../components/CouponCard';
import { sendEmail } from '../lib/email';
import { renderEmail } from '../lib/renderEmail';
import OrderConfirmationEmail from '../components/emails/OrderConfirmationEmail';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: (order: Omit<Order, 'creditsEarned'>) => void;
  addNotification: (message: string) => void;
  walletBalance: number;
}

const InputField: React.FC<{ label: string; placeholder: string; type?: string; fullWidth?: boolean, name?: string, required?: boolean }> = ({ label, placeholder, type = "text", fullWidth, name, required = true }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      name={name}
      className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
      required={required}
    />
  </div>
);

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, addNotification, walletBalance }) => {
  const navigate = useNavigate();
  
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [hasWelcomeDiscount, setHasWelcomeDiscount] = useState(false);

  useEffect(() => {
    const welcomeShown = sessionStorage.getItem('mobileWelcomeShown') === 'true';
    if (welcomeShown) {
        setHasWelcomeDiscount(true);
    }

    const pageTitle = 'Secure Checkout | BAZZARO';
    const pageDescription = 'Complete your purchase securely. Enter your shipping and payment details to finalize your order.';
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
  
  const welcomeDiscountAmount = useMemo(() => {
    if (!hasWelcomeDiscount) return 0;
    return subtotal * 0.15;
  }, [hasWelcomeDiscount, subtotal]);

  const applicableWalletCredit = useMemo(() => {
      if (!useWallet) return 0;
      return Math.min(walletBalance, subtotal - welcomeDiscountAmount - couponDiscount);
  }, [useWallet, walletBalance, subtotal, couponDiscount, welcomeDiscountAmount]);

  const total = subtotal - welcomeDiscountAmount - couponDiscount - applicableWalletCredit;
  
  const applicableCoupons = MOCK_COUPONS.filter(coupon => !coupon.min_purchase || subtotal >= coupon.min_purchase);

  const handleApplyCoupon = () => {
    const codeToApply = couponCodeInput.trim().toUpperCase();
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === codeToApply);

    if (coupon) {
      if (!coupon.min_purchase || subtotal >= coupon.min_purchase) {
        setAppliedCoupon(coupon);
        const newDiscount = coupon.code === 'BAZZARO10' ? subtotal * 0.10 : 0;
        setCouponDiscount(newDiscount);
        addNotification(`Coupon "${coupon.code}" applied successfully!`);
      } else {
        addNotification(`Cart total must be at least ₹${coupon.min_purchase.toLocaleString('en-IN')} to use this coupon.`);
      }
    } else {
      addNotification('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    addNotification(`Coupon "${appliedCoupon?.code}" removed.`);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCodeInput('');
  };

  const handleCouponCopy = (code: string) => {
    setCouponCodeInput(code);
  };
  
  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const email = formData.get('email') as string;

    const order: Omit<Order, 'creditsEarned'> = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: cartItems,
      total,
      date: new Date().toISOString(),
      customerName: firstName || 'Valued Customer',
      walletCreditUsed: applicableWalletCredit,
    };
    
    onPlaceOrder(order);

    const finalOrderForEmail = { ...order, creditsEarned: total * 0.10 };
    const emailHtml = renderEmail(<OrderConfirmationEmail order={finalOrderForEmail} />);
    await sendEmail({
        to: email || 'customer@example.com',
        subject: `Your BAZZARO Order Confirmation (${order.id})`,
        html: emailHtml
    });
    
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
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Contact & Shipping</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Email" placeholder="your.email@example.com" fullWidth name="email" type="email" />
                <InputField label="First Name" placeholder="Alex" name="firstName" />
                <InputField label="Last Name" placeholder="Doe" name="lastName" />
                <InputField label="Address" placeholder="123 Main Street" fullWidth name="address" />
                <InputField label="City" placeholder="New York" name="city" />
                <InputField label="ZIP Code" placeholder="10001" name="zip" />
              </div>
            </section>

            {/* Payment */}
            <section className="animate-reveal" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Payment Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Card Number" placeholder="**** **** **** 1234" fullWidth name="cardNumber" />
                <InputField label="Expiry Date" placeholder="MM / YY" name="expiry" />
                <InputField label="CVC" placeholder="123" name="cvc" />
              </div>
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
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-brand-gray-50/10 pt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-brand-gray-300">Subtotal</span>
                        <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {hasWelcomeDiscount && (
                         <div className="flex justify-between items-center text-sm text-brand-success">
                             <div className="flex items-center gap-2">
                                <Gift size={14} />
                                <span>Welcome Discount (15%)</span>
                             </div>
                            <span className="font-medium">-₹{welcomeDiscountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    {appliedCoupon && (
                         <div className="flex justify-between items-center text-sm text-brand-success">
                             <div className="flex items-center gap-2">
                                <Tag size={14} />
                                <span>Discount ({appliedCoupon.code})</span>
                                <button onClick={handleRemoveCoupon}><X size={12} className="text-brand-gray-500 hover:text-white" /></button>
                             </div>
                            <span className="font-medium">-₹{couponDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    {useWallet && applicableWalletCredit > 0 && (
                         <div className="flex justify-between items-center text-sm text-brand-success">
                             <div className="flex items-center gap-2">
                                <Wallet size={14} />
                                <span>Wallet Credit</span>
                             </div>
                            <span className="font-medium">-₹{applicableWalletCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-brand-gray-300">Shipping</span>
                        <span className="font-medium text-brand-success">FREE</span>
                    </div>
                </div>
                <div className="border-t border-brand-gray-50/10 pt-4 flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </section>

             {/* Wallet & Discount */}
            <section className="animate-reveal mt-8" style={{ animationDelay: '0.6s' }}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Apply Rewards</h2>
                <div className="space-y-4">
                    {walletBalance > 0 && (
                        <div className="bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-brand-gray-50 flex items-center gap-2"><Wallet size={14} className="text-brand-tan"/> Available Wallet Credit</p>
                                <p className="font-serif italic text-lg text-brand-sand">₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <button onClick={() => setUseWallet(!useWallet)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${useWallet ? 'bg-brand-tan' : 'bg-brand-gray-700'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${useWallet ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input 
                        type="text"
                        placeholder="Discount code"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-grow bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                        />
                        <button type="button" onClick={handleApplyCoupon} className="bg-brand-tan/10 border border-brand-tan text-brand-tan px-6 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-tan/20 transition-colors">Apply</button>
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
