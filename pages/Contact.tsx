
import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { productionEmailService } from '../lib/emailService';

const InputField: React.FC<{ 
  label: string; 
  placeholder: string; 
  type?: string; 
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}> = ({ label, placeholder, type = "text", fullWidth, value, onChange, required }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
    />
  </div>
);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
    
  useEffect(() => {
    const pageTitle = 'Contact Us | BAZZARO';
    const pageDescription = 'Get in touch with the BAZZARO concierge for general inquiries, press, and media. Find our studio address and contact details.';
    
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await productionEmailService.sendContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message
      });

      if (response.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-6 animate-reveal" style={{ animationDelay: '0.6s' }}>
            {submitStatus === 'success' && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-green-400 text-sm">
                ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                ❌ {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Name" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                required
              />
              <InputField 
                label="Email" 
                placeholder="your.email@example.com" 
                type="email"
                value={formData.email}
                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                required
              />
            </div>
            
            <InputField 
              label="Subject" 
              placeholder="What's this about?" 
              fullWidth
              value={formData.subject}
              onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
            />
            
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                placeholder="How can we help you?"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                required
                className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-gray-50 text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-gray-950 mr-2"></div>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
