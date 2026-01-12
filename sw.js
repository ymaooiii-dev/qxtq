const CACHE_NAME = 'mood-v6';
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['./', './index.html', './manifest.json'])));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => k !== CACHE_NAME && caches.delete(k)))));
});
self.addEventListener('fetch', (e) => {
  // 仅针对图片和清单使用缓存，对 JS/TSX 始终走网络，防止 Babel 解析过期代码
  if (e.request.url.includes('png') || e.request.url.includes('json')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});