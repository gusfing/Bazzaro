
const CACHE_NAME = 'bazzaro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Remove files that might not exist or cause issues
  // '/index.tsx', // This is a source file, not a built asset
  // '/BAZZARO DARK LOGO (1).png', // This might have spaces causing issues
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        // Not in cache, fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response because it's a stream and can only be consumed once
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache http/https requests
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache).catch(error => {
                    console.warn('Failed to cache request:', error);
                  });
                }
              });

            return networkResponse;
          }
        ).catch(error => {
          console.warn('Fetch failed:', error);
          // Return a fallback response or just let it fail
          return new Response('Network error', { status: 503 });
        });
      })
  );
});

// Optional: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
