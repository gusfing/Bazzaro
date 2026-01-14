
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface MobileWelcomeProps {
    onClose: () => void;
}

const MobileWelcome: React.FC<MobileWelcomeProps> = ({ onClose }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="fixed inset-0 bg-brand-gray-950/70 backdrop-blur-xl z-[1000] flex flex-col items-center justify-end lg:hidden"
            >
                <img
                    src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c"
                    alt="Welcome to Bazzaro"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full p-8 text-center"
                >
                    <div className="mb-8">
                        <h1 className="font-serif text-4xl text-brand-gray-50 italic mb-3">
                            Welcome to the Archive
                        </h1>
                        <p className="text-brand-gray-300 text-sm max-w-xs mx-auto">
                            Enjoy an exclusive <span className="font-bold text-brand-sand">15% OFF</span> your first order as our guest.
                        </p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="w-full bg-brand-gold text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white flex items-center justify-center gap-3 mb-4"
                    >
                        ENTER THE ARCHIVE
                        <ArrowRight size={16} />
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="text-xs text-brand-gray-500 hover:text-brand-gray-50 transition-colors"
                    >
                        No thanks
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MobileWelcome;
