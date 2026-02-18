const cacheName = 'iskar-v11';
const assets = ['./', './index.html', './script.js', './style.css', './manifest.json', './icon.png', './cover.jpg', './Egypt.mp3', './Egypt_1.mp3', './Egypt_2.mp3', './Egypt_3.mp3'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
