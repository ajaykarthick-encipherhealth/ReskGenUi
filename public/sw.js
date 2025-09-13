// Service Worker for better caching and performance
const CACHE_NAME = 'hcc-app-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/logo192.png',
  '/manifest.json',
  // Add critical CSS and JS files here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static assets - cache first
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2)$/)) {
      event.respondWith(
        caches.match(request).then(response => {
          return response || fetch(request).then(fetchResponse => {
            return caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
      );
    }
    // API requests - network first with cache fallback
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(request)
          .then(response => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback to cache
            return caches.match(request);
          })
      );
    }
    // HTML pages - network first, cache fallback
    else {
      event.respondWith(
        fetch(request)
          .then(response => {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    }
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync operations
      console.log('Background sync triggered')
    );
  }
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.png',
      badge: '/favicon.png',
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});