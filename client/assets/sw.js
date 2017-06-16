var dataCacheName = 'emissaryData-v1';
var cacheName = 'emissaryPWA';
var filesToCache = [
  '/',
 // '/assets/views/index.html',
  '/assets/images/emissary.png',
  '/assets/images/slide-img-1.png',
  '/assets/images/slide-img-2.png',
  '/assets/images/slide-img-3.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

});

self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).catch(function() {
    return fetch(e.request);
  }).then(function(response) {
    caches.open(cacheName).then(function(cache) {
      cache.put(e.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('/assets/images/emissary.png');
  }));
});
