
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight, Instagram, Twitter } from 'lucide-react';
import { MOCK_CATEGORIES } from '../constants';

const Footer: React.FC = () => {
  const companyLinks = [
    { label: 'About', path: '/about' },
    { label: 'Editorial', path: '/editorial' },
    { label: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { label: 'Shipping & Returns', path: '/contact' },
    { label: 'Privacy Policy', path: '/contact' },
    { label: 'Terms of Service', path: '/contact' },
  ];

  const categoryLinks = MOCK_CATEGORIES.map(cat => ({
      label: cat.name,
      path: `/shop?cat=${cat.slug}`
  }));

  const FooterLinkColumn: React.FC<{title: string, links: {label: string, path: string}[]}> = ({ title, links }) => (
    <div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gray-50 mb-6">{title}</h3>
      <ul className="space-y-4">
        {links.map(link => (
          <li key={link.label}>
            <Link to={link.path} className="text-xs text-brand-gray-400 hover:text-brand-gray-50 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="w-full bg-brand-gray-950 text-brand-gray-400 border-t border-brand-gray-800">
      <div className="max-w-screen-xl mx-auto px-8 lg:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="mb-6 inline-block">
               <img 
                src="/BAZZARO DARK LOGO (1).png" 
                alt="BAZZARO" 
                className="h-5 w-auto object-contain" 
              />
            </Link>
            <p className="text-xs leading-relaxed mb-6">
              Objects of intent, crafted for the discerning individual.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" aria-label="Instagram" className="text-brand-gray-500 hover:text-brand-gray-50 transition-colors"><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter" className="text-brand-gray-500 hover:text-brand-gray-50 transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-start-2 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterLinkColumn title="Archive" links={categoryLinks} />
            <FooterLinkColumn title="Company" links={companyLinks} />
            <FooterLinkColumn title="Support" links={supportLinks} />
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-start-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gray-50 mb-6">Join the Archive</h3>
             <p className="text-xs leading-relaxed mb-6">
              Receive exclusive access to new objects, private sales, and stories from our studio.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input 
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-brand-gray-800 focus:border-brand-tan py-3 text-brand-gray-50 text-sm focus:outline-none transition-all placeholder:text-brand-gray-600"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-brand-gray-400 hover:text-brand-gray-50 transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-gray-600">
            &copy; {new Date().getFullYear()} BAZZARO. Objects of Desire.
          </p>
          <p className="text-xs text-brand-gray-600">Milan, Italy</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;