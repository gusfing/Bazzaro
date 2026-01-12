
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

interface RewardProgressProps {
  progress: number;
  isClaimable: boolean;
  onClaim: () => void;
}

const RewardProgress: React.FC<RewardProgressProps> = ({ progress, isClaimable, onClaim }) => {
  const RADIUS = 28;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-16 h-16">
      <AnimatePresence mode="wait">
        {isClaimable ? (
          <motion.button
            key="claim"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={onClaim}
            className="w-full h-full bg-brand-gold rounded-full shadow-2xl flex flex-col items-center justify-center text-brand-gray-950 animate-pulse-dot"
            style={{ animationIterationCount: 'infinite' }}
          >
            <Gift size={20} />
            <span className="text-[8px] font-bold">CLAIM</span>
          </motion.button>
        ) : (
          <motion.div
            key="progress"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full h-full relative flex items-center justify-center bg-brand-gray-950/50 backdrop-blur-md rounded-full border border-brand-gray-50/10"
          >
            <Sparkles size={18} className="text-brand-sand" />
            <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={RADIUS}
                strokeWidth="4"
                className="stroke-current text-brand-gray-800"
                fill="transparent"
              />
              <motion.circle
                cx="32"
                cy="32"
                r={RADIUS}
                strokeWidth="4"
                className="stroke-current text-brand-gold"
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                strokeLinecap="round"
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardProgress;
