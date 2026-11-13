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
const BENCH_FAR_L = 100;
function benchSVG(){
  const f = (NEAR_Y - FAR_Y) / (NEAR_Y - VP_Y);              // cạnh đi từ mép gần tới mép xa thì nhích về CX chừng này
  const xl0 = BENCH_FAR_L - BX, xr0 = xOf(1,0), xl1 = (xl0 - CX*f) / (1 - f), xr1 = xOf(1,1);
  const top = xl0+','+FAR_Y+' '+xr0+','+FAR_Y+' '+xr1+','+NEAR_Y+' '+xl1+','+NEAR_Y;
  let grain = '';
  for(let k = -35; k <= 7; k++){
    const u = k/7;
    grain += '<line x1="'+xOf(u,0)+'" y1="'+FAR_Y+'" x2="'+xOf(u,1)+'" y2="'+NEAR_Y
          +  '" stroke="#6e5232" stroke-width="'+(1 + Math.abs(u)*0.5).toFixed(1)+'" opacity=".16"/>';
  }
  let depth = '';
  [0.34, 0.68].forEach(t => {
    depth += '<line x1="'+(xl0 + (xl1 - xl0)*t)+'" y1="'+yOf(t)+'" x2="'+xOf(1,t)+'" y2="'+yOf(t)
          +  '" stroke="#6e5232" stroke-width="1.3" opacity=".12"/>';
  });
  return '<svg id="benchsvg" viewBox="0 0 1280 720">'
    + '<defs><linearGradient id="btop" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0%" stop-color="#d8ac77"/><stop offset="100%" stop-color="#b8874f"/></linearGradient>'
    +   '<clipPath id="btopclip"><polygon points="'+top+'"/></clipPath></defs>'
    // mặt trước bàn vẽ dài quá đáy 720: màn cao hơn 16:9 thì nó kéo tới tận mép dưới (#screen cắt phần thừa)
    + '<path d="M'+xl1+','+NEAR_Y+' L'+xr1+','+NEAR_Y+' L'+xr1+',1200 L'+xl1+',1200 Z" fill="#a97c4b"/>'
    + '<path d="M'+xl1+','+NEAR_Y+' L'+xr1+','+NEAR_Y+' L'+xr1+','+(NEAR_Y+16)+' L'+xl1+','+(NEAR_Y+16)+' Z" fill="#8a6238"/>'
    + '<use href="#sym-benchtex" x="'+xl1+'" y="'+(NEAR_Y+30)+'" width="'+(xr1-xl1)+'" height="70" opacity=".45"/>'
    + '<polygon points="'+top+'" fill="url(#btop)"/>'
    + '<g clip-path="url(#btopclip)">' + grain + depth + '</g>'
    + '<line x1="'+xl0+'" y1="'+FAR_Y+'" x2="'+xr0+'" y2="'+FAR_Y+'" stroke="#3b3025" stroke-width="4"/>'
    + '<line x1="'+xl0+'" y1="'+FAR_Y+'" x2="'+xl1+'" y2="'+NEAR_Y+'" stroke="#3b3025" stroke-width="4"/>'
    + '<line x1="'+xr0+'" y1="'+FAR_Y+'" x2="'+xr1+'" y2="'+NEAR_Y+'" stroke="#3b3025" stroke-width="4"/>'
    + '<line x1="'+xl1+'" y1="'+NEAR_Y+'" x2="'+xr1+'" y2="'+NEAR_Y+'" stroke="#3b3025" stroke-width="4"/>'
    + matSVG()
    + '</svg>';
}
/* Thảm làm việc giữa bàn: tấm cao su xanh viền đậm, lòng nhạt — như thảm trong cảnh 3D, khác hẳn màu gỗ,
   để nhìn là biết chỗ nào là chỗ làm. Bốn góc lấy đúng từ bố cục 3D (L3.mat). */
function matSVG(){
  const q = L3.mat, c = q.reduce((a, p) => [a[0] + p[0]/4, a[1] + p[1]/4], [0, 0]);
  const pts = k => q.map(p => (p[0] + (c[0] - p[0])*k).toFixed(1) + ',' + (p[1] + (c[1] - p[1])*k*1.6).toFixed(1)).join(' ');
  return '<polygon points="' + pts(0) + '" fill="#5fa9a6" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>'
       + '<polygon points="' + pts(0.055) + '" fill="#eef4f0" stroke="#4f9693" stroke-width="2" stroke-linejoin="round"/>';
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
  const it = G.querySelector('#beakerItem'), gr = G.getBoundingClientRect();
  if(!it) return {cx:CX, top:300, bot:500};
  const r = it.getBoundingClientRect(), sc = gr.width/1280;
  return {cx:(r.left + r.width/2 - gr.left)/sc,
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
// types: chem (cabinet bottle), beaker, gas (collection bottle), dish (filtered solids),
// lamp (heater), ladle (muôi đốt), funnel (filter), mgcard / mgdrop / mglabel / vlatom / vlmove (minigame, via opts.onDrop)
// Ngày có muôi đốt: bình khí kiêm LỌ KHÍ (zone 'jar'), đèn cồn là chỗ hơ lửa (zone 'flame').
const DZ_ACCEPT = {
  rod:   [], // never dropped — stirring happens during the drag, then it snaps home
  chem:  ['beaker','jar','ladle'],
  ladle: ['flame','jar','sink','mat'],   // thả vào thảm = treo muôi lên giá
  beaker:['cust','sink','mat','bench','funnel'],   // mặt bàn ngoài thảm = đặt cốc ra đó; thảm = đưa về giữa; phễu = lọc
  gas:   ['beaker','mat','cust','sink'],
  dish:  ['cust','sink'],
  lamp:  ['beaker','mat'],
  elec:  ['beaker','mat'],
  funnel:['beaker','mat'],
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
  const hard = hardOn(), dur = hard ? Math.round(day.dur * 1.5) : day.dur;
  return {i, day, hard, dur, mix:{}, undissolved:{}, dissolveTotal:0, gas:{}, solid:{}, ladle:{}, ladleLit:false,
          heaterOn:false, elecOn:false, catcher:false, lampUnder:false, spoonOn:false, bkPark:null, bkAuto:false, sel:'beaker',
          time:dur, oi:0, served:0, wrong:0, waste:0, timer:null, lastColor:'', magicDose:1,
          otime:0, odur:0, waitStage:0, miss:0, lastWhy:'', cardQ:[], cardOpen:false,
          goggles:!hard, hood:false, hoodDay:hard && [...dayHave(day)].some(f => TOXIC.includes(f)),
          safety:0, safeHits:{}, firstPour:null, waterIn:false, dac:{}};
}
function startLab(i){
  SFX.music(themeOf(i));
  // chơi lại ngày đã qua (đã có sao): cùng các đơn nhưng khách đến theo thứ tự khác — lượt sau phải nhớ CÁCH làm,
  // không phải nhớ thứ tự. Lần đầu (và ngày 1, ngày hướng dẫn) giữ đúng thứ tự đã soạn
  const won = (hardOn() ? save.starsHard : save.stars)[i + 1] >= 1;
  const day = won && i > 0 ? Object.assign({}, DAYS[i], {orders:shuffle(DAYS[i].orders)}) : DAYS[i];
  lab = newLab(i, day);
  runStart();   // điểm nhanh lấy từ vòng đồng hồ chờ của từng khách (serve), không cần đồng hồ riêng
  renderLab();
  startCurtain();   // đồng hồ ca bật khi màn "Bắt đầu" sáng lại
}

/* ---- free-play (post day 28): full shelf, endless random campaign orders ---- */
function startFree(){
  SFX.music(3);
  const labDays = DAYS.filter(d => !d.mg);
  // K không nằm trên kệ ngày nào, nên trước đây các phản ứng của K / K₂O không bao giờ làm được (sổ tay không thể đủ)
  // lọ axit đặc chỉ có ở ca tự do (kệ chiến dịch là axit loãng); KClO₃ để điều chế oxi với xúc tác MnO₂
  const chems = [...new Set(labDays.flatMap(d => d.chems).concat(['K', 'KClO3', ...Object.keys(CONC_SHELF)]))];
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
  const stars = FREE_STARS.filter(k => n >= k).length;
  resultCard(title || 'Ca tự do kết thúc', stars, `<div class="resbody">
    <p style="font-size:18px">Đơn hoàn thành: <b>${n}</b> · ${rec && n ? '<b class="rsrec">Kỷ lục mới!</b>' : 'Kỷ lục: <b>' + (save.freeBest || 0) + '</b>'}</p>
    ${nr ? `<p>Phản ứng mới vào sổ tay: <b>${nr}</b></p>` : ''}
    <p class="hand">“${FREE_STARS.join(' / ')} đơn trong một ca là 1 / 2 / 3 sao — thử phá kỷ lục nhé!”</p></div>
    <div class="row resbtns">${resBtn('bmap', 'map', 'Bản đồ')}${resBtn('bretry', 'retry', 'Ca mới', ' main')}</div>`);
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
    const q = TOOLPOS[key] = {x:sl.x, y:sl.y, k:sl.ppm/1000*SIDE, z:zAt(sl.y) + 20};   // đồ cất ngoài thảm nhỏ đi 20%
    // có muôi đốt thì bình khí kiêm lọ khí (thả bình O₂/Cl₂ vào để nạp, thả muôi đang cháy vào để đốt)
    const dz = key === 'gas' ? (day.tools.includes('burn') ? 'jar' : undefined)
             : key === 'heat' ? (day.tools.includes('burn') ? tl.dz : undefined) : tl.dz;
    return place3({sid:tl.cat, an:tl.an || 'rest', x:q.x, y:q.y, k:q.k, z:q.z, id:'tool_'+key, svgId:'sv_'+key, shw:tl.shw,
                   style:tl.style, cls:'grab', dz, title:tl.label});   // không còn tag tên: tên hiện khi rê chuột
  }).join('');
}

function renderLab(){
  const day = lab.day;
  const has = t => day.tools.includes(t);
  const shelfHtml = day.chems.map(f => { const c = CHEMS[baseChem(f)], dac = f !== baseChem(f);
    // chế độ khó: lọ dung dịch ghi rõ nồng độ — phải biết Cₘ mới tính được thể tích cần đong
    const cm = lab.hard && SOL_CM[f] ? ' <small class="cm">'+fmt(SOL_CM[f],2)+'M</small>' : '';
    return '<div class="chem" data-f="'+f+'">' +
      '<div class="cc-tag" style="--stripe:'+stripeCol(f)+'"><span class="f">'+sub(baseChem(f))+(dac ? ' <small class="dac">đặc</small>' : '')+cm+'</span><span class="nm">'+c.n+(dac ? ' đặc' : '')+'</span></div>' +
      sym(contSym(f),60,84,'--lc:'+c.c+';--lc2:#00000022') +
      '</div>'; }).join('');
  
  const hasMagicTools = save.items && save.items.tools && !lab.hard; // chế độ khó tự cân đong, không dùng thìa ma thuật
  const doseSelectorHtml = hasMagicTools ? `
    <div class="dose-selector" style="display:flex;align-items:center;justify-content:center;gap:6px;margin:0 0 10px 0;background:#fffdf5;border:1.2px solid var(--ink);border-radius:4.8px;padding:4px 8px;font-size:14px;font-family:var(--fh)">
      <span style="color:var(--ink)">Lượng đong: </span>
      <button class="btn dose-btn" id="dose-dec" style="padding:0 8px;font-size:12px;height:22px;line-height:18px">-</button>
      <span id="dose-val" style="font-weight:bold;width:65px;text-align:center;display:inline-block">${amt(lab.magicDose)}</span>
      <button class="btn dose-btn" id="dose-inc" style="padding:0 8px;font-size:12px;height:22px;line-height:18px">+</button>
    </div>
  ` : '';

  const hasStickyNotes = save.items && save.items.notes;
  const stickyNoteHtml = hasStickyNotes ? `
    <div class="wallitem stickynote" style="left:346px;top:168px;width:104px;min-height:100px;background:#fef5c1;border:1.2px solid var(--ink);transform:rotate(-2deg);padding:8px;font-family:var(--fh);font-size:14px;z-index:5">
      <h4 style="margin:0 0 6px 0;font-size:14px;border-bottom:1px dotted #3b302566;padding-bottom:2px;display:flex;align-items:center;gap:4px">${ico('note',14)} Giấy nhớ</h4>
      <div id="stickynote-content" style="font-size:12px;line-height:1.4"></div>
      <div id="sn-water" style="display:none;position:absolute;right:6px;bottom:3px;font-size:10.5px;color:#4a7ba8;align-items:center;gap:2px">
        <svg width="9" height="12" viewBox="0 0 10 13"><path d="M5,0.5 C8,5 9.5,7.5 5,12 C0.5,7.5 2,5 5,0.5z" fill="#6f9ec9" stroke="#3b3025" stroke-width="1"/></svg> có nước
      </div>
    </div>
  ` : '';

  G.innerHTML = `<div class="scene" style="padding:0">
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
      <div class="wallitem" style="left:calc(22px - var(--bx));top:calc(16px - var(--by))">${sym('sym-poster-periodic',108,140)}</div>
      <div class="wallitem" style="left:760px;top:20px">${sym('sym-poster-safety',104,134)}</div>
      <div class="wallitem" style="left:352px;top:26px" id="winhost"><svg id="winsvg" width="100" height="123"><use href="#sym-window"/></svg></div>
      <div class="wallitem" style="left:648px;top:18px"><svg id="clocksvg" width="86" height="86"><use href="#sym-clock"/></svg></div>
      <div class="wallitem" style="left:900px;top:26px">${sym('sym-pipette',34,120,'--lc:#9b7bb8')}</div>
      ${lab.hard ? `<div class="wallitem safetyhook" id="goggles" style="left:466px;top:86px" title="Bấm để đeo kính bảo hộ và găng tay">${sym('sym-goggles',92,64)}<div class="wallcap">Kính & găng</div></div>` : ''}
      ${lab.hoodDay ? `<div class="wallitem hoodsw" id="hoodsw" style="left:464px;top:180px" title="Bấm để bật / tắt tủ hút">${HOOD_SVG}<div class="wallcap">Tủ hút: tắt</div></div>` : ''}
      ${day.free ? '<div class="wallitem freenote" id="freenote"><h4>' + ico('note',14) + ' Trong cốc lúc này</h4><div id="freenote-body"></div></div>' : stickyNoteHtml}
      ${!day.free && dayEqs(day).length ? `<div class="wallitem balpaper" id="balpaper" style="left:600px;top:116px" title="Bấm để cân bằng phương trình (không bắt buộc)"><div class="bpface">${balPaperFace()}</div><div class="wallcap">Giấy cân bằng</div></div>` : ''}
    </div>
    ${benchSVG()}
    <svg class="matzone" viewBox="0 0 1280 720"><polygon data-dz="bench" class="benchzone" points="${[0, 1, 3, 2].map(i => L3.bench.corners[i].join(',')).join(' ')}"/><polygon data-dz="mat" points="${L3.mat.map(q => q.join(',')).join(' ')}"/></svg>
    <div class="custcol">
      <div class="speech" id="speech"><svg class="on-ring" width="30" height="30" viewBox="0 0 34 34"><circle class="bg" cx="17" cy="17" r="14"/><circle class="fg" cx="17" cy="17" r="14" stroke-dasharray="88" stroke-dashoffset="0"/></svg>
        <div id="sptext"></div><div class="sp-order" id="sporder" hidden></div></div>
      <div class="custzone" id="cust"><div class="custwalk" id="custwalk"></div></div>
      ${TRAY_SVG}
    </div>
    <div class="sinkstation" data-dz="sink"><div class="counter"></div>
      <svg id="sinksvg" width="96" height="76"><use href="#sym-sink"/></svg><div class="cap">Bồn rửa</div></div>
    ${benchDressing()}
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
    <div class="shelf"><h3>Tủ hoá chất</h3>${doseSelectorHtml}<div class="shgrid">${shelfHtml}</div></div>
  </div>`;
  // buttons
  G.querySelector('#bpause').onclick = pauseLab;
  G.querySelector('#speech').onclick = custChat;
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
      onClick: () => pourChem(c.dataset.f, 'beaker') // bấm cũng rót — đường tắt
    });
    factHover(c, c.dataset.f); });
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
      onClick: key === 'rod' ? (() => {
        if(tot(lab.undissolved) > 0){ dissolveStep(); return; }
        wiggleBeaker(); SFX.pour(); if(!runReactions()) explainNoRx(); updateBeaker();
      }) : key === 'burn' ? (() => notify(ladleHint())) : undefined
    });
  });
  syncLadle();
  layoutRigs();
  
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
  const ran = new Set();
  for(let pass=0; pass<RX_PASSES; pass++){
    const cands = REACTIONS.filter(r => {
      if(r.elec || r.burn) return false;   // điện phân chỉ chạy khi người chơi bấm, xem electrolyse()
      if(ran.has(rxReverse(r))) return false;
      if(r.heat && !lab.heaterOn) return false;
      if(r.cat && !r.cat.every(f => (mix[f]||0) > 0)) return false;   // xúc tác phải có mặt
      if(!concOK(r)) return false;                                       // axit phải đặc / loãng đúng như phương trình ghi
      return Object.keys(r.rg).every(f => {
        if(f === 'H2O' && hasLiquid()) return true; // nước dung môi coi như dư
        return (mix[f]||0) > 0;
      });
    });
    if(!cands.length) break;
    cands.sort((a,b) => (a.last||0)-(b.last||0) || usesMetal(a) - usesMetal(b) || tot(b.rg) - tot(a.rg));   // thứ tự: xem trên
    const r = cands[0];
    ran.add(r);
    const n = Math.min(...Object.keys(r.rg).map(f => {
      if(f === 'H2O' && hasLiquid()) return Infinity;
      return rxAvail(r, f)/r.rg[f];
    })); // fractional extent — limiting reagent runs out
    fired.push(applyReaction(r, n, f => f === 'H2O' && hasLiquid()));
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
    if(fired.some(x => x.includes('bay mất')) && lab.day.tools.includes('gas')) notify(profLine(PROF_LAB.khiBayMat));
  }
  return fired.length;
}
// phương trình vừa chạy nổi lên trên miệng cốc rồi tan: người chơi thấy ngay mình vừa làm ra chất gì
function eqPop(lines){
  if(!lines || !lines.length || !G.querySelector('#beakerItem')) return;
  G.querySelectorAll('.eqpop').forEach(x => x.remove());   // rót liên tiếp: chỉ giữ phương trình mới nhất, không chồng chữ
  const bx = beakerBox(), e = document.createElement('div');
  e.className = 'eqpop'; e.innerHTML = lines.join('<br>');
  e.style.left = bx.cx + 'px'; e.style.top = (bx.top - 14) + 'px';
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
        + (REACTIONS[i].heat ? ' <small>(cần đun)</small>' : '')
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
   (nước dung môi). Dùng chung cho phản ứng tự phát và điện phân. */
function applyReaction(r, n, skip){
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
      else if(lab.catcher){ lab.gas[f] = RQ((lab.gas[f]||0) + q); unlockAch('gas1'); gasNote = ' — đã thu '+sub(f)+' vào bình!'; }
      else gasNote = ' — khí '+sub(f)+' bay mất!';
    } else {
      mix[f] = RQ((mix[f]||0) + q);
      if(isPrecip(f)) spawnFall(CHEMS[f].c);
    }
  });
  const boom = r.rg.H2 && (r.rg.O2 || r.rg.Cl2);   // hỗn hợp hiđro gặp lửa thì nổ "bụp", toả nhiệt thì xèo
  if(boom) SFX.bang(); else if(r.exo) SFX.sizzle();
  if(r.exo || boom){ const b = G.querySelector('#beakerItem'); b.classList.remove('glowing'); void b.offsetWidth; b.classList.add('glowing'); }
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
  SFX.pour(); wiggleBeaker(); toast(PROF_LAB.hoanTac);
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
  SFX.bang(); wiggleBeaker();
  const b = G.querySelector('#beakerItem'); if(b){ b.classList.remove('glowing'); void b.offsetWidth; b.classList.add('glowing'); }
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
    (lab.toldSlow ? toast : notify)(doseStr(f, dose) + ' ' + sub(f) + ' — ít tan! Kéo <b>đũa khuấy</b> vào cốc rồi khuấy tròn cho tan.');
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
   muôi hết chất (đốt xong / đổ bồn) thì muôi, đèn, cốc tự về chỗ cũ. */
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
  if(!left.length) releaseSpoon();   // cháy hết chất trên muôi: muôi (sau nhịp thò vào lọ) về chỗ cất, cốc về giữa
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
  const ready = r => Object.keys(r.rg).every(f => has(f) || (f === 'H2O' && liquid));
  const hit = inv => !focus || inv.includes(focus);
  // câu nói lấy từ PROF_NO_RX (loi-thoai.js)
  const say = (k, v) => fillLine(PROF_NO_RX[k], v || {});
  for(const r of REACTIONS) if(r.burn && ready(r)){
    const g = Object.keys(r.rg).find(f => CHEMS[f].s === 'k'), fu = Object.keys(r.rg).find(f => f !== g);
    if(hit([g, fu])) return say(tools.includes('burn') ? 'dot-sai-cho' : 'khong-muoi', {fuel:sub(fu), gas:sub(g)});
  }
  // Al, Fe trong H₂SO₄ / HNO₃ đặc nguội: thụ động — nói rõ, đừng chỉ bảo "cần nhiệt"
  if(!lab.heaterOn) for(const a of ['H2SO4','HNO3']) if(concOf(a) > 0.009) for(const m of ['Al','Fe'])
    if(has(m) && hit([m, a])) return say('thu-dong', {m, acid:sub(a)});
  if(!lab.heaterOn && tools.includes('heat')){
    const r = REACTIONS.find(r => r.heat && ready(r) && (!r.cat || r.cat.every(has)) && concOK(r));
    if(r && hit(Object.keys(r.rg))) return say('thieu-nhiet');
  }
  // đủ chất, đủ nhiệt, đúng nồng độ nhưng thiếu chất xúc tác (KClO₃ cần MnO₂)
  for(const r of REACTIONS) if(r.cat && !r.elec && !r.burn && ready(r) && !r.cat.every(has) && concOK(r) && (!r.heat || lab.heaterOn)){
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
  + '<path d="M282,118 L321,15 L321,25 L282,129 Z" fill="#95a1ab" stroke="#3b3025" stroke-width="2.5" stroke-linejoin="round"/>'
  + '<path d="M32,118 L282,118 L282,129 L32,129 Z" fill="#a9b4bd" stroke="#3b3025" stroke-width="2.5" stroke-linejoin="round"/>'
  + '<path d="M98,15 L321,15 L282,118 L32,118 Z" fill="#cfd6dc" stroke="#3b3025" stroke-width="3" stroke-linejoin="round"/>'
  + '<path d="M110,24 L306,24 L272,108 L48,108 Z" fill="#e7ecf0" stroke="#3b3025" stroke-width="1.5" stroke-linejoin="round" opacity=".9"/>'
  + '<path d="M122,32 L200,32 M66,98 L100,98" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".8"/>'
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
const ION_Z = {Cl:-1, ClO:-1, ClO3:-1, AlO2:-1, NO3:-1, HCO3:-1, OH:-1, MnO4:null, SO4:-2, CO3:-2, SO3:-2, PO4:-3};
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
  if(dr) dr.setAttribute('opacity', lab.heaterOn && liq ? 1 : 0);
  // đổi màu: vệt màu mới loang ra từ giữa khối chất lỏng, TRONG lòng cốc (nhóm bk-swirl nằm dưới bkclip)
  const swg = G.querySelector('#bk-swirl');
  if(swg && liq && liqColor !== lab.lastColor && lab.lastColor){
    const sw = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sw.setAttribute('cx', BK.cx); sw.setAttribute('cy', BK.bot - H/2); sw.setAttribute('r', BK.rx*0.25);
    sw.setAttribute('class', 'bkswirl'); sw.style.fill = liqColor;
    swg.appendChild(sw); setTimeout(()=>sw.remove(), 950);
  }
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
  if(ub){ ub.hidden = !canUndo(); if(!ub.hidden){ const bx = beakerBox(); ub.style.left = (bx.cx + 74) + 'px'; ub.style.top = (bx.bot - 36) + 'px'; } }
}
// bình nào (cốc / bình khí / đĩa lọc) đang chứa đúng hàng của khách hiện tại, không có thì null
function readyVessel(){
  const od = lab.day.orders[lab.oi]; if(!od || !lab.otag) return null;
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
function wiggleBeaker(){
  const b = G.querySelector('#beakerItem'); if(!b) return;
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
}

/* Bật đèn = dựng cả BỘ ĐUN: kiềng mọc lên, cốc được nhấc đặt LÊN lưới amiăng, đèn chui vào giữa ba chân. */
function setHeat(on){
  if(lab.heaterOn === on) return;
  if(on && spoonUp()){ toast(SPOON_BUSY); return; }
  if(on) unpark();
  if(on && lab.filterOn) setFilter(false);   // không lọc trong lúc đun
  lab.heaterOn = on;
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
/* ---- glass-rod stirring: move the rod around inside the beaker to dissolve slow solids ---- */
function stirMove(p, dist){
  if(!lab || tot(lab.undissolved) <= 0) return;
  const bz = G.querySelector('#beakerItem'); if(!bz) return;
  const gr = G.getBoundingClientRect(), s = gr.width/1280, r = bz.getBoundingClientRect();
  // đũa phải đi vòng tròn TRONG lòng cốc mới ăn — ra ngoài thì không tính
  const cx = (r.left + r.width/2 - gr.left)/s, cy = (r.top + r.height*0.55 - gr.top)/s;
  if(Math.hypot(p.x-cx, p.y-cy) > 95) return;
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
  lab.mix = {}; lab.dac = {}; lab.undissolved = {}; lab.dissolveTotal = 0; lab.lastWhy = ''; lab.firstPour = null; lab.waterIn = false;
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
const HINT_BASE = 'Kéo lọ từ <b>tủ hoá chất</b> vào cốc để rót. Kéo <b>cốc / bình khí / đĩa lọc</b> đến khách để giao, sang <b>bồn rửa</b> bên trái để đổ.';

/* Câu chỉ dẫn đổi theo thứ CÒN THIẾU trong cốc, nên nó luôn nói bước kế tiếp
   chứ không phải một câu chung chung. Sửa đúng lỗi cũ: ngày 1 khách hỏi DUNG DỊCH
   mà bàn tay hướng dẫn chỉ dạy rót một chất rồi bê sang khách. */
function coachText(){
  const day = lab.day, od = day.orders[lab.oi];
  if(!od) return HINT_BASE;
  const t = od.chem, c = CHEMS[t];
  if(!c) return HINT_BASE;
  const br = burnRoute(day, od);   // đốt thì sản phẩm rắn ra đĩa, khí ở lại trong lọ
  const want = c.s === 'k' ? 'gas' : (isPrecip(t) || br) ? 'solid' : 'beaker';
  const box  = want === 'gas' ? lab.gas : want === 'solid' ? lab.solid : lab.mix;
  const keep = lab.sel; lab.sel = want;
  const res  = checkServe(box, od);
  lab.sel = keep;
  if(res === true)
    return 'Đủ rồi! Kéo <b>' + (want === 'gas' ? 'bình khí' : want === 'solid' ? 'đĩa lọc' : 'cốc')
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
  if(day.chems.includes(t) && !((lab.mix[t]||0) > 0 || (box[t]||0) > 0 || (lab.undissolved[t]||0) > 0))
    return 'Bắt đầu bằng cách kéo lọ <b>' + sub(t) + '</b> từ tủ bên phải vào cốc.';
  if(od.water && !(lab.mix.H2O > 0) && day.chems.includes('H2O'))
    return 'Khách hỏi <b>dung dịch</b> chứ không phải chất khô — kéo thêm lọ <b>Nước</b> vào cốc.';
  if(tot(lab.undissolved) > 0) return 'Còn chất chưa tan dưới đáy — kéo <b>đũa khuấy</b> vào cốc rồi khuấy tròn.';
  if(want === 'gas' && !lab.catcher)  return 'Khách cần <b>khí</b>: kéo <b>bình thu khí</b> lên miệng cốc trước đã, không thì khí bay mất.';
  if(!tot(lab.mix) && !tot(lab.undissolved))
    return 'Cốc đang trống — kéo hoá chất từ <b>tủ bên phải</b> vào cốc để bắt đầu.';
  if(day.tools.includes('elec') && !lab.elecOn)
    return 'Kéo <b>bộ điện phân</b> vào cốc, rồi chọn chất và <b>số mol</b> ở bảng dưới mép bàn.';
  if(lab.elecOn && elecList().length)
    return 'Ở bảng dưới mép bàn: chọn chất, vặn <b>số mol</b> rồi bấm <b>điện phân</b>.';
  if(want === 'solid' && (lab.mix[t]||0) > 0) return 'Kết tủa đã có trong cốc — kéo <b>phễu lọc</b> vào cốc để lọc ra đĩa.';
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
        .forEach((k, n) => setTimeout(() => { if(lab) notify('<div class="newtool">' + TOOL_TIP[k] + '</div>'); }, n*400));
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
  const skin = custSkinFor(lab.i, lab.oi, od.who), tall = s => s.replace('<svg ', '<svg style="height:250px" ');
  // WALK_VIEW '3/4': hình thẳng đã bọc lớp (nhan-vat-xoay.js: đi vào ở dáng 3/4, tới khay thì quay mặt thẳng) + hình
  // nghiêng hẳn (nhan-vat-nghieng.js: lúc đi ra). 'nghieng': hình thẳng thường + hình nghiêng hẳn cho cả lúc vào lẫn ra.
  cw.innerHTML = '<div class="cwin">' + tall(WALK_VIEW === '3/4' && typeof custTurnSVG === 'function'
    ? custTurnSVG(od.who, 'neutral', skin) : custSVG(od.who, 'neutral', skin))
    + tall(custSideSVG(od.who, 'neutral', skin)) + '</div>';
  // không vội: khách dừng chân, quay mặt thẳng (dáng 3/4: transition .32s trong style.css), đứng một nhịp rồi bóng thoại
  // mới hiện và câu đặt hàng mới gõ ra
  const faceMs = cw.querySelector('.charsvg.turn') ? 320 : 0;
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
const WALK_MS = 1100, TURN_MS = 240;
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
  if(CHEMS[od.chem].s === 'k' && lab.sel !== 'gas') return no('vat-dung-khi');
  if(isPrecip(od.chem) && lab.sel !== 'solid'){
    const onlySolids = keys.length > 0 && keys.every(f => CHEMS[f].s === 'r');
    if(!onlySolids) return no('vat-dung-ran');
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
function serve(){
  if(!G.querySelector('#custwalk:not(.walking):not(.away)')) return;   // khách đang đi vào / đi ra: chưa nhận hàng
  const od = lab.day.orders[lab.oi];
  const c = CUSTOMERS[od.who];
  const cont = lab.sel === 'beaker' ? lab.mix : lab.sel === 'gas' ? lab.gas : lab.solid;
  const res = checkServe(cont, od);
  if(res === true){
    if(lab.sel === 'beaker'){ lab.mix = {}; lab.dac = {}; lab.firstPour = null; lab.waterIn = false; }
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
