
import React, { useState, useEffect, useRef } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM as any;
import { auth } from '../lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { Phone, Loader2, KeyRound } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const GoogleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 8.841C34.524 4.956 29.508 2.5 24 2.5C11.455 2.5 1.5 12.455 1.5 25S11.455 47.5 24 47.5c11.133 0 21.06-8.232 22.923-18.89H43.611v-8.527z" /><path fill="#FF3D00" d="M6.306 14.691c2.242-4.337 6.424-7.445 11.23-8.807l-2.071 4.591c-2.484 1.144-4.597 2.92-6.12 5.063L6.306 14.691z" /><path fill="#4CAF50" d="M24 47.5c5.522 0 10.52-1.996 14.494-5.346l-4.523-4.523c-2.484 1.638-5.61 2.62-9.01 2.62c-3.665 0-6.99-1.12-9.69-3.095l-4.702 4.702C12.593 45.426 18.067 47.5 24 47.5z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l4.523 4.523C39.464 34.545 42.43 30.019 43.611 25.083z" /></svg>
);

const Login: React.FC = () => {
    const [view, setView] = useState<'options' | 'phone'>('options');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [loading, setLoading] = useState<'google' | 'otp' | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Setup invisible reCAPTCHA
    useEffect(() => {
        if (view === 'phone') {
            try {
                // @ts-ignore
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': () => { /* reCAPTCHA solved */ }
                });
            } catch (e) {
                console.error("reCAPTCHA setup failed", e);
                setError("Could not initialize verification. Please refresh and try again.");
            }
        }
    }, [view]);

    useEffect(() => {
        document.title = 'Secure Access | BAZZARO';
    }, []);

    const handleGoogleSignIn = async () => {
        setLoading('google');
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/account');
        } catch (err) {
            setError('Failed to sign in with Google. Please try again.');
            console.error(err);
        } finally {
            setLoading(null);
        }
    };
    
    const handlePhoneSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;
        setLoading('otp');
        setError('');
        try {
            // @ts-ignore
            const verifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
            setConfirmationResult(result);
        } catch (err) {
            setError('Failed to send OTP. Please check the number and try again.');
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !confirmationResult) return;
        setLoading('otp');
        setError('');
        try {
            await confirmationResult.confirm(otp);
            navigate('/account');
        } catch (err) {
            setError('Invalid OTP. Please try again.');
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
            <div id="recaptcha-container"></div>
            <Breadcrumbs />
            <div className="px-8 py-12 flex flex-col justify-center items-center" style={{minHeight: 'calc(100vh - 6rem)'}}>
                <header className="mb-12 text-center">
                    <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal">
                        Secure Access
                    </h1>
                    <p className="text-brand-gray-500 mt-2 animate-reveal" style={{ animationDelay: '0.2s' }}>
                        Welcome to the collection.
                    </p>
                </header>

                <div className="w-full max-w-sm mx-auto animate-reveal" style={{ animationDelay: '0.4s' }}>
                    {view === 'options' && (
                         <div className="space-y-4">
                            <button onClick={handleGoogleSignIn} disabled={!!loading} className="w-full h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all bg-white text-brand-gray-900 hover:bg-brand-gray-200 flex items-center justify-center gap-3">
                                {loading === 'google' ? <Loader2 className="animate-spin" /> : <><GoogleIcon /> Continue with Google</>}
                            </button>
                            <button onClick={() => setView('phone')} disabled={!!loading} className="w-full h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all bg-brand-gray-50/10 border border-brand-gray-50/20 text-brand-gray-50 hover:bg-brand-gray-50/20 flex items-center justify-center gap-3">
                                <Phone size={18} /> Continue with Phone
                            </button>
                         </div>
                    )}
                    
                    {view === 'phone' && (
                        <>
                            {!confirmationResult ? (
                                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                                    <div className="relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-brand-gray-400">+91</span>
                                      <input 
                                        type="tel" 
                                        placeholder="Your 10-digit number" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg h-16 pl-14 pr-4 text-lg text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                                      />
                                    </div>
                                    <button type="submit" disabled={loading === 'otp' || phone.length !== 10} className="w-full bg-brand-tan text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-50 flex items-center justify-center">
                                        {loading === 'otp' ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                     <p className="text-xs text-center text-brand-gray-400">Enter the 6-digit code sent to +91 {phone}.</p>
                                    <div className="relative">
                                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-400" />
                                      <input 
                                        type="tel" 
                                        placeholder="_ _ _ _ _ _" 
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full bg-brand-gray-50/5 border border-brand-gray-50/10 rounded-lg h-16 text-center tracking-[0.5em] text-2xl text-brand-gray-50 focus:outline-none focus:border-brand-tan transition-colors placeholder:text-brand-gray-50/20"
                                      />
                                    </div>
                                    <button type="submit" disabled={loading === 'otp' || otp.length !== 6} className="w-full bg-brand-gold text-brand-gray-950 h-16 rounded-2xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-white disabled:opacity-50 flex items-center justify-center">
                                        {loading === 'otp' ? <Loader2 className="animate-spin" /> : 'Verify & Sign In'}
                                    </button>
                                </form>
                            )}
                            <button onClick={() => { setView('options'); setError(''); setConfirmationResult(null); }} className="text-xs text-brand-gray-500 hover:text-brand-gray-50 transition-colors font-semibold mt-6 text-center w-full">
                                &larr; Back to options
                            </button>
                        </>
                    )}

                    {error && <p className="text-brand-error text-xs text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
