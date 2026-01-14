
import React, { useState, useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import { supabase } from '../lib/supabase';
import { Mail, Loader2, KeyRound, AlertTriangle, User, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const Login: React.FC = () => {
    const [view, setView] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = view === 'signin' ? 'Sign In | BAZZARO' : 'Join Us | BAZZARO';
    }, [view]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (view === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });

                if (error) throw error;

                if (data.user) {
                    setMessage('Account created! Please sign in.');
                    setView('signin');
                }
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.user) {
                    navigate('/account');
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
            <Breadcrumbs />
            <div className="px-8 py-12 flex flex-col justify-center items-center" style={{ minHeight: 'calc(100vh - 6rem)' }}>
                <header className="mb-12 text-center">
                    <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal">
                        {view === 'signin' ? 'Welcome Back' : 'Join the Collection'}
                    </h1>
                    <p className="text-brand-gray-500 mt-2 animate-reveal" style={{ animationDelay: '0.2s' }}>
                        {view === 'signin' ? 'Sign in to access your account.' : 'Create an account to verify your admin status.'}
                    </p>
                </header>

                <div className="w-full max-w-sm mx-auto animate-reveal" style={{ animationDelay: '0.4s' }}>
                    <form onSubmit={handleAuth} className="space-y-4">

                        {view === 'signup' && (
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg h-16 pl-12 pr-4 text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg h-16 pl-12 pr-4 text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                                required
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400">
                                <KeyRound size={18} />
                            </span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg h-16 pl-12 pr-4 text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                                required
                            />
                        </div>

                        {error && <p className="text-brand-error text-xs text-center">{error}</p>}
                        {message && <p className="text-green-400 text-xs text-center">{message}</p>}

                        <button type="submit" disabled={loading} className="w-full bg-brand-tan text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : (view === 'signin' ? 'Sign In' : 'Sign Up')}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <button
                            onClick={() => {
                                setView(view === 'signin' ? 'signup' : 'signin');
                                setError('');
                                setMessage('');
                            }}
                            className="text-sm text-brand-gray-400 hover:text-brand-gray-50 transition-colors"
                        >
                            {view === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
