/* =====================================================================
   NHÂN VẬT: MẮT CHẤM + TRANG PHỤC (3 skin mỗi người)
   Nạp NGAY SAU js/do-hoa.js và js/trang-phuc.js. Không sửa hình gốc (HD_CHARS trong do-hoa.js, assets/characters/):
   lúc khởi động file này thay nhóm mắt của từng hình bằng mắt chấm, rồi custSVG / profSVG ghép trang phục theo skin.

   MẮT — theo bản vẽ tay: hai chấm mực đặc, không tròng trắng. Mỗi người khác nhau ở cỡ chấm (r), độ dẹt (k = ry/rx),
   lông mi (lash: 0/1/2 nét), nếp nhăn đuôi mắt (crease), và kiểu "mắt cười" (smiley: lúc bình thường đã là hai vòng
   cung, như Cô Mai). Biểu cảm: bình thường = chấm; vui = hai vòng cung ◠ ◠; bực = chấm (miệng và dấu bực nằm ở hình
   gốc). Mí chớp (.blinklid) giữ nguyên cơ chế cũ, cỡ vừa chấm.

   SKIN — skin 0 là "Cổ điển" (đúng hình gốc). Skin 1, 2 khai báo trong js/trang-phuc.js (xem định dạng ở đầu file đó).
   ===================================================================== */
'use strict';

// chỉ số theo HD_CHARS: 0 = giáo sư, 1..10 = khách 0..9 (CUSTOMERS)
const EYE_STYLE = [
  {r:3.6, k:1.1},                    // 0 Giáo sư Hoffmann — chấm tròn sau cặp kính tròn
  {r:3.2, k:1.05},                   // 1 Bà Tư — chấm nhỏ sau kính
  {r:3.8, k:0.85},                   // 2 Chú Ba — hơi nheo, quen nắng ruộng
  {r:4.4, k:1.15, lash:1},           // 3 Bé Na — chấm to, một nét mi
  {r:3.8, k:0.8},                    // 4 Anh Minh — dẹt, trông vội
  {r:4.0, k:1.1, lash:1},            // 5 Cô Lan
  {r:3.2, k:0.8, crease:1},          // 6 Ông Sáu — nhỏ, có nếp nhăn đuôi mắt
  {r:4.6, k:1.2},                    // 7 Bạn Tí — to tròn, tinh nghịch
  {r:4.0, k:1.0, lash:2},            // 8 Chị Hoa — hai nét mi
  {r:3.6, k:1.0},                    // 9 Thầy Nam
  {r:3.8, k:1.0, lash:1, smiley:1}   // 10 Cô Mai — lúc nào cũng cười híp mắt
];
const EYE_INK = '#1f1812';

// nhóm <g …> bắt đầu ở vị trí at: trả về vị trí ngay sau thẻ </g> khớp với nó (đếm cả <g> lồng bên trong)
function gEnd(s, at){
  let depth = 0, i = at;
  const re = /<g[\s>]|<\/g>/g; re.lastIndex = at;
  for(let m; (m = re.exec(s));){
    if(m[0] === '</g>'){ if(--depth === 0) return m.index + 4; }
    else depth++;
    i = m.index;
  }
  return -1;
}
function dotEyes(i, eyes, lid){
  const st = EYE_STYLE[i] || {r:3.8, k:1}, r = st.r, ry = +(r*st.k).toFixed(2), f = v => (+v).toFixed(1);
  const open = [], arc = [];
  eyes.forEach(([x, y], n) => {
    const s = n === 0 ? 1 : -1;      // mắt trái: đuôi mắt hướng trái (s = 1), mắt phải ngược lại
    open.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${r}" ry="${ry}" fill="${EYE_INK}"/>`);
    arc.push(`<path d="M${f(x - r - 2)},${f(y + 1)} q${f(r + 2)},${f(-(r + 4))} ${f(2*r + 4)},0" fill="none" stroke="${EYE_INK}" stroke-width="2.6" stroke-linecap="round"/>`);
    const lash = [];
    if(st.lash) lash.push(`<path d="M${f(x - s*(r + 0.5))},${f(y - ry*0.5)} l${f(-s*4.5)},-4" fill="none" stroke="${EYE_INK}" stroke-width="2" stroke-linecap="round"/>`);
    if(st.lash > 1) lash.push(`<path d="M${f(x - s*r*0.4)},${f(y - ry - 0.5)} l${f(-s*3)},-4.5" fill="none" stroke="${EYE_INK}" stroke-width="1.8" stroke-linecap="round"/>`);
    if(st.crease) lash.push(`<path d="M${f(x - s*(r + 3))},${f(y + 1)} l${f(-s*4)},2 M${f(x - s*(r + 3))},${f(y + 3.5)} l${f(-s*3.5)},3" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`);
    open.push(...lash); arc.push(...lash);
    open.push(`<rect class="blinklid" x="${f(x - r - 1.5)}" y="${f(y - ry - 1.5)}" width="${f(2*r + 3)}" height="${f(2*ry + 3)}" rx="${f(r)}" fill="${lid}"/>`);
  });
  return `<g class="eyes2${st.smiley ? ' eo-smiley' : ''}"><g class="eo-open">${open.join('')}</g><g class="eo-arc">${arc.join('')}</g></g>`;
}
// thay nhóm mắt cũ (nhóm <g stroke="#3b3025" stroke-width="2"> cuối cùng có mí chớp hoặc mắt trăng khuyết)
function reworkEyes(svg, i){
  const head = '<g stroke="#3b3025" stroke-width="2">';
  let at = svg.lastIndexOf(head);
  while(at >= 0){
    const end = gEnd(svg, at), g = svg.slice(at, end);
    const ell = [...g.matchAll(/<ellipse cx="([\d.]+)" cy="([\d.]+)" rx="[\d.]+" ry="[\d.]+" fill="#fff/g)].map(m => [+m[1], +m[2]]);
    const cres = [...g.matchAll(/<path d="M([\d.]+),([\d.]+) q([\d.]+),-[\d.]+ [\d.]+,0" fill="none" stroke-width="3.2"/g)].map(m => [+m[1] + +m[3], +m[2] - 1]);
    const eyes = ell.length >= 2 ? ell.slice(0, 2) : cres.length >= 2 ? cres.slice(0, 2) : null;
    if(eyes){
      const lidM = g.match(/class="blinklid"[^>]*fill="([^"]+)"/), skinM = svg.match(/id="(hd\d+e?_c\d+skin)"/);
      const lid = lidM ? lidM[1] : skinM ? 'url(#' + skinM[1] + ')' : '#eec9a1';
      eyes.sort((a, b) => a[0] - b[0]);
      return svg.slice(0, at) + dotEyes(i, eyes, lid) + svg.slice(end);
    }
    at = svg.lastIndexOf(head, at - 1);
  }
  return svg;
}
if(typeof HD_CHARS !== 'undefined') for(let i = 0; i < HD_CHARS.length; i++) HD_CHARS[i] = reworkEyes(HD_CHARS[i], i);

/* ---------- TRANG PHỤC ---------- */
const SKIN_CLASSIC = 'Cổ điển';
const skinsOf = i => [{ten:SKIN_CLASSIC}].concat((typeof TRANG_PHUC !== 'undefined' && TRANG_PHUC[i]) || []);
const SKIN_COUNT = 3;
// đổi màu các điểm dừng của một gradient (giữ nguyên số điểm dừng: thiếu màu thì dùng màu cuối)
function recolorGrad(svg, id, cols){
  const re = new RegExp('(<(linear|radial)Gradient id="' + id.replace(/[()]/g, '\\$&') + '"[^>]*>)([\\s\\S]*?)(</\\2Gradient>)', 'g');
  return svg.replace(re, (all, open, kind, body, close) => {
    let n = 0;
    body = body.replace(/stop-color(="|:)(#[0-9a-fA-F]{3,8}|rgb\([^)]*\)|[a-z]+)/g, (m, sep) => 'stop-color' + sep + cols[Math.min(n++, cols.length - 1)]);
    return open + body + close;
  });
}
function applySkin(svg, i, k){
  const sk = k ? skinsOf(i)[k] : null;
  if(!sk) return svg;
  // 1. đổi màu gradient: khoá đủ id ('hd4_c3cloth') hoặc đuôi id ('c3cloth' — áp cho mọi gradient có đuôi đó, kể cả bản 'hd4e_…')
  for(const key of Object.keys(sk.grad || {})){
    const ids = key.startsWith('hd') ? [key] : [...new Set([...svg.matchAll(new RegExp('Gradient id="(hd\\d+e?_+' + key + ')"', 'g'))].map(m => m[1]))];
    ids.forEach(id => { svg = recolorGrad(svg, id, sk.grad[key]); });
  }
  // 2. thay màu trơn (cả hình): [['#9b7bb8','#4f8a6b'], ['rgb(155,123,184)','#4f8a6b']]
  for(const [a, b] of sk.swap || []) svg = svg.split(a).join(b);
  // 3. lớp vẽ thêm: under = sau lưng mọi thứ, over = đè lên quần áo nhưng dưới mắt
  if(sk.under) svg = svg.replace(/(<svg[^>]*>)/, '$1' + sk.under);
  if(sk.over){ const e = svg.indexOf('<g class="eyes2'); svg = e >= 0 ? svg.slice(0, e) + sk.over + svg.slice(e) : svg.replace('</svg>', sk.over + '</svg>'); }
  // 4. đổi tên mọi id của hình theo skin: hai skin của cùng một người đứng cạnh nhau (trang xem thử) không giẫm gradient của nhau
  return svg.replace(/(id="|url\(#|href="#)(hd\d+)/g, '$1$2k' + k);
}
// ghép hình khách: thân (đã đổi mắt) + trang phục skin k + đạo cụ (skin có thể thay đạo cụ cổ điển: prop:'' là bỏ)
const custArtMemo2 = {};
function custArt(i, k){
  k = k || 0;
  const key = i + ':' + k;
  if(custArtMemo2[key]) return custArtMemo2[key];
  const sk = skinsOf(i + 1)[k] || {};
  const prop = sk.prop !== undefined ? sk.prop : (CUST_PROPS[i] || '');
  return (custArtMemo2[key] = applySkin(HD_CHARS[i + 1].replace('</svg>', prop + '</svg>'), i + 1, k));
}
function custSVG(i, exp, k){ return custArt(i, k).replace('data-exp="neutral"', 'data-exp="' + exp + '"'); }
function custHead(i, k){ return custArt(i, k).replace(/viewBox="[^"]+"/, 'viewBox="' + HD_HEADS[i + 1] + '"'); }
const profMemo = {};
function profSVG(exp, k){
  k = k || 0;
  const art = profMemo[k] || (profMemo[k] = applySkin(HD_CHARS[0], 0, k));
  return art.replace('data-exp="neutral"', 'data-exp="' + exp + '"');
}
// skin của khách cho một đơn: đổi theo ngày và lượt khách nên cùng một người mỗi lần ghé một bộ đồ,
// mà chơi lại đúng ngày đó vẫn y như cũ. Ca tự do: ngẫu nhiên.
function custSkinFor(dayIndex, orderIndex, who){
  if(dayIndex < 0) return Math.floor(Math.random()*SKIN_COUNT);
  return (dayIndex*7 + orderIndex*3 + who) % SKIN_COUNT;
}
// giáo sư đổi đồ theo chương (themeOf trong giao-dien.js: 1..5); menu và màn hình chính mặc đồ cổ điển
const profSkinFor = dayIndex => dayIndex == null || dayIndex < 0 ? 0 : (typeof themeOf === 'function' ? themeOf(dayIndex) : 0) % SKIN_COUNT;
