/* =========================================================
   EBRM 2.0 · Service Worker
   ---------------------------------------------------------
   - 新缓存命名（v2），activate 时清除所有旧 EBRM 缓存
   - 只预缓存应用外壳与索引；经文按卷按需缓存
   - 不做任何 HTML 内容改写（no runtime patch）
   - 网络优先、失败回退缓存；绝不阻塞首次加载
========================================================= */

const CACHE = 'ebrm-v2-prod-20260915';
const LEGACY = ['ebrm-v1-production', 'ebrm-live-2024'];

const SHELL = [
  './',
  './index.html',
  './john1.html',
  './ebrm2.css',
  './ebrm-content.js',
  './ebrm-engine.js',
  './ebrm-app.js',
  './manifest.json',
  './data/books.json',
  './data/lexicon.json',
  './data/john1-course.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      /* 逐个添加，单个失败不影响整体安装 */
      return Promise.all(SHELL.map((url) =>
        cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
      ));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => {
        const isOurs = /^ebrm-/i.test(k);
        const isLegacy = LEGACY.indexOf(k) >= 0;
        if ((isOurs || isLegacy) && k !== CACHE) return caches.delete(k);
        return null;
      }))
    ).then(() => self.clients.claim())
  );
});

function isScripture(url) {
  return /\/data\/(nt\/[A-Z0-9]+\.json|nt-engwebp\.json)$/.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* 跨域交给网络 */

  /* 经文数据：缓存优先（内容固定），后台更新 */
  if (isScripture(url)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const network = fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => hit);
        return hit || network;
      })
    );
    return;
  }

  /* 页面导航：网络优先（保证拿到最新版），失败回退缓存 */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  /* 其它静态资源：缓存优先 + 后台更新 */
  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
