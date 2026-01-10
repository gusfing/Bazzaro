
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate } = ReactRouterDOM as any;
import Breadcrumbs from '../components/Breadcrumbs';
import { sendEmail } from '../lib/email';
import { renderEmail } from '../lib/renderEmail';
import WelcomeEmail from '../components/emails/WelcomeEmail';

const InputField: React.FC<{ label: string; placeholder: string; type?: string, name: string }> = ({ label, placeholder, type = "text", name }) => (
  <div>
    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      name={name}
      className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
      required
    />
  </div>
);

const Login: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const pageTitle = isLoginView ? 'Secure Access | BAZZARO' : 'Create Archive | BAZZARO';
        const pageDescription = isLoginView 
            ? 'Sign in to access your BAZZARO account, view order history, and manage your wishlist.' 
            : 'Create a new BAZZARO account to curate your personal archive and enjoy a seamless checkout experience.';
        
        document.title = pageTitle;
        document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
          canonicalLink.setAttribute('href', window.location.href);
        }
    }, [isLoginView]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (isLoginView) {
            // Handle login
            navigate('/account');
        } else {
            // Handle registration
            const formData = new FormData(e.currentTarget);
            const fullName = formData.get('fullName') as string;
            const email = formData.get('email') as string;

            // Send welcome email
            const emailHtml = renderEmail(<WelcomeEmail customerName={fullName} />);
            await sendEmail({
                to: email,
                subject: 'Welcome to The BAZZARO Archive',
                html: emailHtml,
            });

            // Redirect to account page after registration
            navigate('/account');
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
            <Breadcrumbs />
            <div className="px-8 py-12 flex flex-col justify-center items-center" style={{minHeight: 'calc(100vh - 6rem)'}}>
                <header className="mb-12 text-center">
                    <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal">
                        {isLoginView ? 'Secure Access' : 'Create Archive'}
                    </h1>
                    <p className="text-brand-gray-500 mt-2 animate-reveal" style={{ animationDelay: '0.2s' }}>
                        {isLoginView ? 'Welcome back to the collection.' : 'Join to curate your personal archive.'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto animate-reveal" style={{ animationDelay: '0.4s' }}>
                    {!isLoginView && (
                         <InputField label="Full Name" placeholder="Alex Doe" name="fullName" />
                    )}
                    <InputField label="Email" placeholder="your.email@example.com" type="email" name="email" />
                    <InputField label="Password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" type="password" name="password" />
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-brand-gray-50 text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white">
                            {isLoginView ? 'Sign In' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center animate-reveal" style={{ animationDelay: '0.6s' }}>
                    <button onClick={() => setIsLoginView(!isLoginView)} className="text-xs text-brand-gray-500 hover:text-brand-gray-50 transition-colors font-semibold">
                        {isLoginView ? "Don't have an account? Register" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
