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
   Vật đặt bằng (u,t): u ∈ [-1,1] trái→phải, t ∈ [0,1] xa→gần; ĐÁY vật neo đúng
   điểm (x,y) tính được nên trông như đứng trên bàn, kèm bóng đổ và co theo chiều sâu.
   ===================================================================== */
const CX = 658;                        // tâm vùng bàn (336..980)
const FAR_Y = 430, NEAR_Y = 636;       // bàn nông: sâu ~200px
const FAR_H = 255, NEAR_H = 318;       // nửa bề rộng tương ứng
const yOf     = t => FAR_Y + (NEAR_Y - FAR_Y) * t;
const halfOf  = t => FAR_H + (NEAR_H - FAR_H) * t;
const xOf     = (u,t) => CX + u * halfOf(t);
const scaleOf = t => 0.82 + 0.22 * t;  // dải hẹp: hình & chữ ở xa vẫn rõ
const VP_Y    = FAR_Y - (FAR_H * (NEAR_Y - FAR_Y)) / (NEAR_H - FAR_H);   // điểm tụ
const BW = 186, BH = 222, BT = 0.34;   // cốc: cỡ vẽ và độ sâu trên bàn
const TRI_W = 190, TRI_H = 71;         // kiềng phải RỘNG HƠN đáy cốc mới đỡ được
// Lưới amiăng nằm ở y=9 trong viewBox 160x60 của sym-tripod → quy ra px màn hình.
// Cốc nhấc đúng chừng này thì đáy mới CHẠM lưới, không hụt cũng không lún.
const HEAT_LIFT = Math.round((TRI_H - 9 * (TRI_H/60)) * scaleOf(BT));
const DISH_U = 0.52, DISH_T = 0.40;    // đĩa lọc có ô riêng, không nhét chung với phễu
/* BỘ THU KHÍ. Khí đi MỘT CHIỀU: chụp chuông (phễu úp ngược) lên miệng cốc → cổ hẹp
   → ống dẫn → vào bình qua cái vòi nhỏ của nó. Bình KHÔNG bị úp ngược nữa; nó đứng
   trong giá đỡ vòng bên phải cốc. Ba mảnh rời nên chuông bám theo cốc (cốc nhấc lên
   khi đun) còn giá đỡ vẫn đứng yên trên bàn — ống nối vẽ lại theo hai đầu thật. */
const GS_U = 0.60, GS_W = 95, GS_H = 162;    // giá đỡ vòng (sym-ringstand, viewBox 150x256)
const HOOD_W = 200, HOOD_H = 130;            // chuông (viewBox 200x130)
/* tâm vòng đỡ trên màn hình — chỗ đáy bình phải rơi vào */
function gasRingPt(){
  const sc = scaleOf(BT);
  return {x: xOf(GS_U,BT) - GS_W*sc/2 + (56/150*GS_W)*sc,
          y: yOf(BT) - GS_H*sc + (44/256*GS_H)*sc};
}
const HOOD_RIM_X = 88, HOOD_RIM_Y = 112;     // tâm vành miệng trong viewBox
const HOOD_OUT_X = 198, HOOD_OUT_Y = 50;     // đầu ra của ống trong viewBox
let TOOLPOS = {};                      // (u,t) từng dụng cụ, để đèn/bình trượt vào cốc

/* Dụng cụ giờ là VẬT TRÊN BÀN, không còn nửa nút bấm nửa đồ kéo-thả.
   "Khuấy" gộp đũa thuỷ tinh + nút thìa cũ — cả hai vốn làm đúng một việc. */
const TOOLBOX = {
  rod:    {label:'Khuấy',     symbol:'sym-stirrod',   w:30, h:132, drag:'rod',    gw:28, gh:126},
  heat:   {label:'Đun nóng',  symbol:'sym-lamp',      w:74, h:88,  drag:'lamp',   gw:58, gh:70, dz:'flame'},
  burn:   {label:'Đốt',       symbol:'sym-burnspoon', w:36, h:122, drag:'ladle',  gw:36, gh:122, dz:'ladle'},
  elec:   {label:'Điện phân', symbol:'sym-electro',   w:70, h:78,  drag:'elec',   gw:58, gh:66},
  gas:    {label:'Thu khí',   symbol:'sym-gasbottle', w:76, h:108, drag:'gas',    gw:60, gh:86, style:'--gasop:0;--stopop:0'},
  filter: {label:'Lọc',       symbol:'sym-funnel',    w:70, h:88,  drag:'funnel', gw:56, gh:70},
  quy:    {label:'Giấy quỳ',  symbol:'sym-litmusbox', w:64, h:64},
  book:   {label:'Sổ tay',    symbol:'sym-notebook',  w:60, h:60}
  // 'spoon' của ngày cũ đã gộp vào rod; bồn rửa là trạm riêng, không nằm trên bàn
};
// ponytail: 'quy' & 'book' vẫn còn trong TOOLBOX — thêm lại vào đây là hiện lại ngay
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
  ladle: ['flame','jar','sink'],
  beaker:['cust','sink'],
  gas:   ['beaker','cust','sink'],
  dish:  ['cust','sink'],
  lamp:  ['beaker'],
  elec:  ['beaker'],
  funnel:['beaker'],
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
  drag.ghost.style.transform = 'rotate('+drag.tilt.toFixed(1)+'deg) scale(1.05)';
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
    if(d.opts.onDrop) d.opts.onDrop(zname, e);
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
function svgClone(sel, w, h){
  const el = G.querySelector(sel);
  return el.outerHTML.replace(/width="\d+"/, 'width="'+w+'"').replace(/height="\d+"/, 'height="'+h+'"');
}
function dropAction(type, zone, data){
  if(!lab) return;
  if(type === 'chem'){ pourChem(data, zone); return; }
  if(type === 'ladle'){
    if(zone === 'flame') igniteLadle();
    else if(zone === 'jar') burnInJar();
    else dumpLadle();
    return;
  }
  if(type === 'beaker'){
    if(zone === 'cust'){ lab.sel = 'beaker'; serve(); } else dumpBeaker();
    return;
  }
  if(type === 'gas'){
    if(zone === 'beaker'){
      if(tot(lab.gas) > 0){
        pourGas();
      } else {
        if(!lab.catcher) setCatch(true);
      }
    }
    else if(zone === 'cust'){ lab.sel = 'gas'; serve(); }
    else { lab.gas = {}; SFX.splash(); toast('Đã xả bình khí vào bồn.'); updateBeaker(); }
    return;
  }
  if(type === 'dish'){
    if(zone === 'cust'){ lab.sel = 'solid'; serve(); }
    else { lab.solid = {}; SFX.splash(); toast('Đã đổ đĩa lọc vào bồn.'); updateBeaker(); }
    return;
  }
  if(type === 'lamp'){ setHeat(true); return; }
  if(type === 'elec'){ setElec(true); return; }
  if(type === 'funnel'){ useFilter(); return; }
}

/* ladle/ladleLit: chất trên muôi đốt & đã bén lửa chưa. hard: ca này chơi chế độ khó
   (chốt lúc mở tiệm — đổi cài đặt giữa ca không làm lệch cách chấm). dur: thời lượng ca.
   An toàn: goggles (đã đeo kính & găng), hood (tủ hút đang bật), hoodDay (hôm nay có thể sinh
   khí độc), safety (số lỗi an toàn), firstPour/waterIn (để bắt lỗi rót nước vào axit).
   Luật an toàn chỉ áp ở CHẾ ĐỘ KHÓ: chế độ thường coi như đã đeo đồ bảo hộ, không có tủ hút, không trừ sao;
   rót nước vào axit thì giáo sư vẫn giảng (kiến thức), chỉ không tính lỗi.
   mistakes: đếm từng loại lỗi trong ca — đi vào báo cáo cho thầy cô. */
function newLab(i, day){
  const hard = hardOn(), dur = hard ? Math.round(day.dur * 1.5) : day.dur;
  return {i, day, hard, dur, mix:{}, undissolved:{}, dissolveTotal:0, gas:{}, solid:{}, ladle:{}, ladleLit:false,
          heaterOn:false, elecOn:false, catcher:false, sel:'beaker',
          time:dur, oi:0, served:0, wrong:0, timer:null, lastColor:'', magicDose:1,
          otime:0, odur:0, waitStage:0, miss:0, lastWhy:'', cardQ:[], cardOpen:false,
          goggles:!hard, hood:false, hoodDay:hard && [...dayHave(day)].some(f => TOXIC.includes(f)),
          safety:0, safeHits:{}, firstPour:null, waterIn:false, mistakes:{}, dac:{}};
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
                         safety:lab.safety, mistakes:lab.mistakes};
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
  noteMistake('khach-bo-di'); runMiss();
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
/* Dụng cụ trải thành MỘT hàng sát mép gần. Ít đồ thì cụm vào giữa, nhiều mới trải
   rộng — không văng ra mép bàn. Hàng hơi cong: giữa gần người nhất. */
function benchTools(day){
  const list = ['rod'].concat(TOOL_ORDER.filter(t => day.tools.includes(t)));
  const n = list.length, span = Math.min(0.74, 0.17 * n);
  TOOLPOS = {};
  return list.map((key,i) => {
    const tl = TOOLBOX[key];
    const spread = n > 1 ? i/(n-1) : 0.5;
    const u = -span + spread*2*span;
    const t = 0.86 - Math.abs(0.5 - spread) * 0.13;
    TOOLPOS[key] = {u, t};
    const art = sym(tl.symbol, tl.w, tl.h, tl.style || '').replace('<svg ', '<svg id="sv_'+key+'" ');
    // có muôi đốt thì bình khí kiêm lọ khí (thả bình O₂/Cl₂ vào để nạp, thả muôi đang cháy vào để đốt)
    const dz = key === 'gas' ? (day.tools.includes('burn') ? 'jar' : undefined)
             : key === 'heat' ? (day.tools.includes('burn') ? tl.dz : undefined) : tl.dz;
    return place({u, t, w:tl.w, h:tl.h, art, z:20, id:'tool_'+key, cls:'grab', dz,
                  over:'<div class="toolcap">'+tl.label+'</div>'});
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
    <div class="custcol">
      <div class="speech" id="speech"><svg class="on-ring" width="30" height="30" viewBox="0 0 34 34"><circle class="bg" cx="17" cy="17" r="14"/><circle class="fg" cx="17" cy="17" r="14" stroke-dasharray="88" stroke-dashoffset="0"/></svg>
        <div id="sptext"></div><div class="sp-order" id="sporder" hidden></div></div>
      <div class="custzone" id="cust"><div class="custwalk" id="custwalk"></div></div>
      ${TRAY_SVG}
    </div>
    <div class="sinkstation" data-dz="sink"><div class="counter"></div>
      <svg id="sinksvg" width="96" height="76"><use href="#sym-sink"/></svg><div class="cap">Bồn rửa</div></div>
    ${benchDressing()}
    ${place({u:0, t:BT, w:TRI_W, h:TRI_H, id:'tripod', z:-6, cls:'tripod', scls:'gated tri-sh', art:sym('sym-tripod',TRI_W,TRI_H)})}
    ${has('gas') ? place({u:GS_U, t:BT, w:GS_W, h:GS_H, id:'gasstand', z:2, cls:'rig', scls:'gated rig-sh', art:sym('sym-ringstand',GS_W,GS_H)}) : ''}
    ${has('gas') ? '<div class="rig gashood" id="gashood">'+sym('sym-gashood',HOOD_W,HOOD_H)+'</div>' : ''}
    ${has('gas') ? '<svg class="rig gastube" id="gastube" viewBox="0 0 1280 720"><path id="gastubeline" fill="none" stroke="#3b3025" stroke-width="10" stroke-linecap="round"/><path id="gastubecore" fill="none" stroke="#f3f1e8" stroke-width="5.5" stroke-linecap="round"/></svg>' : ''}
    ${place({u:0, t:BT, w:BW, h:BH, id:'beakerItem', dz:'beaker', cls:'grab', z:4,
             art:BEAKER_SVG.replace('<svg ','<svg width="'+BW+'" height="'+BH+'" ')})}
    <button class="btn undobtn" id="bundo" hidden title="Rút lại lần rót vừa rồi (khi chất chưa phản ứng)">↶ Rút lại</button>
    <div class="stirring-ring" id="stirring-ring"><svg width="52" height="52" viewBox="0 0 52 52">
      <circle class="bg" cx="26" cy="26" r="21"/><circle class="fg" cx="26" cy="26" r="21"/></svg><span class="stir-tag">Khuấy!</span></div>
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
  dragify(G.querySelector('#beakerItem'), 'beaker', {w:110, h:132, ghostHTML: () => svgClone('#beakersvg',110,132)});
  // dụng cụ trên bàn: mỗi thứ một ô, ai cũng có nhãn
  const overBeaker = e => { const bk = G.querySelector('#beakerItem'); if(!bk || !e) return false;
    const r = bk.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; };
  const LOOSE = {
    lamp: () => { if(lab.heaterOn){ setHeat(false); return true; } return false; },
    elec: () => { if(lab.elecOn){ setElec(false); return true; } return false; },
    gas:  () => { if(lab.catcher){ setCatch(false); return true; } return false; },
    // nhúng muôi vào cốc: không đốt trong cốc — nói rõ lý do thay vì lặng lẽ bật về
    ladle: e => { if(overBeaker(e)){ SFX.err(); notify('Không đốt trong cốc! Đưa muôi đang cháy vào <b>lọ khí</b> (bình khí đã nạp O₂ hoặc Cl₂).'); } return false; }
  };
  Object.keys(TOOLPOS).forEach(key => {
    const tl = TOOLBOX[key], el = G.querySelector('#tool_'+key);
    if(!el) return;
    if(!tl.drag){                                  // quỳ & sổ tay chỉ bấm
      el.onclick = useLitmus;
      el.style.cursor = 'pointer';
      return;
    }
    dragify(el, tl.drag, {
      w:tl.gw, h:tl.gh,
      ghostHTML: () => svgClone('#sv_'+key, tl.gw, tl.gh),
      onLoose: LOOSE[tl.drag],
      // đũa: bấm một cái = khuấy một nhát, thay cho nút "Khuấy" cũ
      onClick: key === 'rod' ? (() => {
        if(tot(lab.undissolved) > 0){ dissolveStep(); return; }
        wiggleBeaker(); SFX.pour(); if(!runReactions()) explainNoRx(); updateBeaker();
      }) : key === 'burn' ? (() => notify(ladleHint())) : undefined
    });
  });
  syncLadle();
  
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
    if(!tot(lab.undissolved)) flashStirRing(); // quick fill-and-fade — same ring as stirring, but for an instant reaction
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

function flashStirRing(){
  const ring = G.querySelector('#stirring-ring'); if(!ring) return;
  ring.classList.remove('flash'); void ring.offsetWidth; ring.classList.add('flash');
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
    notify('Muôi đốt chỉ đựng chất <b>rắn</b>. ' + (JAR_GASES.includes(f) ? 'Khí '+sub(f)+' thì nạp vào <b>lọ khí</b> (bình Thu khí).' : 'Chất này rót vào cốc.'));
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
  noteMistake('axit-nuoc');
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
    (lab.toldSlow ? toast : notify)(doseStr(f, dose) + ' ' + sub(f) + ' — chưa tan! Kéo đũa <b>Khuấy</b> vào cốc rồi khuấy tròn cho tan.');
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
     1. nạp O₂ / Cl₂ vào lọ khí (ngày có muôi đốt thì bình Thu khí kiêm lọ khí)
     2. thả chất rắn vào muôi đốt, hơ muôi qua đèn cồn cho bén lửa
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
function loadLadle(f, dose){
  lab.ladle[f] = RQ((lab.ladle[f]||0) + dose);
  SFX.grain();
  toast('Đã cho ' + doseStr(f, dose) + ' ' + sub(f) + ' lên muôi đốt.'
        + (lab.ladleLit ? '' : ' Giờ kéo muôi qua <b>đèn cồn</b> để hơ cho bén lửa.'));
  syncLadle(); updateCoach();
}
function igniteLadle(){
  const fuel = ladleFuel();
  if(!fuel.length){ SFX.err(); notify('Muôi đang trống — thả chất rắn từ tủ vào muôi rồi mới hơ lửa.'); return; }
  const lamp = G.querySelector('#sv_heat');
  if(lamp && !lab.heaterOn){   // đèn loé lên một nhịp cho thấy là vừa hơ qua lửa
    setFx(lamp, 'flame', 1);
    setTimeout(() => { if(lab && !lab.heaterOn) setFx(lamp, 'flame', 0); }, 1200);
  }
  if(lab.ladleLit){ notify('Muôi đang cháy rồi — đưa nhanh vào lọ khí!'); return; }
  lab.ladleLit = true;
  SFX.ignite();
  notify(fuel.map(sub).join(', ') + ' trên muôi đã bén lửa — đưa nhanh vào <b>lọ khí</b>!');
  syncLadle(); updateCoach();
}
function dumpLadle(){
  if(!ladleFuel().length){ toast('Muôi đang trống.'); return; }
  lab.ladle = {}; lab.ladleLit = false;
  SFX.splash(); toast('Đã đổ chất trên muôi vào bồn.');
  syncLadle(); updateCoach();
}
function burnInJar(){
  const fuel = ladleFuel();
  if(!fuel.length){ SFX.err(); notify('Muôi đang trống — thả chất rắn từ tủ vào muôi trước.'); return; }
  if(!lab.ladleLit){ SFX.err(); notify('Chất trên muôi chưa bén lửa — kéo muôi qua <b>đèn cồn</b> để hơ trước đã.'); return; }
  const gases = Object.keys(lab.gas).filter(f => lab.gas[f] > 0);
  if(!gases.length){
    SFX.err(); lab.ladleLit = false; syncLadle();
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
    SFX.err(); lab.ladleLit = false; syncLadle();
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
  lab.ladleLit = false;   // hết chất cháy, hoặc hết khí trong lọ → lửa tắt
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
  if(sp){   // muôi thò vào lọ một nhịp: nắp muôi đậy đúng miệng lọ, rồi rút ra
    const q = sp.getBoundingClientRect();
    sp.style.transition = 'transform .3s ease-out';
    sp.style.transform = 'translate(' + (cx - (q.left + q.width/2 - gr.left)/s) + 'px,'
                       + ((r.top - q.top)/s + r.height*0.19/s - q.height*0.36/s) + 'px)';
    setTimeout(() => { sp.style.transform = ''; }, 1300);
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
    const cap = it.querySelector('.toolcap');
    if(cap) cap.innerHTML = 'Đốt' + (fuel.length ? ' · ' + fuel.map(sub).join(', ') : '');
  }
}
function ladleHint(){
  if(!ladleFuel().length) return '<b>Muôi đốt</b>: thả chất rắn từ tủ vào muôi → kéo muôi qua <b>đèn cồn</b> cho bén lửa → đưa vào <b>lọ khí</b> (bình Thu khí đã nạp O₂ / Cl₂).';
  if(!lab.ladleLit) return 'Kéo muôi qua <b>đèn cồn</b> để hơ cho chất trên muôi bén lửa.';
  return 'Muôi đang cháy — kéo vào <b>lọ khí</b> (bình Thu khí đã nạp O₂ / Cl₂)!';
}

/* =====================  VÌ SAO KHÔNG PHẢN ỨNG?  =====================
   Cốc im re thì giáo sư nói LÝ DO (đốt nhầm chỗ, thiếu nhiệt, dãy hoạt động, chất không tan…)
   thay vì để trò thử bừa. focus = chất vừa rót: chỉ nói lý do có dính tới chất đó. */
const ACTIVITY = ['K','Na','Mg','Al','Zn','Fe','H','Cu','Ag'];
const METALS = ACTIVITY.filter(m => m !== 'H');
const metalOf = f => (f.match(/^(K|Na|Mg|Al|Zn|Fe|Cu|Ag|Ca|Ba|Mn)(?![a-z])/) || [])[1];
let noRxKey = null;   // khoá PROF_NO_RX của câu whyNoReaction trả về gần nhất
function whyNoReaction(focus){
  const mix = lab.mix, tools = lab.day.tools;
  const has = f => (mix[f]||0) > 0.009;
  const here = Object.keys(mix).filter(has), rest = here.filter(f => f !== 'H2O');
  const liquid = here.some(f => CHEMS[f].s === 'l' || CHEMS[f].s === 'd');
  const ready = r => Object.keys(r.rg).every(f => has(f) || (f === 'H2O' && liquid));
  const hit = inv => !focus || inv.includes(focus);
  // câu nói lấy từ PROF_NO_RX (loi-thoai.js); khoá câu (noRxKey) cho biết loại lỗi để ghi báo cáo (WHY_MISTAKE)
  noRxKey = null;
  const say = (k, v) => { noRxKey = k; return fillLine(PROF_NO_RX[k], v || {}); };
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
  noteMistake(WHY_MISTAKE[noRxKey]);
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
function noteMistake(code){ if(lab && code) lab.mistakes[code] = (lab.mistakes[code]||0) + 1; }
/* Các loại lỗi đếm vào báo cáo cho thầy cô — gom từ câu khách phàn nàn, lời giáo sư giải thích
   vì sao cốc không phản ứng, lỗi an toàn và khách bỏ đi. */
const MISTAKES = {
  'chua-khuay':'Giao khi chất còn chưa tan', 'trong':'Giao vật đựng trống', 'vat-dung':'Giao sai vật đựng (khí / chất rắn)',
  'khong-co':'Không ra được chất khách cần', 'lan-chat':'Hàng lẫn chất khác (sai tỉ lệ)', 'sai-luong':'Sai lượng chất',
  'thieu-nuoc':'Quên pha với nước', 'dot-sai-cho':'Đốt trong cốc thay vì lọ khí', 'thieu-nhiet':'Quên đun nóng',
  'day-hoat-dong':'Nhầm dãy hoạt động kim loại', 'khong-tan':'Dùng chất không tan / không tác dụng với nước',
  'trao-doi':'Trộn muối không tạo kết tủa', 'kinh':'Quên đeo kính bảo hộ', 'axit-nuoc':'Rót nước vào axit',
  'tu-hut':'Làm với khí độc khi chưa bật tủ hút', 'khach-bo-di':'Để khách chờ quá lâu',
  'nong-do':'Nhầm axit đặc / loãng'
};
// khoá câu thoại (REASON_LINES / PROF_NO_RX trong loi-thoai.js) → loại lỗi; khoá không có ở đây là trùng tên với loại lỗi
const REASON_MISTAKE = {'vat-dung-khi':'vat-dung', 'vat-dung-ran':'vat-dung', 'nhieu-qua':'sai-luong', 'it-qua':'sai-luong'};
const WHY_MISTAKE = {'dot-sai-cho':'dot-sai-cho', 'thieu-nhiet':'thieu-nhiet', 'sau-hidro':'day-hoat-dong',
  'yeu-hon':'day-hoat-dong', 'kl-nuoc':'khong-tan', 'khong-tan':'khong-tan', 'trao-doi':'trao-doi', 'can-dac':'nong-do', 'thu-dong':'nong-do', 'thieu-xt':'thieu-nhiet'};
function safetyHit(code, msg){
  if(lab.safeHits[code]) return;        // mỗi loại lỗi chỉ tính một lần trong ca
  lab.safeHits[code] = 1;
  if(!lab.hard){ notify('<b>Giáo sư:</b> ' + msg); return; }   // chế độ thường: chỉ giảng, không tính lỗi
  const warnOnly = lab.i === 0;         // ngày đầu: chỉ nhắc cho quen, không trừ sao
  if(!warnOnly){ lab.safety++; noteMistake(code); runMiss(); }
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
function pourFX(f){
  const c = CHEMS[f], cs = contSym(f), bx = beakerBox();
  const isPip = (cs === 'sym-bottle-liquid'), isSpoon = (cs === 'sym-jar-powder');
  const g = document.createElement('div');
  g.className = 'pourghost' + (isPip ? ' ppip' : isSpoon ? ' pspoon' : '');
  if(isPip){        // pipette: đầu ống lơ lửng trên miệng cốc
    g.style.cssText = 'left:' + (bx.cx - 9) + 'px;top:' + (bx.top - 138) + 'px';
    g.innerHTML = sym('sym-pipette',34,120,'--lc:'+c.c);
  } else if(isSpoon){ // thìa bột, lòng thìa nằm trên miệng cốc
    g.style.cssText = 'left:' + (bx.cx - 46) + 'px;top:' + (bx.top - 40) + 'px';
    g.innerHTML = sym('sym-spoon',72,72,'--lc:'+c.c+';--spop:1');
  } else {          // kim loại / khí giữ nguyên vật đựng
    g.style.cssText = 'left:' + (bx.cx + 4) + 'px;top:' + (bx.top - 68) + 'px';
    g.innerHTML = sym(cs,58,80,'--lc:'+c.c+';--lc2:#00000022');
  }
  G.appendChild(g);
  if(isPip){
    const st = document.createElement('div');
    st.className = 'stream';
    st.style.cssText = 'left:' + (bx.cx - 3) + 'px;top:' + (bx.top - 18) + 'px;background:'+c.c;
    G.appendChild(st); setTimeout(()=>st.remove(), 850);
    SFX.pour();
  } else {
    for(let k=0;k<7;k++){
      const gr = document.createElement('div');
      gr.className = 'grain';
      gr.style.cssText = 'left:'+(bx.cx-12+Math.random()*24)+'px;top:'+(bx.top-14+Math.random()*10)
        + 'px;background:'+c.c+';border:1px solid #3b302566;animation-delay:'+(Math.random()*.35)+'s';
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
  const H = liq ? Math.min(30 + liq*15, 196) : 0, y = 222 - H;
  lq.setAttribute('y', y); lq.setAttribute('height', H);
  lq.style.fill = liqColor;
  men.setAttribute('transform', 'translate(0,'+y+')');
  men.setAttribute('opacity', liq ? 1 : 0);
  const PH = pre ? Math.min(7 + pre*8, 54) : 0;
  pr.setAttribute('y', 222-PH); pr.setAttribute('height', PH);
  pr.style.fill = preColor;
  tex.setAttribute('opacity', pre ? 1 : 0);
  tex.setAttribute('transform', 'translate(0,'+(-Math.max(0, PH-4))+')'); // hạt lấm tấm nằm trên mặt kết tủa
  const dr = G.querySelector('#bk-drops');
  if(dr) dr.setAttribute('opacity', lab.heaterOn && liq ? 1 : 0);
  // color-change swirl
  if(liq && liqColor !== lab.lastColor && lab.lastColor){
    const sw = document.createElement('div');
    sw.className = 'swirlfx'; sw.style.background = liqColor;
    zone.appendChild(sw); setTimeout(()=>sw.remove(), 950);
  }
  lab.lastColor = liq ? liqColor : '';
  // stirring progress ring: fills as undissolved solid shrinks toward 0.
  // Vị trí bám sát MẶT chất lỏng/kết tủa thật (không treo cố định trên miệng cốc) —
  // cùng công thức svg->màn hình mà spawnFall() dùng để rắc hạt kết tủa đúng chỗ.
  const ring = G.querySelector('#stirring-ring');
  if(ring){
    ring.classList.toggle('active', lab.dissolveTotal > 0);
    if(lab.dissolveTotal > 0){
      const prog = Math.max(0, Math.min(1, 1 - tot(ud)/lab.dissolveTotal));
      ring.querySelector('circle.fg').style.strokeDashoffset = 132*(1-prog);
    }
    // mặt thoáng nằm ở y=222-max(H,PH) trong viewBox 240 của cốc → quy ra px màn hình
    const sc = scaleOf(BT), surf = 222 - Math.max(H, PH);
    ring.style.left = xOf(0,BT) + 'px';
    ring.style.top  = (yOf(BT) - BH*sc + surf*(BH/240)*sc - (lab.heaterOn ? HEAT_LIFT : 0)) + 'px';
  }
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
  const gcap = G.querySelector('#tool_gas .toolcap');   // bình kiêm lọ khí: nhãn cho biết đang chứa khí gì
  if(gcap){ const ks = Object.keys(lab.gas).filter(f => lab.gas[f] > 0);
            gcap.innerHTML = 'Thu khí' + (ks.length ? ' · ' + ks.map(sub).join(', ') : ''); }
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
/* Đĩa lọc chỉ TỒN TẠI khi đang có chất trên nó, và có ô riêng bên phải cốc.
   Trước đây nó nhét chung ô với cái phễu và bị chính nhãn "Lọc" đè lên. */
function syncDish(){
  const host = G.querySelector('#dishHost'); if(!host) return;
  const ks = Object.keys(lab.solid).filter(f => lab.solid[f] > 0);
  if(!ks.length){ host.innerHTML = ''; return; }
  if(!host.querySelector('#dishEl')){
    host.innerHTML = place({u:DISH_U, t:DISH_T, w:60, h:26, z:20, id:'dishEl', cls:'grab',
      art:'<div class="dish" style="width:56px;height:18px;margin:4px auto 0"></div>',
      over:'<div class="toolcap">Đĩa lọc</div>'});
    dragify(host.querySelector('#dishEl'), 'dish',
      {w:60, h:24, ghostHTML:()=>'<div class="dish" style="width:60px;height:20px"></div>'});
  }
  const d = host.querySelector('.dish');
  if(d) d.style.background = 'linear-gradient(transparent 40%, '+CHEMS[ks[0]].c+' 40%)';
}
function spawnBubbles(){
  const bx = beakerBox();
  for(let k=0; k<6; k++){
    const b = document.createElement('div');
    b.className = 'bubble';
    const sz = 7 + Math.random()*11;
    b.style.cssText = 'width:'+sz+'px;height:'+sz+'px;left:'+(bx.cx-42+Math.random()*84)+'px;'
      + 'top:'+(bx.bot-46)+'px;z-index:44;animation-delay:'+(Math.random()*.4)+'s';
    G.appendChild(b); setTimeout(()=>b.remove(), 1700);
  }
  for(let k=0; k<3; k++){
    const l = document.createElement('div');
    l.className = 'fizzline';
    l.style.cssText = 'left:'+(bx.cx-34+Math.random()*68)+'px;top:'+(bx.bot-52)+'px;z-index:44;animation-delay:'+(Math.random()*.3)+'s';
    G.appendChild(l); setTimeout(()=>l.remove(), 1100);
  }
  SFX.fizz();
}
function spawnFall(color){
  const bx = beakerBox();
  SFX.tinkle();
  for(let k=0; k<5; k++){
    const f = document.createElement('div');
    f.className = 'fall';
    f.style.cssText = 'background:'+color+';border:1px solid var(--ink);z-index:44;left:'
      + (bx.cx-40+Math.random()*80)+'px;top:'+(bx.bot-18)+'px;animation-delay:'+(Math.random()*.3)+'s';
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
function dockZ(el, z){
  if(el.dataset.z0 === undefined) el.dataset.z0 = el.style.zIndex || '';
  el.style.zIndex = z;
}
function undockZ(el){ el.style.zIndex = el.dataset.z0 || ''; }

/* Bật đèn = dựng cả BỘ ĐUN: kiềng mọc lên, cốc được nhấc đặt LÊN lưới amiăng,
   đèn cồn chui vào giữa ba chân. Không còn cảnh hơ cốc lơ lửng trên ngọn lửa. */
function setHeat(on){
  if(lab.heaterOn === on) return;
  lab.heaterOn = on;
  const it = G.querySelector('#tool_heat'), bk = G.querySelector('#beakerItem'),
        sv = G.querySelector('#sv_heat');
  if(sv) setFx(sv, 'flame', on ? 1 : 0);
  if(bk){ bk.style.setProperty('--lift', (-HEAT_LIFT)+'px'); bk.classList.toggle('hot', on); }
  G.querySelectorAll('#tripod,.tri-sh').forEach(e => e.classList.toggle('up', on));
  if(it && TOOLPOS.heat){
    if(on){
      const q = TOOLPOS.heat;
      it.style.transition = 'transform .4s cubic-bezier(.3,1.4,.5,1)';
      it.style.transform  = 'translate('+(xOf(0,BT) - xOf(q.u,q.t))+'px,'+(yOf(BT) - yOf(q.t) + 24)+'px)';
      dockZ(it, 16);                        // dưới kiềng, nên chân kiềng vẫn vắt qua trước
      it.classList.add('docked');
    } else { it.style.transform = ''; undockZ(it); it.classList.remove('docked'); }
  }
  if(lab.catcher) syncGasRig();   // cốc nhấc lên/hạ xuống thì chuông phải bám theo
  SFX.clink(); if(on) SFX.ignite();
  if(on && !runReactions()) explainNoRx();
  updateBeaker();
}
/* điện phân: cùng lối cắm, hai điện cực thả vào lòng cốc */
function setElec(on){
  if(lab.elecOn === on) return;
  lab.elecOn = on;
  const it = G.querySelector('#tool_elec'), sv = G.querySelector('#sv_elec');
  if(sv) sv.style.setProperty('--zap', on ? 1 : 0);
  if(it && TOOLPOS.elec){
    if(on){
      const q = TOOLPOS.elec, bTop = yOf(BT) - BH*scaleOf(BT) - (lab.heaterOn ? HEAT_LIFT : 0);
      it.style.transition = 'transform .4s cubic-bezier(.3,1.4,.5,1)';
      it.style.transform  = 'translate('+(xOf(-0.16,BT) - xOf(q.u,q.t))+'px,'+(bTop + 52 - yOf(q.t))+'px)';
      dockZ(it, 68);
      it.classList.add('docked');
    } else { it.style.transform = ''; undockZ(it); it.classList.remove('docked'); }
  }
  SFX.clink();
  renderElecPanel();
  updateBeaker();
}
/* Dựng BỘ THU KHÍ. Khí đi một chiều: chuông chụp miệng cốc → cổ hẹp → ống dẫn →
   vào bình qua cái vòi nhỏ. Bình đứng trong giá đỡ vòng, KHÔNG úp ngược. */
function syncGasRig(){
  const hood = G.querySelector('#gashood'), stand = G.querySelector('#gasstand');
  if(!hood || !stand) return;
  const bTop = yOf(BT) - BH*scaleOf(BT) - (lab.heaterOn ? HEAT_LIFT : 0);
  // vành chuông chụp đúng miệng cốc
  hood.style.left = (xOf(0,BT) - HOOD_RIM_X) + 'px';
  hood.style.top  = (bTop + 14 - HOOD_RIM_Y) + 'px';
  // hai đầu ống thật: đầu ra của chuông, và CỔ bình (67,130 trong sym-gasbottle)
  const hx = xOf(0,BT) - HOOD_RIM_X + HOOD_OUT_X, hy = bTop + 14 - HOOD_RIM_Y + HOOD_OUT_Y;
  const r = gasRingPt(), k = TOOLBOX.gas.w * scaleOf(TOOLPOS.gas.t) / 120;
  const sx = r.x + 1*k, sy = r.y + 12*k;
  const d = 'M'+hx+','+hy+' Q'+(Math.min(hx,sx)-30)+','+((hy+sy)/2+18)+' '+sx+','+sy;
  const l = G.querySelector('#gastubeline'), c = G.querySelector('#gastubecore');
  if(l) l.setAttribute('d', d);
  if(c) c.setAttribute('d', d);
}
function setCatch(on){
  if(lab.catcher === on) return;
  lab.catcher = on;
  const it = G.querySelector('#tool_gas');
  if(it && TOOLPOS.gas){
    if(on){
      // bình trượt vào NẰM TRONG vòng đỡ — vẫn thấy và vẫn kéo ra được, chứ không
      // biến mất. Vòi rời của nó tắt đi vì đã có ống nối thật thay chỗ.
      const q = TOOLPOS.gas, sct = scaleOf(q.t);
      const W = TOOLBOX.gas.w*sct, H = TOOLBOX.gas.h*sct;
      const left = xOf(q.u,q.t) - W/2, top = yOf(q.t) - H, r = gasRingPt();
      it.style.transition = 'transform .4s cubic-bezier(.3,1.4,.5,1)';
      it.style.transform  = 'translate('+(r.x - (left + 66/120*W))+'px,'
                          + (r.y - (top + 118/170*H))+'px)';
      dockZ(it, 62);
      it.style.setProperty('--tubeop', 0);
      it.classList.add('docked');
    } else {
      it.style.transform = ''; undockZ(it);
      it.style.removeProperty('--tubeop');
      it.classList.remove('docked');
    }
  }
  if(on) syncGasRig();
  G.querySelectorAll('#gasstand,#gashood,#gastube,.rig-sh').forEach(e => e.classList.toggle('up', on));
  SFX.clink();
  updateBeaker();
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
// Ngày có muôi đốt, đèn cồn chỉ để hơ muôi và bình Thu khí chỉ làm lọ khí (mẹo muôi đốt đã nói) —
// mẹo "đun cốc" và "hứng khí" để dành tới ngày đầu tiên thực sự phải đun cốc / hứng khí từ cốc.
const TOOL_FIRST = (() => { const m = {rod:0};
  DAYS.forEach((d,i) => (d.tools||[]).forEach(t => {
    if(m[t] === undefined && !((t === 'gas' || t === 'heat') && d.tools.includes('burn'))) m[t] = i; }));
  return m; })();
const TOOL_TIP = {
  rod:    'Đũa <b>Khuấy</b> ở đầu bàn: kéo vào cốc rồi <b>khuấy tròn</b> cho chất ít tan tan hết.',
  heat:   'Mới: <b>Đun nóng</b>. Kéo đèn cồn vào cốc — kiềng sẽ mọc lên đỡ cốc. Kéo ra là tắt.',
  gas:    'Mới: <b>Thu khí</b>. Kéo lên miệng cốc <b>trước khi</b> phản ứng sinh khí, không thì khí bay mất.',
  filter: 'Mới: <b>Lọc</b>. Kéo phễu vào cốc để lọc kết tủa ra đĩa, rồi kéo <b>đĩa lọc</b> sang khách.',
  elec:   'Mới: <b>Điện phân</b>. Kéo nguồn vào cốc, rồi chọn chất và <b>số mol</b> ở bảng dưới mép bàn.',
  burn:   'Mới: <b>Muôi đốt</b>. Thả bình O₂ vào <b>Thu khí</b> để nạp lọ khí → thả chất rắn vào muôi → kéo muôi qua <b>đèn cồn</b> cho bén lửa → đưa vào lọ khí.'
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
      + (day.chems.includes(g) ? 'kéo bình <b>' + sub(g) + '</b> từ tủ thả vào bình <b>Thu khí</b> (lọ khí).'
                               : 'tự điều chế <b>' + sub(g) + '</b> rồi hứng vào bình <b>Thu khí</b>.');
    if(!((lab.ladle[fu]||0) > 0)) return 'Lọ đã có ' + sub(g) + '. Giờ thả <b>' + sub(fu) + '</b> từ tủ vào <b>muôi đốt</b> (nhãn <b>Đốt</b>).';
    if(!lab.ladleLit) return 'Kéo muôi qua <b>đèn cồn</b> để hơ cho ' + sub(fu) + ' bén lửa.';
    return 'Muôi đang cháy — đưa nhanh vào bình <b>Thu khí</b> (lọ ' + sub(g) + ')!';
  }
  // thứ tự nhắc đúng thứ tự thao tác: chất tan → nước → khuấy → dụng cụ → giao
  if(day.chems.includes(t) && !((lab.mix[t]||0) > 0 || (box[t]||0) > 0 || (lab.undissolved[t]||0) > 0))
    return 'Bắt đầu bằng cách kéo lọ <b>' + sub(t) + '</b> từ tủ bên phải vào cốc.';
  if(od.water && !(lab.mix.H2O > 0) && day.chems.includes('H2O'))
    return 'Khách hỏi <b>dung dịch</b> chứ không phải chất khô — kéo thêm lọ <b>Nước</b> vào cốc.';
  if(tot(lab.undissolved) > 0) return 'Còn chất chưa tan dưới đáy — kéo đũa <b>Khuấy</b> vào cốc rồi khuấy tròn.';
  if(want === 'gas' && !lab.catcher)  return 'Khách cần <b>khí</b>: kéo <b>Thu khí</b> lên miệng cốc trước đã, không thì khí bay mất.';
  if(!tot(lab.mix) && !tot(lab.undissolved))
    return 'Cốc đang trống — kéo hoá chất từ <b>tủ bên phải</b> vào cốc để bắt đầu.';
  if(day.tools.includes('elec') && !lab.elecOn)
    return 'Kéo <b>Điện phân</b> vào cốc, rồi chọn chất và <b>số mol</b> ở bảng dưới mép bàn.';
  if(lab.elecOn && elecList().length)
    return 'Ở bảng dưới mép bàn: chọn chất, vặn <b>số mol</b> rồi bấm <b>điện phân</b>.';
  if(want === 'solid' && (lab.mix[t]||0) > 0) return 'Kết tủa đã có trong cốc — kéo <b>Lọc</b> vào cốc để lọc ra đĩa.';
  // cốc im re: giáo sư nói lý do nếu đoán ra được (đốt nhầm chỗ, dãy hoạt động, chất không tan…)
  const why = whyNoReaction();
  if(why) return '<b>Giáo sư:</b> ' + why;
  // hết gợi ý cụ thể: nhắc chung, không đoán bừa là phải đun hay phải trộn gì
  return 'Chưa ra <b>' + sub(t) + '</b>. Thử rót thêm chất khác từ tủ'
       + (day.tools.includes('heat') ? ', hoặc kéo <b>Đun nóng</b> vào cốc' : '') + ' xem sao.';
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
  custSay(line);
  sp.classList.add('hush');                       // khách đứng trước khay, quay mặt thẳng rồi mới nói
  // mỗi lượt ghé một bộ đồ (nhan-vat-skin.js): đổi theo ngày và lượt khách, chơi lại đúng ngày thì vẫn y như cũ
  const skin = custSkinFor(lab.i, lab.oi, od.who), tall = s => s.replace('<svg ', '<svg style="height:250px" ');
  // WALK_VIEW '3/4': hình thẳng đã bọc lớp (nhan-vat-xoay.js: đi vào ở dáng 3/4, tới khay thì quay mặt thẳng) + hình
  // nghiêng hẳn (nhan-vat-nghieng.js: lúc đi ra). 'nghieng': hình thẳng thường + hình nghiêng hẳn cho cả lúc vào lẫn ra.
  cw.innerHTML = '<div class="cwin">' + tall(WALK_VIEW === '3/4' && typeof custTurnSVG === 'function'
    ? custTurnSVG(od.who, 'neutral', skin) : custSVG(od.who, 'neutral', skin))
    + tall(custSideSVG(od.who, 'neutral', skin)) + '</div>';
  // dáng 3/4: tới khay còn một nhịp quay mặt về phía người chơi (transition .32s trong style.css) rồi bóng thoại mới hiện
  const faceMs = cw.querySelector('.charsvg.turn') ? 320 : 0, me = lab;
  custWalk(cw, 'in', () => setTimeout(() => { if(lab === me && !cw.classList.contains('turnout') && !cw.classList.contains('away')) sp.classList.remove('hush'); }, faceMs));
  updateCoach();
  SFX.bell();
}
/* lời khách trong bóng thoại. Đơn còn chờ (lab.otag) mà câu không nói rõ cả lượng lẫn công thức — hoặc tên hàng có
   gợi ý cách làm — thì hiện thêm dòng chất cần làm ở góc dưới bên phải; giao xong / khách bỏ đi thì otag = null */
function custSay(html){
  const t = G.querySelector('#sptext'), tag = G.querySelector('#sporder');
  if(!t) return;
  t.innerHTML = html;
  const o = lab && lab.otag;
  tag.hidden = !o || (!o.hint && html.includes(o.q) && html.includes(o.f));
}
// bấm vào bóng thoại lúc khách đang chờ hàng: khách nói câu kế trong lab.talk
function custChat(){
  if(!lab || !lab.otag || !lab.talk || G.querySelector('#speech.hush')) return;
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
// khách xong việc (nhận hàng hoặc chờ lâu bỏ đi): đứng một nhịp cho thấy nét mặt và kịp đọc câu cuối (bóng thoại tắt
// ngay khi khách quay đi), rồi đi ra; hết khách thì đóng ca
const LEAVE_BEAT_MS = 900;
function custLeave(){
  const cw = G.querySelector('#custwalk'), next = lab.oi >= lab.day.orders.length ? finishLab : nextCustomer;
  setTimeout(() => { if(lab && cw.isConnected) custWalk(cw, 'out', () => { if(lab) next(); }); }, LEAVE_BEAT_MS);
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
    noteMistake(REASON_MISTAKE[res.key] || res.key);
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
