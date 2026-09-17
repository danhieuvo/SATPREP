/* Offline support. Always asks the server for the newest files first (skipping the browser's own
   HTTP cache), and falls back to the saved copy only when offline. Question-bank chunks are saved
   as they load, so lessons already visited work offline. */
const CACHE = 'satquest-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.includes('/rest/v1/')) return;   // never cache pack data
  const sameOrigin = url.origin === location.origin;
  // Revalidate same-origin files every time so edits show up on the next reload.
  const fresh = sameOrigin && req.mode !== 'navigate' ? new Request(req, { cache: 'no-cache' }) : req;
  e.respondWith(
    fetch(fresh, req.mode === 'navigate' ? { cache: 'no-cache' } : undefined).then(res => {
      if (res.ok && (sameOrigin || url.hostname.endsWith('cdnjs.cloudflare.com') || url.hostname.includes('fonts.g'))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || Response.error()))
  );
});
