/*navigator.serviceWorker && navigator.serviceWorker.register('assets/native/js/sw.js').then(function() {
  console.log('Service Worker Registered');
});*/
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('assets/sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }