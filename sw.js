/**
 * ISKAR - Service Worker v8
 * لضمان عمل التطبيق بدون إنترنت وتحديث الأكواد فوراً
 */

const cacheName = 'iskar-pro-v8';

// قائمة الملفات التي سيتم تخزينها ليعمل التطبيق بدون إنترنت
const assets = [
  './',
  './index.html',
  './script.js',
  './manifest.json',
  './icon.png',
  './Egypt.mp3',
  './Egypt_1.mp3',
  './Egypt_2.mp3',
  './Egypt_3.mp3'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', e => {
  self.skipWaiting(); // إجبار التحديث فوراً
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// حذف الكاش القديم عند تفعيل الإصدار الجديد
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== cacheName).map(k => caches.delete(k))
      );
    })
  );
});

// استدعاء الملفات من الكاش لضمان السرعة والعمل بدون نت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
