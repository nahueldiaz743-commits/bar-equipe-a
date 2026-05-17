const CACHE='bar-a-v82';
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
  // index_v3.html → toujours depuis réseau avec cache-bust
  if(e.request.url.includes('index_v3.html')){
    var bustUrl=new URL(e.request.url);
    bustUrl.searchParams.set('_sw','80');
    e.respondWith(
      fetch(new Request(bustUrl.toString(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}}))
      .catch(()=>caches.match(e.request))
    );
    return;
  }
  // Autres ressources → cache first
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>new Response(''))));
});
