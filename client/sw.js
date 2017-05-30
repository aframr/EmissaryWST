var dataCacheName = 'emissaryData-v1';
var cacheName = 'emissaryPWA';
var filesToCache = [
  '/',
  //'/assets/views/index.html',
  '/assets/images/emissary.png',
  '/assets/css/neon.min.css',
  '/assets/css/font-icons/entypo/css/entypo.min.css',
  '/assets/native/js/site.js',
  '/assets/js/jquery-1.11.3.min.js',
  '/assets/images/slide-img-1.png',
  '/assets/images/slide-img-2.png',
  '/assets/images/slide-img-3.png',
  '/assets/images/logo@2x_165.png',
  '/assets/images/slide-img-1-bg.png',
  '/assets/images/logo@2x_100.png'
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
  e.respondWith(
    caches.match(e.request).then(function(resp) {
      return resp || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });  
      });
    })
  );
});