// Minimal service worker — 앱 셸 캐시 + 네트워크 우선 fetch
const CACHE = 'doctor-letter-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // API 호출은 절대 캐시하지 않음
  const url = new URL(req.url);
  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/me') ||
      url.pathname.startsWith('/create') || url.pathname.startsWith('/update') ||
      url.pathname.startsWith('/delete')) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
