/* Almoços RM — service worker (rede-primeiro p/ o app, cache p/ offline) */
const CACHE = 'almocos-rm-v8';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isAppShell(req, url) {
  return req.mode === 'navigate' || url.endsWith('/') || url.endsWith('/index.html');
}

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('firebaseio.com') || url.includes('gstatic.com') ||
      url.includes('googleapis.com') || url.includes('cdnjs.cloudflare.com') ||
      e.request.method !== 'GET') {
    return; /* sempre rede, sem cache */
  }
  /* App (index.html / navegação): REDE PRIMEIRO, cache como reserva offline */
  if (isAppShell(e.request, url)) {
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  /* Estáticos (ícones, manifest): cache primeiro */
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached)
    )
  );
});
