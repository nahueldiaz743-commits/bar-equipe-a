const CACHE='bar-a-v60';
const STATIC=['./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ).then(()=>clients.claim()));
});
self.addEventListener('fetch',e=>{
  // index_v3.html → toujours depuis réseau (jamais depuis cache)
  if(e.request.url.includes('index_v3.html')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  // Autres ressources → cache first
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>new Response(''))));
});
