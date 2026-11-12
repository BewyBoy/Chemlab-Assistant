/* =====================================================================
   NHÂN VẬT NHÌN NGHIÊNG — dáng đi từ phải sang trái (mặt quay sang trái)
   Nạp SAU js/nhan-vat-skin.js (dùng EYE_STYLE, eyeDims, EYE_INK, HD_CHARS, dangNguoi).

   Mỗi khách vẽ tay riêng: dáng đầu nghiêng (trán, mũi, môi, cằm, quai hàm), tóc, mũ, kính, râu, đồ nhận diện —
   theo đúng hình nhìn thẳng của người đó và theo từng skin (0 cổ điển, 1, 2 trong js/trang-phuc.js).

   TOẠ ĐỘ — vẽ thẳng trong viewBox của hình nhìn thẳng (khách 1..3: 280x280, khách 4..10: 200x280):
     · "hệ đầu": gốc (cx, ey) = trung điểm hai mắt của hình thẳng (đo trong trình duyệt), x âm = phía trước mặt.
       Đầu nghiêng nằm đúng chỗ mặt hình thẳng, cùng cỡ — lúc khách dừng, đổi sang hình thẳng không bị giật.
     · "hệ thân": gốc (cx + ox, nb) = chân cổ. Bàn che mọi thứ dưới y ≈ 216–226 nên chỉ thấy đầu, vai, ngực trên:
       đồ nhận diện (khăn quàng, yếm, dây đeo, cà vạt…) đặt trong dải y thân −14..35.

   CỬ ĐỘNG (CSS trong style.css, khối .custwalk): các nhóm khớp có lớp
     sd-arm / sd-fore  — tay gần: cánh tay đánh từ vai, cẳng tay gập ở khuỷu (đưa ra trước thì bàn tay nhô lên khỏi bàn),
     sd-far / sd-forefar — tay xa sau lưng, ngược nhịp,  sd-hold — tay ôm bánh mì (Bà Tư cổ điển), đánh khẽ,
     sd-head — đầu gật bù nhịp nhún,  sd-sway — tóc đuôi ngựa / tóc dài / ba lô đung đưa trễ nhịp.
   Mỗi nhóm khớp chứa một hình chữ nhật vô hình TÂM ĐÚNG KHỚP (sdBB) nên với transform-box:fill-box,
   transform-origin:50% 50% chính là khớp — dùng được cho cả hai cỡ viewBox và mọi tỉ lệ dangNguoi.

   Biểu cảm dùng chung CSS với hình thẳng: x-neutral / x-happy / x-annoy (miệng), .eyes2 (một mắt, bản soi gương
   mắt phải của dotEyes), lông mày .brw .brw-r.
   ===================================================================== */
'use strict';

const SD_INK = '#3b3025';
const SD_DARK = ['#4a4038', '#37302a', '#2a2420'], SD_GREY = ['#eceae2', '#c3c2b8', '#9c9b91'];
const sdF = v => +(+v).toFixed(1);
const sdG = (inner, w) => `<g stroke="${SD_INK}" stroke-width="${w || 3}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
const sdLn = (d, c, w, op) => `<path d="${d}" fill="none" stroke="${c || SD_INK}" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round"${op ? ` opacity="${op}"` : ''}/>`;
// khung vô hình tâm (0,0): giữ tâm hộp bao của nhóm khớp đúng ở khớp
const sdBB = R => `<rect x="${-R}" y="${-R}" width="${2*R}" height="${2*R}" fill="none" stroke="none"/>`;
// nhóm khớp: đặt ở (x, y), lớp cls cử động quanh (x, y); inner vẽ quanh gốc (0,0)
const sdPiv = (x, y, cls, R, inner) => `<g transform="translate(${sdF(x)},${sdF(y)})"><g class="${cls}">${sdBB(R)}${inner}</g></g>`;
const sdLin = (id, c, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${c.map((s, n) => `<stop offset="${sdF(n/(c.length - 1))}" stop-color="${s}"/>`).join('')}</linearGradient>`;

/* ---------- dáng đầu nghiêng ----------
   h: top (đỉnh sọ), back (gáy sau), nape (chân gáy), fx (trán ngang lông mày), fs (trán ngả ra sau),
      n: mũi {tx,ty: chóp; r: độ tròn chóp; bx,by: chân mũi; hump: sống mũi gồ (+) / lõm (−)},
      lu, ll: môi trên / môi dưới (x), my: khoé miệng (y), ch: cằm [x,y], jaw: góc hàm [x,y]
   close = false: chỉ nét viền (bỏ đoạn đáy từ góc hàm về gáy — chỗ đó cổ đi ra). */
function sdHeadD(h, close){
  const {top:T, back:B, nape:N, fx:F, n, lu, ll, my, ch, jaw} = h, fs = h.fs || 5, r = n.r;
  const d = `M${B - 3},${N}`
    + ` C${B + 4},${N - 26} ${B + 5},${T + 10} ${sdF(B*0.3)},${T}`
    + ` C${sdF(F*0.45)},${T} ${F + fs},${sdF(T*0.6)} ${F},-17`
    + ` C${F - 1.5},-13 ${F - 1},-9 ${F + 1.5},-6`
    + ` C${F + 2},${sdF(n.ty*0.3)} ${n.tx + (n.hump || 0) + 3},${n.ty - 13} ${n.tx},${n.ty - r}`
    + ` C${sdF(n.tx - r*0.8)},${n.ty} ${sdF(n.tx + r*0.2)},${sdF(n.ty + r)} ${sdF(n.tx + r*1.4)},${sdF(n.ty + r*0.8)}`
    + ` C${n.bx - 6},${n.by + 1} ${n.bx - 2},${n.by} ${n.bx},${n.by}`
    + ` C${n.bx + 1},${n.by + 4} ${lu},${my - 8} ${lu},${my - 3}`
    + ` C${lu},${my - 1} ${lu + 2},${my} ${lu + 3},${my}`
    + ` C${ll},${my + 1} ${ll - 0.5},${my + 6} ${ll + 2},${my + 8}`
    + ` C${ll + 4},${my + 10} ${ch[0] - 1},${ch[1] - 12} ${sdF(ch[0] - 1.5)},${ch[1] - 6}`
    + ` C${ch[0] - 2},${ch[1]} ${ch[0] + 4},${ch[1] + 3} ${ch[0] + 10},${ch[1] + 3}`
    + ` C${sdF((ch[0] + jaw[0])/2)},${ch[1] + (h.square ? 3 : 2)} ${jaw[0] - (h.square ? 4 : 10)},${jaw[1] + 4} ${jaw[0]},${jaw[1]}`;
  return close ? d + ' Z' : d;
}
// cánh mũi (nét cong sau chóp mũi) — w: bè ngang
const sdAla = (n, w) => sdLn(`M${n.bx + 1},${n.by - 1} c${sdF(4*w)},0 ${sdF(5*w)},-7 ${sdF(w)},-${sdF(8 + 2*w)}`, SD_INK, 2.2, '.8');
// tai: (x, y) mép trước giữa tai
const sdEar = (x, y, S) => sdG(`<path d="M${x - 3},${y - 12} C${x + 8},${y - 18} ${x + 16},${y - 6} ${x + 13},${y + 6} C${x + 11},${y + 14} ${x + 3},${y + 18} ${x - 2},${y + 13} Z" fill="${S}"/>`
  + `<path d="M${x + 2},${y - 6} c5,-2 8,3 6,8 c-1,3 -4,4 -6,2" fill="none" stroke-width="2"/>`, 2.8);

/* một con mắt nhìn nghiêng: soi gương mắt PHẢI của dotEyes (s = −1): đuôi mắt hướng ra sau (phải), đầu mắt phía mũi.
   bực = mí sụp chéo, thấp dần về phía trước mặt; vui = vòng cung; người "mắt cười" (eo-smiley) vui thì nhắm tít. */
function sdEye(hd, x, y, lid){
  const st = (typeof EYE_STYLE !== 'undefined' && EYE_STYLE[hd]) || {r:3.8, k:1}, r = st.r, f = sdF;
  const {rx, ry} = typeof eyeDims === 'function' ? eyeDims(r, st.k) : {rx:r*0.85, ry:r*1.4*st.k}, ink = typeof EYE_INK !== 'undefined' ? EYE_INK : '#1f1812';
  const s = -1, xo = x - s*(rx + 3), xi = x + s*(rx + 3), yo = y - ry - 1.5, yi = y - ry*0.1;
  const glare = `<path d="M${f(xo)},${f(yo - 4)} L${f(xi)},${f(yo - 4)} L${f(xi)},${f(yi)} L${f(xo)},${f(yo)} Z" fill="${lid}"/>`
    + `<path d="M${f(xo)},${f(yo)} L${f(xi)},${f(yi)}" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  const laugh = `<path d="M${f(x - s*(r + 1))},${f(y - 4.5)} L${f(x + s*r)},${f(y)} L${f(x - s*(r + 1))},${f(y + 4.5)}" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lash = [];
  if(st.lash) lash.push(`<path d="M${f(x - s*(rx + 0.5))},${f(y - ry*0.5)} l${f(-s*4.5)},-4" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`);
  if(st.lash > 1) lash.push(`<path d="M${f(x - s*rx*0.4)},${f(y - ry - 0.5)} l${f(-s*3)},-4.5" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`);
  if(st.crease) lash.push(`<path d="M${f(x - s*(rx + 3))},${f(y + 1)} l${f(-s*4)},2 M${f(x - s*(rx + 3))},${f(y + 3.5)} l${f(-s*3.5)},3" fill="none" stroke="${SD_INK}" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`);
  const open = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="${ink}"/>` + lash.join('')
    + `<rect class="blinklid" x="${f(x - rx - 1.5)}" y="${f(y - ry - 1.5)}" width="${f(2*rx + 3)}" height="${f(2*ry + 3)}" rx="${f(rx)}" fill="${lid}"/>`;
  const arc = `<path d="M${f(x - r - 2)},${f(y + 1)} q${f(r + 2)},${f(-(r + 4))} ${f(2*r + 4)},0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>` + lash.join('');
  return `<g class="eyes2${st.smiley ? ' eo-smiley' : ''}"><g class="eo-open">${open}</g><g class="eo-glare">${glare}</g>`
    + `<g class="eo-arc">${arc}</g>${st.smiley ? `<g class="eo-laugh">${laugh}</g>` : ''}</g>`;
}
// lông mày (hướng trái = trước mặt): x0 đầu trước, w dài, t dày, y
const sdBrow = (x0, y, w, t, arch) => `<path class="brw brw-r" d="M${x0},${y + 1} C${sdF(x0 + w*0.25)},${sdF(y - t - (arch || 1))} ${sdF(x0 + w*0.7)},${sdF(y - t - (arch || 1))} ${x0 + w},${y} C${sdF(x0 + w*0.7)},${sdF(y - t*0.35)} ${sdF(x0 + w*0.3)},${sdF(y - t*0.3)} ${x0},${y + 1} Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`;
// miệng theo biểu cảm, đặt ở khoé môi (x, y) trên viền mặt
const sdMouth = (x, y) => `<g class="x-neutral">${sdLn(`M${x - 1},${y} q4,1.6 8,0`, SD_INK, 2.4)}</g>`
  + `<g class="x-happy"><path d="M${x - 2},${y - 1.5} C${x - 1},${y + 6} ${x + 8},${y + 6} ${x + 10},${y - 2} Q${x + 4},${y + 0.5} ${x - 2},${y - 1.5} Z" fill="#a04a3c" stroke="${SD_INK}" stroke-width="2" stroke-linejoin="round"/></g>`
  + `<g class="x-annoy">${sdLn(`M${x - 1},${y + 2} q4,-3.6 9,-0.6`, SD_INK, 2.4)}</g>`;
// dấu bực đỏ cạnh thái dương (chỉ hiện lúc bực)
const sdVex = (x, y) => `<g class="x-annoy">${sdLn(`M${x},${y} l5,-9 l5,9 M${x + 12},${y + 6} l5,-9`, '#d9634f', 2.4)}</g>`;

/* ---------- thân ----------
   torso: thân nghiêng bề dày 2a (ngực trước x −a, lưng x +a), gốc ở chân cổ; bust: ngực nhô; hunch: lưng gù */
function sdTorsoD(a, bust, hunch){
  bust = bust || 0; hunch = hunch || 0;
  return `M-16,-6 C${sdF(-a*0.6)},-4 ${sdF(-a*0.97 - bust)},8 ${sdF(-a - bust*0.6)},30`
    + ` C${sdF(-a*1.02)},52 ${sdF(-a*0.98)},84 ${sdF(-a*0.97)},130 L${sdF(a*0.92)},130`
    + ` C${sdF(a*0.96)},84 ${sdF(a*1.04 + hunch*0.5)},40 ${sdF(a*0.95 + hunch)},14`
    + ` C${sdF(a*0.84 + hunch)},-4 ${sdF(a*0.45)},${-13 - hunch*0.5} 18,-14 Z`;
}
// cánh tay (gốc = khớp vai, buông thẳng xuống): ống tay trên dài 42, cẳng tay 34 + bàn tay
const SD_L1 = 40, SD_L2 = 34;
function sdUpper(fill, add){
  return sdG(`<path d="M-16,4 C-18,-19 18,-19 16,4 L12,${SD_L1} Q0,${SD_L1 + 7} -12,${SD_L1} Z" fill="${fill}"/>`, 3) + (add || '');
}
function sdFore(fill, skin, add, cuff){
  const L = SD_L2;
  return sdG(`<path d="M-11.5,-8 L11.5,-8 L10,${L - 8} Q0,${L - 4} -10,${L - 8} Z" fill="${fill}"/>`, 3)
    + (cuff ? sdG(`<path d="M-10.5,${L - 14} L10.5,${L - 14} L10,${L - 8} Q0,${L - 4} -10,${L - 8} Z" fill="${cuff}"/>`, 2.4) : '')
    + (add || '')
    + sdG(`<path d="M-8,${L - 8} C-11,${L + 4} -5,${L + 11} 1,${L + 10} C8,${L + 9} 10,${L} 8,${L - 8} Z" fill="${skin}"/>`
      + `<path d="M-8,${L - 3} q-6,2 -4,8 q2,2 5,-1" fill="${skin}"/>`, 2.6);
}

/* ---------- đồ dùng chung ---------- */
// khăn quàng đỏ (nút nhỏ ở cổ + hai đuôi ngắn) — hệ thân; x: mép trước cổ
const sdScarf = x => sdG(`<path d="M20,-14 C8,-6 ${x + 8},-2 ${x},-1 L${x + 1},5 C${x + 10},4 10,-2 22,-8 Z" fill="#d9364a"/>`
  + `<path d="M${x - 1},3 L${x - 9},19 L${x - 3},18 L${x + 2},6 Z" fill="#d9364a"/><path d="M${x + 1},4 L${x - 1},21 L${x + 4},19 L${x + 4},6 Z" fill="#c22d40"/>`
  + `<ellipse cx="${x}" cy="2" rx="4.6" ry="4" fill="#e8515f"/>`, 2.2);
// mảng áo trong lộ ở cổ áo chữ V (cắt theo thân): từ cổ trước xuống tới ngực
const sdVee = (a, fill, depth) => `<path d="M-40,-20 L-4,-20 L${sdF(-a*0.55)},${depth || 34} L${-a - 20},${depth || 34} Z" fill="${fill}"/>`
  + sdLn(`M-4,-14 L${sdF(-a*0.55)},${depth || 34}`, SD_INK, 2.2);
// yếm / tạp dề ở ngực (nhìn nghiêng thấy mép yếm và dây đeo cổ / dây qua vai)
function sdBib(a, y0, fill, strap, over){
  const x0 = -a - 2;
  return sdG(`<path d="M${x0},${y0} L${x0 + 20},${y0 - 2} L${x0 + 22},140 L${x0 - 2},140 Z" fill="${fill}"/>`, 2.6)
    + (over ? sdG(`<path d="M${x0 + 18},${y0 + 1} C${x0 + 26},-6 ${-4},-18 ${sdF(a*0.5)},-12 L${sdF(a*0.6)},-5 C4,-10 ${x0 + 30},2 ${x0 + 24},${y0 + 2} Z" fill="${strap}"/>`, 2.2)
      : sdLn(`M${x0 + 16},${y0} C${x0 + 20},10 -16,0 -12,-10`, strap, 4));
}

/* ---------- 10 khách ---------- */
// x (ngữ cảnh vẽ): P tiền tố id, S/H da / tóc, a nửa bề dày thân, k skin, h dáng đầu
const SD_CHARS = {
  /* 1 · Bà Tư — lò bánh mì: cụ bà, kính tròn, tóc bạc búi cao, nếp nhăn; mũi dài hơi trễ, môi mỏng hơi móm */
  1: {cx:159, ey:103, nb:186, ox:6, D:94, hunch:5, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_GREY, ear:null,
    h:{top:-66, back:54, nape:30, fx:-44, fs:6, n:{tx:-65, ty:25, bx:-50, by:31, r:5, hump:1}, lu:-47, ll:-46, my:46, ch:[-44, 68], jaw:[14, 58]},
    look(k){
      return [{body:['#b699cf', '#9b7bb8'], sleeve:['#9b7bb8', '#7d5f99'], hold:1},
        {body:['#fffdf6', '#e9e2cf'], sleeve:['#f1ebdc', '#d6ccb6']},
        {body:['#b77aa8', '#9a5f8e'], sleeve:['#9a5f8e', '#7e4874']}][k];
    },
    back(x){   // búi tóc (mũ đầu bếp che mất)
      if(x.k === 1) return '';
      return sdG(`<circle cx="38" cy="-72" r="15" fill="${x.H}"/>` + sdLn('M28,-78 q10,-6 20,2 M30,-68 q8,4 18,-2', SD_INK, 1.4, '.4'), 2.8);
    },
    hair(x){
      const top = x.k === 0 ? sdLn('M-34,-50 C-14,-70 26,-72 50,-46 M-38,-40 C-24,-56 0,-62 22,-58', SD_INK, 1.5, '.4') : '';
      return sdG(`<path d="M-40,-34 C-47,-60 -20,-82 14,-80 C48,-78 68,-50 64,-14 C63,12 61,40 57,58 C46,64 30,63 19,58 C15,40 12,22 8,8 C4,-8 -8,-24 -26,-31 C-32,-34 -37,-35 -40,-34 Z" fill="${x.H}"/>`, 3)
        + top + sdLn('M18,-26 C32,-6 40,22 44,52 M30,-36 C46,-16 52,18 52,48 M8,-20 C16,0 20,24 22,48', SD_INK, 1.5, '.35');
    },
    hat(x){
      if(x.k === 1)   // mũ đầu bếp: thân phồng + băng mũ
        return sdG(`<path d="M-47,-56 C-68,-72 -52,-104 -27,-96 C-24,-124 16,-128 26,-104 C42,-122 80,-108 63,-82 C76,-72 70,-56 61,-56 C30,-66 -24,-64 -47,-56 Z" fill="#fffdf6"/>`
          + sdLn('M-24,-94 C-26,-80 -24,-70 -20,-62 M4,-104 C2,-88 2,-74 4,-64 M30,-100 C34,-86 36,-74 36,-62', SD_INK, 1.6, '.35')
          + `<path d="M-49,-38 C-30,-46 30,-48 63,-37 L61,-57 C30,-67 -24,-65 -47,-57 Z" fill="#f1ebdc"/>`, 3);
      if(x.k === 2){  // khăn trùm đỏ chấm kem, thắt sau gáy dưới búi
        return `<defs><pattern id="${x.P}kdot" width="11" height="11" patternUnits="userSpaceOnUse"><rect width="11" height="11" fill="#d9634f"/><circle cx="3" cy="3" r="1.8" fill="#fff6ea"/><circle cx="8.5" cy="8.5" r="1.8" fill="#fff6ea"/></pattern></defs>`
          + sdG(`<path d="M58,-40 L74,-30 L66,-22 Z M58,-38 L70,-16 L60,-14 Z" fill="#d9634f"/>`
          + `<path d="M-47,-36 C-48,-62 -22,-78 10,-77 C36,-76 56,-64 62,-44 L60,-34 C40,-42 0,-44 -47,-36 Z" fill="url(#${x.P}kdot)"/>`, 2.8);
      }
      return '';
    },
    face(x){
      const {h} = x, n = h.n, ex = h.fx + 15;
      return sdLn(`M${h.fx + 7},-30 q6,-2.5 12,-1 M${h.fx + 6},-24 q6,-2 11,-0.5`, SD_INK, 1.5, '.45')       // nếp trán
        + sdLn(`M${n.bx + 4},${n.by - 4} C${n.bx + 9},${n.by + 4} ${h.lu + 9},${h.my - 6} ${h.lu + 7},${h.my + 3}`, SD_INK, 1.6, '.45')   // rãnh mũi má
        + sdLn(`M${ex + 9},-3 l6,-2.5 M${ex + 9},1.5 l6,1.5 M${ex + 8},5.5 l5,3.5`, SD_INK, 1.4, '.55')     // chân chim
        + sdLn(`M${h.ch[0] + 14},${h.ch[1] - 6} q8,4 14,0`, SD_INK, 1.4, '.35')
        + sdBrow(ex - 11, -15, 22, 4.5, 2)
        + sdLn(`M${ex + 10},-3 L12,-4`, SD_INK, 2.4)           // gọng kính ra tai
        + sdG(`<circle cx="${ex - 2}" cy="0" r="11.5" fill="#e3edf4" fill-opacity=".35"/>`, 2.6)
        + sdLn(`M${ex - 8},-5 q3,-4 8,-4`, '#ffffff', 1.8, '.8');
    },
    dress(x){
      const {a, k} = x;
      if(k === 1)   // áo bếp trắng: cổ đứng tím nhạt, khăn quàng tím mận, hàng khuy
        return {over: sdG(`<path d="M-18,-12 C-6,-4 12,-8 22,-16 L22,-8 C12,0 -6,2 -18,-4 Z" fill="#c9aee6"/>`, 2.2)
          + sdG(`<path d="M-22,0 L-30,16 L-24,16 L-20,6 Z M-20,0 L-20,18 L-15,15 L-16,4 Z" fill="#7b4a9e"/><ellipse cx="-21" cy="0" rx="5" ry="4.4" fill="#8d5cb3"/>`, 2.2)
          + `<g fill="${SD_INK}" opacity=".7"><circle cx="${sdF(-a + 9)}" cy="20" r="2.2"/><circle cx="${sdF(-a + 9)}" cy="32" r="2.2"/></g>`};
      const collar = sdG(`<path d="M-14,-10 L-34,6 L-22,9 L-11,0 Z" fill="${k ? '#7e4874' : '#7d5f99'}"/>`, 2.2);
      if(k === 2)   // tạp dề caro từ y 204
        return {defs:`<pattern id="${x.P}caro" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff6ea"/><rect width="5" height="10" fill="#e8907d" opacity=".55"/><rect width="10" height="5" fill="#e8907d" opacity=".55"/></pattern>`,
          over: collar + sdBib(a, 18, `url(#${x.P}caro)`, '#e8907d')};
      return {over: collar};
    },
    bread(){   // ổ bánh mì ôm sát ngực (trong nhóm cẳng tay — tay ôm, bàn tay nắm phía dưới)
      return sdG(`<g transform="translate(0,${SD_L2 + 2}) rotate(186)"><rect x="-22" y="-9.5" width="84" height="19" rx="9.5" fill="#d99a52"/>`
        + `<path d="M2,-6 l6,9 M20,-6 l6,9 M38,-6 l6,9" fill="none" stroke-width="2" opacity=".65"/></g>`, 2.6);
    }
  },

  /* 2 · Chú Ba — nông dân: rám nắng, mũi to, râu lún phún, nón lá rộng và thấp như hình thẳng */
  2: {cx:160.5, ey:108, nb:184, ox:6, D:98, skin:['#eec49e', '#d9a878', '#b9834f'], hc:SD_DARK, ear:[14, 0],
    h:{top:-62, back:54, nape:30, fx:-46, fs:4, n:{tx:-68, ty:22, bx:-52, by:28, r:4, hump:-2}, lu:-50, ll:-48, my:40, ch:[-46, 60], jaw:[16, 52]},
    look(k){
      return [{body:['#a37b4d', '#8a6238'], sleeve:['#8a6238', '#6a4a29']},
        {body:['#e09478', '#cc7a5e'], sleeve:['#d98a6e', '#b86a50']},
        {body:['#bf7150', '#a55c3f'], sleeve:['#b4674a', '#945036']}][k];
    },
    hair(x){   // tóc ngắn dưới vành nón: tóc mai + gáy
      return sdG(`<path d="M-26,-36 L58,-38 C61,-12 58,12 52,30 C44,26 36,18 31,8 C27,0 23,-4 18,-4 C13,-4 11,4 10,14 C5,2 3,-12 0,-20 C-8,-28 -16,-34 -26,-36 Z" fill="${x.H}"/>`, 2.8);
    },
    hat(x){
      return sdG(`<path d="M-93,-30 C-56,-46 -28,-60 4,-66 C40,-58 74,-48 99,-38 C99,-33 95,-30 89,-31 C40,-38 -40,-30 -87,-25 C-92,-25 -95,-27 -93,-30 Z" fill="url(#${x.P}straw)"/>`
        + `<path d="M4,-66 L-50,-37 M4,-66 L-20,-35 M4,-66 L28,-36 M4,-66 L58,-37 M-60,-36 Q4,-44 70,-39" fill="none" stroke-width="1.3" opacity=".35"/>`, 2.8);
    },
    face(x){
      const {h} = x, n = h.n, ex = h.fx + 15;
      const dots = [[-44, 36], [-40, 34], [-36, 37], [-46, 52], [-42, 56], [-37, 53], [-34, 58], [-30, 54], [-26, 60], [-20, 56], [-14, 58], [-8, 54], [-2, 52], [-30, 47]];
      return `<path d="M${h.lu + 2},${h.my - 9} C${h.lu + 14},${h.my - 6} ${h.lu + 18},${h.my + 4} -6,${h.my + 6} C6,${h.my + 6} 12,46 16,50 C0,62 -24,64 ${h.ch[0] + 6},${h.ch[1] + 2} C${h.ch[0] - 2},${h.ch[1] - 6} ${h.ll + 2},${h.my + 8} ${h.lu + 2},${h.my - 9} Z" fill="#5b4636" opacity=".14"/>`
        + `<g fill="${SD_INK}" opacity=".45">${dots.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1.15"/>`).join('')}</g>`
        + sdLn(`M${n.bx + 5},${n.by - 3} C${n.bx + 10},${n.by + 4} ${h.lu + 10},${h.my - 4} ${h.lu + 8},${h.my + 2}`, SD_INK, 1.5, '.35')
        + sdBrow(ex - 11, -16, 22, 5, 1);
    },
    dress(x){
      const {a, k} = x, collar = sdG(`<path d="M-14,-10 L-32,8 L-20,8 L-10,-1 Z" fill="${['#6a4a29', '#b86a50', '#945036'][k]}"/>`, 2.2);
      if(k === 1) return {over: collar + sdBib(a, 20, '#6f8fb5', '#5f80a8', 1) + sdG(`<rect x="${sdF(-a + 12)}" y="16" width="9" height="7" rx="1.5" fill="#c9ccd2"/>`, 1.8)};
      if(k === 2)   // gi-lê kaki + túi ngực có ống nghiệm thử đất
        return {deco: `<path d="M-4,-24 L120,-24 L120,140 L${sdF(-a + 10)},140 L${sdF(-a + 8)},40 C${sdF(-a + 8)},20 -16,4 -4,-24 Z" fill="#dccb9c"/>`
            + sdLn(`M-4,-14 C-16,4 ${sdF(-a + 8)},20 ${sdF(-a + 8)},48`, SD_INK, 2.4),
          over: collar + sdG(`<rect x="${sdF(-a + 15)}" y="2" width="5" height="22" rx="2.5" fill="#e9f3f6"/><rect x="${sdF(-a + 15)}" y="14" width="5" height="10" rx="2.5" fill="#8a6238"/>`
            + `<path d="M${sdF(-a + 10)},14 L${sdF(-a + 26)},14 L${sdF(-a + 26)},32 L${sdF(-a + 11)},32 Z" fill="#d2c08e"/>`, 1.8)};
      return {over: collar};
    }
  },

  /* 3 · Bé Na — học sinh lớp 8: đầu tròn trẻ con, mũi nhỏ hếch, tóc bob mái bằng, hai túm tóc buộc dây đỏ */
  3: {cx:159, ey:120, nb:190, ox:5, D:84, skin:['#fbe8d6', '#f5d3b3', '#e9b98c'], hc:SD_DARK, ear:null,
    h:{top:-74, back:56, nape:24, fx:-42, fs:9, n:{tx:-55, ty:15, bx:-45, by:20, r:4, hump:-4}, lu:-45, ll:-43, my:33, ch:[-39, 54], jaw:[12, 44]},
    look(k){
      return [{body:['#f0b8c9', '#e79db5'], sleeve:['#e79db5', '#cf7f9c']},
        {body:['#fdeef3', '#f7d9e4'], sleeve:['#f29bb6', '#e07a9c']},
        {body:['#d4587c', '#b8406a'], sleeve:['#c44c72', '#a3365c']}][k];
    },
    hair(x){
      return sdG(`<path d="M-45,-24 C-52,-58 -20,-86 14,-84 C50,-82 70,-52 67,-14 C67,6 65,26 59,40 C51,47 40,47 29,44 C24,32 20,20 14,10 C10,2 4,-6 -2,-12 L-4,-23 C-18,-23 -32,-24 -45,-24 Z" fill="${x.H}"/>`, 3)
        + sdLn('M-38,-30 C-30,-58 0,-74 30,-66 M-18,-26 C-14,-50 6,-64 30,-58 M30,-40 C44,-20 50,10 50,36', '#7a6a5c', 1.5, '.5')
        // túm tóc + dây buộc đỏ cạnh tai
        + sdG(`<path d="M18,8 C12,20 14,40 22,54 C26,50 30,46 32,40 C34,30 32,18 26,8 Z" fill="${x.H}"/>`, 2.6)
        + sdLn('M22,14 C20,26 22,40 25,50 M27,14 C28,24 29,34 29,42', '#8a7a6c', 1.4, '.8')
        + sdG(`<path d="M22,8 l-10,-5 l1,12 z M22,8 l10,-7 l1,12 z" fill="#e0604c"/><circle cx="22" cy="8" r="3.6" fill="#e8515f"/>`, 2);
    },
    face(x){ const {h} = x, ex = h.fx + 14; return sdBrow(ex - 10, -19, 19, 3.6, 1); },
    dress(x){
      const {a, k} = x, sc = sdScarf(-22);
      if(k === 1)   // đồ thể dục: sọc hồng hai bên, khiên trường hồng
        return {deco: `<path d="M8,-30 L16,-30 L18,140 L10,140 Z" fill="#f29bb6"/>`,
          over: sdG(`<path d="M${sdF(-a + 6)},12 h12 v8 q0,7 -6,10 q-6,-3 -6,-10 z" fill="#f29bb6"/><path d="M${sdF(-a + 9)},17 h6 M${sdF(-a + 12)},14 v9" fill="none" stroke="#fff" stroke-width="1.6"/>`, 1.8) + sc,
          arm: `<path d="M-3,-14 L3,-14 L3,${SD_L1} L-3,${SD_L1} Z" fill="#fdeef3" opacity=".9"/>`};
      if(k === 2)   // áo khoác mâm xôi mở: sơ mi trắng, quai ba lô vàng, ba lô sau lưng
        return {deco: sdVee(a, '#fbf8f0', 60),
          back: `<g transform="translate(${sdF(a - 4)},2)"><g class="sd-sway">${sdBB(60)}`
            + sdG(`<path d="M-2,-4 C8,-8 24,-6 28,4 L30,46 C30,54 22,56 10,54 L0,50 Z" fill="#e8b84b"/><path d="M4,18 L26,20 L26,38 L6,36 Z" fill="#c99a32"/>`, 2.8) + `</g></g>`,
          over: sc + sdG(`<path d="M${sdF(a*0.55)},-10 C${sdF(a*0.2)},-14 -6,-10 -12,6 L-6,8 C-2,-4 ${sdF(a*0.2)},-6 ${sdF(a*0.6)},-2 Z" fill="#e8b84b"/>`, 2)};
      return {over: sc};
    }
  },

  /* 4 · Anh Minh — thợ xây: hàm vuông, mũi tẹt bè, mũ bảo hộ */
  4: {cx:120, ey:106, nb:182, ox:6, D:110, skin:['#f4d6ae', '#e3b98c', '#c99a68'], hc:SD_DARK, ear:[14, 2],
    h:{top:-64, back:52, nape:28, fx:-48, fs:3, n:{tx:-62, ty:21, bx:-50, by:27, r:7, hump:-2}, lu:-50, ll:-49, my:39, ch:[-47, 56], jaw:[20, 52], square:1},
    look(k){
      return [{body:['#8ab4da', '#6f9ec9'], sleeve:['#6f9ec9', '#537da8']},
        {body:['#3f6198', '#304f80'], sleeve:['#304f80', '#243e68']},
        {body:['#6189b8', '#4d73a0'], sleeve:['#4d73a0', '#3b5c86']}][k];
    },
    hair(x){
      return sdG(`<path d="M0,-28 L14,-28 C12,-16 10,-6 8,4 C3,-4 1,-14 0,-28 Z M28,-28 L60,-28 C61,-2 58,16 52,28 C44,22 38,10 33,-2 C31,-12 29,-20 28,-28 Z" fill="${x.H}"/>`, 2.6);
    },
    hat(x){
      const c = [['#f0b429', '#f7c948'], ['#f4f1e8', '#fffdf5'], ['#f0b429', '#f7c948']][x.k];
      const dome = 'M-56,-28 C-58,-62 -30,-84 4,-84 C40,-84 64,-62 62,-28 Z';
      let s = sdG(`<path d="${dome}" fill="${c[0]}"/>`, 3);
      if(x.k === 1) s += `<clipPath id="${x.P}dome"><path d="${dome}"/></clipPath><path clip-path="url(#${x.P}dome)" d="M-62,-36 C-48,-80 40,-92 70,-40" fill="none" stroke="#f0883e" stroke-width="13"/>` + sdLn(dome, SD_INK, 3);
      else s += sdLn('M-50,-44 C-30,-76 30,-78 56,-50', '#8a6a1a', 2, '.5');
      s += sdG(`<path d="M-72,-24 C-64,-33 -52,-33 -40,-31 L64,-31 C69,-29 69,-22 64,-21 L-66,-19 C-73,-19 -75,-22 -72,-24 Z" fill="${c[1]}"/>`, 3);
      if(x.k === 2)   // kính bảo hộ trên vành mũ
        s += sdLn('M-50,-44 C-20,-56 30,-58 60,-40', SD_INK, 5) + sdG(`<path d="M-60,-48 q2,-12 16,-12 q11,0 11,10 q-2,9 -13,9 q-13,0 -14,-7 z" fill="#bfe0e6"/>`, 2.6)
          + sdLn('M-54,-53 q5,-3 10,-2', '#ffffff', 2);
      return s;
    },
    face(x){
      const {h} = x, ex = h.fx + 15;
      return sdBrow(ex - 12, -16, 23, 4.6, 0.5) + sdLn(`M${h.n.bx + 6},${h.n.by - 2} C${h.n.bx + 11},${h.n.by + 5} ${h.lu + 11},${h.my - 4} ${h.lu + 9},${h.my + 2}`, SD_INK, 1.5, '.3');
    },
    alaW: 1.7,
    dress(x){
      const {a, k} = x;
      if(k === 1)   // gi-lê phản quang cam trên áo sơ mi xanh than; hai sọc phản quang ở y 198 và 214
        return {deco: `<path d="M-6,-24 L120,-24 L120,140 L-80,140 L-80,30 C-30,20 -12,6 -6,-24 Z" fill="#f0883e"/>`
            + sdLn(`M-6,-14 C-12,8 -30,24 ${sdF(-a)},30`, SD_INK, 2.2)
            + `<path d="M-80,13 L120,13 L120,20 L-80,20 Z M-80,29 L120,29 L120,36 L-80,36 Z" fill="#e9eef0"/>`};
      if(k === 2)   // dây đai an toàn đỏ: dây qua vai, dây ngang ngực, khoá bạc
        return {over: sdG(`<path d="M${sdF(a*0.5)},-14 C${sdF(a*0.2)},-14 -20,-8 ${sdF(-a + 6)},26 L${sdF(-a + 14)},30 C-14,0 ${sdF(a*0.2)},-6 ${sdF(a*0.55)},-6 Z" fill="#d9634f"/>`, 2.2)
          + sdG(`<path d="M${sdF(-a - 1)},18 L${sdF(a)},18 L${sdF(a)},26 L${sdF(-a - 1)},26 Z" fill="#d9634f"/>`, 2.2)
          + sdG(`<rect x="${sdF(-a + 4)}" y="16" width="11" height="12" rx="2" fill="#c9ccd2"/>`, 2)};
      return {over: sdLn(`M-16,-6 C-8,-2 12,-6 20,-13`, '#537da8', 3.2)};
    }
  },

  /* 5 · Cô Lan — y tá: mặt trái xoan, mũi thẳng, kính chữ nhật, tóc dài sợi rõ, mái hất */
  5: {cx:120, ey:101.5, nb:178, ox:6, D:90, bust:3, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_DARK, ear:[14, 4],
    h:{top:-72, back:54, nape:28, fx:-45, fs:6, n:{tx:-63, ty:21, bx:-50, by:26, r:4, hump:0}, lu:-48, ll:-46, my:40, ch:[-42, 60], jaw:[14, 50]},
    look(k){
      return [{body:['#6cc0b9', '#4fa6a0'], sleeve:['#4fa6a0', '#3c827c']},
        {body:['#3e9c95', '#2f817b'], sleeve:['#2f817b', '#22655f']},
        {body:['#fdfcf8', '#e9e5da'], sleeve:['#e9e5da', '#d3cdbe']}][k];
    },
    back(x){   // tóc dài rủ sau lưng (đung đưa)
      return `<g transform="translate(38,-6)"><g class="sd-sway">${sdBB(130)}`
        + sdG(`<path d="M-14,-16 C18,-20 34,6 32,44 C31,72 30,92 34,116 C22,122 6,120 -6,114 C-2,86 -4,56 -12,34 C-18,16 -22,0 -14,-16 Z" fill="${x.H}"/>`, 2.8)
        + sdLn('M2,-8 C12,20 14,60 12,110 M14,0 C22,30 22,70 24,112 M-6,10 C2,40 2,76 2,112 M24,20 C28,50 26,84 30,112', '#7a6a5c', 1.4, '.6')
        + `</g></g>`;
    },
    hair(x){
      const cap = x.k === 2 ? '' : sdLn('M-30,-62 C-8,-76 26,-74 48,-56', '#7a6a5c', 1.5, '.5');
      return sdG(`<path d="M-44,-30 C-50,-62 -20,-86 14,-84 C50,-82 70,-54 66,-16 C64,6 58,22 48,34 C40,30 34,18 30,8 C27,-2 22,-12 14,-14 C8,-16 4,-18 0,-22 C-12,-30 -28,-32 -44,-30 Z" fill="${x.H}"/>`, 3)
        + cap + sdLn('M20,-40 C34,-24 40,0 42,24 M8,-50 C26,-38 36,-16 38,8', '#7a6a5c', 1.4, '.55')
        // lọn mái hất ra trước trán
        + (x.k === 2 ? '' : sdG(`<path d="M10,-56 C-10,-58 -36,-52 -46,-34 C-48,-28 -44,-24 -40,-28 C-34,-40 -18,-46 4,-44 Z" fill="${x.H}"/>`, 2.4));
    },
    hat(x){
      if(x.k !== 2) return '';
      return sdG(`<path d="M-48,-34 C-52,-66 -20,-90 14,-88 C50,-86 70,-60 67,-28 C40,-36 0,-40 -48,-34 Z" fill="#3fa39a"/>`
        + `<path d="M-30,-70 C-4,-80 30,-78 52,-60" fill="none" stroke-width="1.4" opacity=".4"/>`, 3);
    },
    face(x){
      const {h} = x, ex = h.fx + 15;
      return sdBrow(ex - 10, -17, 20, 3.4, 1.5)
        + sdLn(`M${ex + 6},-4 L12,-6`, SD_INK, 2.4)
        + sdG(`<rect x="${ex - 12}" y="-10" width="18" height="16" rx="3" fill="#e3edf4" fill-opacity=".35"/>`, 2.4)
        + sdLn(`M${ex - 8},-6 l6,0`, '#ffffff', 1.6, '.8');
    },
    dress(x){
      const {a, k} = x;
      const steth = sdLn(`M18,-12 C4,-4 -10,6 ${sdF(-a + 10)},22 C${sdF(-a + 4)},28 ${sdF(-a + 4)},34 ${sdF(-a + 6)},38`, '#5f6b78', 3.2)
        + sdG(`<circle cx="${sdF(-a + 7)}" cy="40" r="5" fill="#c9ccd2"/>`, 2);
      const cross = sdG(`<rect x="${sdF(-a + 14)}" y="16" width="14" height="13" rx="3" fill="#fffef9"/><path d="M${sdF(-a + 21)},19 v7 M${sdF(-a + 17.5)},22.5 h7" fill="none" stroke="#e0364a" stroke-width="2.6"/>`, 1.8);
      const lapel = c => sdG(`<path d="M-14,-10 L-32,4 L-22,18 L-12,2 Z" fill="${c}"/>`, 2.2);
      if(k === 0) return {deco: sdVee(a, '#f6eedc', 26), over: sdG(`<path d="M-14,-10 L-32,6 L-22,14 L-12,0 Z" fill="#f6eedc"/>`, 2.2) + steth + cross};
      if(k === 1) return {deco: sdVee(a, '#ffffff', 30), over: lapel('#8fd3cb') + steth};
      return {deco: sdVee(a, '#2f8f88', 30), over: lapel('#5fb5ab') + steth + cross,
        arm: sdG(`<path d="M-15.5,8 L15.5,8 L14.8,26 L-14.8,26 Z" fill="#fffef9"/>`, 2) + `<path d="M0,11 v12 M-6,17 h12" stroke="#e0364a" stroke-width="3.2"/>`};
    }
  },

  /* 6 · Ông Sáu — chủ ao cá: mập, mũi củ tỏi, hói, vành tóc bạc, râu quai nón + ria mép */
  6: {cx:120, ey:102, nb:180, ox:6, D:106, bust:4, hunch:3, skin:['#f6e2ca', '#ecc99f', '#cf9f6d'], hc:SD_GREY, ear:[16, 2],
    h:{top:-52, back:58, nape:32, fx:-48, fs:10, n:{tx:-68, ty:22, bx:-52, by:31, r:9, hump:-3}, lu:-52, ll:-50, my:46, ch:[-47, 62], jaw:[22, 56]},
    look(k){
      return [{body:['#8d9a55', '#74803f'], sleeve:['#74803f', '#5a6430']},
        {body:['#c3cd96', '#a9b67a'], sleeve:['#c9dcec', '#a6c1da']},
        {body:'stripe', sleeve:'stripe'}][k];
    },
    hair(x){   // vành tóc bạc quanh gáy + nếp trán trên đầu hói
      return (x.k === 1 ? '' : sdLn('M-36,-40 q14,-8 30,-6 M-38,-32 q14,-7 28,-5', SD_INK, 1.5, '.4'))
        + sdG(`<path d="M22,-10 C32,-17 48,-18 60,-10 C65,4 63,22 56,34 C48,34 40,28 34,20 C29,13 24,6 22,0 C20,-4 20,-7 22,-10 Z" fill="${x.H}"/>`, 2.8)
        + sdLn('M28,-12 C42,-6 50,8 50,26 M18,-6 C30,-2 38,8 40,20', SD_INK, 1.4, '.35');
    },
    hat(x){
      if(x.k !== 1) return '';
      return sdG(`<path d="M-42,-36 C-44,-62 -16,-74 10,-74 C38,-74 60,-62 58,-36 Z" fill="#b9c48c"/>`, 3)
        + sdLn('M-42,-44 C-10,-52 30,-52 58,-44', '#6c7b45', 6)
        + sdG(`<path d="M-60,-30 C-30,-42 40,-44 76,-30 C79,-24 74,-21 68,-23 C40,-32 -30,-32 -54,-21 C-62,-20 -64,-26 -60,-30 Z" fill="#a3b075"/>`, 2.8);
    },
    face(x){
      const {h} = x, n = h.n, ex = h.fx + 16, H = x.H;
      // râu quai nón (từ tóc mai trước tai, ôm hàm, phủ cằm) + ria mép rậm che môi trên
      return sdBrow(ex - 12, -14, 24, 5.4, 1)
        + sdG(`<path d="M8,0 C10,20 16,40 24,56 C22,70 8,80 -12,82 C-30,84 -48,78 -55,64 C-58,58 -56,52 -51,50 C-44,55 -34,55 -26,50 C-12,42 -2,22 2,2 Z" fill="${H}"/>`, 2.8)
        + sdLn('M-44,64 q6,6 14,4 M-24,70 q8,4 16,-2 M0,60 q6,2 10,-4 M8,24 q4,10 4,20', SD_INK, 1.4, '.35')
        + sdG(`<path d="M${n.bx - 2},${n.by - 1} C-60,${n.by + 2} -64,40 -59,45 C-54,46 -50,42 -44,43 C-38,44 -32,44 -30,40 C-30,34 -40,30 ${n.bx - 2},${n.by - 1} Z" fill="${H}"/>`, 2.6)
        + sdLn(`M${n.tx + 6},${n.ty - 2} c4,-4 9,-2 10,3`, SD_INK, 1.6, '.5');
    },
    mouth: [-48, 48],
    dress(x){
      const {a, k} = x;
      const fish = sdG(`<rect x="${sdF(-a + 12)}" y="14" width="18" height="12" rx="3" fill="#f6eedc"/><path d="M${sdF(-a + 15)},20 q5,-5 10,0 q-5,5 -10,0 z M${sdF(-a + 25)},20 l4,-3 v6 z" fill="#4f8fc0" stroke-width="1"/>`, 1.8);
      if(k === 2)   // yếm lội ao rêu + cá chép cam trên nền kem
        return {defs:`<pattern id="${x.P}stripe" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f3efdc"/><rect width="10" height="4.5" fill="#7f8f42"/></pattern>`,
          over: sdBib(a, 16, '#4e5e37', '#56663c', 1)
          + sdG(`<ellipse cx="${sdF(-a + 9)}" cy="28" rx="8" ry="6" fill="#f6eedc"/><path d="M${sdF(-a + 4)},28 q4,-4 8,0 q-4,4 -8,0 z M${sdF(-a + 12)},28 l3,-2.5 v5 z" fill="#ef8a4c" stroke-width="1"/>`, 1.6)};
      const shirt = k === 0 ? '#f3eddc' : '#d3e3ef';
      return {deco: sdVee(a, shirt, 60), over: fish};
    }
  },

  /* 7 · Bạn Tí — học sinh lớp 8: mũi nút nhỏ, tàn nhang, mũ lưỡi trai (lưỡi quay ra sau) */
  7: {cx:120, ey:110, nb:182, ox:5, D:82, skin:['#f9e2c8', '#eec9a1', '#d8a877'], hc:SD_DARK, ear:[12, 0],
    h:{top:-64, back:52, nape:22, fx:-42, fs:7, n:{tx:-55, ty:14, bx:-44, by:18, r:4, hump:-5}, lu:-45, ll:-43, my:30, ch:[-38, 44], jaw:[12, 38]},
    look(k){
      return [{body:['#f0d878', '#e8c34b'], sleeve:['#e8c34b', '#c9a23c'], cap:['#f0d878', '#e2ad2a']},
        {body:['#f7c63f', '#eaa91c'], sleeve:['#eaa91c', '#c98912'], cap:['#f7c63f', '#c98912']},
        {body:['#f8a24a', '#ee8a2e'], sleeve:['#ee8a2e', '#d27220'], cap:['#f8a24a', '#d27220']}][k];
    },
    hair(x){
      return sdG(`<path d="M-2,-24 L12,-24 C11,-14 9,-6 7,2 C2,-6 0,-14 -2,-24 Z M26,-24 L58,-24 C59,0 56,12 50,22 C42,16 36,6 32,-4 C30,-12 28,-18 26,-24 Z" fill="${x.H}"/>`, 2.6);
    },
    hat(x){
      const c = x.look.cap;
      return sdG(`<path d="M52,-26 C64,-30 78,-29 84,-23 C82,-18 74,-18 54,-18 Z" fill="${c[1]}"/>`, 2.8)
        + sdG(`<path d="M-48,-22 C-52,-54 -22,-72 6,-72 C40,-72 62,-52 60,-22 C30,-27 -20,-27 -48,-22 Z" fill="${c[0]}"/>`
        + `<path d="M-38,-46 C-14,-56 30,-56 50,-44" fill="none" stroke-width="1.5" opacity=".35"/>`
        + `<circle cx="6" cy="-72" r="4" fill="#4f8fc0"/>`, 3);
    },
    face(x){
      const {h} = x, ex = h.fx + 14, fr = [[ex + 2, 12], [ex + 7, 14], [ex + 4, 18], [ex + 10, 18], [ex + 12, 13]];
      return sdBrow(ex - 10, -15, 19, 3.6, 1)
        + `<g fill="#c08060" opacity=".75">${fr.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1.3"/>`).join('')}</g>`;
    },
    dress(x){
      const {a, k} = x, sc = sdScarf(-20);
      if(k === 1)   // áo đấu: số 8 xanh than ở ngực, viền cổ, băng tay
        return {over: sdLn('M-16,-6 C-8,-2 12,-6 20,-13', '#2f5592', 3.4) + sc
            + `<text x="${sdF(-a + 16)}" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="17" fill="#2f5592" stroke="${SD_INK}" stroke-width="1" text-anchor="middle">8</text>`,
          arm: sdG(`<path d="M-15,12 L15,12 L14.6,19 L-14.6,19 Z" fill="#2f5592"/>`, 1.6)};
      if(k === 2)   // áo gió: băng ngực kem + xanh than (y 192–211), khoá kéo
        return {deco: `<path d="M-90,10 L120,10 L120,20 L-90,20 Z" fill="#f4ecd6"/><path d="M-90,20 L120,20 L120,29 L-90,29 Z" fill="#2f5592"/>`
            + sdLn('M-90,10 L120,10 M-90,29 L120,29', SD_INK, 1.8) + sdLn(`M${sdF(-a + 4)},0 L${sdF(-a + 2)},140`, '#b8601a', 1.8),
          over: sc, arm: sdG(`<path d="M-15,10 L15,10 L14.7,18 L-14.7,18 Z" fill="#f4ecd6"/>`, 1.6)};
      return {over: sc};
    }
  },

  /* 8 · Chị Hoa — tiệm vàng bạc: mặt trái tim (cằm nhọn), mũi thon, mi cong, hoa đỏ cài tóc, bông tai vàng */
  8: {cx:120, ey:104, nb:182, ox:5, D:86, bust:4, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_DARK, ear:[12, 2],
    h:{top:-76, back:52, nape:26, fx:-44, fs:5, n:{tx:-63, ty:22, bx:-50, by:26, r:3, hump:1}, lu:-49, ll:-46, my:41, ch:[-40, 64], jaw:[10, 44]},
    look(k){
      return [{body:['#98c479', '#7aa95c'], sleeve:['#7aa95c', '#5e8944']},
        {body:['#4fa88b', '#358a70'], sleeve:['#358a70', '#276c58']},
        {body:'gold', sleeve:'gold'}][k];
    },
    back(x){   // búi tóc gọn sau gáy
      return sdG(`<ellipse cx="54" cy="-26" rx="14" ry="16" fill="${x.H}"/>`, 2.8) + sdLn('M46,-36 q10,4 14,16', '#7a6a5c', 1.4, '.5');
    },
    hair(x){
      return sdG(`<path d="M-42,-34 C-52,-62 -26,-86 12,-85 C48,-84 67,-58 64,-26 C62,-10 58,4 50,14 C42,8 34,-2 28,-10 C22,-16 14,-18 8,-16 C4,-26 -10,-34 -24,-34 C-30,-34 -36,-34 -42,-34 Z" fill="${x.H}"/>`, 3)
        // mái phồng hất lên
        + sdG(`<path d="M-44,-36 C-56,-58 -40,-82 -6,-84 C-26,-76 -36,-62 -30,-42 C-34,-38 -40,-36 -44,-36 Z" fill="${x.H}"/>`, 2.4)
        + sdLn('M-30,-58 C-10,-80 30,-82 52,-56 M-20,-44 C0,-66 30,-68 50,-44 M10,-30 C26,-30 40,-16 48,4', '#7a6a5c', 1.5, '.55')
        // hoa 5 cánh đỏ + lá
        + sdG(`<path d="M2,-36 q-10,-4 -14,4 q8,2 14,-4 z" fill="#6ea85a"/>`
          + [[0, -7], [6.7, -2.2], [4.1, 5.7], [-4.1, 5.7], [-6.7, -2.2]].map(([dx, dy]) => `<circle cx="${sdF(6 + dx)}" cy="${sdF(-44 + dy)}" r="5" fill="#e8605a"/>`).join('')
          + `<circle cx="6" cy="-44" r="3" fill="#f5c842"/>`, 1.8);
    },
    face(x){
      const {h} = x, ex = h.fx + 14, k = x.k;
      const ear = k === 2 ? sdG(`<circle cx="18" cy="${h.my - 12}" r="6.5" fill="none" stroke="#c8a227" stroke-width="3"/>`, 0)
        : sdLn(`M18,${h.my - 18} v5`, SD_INK, 1.4) + sdG(`<circle cx="18" cy="${h.my - 10}" r="3.6" fill="#f2c94c"/>`, 1.6);
      return sdBrow(ex - 11, -17, 21, 3.8, 2) + `<g class="sd-ear2">${ear}</g>`;
    },
    lips: '#d77a6a',
    dress(x){
      const {a, k} = x;
      const chain = sdLn(`M18,-12 C6,-2 -10,8 ${sdF(-a + 10)},16`, '#d9a72c', 2.6) + sdG(`<circle cx="${sdF(-a + 9)}" cy="19" r="4" fill="#f2c94c"/>`, 1.6);
      if(k === 0) return {deco: sdVee(a, '#f6eedc', 18), over: chain};
      if(k === 1) return {deco: sdVee(a, '#f6eedc', 26), over: sdG(`<path d="M-12,-10 L-30,8 L-24,26 L-14,6 Z" fill="#2c7f66"/>`, 2.2) + chain};
      return {defs:`<pattern id="${x.P}gold" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#23946a"/><g fill="#f2c94c"><circle cx="4" cy="4" r="1.6"/><circle cx="6.4" cy="4" r="1.3"/><circle cx="1.6" cy="4" r="1.3"/><circle cx="4" cy="1.6" r="1.3"/><circle cx="4" cy="6.4" r="1.3"/></g><circle cx="12" cy="12" r="1.2" fill="#f2c94c"/></pattern>`,
        deco: sdVee(a, '#f6eedc', 10),
        over: `<path d="M18,-12 C6,-2 -10,8 ${sdF(-a + 10)},14" fill="none" stroke="#f2c94c" stroke-width="3.6" stroke-dasharray="0.1 5" stroke-linecap="round"/>`
          + sdG(`<path d="M${sdF(-a + 10)},14 l4,6 l-4,6 l-4,-6 z" fill="#f2c94c"/>`, 1.6)};
    }
  },

  /* 9 · Thầy Nam — giáo viên Hoá: mặt dài, mũi thẳng dài, tóc rẽ ngôi gọn */
  9: {cx:120, ey:105, nb:180, ox:6, D:96, skin:['#f2dcc0', '#e3c39a', '#c49a6c'], hc:SD_DARK, ear:[14, 2],
    h:{top:-72, back:54, nape:30, fx:-46, fs:4, n:{tx:-65, ty:24, bx:-51, by:29, r:4, hump:2}, lu:-49, ll:-48, my:45, ch:[-45, 68], jaw:[18, 58]},
    look(k){
      return [{body:['#f3eddc', '#fffef9'], sleeve:['#fffef9', '#e6e0cf']},
        {body:['#fffef9', '#e6e0cf'], sleeve:['#fffef9', '#e6e0cf']},
        {body:['#fffefa', '#e4dfd2'], sleeve:['#fffefa', '#e4dfd2']}][k];
    },
    hair(x){
      return sdG(`<path d="M-46,-32 C-56,-52 -40,-80 -4,-82 C32,-84 62,-64 63,-30 C63,-8 59,10 53,26 C45,20 37,8 31,-2 C25,-10 19,-12 14,-10 C10,-6 8,2 6,10 C3,-6 -1,-18 -8,-27 C-20,-33 -34,-33 -46,-32 Z" fill="${x.H}"/>`, 3)
        // mái hất lên phía trước + đường ngôi
        + sdG(`<path d="M-48,-34 C-60,-52 -46,-78 -16,-81 C-30,-72 -36,-60 -34,-44 C-38,-38 -44,-34 -48,-34 Z" fill="${x.H}"/>`, 2.4)
        + sdLn('M-24,-72 C0,-80 30,-77 52,-60', '#8a7a6a', 2, '.7') + sdLn('M-20,-62 C4,-72 30,-68 48,-50 M-10,-50 C10,-58 30,-52 44,-38', '#7a6a5c', 1.4, '.5');
    },
    face(x){ const {h} = x, ex = h.fx + 15; return sdBrow(ex - 12, -18, 24, 4.4, 1); },
    dress(x){
      const {a, k} = x;
      const tie = c => sdG(`<path d="M-22,0 L-28,4 L${sdF(-a + 3)},40 L${sdF(-a + 8)},47 L${sdF(-a + 10)},38 L-20,6 Z" fill="${c}"/><path d="M-26,-4 L-20,-6 L-17,2 L-24,6 Z" fill="${c}"/>`, 2);
      const collar = c => sdG(`<path d="M-14,-12 L-32,0 L-22,10 L-10,-2 Z" fill="${c}"/>`, 2.2);
      if(k === 0) return {deco: sdVee(a, '#fffef9', 40), over: tie('#d9534a') + collar('#fffef9')};
      if(k === 1)   // gi-lê len mù tạt (sọc dệt) trên sơ mi trắng, ghim bình tam giác xanh
        return {deco: `<path d="M-4,-24 L120,-24 L120,140 L${sdF(-a + 8)},140 L${sdF(-a + 6)},40 C${sdF(-a + 8)},26 -14,8 -4,-24 Z" fill="#d8a94c"/>`
            + `<g stroke="#b98a35" stroke-width="1.4" opacity=".6">${[-30, -18, -6, 6, 18, 30].map(px => `<path d="M${px},-10 v150"/>`).join('')}</g>`
            + sdLn(`M-4,-14 C-14,8 ${sdF(-a + 6)},26 ${sdF(-a + 6)},44`, SD_INK, 2.4),
          over: tie('#d9534a') + collar('#fffef9') + sdG(`<path d="M${sdF(-a + 22)},12 v6 l-5,8 h12 l-5,-8 v-6 z" fill="#e9f3f6"/><path d="M${sdF(-a + 18.5)},23 h9 l1.5,3 h-12 z" fill="#7cc36a" stroke="none"/>`, 1.6)};
      // áo blouse trắng mở trên sơ mi kem, cà vạt mù tạt, ống nghiệm tím trong túi ngực
      return {deco: sdVee(a, '#fbf6e8', 50) + sdLn(`M-8,-18 L${sdF(-a*0.55 - 4)},50`, SD_INK, 2.4),
        over: tie('#d8a94c') + sdG(`<path d="M-12,-12 L-34,4 L-26,22 L-10,0 Z" fill="#fffefa"/>`, 2.2)
          + sdG(`<rect x="${sdF(-a + 20)}" y="4" width="5" height="22" rx="2.5" fill="#e9f3f6"/><rect x="${sdF(-a + 20)}" y="14" width="5" height="12" rx="2.5" fill="#9b7bb8"/>`
          + `<path d="M${sdF(-a + 15)},16 L${sdF(-a + 32)},16 L${sdF(-a + 32)},36 L${sdF(-a + 16)},36 Z" fill="#f4f1e8"/>`, 1.8)};
    }
  },

  /* 10 · Cô Mai — quán chè: tóc nữ phồng, mái lệch, kẹp xanh lá dứa, đuôi ngựa thấp buộc dây san hô rủ qua vai */
  10: {cx:120, ey:106, nb:180, ox:6, D:92, bust:4, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_DARK, ear:[13, 4],
    h:{top:-70, back:54, nape:28, fx:-44, fs:6, n:{tx:-61, ty:20, bx:-48, by:25, r:5, hump:-1}, lu:-47, ll:-45, my:40, ch:[-41, 59], jaw:[14, 48]},
    look(k){
      return [{body:['#f6b49c', '#ea9a7e'], sleeve:['#ea9a7e', '#d47f63']},
        {body:['#ef8f76', '#e2755c'], sleeve:['#e2755c', '#c95e47']},
        {body:['#fcd5ad', '#f6bb88'], sleeve:['#f6bb88', '#df9c66'], cuff:'#fde4e0'}][k];
    },
    hair(x){
      return sdG(`<path d="M-46,-26 C-55,-62 -24,-90 12,-88 C52,-86 74,-58 69,-18 C67,4 62,20 55,30 C46,32 37,28 30,22 C26,12 22,0 18,-8 C12,-14 4,-14 -2,-16 C-16,-20 -32,-24 -46,-26 Z" fill="${x.H}"/>`, 3)
        // mái lệch hất về trước, vén một lọn
        + sdG(`<path d="M30,-80 C0,-84 -36,-68 -48,-40 C-52,-30 -50,-22 -45,-24 C-38,-44 -16,-56 14,-58 Z" fill="${x.H}"/>`, 2.4)
        + sdLn('M24,-72 C0,-74 -30,-62 -42,-36 M28,-60 C42,-50 50,-30 52,2 M40,-72 C56,-60 62,-36 62,-10', '#7a6a5c', 1.5, '.55')
        // kẹp tóc xanh lá dứa trên mái
        + `<g transform="rotate(-24 -18 -62)">` + sdG(`<rect x="-28" y="-64.5" width="20" height="5.5" rx="2.75" fill="#7cc3a4"/>`, 1.6) + `<circle cx="-23" cy="-61.8" r="1" fill="#fff"/></g>`;
    },
    hat(x){
      if(x.k !== 1) return '';
      // băng đô mâm xôi + nơ ở gáy
      return sdG(`<path d="M62,-50 l14,-10 l2,14 z M62,-48 l12,8 l-10,6 z" fill="#e05a6a"/><circle cx="62" cy="-48" r="3.6" fill="#c8384e"/>`, 2.2)
        + sdG(`<path d="M-44,-46 C-30,-68 20,-78 64,-56 L62,-44 C20,-64 -26,-58 -42,-34 Z" fill="#c8384e"/>`
        + `<path d="M-30,-56 h4 M0,-66 h4 M32,-62 h4" fill="none" stroke="#fff" stroke-width="2"/>`, 2.6);
    },
    face(x){
      const {h} = x, ex = h.fx + 14;
      return sdBrow(ex - 10, -16, 20, 2.4, 2.5)
        + sdG(`<path d="M15,21 v4" fill="none" stroke-width="1.4"/><circle cx="15" cy="21" r="2.2" fill="#f2c94c"/><circle cx="15" cy="28" r="3" fill="#ef8a6f"/>`, 1.4);
    },
    lips: '#d77a6a',
    // đuôi ngựa thấp: buộc dây san hô sau tai, rủ qua vai gần ra trước ngực (đung đưa)
    last(x){
      return `<g transform="translate(30,26)"><g class="sd-sway">${sdBB(110)}`
        + sdG(`<path d="M-2,0 C-12,20 -14,44 -10,62 C-6,76 -12,88 -22,96 C-6,96 4,84 6,68 C8,50 12,26 8,2 Z" fill="${x.H}"/>`, 2.8)
        + sdLn('M2,8 C-4,30 -4,52 -2,70 C0,80 -6,88 -12,92', '#7a6a5c', 1.5, '.6')
        + sdG(`<path d="M-6,-4 q6,-6 16,-2 q2,6 -2,9 q-8,3 -14,-1 q-2,-3 0,-6z" fill="#e0604c"/>`, 2)
        + `</g></g>`;
    },
    dress(x){
      const {a, k} = x, collar = sdG(`<path d="M-14,-12 L-30,2 L-20,8 L-10,-2 Z" fill="${x.look.body[0]}"/>`, 2.2);
      if(k === 1)
        return {defs:`<pattern id="${x.P}candy" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#fff6ea"/><rect width="4.5" height="9" fill="#c8384e"/></pattern>`,
          over: collar + sdBib(a, 20, `url(#${x.P}candy)`, '#c8384e')};
      if(k === 2)   // tạp dề jean + ly chè ba màu ở túi yếm
        return {over: collar + sdBib(a, 20, '#6f8fb5', '#5f80a8')
          + sdG(`<path d="M${sdF(-a + 1)},24 L${sdF(-a + 15)},24 L${sdF(-a + 13)},42 L${sdF(-a + 3)},42 Z" fill="#fdf6ea"/>`, 1.8)
          + `<path d="M${sdF(-a + 2)},28 h12 l-0.4,4 h-11.2 z" fill="#7cc36a"/><path d="M${sdF(-a + 2.5)},32 h11 l-0.5,5 h-10 z" fill="#f2c94c"/><path d="M${sdF(-a + 3)},37 h10 l-0.4,4 h-9.2 z" fill="#8a5a3a"/>`
          + sdLn(`M${sdF(-a + 10)},26 l4,-10`, '#e0604c', 2)};
      return {over: collar + sdBib(a, 20, '#e0a458', '#c98a3c')};
    }
  }
};

/* ---------- ghép hình ---------- */
const sideMemo = {};
// hình nghiêng của khách i (0..9, như custSVG), skin k
function sideArt(i, k){
  k = k || 0;
  const key = i + ':' + k;
  if(sideMemo[key]) return sideMemo[key];
  const hd = i + 1, c = SD_CHARS[hd];
  if(!c) return '';
  const P = `sd${hd}k${k}_`, look = c.look(k) || c.look(0), h = c.h, a = c.D/2, sk = c.skin;
  const x = {P, k, h, a, look, S:`url(#${P}skin)`, H:`url(#${P}hair)`};
  const dr = c.dress(x) || {};
  // màu áo: gradient dọc cho thân, ngang cho tay; 'stripe' / 'gold' là hoa văn khai báo trong dress().defs
  const fillOf = (spec, id) => spec === 'stripe' ? `url(#${P}stripe)` : spec === 'gold' ? `url(#${P}gold)` : `url(#${P}${id})`;
  const grad = (spec, id, hor) => typeof spec === 'string' ? '' : sdLin(P + id, spec, hor ? 1 : 0, hor ? 0 : 1);
  const farFill = typeof look.sleeve === 'string' ? fillOf(look.sleeve) : look.sleeve[1];
  // da: gradient theo toạ độ (userSpaceOnUse) — đầu, tai, mí mắt và cổ cùng một trường màu nên chỗ cổ nối đầu không lộ
  // vệt; cổ nằm trong hệ thân nên dùng bản dời gốc (skinn). Bàn tay: gradient theo hình (skinb).
  const [cx, ey, nb, ox] = [c.cx, c.ey, c.nb, c.ox], bx = cx + ox;
  const skStops = `<stop offset="0" stop-color="${sk[0]}"/><stop offset="62%" stop-color="${sk[1]}"/><stop offset="100%" stop-color="${sk[2]}"/>`;
  const defs = `<defs><radialGradient id="${P}skin" gradientUnits="userSpaceOnUse" cx="-14" cy="-12" r="96">${skStops}</radialGradient>`
    + `<radialGradient id="${P}skinn" gradientUnits="userSpaceOnUse" cx="${-14 - ox}" cy="${sdF(-12 - (nb - ey))}" r="96">${skStops}</radialGradient>`
    + `<radialGradient id="${P}skinb" cx="40%" cy="38%" r="70%">${skStops}</radialGradient>`
    + sdLin(P + 'hair', c.hc) + sdLin(P + 'straw', ['#f5d78a', '#c99530'])
    + `<radialGradient id="${P}blush" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e88f72" stop-opacity=".5"/><stop offset="100%" stop-color="#e88f72" stop-opacity="0"/></radialGradient>`
    + grad(look.body, 'body') + grad(look.sleeve, 'sleeve', 1) + (dr.defs || '') + `</defs>`;
  const S = x.S, SB = `url(#${P}skinb)`, bodyFill = fillOf(look.body, 'body'), sleeveFill = fillOf(look.sleeve, 'sleeve');
  const torso = sdTorsoD(a, c.bust, c.hunch);
  const shX = sdF(a*0.08), shY = 7;

  // --- thân (hệ thân): tay xa, ba lô, cổ, thân áo, trang trí
  // cổ: mép trước mọc ra dưới quai hàm, mép sau nối liền đường gáy (đỉnh = điểm đầu nét viền đầu) rồi thoải xuống vai
  const L = (px, py) => `${sdF(px - ox)},${sdF(py + ey - nb)}`, nbL = nb - ey, B = h.back, N = h.nape, nf = h.ch[0] + (c.neckF || 27);
  const neck = `<path d="M${L(nf, h.jaw[1] - 6)} L${L(nf + 3, nbL + 6)} L${L(B - 24, nbL + 6)} L${L(B - 24, nbL - 6)} C${L(B - 20, nbL - 20)} ${L(B - 5, N + 16)} ${L(B - 3, N - 2)} Z" fill="url(#${P}skinn)"/>`
    + `<path d="M${L(nf, h.jaw[1] + 4)} C${L(nf + 18, h.jaw[1] + 2)} ${L(B - 14, N + 14)} ${L(B - 6, N + 4)} L${L(B - 14, nbL - 6)} L${L(nf + 3, nbL)} Z" fill="${SD_INK}" opacity=".1"/>`
    + sdLn(`M${L(nf, h.jaw[1] - 6)} L${L(nf + 3, nbL + 4)} M${L(B - 3, N)} C${L(B - 5, N + 16)} ${L(B - 20, nbL - 20)} ${L(B - 24, nbL - 6)}`, SD_INK, 3);
  const farArm = sdPiv(shX + 6, shY - 3, 'sd-far', 100,
    sdPiv(0, SD_L1, 'sd-forefar', 60, sdFore(farFill, sk[2])) + sdUpper(farFill));
  const body = `<g transform="translate(${bx},${nb})">` + farArm + (dr.back || '') + neck
    + `<clipPath id="${P}tc"><path d="${torso}"/></clipPath>`
    + sdG(`<path d="${torso}" fill="${bodyFill}"/>`, 3.2)
    + (dr.deco ? `<g clip-path="url(#${P}tc)">${dr.deco}</g>` + sdLn(torso, SD_INK, 3.2) : '')
    + (dr.over || '') + `</g>`;

  // --- đầu (hệ đầu)
  const ex = h.fx + 15, n = h.n, [mx, my] = c.mouth || [h.lu + 3, h.my];
  const head = (c.back ? c.back(x) : '')
    + `<path d="${sdHeadD(h, 1)}" fill="${S}"/>` + sdLn(sdHeadD(h), SD_INK, 3.2)
    + `<ellipse cx="${ex + 6}" cy="${n.by - 6}" rx="12" ry="8" fill="url(#${P}blush)"/>`
    + (c.lips ? sdLn(`M${h.lu + 1},${h.my - 4} C${h.lu + 1},${h.my - 1} ${h.lu + 2},${h.my} ${h.lu + 3},${h.my}`, c.lips, 2.2, '.7') : '')
    + sdAla(n, c.alaW || 1)
    + sdEye(hd, ex, 0, S)
    + sdMouth(mx, my)
    + c.hair(x) + (c.ear ? sdEar(c.ear[0], c.ear[1], S) : '') + (c.face ? c.face(x) : '') + (c.hat ? c.hat(x) : '')
    + sdVex(h.back + 9, h.top + 64);
  const headG = `<g transform="translate(${cx},${ey})">` + sdPiv(6, 50, 'sd-head', 200, `<g transform="translate(-6,-50)">${head}</g>`) + `</g>`;

  // --- tay gần (hệ thân) + đồ đè cuối (đuôi ngựa)
  const nearFore = look.hold
    ? sdPiv(0, SD_L1, 'sd-fore sd-forehold', 70, (c.bread ? c.bread(x) : '') + sdFore(sleeveFill, SB))
    : sdPiv(0, SD_L1, 'sd-fore', 60, sdFore(sleeveFill, SB, dr.fore, look.cuff));
  const near = `<g transform="translate(${bx},${nb})">` + sdPiv(shX, shY, look.hold ? 'sd-hold' : 'sd-arm', 100, nearFore + sdUpper(sleeveFill, dr.arm)) + `</g>`;
  const last = c.last ? `<g transform="translate(${cx},${ey})">${c.last(x)}</g>` : '';

  const front = typeof HD_CHARS !== 'undefined' ? HD_CHARS[hd] : '', vb = (front.match(/viewBox="([^"]+)"/) || [, '0 0 200 280'])[1];
  return (sideMemo[key] = `<svg xmlns="http://www.w3.org/2000/svg" class="charsvg side" data-exp="neutral" viewBox="${vb}" overflow="visible">${defs}`
    + `<ellipse cx="${cx + 6}" cy="270" rx="60" ry="9" fill="${SD_INK}" opacity=".12"/>` + body + headG + near + last + `</svg>`);
}
const sideDangMemo = {};
function custSideSVG(i, exp, k){
  const key = i + ':' + (k || 0);
  const art = sideDangMemo[key] || (sideDangMemo[key] = typeof dangNguoi === 'function' ? dangNguoi(sideArt(i, k), i + 1) : sideArt(i, k));   // cùng vóc với hình thẳng
  return art.replace('data-exp="neutral"', 'data-exp="' + exp + '"');
}
