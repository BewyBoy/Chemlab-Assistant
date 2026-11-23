/* =====================================================================
   NHÂN VẬT NHÌN NGHIÊNG — dáng đi từ phải sang trái (mặt quay sang trái)
   Nạp SAU js/nhan-vat-skin.js (dùng EYE_STYLE, eyeDims, EYE_INK, HD_CHARS, dangNguoi).

   Mỗi khách vẽ tay riêng: dáng đầu nghiêng (trán, mũi nhỏ gọn đơn giản, cằm, quai hàm ngắn gọn nối êm vào cổ),
   cổ vừa khít miệng cổ áo, tóc, mũ, kính, đồ nhận diện — khớp với hình nhìn thẳng và từng skin (0, 1, 2).
   ===================================================================== */
'use strict';

const SD_INK = '#3b3025';
const SD_DARK = ['#4a4038', '#37302a', '#2a2420'], SD_GREY = ['#eceae2', '#c3c2b8', '#9c9b91'];
const sdF = v => +(+v).toFixed(1);
const sdG = (inner, w) => `<g stroke="${SD_INK}" stroke-width="${w || 3}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
const sdLn = (d, c, w, op) => `<path d="${d}" fill="none" stroke="${c || SD_INK}" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round"${op ? ` opacity="${op}"` : ''}/>`;
const sdBB = R => `<rect x="${-R}" y="${-R}" width="${2*R}" height="${2*R}" fill="none" stroke="none"/>`;
const sdPiv = (x, y, cls, R, inner) => `<g transform="translate(${sdF(x)},${sdF(y)})"><g class="${cls}">${sdBB(R)}${inner}</g></g>`;
const sdLin = (id, c, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${c.map((s, n) => `<stop offset="${sdF(n/(c.length - 1))}" stop-color="${s}"/>`).join('')}</linearGradient>`;

function sdHeadD(h, close, bald){
  const {top:T, back:B, nape:N, fx:F, n, ch, jaw} = h, fs = h.fs || 5, r = n.r || 3.2;
  const nbk = h.nbk != null ? h.nbk : 22;
  const ntx = Math.max(n.tx, F - 10);
  if(bald){
    const d = `M${nbk},${N}`
      + ` C${B - 4},${N - 6} ${B + 4},${N - 26} ${B + 2},${sdF(T*0.42)}`
      + ` C${B},${T + 8} ${sdF(B*0.28)},${T} ${sdF(F*0.35)},${T}`
      + ` C${F + fs},${T} ${F + 1},${sdF(T*0.48)} ${F},-10`
      + ` C${F},-4 ${F},1 ${F},4`
      + ` Q${ntx},${n.ty - r*0.6} ${ntx},${n.ty}`
      + ` Q${ntx},${n.ty + r*0.8} ${n.bx},${n.by}`
      + ` C${n.bx + 1},${sdF((n.by + ch[1])*0.46)} ${ch[0] - 2},${ch[1] - 10} ${ch[0]},${ch[1] - 2}`
      + ` C${ch[0] + 2},${ch[1] + 2} ${ch[0] + 10},${ch[1] + 3} ${sdF((ch[0] + jaw[0])*0.5)},${sdF((ch[1] + jaw[1])*0.5 + 1.5)}`
      + ` Q${jaw[0] - 3},${jaw[1] + 1} ${jaw[0]},${jaw[1]}`;
    return close ? d + ' Z' : d;
  }
  const backFill = `M${nbk},${N} C${nbk + 4},${N - 10} ${B - 10},${N - 24} ${B - 10},-34 C${B - 12},${T + 16} ${F + 18},${T + 16} ${F + 3},-26`;
  const faceStroke = `${close ? backFill : `M${F + 2},-26`}`
    + ` C${F + 1},-20 ${F},-14 ${F},-10`
    + ` C${F},-4 ${F},1 ${F},4`
    + ` Q${ntx},${n.ty - r*0.6} ${ntx},${n.ty}`
    + ` Q${ntx},${n.ty + r*0.8} ${n.bx},${n.by}`
    + ` C${n.bx + 1},${sdF((n.by + ch[1])*0.46)} ${ch[0] - 2},${ch[1] - 10} ${ch[0]},${ch[1] - 2}`
    + ` C${ch[0] + 2},${ch[1] + 2} ${ch[0] + 10},${ch[1] + 3} ${sdF((ch[0] + jaw[0])*0.5)},${sdF((ch[1] + jaw[1])*0.5 + 1.5)}`
    + ` Q${jaw[0] - 3},${jaw[1] + 1} ${jaw[0]},${jaw[1]}`;
  return close ? faceStroke + ' Z' : faceStroke;
}
const sdEar = (x, y, S) => sdG(`<path d="M${x - 3},${y - 11} C${x + 7},${y - 16} ${x + 15},${y - 5} ${x + 12},${y + 6} C${x + 10},${y + 13} ${x + 3},${y + 17} ${x - 2},${y + 12} Z" fill="${S}"/>`
  + `<path d="M${x + 2},${y - 5} c4,-2 7,3 5,7 c-1,3 -3.5,4 -5,2" fill="none" stroke-width="1.9"/>`, 2.8);

function sdEye(hd, x, y, lid){
  const st = (typeof EYE_STYLE !== 'undefined' && EYE_STYLE[hd]) || {r:3.8, k:1}, r = st.r, f = sdF;
  const {rx, ry} = typeof eyeDims === 'function' ? eyeDims(r, st.k) : {rx:r*0.85, ry:r*1.4*st.k}, ink = typeof EYE_INK !== 'undefined' ? EYE_INK : '#1f1812';
  const s = -1, xo = x - s*(rx + 3), xi = x + s*(rx + 3), yo = y - ry - 1.5, yi = y - ry*0.1;
  const glare = `<path d="M${f(xo)},${f(yo - 4)} L${f(xi)},${f(yo - 4)} L${f(xi)},${f(yi)} L${f(xo)},${f(yo)} Z" fill="${lid}"/>`
    + `<path d="M${f(xo)},${f(yo)} L${f(xi)},${f(yi)}" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`;
  const laugh = `<path d="M${f(x - s*(r + 1))},${f(y - 4.5)} L${f(x + s*r)},${f(y)} L${f(x - s*(r + 1))},${f(y + 4.5)}" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lash = [];
  const lm = (dx, dy) => ` class="eo-lash" style="--lx:${f(dx)}px;--ly:${f(dy)}px"`;
  if(st.lash) lash.push(`<path${lm(-s*0.55*rx, 0.74*ry)} d="M${f(x - s*(rx + 0.5))},${f(y - ry*0.5)} l${f(-s*4.5)},-4" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`);
  if(st.lash > 1) lash.push(`<path${lm(-s*0.22*rx, 1.24*ry + 0.5)} d="M${f(x - s*rx*0.4)},${f(y - ry - 0.5)} l${f(-s*3)},-4.5" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`);
  if(st.crease) lash.push(`<path d="M${f(x - s*(rx + 3))},${f(y + 1)} l${f(-s*4)},2 M${f(x - s*(rx + 3))},${f(y + 3.5)} l${f(-s*3.5)},3" fill="none" stroke="${SD_INK}" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`);
  const open = `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="${ink}"/>` + lash.join('')
    + `<rect class="blinklid" x="${f(x - rx - 1.5)}" y="${f(y - ry - 1.5)}" width="${f(2*rx + 3)}" height="${f(2*ry + 3)}" rx="${f(rx)}" fill="${lid}"/>`;
  const arc = `<path d="M${f(x - r - 2)},${f(y + 1)} q${f(r + 2)},${f(-(r + 4))} ${f(2*r + 4)},0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>` + lash.join('');
  return `<g class="eyes2${st.smiley ? ' eo-smiley' : ''}"><g class="eo-open">${open}</g><g class="eo-glare">${glare}</g>`
    + `<g class="eo-arc">${arc}</g>${st.smiley ? `<g class="eo-laugh">${laugh}</g>` : ''}</g>`;
}
const sdBrow = (x0, y, w, t, arch) => `<path class="brw brw-r" d="M${x0},${y + 1} C${sdF(x0 + w*0.25)},${sdF(y - t - (arch || 1))} ${sdF(x0 + w*0.7)},${sdF(y - t - (arch || 1))} ${x0 + w},${y} C${sdF(x0 + w*0.7)},${sdF(y - t*0.35)} ${sdF(x0 + w*0.3)},${sdF(y - t*0.3)} ${x0},${y + 1} Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`;
const sdMouth = (x, y) => `<g class="x-neutral">${sdLn(`M${x},${y} q4.5,1.8 9,-0.4`, SD_INK, 2.4)}</g>`
  + `<g class="x-happy"><path d="M${x - 1},${y - 1.5} C${x},${y + 6} ${x + 9},${y + 6} ${x + 11},${y - 2} Q${x + 5},${y + 0.5} ${x - 1},${y - 1.5} Z" fill="#a04a3c" stroke="${SD_INK}" stroke-width="2" stroke-linejoin="round"/></g>`
  + `<g class="x-annoy">${sdLn(`M${x},${y + 2} q4.5,-3.6 9,-0.6`, SD_INK, 2.4)}</g>`;
const sdVex = (x, y) => `<g class="x-annoy">${sdLn(`M${x},${y} l5,-9 l5,9 M${x + 12},${y + 6} l5,-9`, '#d9634f', 2.4)}</g>`;

/* ---------- thân ---------- */
function sdTorsoD(a, bust, hunch, tall){
  bust = bust || 0; hunch = hunch || 0;
  if(tall){
    return `M-15,-7 C${sdF(-a*0.58)},-4 ${sdF(-a*0.97 - bust)},12 ${sdF(-a - bust*0.6)},42`
      + ` C${sdF(-a*1.02)},78 ${sdF(-a*0.92)},136 ${sdF(-a*0.95)},216 L${sdF(a*0.90)},216`
      + ` C${sdF(a*0.92)},136 ${sdF(a*1.04 + hunch*0.5)},58 ${sdF(a*0.95 + hunch)},20`
      + ` C${sdF(a*0.84 + hunch)},-4 ${sdF(a*0.42)},${-12 - hunch*0.5} 17,-13 Z`;
  }
  return `M-14,-7 C${sdF(-a*0.58)},-4 ${sdF(-a*0.97 - bust)},8 ${sdF(-a - bust*0.6)},30`
    + ` C${sdF(-a*1.02)},52 ${sdF(-a*0.98)},84 ${sdF(-a*0.97)},130 L${sdF(a*0.92)},130`
    + ` C${sdF(a*0.96)},84 ${sdF(a*1.04 + hunch*0.5)},40 ${sdF(a*0.95 + hunch)},14`
    + ` C${sdF(a*0.84 + hunch)},-4 ${sdF(a*0.42)},${-12 - hunch*0.5} 16,-13 Z`;
}
const SD_L1 = 40, SD_L2 = 34, SD_TL1 = 102, SD_TL2 = 84;
function sdUpper(fill, add, tall){
  if(tall){
    const L1 = SD_TL1;
    return `<g stroke="${SD_INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">`
      + `<path d="M-19,4 C-20,-20 20,-20 19,4 L14,${L1} Q0,${L1 + 7} -14,${L1} Z" fill="${fill}" stroke="none"/>`
      + `<path d="M6,-14 C15,-12 18,-2 16,10 L12.5,${L1 - 2} L5,${L1 + 3} C7,34 6.5,-2 6,-14 Z" fill="${SD_INK}" opacity=".09" stroke="none"/>`
      + (add || '')
      + `<path d="M-14,${L1 - 2} L-19,4 C-20,-20 20,-20 19,4 L14,${L1 - 2}" fill="none"/>`
      + `<path d="M-11,${L1 - 4} Q-3,${L1 + 1} 4,${L1 - 3}" fill="none" stroke-width="1.6" opacity=".45"/>`
      + `</g>`;
  }
  return `<g stroke="${SD_INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">`
    + `<path d="M-14,2 C-15,-16 15,-16 14,2 L10.5,${SD_L1} Q0,${SD_L1 + 5} -10.5,${SD_L1} Z" fill="${fill}" stroke="none"/>`
    + `<path d="M4,-12 C11,-10 13.5,-2 12,6 L9.2,${SD_L1 - 1} L4,${SD_L1 + 2} C5.5,16 5,-2 4,-12 Z" fill="${SD_INK}" opacity=".09" stroke="none"/>`
    + (add || '')
    + `<path d="M-10.5,${SD_L1 - 2} L-14,2 C-15,-16 15,-16 14,2 L10.5,${SD_L1 - 2}" fill="none"/>`
    + `<path d="M-8.5,${SD_L1 - 3} Q-2.5,${SD_L1} 2,${SD_L1 - 2}" fill="none" stroke-width="1.5" opacity=".45"/>`
    + `</g>`;
}
function sdFore(fill, skin, add, cuff, tall){
  if(tall){
    const L = SD_TL2;
    const hand = `<g stroke="${SD_INK}" stroke-linejoin="round" stroke-linecap="round">`
      + `<path d="M-8,${L - 12} C-14,${L - 2} -15,${L + 10} -10,${L + 15} C-7,${L + 18} -4,${L + 14} -3.5,${L + 8} C-3.5,${L + 22} 0,${L + 34} 6,${L + 32} C12,${L + 29} 13,${L + 10} 9,${L - 12} Z" fill="${skin}" stroke-width="2.6"/>`
      + `<path d="M2,${L + 12} C2,${L + 21} 3,${L + 27} 4,${L + 31}" fill="none" stroke-width="1.4"/>`
      + `</g>`;
    const foreSleeve = `<g stroke="${SD_INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">`
      + `<path d="M-14,-6 Q0,-11 14,-6 L10.5,${L - 11} Q0,${L - 5} -10.5,${L - 11} Z" fill="${fill}" stroke="none"/>`
      + `<path d="M3.5,-6 L12,-6 L9.8,${L - 11} L3.5,${L - 10} Z" fill="${SD_INK}" opacity=".09" stroke="none"/>`
      + (cuff ? `<path d="M-11,${L - 19} Q0,${L - 15} 11,${L - 19} L10.5,${L - 11} Q0,${L - 5} -10.5,${L - 11} Z" fill="${cuff}" stroke-width="1.6"/>`
              : `<path d="M-11,${L - 18} Q0,${L - 14} 11,${L - 18}" fill="none" stroke-width="1.5" opacity=".55"/>`)
      + (add || '')
      + `<path d="M-14,-1 L-10.5,${L - 11} Q0,${L - 5} 10.5,${L - 11} L14,-1" fill="none"/>`
      + `</g>`;
    return hand + foreSleeve;
  }
  const L = SD_L2;
  const hand = `<g stroke="${SD_INK}" stroke-linejoin="round" stroke-linecap="round">`
    + `<path d="M-6,${L - 10} C-10.5,${L - 4} -10.5,${L + 2} -6.5,${L + 4} C-4.5,${L + 5} -3,${L + 3} -2.5,${L} C-2.5,${L + 6} 0,${L + 10} 4,${L + 9} C8,${L + 8} 8.5,${L + 1} 6.5,${L - 10} Z" fill="${skin}" stroke-width="2.6"/>`
    + `<path d="M1.5,${L + 3} C1.5,${L + 6.5} 2,${L + 8.5} 2.8,${L + 9.2}" fill="none" stroke-width="1.4"/>`
    + `</g>`;
  const foreSleeve = `<g stroke="${SD_INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">`
    + `<path d="M-10.5,-4 Q0,-8 10.5,-4 L8,${L - 9} Q0,${L - 5} -8,${L - 9} Z" fill="${fill}" stroke="none"/>`
    + `<path d="M2.5,-4 L9,-4 L7.5,${L - 9} L2.5,${L - 8} Z" fill="${SD_INK}" opacity=".09" stroke="none"/>`
    + (cuff ? `<path d="M-8.5,${L - 14} Q0,${L - 11} 8.5,${L - 14} L8,${L - 9} Q0,${L - 5} -8,${L - 9} Z" fill="${cuff}" stroke-width="1.6"/>`
            : `<path d="M-8.4,${L - 13.5} Q0,${L - 10.5} 8.4,${L - 13.5}" fill="none" stroke-width="1.5" opacity=".55"/>`)
    + (add || '')
    + `<path d="M-10.5,-1 L-8,${L - 9} Q0,${L - 5} 8,${L - 9} L10.5,-1" fill="none"/>`
    + `</g>`;
  return hand + foreSleeve;
}

/* ---------- đồ dùng chung ---------- */
const sdScarf = x => sdG(`<path d="M17,-13 C7,-6 ${x + 8},-2 ${x},-1 L${x + 1},5 C${x + 10},4 9,-2 19,-7 Z" fill="#d9364a"/>`
  + `<path d="M${x - 1},3 L${x - 9},19 L${x - 3},18 L${x + 2},6 Z" fill="#d9364a"/><path d="M${x + 1},4 L${x - 1},21 L${x + 4},19 L${x + 4},6 Z" fill="#c22d40"/>`
  + `<ellipse cx="${x}" cy="2" rx="4.6" ry="4" fill="#e8515f"/>`, 1.5);
const sdVee = (a, fill, depth) => `<path d="M-40,-20 L-4,-20 L${sdF(-a*0.55)},${depth || 34} L${-a - 20},${depth || 34} Z" fill="${fill}"/>`
  + sdLn(`M-4,-14 L${sdF(-a*0.55)},${depth || 34}`, SD_INK, 1.5);
function sdBib(a, y0, fill, strap, over){
  const x0 = -a - 2;
  return sdG(`<path d="M${x0},${y0} L${x0 + 20},${y0 - 2} L${x0 + 22},140 L${x0 - 2},140 Z" fill="${fill}"/>`, 1.6)
    + (over ? sdG(`<path d="M${x0 + 18},${y0 + 1} C${x0 + 26},-6 ${-4},-18 ${sdF(a*0.5)},-12 L${sdF(a*0.6)},-5 C4,-10 ${x0 + 30},2 ${x0 + 24},${y0 + 2} Z" fill="${strap}"/>`, 1.5)
      : sdLn(`M${x0 + 16},${y0} C${x0 + 20},10 -16,0 -12,-10`, strap, 4));
}

const SD_CHARS = {
  /* 1 · Bà Tư — lò bánh mì */
  1: {cx:159, ey:103, nb:186, ox:6, D:92, hunch:4, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_GREY, ear:[11, 3], nf:-8, nbk:21,
    h:{top:-65, back:46, nape:28, nbk:21, fx:-43, fs:6, n:{tx:-52, ty:19, bx:-44, by:25, r:3.2}, my:41, ch:[-40, 61], jaw:[-5, 52]},
    look(k){
      return [{body:['#b699cf', '#9b7bb8'], sleeve:['#9b7bb8', '#7d5f99'], hold:1},
        {body:['#fffdf6', '#e9e2cf'], sleeve:['#f1ebdc', '#d6ccb6']},
        {body:['#b77aa8', '#9a5f8e'], sleeve:['#9a5f8e', '#7e4874']}][k];
    },
    back(){ return ''; },
    hair(x){
      // Tóc bạc ngắn uốn phồng cúp ngang gáy (không dùng búi tóc để khác hẳn với Chị Hoa)
      return sdG(`<path d="M-39,-32 C-45,-58 -20,-78 12,-76 C44,-74 58,-50 54,-20 C58,-8 56,6 46,16 C52,24 46,34 34,34 C26,34 22,30 21,26 C17,18 15,10 15,2 C13,-6 8,-10 2,-12 C-4,-22 -16,-30 -39,-32 Z" fill="${x.H}"/>`, 3)
        + sdLn('M-28,-50 C-8,-66 24,-66 40,-44 M18,-26 C32,-16 38,2 34,20 M6,-36 C22,-26 32,-8 28,12 M34,16 C40,20 42,26 36,30', '#8a887e', 1.5, '.55');
    },
    hat(x){
      if(x.k === 1)
        return sdG(`<path d="M-45,-52 C-62,-68 -48,-98 -24,-92 C-20,-118 16,-120 26,-98 C42,-114 74,-100 58,-76 C68,-66 62,-52 54,-52 C26,-62 -22,-60 -45,-52 Z" fill="#fffdf6"/>`
          + `<path d="M-24,-55 C-27,-72 -24,-86 -18,-92 C-20,-78 -19,-64 -16,-55 Z M1,-56 C-1,-74 0,-90 5,-99 C6,-84 6,-68 8,-56 Z M27,-55 C30,-70 31,-84 28,-94 C35,-82 37,-68 35,-55 Z" fill="#dfd6c0" stroke="none"/>`
          + `<path d="M-47,-35 C-28,-43 26,-45 56,-34 L54,-53 C26,-63 -22,-61 -45,-53 Z" fill="#f1ebdc"/>`, 3);
      if(x.k === 2){
        return `<defs><pattern id="${x.P}kdot" width="11" height="11" patternUnits="userSpaceOnUse"><rect width="11" height="11" fill="#d9634f"/><circle cx="3" cy="3" r="1.8" fill="#fff6ea"/><circle cx="8.5" cy="8.5" r="1.8" fill="#fff6ea"/></pattern></defs>`
          + sdG(`<path d="M48,-18 L63,-10 L56,-2 Z M47,-16 L58,2 L49,4 Z" fill="#d9634f"/>`
          + `<path d="M-44,-34 C-44,-58 -20,-75 10,-75 C36,-75 58,-56 56,-22 L46,-14 C32,-34 -4,-40 -44,-34 Z" fill="url(#${x.P}kdot)"/>`, 2.8);
      }
      return '';
    },
    face(x){
      const {h} = x, ex = h.fx + 15;
      return sdLn(`M${h.fx + 7},-28 q6,-2 11,-1 M${h.fx + 6},-22 q6,-2 10,-0.5`, SD_INK, 1.4, '.4')
        + sdLn(`M${ex + 9},-2 l5,-2 M${ex + 9},2 l5,1.5`, SD_INK, 1.4, '.5')
        + `<path class="brw brw-r" d="M${ex - 10},-14 C${ex - 4},-20 ${ex + 4},-20 ${ex + 10},-13 C${ex + 5},-15 ${ex - 4},-15 ${ex - 10},-14 Z" fill="#9e9b91" stroke="${SD_INK}" stroke-width="1.6" stroke-linejoin="round"/>`
        + sdLn(`M${ex + 9},-3 L10,-3`, SD_INK, 2.3)
        + sdG(`<circle cx="${ex - 2}" cy="0" r="11" fill="#e3edf4" fill-opacity=".35"/>`, 2.5)
        + sdLn(`M${ex - 7},-5 q3,-3.5 7,-3.5`, '#ffffff', 1.7, '.8');
    },
    dress(x){
      const {a, k} = x;
      if(k === 1)
        return {over: sdG(`<path d="M-15,-11 C-5,-4 9,-8 17,-13 L17,-6 C9,0 -5,2 -15,-4 Z" fill="#c9aee6"/>`, 1.5)
          + sdG(`<path d="M-17,0 L-25,16 L-19,16 L-15,6 Z M-15,0 L-15,18 L-10,15 L-11,4 Z" fill="#7b4a9e"/><ellipse cx="-16" cy="0" rx="5" ry="4.4" fill="#8d5cb3"/>`, 1.5)
          + `<g fill="${SD_INK}" opacity=".7"><circle cx="${sdF(-a + 9)}" cy="20" r="2.2"/><circle cx="${sdF(-a + 9)}" cy="32" r="2.2"/></g>`};
      const collar = sdG(`<path d="M-13,-9 L-28,6 L-18,9 L-9,0 Z" fill="${k ? '#7e4874' : '#7d5f99'}"/>`, 1.5);
      if(k === 2)
        return {defs:`<pattern id="${x.P}caro" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff6ea"/><rect width="5" height="10" fill="#e8907d" opacity=".55"/><rect width="10" height="5" fill="#e8907d" opacity=".55"/></pattern>`,
          over: collar + sdBib(a, 18, `url(#${x.P}caro)`, '#e8907d')};
      return {over: collar};
    },
    bread(){
      return sdG(`<g transform="translate(0,${SD_L2 + 2}) rotate(186)"><rect x="-22" y="-9.5" width="84" height="19" rx="9.5" fill="#d99a52"/>`
        + `<path d="M2,-6 l6,9 M20,-6 l6,9 M38,-6 l6,9" fill="none" stroke-width="2" opacity=".65"/></g>`, 2.6);
    }
  },

  /* 2 · Chú Ba — nông dân */
  2: {cx:160.5, ey:108, nb:184, ox:6, D:96, tallMale:1, skin:['#eec49e', '#d9a878', '#b9834f'], hc:SD_DARK, ear:[12, 1], nf:-9, nbk:22,
    h:{top:-62, back:46, nape:28, nbk:22, fx:-44, fs:4, n:{tx:-53, ty:18, bx:-45, by:24, r:3.4}, my:37, ch:[-41, 56], jaw:[-6, 48]},
    look(k){
      return [{body:['#a37b4d', '#8a6238'], sleeve:['#8a6238', '#6a4a29']},
        {body:['#e09478', '#cc7a5e'], sleeve:['#d98a6e', '#b86a50']},
        {body:['#bf7150', '#a55c3f'], sleeve:['#b4674a', '#945036']}][k];
    },
    hair(x){
      return sdG(`<path d="M-24,-34 L48,-36 C50,-12 44,12 22,28 C19,20 18,10 19,0 C16,-6 12,-8 9,-4 C7,4 6,10 5,14 C1,4 -1,-10 -3,-18 C-8,-26 -16,-32 -24,-34 Z" fill="${x.H}"/>`, 2.8);
    },
    hat(x){
      return sdG(`<path d="M-90,-30 C-54,-46 -26,-60 4,-66 C38,-58 70,-48 94,-38 C94,-33 90,-30 84,-31 C38,-38 -38,-30 -84,-25 C-89,-25 -92,-27 -90,-30 Z" fill="url(#${x.P}straw)"/>`
        + `<path d="M4,-66 C38,-58 70,-48 94,-38 C94,-33 90,-30 84,-31 L4,-34 Z" fill="${SD_INK}" opacity=".1" stroke="none"/>`, 2.8);
    },
    face(x){
      const {h} = x, ex = h.fx + 15;
      const dots = [[-39, 34], [-35, 32], [-31, 35], [-40, 48], [-36, 52], [-32, 49], [-28, 53], [-23, 50], [-18, 53], [-13, 50]];
      return `<g fill="${SD_INK}" opacity=".45">${dots.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1.15"/>`).join('')}</g>`
        + `<path class="brw brw-r" d="M${ex - 11},-15 L${ex - 2},-22 L${ex + 11},-17 L${ex + 10},-12 L${ex - 2},-16 L${ex - 10},-11 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`;
    },
    dress(x){
      const {a, k} = x, collar = sdG(`<path d="M-13,-9 L-28,7 L-18,8 L-9,-1 Z" fill="${['#6a4a29', '#b86a50', '#945036'][k]}"/>`, 1.5);
      if(k === 1) return {over: collar + sdBib(a, 20, '#6f8fb5', '#5f80a8', 1) + sdG(`<rect x="${sdF(-a + 12)}" y="16" width="9" height="7" rx="1.5" fill="#c9ccd2"/>`, 1.4)};
      if(k === 2)
        return {deco: `<path d="M-4,-24 L120,-24 L120,140 L${sdF(-a + 10)},140 L${sdF(-a + 8)},40 C${sdF(-a + 8)},20 -16,4 -4,-24 Z" fill="#dccb9c"/>`
            + sdLn(`M-4,-14 C-16,4 ${sdF(-a + 8)},20 ${sdF(-a + 8)},48`, SD_INK, 1.5),
          over: collar + sdG(`<rect x="${sdF(-a + 15)}" y="2" width="5" height="22" rx="2.5" fill="#e9f3f6"/><rect x="${sdF(-a + 15)}" y="14" width="5" height="10" rx="2.5" fill="#8a6238"/>`
            + `<path d="M${sdF(-a + 10)},14 L${sdF(-a + 26)},14 L${sdF(-a + 26)},32 L${sdF(-a + 11)},32 Z" fill="#d2c08e"/>`, 1.5)};
      return {over: collar};
    }
  },

  /* 3 · Bé Na — học sinh lớp 8 */
  3: {cx:159, ey:120, nb:190, ox:5, D:82, skin:['#fbe8d6', '#f5d3b3', '#e9b98c'], hc:SD_DARK, ear:[10, 2], nf:-8, nbk:19,
    h:{top:-70, back:42, nape:22, nbk:19, fx:-40, fs:8, n:{tx:-47, ty:13, bx:-41, by:18, r:2.8}, my:30, ch:[-36, 48], jaw:[-5, 41]},
    look(k){
      return [{body:['#f0b8c9', '#e79db5'], sleeve:['#e79db5', '#cf7f9c']},
        {body:['#fdeef3', '#f7d9e4'], sleeve:['#f29bb6', '#e07a9c']},
        {body:['#d4587c', '#b8406a'], sleeve:['#c44c72', '#a3365c']}][k];
    },
    hair(x){
      return sdG(`<path d="M-42,-22 C-47,-56 -18,-78 10,-76 C40,-74 52,-48 47,-14 C44,6 34,18 19,22 C15,14 14,6 14,-2 C11,-10 6,-12 2,-6 C-2,-16 -10,-20 -20,-21 C-28,-21 -35,-21 -42,-22 Z" fill="${x.H}"/>`, 3)
        + sdLn('M-32,-32 C-24,-54 2,-66 26,-58 M20,-38 C32,-22 36,0 30,16', '#7a6a5c', 1.5, '.55')
        + `<g transform="translate(42,6)"><g class="sd-sway">${sdBB(40)}`
        + sdG(`<path d="M0,-4 C14,-6 24,4 23,19 C22,28 15,34 6,33 C1,22 0,10 -3,2 Z" fill="${x.H}"/>`, 2.8)
        + sdLn('M6,2 C13,8 15,18 13,28', '#7a6a5c', 1.4, '.6')
        + sdG(`<path d="M-2,-2 l-9,-6 l1,12 z M-2,-2 l10,-7 l2,12 z" fill="#e8515f"/><circle cx="-2" cy="-2" r="3.8" fill="#ff6b78"/>`, 2)
        + `</g></g>`;
    },
    face(x){ const {h} = x, ex = h.fx + 14; return `<path class="brw brw-r" d="M${ex - 8},-18 C${ex - 3},-23 ${ex + 5},-23 ${ex + 8},-18 C${ex + 6},-15 ${ex - 6},-15 ${ex - 8},-18 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`; },
    dress(x){
      const {a, k} = x, sc = sdScarf(-15);
      if(k === 1)
        return {deco: `<path d="M8,-30 L16,-30 L18,140 L10,140 Z" fill="#f29bb6"/>`,
          over: sdG(`<path d="M${sdF(-a + 6)},12 h12 v8 q0,7 -6,10 q-6,-3 -6,-10 z" fill="#f29bb6"/><path d="M${sdF(-a + 9)},17 h6 M${sdF(-a + 12)},14 v9" fill="none" stroke="#fff" stroke-width="1.6"/>`, 1.8) + sc,
          arm: `<path d="M-3,-14 L3,-14 L3,${SD_L1} L-3,${SD_L1} Z" fill="#fdeef3" opacity=".9"/>`};
      if(k === 2)
        return {deco: sdVee(a, '#fbf8f0', 60),
          back: `<g transform="translate(${sdF(a - 4)},2)"><g class="sd-sway">${sdBB(60)}`
            + sdG(`<path d="M-2,-4 C8,-8 24,-6 28,4 L30,46 C30,54 22,56 10,54 L0,50 Z" fill="#e8b84b"/><path d="M4,18 L26,20 L26,38 L6,36 Z" fill="#c99a32"/>`, 2.8) + `</g></g>`,
          over: sc + sdG(`<path d="M${sdF(a*0.55)},-10 C${sdF(a*0.2)},-14 -6,-10 -12,6 L-6,8 C-2,-4 ${sdF(a*0.2)},-6 ${sdF(a*0.6)},-2 Z" fill="#e8b84b"/>`, 1.5)};
      return {over: sc};
    }
  },

  /* 4 · Anh Minh — thợ xây: đầu và cổ bè ngang khỏe khoắn (fx=-49, back=54, nbk=28) khớp với mặt vuông to ở góc thẳng */
  4: {cx:120, ey:106, nb:182, ox:6, D:110, tallMale:1, skin:['#f4d6ae', '#e3b98c', '#c99a68'], hc:SD_DARK, ear:[15, 2], nf:-12, nbk:28,
    h:{top:-64, back:54, nape:28, nbk:28, fx:-49, fs:3, n:{tx:-58, ty:18, bx:-49, by:24, r:3.8}, my:37, ch:[-47, 55], jaw:[-8, 49]},
    look(k){
      return [{body:['#8ab4da', '#6f9ec9'], sleeve:['#6f9ec9', '#537da8']},
        {body:['#3f6198', '#304f80'], sleeve:['#304f80', '#243e68']},
        {body:['#6189b8', '#4d73a0'], sleeve:['#4d73a0', '#3b5c86']}][k];
    },
    hair(x){
      return sdG(`<path d="M0,-26 L12,-26 C11,-15 9,-5 7,3 C2,-4 0,-14 0,-26 Z M24,-26 L56,-26 C57,-4 49,15 28,28 C25,18 23,4 24,-26 Z" fill="${x.H}"/>`, 2.6);
    },
    hat(x){
      const c = [['#f0b429', '#f7c948'], ['#f4f1e8', '#fffdf5'], ['#f0b429', '#f7c948']][x.k];
      const dome = 'M-58,-28 C-60,-62 -30,-82 4,-82 C40,-82 64,-62 62,-28 Z';
      let s = sdG(`<path d="${dome}" fill="${c[0]}"/>`, 3);
      if(x.k === 1) s += `<clipPath id="${x.P}dome"><path d="${dome}"/></clipPath><path clip-path="url(#${x.P}dome)" d="M-62,-36 C-48,-78 40,-90 70,-40" fill="none" stroke="#f0883e" stroke-width="13"/>` + sdLn(dome, SD_INK, 3);
      else s += `<path d="M-54,-38 C-30,-74 28,-76 56,-48 C30,-66 -24,-64 -50,-32 Z" fill="#d89d1c" stroke="none"/>`;
      s += sdG(`<path d="M-72,-24 C-64,-33 -52,-33 -40,-31 L64,-31 C69,-29 69,-22 64,-21 L-66,-19 C-73,-19 -75,-22 -72,-24 Z" fill="${c[1]}"/>`, 3);
      if(x.k === 2)
        s += sdLn('M-52,-44 C-20,-56 30,-58 60,-40', SD_INK, 5) + sdG(`<path d="M-62,-48 q2,-12 16,-12 q11,0 11,10 q-2,9 -13,9 q-13,0 -14,-7 z" fill="#bfe0e6"/>`, 2.6)
          + sdLn('M-56,-53 q5,-3 10,-2', '#ffffff', 2);
      return s;
    },
    face(x){ const {h} = x, ex = h.fx + 15; return `<path class="brw brw-r" d="M${ex - 12},-13 L${ex + 11},-17 L${ex + 10},-11 L${ex - 11},-8 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`; },
    dress(x){
      const {a, k} = x;
      if(k === 1)
        return {deco: `<path d="M-6,-24 L120,-24 L120,140 L-80,140 L-80,30 C-30,20 -12,6 -6,-24 Z" fill="#f0883e"/>`
            + sdLn(`M-6,-14 C-12,8 -30,24 ${sdF(-a)},30`, SD_INK, 1.5)
            + `<path d="M-80,13 L120,13 L120,20 L-80,20 Z M-80,29 L120,29 L120,36 L-80,36 Z" fill="#e9eef0"/>`};
      if(k === 2)
        return {over: sdG(`<path d="M${sdF(a*0.5)},-14 C${sdF(a*0.2)},-14 -20,-8 ${sdF(-a + 6)},26 L${sdF(-a + 14)},30 C-14,0 ${sdF(a*0.2)},-6 ${sdF(a*0.55)},-6 Z" fill="#d9634f"/>`, 1.5)
          + sdG(`<path d="M${sdF(-a - 1)},18 L${sdF(a)},18 L${sdF(a)},26 L${sdF(-a - 1)},26 Z" fill="#d9634f"/>`, 1.5)
          + sdG(`<rect x="${sdF(-a + 4)}" y="16" width="11" height="12" rx="2" fill="#c9ccd2"/>`, 1.5)};
      return {over: sdG(`<path d="M-15,-10 C-5,-4 9,-8 17,-13 L18,-6 C10,0 -5,3 -16,-4 Z" fill="#537da8"/>`, 1.5)};
    }
  },

  /* 5 · Cô Lan — y tá */
  5: {cx:120, ey:101.5, nb:178, ox:6, D:88, bust:3, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_DARK, ear:[12, 3], nf:-8, nbk:20,
    h:{top:-68, back:44, nape:26, nbk:20, fx:-42, fs:5, n:{tx:-50, ty:17, bx:-43, by:22, r:3.0}, my:36, ch:[-39, 55], jaw:[-5, 46]},
    look(k){
      return [{body:['#6cc0b9', '#4fa6a0'], sleeve:['#4fa6a0', '#3c827c']},
        {body:['#3e9c95', '#2f817b'], sleeve:['#2f817b', '#22655f']},
        {body:['#fdfcf8', '#e9e5da'], sleeve:['#e9e5da', '#d3cdbe']}][k];
    },
    back(x){
      return `<g transform="translate(24,-4)"><g class="sd-sway">${sdBB(120)}`
        + sdG(`<path d="M-6,-14 C18,-16 30,6 28,42 C27,68 28,88 32,108 C20,114 6,112 -4,106 C-2,80 -4,52 -8,30 Z" fill="${x.H}"/>`, 2.8)
        + sdLn('M4,-4 C12,22 14,58 12,104 M16,4 C22,32 22,68 24,106', '#7a6a5c', 1.4, '.6')
        + `</g></g>`;
    },
    hair(x){
      return sdG(`<path d="M-42,-28 C-47,-58 -20,-78 12,-76 C44,-74 56,-48 52,-14 C50,6 42,22 32,30 C24,24 20,14 18,4 C16,-6 12,-12 7,-14 C-4,-20 -18,-30 -42,-28 Z" fill="${x.H}"/>`, 3)
        + (x.k === 2 ? '' : sdLn('M-28,-54 C-6,-68 24,-66 40,-48 M-18,-40 C0,-52 24,-48 36,-28', '#7a6a5c', 1.5, '.55'))
        + sdLn('M18,-32 C28,-18 34,2 34,22', '#7a6a5c', 1.4, '.55');
    },
    hat(x){
      if(x.k !== 2) return '';
      return sdG(`<path d="M-44,-30 C-48,-62 -20,-82 12,-80 C44,-78 58,-54 55,-24 C32,-32 -2,-36 -44,-30 Z" fill="#3fa39a"/>`
        + `<path d="M-44,-30 C-10,-42 26,-40 55,-24 C32,-32 -2,-36 -44,-30 Z" fill="#318a82" stroke="none"/>`, 3);
    },
    face(x){
      const {h} = x, ex = h.fx + 14;
      return sdBrow(ex - 10, -17, 20, 2.4, 0.6)
        + sdLn(`M${ex + 6},-4 L10,-5`, SD_INK, 2.3)
        + sdG(`<rect x="${ex - 12}" y="-10" width="18" height="15" rx="3" fill="#e3edf4" fill-opacity=".35"/>`, 2.3)
        + sdLn(`M${ex - 8},-6 l6,0`, '#ffffff', 1.6, '.8');
    },
    dress(x){
      const {a, k} = x;
      const steth = sdLn(`M16,-12 C4,-4 -10,6 ${sdF(-a + 10)},22 C${sdF(-a + 4)},28 ${sdF(-a + 4)},34 ${sdF(-a + 6)},38`, '#5f6b78', 3.2)
        + sdG(`<circle cx="${sdF(-a + 7)}" cy="40" r="5" fill="#c9ccd2"/>`, 2);
      const cross = sdG(`<rect x="${sdF(-a + 14)}" y="16" width="14" height="13" rx="3" fill="#fffef9"/><path d="M${sdF(-a + 21)},19 v7 M${sdF(-a + 17.5)},22.5 h7" fill="none" stroke="#e0364a" stroke-width="2.4"/>`, 1.4);
      const lapel = c => sdG(`<path d="M-13,-10 L-28,4 L-19,18 L-10,2 Z" fill="${c}"/>`, 1.5);
      if(k === 0) return {deco: sdVee(a, '#f6eedc', 26), over: sdG(`<path d="M-13,-10 L-28,6 L-19,14 L-10,0 Z" fill="#f6eedc"/>`, 1.5) + steth + cross};
      if(k === 1) return {deco: sdVee(a, '#ffffff', 30), over: lapel('#8fd3cb') + steth};
      return {deco: sdVee(a, '#2f8f88', 30), over: lapel('#5fb5ab') + steth + cross,
        arm: sdG(`<path d="M-15.5,8 L15.5,8 L14.8,26 L-14.8,26 Z" fill="#fffef9"/>`, 1.5) + `<path d="M0,11 v12 M-6,17 h12" stroke="#e0364a" stroke-width="3.2"/>`};
    }
  },

  /* 6 · Ông Sáu — chủ ao cá */
  6: {cx:120, ey:102, nb:180, ox:6, D:102, bust:3, hunch:3, bald:1, tallMale:1, skin:['#f6e2ca', '#ecc99f', '#cf9f6d'], hc:SD_GREY, ear:[14, 2], nf:-10, nbk:25,
    h:{top:-54, back:49, nape:25, nbk:25, fx:-45, fs:7, n:{tx:-54, ty:18, bx:-45, by:25, r:3.8}, my:39, ch:[-42, 57], jaw:[-6, 50]},
    look(k){
      return [{body:['#8d9a55', '#74803f'], sleeve:['#fffef9', '#e6dec8']},
        {body:['#c3cd96', '#a9b67a'], sleeve:['#c9dcec', '#a6c1da']},
        {body:'stripe', sleeve:'stripe'}][k];
    },
    hair(x){   // vành tóc bạc ôm từ thái dương trên tai vòng kín ra tận mép sọ sau (back=49) xuống chân gáy (25, 25)
      return sdG(`<path d="M5,-12 C14,-18 36,-18 49,-6 C51,6 42,20 25,25 C22,16 21,8 19,0 C15,-6 9,-8 5,-12 Z" fill="${x.H}"/>`, 2.6)
        + (x.k === 1 ? '' : sdLn('M-35,-38 q14,-7 28,-5 M-37,-30 q14,-6 26,-4', SD_INK, 1.5, '.4'));
    },
    hat(x){
      if(x.k !== 1) return '';
      return sdG(`<path d="M-49,-32 C-51,-64 -18,-78 6,-78 C38,-78 58,-64 56,-32 Z" fill="#b9c48c"/>`, 3)
        + sdLn('M-49,-42 C-14,-51 26,-51 56,-42', '#6c7b45', 7)
        + sdG(`<path d="M-68,-26 C-34,-40 42,-42 78,-26 C81,-20 76,-17 70,-19 C40,-29 -32,-29 -62,-17 C-70,-16 -72,-22 -68,-26 Z" fill="#a3b075"/>`, 2.8);
    },
    face(x){
      const {h} = x, ex = h.fx + 15;
      return `<path class="brw brw-r" d="M${ex - 11},-13 C${ex - 8},-21 ${ex},-22 ${ex + 4},-19 L${ex + 7},-23 C${ex + 11},-20 ${ex + 13},-15 ${ex + 12},-11 C${ex + 6},-13 ${ex - 3},-13 ${ex - 11},-13 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`;
    },
    dress(x){
      const {a, k} = x;
      const fish = sdG(`<rect x="${sdF(-a + 12)}" y="14" width="18" height="12" rx="3" fill="#f6eedc"/><path d="M${sdF(-a + 15)},20 q5,-5 10,0 q-5,5 -10,0 z M${sdF(-a + 25)},20 l4,-3 v6 z" fill="#4f8fc0" stroke-width="1"/>`, 1.4);
      if(k === 2)
        return {defs:`<pattern id="${x.P}stripe" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f3efdc"/><rect width="10" height="4.5" fill="#7f8f42"/></pattern>`,
          over: sdBib(a, 16, '#4e5e37', '#56663c', 1)
          + sdG(`<ellipse cx="${sdF(-a + 9)}" cy="28" rx="8" ry="6" fill="#f6eedc"/><path d="M${sdF(-a + 4)},28 q4,-4 8,0 q-4,4 -8,0 z M${sdF(-a + 12)},28 l3,-2.5 v5 z" fill="#ef8a4c" stroke-width="1"/>`, 1.4)};
      const shirt = k === 0 ? '#f3eddc' : '#d3e3ef';
      return {deco: sdVee(a, shirt, 60), over: fish};
    }
  },

  /* 7 · Bạn Tí — học sinh lớp 8: hạ thấp cằm/hàm (ch=[−36, 54], jaw=[−5, 47]) để cổ ngắn lại đúng bằng góc thẳng */
  7: {cx:120, ey:110, nb:182, ox:5, D:80, skin:['#f9e2c8', '#eec9a1', '#d8a877'], hc:SD_DARK, ear:[10, 3], nf:-8, nbk:19,
    h:{top:-60, back:42, nape:27, nbk:19, fx:-40, fs:6, n:{tx:-47, ty:16, bx:-41, by:21, r:2.8}, my:34, ch:[-36, 54], jaw:[-5, 47]},
    look(k){
      return [{body:['#f0d878', '#e8c34b'], sleeve:['#e8c34b', '#c9a23c'], cap:['#f0d878', '#e2ad2a']},
        {body:['#f7c63f', '#eaa91c'], sleeve:['#eaa91c', '#c98912'], cap:['#f7c63f', '#c98912']},
        {body:['#f8a24a', '#ee8a2e'], sleeve:['#ee8a2e', '#d27220'], cap:['#f8a24a', '#d27220']}][k];
    },
    hair(x){
      // Nối liền tóc mai trước tai với phần tóc sau gáy dưới vành mũ (không bị hở khoảng da trên tai)
      return sdG(`<path d="M-42,-22 C-44,-14 -39,-12 -33,-21 Z M-2,-25 L46,-25 C47,-4 40,16 19,27 C17,17 16,6 14,-2 C11,-10 7,-10 5,-2 C3,4 2,8 0,10 C-2,-2 -2,-12 -2,-25 Z" fill="${x.H}"/>`, 2.6);
    },
    hat(x){
      const c = x.look.cap;
      return sdG(`<path d="M44,-23 C56,-27 70,-26 76,-20 C74,-15 66,-15 46,-15 Z" fill="${c[1]}"/>`, 2.8)
        + sdG(`<path d="M-45,-20 C-49,-50 -20,-68 4,-68 C36,-68 52,-48 50,-20 C24,-25 -18,-25 -45,-20 Z" fill="${c[0]}"/>`
        + `<path d="M-45,-20 C-18,-27 24,-27 50,-20 L49,-27 C22,-33 -18,-33 -44,-27 Z" fill="${SD_INK}" opacity=".13" stroke="none"/>`
        + `<circle cx="4" cy="-68" r="4" fill="#4f8fc0"/>`, 3);
    },
    face(x){
      const {h} = x, ex = h.fx + 14, fr = [[ex + 2, 13], [ex + 7, 15], [ex + 4, 19], [ex + 10, 19], [ex + 12, 14]];
      return `<path class="brw brw-r" d="M${ex - 9},-13 Q${ex - 2},-21 ${ex + 9},-17 L${ex + 8},-12 Q${ex - 1},-15 ${ex - 8},-11 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`
        + `<g fill="#c08060" opacity=".75">${fr.map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1.3"/>`).join('')}</g>`;
    },
    dress(x){
      const {a, k} = x, sc = sdScarf(-15);
      if(k === 1)
        return {over: sdG(`<path d="M-14,-10 C-5,-4 9,-8 16,-13 L17,-6 C9,0 -5,3 -15,-4 Z" fill="#2f5592"/>`, 1.5) + sc
            + `<text x="${sdF(-a + 16)}" y="30" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="17" fill="#2f5592" stroke="${SD_INK}" stroke-width="1" text-anchor="middle">8</text>`,
          arm: sdG(`<path d="M-15,12 L15,12 L14.6,19 L-14.6,19 Z" fill="#2f5592"/>`, 1.4)};
      if(k === 2)
        return {deco: `<path d="M-90,10 L120,10 L120,20 L-90,20 Z" fill="#f4ecd6"/><path d="M-90,20 L120,20 L120,29 L-90,29 Z" fill="#2f5592"/>`
            + sdLn('M-90,10 L120,10 M-90,29 L120,29', SD_INK, 1.5) + sdLn(`M${sdF(-a + 4)},0 L${sdF(-a + 2)},140`, '#b8601a', 1.5),
          over: sc, arm: sdG(`<path d="M-15,10 L15,10 L14.7,18 L-14.7,18 Z" fill="#f4ecd6"/>`, 1.4)};
      return {over: sc};
    }
  },

  /* 8 · Chị Hoa — tiệm vàng bạc */
  8: {cx:120, ey:104, nb:182, ox:5, D:86, bust:4, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_DARK, ear:[11, 2], nf:-8, nbk:19,
    h:{top:-68, back:44, nape:24, nbk:19, fx:-42, fs:5, n:{tx:-50, ty:17, bx:-43, by:22, r:2.9}, my:36, ch:[-38, 57], jaw:[-5, 45]},
    look(k){
      return [{body:['#98c479', '#7aa95c'], sleeve:['#7aa95c', '#5e8944']},
        {body:['#4fa88b', '#358a70'], sleeve:['#358a70', '#276c58']},
        {body:'gold', sleeve:'gold'}][k];
    },
    back(x){
      // Búi tóc cao to tròn nổi bật phía sau đỉnh đầu kèm đai vàng chân búi
      return sdG(`<ellipse cx="38" cy="-64" rx="22" ry="20" fill="${x.H}"/>`
        + `<path d="M18,-51 Q33,-59 50,-44 L46,-39 Q31,-52 16,-45 Z" fill="#e8b84b"/>`, 2.8)
        + sdLn('M26,-74 q14,-4 24,8 M28,-64 q12,4 22,0', '#7a6a5c', 1.5, '.55');
    },
    hair(x){
      return sdG(`<path d="M-41,-30 C-47,-60 -20,-80 12,-78 C44,-76 56,-50 52,-18 C50,2 38,18 19,24 C16,14 15,4 15,-6 C11,-14 6,-16 2,-10 C-4,-22 -18,-28 -41,-30 Z" fill="${x.H}"/>`, 3)
        + sdLn('M-28,-52 C-8,-70 24,-70 42,-48 M-16,-38 C4,-54 26,-52 40,-32 M16,-22 C26,-18 34,-4 32,12', '#7a6a5c', 1.5, '.55')
        + sdG(`<path d="M2,-34 q-10,-4 -14,4 q8,2 14,-4 z" fill="#6ea85a"/>`
          + [[0, -6.5], [6.2, -2], [3.8, 5.2], [-3.8, 5.2], [-6.2, -2]].map(([dx, dy]) => `<circle cx="${sdF(6 + dx)}" cy="${sdF(-42 + dy)}" r="4.8" fill="#e8605a"/>`).join('')
          + `<circle cx="6" cy="-42" r="2.8" fill="#f5c842"/>`, 1.8);
    },
    face(x){
      const {h} = x, ex = h.fx + 14, k = x.k;
      const ear = k === 2 ? sdG(`<circle cx="14" cy="21" r="5.8" fill="none" stroke="#c8a227" stroke-width="2.6"/>`, 0)
        : sdLn(`M14,15 v4`, SD_INK, 1.4) + sdG(`<circle cx="14" cy="21" r="3.4" fill="#f2c94c"/>`, 1.6);
      return `<path class="brw brw-r" d="M${ex - 10},-14 Q${ex},-26 ${ex + 11},-14 Q${ex},-20 ${ex - 10},-14 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>` + `<g class="sd-ear2">${ear}</g>`;
    },
    dress(x){
      const {a, k} = x;
      const chain = sdLn(`M16,-12 C6,-2 -10,8 ${sdF(-a + 10)},16`, '#d9a72c', 2.6) + sdG(`<circle cx="${sdF(-a + 9)}" cy="19" r="4" fill="#f2c94c"/>`, 1.6);
      if(k === 0) return {deco: sdVee(a, '#f6eedc', 18), over: chain};
      if(k === 1) return {deco: sdVee(a, '#f6eedc', 26), over: sdG(`<path d="M-12,-10 L-28,8 L-22,26 L-13,6 Z" fill="#2c7f66"/>`, 1.5) + chain};
      return {defs:`<pattern id="${x.P}gold" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#23946a"/><g fill="#f2c94c"><circle cx="4" cy="4" r="1.6"/><circle cx="6.4" cy="4" r="1.3"/><circle cx="1.6" cy="4" r="1.3"/><circle cx="4" cy="1.6" r="1.3"/><circle cx="4" cy="6.4" r="1.3"/></g><circle cx="12" cy="12" r="1.2" fill="#f2c94c"/></pattern>`,
        deco: sdVee(a, '#f6eedc', 10),
        over: `<path d="M16,-12 C6,-2 -10,8 ${sdF(-a + 10)},14" fill="none" stroke="#f2c94c" stroke-width="3.6" stroke-dasharray="0.1 5" stroke-linecap="round"/>`
          + sdG(`<path d="M${sdF(-a + 10)},14 l4,6 l-4,6 l-4,-6 z" fill="#f2c94c"/>`, 1.6)};
    }
  },

  /* 9 · Thầy Nam — giáo viên Hoá: tóc nghiêng hạ độ phồng đỉnh xuống y≈-68, mái rẽ ngôi ôm nhẹ xuống trán khớp với góc thẳng */
  9: {cx:120, ey:105, nb:180, ox:6, D:94, tallMale:1, skin:['#f2dcc0', '#e3c39a', '#c49a6c'], hc:SD_DARK, ear:[12, 2], nf:-9, nbk:21,
    h:{top:-64, back:44, nape:28, nbk:21, fx:-43, fs:4, n:{tx:-52, ty:19, bx:-44, by:24, r:3.2}, my:39, ch:[-41, 61], jaw:[-6, 51]},
    look(k){
      return [{body:['#f3eddc', '#fffef9'], sleeve:['#fffef9', '#e6e0cf']},
        {body:['#fffef9', '#e6e0cf'], sleeve:['#fffef9', '#e6e0cf']},
        {body:['#fffefa', '#e4dfd2'], sleeve:['#fffefa', '#e4dfd2']}][k];
    },
    hair(x){
      // vòm tóc gọn vừa phải (đỉnh y≈-68 thay vì y=-78), mái rẽ ngôi 7/3 đổ nhẹ xuống trán (y=-23) và tóc mai thẳng gọn trước tai
      return sdG(`<path d="M-43,-23 C-46,-42 -36,-62 -12,-67 C16,-72 44,-60 49,-30 C51,-8 42,14 21,28 C18,18 18,6 18,-4 C15,-12 9,-12 7,-2 C5,4 4,8 3,10 C1,-4 -1,-14 -6,-21 C-16,-19 -30,-20 -43,-23 Z" fill="${x.H}"/>`, 3)
        + sdLn('M-24,-48 C-32,-40 -38,-32 -41,-24 M-24,-48 C-2,-58 22,-54 38,-36 M-12,-36 C8,-44 26,-40 36,-24', '#8a7a6a', 1.6, '.65');
    },
    face(x){ const {h} = x, ex = h.fx + 15; return `<path class="brw brw-r" d="M${ex - 11},-16 L${ex - 3},-22 L${ex + 11},-17 L${ex + 10},-13 L${ex - 2},-17 L${ex - 10},-13 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`; },
    dress(x){
      const {a, k} = x;
      if(k === 0) return {};
      if(k === 1)
        return {deco: `<path d="M-4,-24 L120,-24 L120,140 L${sdF(-a + 8)},140 L${sdF(-a + 6)},40 C${sdF(-a + 8)},26 -14,8 -4,-24 Z" fill="#d8a94c"/>`
            + `<g stroke="#b98a35" stroke-width="1.2" opacity=".6">${[-30, -18, -6, 6, 18, 30].map(px => `<path d="M${px},-10 v150"/>`).join('')}</g>`
            + sdLn(`M-4,-14 C-14,8 ${sdF(-a + 6)},26 ${sdF(-a + 6)},44`, SD_INK, 1.5),
          over: sdG(`<path d="M${sdF(-a + 22)},12 v6 l-5,8 h12 l-5,-8 v-6 z" fill="#e9f3f6"/><path d="M${sdF(-a + 18.5)},23 h9 l1.5,3 h-12 z" fill="#7cc36a" stroke="none"/>`, 1.4)};
      return {deco: sdVee(a, '#fbf6e8', 50) + sdLn(`M-8,-18 L${sdF(-a*0.55 - 4)},50`, SD_INK, 1.5),
        over: sdG(`<rect x="${sdF(-a + 20)}" y="4" width="5" height="22" rx="2.5" fill="#e9f3f6"/><rect x="${sdF(-a + 20)}" y="14" width="5" height="12" rx="2.5" fill="#9b7bb8"/>`
          + `<path d="M${sdF(-a + 15)},16 L${sdF(-a + 32)},16 L${sdF(-a + 32)},36 L${sdF(-a + 16)},36 Z" fill="#f4f1e8"/>`, 1.5)};
    }
  },

  /* 10 · Cô Mai — quán chè */
  10: {cx:120, ey:106, nb:180, ox:6, D:90, bust:4, skin:['#f9e6d1', '#f0d0ac', '#e2b184'], hc:SD_DARK, ear:[11, 3], nf:-8, nbk:20,
    h:{top:-68, back:44, nape:26, nbk:20, fx:-42, fs:6, n:{tx:-49, ty:16, bx:-43, by:21, r:3.0}, my:35, ch:[-38, 53], jaw:[-5, 45]},
    look(k){
      return [{body:['#f6b49c', '#ea9a7e'], sleeve:['#ea9a7e', '#d47f63']},
        {body:['#ef8f76', '#e2755c'], sleeve:['#e2755c', '#c95e47']},
        {body:['#fcd5ad', '#f6bb88'], sleeve:['#f6bb88', '#df9c66'], cuff:'#fde4e0'}][k];
    },
    hair(x){
      const clip = x.k === 1 ? '' : `<g transform="rotate(-22 -18 -56)">` + sdG(`<rect x="-27" y="-58.5" width="18" height="5" rx="2.5" fill="#7cc3a4"/>`, 1.6) + `<circle cx="-22.5" cy="-56" r="1" fill="#fff"/></g>`;
      return sdG(`<path d="M-43,-24 C-49,-58 -20,-80 12,-78 C44,-76 58,-50 54,-14 C52,6 40,22 20,26 C17,16 15,6 14,-4 C11,-12 6,-14 0,-16 C-14,-20 -28,-22 -43,-24 Z" fill="${x.H}"/>`, 3)
        + sdLn('M18,-62 C-4,-64 -26,-52 -38,-30 M20,-48 C34,-38 42,-18 40,10', '#7a6a5c', 1.5, '.55')
        + clip;
    },
    hat(x){
      if(x.k !== 1) return '';
      return sdG(`<path d="M52,-44 l13,-10 l2,13 z M52,-42 l11,8 l-9,6 z" fill="#e05a6a"/><circle cx="52" cy="-42" r="3.4" fill="#c8384e"/>`, 2.2)
        + sdG(`<path d="M-41,-42 C-28,-64 18,-72 54,-50 L52,-39 C18,-58 -24,-52 -39,-31 Z" fill="#c8384e"/>`
        + `<path d="M-26,-51 h4 M2,-60 h4 M28,-56 h4" fill="none" stroke="#fff" stroke-width="2"/>`, 2.6);
    },
    face(x){
      const {h} = x, ex = h.fx + 14;
      return `<path class="brw brw-r" d="M${ex - 10},-14 Q${ex},-25 ${ex + 10},-14 Q${ex},-20 ${ex - 10},-14 Z" fill="${SD_INK}" stroke="${SD_INK}" stroke-width="1" stroke-linejoin="round"/>`
        + sdG(`<path d="M13,19 v4" fill="none" stroke-width="1.4"/><circle cx="13" cy="19" r="2.1" fill="#f2c94c"/><circle cx="13" cy="26" r="2.8" fill="#ef8a6f"/>`, 1.4);
    },
    last(x){
      return `<g transform="translate(44,4)"><g class="sd-sway">${sdBB(90)}`
        + sdG(`<path d="M0,-2 C18,2 28,22 22,50 C18,68 8,82 -6,88 C-3,72 -5,56 -10,42 C-14,28 -12,10 0,-2 Z" fill="${x.H}"/>`, 2.8)
        + sdLn('M8,14 C16,30 16,52 7,72', '#7a6a5c', 1.6, '.55')
        + sdG(`<path d="M-5,-2 C-1,-9 11,-6 13,2 C11,9 -1,8 -5,2 Z" fill="#e0604c"/>`, 2.2)
        + `</g></g>`;
    },
    dress(x){
      const {a, k} = x, collar = sdG(`<path d="M-13,-11 L-27,2 L-18,8 L-9,-2 Z" fill="${x.look.body[0]}"/>`, 1.5);
      if(k === 1)
        return {defs:`<pattern id="${x.P}candy" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#fff6ea"/><rect width="4.5" height="9" fill="#c8384e"/></pattern>`,
          over: collar + sdBib(a, 20, `url(#${x.P}candy)`, '#c8384e')};
      if(k === 2)
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
function sideArt(i, k){
  k = k || 0;
  const key = i + ':' + k;
  if(sideMemo[key]) return sideMemo[key];
  const hd = i + 1, c = SD_CHARS[hd];
  if(!c) return '';
  const P = `sd${hd}k${k}_`, look = c.look(k) || c.look(0), h = c.h, T = !!c.tallMale, a = (c.D/2) * (T ? 1.1 : 1), sk = c.skin;
  const x = {P, k, h, a, look, S:`url(#${P}skin)`, H:`url(#${P}hair)`};
  const dr = c.dress(x) || {};
  const fillOf = (spec, id) => spec === 'stripe' ? `url(#${P}stripe)` : spec === 'gold' ? `url(#${P}gold)` : `url(#${P}${id})`;
  const grad = (spec, id, hor) => typeof spec === 'string' ? '' : sdLin(P + id, spec, hor ? 1 : 0, hor ? 0 : 1);
  const farFill = typeof look.sleeve === 'string' ? fillOf(look.sleeve) : look.sleeve[1];
  const [cx, ey, nb, ox] = [c.cx, c.ey, c.nb + (T ? 8 : 0), c.ox], bx = cx + ox;
  const skStops = `<stop offset="0" stop-color="${sk[0]}"/><stop offset="62%" stop-color="${sk[1]}"/><stop offset="100%" stop-color="${sk[2]}"/>`;
  const defs = `<defs><radialGradient id="${P}skin" gradientUnits="userSpaceOnUse" cx="-14" cy="-12" r="96">${skStops}</radialGradient>`
    + `<radialGradient id="${P}skinn" gradientUnits="userSpaceOnUse" cx="${-14 - ox}" cy="${sdF(-12 - (nb - ey))}" r="96">${skStops}</radialGradient>`
    + `<radialGradient id="${P}skinb" cx="40%" cy="38%" r="70%">${skStops}</radialGradient>`
    + sdLin(P + 'hair', c.hc) + sdLin(P + 'straw', ['#f5d78a', '#c99530'])
    + `<radialGradient id="${P}blush" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e88f72" stop-opacity=".5"/><stop offset="100%" stop-color="#e88f72" stop-opacity="0"/></radialGradient>`
    + grad(look.body, 'body') + grad(look.sleeve, 'sleeve', 1) + (dr.defs || '') + `</defs>`;
  const S = x.S, SB = `url(#${P}skinb)`, bodyFill = fillOf(look.body, 'body'), sleeveFill = fillOf(look.sleeve, 'sleeve');
  const torso = sdTorsoD(a, c.bust, c.hunch, T);
  const L1 = T ? SD_TL1 : SD_L1, shX = sdF(a*0.08), shY = T ? 12 : 7;

  // --- thân (hệ thân): người đầu/cổ bè ngang (Anh Minh, Ông Sáu) thì chân cổ mở rộng theo nf/nbk
  const L = (px, py) => `${sdF(px - ox)},${sdF(py + ey - nb)}`, nbL = nb - ey;
  const nf = c.nf != null ? c.nf : -8, nbk = c.nbk != null ? c.nbk : 21, N = h.nape, jy = h.jaw[1];
  const nfBot = Math.min(ox - 13.5, nf + 1.5), nbkBot = Math.max(ox + 15.5, nbk - 2);
  const neck = `<path d="M${L(nf, jy - 4)} Q${L(nf + 1, (jy + nbL)*0.5)} ${L(nfBot, nbL + 4)} L${L(nbkBot, nbL + 4)} Q${L(nbk - 1, (N + nbL)*0.5)} ${L(nbk, N - 2)} Z" fill="url(#${P}skinn)"/>`
    + `<path d="M${L(nf, jy)} L${L(h.jaw[0] + 2, jy - 1)} L${L(nf + 1, jy + 7)} Z" fill="${SD_INK}" opacity=".14"/>`
    + sdLn(`M${L(nf, jy)} Q${L(nf + 1, (jy + nbL)*0.5)} ${L(nfBot, nbL + 2)} M${L(nbk, N)} Q${L(nbk - 1, (N + nbL)*0.5)} ${L(nbkBot, nbL - 4)}`, SD_INK, 3);
  const farArm = sdPiv(shX + (T ? 7 : 6), shY - 3, 'sd-far', T ? 180 : 100,
    sdPiv(0, L1, 'sd-forefar', T ? 140 : 60, sdFore(farFill, sk[2], null, null, T)) + sdUpper(farFill, null, T));
  const decoS = T ? (dr.deco || '').replace(/,140/g, ',216').replace(/v150/g, 'v226') : (dr.deco || '');
  const overS = T ? (dr.over || '').replace(/,140/g, ',216') : (dr.over || '');
  const body = `<g transform="translate(${bx},${nb})">` + farArm + (dr.back || '') + neck
    + `<clipPath id="${P}tc"><path d="${torso}"/></clipPath>`
    + sdG(`<path d="${torso}" fill="${bodyFill}"/><path d="M${sdF(a*0.35)},-10 C${sdF(a*0.78)},0 ${sdF(a*0.98)},${T ? 60 : 40} ${sdF(a*0.92)},${T ? 216 : 130} L${sdF(a*0.58)},${T ? 216 : 130} C${sdF(a*0.64)},${T ? 76 : 50} ${sdF(a*0.54)},10 ${sdF(a*0.35)},-10 Z" fill="${SD_INK}" opacity=".08" stroke="none"/>`, 3.2)
    + (decoS ? `<g clip-path="url(#${P}tc)">${decoS}</g>` + sdLn(torso, SD_INK, 3.2) : '')
    + overS + `</g>`;

  // --- đầu (hệ đầu)
  const ex = h.fx + 14, n = h.n, [mx, my] = c.mouth || [n.bx + 2, h.my];
  const head = (c.back ? c.back(x) : '')
    + `<path d="${sdHeadD(h, 1, c.bald)}" fill="${S}"/>` + sdLn(sdHeadD(h, 0, c.bald), SD_INK, 3.2)
    + `<ellipse cx="${ex + 5}" cy="${n.by + 4}" rx="11" ry="7.5" fill="url(#${P}blush)"/>`
    + sdEye(hd, ex, 0, S)
    + sdMouth(mx, my)
    + c.hair(x) + (c.ear ? sdEar(c.ear[0], c.ear[1], S) : '') + (c.face ? c.face(x) : '') + (c.hat ? c.hat(x) : '')
    + sdVex(h.back + 6, h.top + 60);
  const headG = `<g transform="translate(${cx},${ey})">` + sdPiv(6, 50, 'sd-head', 200, `<g transform="translate(-6,-50)">${head}</g>`) + `</g>`;

  // --- tay gần (hệ thân) + đồ đè cuối (đuôi ngựa)
  const nearFore = look.hold
    ? sdPiv(0, L1, 'sd-fore sd-forehold', 70, (c.bread ? c.bread(x) : '') + sdFore(sleeveFill, SB, null, null, T))
    : sdPiv(0, L1, 'sd-fore', T ? 140 : 60, sdFore(sleeveFill, SB, dr.fore, look.cuff, T));
  const near = `<g transform="translate(${bx},${nb})">` + sdPiv(shX, shY, look.hold ? 'sd-hold' : 'sd-arm', T ? 180 : 100, nearFore + sdUpper(sleeveFill, dr.arm, T)) + `</g>`;
  const last = c.last ? `<g transform="translate(${cx},${ey})">${c.last(x)}</g>` : '';

  const front = typeof HD_CHARS !== 'undefined' ? HD_CHARS[hd] : '', vb = (front.match(/viewBox="([^"]+)"/) || [, '0 0 200 280'])[1];
  const shadow = T ? '' : `<ellipse cx="${cx + 6}" cy="270" rx="60" ry="9" fill="${SD_INK}" opacity=".12"/>`;
  return (sideMemo[key] = `<svg xmlns="http://www.w3.org/2000/svg" class="charsvg side" data-exp="neutral" viewBox="${vb}" overflow="visible">${defs}`
    + shadow + body + headG + near + last + `</svg>`);
}
const sideDangMemo = {};
function custSideSVG(i, exp, k){
  const key = i + ':' + (k || 0);
  const art = sideDangMemo[key] || (sideDangMemo[key] = typeof dangNguoi === 'function' ? dangNguoi(sideArt(i, k), i + 1) : sideArt(i, k));
  return art.replace('data-exp="neutral"', 'data-exp="' + exp + '"');
}
