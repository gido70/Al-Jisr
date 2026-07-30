const CACHE_NAME = 'aljisr-v2026-07-30-2';
const APP_SHELL = ['./', './index.html', './manifest.json', './favicon-32.png', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.allSettled(APP_SHELL.map(url=>cache.add(url)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin) return;
  event.respondWith((async()=>{
    try{
      const fresh=await fetch(event.request);
      if(fresh && fresh.ok){ const cache=await caches.open(CACHE_NAME); cache.put(event.request,fresh.clone()); }
      return fresh;
    }catch(e){
      return (await caches.match(event.request)) || (await caches.match('./index.html'));
    }
  })());
});
