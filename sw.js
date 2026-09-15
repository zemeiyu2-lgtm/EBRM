const CACHE = "ebrm-v1-complete";
const SHELL = ["./","./index.html","./john1.html","./app.js","./style.css","./manifest.json"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(async cache => { await cache.addAll(SHELL); return self.skipWaiting(); })));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); return res; }).catch(() => caches.match("./index.html"))));
    return;
  }
  if (url.origin === "https://bible.helloao.org") {
    event.respondWith(fetch(event.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); return res; }).catch(() => caches.match(event.request)));
  }
});