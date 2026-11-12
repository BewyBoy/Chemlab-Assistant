/* =====================================================================
   NHÂN VẬT XOAY 3/4 — dáng "nghiêng vừa phải" lúc đi, dựng từ CHÍNH hình nhìn thẳng (không vẽ bộ hình riêng).
   Nạp SAU js/nhan-vat-skin.js. Xem thử: tools/xem-xoay.html.

   Cách làm (xoay giả 2,5D): tách hình thẳng thành các lớp theo chiều sâu rồi dời chúng bằng CSS —
     .tq-feat    nét trên mặt (mắt, lông mày, má hồng, miệng, kính, nếp nhăn, râu lún phún…): trượt về bên trái, ép hẹp
     .tq-nose    mũi: nhô gần người xem nhất nên trượt nhiều nhất
     .tq-earfar  tai / khuyên tai phía xa (bên trái hình): lùi vào sau mặt rồi ẩn
     .tq-earnear tai / khuyên tai phía gần: nhích vào trong
     .tq-body    mọi thứ dưới cằm (thân, tay, trang phục, đạo cụ): ép hẹp quanh trục giữa — vai xoay nghiêng
   Sọ, tóc, mũ, cổ đứng yên. Vì dựng từ hình thẳng nên cả 3 bộ đồ, mọi biểu cảm và chớp mắt đều có sẵn, và khi
   khách dừng trước khay thì các lớp trượt về chỗ cũ (transition trong style.css) — khách quay mặt về phía người
   chơi chứ không đổi hình đột ngột.

   Phân lớp bằng HÌNH HỌC chứ không dò chuỗi SVG (hình vẽ tay khung 280 và hình khung 200 có cấu trúc khác hẳn nhau):
   dựng hình trong một khung ẩn, đo khung bao từng phần tử theo toạ độ viewBox, so với vị trí hai mắt. Kết quả là
   một chuỗi SVG đã bọc lớp, nhớ lại theo (khách, skin) nên mỗi hình chỉ đo một lần.
   ===================================================================== */
'use strict';

const XOAY_NS = 'http://www.w3.org/2000/svg';
let xoayHost = null;

// bọc lớp cho một chuỗi SVG hình thẳng; trả về chuỗi SVG mới (class "charsvg turn"). Không có DOM thì trả nguyên.
function xoayBuild(svgStr){
  if(typeof document === 'undefined' || !document.body) return svgStr;
  if(!xoayHost){
    xoayHost = document.createElement('div');
    xoayHost.setAttribute('aria-hidden', 'true');
    xoayHost.style.cssText = 'position:absolute;left:-9999px;top:0;width:300px;height:300px;visibility:hidden;pointer-events:none;overflow:hidden';
    document.body.appendChild(xoayHost);
  }
  // đo ở biểu cảm "bực": lúc đó chấm mắt của mọi người đều hiện (người mắt cười ẩn chấm lúc bình thường)
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
  const cx = (eyes[0].cx + eyes[1].cx)/2, ey = (eyes[0].cy + eyes[1].cy)/2;   // trục giữa mặt, độ cao mắt
  const vb = (svg.getAttribute('viewBox') || '0 0 200 280').split(/\s+/).map(Number), H = vb[3];

  // bọc el trong <g class="cls">, tâm biến đổi (px, py) cho theo toạ độ viewBox → đổi sang hệ toạ độ của phần tử cha
  const wrap = (el, cls, px, py) => {
    const P = el.parentNode, pm = P.getScreenCTM ? P.getScreenCTM() : root;
    const o = new DOMPoint(px, py).matrixTransform(root).matrixTransform((pm || root).inverse());
    const g = document.createElementNS(XOAY_NS, 'g');
    g.setAttribute('class', cls);
    g.setAttribute('style', `transform-origin:${o.x.toFixed(1)}px ${o.y.toFixed(1)}px`);
    P.insertBefore(g, el); g.appendChild(el);
  };
  const classify = B => {
    const dx = B.cx - cx, adx = Math.abs(dx);
    // nét trên mặt: nằm gọn trong lòng khuôn mặt, từ lông mày tới trên cằm
    if(B.x0 >= cx - 48 && B.x1 <= cx + 48 && B.y0 >= ey - 30 && B.y1 <= ey + 58 && adx <= 37 && B.w <= 86)
      return adx <= 7 && B.cy >= ey + 2 && B.cy <= ey + 36 && B.w <= 34 && B.h >= 12 ? 'tq-nose' : 'tq-feat';
    // tai, khuyên tai: mảnh nhỏ sát hai mép mặt
    if(B.w <= 30 && B.h <= 44 && B.cy >= ey - 16 && B.cy <= ey + 30 && adx >= 44 && adx <= 68) return dx < 0 ? 'tq-earfar' : 'tq-earnear';
    if(B.w <= 18 && B.h <= 30 && B.cy >= ey + 22 && B.cy <= ey + 52 && adx >= 34 && adx <= 60) return dx < 0 ? 'tq-earfar' : 'tq-earnear';
    // dưới cằm: thân, tay, trang phục, đạo cụ
    if(B.y0 >= ey + 56) return 'tq-body';
    return '';
  };
  const origin = (cls, B) => cls === 'tq-body' ? [cx, H] : cls === 'tq-feat' || cls === 'tq-nose' ? [cx, ey + 10] : [B.cx, B.cy];
  const SKIP = /^(defs|style|title|desc|clippath|mask|pattern|lineargradient|radialgradient|filter)$/;
  const walk = (P, depth) => {
    for(const el of [...P.children]){
      const tag = el.tagName.toLowerCase(), cl = el.getAttribute('class') || '';
      if(SKIP.test(tag)) continue;
      if(/\b(x-neutral|x-happy|x-annoy|eyes2)\b/.test(cl)){ wrap(el, 'tq-feat', cx, ey + 10); continue; }   // miệng theo biểu cảm, mắt
      const B = box(el);
      if(!B) continue;
      const cls = classify(B);
      if(cls){ wrap(el, cls, ...origin(cls, B)); continue; }
      if(tag === 'g' && depth < 5 && el.children.length) walk(el, depth + 1);   // nhóm lẫn nhiều lớp: xét từng phần tử con
    }
  };
  walk(svg, 0);
  svg.removeAttribute('style');
  svg.setAttribute('data-exp', 'neutral');
  svg.setAttribute('class', 'charsvg turn');
  const out = svg.outerHTML;
  xoayHost.innerHTML = '';
  return out;
}

const xoayMemo = {};
// hình 3/4 của khách i (0..9, như custSVG), biểu cảm exp, skin k — cùng vóc (dangNguoi) với hình thẳng
function custTurnSVG(i, exp, k){
  k = k || 0;
  const key = i + ':' + k;
  if(!xoayMemo[key]){
    const built = xoayBuild(custArt(i, k));
    xoayMemo[key] = typeof dangNguoi === 'function' ? dangNguoi(built, i + 1) : built;
  }
  return xoayMemo[key].replace('data-exp="neutral"', 'data-exp="' + exp + '"');
}
