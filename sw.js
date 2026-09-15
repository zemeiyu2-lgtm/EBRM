const CACHE = "ebrm-v1-final2";
const SHELL = ["./","./index.html","./john1.html","./app.js","./style.css","./manifest.json"];
const PROXY = "https://api.allorigins.win/raw?url=";

async function patchIndex(response){
  if(!response) return response;
  const h=new Headers(response.headers); h.delete("content-length");
  let text=await response.text();
  if(text.includes("EBRM_RUNTIME_PATCH")) return new Response(text,{status:response.status,statusText:response.statusText,headers:h});
  const patch=`<script id="EBRM_RUNTIME_PATCH">
(()=>{
const API='https://bible.helloao.org/api/engwebp',LOCAL='./data/nt-engwebp.json';
async function json(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));return r.json()}
async function chapterData(){
 try{const x=await json(LOCAL);const b=x.books?.find(v=>v.id===state.book);const c=b?.chapters?.find(v=>Number(v.number??v.chapter?.number)===state.chapter);const ch=c?.chapter||c;if(ch?.content?.length)return{chapter:ch}}catch(_){ }
 try{return await json(API+'/' + state.book + '/' + state.chapter + '.simple.json')}catch(_){return await json(PROXY+encodeURIComponent(API+'/' + state.book + '/' + state.chapter + '.simple.json'))}
}
async function robustLoadChapter(){
 const b=book();$('chapterTitle').textContent=b[1]+' '+state.chapter;$('sourceMeta').textContent='World English Bible · 本地优先 / 在线回退';$('verseArea').innerHTML='<div class="loader">正在载入英文经文…</div>';
 try{state.data=await chapterData();renderVerses();renderTraining();fillChapters();}catch(e){$('verseArea').innerHTML='<div class="card"><b>经文暂时无法显示</b><p style="margin-top:5px">系统已尝试本地数据、官方 API 与备用通道。</p><button class="btn primary" style="margin-top:9px" onclick="loadChapter()">重新加载</button></div>'}
}
window.loadChapter=robustLoadChapter;
window.openChapter=(id,ch)=>{state.book=id;state.chapter=ch;state.activeTab='baseline';fillChapters();renderBooks($('bookSearch').value);robustLoadChapter();location.hash='reader'};
window.openBook=(id,ch=1)=>window.openChapter(id,ch);
const css=document.createElement('style');css.textContent='.verses{max-width:930px!important;margin:auto!important;padding:18px 6px!important;min-height:180px!important}.verse{display:block!important;padding:8px 10px!important;border-radius:10px!important;margin:2px 0!important}.verse:hover{background:#fffaf1}.loader{padding:46px 20px!important;border:1px dashed #e2d9cc!important;border-radius:14px!important;background:#fffaf1}.btn{transition:.15s ease}.btn:hover{transform:translateY(-1px)}';document.head.appendChild(css);
const map={'读经':'读经','训练':'训练','复习':'复习','计划':'计划','设置':'设置'};document.querySelectorAll('.navs a').forEach(a=>{if(map[a.textContent.trim()])a.title='EBRM '+a.textContent.trim()});
setTimeout(()=>robustLoadChapter(),0);
})();
</script>`;
  text=text.replace('</body>',patch+'</body>');
  return new Response(text,{status:response.status,statusText:response.statusText,headers:h});
}

self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(async cache => { await cache.addAll(SHELL); return self.skipWaiting(); })));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));

self.addEventListener("fetch", event => {
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin===self.location.origin){
    const isHtml=event.request.destination==='document' || url.pathname.endsWith('/index.html');
    if(isHtml){
      event.respondWith((async()=>{try{return await patchIndex(await fetch(event.request))}catch(_){return await patchIndex(await caches.match('./index.html'))}})());
      return;
    }
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return res}).catch(()=>caches.match('./index.html'))));
    return;
  }
  if(url.origin==='https://bible.helloao.org'){
    event.respondWith(fetch(event.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return res}).catch(async()=>{try{const res=await fetch(PROXY+encodeURIComponent(event.request.url),{cache:'no-store'});if(!res.ok)throw 0;return res}catch(_){return caches.match(event.request)||new Response(JSON.stringify({error:'Bible source unavailable'}),{status:503,headers:{'Content-Type':'application/json'}})}}));
  }
});