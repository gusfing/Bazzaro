
import React, { useState } from 'react';
import { Scissors } from 'lucide-react';
import { Coupon } from '../types';

interface CouponCardProps {
  coupon: Coupon;
  addNotification: (message: string) => void;
  onCopy?: (code: string) => void;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, addNotification, onCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    addNotification(`Coupon "${coupon.code}" copied!`);
    if (onCopy) {
      onCopy(coupon.code);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-brand-gray-50/5 p-4 rounded-xl border border-dashed border-brand-gray-50/20 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand-gray-50/5 flex-shrink-0 flex items-center justify-center">
            <Scissors size={18} className="text-brand-tan" />
        </div>
        <div>
            <p className="text-xs font-bold text-brand-gray-50 leading-snug">{coupon.description}</p>
            <p className="text-[10px] font-mono text-brand-tan mt-1">CODE: {coupon.code}</p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        disabled={isCopied}
        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-md transition-all border ${
            isCopied 
                ? 'bg-brand-success/20 border-brand-success text-brand-success' 
                : 'bg-brand-tan/10 border-brand-tan text-brand-tan hover:bg-brand-tan/20'
        }`}
      >
        {isCopied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

export default CouponCard;
