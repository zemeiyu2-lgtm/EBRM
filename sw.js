/* EBRM Service Worker — production
   新缓存命名：ebrm-v1-production（activate 时自动清理全部旧缓存）
   不做任何 HTML 内容改写；本地静态文件与经文数据正常缓存；
   网络失败时回退缓存；不阻止页面首次加载。 */
const CACHE = 'ebrm-v1-production';
const SHELL = [
  './',
  './index.html',
  './john1.html',
  './app.js',
  './style.css',
  './manifest.json',
  './data/nt-engwebp.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  /* 同源：网络优先，失败回退缓存（导航请求最终回退 index.html） */
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() =>
        caches.match(req).then(hit =>
          hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)
        )
      )
    );
    return;
  }

  /* 圣经 API：网络优先，失败回退缓存；不代理、不改写 */
  if (url.origin === 'https://bible.helloao.org') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() =>
        caches.match(req).then(hit => hit || new Response(
          JSON.stringify({ error: 'Bible source unavailable' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        ))
      )
    );
  }
  /* 其他跨域请求：直接放行 */
});
