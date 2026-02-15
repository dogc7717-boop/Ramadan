const cacheName = 'iskar-pro-v6'; // إصدار جديد
const assets = ['./', './index.html', './style.css', './script.js', './manifest.json', './Egypt.mp3', './Egypt_1.mp3', './Egypt_2.mp3', './Egypt_3.mp3'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(res => res || fetch(e.request))));
