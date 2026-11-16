/* Te Ara Whetū offline helper. Keeps a copy of the game on the device so it runs without a connection.
   VERSION changes whenever any file changes; the browser then fetches the new files in the background
   and uses them from the next time the game is opened. */
const VERSION = 'f99071b7cbf3';
const CACHE = 'te-ara-whetu-' + VERSION;
const FILES = [
  "./",
  "index.html",
  "assets/game.css",
  "assets/game.js",
  "manifest.webmanifest",
  "kiosk.webmanifest",
  "assets/icons/icon.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-180.png",
  "assets/fonts/atkinson-hyperlegible-mono-latin-ext.woff2",
  "assets/fonts/atkinson-hyperlegible-mono-latin.woff2",
  "assets/fonts/atkinson-hyperlegible-next-latin-ext.woff2",
  "assets/fonts/atkinson-hyperlegible-next-latin.woff2",
  "assets/fonts/fredoka-latin-ext.woff2",
  "assets/fonts/fredoka-latin.woff2"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('te-ara-whetu-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'))) {
    // the game page itself (with or without ?kiosk): serve the saved copy straight away
    event.respondWith(caches.match('index.html').then((hit) => hit || fetch(req)));
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
