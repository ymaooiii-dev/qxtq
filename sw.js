const CACHE_NAME = 'mood-weather-v5';
const ASSETS = [
  './index.html',
  './manifest.json',
  './logo192.png',
  './logo512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 网络优先策略，因为我们依赖浏览器实时编译源码
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果网络请求成功，克隆一份存入缓存（可选）
        return response;
      })
      .catch(() => {
        // 网络失败才看缓存
        return caches.match(event.request);
      })
  );
});