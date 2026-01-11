
import React, { useState, useEffect } from 'react';
import { MOCK_ABANDONED_CARTS } from '../../constants';
import { AbandonedCart } from '../../types';
import { Info, MessageSquare, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendEmail } from '../../lib/email';
import { renderEmail } from '../../lib/renderEmail';
import AbandonedCartEmail from '../../components/emails/AbandonedCartEmail';


const AdminCartAbandonment: React.FC = () => {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(MOCK_ABANDONED_CARTS);
  const [notification, setNotification] = useState<{ message: string; cartId: string } | null>(null);

  useEffect(() => {
    document.title = 'Cart Abandonment | BAZZARO Admin';
  }, []);
  
  const handleSendReminder = async (cart: AbandonedCart) => {
    // Send abandoned cart email
    const emailHtml = renderEmail(<AbandonedCartEmail cart={cart} />);
    await sendEmail({
      to: `${cart.customerName.replace(' ', '.').toLowerCase()}@example.com`,
      subject: "You left something in your bag",
      html: emailHtml,
    });
    
    setAbandonedCarts(prevCarts =>
      prevCarts.map(c =>
        c.id === cart.id ? { ...c, status: 'Reminder Sent' } : c
      )
    );
    setNotification({ message: `Reminder sent to ${cart.customerName}`, cartId: cart.id });
    setTimeout(() => setNotification(null), 3000);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold uppercase text-brand-gray-900">Cart Abandonment</h1>
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-4 mb-8">
        <Info size={20} className="flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold">How to use this tool</h3>
          <p className="mt-1">This feature simulates sending email reminders to customers. Clicking 'Send Reminder' will trigger the email service (logging to console) and update the cart status.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {abandonedCarts.map(cart => (
          <div key={cart.id} className="bg-white border border-brand-gray-200 rounded-lg shadow-sm flex flex-col">
            <div className="p-6 border-b border-brand-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-brand-gray-900">{cart.customerName}</h3>
                  <p className="text-xs text-brand-gray-500 font-mono">{cart.customerPhone}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${cart.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {cart.status}
                </span>
              </div>
              <p className="text-xs text-brand-gray-400 mt-2">Last active: {getTimeAgo(cart.lastActive)}</p>
            </div>
            
            <div className="p-6 flex-grow space-y-4">
              {cart.items.map(item => (
                <div key={item.variantId} className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-md" />
                  <div>
                    <p className="text-xs font-bold text-brand-gray-800">{item.title}</p>
                    <p className="text-xs text-brand-gray-500">{item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-brand-gray-50 rounded-b-lg border-t border-brand-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-brand-gray-500">Cart Value</span>
                <p className="font-bold text-lg text-brand-gray-900">₹{cart.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              
              <AnimatePresence mode="wait">
                {notification?.cartId === cart.id ? (
                    <motion.div
                      key="notification"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm font-bold text-brand-success"
                    >
                      <Check size={16} /> Sent
                    </motion.div>
                ) : (
                    <motion.button
                        key="button"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleSendReminder(cart)}
                        disabled={cart.status === 'Reminder Sent'}
                        className="bg-brand-gray-900 text-brand-gray-50 px-4 py-2 text-sm font-bold uppercase rounded-lg hover:bg-brand-gray-800 transition-colors flex items-center gap-2 disabled:bg-brand-gray-300 disabled:cursor-not-allowed"
                    >
                        <MessageSquare size={16} /> Send Reminder
                    </motion.button>
                )}
               </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCartAbandonment;
