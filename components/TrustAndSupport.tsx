
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LifeBuoy, ArrowRight } from 'lucide-react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;

const TrustAndSupport: React.FC = () => {
  return (
    <motion.section
      className="bg-brand-gray-950 py-24 border-t border-brand-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
        <motion.div
          className="flex flex-col items-center md:items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan">
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif italic text-xl text-brand-gray-50 mb-2">Shipping & Returns</h3>
          <p className="text-brand-gray-400 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
            Complimentary carbon-neutral shipping worldwide. Easy returns within 14 days of receipt.
          </p>
        </motion.div>
        
        <motion.div
          className="flex flex-col items-center md:items-start"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan">
            <LifeBuoy size={28} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif italic text-xl text-brand-gray-50 mb-2">Support Available</h3>
          <p className="text-brand-gray-400 text-xs leading-relaxed mb-4 max-w-xs mx-auto md:mx-0">
            Our concierge is here to assist with any questions or concerns you may have.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-tan hover:text-brand-sand transition-colors"
          >
            Contact Us
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TrustAndSupport;
