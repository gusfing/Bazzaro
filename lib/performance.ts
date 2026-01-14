// Performance optimization utilities

import { useCallback, useRef } from 'react';

// Debounce hook for expensive operations
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// Throttle hook for scroll/resize events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

// Image optimization helper
export function getOptimizedImageUrl(
  url: string, 
  width: number, 
  height?: number,
  format: 'webp' | 'avif' | 'jpg' = 'webp'
): string {
  // For Unsplash images, add optimization parameters
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams({
      w: width.toString(),
      h: height?.toString() || 'auto',
      fit: 'crop',
      fm: format,
      q: '80'
    });
    return `${url}?${params.toString()}`;
  }
  
  // For other images, return as-is (could integrate with image CDN)
  return url;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<IntersectionObserver>();
  
  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    } else {
      observerRef.current = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });
      observerRef.current.observe(element);
    }
  }, [callback, options]);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = undefined;
    }
  }, []);

  return { observe, unobserve, disconnect };
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
}

// Bundle size analyzer (development only)
export function analyzeBundleSize() {
  if (import.meta.env.DEV) {
    console.log('Bundle Analysis:');
    console.log('- React:', (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ? 'Loaded' : 'Not loaded');
    console.log('- Framer Motion:', typeof motion !== 'undefined' ? 'Loaded' : 'Not loaded');
    console.log('- Firebase:', typeof auth !== 'undefined' ? 'Loaded' : 'Not loaded');
  }
}