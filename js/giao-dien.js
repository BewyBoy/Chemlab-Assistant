/* =====================================================================
   GIAO DIỆN — âm thanh & nhạc nền, lưu tiến trình, menu, lịch, cửa hàng, màn giới thiệu ngày,
   giấy cân bằng, cài đặt, báo cáo học tập, màn kết quả.
   ===================================================================== */
'use strict';

/* ---- inline-SVG helpers ---- */
const ico = (id, s) => '<svg class="ico" width="'+(s||20)+'" height="'+(s||20)+'"><use href="#ico-'+id+'"/></svg>';
const sym = (id, w, h, style) => '<svg width="'+w+'" height="'+h+'"'+(style?' style="'+style+'"':'')+'><use href="#'+id+'"/></svg>';

/* ---- synthesized sound effects (WebAudio, no files) ---- */
const SFX = (() => {
  let ctx = null;
  // itch.io chạy trong iframe sandbox — localStorage có thể NÉM LỖI (không chỉ trả null)
  // ở đó; không bọc try/catch thì cả file script chết ngay từ dòng này, màn hình trắng.
  let muted = false;
  let sfxVol = 1, musVol = 1;   // 0..1, chỉnh trong Cài đặt
  try { muted = localStorage.getItem('chemlab_mute') === '1'; } catch(e){}
  try {
    const a = localStorage.getItem('chemlab_sfxvol'), b = localStorage.getItem('chemlab_musvol');
    if(a !== null) sfxVol = Math.max(0, Math.min(1, +a));
    if(b !== null) musVol = Math.max(0, Math.min(1, +b));
  } catch(e){}
  const ac = () => {
    if(!ctx){ try{ ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  function tone(f, d, type, v, f2, vol){
    const c = ac(); if(!c || muted) return;
    v = (v||.1) * (vol === undefined ? sfxVol : vol); if(v <= 0) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type||'sine'; o.frequency.value = f;
    if(f2) o.frequency.exponentialRampToValueAtTime(f2, c.currentTime+d);
    g.gain.setValueAtTime(v, c.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, c.currentTime+d);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime+d+.02);
  }
  // fq2: quét tần số lọc tới fq2 trong suốt tiếng — ra tiếng "vù" của lửa bùng lên
  function noise(d, v, fq, q, fq2){
    const c = ac(); if(!c || muted || sfxVol <= 0) return;
    const n = Math.floor(c.sampleRate*d), b = c.createBuffer(1, n, c.sampleRate), ch = b.getChannelData(0);
    for(let i=0;i<n;i++) ch[i] = (Math.random()*2-1)*(1-i/n);
    const s = c.createBufferSource(); s.buffer = b;
    const fl = c.createBiquadFilter(); fl.type='bandpass'; fl.frequency.value=fq||1200; fl.Q.value=q||1;
    if(fq2) fl.frequency.exponentialRampToValueAtTime(fq2, c.currentTime + d);
    const g = c.createGain(); g.gain.value = (v||.08) * sfxVol;
    s.connect(fl); fl.connect(g); g.connect(c.destination); s.start();
  }
  /* Nhạc nền: hộp nhạc tự sinh trên thang ngũ cung, mỗi chương một giọng — không cần file nhạc.
     Giai điệu là bước ngẫu nhiên lên/xuống từng bậc nên nghe liền mạch mà không lặp y hệt. */
  const THEMES = [
    {bpm: 84, root:261.63, sc:[0,2,4,7,9],  w:'sine'},      // menu & lịch: Đô ngũ cung, thong thả
    {bpm: 96, root:293.66, sc:[0,2,4,7,9],  w:'triangle'},  // chương 1 · oxi: Rê, tươi
    {bpm:100, root:220.00, sc:[0,3,5,7,10], w:'triangle'},  // chương 2 · hiđro – nước: La thứ
    {bpm:104, root:246.94, sc:[0,2,4,7,9],  w:'triangle'},  // chương 3 · axit – bazơ – muối
    {bpm: 92, root:196.00, sc:[0,3,5,7,10], w:'triangle'},  // chương 4 · kim loại & phi kim
    {bpm: 88, root:174.61, sc:[0,2,3,7,8],  w:'sine'}       // chương 5 · PTN nâng cao: hơi bí ẩn
  ];
  const mus = {theme:null, timer:null, step:0, pos:5};
  let unlocked = false;   // chưa có cú nhấp/chạm nào thì trình duyệt chưa cho phát — nhớ giai điệu, đợi unlock()
  const musicOn = () => !muted && unlocked && musVol > 0;
  function musicStop(){ clearInterval(mus.timer); mus.timer = null; }
  function musicPlay(k){
    mus.theme = k; musicStop();
    if(k == null || !musicOn()) return;
    const th = THEMES[k];
    const note = i => th.root * Math.pow(2, (th.sc[((i % 5) + 5) % 5] + 12*Math.floor(i/5)) / 12);
    mus.step = 0; mus.pos = 5;
    mus.timer = setInterval(() => {
      const s = mus.step++;
      if(s % 8 === 0) tone(note(s % 32 === 16 ? -2 : -5), 1.4, 'sine', .035, null, musVol);     // bè trầm: chủ âm, thỉnh thoảng lên bậc
      if(Math.random() < .62){
        mus.pos = Math.max(0, Math.min(9, mus.pos + [-2,-1,-1,1,1,2][Math.floor(Math.random()*6)]));
        tone(note(mus.pos), .55, th.w, .028, null, musVol);
      }
    }, 60000 / th.bpm / 2);
  }
  return {
    isMuted: () => muted,
    getVol: k => k === 'music' ? musVol : sfxVol,
    setVol(k, v){                       // v: 0..1; kéo thanh cũng bỏ tắt tiếng chung
      const was = musicOn();
      if(k === 'music') musVol = v; else sfxVol = v;
      muted = false;
      try{ localStorage.setItem(k === 'music' ? 'chemlab_musvol' : 'chemlab_sfxvol', v); localStorage.setItem('chemlab_mute','0'); }catch(e){}
      if(k === 'music' && (was !== musicOn() || !mus.timer)) musicPlay(mus.theme);
    },
    toggle(){ muted = !muted; try{ localStorage.setItem('chemlab_mute', muted?'1':'0'); }catch(e){}
              if(muted) musicStop(); else musicPlay(mus.theme); return muted; },
    // trình duyệt điện thoại chỉ cho phát tiếng sau một cú chạm — gọi cái này ở cú chạm đầu tiên
    unlock(){ unlocked = true; ac(); if(mus.theme != null && !mus.timer) musicPlay(mus.theme); },
    music(k){ if(k !== mus.theme || !mus.timer) musicPlay(k); },
    musicRefresh(){ musicPlay(mus.theme); },
    pour(){ noise(.35,.11,700,.8); },
    sizzle(){ noise(.7,.05,5200,.6); },                                     // toả nhiệt: xèo
    boil(){ for(let i=0;i<3;i++) setTimeout(()=>tone(150+Math.random()*130,.09,'sine',.035,320+Math.random()*120), i*120+Math.random()*60); },
    ignite(){ noise(.45,.09,900,.5,3200); },                                // hơ lửa / bật đèn: vù
    roar(){ noise(.9,.11,500,.4,2400); setTimeout(()=>noise(.5,.05,1800,.6),250); }, // cháy bùng trong lọ
    crackle(){ for(let i=0;i<9;i++) setTimeout(()=>noise(.03,.09,4000+Math.random()*2000,3), Math.random()*700); },
    bang(){ noise(.5,.2,180,.5); tone(90,.35,'sine',.16,40); },             // hỗn hợp nổ (H₂ + O₂ / Cl₂)
    tinkle(){ [1568,2093,1760].forEach((f,i)=>setTimeout(()=>tone(f,.12,'triangle',.025), i*90+Math.random()*40)); }, // kết tủa lắng
    zap(){ tone(110,.25,'sawtooth',.04,95); noise(.2,.03,3000,4); },       // điện phân
    grain(){ noise(.28,.1,2600,1.6); },
    fizz(){ for(let i=0;i<4;i++) setTimeout(()=>noise(.12,.05,3200,2), i*70); },
    clink(){ tone(1900,.09,'triangle',.08); setTimeout(()=>tone(2600,.12,'triangle',.05),40); },
    coin(){ tone(988,.08,'square',.045); setTimeout(()=>tone(1319,.16,'square',.045),70); },
    bell(){ tone(880,.25,'sine',.08); setTimeout(()=>tone(1175,.3,'sine',.07),140); },
    page(){ noise(.26,.06,900,.6); },
    talk(){ tone(480+Math.random()*160,.035,'triangle',.02); },              // giáo sư đang nói (chữ hiện dần)
    fill(){ for(let n=0;n<7;n++) setTimeout(()=>tone(260+n*70,.08,'sine',.05,330+n*80), n*130); setTimeout(()=>tone(1568,.2,'triangle',.04), 1000); }, // rót đầy sao: ọc ọc cao dần rồi "ting"
    err(){ tone(320,.18,'sawtooth',.05,180); },
    splash(){ noise(.3,.1,500,.7); setTimeout(()=>noise(.15,.05,900,.8),100); }
  };
})();

/* ---- page-turn scene transition ---- */
function go(fn){
  SFX.page();
  const w = document.createElement('div'); w.className = 'pagewipe';
  G.appendChild(w);
  setTimeout(()=>{
    const desc = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(G, 'innerHTML', {
      get() { return desc.get.call(G); },
      set(html) {
        Array.from(G.childNodes).forEach(c => {
          if (c !== w) G.removeChild(c);
        });
        const temp = document.createElement('div');
        temp.innerHTML = html;
        while (temp.firstChild) {
          G.insertBefore(temp.firstChild, w);
        }
      },
      configurable: true
    });
    try {
      fn();
    } finally {
      delete G.innerHTML;
    }
  }, 290);
  setTimeout(()=>w.remove(), 660);
}

/* =====================  STATE & PERSISTENCE  ===================== */
const G = document.getElementById('game');
// bấm ra ngoài hộp thoại (nền mờ) = bấm nút Đóng / Huỷ của nó; chỉ khi cả nhấn lẫn thả đều ở nền
let ovDown = null;
G.addEventListener('mousedown', e => { ovDown = e.target; });
G.addEventListener('click', e => {
  if(!e.target.classList.contains('overlay') || ovDown !== e.target) return;
  const b = e.target.querySelector('#mclose, #mno');
  if(b) b.click();
});
let save;
try { save = JSON.parse(localStorage.getItem('chemlab_save')); } catch(e){}
if(!save) save = {unlocked:1, stars:{}, ach:[], served:0, spent:0, rx:[]};
if(!save.rx) save.rx = [];   // save cũ: sổ tay bắt đầu trống, đầy dần khi chơi
if(!save.settings) save.settings = {};                 // save cũ: bổ sung ô cài đặt
if(save.settings.balance === undefined) save.settings.balance = true; // cân bằng phương trình: bật mặc định
const nobalOwned = () => !!(save.items && save.items.nobalance);   // mua ở Cửa hàng mới được tắt cân bằng
const balanceOn = () => !nobalOwned() || save.settings.balance !== false;
if(!save.starsHard) save.starsHard = {};               // sao chế độ khó lưu riêng, không đè sao thường
if(!save.hist) save.hist = [];                         // nhật ký từng lượt chơi, cho báo cáo học tập
const hardUnlocked = () => (save.stars[DAYS.length]||0) >= 1 || (save.starsHard[DAYS.length]||0) >= 1;   // đã qua ngày cuối lần đầu
const hardOn  = () => hardUnlocked() && save.settings.hard === true;     // chế độ khó: tự tính gam / ml / lít
const cardsOn = () => save.settings.cards !== false;   // thẻ phản ứng khi khám phá: bật mặc định
// sổ ghi chép ở màn xác định chất: phải mua ở Cửa hàng; mua rồi bật/tắt ngay trong Cửa hàng (mặc định bật)
const labbookOn = () => !!(save.items && save.items.labbook) && save.settings.labbook !== false;
const BALANCE_FROM_DAY = 6; // từ ngày này trở đi người chơi tự cân bằng; trước đó giáo sư làm hộ (ngày 5 học cân bằng)
// đồng đỏ: one copper coin per unlocked achievement, minus what was spent in the shop
const achCoins = () => save.ach.length - (save.spent||0);
// persist() được gọi rải khắp game (mở khoá, đổi liều lượng…) — không bọc thì storage bị
// chặn giữa chừng (itch.io iframe, Safari riêng tư) sẽ ném lỗi ngay tại chỗ gọi và văng game.
const persist = () => { try { localStorage.setItem('chemlab_save', JSON.stringify(save)); } catch(e){} };

function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = msg;
  G.appendChild(t); setTimeout(()=>t.remove(), 3600);
  // thông báo mới nằm dưới cùng, cái cũ được đẩy lên trên thay vì bị đè mất chữ; giữ tối đa 3
  const old = [...G.querySelectorAll('.toast')].filter(x => x !== t).reverse();
  let y = 20 + t.offsetHeight + 8;
  old.forEach((x, k) => {
    if(k >= 2){ x.remove(); return; }
    x.style.bottom = y + 'px';
    y += x.offsetHeight + 8;
  });
}
function unlockAch(id){
  if(save.ach.includes(id)) return;
  save.ach.push(id); persist();
  toast(ico('trophy',18)+' Thành tựu mới: <b>'+ACH[id].n+'</b>! +1 '+ico('coinred',15));
  SFX.bell();
}
// sao trên lịch: sao chế độ khó tô đỏ, sao thường vàng, còn lại sao rỗng
function dayStars(st, sth){
  return [0,1,2].map(k => k < sth ? '<b class="sh">★</b>' : k < st ? '★' : '☆').join('');
}
function starStr(n){ return '★★★'.slice(0,n) + '☆☆☆'.slice(0,3-n); }
function starConds(day){
  return day.mg
    ? ['Trả lời đúng ít nhất một nửa số câu','Trả lời đúng ít nhất 3/4 số câu','Trả lời đúng tất cả']
    : ['Hoàn thành ít nhất '+day.s1+' đơn hàng','Hoàn thành tất cả '+day.orders.length+' đơn hàng',
       'Không giao sai, không phạm lỗi an toàn'];
}
// Đóng một lớp phủ: thẻ trượt xuống, nền nhạt dần, rồi mới gỡ khỏi trang; after() chạy sau khi gỡ.
const OV_CLOSE_MS = 280;
function closeOv(ov, after){
  if(ov.classList.contains('closing')) return;
  ov.classList.add('closing');
  // đang trượt xuống: nuốt mọi cú bấm/phím để nút không bị bấm lần hai (lớp phủ vẫn che cảnh phía sau)
  ['click', 'keydown'].forEach(t => ov.addEventListener(t, e => e.stopPropagation(), true));
  if(document.activeElement && ov.contains(document.activeElement)) document.activeElement.blur();
  setTimeout(() => { ov.remove(); if(after) after(); }, OV_CLOSE_MS);
}
function modal(html, onclose, cls){
  SFX.page();
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = cls ? '<div class="modal '+cls+'"><button class="xbtn" id="mclose" aria-label="Đóng">'+ico('close',16)+'</button>'+html+'</div>'
    : '<div class="modal">'+html+'<div class="center" style="margin-top:12px"><button class="btn" id="mclose">Đóng</button></div></div>';
  ov.querySelector('#mclose').onclick = () => { closeOv(ov); if(onclose) onclose(); };
  G.appendChild(ov);
  return ov;
}
// styled replacement for the browser's native confirm() message box
function confirmModal(html, onYes, yesLabel, noLabel){
  SFX.page();
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = '<div class="modal" style="max-width:440px;text-align:center">'+html
    + '<div class="row" style="justify-content:center;gap:12px;margin-top:18px">'
    + '<button class="btn warn" id="myes">'+(yesLabel||'Đồng ý')+'</button>'
    + '<button class="btn" id="mno">'+(noLabel||'Huỷ')+'</button></div></div>';
  ov.querySelector('#myes').onclick = () => { closeOv(ov); onYes(); };
  ov.querySelector('#mno').onclick = () => closeOv(ov);
  G.appendChild(ov);
}

/* =====================  SCENES  ===================== */
function showMenu(){
  SFX.music(0);
  // Ca tự do chuyển sang tấm lịch: nó là "ngày 1 của tháng sau", xem showMap().
  // Thử thách pha nồng độ (startConc) mở sau ngày 2 — ngày học khái niệm mol.
  const inProgress = save.unlocked > 1; // đã qua ít nhất ngày 1 → có gì đó để "tiếp tục"
  const nextDay = Math.min(save.unlocked, DAYS.length);
  G.innerHTML = `<div class="scene center" style="padding:0">
    <div class="menu-wall"></div>
    <div style="position:absolute;top:150px;left:64px">${sym('sym-poster-periodic',126,160)}</div>
    <div style="position:absolute;top:150px;right:74px">${sym('sym-poster-safety',126,160)}</div>
    <div style="position:absolute;top:34px;left:210px">${sym('sym-clock',74,74)}</div>
    <div style="position:relative;z-index:5">
      <div class="menu-sign">
        <h1>${sym('sym-erlenmeyer',40,54,'vertical-align:-12px;--lc:#7fc4c9')} Trợ Lý Hóa Học Nhí</h1>
        <h2>Trợ lý phòng thí nghiệm của giáo sư Hoffmann</h2>
      </div>
      <div class="menu-btns">
        <button class="btn big" id="bstart">${inProgress ? ico('play')+' Ngày '+nextDay+' →' : ico('play')+' Bắt đầu'}</button>
        <button class="btn" id="brx">${ico('note')} Sổ tay</button>
        <button class="btn" id="bach">${ico('trophy')} Thành tựu</button>
        <button class="btn" id="bset">${ico('gear')} Cài đặt</button>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:120px;background:linear-gradient(#c89a63,#a97c4b);border-top:5px solid var(--ink)">
      ${sym('sym-benchtex',1270,60,'position:absolute;top:6px;left:0')}
    </div>
    <div style="position:absolute;bottom:96px;left:120px">${sym('sym-tuberack',190,120)}</div>
    <div style="position:absolute;bottom:98px;left:330px">${sym('sym-erlenmeyer',86,116,'--lc:#7fc4c9')}</div>
    <div style="position:absolute;bottom:98px;left:430px">${sym('sym-lamp',80,96,'--flame:1')}</div>
    <div style="position:absolute;bottom:96px;right:340px">${sym('sym-gasbottle',88,124,'--gasop:.6')}</div>
    <span class="mbub" style="left:352px;bottom:200px;width:14px;height:14px"></span>
    <span class="mbub" style="left:378px;bottom:190px;width:9px;height:9px;animation-delay:2.3s"></span>
    <span class="mbub" style="right:368px;bottom:210px;width:12px;height:12px;animation-delay:1.1s"></span>
    <span class="mbub" style="right:398px;bottom:195px;width:8px;height:8px;animation-delay:4.2s"></span>
    <span class="mbub" style="left:460px;bottom:200px;width:10px;height:10px;animation-delay:3.1s"></span>
    <div style="position:absolute;bottom:90px;right:110px" id="menuprof"></div>
    <div class="menu-bubble">Chào trợ lý nhỏ! Hôm nay tiệm mình có nhiều đơn lắm đó, vào ca thôi!</div>
  </div>`;
  G.querySelector('#menuprof').innerHTML = profSVG('happy').replace('viewBox','height="225" viewBox');
  G.querySelector('#bstart').onclick = () => go(showMap);
  G.querySelector('#brx').onclick = showRxBook;
  G.querySelector('#bach').onclick = showAch;
  G.querySelector('#bset').onclick = settingsModal;
}

function showAch(){
  const rows = Object.keys(ACH).map(id => {
    const got = save.ach.includes(id);
    return '<div class="sealrow'+(got?'':' off')+'"><div class="seal">'+ico(got?'star':'lock',16)+'</div><div><b>'+ACH[id].n+'</b><br><span style="font-size:13px">'+ACH[id].d+'</span></div></div>';
  }).join('');
  modal('<h2>'+ico('trophy',22)+' Thành tựu ('+save.ach.length+'/'+Object.keys(ACH).length+')</h2>'
    + '<div class="hgrid">'+rows+'</div>', null, 'hcard');
}

/* =====================  BÁO CÁO HỌC TẬP (cho thầy cô)  =====================
   Gom nhật ký save.hist thành bảng theo ngày: sao, số lượt, giao sai, lỗi an toàn, lỗi hay gặp.
   Học sinh tải bảng .csv hoặc gửi một MÃ (chữ thường, dán vào Zalo được); thầy cô mở game,
   dán mã vào "Xem mã của học sinh" là thấy đúng bảng đó — không cần máy chủ nào. */
const REPORT_TAG = 'TLHHN1-';
function reportData(){
  const days = DAYS.map((day, k) => {
    const hs = save.hist.filter(h => h.d === k + 1), m = {};
    hs.forEach(h => Object.keys(h.m || {}).forEach(c => m[c] = (m[c]||0) + h.m[c]));
    const sum = key => hs.reduce((a, h) => a + (h[key]||0), 0);
    return [save.stars[k+1]||0, save.starsHard[k+1]||0, hs.length, sum('w'), sum('sf'), m, sum('sv')];
  });
  return {v:1, n:save.student || '', at:Date.now(), rx:save.rx.length, d:days};
}
const encodeReport = d => REPORT_TAG + btoa(unescape(encodeURIComponent(JSON.stringify(d))));
function decodeReport(code){
  const s = (code || '').replace(/\s+/g, '');
  if(!s.startsWith(REPORT_TAG)) return null;
  try { const d = JSON.parse(decodeURIComponent(escape(atob(s.slice(REPORT_TAG.length))))); return d && d.v === 1 && Array.isArray(d.d) ? d : null; }
  catch(e){ return null; }
}
const topMistakes = (m, k) => Object.keys(m).filter(c => MISTAKES[c]).sort((a, b) => m[b] - m[a]).slice(0, k);
function reportCSV(d){
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  const rows = [['Ngày','Bài','Sao','Sao chế độ khó','Số lượt chơi','Đơn đã giao','Giao sai / trả lời sai','Lỗi an toàn','Lỗi hay gặp']];
  d.d.forEach((r, k) => { if(!r[2] && !r[0] && !r[1]) return;
    rows.push([k+1, DAYS[k].t, r[0], r[1], r[2], r[6]||0, r[3], r[4], topMistakes(r[5], 3).map(c => MISTAKES[c] + ' (' + r[5][c] + ')').join('; ')]); });
  return '﻿' + 'Học sinh: ' + q(d.n || '(chưa ghi tên)') + '\n' + rows.map(r => r.map(q).join(',')).join('\n');
}
function showReport(d){
  const own = !d;          // không truyền d = báo cáo của chính máy này
  d = d || reportData();
  const played = d.d.map((r, k) => ({r, k})).filter(x => x.r[2] || x.r[0] || x.r[1]);
  const all = {};
  d.d.forEach(r => Object.keys(r[5]).forEach(c => all[c] = (all[c]||0) + r[5][c]));
  const served = d.d.reduce((a, r) => a + (r[6]||0), 0), wrong = d.d.reduce((a, r) => a + r[3], 0);
  const safety = d.d.reduce((a, r) => a + r[4], 0);
  const passed = d.d.filter(r => r[0] >= 1 || r[1] >= 1).length;
  const stars = d.d.reduce((a, r) => a + r[0], 0), hstars = d.d.reduce((a, r) => a + r[1], 0);
  const tile = (v, l) => '<div class="rtile"><b>' + v + '</b><span>' + l + '</span></div>';
  const rows = played.map(({r, k}) => '<tr><td>' + (k+1) + '</td><td class="rt">' + DAYS[k].t + (DAYS[k].mg ? ' ' + ico('dice',12) : '') + '</td>'
    + '<td class="rs">' + starStr(r[0]) + '</td><td class="rs hard">' + (r[1] ? starStr(r[1]) : '—') + '</td><td>' + r[2] + '</td>'
    + '<td>' + r[3] + '</td><td>' + (r[4] || '—') + '</td><td class="rm">' + topMistakes(r[5], 2).map(c => MISTAKES[c]).join('; ') + '</td></tr>').join('');
  const top = topMistakes(all, 5);
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = '<div class="modal report">'
    + '<h2>' + ico('note',22) + ' Báo cáo học tập' + (own ? '' : ' <small>(mã của học sinh)</small>') + '</h2>'
    + (own ? '<div class="row" style="gap:8px;margin:2px 0 10px"><b>Học sinh / lớp:</b><input id="rname" class="rname" maxlength="40" placeholder="vd. Nguyễn An — 8A2" value="' + (d.n||'').replace(/"/g,'&quot;') + '"></div>'
           : '<p style="margin:2px 0 10px"><b>Học sinh / lớp:</b> ' + (d.n ? d.n.replace(/</g,'&lt;') : '<i>(chưa ghi tên)</i>') + ' · mã tạo lúc ' + new Date(d.at).toLocaleString('vi-VN') + '</p>')
    + '<div class="rtiles">' + tile(passed + '/' + DAYS.length, 'ngày đã qua') + tile(stars + ' ★', 'sao' + (hstars ? ' · khó ' + hstars + ' ★' : ''))
    + tile(d.rx + '/' + REACTIONS.length, 'phản ứng đã tự làm') + tile(served + wrong ? Math.round(served / (served + wrong) * 100) + '%' : '—', 'giao đúng ngay')
    + tile(safety, 'lỗi an toàn') + '</div>'
    + (top.length ? '<div class="rtop"><b>Lỗi hay gặp nhất:</b> ' + top.map(c => MISTAKES[c] + ' <i>×' + all[c] + '</i>').join(' · ') + '</div>' : '')
    + (played.length ? '<table class="rtable"><tr><th>Ngày</th><th>Bài</th><th>Sao</th><th>Khó</th><th>Lượt</th><th>Sai</th><th>An toàn</th><th>Lỗi hay gặp</th></tr>' + rows + '</table>'
                     : '<p class="center" style="opacity:.7">Chưa chơi ngày nào — chơi vài ca rồi quay lại xem nhé.</p>')
    + '<div class="row" style="justify-content:center;gap:8px;margin-top:12px;flex-wrap:wrap">'
    + '<button class="btn" id="rcsv">' + ico('note') + ' Tải bảng điểm (.csv)</button>'
    + (own ? '<button class="btn" id="rcode">' + ico('star') + ' Mã gửi thầy cô</button><button class="btn" id="rread">' + ico('book') + ' Xem mã của học sinh</button>' : '')
    + '<button class="btn" id="rclose">Đóng</button></div><div id="rbox"></div></div>';
  G.appendChild(ov);
  SFX.page();
  const box = ov.querySelector('#rbox');
  const name = ov.querySelector('#rname');
  if(name) name.oninput = () => { save.student = name.value.trim(); persist(); };
  ov.querySelector('#rclose').onclick = () => closeOv(ov);
  ov.querySelector('#rcsv').onclick = () => {
    if(own) d = reportData();
    const csv = reportCSV(d);
    try {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
      a.download = 'bao-cao-hoa-hoc' + (d.n ? '-' + d.n.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').replace(/[^\w]+/g,'-') : '') + '.csv';
      document.body.appendChild(a); a.click(); a.remove();
      toast('Đã tải bảng điểm — mở bằng Excel hoặc Google Sheets.');
    } catch(e){   // trang nhúng chặn tải file thì cho chép tay
      box.innerHTML = '<p class="rhint">Trình duyệt chặn tải file — chép bảng dưới đây dán vào Excel:</p><textarea class="rcode" readonly>' + csv.replace(/</g,'&lt;') + '</textarea>';
    }
  };
  if(!own) return;
  ov.querySelector('#rcode').onclick = () => {
    const code = encodeReport(reportData());
    box.innerHTML = '<p class="rhint">Gửi mã này cho thầy cô (Zalo, Messenger…). Thầy cô mở game → <b>Báo cáo học tập</b> → <b>Xem mã của học sinh</b> → dán vào.</p>'
      + '<textarea class="rcode" readonly>' + code + '</textarea><div class="center"><button class="btn" id="rcopy">Sao chép mã</button></div>';
    const ta = box.querySelector('textarea'); ta.focus(); ta.select();
    box.querySelector('#rcopy').onclick = () => {
      ta.select();
      const done = () => toast('Đã sao chép mã báo cáo!');
      if(navigator.clipboard) navigator.clipboard.writeText(code).then(done, () => { document.execCommand('copy'); done(); });
      else { document.execCommand('copy'); done(); }
    };
  };
  ov.querySelector('#rread').onclick = () => {
    box.innerHTML = '<p class="rhint">Dán mã học sinh gửi (bắt đầu bằng <b>' + REPORT_TAG + '</b>):</p><textarea class="rcode" id="rin"></textarea>'
      + '<div class="center"><button class="btn big" id="rgo">Xem báo cáo</button></div><div class="dosemsg" id="rerr"></div>';
    const inp = box.querySelector('#rin'); inp.focus();
    box.querySelector('#rgo').onclick = () => {
      const dd = decodeReport(inp.value);
      if(!dd){ box.querySelector('#rerr').textContent = 'Mã không đúng — kiểm tra đã chép đủ cả đoạn chưa.'; return; }
      showReport(dd);
    };
  };
}

const themeOf = i => 1 + Math.min(4, Math.floor(i/7));   // nhạc nền theo chương (SFX.music)
function showMap(){
  SFX.music(0);
  // hand-drawn red pen loop, revealed by stroke-dashoffset when an unplayed day is picked
  const circ = '<svg class="dnc" viewBox="0 0 48 40"><path d="M9,21 C6,9 20,4 30,6 C42,8 46,15 42,25 C37,36 15,39 8,31 C3,25 7,15 15,11" pathLength="100"/></svg>';
  let cells = '';
  for(let d=0; d < Math.ceil(DAYS.length/7)*7; d++){
    if(d === DAYS.length){   // hết 31 ngày thì sang tháng mới: ngày 1 là ca tự do, chơi mãi
      const fo = DEBUG || (save.stars[DAYS.length]||0) >= 1;
      cells += `<div class="day-card freecard${fo?'':' locked'}" data-free="1">
        <div class="dt">${LICH.tuDo}</div>
        <div class="dn"><span class="dnw">1</span>${fo?'':' '+ico('lock',14)}</div>
        <div class="st">${fo?ico('dice',18):''}</div></div>`;
      continue;
    }
    if(d > DAYS.length){ cells += '<div class="day-card blank"></div>'; continue; } // trailing blanks, like a real month page
    const day = DAYS[d], num = d+1;
    const open = DEBUG || num <= save.unlocked;
    const st = save.stars[num] || 0, sth = save.starsHard[num] || 0;
    cells += `<div class="day-card${open?'':' locked'}${d%7===6?' sun':''}" data-d="${d}">
      <div class="dt">${day.t}</div>
      <div class="dn"><span class="dnw">${num}${open && !st && !sth ? circ : ''}</span>${open?'':' '+ico('lock',14)}</div>
      <div class="st">${open||st?dayStars(st, sth):''}</div></div>`;
  }
  const wd = ['T2','T3','T4','T5','T6','T7','CN'].map((x,k)=>'<div'+(k===6?' class="sun"':'')+'>'+x+'</div>').join('');
  G.innerHTML = `<div class="scene mapscene">
    <div class="row" style="justify-content:flex-start">
      <button class="btn icobtn" id="bback" aria-label="Về menu" title="Về menu">${ico('home',26)}</button>
      <button class="btn icobtn" id="bshop" aria-label="Cửa hàng" title="Cửa hàng">${ico('shop',26)}</button>
    </div>
    <div class="calsheet">
      <div class="calrings">${'<span></span>'.repeat(14)}</div>
      <div class="calhead">THÁNG ${LICH.thang}</div>
      <div class="calwd">${wd}</div>
      <div class="map-grid">${cells}</div>
    </div>
    ${DEBUG?'<div class="devbadge">DEV: mọi ngày đều mở</div>':''}</div>`;
  G.querySelector('#bback').onclick = () => go(showMenu);
  G.querySelector('#bshop').onclick = showShop;
  const fc = G.querySelector('.freecard.locked');
  if(fc) fc.onclick = () => toast(ico('lock',16)+' Làm hết 31 ngày đã, rồi tháng sau tha hồ nghịch!');
  G.querySelectorAll('.day-card').forEach(c => {
    if(c.classList.contains('locked') || c.classList.contains('blank')) return;
    if(c.dataset.free){ c.onclick = () => go(startFree); return; }
    c.onclick = () => {
      if(c.classList.contains('circled')) return; // nav already scheduled
      if(c.querySelector('.dnc')){ c.classList.add('circled'); SFX.page(); setTimeout(()=>go(()=>showIntro(+c.dataset.d)), 520); }
      else go(()=>showIntro(+c.dataset.d));
    };
  });
}

function showShop(){
  save.items = save.items || { tools: false, notes: false, labbook: false, nobalance: false };

  const renderShop = () => {
    const hasTools = save.items.tools;
    const hasNotes = save.items.notes;
    const hasBook = save.items.labbook, bookOn = labbookOn();
    const hasNobal = save.items.nobalance;

    return `
      <button class="xbtn" id="mclose" aria-label="Đóng">${ico('close',16)}</button>
      <h2 style="font-family:var(--fh)">${ico('coinred', 22)} Cửa hàng Hoffmann</h2>
      <div style="text-align:left; font-size:15px; margin-bottom:12px; line-height:1.6; font-family:var(--fh)">
        <p style="padding:0 4px;margin:0 0 10px">Trò đang có: <b>${achCoins()}</b> ${ico('coinred',15)}</p>
        <div class="hgrid">

        <div class="shop-item" style="border: 1.2px solid var(--ink); border-radius: 4.8px; padding: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background: #fffdf5">
          <div style="flex: 1; padding-right: 12px">
            <b style="font-size: 16px; color: var(--accent)">${ico('flask', 16)} Thìa & Pipet Ma Thuật</b>
            <div style="font-size: 13px; color: #555; margin-top: 4px">Cho phép bạn chủ động tăng/giảm lượng đong hóa chất mỗi lần đổ vào cốc (0,05 mol - 1,0 mol).</div>
          </div>
          <div>
            ${hasTools
              ? `<span style="color: var(--green); font-weight: bold; font-size: 15px">Đã sở hữu</span>`
              : `<button class="btn" id="buyTools" style="min-width: 100px; font-family:var(--fh)">5 ${ico('coinred', 14)} Mua</button>`
            }
          </div>
        </div>

        <div class="shop-item" style="border: 1.2px solid var(--ink); border-radius: 4.8px; padding: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background: #fffdf5">
          <div style="flex: 1; padding-right: 12px">
            <b style="font-size: 16px; color: var(--accent)">${ico('note', 16)} Giấy Nhớ Hóa Chất</b>
            <div style="font-size: 13px; color: #555; margin-top: 4px">Tự động hiện danh sách chi tiết các chất và số mol tương ứng hiện có trong cốc thí nghiệm.</div>
          </div>
          <div>
            ${hasNotes
              ? `<span style="color: var(--green); font-weight: bold; font-size: 15px">Đã sở hữu</span>`
              : `<button class="btn" id="buyNotes" style="min-width: 100px; font-family:var(--fh)">3 ${ico('coinred', 14)} Mua</button>`
            }
          </div>
        </div>

        <div class="shop-item" style="border: 1.2px solid var(--ink); border-radius: 4.8px; padding: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background: #fffdf5">
          <div style="flex: 1; padding-right: 12px">
            <b style="font-size: 16px; color: var(--accent)">${ico('note', 16)} Giấy Cân Bằng Sẵn</b>
            <div style="font-size: 13px; color: #555; margin-top: 4px">Giáo sư điền sẵn hệ số cho mọi phương trình trên tờ giấy cân bằng. Bật / tắt bằng công tắc "Giấy cân bằng sẵn" trong Cài đặt.</div>
          </div>
          <div>
            ${hasNobal
              ? `<span style="color: var(--green); font-weight: bold; font-size: 15px">Đã sở hữu</span>`
              : `<button class="btn" id="buyNobal" style="min-width: 100px; font-family:var(--fh)">5 ${ico('coinred', 14)} Mua</button>`
            }
          </div>
        </div>

        <div class="shop-item" style="border: 1.2px solid var(--ink); border-radius: 4.8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; background: #fffdf5">
          <div style="flex: 1; padding-right: 12px">
            <b style="font-size: 16px; color: var(--accent)">${ico('book', 16)} Sổ Ghi Chép Thí Nghiệm</b>
            <div style="font-size: 13px; color: #555; margin-top: 4px">Ở màn xác định chất, sổ tự ghi hiện tượng của mỗi lần nhỏ thử, kèm mẹo nhận biết. Không có sổ thì trò phải tự nhớ — hoặc tự ghi ra giấy!</div>
          </div>
          <div>
            ${hasBook
              ? `<div style="display: flex; flex-direction: column; align-items: center; gap: 5px">
                   <span style="color: var(--green); font-weight: bold; font-size: 15px">Đã sở hữu</span>
                   <div class="toggle${bookOn ? ' on' : ''}" id="tglBook" role="switch" aria-checked="${bookOn}" title="Bật / tắt sổ ghi chép"></div>
                 </div>`
              : `<button class="btn" id="buyBook" style="min-width: 100px; font-family:var(--fh)">3 ${ico('coinred', 14)} Mua</button>`
            }
          </div>
        </div>
        </div>
      </div>
    `;
  };

  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal hcard">${renderShop()}</div>`;
  G.appendChild(ov);
  
  const setupHandlers = () => {
    const btnTools = ov.querySelector('#buyTools');
    if(btnTools){
      btnTools.onclick = () => {
        if(achCoins() >= 5){
          save.spent = (save.spent||0) + 5;
          save.items.tools = true;
          persist();
          SFX.page();
          toast('Đã sở hữu Thìa & Pipet Ma Thuật!');
          refresh();
        } else {
          toast('Chưa đủ đồng đỏ — mở thêm thành tựu nhé!');
        }
      };
    }
    
    const btnNotes = ov.querySelector('#buyNotes');
    if(btnNotes){
      btnNotes.onclick = () => {
        if(achCoins() >= 3){
          save.spent = (save.spent||0) + 3;
          save.items.notes = true;
          persist();
          SFX.page();
          toast('Đã sở hữu Giấy Nhớ Hóa Chất!');
          refresh();
        } else {
          toast('Chưa đủ đồng đỏ — mở thêm thành tựu nhé!');
        }
      };
    }

    const btnNobal = ov.querySelector('#buyNobal');
    if(btnNobal){
      btnNobal.onclick = () => {
        if(achCoins() >= 5){
          save.spent = (save.spent||0) + 5;
          save.items.nobalance = true;
          persist();
          SFX.page();
          toast('Đã sở hữu Giấy Cân Bằng Sẵn!');
          refresh();
        } else {
          toast('Chưa đủ đồng đỏ — mở thêm thành tựu nhé!');
        }
      };
    }

    const btnBook = ov.querySelector('#buyBook');
    if(btnBook){
      btnBook.onclick = () => {
        if(achCoins() >= 3){
          save.spent = (save.spent||0) + 3;
          save.items.labbook = true;
          persist();
          SFX.page();
          toast('Đã sở hữu Sổ Ghi Chép Thí Nghiệm!');
          refresh();
        } else {
          toast('Chưa đủ đồng đỏ — mở thêm thành tựu nhé!');
        }
      };
    }
    const tglBook = ov.querySelector('#tglBook');
    if(tglBook){
      tglBook.onclick = () => {
        save.settings.labbook = !labbookOn(); persist();
        tglBook.classList.toggle('on', labbookOn());
        tglBook.setAttribute('aria-checked', labbookOn());
        SFX.clink();
      };
    }

    ov.querySelector('#mclose').onclick = () => {
      closeOv(ov, showMap);   // vẽ lại bản đồ (số đồng) sau khi thẻ trượt xuống xong
    };
  };
  
  const refresh = () => {
    const modalDiv = ov.querySelector('.modal');
    modalDiv.innerHTML = renderShop();
    setupHandlers();
  };
  
  setupHandlers();
}

// chế độ khám phá của minigame hoá trị (che-do.js): mở khi ngày đó đạt 3 sao — nút ở màn giới thiệu và màn kết quả
const exploreBtn = (day, i, iconOnly) => day.mg === 'valence' && (save.stars[i+1] || 0) >= 3
  ? (iconOnly ? resBtn('bexplore', 'flask', 'Khám phá') : `<button class="btn" id="bexplore">${ico('flask')} Khám phá</button>`) : '';
function bindExplore(i){ const b = G.querySelector('#bexplore'); if(b) b.onclick = () => go(() => startVlExplore(i)); }

/* =====================  BÀI GIẢNG KIỂU VISUAL NOVEL  =====================
   Lần đầu trò mở một ngày, giáo sư đứng cạnh bảng đen giảng lý thuyết (lời ở js/bai-giang.js) rồi mới
   tới màn giới thiệu ngày. Bấm / phím cách / Enter / → sang câu kế (đang gõ dở thì hiện hết câu), ← xem lại
   câu trước. Ngày đã chơi trước khi có bài giảng (có sao hoặc có trong nhật ký) thì coi như đã nghe.
   Có onEnd (xem lại từ thẻ Tạm nghỉ): bài giảng phủ lên trên ca đang dừng, xong thì gỡ đi rồi gọi onEnd. */
const lessonSeen = num => (save.lessons || []).includes(num) || save.hist.some(h => h.d === num)
  || (save.stars[num] || 0) > 0 || (save.starsHard[num] || 0) > 0;
function parseLesson(s){
  let e = 'neutral';
  if(s.startsWith(':)')){ e = 'happy'; s = s.slice(2); }
  else if(s.startsWith(':(')){ e = 'annoy'; s = s.slice(2); }
  const [t, b] = s.split('||');
  return {e, t: t.trim().normalize('NFC').replace(/\*([^*]+)\*/g, '<b>$1</b>'), b: b ? b.trim() : ''};
}
function showLesson(i, onEnd){
  SFX.music(themeOf(i));
  const lines = BAI_GIANG[i].map(parseLesson);
  const html = `<div class="scene vnscene${onEnd ? ' vnover' : ''}">
    <div class="vnboard"><div class="vnbtitle">Ngày ${i+1} · ${DAYS[i].t}</div><div class="vnbody"></div></div>
    <div class="vnbox"><div class="vnname"><span>Giáo sư Hoffmann</span></div><p class="vntext"></p>
      <div class="vndots">${lines.map(() => '<span></span>').join('')}</div></div>
    <div class="vnprof">${profSVG('neutral')}</div>
    <button class="btn vnskip">${onEnd ? 'Đóng ' + ico('close') : 'Bỏ qua ' + ico('next')}</button></div>`;
  if(onEnd){
    // nút vừa bấm ở thẻ Tạm nghỉ vẫn giữ focus: phím cách lúc này sẽ bấm lại nó thay vì sang câu
    if(document.activeElement) document.activeElement.blur();
    G.insertAdjacentHTML('beforeend', html);
  } else G.innerHTML = html;
  const root = onEnd ? G.lastElementChild : G.querySelector('.vnscene'), box = root.querySelector('.vnbox'), text = root.querySelector('.vntext'),
        body = root.querySelector('.vnbody'), prof = root.querySelector('.vnprof'), dots = root.querySelectorAll('.vndots span');
  let k = -1, chars = [], shown = 0, timer = 0, board = '', ended = false;
  // bảng giữ dòng gần nhất (tính cả câu đang nói) có ghi bảng; đổi thì viết lại bằng phấn
  const drawBoard = () => {
    let b = '';
    for(let j = k; j >= 0 && !b; j--) b = lines[j].b;
    if(b === board) return;
    board = b;
    body.style.fontSize = '';
    body.innerHTML = b.split(';').map(x => '<div>' + handSub(x.trim()) + '</div>').join('');
    for(let fs = 34; fs > 18 && body.scrollWidth > body.clientWidth; fs -= 2) body.style.fontSize = fs + 'px';
    body.classList.remove('write'); void body.offsetWidth; body.classList.add('write');
    if(b) SFX.grain();
  };
  const finish = () => {
    clearInterval(timer); timer = 0;
    chars.forEach(c => c.classList.remove('h'));
    shown = chars.length;
    box.classList.add('done');
  };
  const tick = () => {
    if(!root.isConnected){ clearInterval(timer); return; }
    if(shown >= chars.length) return finish();
    const c = chars[shown++];
    c.classList.remove('h');
    if(shown % 3 === 0 && c.textContent.trim()) SFX.talk();
  };
  const say = n => {
    k = n;
    const L = lines[k];
    prof.firstElementChild.dataset.exp = L.e;
    prof.classList.remove('talk'); void prof.offsetWidth; prof.classList.add('talk');
    drawBoard();
    dots.forEach((d, j) => d.classList.toggle('on', j <= k));
    // tách từng chữ thành <span> ẩn rồi hiện dần: chữ đã dàn trang sẵn nên không nhảy dòng khi đang gõ
    text.innerHTML = L.t;
    chars = [];
    const split = node => [...node.childNodes].forEach(c => {
      if(c.nodeType !== 3) return split(c);
      const frag = document.createDocumentFragment();
      for(const ch of c.textContent){
        const s = document.createElement('span');
        s.className = 'h'; s.textContent = ch;
        frag.appendChild(s); chars.push(s);
      }
      c.replaceWith(frag);
    });
    split(text);
    shown = 0;
    box.classList.remove('done');
    clearInterval(timer); timer = setInterval(tick, 28);
  };
  const end = () => {
    if(ended) return;
    ended = true;
    clearInterval(timer);
    removeEventListener('keydown', onKey);
    if(onEnd){ root.classList.add('closing'); setTimeout(() => { root.remove(); onEnd(); }, OV_CLOSE_MS); return; }
    if(!(save.lessons || []).includes(i+1)){ save.lessons = [...(save.lessons || []), i+1]; persist(); }
    go(() => showIntro(i));
  };
  const next = () => { if(ended) return; if(timer) finish(); else if(k < lines.length - 1) say(k + 1); else end(); };
  const back = () => { if(!ended && k > 0){ say(k - 1); finish(); } };
  const onKey = e => {
    if(!root.isConnected) return removeEventListener('keydown', onKey);
    if(e.target.closest && e.target.closest('button')) return;   // phím cách trên nút "Bỏ qua" là bấm nút đó
    if([' ', 'Enter', 'ArrowRight'].includes(e.key)){ e.preventDefault(); next(); }
    else if(e.key === 'ArrowLeft'){ e.preventDefault(); back(); }
  };
  addEventListener('keydown', onKey);
  root.onclick = e => { if(!e.target.closest('button')) next(); };
  root.querySelector('.vnskip').onclick = end;
  setTimeout(() => { if(root.isConnected && k < 0) say(0); }, 550);   // đợi thẻ thoại trượt lên xong
}

function showIntro(i){
  if(BAI_GIANG[i] && !lessonSeen(i+1)) return showLesson(i);
  SFX.music(themeOf(i));
  const day = DAYS[i];
  const conds = starConds(day).map((c,k)=>'<div>'+ico('star',15).repeat(k+1)+' '+c+'</div>').join('');
  const tools = day.mg ? '' : (day.tools.length
    ? '<p style="margin:6px 0"><b>Dụng cụ:</b> ' + day.tools.map(t=>sym(TOOLSYM[t],20,22,'vertical-align:-5px')+' '+TOOLNAMES[t]).join(' · ') + '</p>' : '')
    + '<p style="margin:6px 0"><b>An toàn:</b> ' + sym('sym-goggles',26,18,'vertical-align:-4px') + ' đeo kính & găng trước khi lấy hoá chất'
    + ([...dayHave(day)].some(f => TOXIC.includes(f)) ? ' · <b style="color:#a8331f">có khí độc — nhớ bật tủ hút</b>' : '') + '</p>';
  const shelf = day.mg ? '' : '<p style="margin:6px 0"><b>Trên kệ:</b> ' + day.chems.map(sub).join(', ') + '</p>';
  // minigame có chế độ khó riêng (day.hard, vd. bảng tuần hoàn) thì giáo sư dặn lời khác khi công tắc khó đang bật
  const story = () => '“' + (day.hard && hardOn() ? day.hard.story : day.story) + '”';
  G.innerHTML = `<div class="scene" style="padding-top:24px">
    <h2 class="center">Ngày ${i+1}: ${day.t} ${day.mg?ico('dice',20):''}</h2>
    <div class="row" style="align-items:flex-start;justify-content:center;gap:0;margin-top:6px">
      <div id="introprof" style="flex:none;margin-top:26px"></div>
      <div class="paper" style="max-width:720px;text-align:left">
        <b style="font-size:18px;font-family:var(--fh)">Giáo sư Hoffmann:</b>
        <p class="hand" id="introstory" style="font-size:16px;line-height:1.5;margin:6px 0">${story()}</p>
        ${shelf}${tools}
        <div style="border-top:1.2px dashed var(--ink);margin-top:8px;padding-top:8px">
          <b>Điều kiện sao:</b><div class="condlist">${conds}</div></div>
        ${((day.mg && !day.hard) || !hardUnlocked()) ? '' : `<div class="settingrow hardrow"><div>
          <b style="font-family:var(--fh);font-size:16px">${ico('flask',15)} Chế độ khó${save.starsHard[i+1] ? ' <span style="color:#d9634f">'+starStr(save.starsHard[i+1])+'</span>' : ''}</b>
          <div style="font-size:13px;color:#6b5d4a;margin-top:2px">${day.hard ? day.hard.note : 'Đơn hàng ghi theo <b>gam</b> và <b>lít khí</b>; trò tự tính rồi cân, đong từng chất. Sai số cho phép 5%. Thêm 50% thời gian.'}</div>
        </div><div class="toggle${hardOn()?' on':''}" id="tglHardIntro" role="switch" aria-checked="${hardOn()}"></div></div>`}
      </div>
    </div>
    <div class="row" style="justify-content:center;margin-top:14px">
      <button class="btn big" id="bgo">${ico(day.mg?'dice':'flask')} ${day.mg?'Chơi ngay':'Mở tiệm'}</button>
      ${(!day.mg && dayEqs(day).length) ? `<button class="btn" id="bnote2">${ico('note')} Giấy cân bằng</button>` : ''}
      ${exploreBtn(day, i)}
      <button class="btn" id="bmap">${ico('back')} Bản đồ</button>
    </div></div>`;
  G.querySelector('#introprof').innerHTML = profSVG('happy').replace('viewBox','height="270" viewBox');
  G.querySelector('#bgo').onclick = () => {
    if(day.mg) return go(()=>startMinigame(i));
    return go(()=>startLab(i));
  };
  const bnote2 = G.querySelector('#bnote2');
  if(bnote2) bnote2.onclick = () => balanceSheet(i);
  bindExplore(i);
  G.querySelector('#bmap').onclick = () => go(showMap);
  const th = G.querySelector('#tglHardIntro');
  if(th) th.onclick = () => { save.settings.hard = !hardOn(); persist(); th.classList.toggle('on', hardOn()); th.setAttribute('aria-checked', hardOn()); SFX.clink();
    G.querySelector('#introstory').textContent = story(); };
}

/* =====================  CÂN BẰNG PHƯƠNG TRÌNH  ===================== */
// Các phản ứng người chơi sẽ thực hiện trong ngày: chất tham gia đều có trên kệ và
// tạo ra ít nhất một sản phẩm mà khách đặt. Tính một lần rồi nhớ vào day._eqs.
function dayEqs(day){
  if(!day || day.mg || !day.orders) return [];
  if(day._eqs) return day._eqs;
  const shelf = new Set(day.chems || []);
  const ordered = new Set(day.orders.map(o => o.chem));
  const eqs = [];
  REACTIONS.forEach((r, idx) => {
    const rgOk = Object.keys(r.rg).every(f => shelf.has(f));
    const makesOrder = Object.keys(r.pr).some(f => ordered.has(f));
    if(rgOk && makesOrder) eqs.push(idx);
  });
  day._eqs = eqs.slice(0, 6); // giữ tờ giấy gọn, tối đa 6 phương trình
  return day._eqs;
}

// Chữ viết tay trên giấy cân bằng: font viết tay không có ký tự ₂₃… và →, nên chỉ số dưới
// viết bằng <sub> và mũi tên vẽ bằng SVG (điều kiện như t° ghi phía trên mũi tên).
const handSub = s => s.replace(/[₀-₉]+/g, d => '<sub>'+[...d].map(c => SUBS.indexOf(c)).join('')+'</sub>');
const handArrow = r => '<span class="harr"><i>'+handSub(rxOver(r))+'</i>'
  + '<svg viewBox="0 0 64 14"><path d="M3 7.5 Q20 6 58 7 M50 2 L59 7 L50 12"/></svg></span>';
// Các phương trình đã cân bằng, lưới 3 cột (vế trái | mũi tên | vế phải) để mũi tên thẳng hàng.
function handEqRows(eqs){
  return '<div class="hrows">' + eqs.map(idx => {
    const r = REACTIONS[idx], s = eqStr(r), a = s.indexOf(' —'), b = s.indexOf('→ ', a);
    return '<span>'+handSub(s.slice(0, a))+'</span>' + handArrow(r) + '<span>'+handSub(s.slice(b+2))+'</span>';
  }).join('') + '</div>';
}

// Một vế phương trình với ô nhập hệ số cho TỪNG chất (kể cả hệ số 1).
// n: số ô chất của vế này (bằng nhau ở mọi dòng để dấu + và mũi tên thẳng cột);
// lead: ô trống dồn lên đầu (vế trái, sát mũi tên) hay xuống cuối (vế phải).
function eqEditableTerms(obj, mark, eid, n, lead){
  const terms = Object.keys(obj).map(f => {
    let m = '';
    if(mark){ if(CHEMS[f].s==='k') m='↑'; else if(isPrecip(f)) m='↓'; }
    return '<span class="bterm"><input class="bcoef" type="number" min="1" inputmode="numeric"'
      + ' data-eid="'+eid+'" data-want="'+obj[f]+'" aria-label="hệ số của '+f+'">'
      + '<span>' + handSub(sub(f)) + m + '</span></span>';   // bọc riêng: trong flex, <sub> rời ra thành ô riêng
  });
  const pad = new Array(n - terms.length).fill('');
  const slots = lead ? pad.concat(terms) : terms.concat(pad);
  return slots.map((t, k) => (k ? '<span class="bplus">'+(t && slots[k-1] ? '+' : '')+'</span>' : '')
    + (t || '<span class="bterm"></span>')).join('');
}
function eqEditableRow(idx, eid, nl, np){
  const r = REACTIONS[idx];
  return '<div class="beq" data-eid="'+eid+'">'
    + eqEditableTerms(r.rg, false, eid, nl, true)
    + handArrow(r)
    + eqEditableTerms(r.pr, true, eid, np, false)
    + '<span class="bmark" data-msg="'+eid+'"></span>'   // ✔ hoặc lời nhắc, ngay cuối dòng
    + '</div>';
}
// Cho mỗi cột (chất, dấu +, mũi tên) cùng bề rộng ở mọi dòng.
function alignEqCols(){
  const rows = [...G.querySelectorAll('.beq[data-eid]')];
  if(!rows.length) return;
  const cols = rows[0].children.length - 1;   // trừ ô dấu ✔ cuối dòng
  for(let j = 0; j < cols; j++){
    const cells = rows.map(r => r.children[j]);
    cells.forEach(c => c.style.width = '');
    const w = Math.max(...cells.map(c => c.offsetWidth));
    cells.forEach(c => c.style.width = w + 'px');
  }
}

// Thẻ hướng dẫn cân bằng, ví dụ Fe(OH)₃ + HCl → FeCl₃ + H₂O
function balanceTutorial(){
  const T = [   // a: số nguyên tử mỗi nguyên tố trong MỘT phân tử
    {f:'Fe(OH)<sub>3</sub>', a:{Fe:1, O:3, H:3}},
    {f:'HCl',                a:{H:1, Cl:1}},
    {f:'FeCl<sub>3</sub>',   a:{Fe:1, Cl:3}},
    {f:'H<sub>2</sub>O',     a:{H:2, O:1}}
  ], SIDE = [0,0,1,1], EL = ['Fe','Cl','O','H'];
  // c: hệ số sau bước; tc: chất vừa đổi hệ số; ec: ô đếm vừa đổi (nguyên tố + vế 0/1)
  const ST = [
    {c:[1,1,1,1], tc:-1, ec:[],          t:'<b>Đếm</b> số nguyên tử mỗi nguyên tố ở hai vế. Cl, O và H đang lệch.'},
    {c:[1,3,1,1], tc:1,  ec:['Cl0','H0'], t:'<b>Cl</b>: trái 1, phải 3 → đặt <b>3</b> trước HCl. Cl đã bằng nhau; H bên trái tăng lên 6.'},
    {c:[1,3,1,3], tc:3,  ec:['H1','O1'],  t:'<b>H</b>: trái 6, phải 2 → đặt <b>3</b> trước H<sub>2</sub>O. H bằng 6; O bên phải cũng lên 3.'},
    {c:[1,3,1,3], tc:-1, ec:[], done:true, t:'<b>Kiểm tra</b>: mọi nguyên tố đều bằng nhau ở hai vế. Xong!'}
  ];
  const term = (k, j) => {
    const c = ST[k].c[j], p = k ? ST[k-1].c[j] : c;
    let chips = '';
    for(let n = 0; n < c; n++) chips += '<span class="tchip'+(n >= p ? ' new' : '')+'" style="--d:'+((n-p)*.12+.3).toFixed(2)+'s">'+T[j].f+'</span>';
    return '<span class="tterm"><span class="tf"><b class="tcoef'+(c === 1 ? ' one' : '')+(ST[k].tc === j ? ' chg' : '')+'">'+c+'</b><span>'+T[j].f+'</span></span>'
      + '<span class="tchips">'+chips+'</span></span>';
  };
  const cnt = (k, e, s) => {   // "hệ số×số nguyên tử + … = tổng" của một nguyên tố ở một vế
    const parts = []; let n = 0;
    T.forEach((t, j) => { if(SIDE[j] !== s || !t.a[e]) return; const c = ST[k].c[j]; parts.push(c+'×'+t.a[e]); n += c*t.a[e]; });
    return {txt: parts.join(' + ')+' = <b>'+n+'</b>', n};
  };
  const render = k => {
    const s = ST[k], op = x => '<span class="top">'+x+'</span>';
    const rows = EL.map((e, r) => {
      const L = cnt(k,e,0), R = cnt(k,e,1), ok = L.n === R.n;
      const was = k ? cnt(k-1,e,0).n === cnt(k-1,e,1).n : ok;
      return '<tr class="'+(s.done ? 'okrow' : '')+(k === 0 ? ' cnt' : '')+'" style="--d:'+(r*.15).toFixed(2)+'s"><td><b>'+e+'</b></td>'
        + '<td class="'+(s.ec.includes(e+'0') ? 'chg' : '')+'">'+L.txt+'</td>'
        + '<td class="'+(s.ec.includes(e+'1') ? 'chg' : '')+'">'+R.txt+'</td>'
        + '<td class="tmark '+(ok ? 'ok' : 'bad')+(ok !== was ? ' flip' : '')+'"><span>'+(ok ? '✓' : '✗')+'</span></td></tr>';
    }).join('');
    G.querySelector('#tstage').innerHTML = '<div class="teq">'+term(k,0)+op('+')+term(k,1)+op('→')+term(k,2)+op('+')+term(k,3)+'</div>'
      + '<table class="tuttab"><tr><th></th><th>Vế trái</th><th>Vế phải</th><th></th></tr>'+rows+'</table>';
    G.querySelectorAll('.tstep').forEach(el => el.classList.toggle('on', +el.dataset.k === k));
  };
  modal('<h2>'+ico('book',22)+' Hướng dẫn cân bằng</h2>'
    + '<div class="hgrid"><div class="tstage" id="tstage"></div><div>'
    + ST.map((s, k) => '<div class="tstep" data-k="'+k+'"><span class="tnum">'+(k+1)+'</span><div>'+s.t+'</div></div>').join('')
    + '<p class="tnote">Hệ số 1 không cần viết. Chỉ đổi hệ số trước công thức, không đổi chỉ số nhỏ bên trong công thức.</p>'
    + '</div></div>', null, 'hcard');
  G.querySelectorAll('.tstep').forEach(el => { el.onmouseenter = el.onclick = () => render(+el.dataset.k); });
  render(0);
}

// Tờ giấy cân bằng — KHÔNG bắt buộc. Mở từ tờ giấy ghim trên tường lúc làm ca, màn giới thiệu ngày
// hoặc thẻ Tạm nghỉ. Từ ngày BALANCE_FROM_DAY trò tự điền hệ số: dòng nào đúng thì khoá lại, có dấu ✓ đỏ
// ở lề và được nhớ mãi (save.balanced = chỉ số phản ứng trong REACTIONS). Trước ngày đó, hoặc khi đã tắt
// công tắc Giấy cân bằng sẵn (vật phẩm Cửa hàng), giáo sư viết sẵn đáp án. onclose chạy ngay khi bấm đóng.
const isBalanced = idx => (save.balanced || []).includes(idx);
const balanceEditable = i => i + 1 >= BALANCE_FROM_DAY && balanceOn();
function balanceSheet(i, onclose){
  const num = i+1, eqs = dayEqs(DAYS[i]);
  if(!eqs.length){ modal('<h2>'+ico('note',22)+' Giấy cân bằng</h2><p>Ngày này chưa có phản ứng để cân bằng.</p>', onclose); return; }
  const editable = balanceEditable(i);
  let rows, hint;
  if(editable){
    const nl = Math.max(...eqs.map(idx => Object.keys(REACTIONS[idx].rg).length));
    const np = Math.max(...eqs.map(idx => Object.keys(REACTIONS[idx].pr).length));
    rows = eqs.map((idx,k) => eqEditableRow(idx,k,nl,np)).join('');
    hint = 'Không bắt buộc — điền hệ số cho từng phương trình, đúng thì được đánh dấu ✓.';
  } else {
    rows = handEqRows(eqs);
    hint = num < BALANCE_FROM_DAY ? 'Giáo sư đã cân bằng giúp trò rồi — từ <b>ngày '+BALANCE_FROM_DAY+'</b> trở đi trò sẽ tự làm nhé!'
      : 'Giáo sư đã điền sẵn hệ số (đang bật “Giấy cân bằng sẵn” trong Cài đặt).';
  }
  const ov = modal('<h2>'+ico('note',22)+' Giấy cân bằng — Ngày '+num
    + (editable ? ' <button class="btn icobtn helpbtn" id="bhelp" aria-label="Hướng dẫn cân bằng" title="Hướng dẫn cân bằng">?</button>' : '') + '</h2>'
    + '<div class="bnote hpaper"><p class="bsub">'+hint+'</p>'+rows+'</div>', onclose, 'bsheet');
  if(!editable) return;
  ov.querySelector('#bhelp').onclick = balanceTutorial;
  alignEqCols();
  if(document.fonts) document.fonts.ready.then(alignEqCols);   // đo lại khi phông tải xong

  const lockRow = (eid, msg, color) => {
    const row = ov.querySelector('.beq[data-eid="'+eid+'"]'), mark = row.querySelector('.bmark');
    row.classList.add('ok');
    row.querySelectorAll('.bcoef').forEach(inp => { inp.readOnly = true; inp.classList.remove('bad'); });
    mark.textContent = msg; mark.style.color = color || '';
  };
  // phương trình đã cân bằng từ trước: điền sẵn hệ số đúng và khoá lại
  eqs.forEach((idx, eid) => {
    if(!isBalanced(idx)) return;
    ov.querySelectorAll('.bcoef[data-eid="'+eid+'"]').forEach(inp => inp.value = inp.dataset.want);
    lockRow(eid, '✔ Cân bằng đúng!');
    ov.querySelector('.beq[data-eid="'+eid+'"]').classList.add('was');   // không phát lại hiệu ứng đóng dấu
  });
  const checkRow = (eid) => {
    if(isBalanced(eqs[eid])) return;
    const inputs = [...ov.querySelectorAll('.bcoef[data-eid="'+eid+'"]')];
    const msg = ov.querySelector('.bmark[data-msg="'+eid+'"]');
    const say = (t, c) => { msg.textContent = t; msg.style.color = c || ''; };
    if(inputs.some(inp => inp.value.trim() === '')) return say(''); // chưa điền đủ
    const want = inputs.map(inp => +inp.dataset.want);
    const got  = inputs.map(inp => +inp.value);
    if(got.some(v => !Number.isInteger(v) || v < 1)) return say('Hệ số phải là số nguyên từ 1 trở lên.', '#c9524b');
    const k = got[0] / want[0];
    const exact = got.every((v,j) => v === want[j]);
    const multiple = Number.isInteger(k) && k > 1 && got.every((v,j) => v === want[j]*k);
    if(exact || multiple){
      save.balanced = [...(save.balanced || []), eqs[eid]]; persist();
      SFX.clink();
      if(exact) lockRow(eid, '✔ Cân bằng đúng!');
      else lockRow(eid, '✔ Đúng rồi! Lần sau thử dùng hệ số nhỏ nhất nhé.', '#b9812f');
    } else {
      say('Số nguyên tử hai vế chưa bằng nhau — đếm lại rồi thử tiếp nào.', '#c9524b');
      inputs.forEach(inp => inp.classList.add('bad'));
    }
  };
  ov.querySelectorAll('.bcoef').forEach(inp => {
    inp.addEventListener('input', () => { inp.classList.remove('bad'); checkRow(+inp.dataset.eid); });
  });
}

// hai thanh âm lượng (Âm thanh, Nhạc nền) — dùng chung cho Cài đặt và thẻ Tạm nghỉ
function volSliders(){
  const lbl = 'font-family:var(--fh);font-size:16px';
  const pct = k => SFX.isMuted() ? 0 : Math.round(SFX.getVol(k)*100);
  const slider = (id, ic, name, k) => '<div class="settingrow vol"><div><b style="'+lbl+'">'+ico(ic,15)+' '+name+'</b></div>'
    + '<div class="volbar"><input type="range" min="0" max="100" step="1" id="'+id+'" value="'+pct(k)+'"><b class="volpct" id="'+id+'p">'+pct(k)+'%</b></div></div>';
  return slider('volSfx','sound','Âm thanh','sfx') + slider('volMus','bell','Nhạc nền','music');
}
function bindVolSliders(root){
  const bar = (id, k) => {
    const el = root.querySelector('#'+id), out = root.querySelector('#'+id+'p');
    const paint = () => { el.style.setProperty('--v', el.value+'%'); el.classList.toggle('zero', +el.value === 0); out.textContent = el.value+'%'; };
    el.oninput = () => { SFX.setVol(k, el.value/100); paint(); };
    el.onchange = () => { if(k === 'sfx') SFX.clink(); };
    paint();
  };
  bar('volSfx', 'sfx'); bar('volMus', 'music');
}

function settingsModal(){
  SFX.page();
  const ov = document.createElement('div');
  ov.className = 'overlay';
  const lbl = 'font-family:var(--fh);font-size:16px';
  const tgl = (id, ic, name, on, locked) => '<div class="settingrow'+(locked?' locked':'')+'"><div><b style="'+lbl+'">'+ico(locked?'lock':ic,15)+' '+name+'</b></div>'
    + '<div class="toggle'+(on&&!locked?' on':'')+'" id="'+id+'" role="switch" aria-checked="'+(on&&!locked)+'"></div></div>';
  ov.innerHTML = '<div class="modal hcard"><button class="xbtn" id="mclose" aria-label="Đóng">'+ico('close',16)+'</button>'
    + '<h2>'+ico('gear',22)+' Cài đặt</h2>'
    + '<div class="hgrid"><div>'
    + volSliders()
    + '<div class="settingrow"><div><b style="'+lbl+'">'+ico('trash',15)+' Xoá dữ liệu trò chơi</b></div>'
    + '<button class="btn danger" id="breset">Xoá</button></div>'
    + '</div><div>'
    + tgl('tglCards','star','Thẻ phản ứng',cardsOn())
    + tgl('tglBalance','note','Giấy cân bằng sẵn',!balanceOn(),!nobalOwned())
    + tgl('tglHard','flask','Chế độ khó',hardOn(),!hardUnlocked())
    + '</div></div></div>';
  const flip = (id, key, get, after) => ov.querySelector(id).onclick = e => {
    save.settings[key] = key === 'balance' ? get() : !get(); persist();   // 'balance' lưu ngược: công tắc = tắt cân bằng
    e.currentTarget.classList.toggle('on', get());
    e.currentTarget.setAttribute('aria-checked', get());
    SFX.clink();
    if(after) after();
  };
  const lockedTgl = (id, msg) => ov.querySelector(id).onclick = () => { SFX.err(); toast(ico('lock',16)+' '+msg); };
  flip('#tglCards', 'cards', cardsOn);
  if(hardUnlocked()) flip('#tglHard', 'hard', hardOn);
  else lockedTgl('#tglHard', 'Hoàn thành trò chơi lần đầu để mở khoá chế độ khó!');
  if(nobalOwned()) flip('#tglBalance', 'balance', () => !balanceOn());
  else lockedTgl('#tglBalance', 'Mua vật phẩm ở Cửa hàng để mở khoá!');
  bindVolSliders(ov);
  ov.querySelector('#mclose').onclick = () => closeOv(ov);
  ov.querySelector('#breset').onclick = () => confirmModal(
    '<h2>'+ico('trash',22)+' Xoá dữ liệu?</h2><p style="margin:8px 0">Toàn bộ tiến trình, sao và thành tựu sẽ bị xoá và không thể khôi phục.</p>',
    () => { save = {unlocked:1, stars:{}, starsHard:{}, ach:[], served:0, spent:0, rx:[], hist:[], settings:{balance:true}}; persist(); closeOv(ov); toast('Đã xoá dữ liệu.'); showMenu(); },
    'Xoá hết', 'Giữ lại');
  G.appendChild(ov);
}

/* =====================  RESULT & GRADING  ===================== */
/* Thẻ kết quả: cảnh vừa chơi đứng hình, tối lại phía sau; thẻ nảy vào giữa, rồi từng sao được
   rót đầy như chất lỏng (mặt sóng dâng trong viền sao). Dùng chung cho mọi ngày và pha nồng độ. */
const STAR_PTS = '12,2 15.1,8.3 22,9.3 17,14.1 18.2,21 12,17.8 5.8,21 7,14.1 2,9.3 8.9,8.3';   // = ico-star
// mặt sóng chu kỳ 12, trải từ x=-24 tới 48 để trượt ngang đúng một chu kỳ mà không hở mép
const wavePath = y => 'M-24 '+y+'q3 -2.2 6 0'+' t6 0'.repeat(11)+'V26H-24Z';
// id khuôn cắt phải duy nhất toàn trang: nền chụp lại có thể còn sao của thẻ trước
let lsSeq = 0;
const liqStar = s => `<svg class="lstar" width="${s}" height="${s}" viewBox="0 0 24 24">
  <clipPath id="lsclip${++lsSeq}"><polygon points="${STAR_PTS}"/></clipPath>
  <polygon points="${STAR_PTS}" fill="#efe5cc"/>
  <g clip-path="url(#lsclip${lsSeq})"><g class="lsliq">
    <path class="lsw2" d="${wavePath(-.8)}"/><path class="lsw1" d="${wavePath(0)}"/>
    <circle class="lsbub" cx="9" cy="15" r=".9"/><circle class="lsbub" cx="14.5" cy="18" r=".6"/>
  </g></g>
  <polygon points="${STAR_PTS}" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
// nút trên thẻ kết quả: chỉ có hình, cùng một cỡ vuông; chữ nằm ở title / aria-label
const resBtn = (id, icon, label, cls = '') =>
  `<button class="btn icobtn resbtn${cls}" id="${id}" aria-label="${label}" title="${label}">${ico(icon, 30)}</button>`;
function resultCard(title, stars, body){
  // chụp lại cảnh đang có làm nền (canvas không tự chép hình khi clone nên vẽ lại từ bản gốc)
  const bg = document.createElement('div');
  bg.className = 'resbg'; bg.inert = true;
  [...G.children].forEach(c => {
    if(c.matches('.overlay, .toast, .pagewipe')) return;
    const cp = bg.appendChild(c.cloneNode(true)), dst = cp.querySelectorAll('canvas');
    c.querySelectorAll('canvas').forEach((cv, n) => { if(cv.width && cv.height) dst[n].getContext('2d').drawImage(cv, 0, 0); });
  });
  G.innerHTML = `<div class="scene resscene"><div class="rescard"><h2>${title}</h2>
    <div class="lstars">${[74, 92, 74].map(liqStar).join('')}</div>${body}</div></div>`;
  const card = G.querySelector('.rescard');
  card.after(bg);   // nằm sau thẻ: querySelector('#id') luôn trúng nút của thẻ trước
  SFX.page();
  card.querySelectorAll('.lstar').forEach((el, k) => {
    if(k < stars) setTimeout(() => { el.classList.add('fill'); SFX.fill(); }, 650 + k*620);
    else setTimeout(() => el.classList.add('off'), 650 + stars*620);
  });
}
function showResult(i, st){
  const day = DAYS[i], num = i+1;
  let stars = 0, detail = '';
  if(day.mg){
    const r = st.total ? st.correct/st.total : 0;
    stars = r >= 1 ? 3 : r >= .75 ? 2 : r >= .5 ? 1 : 0;
    detail = `<p style="font-size:18px">${st.label || 'Trả lời đúng'}: <b>${st.correct}/${st.total}</b></p>`;
  } else {
    const all = day.orders.length;
    const perfect = st.wrong === 0 && !st.safety;
    if(st.served >= day.s1) stars = 1;
    if(st.served === all) stars = 2;
    if(stars === 2 && perfect) stars = 3;
    detail = `<p style="font-size:16px">Đơn hoàn thành: <b>${st.served}/${all}</b> · Giao sai: <b>${st.wrong}</b> · Lỗi an toàn: <b>${st.safety||0}</b></p>`;
    save.served += st.served;
    if(st.served === all) unlockAch('clean');
  }
  // save progress — chế độ khó có cột sao riêng, nhưng qua được thì vẫn mở ngày kế tiếp
  const book = st.hard ? save.starsHard : save.stars;
  if(stars > (book[num] || 0)) book[num] = stars;
  if(stars >= 1 && num >= save.unlocked && num < DAYS.length) save.unlocked = num + 1;
  // nhật ký từng lượt chơi — nguồn cho báo cáo học tập (giữ 400 lượt gần nhất)
  save.hist.push(day.mg ? {d:num, h:st.hard ? 1 : 0, s:stars, w:st.total - st.correct, t:Date.now()}
    : {d:num, h:st.hard ? 1 : 0, s:stars, sv:st.served, w:st.wrong, sf:st.safety||0, m:st.mistakes||{}, t:Date.now()});
  if(save.hist.length > 400) save.hist.splice(0, save.hist.length - 400);
  persist();
  if(st.hard && stars >= 1) unlockAch('hard1');
  if(Object.values(save.starsHard).filter(s => s >= 3).length >= 5) unlockAch('hard3');
  // achievements
  if(num === 1 && stars >= 1) unlockAch('d1');
  if(stars === 3) unlockAch('star3');
  if(save.served >= 10) unlockAch('serve10');
  if(save.served >= 50) unlockAch('serve50');
  for(let w=0; w<4; w++){
    let ok = true;
    for(let d=w*7+1; d<=w*7+7; d++) if((save.stars[d]||0) < 3) ok = false;
    if(ok) unlockAch('week'+(w+1));
  }
  if(Object.keys(save.stars).filter(k=>save.stars[k]>=1).length >= 28) unlockAch('all28');
  if(num === 28 && stars === 3) unlockAch('master');
  persist();
  const cheer = stars===3?'Xuất sắc! Không chê vào đâu được!':stars===2?'Làm tốt lắm, gần hoàn hảo rồi!':stars===1?'Ổn đấy! Luyện thêm chút nữa nhé.':'Đừng nản — thử lại nào, ta tin trò!';
  resultCard(`Ngày ${num} kết thúc${st.hard ? ' <span style="color:#d9634f">· chế độ khó</span>' : ''}`, stars,
    `<div class="resbody">${detail}<p class="hand">“${cheer}”</p></div>
    <div class="row resbtns">${resBtn('bretry', 'retry', 'Chơi lại')}${resBtn('bmap', 'map', 'Bản đồ')}${exploreBtn(day, i, true)}
      ${(stars>=1 && num<DAYS.length) ? resBtn('bnext', 'next', 'Ngày tiếp theo', ' main') : ''}</div>`);
  G.querySelector('#bretry').onclick = () => go(()=>showIntro(i));
  G.querySelector('#bmap').onclick = () => go(showMap);
  bindExplore(i);
  const bn = G.querySelector('#bnext');
  if(bn) bn.onclick = () => go(()=>showIntro(i+1));
}

/* =====================  SCALE TO WINDOW  ===================== */
function fit(){
  const s = Math.min(innerWidth/1300, innerHeight/740);
  G.style.left = '50%'; G.style.top = '50%';
  G.style.transform = `translate(-50%,-50%) scale(${s})`;
}
addEventListener('resize', fit);
