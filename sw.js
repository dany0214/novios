const CACHE = 'duoplans-v1';
const ARCHIVOS = ['./', './index.html', './pwa.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  // Tolerante: si un archivo falla, no se cancela toda la instalación
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ARCHIVOS.map(a => c.add(a)))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Primero red; si no hay internet, usa la copia guardada
// (también guarda Tailwind y FontAwesome para que la app abra sin conexión)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
