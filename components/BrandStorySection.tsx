
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BrandStorySection: React.FC = () => {
  return (
    <motion.section
      className="py-24 bg-brand-gray-950 border-t border-brand-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
        <motion.p
          className="font-serif italic text-2xl md:text-3xl text-brand-gray-200 leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          We started Bazzaro because everything felt loud. We wanted pieces that didn’t compete for attention — just things that felt right.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-brand-tan hover:text-brand-sand transition-colors"
          >
            Read Our Story
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BrandStorySection;
