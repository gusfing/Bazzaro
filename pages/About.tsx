
import React, { useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const About: React.FC = () => {
    
  useEffect(() => {
    const pageTitle = 'About Us | BAZZARO';
    const pageDescription = 'Learn about the BAZZARO philosophy. Discover our dedication to architectural form, artisanal craft, and objects of intent.';
    
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
      <Breadcrumbs />
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block animate-reveal">Our Philosophy</span>
          <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal" style={{ animationDelay: '0.2s' }}>
            Objects of Intent
          </h1>
        </header>

        <div className="relative mb-16 animate-reveal" style={{ animationDelay: '0.4s' }}>
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-brand-espresso max-w-2xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1557762093-41ae203369a3?auto=format&fit=crop&q=80&w=800"
              alt="Bazzaro Atelier"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        </div>

        <section className="space-y-8 text-sm text-brand-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
          <p className="animate-reveal" style={{ animationDelay: '0.6s' }}>
            BAZZARO exists at the intersection of architectural form and everyday function. We believe that the items we carry should be more than mere accessories; they should be extensions of our identity, crafted with intention and designed to endure. Our name, derived from the concept of a curated marketplace, reflects our mission: to offer a singular, focused collection of objects that embody a quiet, confident luxury.
          </p>
          <p className="animate-reveal" style={{ animationDelay: '0.8s' }}>
            Each piece begins its life in our studio, nestled in the heart of Jaipur, where we obsess over sustainable materials, silhouettes, and the subtle interplay of light and shadow. We partner with local artisans who share our dedication to craftsmanship, using traditional techniques to realize a modern vision. The result is a collection that feels both timeless and contemporary—objects of intent for the discerning individual.
          </p>
        </section>

        <div className="mt-16 flex justify-center animate-reveal" style={{ animationDelay: '1s' }}>
          <Link to="/shop" className="w-full max-w-md flex items-center justify-between px-10 py-8 border border-brand-gray-800 rounded-[2.5rem] group hover:bg-brand-gray-50 hover:text-brand-gray-950 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Explore The Archive</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
