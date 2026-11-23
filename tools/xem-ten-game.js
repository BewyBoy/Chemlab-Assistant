// Dựng tên game kiểu sticker (chữ 3D, viền trắng, nét mực) bằng SVG. Dùng cho tools/xem-ten-game.html.
const NS = 'http://www.w3.org/2000/svg', INK = '#3b3025', PAPER = '#fffdf5';
const LINES = ['Trợ lý', 'Hóa học nhí'];
const SOL = ['#5bb8f0', '#f2779a', '#ffcf45', '#7fd36b', '#b48ae6', '#ff9a4d'];   // màu dung dịch cho kiểu D
// tilt: độ nghiêng cả khối (mặc định -3°); scale: phóng cả sticker (chữ, viền, khối 3D cùng to lên)
const V = [
  {id: 'A', name: 'Itim kẹo bơ', note: 'font game đang dùng, không tải thêm', font: 'Itim', w: 400, size: [58, 72], face: [['#ffe58a', '#f5a93a']], ext: ['#b8652c']},
  {id: 'B', name: 'Baloo 2 kẹo dẻo', note: 'tròn, đậm; mỗi dòng một màu', font: 'Baloo 2', w: 800, size: [50, 68], face: [['#a8e1ff', '#4aa3e0'], ['#ffbd78', '#ef6a3a']], ext: ['#2f6f9e', '#a8432a']},
  {id: 'C', name: 'Coiny bong bóng', note: 'tròn nhất, kiểu chữ phồng', font: 'Coiny', w: 400, size: [46, 60], face: [['#c4f5d3', '#5cc48a']], ext: ['#2f8a62']},
  {id: 'D', name: 'Nunito ống nghiệm', note: 'mỗi chữ một màu dung dịch, nhún nhảy', font: 'Nunito', w: 900, size: [52, 68], letters: true, bounce: true},
  {id: 'E', name: 'Mali phấn vẽ tay', note: 'thẳng, to hơn 30%', font: 'Mali', w: 700, size: [50, 64], face: [['#fffaf0', '#efdfc0']], ext: ['#8b6a48'], tilt: 0, scale: 1.3},
  {id: 'F', name: 'Paytone dày', note: 'thẳng, to hơn 30%', font: 'Paytone One', w: 400, size: [48, 64], face: [['#ffe08a', '#e8b84b']], ext: [INK], depth: 9, tilt: 0, scale: 1.3},
];

function mk(tag, a, p) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); p && p.append(e); return e; }
const dark = (h, f = .6) => '#' + [1, 3, 5].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0')).join('');
const theoDong = (arr, i) => arr[Math.min(i, arr.length - 1)];

function sticker(v, host) {
  const B = v.border || 10, K = 3, D = v.depth || 7, DX = .35;   // viền trắng, nét mực, độ dày khối 3D, khối lệch phải chút cho có phối cảnh
  const svg = mk('svg', {}, host), defs = mk('defs', {}, svg), g = mk('g', {}, svg);
  const ys = [v.size[0], v.size[0] + v.size[1] * 1.12], xs = [4, 0];   // dòng 2 cách dòng 1 = 1,12 cỡ chữ (đã chốt)
  mk('feGaussianBlur', {stdDeviation: 3}, mk('filter', {id: 'blur' + v.id, x: '-10%', y: '-20%', width: '120%', height: '140%'}, defs));
  (v.face || []).forEach((c, li) => {
    const gr = mk('linearGradient', {id: `f${v.id}${li}`, x1: 0, y1: 0, x2: 0, y2: 1}, defs);
    mk('stop', {offset: .2, 'stop-color': c[0]}, gr); mk('stop', {offset: .95, 'stop-color': c[1]}, gr);
  });
  const clip = mk('clipPath', {id: 'clip' + v.id}, defs);

  // một lớp = cả hai dòng chữ, cùng vị trí, đổi màu/nét; per(dòng, chữ) → màu riêng từng chữ
  function layer(parent, a, per, dx = 0, dy = 0) {
    LINES.forEach((t, li) => {
      const at = {x: xs[li], y: ys[li], 'font-family': v.font, 'font-weight': v.w, 'font-size': v.size[li],
        'stroke-linejoin': 'round', 'paint-order': 'stroke', transform: `translate(${dx} ${dy})`, ...(typeof a == 'function' ? a(li) : a)};
      if (v.bounce) {   // mỗi chữ nghiêng và nhún một chút, giống nhau ở mọi lớp
        const ch = [...t];
        at.rotate = ch.map((_, i) => [-5, 4, -2, 5, -4, 2, 6, -3][(i + li * 3) % 8]).join(' ');
        at.y = ch.map((_, i) => ys[li] + [0, -3, 2, -2, 3, -1, 1, -4][(i + li * 5) % 8]).join(' ');
      }
      const tx = mk('text', at, parent);
      if (per) [...t].forEach((c, ci) => { mk('tspan', {fill: per(li, ci), stroke: a.stroke == 'self' ? per(li, ci) : at.stroke}, tx).textContent = c; });
      else tx.textContent = t;
    });
  }
  const steps = [...Array(D)].map((_, i) => i + 1);
  const solid = c => ({fill: c, stroke: c});
  const letterCol = (li, ci) => SOL[(ci + li * 2) % SOL.length];

  layer(mk('g', {filter: `url(#blur${v.id})`, opacity: .28}, g), {...solid(INK), 'stroke-width': 2 * (B + K)}, null, 4, D + 5);   // bóng giấy trên tường
  for (const k of [0, D / 2, D]) layer(g, {...solid(INK), 'stroke-width': 2 * (B + K)}, null, k * DX, k);   // nét mực ngoài cùng của sticker
  for (const k of [0, D / 2, D]) layer(g, {...solid(PAPER), 'stroke-width': 2 * B}, null, k * DX, k);       // viền trắng
  for (const k of steps) layer(g, {...solid(INK), 'stroke-width': 4 * K}, null, k * DX, k);                // nét bao khối 3D
  for (const k of steps) layer(g, v.letters ? {'stroke-width': 2 * K, stroke: 'self'} : li => ({...solid(theoDong(v.ext, li)), 'stroke-width': 2 * K}),
    v.letters ? (li, ci) => dark(letterCol(li, ci)) : null, k * DX, k);                                      // thân khối 3D
  layer(g, v.letters ? {stroke: INK, 'stroke-width': 2 * K} : li => ({fill: `url(#f${v.id}${Math.min(li, v.face.length - 1)})`, stroke: INK, 'stroke-width': 2 * K}),
    v.letters ? letterCol : null);                                                                           // mặt chữ
  layer(clip, {});
  layer(mk('g', {'clip-path': `url(#clip${v.id})`}, g), {fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-opacity': .7}, null, 1.6, 2.4);   // vệt sáng mép trên-trái

  const b = g.getBBox(), P = B + K + 2, S = v.scale || 1, W = b.width + 2 * P + D, H = b.height + 2 * P + D + 6;
  svg.setAttribute('viewBox', `${b.x - P} ${b.y - P} ${W} ${H}`);
  svg.setAttribute('width', W * S); svg.setAttribute('height', H * S);
  svg.style.cssText = `display:block;overflow:visible;transform:rotate(${v.tilt ?? -3}deg);transform-origin:0 0`;
  return svg;
}
