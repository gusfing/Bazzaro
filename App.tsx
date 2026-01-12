
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, useLocation, Navigate } = ReactRouterDOM as any;
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
// Fix: Removed file extensions from local component imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Account from './pages/Account';
import Articles from './pages/Editorial';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import CartPage from './pages/Cart';
import NotificationHandler from './components/NotificationHandler';
import SalesBanner from './components/SalesBanner';
import Footer from './components/Footer';
import { CartItem, Product, ProductVariant, Order } from './types';
import PageTransition from './components/PageTransition';
import CartDrawer from './components/CartDrawer';
import NotFound from './pages/NotFound';
import WelcomePopup from './components/WelcomePopup';
import CustomTote from './pages/CustomTote';
import SupportChatWidget from './components/SupportChatWidget';
import MobileWelcome from './components/MobileWelcome';
import MobileMenu from './components/MobileMenu';
import { MOCK_PRODUCTS } from './constants';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCartAbandonment from './pages/admin/AdminCartAbandonment';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const greetings = ["Hello", "नमस्ते", "Bonjour", "BAZZARO"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= greetings.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setExitAnimation(true);
            setTimeout(onComplete, 1200);
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Fix: Extracted framer-motion props to an object to bypass type-checking errors.
  const preloaderTextAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className={`fixed inset-0 z-[1000] bg-brand-gray-950 flex flex-col items-center justify-center transition-all ${exitAnimation ? 'opacity-0 scale-105' : 'opacity-100'}`}>
      <motion.div
        key={currentIndex}
        {...preloaderTextAnimation}
        className="font-serif italic text-4xl text-brand-cloud"
      >
        {greetings[currentIndex]}
      </motion.div>
    </div>
  );
};

// Helper function to safely get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
  }
  return defaultValue;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // State initialization with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => getInitialState('bazzaro_cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => getInitialState('bazzaro_wishlist', []));
  const [walletBalance, setWalletBalance] = useState<number>(() => getInitialState('bazzaro_wallet', 2550));
  const [latestOrder, setLatestOrder] = useState<Order | null>(() => getInitialState('bazzaro_latestOrder', null));
  
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, message: string}[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isMobileWelcomeOpen, setIsMobileWelcomeOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 1024);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Effects to save state to localStorage on change
  useEffect(() => { try { localStorage.setItem('bazzaro_cart', JSON.stringify(cartItems)); } catch (e) { console.warn('Failed to save cart to storage', e) } }, [cartItems]);
  useEffect(() => { try { localStorage.setItem('bazzaro_wishlist', JSON.stringify(wishlist)); } catch (e) { console.warn('Failed to save wishlist to storage', e) } }, [wishlist]);
  useEffect(() => { try { localStorage.setItem('bazzaro_wallet', JSON.stringify(walletBalance)); } catch (e) { console.warn('Failed to save wallet to storage', e) } }, [walletBalance]);
  useEffect(() => { try { if(latestOrder) localStorage.setItem('bazzaro_latestOrder', JSON.stringify(latestOrder)); } catch (e) { console.warn('Failed to save order to storage', e) } }, [latestOrder]);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setIsAuthLoading(false);
      });
      return () => unsubscribe(); // Cleanup on unmount
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const welcomeShown = sessionStorage.getItem('mobileWelcomeShown');
    if (isMobileOrTablet && !welcomeShown && !isAdminRoute) {
        const timer = setTimeout(() => setIsMobileWelcomeOpen(true), 1500);
        return () => clearTimeout(timer);
    }
  }, [isAdminRoute, isMobileOrTablet]);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('salesBannerDismissed') === 'true';
    setIsBannerVisible(!isDismissed);
    const handleBannerCloseEvent = () => setIsBannerVisible(false);
    window.addEventListener('bannerClosed', handleBannerCloseEvent);
    return () => window.removeEventListener('bannerClosed', handleBannerCloseEvent);
  }, []);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  };

  const handleCloseMobileWelcome = () => {
    sessionStorage.setItem('mobileWelcomeShown', 'true');
    setIsMobileWelcomeOpen(false);
    addNotification("Welcome discount will be applied at checkout!");
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.variantId === variant.id);
      if (existing) {
        return prev.map(item => item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { variantId: variant.id, productId: product.id, title: product.title, price: product.base_price, size: variant.size, color: variant.color, image: product.image_url, quantity }];
    });
    addNotification(`${product.title} added to bag`);
    setIsCartDrawerOpen(true);
  };
  
  const addCustomToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    addNotification(`${item.title} added to bag`);
    setIsCartDrawerOpen(true);
  };
  
  const addBundleToCart = (productIds: string[], bundleTitle: string) => {
    const itemsToAdd: CartItem[] = [];
    let updatedCart = [...cartItems];

    productIds.forEach(productId => {
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      
      const variant = product.variants.find(v => v.stock_quantity > 0) || product.variants[0];
      if (!variant) return;
      
      const existingItem = updatedCart.find(item => item.variantId === variant.id);
      if (existingItem) {
        updatedCart = updatedCart.map(item => 
          item.variantId === variant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        itemsToAdd.push({
          variantId: variant.id,
          productId: product.id,
          title: product.title,
          price: product.base_price,
          size: variant.size,
          color: variant.color,
          image: product.image_url,
          quantity: 1
        });
      }
    });
    
    setCartItems([...updatedCart, ...itemsToAdd]);
    addNotification(`Bundle "${bundleTitle}" added to bag`);
    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (variantId: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (variantId: string) => {
    setCartItems(prev => prev.filter(item => item.variantId !== variantId));
  };

  const addWalletCredits = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };
  
  const handlePlaceOrder = (orderData: Omit<Order, 'creditsEarned'>) => {
    const creditsEarned = orderData.total * 0.10; // 10% cashback
    const finalOrder = { ...orderData, creditsEarned };
    setLatestOrder(finalOrder);
    setCartItems([]); // Clear cart on successful order
    const walletCreditUsed = orderData.walletCreditUsed || 0;
    setWalletBalance(prev => prev - walletCreditUsed + creditsEarned);
    if (creditsEarned > 0) {
      addNotification(`You've earned ₹${creditsEarned.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in wallet credits!`);
    }
  };

  const toggleWishlist = (productId: string, productTitle: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        addNotification(`${productTitle} removed from wishlist`);
        return prev.filter(id => id !== productId);
      } else {
        addNotification(`${productTitle} added to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const isProductWishlisted = (productId: string) => wishlist.includes(productId);

  const AuthLoader = () => (
    <div className="w-full flex-grow flex items-center justify-center bg-brand-gray-950 text-brand-gray-500">
      Loading Session...
    </div>
  );

  return (
    <div className={`${isAdminRoute ? 'bg-brand-gray-100' : 'bg-brand-gray-950 min-h-screen'}`}>
      {isMobileWelcomeOpen && <MobileWelcome onClose={handleCloseMobileWelcome} />}
      <div className={`${isAdminRoute ? '' : 'w-full bg-brand-gray-950 min-h-screen flex flex-col relative'}`}>
        {!isAdminRoute && <SalesBanner />}
        {!isAdminRoute && <Navbar currentUser={currentUser} cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} isBannerVisible={isBannerVisible} onCartClick={() => setIsCartDrawerOpen(true)} onMenuClick={() => setIsMenuOpen(true)} />}
        <main className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Home onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted}/></PageTransition>} />
              <Route path="/shop" element={<PageTransition><Shop onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted} addWalletCredits={addWalletCredits} addNotification={addNotification} /></PageTransition>} />
              <Route path="/products/:slug" element={<PageTransition><ProductDetail onAddToCart={addToCart} addNotification={addNotification} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted} onAddBundleToCart={addBundleToCart} /></PageTransition>} />
              <Route path="/custom-tote" element={<PageTransition><CustomTote onAddToCart={addCustomToCart} /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><CartPage items={cartItems} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout cartItems={cartItems} onPlaceOrder={handlePlaceOrder} addNotification={addNotification} walletBalance={walletBalance} /></PageTransition>} />
              <Route path="/order-success" element={<PageTransition><OrderSuccess order={latestOrder} /></PageTransition>} />
              <Route path="/articles" element={<PageTransition><Articles /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/wishlist" element={<PageTransition><Wishlist wishlistProductIds={wishlist} onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted} /></PageTransition>} />
              
              <Route path="/login" element={<PageTransition>{isAuthLoading ? <AuthLoader /> : currentUser ? <Navigate to="/account" replace /> : <Login />}</PageTransition>} />
              <Route path="/account" element={<PageTransition>{isAuthLoading ? <AuthLoader /> : currentUser ? <Account walletBalance={walletBalance} currentUser={currentUser} /> : <Navigate to="/login" replace />}</PageTransition>} />
              
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
                <Route path="products" element={<PageTransition><AdminProducts /></PageTransition>} />
                <Route path="orders" element={<PageTransition><AdminOrders /></PageTransition>} />
                <Route path="customers" element={<PageTransition><AdminCustomers /></PageTransition>} />
                <Route path="cart-abandonment" element={<PageTransition><AdminCartAbandonment /></PageTransition>} />
              </Route>
              
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <NotificationHandler notifications={notifications} setNotifications={setNotifications} />}
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} currentUser={currentUser} />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} items={cartItems} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} />
      {!isAdminRoute && !isMobileOrTablet && <WelcomePopup addNotification={addNotification} />}
      {!isAdminRoute && <SupportChatWidget />}
    </div>
  );
}

const App: React.FC = () => {
  const [isPreloading, setIsPreloading] = useState(true);

  return (
    <HashRouter>
      <ScrollToTop />
      {isPreloading && <Preloader onComplete={() => setIsPreloading(false)} />}
      <div className={`transition-opacity duration-1000 ${isPreloading ? 'opacity-0' : 'opacity-100'}`}>
        {!isPreloading && <AppContent />}
      </div>
    </HashRouter>
  );
};

export default App;
