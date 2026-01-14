
import React, { useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight, Layers, Scissors, Droplets } from 'lucide-react';
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
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-brand-espresso max-w-2xl mx-auto shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1557762093-41ae203369a3"
              alt="Bazzaro Atelier"
              className="w-full h-full object-cover opacity-70"
            />
          </div>
        </div>

        <section className="space-y-8 text-sm text-brand-gray-300 leading-relaxed font-light max-w-3xl mx-auto text-center">
          <p className="animate-reveal" style={{ animationDelay: '0.6s' }}>
            BAZZARO exists at the intersection of architectural form and everyday function. We believe that the items we carry should be more than mere accessories; they should be extensions of our identity, crafted with intention and designed to endure. Our name, derived from the concept of a curated marketplace, reflects our mission: to offer a singular, focused collection of objects that embody a quiet, confident luxury.
          </p>
          <p className="animate-reveal" style={{ animationDelay: '0.8s' }}>
            Each piece begins its life in our studio, nestled in the heart of Jaipur, where we obsess over sustainable materials, silhouettes, and the subtle interplay of light and shadow. We partner with local artisans who share our dedication to craftsmanship, using traditional techniques to realize a modern vision. The result is a collection that feels both timeless and contemporary—objects of intent for the discerning individual.
          </p>
        </section>
      </div>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-brand-espresso border-y border-brand-gray-800">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center animate-reveal" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan"><Layers size={24} strokeWidth={1} /></div>
            <h3 className="text-brand-gray-50 font-serif italic text-xl mb-2">Timeless Design</h3>
            <p className="text-brand-gray-400 text-xs leading-relaxed">Architectural forms meet minimalist aesthetics for enduring style that transcends seasonal trends.</p>
          </div>
          <div className="flex flex-col items-center animate-reveal" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan"><Scissors size={24} strokeWidth={1} /></div>
            <h3 className="text-brand-gray-50 font-serif italic text-xl mb-2">Artisanal Craft</h3>
            <p className="text-brand-gray-400 text-xs leading-relaxed">Hand-crafted by master artisans in Jaipur, blending generations of skill with modern precision.</p>
          </div>
          <div className="flex flex-col items-center animate-reveal" style={{ animationDelay: '0.6s' }}>
            <div className="w-16 h-16 mb-4 rounded-full border border-brand-tan/20 flex items-center justify-center text-brand-tan"><Droplets size={24} strokeWidth={1} /></div>
            <h3 className="text-brand-gray-50 font-serif italic text-xl mb-2">Conscious Materials</h3>
            <p className="text-brand-gray-400 text-xs leading-relaxed">Committed to ethically sourced, low-impact leathers and sustainable production practices.</p>
          </div>
        </div>
      </section>
      
      {/* Visual Break */}
      <div className="h-80 bg-fixed bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1629230239622-954fe3bf1834')", filter: 'grayscale(50%)'}}></div>

      {/* The Standard Section */}
      <div className="py-24">
        <div className="max-w-5xl mx-auto px-8">
            <header className="mb-12 text-center">
                <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block animate-reveal">Our Commitment</span>
                <h2 className="font-serif text-4xl text-brand-gray-50 italic animate-reveal" style={{ animationDelay: '0.2s' }}>
                    The BAZZARO Standard
                </h2>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="animate-reveal" style={{ animationDelay: '0.4s' }}>
                    <div className="aspect-square rounded-[2rem] overflow-hidden bg-brand-espresso shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1579512630983-6ab5d354c46f" alt="Artisan hands crafting leather" className="w-full h-full object-cover opacity-80" />
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="animate-reveal" style={{ animationDelay: '0.6s' }}>
                        <h3 className="font-serif italic text-2xl text-brand-sand mb-3">The Materials</h3>
                        <p className="text-sm text-brand-gray-300 leading-relaxed">We exclusively use full-grain, vegetable-tanned leather sourced from certified tanneries in India. This ancient, chrome-free process utilizes natural tannins from bark and plants, resulting in a durable, biodegradable material that develops a unique, rich patina over time. Each hide tells a story, and we honor it by preserving its natural character.</p>
                    </div>
                     <div className="animate-reveal" style={{ animationDelay: '0.8s' }}>
                        <h3 className="font-serif italic text-2xl text-brand-sand mb-3">The Artisans</h3>
                        <p className="text-sm text-brand-gray-300 leading-relaxed">Our objects are brought to life by a small collective of master artisans in Jaipur, Rajasthan. These craftspeople are the custodians of centuries-old leatherworking traditions. We foster a collaborative environment, ensuring fair wages, safe working conditions, and a shared passion for creating objects of lasting value and beauty.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>


      <div className="px-8 pb-24 max-w-5xl mx-auto">
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
