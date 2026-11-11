/* Service worker: chơi được khi mất mạng (lớp học Wi-Fi chập chờn) sau lần mở đầu tiên.
   - Mã game, trang, hình: lấy bản mới trên mạng trước, mạng hỏng mới dùng bản đã lưu, nên sửa game xong không ai kẹt bản cũ.
   - Font: không bao giờ đổi, lấy thẳng bản đã lưu cho nhanh.
   Thêm file mới vào game thì thêm vào SHELL bên dưới (cùng danh sách với index.html và tools/dong-goi.ps1). */
'use strict';
const CACHE = 'chemlab-v1';
const SHELL = [
  './', 'index.html', 'style.css', 'favicon.png', 'favicon.ico',
  'js/loi-thoai.js', 'js/nhan-vat.js', 'js/phan-ung.js', 'js/du-lieu.js', 'js/lich.js', 'js/bai-giang.js',
  'js/do-hoa.js', 'js/trang-phuc.js', 'js/nhan-vat-skin.js', 'js/nhan-vat-nghieng.js', 'js/diem.js', 'js/giao-dien.js', 'js/phong-thi-nghiem.js', 'js/che-do.js', 'js/tham-quan.js', 'js/khoi-dong.js',
  'fonts/itim-latin.woff2', 'fonts/itim-latin-ext.woff2', 'fonts/itim-vietnamese.woff2',
  'fonts/patrick-hand-latin.woff2', 'fonts/patrick-hand-latin-ext.woff2', 'fonts/patrick-hand-vietnamese.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if(r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(r.url.includes('/fonts/') ? fromCache(r) : fromNetwork(r));
});
async function fromNetwork(r){
  try {
    const res = await fetch(r);
    if(res.ok){ const c = await caches.open(CACHE); c.put(r, res.clone()); }
    return res;
  } catch(err){
    const hit = await caches.match(r, {ignoreSearch: true});
    if(hit) return hit;
    throw err;
  }
}
async function fromCache(r){
  return (await caches.match(r)) || fromNetwork(r);
}
