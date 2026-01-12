
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  // The service worker can fail to register in some development environments
  // due to cross-origin security policies. We will conditionally register it
  // to avoid console errors in those environments, while keeping it active
  // for production.
  const isDevEnvironment = window.location.hostname.endsWith('usercontent.goog');

  if (!isDevEnvironment) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  } else {
    console.warn('Service Worker registration skipped in this development environment due to cross-origin restrictions.');
  }
}
