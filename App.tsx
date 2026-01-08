
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, useLocation, Navigate } = ReactRouterDOM as any;
import { AnimatePresence, motion } from "framer-motion";
// Fix: Removed file extensions from local component imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Account from './pages/Account';
import Editorial from './pages/Editorial';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import CartPage from './pages/Cart';
import NotificationHandler from './components/NotificationHandler';
import SalesBanner from './components/SalesBanner';
import Footer from './components/Footer';
import { CartItem, Product, ProductVariant } from './types';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const greetings = ["Hello", "こんにちは", "Bonjour", "BAZZARO"];
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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [latestOrder, setLatestOrder] = useState(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<{id: number, message: string}[]>([]);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    // This effect runs when the component mounts and determines the initial banner state.
    // It also sets up a listener for when the banner is closed.
    const isDismissed = sessionStorage.getItem('salesBannerDismissed') === 'true';
    setIsBannerVisible(!isDismissed);

    const handleBannerCloseEvent = () => {
      setIsBannerVisible(false);
    };

    window.addEventListener('bannerClosed', handleBannerCloseEvent);

    return () => {
      window.removeEventListener('bannerClosed', handleBannerCloseEvent);
    };
  }, []);

  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.variantId === variant.id);
      if (existing) {
        return prev.map(item => item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, {
        variantId: variant.id,
        productId: product.id,
        title: product.title,
        price: product.base_price,
        size: variant.size,
        color: variant.color,
        image: product.image_url,
        quantity
      }];
    });
    addNotification(`${product.title} added to bag`);
  };

  const updateCartQuantity = (variantId: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.variantId === variantId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (variantId: string) => {
    setCartItems(prev => prev.filter(item => item.variantId !== variantId));
  };
  
  const handlePlaceOrder = () => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: cartItems,
      total,
      date: new Date().toISOString()
    };
    setLatestOrder(order);
    setCartItems([]);
  };

  const toggleWishlist = (productId: string, productTitle: string) => {
    setWishlist(prev => {
      const isWishlisted = prev.includes(productId);
      if (isWishlisted) {
        addNotification(`${productTitle} removed from wishlist`);
        return prev.filter(id => id !== productId);
      } else {
        addNotification(`${productTitle} added to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const isProductWishlisted = (productId: string) => wishlist.includes(productId);

  return (
    <div className={`${isAdminRoute ? 'bg-brand-gray-100' : 'bg-brand-gray-950 min-h-screen'}`}>
      <div className={`${isAdminRoute ? '' : 'w-full bg-brand-gray-950 min-h-screen flex flex-col relative'}`}>
        {!isAdminRoute && <SalesBanner />}
        {!isAdminRoute && <Navbar cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} isBannerVisible={isBannerVisible} />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted}/>} />
            <Route path="/shop" element={<Shop onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted}/>} />
            <Route path="/product/:slug" element={<ProductDetail onAddToCart={addToCart} addNotification={addNotification} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted} />} />
            <Route path="/cart" element={<CartPage items={cartItems} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} onPlaceOrder={handlePlaceOrder} addNotification={addNotification} />} />
            <Route path="/order-success" element={<OrderSuccess order={latestOrder} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/editorial" element={<Editorial />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist wishlistProductIds={wishlist} onAddToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isProductWishlisted} />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && (
          <NotificationHandler notifications={notifications} setNotifications={setNotifications} />
        )}
      </div>
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
