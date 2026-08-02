// Filnamn: sw.js
const CACHE_NAME = 'mybeeapp-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'snabbkoll.html',
  'bigardsstatus.html',
  'historik.html',
  'drottningar.html',
  'foder.html',
  'varroa.html',
  'honung.html',
  'verktyg.html',
  'inventarie.html',
  'ekonomi.html',
  'odling.html',
  'kalender.html',
  'vaxhantering.html',
  'sasong.html',
  'ny-bigard.html',
  'skotsel.html',
  'header.js',
  'api.js',
  'style.css'
];


// Installera service workern och cacha alla filer
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivera och rensa gamla cachar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Hämta filer från cache när man är offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Om nätverket saknas och sidan inte finns i cache kan man returnera en fallback om man vill
      });
    })
  );
});
