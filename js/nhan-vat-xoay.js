/* =====================================================================
   NHÂN VẬT XOAY 3/4 — dáng "nghiêng vừa phải" lúc đi, dựng từ CHÍNH hình nhìn thẳng (không vẽ bộ hình riêng).
   Nạp SAU js/nhan-vat-skin.js. Xem thử: tools/xem-xoay.html.

   Cách làm (xoay giả 2,5D toàn thân): tách hình thẳng thành các lớp theo chiều sâu từ sau ra trước rồi dời bằng CSS —
     .tq-hairback  búi tóc sau đỉnh đầu, lớp tóc xõa sau lưng: lùi nhẹ về phía sau sọ
     .tq-head      hộp sọ / khuôn mặt: dịch nhẹ sang trái và thu hẹp theo góc 3/4
     .tq-hair      vòm tóc chính, mũ, nón: xoay và dịch sang trái ôm khít hộp sọ
     .tq-hairfront ngôi tóc, lọn mái trước trán, kẹp tóc, hoa cài, sọc mũ / kính bảo hộ trên mũ: dịch mạnh theo trán
     .tq-feat      nét trên mặt (mắt, lông mày, má hồng gần, miệng, kính, nếp nhăn…): trượt về bên trái, ép hẹp
     .tq-nose      mũi: nhô gần người xem nhất nên trượt nhiều nhất
     .tq-earfar    tai / khuyên tai / tóc mai / chùm tóc phía xa (bên trái hình): lùi vào sau mặt rồi ẩn
     .tq-blushfar  má hồng phía xa: co hẹp và nhạt đi
     .tq-earnear   tai / khuyên tai / tóc mai / chùm tóc phía gần: nhích vào theo mép má gần
     .tq-neck      cổ và bóng dưới cằm: dịch theo đầu và khớp vào hõm cổ áo
     .tq-body      thân áo ngoài: dịch sang trái và thu hẹp vai theo góc 3/4
     .tq-chest     chi tiết mặt trước ngực (cổ áo, ve áo, cà vạt, hàng cúc, tạp dề, yếm, khăn quàng, dây chuyền, đạo cụ):
                   trượt sang trái nhiều hơn thân áo để tạo chiều sâu ngực xoay 3/4
     .tq-arml / .tq-armr  hai cánh tay (tay xa khép vào sau ngực, tay gần dịch theo vai gần; lúc bước đánh ngược nhịp)
   ===================================================================== */
'use strict';

const XOAY_NS = 'http://www.w3.org/2000/svg';
let xoayHost = null;

function xoayBuild(svgStr){
  if(typeof document === 'undefined' || !document.body) return svgStr;
  if(!xoayHost || !xoayHost.isConnected){
    xoayHost = document.createElement('div');
    xoayHost.setAttribute('aria-hidden', 'true');
    xoayHost.style.cssText = 'position:absolute;left:-9999px;top:0;width:300px;height:300px;visibility:hidden;pointer-events:none;overflow:hidden';
    document.body.appendChild(xoayHost);
  }
  xoayHost.innerHTML = svgStr.replace('<svg ', '<svg style="width:280px;height:280px" ').replace(/data-exp="[^"]*"/, 'data-exp="annoy"');
  const svg = xoayHost.firstElementChild;
  const root = svg && svg.getScreenCTM && svg.getScreenCTM();
  if(!root){ xoayHost.innerHTML = ''; return svgStr; }
  const inv = root.inverse();
  const box = el => {
    const r = el.getBoundingClientRect();
    if(!r.width && !r.height) return null;
    const a = new DOMPoint(r.left, r.top).matrixTransform(inv), b = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
    return {x0:a.x, y0:a.y, x1:b.x, y1:b.y, w:b.x - a.x, h:b.y - a.y, cx:(a.x + b.x)/2, cy:(a.y + b.y)/2};
  };
  const eyes = [...svg.querySelectorAll('.eyes2 .eo-open ellipse')].map(box).filter(Boolean);
  if(eyes.length < 2){ xoayHost.innerHTML = ''; return svgStr; }
  const cx = (eyes[0].cx + eyes[1].cx)/2, ey = (eyes[0].cy + eyes[1].cy)/2;
  const vb = (svg.getAttribute('viewBox') || '0 0 200 280').split(/\s+/).map(Number), H = vb[3];

  const wrap = (el, cls, px, py) => {
    const P = el.parentNode, pm = P.getScreenCTM ? P.getScreenCTM() : root;
    const o = new DOMPoint(px, py).matrixTransform(root).matrixTransform((pm || root).inverse());
    const g = document.createElementNS(XOAY_NS, 'g');
    g.setAttribute('class', cls);
    g.setAttribute('style', `transform-origin:${o.x.toFixed(1)}px ${o.y.toFixed(1)}px`);
    P.insertBefore(g, el); g.appendChild(el);
  };
  const armSide = B => B.y0 >= ey + 66 && B.w <= 58 ? (B.x1 <= cx - 34 ? 'l' : B.x0 >= cx + 34 ? 'r' : '') : '';
  const isFaceSkull = (el, B) => {
    const d = (el.getAttribute('d') || '').trim();
    return /^M7\d[.,]/.test(d) && B.y0 >= ey - 60 && B.y0 <= ey - 25 && B.y1 >= ey + 45 && B.y1 <= ey + 75 && B.w >= 74 && B.w <= 112;
  };
  const classify = (el, B) => {
    const dx = B.cx - cx, adx = Math.abs(dx);
    // 1. Hộp sọ khuôn mặt chính
    if(isFaceSkull(el, B)) return 'tq-head';
    // 2. Cổ và bóng dưới cằm
    if(B.y0 >= ey + 26 && B.y0 < ey + 56 && B.y1 >= ey + 52 && B.w <= 64 && adx <= 18) return 'tq-neck';
    // 3. Nét trên mặt (mắt, lông mày, miệng, kính, nếp nhăn trán, râu cằm)
    if(B.x0 >= cx - 48 && B.x1 <= cx + 48 && B.y0 >= ey - 32 && B.y1 <= ey + 58 && adx <= 37 && B.w <= 86)
      return adx <= 7 && B.cy >= ey + 2 && B.cy <= ey + 36 && B.w <= 34 && B.h >= 12 ? 'tq-nose' : 'tq-feat';
    // 4. Tai, khuyên tai, chùm tóc buộc hai bên, tóc mai sát mép mặt
    if(B.w <= 34 && B.h <= 56 && B.cy >= ey - 32 && B.cy <= ey + 34 && adx >= 40 && adx <= 78) return dx < 0 ? 'tq-earfar' : 'tq-earnear';
    if(B.w <= 20 && B.h <= 32 && B.cy >= ey + 18 && B.cy <= ey + 54 && adx >= 34 && adx <= 64) return dx < 0 ? 'tq-earfar' : 'tq-earnear';
    if(B.w <= 16 && B.h >= 8 && B.h <= 42 && B.cy >= ey - 42 && B.cy < ey + 2 && adx >= 38 && adx <= 68) return dx < 0 ? 'tq-earfar' : 'tq-earnear';
    // 5. Mũ, nón, phụ kiện trên đầu (phía trên mắt / thái dương)
    if(B.y0 < ey + 10 && B.y1 < ey + 45){
      if(B.w <= 88 && B.h <= 46 && B.y1 <= ey + 5) return 'tq-hairfront';
      return 'tq-hair';
    }
    // 6. Dưới cằm: thân áo, chi tiết ngực / cổ áo, đạo cụ
    if(B.y0 >= ey + 50){
      return (B.w <= 88 && adx <= 42) ? 'tq-chest' : 'tq-body';
    }
    return '';
  };
  const origin = (cls, B) =>
    (cls === 'tq-body' || cls === 'tq-chest') ? [cx, H] :
    (cls === 'tq-head' || cls === 'tq-hair' || cls === 'tq-hairfront' || cls === 'tq-hairback') ? [cx, ey] :
    cls === 'tq-neck' ? [cx, ey + 50] :
    (cls === 'tq-feat' || cls === 'tq-nose') ? [cx, ey + 10] : [B.cx, B.cy];

  const arms = {l:[], r:[]};
  const SKIP = /^(defs|style|title|desc|clippath|mask|pattern|lineargradient|radialgradient|filter)$/;
  const hasRotOrFlip = el => /scale\(\s*-|rotate|matrix\(\s*-/.test(el.getAttribute('transform') || '');

  const walk = (P, depth) => {
    for(const el of [...P.children]){
      const tag = el.tagName.toLowerCase(), cl = el.getAttribute('class') || '';
      if(SKIP.test(tag)) continue;
      if(/\bsua1_bui\b/.test(cl)){ wrap(el, 'tq-hairback', cx, ey); continue; }
      if(/\btq-keep-body\b/.test(cl)){ wrap(el, 'tq-body', cx, H); continue; }
      if(/\b(sua_mai|sua8_hoa|sua10_kep)\b/.test(cl)){ wrap(el, 'tq-hairfront', cx, ey); continue; }
      if(/\bsua_hair\b/.test(cl)){
        if(tag === 'g' && depth < 6 && el.children.length && !hasRotOrFlip(el)){ walk(el, depth + 1); continue; }
        const isLine = (el.getAttribute('fill') === 'none') || /fill:\s*none/.test(el.getAttribute('style') || '');
        wrap(el, isLine ? 'tq-hairfront' : 'tq-hair', cx, ey);
        continue;
      }
      if(/\bsua10_duoi\b/.test(cl)){ wrap(el, 'tq-hairback', cx, ey); continue; }
      if(/\b(x-neutral|x-happy|x-annoy|eyes2)\b/.test(cl)){ wrap(el, 'tq-feat', cx, ey + 10); continue; }

      const B = box(el);
      if(!B) continue;
      // Bóng dưới chân nhân vật: giữ theo trục thân (.tq-body)
      if((tag === 'use' && B.y0 > H - 45) || (tag === 'ellipse' && B.cy > H - 25)){ wrap(el, 'tq-body', cx, H); continue; }
      // Má hồng phía xa
      const blushEl = x => x.tagName.toLowerCase() === 'ellipse' && /blush|Radial/.test(x.getAttribute('fill') || x.getAttribute('style') || '');
      const isBlush = blushEl(el) || (tag === 'g' && el.children.length === 1 && blushEl(el.children[0]));
      if(isBlush && B.cx < cx - 10 && B.cy > ey && B.cy < ey + 50){ wrap(el, 'tq-blushfar', B.x1, B.cy); continue; }
      // Bóng mờ dưới cằm / trên cổ: đi theo cổ (.tq-neck)
      const one = tag === 'g' && el.children.length === 1 ? el.children[0] : el;
      const opOf = x => +(x.getAttribute('opacity') || 1) * +(((x.getAttribute('style') || '').match(/fill-opacity:([\d.]+)/) || [, 1])[1]);
      if(opOf(el) * (one === el ? 1 : opOf(one)) < .3 && B.cy > ey + 28 && B.y1 < ey + 82){ wrap(el, 'tq-neck', cx, ey + 50); continue; }

      // Cánh tay (kể cả nhóm <g> bọc riêng 1 tay hoặc có clip-path trên 1 tay)
      const side = armSide(B);
      if(side){ arms[side].push([el, B]); continue; }

      // Nhóm có clip-path ở thân áo (sọc phản quang, sọc áo khoác, gân áo len): giữ nguyên khối theo thân áo
      if(el.hasAttribute('clip-path') && B.y0 >= ey + 50){ wrap(el, 'tq-body', cx, H); continue; }

      // Nếu là nhóm <g> không xoay/lật và bao nhiều phần tử (hoặc chưa phân loại riêng được), đệ quy vào từng phần tử con
      if(tag === 'g' && depth < 6 && el.children.length && !hasRotOrFlip(el) && !el.hasAttribute('clip-path')){
        const clsG = classify(el, B);
        if(!clsG || clsG === 'tq-body' || clsG === 'tq-hair' || (clsG === 'tq-chest' && [...el.children].some(c => { const b = box(c); return b && (armSide(b) || b.w > 88); }))){
          walk(el, depth + 1);
          continue;
        }
      }

      const cls = classify(el, B);
      if(cls){ wrap(el, cls, ...origin(cls, B)); continue; }
      if(tag === 'g' && depth < 6 && el.children.length && !hasRotOrFlip(el)) walk(el, depth + 1);
    }
  };
  walk(svg, 0);

  for(const side of ['l', 'r']){
    if(!arms[side].length) continue;
    const u = arms[side].reduce((a, [, B]) => ({x0:Math.min(a.x0, B.x0), y0:Math.min(a.y0, B.y0), x1:Math.max(a.x1, B.x1)}), {x0:1e9, y0:1e9, x1:-1e9});
    const sx = side === 'l' ? u.x1 - 8 : u.x0 + 8, sy = u.y0 + 6;
    for(const [el] of arms[side]){ wrap(el, 'tq-arm' + side, sx, sy); wrap(el.parentNode, 'tq-body', cx, H); }
  }
  svg.removeAttribute('style');
  svg.setAttribute('data-exp', 'neutral');
  svg.setAttribute('class', 'charsvg turn');
  const out = svg.outerHTML;
  xoayHost.innerHTML = '';
  return out;
}

const turnMemo = {};
function custTurnSVG(i, exp, k){
  k = k || 0;
  const key = i + ':' + k;
  const art = turnMemo[key] || (turnMemo[key] = xoayBuild(custSVG(i, 'neutral', k)));
  return (i === 0 && k === 0 ? art.replace('charsvg turn', 'charsvg turn holds') : art)
    .replace('data-exp="neutral"', 'data-exp="' + exp + '"');
}
