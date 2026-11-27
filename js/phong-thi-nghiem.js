/* =====================================================================
   PHÒNG THÍ NGHIỆM — bàn phối cảnh, kéo–thả, động cơ phản ứng, điện phân, đốt trong lọ khí,
   an toàn, hiệu ứng trong cốc, khách hàng và chấm đơn.
   ===================================================================== */
'use strict';

/* =====================  LAB DAY  ===================== */
let lab = null;
const tot = obj => Object.values(obj).reduce((a,b)=>a+b,0);

/* =====================================================================
   BÀN PHỐI CẢNH. Mặt bàn là hình thang nông: mép xa hẹp & cao, mép gần rộng & thấp.
   Bàn được XẾP TRONG 3D trước (Blender/ban_lam_viec.py → LAYOUT3D trong do-hoa-3d.js): camera ở đó khớp
   đúng hình thang dưới đây, nên mỗi chỗ trên bàn 3D rơi đúng một điểm (x,y) màn hình, kèm ppm = số px
   cho 1 m ở chỗ ấy. Giữa bàn là THẢM LÀM VIỆC, dụng cụ cất hai bên; thứ gì lắp lên thảm được vẽ to x1.5.
   Hình dụng cụ là T3D (1 đơn vị viewBox = 1 mm), đặt theo một điểm neo của nó (đáy, miệng, vòng giá…).
   ===================================================================== */
const CX = 658;                        // tâm vùng bàn (336..980)
const FAR_Y = 430, NEAR_Y = 636;       // bàn nông: sâu ~200px
const FAR_H = 255, NEAR_H = 318;       // nửa bề rộng tương ứng
const yOf     = t => FAR_Y + (NEAR_Y - FAR_Y) * t;
const halfOf  = t => FAR_H + (NEAR_H - FAR_H) * t;
const xOf     = (u,t) => CX + u * halfOf(t);
const scaleOf = t => 0.82 + 0.22 * t;  // dải hẹp: hình & chữ ở xa vẫn rõ
const VP_Y    = FAR_Y - (FAR_H * (NEAR_Y - FAR_Y)) / (NEAR_H - FAR_H);   // điểm tụ
const L3 = LAYOUT3D, WORK = L3.size.tool;          // WORK: lắp lên thảm thì to thêm chừng này (x1.5)
const BKP = L3.beaker, BT = BKP.t;                 // chân cốc, giữa thảm
const KB = BKP.ppm / 1000 * L3.size.beaker;        // px / đơn vị T3D của cốc chính (cốc 400 mL)
const KW = BKP.ppm / 1000 * WORK;                  // … của dụng cụ lắp ngay tại cốc
const KH = BKP.ppm / 1000 * L3.size.hood;          // … của chuông thu khí (vừa miệng cốc)
const kAt = q => q.ppm / 1000 * WORK;              // … của khung / dụng cụ lắp ở chỗ q trên thảm
const zAt = y => 4 + Math.round((y - FAR_Y) / (NEAR_Y - FAR_Y) * 40);   // gần người hơn thì nằm trên
const ZB = zAt(BKP.y) + 4;                         // z của cốc; mọi bộ lắp xếp lớp quanh số này
// hộp màn hình (trái, trên, rộng, cao) của hình id khi điểm neo an của nó nằm ở (x,y), cỡ k px/đơn vị
const artBox = (id, an, x, y, k) => ({l: x - T3D[id].a[an][0]*k, t: y - T3D[id].a[an][1]*k, w: T3D[id].w*k, h: T3D[id].h*k});
// điểm neo an của hình id trên màn hình, khi hình nằm trong hộp b
const anchorIn = (id, an, b) => ({x: b.l + T3D[id].a[an][0]*b.w/T3D[id].w, y: b.t + T3D[id].a[an][1]*b.h/T3D[id].h});
const boxCss = b => 'left:'+b.l.toFixed(1)+'px;top:'+b.t.toFixed(1)+'px;width:'+b.w.toFixed(1)+'px;height:'+b.h.toFixed(1)+'px;';
// đun thì cốc được nhấc đặt lên lưới kiềng: đúng chiều cao lưới của kiềng (kiềng cũng vẽ x1.5)
const LIFT = (T3D['sym-tripod'].a.base[1] - T3D['sym-tripod'].a.gauze[1]) * KW;
const SIDE = 0.8;   // đồ đặt ngoài thảm làm việc vẽ nhỏ đi 20% cho đỡ rối mắt; lên thảm thì to bằng bộ lắp
// px trên 1 m tại một độ sâu y của bàn: phối cảnh nên tăng tuyến tính theo y (nội suy giữa cốc và chỗ cất đũa)
const ppmAt = y => { const a = L3.beaker, b = L3.slots.rod; return a.ppm + (y - a.y) * (b.ppm - a.ppm) / (b.y - a.y); };
/* Chỗ cốc đang đứng: giữa thảm; chỗ người chơi kéo cốc ra đặt ngoài thảm (lab.bkPark); hay — lúc đèn cồn vào
   giữa thảm hơ muôi — chỗ cất của đèn (ĐỔI CHỖ). Ngoài thảm thì cốc vẽ cỡ như đồ đang cất. */
const beakerSpot = () => {
  const p = lab && (lab.bkPark || (lab.lampUnder && L3.slots.heat));
  return p ? {x: p.x, y: p.y, k: ppmAt(p.y) / 1000 * L3.size.beaker / WORK * SIDE, away: true} : {x: BKP.x, y: BKP.y, k: KB, away: false};
};
const beakerBoxAt = lifted => { const s = beakerSpot(); return artBox('sym-beaker', 'base', s.x, s.y - (lifted && !s.away ? LIFT : 0), s.k); };
// một điểm (vx,vy) trong viewBox của cốc → màn hình, tính cả lúc cốc đang nằm trên kiềng hay đang đổi chỗ
const beakerPt = (vx, vy) => { const b = beakerBoxAt(lab && lab.heaterOn), k = b.w / BK.w; return {x: b.l + vx*k, y: b.t + vy*k}; };
// điểm (x,y) có nằm trên thảm làm việc không
const inMat = (x, y) => { const q = L3.mat; let w = false;
  for(let i = 0, j = q.length - 1; i < q.length; j = i++)
    if((q[i][1] > y) !== (q[j][1] > y) && x < q[i][0] + (y - q[i][1]) * (q[j][0] - q[i][0]) / (q[j][1] - q[i][1])) w = !w;
  return w; };
let TOOLPOS = {};                      // chỗ cất từng dụng cụ cạnh thảm: {x, y, k, z}

/* Dụng cụ là VẬT TRÊN BÀN, mỗi thứ một chỗ cất riêng ở hai bên thảm (L3.slots).
   symbol: dáng lúc dùng (lắp vào bộ, cầm trên tay); cat: dáng lúc cất; an: điểm neo của hình cất đặt
   đúng chỗ cất. "Khuấy" gộp đũa thuỷ tinh + nút thìa cũ — cả hai vốn làm đúng một việc. */
const TOOLBOX = {
  rod:    {label:'Đũa khuấy', symbol:'sym-stirrod',   cat:'sym-stirrod-cat',   drag:'rod',    shw:0.4},
  heat:   {label:'Đèn cồn',   symbol:'sym-lamp',      cat:'sym-lamp-cat',      drag:'lamp',   dz:'flame'},
  burn:   {label:'Muôi đốt',  symbol:'sym-burnspoon', cat:'sym-burnspoon-cat', drag:'ladle',  dz:'ladle', shw:0.4},
  elec:   {label:'Bộ điện phân', symbol:'sym-electro',   cat:'sym-electro-cat',   drag:'elec'},
  gas:    {label:'Bình thu khí', symbol:'sym-gasbottle', cat:'sym-gasbottle', an:'bottom', drag:'gas', style:'--gasop:0;--stopop:0'},
  filter: {label:'Phễu lọc',  symbol:'sym-funnel',    cat:'sym-funnel-cat',    drag:'funnel', dz:'funnel'}   // kéo cốc lên phễu = lọc
  // 'spoon' của ngày cũ đã gộp vào rod; bồn rửa là trạm riêng, không nằm trên bàn.
  // Muôi đốt và bộ điện phân CHUNG một chỗ cất (giữa bên trái): chưa ngày nào dùng cả hai.
};
const TOOL_ORDER = ['heat','burn','elec','gas','filter'];

/* mặt bàn + mặt trước, thớ gỗ hội tụ về điểm tụ. Bàn kéo dài sang trái để khách đứng sau mép xa ở cột bên trái nhận
   hàng trên khay (TRAY_SVG). Cạnh trái cũng chụm về điểm tụ như cạnh phải; góc sau bên trái nằm BENCH_FAR_L px tính từ
   mép trái màn (−BX) — ngay dưới vai trái khách — nên góc trước rơi ra ngoài mép màn một chút, cạnh trái vẫn thấy.
   BX đổi khi đổi cỡ cửa sổ: fit() vẽ lại bàn. */
const BENCH_FAR_L = -16;
/* Bàn thí nghiệm có chiều sâu.
   Ánh sáng: đèn trần phía trước–trên–trái (cùng hướng bóng của dụng cụ).
   · Mặt bàn lát ván gỗ ngang theo phối cảnh + vân gỗ uốn lượn & mắt gỗ nhẹ; mép trước bo tròn có đường sáng.
   · Gầm bàn chia khoang, mỗi khoang một kiểu: tủ cánh bên trái, một cột ngăn kéo, HỐC BÀN ngay dưới thảm làm việc
     (chỗ để chân, tối sâu, thấy hai vách trong), và một ngăn tủ để ngỏ bên phải có kệ, sách, hộp, lọ. */
function benchSVG(){
  const f = (NEAR_Y - FAR_Y) / (NEAR_Y - VP_Y);
  const xl0 = BENCH_FAR_L - BX, xr0 = xOf(1,0), xl1 = (xl0 - CX*f) / (1 - f), xr1 = xOf(1,1);
  const top = xl0+','+FAR_Y+' '+xr0+','+FAR_Y+' '+xr1+','+NEAR_Y+' '+xl1+','+NEAR_Y;
  // mặt bàn: các tấm ván gỗ ngang theo phối cảnh + vân gỗ uốn lượn + mắt gỗ nhẹ
  const GX0 = -480, GX1 = 1400, GSTEP = 230;
  const plankTs = [0, 0.22, 0.46, 0.72, 1.0];
  let grain = '';
  const grainPath = (y0, amp, phase, sw, op, col) => {
    let d = 'M' + GX0 + ',' + y0.toFixed(1);
    for(let x = GX0, i = 0; x < GX1; x += GSTEP, i++){
      const s = ((i + phase) % 2 ? 1 : -1) * amp;
      d += ' Q' + (x + GSTEP*0.5) + ',' + (y0 + s).toFixed(1) + ' ' + (x + GSTEP) + ',' + y0.toFixed(1);
    }
    return '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+sw+'" stroke-linecap="round" opacity="'+op+'"/>';
  };
  for(let p = 0; p < plankTs.length - 1; p++){
    const t0 = plankTs[p], t1 = plankTs[p + 1];
    const yTop = yOf(t0), yBot = yOf(t1), h = yBot - yTop;
    grain += '<rect x="'+GX0+'" y="'+yTop.toFixed(1)+'" width="'+(GX1 - GX0)+'" height="'+h.toFixed(1)+'" fill="'+(p % 2 ? '#f3cf9c' : '#b57f45')+'" opacity="'+(p % 2 ? '.065' : '.075')+'"/>';
    const sw = (1.05 + p * 0.22).toFixed(2);
    [0.24, 0.52, 0.78].forEach((r, gi) => {
      grain += grainPath(yTop + h * r, 2.2 + p * 0.75 + gi * 0.4, p + gi, sw, (0.14 + gi * 0.025).toFixed(2), '#754d26');
    });
    grain += grainPath(yTop + h * 0.38, 2.0 + p * 0.6, p + 1, '1.1', '.14', '#f7daaa');
    if(p > 0){
      grain += '<line x1="'+GX0+'" y1="'+yTop.toFixed(1)+'" x2="'+GX1+'" y2="'+yTop.toFixed(1)+'" stroke="#6e4b28" stroke-width="1.5" opacity=".22"/>'
            +  '<line x1="'+GX0+'" y1="'+(yTop + 1.4).toFixed(1)+'" x2="'+GX1+'" y2="'+(yTop + 1.4).toFixed(1)+'" stroke="#fbe2b8" stroke-width="1.1" opacity=".26"/>';
    }
  }
  // vài mắt gỗ dẹt theo góc nhìn nghiêng ở hai bên thảm
  [[195, 0.35, 22, 2.8], [398, 0.61, 18, 2.4], [468, 0.14, 15, 1.9], [858, 0.36, 17, 2.3], [888, 0.84, 21, 2.9]].forEach(([kx, kt, rx, ry]) => {
    const ky = yOf(kt);
    grain += '<g opacity=".17">'
          +    '<ellipse cx="'+kx+'" cy="'+ky.toFixed(1)+'" rx="'+(rx*0.42).toFixed(1)+'" ry="'+(ry*0.52).toFixed(1)+'" fill="#754d26"/>'
          +    '<ellipse cx="'+kx+'" cy="'+ky.toFixed(1)+'" rx="'+rx+'" ry="'+ry.toFixed(1)+'" fill="none" stroke="#754d26" stroke-width="1.2"/>'
          +    '<path d="M'+(kx-rx*1.55).toFixed(1)+','+ky.toFixed(1)+' Q'+kx+','+(ky-ry*1.9).toFixed(1)+' '+(kx+rx*1.55).toFixed(1)+','+ky.toFixed(1)+'" fill="none" stroke="#754d26" stroke-width="1.1"/>'
          +  '</g>';
  });

  // ---- gầm bàn ----
  const LIP = NEAR_Y + 15, RAIL = LIP + 8, BOT = 1600, G2 = 9;     // mép bàn, nẹp ngang dưới mép, đáy: kéo sâu xuống cho màn cao hơn 16:9 (#screen cắt phần thừa)
  const mat = L3.mat.filter(p => p[1] > (FAR_Y + NEAR_Y)/2).map(p => p[0]);
  const hx0 = Math.min(...mat) + 4, hx1 = Math.max(...mat) - 4;   // hốc bàn: đúng bề ngang thảm làm việc
  // panel gỗ có gờ: sáng ở cạnh trên–trái, tối ở cạnh dưới–phải (viền cùng tông)
  const panel = (x, y, w, h, fill = 'url(#bdrawer)') => {
    const st = fill === 'url(#bdoorin)' ? '#745332' : '#7e5c3a';
    return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+fill+'" stroke="'+st+'" stroke-width="2"/>'
      + '<path d="M'+(x+2.5)+','+(y+h-2)+' L'+(x+2.5)+','+(y+2.5)+' L'+(x+w-2)+','+(y+2.5)+'" fill="none" stroke="#e3bd88" stroke-width="2" opacity=".7"/>'
      + '<path d="M'+(x+w-2.5)+','+(y+3)+' L'+(x+w-2.5)+','+(y+h-2.5)+' L'+(x+3)+','+(y+h-2.5)+'" fill="none" stroke="#5e4126" stroke-width="2" opacity=".55"/>';
  };
  const pull = (cx, y, w = 34) => '<rect x="'+(cx - w/2 + 2)+'" y="'+(y + 3)+'" width="'+w+'" height="7" rx="3.5" fill="#00000040"/>'
    + '<rect x="'+(cx - w/2)+'" y="'+y+'" width="'+w+'" height="7" rx="3.5" fill="url(#bbrass)" stroke="#a7863a" stroke-width="1.4"/>';
  const knob = (cx, cy) => '<circle cx="'+(cx + 2)+'" cy="'+(cy + 3)+'" r="5" fill="#00000040"/>'
    + '<circle cx="'+cx+'" cy="'+cy+'" r="5" fill="url(#bbrass)" stroke="#a7863a" stroke-width="1.4"/><circle cx="'+(cx - 1.5)+'" cy="'+(cy - 1.5)+'" r="1.5" fill="#fff6d0"/>';
  let under = '';
  // cột ngăn kéo sát bên trái hốc bàn
  const dw = 132, dx = hx0 - G2 - dw;
  for(let y = RAIL + 2; y < BOT - 64; y += 68){ under += panel(dx, y, dw, 64) + pull(dx + dw/2, y + 16); }   // ngăn cao 64: hai ngăn cũ gộp một
  // tủ cánh: phần còn lại bên trái, chia cánh rộng chừng 190 px, núm lùi vào trong cánh
  const lx0 = xl1 + G2, lx1 = dx - G2, nd = Math.max(1, Math.round((lx1 - lx0) / 190)), dWd = (lx1 - lx0 - G2*(nd - 1)) / nd;
  for(let i = 0; i < nd; i++){
    const x = lx0 + i*(dWd + G2);
    under += panel(x, RAIL + 2, dWd, BOT) + panel(x + 12, RAIL + 14, dWd - 24, BOT, 'url(#bdoorin)') + knob(i % 2 ? x + 26 : x + dWd - 26, RAIL + 42);
  }
  // hốc bàn: tối sâu, thấy hai vách trong chụm vào giữa và vách sau sáng hơn chút
  const hd = 16;   // độ sâu nhìn thấy của vách trong
  under += '<rect x="'+hx0+'" y="'+RAIL+'" width="'+(hx1 - hx0)+'" height="'+(BOT - RAIL)+'" fill="url(#bhole)"/>'
    + '<polygon points="'+hx0+','+RAIL+' '+(hx0 + hd)+','+(RAIL + 8)+' '+(hx0 + hd)+','+BOT+' '+hx0+','+BOT+'" fill="#6e4c2b" opacity=".85"/>'
    + '<polygon points="'+hx1+','+RAIL+' '+(hx1 - hd)+','+(RAIL + 8)+' '+(hx1 - hd)+','+BOT+' '+hx1+','+BOT+'" fill="#4a3420" opacity=".85"/>'
    + '<rect x="'+(hx0 + hd)+'" y="'+(RAIL + 8)+'" width="'+(hx1 - hx0 - 2*hd)+'" height="'+(BOT - RAIL)+'" fill="url(#bholeback)"/>'
    + '<path d="M'+hx0+','+BOT+' L'+hx0+','+RAIL+' L'+hx1+','+RAIL+' L'+hx1+','+BOT+'" fill="none" stroke="#4a3420" stroke-width="2.5"/>';
  // ngăn tủ để ngỏ bên phải: khung, lòng tủ có bóng, một tầng kệ với sách, hộp, lọ
  const ox0 = hx1 + G2, ox1 = xr1 - G2, ow = ox1 - ox0, SH = RAIL + 44;
  const books = [['#c4553f', '#9b4332', 10, 30], ['#5f8fbf', '#4b7197', 8, 27], ['#7aa95c', '#608649', 12, 32], ['#e8b84b', '#b7913b', 9, 25]];
  let shelfItems = '', bx = ox0 + 14;
  books.forEach(([c, st, w, h], k) => {
    const lean = k === 3 ? ' transform="rotate(14 '+(bx + w)+' '+SH+')"' : '';
    shelfItems += '<rect x="'+bx+'" y="'+(SH - h)+'" width="'+w+'" height="'+h+'" rx="1.5" fill="'+c+'" stroke="'+st+'" stroke-width="1.4"'+lean+'/>'
      + '<line x1="'+(bx + 2)+'" y1="'+(SH - h + 6)+'" x2="'+(bx + w - 2)+'" y2="'+(SH - h + 6)+'" stroke="#fff6d8" stroke-width="1.2" opacity=".7"'+lean+'/>';
    bx += w + 1;
  });
  const boxX = ox0 + ow*0.48;
  shelfItems += '<rect x="'+boxX+'" y="'+(SH - 20)+'" width="40" height="20" rx="2" fill="#d8c29a" stroke="#ab997a" stroke-width="1.4"/>'
    + '<rect x="'+(boxX + 12)+'" y="'+(SH - 15)+'" width="16" height="8" fill="#fffdf5" stroke="#c9c8c2" stroke-width="1"/>'
    + '<path d="M'+(ox1 - 30)+','+SH+' L'+(ox1 - 30)+','+(SH - 18)+' Q'+(ox1 - 30)+','+(SH - 24)+' '+(ox1 - 25)+','+(SH - 26)+' L'+(ox1 - 25)+','+(SH - 32)+' L'+(ox1 - 17)+','+(SH - 32)+' L'+(ox1 - 17)+','+(SH - 26)+' Q'+(ox1 - 12)+','+(SH - 24)+' '+(ox1 - 12)+','+(SH - 18)+' L'+(ox1 - 12)+','+SH+' Z" fill="#e6f2f4" stroke="#b6bfc1" stroke-width="1.4"/>'
    + '<rect x="'+(ox1 - 29)+'" y="'+(SH - 12)+'" width="16" height="11" fill="#9fd3e6" opacity=".8"/>';
  under += '<rect x="'+ox0+'" y="'+RAIL+'" width="'+ow+'" height="'+(BOT - RAIL)+'" fill="url(#bopen)" stroke="#6d4d2c" stroke-width="2.5"/>'
    + '<rect x="'+ox0+'" y="'+RAIL+'" width="'+ow+'" height="12" fill="url(#bunder)"/>'
    + shelfItems
    + '<rect x="'+ox0+'" y="'+SH+'" width="'+ow+'" height="7" fill="url(#blip)" stroke="#926f48" stroke-width="1.6"/>'
    + '<rect x="'+ox0+'" y="'+(SH + 7)+'" width="'+ow+'" height="10" fill="url(#bunder)"/>'
    // các tầng kệ trống bên dưới, cách đều, tới tận đáy
    + Array.from({length: Math.floor((BOT - SH) / 74)}, (_, k) => SH + 74*(k + 1)).map(y =>
        '<rect x="'+ox0+'" y="'+y+'" width="'+ow+'" height="7" fill="url(#blip)" stroke="#926f48" stroke-width="1.6"/>'
      + '<rect x="'+ox0+'" y="'+(y + 7)+'" width="'+ow+'" height="10" fill="url(#bunder)"/>').join('');

  return '<svg id="benchsvg" viewBox="0 0 1280 720" overflow="visible">'
    + '<defs>'
    +   '<linearGradient id="btop" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#d8ac77"/><stop offset="100%" stop-color="#b8874f"/></linearGradient>'
    +   '<linearGradient id="blip" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e9c08a"/><stop offset="35%" stop-color="#b98d5b"/><stop offset="100%" stop-color="#7a5430"/></linearGradient>'
    +   '<linearGradient id="bfront" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#8a6238"/><stop offset="100%" stop-color="#5e4126"/></linearGradient>'
    +   '<linearGradient id="bunder" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#1e140a" stop-opacity=".55"/><stop offset="100%" stop-color="#1e140a" stop-opacity="0"/></linearGradient>'
    +   '<linearGradient id="bdrawer" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#b48655"/><stop offset="60%" stop-color="#a0754a"/><stop offset="100%" stop-color="#8a6238"/></linearGradient>'
    +   '<linearGradient id="bdoorin" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#a77b4c"/><stop offset="100%" stop-color="#93693f"/></linearGradient>'
    +   '<linearGradient id="bhole" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#1e140a"/><stop offset="100%" stop-color="#3a2817"/></linearGradient>'
    +   '<linearGradient id="bholeback" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#2a1c0f"/><stop offset="100%" stop-color="#4a3420"/></linearGradient>'
    +   '<linearGradient id="bopen" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#6e4c2b"/><stop offset="100%" stop-color="#8a6238"/></linearGradient>'
    +   '<linearGradient id="bbrass" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#f3d98b"/><stop offset="55%" stop-color="#d4a94a"/><stop offset="100%" stop-color="#9c7426"/></linearGradient>'
    +   '<clipPath id="btopclip"><polygon points="'+top+'"/></clipPath>'
    + '</defs>'
    // gầm bàn: nền khung, các khoang, nẹp ngang ngay dưới mép bàn
    + '<path d="M'+xl1+','+NEAR_Y+' L'+xr1+','+NEAR_Y+' L'+xr1+','+BOT+' L'+xl1+','+BOT+' Z" fill="url(#bfront)"/>'
    + under
    + '<rect x="'+xl1+'" y="'+LIP+'" width="'+(xr1 - xl1)+'" height="'+(RAIL - LIP)+'" fill="#8a6238" stroke="#6d4d2c" stroke-width="2"/>'
    + '<rect x="'+xl1+'" y="'+RAIL+'" width="'+(xr1 - xl1)+'" height="7" fill="url(#bunder)" opacity=".7"/>'
    // mặt bàn: vân gỗ ghép theo phối cảnh
    + '<polygon points="'+top+'" fill="url(#btop)"/>'
    + '<g clip-path="url(#btopclip)">' + grain + '</g>'
    // mép trước bo tròn: dải cạnh dày + đường sáng ngay mép
    + '<path d="M'+xl1+','+NEAR_Y+' L'+xr1+','+NEAR_Y+' L'+xr1+','+LIP+' L'+xl1+','+LIP+' Z" fill="url(#blip)"/>'
    + '<line x1="'+(xl1+2)+'" y1="'+(NEAR_Y+2.5)+'" x2="'+(xr1-2)+'" y2="'+(NEAR_Y+2.5)+'" stroke="#fbe2b8" stroke-width="2" opacity=".85"/>'
    // cạnh phải bàn: thấy chút bề dày
    + '<polygon points="'+xr0+','+FAR_Y+' '+(xr0+3)+','+(FAR_Y+8)+' '+(xr1+4)+','+LIP+' '+xr1+','+LIP+' '+xr1+','+NEAR_Y+'" fill="#7a5430"/>'
    // viền mặt bàn cùng tông gỗ
    + '<g stroke="#94683b" stroke-width="2.4" stroke-linecap="round">'
    +   '<line x1="'+xl0+'" y1="'+FAR_Y+'" x2="'+xr0+'" y2="'+FAR_Y+'"/>'
    +   '<line x1="'+xl0+'" y1="'+FAR_Y+'" x2="'+xl1+'" y2="'+NEAR_Y+'"/>'
    +   '<line x1="'+xr0+'" y1="'+FAR_Y+'" x2="'+xr1+'" y2="'+NEAR_Y+'"/>'
    +   '<line x1="'+xl1+'" y1="'+NEAR_Y+'" x2="'+xr1+'" y2="'+NEAR_Y+'"/>'
    +   '<line x1="'+xl1+'" y1="'+LIP+'" x2="'+(xr1+4)+'" y2="'+LIP+'" stroke-width="3"/>'
    + '</g>'
    + matSVG()
    + '</svg>';
}

function matSVG(){
  const q = L3.mat, c = q.reduce((a, p) => [a[0] + p[0]/4, a[1] + p[1]/4], [0, 0]);
  const pts = k => q.map(p => (p[0] + (c[0] - p[0])*k).toFixed(1) + ',' + (p[1] + (c[1] - p[1])*k*1.6).toFixed(1)).join(' ');
  return '<polygon points="' + pts(0) + '" fill="#5fa9a6" stroke="#4b8683" stroke-width="3" stroke-linejoin="round"/>'
       + '<polygon points="' + pts(0.055) + '" fill="#eef4f0" stroke="#8ec2bf" stroke-width="2" stroke-linejoin="round"/>';
}

/* Quầy đá bồn rửa bên phải (#sinkcountersvg), ghép khít cạnh phải #benchsvg (913,430 -> 976,636) */
function sinkCounterSVG(){
  const xl0 = 915, xr0 = 1700, xl1 = 978, xr1 = 1700;
  const fy = 430, ny = 636, lip = 651, rail = 659, bot = 1600;
  const topPts = `${xl0},${fy} ${xr0},${fy} ${xr1},${ny} ${xl1},${ny}`;
  const dx1 = 986, dw = 136, gap = 8, dx2 = dx1 + dw + gap;
  const door = (x, w, knobX) => ''
    + '<rect x="'+x+'" y="'+(rail+2)+'" width="'+w+'" height="'+bot+'" rx="3" fill="url(#psc-drawer)" stroke="#7d5b3a" stroke-width="2"/>'
    + '<path d="M'+(x+2.5)+','+(rail+300)+' L'+(x+2.5)+','+(rail+4.5)+' L'+(x+w-2)+','+(rail+4.5)+'" fill="none" stroke="#e3bd88" stroke-width="2" opacity=".7"/>'
    + '<rect x="'+(x+11)+'" y="'+(rail+13)+'" width="'+(w-22)+'" height="'+bot+'" rx="3" fill="url(#psc-doorin)" stroke="#735231" stroke-width="2"/>'
    + '<circle cx="'+(knobX+2)+'" cy="'+(rail+43)+'" r="4.5" fill="#00000040"/>'
    + '<circle cx="'+knobX+'" cy="'+(rail+40)+'" r="4.5" fill="url(#psc-brass)" stroke="#a5843a" stroke-width="1.4"/>'
    + '<circle cx="'+(knobX-1.4)+'" cy="'+(rail+38.6)+'" r="1.4" fill="#fff6d0"/>';

  return '<svg id="sinkcountersvg" viewBox="0 0 1280 720" overflow="visible" aria-hidden="true">'
    + '<defs>'
    +   '<linearGradient id="psc-top" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e8eceb"/><stop offset="100%" stop-color="#d2d9db"/></linearGradient>'
    +   '<linearGradient id="psc-lip" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#eef2f3"/><stop offset="40%" stop-color="#bec8cb"/><stop offset="100%" stop-color="#8c999f"/></linearGradient>'
    +   '<linearGradient id="psc-front" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#8a6238"/><stop offset="100%" stop-color="#5e4126"/></linearGradient>'
    +   '<linearGradient id="psc-drawer" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#b48655"/><stop offset="60%" stop-color="#a0754a"/><stop offset="100%" stop-color="#8a6238"/></linearGradient>'
    +   '<linearGradient id="psc-doorin" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#a77b4c"/><stop offset="100%" stop-color="#93693f"/></linearGradient>'
    +   '<linearGradient id="psc-under" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#1e140a" stop-opacity=".55"/><stop offset="100%" stop-color="#1e140a" stop-opacity="0"/></linearGradient>'
    +   '<linearGradient id="psc-brass" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#f3d98b"/><stop offset="55%" stop-color="#d4a94a"/><stop offset="100%" stop-color="#9c7426"/></linearGradient>'
    + '</defs>'
    + '<rect x="'+xl1+'" y="'+ny+'" width="'+(xr1 - xl1)+'" height="'+(bot - ny)+'" fill="url(#psc-front)"/>'
    + door(dx1, dw, dx1 + dw - 24)
    + door(dx2, 220, dx2 + 24)
    + '<rect x="'+xl1+'" y="'+lip+'" width="'+(xr1 - xl1)+'" height="'+(rail - lip)+'" fill="#8a6238" stroke="#6c4c2c" stroke-width="2"/>'
    + '<rect x="'+xl1+'" y="'+rail+'" width="'+(xr1 - xl1)+'" height="7" fill="url(#psc-under)" opacity=".7"/>'
    + '<polygon points="'+topPts+'" fill="url(#psc-top)"/>'
    + '<polygon points="'+xl0+','+fy+' '+(xl0+10)+','+fy+' '+(xl1+12)+','+ny+' '+xl1+','+ny+'" fill="#3b3025" opacity=".08"/>'
    + '<rect x="'+xl0+'" y="'+fy+'" width="'+(xr0 - xl0)+'" height="8" fill="#3b3025" opacity=".06"/>'
    + '<rect x="'+xl1+'" y="'+ny+'" width="'+(xr1 - xl1)+'" height="'+(lip - ny)+'" fill="url(#psc-lip)"/>'
    + '<line x1="'+(xl1+2)+'" y1="'+(ny+2.5)+'" x2="'+xr1+'" y2="'+(ny+2.5)+'" stroke="#ffffff" stroke-width="2" opacity=".75"/>'
    + '<path class="psc-top-edge" d="M'+xr0+','+fy+' L'+xl0+','+fy+' L'+xl1+','+ny+' L'+xr1+','+ny+' M'+xl1+','+lip+' L'+xr1+','+lip+'" fill="none" stroke="#9ca8ad" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';
}

/* Tường bên trong quầy pha chế: tường sơn kem, ốp gỗ chân tường liền mạch, bảng ghim gỗ (giữa),
   mảng gạch men sau bồn rửa cạnh bàn bên phải (x = 966..1700), và sàn gỗ bên dưới. Toạ độ khớp .wall (y = 64). */
function wallBgSVG(){
  let ribs = '';
  for(let x = -400; x <= 1680; x += 48)
    ribs += '<line x1="'+x+'" y1="-360" x2="'+x+'" y2="278" stroke="#8a6238" stroke-width="1" opacity=".055"/>';
  let planks = '';
  for(let x = -408; x <= 1680; x += 36){
    planks += '<line x1="'+x+'" y1="279" x2="'+x+'" y2="366" stroke="#6e4c2b" stroke-width="1.3" opacity=".28"/>'
            + '<line x1="'+(x+1.5)+'" y1="279" x2="'+(x+1.5)+'" y2="366" stroke="#f7ddb0" stroke-width="1" opacity=".24"/>';
  }
  let tiles = '';
  for(let x = 982; x <= 1690; x += 17)
    tiles += '<line x1="'+x+'" y1="268" x2="'+x+'" y2="366" stroke="#8ca3a8" stroke-width="1" opacity=".38"/>';
  for(let y = 285; y < 366; y += 17)
    tiles += '<line x1="966" y1="'+y+'" x2="1700" y2="'+y+'" stroke="#8ca3a8" stroke-width="1" opacity=".38"/>';
  const corkDots = [
    [548,128,1.5],[572,140,1.2],[602,126,1.6],[638,136,1.3],[674,128,1.5],[706,138,1.2],
    [556,174,1.3],[592,188,1.6],[628,176,1.2],[662,190,1.5],[698,174,1.3],[718,196,1.5],
    [546,220,1.4],[584,230,1.2],[622,222,1.6],[658,232,1.3],[692,220,1.5],[716,232,1.2]
  ].map(([cx,cy,r]) => '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#8a6238" opacity=".25"/>').join('');
  const floorLines = [420, 480, 548, 624, 710, 806]
    .map(y => '<line x1="-420" y1="'+y+'" x2="1700" y2="'+y+'" stroke="#6e4c2b" stroke-width="1.4" opacity=".16"/>').join('');
  return '<svg class="wall-bg" viewBox="0 0 1280 720" overflow="visible" aria-hidden="true">'
    + '<defs>'
    +   '<linearGradient id="wbg-plaster" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#f5edd9"/><stop offset="65%" stop-color="#ede1c7"/><stop offset="100%" stop-color="#e5d6b8"/></linearGradient>'
    +   '<linearGradient id="wbg-wainscot" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#d5ad79"/><stop offset="55%" stop-color="#c49660"/><stop offset="100%" stop-color="#b2824c"/></linearGradient>'
    +   '<linearGradient id="wbg-rail" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e6c08a"/><stop offset="55%" stop-color="#b88953"/><stop offset="100%" stop-color="#8a6238"/></linearGradient>'
    +   '<linearGradient id="wbg-floor" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#cbb693"/><stop offset="100%" stop-color="#b59d78"/></linearGradient>'
    +   '<linearGradient id="wbg-tile" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#f5f3ea"/><stop offset="100%" stop-color="#e4eceb"/></linearGradient>'
    +   '<linearGradient id="wbg-depth" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#3b3025" stop-opacity="0"/><stop offset="100%" stop-color="#3b3025" stop-opacity=".1"/></linearGradient>'
    + '</defs>'
    // nền tường thạch cao ấm + vân dọc rất nhẹ
    + '<rect x="-420" y="-360" width="2120" height="726" fill="url(#wbg-plaster)"/>'
    + ribs
    // chân tường ốp gỗ + nẹp phào ngang
    + '<rect x="-420" y="278" width="2120" height="88" fill="url(#wbg-wainscot)"/>'
    + planks
    + '<rect x="-420" y="344" width="2120" height="22" fill="url(#wbg-depth)"/>'
    + '<line x1="-420" y1="366" x2="1700" y2="366" stroke="#946c42" stroke-width="2" opacity=".45"/>'
    // phào gỗ chạy ngang ở y = 268..279
    + '<rect x="-420" y="279" width="2120" height="7" fill="#3b3025" opacity=".12"/>'
    + '<rect x="-420" y="268" width="2120" height="11" fill="url(#wbg-rail)" stroke="#916c42" stroke-width="2.2"/>'
    + '<line x1="-420" y1="270" x2="1700" y2="270" stroke="#fbe3b8" stroke-width="1.5" opacity=".75"/>'
    // mảng gạch men sau bồn rửa cạnh bàn bên phải (mép trên bằng đúng phào gỗ y = 268)
    + '<rect x="966" y="268" width="734" height="98" rx="2" fill="url(#wbg-tile)" stroke="#b4baba" stroke-width="2"/>'
    + tiles
    + '<rect x="965" y="268" width="735" height="5" rx="1.5" fill="#dfe8ea" stroke="#b0b7b9" stroke-width="1.6"/>'
    // bảng ghim gỗ giữa tường (Vùng B: chỗ ghim Giấy cân bằng / Giấy nhớ)
    + '<rect x="529" y="112" width="212" height="144" rx="5" fill="#3b3025" opacity=".16"/>'
    + '<rect x="526" y="108" width="212" height="144" rx="5" fill="#b88852" stroke="#916b41" stroke-width="2.2"/>'
    + '<rect x="534" y="116" width="196" height="128" rx="2" fill="#d9b98a" stroke="#b69b74" stroke-width="1.4"/>'
    + corkDots
    + '<g opacity=".55">'
    +   '<rect x="702" y="124" width="22" height="22" rx="1.5" fill="#fff7d4" stroke="#d6cfb2" stroke-width="1" transform="rotate(4 713 135)"/>'
    +   '<circle cx="713" cy="126" r="2" fill="#d9634f" stroke="#ab4e3e" stroke-width=".8"/>'
    +   '<rect x="542" y="218" width="24" height="18" rx="1.5" fill="#eef4f0" stroke="#c8cdca" stroke-width="1" transform="rotate(-3 554 227)"/>'
    +   '<circle cx="554" cy="220" r="2" fill="#6f9ec9" stroke="#587d9f" stroke-width=".8"/>'
    + '</g>'
    // sàn nhà & len chân tường phía dưới
    + '<rect x="-420" y="366" width="2120" height="584" fill="url(#wbg-floor)"/>'
    + floorLines
    + '<rect x="-420" y="366" width="2120" height="16" fill="#8a6238" stroke="#6d4d2c" stroke-width="2"/>'
    + '</svg>';
}

/* Cảnh hành lang văn phòng bên ngoài cửa sổ quầy giao hàng (296×234): hành lang kín gọn sạch (không ghế chờ, không cửa sổ trời) —
   bên trái đặt chậu trầu bà lá xẻ trồng trong nhà trên kệ gỗ thấp; bên phải treo duy nhất một bảng task công việc. */
function counterWindowOutSVG(){
  const seams = [24, 54, 84, 114, 152, 188, 224, 258, 286]
    .map(x => '<line x1="'+x+'" y1="154" x2="'+x+'" y2="195" stroke="#a89f8d" stroke-width="1.1" opacity=".22"/>').join('');
  // mạch gạch lát hành lang hội tụ nhẹ về tâm xa (148, 115)
  const tileJoints = [34, 82, 132, 184, 236, 286].map(bx => {
    const tx = 148 + (bx - 148) * (203 - 115) / (234 - 115);
    return '<line x1="'+tx.toFixed(1)+'" y1="203" x2="'+bx+'" y2="234" stroke="#a89f8d" stroke-width="1.2" opacity=".28"/>';
  }).join('');
  return '<svg class="win-out-svg" viewBox="0 0 296 234" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
    + '<defs>'
    +   '<linearGradient id="wo-ceil" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e5dfd2"/><stop offset="100%" stop-color="#d5cebe"/></linearGradient>'
    +   '<linearGradient id="wo-wall" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e5e8df"/><stop offset="100%" stop-color="#d9dfd3"/></linearGradient>'
    +   '<linearGradient id="wo-dado" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#d3cbb9"/><stop offset="100%" stop-color="#c4ba9f"/></linearGradient>'
    +   '<linearGradient id="wo-floor" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#d8cebc"/><stop offset="100%" stop-color="#c6baa3"/></linearGradient>'
    +   '<linearGradient id="wo-ceramic" x1="0" y1="0" x2="1" y2="0">'
    +     '<stop offset="0%" stop-color="#f6f0e2"/><stop offset="55%" stop-color="#ebe1cb"/><stop offset="100%" stop-color="#d9cbb0"/></linearGradient>'
    +   '<linearGradient id="wo-pot" x1="0" y1="0" x2="1" y2="0">'
    +     '<stop offset="0%" stop-color="#d48661"/><stop offset="55%" stop-color="#b86845"/><stop offset="100%" stop-color="#964f33"/></linearGradient>'
    + '</defs>'
    // tường hành lang & trần
    + '<rect x="0" y="20" width="296" height="184" fill="url(#wo-wall)"/>'
    + '<rect x="0" y="0" width="296" height="22" fill="url(#wo-ceil)"/>'
    + '<rect x="-2" y="20" width="300" height="5" fill="#c7beaa" stroke="#9d9686" stroke-width="1.6"/>'
    // đèn trần hành lang + quầng sáng ấm dịu
    + '<ellipse cx="148" cy="46" rx="58" ry="30" fill="#fff7dc" opacity=".28"/>'
    + '<rect x="132" y="3" width="32" height="5" rx="2" fill="#8a6238" stroke="#6d4d2c" stroke-width="1.5"/>'
    + '<path d="M135,8 Q148,19 161,8 Z" fill="#fffaf0" stroke="#c9c6be" stroke-width="1.5"/>'
    // phần ốp chân tường hành lang + phào ngang + len chân tường
    + '<rect x="0" y="152" width="296" height="44" fill="url(#wo-dado)"/>'
    + seams
    + '<rect x="-2" y="148" width="300" height="6" fill="#c2b69c" stroke="#99907b" stroke-width="1.5"/>'
    + '<rect x="-2" y="195" width="300" height="9" fill="#9c7b56" stroke="#7b6144" stroke-width="1.6"/>'
    // duy nhất một bảng task công việc (3 cột thẻ việc) bên phải hành lang
    + '<g>'
    +   '<rect x="202" y="50" width="80" height="74" rx="3" fill="#3b3025" opacity=".12"/>'
    +   '<rect x="200" y="48" width="80" height="74" rx="3" fill="#b68c5c" stroke="#906f49" stroke-width="1.6"/>'
    +   '<rect x="205" y="53" width="70" height="64" rx="1.5" fill="#ede4ce" stroke="#8a6238" stroke-width="1"/>'
    +   '<rect x="208" y="56" width="64" height="7" rx="1" fill="#dcd1b6"/>'
    +   '<line x1="212" y1="59.5" x2="230" y2="59.5" stroke="#a89f8d" stroke-width="1.4" opacity=".6"/>'
    +   '<line x1="234" y1="59.5" x2="250" y2="59.5" stroke="#a89f8d" stroke-width="1.4" opacity=".45"/>'
    +   '<line x1="229" y1="65" x2="229" y2="114" stroke="#c4b89b" stroke-width="1" stroke-dasharray="2 2"/>'
    +   '<line x1="251" y1="65" x2="251" y2="114" stroke="#c4b89b" stroke-width="1" stroke-dasharray="2 2"/>'
    +   '<rect x="209" y="67" width="18" height="16" rx="1" fill="#f7e7b4" stroke="#cfc297" stroke-width=".9"/>'
    +   '<line x1="212" y1="73" x2="224" y2="73" stroke="#a89f8d" stroke-width="1.1" opacity=".65"/>'
    +   '<line x1="212" y1="77" x2="221" y2="77" stroke="#a89f8d" stroke-width="1" opacity=".45"/>'
    +   '<circle cx="218" cy="67" r="1.8" fill="#d9634f" stroke="#ab4e3e" stroke-width=".7"/>'
    +   '<rect x="209" y="87" width="18" height="17" rx="1" fill="#fffdf5" stroke="#d6d5ce" stroke-width=".9"/>'
    +   '<line x1="212" y1="93" x2="224" y2="93" stroke="#a89f8d" stroke-width="1.1" opacity=".6"/>'
    +   '<line x1="212" y1="97" x2="222" y2="97" stroke="#a89f8d" stroke-width="1" opacity=".4"/>'
    +   '<circle cx="218" cy="87" r="1.8" fill="#e8b84b" stroke="#b7913b" stroke-width=".7"/>'
    +   '<rect x="231" y="68" width="18" height="19" rx="1" fill="#dbe8ea" stroke="#b8c3c5" stroke-width=".9"/>'
    +   '<line x1="234" y1="74" x2="246" y2="74" stroke="#6f9ec9" stroke-width="1.2" opacity=".7"/>'
    +   '<line x1="234" y1="78" x2="244" y2="78" stroke="#a89f8d" stroke-width="1" opacity=".45"/>'
    +   '<line x1="234" y1="82" x2="245" y2="82" stroke="#a89f8d" stroke-width="1" opacity=".4"/>'
    +   '<circle cx="240" cy="68" r="1.8" fill="#6f9ec9" stroke="#587d9f" stroke-width=".7"/>'
    +   '<rect x="231" y="91" width="18" height="15" rx="1" fill="#fffdf5" stroke="#d6d5ce" stroke-width=".9"/>'
    +   '<line x1="234" y1="97" x2="246" y2="97" stroke="#a89f8d" stroke-width="1.1" opacity=".55"/>'
    +   '<circle cx="240" cy="91" r="1.8" fill="#d9634f" stroke="#ab4e3e" stroke-width=".7"/>'
    +   '<rect x="253" y="67" width="18" height="16" rx="1" fill="#d8ecd0" stroke="#b5c6af" stroke-width=".9"/>'
    +   '<path d="M256,75 L258.5,77.5 L264,72" fill="none" stroke="#5b8c47" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
    +   '<circle cx="262" cy="67" r="1.8" fill="#7aa95c" stroke="#608649" stroke-width=".7"/>'
    +   '<rect x="253" y="88" width="18" height="15" rx="1" fill="#fffdf5" stroke="#d6d5ce" stroke-width=".9"/>'
    +   '<path d="M256,95.5 L258.5,98 L264,92.5" fill="none" stroke="#5b8c47" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
    +   '<circle cx="262" cy="88" r="1.8" fill="#e8b84b" stroke="#b7913b" stroke-width=".7"/>'
    + '</g>'
    // nền gạch lát hành lang
    + '<rect x="-2" y="203" width="300" height="33" fill="url(#wo-floor)" stroke="#9c9381" stroke-width="1.6"/>'
    + '<line x1="-2" y1="218" x2="298" y2="218" stroke="#a89f8d" stroke-width="1.2" opacity=".32"/>'
    + tileJoints
    // chậu cây trầu bà lá xẻ (Monstera) trồng trong nhà trên kệ gỗ thấp bên trái
    + '<ellipse cx="55" cy="211" rx="28" ry="4.5" fill="#5e5140" opacity=".24"/>'
    + '<path d="M34,196 L40,196 L35,211 L29,211 Z" fill="#9c6e3d" stroke="#7b5730" stroke-width="1.5" stroke-linejoin="round"/>'
    + '<path d="M70,196 L76,196 L81,211 L75,211 Z" fill="#9c6e3d" stroke="#7b5730" stroke-width="1.5" stroke-linejoin="round"/>'
    + '<rect x="29" y="191" width="52" height="6" rx="2" fill="#b88852" stroke="#916b41" stroke-width="1.6"/>'
    // chậu gốm kem nhúng men đất nung ở đáy
    + '<path d="M32,155 Q55,152 78,155 L76,192 Q55,196 34,192 Z" fill="url(#wo-ceramic)" stroke="#bab2a0" stroke-width="1.8" stroke-linejoin="round"/>'
    + '<path d="M33.3,179 Q55,182 76.7,179 L76,192 Q55,196 34,192 Z" fill="url(#wo-pot)"/>'
    + '<ellipse cx="55" cy="155" rx="23" ry="4.6" fill="#e6dcc6" stroke="#b6ae9c" stroke-width="1.8"/>'
    + '<ellipse cx="55" cy="155" rx="19" ry="3.2" fill="#5c4330"/>'
    // cuống lá xanh mảnh vươn trực tiếp từ bầu đất
    + '<path d="M51,155 Q42,130 28,116 M54,154 Q46,118 40,86 M56,154 Q60,115 68,84 M58,155 Q72,132 86,118 M55,154 Q54,132 54,114" fill="none" stroke="#4d7a44" stroke-width="2.8" stroke-linecap="round"/>'
    // các lá trầu bà xẻ thuỳ xếp lớp tự nhiên
    + '<g>'
    +   '<path d="M44,104 C31,105 21,98 18,89 L30,89 L18,84 C18,75 24,69 31,66 L36,77 L34,64 C42,61 52,65 56,74 L46,81 L58,79 C60,90 54,102 44,104 Z" fill="#467342" stroke="#375b34" stroke-width="1.6" stroke-linejoin="round"/>'
    +   '<path d="M62,104 C54,99 50,89 53,79 L64,83 L55,73 C59,64 69,60 77,63 L72,76 L81,66 C88,70 91,78 90,87 L78,87 L89,92 C85,101 73,107 62,104 Z" fill="#467342" stroke="#375b34" stroke-width="1.6" stroke-linejoin="round"/>'
    +   '<path d="M43,120 C42,109 32,102 22,105 L28,116 L17,111 C11,118 11,129 17,136 L27,128 L19,140 C27,147 38,146 44,137 L34,130 L45,132 C46,127 45,123 43,120 Z" fill="#609654" stroke="#4c7742" stroke-width="1.6" stroke-linejoin="round"/>'
    +   '<path d="M66,118 C67,108 77,101 87,104 L81,115 L92,110 C98,117 98,128 92,135 L82,127 L90,139 C82,146 71,145 65,136 L75,129 L64,131 C63,126 64,122 66,118 Z" fill="#609654" stroke="#4c7742" stroke-width="1.6" stroke-linejoin="round"/>'
    +   '<path d="M54,104 C43,104 35,112 35,122 L46,122 L35,128 C37,138 45,144 54,146 C64,144 72,138 74,128 L63,122 L74,122 C74,112 66,104 54,104 Z" fill="#7cb267" stroke="#628d51" stroke-width="1.6" stroke-linejoin="round"/>'
    // gân lá sáng nhẹ giúp nhận diện rõ phiến lá trầu bà
    +   '<path d="M44,101 Q38,85 38,71 M63,101 Q69,85 73,70 M41,122 Q29,122 18,126 M68,120 Q80,120 91,124 M54,112 L54,139 M48,120 L54,124 L60,120 M47,131 L54,134 L61,131" fill="none" stroke="#b5de9c" stroke-width="1.2" stroke-linecap="round" opacity=".62"/>'
    + '</g>'
    + '</svg>';
}

/* Khung cửa sổ giao hàng nhìn từ trong quầy (nằm TRÊN nhân vật): hốc tường tạo chiều sâu, cửa kính trượt mở lên,
   biển treo "QUẦY GIAO HÀNG", bệ gỗ nhô ra có chuông gọi phục vụ nhỏ bên phải. */
function counterWindowFrameSVG(){
  return '<svg class="win-frame-svg" viewBox="0 0 340 310" overflow="visible" aria-hidden="true">'
    + '<defs>'
    +   '<linearGradient id="wf-woodV" x1="0" y1="0" x2="1" y2="0">'
    +     '<stop offset="0%" stop-color="#d5a76e"/><stop offset="50%" stop-color="#be8d55"/><stop offset="100%" stop-color="#a87a48"/></linearGradient>'
    +   '<linearGradient id="wf-woodH" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e1b881"/><stop offset="55%" stop-color="#bf8f57"/><stop offset="100%" stop-color="#9c6e3d"/></linearGradient>'
    +   '<linearGradient id="wf-sill" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#e7c18c"/><stop offset="100%" stop-color="#d1a166"/></linearGradient>'
    +   '<linearGradient id="wf-sillfront" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#ad7e4b"/><stop offset="100%" stop-color="#845c33"/></linearGradient>'
    +   '<linearGradient id="wf-brass" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#f5dc88"/><stop offset="55%" stop-color="#d4a94a"/><stop offset="100%" stop-color="#9e7424"/></linearGradient>'
    + '</defs>'
    // bóng đổ nhẹ của khung lên tường
    + '<path d="M11,46 H335 V294 H11 Z M25,60 V290 H321 V60 Z" fill="#3b3025" fill-rule="evenodd" opacity=".16"/>'
    // má hốc tường (chiều sâu ngăn cách trong quầy và hành lang) + rãnh trượt kính
    + '<rect x="22" y="56" width="8" height="230" fill="#8f6539" stroke="#71502d" stroke-width="1.6"/>'
    + '<line x1="26" y1="58" x2="26" y2="284" stroke="#75502c" stroke-width="1.6"/>'
    + '<rect x="310" y="56" width="8" height="230" fill="#ba8b56" stroke="#936e44" stroke-width="1.6"/>'
    + '<line x1="314" y1="58" x2="314" y2="284" stroke="#6e4c2b" stroke-width="1.6"/>'
    + '<rect x="22" y="56" width="296" height="7" fill="#3b3025" opacity=".3"/>'
    // cánh cửa kính đẩy lên cao (ở y = 56..87 → trên đầu mọi nhân vật)
    + '<rect x="28" y="56" width="284" height="24" fill="#d9eef3" fill-opacity=".22"/>'
    + '<path d="M46,77 L62,59 M56,77 L67,64 M206,77 L222,59 M216,77 L227,64" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".55"/>'
    + '<rect x="167" y="56" width="6" height="24" fill="#b88953" stroke="#916c42" stroke-width="1.6"/>'
    + '<rect x="24" y="78" width="292" height="9" rx="1.5" fill="url(#wf-woodH)" stroke="#977145" stroke-width="2"/>'
    + '<line x1="27" y1="80" x2="313" y2="80" stroke="#fbe3b8" stroke-width="1.2" opacity=".75"/>'
    + '<rect x="156" y="80" width="28" height="5" rx="2.5" fill="url(#wf-brass)" stroke="#a7863a" stroke-width="1.4"/>'
    // khung gỗ ngoài (rỗng giữa bằng evenodd) + đường ghép góc
    + '<path d="M8,42 H332 V290 H8 Z M22,56 V286 H318 V56 Z" fill="url(#wf-woodV)" fill-rule="evenodd" stroke="#966f43" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<path d="M8,42 L22,56 M332,42 L318,56" stroke="#8c6138" stroke-width="1.8" opacity=".45"/>'
    + '<path d="M21,285 V55 H319" fill="none" stroke="#fbe3b8" stroke-width="1.3" opacity=".55"/>'
    // phào đỉnh khung
    + '<rect x="2" y="37" width="336" height="10" rx="2" fill="url(#wf-woodH)" stroke="#977145" stroke-width="2.4"/>'
    + '<line x1="5" y1="39.5" x2="335" y2="39.5" stroke="#fbe3b8" stroke-width="1.3" opacity=".8"/>'
    // biển treo "QUẦY GIAO HÀNG"
    + '<line x1="112" y1="0" x2="112" y2="10" stroke="#7a5632" stroke-width="2.5" stroke-linecap="round"/>'
    + '<line x1="228" y1="0" x2="228" y2="10" stroke="#7a5632" stroke-width="2.5" stroke-linecap="round"/>'
    + '<rect x="76" y="8" width="188" height="28" rx="5" fill="#b88852" stroke="#916b41" stroke-width="2.2"/>'
    + '<rect x="81" y="12" width="178" height="20" rx="3" fill="#fffdf5" stroke="#c9bca3" stroke-width="1.2"/>'
    + '<text x="170" y="27" text-anchor="middle" font-family="Itim, Patrick Hand, sans-serif" font-size="14.5" font-weight="bold" fill="#634729" letter-spacing="0.6" opacity="0.94">QUẦY GIAO HÀNG</text>'
    // bệ cửa sổ nhô ra thành gờ giao dịch + bóng đổ xuống mặt bàn
    + '<rect x="6" y="301" width="328" height="8" rx="3" fill="#3b3025" opacity=".18"/>'
    + '<rect x="4" y="291" width="332" height="11" rx="2" fill="url(#wf-sillfront)" stroke="#684928" stroke-width="2.4"/>'
    + '<path d="M2,285 H338 L336,292 H4 Z" fill="url(#wf-sill)" stroke="#a57f51" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<line x1="5" y1="286.5" x2="335" y2="286.5" stroke="#fbe3b8" stroke-width="1.4" opacity=".85"/>'
    // chuông bàn nhỏ ở góc phải bệ cửa sổ
    + '<rect x="304" y="281" width="22" height="4" rx="1.5" fill="#6e4c2b" stroke="#573c22" stroke-width="1.5"/>'
    + '<path d="M306,281 Q306,269 315,269 Q324,269 324,281 Z" fill="url(#wf-brass)" stroke="#a7863a" stroke-width="1.6"/>'
    + '<line x1="315" y1="269" x2="315" y2="266" stroke="#856019" stroke-width="1.8" stroke-linecap="round"/>'
    + '<circle cx="315" cy="265" r="2" fill="url(#wf-brass)" stroke="#a7863a" stroke-width="1.3"/>'
    + '<path d="M310,275 Q311,272 314,271" fill="none" stroke="#fffdf5" stroke-width="1.5" stroke-linecap="round" opacity=".85"/>'
    + '</svg>';
}

/* Bồn rửa phối cảnh ở bên phải cạnh bàn (đặt trên quầy đá #sinkcountersvg):
   chỉ giữ nét viền ngoài (#3b3025), bên trong tách lớp bằng mảng màu phẳng không viền, 1 vòi cổ ngỗng thường, chai xà phòng và tia nước bắn khi đổ bỏ (--splash). */
function sinkSVG(){
  return '<svg id="sinksvg" class="sink-svg" viewBox="0 0 316 222" width="316" height="222" aria-hidden="true">'
    + '<defs>'
    +   '<linearGradient id="ss-deck" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#edf3f5"/><stop offset="100%" stop-color="#d2dde1"/></linearGradient>'
    +   '<linearGradient id="ss-apron" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#aab9c0"/><stop offset="100%" stop-color="#84969f"/></linearGradient>'
    +   '<linearGradient id="ss-back" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#899ea8"/><stop offset="100%" stop-color="#a5b7c0"/></linearGradient>'
    +   '<linearGradient id="ss-floor" x1="0" y1="0" x2="0" y2="1">'
    +     '<stop offset="0%" stop-color="#b9c8cf"/><stop offset="100%" stop-color="#d8e2e6"/></linearGradient>'
    +   '<linearGradient id="ss-chrome" x1="0" y1="0" x2="1" y2="0">'
    +     '<stop offset="0%" stop-color="#f2f6f8"/><stop offset="55%" stop-color="#b7c4cb"/><stop offset="100%" stop-color="#7f8f97"/></linearGradient>'
    +   '<linearGradient id="ss-soap" x1="0" y1="0" x2="1" y2="0">'
    +     '<stop offset="0%" stop-color="#9dd4c9"/><stop offset="100%" stop-color="#6faea2"/></linearGradient>'
    + '</defs>'
    // bóng đổ nhẹ xuống mặt đá bên dưới mép bồn
    + '<polygon points="46,184 309,184 313,195 50,195" fill="#3b3025" opacity=".16"/>'
    // LỚP 1: CHỈ VẼ VIỀN NGOÀI TỔNG THỂ (#3b3025)
    + '<path d="M8,61 Q8,59 11,59 H236 Q239,59 240,62 L308,180 V188 Q308,191 304,191 H50 Q47,191 46,188 V180 L8,66 Z" fill="url(#ss-deck)" stroke="#3b3025" stroke-width="5.6" stroke-linejoin="round"/>'
    // chai xà phòng (outer stroke)
    + '<rect x="18" y="45" width="22" height="24" rx="5" fill="url(#ss-soap)" stroke="#3b3025" stroke-width="4.6"/>'
    + '<rect x="25" y="39" width="8" height="7" rx="1.5" fill="#d4dee3" stroke="#3b3025" stroke-width="4.6"/>'
    + '<path d="M29,39 V33 H41" fill="none" stroke="#3b3025" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>'
    // vòi đơn cổ ngỗng thường (outer stroke — không tay vặn nóng/lạnh)
    + '<rect x="112" y="55" width="22" height="10" rx="3" fill="#9fb0b8" stroke="#3b3025" stroke-width="4.8"/>'
    + '<path d="M123,58 L123,29 Q123,13 139,15 Q153,17 153,33 L153,42" fill="none" stroke="#3b3025" stroke-width="11.2" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<rect x="148" y="40" width="10" height="6" rx="2" fill="#9fb0b8" stroke="#3b3025" stroke-width="4.4"/>'
    // LỚP 2: TOÀN BỘ MẢNG MÀU BÊN TRONG KHÔNG VIỀN TỐI
    + '<polygon points="8,59 238,59 240,66 10,66" fill="#f3f7f8"/>'
    + '<polygon points="10,66 240,66 308,180 46,180" fill="url(#ss-deck)"/>'
    + '<path d="M46,180 H308 V188 Q308,191 304,191 H50 Q46,191 46,188 Z" fill="url(#ss-apron)"/>'
    + '<line x1="51" y1="182" x2="303" y2="182" stroke="#ffffff" stroke-width="1.6" opacity=".72"/>'
    // lòng chậu inox lõm xuống theo phối cảnh 37° (converge về điểm tụ bàn, 0 nét viền tối)
    + '<polygon points="28,75 224,75 220,97 34,97" fill="url(#ss-back)"/>'
    + '<polygon points="28,75 34,97 62,167 56,167" fill="#7c919c"/>'
    + '<polygon points="224,75 220,97 272,167 282,167" fill="#a9bbc4"/>'
    + '<polygon points="34,97 220,97 272,167 62,167" fill="url(#ss-floor)"/>'
    + '<line x1="72" y1="160" x2="108" y2="160" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>'
    // lỗ thoát nước phối cảnh (không viền tối)
    + '<ellipse cx="152" cy="132" rx="16" ry="7" fill="#82949d"/>'
    + '<ellipse cx="152" cy="132.4" rx="11" ry="4.5" fill="#4f5d64"/>'
    + '<line x1="141" y1="132.4" x2="163" y2="132.4" stroke="#b8c6cd" stroke-width="1.5" opacity=".88"/>'
    + '<line x1="152" y1="127.9" x2="152" y2="136.9" stroke="#b8c6cd" stroke-width="1.5" opacity=".88"/>'
    // chai xà phòng góc sau trái
    + '<rect x="25" y="39" width="8" height="7" rx="1.5" fill="#d4dee3"/>'
    + '<path d="M29,39 V33 H41" fill="none" stroke="#c3cfd5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<rect x="18" y="45" width="22" height="24" rx="5" fill="url(#ss-soap)"/>'
    + '<rect x="22" y="53" width="14" height="8" rx="1.5" fill="#fffdf5" opacity=".92"/>'
    // vòi cổ ngỗng đơn + giọt nước
    + '<rect x="112" y="55" width="22" height="10" rx="3" fill="url(#ss-chrome)"/>'
    + '<path d="M123,58 L123,29 Q123,13 139,15 Q153,17 153,33 L153,42" fill="none" stroke="url(#ss-chrome)" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M121,54 L121,29 Q121,17 134,16" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" opacity=".78"/>'
    + '<rect x="148" y="40" width="10" height="6" rx="2" fill="#9fb0b8"/>'
    + '<path d="M153,49 Q150.2,55 153,59.5 Q155.8,55 153,49 Z" fill="#6f9ec9" fill-opacity=".86"/>'
    // tia nước bắn lên khi đổ bỏ (--splash)
    + '<g style="opacity:var(--splash,0)">'
    +   '<path d="M142,124 Q133,108 124,102" stroke="#6f9ec9" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
    +   '<path d="M152,121 Q152,102 152,93" stroke="#6f9ec9" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
    +   '<path d="M162,124 Q171,108 180,102" stroke="#6f9ec9" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
    +   '<circle cx="122" cy="99" r="3.6" fill="#6f9ec9" fill-opacity=".8"/>'
    +   '<circle cx="152" cy="89" r="4" fill="#6f9ec9" fill-opacity=".8"/>'
    +   '<circle cx="182" cy="99" r="3.6" fill="#6f9ec9" fill-opacity=".8"/>'
    +   '<circle cx="136" cy="94" r="2.6" fill="#6f9ec9" fill-opacity=".7"/>'
    +   '<circle cx="168" cy="94" r="2.6" fill="#6f9ec9" fill-opacity=".7"/>'
    +   '<circle cx="152" cy="106" r="2.2" fill="#ffffff" fill-opacity=".85"/>'
    + '</g>'
    + '</svg>';
}


/* đặt một vật ĐỨNG trên bàn tại (u,t). art co theo phối cảnh, over (nhãn) thì không */
function place(o){
  const x = xOf(o.u,o.t), y = yOf(o.t), sc = scaleOf(o.t);
  const sw = o.w*sc, sh = o.h*sc;
  return '<div class="shadow'+(o.scls?' '+o.scls:'')+'" style="left:'+x+'px;top:'+(y-2)+'px;width:'+(sw*0.80)+'px;height:'+(sw*0.18)+'px"></div>'
    + '<div class="item'+(o.cls?' '+o.cls:'')+'"'+(o.id?' id="'+o.id+'"':'')+(o.dz?' data-dz="'+o.dz+'"':'')
    + (o.title?' title="'+o.title+'"':'')
    + ' style="left:'+(x-sw/2)+'px;top:'+(y-sh)+'px;width:'+sw+'px;height:'+sh+'px;'
    + 'z-index:'+(4 + Math.round(o.t*40) + (o.z||0))+'">'
    + '<div style="width:'+o.w+'px;height:'+o.h+'px;transform:scale('+sc+');transform-origin:0 0">' + o.art + '</div>'
    + (o.over||'') + '</div>';
}
/* đặt một hình T3D: điểm neo an rơi đúng (x,y), cỡ k px/đơn vị. art: hình dựng sẵn thay cho symbol (cái cốc).
   Hình vẽ kín hộp (100%), nên đổi chỗ / đổi cỡ chỉ cần đổi hộp của .item (moveTool). */
function place3(o){
  const b = artBox(o.sid, o.an, o.x, o.y, o.k);
  const sh = o.shadow === false ? '' : '<div class="shadow' + (o.scls ? ' ' + o.scls : '') + '"' + (o.id ? ' id="sh_' + o.id + '"' : '')
    + ' style="left:' + o.x + 'px;top:' + (o.y - 2) + 'px;width:' + (b.w*(o.shw || 0.7)).toFixed(1) + 'px;height:' + (b.w*(o.shw || 0.7)*0.23).toFixed(1) + 'px"></div>';
  const art = o.art || sym(o.sid, '100%', '100%', o.style || '').replace('<svg ', '<svg ' + (o.svgId ? 'id="' + o.svgId + '" ' : ''));
  return sh + '<div class="item' + (o.cls ? ' ' + o.cls : '') + '"' + (o.id ? ' id="' + o.id + '"' : '') + (o.dz ? ' data-dz="' + o.dz + '"' : '')
    + (o.title ? ' title="' + o.title + '"' : '') + ' data-sid="' + o.sid + '" style="' + boxCss(b) + 'z-index:' + o.z + '">'
    + art + (o.over || '') + '</div>';
}
/* hộp bao của cốc trên màn hình — mọi hiệu ứng rót/bọt/vòng khuấy neo theo đây */
function beakerBox(){
  if(lab && lab.big){ const g = bigGeo(); return {cx:g.x, w:BIG_CUP.w, top:g.mouth - 4, bot:g.floor + 8}; }
  const it = G.querySelector('#beakerItem'), gr = G.getBoundingClientRect();
  if(!it) return {cx:CX, w:120, top:300, bot:500};
  const r = it.getBoundingClientRect(), sc = gr.width/1280;
  return {cx:(r.left + r.width/2 - gr.left)/sc, w:r.width/sc,
          top:(r.top - gr.top)/sc, bot:(r.bottom - gr.top)/sc};
}


/* container art per chemical state */
const TRAY_METALS = ['Fe','Cu','Zn','Mg','Al','Ag'];
function contSym(f){
  f = baseChem(f);
  const c = CHEMS[f];
  if(f === 'Na') return 'sym-metal-na';
  if(TRAY_METALS.includes(f)) return 'sym-metal-' + f.toLowerCase();
  if(c.s === 'k') return 'sym-canister';
  if(c.s === 'd' || c.s === 'l') return 'sym-bottle-liquid';
  return 'sym-jar-powder';
}
// Drag-ghost under the cursor: spoon of powder for solids, pipette of liquid for solutions;
// metals & gas keep their container (a spoonful of sodium / a pipette of gas makes no sense).
function chemDragTool(f){
  f = baseChem(f);
  const cs = contSym(f), col = CHEMS[f].c;
  if(cs === 'sym-jar-powder')    return {html: sym('sym-spoon',80,80,'--lc:'+col+';--spop:1'), w:80, h:80};
  if(cs === 'sym-bottle-liquid') return {html: sym('sym-pipette',42,150,'--lc:'+col),        w:42, h:150};
  return {html: sym(cs,58,80,'--lc:'+col+';--lc2:#00000022'), w:58, h:80};
}
function stripeCol(f){
  f = baseChem(f);
  const c = CHEMS[f];
  if(c.a) return '#d9634f';
  if(c.b) return '#6f9ec9';
  if(f === 'Na' || TRAY_METALS.includes(f)) return '#8a8d90';
  if(c.s === 'k') return '#f2efe6';
  if(c.s === 'r' && c.sol) return '#e8b84b';
  return '#c9bfa8';
}

/* =====================  DRAG & DROP MANAGER  ===================== */
// types: chem (cabinet bottle), beaker, gas (collection bottle), dish (filtered solids — thả vào cốc = cho chất rắn lại vào cốc),
// lamp (heater), ladle (muôi đốt), funnel (filter), mgcard / mgdrop / mglabel / vlatom / vlmove (minigame, via opts.onDrop)
// Ngày có muôi đốt: bình khí kiêm LỌ KHÍ (zone 'jar'), đèn cồn là chỗ hơ lửa (zone 'flame').
const DZ_ACCEPT = {
  rod:   [], // never dropped — stirring happens during the drag, then it snaps home
  chem:  ['beaker','jar','ladle'],
  ladle: ['flame','jar','sink','mat'],   // thả vào thảm = treo muôi lên giá
  beaker:['cust','sink','mat','bench','funnel'],   // mặt bàn ngoài thảm = đặt cốc ra đó; thảm = đưa về giữa; phễu = lọc
  gas:   ['beaker','mat','cust','sink'],
  dish:  ['cust','sink','beaker'],   // cốc = trút chất rắn trên đĩa lại vào cốc (nung khô, hoà vào axit…)
  lamp:  ['beaker','mat'],
  elec:  ['beaker','mat'],
  funnel:['beaker','mat'],
  lid:   ['beaker'],   // nắp của cốc to (Cài đặt → "Cốc phóng to"): đậy cốc = thu khí
  mgcard:['bin0','bin1','bin2','bin3'],
  mgdrop:['quy','rg0','rg1','rg2','rg3'],     // xác định chất: ống nhỏ giọt mẫu → giấy quỳ / cốc thuốc thử
  mglabel:['jar0','jar1','jar2','tray'],      // xác định chất: nhãn → lọ mất nhãn / khay nhãn
  vlatom: ['vbuild'],                         // hoá trị: bi từ khay → khu vực tạo chất
  vlmove: ['vbuild'],                         // hoá trị: dời bi trong khu vực (thả ra ngoài = bỏ bi)
  chflask:['cs0','cs1','cs2'],                // chuỗi phản ứng: bình trong khay → ô trên mũi tên
  chlbl:  ['cs0','cs1','cs2'],                // chuỗi phản ứng: dời nhãn sang ô khác (thả ra ngoài = gỡ nhãn)
  balmol: ['bzone'],                          // cân bằng: chất trong dải → thêm một phân tử vào khay phản ứng
  balout: ['bzone']                           // cân bằng: phân tử trong khay (thả ra ngoài khay = bớt phân tử đó)
};
let drag = null;
function gameXY(e){
  const r = gameRect(), s = r.width/1280;
  return {x:(e.clientX-r.left)/s, y:(e.clientY-r.top)/s};
}
function dragify(el, type, opts){
  // opts.touchAction 'pan-y': lọ trong tủ — vuốt dọc thì tủ cuộn, kéo ngang sang bàn mới là nhấc lọ
  // opts.enabled(): false thì không nhấc được (vật vẫn nhận rê chuột — vd. bong bóng hoá trị ở minigame hoá trị)
  el.style.touchAction = opts.touchAction || 'none';
  el.style.cursor = 'grab';
  el.addEventListener('pointerdown', e => {
    if(e.button !== 0 || drag) return;
    if(lab && lab.timer === null) return; // paused
    if(opts.enabled && !opts.enabled()) return;
    const p = gameXY(e);
    // ngón tay: vật nổi lên TRÊN đầu ngón (lift) để không che chỗ thả; chỗ thả tính theo vật, không theo ngón
    const lift = e.pointerType === 'mouse' ? 0 : opts.h*0.6 + 24;
    drag = {type, el, opts, sx:p.x, sy:p.y, x:p.x, y:p.y, tilt:0, ghost:null, lift};
    e.preventDefault();
  });
}
// điểm thả trên màn hình: ngay con trỏ chuột, hoặc giữa vật đang nổi trên ngón tay
function dropPt(e, d){
  const k = gameRect().width/1280;
  return [e.clientX, e.clientY - d.lift*k];
}
/* Trên bàn phối cảnh các vật CHỒNG LÊN NHAU (đèn thò dưới cốc, bình úp trên miệng cốc),
   nên elementFromPoint hay trả về dụng cụ đang cắm vào cốc chứ không phải cốc.
   Không thấy vùng nào thì thử lại xem điểm đó có nằm trong hộp của cốc không. */
function zoneAt(clientX, clientY, type){
  const acc = DZ_ACCEPT[type]||[];
  const hit = document.elementFromPoint(clientX, clientY);
  const zEl = hit && hit.closest ? hit.closest('[data-dz]') : null;
  // vùng không nhận loại này (vd. đèn cồn đang chui dưới cốc) thì đừng che mất cái cốc phía sau
  if(zEl && acc.includes(zEl.dataset.dz)) return zEl;
  if(!acc.includes('beaker')) return zEl;
  const bk = G.querySelector('#beakerItem');
  if(!bk) return zEl;
  const r = bk.getBoundingClientRect();
  return (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) ? bk : zEl;
}
// rê chuột / bút / ngón tay có thể bắn 120–240 sự kiện mỗi giây: chỉ giữ sự kiện mới nhất, xử lý một lần mỗi khung hình
let dragEv = null;
function dragMove(e){
  if(!drag) return;
  if(!dragEv) requestAnimationFrame(() => { const ev = dragEv; dragEv = null; if(ev) dragStep(ev); });
  dragEv = e;
}
function dragStep(e){
  if(!drag) return;
  const p = gameXY(e);
  if(!drag.ghost){
    if(Math.hypot(p.x-drag.sx, p.y-drag.sy) < 7) return; // click vs drag threshold
    const g = document.createElement('div');
    g.className = 'dragghost';
    g.innerHTML = drag.opts.ghostHTML();
    G.appendChild(g);
    drag.ghost = g;
    drag.el.classList.add('draggingsrc');
    (DZ_ACCEPT[drag.type]||[]).forEach(z => {
      const t = G.querySelector('[data-dz="'+z+'"]');
      if(t) t.classList.add('dropready');
    });
    SFX.clink();
  }
  const dx = p.x - drag.x, dist = Math.hypot(dx, p.y - drag.y);
  drag.x = p.x; drag.y = p.y;
  drag.tilt = Math.max(-12, Math.min(12, drag.tilt*.75 + dx*.7)); // lag/tilt follow
  if(drag.type === 'rod') stirMove({x:p.x, y:p.y - drag.lift}, dist);
  const hz = zoneAt(...dropPt(e, drag), drag.type);
  const hot = hz && (DZ_ACCEPT[drag.type]||[]).includes(hz.dataset.dz) ? hz : null;
  if(hot !== drag.hot){ if(drag.hot) drag.hot.classList.remove('drophot'); if(hot) hot.classList.add('drophot'); drag.hot = hot; }
  // vị trí bằng translate (GPU), không bằng left/top — left/top đổi là trình duyệt dàn trang lại mỗi lần rê
  drag.ghost.style.translate = (p.x - drag.opts.w/2) + 'px ' + (p.y - drag.lift - drag.opts.h/2) + 'px';
  // dụng cụ đưa vào vùng thảm thì to lên đúng cỡ nó sẽ có khi lắp vào bộ (x1.5 cỡ thật; đồ đang cất chỉ x0.8)
  const big = drag.opts.grow && inMat(p.x, p.y - drag.lift) ? drag.opts.grow : 1;   // grow: hệ số tới cỡ lắp
  drag.ghost.style.transform = 'rotate('+drag.tilt.toFixed(1)+'deg) scale('+(1.05*big).toFixed(2)+')';
}
function dragEnd(e){
  if(!drag) return;
  dragEv = null;
  const d = drag; drag = null;
  G.querySelectorAll('.dropready,.drophot').forEach(t => t.classList.remove('dropready','drophot'));
  d.el.classList.remove('draggingsrc');
  if(!d.ghost){
    if(d.el._noClick){ d.el._noClick = false; return; }   // vừa nhấn giữ xem "Bạn có biết?" — không tính là bấm rót
    if(d.opts.onClick) d.opts.onClick();
    return;
  }
  const g = d.ghost;
  const zEl = zoneAt(...dropPt(e, d), d.type);
  const zname = zEl ? zEl.dataset.dz : null;
  if(zname && (DZ_ACCEPT[d.type]||[]).includes(zname)){
    g.remove();
    if(d.opts.onDrop) d.opts.onDrop(zname, e, dropPt(e, d));
    else dropAction(d.type, zname, d.opts.data);
  } else {
    const [lx, ly] = dropPt(e, d);
    if(d.opts.onLoose && d.opts.onLoose({clientX:lx, clientY:ly})){ g.remove(); return; } // e.g. undocking lamp/gas
    // thả hàng trượt ra ngoài khay (vẫn ở phía khách): nói cho biết phải thả vào đâu, đừng chỉ bật về im lặng
    if(lab && (DZ_ACCEPT[d.type]||[]).includes('cust') && gameXY({clientX:lx, clientY:ly}).x < 360) notify(PROF_LAB.thaKhay);
    g.style.transition = 'translate .38s cubic-bezier(.3,1.5,.5,1), transform .38s';
    g.style.translate = (d.sx - d.opts.w/2) + 'px ' + (d.sy - d.opts.h/2) + 'px';
    g.style.transform = 'rotate(0deg) scale(1)';
    setTimeout(()=>g.remove(), 400);
  }
}
addEventListener('pointermove', dragMove);
addEventListener('pointerup', dragEnd);
addEventListener('pointercancel', () => {
  if(!drag) return;
  if(drag.ghost) drag.ghost.remove();
  drag.el.classList.remove('draggingsrc');
  G.querySelectorAll('.dropready').forEach(t => t.classList.remove('dropready'));
  drag = null;
});
function dropAction(type, zone, data){
  if(!lab) return;
  if(type === 'chem'){ pourChem(data, zone); return; }
  if(type === 'ladle'){
    if(zone === 'mat'){ mountSpoon(true); if(!ladleFuel().length) toast('Muôi đã treo lên giá — thả chất rắn từ tủ vào muôi, rồi kéo <b>đèn cồn</b> vào thảm để hơ.'); }
    else if(zone === 'flame'){ mountSpoon(true); lampUnder(true); }   // thả muôi vào đèn = treo muôi + gọi đèn vào dưới
    else if(zone === 'jar') burnInJar();
    else dumpLadle();
    return;
  }
  if(type === 'beaker'){
    if(zone === 'cust'){ lab.sel = 'beaker'; serve(); } else dumpBeaker();
    return;
  }
  if(type === 'gas'){
    if(zone === 'beaker' && tot(lab.gas) > 0) pourGas();
    else if(zone === 'beaker' || zone === 'mat'){ if(!lab.catcher) setCatch(true); }
    else if(zone === 'cust'){ lab.sel = 'gas'; serve(); }
    else { lab.gas = {}; SFX.splash(); toast('Đã xả bình khí vào bồn.'); updateBeaker(); }
    return;
  }
  if(type === 'dish'){
    if(zone === 'cust'){ lab.sel = 'solid'; serve(); }
    else if(zone === 'beaker') dishToBeaker();
    else { lab.solid = {}; SFX.splash(); toast('Đã đổ đĩa lọc vào bồn.'); updateBeaker(); }
    return;
  }
  // muôi đang treo trên giá (có chất) thì đèn vào thảm là để HƠ MUÔI, không phải đun cốc
  if(type === 'lamp'){ if(spoonUp()) lampUnder(true); else setHeat(true); return; }
  if(type === 'elec'){ setElec(true); return; }
  // phễu: lắp lên giá; phễu đang lắp mà kéo vào cốc nữa thì lọc
  if(type === 'funnel'){ if(zone === 'beaker' && lab.filterOn) useFilter(); else setFilter(true); return; }
}

/* ladle/ladleLit: chất trên muôi đốt & đã bén lửa chưa. hard: ca này chơi chế độ khó
   (chốt lúc mở tiệm — đổi cài đặt giữa ca không làm lệch cách chấm). dur: thời lượng ca.
   An toàn: goggles (đã đeo kính & găng), hood (tủ hút đang bật), hoodDay (hôm nay có thể sinh
   khí độc), safety (số lỗi an toàn), firstPour/waterIn (để bắt lỗi rót nước vào axit).
   Luật an toàn chỉ áp ở CHẾ ĐỘ KHÓ: chế độ thường coi như đã đeo đồ bảo hộ, không có tủ hút, không trừ sao;
   rót nước vào axit thì giáo sư vẫn giảng (kiến thức), chỉ không tính lỗi. */
function newLab(i, day){
  const hard = hardOn(), dur = hard ? Math.round(day.dur * 1.5) : day.free ? day.dur : Math.round(day.dur * EASY_TIME);   // EASY_TIME: diem.js
  return {i, day, hard, dur, mix:{}, undissolved:{}, dissolveTotal:0, gas:{}, solid:{}, ladle:{}, ladleLit:false,
          heaterOn:false, elecOn:false, catcher:false, lampUnder:false, spoonOn:false, bkPark:null, bkAuto:false, sel:'beaker',
          time:dur, oi:0, served:0, wrong:0, waste:0, timer:null, lastColor:'', magicDose:1,
          otime:0, odur:0, waitStage:0, miss:0, lastWhy:'', cardQ:[], cardOpen:false,
          goggles:!hard, hood:false, hoodDay:hard && [...dayHave(day)].some(f => TOXIC.includes(f)),
          safety:0, safeHits:{}, firstPour:null, waterIn:false, dac:{},
          big:bigBeakerOn() && !day.tools.some(t => t === 'burn' || t === 'elec')};   // cốc to (Cài đặt): ngày có muôi đốt / điện phân dùng bàn thường
}
function startLab(i){
  SFX.music(themeOf(i));
  // chơi lại ngày đã qua (đã có sao): cùng các đơn nhưng khách đến theo thứ tự khác — lượt sau phải nhớ CÁCH làm,
  // không phải nhớ thứ tự. Lần đầu (và ngày 1, ngày hướng dẫn) giữ đúng thứ tự đã soạn
  const won = (hardOn() ? save.starsHard : save.stars)[i + 1] >= 1;
  // chế độ khó: ngày nào có phần thêm (day.kho — kệ, dụng cụ, đơn riêng) thì nối vào (withHard, du-lieu.js)
  const base = hardOn() ? withHard(DAYS[i]) : DAYS[i];
  const day = won && i > 0 ? Object.assign({}, base, {orders:shuffle(base.orders)}) : base;
  lab = newLab(i, day);
  runStart();   // điểm nhanh lấy từ vòng đồng hồ chờ của từng khách (serve), không cần đồng hồ riêng
  renderLab();
  startCurtain();   // đồng hồ ca bật khi màn "Bắt đầu" sáng lại
}

/* Kệ ca tự do xếp theo nhóm: Nước → Kim loại → Phi kim → Oxit → Axit → Bazơ → Muối → chất khác (đường).
   Nhóm suy ra từ công thức và cờ a / b trong CHEMS, nên thêm chất mới vào kệ ngày nào nó cũng tự vào đúng nhóm.
   Trong nhóm: kim loại, oxit, bazơ, muối theo dãy hoạt động của kim loại (K Na Ca Ba Mg Al Zn Fe … Cu Ag);
   axit loãng trước, axit đặc sau (cùng thứ tự HCl, H₂SO₄, HNO₃); còn lại giữ thứ tự xuất hiện trong chiến dịch. */
// 0 nước · 1 kim loại · 2 phi kim · 3 oxit · 4 axit · 5 bazơ · 6 muối · 7 khác
function shelfGroup(f){
  const c = CHEMS[f], el = Object.keys(atomCounts(f));
  if(f === 'H2O') return 0;
  if(el.length === 1) return FREE_METALS.has(el[0]) ? 1 : 2;
  if(c.a) return 4;
  if(c.b) return 5;
  if(el.length === 2 && el.includes('O')) return 3;
  return metalOf(f) || f.startsWith('NH4') ? 6 : 7;
}
function freeShelfOrder(chems){
  const ACT = [...FREE_METALS];   // FREE_METALS ghi đúng thứ tự dãy hoạt động
  const act = f => { const i = ACT.indexOf(metalOf(f)); return i < 0 ? ACT.length : i; };
  const key = f => { const b = baseChem(f), g = shelfGroup(b);
    return [g, g === 4 ? +(f !== b) : act(b), chems.indexOf(b)]; };
  const ks = new Map(chems.map(f => [f, key(f)]));
  return chems.slice().sort((x, y) => { const a = ks.get(x), b = ks.get(y); return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]; });
}

/* ---- free-play (post day 28): full shelf, endless random campaign orders ---- */
function startFree(){
  SFX.music(3);
  const labDays = DAYS.filter(d => !d.mg && !d.trip && !d.rest);
  // K không nằm trên kệ ngày nào, nên trước đây các phản ứng của K / K₂O không bao giờ làm được (sổ tay không thể đủ)
  // lọ axit đặc chỉ có ở ca tự do (kệ chiến dịch là axit loãng); KClO₃ để điều chế oxi với xúc tác MnO₂;
  // HNO₃ loãng: từ khi bỏ bài "Axit mạnh: H₂SO₄ & HNO₃" không ngày nào bày nó trên kệ nữa
  const chems = freeShelfOrder([...new Set(labDays.flatMap(d => withHard(d).chems).concat(['K', 'KClO3', 'HNO3', ...Object.keys(CONC_SHELF)]))]);
  const pool = labDays.flatMap(d => d.orders);
  // ponytail: orders sampled from the 28-day campaign — always solvable with the union shelf
  const freeOrder = () => { const od = Object.assign({}, pick(pool)); delete od.line; return od; };
  const day = {t:'Chế độ tự do', free:true, freeOrder, chems,
               tools:['spoon','quy','book','gas','heat','burn','filter','elec'],
               dur:540, s1:0, orders:Array.from({length:6}, freeOrder)};
  lab = newLab(-1, day);
  runStart();
  renderLab();
  startCurtain();
  notify('Kệ mở toàn bộ '+chems.length+' hoá chất — khách đến vô tận, nghịch thoải mái!');
}
/* Kết thúc ca tự do: thẻ tổng kết như ngày thường — số đơn, kỷ lục, phản ứng mới vào sổ tay. Sao ở đây chỉ để vui
   (3 / 6 / 10 đơn), không ghi vào lịch: ca tự do có một mục tiêu để phá thay vì chơi mãi không đích */
const FREE_STARS = [3, 6, 10];
function endFree(title){   // title: ca dừng giữa chừng (axit bắn ra) thì ghi lý do lên thẻ
  const n = lab.served, nr = lab.newRx || 0;
  lab = null;
  const rec = n > (save.freeBest || 0);
  if(rec){ save.freeBest = n; persist(); }
  resultCard({day:'Tự do', name:title || 'Ca tự do', lim:FREE_STARS, rec:rec && n > 0,
    rows:[{l:'Đơn hoàn thành', v:n, add:1}, {l:'Phản ứng mới vào sổ tay', v:nr, plus:1}],
    total:{l:'SỐ ĐƠN', best:rec && n ? null : save.freeBest || 0},
    cheer:FREE_STARS.join(' / ') + ' đơn là 1 / 2 / 3 sao — phá kỷ lục nhé!',
    btns:resBtn('bmap', 'map', 'Bản đồ') + resBtn('bretry', 'retry', 'Ca mới', ' main')});
  G.querySelector('#bretry').onclick = () => go(startFree);
  G.querySelector('#bmap').onclick = () => go(showMap);
}
function finishLab(timeUp){
  if(!lab) return; // serve-timeout and timer can race — first one wins
  clearInterval(lab.timer);
  const i = lab.i, st = {served:lab.served, wrong:lab.wrong, hard:lab.hard,
                         safety:lab.safety};
  lab = null;
  // hết giờ giữa chừng: chữ "Hết giờ!" rơi xuống một nhịp, để không ai tưởng game tự nhảy sang màn khác
  if(timeUp){
    const b = document.createElement('div'); b.className = 'timeup'; b.innerHTML = '<b>' + PROF_LAB.hetGio + '</b>';
    G.appendChild(b); SFX.bell();
    setTimeout(() => { b.remove(); showResult(i, st); }, 1400);
    return;
  }
  showResult(i, st);   // thẻ kết quả nảy lên ngay trên bàn thí nghiệm vừa đứng hình
}

function lerpHex(a, b, t){
  const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = p(a), [r2,g2,b2] = p(b);
  const c = v => Math.round(v).toString(16).padStart(2,'0');
  return '#' + c(r1+(r2-r1)*t) + c(g1+(g2-g1)*t) + c(b1+(b2-b1)*t);
}

function labTick(){
  if(!lab) return; // an orphaned interval must never outlive the day
  lab.time--;
  const frac = lab.time/lab.dur, p = 1-frac;
  const bar = G.querySelector('.timerbar>div');
  if(bar){ bar.style.transform = 'scaleX('+frac+')'; bar.style.background = frac>.5?'var(--green)':frac>.2?'var(--accent)':'var(--red)'; }
  const tl = G.querySelector('#tleft');
  if(tl) tl.textContent = Math.floor(lab.time/60)+':'+String(lab.time%60).padStart(2,'0');
  // vòng đếm ngược ở góc bóng thoại — đồng hồ chờ của riêng khách hiện tại
  if(lab.odur > 0 && lab.otime > 0 && !G.querySelector('#custwalk.walking')) lab.otime--;   // đang bước vào thì chưa tính giờ chờ
  const ofrac = lab.odur > 0 ? lab.otime/lab.odur : 1;
  const ring = G.querySelector('.on-ring circle.fg');
  if(ring){ ring.style.strokeDashoffset = 88*(1-ofrac); ring.style.stroke = ofrac>.2?'var(--green)':'var(--red)'; }
  // khách sốt ruột: mỗi mốc nói một câu, giọng theo tính cách (WAIT_LINES trong loi-thoai.js)
  if(lab.odur > 0 && typeof WAIT_LINES !== 'undefined'){
    const stage = ofrac <= .3 ? 2 : ofrac <= .6 ? 1 : 0;
    if(stage > lab.waitStage){
      lab.waitStage = stage;
      const lines = WAIT_LINES[lab.day.orders[lab.oi].who];
      if(lines && lines.length) custSay(lines[(stage-1) % lines.length]);
    }
  }
  // wall clock (8:00 -> 17:00) and window daylight
  const hours = 8 + 9*p;
  const wallw = G.querySelector('#winsvg');
  if(wallw){
    wallw.style.setProperty('--sky', p<.5 ? lerpHex('#bfe3f2','#cfe9f7',p*2) : lerpHex('#cfe9f7','#f0b871',(p-.5)*2));
    wallw.style.setProperty('--sun', lerpHex('#e8b84b','#d9634f',p));
  }
  const ck = G.querySelector('#clocksvg');
  if(ck){ ck.style.setProperty('--ckh', ((hours%12)*30)+'deg'); ck.style.setProperty('--ckm', ((hours*60)%60*6)+'deg'); }
  if(lab.heaterOn){
    // khuấy, đun nóng hay nghiền nhỏ đều giúp chất rắn tan nhanh hơn (bài giảng ngày 1): đun thì tan dần, chậm hơn khuấy
    if(tot(lab.undissolved) > 0 && Object.keys(lab.mix).some(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd')) dissolveStep(0.25, true);
    runReactions();   // điện phân không tự chạy — xem electrolyse()
    if(lab.time % 3 === 0 && Object.keys(lab.mix).some(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd')) SFX.boil();   // cốc đang sôi lục bục
  }
  if(lab.time <= 0){ if(lab.day.free) lab.time = lab.dur; else { finishLab(true); return; } } // free play: the day just starts over
  if(lab.odur > 0 && lab.otime <= 0) customerLeaves();
}

function customerLeaves(){ // hết giờ chờ: khách bỏ đi, hàng đợi chạy tiếp (không tính là giao sai)
  if(!lab) return;
  lab.odur = 0;
  runMiss();
  const od = lab.day.orders[lab.oi], c = CUSTOMERS[od.who];
  lab.otag = null;
  custSay(fillLine(LEAVE_LINE, {ten:c[0]}));
  setExp('annoy');
  SFX.err();
  notify('Khách bỏ đi — lỡ đơn "' + (od.pname || CHEMS[od.chem].n) + '".');
  lab.oi++;
  if(lab.day.free) lab.day.orders.push(lab.day.freeOrder());
  custLeave();
}

// hovering a shelf chemical for 5s reveals a fun fact about it
function factHover(el, f){
  const fact = CHEM_FACTS[baseChem(f)]; if(!fact) return;
  let timer = null, bub = null, start = null;
  const clear = () => { if(timer) clearTimeout(timer); timer = null; if(bub){ bub.remove(); bub = null; } };
  // ngón tay: nhấn giữ ~0,6 giây (không nhích) thì hiện; nhả tay ra không tính là bấm rót
  el.addEventListener('pointerdown', e => {
    clear();
    if(e.pointerType === 'mouse') return;
    start = [e.clientX, e.clientY];
    timer = setTimeout(() => { show(); el._noClick = true; setTimeout(clear, 3500); }, 600);
  });
  el.addEventListener('pointermove', e => {
    if(start && timer && !bub && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 8){ clearTimeout(timer); timer = null; }
  });
  el.addEventListener('pointercancel', clear);
  el.addEventListener('mouseenter', () => {
    if(lastPointer !== 'mouse') return;   // màn hình cảm ứng cũng bắn mouseenter giả sau cú chạm
    clear();
    timer = setTimeout(show, 5000);
  });
  el.addEventListener('mouseleave', clear);
  function show(){
    timer = null;
    // append to #game root (the shelf scrolls/clips) and position in 1280x720 game coords
    const gr = G.getBoundingClientRect(), cr = el.getBoundingClientRect();
    const scale = gr.width / 1280;
    const cx = (cr.left + cr.width/2 - gr.left) / scale;
    const top = (cr.top - gr.top) / scale;
    bub = document.createElement('div');
    bub.className = 'chemfact';
    bub.innerHTML = '<b>'+ico('book',12)+' Bạn có biết?</b>'+fact;
    const bx = Math.max(12 + 75 - BX, Math.min(1280 + BX - 12 - 75, cx)); // clamp vào mép màn hình (tủ bám mép phải): bubble is 150 wide
    bub.style.cssText = 'left:'+Math.round(bx)+'px;top:'+Math.round(top-6)+'px;bottom:auto;transform:translate(-50%,-100%)';
    bub.style.setProperty('--arrow', 'calc(50% + '+Math.round(cx-bx)+'px)'); // arrow points at the chem
    G.appendChild(bub);
  }
}
// loại con trỏ vừa dùng: 'mouse' | 'touch' | 'pen' — để bỏ qua mouseenter giả trên màn hình cảm ứng
let lastPointer = 'mouse';
addEventListener('pointerdown', e => { lastPointer = e.pointerType; }, true);
// trình duyệt điện thoại chỉ cho phát tiếng sau cú chạm đầu tiên — mở khoá âm thanh lúc đó
['pointerdown','touchend','keydown'].forEach(ev => addEventListener(ev, () => SFX.unlock(), {once:true, capture:true}));
/* Đồ trang trí: KHÔNG nhãn, KHÔNG bấm được — bàn ngày 1 đỡ trống mà không đẻ ra
   hệ dụng cụ thứ hai. Giá đỡ vòng + giá ống nghiệm đứng lùi về mép xa. */
function benchDressing(){
  return place({u:-0.66, t:0.05, w:146, h:94, z:-3, cls:'deco', art:sym('sym-tuberack',146,94)})
       + place({u:-0.34, t:0.02, w:52, h:70, z:-3, cls:'deco', art:sym('sym-erlenmeyer',52,70,'--lc:#bcd6b4')})
       ;
}
/* Mỗi dụng cụ nằm ở chỗ cất riêng hai bên thảm (xếp trong 3D, L3.slots): thứ hay dùng ở mép gần, thứ ít dùng
   lùi về sau. Ngày nào không có dụng cụ đó thì chỗ của nó để trống — chỗ của các thứ khác không xê dịch. */
function benchTools(day){
  const list = ['rod'].concat(TOOL_ORDER.filter(t => day.tools.includes(t)));
  TOOLPOS = {};
  return list.map(key => {
    const tl = TOOLBOX[key], sl = L3.slots[key];
    const sx = key === 'filter' ? 498 : key === 'gas' ? 414 : sl.x;
    // đồ cất ngoài thảm nhỏ đi 20%; riêng bình khí ngày có muôi đốt (kiêm LỌ KHÍ để đốt) to hơn 20% cho dễ thả muôi vào
    const big = key === 'gas' && day.tools.includes('burn') ? 1.2 : 1;
    const q = TOOLPOS[key] = {x:sx, y:sl.y, k:sl.ppm/1000*SIDE*big, z:zAt(sl.y) + 20};
    // có muôi đốt thì bình khí kiêm lọ khí (thả bình O₂/Cl₂ vào để nạp, thả muôi đang cháy vào để đốt)
    const dz = key === 'gas' ? (day.tools.includes('burn') ? 'jar' : undefined)
             : key === 'heat' ? (day.tools.includes('burn') ? tl.dz : undefined) : tl.dz;
    return place3({sid:tl.cat, an:tl.an || 'rest', x:q.x, y:q.y, k:q.k, z:q.z, id:'tool_'+key, svgId:'sv_'+key, shw:tl.shw,
                   style:tl.style, cls:'grab', dz, title:tl.label});   // không còn tag tên: tên hiện khi rê chuột
  }).join('');
}

/* Ván tủ hoá chất (2.5 ngăn, tự cuộn khi nhiều chất) & đồng bộ chỉ báo cuộn */
function updateShelfScrollUI(){
  const sh = G.querySelector('.shelf'), g = G.querySelector('.shgrid');
  if(!sh || !g) return;
  const maxScroll = g.scrollHeight - g.clientHeight;
  const can = maxScroll > 3;
  sh.classList.toggle('can-scroll', can);
  sh.classList.toggle('has-more-up', can && g.scrollTop > 4);
  sh.classList.toggle('has-more-down', can && g.scrollTop < maxScroll - 4);
}
function shelfBoards(){
  const g = G.querySelector('.shgrid'); if(!g) return;
  g.querySelectorAll('.shboard').forEach(b => b.remove());
  const rows = [...new Set([...g.querySelectorAll('.chem')].map(c => c.offsetTop + c.offsetHeight))].sort((a, b) => a - b);
  if(!rows.length){ updateShelfScrollUI(); return; }
  if(rows.length === 1 && rows[0] + 114 < g.clientHeight - 16){
    rows.push(rows[0] + 114);   // tủ chỉ có 1 hàng lọ: vẫn giữ ván ngăn 2 cho cân đối
  }
  g.insertAdjacentHTML('beforeend', rows.map(y => '<i class="shboard" style="top:' + (y - 11) + 'px"></i>').join(''));
  updateShelfScrollUI();
}
/* =====================  CỐC TO (Cài đặt → "Cốc phóng to", lab.big)  =====================
   Kiểu app "một cái cốc một màn hình": cột giữa, từ dưới bảng HUD tới đáy màn, thành một KHUNG TRUYỆN TRANH cắt dán — nền màu
   tường, mép bàn ngang, cốc 400 mL vẽ phẳng nhìn thẳng (đáy bo tròn, có miệng rót) ngồi trên mép bàn; dụng cụ vẽ phẳng trên mặt
   bàn: đũa khuấy, đèn cồn (đun: cốc nhấc lên kiềng, đèn chui vào dưới), NẮP. Bấm dụng cụ = dùng / thôi dùng, hoặc kéo vào cốc;
   bấm nắp đang đậy hay đèn dưới cốc là tháo ra.
   Không còn bình thu khí, phễu lọc, đĩa lọc: chất trong cốc tách thành ba LỚP theo trạng thái (bigPhases) — khí (đậy nắp thì khí
   sinh ra ở lại trong cốc, vẫn phản ứng tiếp được; mở nắp là bay hết), lỏng (nước + chất tan), rắn (kết tủa, chất chưa tan, chất
   rắn trong cốc khô). Kéo một lớp sang khay khách = giao lớp đó, sang bồn rửa = đổ lớp đó. Chất CÙNG LỚP trộn lẫn vào nhau nên
   phải cho đúng tỉ lệ: checkServe vẫn bắt "lẫn chất", "nhiều / ít quá" như cũ.
   Bàn phối cảnh vẫn chạy ngầm phía sau (ẩn bằng .bigmode): luật hoá học giữ nguyên, khung chỉ VẼ trạng thái lab (syncBig,
   paintBig) và gọi đúng các hàm cũ (setHeat, setCatch…). Hiệu ứng rót / sủi bọt / kết tủa / phương trình / vòng khuấy neo theo
   beakerGeo() và beakerBox(), nên hai hàm đó trả hình học cốc to (bigGeo) là đủ.
   Ngày có muôi đốt hay điện phân (đốt trong lọ khí, điện cực) — kể cả ca tự do — chưa có ở khung này: dùng bàn thường (newLab). */
const BIGP = {l:412, t:64, w:556, h:656, table:498};   // khung (toạ độ màn hình); table: mép bàn, y trong khung
const BIG_H = 360, BIG_LIFT = 72, BIG_R = 34;            // cốc cao; đun thì nhấc lên chừng này (lên lưới kiềng); bán kính góc đáy
const BIG_CUP = {x:99, w:330};                           // cốc: mép trái trong khung, bề rộng
const bigTop = () => BIGP.table - 6 - BIG_H - (lab.heaterOn ? BIG_LIFT : 0);   // mép trên thân cốc, trong khung
const BIG_ROW = 632, BIG_SLOT = {rod:120, heat:278, lid:436};   // dụng cụ trên mặt bàn: đáy chung, tâm x từng chỗ
// lòng cốc (toạ độ thân cốc): đáy trong, và chiều cao ứng với mức đầy nhất của thang cũ (196) — mặt nước / lớp rắn tính theo đây
const BIG_FLOOR = BIG_H - 7, BIG_FILL = BIG_H - 7 - 26;
// ---- ba lớp chất ----
const PH_NAME = {gas:'khí', liquid:'lỏng', solid:'rắn'}, PH_SEL = {gas:'gas', liquid:'beaker', solid:'solid'};
const bigWet = () => Object.keys(lab.mix).some(f => lab.mix[f] > 0 && (CHEMS[f].s === 'l' || CHEMS[f].s === 'd'));
// chất f trong lab.mix thuộc lớp nào: chất rắn tan mà cốc khô thì vẫn là chất rắn; có nước thì nó tan vào lớp lỏng
const bigPhaseOf = (f, wet) => CHEMS[f].s === 'k' ? 'gas' : isPrecip(f) || (CHEMS[f].s === 'r' && !wet) ? 'solid' : 'liquid';
function bigPhases(){
  const P = {gas:{}, liquid:{}, solid:{}}, wet = bigWet(), und = lab.undissolved;
  Object.keys(lab.mix).forEach(f => { if(lab.mix[f] > 0) P[bigPhaseOf(f, wet)][f] = lab.mix[f]; });
  Object.keys(und).forEach(f => { if(und[f] > 0) P.solid[f] = RQ((P.solid[f] || 0) + und[f]); });   // chưa tan: nằm dưới đáy
  return P;
}
// màu của một lớp: chất nhiều nhất (lớp lỏng bỏ qua nước — nước trong thì màu nước)
const bigColor = (p, ph) => { let best = null;
  Object.keys(p).forEach(f => { if(ph === 'liquid' && f === 'H2O') return; if(!best || p[f] > p[best]) best = f; });
  return best ? CHEMS[best].c : ph === 'liquid' ? '#cfe6f2' : '#ddd'; };
// lấy hết một lớp ra khỏi cốc (giao xong / đổ bồn)
function bigTake(ph){
  const wet = bigWet();
  Object.keys(lab.mix).forEach(f => { if(bigPhaseOf(f, wet) === ph) delete lab.mix[f]; });
  if(ph === 'solid'){ lab.undissolved = {}; lab.dissolveTotal = 0; }
  if(ph === 'liquid'){ lab.dac = {}; lab.waterIn = false; lab.steam = false; }
  if(!tot(lab.mix) && !tot(lab.undissolved)) lab.firstPour = null;
  lab.lastWhy = '';
}
function servePhase(ph){ serve({cont:bigPhases()[ph], sel:PH_SEL[ph], take:() => bigTake(ph)}); }
function dumpPhase(ph){
  if(!tot(bigPhases()[ph])) return;
  bigTake(ph);
  const sk = G.querySelector('#sinksvg');
  if(sk){ sk.style.setProperty('--splash', 1); setTimeout(() => sk.style.setProperty('--splash', 0), 800); }
  SFX.splash(); toast('Đã đổ phần ' + PH_NAME[ph] + ' ra bồn.');
  updateBeaker();
}
// cốc không đậy nắp: khí trong cốc bay ra hết (mở nắp, hay rót / tạo khí khi chưa đậy)
function bigVent(why){
  const ks = Object.keys(lab.mix).filter(f => CHEMS[f].s === 'k' && lab.mix[f] > 0);
  if(!ks.length) return;
  ks.forEach(f => delete lab.mix[f]);
  bigWord('XÌ!', '#dfe7ea');
  notify(why + ' — khí ' + ks.map(sub).join(', ') + ' bay mất.');
}
// hình học cốc to trên màn hình — cùng dạng beakerGeo(): tâm, miệng, đáy lòng cốc, nửa bề rộng lòng, mặt chất lỏng / chất rắn
function bigGeo(){
  const c = BIG_CUP, top = BIGP.t + bigTop(), floor = top + BIG_FLOOR;
  return {x: BIGP.l + c.x + c.w/2, mouth: top + 4, floor, rx: c.w/2 - 16, ry: 5,
          surf: lab.bbL ? floor - lab.bbL * BIG_FILL : null, solid: floor - (lab.bbS || 0) * BIG_FILL, z: 56};
}
const inBig = p => { const g = bigGeo(); return Math.abs(p.x - g.x) < g.rx + 8 && p.y > g.mouth && p.y < g.floor; };
const BIG_INK = '#3b3025', BIG_GL = '#eef8fa';
// đèn cồn vẽ phẳng, gốc toạ độ ở giữa đáy đèn; cap: nắp chụp bấc (lúc cất), flame: lửa (lúc đun)
const bigLampArt = (cap, flame) =>
  '<path d="M-40,0 Q-46,-34 -16,-46 L-16,-54 L16,-54 L16,-46 Q46,-34 40,0 Z" fill="' + BIG_GL + '" stroke="' + BIG_INK + '" stroke-width="4" stroke-linejoin="round"/>'
  + '<path d="M-36,-5 Q-40,-21 -32,-25 L32,-25 Q40,-21 36,-5 Z" fill="#cdbfe6" opacity=".8"/>'
  + '<path d="M-30,-38 Q-24,-42 -18,-42" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>'
  + '<rect x="-12" y="-63" width="24" height="10" rx="2" fill="#b8bcc2" stroke="' + BIG_INK + '" stroke-width="3"/>'
  + '<rect x="-3.5" y="-73" width="7" height="11" rx="2" fill="#f1e6c8" stroke="' + BIG_INK + '" stroke-width="2.5"/>'
  + (cap ? '<path d="M-16,-55 L-16,-74 Q0,-92 16,-74 L16,-55 Z" fill="' + BIG_GL + '" stroke="' + BIG_INK + '" stroke-width="4" stroke-linejoin="round"/>' : '')
  + (flame ? '<g class="bp-flame"><path d="M0,-70 C-17,-80 -13,-104 0,-124 C13,-104 17,-80 0,-70 Z" fill="#ffb347" stroke="#d9634f" stroke-width="3" stroke-linejoin="round"/>'
           + '<path d="M0,-74 C-8,-81 -6,-95 0,-105 C6,-95 8,-81 0,-74 Z" fill="#fff1a8"/></g>' : '');
// nắp kính phẳng: tấm đậy rộng w (thò ra hai bên miệng cốc), núm cầm ở giữa; gốc toạ độ ở giữa mép dưới tấm đậy
const bigLidArt = w => '<rect x="' + (-w/2 - 12) + '" y="-18" width="' + (w + 24) + '" height="16" rx="8" fill="' + BIG_GL + '" stroke="' + BIG_INK + '" stroke-width="4"/>'
  + '<path d="M' + (-w/2) + ',-12 L' + (w/2 - 30) + ',-12" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>'
  + '<path d="M-22,-17 L-16,-34 Q0,-40 16,-34 L22,-17 Z" fill="' + BIG_GL + '" stroke="' + BIG_INK + '" stroke-width="4" stroke-linejoin="round"/>';
const BIG_ART = {
  rod:  '<svg viewBox="0 0 96 52" aria-hidden="true"><path d="M8,44 L88,8" stroke="' + BIG_INK + '" stroke-width="9" stroke-linecap="round"/><path d="M8,44 L88,8" stroke="' + BIG_GL + '" stroke-width="4.5" stroke-linecap="round"/></svg>',
  rodV: '<svg width="18" height="160" viewBox="0 0 18 160" aria-hidden="true"><path d="M9,6 L9,154" stroke="' + BIG_INK + '" stroke-width="9" stroke-linecap="round"/><path d="M9,6 L9,154" stroke="' + BIG_GL + '" stroke-width="4.5" stroke-linecap="round"/></svg>',
  lamp: '<svg viewBox="-50 -96 100 100" aria-hidden="true">' + bigLampArt(true, false) + '</svg>',
  lid:  '<svg viewBox="-62 -44 124 46" aria-hidden="true">' + bigLidArt(96) + '</svg>'
};
// hình một lớp chất đang cầm trên tay (kéo ra khỏi cốc): giọt lỏng, đám khí, đụn chất rắn — tô màu của lớp
const BIG_BLOB = {
  liquid: [70, 84, c => '<path d="M35,5 C35,5 9,40 9,57 A26,26 0 0 0 61,57 C61,40 35,5 35,5 Z" fill="' + c + '" stroke="' + BIG_INK + '" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M22,52 Q22,40 30,30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".75"/>'],
  gas: [96, 66, c => '<path d="M22,56 A16,16 0 0 1 18,25 A20,20 0 0 1 54,15 A19,19 0 0 1 83,31 A13,13 0 0 1 79,56 Z" fill="' + c + '" fill-opacity=".75" stroke="' + BIG_INK + '" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M30,26 A12,12 0 0 1 46,20" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>'],
  solid: [88, 54, c => '<path d="M6,50 Q12,24 28,27 Q36,9 52,17 Q70,10 74,29 Q86,33 82,50 Z" fill="' + c + '" stroke="' + BIG_INK + '" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<circle cx="34" cy="38" r="2.4" fill="#000" opacity=".18"/><circle cx="56" cy="32" r="2" fill="#fff" opacity=".5"/><circle cx="62" cy="42" r="2.2" fill="#000" opacity=".18"/>']
};
const bigBlobSVG = (ph, col) => { const [w, h, art] = BIG_BLOB[ph];
  return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" overflow="visible" aria-hidden="true">' + art(col) + '</svg>'; };
// mặt lớp chất rắn lắng ở đáy cốc to: gợn lổn nhổn, luôn đủ 12 đoạn để `d` chuyển mượt khi dày lên / mỏng đi
const bigSedPath = (W, y) => { let d = 'M0,' + (BIG_H + 4) + ' L0,' + y.toFixed(1);
  for(let i = 0; i < 12; i++){ const x0 = W*i/12, x1 = W*(i + 1)/12;
    d += ' Q' + ((x0 + x1)/2).toFixed(1) + ',' + (y - (i % 3 === 1 ? 7 : 3)).toFixed(1) + ' ' + x1.toFixed(1) + ',' + y.toFixed(1); }
  return d + ' L' + W + ',' + (BIG_H + 4) + ' Z'; };
// cốc to vẽ phẳng, toạ độ thân cốc 0..W × 0..BIG_H: thành thẳng, hai góc đáy bo tròn, vành miệng loe nhẹ, miệng rót bên trái.
// Phần trên thân cốc là chỗ của nắp.
function bigCupSVG(W){
  const H = BIG_H, R = BIG_R, cx = W/2, i = 7;
  const outer = 'M0,20 L0,' + (H - R) + ' Q0,' + H + ' ' + R + ',' + H + ' L' + (W - R) + ',' + H + ' Q' + W + ',' + H + ' ' + W + ',' + (H - R)
    + ' L' + W + ',4 Q' + W + ',-3 ' + (W + 7) + ',-4 L8,-4 Q-6,-5 -22,-15 Q-12,3 0,20 Z';
  const inner = 'M' + i + ',8 L' + i + ',' + (H - R) + ' Q' + i + ',' + (H - i) + ' ' + R + ',' + (H - i) + ' L' + (W - R) + ',' + (H - i)
    + ' Q' + (W - i) + ',' + (H - i) + ' ' + (W - i) + ',' + (H - R) + ' L' + (W - i) + ',8 Z';
  let marks = '';   // vạch chia mỗi 50 mL, ghi số ở 100 / 200 / 300
  for(let k = 1; k <= 7; k++){ const y = BIG_FLOOR - k*BIG_FILL/8, long = k % 2 === 0;
    marks += '<path d="M' + (W - (long ? 54 : 34)) + ',' + y.toFixed(1) + ' L' + (W - 14) + ',' + y.toFixed(1) + '" stroke="' + BIG_INK + '" stroke-width="3" stroke-linecap="round" opacity=".55"/>'
      + (long ? '<text class="bp-ml" x="' + (W - 60) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="end">' + k*50 + '</text>' : ''); }
  let wave = 'M-60,0';   // mặt chất lỏng gợn sóng, chu kỳ 60 — nhóm bp-wave trượt ngang đúng 60 nên lặp không thấy nối
  for(let x = -60; x < W + 60; x += 60) wave += ' q15,-3 30,0 q15,3 30,0';
  const drops = [[16, 44], [24, 70], [W - 20, 52], [W - 30, 82], [W - 18, 104]].map(([x, y]) =>
    '<path d="M' + x + ',' + y + ' q-3,5 0,9 q3,-4 0,-9 Z" fill="#fff" stroke="' + BIG_INK + '" stroke-width="1.5" opacity=".8"/>').join('');
  const wisps = [-60, 0, 60].map((dx, k) => '<path class="bp-wisp" style="animation-delay:' + (k*.5) + 's" d="M' + (cx + dx) + ',-16 q-9,-14 0,-28 q9,-14 0,-28" fill="none" stroke="' + BIG_INK + '" stroke-width="3" stroke-linecap="round" opacity=".35"/>').join('');
  const puffs = [[.25, .35, 16], [.62, .55, 20], [.42, .78, 13]].map(([u, v, r], k) =>   // đám khí trôi lờ đờ trong lớp khí
    '<circle class="bp-puff" style="animation-delay:' + (-k*1.3) + 's" cx="' + (W*u).toFixed(0) + '" cy="0" r="' + r + '" data-v="' + v + '" fill="none" stroke="' + BIG_INK + '" stroke-width="2" opacity=".3"/>').join('');
  return '<svg width="100%" height="100%" viewBox="-30 -56 ' + (W + 44) + ' ' + (H + 62) + '" aria-hidden="true"><defs>'
    + '<clipPath id="bpclip"><path d="' + inner + '"/></clipPath>'
    + '<pattern id="bpdots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1.4" fill="#000" opacity=".2"/><circle cx="6.5" cy="7" r="1.1" fill="#fff" opacity=".35"/></pattern>'
    + '<pattern id="bpgasdots" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="4" cy="4" r="1.5" fill="' + BIG_INK + '" opacity=".16"/></pattern></defs>'
    + '<path d="' + outer + '" fill="' + BIG_GL + '" fill-opacity=".45"/>'
    + '<g clip-path="url(#bpclip)">'
    // lớp khí (dưới nắp, trên mặt chất lỏng / lớp rắn): nhuộm màu khí + chấm halftone + vài đám khí trôi
    +   '<g id="bp-gasg" class="bp-ph" data-ph="gas" style="pointer-events:none;opacity:0"><rect id="bp-gasr" x="0" y="8" width="' + W + '" height="0"/>'
    +     '<rect id="bp-gasd" x="0" y="8" width="' + W + '" height="0" fill="url(#bpgasdots)"/><g id="bp-puffs">' + puffs + '</g></g>'
    // lớp lỏng: khối nước gợn sóng, trượt lên xuống theo mực nước
    +   '<g id="bp-liqg" class="bp-ph" data-ph="liquid" style="transform:translateY(' + (H + 6) + 'px);opacity:0;pointer-events:none"><g class="bp-wave">'
    +     '<path class="bp-lf" d="' + wave + ' L' + (W + 60) + ',' + (H + 20) + ' L-60,' + (H + 20) + ' Z" fill="#cfe6f2"/>'
    +     '<path d="' + wave + '" transform="translate(0,4)" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>'
    +     '<path d="' + wave + '" fill="none" stroke="' + BIG_INK + '" stroke-width="2.5" opacity=".45"/></g></g>'
    // lớp rắn: vẽ SAU lớp lỏng để bấm vào đáy cốc là cầm được chất rắn
    +   '<g id="bp-sedg" class="bp-ph" data-ph="solid" style="pointer-events:none">'
    +     '<path id="bp-sed" d="' + bigSedPath(W, H + 4) + '" fill="#ddd" stroke="' + BIG_INK + '" stroke-width="2.5" stroke-opacity=".5"/>'
    +     '<path id="bp-sedtex" d="' + bigSedPath(W, H + 4) + '" fill="url(#bpdots)"/></g>'
    +   '<g id="bp-swirl" pointer-events="none"></g>'   // vệt đổi màu loang: không được che lớp chất đang bấm
    + '</g>'
    + '<g id="bp-drops" opacity="0" pointer-events="none">' + drops + '</g>'
    + '<rect x="15" y="26" width="10" height="' + (H - 110) + '" rx="5" fill="#fff" opacity=".75" pointer-events="none"/>'
    + '<rect x="31" y="36" width="4" height="' + (H - 170) + '" rx="2" fill="#fff" opacity=".55" pointer-events="none"/>'
    + '<g pointer-events="none">' + marks + '</g>'
    + '<path class="bp-out" d="' + outer + '" fill="none" stroke="' + BIG_INK + '" stroke-width="5" stroke-linejoin="round"/>'
    + '<path d="M3,5 L' + (W - 2) + ',5" stroke="' + BIG_INK + '" stroke-width="2.5" opacity=".4"/>'
    + '<g id="bp-steam" class="bp-part">' + wisps + '</g>'
    + '<g id="bp-lidg" class="bp-part"><g transform="translate(' + cx + ',-3)">' + bigLidArt(W) + '</g></g>'
    + '</svg>';
}
// đun: kiềng (lưới amiăng ngay dưới đáy cốc lúc nhấc) + đèn cồn mở nắp, lửa liếm lưới; toạ độ trong khung
function bigHeatSVG(cx){
  const g = BIGP.table - 6 - BIG_LIFT, T = BIGP.table;
  const leg = (x1, x2, front) => '<path d="M' + x1 + ',' + (g + 9) + ' L' + x2 + ',' + T + '" stroke="' + BIG_INK + '" stroke-width="' + (front ? 9 : 7) + '" stroke-linecap="round"/>'
    + '<path d="M' + x1 + ',' + (g + 9) + ' L' + x2 + ',' + T + '" stroke="' + (front ? '#9a9da3' : '#7d8086') + '" stroke-width="' + (front ? 4 : 3) + '" stroke-linecap="round"/>';
  let hatch = '';
  for(let x = cx - 140; x < cx + 145; x += 12) hatch += '<path d="M' + x + ',' + (g + 2) + ' l5,7" stroke="' + BIG_INK + '" stroke-width="1.2" opacity=".35"/>';
  return '<svg class="bp-heat" width="' + BIGP.w + '" height="' + BIGP.h + '" viewBox="0 0 ' + BIGP.w + ' ' + BIGP.h + '" aria-hidden="true">'
    + leg(cx, cx, false)
    + '<g class="bp-lamp" transform="translate(' + cx + ',' + T + ') scale(.8)">' + bigLampArt(false, true) + '</g>'   // đèn nhỏ hơn chút cho vừa gầm kiềng
    + '<rect x="' + (cx - 150) + '" y="' + g + '" width="300" height="10" rx="3" fill="#d9d2c3" stroke="' + BIG_INK + '" stroke-width="3.5"/>' + hatch
    + leg(cx - 118, cx - 150, true) + leg(cx + 118, cx + 150, true)
    + '</svg>';
}
function bigPanelHTML(){
  const {w, h, table} = BIGP, c = BIG_CUP, W = c.w, cx = c.x + W/2, has = t => lab.day.tools.includes(t);
  const tool = (key, title, tw, th) => '<div class="bp-tool" id="bpt_' + key + '" title="' + title + '" style="left:' + (BIG_SLOT[key] - tw/2) + 'px;top:'
    + (BIG_ROW - th) + 'px;width:' + tw + 'px;height:' + th + 'px">' + BIG_ART[key === 'heat' ? 'lamp' : key] + '</div>';
  let grain = '';   // vân gỗ mặt bàn
  [[table + 22, 3, 0], [table + 62, 4, 1], [table + 112, 5, 0]].forEach(([y, a, ph]) => { let d = 'M-20,' + y;
    for(let x = -20, i = ph; x < w + 20; x += 110, i++) d += ' q55,' + (i % 2 ? a : -a) + ' 110,0';
    grain += '<path d="' + d + '" fill="none" stroke="#754d26" stroke-width="1.4" opacity=".16"/>'; });
  const bg = '<svg class="bp-bg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><defs>'
    + '<linearGradient id="bpwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5edd9"/><stop offset=".65" stop-color="#ede1c7"/><stop offset="1" stop-color="#e5d6b8"/></linearGradient>'
    + '<linearGradient id="bptable" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8ac77"/><stop offset="1" stop-color="#b8874f"/></linearGradient></defs>'
    + '<rect width="' + w + '" height="' + table + '" fill="url(#bpwall)"/>'
    + '<rect y="' + table + '" width="' + w + '" height="' + (h - table) + '" fill="url(#bptable)"/>'
    + [40, 88, 146].map(d => '<path d="M0,' + (table + d) + ' L' + w + ',' + (table + d) + '" stroke="#6e4b28" stroke-width="1.5" opacity=".22"/>').join('') + grain
    + '<path d="M0,' + table + ' L' + w + ',' + table + '" stroke="' + BIG_INK + '" stroke-width="4"/>'
    + '<path d="M0,' + (table + 4) + ' L' + w + ',' + (table + 4) + '" stroke="#f4d3a1" stroke-width="2" opacity=".7"/>'
    + '<rect x="2.5" y="2.5" width="' + (w - 5) + '" height="' + (h - 5) + '" fill="none" stroke="' + BIG_INK + '" stroke-width="5"/></svg>';
  return '<div class="bigpanel" id="bigpanel" style="left:' + BIGP.l + 'px;top:' + BIGP.t + 'px;width:' + w + 'px;height:' + h + 'px">' + bg
    + (has('heat') ? bigHeatSVG(cx) : '')
    + '<div class="bp-cup" id="bigBeaker" data-dz="beaker" style="left:' + (c.x - 30) + 'px;top:' + (table - 6 - BIG_H - 56) + 'px;width:' + (W + 44) + 'px;height:' + (BIG_H + 62) + 'px">'
    +   bigCupSVG(W) + '</div>'
    + tool('rod', 'Đũa khuấy — bấm để khuấy, hoặc kéo vào cốc rồi khuấy tròn', 96, 52)
    + (has('heat') ? tool('heat', 'Đèn cồn — bấm (hoặc kéo vào cốc) để đun, bấm lần nữa để tắt', 80, 80) : '')
    + (has('gas') ? tool('lid', 'Nắp — đậy cốc thì khí sinh ra ở lại trong cốc; mở nắp là khí bay mất', 104, 40) : '')
    + '</div>';
}
// gắn kéo–thả / bấm cho khung (gọi sau khi renderLab dựng xong bàn)
function bigBindings(){
  const P = G.querySelector('#bigpanel'); if(!P) return;
  const cup = P.querySelector('#bigBeaker'), bgw = BK.w*KB*0.8, bgh = BK.h*KB*0.8;
  cup.style.setProperty('--lift', -BIG_LIFT + 'px');   // .bp-cup.hot nhấc đúng chừng này (CSS)
  /* Một chỗ bấm, ba thứ để cầm: bấm trúng một LỚP chất thì cầm lớp đó (khay khách = giao lớp đó, bồn = đổ lớp đó);
     bấm thành cốc thì cầm cả cốc; bấm nắp đang đậy thì mở nắp. Bắt lúc pointerdown (pha capture, chạy trước dragify) để đổi
     hình đang cầm và cỡ của nó cho đúng thứ vừa nhấc. */
  let held = null, lidHit = false;
  const opts = {w:bgw, h:bgh,
    ghostHTML: () => held ? bigBlobSVG(held, bigColor(bigPhases()[held], held))
                          : G.querySelector('#beakersvg').outerHTML.replace('width="100%" height="100%"', 'width="'+bgw+'" height="'+bgh+'"'),
    onDrop: zone => { if(zone !== 'cust' && zone !== 'sink') return;
      if(!held) dropAction('beaker', zone);                     // cả cốc: khay khách = giao, bồn rửa = đổ hết
      else if(zone === 'cust') servePhase(held); else dumpPhase(held); },
    onClick: () => { if(lidHit) setCatch(false); }};
  cup.addEventListener('pointerdown', e => {
    const t = e.target.closest ? e.target : null;
    lidHit = !!(t && t.closest('#bp-lidg'));
    const ph = t && t.closest('[data-ph]');
    held = ph ? ph.dataset.ph : null;
    [opts.w, opts.h] = held ? BIG_BLOB[held] : [bgw, bgh];
    cup.dataset.held = held || '';   // CSS: cầm một lớp thì chỉ lớp đó mờ đi, cốc vẫn rõ
  }, true);
  dragify(cup, 'beaker', opts);
  const tl = (key, type, o) => { const el = P.querySelector('#bpt_' + key); if(!el) return;
    dragify(el, type, Object.assign({w:parseFloat(el.style.width), h:parseFloat(el.style.height), ghostHTML: () => el.innerHTML}, o)); };
  tl('rod', 'rod', {w:18, h:160, ghostHTML: () => BIG_ART.rodV, onClick: stirOnce});
  tl('heat', 'lamp', {onClick: () => lab.heaterOn ? setHeat(false) : dropAction('lamp', 'beaker'),
                      onLoose: () => { if(lab.heaterOn){ setHeat(false); return true; } return false; }});
  tl('lid', 'lid', {onClick: () => setCatch(!lab.catcher), onDrop: () => setCatch(true)});
  const lamp = P.querySelector('.bp-lamp'); if(lamp) lamp.addEventListener('click', () => setHeat(false));
  syncBig();
}
// trạng thái lab → khung: đun (cốc nhấc lên kiềng), nắp, hơi nước
function syncBig(){
  const P = G.querySelector('#bigpanel'); if(!P || !lab) return;
  P.classList.toggle('heat', !!lab.heaterOn); P.classList.toggle('lid', !!lab.catcher);
  P.classList.toggle('steam', !!lab.heaterOn && (bigWet() || !!lab.steam));
  P.querySelector('#bigBeaker').classList.toggle('hot', !!lab.heaterOn);
}
// chất trong cốc → cốc to: lớp rắn, lớp lỏng gợn sóng, lớp khí dưới nắp, hơi nước đọng, vệt đổi màu loang
function paintBig(){
  const cup = G.querySelector('#bigBeaker'); if(!cup) return;
  const W = BIG_CUP.w, P = bigPhases(), liq = tot(P.liquid), pre = tot(P.solid), gas = tot(P.gas);
  const lc = bigColor(P.liquid, 'liquid'), clear = !Object.keys(P.liquid).some(f => f !== 'H2O');
  // cùng thang mức với cốc trên thảm (cao 196): lớp rắn dày theo lượng, mặt nước luôn nằm trên mặt lớp rắn
  const PH = pre ? Math.min(7 + pre*8, 54) : 0, HL = liq ? Math.max(Math.min(30 + liq*15, 196), PH + 3) : 0;
  lab.bbL = HL/196; lab.bbS = PH/196;
  const ys = BIG_FLOOR - lab.bbL*BIG_FILL, yp = BIG_FLOOR - lab.bbS*BIG_FILL;
  const lg = cup.querySelector('#bp-liqg');
  lg.style.transform = 'translateY(' + (liq ? ys : BIG_H + 6).toFixed(1) + 'px)';
  lg.style.opacity = liq ? (clear ? .6 : .82) : 0; lg.style.pointerEvents = liq ? 'auto' : 'none';
  cup.querySelector('.bp-lf').style.fill = lc;
  const sd = 'path("' + bigSedPath(W, pre ? yp : BIG_H + 4) + '")';
  cup.querySelector('#bp-sed').style.d = sd; cup.querySelector('#bp-sedtex').style.d = sd;
  cup.querySelector('#bp-sed').style.fill = bigColor(P.solid, 'solid');
  cup.querySelector('#bp-sedg').style.pointerEvents = pre ? 'auto' : 'none';
  // lớp khí: từ dưới miệng cốc xuống tới mặt nước (hay mặt lớp rắn, đáy cốc)
  const gg = cup.querySelector('#bp-gasg'), gb = (liq ? ys - 3 : pre ? yp - 5 : BIG_FLOOR), gh = Math.max(0, gb - 8).toFixed(1);
  gg.style.opacity = gas ? 1 : 0; gg.style.pointerEvents = gas ? 'auto' : 'none';
  cup.querySelector('#bp-gasr').setAttribute('height', gh); cup.querySelector('#bp-gasd').setAttribute('height', gh);
  cup.querySelector('#bp-gasr').style.fill = bigColor(P.gas, 'gas');
  cup.querySelector('#bp-gasr').style.opacity = Math.min(.55, .25 + gas*.06).toFixed(2);
  cup.querySelectorAll('.bp-puff').forEach(c => c.setAttribute('cy', (8 + (gb - 8) * c.dataset.v).toFixed(1)));
  cup.querySelector('#bp-drops').setAttribute('opacity', lab.heaterOn && (liq || lab.steam) ? 1 : 0);
  if(liq && lc !== lab.bbColor && lab.bbColor){
    const sw = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sw.setAttribute('cx', W/2); sw.setAttribute('cy', ((ys + BIG_FLOOR)/2).toFixed(1)); sw.setAttribute('r', (W*.12).toFixed(1));
    sw.setAttribute('class', 'bkswirl'); sw.style.fill = lc;
    cup.querySelector('#bp-swirl').appendChild(sw); setTimeout(() => sw.remove(), 950);
  }
  lab.bbColor = liq ? lc : '';
  syncBig();
}
// chữ tượng thanh kiểu truyện tranh bật ra cạnh cốc (chỉ khi bật cốc to; mỗi lúc một chữ)
function bigWord(txt, col){
  if(!lab || !lab.big || !G.querySelector('#bigBeaker')) return;
  G.querySelectorAll('.bb-word').forEach(x => x.remove());
  const bx = beakerBox(), w = document.createElement('div');
  w.className = 'bb-word'; w.textContent = txt; w.style.color = col;
  w.style.left = (bx.cx + bx.w/2 + 26) + 'px'; w.style.top = (bx.top + (bx.bot - bx.top)*.4) + 'px';
  G.appendChild(w); w.onanimationend = () => w.remove();
}
// một nhát khuấy (bấm đũa): còn chất chưa tan thì tan thêm, không thì lắc cốc cho phản ứng chạy
function stirOnce(){
  if(tot(lab.undissolved) > 0){ dissolveStep(); return; }
  wiggleBeaker(); SFX.pour(); if(!runReactions()) explainNoRx(); updateBeaker();
}
// lời dặn dụng cụ khi dùng cốc to (thay TOOL_TIP của bàn thường)
const BIG_TIP = {
  heat:   'Mới: <b>Đèn cồn</b>. Bấm đèn (hoặc kéo vào cốc) để đun — cốc nhấc lên kiềng. Bấm lần nữa để tắt.',
  gas:    'Mới: <b>Nắp</b>. Đậy lên cốc <b>trước khi</b> phản ứng sinh khí — khí ở lại trong cốc thành <b>lớp khí</b>. Mở nắp là khí bay mất.',
  filter: 'Không cần lọc: kết tủa nằm thành <b>lớp rắn</b> dưới đáy cốc. Kéo lớp rắn sang khách, hoặc kéo lớp lỏng ra bồn rửa để giữ lại chất rắn.'
};
const BIG_HINT = 'Kéo lọ từ <b>tủ hoá chất</b> vào cốc để rót. Kéo <b>lớp khí / lỏng / rắn</b> trong cốc sang khay khách để giao, sang <b>bồn rửa</b> để đổ.';
// gợi ý bước kế tiếp khi dùng cốc to: giao theo lớp, khí cần nắp, nung khô thì đổ lớp lỏng đi
function bigCoachText(){
  const day = lab.day, od = day.orders[lab.oi];
  if(!od || !CHEMS[od.chem]) return BIG_HINT;
  const t = od.chem, c = CHEMS[t];
  const want = c.s === 'k' ? 'gas' : isPrecip(t) || (c.s === 'r' && !od.water) ? 'solid' : 'liquid', ph = PH_NAME[want];
  const P = bigPhases(), keep = lab.sel; lab.sel = PH_SEL[want];
  const res = checkServe(P[want], od); lab.sel = keep;
  if(res === true) return 'Đủ rồi! Kéo <b>lớp ' + ph + '</b> trong cốc sang khay trước mặt khách.';
  if(!lab.goggles) return 'Trước khi lấy hoá chất: bấm <b>Kính & găng</b> để đeo đồ bảo hộ.';
  if(lab.hoodDay && !lab.hood) return 'Hôm nay có thể sinh khí độc (Cl₂, SO₂, NH₃) — bấm <b>Tủ hút</b> để bật trước đã.';
  if((P[want][t] || 0) > 0 && tot(lab.undissolved) === 0)
    return 'Đã có <b>' + sub(t) + '</b> trong lớp ' + ph + ' nhưng ' + res.text + '. Các chất cùng là ' + ph + ' trộn lẫn vào nhau — cho đúng tỉ lệ, '
      + 'hoặc kéo lớp ' + ph + ' ra <b>bồn rửa</b> làm lại.';
  const made = want === 'gas' && /\(.*\+/.test(od.pname || '');
  const at = f => (lab.mix[f] || 0) + (lab.undissolved[f] || 0);
  if(want === 'gas' && !lab.catcher) return 'Khách cần <b>khí</b>: kéo <b>nắp</b> đậy lên cốc trước đã — có nắp thì khí sinh ra ở lại trong cốc.';
  if(!made && day.chems.includes(t) && !(at(t) > 0)) return 'Bắt đầu bằng cách kéo lọ <b>' + sub(t) + '</b> từ tủ bên phải vào cốc.';
  if(od.water && !(lab.mix.H2O > 0) && day.chems.includes('H2O'))
    return 'Khách hỏi <b>dung dịch</b> chứ không phải chất khô — kéo thêm lọ <b>Nước</b> vào cốc.';
  // NUNG KHÔ: chất rắn phải nằm trong cốc không có nước — kéo lớp lỏng ra bồn, chất rắn ở lại đáy cốc
  const dr = !(at(t) > 0) && REACTIONS.find(r => r.dry && r.pr[t] && Object.keys(r.rg).every(f => dayHave(day).has(f))
    && Object.keys(r.rg).some(f => CHEMS[f].s === 'r' && at(f) > 0));
  if(dr){
    const s = '<b>' + Object.keys(dr.rg).filter(f => CHEMS[f].s === 'r').map(sub).join(' + ') + '</b>';
    if(bigWet()) return s + ' phải nung <b>khô</b> — kéo <b>lớp lỏng</b> trong cốc ra bồn rửa (chất rắn ở lại đáy cốc), rồi đun.';
    const gs = Object.keys(dr.rg).filter(f => CHEMS[f].s === 'k' && !(at(f) > 0));
    if(gs.length) return 'Còn thiếu khí <b>' + gs.map(sub).join(', ') + '</b> trong cốc — '
      + (lab.catcher ? 'tạo hoặc rót khí đó vào cốc đang đậy nắp.' : 'đậy <b>nắp</b> trước rồi hãy tạo / rót khí vào.');
    if(!lab.heaterOn) return 'Cốc khô rồi — bấm <b>đèn cồn</b> để nung ' + s + '.';
  }
  if(tot(lab.undissolved) > 0) return 'Còn chất chưa tan dưới đáy — kéo <b>đũa khuấy</b> vào cốc rồi khuấy tròn.';
  if(!tot(lab.mix)) return 'Cốc đang trống — kéo hoá chất từ <b>tủ bên phải</b> vào cốc để bắt đầu.';
  const why = whyNoReaction();
  if(why) return '<b>Giáo sư:</b> ' + why;
  return 'Chưa ra <b>' + sub(t) + '</b>. Thử rót thêm chất khác từ tủ' + (day.tools.includes('heat') ? ', hoặc bấm <b>đèn cồn</b> để đun' : '') + ' xem sao.';
}
function renderLab(){
  const day = lab.day;
  const has = t => day.tools.includes(t);
  const big = lab.big;   // cốc to: khung truyện tranh giữa màn (bigPanelHTML); giấy cân bằng, giấy nhớ… nổi lên trên khung, thu nhỏ ở hai góc
  const shelfHtml = day.chems.map(f => { const c = CHEMS[baseChem(f)], dac = f !== baseChem(f);
    // chế độ khó: lọ dung dịch ghi rõ nồng độ — phải biết Cₘ mới tính được thể tích cần đong
    const cm = lab.hard && SOL_CM[f] ? ' <small class="cm">'+fmt(SOL_CM[f],2)+'M</small>' : '';
    return '<div class="chem" data-f="'+f+'">' +
      '<div class="cc-tag" style="--stripe:'+stripeCol(f)+'"><span class="f">'+sub(baseChem(f))+(dac ? ' <small class="dac">đặc</small>' : '')+cm+'</span><span class="nm">'+c.n+(dac ? ' đặc' : '')+'</span></div>' +
      sym(contSym(f),60,84,'--lc:'+c.c+';--lc2:#00000022') +
      '</div>'; }).join('');
  
  const hasMagicTools = save.items && save.items.tools && !lab.hard; // chế độ khó tự cân đong, không dùng thìa ma thuật
  const doseSelectorHtml = hasMagicTools ? `
    <div class="dose-selector" style="display:flex;align-items:center;justify-content:center;gap:6px;margin:0 0 6px 0;background:#fffdf5;border:1.2px solid var(--ink);border-radius:4.8px;padding:2px 6px;font-size:12.5px;font-family:var(--fh)">
      <span style="color:var(--ink)">Lượng đong: </span>
      <button class="btn dose-btn" id="dose-dec" style="padding:0 8px;font-size:12px;height:22px;line-height:18px">-</button>
      <span id="dose-val" style="font-weight:bold;width:65px;text-align:center;display:inline-block">${amt(lab.magicDose)}</span>
      <button class="btn dose-btn" id="dose-inc" style="padding:0 8px;font-size:12px;height:22px;line-height:18px">+</button>
    </div>
  ` : '';

  const hasBal = !day.free && dayEqs(day).length;
  const hasStickyNotes = save.items && save.items.notes;
  const hasSticky = !day.free && hasStickyNotes;
  const stickyNoteHtml = hasSticky ? `
    <div class="wallitem stickynote${big ? ' bpw' : ''}" style="left:${big ? 852 : hasBal ? 632 : 580}px;top:${big ? 8 : 120}px;width:98px;min-height:96px;background:#fef5c1;border:1.2px solid #d6c57a;transform:rotate(-2deg);padding:7px;font-family:var(--fh);font-size:13.5px;z-index:${big ? 55 : 5}">
      <h4 style="margin:0 0 5px 0;font-size:13.5px;border-bottom:1px dotted #3b302566;padding-bottom:2px;display:flex;align-items:center;gap:4px">${ico('note',13)} Giấy nhớ</h4>
      <div id="stickynote-content" style="font-size:11.5px;line-height:1.35"></div>
      <div id="sn-water" style="display:none;position:absolute;right:6px;bottom:3px;font-size:10.5px;color:#4a7ba8;align-items:center;gap:2px">
        <svg width="9" height="12" viewBox="0 0 10 13"><path d="M5,0.5 C8,5 9.5,7.5 5,12 C0.5,7.5 2,5 5,0.5z" fill="#6f9ec9" stroke="#3b3025" stroke-width="1"/></svg> có nước
      </div>
    </div>
  ` : '';
  const gogglesHtml = lab.hard ? `<div class="wallitem safetyhook${big ? ' bpw' : ''}" id="goggles" style="left:${big ? 418 : day.free ? 534 : 874}px;top:${big ? 172 : day.free ? 134 : 34}px" title="Bấm để đeo kính bảo hộ và găng tay">${sym('sym-goggles',92,64)}<div class="wallcap">Kính & găng</div></div>` : '';
  const hoodHtml = lab.hoodDay ? `<div class="wallitem hoodsw${big ? ' bpw' : ''}" id="hoodsw" style="left:${big ? 852 : day.free ? 634 : 872}px;top:${big ? 172 : day.free ? 132 : 152}px" title="Bấm để bật / tắt tủ hút">${HOOD_SVG}<div class="wallcap">Tủ hút: tắt</div></div>` : '';

  G.innerHTML = `<div class="scene${big ? ' bigmode' : ''}" style="padding:0">
    <div class="hudboard">${sym('sym-benchtex',1240,52,'position:absolute;left:20px;top:6px;width:calc(100% - 40px);opacity:.4;pointer-events:none')}
      <span class="hud-title">${day.free ? 'Ngày 1 · tự do' : 'Ngày '+(lab.i+1)}${lab.hard ? ' · <span style="color:#a8331f">khó</span>' : ''}</span>
      <div class="timerbar"><div style="width:100%"></div></div>
      <span class="hudstat" id="tleft">${Math.floor(lab.time/60)}:${String(lab.time%60).padStart(2,'0')}</span>
      <span class="hudstat">Đơn: <span id="ordn">${lab.served}</span>${day.free ? '' : '/'+day.orders.length}</span>
      <div style="flex:1"></div>
      ${lab.hard ? `<button class="btn" id="bhbook" style="padding:5px 12px">${ico('book')} Công thức</button>` : ''}
      <button class="btn icobtn" id="bmute">${ico(SFX.isMuted()?'mute':'sound')}</button>
      ${day.free ? '' : `<button class="btn" id="bhint" style="padding:5px 12px" title="Giáo sư nhắc bước kế tiếp">${ico('book')} Gợi ý</button>`}
      <button class="btn icobtn" id="bpause">${ico('pause')}</button>
    </div>
    <div class="wall">
      <div class="wall-toptrim"></div>
      ${wallBgSVG()}
      <div class="wallitem" style="left:400px;top:18px">${sym('sym-poster-periodic',104,134)}</div>
      <div class="wallitem" style="left:590px;top:14px"><svg id="clocksvg" width="84" height="84"><use href="#sym-clock"/></svg></div>
      ${hasBal ? `<div class="wallitem balpaper${big ? ' bpw' : ''}" id="balpaper" style="left:${big ? 418 : hasSticky ? 540 : 589}px;top:${big ? 8 : 122}px" title="Bấm để cân bằng phương trình (không bắt buộc)"><div class="bpface">${balPaperFace()}</div><div class="wallcap">Giấy cân bằng</div></div>` : ''}
      ${stickyNoteHtml}
      ${day.free ? '' : `<div class="wallitem" style="left:${lab.hard ? 758 : 798}px;top:${lab.hard ? 18 : 20}px">${sym('sym-poster-safety',104,134)}</div>`}
      ${gogglesHtml}
      ${hoodHtml}
      ${day.free ? '<div class="wallitem freenote" id="freenote"><h4>' + ico('note',14) + ' Trong cốc lúc này</h4><div id="freenote-body"></div></div>' : ''}
    </div>
    ${benchSVG()}
    ${sinkCounterSVG()}
    ${big ? bigPanelHTML() : ''}
    <svg class="matzone" viewBox="0 0 1280 720"><polygon data-dz="bench" class="benchzone" points="${[0, 1, 3, 2].map(i => L3.bench.corners[i].join(',')).join(' ')}"/><polygon data-dz="mat" points="${L3.mat.map(q => q.join(',')).join(' ')}"/></svg>
    <div class="custcol">
      <div class="win-out">${counterWindowOutSVG()}</div>
      <div class="custzone" id="cust" title="Bấm để trò chuyện với khách"><div class="custwalk" id="custwalk"></div></div>
      <div class="win-frame">${counterWindowFrameSVG()}</div>
      <div class="speech hush" id="speech"><svg class="on-ring" width="30" height="30" viewBox="0 0 34 34"><circle class="bg" cx="17" cy="17" r="14"/><circle class="fg" cx="17" cy="17" r="14" stroke-dasharray="88" stroke-dashoffset="0"/></svg>
        <div id="sptext"></div><div class="sp-order" id="sporder" hidden></div></div>
      ${TRAY_SVG}
    </div>
    <div class="sinkstation" data-dz="sink" title="Kéo cốc / bình khí / đĩa lọc / muôi vào đây để đổ bỏ">${sinkSVG()}<div class="cap">Bồn rửa</div></div>
    ${place3({sid:'sym-tripod', an:'base', x:BKP.x, y:BKP.y, k:KW, z:ZB-1, id:'tripod', cls:'tripod', scls:'gated tri-sh'})}
    ${has('gas') ? place3({sid:'sym-ringstand', an:'base', ...L3.dock.gasStand, k:kAt(L3.dock.gasStand), z:zAt(L3.dock.gasStand.y), id:'gasstand', cls:'rig', scls:'gated rig-sh'}) : ''}
    ${has('filter') || has('burn') ? place3({sid:'sym-filterstand', an:'base', ...L3.dock.filterStand, k:kAt(L3.dock.filterStand), z:zAt(L3.dock.filterStand.y), id:'filterstand', cls:'rig', scls:'gated fs-sh'})
      + '<svg class="rig ringfront" id="fsring" viewBox="0 0 1280 720"><path id="fsringline" fill="none" stroke="#3b3025"/><path id="fsringcore" fill="none" stroke="#6b6e73"/></svg>' : ''}
    ${has('gas') ? '<div class="rig gashood" id="gashood">'+sym('sym-gashood','100%','100%')+'</div>' : ''}
    ${has('gas') ? '<svg class="rig gastube" id="gastube" viewBox="0 0 1280 720"><path id="gastubeline" fill="none" stroke="#3b3025" stroke-width="10" stroke-linecap="round"/><path id="gastubecore" fill="none" stroke="#f3f1e8" stroke-width="5.5" stroke-linecap="round"/></svg>' : ''}
    ${place3({sid:'sym-beaker', an:'base', x:BKP.x, y:BKP.y, k:KB, z:ZB, id:'beakerItem', dz:'beaker', cls:'grab', art:BEAKER_SVG})}
    <button class="btn undobtn" id="bundo" hidden title="Rút lại lần rót vừa rồi (khi chất chưa phản ứng)">↶ Rút lại</button>
    ${benchTools(day)}
    <div id="dishHost"></div>
    ${has('elec') ? '<div class="elecpanel" id="elecpanel"></div>' : ''}
    <div class="shelf" aria-label="Tủ hoá chất"><div class="shtop"></div>${doseSelectorHtml}<div class="shgrid">${shelfHtml}</div><div class="sh-scfade top" aria-hidden="true"></div><div class="sh-scfade bot" aria-hidden="true"></div><button type="button" class="sh-scbtn up" aria-label="Cuộn tủ hoá chất lên">▲ Lên trên</button><button type="button" class="sh-scbtn dn" aria-label="Cuộn tủ hoá chất xuống">▼ Cuộn thêm</button></div>
  </div>`;
  // buttons
  G.querySelector('#bpause').onclick = pauseLab;
  G.querySelector('#speech').onclick = custChat;
  G.querySelector('#cust').onclick = custChat;
  G.querySelector('#bmute').onclick = e => { const m = SFX.toggle(); e.currentTarget.innerHTML = ico(m?'mute':'sound'); };
  const hb = G.querySelector('#bhbook'); if(hb) hb.onclick = showHardBook;
  const bh = G.querySelector('#bhint'); if(bh) bh.onclick = () => { SFX.talk(); showHint(); };
  G.querySelector('#bundo').onclick = undoPour;
  const gg = G.querySelector('#goggles'); if(gg) gg.onclick = () => { if(lab.goggles) return; wearGoggles(); toast('Đã đeo kính bảo hộ và găng tay — an toàn là trên hết!'); };
  const hs = G.querySelector('#hoodsw'); if(hs) hs.onclick = () => setHood(!lab.hood);
  const bp = G.querySelector('#balpaper'); if(bp) bp.onclick = () => {
    if(!lab) return;
    if(lab.timer){ clearInterval(lab.timer); lab.timer = null; }   // cân bằng là việc thêm — không bị tính giờ
    balanceSheet(lab.i, () => {
      refreshBalPaper();
      if(lab && lab.timer === null && !lab.cardOpen && !G.querySelector('.pausecard')) lab.timer = setInterval(labTick, 1000);
    });
  };
  // hoá chất trong tủ
  G.querySelectorAll('.chem').forEach(c => { const gt = chemDragTool(c.dataset.f);
    dragify(c, 'chem', {
      data: c.dataset.f, w:gt.w, h:gt.h, touchAction:'pan-y',
      ghostHTML: () => gt.html,
      // bấm cũng rót — đường tắt: cho vào vật đang ở giữa thảm (muôi đốt đang treo trên giá, không thì cốc).
      // Chất không hợp muôi (lỏng, khí) thì pourChem nói rõ phải cho vào đâu
      onClick: () => pourChem(c.dataset.f, spoonUp() ? 'ladle' : 'beaker')
    });
    factHover(c, c.dataset.f); });
  const shEl = G.querySelector('.shelf'), shGrid = G.querySelector('.shgrid');
  if(shEl && shGrid){
    shEl.querySelector('.sh-scbtn.up').onclick = () => shGrid.scrollBy({ top: -118, behavior: 'smooth' });
    shEl.querySelector('.sh-scbtn.dn').onclick = () => shGrid.scrollBy({ top: 118, behavior: 'smooth' });
    shGrid.addEventListener('scroll', updateShelfScrollUI, { passive: true });
  }
  shelfBoards();   // ván tủ theo đúng vị trí các hàng lọ vừa dựng; phông chữ nạp xong làm nhãn cao thấp khác đi thì đặt lại
  if(document.fonts) document.fonts.ready.then(() => { if(lab) shelfBoards(); });
  const bgw = BK.w*KB*0.8, bgh = BK.h*KB*0.8;
  dragify(G.querySelector('#beakerItem'), 'beaker', {w:bgw, h:bgh,
    ghostHTML: () => G.querySelector('#beakersvg').outerHTML.replace('width="100%" height="100%"', 'width="'+bgw+'" height="'+bgh+'"'),
    // mặt bàn ngoài thảm: đặt cốc ra đúng chỗ thả (đáy cốc = đáy hình đang cầm); thảm: đưa cốc về giữa
    onDrop: (zone, e, pt) => zone === 'bench' ? parkBeaker(pt, bgh * (BK.bot / BK.h - 0.5))
                           : zone === 'mat' ? parkBeaker(null)
                           : zone === 'funnel' ? (lab.filterOn ? useFilter() : setFilter(true))   // rót cốc qua phễu
                           : dropAction('beaker', zone)});
  // dụng cụ trên bàn: mỗi thứ một ô, ai cũng có nhãn
  const overBeaker = e => { const bk = G.querySelector('#beakerItem'); if(!bk || !e) return false;
    const r = bk.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
  const LOOSE = {
    lamp: () => { if(lab.lampUnder){ lampUnder(false); return true; } if(lab.heaterOn){ setHeat(false); return true; } return false; },
    elec: () => { if(lab.elecOn){ setElec(false); return true; } return false; },
    gas:  () => { if(lab.catcher){ setCatch(false); return true; } return false; },
    funnel: () => { if(lab.filterOn){ setFilter(false); return true; } return false; },
    // nhúng muôi vào cốc: không đốt trong cốc — nói rõ lý do thay vì lặng lẽ bật về
    ladle: e => { // thả lên cốc đang ở giữa thảm cũng là vào vùng làm việc: treo muôi lên giá (muôi đang cháy thì không)
                  if(overBeaker(e) && !lab.ladleLit && !beakerSpot().away){ mountSpoon(true); return true; }
                  if(lab.spoonOn && !ladleFuel().length){ mountSpoon(false); return true; }   // muôi trống kéo ra ngoài: tháo xuống
                  if(overBeaker(e)){ SFX.err(); notify('Không đốt trong cốc! Đưa muôi đang cháy vào <b>lọ khí</b> (bình khí đã nạp O₂ hoặc Cl₂).'); } return false; }
  };
  Object.keys(TOOLPOS).forEach(key => {
    const tl = TOOLBOX[key], el = G.querySelector('#tool_'+key);
    if(!el) return;
    if(!tl.drag){                                  // quỳ & sổ tay chỉ bấm
      el.onclick = useLitmus;
      el.style.cursor = 'pointer';
      return;
    }
    const k = TOOLPOS[key].k, gw = T3D[tl.symbol].w*k, gh = T3D[tl.symbol].h*k;
    dragify(el, tl.drag, {
      w:gw, h:gh, grow:WORK / SIDE,
      // trên tay là dáng dùng (đũa dựng đứng, phễu ngửa, đèn mở nắp) và mang theo trạng thái (chất trên muôi, khí trong bình)
      ghostHTML: () => sym(tl.symbol, gw, gh, G.querySelector('#sv_'+key).getAttribute('style') || ''),
      onLoose: LOOSE[tl.drag],
      // đũa: bấm một cái = khuấy một nhát, thay cho nút "Khuấy" cũ
      onClick: key === 'rod' ? stirOnce : key === 'burn' ? (() => notify(ladleHint())) : undefined
    });
  });
  syncLadle();
  layoutRigs();
  if(big) bigBindings();
  else if(bigBeakerOn() && !lab.bigTold){   // bật cốc to mà hôm nay có muôi đốt / điện phân: nói một lần vì sao bàn vẫn như cũ
    lab.bigTold = true;
    setTimeout(() => { if(lab) notify('Hôm nay có ' + (has('burn') ? 'muôi đốt' : 'bộ điện phân') + ' nên dùng bàn thí nghiệm thường — cốc to chưa có bộ này.'); }, 1500);
  }
  
  if(hasMagicTools){
    const dec = G.querySelector('#dose-dec');
    if(dec) dec.onclick = () => { lab.magicDose = Math.max(0.5, lab.magicDose - 0.5); G.querySelector('#dose-val').textContent = amt(lab.magicDose); };
    const inc = G.querySelector('#dose-inc');
    if(inc) inc.onclick = () => { lab.magicDose = Math.min(10, lab.magicDose + 0.5); G.querySelector('#dose-val').textContent = amt(lab.magicDose); };
  }

  if(lab.i === 0 && !save.stars[1]){ // day-1 tutorial hand shows the drag path
    const h = document.createElement('div');
    h.className = 'tuthand'; h.id = 'tuthand'; h.innerHTML = ico('hand',52);
    G.appendChild(h);
  }
  nextCustomer();
  updateBeaker();
}

// Tờ giấy cân bằng ghim trên tường: mỗi phương trình của ngày là một dòng nguệch ngoạc; phương trình nào trò
// đã cân bằng đúng (save.balanced) thì có ✓ đỏ cuối dòng, góc dưới đếm số đã xong. Giáo sư làm hộ thì không đếm.
function balPaperFace(){
  const eqs = dayEqs(lab.day), edit = balanceEditable(lab.i), done = eqs.filter(isBalanced).length;
  return '<i class="bppin"></i><b>Cân bằng</b>'
    + eqs.map(idx => '<span class="bpl' + (edit && isBalanced(idx) ? ' ok' : '') + '"></span>').join('')
    + (edit ? '<em' + (done === eqs.length ? ' class="all"' : '') + '>' + done + '/' + eqs.length + '</em>' : '');
}
function refreshBalPaper(){ const f = G.querySelector('#balpaper .bpface'); if(f && lab) f.innerHTML = balPaperFace(); }

function pauseLab(){
  if(!lab || !lab.timer) return;
  clearInterval(lab.timer); lab.timer = null;
  const ov = document.createElement('div');
  ov.className = 'overlay pauseov';
  const free = lab.day.free;
  const hasEqs = !free && dayEqs(lab.day).length;
  const hasLesson = !free && BAI_GIANG[lab.i];
  ov.innerHTML = `<div class="pausecard"><h2>Tạm nghỉ</h2>
    <div class="pausetitle">${free ? LICH.tuDo : 'Ngày ' + (lab.i + 1) + ' · ' + lab.day.t}</div>
    <div class="pauserow">${pauseBtn('presume', 'play', 'Tiếp tục', ' main')}${pauseBtn('prestart', 'retry', 'Chơi lại')}${pauseBtn('pmap', 'map', free ? 'Kết thúc ca' : 'Về bản đồ')}</div>
    ${hasLesson ? `<button class="btn" id="plesson">${ico('book')} Xem lại bài giảng</button>` : ''}
    ${hasEqs ? `<button class="btn" id="pnote">${ico('note')} Giấy cân bằng</button>` : ''}
    <div class="pausevol">${volSliders()}</div></div>`;
  G.appendChild(ov);
  bindVolSliders(ov);
  // bài giảng phủ lên ca đang dừng; đóng lại thì thẻ Tạm nghỉ hiện ra như cũ
  if(hasLesson) ov.querySelector('#plesson').onclick = () => { ov.classList.add('under'); showLesson(lab.i, () => ov.classList.remove('under')); };
  if(hasEqs) ov.querySelector('#pnote').onclick = () => { ov.classList.add('under'); balanceSheet(lab.i, () => { ov.classList.remove('under'); refreshBalPaper(); }); };
  ov.querySelector('#presume').onclick = () =>   // thẻ trượt xuống xong mới chạy lại đồng hồ
    closeOv(ov, () => { if(lab && lab.timer === null) lab.timer = setInterval(labTick, 1000); });
  ov.querySelector('#prestart').onclick = () => { const i = lab.i; lab = null; go(free ? startFree : ()=>playDay(i)); };
  ov.querySelector('#pmap').onclick = () => {
    if(free) return endFree();   // số đơn đã ghi dần trong serve(); ở đây chỉ tổng kết ca
    lab = null; go(showMap);
  };
}

/* ---- reaction engine: limiting reagent reacts fully, fractional extents allowed ---- */
const RQ = v => Math.round(v*1000)/1000; // quantize doses to 0.001 (=0.0001 mol) to kill float dust
/* Thứ tự khi nhiều phản ứng cùng chạy được trong cốc:
   1. cờ last (phan-ung.js) luôn xếp sau cùng
   2. phản ứng trao đổi ion / trung hoà trước, phản ứng của KIM LOẠI ĐƠN CHẤT (đẩy kim loại khỏi muối, kim loại + axit)
      sau — ion gặp nhau là kết tủa ngay, kim loại thì phải ăn mòn dần. VD cốc có NaCl, Cu, AgNO₃: ra AgCl↓ trước,
      không phải Cu đẩy Ag
   3. còn lại: phản ứng đòi nhiều phân tử hơn trước (H₂SO₄ + 2NaOH ra muối trung hoà, không dừng ở muối axit) */
const FREE_METALS = new Set(['K','Na','Ca','Ba','Mg','Al','Zn','Fe','Pb','Cu','Hg','Ag']);
const usesMetal = r => Object.keys(r.rg).some(f => FREE_METALS.has(f)) ? 1 : 0;
// phản ứng ngược đúng chiều của r (CaCO₃ —t°→ CaO + CO₂ và CaO + CO₂ → CaCO₃): trong MỘT lần chạy không cho cặp này
// đảo qua đảo lại, kẻo kết quả tuỳ vào số lượt chẵn hay lẻ
const rxSig = (a, b) => Object.keys(a).sort().join('+') + '>' + Object.keys(b).sort().join('+');
let RX_REV = null;
function rxReverse(r){
  if(!RX_REV){ const by = new Map(REACTIONS.map(x => [rxSig(x.rg, x.pr), x])); RX_REV = new Map(REACTIONS.map(x => [x, by.get(rxSig(x.pr, x.rg))])); }
  return RX_REV.get(r);
}
// mỗi lượt cho chất hạn chế của một phản ứng hết sạch, nên chuỗi luôn dừng; 24 lượt là đủ cho cốc "đổ đủ thứ"
// (trước đây 5 lượt: cốc nhiều chất bị dừng giữa chuỗi, phải đợi lần rót sau mới chạy tiếp)
const RX_PASSES = 24;
// tag {X:'đặc'} / {X:'loãng'} trên phương trình là ĐIỀU KIỆN: X phải có phần đặc / phần loãng trong cốc (kể cả X là xúc tác)
const rxTagged = (r, f, t) => !!(r.tag && r.tag[f] === t);
const concOK = r => Object.keys(r.tag || {}).every(f => r.tag[f] === 'đặc' ? concOf(f) > 0.009 : r.tag[f] === 'loãng' ? diluteOf(f) > 0.009 : true);
const rxAvail = (r, f) => rxTagged(r, f, 'đặc') ? concOf(f) : rxTagged(r, f, 'loãng') ? diluteOf(f) : (lab.mix[f] || 0);
function runReactions(collect){
  const mix = lab.mix, fired = [];
  const hasLiquid = () => Object.keys(mix).some(f => mix[f] > 0 && (CHEMS[f].s === 'l' || CHEMS[f].s === 'd'));
  // Không còn "oxi chùa" từ không khí: phản ứng cháy (burn) không bao giờ chạy trong cốc,
  // phải làm bằng muôi đốt trong lọ khí — xem burnInJar().
  // H₂SO₄ đặc háo nước: than hoá cả đường còn ở dạng rắn, không cần khuấy cho tan trước
  if(concOf('H2SO4') > 0.009 && lab.undissolved.C12H22O11 > 0){
    const q = lab.undissolved.C12H22O11; delete lab.undissolved.C12H22O11;
    mix.C12H22O11 = RQ((mix.C12H22O11 || 0) + q); lab.dissolveTotal = Math.max(0, RQ(lab.dissolveTotal - q));
  }
  // cốc KHÔ (không nước, không dung dịch): chất rắn tan như KMnO₄, NaHCO₃ nằm dưới đáy (lab.undissolved) không có gì
  // để tan vào, nó chỉ là chất rắn — phản ứng cần đun lấy luôn phần đó để nung
  const und = lab.undissolved;
  const dryHave = (r, f) => r.heat && !hasLiquid() ? (und[f] || 0) : 0;
  const ran = new Set();
  for(let pass=0; pass<RX_PASSES; pass++){
    const cands = REACTIONS.filter(r => {
      if(r.elec || r.burn) return false;   // điện phân chỉ chạy khi người chơi bấm, xem electrolyse()
      if(ran.has(rxReverse(r))) return false;
      if(r.heat && !lab.heaterOn) return false;
      if(r.dry && hasLiquid()) return false;   // nung chất rắn KHÔ: cốc còn nước / dung dịch thì đun mãi cũng không ra
      if(r.cat && !r.cat.every(f => (mix[f]||0) > 0)) return false;   // xúc tác phải có mặt
      if(!concOK(r)) return false;                                       // axit phải đặc / loãng đúng như phương trình ghi
      return Object.keys(r.rg).every(f => {
        if(f === 'H2O' && hasLiquid()) return true; // nước dung môi coi như dư
        return (mix[f]||0) + dryHave(r, f) > 0;
      });
    });
    if(!cands.length) break;
    cands.sort((a,b) => (a.last||0)-(b.last||0) || usesMetal(a) - usesMetal(b) || tot(b.rg) - tot(a.rg));   // thứ tự: xem trên
    const r = cands[0];
    ran.add(r);
    // chất rắn khô dưới đáy: cho phản ứng mượn, phần dư trả lại đáy cốc
    const lent = Object.keys(r.rg).filter(f => dryHave(r, f) > 0);
    lent.forEach(f => { mix[f] = RQ((mix[f]||0) + und[f]); lab.dissolveTotal = Math.max(0, RQ(lab.dissolveTotal - und[f])); delete und[f]; });
    const n = Math.min(...Object.keys(r.rg).map(f => {
      if(f === 'H2O' && hasLiquid()) return Infinity;
      return rxAvail(r, f)/r.rg[f];
    })); // fractional extent — limiting reagent runs out
    fired.push(applyReaction(r, n, f => f === 'H2O' && hasLiquid(), r.dry));
    lent.forEach(f => { if(mix[f] > 0){ und[f] = mix[f]; lab.dissolveTotal = RQ(lab.dissolveTotal + mix[f]); delete mix[f]; } });
    // phần đặc: phản ứng cần axit đặc thì trừ vào phần đặc; phản ứng khác lấy phần loãng trước
    Object.keys(r.rg).forEach(f => { if(lab.dac[f] === undefined) return;
      if(r.tag && r.tag[f] === 'đặc') lab.dac[f] = RQ(lab.dac[f] - r.rg[f]*n);
      lab.dac[f] = Math.min(lab.dac[f], mix[f] || 0); });
    concCheck();   // nước sinh ra làm axit loãng dần
  }
  if(collect){ fired.forEach(x => collect.push(x)); return fired.length; }
  if(fired.length){
    eqPop(fired);
    // khí sinh ra mà chưa có bình hứng: nói rõ vì sao, đây là lỗi hay gặp nhất mà trước đây người chơi không được biết
    if(fired.some(x => x.includes('bay mất')) && lab.day.tools.includes('gas')) notify(profLine(lab.big ? PROF_LAB.khiBayMatNap : PROF_LAB.khiBayMat));
  }
  return fired.length;
}
// phương trình vừa chạy nổi lên trên miệng cốc rồi tan: người chơi thấy ngay mình vừa làm ra chất gì
function eqPop(lines){
  if(!lines || !lines.length || !G.querySelector('#beakerItem')) return;
  G.querySelectorAll('.eqpop').forEach(x => x.remove());   // rót liên tiếp: chỉ giữ phương trình mới nhất, không chồng chữ
  const bx = beakerBox(), e = document.createElement('div');
  e.className = 'eqpop'; e.innerHTML = lines.join('<br>');
  e.style.left = bx.cx + 'px'; e.style.top = (bx.top + (lab.big ? 56 : -14)) + 'px';   // cốc to: nổi trong miệng cốc, dưới lời nhắn của giáo sư
  G.appendChild(e); e.onanimationend = () => e.remove();
}
/* Sổ tay ghi lại phản ứng NGƯỜI CHƠI ĐÃ TỰ CHẠY — mở ở màn hình chính, xem như
   những gì đã học được. Không hiện trong màn chơi nữa: đang bán hàng thì phải nhớ,
   không được giở phao. */
function learnRx(r){
  const i = REACTIONS.indexOf(r);
  if(i < 0 || save.rx.includes(i)) return;
  save.rx.push(i); persist();
  if(lab) lab.newRx = (lab.newRx || 0) + 1;
  if(save.rx.length === REACTIONS.length) unlockAch('rxall');
  if(lab && cardsOn()) queueRxCard(r);   // lần đầu tự tay làm ra → giáo sư chiếu thẻ phản ứng
}
function showRxBook(){
  const done = new Set(save.rx);
  const rows = RX_GROUPS.map((g, k) => {
    const to = k + 1 < RX_GROUPS.length ? RX_GROUPS[k+1].i : REACTIONS.length;
    const items = [];
    let left = 0;
    for(let i = g.i; i < to; i++){
      if(!done.has(i)){ left++; continue; }        // chưa gặp thì gộp thành một dòng cuối nhóm,
      items.push('<div class="eq" data-rx="' + i + '" title="Bấm để xem thẻ phản ứng">' + eqStr(REACTIONS[i])   // liệt kê từng dấu ? chỉ tổ dài sổ
        + (REACTIONS[i].dry ? ' <small>(nung chất rắn khô)</small>' : REACTIONS[i].heat ? ' <small>(cần đun)</small>' : '')
        + (REACTIONS[i].burn ? ' <small>(đốt trong lọ khí)</small>' : '')
        + (REACTIONS[i].elec ? ' <small>(điện phân)</small>' : '')
        + (fxOf(REACTIONS[i]) ? ' <small style="opacity:.7">— ' + fxOf(REACTIONS[i]) + '</small>' : '') + '</div>');
    }
    if(left) items.push('<div class="eq locked">còn ' + left + ' phản ứng chưa gặp</div>');
    return '<h3 class="rxg">' + g.t + ' <i>' + (to - g.i - left) + '/' + (to - g.i) + '</i></h3>' + items.join('');
  }).join('');
  modal('<h2>Sổ tay — những gì đã học</h2>'
    + '<div class="hgrid"><div class="center">' + sym('sym-notebook-open',300,175)
    + '<p style="margin:8px 0 10px;text-align:left">Đã ghi được <b>' + save.rx.length + '/' + REACTIONS.length
    + '</b> phản ứng. Tự tay pha ra phản ứng nào thì nó hiện ra ở đây — <b>bấm vào</b> một dòng để xem lại thẻ phản ứng.</p></div>'
    + '<div>' + rows + '</div></div>', null, 'hcard');
  G.querySelectorAll('.eq[data-rx]').forEach(el => el.onclick = () => showRxCard(REACTIONS[+el.dataset.rx]));
}

/* Áp dụng MỘT phản ứng với mức độ n. skip(f) = chất coi như có sẵn không tốn
   (nước dung môi). steam: nung khô — nước sinh ra bay thành hơi (đọng thành giọt trên thành cốc), không ở lại cốc.
   Dùng chung cho phản ứng tự phát và điện phân. */
function applyReaction(r, n, skip, steam){
  const mix = lab.mix;
  learnRx(r);
  Object.keys(r.rg).forEach(f => {
    if(skip && skip(f)) return;
    mix[f] = RQ(mix[f] - r.rg[f]*n);
    if(mix[f] < 0.01) delete mix[f];
  });
  let gasNote = '';
  Object.keys(r.pr).forEach(f => {
    const q = r.pr[f]*n;
    if(CHEMS[f].s === 'k'){
      spawnBubbles();
      toxicCheck(f);
      if(r.vent && r.vent.includes(f)) gasNote += ' — '+sub(f)+' sủi ở cực dương và thoát ra!';
      else if(lab.catcher && lab.big){ mix[f] = RQ((mix[f]||0) + q); unlockAch('gas1'); gasNote = ' — '+sub(f)+' ở lại trong cốc (đã đậy nắp)'; }   // cốc to: khí dưới nắp vẫn phản ứng tiếp được
      else if(lab.catcher){ lab.gas[f] = RQ((lab.gas[f]||0) + q); unlockAch('gas1'); gasNote = ' — đã thu '+sub(f)+' vào bình!'; }
      else gasNote = ' — khí '+sub(f)+' bay mất!';
    } else if(steam && f === 'H2O'){
      lab.steam = true;
      gasNote += ' — nước bay thành hơi';
    } else {
      mix[f] = RQ((mix[f]||0) + q);
      if(isPrecip(f)) spawnFall(CHEMS[f].c);
    }
  });
  const boom = r.rg.H2 && (r.rg.O2 || r.rg.Cl2);   // hỗn hợp hiđro gặp lửa thì nổ "bụp", toả nhiệt thì xèo
  if(boom) SFX.bang(); else if(r.exo) SFX.sizzle();
  if(r.exo || boom){ const b = G.querySelector('#beakerItem'); b.classList.remove('glowing'); void b.offsetWidth; b.classList.add('glowing'); }
  if(boom) bigWord('BÙM!', '#d9634f'); else if(r.exo) bigWord('XÈO!', '#ffb347');
  return eqStr(r)+gasNote;
}

/* =====================  ĐIỆN PHÂN CÓ ĐỊNH LƯỢNG  =====================
   Trước đây cắm điện vào là nó tự tách sạch mọi thứ trong cốc, mỗi giây một lần.
   Hậu quả: đơn "0,1 mol Cl₂" của cô Mai (ngày 29) không giao nổi — chỉ cần trong cốc
   còn chút nước là H₂ lẫn vào bình khí, mà người chơi không có cách nào bảo nó dừng.
   Giờ người chơi CHỌN chất và SỐ MOL muốn tách rồi bấm chạy: đúng chừng ấy, rồi thôi. */
const ELEC_STEP = 0.5;                               // mỗi nhịp ± 0,05 mol
const elecMain = r => Object.keys(r.rg)[0];          // chất chính bị tách
const elecList = () => REACTIONS
  .map((r,i) => ({r,i}))
  .filter(x => x.r.elec && Object.keys(x.r.rg).every(f => (lab.mix[f]||0) > 0.009));

function renderElecPanel(){
  const p = G.querySelector('#elecpanel'); if(!p) return;
  if(!lab || !lab.elecOn){ p.classList.remove('up'); p.innerHTML = ''; return; }
  p.classList.add('up');
  const av = elecList();
  if(!av.length){
    p.innerHTML = '<span class="ephint">Cốc chưa có gì để điện phân — rót dung dịch hoặc nước vào đã.</span>';
    return;
  }
  lab.elecDose = lab.elecDose || {};
  p.innerHTML = av.map(x => {
    const main = elecMain(x.r), mx = RQ(lab.mix[main]);
    // chưa đụng tới thì mặc định là TÁCH HẾT; số người chơi đặt chỉ kẹp lúc hiển thị,
    // không ghi đè lại — nếu ghi đè thì mỗi nhát khuấy làm mực chất tụt là số cũng tụt theo
    const d = lab.elecDose[x.i] === undefined ? mx
            : Math.max(ELEC_STEP, Math.min(lab.elecDose[x.i], mx));
    return '<span class="eprow" data-i="'+x.i+'" data-d="'+d+'"><b>'+sub(main)+'</b>'
      + '<button class="mgbtn epd">−</button><span class="epv">'+amt(d)+'</span>'
      + '<button class="mgbtn epu">+</button>'
      + '<button class="mgbtn epgo">điện phân</button>'
      + '<i>có '+amt(mx)+'</i></span>';
  }).join('');
  p.querySelectorAll('.eprow').forEach(row => {
    const i = +row.dataset.i, d = +row.dataset.d, mx = RQ(lab.mix[elecMain(REACTIONS[i])]);
    row.querySelector('.epd').onclick = () => { lab.elecDose[i] = Math.max(ELEC_STEP, RQ(d-ELEC_STEP)); renderElecPanel(); };
    row.querySelector('.epu').onclick = () => { lab.elecDose[i] = Math.min(mx, RQ(d+ELEC_STEP)); renderElecPanel(); };
    row.querySelector('.epgo').onclick = () => electrolyse(i, d);
  });
}
/* Tách đúng `units` (đơn vị 0,1 mol) chất chính, không hơn. */
function electrolyse(i, units){
  const r = REACTIONS[i], main = elecMain(r);
  // mức độ phản ứng: theo lượng người chơi đặt, nhưng không vượt quá thứ đang có trong cốc
  const n = Math.min(units / r.rg[main],
                     ...Object.keys(r.rg).map(f => (lab.mix[f]||0) / r.rg[f]));
  if(!(n > 0.004)){ notify('Không đủ chất để điện phân chừng đó.'); return; }
  const note = applyReaction(r, RQ(n));
  const zap = G.querySelector('#sv_elec');
  if(zap){ zap.style.setProperty('--zap', 1); setTimeout(()=>zap.style.setProperty('--zap', lab.elecOn?1:0), 700); }
  SFX.zap();
  const more = [];
  runReactions(more);                 // phản ứng kéo theo (không cần điện) chạy tiếp
  eqPop([note].concat(more));
  updateBeaker();
}


/* =====================  RÓT HOÁ CHẤT  =====================
   Một lọ trong tủ thả được vào CỐC (rót), vào MUÔI ĐỐT (chất rắn để đốt) hoặc vào
   LỌ KHÍ (nạp O₂/Cl₂). Chế độ khó hỏi gam / ml / lít trước khi rót — xem askDose(). */
const JAR_GASES = ['O2','Cl2'];   // lọ chỉ nạp sẵn khí để ĐỐT; khí khác phải tự điều chế rồi hứng
function pourChem(f0, where){
  const f = baseChem(f0), conc = f !== f0, c = CHEMS[f];   // lọ 'X@đặc' (ca tự do): vẫn là chất X, chỉ là đặc
  if(where === 'jar' && !JAR_GASES.includes(f)){
    SFX.err();
    notify(c.s === 'k' ? 'Lọ khí chỉ nạp sẵn <b>O₂</b> hoặc <b>Cl₂</b> để làm thí nghiệm đốt. Khí khác phải tự điều chế rồi hứng bằng bộ thu khí.'
                      : 'Lọ khí chỉ chứa <b>khí</b>. Chất rắn muốn đốt thì thả vào <b>muôi đốt</b>, còn lại rót vào cốc.');
    return;
  }
  if(where === 'ladle' && c.s !== 'r'){
    SFX.err();
    notify('Muôi đốt chỉ đựng chất <b>rắn</b>. ' + (JAR_GASES.includes(f) ? 'Khí '+sub(f)+' thì nạp vào <b>lọ khí</b> (bình thu khí).' : 'Chất này rót vào cốc.'));
    return;
  }
  pourSafety(f);
  askDose(f, dose => where === 'jar' ? fillJar(f, dose) : where === 'ladle' ? loadLadle(f, dose) : addChem(f, dose, conc));
}
const baseDose = () => (save.items && save.items.tools && !lab.hard) ? lab.magicDose : 1;

/* Rút lại lần rót vừa rồi: rót lố một giọt thì trước đây chỉ còn cách đổ cả cốc. Chỉ rút được khi chất vừa rót CHƯA
   phản ứng và cốc chưa bị đụng tới từ đó (khuấy, đun, lọc… là mất lượt rút). Phản ứng rồi thì không đảo ngược được. */
const beakerSig = () => JSON.stringify([lab.mix, lab.undissolved, lab.gas, lab.solid, lab.dac]);
const canUndo = () => lab && !lab.ending && lab.undo && !lab.undo.reacted && lab.undo.after === beakerSig();
function undoPour(){
  if(!lab || !lab.undo || lab.ending) return;
  if(!canUndo()){ SFX.err(); notify(profLine(PROF_LAB.khongHoanTac)); lab.undo = null; updateBeaker(); return; }
  const b = lab.undo.before;
  lab.mix = b.mix; lab.undissolved = b.und; lab.dissolveTotal = b.dt; lab.firstPour = b.fp; lab.waterIn = b.wi; lab.dac = b.dac;
  lab.undo = null; lab.lastWhy = '';
  SFX.pour(); toast(PROF_LAB.hoanTac);
  updateBeaker();
}
/* ---- axit đặc trong cốc ----
   lab.dac[X] = lượng X đang ĐẶC (≤ lab.mix[X]); phần còn lại của X là loãng. Rót lọ đặc thì không kèm nước. Nước trong
   cốc (rót vào, hay do phản ứng sinh ra) làm axit loãng dần: khi tỉ lệ khối lượng axit / (axit + nước) xuống dưới
   CONC_MIN (du-lieu.js) thì cả phần đặc thành loãng. Phản ứng tiêu thụ X lấy phần loãng trước, trừ phản ứng cần X đặc. */
const concOf = f => Math.min((lab.dac && lab.dac[f]) || 0, lab.mix[f] || 0);
const diluteOf = f => Math.max(0, (lab.mix[f] || 0) - concOf(f));
function concCheck(){
  if(!lab.dac) lab.dac = {};
  for(const f of Object.keys(lab.dac)){
    const a = lab.mix[f] || 0, d = Math.min(lab.dac[f], a);
    if(d <= 0.009){ delete lab.dac[f]; continue; }
    lab.dac[f] = RQ(d);
    const ma = a*molarMass(f), mw = (lab.mix.H2O || 0)*18;
    if(ma/(ma + mw) < (CONC_MIN[f] || .5)){ delete lab.dac[f]; toast(sub(f) + ' đã bị pha loãng'); }
  }
}
/* Rót NƯỚC (hay dung dịch — trong đó cũng là nước) vào cốc đang có axit ĐẶC: nước sôi bùng lên, axit bắn ra.
   Ca dừng ngay. Axit đặc chỉ có ở ca tự do (lọ 'X@đặc'), nên chiến dịch vẫn theo luật an toàn cũ. */
function acidSplash(acid, water){
  if(!lab || lab.ending) return;
  lab.ending = true; clearInterval(lab.timer); lab.timer = null;   // đồng hồ đứng: kéo–thả cũng bị chặn
  SFX.bang();
  const b = G.querySelector('#beakerItem'); if(b){ b.classList.remove('glowing'); void b.offsetWidth; b.classList.add('glowing'); }
  bigWord('BÙM!', '#d9634f');
  const bx = beakerBox(), col = CHEMS[acid].c;
  for(let k = 0; k < 14; k++){   // giọt axit văng ra hai bên miệng cốc
    const d = document.createElement('i'); d.className = 'acidsplash';
    const ang = -Math.PI/2 + (Math.random() - .5)*2.2, dist = 60 + Math.random()*110;
    d.style.cssText = `left:${bx.cx + (Math.random() - .5)*60}px;top:${bx.top + 8}px;background:${col};`
      + `--dx:${Math.cos(ang)*dist}px;--dy:${Math.sin(ang)*dist}px;animation-delay:${Math.random()*.15}s`;
    G.appendChild(d); d.onanimationend = () => d.remove();
  }
  const ub = G.querySelector('#bundo'); if(ub) ub.hidden = true;   // ca đã dừng: không rút lại được nữa
  notify(profLine(fillLine(PROF_LAB.axitBan, {acid:sub(acid), nuoc:water === 'H2O' ? 'nước' : 'dung dịch ' + sub(water)})));
  setTimeout(() => { if(!lab) return; lab.day.free ? endFree(PROF_LAB.axitBanTieuDe) : finishLab(); }, 2200);
}
function addChem(f, dose, conc){
  const th = G.querySelector('#tuthand'); if(th) th.remove();
  // nước vào axit đặc: bắn axit, dừng ca
  const strong = Object.keys(lab.dac || {}).find(a => concOf(a) > 0.009);
  if(strong && !conc && (f === 'H2O' || CHEMS[f].s === 'd')){ pourFX(f); acidSplash(strong, f); return; }
  const before = {mix:{...lab.mix}, und:{...lab.undissolved}, dt:lab.dissolveTotal, fp:lab.firstPour, wi:lab.waterIn, dac:{...lab.dac}};
  // quy tắc pha axit: cốc bắt đầu bằng H₂SO₄ mà chưa có nước thì không được rót nước vào sau
  if(f === 'H2O' && lab.firstPour === 'H2SO4' && !lab.waterIn)
    safetyHit('axit-nuoc', PROF_SAFETY['axit-nuoc']);
  if(!tot(lab.mix) && !tot(lab.undissolved)) lab.firstPour = f;
  if(f === 'H2O') lab.waterIn = true;
  toxicCheck(f);
  pourFX(f);
  if(SLOW_DISSOLVE.includes(f)){ // settles at the bottom: no reactions, no serving until stirred in
    lab.undissolved[f] = RQ((lab.undissolved[f]||0) + dose);
    lab.dissolveTotal = RQ(lab.dissolveTotal + dose);
    // cốc khô thì chưa có gì để tan vào — đừng bảo khuấy (ngày 30: thuốc tím để khô mà nung ra oxi)
    const wet = Object.keys(lab.mix).some(g => CHEMS[g].s === 'l' || CHEMS[g].s === 'd');
    (lab.toldSlow ? toast : notify)(doseStr(f, dose) + ' ' + sub(f) + (wet ? ' — ít tan! Kéo <b>đũa khuấy</b> vào cốc rồi khuấy tròn cho tan.'
      : ' nằm khô dưới đáy cốc. Muốn hoà tan thì thêm <b>nước</b> rồi kéo <b>đũa khuấy</b> vào khuấy tròn.'));
    lab.toldSlow = true;
    lab.undo = {before, reacted:false, after:beakerSig()};
    updateBeaker();
    return;
  }
  lab.mix[f] = RQ((lab.mix[f]||0) + dose);
  if(conc) lab.dac[f] = RQ((lab.dac[f]||0) + dose);                       // axit đặc: không kèm nước
  else if(CHEMS[f].s === 'd') lab.mix.H2O = RQ((lab.mix.H2O||0) + dose); // dung dịch nào cũng mang theo nước
  concCheck();
  const fired = runReactions();
  if(!fired) explainNoRx(f);
  if(lab.big && !lab.catcher) bigVent('Cốc chưa đậy nắp');   // cốc to: khí rót vào mà không phản ứng hết thì bay ra
  lab.undo = {before, reacted:fired > 0, after:beakerSig()};
  updateBeaker();
}

/* =====================  ĐỐT TRONG LỌ KHÍ  =====================
   Đốt thật không bỏ chất vào cốc rồi đun. Ba bước như SGK:
     1. nạp O₂ / Cl₂ vào lọ khí (ngày có muôi đốt thì bình thu khí kiêm lọ khí)
     2. thả chất rắn vào muôi đốt (muôi treo lên giá), kéo đèn cồn vào dưới muôi cho bén lửa
     3. đưa muôi đang cháy vào lọ → phản ứng có cờ burn trong phan-ung.js
   Sản phẩm khí ở lại trong lọ (giao nguyên lọ), sản phẩm rắn gạt ra đĩa, hơi nước đọng thành lọ. */
const FLAME_COL = {Mg:'#ffffff', Al:'#ffffff', Fe:'#ffc46b', S:'#6f8ff0', P:'#fff1c9', C:'#ff7a3a',
                   Cu:'#ff9a52', Zn:'#d6efb0', Na:'#ffd23f', K:'#c79bff', C12H22O11:'#ffa64d'};
const ladleFuel = () => Object.keys(lab.ladle).filter(f => lab.ladle[f] > 0);
function fillJar(f, dose){
  toxicCheck(f);
  lab.gas[f] = RQ((lab.gas[f]||0) + dose);
  SFX.pour();
  toast('Đã nạp ' + doseStr(f, dose) + ' ' + sub(f) + ' vào lọ khí.');
  updateBeaker();
}
/* BỘ ĐỐT: kéo muôi vào thảm — hoặc thả chất rắn vào muôi — là muôi TREO lên giá giữa thảm (lab.spoonOn; vòng giá
   đỡ đĩa chặn, chén muôi thòng xuống); các bộ khác đang chiếm miệng cốc tháo ra. Kéo đèn cồn vào thảm thì đèn ĐỔI
   CHỖ với cốc: đèn vào giữa, ngay dưới muôi, cốc sang chỗ cất của đèn; ngọn lửa liếm chén muôi, muôi có chất thì một
   nhịp sau bén lửa. Kéo đèn ra khỏi thảm là trả chỗ; kéo muôi TRỐNG ra khỏi thảm là tháo muôi xuống;
   đổ chất trên muôi vào bồn thì muôi, đèn, cốc tự về chỗ cũ; đốt xong thì mọi thứ đứng yên (muôi trống kéo ra là tháo). */
const spoonUp = () => !!TOOLPOS.burn && !!lab.spoonOn;
const SPOON_BUSY = 'Muôi đang treo trên giá giữa thảm — đốt xong, hoặc kéo muôi sang <b>bồn rửa</b> đổ chất đi, rồi hãy lắp bộ khác.';
function mountSpoon(on){
  if(!TOOLPOS.burn || !!lab.spoonOn === on) return;
  if(on){
    if(lab.heaterOn) setHeat(false);
    if(lab.catcher) setCatch(false);
    if(lab.filterOn) setFilter(false);
    if(lab.elecOn) setElec(false);
    // muôi treo giữa thảm thì cốc tự lùi ra ngoài — sang đúng chỗ cất của muôi (vừa trống); tháo muôi thì cốc về
    if(!lab.bkPark){ const s = L3.slots.burn; lab.bkPark = {x: s.x, y: s.y}; lab.bkAuto = true; }
    lab.spoonOn = true;
  } else releaseSpoon();
  if(!on){ lab.ladleLit = false; syncLadle(); }
  layoutRigs(); SFX.clink(); updateBeaker();
}
// muôi rời giá (tháo xuống, đốt hết, đổ bồn): cốc bị muôi đẩy ra thì quay về giữa thảm
function releaseSpoon(){
  lab.spoonOn = false;
  if(lab.bkAuto){ lab.bkPark = null; lab.bkAuto = false; }
}
function loadLadle(f, dose){
  lab.ladle[f] = RQ((lab.ladle[f]||0) + dose);
  mountSpoon(true);
  SFX.grain();
  toast('Đã cho ' + doseStr(f, dose) + ' ' + sub(f) + ' lên muôi đốt — muôi đã treo lên giá.'
        + (lab.ladleLit || lab.lampUnder ? '' : ' Giờ kéo <b>đèn cồn</b> vào thảm để hơ chén muôi.'));
  syncLadle(); layoutRigs(); armIgnite(); updateCoach();
}
function lampUnder(on){
  if(on && !spoonUp()){ SFX.err(); toast('Muôi chưa treo lên giá — kéo <b>muôi đốt</b> vào thảm (hoặc thả chất rắn vào muôi) trước đã.'); return; }
  if(!!lab.lampUnder === on) return;
  lab.lampUnder = on;
  if(!on && lab.ladleLit){ lab.ladleLit = false; syncLadle(); }   // rút đèn ra: chất chưa kịp đưa vào lọ thì tắt
  layoutRigs();
  SFX.clink(); if(on) SFX.ignite();
  armIgnite(); updateCoach();
}
// đèn đang ở dưới muôi có chất mà muôi chưa cháy → một nhịp sau thì bén (cả khi muôi vừa từ lọ quay về giá)
function armIgnite(){
  clearTimeout(lab.ignT);
  if(lab.lampUnder && spoonUp() && ladleFuel().length && !lab.ladleLit) lab.ignT = setTimeout(igniteLadle, 700);
}
function igniteLadle(){
  if(!lab || !lab.lampUnder || lab.ladleLit || !spoonUp() || !ladleFuel().length) return;
  lab.ladleLit = true;
  SFX.ignite();
  notify(ladleFuel().map(sub).join(', ') + ' trên muôi đã bén lửa — kéo muôi vào <b>lọ khí</b>!');
  syncLadle(); updateCoach();
}
function dumpLadle(){
  if(!ladleFuel().length){ toast('Muôi đang trống.'); return; }
  lab.ladle = {}; lab.ladleLit = false; releaseSpoon();   // đổ bồn xong muôi về chỗ cất
  SFX.splash(); toast('Đã đổ chất trên muôi vào bồn.');
  syncLadle(); layoutRigs(); updateCoach();
}
function burnInJar(){
  const fuel = ladleFuel();
  if(!fuel.length){ SFX.err(); notify('Muôi đang trống — thả chất rắn từ tủ vào muôi trước.'); return; }
  if(!lab.ladleLit){ SFX.err(); notify('Chất trên muôi chưa bén lửa — kéo <b>đèn cồn</b> vào thảm, dưới muôi đang treo, để hơ trước đã.'); return; }
  const gases = Object.keys(lab.gas).filter(f => lab.gas[f] > 0);
  if(!gases.length){
    SFX.err(); lab.ladleLit = false; syncLadle(); armIgnite();   // muôi về giá, đèn còn dưới thì bén lại
    notify('Lọ trống không — chút oxi trong lọ hết ngay, lửa tắt ngấm. Nạp <b>O₂</b> hoặc <b>Cl₂</b> vào lọ trước!');
    return;
  }
  const amtIn = f => CHEMS[f].s === 'k' ? (lab.gas[f]||0) : (lab.ladle[f]||0);
  const fired = [], obs = [];
  let solids = false;
  for(let pass = 0; pass < 4; pass++){
    const r = REACTIONS.find(r => r.burn && Object.keys(r.rg).every(f => amtIn(f) > 0));
    if(!r) break;
    const n = Math.min(...Object.keys(r.rg).map(f => amtIn(f) / r.rg[f]));
    learnRx(r);
    Object.keys(r.rg).forEach(f => {
      const box = CHEMS[f].s === 'k' ? lab.gas : lab.ladle;
      box[f] = RQ(box[f] - r.rg[f]*n);
      if(box[f] < 0.01) delete box[f];
    });
    Object.keys(r.pr).forEach(f => {
      const q = RQ(r.pr[f]*n);
      if(CHEMS[f].s === 'k'){ lab.gas[f] = RQ((lab.gas[f]||0) + q); toxicCheck(f); }  // khí ở lại trong lọ
      else if(f !== 'H2O'){ lab.solid[f] = RQ((lab.solid[f]||0) + q); solids = true; } // hơi nước đọng thành lọ
    });
    fired.push(eqStr(r));
    if(r.obs) obs.push(r.obs);
  }
  if(!fired.length){
    SFX.err(); lab.ladleLit = false; syncLadle(); armIgnite();   // muôi về giá, đèn còn dưới thì bén lại
    const ox = gases.filter(f => JAR_GASES.includes(f));
    notify(fuel.map(sub).join(', ') + (ox.length ? ' không cháy được trong khí ' + ox.map(sub).join(', ') + '.'
                                                : ' không cháy trong ' + gases.map(sub).join(', ') + ' — lọ cần khí <b>oxi</b> hoặc <b>clo</b>.')
          + ' Lửa tắt rồi.');
    return;
  }
  unlockAch('burn1');
  burnFX(fuel[0]);
  SFX.roar(); if(fuel[0] === 'Fe') SFX.crackle();
  const left = ladleFuel();
  // đốt xong muôi vẫn treo trên giá, cốc vẫn đứng ngoài: không tự đổi chỗ — người chơi tự kéo muôi trống ra khỏi thảm
  lab.ladleLit = false;   // hết chất cháy, hoặc hết khí trong lọ → lửa tắt (còn chất thì muôi về giá, hơ lại)
  eqPop(fired);
  const seen = [obs.length ? '<i>' + obs.join(' ') + '</i>' : '', solids ? 'Chất rắn được gạt từ muôi ra <b>đĩa</b>.' : '',
    left.length ? 'Lọ hết khí nên lửa tắt — trên muôi còn dư ' + left.map(sub).join(', ') + '.' : ''].filter(Boolean);
  if(seen.length) notify(seen.join('<br>'));
  syncLadle();
  updateBeaker();
}
function burnFX(f){
  const jar = G.querySelector('#tool_gas'), sp = G.querySelector('#tool_burn');
  if(!jar) return;
  const gr = G.getBoundingClientRect(), s = gr.width/1280, r = jar.getBoundingClientRect();
  const cx = (r.left + r.width/2 - gr.left)/s, cy = (r.top + r.height*0.5 - gr.top)/s;
  if(sp){   // muôi dựng đứng thò vào lọ một nhịp: nắp muôi đậy đúng miệng lọ, rồi về giá (còn chất) hoặc về chỗ cất
    const jb = {l: parseFloat(jar.style.left), t: parseFloat(jar.style.top), w: parseFloat(jar.style.width), h: parseFloat(jar.style.height)};
    const js = jar.dataset.sid || 'sym-gasbottle', rim = anchorIn(js, 'rim', jb);   // bình có thể đang cất hay đang lắp trên giá
    moveTool('burn', 'sym-burnspoon', 'disc', rim.x, rim.y, jb.w / T3D[js].w, (parseInt(jar.style.zIndex) || 40) + 2);
    setTimeout(() => { if(lab){ layoutRigs(); armIgnite(); } }, 1300);
  }
  const col = FLAME_COL[f] || '#ffb347';
  const fx = document.createElement('div');
  fx.className = 'burnfx';
  fx.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;--fc:' + col;
  G.appendChild(fx); setTimeout(() => fx.remove(), 1500);
  // sắt toé hoa lửa, photpho/kim loại cháy toả khói trắng, còn lại vài tia nhỏ
  const smoke = ['P','Mg','Al','Zn','Na','K'].includes(f), n = f === 'Fe' ? 16 : 8;
  for(let k = 0; k < n; k++){
    const p = document.createElement('div');
    p.className = smoke ? 'burnsmoke' : 'burnspark';
    const a = Math.random()*Math.PI*2, d = 26 + Math.random()*(f === 'Fe' ? 52 : 26);
    p.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;--dx:' + (Math.cos(a)*d).toFixed(0) + 'px;--dy:'
      + (Math.sin(a)*d - (smoke ? 34 : 0)).toFixed(0) + 'px;--fc:' + col + ';animation-delay:' + (Math.random()*.25).toFixed(2) + 's';
    G.appendChild(p); setTimeout(() => p.remove(), 1500);
  }
}
function syncLadle(){
  if(lab && lab.day.free) renderFreeNote();   // muôi đổi thì giấy nhớ ca tự do ghi lại
  const sv = G.querySelector('#sv_burn'); if(!sv || !lab) return;
  const fuel = ladleFuel(), lit = lab.ladleLit && fuel.length > 0;
  sv.style.setProperty('--fuel', fuel.length ? 1 : 0);
  if(fuel.length) sv.style.setProperty('--lc', CHEMS[fuel[0]].c);
  setFx(sv, 'flame', lit ? 1 : 0);
  sv.style.setProperty('--fc', FLAME_COL[fuel[0]] || '#ffb347');
  const it = G.querySelector('#tool_burn');
  if(it){
    it.classList.toggle('lit', lit);
    it.title = 'Muôi đốt' + (fuel.length ? ' · ' + fuel.join(', ') : '');
  }
}
function ladleHint(){
  if(!ladleFuel().length) return '<b>Muôi đốt</b>: kéo muôi vào thảm (hoặc thả chất rắn từ tủ vào muôi) — muôi treo lên giá → kéo <b>đèn cồn</b> vào thảm cho lửa hơ chén muôi → kéo muôi đang cháy vào <b>lọ khí</b> (bình thu khí đã nạp O₂ / Cl₂).';
  if(!lab.ladleLit) return 'Kéo <b>đèn cồn</b> vào thảm — đèn đổi chỗ với cốc, lửa hơ chén muôi cho chất bén lửa.';
  return 'Muôi đang cháy — kéo vào <b>lọ khí</b> (bình thu khí đã nạp O₂ / Cl₂)!';
}

/* =====================  VÌ SAO KHÔNG PHẢN ỨNG?  =====================
   Cốc im re thì giáo sư nói LÝ DO (đốt nhầm chỗ, thiếu nhiệt, dãy hoạt động, chất không tan…)
   thay vì để trò thử bừa. focus = chất vừa rót: chỉ nói lý do có dính tới chất đó. */
const ACTIVITY = ['K','Na','Mg','Al','Zn','Fe','H','Cu','Ag'];
const METALS = ACTIVITY.filter(m => m !== 'H');
const metalOf = f => (f.match(/^(K|Na|Mg|Al|Zn|Fe|Cu|Ag|Ca|Ba|Mn)(?![a-z])/) || [])[1];
function whyNoReaction(focus){
  const mix = lab.mix, tools = lab.day.tools;
  const has = f => (mix[f]||0) > 0.009;
  const here = Object.keys(mix).filter(has), rest = here.filter(f => f !== 'H2O');
  const liquid = here.some(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd');
  const lies = f => (lab.undissolved[f]||0) > 0.009;   // chất rắn tan còn nằm dưới đáy, chưa khuấy
  // cốc khô: chất rắn chưa tan dưới đáy (KMnO₄…) vẫn nung được — như runReactions
  const ready = r => Object.keys(r.rg).every(f => has(f) || (f === 'H2O' && liquid) || (r.heat && !liquid && lies(f)));
  const hit = inv => !focus || inv.includes(focus);
  // câu nói lấy từ PROF_NO_RX (loi-thoai.js)
  const say = (k, v) => fillLine(PROF_NO_RX[k], v || {});
  for(const r of REACTIONS) if(r.burn && ready(r)){
    const g = Object.keys(r.rg).find(f => CHEMS[f].s === 'k'), fu = Object.keys(r.rg).find(f => f !== g);
    if(hit([g, fu])) return say(tools.includes('burn') ? 'dot-sai-cho' : 'khong-muoi', {fuel:sub(fu), gas:sub(g)});
  }
  // đang đun mà chất cần NUNG KHÔ (dry) còn lẫn trong nước / dung dịch: nói cách tách ra, đừng để trò đun suông
  if(lab.heaterOn && liquid){
    const wet = here.filter(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd');
    const r = REACTIONS.find(r => r.dry && Object.keys(r.rg).every(f => has(f) || lies(f)) && (!r.cat || r.cat.every(has)));
    if(r && hit(Object.keys(r.rg).concat(wet))){
      const rs = Object.keys(r.rg).filter(f => CHEMS[f].s === 'r');
      return say(tools.includes('filter') && rs.every(isPrecip) ? 'can-kho-loc' : 'can-kho', {list:rs.map(sub).join(', ')});
    }
  }
  // Al, Fe trong H₂SO₄ / HNO₃ đặc nguội: thụ động — nói rõ, đừng chỉ bảo "cần nhiệt"
  if(!lab.heaterOn) for(const a of ['H2SO4','HNO3']) if(concOf(a) > 0.009) for(const m of ['Al','Fe'])
    if(has(m) && hit([m, a])) return say('thu-dong', {m, acid:sub(a)});
  if(!lab.heaterOn && tools.includes('heat')){
    const r = REACTIONS.find(r => r.heat && !(r.dry && liquid) && ready(r) && (!r.cat || r.cat.every(has)) && concOK(r));
    if(r && hit(Object.keys(r.rg))) return say('thieu-nhiet');
  }
  // đủ chất, đủ nhiệt, đúng nồng độ nhưng thiếu chất xúc tác (KClO₃ cần MnO₂)
  for(const r of REACTIONS) if(r.cat && !r.elec && !r.burn && !(r.dry && liquid) && ready(r) && !r.cat.every(has) && concOK(r) && (!r.heat || lab.heaterOn)){
    const c = r.cat.find(f => !has(f));
    if(hit(Object.keys(r.rg))) return say('thieu-xt', {cat:sub(c)});
  }
  // đủ chất, đủ nhiệt nhưng axit đang loãng mà phương trình cần axit đặc
  for(const r of REACTIONS) if(!r.elec && !r.burn && ready(r) && (!r.cat || r.cat.every(has)) && !concOK(r) && (!r.heat || lab.heaterOn)){
    const a = Object.keys(r.tag).find(f => r.tag[f] === 'đặc' && !(concOf(f) > 0.009));
    if(a && hit(Object.keys(r.rg).concat(r.cat || []))) return say('can-dac', {acid:sub(a)});
  }
  const metals = METALS.filter(has);
  for(const a of ['HCl','H2SO4']) if(has(a)) for(const m of metals)
    if(ACTIVITY.indexOf(m) > ACTIVITY.indexOf('H') && hit([m, a]))
      return say('sau-hidro', {m, acid:sub(a)});
  const salts = rest.filter(f => !METALS.includes(f) && CHEMS[f].s === 'r' && CHEMS[f].sol && METALS.includes(metalOf(f)));
  for(const m of metals) for(const s of salts){
    const sm = metalOf(s);
    if(m !== sm && ACTIVITY.indexOf(m) > ACTIVITY.indexOf(sm) && hit([m, s]))
      return say('yeu-hon', {m, sm, salt:sub(s)});
  }
  if(has('H2O') && rest.length && rest.every(f => metals.includes(f)) && hit(rest.concat('H2O')))
    return say('kl-nuoc', {list:rest.join(', ')});
  if(has('H2O') && rest.length && rest.every(isPrecip) && hit(rest.concat('H2O')))
    return say('khong-tan', {list:rest.map(sub).join(', ')});
  const sol = rest.filter(f => CHEMS[f].s === 'r' && CHEMS[f].sol && (metalOf(f) || f.startsWith('NH4')));   // muối thật, không tính đường
  if(sol.length >= 2 && sol.length === rest.length && hit(sol))
    return say('trao-doi', {list:sol.map(sub).join(' và ')});
  return null;
}
// nói một lần cho mỗi lý do mới — rót tiếp cùng một lỗi thì không lải nhải
function explainNoRx(focus){
  const why = whyNoReaction(focus);
  if(!why || why === lab.lastWhy) return;
  lab.lastWhy = why;
  setTimeout(() => { if(lab) notify('<b>Giáo sư:</b> ' + why); }, 350);
}

/* =====================  AN TOÀN PHÒNG THÍ NGHIỆM  =====================
   Ba thói quen KHTN 8 dạy, giờ thành luật chơi: đeo kính & găng trước khi lấy hoá chất,
   bật tủ hút khi làm với khí độc, pha axit thì rót AXIT vào NƯỚC. Phạm lỗi thì giáo sư nhắc,
   làm hộ cho an toàn, và ca đó mất sao thứ ba. Ngày đầu tiên chỉ nhắc, không trừ. */
const TOXIC = ['Cl2','SO2','NH3','NO2','NO','CO'];
// tủ hút vẽ thẳng (không qua <use>) để CSS quay được cánh quạt khi bật
const HOOD_SVG = '<svg width="96" height="66" viewBox="0 0 100 70">'
  + '<rect x="4" y="4" width="92" height="62" rx="8" fill="#e8e0cc" stroke="#3b3025" stroke-width="3"/>'
  + '<path d="M10,12 L58,12 M10,58 L58,58" stroke="#3b3025" stroke-width="1.5" opacity=".3"/>'
  + '<circle cx="34" cy="35" r="22" fill="#fffdf5" stroke="#3b3025" stroke-width="2.5"/>'
  + '<g class="fanblades">' + [0,120,240].map(a => '<path transform="rotate(' + a + ' 34 35)" d="M34,35 Q27,20 35,14 Q44,20 34,35 Z" fill="#9fb8c8" stroke="#3b3025" stroke-width="2" stroke-linejoin="round"/>').join('') + '</g>'
  + '<circle cx="34" cy="35" r="4" fill="#3b3025"/>'
  + '<rect x="68" y="16" width="18" height="38" rx="5" fill="#fffdf5" stroke="#3b3025" stroke-width="2.5"/>'
  + '<rect class="knob" x="70" y="36" width="14" height="16" rx="3" stroke="#3b3025" stroke-width="2"/></svg>';
/* khay to trên phần bàn kéo dài sang trái, trước mặt khách (#custtray: hàng giao trượt tới đây). Khay nằm trong cột
   khách nên theo cột khi màn rộng hơn 16:9; style.css neo nó theo bàn (y 440 → 580 trên màn 1280×720).
   Vẽ theo cùng điểm tụ với bàn (x ≈ CX, y ≈ VP_Y): ở bên trái nên mép sau lệch hẳn sang phải, thấy mặt bên phải.
   Khay là chỗ DUY NHẤT để giao hàng (data-dz="cust"): chỉ các mảng vẽ của khay bắt chuột, phần trống của svg thì không.
   .tray-dz là viền nét đứt quanh khay, chỉ hiện lúc đang kéo cốc / bình khí / đĩa lọc */
const TRAY_SVG = '<svg class="traysvg" viewBox="0 0 340 140">'
  + '<path d="M38,126 L292,126 L330,22 L106,22 Z" fill="#3b3025" opacity=".14"/>'
  + '<g id="custtray" data-dz="cust">'
  + '<path d="M282,118 L321,15 L321,25 L282,129 Z" fill="#95a1ab" stroke="#83909b" stroke-width="1.6" stroke-linejoin="round"/>'
  + '<path d="M32,118 L282,118 L282,129 L32,129 Z" fill="#a9b4bd" stroke="#83909b" stroke-width="1.6" stroke-linejoin="round"/>'
  + '<path d="M98,15 L321,15 L282,118 L32,118 Z" fill="#cfd6dc" stroke="#96a2ac" stroke-width="1.6" stroke-linejoin="round"/>'
  + '<path d="M110,24 L306,24 L272,108 L48,108 Z" fill="#e7ecf0" stroke="#aeb9c2" stroke-width="1.8" stroke-linejoin="round" opacity=".92"/>'
  + '<path d="M122,32 L200,32 M66,98 L100,98" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>'
  + '<path d="M98,15 H321 V25 L282,129 H32 V118 Z" fill="none" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>'
  + '<path class="tray-dz" d="M90,6 L334,6 L291,137 L22,137 Z"/>'
  + '</g></svg>';
function safetyHit(code, msg){
  if(lab.safeHits[code]) return;        // mỗi loại lỗi chỉ tính một lần trong ca
  lab.safeHits[code] = 1;
  if(!lab.hard){ notify('<b>Giáo sư:</b> ' + msg); return; }   // chế độ thường: chỉ giảng, không tính lỗi
  const warnOnly = lab.i === 0;         // ngày đầu: chỉ nhắc cho quen, không trừ sao
  if(!warnOnly){ lab.safety++; runMiss(); }
  SFX.err();
  notify('<b>Giáo sư:</b> ' + msg + ' <i>' + (warnOnly ? PROF_SAFETY.nhacThoi : PROF_SAFETY.truSao) + '</i>');
}
function wearGoggles(){
  if(lab.goggles) return;
  lab.goggles = true;
  const el = G.querySelector('#goggles');
  if(el){ el.classList.add('worn'); el.querySelector('.wallcap').textContent = 'Đã đeo kính & găng'; }
  SFX.clink();
  updateCoach();
}
function setHood(on){
  lab.hood = on;
  const el = G.querySelector('#hoodsw');
  if(el){ el.classList.toggle('on', on); el.querySelector('.wallcap').textContent = 'Tủ hút: ' + (on ? 'BẬT' : 'tắt'); }
  if(on) SFX.ignite(); else SFX.clink();
  updateCoach();
}
// khí độc vừa xuất hiện (rót ra, nạp vào lọ, hay phản ứng sinh ra) mà tủ hút còn tắt
function toxicCheck(f){
  if(!TOXIC.includes(f) || lab.hood) return;
  safetyHit('tu-hut', fillLine(PROF_SAFETY['tu-hut'], {f:sub(f)}));
  setHood(true);
}
// trước khi rót chất đầu tiên vào cốc / pha thêm nước
function pourSafety(f){
  if(!lab.goggles){
    safetyHit('kinh', PROF_SAFETY['kinh']);
    wearGoggles();
  }
}

/* ---- pouring animation (visual only; logic already applied) ----
   Neo theo beakerBox(): cốc giờ trôi theo phối cảnh và nhấc lên khi đun,
   nên toạ độ cứng như bản bàn phẳng cũ sẽ rót trượt ra ngoài. */
/* Hình học cốc trên màn hình LÚC NÀY (giữa thảm, nhấc trên kiềng, hay đang đặt bên ngoài): tâm miệng, bán kính lòng cốc,
   mặt chất lỏng (null nếu cốc khô), mặt lớp chất rắn, đáy. Mọi hiệu ứng rót / sủi bọt / kết tủa rơi neo theo đây,
   không theo hộp hình (hộp có cả miệng đổ nên tâm hộp lệch khỏi tâm cốc). */
function beakerGeo(){
  if(lab && lab.big) return bigGeo();   // cốc to: hiệu ứng neo theo cốc trong khung
  const b = beakerBoxAt(lab && lab.heaterOn), k = b.w / BK.w, at = vy => b.t + vy*k;
  const bk = G.querySelector('#beakerItem');
  return {x: b.l + BK.cx*k, mouth: at(BK.top), floor: at(BK.bot), rx: BK.rx*k, ry: BK.ry*k,
          surf: lab && lab.bkH ? at(BK.bot - lab.bkH) : null, solid: at(BK.bot - (lab && lab.bkPH || 0)),
          z: (bk && parseInt(bk.style.zIndex)) || ZB};
}
function pourFX(f){
  const c = CHEMS[f], cs = contSym(f), q = beakerGeo(), m = q.mouth;
  const isPip = (cs === 'sym-bottle-liquid'), isSpoon = (cs === 'sym-jar-powder');
  const land = q.surf !== null ? q.surf : q.solid;   // chất rơi tới mặt chất lỏng; cốc khô thì tới đáy / mặt chất rắn
  const g = document.createElement('div');
  g.className = 'pourghost' + (isPip ? ' ppip' : isSpoon ? ' pspoon' : '');
  g.style.zIndex = q.z + 3;
  if(isPip){        // ống nhỏ giọt: đầu ống (đáy hình 34×120) chúc ngay trên tâm miệng cốc
    g.style.left = (q.x - 17) + 'px'; g.style.top = (m - 126) + 'px';
    g.innerHTML = sym('sym-pipette',34,120,'--lc:'+c.c);
  } else if(isSpoon){ // thìa bột: lòng thìa (điểm xoay 24% 96%) ngay trên miệng cốc, nghiêng đổ vào giữa
    g.style.left = (q.x - 72*0.24 - 6) + 'px'; g.style.top = (m - 72*0.96 - 8) + 'px';
    g.innerHTML = sym('sym-spoon',72,72,'--lc:'+c.c+';--spop:1');
  } else {          // kim loại / khí giữ nguyên vật đựng; điểm xoay (80% 90%) bên phải miệng, miệng lọ ngả vào giữa
    g.style.left = (q.x + 36 - 58*0.8) + 'px'; g.style.top = (m - 10 - 80*0.9) + 'px';
    g.innerHTML = sym(cs,58,80,'--lc:'+c.c+';--lc2:#00000022');
  }
  G.appendChild(g);
  if(isPip){        // dòng chảy từ đầu ống xuống ĐÚNG mặt chất lỏng, chạm mặt thì gợn vòng
    const st = document.createElement('div');
    st.className = 'stream';
    st.style.cssText = 'left:' + (q.x - 3.5) + 'px;top:' + (m - 6) + 'px;background:' + c.c + ';z-index:' + (q.z + 2)
      + ';--len:' + Math.max(8, land - m + 6).toFixed(0) + 'px';
    G.appendChild(st); setTimeout(()=>st.remove(), 850);
    if(q.surf !== null){
      const rp = document.createElement('div');
      rp.className = 'ripple';
      rp.style.cssText = 'left:' + q.x + 'px;top:' + land + 'px;width:' + (q.rx*1.3).toFixed(0) + 'px;height:' + (q.ry*1.3).toFixed(0)
        + 'px;z-index:' + (q.z + 2);
      G.appendChild(rp); setTimeout(()=>rp.remove(), 900);
    }
    SFX.pour();
  } else {          // hạt rơi từ miệng xuống mặt chất lỏng / đáy, rải trong lòng cốc
    for(let k=0;k<7;k++){
      const gr = document.createElement('div');
      gr.className = 'grain';
      gr.style.cssText = 'left:' + (q.x + (Math.random()*2 - 1)*q.rx*0.35) + 'px;top:' + (m - 4 + Math.random()*6) + 'px;background:' + c.c
        + ';border:1px solid #3b302566;z-index:' + (q.z + 2) + ';--fall:' + Math.max(6, land - m).toFixed(0) + 'px;animation-delay:' + (Math.random()*.35) + 's';
      G.appendChild(gr); setTimeout(()=>gr.remove(), 1000);
    }
    SFX.grain();
  }
  setTimeout(()=>g.remove(), 900);
}

/* ---- beaker visuals ---- */
/* Giấy nhớ ca tự do: ghi đúng những hạt đang có. Chất điện li đã tan (axit, kiềm, muối tan) phân li thành ION TỰ DO,
   cộng dồn theo từng loại ion (NaCl + Na₂SO₄ → một dòng Na⁺); kết tủa, chất chưa tan, nước, đường, khí giữ nguyên
   công thức hợp chất. Thêm bình khí, đĩa lọc, muôi đốt nếu có. Chỉ ghi công thức và lượng — không tên, không nhãn. */
const ION_Z = {Cl:-1, Br:-1, ClO:-1, ClO3:-1, AlO2:-1, NO3:-1, HCO3:-1, OH:-1, MnO4:null, SO4:-2, CO3:-2, SO3:-2, PO4:-3};
const CAT_Z = {H:1, Na:1, K:1, NH4:1, Ag:1, Ca:2, Ba:2, Mg:2, Zn:2, Cu:2, Mn:2, Al:3, Fe:null};
const ION_COL = {'Cu2+':'#4f9fd8', 'Fe2+':'#bcd6b4', 'Fe3+':'#d9a86a', 'Mn2+':'#f3dfe0', 'MnO4-':'#8a3d9e', 'MnO42-':'#3e7d4a'};
// công thức → {cat, zc, nc, an, za, na} nếu là axit / bazơ / muối của các ion trên, không thì null
function ionParts(f){
  for(const an of Object.keys(ION_Z).sort((a, b) => b.length - a.length)){
    const m = new RegExp('^(?:\\((NH4)\\)(\\d+)|(NH4|[A-Z][a-z]?)(\\d*))(?:\\(' + an + '\\)(\\d+)|' + an + '(\\d*))$').exec(f);
    if(!m) continue;
    const cat = m[1] || m[3]; if(!(cat in CAT_Z) || (cat === 'H' && an === 'OH')) continue;
    const nc = +(m[2] || m[4] || 1), na = +(m[5] || m[6] || 1);
    let zc = CAT_Z[cat], za = ION_Z[an];
    if(za === null) za = -zc*nc/na; if(zc === null) zc = -za*na/nc;
    return {cat, zc, nc, an, za, na};
  }
  return null;
}
const WEAK_ACIDS = [];   // axit rất yếu (gần như không phân li) thì thêm vào đây để ghi dạng phân tử
const dissolves = f => f !== 'H2O' && f !== 'C12H22O11' && !WEAK_ACIDS.includes(f) && (CHEMS[f].sol || CHEMS[f].s === 'd') && ionParts(f);
const ionHTML = (base, z) => sub(base) + '<sup>' + (Math.abs(z) > 1 ? Math.abs(z) : '') + (z > 0 ? '+' : '−') + '</sup>';
function renderFreeNote(){
  const host = G.querySelector('#freenote-body'); if(!host) return;
  const n10 = v => v/10;
  const qty = (v, base) => lab.hard && base !== 'H2O' ? fmt(n10(v)*molarMass(base), 2) + ' g' : amt(v);
  const row = (html, v, base, col) => `<div class="fn-row"><i class="fn-sw" style="background:${col || 'transparent'}"></i>`
    + `<b>${html}</b><span class="fn-q">${qty(v, base)}</span></div>`;
  const list = o => Object.keys(o).filter(f => o[f] > 0);
  // cốc: gom ion từ mọi chất điện li đã tan
  const ions = new Map(), mols = [];
  list(lab.mix).forEach(f => {
    const p = dissolves(f);
    if(!p){ mols.push(f); return; }
    const c = concOf(f), v = lab.mix[f] - c;          // axit đặc gần như không phân li: ghi dạng phân tử
    if(c > 0.009) mols.push(f + '@đặc');
    if(v <= 0.009) return;
    [[p.cat, p.zc, p.nc], [p.an, p.za, p.na]].forEach(([base, z, k]) => {
      const key = base + (Math.abs(z) > 1 ? Math.abs(z) : '') + (z > 0 ? '+' : '-');
      const o = ions.get(key) || {base, z, v:0}; o.v += v*k; ions.set(key, o);
    });
  });
  const ionRows = [...ions.entries()].sort((a, b) => (b[1].z > 0) - (a[1].z > 0) || b[1].v - a[1].v)
    .map(([key, o]) => row(ionHTML(o.base, o.z), RQ(o.v), o.base, ION_COL[key]));
  const molAmt = f => f.endsWith('@đặc') ? concOf(baseChem(f)) : lab.mix[f];
  mols.sort((a, b) => (a === 'H2O') - (b === 'H2O') || molAmt(b) - molAmt(a));
  const molRows = mols.map(f => { const b = baseChem(f); return row(sub(b) + (b !== f ? '(đặc)' : ''), molAmt(f), b, CHEMS[b].c); }).concat(list(lab.undissolved).map(f => row(sub(f), lab.undissolved[f], f, CHEMS[f].c)));
  const plain = o => list(o).map(f => row(sub(f), o[f], f, CHEMS[f].c)).join('');
  const sec = (title, rows) => rows ? '<div class="fn-sec">' + title + '</div>' + rows : '';
  const cup = ionRows.join('') + (ionRows.length && molRows.length ? '<hr class="fn-hr">' : '') + molRows.join('');
  const html = sec('Cốc', cup) + sec('Bình khí', plain(lab.gas)) + sec('Đĩa lọc', plain(lab.solid)) + sec('Muôi đốt', plain(lab.ladle));
  host.innerHTML = html || '<div class="fn-empty">Cốc trống</div>';
}
function updateBeaker(){
  if(lab.day.free) renderFreeNote();
  const mix = lab.mix, ud = lab.undissolved;
  let liq = 0, pre = 0, liqColor = '#cfe6f2', preColor = '#ddd', preMax = 0, colMax = 0;
  Object.keys(mix).forEach(f => {
    if(isPrecip(f)){ pre += mix[f]; if(mix[f] > preMax){ preMax = mix[f]; preColor = CHEMS[f].c; } }
    else {
      liq += mix[f];
      if(f !== 'H2O' && mix[f] > colMax){ colMax = mix[f]; liqColor = CHEMS[f].c; }
    }
  });
  Object.keys(ud).forEach(f => { pre += ud[f]; if(ud[f] > preMax){ preMax = ud[f]; preColor = CHEMS[f].c; } }); // undissolved settles like sediment
  const zone = G.querySelector('#beakerItem');
  const lq = G.querySelector('#bk-liquid'), men = G.querySelector('#bk-meniscus');
  const pr = G.querySelector('#bk-precip'), tex = G.querySelector('#bk-precip-tex');
  // thang mức cũ (cốc cao 196) quy ra cốc 3D (đơn vị viewBox của sym-beaker)
  const f = BK.hMax/196;
  const PH = pre ? Math.min(7 + pre*8, 54)*f : 0;
  // mặt nước luôn nằm trên mặt lớp chất rắn (ít nước mà nhiều cặn thì chỉ còn lớp nước mỏng phủ trên)
  const H = liq ? Math.max(Math.min(30 + liq*15, 196)*f, PH + 3) : 0, y = BK.bot - H;
  // cột nước = hình trụ từ elip mặt nước (nửa sau) xuống elip mặt chất rắn / đáy cốc (nửa trước)
  const yS = BK.bot - PH, L = BK.cx - BK.rx, R = BK.cx + BK.rx, arc = ' A' + BK.rx + ',' + BK.ry + ' 0 0 1 ';
  if(liq) lq.style.d = 'path("M' + L + ',' + y + arc + R + ',' + y + ' L' + R + ',' + yS + arc + L + ',' + yS + ' Z")';
  lq.setAttribute('opacity', liq ? (colMax ? 0.8 : 0.55) : 0);   // nước trong thì trong hơn: thấy rõ cặn bên dưới
  lq.style.fill = liqColor;
  men.setAttribute('transform', 'translate(0,'+y+')');
  men.setAttribute('opacity', liq ? 1 : 0);
  lab.bkH = H; lab.bkPH = PH;                            // beakerGeo(): rót / bọt / kết tủa rơi tới đúng mặt
  pr.setAttribute('y', BK.bot-PH); pr.setAttribute('height', PH ? PH + BK.ry : 0);
  pr.style.fill = preColor;
  const ps = G.querySelector('#bk-precip-surf');         // mặt trên lớp chất rắn: elip, sáng hơn thân lớp một chút
  if(ps){ ps.setAttribute('transform', 'translate(0,'+(BK.bot-PH)+')'); ps.setAttribute('opacity', pre ? 1 : 0);
          if(/^#[0-9a-f]{6}$/i.test(preColor)) ps.style.fill = lerpHex(preColor, '#ffffff', .18); }
  tex.setAttribute('opacity', pre ? 1 : 0);
  tex.setAttribute('transform', 'translate(0,'+(-Math.max(0, PH-4))+')'); // hạt lấm tấm nằm trên mặt kết tủa
  const dr = G.querySelector('#bk-drops');
  if(dr) dr.setAttribute('opacity', lab.heaterOn && (liq || lab.steam) ? 1 : 0);   // nung khô: hơi nước đọng thành giọt trên thành cốc
  // đổi màu: vệt màu mới loang ra từ giữa khối chất lỏng, TRONG lòng cốc (nhóm bk-swirl nằm dưới bkclip)
  const swg = G.querySelector('#bk-swirl');
  if(swg && liq && liqColor !== lab.lastColor && lab.lastColor){
    const sw = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sw.setAttribute('cx', BK.cx); sw.setAttribute('cy', BK.bot - H/2); sw.setAttribute('r', BK.rx*0.25);
    sw.setAttribute('class', 'bkswirl'); sw.style.fill = liqColor;
    swg.appendChild(sw); setTimeout(()=>sw.remove(), 950);
  }
  if(lab.big) paintBig();
  lab.lastColor = liq ? liqColor : '';
  if(save.items && save.items.notes){
    const snc = G.querySelector('#stickynote-content');
    if(snc){
      // chế độ khó ghi khối lượng / thể tích như phiếu hàng (qtyStr) — ghi số mol là lộ luôn phép đổi mà chế độ khó bắt tự tính
      const q = (f, v) => lab.hard ? qtyStr(f, v) : amt(v).replace(' mol', '');
      const itemsList = Object.keys(mix).filter(f => mix[f]>0).map(f => {
        let label = sub(f);
        if(isPrecip(f)) label = '↓' + label;
        return `<div>• ${label}: ${q(f, mix[f])}</div>`;
      }).concat(Object.keys(ud).filter(f => ud[f]>0).map(f => {
        return `<div>• ↓${sub(f)}: ${q(f, ud[f])} <span style="font-size:10px; opacity:.65">(chưa tan)</span></div>`;
      })).join('');
      snc.innerHTML = itemsList || '<div style="opacity:.6">- cốc trống -</div>';
      const sw = G.querySelector('#sn-water');
      if(sw) sw.style.display = (mix.H2O > 0) ? 'flex' : 'none'; // water badge, bottom-right corner
    }
  }
  const gs = G.querySelector('#sv_gas');
  if(gs){ const full = tot(lab.gas) ? 1 : 0;
          setFx(gs, 'gasop', full); gs.style.setProperty('--stopop', full); }
  const gj = G.querySelector('#tool_gas');   // bình kiêm lọ khí: rê chuột thấy đang chứa khí gì
  if(gj){ const ks = Object.keys(lab.gas).filter(f => lab.gas[f] > 0);
          gj.title = 'Bình thu khí' + (ks.length ? ' · ' + ks.join(', ') : ''); }
  if(lab.elecOn) renderElecPanel();
  updateCoach();
  syncDish();
  // ngày 1 (hướng dẫn): hàng đã đúng thì khay trước mặt khách sáng lên — chỉ cho người mới biết bước cuối là giao.
  // Các ngày sau không sáng, kẻo thành trò rót từng giọt chờ khay sáng thay vì tự đếm số mol
  const tr = G.querySelector('#custtray');
  if(tr) tr.classList.toggle('ready', autoCoach() && !!readyVessel());
  const ub = G.querySelector('#bundo');
  if(ub){ ub.hidden = !canUndo(); if(!ub.hidden){ const bx = beakerBox(); ub.style.left = (bx.cx + Math.max(74, bx.w/2 + 10)) + 'px'; ub.style.top = (bx.bot - 36) + 'px'; } }
}
// bình nào (cốc / bình khí / đĩa lọc) đang chứa đúng hàng của khách hiện tại, không có thì null
function readyVessel(){
  const od = lab.day.orders[lab.oi]; if(!od || !lab.otag) return null;
  if(lab.big){   // cốc to: lớp nào (lỏng / rắn / khí) đang đúng hàng
    const P = bigPhases(), keep = lab.sel; let hit = null;
    for(const ph of ['liquid', 'solid', 'gas']){ lab.sel = PH_SEL[ph]; if(checkServe(P[ph], od) === true){ hit = ph; break; } }
    lab.sel = keep; return hit;
  }
  const keep = lab.sel; let hit = null;
  for(const [sel, box] of [['beaker', lab.mix], ['gas', lab.gas], ['solid', lab.solid]]){
    lab.sel = sel; if(checkServe(box, od) === true){ hit = sel; break; }
  }
  lab.sel = keep; return hit;
}
/* Đĩa thuỷ tinh chỉ TỒN TẠI khi đang có chất rắn trên nó (lọc ra, hoặc gạt từ muôi), ở góc trước bên phải thảm. */
function syncDish(){
  const host = G.querySelector('#dishHost'); if(!host) return;
  const ks = Object.keys(lab.solid).filter(f => lab.solid[f] > 0);
  if(!ks.length){ host.innerHTML = ''; return; }
  if(!host.querySelector('#dishEl')){
    const d = L3.dock.dish, k = kAt(d), w = T3D['sym-dish'].w*k, h = T3D['sym-dish'].h*k;
    host.innerHTML = place3({sid:'sym-dish', an:'base', x:d.x, y:d.y, k, z:zAt(d.y) + 20, id:'dishEl', svgId:'sv_dish', cls:'grab',
                             style:'--sop:1', title:'Đĩa lọc'});
    dragify(host.querySelector('#dishEl'), 'dish', {w, h,
      ghostHTML: () => G.querySelector('#sv_dish').outerHTML.replace('width="100%" height="100%"', 'width="'+w+'" height="'+h+'"')});
  }
  G.querySelector('#sv_dish').style.setProperty('--lc', CHEMS[ks[0]].c);
}
// sủi bọt: bọt sinh TRONG khối chất lỏng, nổi lên tới mặt thì vỡ; vài vệt khí bay lên khỏi mặt
function spawnBubbles(){
  const q = beakerGeo(), top = q.surf !== null ? q.surf : q.mouth, deep = Math.max(10, q.solid - top);
  for(let k=0; k<6; k++){
    const b = document.createElement('div');
    b.className = 'bubble';
    const sz = 5 + Math.random()*7, y0 = top + 6 + Math.random()*(deep - 10);
    b.style.cssText = 'width:'+sz+'px;height:'+sz+'px;left:'+(q.x - sz/2 + (Math.random()*2 - 1)*q.rx*0.7)+'px;'
      + 'top:'+y0+'px;z-index:'+(q.z + 2)+';--rise:'+(y0 - top + sz/2).toFixed(0)+'px;animation-delay:'+(Math.random()*.4)+'s';
    G.appendChild(b); setTimeout(()=>b.remove(), 1700);
  }
  for(let k=0; k<3; k++){
    const l = document.createElement('div');
    l.className = 'fizzline';
    l.style.cssText = 'left:'+(q.x + (Math.random()*2 - 1)*q.rx*0.6)+'px;top:'+(top - 10)+'px;z-index:'+(q.z + 2)+';animation-delay:'+(Math.random()*.3)+'s';
    G.appendChild(l); setTimeout(()=>l.remove(), 1100);
  }
  bigWord('SỦI!', '#7fc4c9');
  SFX.fizz();
}
// kết tủa: hạt hiện ra trong khối chất lỏng rồi lắng xuống mặt lớp chất rắn ở đáy
function spawnFall(color){
  const q = beakerGeo(), top = q.surf !== null ? q.surf : q.mouth;
  SFX.tinkle();
  for(let k=0; k<5; k++){
    const f = document.createElement('div');
    f.className = 'fall';
    const y0 = top + 4 + Math.random()*Math.max(4, (q.solid - top)*0.4);
    f.style.cssText = 'background:'+color+';border:1px solid var(--ink);z-index:'+(q.z + 2)+';left:'
      + (q.x - 3.5 + (Math.random()*2 - 1)*q.rx*0.7)+'px;top:'+y0+'px;--drop:'+Math.max(4, q.solid - y0 - 4).toFixed(0)+'px;animation-delay:'+(Math.random()*.3)+'s';
    G.appendChild(f); setTimeout(()=>f.remove(), 1400);
  }
}
// cốc chỉ lắc khi KHUẤY (bấm đũa / rê đũa trong lòng cốc) — rót, rút lại, axit bắn đều không lắc
function wiggleBeaker(){
  const b = G.querySelector(lab && lab.big ? '#bigBeaker' : '#beakerItem'); if(!b) return;
  b.classList.remove('shaken'); void b.offsetWidth; b.classList.add('shaken');
}

/* ---- dụng cụ cắm vào cốc: trượt vật từ ô của nó tới chỗ cốc ----
   place() ghi z-index thẳng vào inline style, nên lúc tháo ra phải TRẢ LẠI đúng số cũ.
   Xoá trắng (style.zIndex='') là vật tụt xuống z:auto và chui ra sau mặt bàn — mất tiêu. */
/* Đặt cốc ra ngoài thảm (pt: điểm thả trên màn hình, dy: từ giữa hình đang cầm xuống đáy cốc) hoặc đưa về giữa thảm (pt null).
   Cốc rời thảm thì các bộ đang lắp vào cốc tháo ra; lắp bộ mới (đun, thu khí, lọc, điện phân) thì cốc tự về giữa. */
function parkBeaker(pt, dy){
  if(!pt){
    if(!lab.bkPark) return;
    if(lab.lampUnder){ SFX.err(); toast('Đèn cồn đang ở giữa thảm hơ muôi — kéo đèn ra khỏi thảm rồi hãy đặt cốc vào.'); return; }
    lab.bkPark = null; lab.bkAuto = false;
  } else {
    const r = G.getBoundingClientRect(), s = r.width / 1280;
    if(lab.heaterOn) setHeat(false);
    if(lab.catcher) setCatch(false);
    if(lab.filterOn) setFilter(false);
    if(lab.elecOn) setElec(false);
    lab.bkPark = {x: (pt[0] - r.left) / s, y: Math.max(FAR_Y + 12, Math.min(NEAR_Y - 6, (pt[1] - r.top) / s + dy))};
    lab.bkAuto = false;   // người chơi tự đặt: tháo muôi xong cốc vẫn ở đó
  }
  layoutRigs(); SFX.clink(); updateBeaker();
}
const unpark = () => { lab.bkPark = null; lab.bkAuto = false; };   // bộ lắp nào cũng cần cốc ở giữa thảm
function dockZ(el, z){
  if(el.dataset.z0 === undefined) el.dataset.z0 = el.style.zIndex || '';
  el.style.zIndex = z;
}
function undockZ(el){ el.style.zIndex = el.dataset.z0 || ''; }

/* ---- BỘ LẮP TRÊN THẢM ----
   Thả dụng cụ vào thảm (hoặc thẳng vào cốc) là LẮP: nó bay từ chỗ cất tới đúng chỗ làm việc, đổi sang dáng
   dùng và to lên x1.5; khung giữ bộ ấy cần (kiềng, giá sắt) tự dựng lên. Kéo nó ra khỏi thảm là tháo.
   Mọi vị trí tính lại ở MỘT chỗ (layoutRigs), nên cốc nhấc lên kiềng thì chuông, điện cực… bám theo. */
function moveTool(key, sid, an, x, y, k, z){
  const it = G.querySelector('#tool_'+key), home = TOOLPOS[key]; if(!it || !home) return;
  const b = artBox(sid, an, x, y, k);
  it.style.left = b.l.toFixed(1)+'px'; it.style.top = b.t.toFixed(1)+'px';
  it.style.width = b.w.toFixed(1)+'px'; it.style.height = b.h.toFixed(1)+'px';
  it.style.zIndex = z;
  if(it.dataset.sid !== sid){ it.querySelector('svg use').setAttribute('href', '#'+sid); it.dataset.sid = sid; }
  const away = sid !== TOOLBOX[key].cat || x !== home.x || y !== home.y;
  it.classList.toggle('docked', away);
  const sh = G.querySelector('#sh_tool_'+key); if(sh) sh.classList.toggle('away', away);
}
function homeTool(key){
  const tl = TOOLBOX[key], q = TOOLPOS[key]; if(!q) return;
  moveTool(key, tl.cat, tl.an || 'rest', q.x, q.y, q.k, q.z);
  if(key === 'heat'){ const sv = G.querySelector('#sv_heat'); if(sv) sv.style.setProperty('--flame', 0); }
}
function layoutRigs(){
  if(!lab) return;
  const hung = spoonUp();
  if(lab.lampUnder && !hung) lab.lampUnder = false;   // muôi đã tháo / về chỗ: đèn về chỗ, cốc về giữa thảm
  const bk = G.querySelector('#beakerItem');
  if(bk){
    bk.style.setProperty('--lift', (-LIFT)+'px'); bk.classList.toggle('hot', !!lab.heaterOn);
    // cốc ở giữa thảm, hay đang đứng ngoài thảm (người chơi đặt ra / đổi chỗ với đèn) — hộp trượt tới đó và co lại
    const q = beakerSpot(), away = q.away, b = beakerBoxAt(false);
    bk.style.left = b.l.toFixed(1)+'px'; bk.style.top = b.t.toFixed(1)+'px';
    bk.style.width = b.w.toFixed(1)+'px'; bk.style.height = b.h.toFixed(1)+'px';
    bk.style.zIndex = away ? zAt(q.y) + 20 : ZB;
    const sh = G.querySelector('#sh_beakerItem');
    if(sh){ const w = b.w*0.7; sh.style.left = q.x+'px'; sh.style.top = (q.y-2)+'px'; sh.style.width = w.toFixed(1)+'px'; sh.style.height = (w*0.23).toFixed(1)+'px'; }
  }
  G.querySelectorAll('#tripod,.tri-sh').forEach(e => e.classList.toggle('up', !!lab.heaterOn));
  const rim = anchorIn('sym-beaker', 'rim', beakerBoxAt(lab.heaterOn));   // tâm miệng cốc trên màn hình
  // đun: đèn mở nắp chui vào giữa ba chân kiềng, dưới cốc. Hơ muôi: đèn vào đúng chỗ đó (không kiềng), dưới muôi
  if(TOOLPOS.heat){
    if(lab.heaterOn || lab.lampUnder){
      moveTool('heat', 'sym-lamp', 'base', BKP.x, BKP.y, KW, ZB - 2);
      const sv = G.querySelector('#sv_heat'); if(sv) sv.style.setProperty('--flame', 1);
    } else homeTool('heat');
  }
  // điện phân: thanh gác ngang miệng cốc, hai điện cực nhúng vào lòng cốc
  if(TOOLPOS.elec){ if(lab.elecOn) moveTool('elec', 'sym-electro', 'rest', rim.x, rim.y, KW, ZB + 8); else homeTool('elec'); }
  // giá sắt bên trái thảm, vòng giá xoay ra giữa thảm: giữ phễu lọc trên miệng cốc, hoặc muôi đốt có chất
  // (đĩa chặn gác trên vòng, chén muôi thòng xuống — đúng tầm ngọn lửa khi đèn vào dưới)
  if(TOOLPOS.filter || TOOLPOS.burn){
    const fs = L3.dock.filterStand, k = kAt(fs);
    const ring = anchorIn('sym-filterstand', 'ring', artBox('sym-filterstand', 'base', fs.x, fs.y, k));
    if(TOOLPOS.filter){ if(lab.filterOn) moveTool('filter', 'sym-funnel', 'seat', ring.x, ring.y, k, ZB + 8); else homeTool('filter'); }
    if(TOOLPOS.burn){ if(hung) moveTool('burn', 'sym-burnspoon', 'disc', ring.x, ring.y, k, ZB + 8); else homeTool('burn'); }
    G.querySelectorAll('#filterstand,.fs-sh,#fsring').forEach(e => e.classList.toggle('up', !!lab.filterOn || hung));
    // nửa TRƯỚC của vòng giá vẽ lại ĐÈ LÊN phễu / cán muôi (nửa sau vẫn nằm trong hình giá, phía sau): nhìn ra là
    // phễu ngồi TRONG vòng, muôi xỏ QUA vòng. Vòng nằm ngang nên hiện thành elip ry = rx·SIN_E.
    const fr = G.querySelector('#fsring');
    if(fr){
      const R = T3D['sym-filterstand'].r, rx = R.ring * k, ry = rx * SIN_E, w = 2 * R.tube * k;
      const d = 'M' + (ring.x - rx).toFixed(1) + ',' + ring.y.toFixed(1) + ' A' + rx.toFixed(1) + ',' + ry.toFixed(1) + ' 0 0 0 '
              + (ring.x + rx).toFixed(1) + ',' + ring.y.toFixed(1);
      [['#fsringline', w + 3], ['#fsringcore', w]].forEach(([s, sw]) => { const p = fr.querySelector(s); p.setAttribute('d', d); p.setAttribute('stroke-width', sw.toFixed(1)); });
      fr.style.zIndex = ZB + 9;
    }
  }
  // thu khí: chuông chụp miệng cốc → ống dẫn → ống mềm thòng dưới đáy bình; giá sắt dựng ngay chỗ cất bình
  // (sau bên phải), vòng giá quay về phía cốc, đáy thân bình (điểm neo mid) ngồi trong vòng
  if(TOOLPOS.gas){
    const gs = L3.dock.gasStand, k = kAt(gs);
    const ring = anchorIn('sym-ringstand', 'ring', artBox('sym-ringstand', 'base', gs.x, gs.y, k));
    if(lab.catcher) moveTool('gas', 'sym-gasbottle-rig', 'mid', ring.x, ring.y, k, zAt(gs.y) + 1); else homeTool('gas');
    G.querySelectorAll('#gasstand,#gashood,#gastube,.rig-sh').forEach(e => e.classList.toggle('up', !!lab.catcher));
    const hood = G.querySelector('#gashood');
    if(hood){
      const hb = artBox('sym-gashood', 'rim', rim.x, rim.y, KH);
      hood.style.cssText = boxCss(hb) + 'z-index:' + (ZB + 6);
      const n = anchorIn('sym-gashood', 'neck', hb), c = anchorIn('sym-gasbottle-rig', 'nozzle', artBox('sym-gasbottle-rig', 'mid', ring.x, ring.y, k));
      // ống đi lên khỏi cổ chuông, vắt sang phải, võng xuống dưới vòng giá rồi cắm ngược lên vòi đáy bình
      const d = 'M' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ' C' + (n.x + 40).toFixed(1) + ',' + (n.y - 60).toFixed(1) + ' '
              + c.x.toFixed(1) + ',' + (c.y + 70).toFixed(1) + ' ' + c.x.toFixed(1) + ',' + c.y.toFixed(1);
      G.querySelectorAll('#gastubeline,#gastubecore').forEach(e => e.setAttribute('d', d));
      const tb = G.querySelector('#gastube'); if(tb) tb.style.zIndex = ZB + 7;   // ống vắt qua trước cốc và chuông
    }
  }
  if(lab.big) syncBig();   // cốc to: vẽ lại đèn / nắp / phễu trong khung
}
/* Bật đèn = dựng cả BỘ ĐUN: kiềng mọc lên, cốc được nhấc đặt LÊN lưới amiăng, đèn chui vào giữa ba chân. */
function setHeat(on){
  if(lab.heaterOn === on) return;
  if(on && spoonUp()){ toast(SPOON_BUSY); return; }
  if(on) unpark();
  if(on && lab.filterOn) setFilter(false);   // không lọc trong lúc đun
  lab.heaterOn = on;
  if(!on) lab.steam = false;                 // tắt lửa: hết hơi nước bốc lên thành cốc
  layoutRigs();
  const sv = G.querySelector('#sv_heat'); if(sv) setFx(sv, 'flame', on ? 1 : 0);
  SFX.clink(); if(on) SFX.ignite();
  if(on && !runReactions()) explainNoRx();
  updateBeaker();
}
/* điện phân: thanh điện cực gác lên miệng cốc */
function setElec(on){
  if(lab.elecOn === on) return;
  if(on && spoonUp()){ toast(SPOON_BUSY); return; }
  if(on) unpark();
  if(on && lab.filterOn) setFilter(false);   // phễu và thanh điện cực cùng cần miệng cốc
  lab.elecOn = on;
  layoutRigs();
  const sv = G.querySelector('#sv_elec'); if(sv) sv.style.setProperty('--zap', on ? 1 : 0);
  SFX.clink();
  renderElecPanel();
  updateBeaker();
}
/* Dựng BỘ THU KHÍ. Khí đi một chiều: chuông chụp miệng cốc → cổ hẹp → ống dẫn → vào bình đứng trong giá. */
function setCatch(on){
  if(lab.catcher === on) return;
  if(on && spoonUp()){ toast(SPOON_BUSY); return; }
  if(on) unpark();
  if(on && lab.filterOn) setFilter(false);   // chuông và phễu cùng cần miệng cốc
  lab.catcher = on;
  if(!on && lab.big) bigVent('Mở nắp');   // cốc to: khí nằm dưới nắp, mở ra là bay hết
  layoutRigs();
  SFX.clink();
  updateBeaker();
}
/* Dựng BỘ LỌC: giá sắt bên trái thảm, vòng giá giữ phễu trên miệng cốc; kết tủa ở lại giấy lọc, chuyển sang đĩa.
   Lắp được cả khi chưa có kết tủa; lọc lúc lắp (nếu có kết tủa), hoặc sau đó kéo cốc lên phễu / phễu vào cốc. */
function setFilter(on){
  if(!!lab.filterOn === on) return;
  if(on){
    if(spoonUp()){ toast(SPOON_BUSY); return; }   // muôi và phễu cùng cần vòng giá
    if(lab.heaterOn){ toast('Cốc đang đun — kéo đèn cồn ra cho nguội rồi hãy lọc.'); return; }
    unpark();
    if(lab.catcher) setCatch(false);
    if(lab.elecOn) setElec(false);
  }
  lab.filterOn = on;
  layoutRigs();
  SFX.clink();
  if(on){
    if(Object.keys(lab.mix).some(isPrecip)) setTimeout(() => { if(lab && lab.filterOn) useFilter(); }, 450);   // giá dựng xong, phễu vào vòng rồi mới chảy
    else toast('Phễu đã lắp trên giá. Khi cốc có kết tủa, kéo <b>cốc</b> lên phễu (hoặc phễu vào cốc) để lọc.');
  }
}
function useFilter(){
  const moved = Object.keys(lab.mix).filter(isPrecip);
  if(!moved.length){ notify('Không có kết tủa nào trong cốc để lọc.'); return; }
  const fn = G.querySelector('#sv_filter');
  if(fn){ setFx(fn, 'dripop', 1); setTimeout(()=>setFx(fn, 'dripop', 0), 1400); }
  SFX.pour();
  moved.forEach(f => { lab.solid[f] = (lab.solid[f]||0) + lab.mix[f]; delete lab.mix[f]; });
  unlockAch('filter1');
  toast('Đã lọc ' + moved.map(sub).join(', ') + ' sang đĩa.');
  updateBeaker();
}
/* Kéo ĐĨA LỌC vào cốc: trút chất rắn trên đĩa lại vào cốc. Đây là cách nung một kết tủa cho đúng — lọc Cu(OH)₂ ra
   đĩa, giao hoặc đổ phần nước lọc, rồi trút Cu(OH)₂ vào cốc KHÔ mà đun (phản ứng dry, phan-ung.js). Cũng dùng để hoà
   chất rắn đã lọc sạch vào axit mới. Chất rắn tan (nếu có) lắng xuống đáy như lúc rót từ tủ, phải khuấy mới tan. */
function dishToBeaker(){
  const ks = Object.keys(lab.solid).filter(f => lab.solid[f] > 0);
  if(!ks.length) return;
  ks.forEach(f => {
    const q = RQ(lab.solid[f]);
    if(SLOW_DISSOLVE.includes(f)){ lab.undissolved[f] = RQ((lab.undissolved[f]||0) + q); lab.dissolveTotal = RQ(lab.dissolveTotal + q); }
    else lab.mix[f] = RQ((lab.mix[f]||0) + q);
  });
  lab.solid = {};
  pourFX(ks[0]);
  const wet = Object.keys(lab.mix).some(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd');
  toast('Đã trút ' + ks.map(sub).join(', ') + ' từ đĩa lọc vào cốc' + (wet ? '.' : ' khô.'));
  if(!runReactions()) explainNoRx(ks[0]);
  updateBeaker();
}
/* ---- glass-rod stirring: move the rod around inside the beaker to dissolve slow solids ---- */
function stirMove(p, dist){
  if(!lab || tot(lab.undissolved) <= 0) return;
  const bz = G.querySelector('#beakerItem'); if(!bz) return;
  const gr = G.getBoundingClientRect(), s = gr.width/1280, r = bz.getBoundingClientRect();
  // đũa phải đi vòng tròn TRONG lòng cốc mới ăn — ra ngoài thì không tính (cốc to: trong lòng cốc to)
  const cx = (r.left + r.width/2 - gr.left)/s, cy = (r.top + r.height*0.55 - gr.top)/s;
  if(lab.big ? !inBig(p) : Math.hypot(p.x-cx, p.y-cy) > 95) return;
  drag.stir = (drag.stir||0) + dist;
  if(drag.stir < 240) return; // one dissolve step per ~240px of stirring motion
  drag.stir = 0;
  dissolveStep();
}
// take: lượng tan mỗi bước (khuấy 0,5; đun nóng 0,25 mỗi giây). quiet: đun thì tan âm thầm, không lắc cốc, không tiếng rót
function dissolveStep(take = 0.5, quiet = false){
  const f = Object.keys(lab.undissolved)[0];
  take = Math.min(take, lab.undissolved[f]);
  lab.undissolved[f] = RQ(lab.undissolved[f] - take);
  if(lab.undissolved[f] <= 0) delete lab.undissolved[f];
  lab.mix[f] = RQ((lab.mix[f]||0) + take);
  if(!quiet){ wiggleBeaker(); SFX.pour(); }
  runReactions();
  if(tot(lab.undissolved) <= 0){ lab.dissolveTotal = 0; (autoCoach() ? notify : toast)('Tan hết rồi — dung dịch đồng nhất!'); }
  updateBeaker(); // after the reset, so the ring deactivates in the same frame the last bit dissolves
}

function dumpBeaker(){
  lab.mix = {}; lab.dac = {}; lab.undissolved = {}; lab.dissolveTotal = 0; lab.lastWhy = ''; lab.firstPour = null; lab.waterIn = false; lab.steam = false;
  const sk = G.querySelector('#sinksvg');
  if(sk){ sk.style.setProperty('--splash', 1); setTimeout(()=>sk.style.setProperty('--splash', 0), 800); }
  SFX.splash();
  toast('Đã đổ bỏ.');
  updateBeaker();
}
function pourGas(){
  if(!tot(lab.gas)){ toast('Bình khí đang trống.'); return; }
  Object.keys(lab.gas).forEach(f => { lab.mix[f] = (lab.mix[f]||0) + lab.gas[f]; });
  lab.gas = {};
  toast('Đã đổ khí từ bình vào cốc.');
  SFX.pour();
  runReactions(); updateBeaker();
}
function useLitmus(){
  unlockAch('quy1');
  const acid = Object.keys(lab.mix).some(f => CHEMS[f].a);
  const base = Object.keys(lab.mix).some(f => CHEMS[f].b);
  const res = acid && base ? 'Có cả axit lẫn bazơ — quỳ loang lổ đỏ/xanh!'
    : acid ? 'Quỳ tím hoá <b style="color:#d9634f">ĐỎ</b> — trong cốc có AXIT.'
    : base ? 'Quỳ tím hoá <b style="color:#6f9ec9">XANH</b> — trong cốc có BAZƠ.'
    : 'Quỳ tím <b style="color:#9b7bb8">KHÔNG đổi màu</b> — không có axit hay bazơ.';
  toast(res);
}

/* ---- customers & serving ---- */
function orderLine(od, oi, alt){
  const c = CUSTOMERS[od.who];
  const uses = USE_LINES[od.chem];
  const tpl = alt || od.line || (uses ? uses[(od.who + oi) % uses.length] : ORDER_TPL[(od.who + oi) % ORDER_TPL.length]);
  return tpl.replace(/\{A\}/g, c[2]).replace('{q}', qtyStr(od.chem, od.n))
            .replace('{name}', (od.pname || CHEMS[od.chem].n.toLowerCase())
                                 .replace(/\s*\([^)]*\)\s*$/, '')) // gợi ý cuối tên chỉ hiện trên phiếu
            .replace('{f}', sub(od.chem));
}
/* Ngày đầu tiên mỗi dụng cụ xuất hiện — để nhắc cách dùng ngay trong màn. */
// Ngày có muôi đốt, đèn cồn chỉ để hơ muôi và bình thu khí chỉ làm lọ khí (mẹo muôi đốt đã nói) —
// mẹo "đun cốc" và "hứng khí" để dành tới ngày đầu tiên thực sự phải đun cốc / hứng khí từ cốc.
const TOOL_FIRST = (() => { const m = {rod:0};
  DAYS.forEach((d,i) => (d.tools||[]).forEach(t => {
    if(m[t] === undefined && !((t === 'gas' || t === 'heat') && d.tools.includes('burn'))) m[t] = i; }));
  return m; })();
const TOOL_TIP = {
  rod:    '<b>Đũa khuấy</b> ở đầu bàn: kéo vào cốc rồi <b>khuấy tròn</b> cho chất ít tan tan hết.',
  heat:   'Mới: <b>Đèn cồn</b>. Kéo đèn vào cốc — kiềng sẽ mọc lên đỡ cốc. Kéo ra là tắt.',
  gas:    'Mới: <b>Bình thu khí</b>. Kéo lên miệng cốc <b>trước khi</b> phản ứng sinh khí, không thì khí bay mất.',
  filter: 'Mới: <b>Phễu lọc</b>. Kéo phễu vào cốc (hoặc kéo cốc lên phễu) để lọc kết tủa ra đĩa, rồi kéo <b>đĩa lọc</b> sang khách.',
  elec:   'Mới: <b>Bộ điện phân</b>. Kéo vào cốc, rồi chọn chất và <b>số mol</b> ở bảng dưới mép bàn.',
  burn:   'Mới: <b>Muôi đốt</b>. Thả bình O₂ vào <b>bình thu khí</b> để nạp lọ khí → thả chất rắn vào muôi (muôi tự treo lên giá) → kéo <b>đèn cồn</b> vào thảm cho lửa hơ chén muôi → kéo muôi đang cháy vào lọ khí.'
};
/* Đơn này có phải làm bằng muôi đốt không? Có phản ứng cháy ra đúng chất đó từ những gì
   điều chế được hôm nay. Nếu cũng có đường khác ngay trên kệ thì chỉ coi là "đốt" khi phiếu
   ghi rõ (vd. "nhôm clorua (đốt trong clo)") — còn lại để trò tự chọn đường. */
// những chất điều chế được hôm nay — chỉ tính phản ứng làm được bằng dụng cụ có trên bàn
function dayHave(day){
  if(day._have) return day._have;
  const have = new Set(day.chems), t = day.tools;
  const can = r => (!r.heat || t.includes('heat')) && (!r.elec || t.includes('elec')) && (!r.burn || t.includes('burn'));
  for(let grew = true; grew;){ grew = false;
    for(const r of REACTIONS)
      if(can(r) && Object.keys(r.rg).every(f => have.has(f)))
        Object.keys(r.pr).forEach(f => { if(!have.has(f)){ have.add(f); grew = true; } });
  }
  return (day._have = have);
}
function burnRoute(day, od){
  if(!day.tools.includes('burn')) return null;
  const have = dayHave(day);
  const r = REACTIONS.find(r => r.burn && r.pr[od.chem] && Object.keys(r.rg).every(f => have.has(f)));
  if(!r) return null;
  const direct = REACTIONS.some(x => !x.burn && x.pr[od.chem] && Object.keys(x.rg).every(f => day.chems.includes(f)));
  return direct && !/đốt|cháy/.test(od.pname || '') ? null : r;
}
const HINT_BASE = 'Kéo lọ từ <b>tủ hoá chất</b> vào cốc để rót. Kéo <b>cốc / bình khí / đĩa lọc</b> đến khách để giao, sang <b>bồn rửa</b> bên phải để đổ.';

/* Câu chỉ dẫn đổi theo thứ CÒN THIẾU trong cốc, nên nó luôn nói bước kế tiếp
   chứ không phải một câu chung chung. Sửa đúng lỗi cũ: ngày 1 khách hỏi DUNG DỊCH
   mà bàn tay hướng dẫn chỉ dạy rót một chất rồi bê sang khách. */
function coachText(){
  if(lab.big) return bigCoachText();   // cốc to: giao theo lớp khí / lỏng / rắn, khí cần nắp
  const day = lab.day, od = day.orders[lab.oi];
  if(!od) return HINT_BASE;
  const t = od.chem, c = CHEMS[t];
  if(!c) return HINT_BASE;
  const br = burnRoute(day, od);   // đốt thì sản phẩm rắn ra đĩa, khí ở lại trong lọ
  const want = c.s === 'k' ? 'gas' : (isPrecip(t) || br) ? 'solid' : 'beaker';
  const box  = want === 'gas' ? lab.gas : want === 'solid' ? lab.solid : lab.mix;
  const keep = lab.sel; lab.sel = want;
  const res  = checkServe(box, od);
  let ok = res === true ? want : null;
  // chất rắn nung khô nằm một mình trong cốc (CuO, Cu…): giao thẳng cả cốc
  if(!ok && want === 'solid'){ lab.sel = 'beaker'; if(checkServe(lab.mix, od) === true) ok = 'beaker'; }
  lab.sel = keep;
  if(ok)
    return 'Đủ rồi! Kéo <b>' + (ok === 'gas' ? 'bình khí' : ok === 'solid' ? 'đĩa lọc' : 'cốc')
         + '</b> sang chỗ khách để giao.';
  // an toàn trước, pha chế sau
  if(!lab.goggles) return 'Trước khi lấy hoá chất: bấm <b>Kính & găng</b> trên tường để đeo đồ bảo hộ.';
  if(lab.hoodDay && !lab.hood) return 'Hôm nay có thể sinh khí độc (Cl₂, SO₂, NH₃) — bấm <b>Tủ hút</b> trên tường để bật trước đã.';
  if(br){   // thứ tự đúng ba bước đốt: nạp khí → chất lên muôi → hơ lửa → đưa vào lọ
    const g = Object.keys(br.rg).find(f => CHEMS[f].s === 'k'), fu = Object.keys(br.rg).find(f => f !== g);
    if((box[t]||0) > 0) return 'Đã có <b>' + sub(t) + '</b> nhưng ' + res + '. Sai tỉ lệ thì đổ ra <b>bồn rửa</b> làm lại cho chuẩn.';
    if(!((lab.gas[g]||0) > 0)) return 'Đơn này phải <b>ĐỐT</b>. Trước hết nạp khí: '
      + (day.chems.includes(g) ? 'kéo bình <b>' + sub(g) + '</b> từ tủ thả vào <b>bình thu khí</b> (lọ khí).'
                               : 'tự điều chế <b>' + sub(g) + '</b> rồi hứng vào <b>bình thu khí</b>.');
    if(!((lab.ladle[fu]||0) > 0)) return 'Lọ đã có ' + sub(g) + '. Giờ thả <b>' + sub(fu) + '</b> từ tủ vào <b>muôi đốt</b>.';
    if(!lab.ladleLit) return 'Muôi đã treo trên giá — kéo <b>đèn cồn</b> vào thảm, dưới muôi, để hơ cho ' + sub(fu) + ' bén lửa.';
    return 'Muôi đang cháy — kéo muôi vào <b>bình thu khí</b> (lọ ' + sub(g) + ')!';
  }
  // thứ tự nhắc đúng thứ tự thao tác: chất tan → nước → khuấy → dụng cụ → giao
  // đơn khí có ghi cách điều chế ("khí hiđro (Zn + axit)"): đừng gợi ý rót thẳng lọ khí trên kệ vào cốc
  const made = want === 'gas' && /\(.*\+/.test(od.pname || '');
  if(!made && day.chems.includes(t) && !((lab.mix[t]||0) > 0 || (box[t]||0) > 0 || (lab.undissolved[t]||0) > 0))
    return 'Bắt đầu bằng cách kéo lọ <b>' + sub(t) + '</b> từ tủ bên phải vào cốc.';
  if(od.water && !(lab.mix.H2O > 0) && day.chems.includes('H2O'))
    return 'Khách hỏi <b>dung dịch</b> chứ không phải chất khô — kéo thêm lọ <b>Nước</b> vào cốc.';
  // NUNG KHÔ (dry, phan-ung.js): Cu(OH)₂ → CuO, CaCO₃ → CaO, KMnO₄ → O₂… — chất rắn phải nằm trong cốc không có nước.
  // Chỉ dẫn theo chỗ chất rắn đang nằm: lẫn trong dung dịch → lọc ra đĩa → dọn cốc → trút đĩa vào cốc khô → đun
  const at = f => (lab.mix[f]||0) + (lab.undissolved[f]||0);
  const dr = !((lab.mix[t]||0) > 0) && REACTIONS.find(r => r.dry && r.pr[t] && Object.keys(r.rg).every(f => dayHave(day).has(f))
    && Object.keys(r.rg).some(f => CHEMS[f].s === 'r' && at(f) + (lab.solid[f]||0) > 0));
  if(dr){
    const rs = Object.keys(dr.rg).filter(f => CHEMS[f].s === 'r'), s = '<b>' + rs.map(sub).join(' + ') + '</b>';
    const wet = Object.keys(lab.mix).some(f => lab.mix[f] > 0 && (CHEMS[f].s === 'l' || CHEMS[f].s === 'd'));
    if(rs.some(f => (lab.solid[f]||0) > 0))
      return wet ? s + ' đã nằm trên đĩa lọc. Cốc còn dung dịch — giao cho khách cần nó, hoặc đổ ra <b>bồn rửa</b> — rồi kéo <b>đĩa lọc</b> vào cốc khô.'
                 : 'Kéo <b>đĩa lọc</b> vào cốc để trút ' + s + ' vào cốc khô, rồi nung.';
    if(wet) return rs.every(isPrecip) && day.tools.includes('filter')
      ? s + ' phải nung <b>khô</b>' + (lab.heaterOn ? ' — kéo đèn cồn ra, rồi' : ':') + ' kéo <b>phễu lọc</b> vào cốc để lọc nó ra đĩa trước.'
      : s + ' phải nung <b>khô</b> — đổ cốc ra <b>bồn rửa</b>, cho ' + s + ' vào cốc trống (không có nước) rồi đun.';
    if(want === 'gas' && !lab.catcher) return 'Khách cần <b>khí</b>: kéo <b>bình thu khí</b> lên miệng cốc trước đã, không thì khí bay mất.';
    if(!lab.heaterOn && Object.keys(dr.rg).every(f => at(f) > 0)) return 'Cốc khô rồi — kéo <b>đèn cồn</b> vào cốc để nung ' + s + '.';
  }
  if(tot(lab.undissolved) > 0) return 'Còn chất chưa tan dưới đáy — kéo <b>đũa khuấy</b> vào cốc rồi khuấy tròn.';
  if(want === 'gas' && !lab.catcher)  return 'Khách cần <b>khí</b>: kéo <b>bình thu khí</b> lên miệng cốc trước đã, không thì khí bay mất.';
  if(!tot(lab.mix) && !tot(lab.undissolved))
    return 'Cốc đang trống — kéo hoá chất từ <b>tủ bên phải</b> vào cốc để bắt đầu.';
  if(day.tools.includes('elec') && !lab.elecOn)
    return 'Kéo <b>bộ điện phân</b> vào cốc, rồi chọn chất và <b>số mol</b> ở bảng dưới mép bàn.';
  if(lab.elecOn && elecList().length)
    return 'Ở bảng dưới mép bàn: chọn chất, vặn <b>số mol</b> rồi bấm <b>điện phân</b>.';
  if(want === 'solid' && (lab.mix[t]||0) > 0){
    // bã rắn sau khi nung khô (MnO₂ lẫn K₂MnO₄): hoà phần tan vào nước trước rồi mới lọc
    const sol = Object.keys(lab.mix).filter(f => f !== t && lab.mix[f] > 0 && CHEMS[f].sol);
    if(sol.length && !Object.keys(lab.mix).some(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd'))
      return '<b>' + sub(t) + '</b> còn lẫn ' + sol.map(sub).join(', ') + ' — rót <b>nước</b> cho phần tan hết, rồi kéo <b>phễu lọc</b> vào cốc để lọc lấy ' + sub(t) + '.';
    return 'Kết tủa đã có trong cốc — kéo <b>phễu lọc</b> vào cốc để lọc ra đĩa.';
  }
  // cốc im re: giáo sư nói lý do nếu đoán ra được (đốt nhầm chỗ, dãy hoạt động, chất không tan…)
  const why = whyNoReaction();
  if(why) return '<b>Giáo sư:</b> ' + why;
  // hết gợi ý cụ thể: nhắc chung, không đoán bừa là phải đun hay phải trộn gì
  return 'Chưa ra <b>' + sub(t) + '</b>. Thử rót thêm chất khác từ tủ'
       + (day.tools.includes('heat') ? ', hoặc kéo <b>đèn cồn</b> vào cốc' : '') + ' xem sao.';
}
/* Gợi ý bước kế tiếp (coachText). Ô #coach cũ đã bỏ khỏi cột khách cho gọn; giờ gợi ý hiện qua notify():
   · nút Gợi ý trên thanh trên cùng: bấm lúc nào cũng được, không mất điểm
   · ngày 1 ở chế độ thường giáo sư tự nhắc mỗi khi bước kế tiếp đổi, như một bài hướng dẫn cầm tay
   · khách đầu tiên của ngày có dụng cụ mới: giới thiệu dụng cụ đó một lần
   · chế độ khó: mỗi lần giao sai mở thêm một bậc gợi ý tính toán (hardHint, che-do.js) */
const profLine = t => /^<b>Giáo sư:/.test(t) ? t : '<b>Giáo sư:</b> ' + t;
const autoCoach = () => lab && lab.i === 0 && !lab.hard && !lab.day.free;
function showHint(){
  if(!lab || lab.ending) return;
  notify(profLine(coachText()) + (lab.hard && lab.miss ? '<div class="hardhint">' + hardHint(lab.day.orders[lab.oi], lab.miss) + '</div>' : ''));
}
function updateCoach(){
  if(!lab || lab.day.free) return;
  clearTimeout(lab.coachT);
  lab.coachT = setTimeout(() => {      // gom các thay đổi dồn dập (rót, phản ứng, khuấy) — nhắc khi cốc đã yên
    if(!lab || !lab.timer) return;
    if(!lab.toolTold){
      lab.toolTold = true;
      ['rod','heat','burn','gas','filter','elec'].filter(k => TOOL_FIRST[k] === lab.i && (k !== 'rod' || autoCoach()))
        .forEach((k, n) => setTimeout(() => { if(lab) notify('<div class="newtool">' + ((lab.big && BIG_TIP[k]) || TOOL_TIP[k]) + '</div>'); }, n*400));
    }
    if(autoCoach()){
      const t = coachText();
      if(t !== lab.lastCoach){ lab.lastCoach = t; notify(profLine(t)); }
    }
  }, 700);
}

function nextCustomer(){
  const od = lab.day.orders[lab.oi];
  // mỗi khách có đồng hồ chờ riêng (vòng tròn ở góc bóng thoại): hết giờ thì bỏ đi,
  // nhờ vậy một đơn không pha được cũng không chặn cứng cả hàng đợi
  // backstop, không phải áp lực: gấp đôi phần chia đều, nên chơi bình thường gần như không bao giờ chạm
  lab.odur = Math.round((lab.day.free ? 180 : Math.max(120, Math.round(lab.day.dur / lab.day.orders.length * 2)))
    * (lab.hard ? 1.5 : 1) * (PATIENCE[od.who] || 1));
  lab.otime = lab.odur;
  lab.waitStage = 0;
  lab.miss = 0;      // bậc gợi ý chế độ khó tính riêng cho từng đơn
  // góc dưới bóng thoại: chất cần làm + lượng. Tên hàng có gợi ý cách làm ("khí hiđro (Zn + axit)") thì ghi cả tên;
  // phần "(0,2 mol)" trong tên bỏ đi vì lượng đã ghi riêng (chế độ khó còn đổi ra gam / lít)
  const q = qtyStr(od.chem, od.n), f = sub(od.chem);
  const nm = (od.pname || CHEMS[od.chem].n).replace(/\s*\([^)]*mol[^)]*\)/, ''), hint = /\s\(|—/.test(nm);
  lab.otag = {q, f, hint};
  G.querySelector('#sporder').innerHTML = (hint ? '<span class="sp-name">' + nm + '</span>' : '')
    + '<span class="on-swatch" style="background:' + CHEMS[od.chem].c + '"></span><b>' + q + '</b> · ' + f;
  // bấm bóng thoại: câu đặt hàng → chuyện riêng của khách → đặt lại kiểu khác → chuyện về chất → … rồi vòng lại
  const line = orderLine(od, lab.oi), chat = CHAT_LINES[od.who] || [];
  const alts = (USE_LINES[od.chem] || []).concat(ORDER_TPL).map(t => orderLine(od, lab.oi, t)).filter(s => s !== line);
  lab.talk = [line, chat[0], alts[(od.who + lab.oi) % alts.length], chat[1],
              CHEM_FACTS[od.chem] && fillLine(CHAT_FACT, {fact:CHEM_FACTS[od.chem]}), chat[2]].filter(Boolean);
  lab.talkI = 0;
  const sp = G.querySelector('#speech'), cw = G.querySelector('#custwalk');
  sp.classList.add('hush');                       // bóng thoại trống và ẩn cho tới khi khách đứng yên trước khay, nhìn thẳng
  custSay('', true);
  // mỗi lượt ghé một bộ đồ (nhan-vat-skin.js): đổi theo ngày và lượt khách, chơi lại đúng ngày thì vẫn y như cũ
  const skin = custSkinFor(lab.i, lab.oi, od.who), tall = s => {
    const vb = s.match(/viewBox="[^"]*?(\d+(?:\.\d+)?)"/), h = vb && +vb[1] > 320 ? Math.round(250 * +vb[1] / 280) : 250;
    return s.replace('<svg ', '<svg style="height:' + h + 'px" ');
  };
  // WALK_VIEW '3/4': hình thẳng đã bọc lớp (nhan-vat-xoay.js: đi vào ở dáng 3/4, tới khay thì quay mặt thẳng) + hình
  // nghiêng hẳn (nhan-vat-nghieng.js: lúc đi ra). 'nghieng': hình thẳng thường + hình nghiêng hẳn cho cả lúc vào lẫn ra.
  cw.innerHTML = '<div class="cwin">' + tall(WALK_VIEW === '3/4' && typeof custTurnSVG === 'function'
    ? custTurnSVG(od.who, 'neutral', skin) : custSVG(od.who, 'neutral', skin))
    + tall(custSideSVG(od.who, 'neutral', skin)) + '</div>';
  // không vội: khách dừng chân, quay mặt thẳng tức thì (không trượt rời từng bộ phận), đứng một nhịp rồi bóng thoại mới hiện
  const faceMs = 0;
  custWalk(cw, 'in', () => setTimeout(() => {
    if(!lab || !cw.isConnected || lab.day.orders[lab.oi] !== od || cw.classList.contains('turnout') || cw.classList.contains('away')) return;
    sp.classList.remove('hush'); custSay(line);
  }, Math.max(SAY_DELAY, faceMs)));
  updateCoach();
  SFX.bell();
}
/* lời khách trong bóng thoại, GÕ RA từng chữ (instant: hiện ngay). Chữ chưa gõ vẫn chiếm chỗ (ẩn) nên bóng thoại có
   ngay cỡ cuối, không nhảy dòng. Dòng chất cần làm + lượng ở dưới (#sporder) LUÔN hiện khi đơn còn chờ (lab.otag),
   không gõ; giao xong / khách bỏ đi thì otag = null. lab.sayEnd: lúc câu gõ xong (custLeave đợi tới đó). */
const SAY_DELAY = 450, TYPE_MS = 30;            // khách đứng yên bao lâu thì nói · mỗi nhịp gõ 2 chữ (~65 chữ/giây)
function custSay(html, instant){
  const t = G.querySelector('#sptext'), tag = G.querySelector('#sporder');
  if(!t) return;
  clearInterval(t._type); t._type = null;
  t.innerHTML = html;
  tag.hidden = !(lab && lab.otag);
  const todo = [];
  if(!instant){
    const walk = n => [...n.childNodes].forEach(c => {
      if(c.nodeType !== 3) return walk(c);
      if(!c.textContent) return;
      const on = document.createElement('span'), off = document.createElement('span');
      off.className = 'ty-off'; off.textContent = c.textContent;
      c.replaceWith(on, off); todo.push([on, off]);
    });
    walk(t);
  }
  const n = todo.reduce((s, [, off]) => s + off.textContent.length, 0);
  if(lab) lab.sayEnd = Date.now() + Math.ceil(n / 2) * TYPE_MS;
  if(!n) return;
  // khách đang đứng yên mà bóng thoại còn ẩn (vd. giao hàng ngay lúc khách vừa dừng chân): câu mới thì hiện bóng thoại
  const sp = G.querySelector('#speech'), cw = G.querySelector('#custwalk');
  if(sp && cw && !cw.classList.contains('walking')) sp.classList.remove('hush');
  let i = 0;
  t._type = setInterval(() => {
    for(let s = 0; s < 2; s++){
      while(i < todo.length && !todo[i][1].textContent) i++;
      if(i >= todo.length){ clearInterval(t._type); t._type = null; return; }
      const [on, off] = todo[i];
      on.textContent += off.textContent[0]; off.textContent = off.textContent.slice(1);
    }
  }, TYPE_MS);
}
// câu đang gõ dở thì hiện hết ngay; trả về true nếu vừa làm vậy
function finishSay(){
  const t = G.querySelector('#sptext'); if(!t || !t._type) return false;
  clearInterval(t._type); t._type = null;
  t.querySelectorAll('.ty-off').forEach(o => { o.previousSibling.textContent += o.textContent; o.textContent = ''; });
  if(lab) lab.sayEnd = Date.now();
  return true;
}
// bấm vào bóng thoại lúc khách đang chờ hàng: câu đang gõ thì hiện hết; không thì khách nói câu kế trong lab.talk
function custChat(){
  if(!lab || !lab.otag || !lab.talk || G.querySelector('#speech.hush')) return;
  if(finishSay()) return;
  lab.talkI = (lab.talkI + 1) % lab.talk.length;
  custSay(lab.talk[lab.talkI]);
  SFX.talk();
}
function setExp(exp){
  G.querySelectorAll('#cust .charsvg').forEach(sv => sv.setAttribute('data-exp', exp));
}
/* Khách đi bộ từ phải sang trái: 'in' = từ mép phải khung bước vào, dừng trước khay; 'out' = đi tiếp ra mép trái.
   WALK_VIEW '3/4': vào ở dáng 3/4 → tới khay thì quay mặt thẳng → xong việc thì xoay người (.turnout: qua dáng 3/4
   một nhịp TURN_MS) → nghiêng hẳn rồi bước ra. 'nghieng': nghiêng hẳn cả lúc vào lẫn ra.
   Lúc bước (.walking) có nhún nhẹ; xong thì gọi done. Mỗi lần gọi huỷ lượt đi trước còn dở. */
const WALK_MS = 1100, TURN_MS = 130;
const WALK_VIEW = '3/4';   // '3/4' hoặc 'nghieng'
function custWalk(cw, dir, done){
  clearTimeout(cw._walk);
  const finish = () => { cw._walk = setTimeout(() => { cw.classList.remove('walking'); if(done) done(); }, WALK_MS); };
  if(dir === 'in'){
    const inn = cw.querySelector('.cwin') || cw;
    inn.style.transition = 'none';
    cw.className = 'custwalk walking from';
    void cw.offsetWidth;
    inn.style.transition = '';
    cw.classList.remove('from');
    finish();
  } else {
    // bóng thoại chỉ hiện lúc khách nhìn thẳng người chơi: khách vừa quay đi là tắt (lúc vào: xem nextCustomer)
    const sp = G.querySelector('#speech');
    if(sp) sp.classList.add('hush');
  }
  if(dir === 'in') return;
  if(cw.querySelector('.charsvg.turn')){
    cw.classList.add('turnout');                 // đứng tại chỗ xoay người sang 3/4…
    cw._walk = setTimeout(() => {                // …rồi nghiêng hẳn và bước đi
      cw.classList.remove('turnout');
      cw.classList.add('walking', 'away');
      finish();
    }, TURN_MS);
  } else { cw.classList.add('walking', 'away'); finish(); }
}
// khách xong việc (nhận hàng hoặc chờ lâu bỏ đi): nói hết câu chào, đứng thêm một nhịp cho thấy nét mặt; rồi bóng thoại
// tắt (ngay khi khách quay đi — custWalk) và khách mới đi ra. Hết khách thì đóng ca
const LEAVE_BEAT_MS = 900;
function custLeave(){
  const cw = G.querySelector('#custwalk'), next = lab.oi >= lab.day.orders.length ? finishLab : nextCustomer;
  const wait = Math.max(LEAVE_BEAT_MS, (lab.sayEnd || 0) - Date.now() + 800);
  setTimeout(() => {
    if(!lab || !cw.isConnected) return;
    custWalk(cw, 'out', () => { if(lab) next(); });
  }, wait);
}
// giao được thì trả về true, không thì {key, text}: key là khoá REASON_LINES (loi-thoai.js), text là câu khách nói
function checkServe(cont, od){
  const no = (key, vars) => ({key, text:fillLine(REASON_LINES[key], vars || {})});
  if(lab.sel === 'beaker' && tot(lab.undissolved) > 0) return no('chua-khuay');
  const keys = Object.keys(cont).filter(f => cont[f] > 0);
  if(!keys.length) return no('trong');
  if(CHEMS[od.chem].s === 'k' && lab.sel !== 'gas') return no(lab.big ? 'lop-khi' : 'vat-dung-khi');
  if(isPrecip(od.chem) && lab.sel !== 'solid'){
    const onlySolids = keys.length > 0 && keys.every(f => CHEMS[f].s === 'r');
    if(!onlySolids) return no(lab.big ? 'lop-ran' : 'vat-dung-ran');
  }
  if(!(cont[od.chem] > 0)) return no('khong-co', {name:od.pname || CHEMS[od.chem].n});
  // chế độ khó tự cân đong nên cho lệch 5%: cả lượng hàng lẫn chút chất dư còn sót lại
  const tol = lab.hard ? Math.max(0.01, CONC_TOL * od.n) : 0.01;
  const others = keys.filter(f => f !== od.chem && f !== 'H2O' && !(lab.hard && cont[f] <= tol));
  if(others.length) return no('lan-chat', {list:others.map(sub).join(', ')});
  if(Math.abs(cont[od.chem] - od.n) > tol) return no(cont[od.chem] > od.n ? 'nhieu-qua' : 'it-qua', {q:qtyStr(od.chem, od.n)}); // epsilon: amounts are now fractional
  const hasWater = cont['H2O'] > 0 || Object.keys(cont).some(f => cont[f] > 0 && (CHEMS[f].s === 'l' || CHEMS[f].s === 'd'));
  if(od.water && !hasWater) return no('thieu-nuoc');
  return true;
}
function ghostFX(od){
  const gh = document.createElement('div');
  gh.className = 'ghostslide';
  const art = lab.sel==='gas' ? sym('sym-gasbottle',54,76,'--gasop:1;--stopop:1;--gasoprun:running')
            : lab.sel==='solid' ? '<div class="dish" style="background:linear-gradient(transparent 40%,'+CHEMS[od.chem].c+' 40%)"></div>'
            : sym('sym-erlenmeyer',50,66,'--lc:'+(CHEMS[od.chem].c));
  gh.innerHTML = art;
  const bx = beakerBox(), gr = G.getBoundingClientRect(), tr = G.querySelector('#custtray').getBoundingClientRect(), sc = gr.width/1280;
  gh.style.left = (bx.cx - 26) + 'px'; gh.style.top = (bx.top + 30) + 'px';
  G.appendChild(gh);
  // hàng trượt sang đặt lên khay trước mặt khách
  const tx = (tr.left + tr.width/2 - gr.left)/sc - 26, ty = (tr.top + tr.height/2 - gr.top)/sc - 70;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ gh.style.left = tx + 'px'; gh.style.top = ty + 'px'; gh.style.opacity = .2; }));
  setTimeout(()=>gh.remove(), 800);
}
/* part (cốc to): giao MỘT lớp chất — {cont: chất của lớp, sel: kiểu vật đựng để chấm, take(): lấy lớp đó ra khỏi cốc} */
function serve(part){
  if(!G.querySelector('#custwalk:not(.walking):not(.away)')) return;   // khách đang đi vào / đi ra: chưa nhận hàng
  const od = lab.day.orders[lab.oi];
  const c = CUSTOMERS[od.who];
  if(part) lab.sel = part.sel;
  const cont = part ? part.cont : lab.sel === 'beaker' ? lab.mix : lab.sel === 'gas' ? lab.gas : lab.solid;
  const res = checkServe(cont, od);
  if(res === true){
    if(part) part.take();
    else if(lab.sel === 'beaker'){ lab.mix = {}; lab.dac = {}; lab.firstPour = null; lab.waterIn = false; lab.steam = false; }
    else if(lab.sel === 'gas') lab.gas = {}; else lab.solid = {};
    const gain = runHit(lab.odur > 0 ? lab.otime/lab.odur : 0);   // nhanh: vòng chờ trên phiếu còn bao nhiêu
    lab.odur = 0; // tắt đồng hồ chờ trong lúc khách kế tiếp bước tới
    lab.lastWhy = '';
    lab.served++;
    G.querySelector('#ordn').textContent = lab.served;
    runPop(G.querySelector('#ordn').parentNode, gain);
    lab.otag = null;
    custSay(fillLine(pickLine(PRAISE), {A:c[2]}));
    setExp('happy');
    ghostFX(od);
    SFX.coin(); setTimeout(SFX.clink, 150);
    updateBeaker();
    lab.oi++;
    if(lab.day.free){
      lab.day.orders.push(lab.day.freeOrder()); // endless queue: refill one per serve
      // ghi ngay từng đơn: tắt tab giữa ca tự do không còn mất số đơn đã làm
      save.served++; persist();
      if(save.served >= 10) unlockAch('serve10');
      if(save.served >= 50) unlockAch('serve50');
    }
    custLeave();
  } else {
    // chế độ thường: lần giao sai đầu tiên trong ca không tính lỗi (không mất sao, không đứt chuỗi) — khách nói rõ sai
    // chỗ nào, nên lần đó là một lần "kiểm tra thử". Trước đây giao thử là cách duy nhất để biết đúng chưa, mà giao
    // thử thì mất sao thứ ba ngay, nên người chơi cứ sai là bấm chơi lại. Báo cáo cho thầy cô vẫn ghi lại lỗi.
    const grace = !lab.hard && !lab.graced;
    if(grace) lab.graced = true; else { lab.wrong++; runMiss(); }
    if(grace) setTimeout(() => { if(lab) notify(profLine(PROF_LAB.thaLoi)); }, 900);
    unlockAch('oops');
    custSay(fillLine(pickLine(COMPLAIN), {A:c[2], r:res.text + '!'}));
    setExp('annoy');
    SFX.err();
    const cu = G.querySelector('#custwalk'), nt = G.querySelector('#speech');
    [cu, nt].forEach(el => { el.classList.remove('shaken'); void el.offsetWidth; el.classList.add('shaken'); });
    setTimeout(()=>setExp('neutral'), 1800);
    // chế độ khó: mỗi lần giao sai mở thêm một bậc gợi ý — công thức → khối lượng mol → lời giải
    if(lab.hard && lab.miss < 3){ lab.miss++; setTimeout(() => { if(lab) notify('<div class="hardhint">' + hardHint(od, lab.miss) + '</div>'); }, 900); }
  }
}
