const staticCacheName = 'cache-v1';
const filesToCache = [
  '/',
  'index.html',
  'css/animate.css',
  'css/bootstrap.css',
  'css/chocolat.css',
  'css/font-awesome.css',
  'css/font_dancing.css',
  'css/font_yanone.css',
  'css/style.css',
  'fonts/fontawesome-webfont.eot',
  'fonts/fontawesome-webfont.svg',
  'fonts/fontawesome-webfont.ttf',
  'fonts/fontawesome-webfont.woff',
  'fonts/fontawesome-webfont.woff2',
  'fonts/FontAwesome.otf',
  'fonts/glyphicons-halflings-regular.woff',
  'fonts/glyphicons-halflings-regular.woff2',
  'js/bootstrap.js',
  'js/controls.js',
  'js/easing.js',
  'js/jarallax.js',
  'js/app.js',
  'js/particles.min.js',
  'js/jquery-1.11.1.min.js',
  'js/jquery.chocolat.js',
  'js/jquery.filterizr.js',
  'js/SmoothScroll.min.js',
  'images/1.jpg',
  'images/profile.jpeg',
  'images/bg.png',
  'images/close.png',
  'images/left.png',
  'images/right.png',
  'view_offline.html',
  'view_404.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          return caches.match('view_404.html');
        }
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('view_offline.html');
    })
  );
});
