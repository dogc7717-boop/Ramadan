const cacheName = 'sameh-nady-pro-v2';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo&display=swap',
  'https://www.soundjay.com/buttons/sounds/button-16.mp3'
];

// تثبيت الخدمة وحفظ الملفات في الذاكرة
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// تشغيل التطبيق حتى لو مفيش إنترنت (Offline Mode)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});

// تحديث الملفات لو عدلت الكود
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
