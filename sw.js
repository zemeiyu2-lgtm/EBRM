const CACHE = "ebrm-v1-final3";
const SHELL = ["./","./index.html","./john1.html","./app.js","./style.css","./manifest.json"];
const PROXY = "https://api.allorigins.win/raw?url=";
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if(url.origin === self.location.origin){
    event.respondWith(fetch(event.request).then(res => { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return res; }).catch(() => caches.match(event.request).then(r => r || caches.match("./index.html"))));
    return;
  }
  if(url.origin === "https://bible.helloao.org"){
    event.respondWith(fetch(event.request).then(res => { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return res; }).catch(async () => {
      try { const res=await fetch(PROXY+encodeURIComponent(event.request.url),{cache:"no-store"}); if(!res.ok) throw new Error("proxy"); return res; }
      catch(_) { return caches.match(event.request) || new Response(JSON.stringify({error:"Bible source unavailable"}),{status:503,headers:{"Content-Type":"application/json"}}); }
    }));
  }
});