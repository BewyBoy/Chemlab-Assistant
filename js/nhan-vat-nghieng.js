/* =====================================================================
   NHÂN VẬT NHÌN NGHIÊNG — dáng đi từ phải sang trái (mặt quay sang trái)
   Nạp SAU js/nhan-vat-skin.js (dùng EYE_STYLE, EYE_INK, SKIN_COUNT).

   Hình vẽ bằng tham số: mỗi khách có kiểu tóc / kính / râu riêng, mỗi skin (0 cổ điển, 1, 2 trong js/trang-phuc.js)
   có màu áo, mũ và đồ đi kèm riêng (tạp dề, gi-lê, yếm, ba lô…). Khung vẽ: mặt ở x 65..172, y 50..168 — trùng
   chỗ khuôn mặt của hình nhìn thẳng (cả khung 200x280 lẫn 280x280), nên lúc khách dừng trước khay, đổi sang hình
   thẳng không bị giật.

   Hình có cùng lớp với hình thẳng: .charsvg, data-exp, .eyes2 / .eo-open / .eo-arc / .blinklid, x-neutral / x-happy /
   x-annoy — nên biểu cảm, chớp mắt, nhún khi bước dùng chung CSS. Tay gần (.sarm) đánh theo nhịp bước.
   ===================================================================== */
'use strict';

const SIDE_INK = '#3b3025';
const SD_GREY = ['#eceae2', '#c3c2b8', '#9c9b91'], SD_DARK = ['#4a4038', '#37302a', '#2a2420'];
const SD_SKIN = {
  1:['#f9e6d1', '#f0d0ac', '#e2b184'], 2:['#eec49e', '#d9a878', '#b9834f'], 3:['#fbe8d6', '#f5d3b3', '#e9b98c'],
  4:['#f9e2c8', '#eec9a1', '#d8a877'], 5:['#f9e6d1', '#f0d0ac', '#e2b184'], 6:['#f6e2ca', '#ecc99f', '#cf9f6d'],
  7:['#f9e2c8', '#eec9a1', '#d8a877'], 8:['#f9e6d1', '#f0d0ac', '#e2b184'], 9:['#f2dcc0', '#e3c39a', '#c49a6c'],
  10:['#f9e6d1', '#f0d0ac', '#e2b184']
};
// lệch dọc của khuôn mặt hình thẳng so với khung chuẩn (mặt ở y 54)
const SIDE_DY = {1:4, 3:-4, 6:4, 7:-4};
const WHITE_SHIRT = ['#fffef9', '#e6e0cf'];
/* Mỗi khách (chỉ số HD_CHARS 1..10): tóc, màu tóc, kính, râu; looks[k] = skin k:
   body/arm = màu thân áo / tay áo; hat = mũ; add = đồ thêm trên người (vẽ theo thứ tự) */
const SIDE_LOOK = {
  1: {hair:'bun', hc:SD_GREY, glasses:1, looks:[            // Bà Tư — lò bánh mì
    {body:['#b699cf', '#9b7bb8'], arm:['#9b7bb8', '#7d5f99'], add:['bread']},
    {body:['#fffdf6', '#e9e2cf'], arm:['#f1ebdc', '#d6ccb6'], hat:{t:'chef'}, add:['buttons', 'bread']},
    {body:['#8fbf9a', '#6fa57d'], arm:['#6fa57d', '#55895f'], hat:{t:'kerchief', c:'#d9634f', dots:'#fff4ea'}, add:[{t:'apron', c:'caro'}]}
  ]},
  2: {hair:'short', hc:SD_DARK, looks:[                     // Chú Ba — nông dân
    {body:['#a37b4d', '#8a6238'], arm:['#8a6238', '#6a4a29'], hat:{t:'conical'}},
    {body:['#e09478', '#cc7a5e'], arm:['#cc7a5e', '#a95e45'], hat:{t:'conical'}, add:[{t:'bib', c:'#5b7fae'}]},
    {body:['#9cc77e', '#7aa95c'], arm:['#7aa95c', '#5e8944'], hat:{t:'conical'}, add:[{t:'vest', c:'#c9b48a'}, {t:'pocket', c:'#b8a276'}]}
  ]},
  3: {hair:'bob', hc:SD_DARK, bow:'#d9463b', looks:[         // Bé Na — học sinh lớp 8
    {body:['#f0b8c9', '#e79db5'], arm:['#e79db5', '#cf7f9c'], add:['scarf']},
    {body:['#fbfcfd', '#e1e9f1'], arm:['#7aa8d2', '#5b88b8'], add:['scarf'], armAdd:[{t:'armstripe', c:'#fbfcfd'}]},
    {body:['#5d78a6', '#465f8c'], arm:['#4f6a98', '#3c5480'], add:['scarf', {t:'backpack', c:'#e0b04a'}]}
  ]},
  4: {hair:'short', hc:SD_DARK, looks:[                     // Anh Minh — thợ xây
    {body:['#8ab4da', '#6f9ec9'], arm:['#6f9ec9', '#537da8'], hat:{t:'hardhat', c:'#f0b429', b:'#f5c84a'}},
    {body:['#f08a3c', '#e07a2e'], arm:['#9aa3ad', '#7d8691'], hat:{t:'hardhat', c:'#f3f1ea', b:'#fbfaf5', stripe:'#f08a3c'}, add:['hivis']},
    {body:['#cdb98e', '#b8a276'], arm:['#b8a276', '#9a855c'], hat:{t:'hardhat', c:'#f0b429', b:'#f5c84a', goggles:1}, add:['harness']}
  ]},
  5: {hair:'long', hc:SD_DARK, glasses:1, looks:[            // Cô Lan — y tá trạm xá
    {body:['#6cc0b9', '#4fa6a0'], arm:['#4fa6a0', '#3c827c'], add:['collar']},
    {body:['#88aedb', '#6992c4'], arm:['#6992c4', '#4f77a8'], add:['steth']},
    {body:['#fdfcf8', '#e9e5da'], arm:['#e9e5da', '#d3cdbe'], hat:{t:'kerchief', c:'#4fa6a0', dots:'#ffffff'}, add:[{t:'coat', c:'#6cc0b9'}, 'steth']}
  ]},
  6: {hair:'bald', hc:SD_GREY, beard:1, looks:[             // Ông Sáu — chủ ao cá
    {body:['#a37b4d', '#8a6238'], arm:['#8a6238', '#6a4a29'], add:[{t:'zip', c:'#6a4a29'}]},
    {body:['#bcd6ea', '#a3c2dc'], arm:['#a3c2dc', '#86a8c6'], hat:{t:'bucket'}, add:[{t:'vest', c:'#9fae72'}, {t:'pocket', c:'#86965a'}]},
    {body:'stripe', arm:'stripe', add:[{t:'bib', c:'#5b8a66'}]}
  ]},
  7: {hair:'short', hc:SD_DARK, looks:[                     // Bạn Tí — học sinh lớp 8
    {body:['#f0d878', '#e8c34b'], arm:['#e8c34b', '#c9a23c'], hat:{t:'cap', c:'#f0c63c', b:'#e2ad2a'}, add:['scarf']},
    {body:['#92c67a', '#72a95c'], arm:['#72a95c', '#57893f'], hat:{t:'cap', c:'#7aa95c', b:'#5e8944'}, add:['scarf'], armAdd:[{t:'armstripe', c:'#f6f1e4'}]},
    {body:['#78c3b8', '#56a69c'], arm:['#56a69c', '#3f857c'], hat:{t:'cap', c:'#56a69c', b:'#3f857c'}, add:[{t:'band', c:'#f6f1e4'}, {t:'crossbag', c:'#e0b04a'}]}
  ]},
  8: {hair:'bunTop', hc:SD_DARK, flower:'#d9463b', hoop:'#d9a72c', looks:[   // Chị Hoa — tiệm vàng bạc
    {body:['#98c479', '#7aa95c'], arm:['#7aa95c', '#5e8944'], add:['necklace']},
    {body:['#4fa88b', '#358a70'], arm:['#358a70', '#276c58'], add:[{t:'lapel', c:'#2c6f5b'}, 'necklace']},
    {body:'golddot', arm:['#bf4c43', '#9e3b34'], add:['necklace']}
  ]},
  9: {hair:'part', hc:SD_DARK, looks:[                      // Thầy Nam — giáo viên Hoá
    {body:WHITE_SHIRT, arm:['#fffef9', '#e6e0cf'], add:['collar', {t:'tie', c:'#d9463b'}]},
    {body:WHITE_SHIRT, arm:['#fffef9', '#e6e0cf'], add:['collar', {t:'tie', c:'#d9463b'}, {t:'vest', c:'#d8a94c', knit:1}]},
    {body:['#fffefa', '#e4dfd2'], arm:['#fffefa', '#e4dfd2'], add:[{t:'coat', c:'#c6d9ec'}, {t:'tie', c:'#5e8944'}, 'pens']}
  ]},
  10: {hair:'short', hc:SD_DARK, looks:[                    // Cô Mai — quán chè
    {body:WHITE_SHIRT, arm:['#fffef9', '#e6e0cf'], add:[{t:'apron', c:'#e0a458'}]},
    {body:['#c3e6d7', '#a6d4c1'], arm:['#a6d4c1', '#86bba6'], hat:{t:'bandana', c:'#d9463b'}, add:[{t:'apron', c:'candy'}]},
    {body:['#f6b49c', '#ea9a7e'], arm:['#ea9a7e', '#d07c61'], add:[{t:'apron', c:'#3f5a7a'}]}
  ]}
};

/* ---------- hình khối cơ bản (khung chuẩn 200x280, mặt quay trái) ---------- */
const SD = {
  head: 'M120,50 C150,50 172,68 172,98 C172,128 160,156 128,166 C112,170 96,168 88,160 C83,155 84,149 83,146 C81,142 82,139 80,137 L80,134 C74,132 66,130 65,125 C64,120 72,112 77,104 C79,96 76,82 82,72 C90,58 104,50 120,50 Z',
  neck: 'M110,154 L108,190 Q126,198 146,186 L142,148 Z',
  torso: 'M106,180 C88,186 78,198 76,220 L74,300 L170,300 L168,226 C168,204 160,188 148,180 C134,190 120,190 106,180 Z',
  arm: 'M112,190 C100,200 102,236 106,262 Q122,272 138,262 C142,236 144,204 136,190 Q124,184 112,190 Z',
  hand: 'M108,262 Q122,272 136,262 Q140,280 122,284 Q104,280 108,262 Z',
  ear: 'M130,104 C134,96 148,98 148,112 C148,126 136,130 130,122 Z',
  eye: [92, 104]
};
const sdG = (inner, w) => `<g stroke="${SIDE_INK}" stroke-width="${w || 3}" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;

function sideHair(sp, P){
  const back = [], front = [];
  const cap = 'M80,82 C80,58 100,44 122,44 C152,44 176,64 174,100 C172,116 168,128 162,138 C158,122 152,108 142,100 C128,96 108,92 94,84 C88,88 82,88 80,82 Z';
  const bob = 'M78,90 C76,58 100,40 124,40 C158,40 182,64 180,104 C178,132 174,152 168,164 L136,164 C140,142 140,120 134,104 C118,98 100,96 88,96 C82,96 78,94 78,90 Z';
  const H = `url(#${P}hair)`;
  switch(sp.hair){
    case 'bun':
      back.push(sdG(`<circle cx="170" cy="62" r="16" fill="${H}"/>`));
      front.push(sdG(`<path d="${cap}" fill="${H}"/><path d="M150,58 q12,10 16,30 M130,52 q16,8 22,26" fill="none" stroke-width="1.6" opacity=".45"/>`));
      break;
    case 'short':
      front.push(sdG(`<path d="${cap}" fill="${H}"/><path d="M128,98 L134,120 L142,100 Z" fill="${H}"/>`));
      break;
    case 'part':   // rẽ ngôi, mái hất lên
      front.push(sdG(`<path d="${cap}" fill="${H}"/><path d="M78,80 C74,62 90,48 112,48 C100,56 94,66 92,82 Z" fill="${H}"/><path d="M128,98 L134,120 L142,100 Z" fill="${H}"/>`));
      break;
    case 'bunTop':
      back.push(sdG(`<circle cx="150" cy="44" r="15" fill="${H}"/>`));
      front.push(sdG(`<path d="${cap}" fill="${H}"/><path d="M128,98 L134,118 L140,100 Z" fill="${H}"/>`));
      break;
    case 'bob':
      front.push(sdG(`<path d="${bob}" fill="${H}"/><path d="M150,70 q14,30 6,80 M128,60 q14,14 14,40" fill="none" stroke-width="1.6" opacity=".4"/>`));
      break;
    case 'long':
      back.push(sdG(`<path d="M150,108 C180,118 186,170 180,240 L148,240 C152,204 150,176 140,154 Z" fill="${H}"/>`));
      front.push(sdG(`<path d="${bob}" fill="${H}"/><path d="M150,70 q14,30 6,80" fill="none" stroke-width="1.6" opacity=".4"/>`));
      break;
    case 'bald':
      front.push(sdG(`<path d="M138,98 C154,92 172,100 174,114 C176,132 168,146 158,152 C154,136 148,120 140,112 Z" fill="${H}"/>`)
        + `<path d="M106,62 q10,-4 20,-2 M100,72 q12,-5 26,-2" fill="none" stroke="${SIDE_INK}" stroke-width="1.5" opacity=".35" stroke-linecap="round"/>`);
      break;
  }
  return {back: back.join(''), front: front.join('')};
}

function sideHat(h, P){
  if(!h) return '';
  switch(h.t){
    case 'conical':
      return `<path d="M98,92 Q96,140 112,166" fill="none" stroke="${SIDE_INK}" stroke-width="1.6" opacity=".7"/>`
        + sdG(`<path d="M38,88 L122,18 L206,88 Q122,100 38,88 Z" fill="url(#${P}straw)"/>`
        + `<path d="M122,20 L78,90 M122,20 L102,94 M122,20 L142,94 M122,20 L166,90 M62,74 Q122,82 182,74 M88,52 Q122,58 156,52" fill="none" stroke-width="1.4" opacity=".35"/>`, 2.8);
    case 'hardhat':
      return sdG(`<path d="M74,90 C72,54 96,36 124,36 C154,36 176,56 174,90 Z" fill="${h.c}"/>`
        + (h.stripe ? `<clipPath id="${P}dome"><path d="M74,90 C72,54 96,36 124,36 C154,36 176,56 174,90 Z"/></clipPath><path clip-path="url(#${P}dome)" d="M70,92 C68,50 96,32 124,32 C156,32 180,52 178,92" fill="none" stroke="${h.stripe}" stroke-width="18"/><path d="M74,90 C72,54 96,36 124,36 C154,36 176,56 174,90" fill="none"/>` : `<path d="M86,58 C100,44 140,40 160,56" fill="none" stroke-width="1.6" opacity=".4"/>`)
        + `<path d="M56,88 L178,88 Q183,96 174,98 L62,98 Q52,97 56,88 Z" fill="${h.b}"/>`
        + (h.goggles ? `<path d="M74,76 C110,66 150,68 176,82" fill="none" stroke-width="5"/><path d="M68,72 q2,-12 18,-12 q12,0 12,10 q-2,10 -14,10 q-14,0 -16,-8 z" fill="#bfdcdc"/><path d="M74,66 q6,-3 12,-2" fill="none" stroke="#fff" stroke-width="2"/>` : ''), 3);
    case 'cap':
      return sdG(`<path d="M164,80 L204,88 Q209,95 200,98 L166,94 Z" fill="${h.b}"/>`
        + `<path d="M78,86 C76,56 100,40 124,40 C152,40 172,58 172,86 Q124,78 78,86 Z" fill="${h.c}"/>`
        + `<circle cx="124" cy="41" r="4" fill="${h.b}"/><path d="M104,46 Q112,64 112,82 M144,46 Q140,64 142,80" fill="none" stroke-width="1.5" opacity=".4"/>`, 3);
    case 'chef':
      return sdG(`<path d="M86,62 C70,46 84,20 106,30 C112,6 146,8 148,30 C168,22 180,48 162,62 Z" fill="#fffef9"/>`
        + `<path d="M80,86 L84,58 L164,58 L170,86 Q124,78 80,86 Z" fill="#f4f0e4"/><path d="M110,34 q2,12 0,24 M136,32 q-2,12 0,26" fill="none" stroke-width="1.5" opacity=".35"/>`, 3);
    case 'kerchief': {
      const id = P + 'kdot';
      return `<defs><pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="${h.c}"/><circle cx="4" cy="4" r="1.8" fill="${h.dots}"/><circle cx="10" cy="10" r="1.8" fill="${h.dots}"/></pattern></defs>`
        + sdG(`<path d="M174,92 L194,94 L190,108 Z M174,94 L186,114 L172,114 Z" fill="${h.c}"/>`
        + `<path d="M76,92 C74,56 100,40 124,40 C158,40 180,62 180,96 C164,88 120,84 76,92 Z" fill="url(#${id})"/>`, 3);
    }
    case 'bandana':
      return sdG(`<path d="M172,82 L194,74 L192,88 Z M172,86 L190,100 L176,102 Z" fill="${h.c}"/>`
        + `<path d="M78,78 C108,62 150,62 176,78 L176,92 C150,78 110,78 80,92 Z" fill="${h.c}"/><path d="M96,76 h4 M120,70 h4 M146,72 h4" fill="none" stroke="#fff" stroke-width="2"/>`, 2.8);
    case 'bucket':
      return sdG(`<path d="M86,74 C88,48 104,38 124,38 C146,38 162,48 164,74 Z" fill="#b9c48c"/>`
        + `<path d="M87,64 Q124,56 163,64" fill="none" stroke="#6c7b45" stroke-width="5"/>`
        + `<path d="M60,80 Q124,62 188,80 Q192,88 184,90 Q124,74 66,90 Q56,88 60,80 Z" fill="#a3b075"/>`, 2.8);
  }
  return '';
}

// đồ thêm trên thân (vẽ sau thân áo, trước tay gần)
function sideAdd(a, P){
  const t = typeof a === 'string' ? a : a.t, c = a.c;
  switch(t){
    case 'bread':
      return sdG(`<g transform="rotate(-22 104 212)"><rect x="62" y="203" width="84" height="18" rx="9" fill="#e0a458"/><path d="M78,207 l6,9 M94,207 l6,9 M110,207 l6,9 M126,207 l6,9" fill="none" stroke-width="1.8" opacity=".7"/></g>`, 2.6);
    case 'buttons':
      return `<g fill="${SIDE_INK}" opacity=".7"><circle cx="88" cy="204" r="2.6"/><circle cx="84" cy="220" r="2.6"/></g>`;
    case 'scarf':
      return sdG(`<path d="M104,182 C98,192 90,204 82,214 L96,208 L104,220 C108,206 110,192 104,182 Z" fill="#d9463b"/>`, 2.6);
    case 'collar':
      return sdG(`<path d="M106,180 L94,196 L114,190 Z" fill="#fffef9"/>`, 2.4);
    case 'tie':
      return sdG(`<path d="M100,188 L92,196 L84,226 L88,236 L95,228 L102,196 Z" fill="${c}"/>`, 2.4);
    case 'necklace':
      return `<path d="M106,184 C100,194 96,202 92,208" fill="none" stroke="#d9a72c" stroke-width="2.6" stroke-dasharray="1 4" stroke-linecap="round"/>`
        + sdG(`<circle cx="91" cy="212" r="3.6" fill="#f2c94c"/>`, 1.6);
    case 'steth':
      return `<path d="M108,184 C96,198 90,214 96,230" fill="none" stroke="#5f6b78" stroke-width="3.2" stroke-linecap="round"/>`
        + sdG(`<circle cx="97" cy="232" r="5" fill="#c9ccd2"/>`, 2);
    case 'pens':
      return `<path d="M96,214 v-12 M101,214 v-9" stroke="#d9634f" stroke-width="3.2" stroke-linecap="round"/><path d="M101,214 v-9" stroke="#6f9ec9" stroke-width="3.2" stroke-linecap="round"/>`;
    case 'apron': {
      let fill = c, defs = '';
      if(c === 'caro'){ fill = `url(#${P}caro)`; defs = `<defs><pattern id="${P}caro" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff6ea"/><rect width="6" height="12" fill="#e8907d" opacity=".55"/><rect width="12" height="6" fill="#e8907d" opacity=".55"/></pattern></defs>`; }
      if(c === 'candy'){ fill = `url(#${P}candy)`; defs = `<defs><pattern id="${P}candy" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#fff6f4"/><rect width="4.5" height="10" fill="#e8907d" opacity=".75"/></pattern></defs>`; }
      const strap = c === 'caro' || c === 'candy' ? '#e8907d' : c;
      return defs + `<path d="M102,184 L114,208" fill="none" stroke="${strap}" stroke-width="5" stroke-linecap="round"/>`
        + sdG(`<path d="M80,206 L120,206 L122,300 L74,300 Z" fill="${fill}"/>`, 2.8);
    }
    case 'bib':
      return `<path d="M104,216 L118,190 L136,186" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`
        + sdG(`<path d="M80,214 L116,214 L118,300 L76,300 Z" fill="${c}"/><rect x="104" y="208" width="12" height="9" rx="2" fill="#c9ccd2"/>`, 2.6);
    case 'vest':
      return `<defs><clipPath id="${P}vclip"><path d="${SD.torso}"/></clipPath></defs>`
        + sdG(`<path d="M106,180 C92,186 84,196 98,222 L74,226 L74,300 L170,300 L168,226 C168,204 160,188 148,180 C134,188 122,188 106,180 Z" fill="${c}"/>`, 3)
        + (a.knit ? `<g clip-path="url(#${P}vclip)" stroke="#b98a35" stroke-width="1.4" opacity=".55">${[110, 122, 134, 146, 158].map(x => `<path d="M${x},190 v100"/>`).join('')}</g>` : '');
    case 'pocket':
      return sdG(`<path d="M84,232 h22 v-14 h-22 z M84,218 l11,6 l11,-6" fill="${c}"/>`, 2);
    case 'coat':   // áo khoác mở: lộ một dải áo trong ở ngực
      return sdG(`<path d="M106,180 C94,186 86,196 82,210 L80,300 L92,300 L94,214 C96,200 102,190 110,184 Z" fill="${c}"/><path d="M110,184 L98,214 L104,226" fill="none" stroke-width="2.2"/>`, 2.6);
    case 'lapel':
      return sdG(`<path d="M106,180 L94,204 L104,214" fill="none" stroke-width="2.2"/><path d="M106,180 L94,204 L104,214 Z" fill="${c}" opacity=".6" stroke="none"/>`, 2.2);
    case 'zip':
      return `<path d="M96,190 C86,204 82,222 80,300" fill="none" stroke="${c}" stroke-width="2.4" stroke-dasharray="3 3"/>`;
    case 'hivis':
      return sdG(`<path d="M76,206 L168,206 L168,215 L76,215 Z M75,224 L168,224 L168,233 L75,233 Z" fill="#e8ecef"/><path d="M104,182 L98,204" fill="none" stroke-width="2.2"/>`, 2);
    case 'harness':
      return `<path d="M98,186 C88,200 84,222 86,300 M96,190 L138,188" fill="none" stroke="#d9634f" stroke-width="6" stroke-linecap="round"/><path d="M98,186 C88,200 84,222 86,300" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>`
        + sdG(`<rect x="80" y="214" width="12" height="12" rx="2" fill="#c9ccd2"/>`, 2);
    case 'band':
      return sdG(`<path d="M76,212 L168,212 L168,221 L76,221 Z" fill="${c}"/>`, 2);
    case 'crossbag':
      return `<path d="M150,184 L92,222" fill="none" stroke="#8a6a3a" stroke-width="5" stroke-linecap="round"/>`
        + sdG(`<path d="M78,214 h30 v22 h-30 z" fill="${c}"/><path d="M78,214 h30 v8 h-30 z" fill="#c99a32"/>`, 2.4);
    case 'backpack':
      return sdG(`<path d="M156,196 Q158,184 172,186 L190,192 Q200,196 198,210 L194,262 Q190,272 178,268 L160,262 Z" fill="${c}"/><path d="M164,216 L192,222 L190,244 L162,238 Z" fill="#c99a32"/>`, 2.8)
        + `<path d="M150,184 C138,188 124,196 116,212" fill="none" stroke="#7d5c1e" stroke-width="5" stroke-linecap="round"/>`;
  }
  return '';
}
function sideArmAdd(a){
  if(a.t === 'armstripe') return `<path d="M128,192 C130,214 128,240 126,262" fill="none" stroke="${a.c}" stroke-width="5" stroke-linecap="round"/>`;
  return '';
}

// một con mắt nghiêng: chấm + mi / nếp nhăn hướng về phía sau đầu (bên phải); vui = vòng cung
function sideEye(i, P){
  const st = (typeof EYE_STYLE !== 'undefined' && EYE_STYLE[i]) || {r:3.8, k:1};
  const [x, y] = SD.eye, r = +(st.r*0.9).toFixed(2), ry = +(r*st.k*1.1).toFixed(2), ink = typeof EYE_INK !== 'undefined' ? EYE_INK : '#1f1812';
  const extra = [];
  if(st.lash) extra.push(`<path d="M${x + r + 0.5},${(y - ry*0.5).toFixed(1)} l4.5,-4" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`);
  if(st.lash > 1) extra.push(`<path d="M${(x + r*0.4).toFixed(1)},${(y - ry - 0.5).toFixed(1)} l3,-4.5" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`);
  if(st.crease) extra.push(`<path d="M${x + r + 3},${y + 1} l4,2 M${x + r + 3},${y + 3.5} l3.5,3" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>`);
  const open = `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="${ink}"/>` + extra.join('')
    + `<rect class="blinklid" x="${(x - r - 1.5).toFixed(1)}" y="${(y - ry - 1.5).toFixed(1)}" width="${(2*r + 3).toFixed(1)}" height="${(2*ry + 3).toFixed(1)}" rx="${r}" fill="url(#${P}skin)"/>`;
  const arc = `<path d="M${(x - r - 1).toFixed(1)},${y + 1} q${(r + 1).toFixed(1)},${-(r + 3.5).toFixed(1)} ${(2*r + 2).toFixed(1)},0" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>` + extra.join('');
  return `<g class="eyes2${st.smiley ? ' eo-smiley' : ''}"><g class="eo-open">${open}</g><g class="eo-arc">${arc}</g></g>`;
}

function sideFill(spec, P, key, def){
  if(spec === 'stripe') return {fill:`url(#${P}stripe)`, defs:`<pattern id="${P}stripe" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#f6f1e4"/><rect width="10" height="4.5" fill="#6f9ec9"/></pattern>`};
  if(spec === 'golddot') return {fill:`url(#${P}gold)`, defs:`<pattern id="${P}gold" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#d8645a"/><path d="M7,3 l2,4 l-2,4 l-2,-4z" fill="#f2c94c"/></pattern>`};
  const c = spec || def;
  return {fill:`url(#${P}${key})`, defs:`<linearGradient id="${P}${key}" x1="0" y1="0" x2="${key === 'arm' ? 1 : 0}" y2="${key === 'arm' ? 0 : 1}"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`};
}

const sideMemo = {};
// hình nghiêng của khách i (0..9, như custSVG), skin k
function sideArt(i, k){
  k = k || 0;
  const key = i + ':' + k;
  if(sideMemo[key]) return sideMemo[key];
  const hd = i + 1, sp = SIDE_LOOK[hd];
  if(!sp) return '';
  const lk = sp.looks[k] || sp.looks[0], P = `sd${hd}k${k}_`, sk = SD_SKIN[hd] || SD_SKIN[4], hc = sp.hc || SD_DARK;
  const body = sideFill(lk.body, P, 'body', ['#cccccc', '#aaaaaa']), arm = sideFill(lk.arm, P, 'arm', ['#bbbbbb', '#999999']);
  const defs = `<defs><radialGradient id="${P}skin" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="${sk[0]}"/><stop offset="62%" stop-color="${sk[1]}"/><stop offset="100%" stop-color="${sk[2]}"/></radialGradient>`
    + `<linearGradient id="${P}hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hc[0]}"/><stop offset="55%" stop-color="${hc[1]}"/><stop offset="100%" stop-color="${hc[2]}"/></linearGradient>`
    + `<linearGradient id="${P}straw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5d78a"/><stop offset="1" stop-color="#c99530"/></linearGradient>`
    + `<radialGradient id="${P}blush" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e88f72" stop-opacity=".55"/><stop offset="100%" stop-color="#e88f72" stop-opacity="0"/></radialGradient>`
    + body.defs + arm.defs + `</defs>`;
  const S = `url(#${P}skin)`, hair = sideHair(sp, P);
  // tóc đã bị mũ trùm: chỉ còn phần gáy / tóc dài sau lưng
  const hatHides = lk.hat && ['conical', 'hardhat', 'cap', 'chef', 'kerchief', 'bucket'].includes(lk.hat.t);
  const hairFront = hatHides && sp.hair !== 'long' && sp.hair !== 'bald'
    ? sdG(`<path d="M150,96 C164,104 172,118 166,140 C158,128 150,116 140,108 Z" fill="url(#${P}hair)"/>`)
    : hatHides && sp.hair === 'long' ? sdG(`<path d="M146,96 C170,100 180,130 172,164 L140,164 C142,140 140,116 134,104 Z" fill="url(#${P}hair)"/>`)
    : hair.front;
  const earFirst = sp.hair === 'bob' || sp.hair === 'long';   // tóc ngang vai che tai
  const ear = sdG(`<path d="${SD.ear}" fill="${S}"/><path d="M136,106 q7,3 5,12" fill="none" stroke-width="2"/>`)
    + (sp.hoop ? `<circle cx="140" cy="132" r="5.5" fill="none" stroke="${sp.hoop}" stroke-width="2.6"/>` : '');
  const face = []
    // má hồng, mũi đã nằm trong viền đầu; lông mày (tóc mái bob che mất)
    .concat(`<ellipse cx="100" cy="130" rx="11" ry="7" fill="url(#${P}blush)"/>`)
    .concat(sp.hair === 'bob' || sp.hair === 'long' ? [] : [`<path d="M84,90 q8,-5 18,-2" fill="none" stroke="${SIDE_INK}" stroke-width="${sp.hair === 'bald' ? 3.4 : 2.8}" stroke-linecap="round"${sp.hair === 'bald' ? ' opacity=".55"' : ''}/>`])
    .concat(sideEye(hd, P))
    .concat(sp.beard ? [sdG(`<path d="M146,124 C146,152 128,172 104,172 C92,172 84,166 82,156 L84,148 C92,154 104,156 118,150 C130,144 138,136 140,122 Z" fill="url(#${P}hair)"/><path d="M68,132 C72,138 82,140 87,134 C84,129 74,128 68,132 Z" fill="url(#${P}hair)"/>`, 2.4)] : [])
    .concat(sp.glasses ? [`<path d="M98,100 L134,104" fill="none" stroke="${SIDE_INK}" stroke-width="2.2"/>` + sdG(`<ellipse cx="88" cy="104" rx="10" ry="10" fill="#dbe6f0" fill-opacity=".35"/>`, 2.2)] : []);
  // miệng theo biểu cảm (dấu bực nằm trên đầu, phía sau)
  const mouthY = sp.beard ? 144 : 142;
  const mouth = `<g class="x-neutral"><path d="M82,${mouthY} q5,1.5 9,-1" fill="none" stroke="${SIDE_INK}" stroke-width="2.4" stroke-linecap="round"/></g>`
    + `<g class="x-happy"><path d="M80,${mouthY - 3} q4,9 13,2 q-1,-2 -3,-2 q-5,2 -10,0 z" fill="#a04a3c" stroke="${SIDE_INK}" stroke-width="2.2" stroke-linejoin="round"/></g>`
    + `<g class="x-annoy"><path d="M82,${mouthY + 2} q5,-3.5 10,0" fill="none" stroke="${SIDE_INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M178,54 l5,-9 l5,9 M190,60 l5,-9" fill="none" stroke="#d9634f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const extras = [];
  if(sp.bow && !hatHides) extras.push(sdG(`<path d="M134,84 l-9,-7 l0,15 z M134,84 l9,-7 l0,15 z" fill="${sp.bow}"/><circle cx="134" cy="84" r="3.4" fill="${sp.bow}"/>`, 2));
  if(sp.flower && !hatHides) extras.push(sdG(['M0,-7', 'M7,-2', 'M4,6', 'M-4,6', 'M-7,-2'].map(m => `<circle cx="${132 + +m.split(',')[0].slice(1)}" cy="${48 + +m.split(',')[1]}" r="5" fill="${sp.flower}"/>`).join('') + `<circle cx="132" cy="48" r="3" fill="#f2c94c"/>`, 1.8));
  const adds = (lk.add || []).map(a => sideAdd(a, P)).join(''), armAdds = (lk.armAdd || []).map(sideArmAdd).join('');
  const behind = (lk.add || []).some(a => a === 'bread');   // bánh mì kẹp nách: nằm dưới tay gần
  const art = (sp.hair === 'long' ? '' : hair.back)
    + sdG(`<path d="${SD.neck}" fill="${S}"/>`) + `<path d="M110,160 L109,176 Q124,184 144,172 L143,156 Z" fill="${SIDE_INK}" opacity=".12"/>`
    + sdG(`<path d="${SD.torso}" fill="${body.fill}"/>`, 3.2)
    + (behind ? '' : adds)
    + (sp.hair === 'long' ? hair.back : '')
    + (earFirst ? ear : '')
    + sdG(`<path d="${SD.head}" fill="${S}"/>`, 3.2)
    + `<path d="M78,110 q-4,10 -1,16" fill="none" stroke="${SIDE_INK}" stroke-width="1.6" opacity=".25" stroke-linecap="round"/>`
    + face.join('') + mouth
    + hairFront + (earFirst ? '' : ear) + extras.join('')
    + sideHat(lk.hat, P)
    + (behind ? adds : '')
    + `<g class="sarm">` + sdG(`<path d="${SD.arm}" fill="${arm.fill}"/>`, 3.2) + armAdds + sdG(`<path d="${SD.hand}" fill="${S}"/>`, 2.8) + `</g>`;
  // khung: cùng viewBox với hình thẳng; khuôn mặt hình thẳng của mọi khách nằm ở x 70..170, chỉ lệch vài px theo
  // chiều dọc (đo bằng getBBox) — dời cả hình cho khớp, lúc dừng lại đổi sang hình thẳng không bị giật
  const front = typeof HD_CHARS !== 'undefined' ? HD_CHARS[hd] : '', vb = (front.match(/viewBox="([^"]+)"/) || [, '0 0 200 280'])[1];
  const dy = SIDE_DY[hd] || 0, inner = dy ? `<g transform="translate(0,${dy})">${art}</g>` : art;
  return (sideMemo[key] = `<svg xmlns="http://www.w3.org/2000/svg" class="charsvg side" data-exp="neutral" viewBox="${vb}" overflow="visible">${defs}`
    + `<ellipse cx="122" cy="270" rx="60" ry="9" fill="${SIDE_INK}" opacity=".12"/>${inner}</svg>`);
}
function custSideSVG(i, exp, k){ return sideArt(i, k).replace('data-exp="neutral"', 'data-exp="' + exp + '"'); }
