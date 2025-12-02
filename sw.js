const CACHE_VERSION = 'v2';
const CACHE_NAME = `oasis-tours-${CACHE_VERSION}`;

// Assets to cache
const STATIC_ASSETS = [
  '/Oasis-Tours-Travels/',
  '/Oasis-Tours-Travels/index.html',
  '/Oasis-Tours-Travels/dist/style.css',
  '/Oasis-Tours-Travels/script.js',
  '/Oasis-Tours-Travels/font/Lausanne-300.woff2',
  '/Oasis-Tours-Travels/font/Lausanne-500.woff2',
  '/Oasis-Tours-Travels/Images/Oasis%20Logo.webp',
  '/Oasis-Tours-Travels/Images/Oasis%20Logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('oasis-tours-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache strategy for different asset types
  if (
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|mp4|webm|mov|woff2|woff|ttf|css|js)$/)
  ) {
    // Cache first, fallback to network (for static assets)
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Cache the new response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else {
    // Network first, fallback to cache (for HTML)
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});
