const VERSION = 'duoplans-v1';
const ARCHIVOS_SHELL = ['./', './index.html', './pwa.js', './manifest.webmanifest', './icons/icon-192.png'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(VERSION).then(cache => Promise.allSettled(ARCHIVOS_SHELL.map(a => cache.add(a))))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {const VERSION = 'duoplans-v1';
// Definimos el App Shell (Archivos esenciales)
const ARCHIVOS_SHELL = [
    './',
    './index.html',
    './pwa.js',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './gemini_generated_video_ade2e948.mp4'
];

// 1. INSTALACIÓN: Uso de caches.open y cache.add
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(VERSION).then(cache => {
            console.log('Caché abierta, guardando App Shell');
            return Promise.allSettled(ARCHIVOS_SHELL.map(archivo => cache.add(archivo)));
        })
    );
    self.skipWaiting();
});

// 2. ACTIVACIÓN: Uso de caches.keys y caches.delete
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== VERSION)
                    .map(key => {
                        console.log('Eliminando caché antigua:', key);
                        return caches.delete(key);
                    })
            );
        })
    );
    self.clients.claim();
});

// 3. INTERCEPCIÓN (Network First): Uso de caches.open, cache.put y caches.match
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        fetch(e.request)
            .then(res => {
                // Si hay internet y la respuesta es válida, clonamos y guardamos (cache.put)
                const copia = res.clone();
                caches.open(VERSION).then(cache => {
                    cache.put(e.request, copia);
                });
                return res;
            })
            .catch(() => {
                // Si falla la red (offline), buscamos en la caché global (caches.match)
                return caches.match(e.request).then(resCache => {
                    // Retorna el archivo de caché, o el index.html como respaldo final
                    return resCache || caches.match('./index.html');
                });
            })
    );
});
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request).then(res => {
            const copia = res.clone();
            caches.open(VERSION).then(cache => cache.put(e.request, copia));
            return res;
        }).catch(() => caches.match(e.request).then(res => res || caches.match('./index.html')))
    );
});