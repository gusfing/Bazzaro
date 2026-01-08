
import React, { useState } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import Breadcrumbs from '../components/Breadcrumbs';

const InputField: React.FC<{ label: string; placeholder: string; type?: string }> = ({ label, placeholder, type = "text" }) => (
  <div>
    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-gray-400 block mb-2">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg py-3 px-4 text-sm text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
    />
  </div>
);

const Login: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

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

                <form className="space-y-6 w-full max-w-sm mx-auto animate-reveal" style={{ animationDelay: '0.4s' }}>
                    {!isLoginView && (
                         <InputField label="Full Name" placeholder="Alex Doe" />
                    )}
                    <InputField label="Email" placeholder="your.email@example.com" type="email" />
                    <InputField label="Password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" type="password" />
                    
                    <div className="pt-4">
                        <Link to="/account">
                            <button type="submit" className="w-full bg-brand-gray-50 text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white">
                                {isLoginView ? 'Sign In' : 'Register'}
                            </button>
                        </Link>
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