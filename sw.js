const CACHE_NAME = 'aljisr-v2026-08-01-dedup';
const CORE = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(CORE.map(u => cache.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  if(event.request.mode === 'navigate'){
    event.respondWith(fetch(event.request).then(r => { const c=r.clone(); caches.open(CACHE_NAME).then(x=>x.put('./index.html',c)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request).then(r => { if(r && r.ok && new URL(event.request.url).origin === location.origin){ const c=r.clone(); caches.open(CACHE_NAME).then(x=>x.put(event.request,c)); } return r; }).catch(() => caches.match(event.request)));
});
