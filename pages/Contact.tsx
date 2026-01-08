
import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const InputField: React.FC<{ label: string; placeholder: string; type?: string; fullWidth?: boolean }> = ({ label, placeholder, type = "text", fullWidth }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
    />
  </div>
);

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
      <Breadcrumbs />
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.7em] mb-4 block animate-reveal">Concierge</span>
          <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal" style={{ animationDelay: '0.2s' }}>
            Get in Touch
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <section className="space-y-6 text-sm text-brand-gray-300 leading-relaxed font-light animate-reveal" style={{ animationDelay: '0.4s' }}>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-2">General Inquiries</h3>
              <a href="mailto:support@bazzaro.com" className="hover:text-brand-gray-50 transition-colors">support@bazzaro.com</a>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-2">Press & Media</h3>
              <a href="mailto:press@bazzaro.com" className="hover:text-brand-gray-50 transition-colors">press@bazzaro.com</a>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-tan mb-2">Studio Address</h3>
              <p>Via Montenapoleone, 8 <br /> 20121 Milano MI, Italy</p>
            </div>
          </section>

          <form className="space-y-6 animate-reveal" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Name" placeholder="Your Name" fullWidth />
              <InputField label="Email" placeholder="your.email@example.com" fullWidth />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">Message</label>
              <textarea
                placeholder="How can we help you?"
                rows={5}
                className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
              />
            </div>
            <button type="submit" className="w-full bg-brand-gray-50 text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;