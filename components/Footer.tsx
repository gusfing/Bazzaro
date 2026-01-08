
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;


const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-brand-gray-950 text-white overflow-hidden mt-auto">
      {/* Background Image & Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&q=80&w=1920" 
          alt="Starry night over mountains" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gray-950 via-brand-gray-950/90 to-transparent"></div>
      </div>

      {/* Large Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <h1 className="text-[25vw] lg:text-[20vw] font-serif font-bold leading-none text-gradient-bazzaro select-none">
          BAZZARO
        </h1>
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-8 lg:px-12 pt-20 pb-16">
        {/* Top Row: Logo and Slogan */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/" aria-label="Go to homepage">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:opacity-80 transition-opacity">
              <circle cx="22" cy="22" r="21" stroke="white" strokeWidth="1.5"/>
              <path d="M14 22C16.9282 17.5 27.0718 17.5 30 22C27.0718 26.5 16.9282 26.5 14 22Z" stroke="white" strokeWidth="1.5"/>
            </svg>
          </Link>
          <p className="font-sans font-bold text-xs uppercase tracking-[0.4em] text-white/80">
            Objects of Desire
          </p>
        </div>
        
        <div className="border-t border-white/10 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h4 className="font-sans text-sm font-bold uppercase tracking-widest mb-4 text-white/90">Menu</h4>
                    <ul className="space-y-3 text-white/60">
                        <li><Link to="/shop" className="hover:text-white transition-colors duration-300">Archive</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors duration-300">About</Link></li>
                        <li><Link to="/editorial" className="hover:text-white transition-colors duration-300">Editorial</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors duration-300">Contact</Link></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-sans text-sm font-bold uppercase tracking-widest mb-4 text-white/90">Socials</h4>
                    <ul className="space-y-3 text-white/60">
                        <li><a href="#" className="hover:text-white transition-colors duration-300">Instagram</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300">Twitter</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300">Pinterest</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-sans text-sm font-bold uppercase tracking-widest mb-4 text-white/90">Resources</h4>
                     <ul className="space-y-3 text-white/60 mb-6">
                        <li><Link to="/contact" className="hover:text-white transition-colors duration-300">Support</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors duration-300">Logistics</Link></li>
                     </ul>
                    <Link to="/contact">
                        <button className="px-5 py-2 border border-white/40 rounded-full text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-300">
                            Send a message
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        
        <div className="text-center text-white/30 text-[10px] tracking-widest mt-24">
          © 2025 BAZZARO. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
