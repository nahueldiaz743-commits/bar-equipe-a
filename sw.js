const CACHE='bar-a-v89';
const STATIC=['./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
    .then(()=>clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('index_v3.html')){
    e.respondWith(
      fetch(new Request(e.request.url,{cache:'no-store',headers:{'Cache-Control':'no-cache'}}))
      .catch(()=>caches.match(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>new Response(''))));
});
