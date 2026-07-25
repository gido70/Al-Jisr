const CACHE = 'aljisr-v24';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for API calls (translation/speech must stay live),
// cache-first for the shell files so the app still opens without a connection.
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('translate') || url.includes('mymemory')) return; // never cache translation calls
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
