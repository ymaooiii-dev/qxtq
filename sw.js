const CACHE_NAME = 'mood-weather-v4';
const ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.tsx',
  './manifest.json',
  './services/storage.ts',
  './services/geminiService.ts',
  './components/MoodSelector.tsx',
  './components/MoodNoteInput.tsx',
  './components/TrendChart.tsx',
  './components/ClimateReportView.tsx',
  './components/Timeline.tsx'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.warn('Cache incomplete', err));
    })
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

self.addEventListener('fetch', (event) => {
  // 优先尝试网络，失败则走缓存（因为 Babel 需要获取最新的 .tsx 内容）
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});