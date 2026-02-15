const cacheName = 'iskar-pro-v3'; // تم تغيير الاسم لتجبر المتصفح على التحديث
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.png',
  './cover.jpg',
  // إضافة ملفات الأذان الجديدة للقائمة لتعمل بدون إنترنت
  './ Egypt.mp3',
  './ Egypt_1.mp3',
  './ Egypt_2.mp3',
  './ Egypt_3.mp3',
  'https://fonts.googleapis.com/css2?family=Cairo&display=swap'
];

// تثبيت الخدمة وحفظ الملفات الجديدة
self.addEventListener('install', e => {
  self.skipWaiting(); // إجبار النسخة الجديدة على التنشيط فوراً
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// تشغيل التطبيق في وضع الأوفلاين
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});

// حذف الكاش القديم (بما فيه كاش sameh-nady)
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
