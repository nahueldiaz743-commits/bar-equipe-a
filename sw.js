const CACHE_NAME = 'bar-a-v198';
const urlsToCache = [];

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
    .then(() => {
      // Notifier les clients
      return self.clients.matchAll().then(cls => {
        cls.forEach(cl => cl.postMessage({type:'SW_UPDATED'}));
      });
    })
  );
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('index_v3.html') || e.request.url.includes('sw.js')){
    e.respondWith(fetch(e.request, {cache:'no-store'}));
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
