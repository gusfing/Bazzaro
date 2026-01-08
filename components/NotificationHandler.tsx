
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  message: string;
}

interface NotificationHandlerProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({ notifications, setNotifications }) => {
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifications, setNotifications]);

  // Fix: Extracted framer-motion props to an object to bypass type-checking errors.
  const notificationAnimation = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.9 },
    // FIX: Framer motion `type` property expects a literal type, so we cast it.
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
    layout: true
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            {...notificationAnimation}
            className="bg-brand-gray-900/80 backdrop-blur-md text-brand-gray-50 text-sm font-semibold px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-brand-gray-50/10"
          >
            <CheckCircle size={16} className="text-brand-success" />
            {notification.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationHandler;