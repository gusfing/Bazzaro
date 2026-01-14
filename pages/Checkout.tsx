
import React, { useState, useMemo, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate, Link } = ReactRouterDOM as any;
import { Lock, Tag, X, Wallet, Gift, CreditCard } from 'lucide-react';
import { CartItem, Coupon, Order } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import CouponCard from '../components/CouponCard';
import { emailService } from '../lib/emailService';
import { razorpayService, PaymentData, RazorpayResponse } from '../lib/razorpay';
import { saveOrder, addOrUpdateCustomer, validateCoupon, getCoupons, updateCoupon, StoredOrder } from '../lib/store';

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
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [hasWelcomeDiscount, setHasWelcomeDiscount] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  useEffect(() => {
    const welcomeShown = sessionStorage.getItem('mobileWelcomeShown') === 'true';
    if (welcomeShown) {
        setHasWelcomeDiscount(true);
    }

    // Load coupons from store
    const loadCoupons = async () => {
      try {
        const coupons = await getCoupons();
        setAvailableCoupons(coupons.filter(c => c.isActive));
      } catch (error) {
        console.error('Failed to load coupons:', error);
        setAvailableCoupons([]);
      }
    };
    
    loadCoupons();

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
  
  const handleApplyCoupon = async () => {
    const codeToApply = couponCodeInput.trim().toUpperCase();
    try {
      const result = await validateCoupon(codeToApply, subtotal);
      
      if (result.valid) {
        setAppliedCouponCode(codeToApply);
        setCouponDiscount(result.discount);
        setCouponMessage(result.message);
        addNotification(result.message);
      } else {
        setCouponMessage(result.message);
        addNotification(result.message);
      }
    } catch (error) {
      const errorMessage = 'Error validating coupon. Please try again.';
      setCouponMessage(errorMessage);
      addNotification(errorMessage);
    }
  };

  const handleRemoveCoupon = () => {
    addNotification(`Coupon "${appliedCouponCode}" removed.`);
    setAppliedCouponCode(null);
    setCouponDiscount(0);
    setCouponMessage(null);
    setCouponCodeInput('');
  };

  const handleCouponCopy = (code: string) => {
    setCouponCodeInput(code);
  };
  
  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    
    // Add timeout for the entire order process
    const orderTimeout = setTimeout(() => {
      if (isProcessingPayment) {
        setIsProcessingPayment(false);
        addNotification('Order processing timeout. Please try again.');
      }
    }, 30000); // 30 second timeout
    
    try {
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const address = formData.get('address') as string;
      const city = formData.get('city') as string;
      const zip = formData.get('zip') as string;

      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const customerName = `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer';
      const shippingAddress = `${address}, ${city} ${zip}`;

      const order: Omit<Order, 'creditsEarned'> = {
        id: orderId,
        items: cartItems,
        total,
        date: new Date().toISOString(),
        customerName,
        walletCreditUsed: applicableWalletCredit,
      };

      if (paymentMethod === 'razorpay' && total > 0) {
        // Process Razorpay payment
        const paymentData: PaymentData = {
          amount: total,
          currency: 'INR',
          customerName,
          customerEmail: email || 'customer@bazzaro.com',
          customerPhone: phone,
          orderId,
          description: `BAZZARO Order ${orderId} - ${cartItems.length} items`,
        };

        try {
          console.log('Starting Razorpay payment process...');
          const paymentResponse: RazorpayResponse = await razorpayService.initiatePayment(paymentData);
          console.log('Payment response received:', paymentResponse);
          
          // Verify payment
          const isPaymentValid = razorpayService.verifyPaymentSignature(
            paymentResponse.razorpay_payment_id,
            orderId,
            paymentResponse.razorpay_signature || ''
          );
          
          if (!isPaymentValid) {
            throw new Error('Payment verification failed');
          }
          
          console.log('Payment verification successful');
          
          // Payment successful
          addNotification('Payment successful! Processing your order...');
          
          // Add payment details to order
          const orderWithPayment = {
            ...order,
            paymentId: paymentResponse.razorpay_payment_id,
            paymentMethod: 'razorpay',
            paymentStatus: 'completed',
          };
          
          console.log('Processing order with payment details...');
          await processOrder(orderWithPayment, email, customerName, shippingAddress, phone);
          
        } catch (paymentError: any) {
          console.error('Payment failed:', paymentError);
          
          // Handle specific payment errors
          if (paymentError.message === 'Payment cancelled by user') {
            addNotification('Payment was cancelled. You can try again when ready.');
          } else if (paymentError.message === 'Razorpay script loading timeout') {
            addNotification('Payment system is temporarily unavailable. Please try again.');
          } else if (paymentError.message === 'Payment verification failed') {
            addNotification('Payment verification failed. Please contact support.');
          } else {
            addNotification('Payment failed. Please try again or use a different payment method.');
          }
          
          setIsProcessingPayment(false);
          clearTimeout(orderTimeout);
          return;
        }
      } else {
        // Cash on Delivery or Zero amount (fully covered by wallet/discounts)
        const orderWithPayment = {
          ...order,
          paymentMethod: total > 0 ? 'cod' : 'wallet',
          paymentStatus: 'pending',
        };
        
        await processOrder(orderWithPayment, email, customerName, shippingAddress, phone);
      }
      
      clearTimeout(orderTimeout);
      
    } catch (error: any) {
      console.error('Order processing failed:', error);
      addNotification('Failed to process order. Please try again.');
      setIsProcessingPayment(false);
      clearTimeout(orderTimeout);
    }
  };

  const processOrder = async (
    order: any,
    email: string,
    customerName: string,
    shippingAddress: string,
    phone?: string
  ) => {
    // Save order to store
    const storedOrder: StoredOrder = {
      ...order,
      creditsEarned: total * 0.10,
      status: 'processing',
      shippingAddress,
      email,
      phone,
    };
    
    try {
      // Save order first
      await saveOrder(storedOrder);
      console.log('Order saved successfully:', order.id);

      // Add/update customer in store
      await addOrUpdateCustomer({
        name: customerName,
        email: email || 'guest@example.com',
        totalOrders: 1,
        totalSpent: total,
        phone,
      });

      // Update coupon usage if applied
      if (appliedCouponCode) {
        try {
          const coupons = await getCoupons();
          const coupon = coupons.find(c => c.code.toUpperCase() === appliedCouponCode);
          if (coupon) {
            await updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
          }
        } catch (couponError) {
          console.error('Failed to update coupon usage:', couponError);
          // Don't fail the order for coupon update errors
        }
      }

      // Process the order in the main app
      onPlaceOrder(order);

      // Send order confirmation email (async, don't block navigation)
      emailService.sendOrderConfirmation(email || 'customer@example.com', {
        orderId: order.id,
        customerName,
        items: cartItems,
        total,
        shippingAddress
      }).then(() => {
        console.log('Order confirmation email sent successfully');
        addNotification('Order confirmation email sent!');
      }).catch((error) => {
        console.error('Failed to send order confirmation email:', error);
        addNotification('Order placed successfully, but email notification failed.');
      });
      
      // Navigate to success page
      navigate('/order-success');
      
    } catch (error: any) {
      console.error('Failed to save order:', error);
      
      // Provide specific error messages
      if (error.message?.includes('network')) {
        addNotification('Network error. Please check your connection and try again.');
      } else if (error.message?.includes('permission')) {
        addNotification('Permission error. Please try again.');
      } else {
        addNotification('Failed to process order. Please try again or contact support.');
      }
      
      throw error; // Re-throw to be caught by handleOrderSubmit
    } finally {
      setIsProcessingPayment(false);
    }
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
                <InputField label="Phone" placeholder="+91 98765 43210" fullWidth name="phone" type="tel" />
                <InputField label="First Name" placeholder="Alex" name="firstName" />
                <InputField label="Last Name" placeholder="Doe" name="lastName" />
                <InputField label="Address" placeholder="123 Main Street" fullWidth name="address" />
                <InputField label="City" placeholder="New York" name="city" />
                <InputField label="ZIP Code" placeholder="10001" name="zip" />
              </div>
            </section>

            {/* Payment Method Selection */}
            <section className="animate-reveal" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div 
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'razorpay' 
                      ? 'border-brand-tan bg-brand-tan/5' 
                      : 'border-brand-gray-50/10 bg-brand-gray-50/5'
                  }`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'razorpay' 
                        ? 'border-brand-tan bg-brand-tan' 
                        : 'border-brand-gray-50/30'
                    }`}>
                      {paymentMethod === 'razorpay' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <CreditCard size={16} className="text-brand-tan" />
                    <div>
                      <p className="text-sm font-medium text-brand-gray-50">Online Payment</p>
                      <p className="text-xs text-brand-gray-400">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-brand-tan bg-brand-tan/5' 
                      : 'border-brand-gray-50/10 bg-brand-gray-50/5'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'cod' 
                        ? 'border-brand-tan bg-brand-tan' 
                        : 'border-brand-gray-50/30'
                    }`}>
                      {paymentMethod === 'cod' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <Wallet size={16} className="text-brand-tan" />
                    <div>
                      <p className="text-sm font-medium text-brand-gray-50">Cash on Delivery</p>
                      <p className="text-xs text-brand-gray-400">Pay when your order arrives</p>
                    </div>
                  </div>
                </div>
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
                    {appliedCouponCode && couponDiscount > 0 && (
                         <div className="flex justify-between items-center text-sm text-brand-success">
                             <div className="flex items-center gap-2">
                                <Tag size={14} />
                                <span>Discount ({appliedCouponCode})</span>
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
              <button 
                type="submit" 
                disabled={isProcessingPayment}
                className="w-full bg-brand-gold text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-gray-950 border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    {paymentMethod === 'razorpay' && total > 0 
                      ? `Pay ₹${total.toLocaleString('en-IN')} Securely`
                      : paymentMethod === 'cod' && total > 0
                      ? 'Place Order (COD)'
                      : 'Complete Order'
                    }
                  </>
                )}
              </button>
              
              {paymentMethod === 'razorpay' && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-gray-400">
                  <Lock size={12} />
                  <span>Secured by Razorpay • 256-bit SSL encryption</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
