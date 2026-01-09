
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFound: React.FC = () => {
    
  useEffect(() => {
    const pageTitle = '404: Not Found | BAZZARO';
    const pageDescription = "The page you are looking for doesn't exist or has been moved.";
    
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24 flex flex-col items-center justify-center text-center px-8">
        <Compass size={48} className="opacity-20 stroke-1 mb-6" />
        <h1 className="font-serif text-5xl italic mb-4">404</h1>
        <h2 className="text-xl font-bold text-brand-gray-200 mb-2">Object Not Found</h2>
        <p className="text-brand-gray-500 mb-8 text-sm max-w-xs">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="bg-brand-gray-50 text-brand-gray-950 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-white active:scale-95">
            Return to Archive
        </Link>
    </div>
  );
};

export default NotFound;
