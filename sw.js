// Filnamn: sw.js
const CACHE_NAME = 'mybeeapp-v2';
const ASSETS_TO_CACHE = [
  './index.html',
  './snabbkoll.html',
  './bigardsstatus.html',
  './historik.html',
  './drottningar.html',
  './foder.html',
  './varroa.html',
  './honung.html',
  './verktyg.html',
  './inventarie.html',
  './ekonomi.html',
  './odling.html',
  './kalender.html',
  './vaxhantering.html',
  './sasong.html',
  './ny-bigard.html',
  './skotsel.html',
  './header.js',
  './api.js',
  './style.css',
  './manifest.json',
  './icon.png'
];

// Installera och cacha filer
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivera och rensa gamla cachar (viktigt för att rensa v1 -> v2)
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

// Hämtningsstrategi: Försök alltid med nätverket först, falla tillbaka på cache om vi är offline
self.addEventListener('fetch', (event) => {
  // Hoppa över externa anrop (som Google Sheets API / Leaflet kartor) så de aldrig fastnar i cachen
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
