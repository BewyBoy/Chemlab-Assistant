/* =====================================================================
   GIAO DIỆN — âm thanh & nhạc nền, lưu tiến trình, menu, lịch, cửa hàng, vào ngày (playDay, màn "Bắt đầu"),
   giấy cân bằng, cài đặt, màn kết quả.
   ===================================================================== */
'use strict';

/* ---- inline-SVG helpers ---- */
const ico = (id, s) => '<svg class="ico" width="'+(s||20)+'" height="'+(s||20)+'"><use href="#ico-'+id+'"/></svg>';
// Bật/tắt phần động bên trong một symbol dụng cụ (lửa đèn cồn, khí trong ống, giọt phễu).
// --name là độ hiện 0..1; --name+'run' cho animation CSS .fx-* (style.css) chạy khi phần đó hiện
// và dừng khi ẩn, để bản sao ẩn trong <use> không ngốn CPU mỗi khung hình.
function setFx(el, name, v){ el.style.setProperty('--'+name, v); el.style.setProperty('--'+name+'run', +v > 0 ? 'running' : 'paused'); }
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
  // trần số tiếng hiệu ứng vang cùng lúc: bấm lọ liên tục không chồng hàng chục bộ dao động lên máy yếu (nhạc nền không tính)
  const MAX_VOICES = 16; let voices = 0;
  const voice = src => { voices++; src.onended = () => voices--; };
  // at: thời điểm phát theo đồng hồ âm thanh (nhạc nền xếp lịch trước); bỏ trống là phát ngay
  function tone(f, d, type, v, f2, vol, at){
    const c = ac(); if(!c || muted) return;
    if(vol === undefined && voices >= MAX_VOICES) return;
    v = (v||.1) * (vol === undefined ? sfxVol : vol); if(v <= 0) return;
    const o = c.createOscillator(), g = c.createGain(), t = Math.max(at || 0, c.currentTime);
    if(vol === undefined) voice(o);
    o.type = type||'sine'; o.frequency.value = f;
    if(f2) o.frequency.exponentialRampToValueAtTime(f2, t+d);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(.0001, t+d);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t+d+.02);
  }
  // fq2: quét tần số lọc tới fq2 trong suốt tiếng — ra tiếng "vù" của lửa bùng lên
  // Một dải nhiễu trắng 2 s sinh một lần rồi dùng lại (mỗi tiếng bắt đầu ở một chỗ ngẫu nhiên), thay vì mỗi tiếng
  // lại cấp phát và điền hàng chục nghìn mẫu bằng JS. Độ tắt dần nằm ở đường gain, nghe như cũ.
  let noiseBuf = null;
  function noise(d, v, fq, q, fq2){
    const c = ac(); if(!c || muted || sfxVol <= 0 || voices >= MAX_VOICES) return;
    if(!noiseBuf){
      noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate*2), c.sampleRate);
      const ch = noiseBuf.getChannelData(0); for(let i=0;i<ch.length;i++) ch[i] = Math.random()*2-1;
    }
    const t = c.currentTime, s = c.createBufferSource(); s.buffer = noiseBuf; voice(s);
    const fl = c.createBiquadFilter(); fl.type='bandpass'; fl.frequency.value=fq||1200; fl.Q.value=q||1;
    if(fq2) fl.frequency.exponentialRampToValueAtTime(fq2, t + d);
    const g = c.createGain(); g.gain.setValueAtTime((v||.08) * sfxVol, t); g.gain.linearRampToValueAtTime(0, t + d);
    s.connect(fl); fl.connect(g); g.connect(c.destination);
    s.start(t, Math.random()*Math.max(0, 2 - d), d); s.stop(t + d + .02);
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
    // xếp lịch trước ~0,3 s theo đồng hồ âm thanh: hẹn giờ của trình duyệt bị trễ (máy bận, tab nền) thì nhịp vẫn đều,
    // không giật như phát từng nốt đúng lúc hẹn giờ gọi
    const c = ac(), half = 60 / th.bpm / 2;
    if(!c) return;
    mus.at = c.currentTime + .05;
    const plan = () => {
      if(mus.at < c.currentTime) mus.at = c.currentTime + .05;   // vừa ngủ dậy (tab ẩn lâu): không dồn nốt cũ ra một lượt
      for(const end = c.currentTime + .3; mus.at < end; mus.at += half){
        const s = mus.step++;
        if(s % 8 === 0) tone(note(s % 32 === 16 ? -2 : -5), 1.4, 'sine', .035, null, musVol, mus.at);   // bè trầm: chủ âm, thỉnh thoảng lên bậc
        if(Math.random() < .62){
          mus.pos = Math.max(0, Math.min(9, mus.pos + [-2,-1,-1,1,1,2][Math.floor(Math.random()*6)]));
          tone(note(mus.pos), .55, th.w, .028, null, musVol, mus.at);
        }
      }
    };
    plan(); mus.timer = setInterval(plan, 100);
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
    // rời tab / tắt màn hình: dừng hẳn nhạc và cho bộ xử lý âm thanh ngủ (đỡ pin); quay lại thì phát tiếp
    sleep(hidden){
      if(hidden){ musicStop(); if(ctx && ctx.state === 'running') ctx.suspend(); }
      else { if(ctx && ctx.state === 'suspended') ctx.resume(); if(mus.theme != null && !mus.timer) musicPlay(mus.theme); }
    },
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
    glug(f){ tone(260+f*420,.08,'sine',.05,330+f*480); },                   // một tiếng ọc khi rót sao, f: mức đã đầy 0…1
    ding(){ tone(1568,.2,'triangle',.05); setTimeout(()=>tone(2093,.25,'triangle',.035),70); }, // sao vừa đầy
    scribble(ms){ for(let t=0;t<ms;t+=110) setTimeout(()=>noise(.07,.025,3600+Math.random()*1500,2.5), t+Math.random()*40); }, // viết tay trên phiếu
    stamp(){ noise(.18,.16,260,.5); setTimeout(()=>{ tone(1319,.18,'triangle',.05); setTimeout(()=>tone(1760,.3,'triangle',.05),110); },120); }, // con dấu "Kỷ lục mới!"
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
if(!save) save = {unlocked:1, stars:{}, ach:[], served:0, spent:0, rx:[], lich:3};
if(!save.rx) save.rx = [];   // save cũ: sổ tay bắt đầu trống, đầy dần khi chơi
if(!save.settings) save.settings = {};                 // save cũ: bổ sung ô cài đặt
if(save.settings.balance === undefined) save.settings.balance = true; // cân bằng phương trình: bật mặc định
const nobalOwned = () => !!(save.items && save.items.nobalance);   // mua ở Cửa hàng mới được tắt cân bằng
const balanceOn = () => !nobalOwned() || save.settings.balance !== false;
if(!save.starsHard) save.starsHard = {};               // sao chế độ khó lưu riêng, không đè sao thường
if(!save.hist) save.hist = [];                         // nhật ký từng lượt chơi (ngày nào đã chơi: lessonSeen)
if(!save.best) save.best = {};                         // kỷ lục điểm từng ngày (js/diem.js)
if(!save.bestHard) save.bestHard = {};                 // kỷ lục điểm chế độ khó
const hardUnlocked = () => DEBUG;   // chế độ khó tạm chỉ có ở chế độ dev (nút trên lịch, công tắc trong Cài đặt)
const hardOn  = () => hardUnlocked() && save.settings.hard === true;     // chế độ khó: tự tính gam / ml / lít
const cardsOn = () => save.settings.cards !== false;   // thẻ phản ứng khi khám phá: bật mặc định
// sổ ghi chép ở màn xác định chất: phải mua ở Cửa hàng; mua rồi bật/tắt ngay trong Cửa hàng (mặc định bật)
const labbookOn = () => !!(save.items && save.items.labbook) && save.settings.labbook !== false;
const BALANCE_FROM_DAY = 6; // từ ngày này trở đi người chơi tự cân bằng; trước đó giáo sư làm hộ (ngày 5 học cân bằng)
// đồng đỏ: one copper coin per unlocked achievement, minus what was spent in the shop.
// Dev mode: vô hạn — mua gì cũng đủ, không trừ vào save.spent (tắt dev mode là số đồng thật y như cũ), hiện là ∞
const achCoins = () => DEBUG ? Infinity : save.ach.length - (save.spent||0);
const coinStr = () => DEBUG ? '∞' : achCoins();
const spendCoins = n => { if(!DEBUG) save.spent = (save.spent||0) + n; };
// persist() được gọi rải khắp game (mở khoá, đổi liều lượng…) — không bọc thì storage bị
// chặn giữa chừng (itch.io iframe, Safari riêng tư) sẽ ném lỗi ngay tại chỗ gọi và văng game.
const persist = () => { try { localStorage.setItem('chemlab_save', JSON.stringify(save)); } catch(e){} };
/* Lịch đổi bài — save.lich ghi save đã theo lịch nào. Save cũ thì dời sao, kỷ lục, nhật ký, bài đã nghe theo số ngày
   mới, từng lần đổi một (save rất cũ thì qua cả hai lần), rồi ghi lại ngay. Đổi lịch lần nữa thì thêm một mục vào
   LICH_MOVES (số ngày cũ → mới; null: bài đã bỏ) và tăng lich trong hai chỗ tạo save mới.
     lần 1 → 2: ngày 18 cũ (axit mạnh) bỏ, 19 → 18, 20 → 19, 12 (thám tử quỳ tím) → 20, ngày 12 để trống
     lần 2 → 3: ngày 11 cũ (nước) bỏ, 26 (nitơ) → 11, 25 (halogen) → 12, 22 (nhôm) → 25, 23 (sắt) → 26;
                22, 23 là bài mới (kim loại kiềm, kiềm thổ) */
const LICH_MOVES = [{12:20, 18:null, 19:18, 20:19}, {11:null, 22:25, 23:26, 25:12, 26:11}];
for(let v = save.lich || 1; v <= LICH_MOVES.length; v++){
  const M = LICH_MOVES[v - 1], to = d => d in M ? M[d] : +d;
  ['stars', 'starsHard', 'best', 'bestHard'].forEach(k => { const n = {};
    Object.keys(save[k]).forEach(d => { if(to(d)) n[to(d)] = save[k][d]; }); save[k] = n; });
  save.hist = save.hist.filter(h => to(h.d)).map(h => Object.assign(h, {d:to(h.d)}));
  ['lessons', 'lessonsHard'].forEach(k => { if(save[k]) save[k] = save[k].map(to).filter(Boolean); });
  save.lich = v + 1;
  persist();
}
// ngày đang để trống (rest) không chặn đường: mở luôn tới ngày thật kế tiếp
const skipRest = () => { while(save.unlocked < DAYS.length && DAYS[save.unlocked - 1].rest) save.unlocked++; };
skipRest();

// Hai loại thông báo nhỏ ở góc dưới:
//   toast(msg) — ghi chú kỹ thuật (đã rót gì, đã đổ gì…): chỉ hiện ở dev mode (#dev / mật khẩu)
//   notify(msg) — điều người chơi CẦN đọc: giáo sư giải thích vì sao không phản ứng, vì sao khí bay mất, làm sai chỗ nào.
//                 Luôn hiện, nền giấy, đứng lâu hơn nếu câu dài; câu y hệt câu đang hiện thì không nhắc lại.
function toast(msg){ if(DEBUG) showNote(msg, false); }
function notify(msg){ showNote(msg, true); }
function showNote(msg, keep){
  if(keep){ const last = [...G.querySelectorAll('.toast.say')].pop(); if(last && last._msg === msg) return; }
  // ở bàn thí nghiệm, lời nhắn người chơi nằm giữa phía trên (vùng tường) — góc dưới bên trái là khay giao hàng
  const top = keep && !!G.querySelector('#beakerItem');
  const t = document.createElement('div');
  t.className = 'toast' + (keep ? ' say' : '') + (top ? ' say-top' : '') + (top && G.querySelector('#freenote') ? ' say-narrow' : '');
  t.innerHTML = msg; t._msg = msg;
  const ms = keep ? Math.min(9000, 3500 + msg.replace(/<[^>]+>/g, '').length*45) : 3600;
  t.style.animationDuration = ms + 'ms';
  G.appendChild(t); setTimeout(()=>t.remove(), ms + 100);
  // thông báo mới nằm sát mép (trên cùng / dưới cùng), cái cũ bị đẩy ra xa thay vì bị đè mất chữ.
  // Giữ tối đa 2 lời nhắn ở trên (kẻo che phương trình nổi trên cốc), 3 ghi chú ở dưới
  const old = [...G.querySelectorAll(top ? '.toast.say-top' : '.toast:not(.say-top)')].filter(x => x !== t).reverse();
  let y = (top ? 74 : 20) + t.offsetHeight + 8;
  old.forEach((x, k) => {
    if(k >= (top ? 1 : 2)){ x.remove(); return; }
    x.style[top ? 'top' : 'bottom'] = y + 'px';
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
// Tên game kiểu nhãn dán: chữ Paytone One vàng, khối 3D màu mực, viền trắng + nét mực, bóng mờ trên tường.
// Mỗi lớp là cả hai dòng <text> chồng lên nhau, từ dưới lên. Thử kiểu khác ở thu-ten-game.html (kiểu F là bản này).
// viewBox đo sẵn bằng getBBox với Paytone One; đổi chữ, cỡ hay cách dòng thì đo lại ở trang thử.
function tenGameSVG(){
  const B = 10, K = 3, D = 9, DX = .35, INK = '#3b3025', PAPER = '#fffdf5';   // viền trắng, nét mực, độ dày khối 3D, độ lệch phải mỗi lớp khối
  const dong = [['Trợ lý', 4, 48, 48], ['Hóa học nhí', 0, 48 + 64 * 1.12, 64]];   // chữ, x, y, cỡ; dòng 2 cách 1,12 cỡ chữ
  const lop = (a, dx = 0, dy = 0) => dong.map(([t, x, y, s]) => `<text x="${x}" y="${y}" font-size="${s}" transform="translate(${dx} ${dy})" ${a}>${t}</text>`).join('');
  const dac = (c, w) => `fill="${c}" stroke="${c}" stroke-width="${w}"`;
  const ba = [0, D / 2, D], khoi = Array.from({length: D}, (_, i) => i + 1);
  return `<svg viewBox="-15 -20 428 202" width="556" height="263" font-family="'Paytone One'" font-weight="400" stroke-linejoin="round" paint-order="stroke" aria-hidden="true">
    <defs><filter id="tgMo" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
      <linearGradient id="tgMat" x1="0" y1="0" x2="0" y2="1"><stop offset=".2" stop-color="#ffe08a"/><stop offset=".95" stop-color="#e8b84b"/></linearGradient>
      <clipPath id="tgCat">${lop('')}</clipPath></defs>
    <g filter="url(#tgMo)" opacity=".28">${lop(dac(INK, 2 * (B + K)), 4, D + 5)}</g>
    ${ba.map(k => lop(dac(INK, 2 * (B + K)), k * DX, k)).join('')}
    ${ba.map(k => lop(dac(PAPER, 2 * B), k * DX, k)).join('')}
    ${khoi.map(k => lop(dac(INK, 4 * K), k * DX, k)).join('')}
    ${lop(`fill="url(#tgMat)" stroke="${INK}" stroke-width="${2 * K}"`)}
    <g clip-path="url(#tgCat)">${lop('fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".7"', 1.6, 2.4)}</g>
  </svg>`;
}
// Bộ lọc sticker khi hover nút menu chính (#ico-ink cho icon không stroke, #stk-union bọc liền nút + icon)
const MENU_STK_DEFS = `<svg width="0" height="0" style="position:absolute;pointer-events:none" aria-hidden="true"><defs>`
  + `<filter id="ico-ink" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">`
  + `<feGaussianBlur in="SourceAlpha" stdDeviation="1.05" result="b"/>`
  + `<feComponentTransfer in="b" result="m"><feFuncA type="linear" slope="18" intercept="-1.4"/></feComponentTransfer>`
  + `<feFlood flood-color="#3b3025" result="c"/><feComposite in="c" in2="m" operator="in" result="ink"/>`
  + `<feMerge><feMergeNode in="ink"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
  + `<filter id="stk-union" x="-35%" y="-90%" width="170%" height="280%" color-interpolation-filters="sRGB">`
  + `<feMorphology in="SourceAlpha" operator="dilate" radius="1.4" result="d0"/>`
  + `<feGaussianBlur in="d0" stdDeviation="2.6" result="bw"/>`
  + `<feComponentTransfer in="bw" result="wm"><feFuncA type="linear" slope="20" intercept="-1.8"/></feComponentTransfer>`
  + `<feFlood flood-color="#fffdf5" result="wc"/><feComposite in="wc" in2="wm" operator="in" result="wrim"/>`
  + `<feGaussianBlur in="wm" stdDeviation="1.15" result="bi"/>`
  + `<feComponentTransfer in="bi" result="im"><feFuncA type="linear" slope="18" intercept="-1.4"/></feComponentTransfer>`
  + `<feFlood flood-color="#3b3025" result="ic"/><feComposite in="ic" in2="im" operator="in" result="irim"/>`
  + `<feGaussianBlur in="im" stdDeviation="3.4" result="sb"/><feOffset in="sb" dx="0" dy="4.5" result="so"/>`
  + `<feFlood flood-color="#3b3025" flood-opacity="0.28" result="sc"/><feComposite in="sc" in2="so" operator="in" result="sh"/>`
  + `<feMerge><feMergeNode in="sh"/><feMergeNode in="irim"/><feMergeNode in="wrim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
  + `</defs></svg>`;
// Icon SVG tự vẽ hoàn toàn không stroke cho các nút menu chính (tràn viền khi hover)
const MENU_ICONS = (() => {
  const starPath = (cx, cy, pts, outerR, innerR) => {
    let d = '';
    for(let i = 0; i < pts * 2; i++){
      const r = i % 2 === 0 ? outerR : innerR, a = -Math.PI / 2 + (i * Math.PI) / pts;
      d += (i === 0 ? 'M' : 'L') + (cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  };
  const sparklePath = (cx, cy, R) => {
    const k = R * 0.22;
    return `M${cx},${cy - R} Q${cx + k},${cy - k} ${cx + R},${cy} Q${cx + k},${cy + k} ${cx},${cy + R} Q${cx - k},${cy + k} ${cx - R},${cy} Q${cx - k},${cy - k} ${cx},${cy - R}Z`;
  };
  const gearPath = (cx, cy, teeth, outerR, rootR, holeR) => {
    const step = (Math.PI * 2) / teeth;
    const pt = (r, a) => (cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2);
    let d = '';
    for(let i = 0; i < teeth; i++){
      const a0 = i * step - step * 0.22, a1 = i * step - step * 0.13, a2 = i * step + step * 0.13, a3 = i * step + step * 0.22;
      const nextA0 = (i + 1) * step - step * 0.22;
      if(i === 0) d += 'M' + pt(rootR, a0);
      d += ` L${pt(outerR, a1)} A${outerR},${outerR} 0 0,1 ${pt(outerR, a2)} L${pt(rootR, a3)} A${rootR},${rootR} 0 0,1 ${pt(rootR, nextA0)}`;
    }
    d += 'Z';
    if(holeR > 0) d += ` M${cx + holeR},${cy} A${holeR},${holeR} 0 1,0 ${cx - holeR},${cy} A${holeR},${holeR} 0 1,0 ${cx + holeR},${cy}Z`;
    return d;
  };
  const ringPath = (cx, cy, outerR, innerR) =>
    `M${cx + outerR},${cy} A${outerR},${outerR} 0 1,0 ${cx - outerR},${cy} A${outerR},${outerR} 0 1,0 ${cx + outerR},${cy}Z`
    + ` M${cx + innerR},${cy} A${innerR},${innerR} 0 1,0 ${cx - innerR},${cy} A${innerR},${innerR} 0 1,0 ${cx + innerR},${cy}Z`;
  return {
    bstart: `<svg viewBox="0 0 56 56">`
      + `<path d="M22,13 H34 L33,22.5 L46,43 C47.6,45.8 45.6,49 42.3,49 H13.7 C10.4,49 8.4,45.8 10,43 L23,22.5 Z" fill="#d6f0f3"/>`
      + `<path d="M28,13 H34 L33,22.5 L46,43 C47.6,45.8 45.6,49 42.3,49 H28 Z" fill="#b4dfe5" opacity="0.58"/>`
      + `<path d="M22.7,15.5 H33.3 L33,19 H23 Z" fill="#8ec0c9" opacity="0.72"/>`
      + `<rect x="19" y="10" width="18" height="4.8" rx="2.4" fill="#9bcad3"/>`
      + `<rect x="20.6" y="11.1" width="8.5" height="1.8" rx="0.9" fill="#ecf9fa" opacity="0.88"/>`
      + `<path d="M18.6,32.5 H37.4 L44.1,43.5 C45,45 43.9,46.8 42,46.8 H14 C12.1,46.8 11,45 11.9,43.5 Z" fill="#63b85a"/>`
      + `<path d="M28,32.5 H37.4 L44.1,43.5 C45,45 43.9,46.8 42,46.8 H28 Z" fill="#4a9b43" opacity="0.6"/>`
      + `<ellipse cx="28" cy="32.5" rx="9.4" ry="2.3" fill="#9be086"/>`
      + `<circle cx="22" cy="40.5" r="2" fill="#c7f2b5" opacity="0.92"/>`
      + `<circle cx="32.5" cy="38" r="1.5" fill="#c7f2b5" opacity="0.85"/>`
      + `<circle cx="26.8" cy="43" r="1.2" fill="#e5fae0" opacity="0.85"/>`
      + `<path d="M23.5,24.8 L15.5,39.5 C14.9,40.6 16.4,41.6 17.2,40.4 L25,25.8 C25.6,24.7 24.1,23.8 23.5,24.8 Z" fill="#ffffff" opacity="0.78"/>`
      + `<g class="fx-bub1"><circle cx="25" cy="6.6" r="2.6" fill="#9be086"/><circle cx="24.2" cy="5.8" r="0.85" fill="#ffffff" opacity="0.88"/></g>`
      + `<g class="fx-bub2"><circle cx="31.2" cy="4.8" r="2" fill="#bceea8"/><circle cx="30.6" cy="4.2" r="0.65" fill="#ffffff" opacity="0.88"/></g>`
      + `<g class="fx-bub3"><circle cx="28.3" cy="8.2" r="1.5" fill="#63b85a" opacity="0.88"/></g></svg>`,
    brx: `<svg viewBox="0 0 56 56"><g class="fx-breath">`
      + `<path d="M32,42 H38.5 V52 L35.25,49.2 L32,52 Z" fill="#d9634f"/>`
      + `<rect x="15" y="10" width="30" height="38" rx="5" fill="#3a7b81"/>`
      + `<rect x="14" y="8.5" width="29.5" height="37" rx="4.5" fill="#fff7e3"/>`
      + `<rect x="40" y="11" width="2.5" height="32" rx="1.2" fill="#e6d7b8"/>`
      + `<rect x="12.5" y="7" width="28" height="37" rx="4.5" fill="#5da9b0"/>`
      + `<path d="M17,7 H19 V44 H17 C14.5,44 12.5,42 12.5,39.5 V11.5 C12.5,9 14.5,7 17,7 Z" fill="#468e95"/>`
      + `<rect x="21" y="14" width="15.5" height="11" rx="2.5" fill="#fffdf5"/>`
      + `<rect x="23" y="16.8" width="11.5" height="2" rx="1" fill="#3b3025" opacity="0.82"/>`
      + `<rect x="23" y="20.5" width="8" height="2" rx="1" fill="#5da9b0" opacity="0.88"/>`
      + `<path d="M27,29 H30.5 L30,32.5 L33.5,38 C34,38.8 33.4,39.8 32.4,39.8 H25.1 C24.1,39.8 23.5,38.8 24,38 L27.5,32.5 Z" fill="#dff4f5" opacity="0.92"/>`
      + `<circle cx="15" cy="13.8" r="2.1" fill="#2b5d62"/><rect x="8.5" y="12" width="8" height="3.6" rx="1.8" fill="#f7e6c4"/>`
      + `<circle cx="15" cy="21.8" r="2.1" fill="#2b5d62"/><rect x="8.5" y="20" width="8" height="3.6" rx="1.8" fill="#f7e6c4"/>`
      + `<circle cx="15" cy="29.8" r="2.1" fill="#2b5d62"/><rect x="8.5" y="28" width="8" height="3.6" rx="1.8" fill="#f7e6c4"/>`
      + `<circle cx="15" cy="37.8" r="2.1" fill="#2b5d62"/><rect x="8.5" y="36" width="8" height="3.6" rx="1.8" fill="#f7e6c4"/>`
      + `</g></svg>`,
    bach: `<svg viewBox="0 0 56 56"><g class="fx-float">`
      + `<path fill-rule="evenodd" d="M17,14 C10.5,14 9,20 11,24.5 C12.5,27.8 16.5,28.5 19.5,27.5 L19.5,24 C17,24.5 14.8,24 14,22 C13.2,19.8 14.2,17.2 17,17.2 Z" fill="#dba027"/>`
      + `<path fill-rule="evenodd" d="M39,14 C45.5,14 47,20 45,24.5 C43.5,27.8 39.5,28.5 36.5,27.5 L36.5,24 C39,24.5 41.2,24 42,22 C42.8,19.8 41.8,17.2 39,17.2 Z" fill="#c78d1c"/>`
      + `<path d="M16.5,11 H39.5 L38.5,24 C38,31 33.5,35 28,35 C22.5,35 18,31 17.5,24 Z" fill="#f4c246"/>`
      + `<path d="M28,11 H39.5 L38.5,24 C38,31 33.5,35 28,35 Z" fill="#dca126" opacity="0.62"/>`
      + `<rect x="15" y="9" width="26" height="4.2" rx="2.1" fill="#ffe184"/>`
      + `<path d="M19.5,15 C19.5,21 20.5,26.5 23,29.5 C21.8,30.2 20.4,29.4 19.6,27.6 C18.2,24.5 17.8,19.5 18.2,15 Z" fill="#fff2ba" opacity="0.86"/>`
      + `<rect x="25.5" y="34" width="5" height="7" fill="#d39620"/><ellipse cx="28" cy="36" rx="4.6" ry="2" fill="#f4c246"/>`
      + `<path d="M19.5,41 H36.5 L38,44.5 H18 Z" fill="#9c7046"/><rect x="16" y="44" width="24" height="5" rx="2" fill="#7c5634"/>`
      + `<rect x="23" y="45.3" width="10" height="2.4" rx="1" fill="#f4c246"/>`
      + `<path d="${starPath(28, 22.5, 5, 5.2, 2.2)}" fill="#fffdf5"/></g></svg>`,
    bstory: `<svg viewBox="0 0 56 56">`
      + `<path d="M8,19 L28,22 L48,19 L49.5,43 L28,46.5 L6.5,43 Z" fill="#885aa3"/>`
      + `<rect x="24.5" y="42" width="7" height="5.5" rx="2.5" fill="#6b4282"/>`
      + `<path d="M26.5,44 H30.5 V52.5 L28.5,50.2 L26.5,52.5 Z" fill="#e8b84b"/>`
      + `<path d="M10.5,16.5 Q19,13.5 28,18.5 V42.5 Q19,38.5 9.5,40.5 Z" fill="#fffdf5"/>`
      + `<path d="M45.5,16.5 Q37,13.5 28,18.5 V42.5 Q37,38.5 46.5,40.5 Z" fill="#f3e8d2"/>`
      + `<path d="M26.2,17.8 L28,18.5 L29.8,17.8 V42.5 L28,43 L26.2,42.5 Z" fill="#d9cab0"/>`
      + `<rect x="13" y="22.5" width="11" height="2.2" rx="1.1" fill="#b495cc" opacity="0.72"/>`
      + `<rect x="13" y="27" width="9.5" height="2.2" rx="1.1" fill="#b495cc" opacity="0.72"/>`
      + `<rect x="13" y="31.5" width="10.5" height="2.2" rx="1.1" fill="#b495cc" opacity="0.72"/>`
      + `<rect x="32.5" y="21.5" width="9.5" height="9" rx="2" fill="#f4c246"/>`
      + `<circle cx="37.25" cy="26" r="2.2" fill="#fffdf5" opacity="0.88"/>`
      + `<rect x="32" y="33" width="10.5" height="2.2" rx="1.1" fill="#b495cc" opacity="0.68"/>`
      + `<g class="fx-float"><path d="${sparklePath(28, 11.5, 5.4)}" fill="#f7c948"/>`
      + `<circle cx="20.5" cy="13" r="1.7" fill="#7fc4c9"/><circle cx="35.5" cy="12" r="1.6" fill="#e988a8"/></g></svg>`,
    bset: `<svg viewBox="0 0 56 56">`
      + `<g class="fx-gear1" style="transform-origin:22px 24px">`
      + `<path fill-rule="evenodd" d="${gearPath(22, 24, 8, 14.8, 11.0, 4.4)}" fill="#e0a53c"/>`
      + `<path fill-rule="evenodd" d="${ringPath(22, 24, 8.8, 5.6)}" fill="#c48926"/>`
      + `<circle cx="22" cy="17" r="1.3" fill="#ffe184" opacity="0.88"/></g>`
      + `<g class="fx-gear2" style="transform-origin:39.5px 37.5px">`
      + `<path fill-rule="evenodd" d="${gearPath(39.5, 37.5, 6, 10.4, 7.4, 2.9)}" fill="#5c99a1"/>`
      + `<path fill-rule="evenodd" d="${ringPath(39.5, 37.5, 6.0, 3.8)}" fill="#85bec6"/>`
      + `<circle cx="39.5" cy="32.7" r="1" fill="#dff4f5" opacity="0.9"/></g></svg>`
  };
})();
function showMenu(){
  runStop();
  SFX.music(0);
  // Ca tự do chuyển sang tấm lịch: nó là "ngày 1 của tháng sau", xem showMap().
  const inProgress = save.unlocked > 1; // đã qua ít nhất ngày 1 → có gì đó để "tiếp tục"
  const nextDay = Math.min(save.unlocked, DAYS.length);
  // nút menu: bình thường chỉ có chữ; khi hover nổi 1 icon không stroke tràn viền và viền sticker hợp nhất (style.css .mbtn)
  const mb = (id, cls, side, label) => `<button class="mbtn${cls} ico-${side}" id="${id}" type="button">`
    + `<span class="btn-ico" aria-hidden="true">${MENU_ICONS[id]}</span>`
    + `<span class="btn-label">${label}</span></button>`;
  // Cảnh bàn thí nghiệm nhìn từ mắt giáo sư: SVG có chuyển động, dựng bằng Blender/pov_dong.py. <object> chứ không <img>,
  // để rê chuột vào cốc, đèn cồn, phễu… có phản ứng; CSS của nó nằm riêng trong file, không đụng CSS game
  G.innerHTML = `<div class="scene center" style="padding:0">${MENU_STK_DEFS}
    <object class="menu-pov" data="assets/man-hinh-chinh.svg" type="image/svg+xml" aria-hidden="true" tabindex="-1"></object>
    <h1 class="menu-title" aria-label="Trợ Lý Hóa Học Nhí — Trợ lý phòng thí nghiệm của giáo sư Hoffmann">${tenGameSVG()}</h1>
    <div class="menu-main">
      <div class="menu-btns">
        ${mb('bstart', ' big', 'right', inProgress ? 'Ngày '+nextDay+' →' : 'Bắt đầu')}
        ${mb('brx', '', 'left', 'Sổ tay')}
        ${mb('bach', '', 'right', 'Thành tựu')}
        ${storiesOwned() ? mb('bstory', '', 'right', 'Truyện nguyên tố') : ''}
        ${mb('bset', '', 'left', 'Cài đặt')}
      </div>
    </div>
    <div class="menu-bubble">${PROF_GREETING}</div>
  </div>`;
  G.querySelector('#bstart').onclick = () => go(showMap);
  G.querySelector('#brx').onclick = showRxBook;
  G.querySelector('#bach').onclick = showAch;
  const bst = G.querySelector('#bstory'); if(bst) bst.onclick = showStories;
  G.querySelector('#bset').onclick = settingsModal;
}

// Truyện Kể Các Nguyên Tố (mua ở Cửa hàng): chưa có truyện — tạm hiện thẻ "đang viết"
function showStories(){
  modal('<h2>' + ico('book', 22) + ' Truyện Kể Các Nguyên Tố</h2>'
    + '<p class="center" style="line-height:1.6">Giáo sư đang chép lại những câu chuyện đầu tiên về các nguyên tố.<br>Quay lại sau nhé!</p>');
}

function showAch(){
  const rows = Object.keys(ACH).map(id => {
    const got = save.ach.includes(id);
    return '<div class="sealrow'+(got?'':' off')+'"><div class="seal">'+ico(got?'star':'lock',16)+'</div><div><b>'+ACH[id].n+'</b><br><span style="font-size:13px">'+ACH[id].d+'</span></div></div>';
  }).join('');
  modal('<h2>'+ico('trophy',22)+' Thành tựu ('+save.ach.length+'/'+Object.keys(ACH).length+')</h2>'
    + '<div class="hgrid">'+rows+'</div>', null, 'hcard');
}

const themeOf = i => 1 + Math.min(4, Math.floor(i/7));   // nhạc nền theo chương (SFX.music)
function showMap(){
  runStop();
  SFX.music(0);
  // hand-drawn red pen loop, revealed by stroke-dashoffset when an unplayed day is picked
  const circ = '<svg class="dnc" viewBox="0 0 48 40"><path d="M9,21 C6,9 20,4 30,6 C42,8 46,15 42,25 C37,36 15,39 8,31 C3,25 7,15 15,11" pathLength="100"/></svg>';
  let cells = '';
  const hasStk = [];   // ô nào đã dán sticker
  const fo = DEBUG || (save.stars[DAYS.length]||0) >= 1;   // tháng sau (ca tự do) mở khi qua ngày 31
  for(let d=0; d < Math.ceil(DAYS.length/7)*7; d++){
    if(d === DAYS.length){   // hết 31 ngày thì sang tháng mới: ngày 1 là ca tự do, chơi mãi
      cells += `<div class="day-card freecard${fo?'':' locked'}" data-free="1">
        <div class="dt">${LICH.tuDoNgan}</div>
        <div class="dn"><span class="dnw">1</span>${fo?'':' '+ico('lock',14)}</div>
        <div class="st">${fo?ico('dice',18):''}</div></div>`;
      continue;
    }
    if(d > DAYS.length){ cells += '<div class="day-card blank"></div>'; continue; } // trailing blanks, like a real month page
    const day = DAYS[d], num = d+1;
    if(day.rest){   // ngày đang để trống: ô lịch gạch chéo, ghi "Tạm nghỉ", bấm thì chỉ nhắc đi tiếp
      cells += `<div class="day-card rest${d%7===6?' sun':''}" data-rest="1" title="${day.t}"><div class="dt">${day.tn}</div>
        <div class="dn"><span class="dnw">${num}</span></div><div class="st"></div></div>`;
      continue;
    }
    const open = DEBUG || num <= save.unlocked;
    const st = save.stars[num] || 0, sth = save.starsHard[num] || 0;
    // ô lịch: số ngày trên, tên ngắn giữa, sao dưới; sticker của ngày (LICH.sticker: dụng cụ trong js/sticker.js hoặc
    // công thức) dán lệch vào một góc — góc và độ lệch "ngẫu nhiên" nhưng cố định theo ngày, mở lại lịch không nhảy chỗ
    // cho thoáng: ngoài các ngày LICH.luonDan, chỉ chừng một nửa số ngày có sticker, và hai ô cạnh nhau cùng hàng không cùng có
    let hh = Math.imul(d + 11, 0x9E3779B1); hh ^= hh >>> 15; hh = Math.imul(hh, 0x85EBCA6B); hh = ((hh ^ hh >>> 13) >>> 0) % 997;
    const stk = LICH.sticker && (LICH.luonDan.includes(num) || hh % 10 < 5 && !(d % 7 && hasStk[d - 1])) && LICH.sticker[d];
    hasStk[d] = !!stk;
    const sx = 2 + hh % 9, sy = 2 + (hh >> 3) % 7, corner = (hh + d) % 4;
    const spos = (corner & 1 ? 'right:' : 'left:') + sx + 'px;' + (corner & 2 ? 'bottom:' : 'top:') + sy + 'px';
    cells += `<div class="day-card${open?'':' locked'}${d%7===6?' sun':''}${day.trip?' tripday':''}" data-d="${d}" title="${day.t}">
      ${stk ? `<div class="dsk" style="${spos}">${stickerBox(stk, 46, 42, d)}</div>` : ''}<div class="dt">${day.tn}</div>
      <div class="dn"><span class="dnw">${num}${open && !st && !sth ? circ : ''}</span>${open?'':' '+ico('lock',14)}</div>
      <div class="st">${open||st?dayStars(st, sth):''}</div></div>`;
  }
  const wd = ['T2','T3','T4','T5','T6','T7','CN'].map((x,k)=>'<div'+(k===6?' class="sun"':'')+'>'+x+'</div>').join('');
  G.innerHTML = `<div class="scene mapscene">
    <div class="row" style="justify-content:flex-start">
      <button class="btn icobtn" id="bback" aria-label="Về menu" title="Về menu">${ico('home',26)}</button>
      <button class="btn icobtn" id="bshop" aria-label="Cửa hàng" title="Cửa hàng">${ico('shop',26)}</button>
      ${hardUnlocked() ? `<button class="btn icobtn hardbtn${hardOn()?' on':''}" id="bhard" aria-label="Chế độ khó" aria-pressed="${hardOn()}">${ico('hard',30)}</button>` : ''}
    </div>
    <div class="calbook">
      <div class="calcover"></div>${'<div class="calunder"></div>'.repeat(3)}
      <div class="calsheet">
        <div class="calrings">${'<span></span>'.repeat(14)}</div>
        <div class="calhead">THÁNG ${LICH.thang}</div>
        <div class="calwd">${wd}</div>
        <div class="map-grid">${cells}</div>
      </div>
    </div>
    ${DEBUG?'<div class="devbadge">DEV: mọi ngày đều mở</div>':''}</div>`;
  G.querySelector('#bback').onclick = () => go(showMenu);
  G.querySelector('#bshop').onclick = showShop;
  // nút chế độ khó chung cho mọi ngày (cũng có trong Cài đặt): đầu lâu mờ = tắt, rõ = bật; lịch đã tô sẵn sao khó màu
  // đỏ nên không cần vẽ lại
  const bh = G.querySelector('#bhard');
  const hardTip = () => bh.title = 'Chế độ khó: ' + (hardOn() ? 'đang bật' : 'đang tắt') + ' — đơn hàng ghi theo gam và lít khí; minigame có bài khó riêng';
  if(bh){ hardTip(); bh.onclick = () => { save.settings.hard = !hardOn(); persist(); SFX.clink();
    bh.classList.toggle('on', hardOn()); bh.setAttribute('aria-pressed', hardOn()); hardTip();
    notify(ico('hard',18) + ' Chế độ khó: <b>' + (hardOn() ? 'BẬT' : 'TẮT') + '</b>'); }; }
  G.querySelectorAll('.freecard.locked').forEach(fc => fc.onclick = () => notify(ico('lock',16)+' Làm hết 31 ngày đã, rồi tháng sau tha hồ nghịch!'));
  G.querySelectorAll('.day-card').forEach(c => {
    if(c.dataset.rest){ c.onclick = () => notify('Ngày này đang được soạn bài mới — trò cứ đi tiếp ngày sau nhé!'); return; }
    if(c.classList.contains('locked') || c.classList.contains('blank')) return;
    if(c.dataset.free){ c.onclick = () => go(startFree); return; }
    c.onclick = () => {
      if(c.classList.contains('circled')) return; // nav already scheduled
      if(c.querySelector('.dnc')){ c.classList.add('circled'); SFX.page(); setTimeout(()=>go(()=>playDay(+c.dataset.d)), 520); }
      else go(()=>playDay(+c.dataset.d));
    };
  });
}

// Truyện Kể Các Nguyên Tố: lên kệ Cửa hàng khi đã mở khoá ngày bảng tuần hoàn; mua rồi đọc ở nút trên menu chính (showMenu)
const STORIES_PRICE = 3;
const storiesForSale = () => DEBUG || save.unlocked >= DAYS.findIndex(d => d.mg === 'ptable') + 1;
const storiesOwned = () => !!(save.items && save.items.stories);
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
        <p style="padding:0 4px;margin:0 0 10px">Trò đang có: <b>${coinStr()}</b> ${ico('coinred',15)}</p>
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
        ${storiesForSale() ? `
        <div class="shop-item" style="border: 1.2px solid var(--ink); border-radius: 4.8px; padding: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center; background: #fffdf5">
          <div style="flex: 1; padding-right: 12px">
            <b style="font-size: 16px; color: var(--accent)">${ico('book', 16)} Truyện Kể Các Nguyên Tố</b>
            <div style="font-size: 13px; color: #555; margin-top: 4px">Giáo sư kể chuyện về từng nguyên tố trong bảng tuần hoàn. Mua xong, mở đọc ở nút <b>Truyện nguyên tố</b> trên màn hình chính.</div>
          </div>
          <div>
            ${storiesOwned()
              ? `<span style="color: var(--green); font-weight: bold; font-size: 15px">Đã sở hữu</span>`
              : `<button class="btn" id="buyStories" style="min-width: 100px; font-family:var(--fh)">${STORIES_PRICE} ${ico('coinred', 14)} Mua</button>`
            }
          </div>
        </div>` : ''}
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
          spendCoins(5);
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
          spendCoins(3);
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
          spendCoins(5);
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
          spendCoins(3);
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
    const btnStories = ov.querySelector('#buyStories');
    if(btnStories){
      btnStories.onclick = () => {
        if(achCoins() >= STORIES_PRICE){
          spendCoins(STORIES_PRICE);
          save.items.stories = true;
          persist();
          SFX.page();
          toast('Đã sở hữu Truyện Kể Các Nguyên Tố — đọc ở màn hình chính!');
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

// chế độ khám phá của minigame hoá trị (che-do.js): mở khi ngày đó đạt 3 sao, ở chế độ thường hay chế độ khó (sơ đồ
// Lewis) đều được — nút ở màn kết quả
const exploreBtn = (day, i, iconOnly) => day.mg === 'valence' && Math.max(save.stars[i+1] || 0, save.starsHard[i+1] || 0) >= 3
  ? (iconOnly ? resBtn('bexplore', 'flask', 'Khám phá') : `<button class="btn" id="bexplore">${ico('flask')} Khám phá</button>`) : '';
function bindExplore(i){ const b = G.querySelector('#bexplore'); if(b) b.onclick = () => go(() => startVlExplore(i)); }

/* =====================  BÀI GIẢNG KIỂU VISUAL NOVEL  =====================
   Lần đầu trò mở một ngày, giáo sư đứng cạnh bảng đen giảng lý thuyết (lời ở js/bai-giang.js) rồi mới
   vào chơi (playDay). Bấm / phím cách / Enter / → sang câu kế (đang gõ dở thì hiện hết câu), ← xem lại
   câu trước. Ngày đã chơi trước khi có bài giảng (có sao hoặc có trong nhật ký) thì coi như đã nghe.
   Có onEnd (xem lại từ thẻ Tạm nghỉ): bài giảng phủ lên trên ca đang dừng, xong thì gỡ đi rồi gọi onEnd. */
const lessonSeen = num => (save.lessons || []).includes(num) || save.hist.some(h => h.d === num)
  || (save.stars[num] || 0) > 0 || (save.starsHard[num] || 0) > 0;
/* Chế độ khó: ngày nào có bài trong BAI_GIANG_KHO thì giảng bài đó thay cho bài thường (cả lúc Xem lại bài giảng),
   và lần đầu chơi ngày đó ở chế độ khó cũng được nghe — nhớ riêng trong save.lessonsHard. */
const lessonHard = i => hardOn() && !!BAI_GIANG_KHO[i+1];
const lessonHardSeen = num => (save.lessonsHard || []).includes(num) || save.hist.some(h => h.d === num && h.h)
  || (save.starsHard[num] || 0) > 0;
function parseLesson(s){
  let e = 'neutral';
  if(s.startsWith(':)')){ e = 'happy'; s = s.slice(2); }
  else if(s.startsWith(':(')){ e = 'annoy'; s = s.slice(2); }
  const [t, b] = s.split('||');
  return {e, t: t.trim().normalize('NFC').replace(/\*([^*]+)\*/g, '<b>$1</b>'), b: b ? b.trim() : ''};
}
// viết một dòng lên bảng (|| trong lời thoại): ; là xuống dòng, chữ dài thì thu nhỏ cho vừa, rồi "viết phấn" lại từ đầu
function vnWrite(body, b){
  body.style.fontSize = '';
  body.innerHTML = b.split(';').map(x => '<div>' + handSub(x.trim()) + '</div>').join('');
  for(let fs = 34; fs > 18 && body.scrollWidth > body.clientWidth; fs -= 2) body.style.fontSize = fs + 'px';
  body.classList.remove('write'); void body.offsetWidth; body.classList.add('write');
  if(b) SFX.grain();
}
// bảng giữ dòng gần nhất (tính cả câu đang nói) có ghi bảng
const vnBoardAt = (lines, k) => { for(let j = k; j >= 0; j--) if(lines[j].b) return lines[j].b; return ''; };
/* Lõi visual novel dùng chung (bài giảng, chuyến tham quan): gõ từng chữ vào .vntext (không hiện tiến độ câu).
   Bấm / phím cách / Enter / → sang câu kế (đang gõ dở thì hiện hết câu), ← xem lại câu trước, nút .vnskip là bỏ qua.
   on.say(k, L): màn tự vẽ phần riêng của câu k (bảng, nét mặt, cảnh nền); on.gate(k): false = chưa cho sang câu kế
   (đang chờ trò chọn đáp án); on.end(): hết câu hoặc bỏ qua. Trả về type(html): gõ một lời khác ngay tại chỗ. */
function vnRun(root, lines, on){
  const box = root.querySelector('.vnbox'), text = root.querySelector('.vntext');
  let k = -1, chars = [], shown = 0, timer = 0, ended = false;
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
  // tách từng chữ thành <span> ẩn rồi hiện dần: chữ đã dàn trang sẵn nên không nhảy dòng khi đang gõ
  const type = html => {
    text.innerHTML = html;
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
  const say = n => {
    k = n;
    if(on.say) on.say(k, lines[k]);
    type(lines[k].t);
  };
  const end = () => {
    if(ended) return;
    ended = true;
    clearInterval(timer);
    removeEventListener('keydown', onKey);
    on.end();
  };
  const next = () => {
    if(ended) return;
    if(timer) finish();
    else if(on.gate && !on.gate(k)) return;
    else if(k < lines.length - 1) say(k + 1);
    else end();
  };
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
  return {type};
}
function showLesson(i, onEnd){
  SFX.music(themeOf(i));
  const hard = lessonHard(i), lines = (hard ? BAI_GIANG_KHO[i+1] : BAI_GIANG[i]).map(parseLesson);
  const html = `<div class="scene vnscene${onEnd ? ' vnover' : ''}">
    <div class="vnboard"><div class="vnbtitle">Ngày ${i+1} · ${DAYS[i].t}${hard ? ' · <span class="vnhard">khó</span>' : ''}</div><div class="vnbody"></div></div>
    <div class="vnbox"><div class="vnname"><span>Giáo sư Hoffmann</span></div><p class="vntext"></p></div>
    <div class="vnprof">${profSVG('neutral', profSkinFor(i))}</div>
    <button class="btn vnskip">${onEnd ? 'Đóng ' + ico('close') : 'Bỏ qua ' + ico('next')}</button></div>`;
  if(onEnd){
    // nút vừa bấm ở thẻ Tạm nghỉ vẫn giữ focus: phím cách lúc này sẽ bấm lại nó thay vì sang câu
    if(document.activeElement) document.activeElement.blur();
    G.insertAdjacentHTML('beforeend', html);
  } else G.innerHTML = html;
  const root = onEnd ? G.lastElementChild : G.querySelector('.vnscene'), body = root.querySelector('.vnbody'), prof = root.querySelector('.vnprof');
  let board = '';
  vnRun(root, lines, {
    say: (k, L) => {
      prof.firstElementChild.dataset.exp = L.e;
      prof.classList.remove('talk'); void prof.offsetWidth; prof.classList.add('talk');
      const b = vnBoardAt(lines, k);
      if(b !== board) vnWrite(body, board = b);
    },
    end: () => {
      if(onEnd){ root.classList.add('closing'); setTimeout(() => { root.remove(); onEnd(); }, OV_CLOSE_MS); return; }
      const key = hard ? 'lessonsHard' : 'lessons';
      if(!(save[key] || []).includes(i+1)){ save[key] = [...(save[key] || []), i+1]; persist(); }
      go(() => playDay(i));
    }
  });
}

/* Vào một ngày (lịch, Chơi lại, Ngày tiếp): lần đầu thì nghe bài giảng trước, rồi dựng ngay bàn thí nghiệm / minigame
   dưới một màn tối — chữ "Bắt đầu" rơi từ trên xuống, đứng giữa START_HOLD giây, rơi tiếp ra khỏi màn, màn sáng lại
   thì đồng hồ mới chạy (startCurtain). */
function playDay(i){
  if(lessonHard(i) ? !lessonHardSeen(i+1) : BAI_GIANG[i] && !lessonSeen(i+1)) return showLesson(i);
  (DAYS[i].trip ? startTrip : DAYS[i].mg ? startMinigame : startLab)(i);   // startTrip: js/tham-quan.js
}
// thời lượng từng nhịp (giây) — tối dần, chữ rơi vào, đứng giữa, rơi ra, sáng lại; style.css chia % theo đúng các số này
const START_HOLD = .5, START_MS = (.2 + .3 + START_HOLD + .3 + .2)*1000;
const curtainOn = () => save.settings.curtain !== false;   // màn "Bắt đầu": bật mặc định, tắt được trong Cài đặt
/* Màn tối phủ lên cảnh vừa dựng, chặn mọi cú bấm. Minigame: mgHeld thấy .startov nên đồng hồ câu đứng; bàn thí nghiệm:
   startLab chưa bật đồng hồ, xong màn này mới bật — trừ khi thẻ Tạm nghỉ đang mở (rời tab giữa chừng).
   Tắt màn này trong Cài đặt thì đồng hồ chạy ngay. */
function startCurtain(){
  // ca bắt đầu chạy: giáo sư giới thiệu dụng cụ mới / bước đầu tiên (updateCoach chỉ nói khi đồng hồ đã chạy)
  const go = () => { if(lab && lab.timer === null && !G.querySelector('.overlay')){ lab.timer = setInterval(labTick, 1000); updateCoach(); } };
  if(!curtainOn()) return go();
  const c = document.createElement('div');
  c.className = 'startov';
  c.style.animationDuration = START_MS + 'ms';
  c.innerHTML = `<b style="animation-duration:${START_MS}ms">Bắt đầu</b>`;
  G.appendChild(c);
  setTimeout(() => { if(c.isConnected) SFX.bell(); }, 500);      // chữ vừa chạm giữa màn
  c.addEventListener('animationend', e => {
    if(e.target !== c) return;
    c.remove();
    go();
  });
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
// điều kiện dài (đp, có màng ngăn) thì kéo dài mũi tên cho chữ khỏi tràn sang hai vế; ⇌ vẽ hai nửa mũi tên ngược chiều
const handArrow = r => { const w = Math.max(64, rxOver(r).length*10);
  return '<span class="harr"><i>'+handSub(rxOver(r))+'</i>'
    + '<svg viewBox="0 0 '+w+' 14" style="width:'+w+'px"><path d="'+(r.rev
      ? 'M3 5 L'+(w-5)+' 5 L'+(w-13)+' 1 M'+(w-3)+' 10 L5 10 L13 14'
      : 'M3 7.5 Q20 6 '+(w-6)+' 7 M'+(w-14)+' 2 L'+(w-5)+' 7 L'+(w-14)+' 12')+'"/></svg></span>'; };
// Các phương trình đã cân bằng, lưới 3 cột (vế trái | mũi tên | vế phải) để mũi tên thẳng hàng.
function handEqRows(eqs){
  return '<div class="hrows">' + eqs.map(idx => {
    const r = REACTIONS[idx];
    return '<span>'+handSub(eqSide(r, r.rg))+'</span>' + handArrow(r) + '<span>'+handSub(eqSide(r, r.pr, true))+'</span>';
  }).join('') + '</div>';
}

// Một vế phương trình với ô nhập hệ số cho TỪNG chất (kể cả hệ số 1).
// n: số ô chất của vế này (bằng nhau ở mọi dòng để dấu + và mũi tên thẳng cột);
// lead: ô trống dồn lên đầu (vế trái, sát mũi tên) hay xuống cuối (vế phải).
// r: phản ứng, để ghi (đặc) / (loãng) sau công thức; mark: vế sản phẩm thì ghi thêm ↑ / ↓
function eqEditableTerms(r, obj, mark, eid, n, lead){
  const terms = Object.keys(obj).map(f => {
    const m = rxTag(r, f) + (mark ? rxMark(r, f) : '');
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
    + eqEditableTerms(r, r.rg, false, eid, nl, true)
    + handArrow(r)
    + eqEditableTerms(r, r.pr, true, eid, np, false)
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

// Tờ giấy cân bằng — KHÔNG bắt buộc. Mở từ tờ giấy ghim trên tường lúc làm ca
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
    + '<div class="settingrow"><div><b style="'+lbl+'">'+ico('screen',15)+' Tỷ lệ màn hình</b></div>'
    + '<div class="resstep"><button class="btn" id="resPrev" aria-label="Tỷ lệ trước">'+ico('back',16)+'</button>'
    + '<b id="resVal"></b><button class="btn" id="resNext" aria-label="Tỷ lệ sau">'+ico('next',16)+'</button></div></div>'
    + '<div class="settingrow"><div><b style="'+lbl+'">'+ico('trash',15)+' Xoá dữ liệu trò chơi</b></div>'
    + '<button class="btn danger" id="breset">Xoá</button></div>'
    + '</div><div class="hcol">'
    + tgl('tglFull','expand','Toàn màn hình',fsOn(),!fsOK())
    + tgl('tglCards','star','Thẻ phản ứng',cardsOn())
    + tgl('tglBalance','note','Giấy cân bằng sẵn',!balanceOn(),!nobalOwned())
    + (hardUnlocked() ? tgl('tglHard','flask','Chế độ khó',hardOn()) : '')
    + tgl('tglCurtain','play','Màn "Bắt đầu"',curtainOn())
    + '<button class="btn about" id="babout">'+ico('info',15)+' Giới thiệu</button>'
    + '</div></div></div>';
  const flip = (id, key, get, after) => ov.querySelector(id).onclick = e => {
    save.settings[key] = key === 'balance' ? get() : !get(); persist();   // 'balance' lưu ngược: công tắc = tắt cân bằng
    e.currentTarget.classList.toggle('on', get());
    e.currentTarget.setAttribute('aria-checked', get());
    SFX.clink();
    if(after) after();
  };
  const lockedTgl = (id, msg) => ov.querySelector(id).onclick = () => { SFX.err(); notify(ico('lock',16)+' '+msg); };
  flip('#tglCards', 'cards', cardsOn);
  flip('#tglCurtain', 'curtain', curtainOn);
  if(hardUnlocked()) flip('#tglHard', 'hard', hardOn);   // ngoài chế độ dev không có công tắc này
  if(nobalOwned()) flip('#tglBalance', 'balance', () => !balanceOn());
  else lockedTgl('#tglBalance', 'Mua vật phẩm ở Cửa hàng để mở khoá!');
  // toàn màn hình không lưu vào save: trình duyệt chỉ cho bật khi người chơi bấm; công tắc theo trạng thái thật (xem fullscreenchange)
  if(fsOK()) ov.querySelector('#tglFull').onclick = () => { SFX.clink(); setFullscreen(!fsOn()); };
  else lockedTgl('#tglFull', 'Trình duyệt này không cho bật toàn màn hình — thử phím F11 nhé!');
  const showRes = () => {
    const i = Math.max(0, SCREEN_RES.findIndex(r => r[0] === (save.settings.res || 'auto')));
    ov.querySelector('#resVal').textContent = SCREEN_RES[i][1];
    return i;
  };
  const stepRes = d => {
    const i = (showRes() + d + SCREEN_RES.length) % SCREEN_RES.length;
    save.settings.res = SCREEN_RES[i][0]; persist();
    showRes(); fit(); SFX.clink();
  };
  ov.querySelector('#resPrev').onclick = () => stepRes(-1);
  ov.querySelector('#resNext').onclick = () => stepRes(1);
  showRes();
  bindVolSliders(ov);
  ov.querySelector('#mclose').onclick = () => closeOv(ov);
  ov.querySelector('#babout').onclick = aboutModal;
  ov.querySelector('#breset').onclick = () => confirmModal(
    '<h2>'+ico('trash',22)+' Xoá dữ liệu?</h2><p style="margin:8px 0">Toàn bộ tiến trình, sao và thành tựu sẽ bị xoá và không thể khôi phục.</p>',
    () => { save = {unlocked:1, stars:{}, starsHard:{}, best:{}, bestHard:{}, ach:[], served:0, spent:0, rx:[], hist:[], settings:{balance:true}, lich:3}; persist(); closeOv(ov); notify('Đã xoá dữ liệu.'); showMenu(); },
    'Xoá hết', 'Giữ lại');
  G.appendChild(ov);
}

// Giới thiệu (góc dưới phải Cài đặt): tên game, game là gì, số liệu nội dung, tác giả — sửa chữ ở đây
function aboutModal(){
  const n = (v, t) => '<b>' + v + '</b> ' + t;
  modal('<h2>'+ico('info',22)+' Giới thiệu</h2>'
    + '<p style="margin:6px 0 2px;font-family:var(--fh);font-size:20px">Trợ Lý Hóa Học Nhí</p>'
    + '<p style="margin:0 0 12px;opacity:.7"><i>Trợ lý phòng thí nghiệm của giáo sư Hoffmann</i></p>'
    + '<p style="margin:0 0 10px">Game pha chế bám sát chương trình Khoa học tự nhiên lớp 8–9: mỗi ngày người trong xóm đến đặt một chất, '
    + 'và bạn tự cân, đong, đun, lọc, hứng khí để tạo ra nó.</p>'
    + '<p style="margin:0 0 10px">' + [n(DAYS.length, 'ngày'), n(Object.keys(CHEMS).length, 'hoá chất'),
        n(REACTIONS.length, 'phản ứng'), n(Object.keys(ACH).length, 'thành tựu')].join(' · ') + '</p>'
    + '<p style="margin:0">Làm bởi <b>BewyBoy</b> · <a href="https://github.com/BewyBoy/Chemlab-Assistant" target="_blank" rel="noopener">Mã nguồn trên GitHub</a></p>',
    null, 'about');
}

/* =====================  RESULT & GRADING  ===================== */
/* Thẻ kết quả = PHIẾU BÁO CÁO CA kẹp trên bìa kẹp giấy nâu. Cảnh vừa chơi đứng hình, tối lại phía sau; bìa trượt lên
   giữa màn. Các dòng điểm hiện dần như đang viết tay; viết xong số nào thì TỔNG ĐIỂM đếm lên thêm chừng ấy, và ba sao
   XẾP LOẠI rót theo tổng đang đếm — ba sao là ba khúc của thanh điểm (sao 1 từ 0 tới mốc 1, sao 2 từ mốc 1 tới mốc 2…),
   đầy sao thì sao nảy và loé tia. Giáo sư viết nhận xét, ký tên; phá kỷ lục thì một dải giấy đánh dấu "Kỷ lục mới!"
   dán chìa ra mép phải. Bấm vào phiếu là tua nhanh tới cuối. Dùng chung cho mọi ngày và ca tự do. */
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
  <polygon points="${STAR_PTS}" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-linejoin="round"/>
  <g class="lsray">${[0, 45, 90, 135, 180, 225, 270, 315].map(a =>
    `<path d="M12 -1.5V-4.5" transform="rotate(${a} 12 12)"/>`).join('')}</g></svg>`;
// nút trên thẻ kết quả: chỉ có hình, cùng một cỡ vuông; chữ nằm ở title / aria-label
const resBtn = (id, icon, label, cls = '') =>
  `<button class="btn icobtn resbtn${cls}" id="${id}" aria-label="${label}" title="${label}">${ico(icon, 30)}</button>`;
// nút vuông trên thẻ Tạm nghỉ: chỉ có hình, chữ nằm ở title / aria-label (như resBtn)
const pauseBtn = (id, icon, label, cls = '') =>
  `<button class="btn pbtn${cls}" id="${id}" aria-label="${label}" title="${label}">${ico(icon, 32)}</button>`;
/* r: {day: số ngày hay chữ, name: tên bài, hard, rows: [{l: nhãn, v: số, plus: ghi dấu +, add: cộng vào tổng}…],
       total: {l: nhãn, best: kỷ lục cũ (null khi vừa phá)}, lim: ba mốc sao, rec: phá kỷ lục,
       cheer: nhận xét, why: dòng nhắc lỗi (đỏ), btns: các nút (resBtn)} */
function resultCard(r){
  // chụp lại cảnh đang có làm nền (canvas không tự chép hình khi clone nên vẽ lại từ bản gốc)
  const bg = document.createElement('div');
  bg.className = 'resbg'; bg.inert = true;
  [...G.children].forEach(c => {
    if(c.matches('.overlay, .toast, .pagewipe')) return;
    const cp = bg.appendChild(c.cloneNode(true)), dst = cp.querySelectorAll('canvas');
    c.querySelectorAll('canvas').forEach((cv, n) => { if(cv.width && cv.height) dst[n].getContext('2d').drawImage(cv, 0, 0); });
  });
  G.innerHTML = `<div class="scene resscene"><div class="rpboard">
    <div class="rpclip"><i class="rpplate"></i><i class="rpbar"></i><i class="rpring"></i></div>
    <div class="rppaper">
      <h2 class="rph">BÁO CÁO CA${r.hard ? ' <span>· chế độ khó</span>' : ''}</h2>
      <div class="rpfield">Ngày: <span class="rpfill rpday">${r.day}</span> Bài: <span class="rpfill">${r.name}</span></div>
      <div class="rpsec">I. KẾT QUẢ</div>
      ${r.rows.map((w, k) => `<div class="rprow${!w.v && w.plus ? ' zero' : ''}"><span>${w.l}</span><i></i>
        <b class="rphw" id="rv${k}">${w.plus ? (w.v ? '+' + w.v : '—') : w.v}</b></div>`).join('')}
      <div class="rptotal"><span>${r.total.l}${r.total.best != null ? ' <small>kỷ lục: ' + r.total.best + '</small>' : ''}</span>
        <b class="rphw" id="rtot">0<i></i></b></div>
      <div class="rpsec">II. XẾP LOẠI</div>
      <div class="rprate">${[50, 62, 50].map(liqStar).join('')}</div>
      <div class="rpsec">III. NHẬN XÉT CỦA GIÁO SƯ</div>
      <div class="rplines"><b class="rphw" id="rcheer">${r.cheer}</b>${r.why ? `<b class="rphw red" id="rwhy">${r.why}</b>` : ''}</div>
      <div class="rpsign"><b class="rphw" id="rsig">Hoffmann</b><i>Giáo sư ký tên</i></div>
    </div>
    ${r.rec ? '<div class="rpflag" id="rflag"><span>Kỷ lục mới!</span></div>' : ''}
  </div><div class="rpbtns">${r.btns}</div></div>`;
  G.querySelector('.resscene').after(bg);   // nằm sau thẻ: querySelector('#id') luôn trúng nút của thẻ trước
  SFX.page();
  resFill(G.querySelector('.rpboard'), r);
}
async function resFill(board, {rows, lim, rec}){
  const $ = s => board.querySelector(s), stars = [...board.querySelectorAll('.lstar')], tot = $('#rtot');
  let skip = false;
  board.onclick = () => { skip = true; };   // bấm vào phiếu: tua nhanh tới cuối
  const live = () => board.isConnected;
  const sleep = ms => skip ? Promise.resolve() : new Promise(res => setTimeout(res, ms));   // setTimeout: tab ẩn vẫn chạy xong
  const frac = (x, k) => { const lo = k ? lim[k - 1] : 0; return Math.max(0, Math.min(1, (x - lo)/(lim[k] - lo))); };
  let cur = 0, glug = 0;
  const show = x => {
    tot.firstChild.nodeValue = Math.round(x);
    stars.forEach((s, k) => {
      const f = frac(x, k);
      // mặt sóng: 23 = dưới đáy sao (rỗng), .3 = tràn đỉnh
      s.querySelector('.lsliq').style.transform = 'translateY(' + (f ? 21.5 - f*21.2 : 23) + 'px)';
      if(f > 0) s.classList.add('fill');
      if(f >= 1 && !s.classList.contains('full')){ s.classList.add('full'); if(!skip) SFX.ding(); }
    });
    const k = stars.findIndex((s, k) => frac(x, k) < 1), f = k < 0 ? 0 : frac(x, k), now = performance.now();
    if(f > 0 && !skip && now - glug > 140){ glug = now; SFX.glug(f); }   // ọc ọc cao dần theo mức sao đang dâng
  };
  const add = async n => {
    const from = cur, to = cur += n, t0 = performance.now(), D = 300 + Math.min(700, n*1.1);
    for(let t = 0; t < 1 && live() && !skip; ){ t = Math.min(1, (performance.now() - t0)/D); show(from + (to - from)*(1 - (1 - t)*(1 - t))); await sleep(16); }
    show(to);
  };
  // chữ viết tay hiện dần từ trái qua phải
  const write = async (el, speed = 9) => {
    if(!el || !live()) return;
    const d = Math.max(220, el.offsetWidth*speed), steps = Math.max(3, Math.round(d/40));
    if(!skip) SFX.scribble(d);
    for(let i = 1; i <= steps && live() && !skip; i++){
      el.style.clipPath = 'inset(-30% ' + (100 - 100*i/steps).toFixed(1) + '% -30% -2%)';
      await sleep(d/steps);
    }
    el.style.clipPath = 'none';
  };
  show(0);
  await sleep(850);   // đợi bìa trượt lên
  for(let k = 0; k < rows.length && live(); k++){
    await write($('#rv' + k));
    if(rows[k].add && rows[k].v) add(rows[k].v);   // tổng đếm lên ngay khi số của dòng được viết xong
    await sleep(rows[k].v ? 380 : 120);
  }
  await sleep(500);
  if(!live()) return;
  show(cur);   // khi tua nhanh: chốt tổng và mức sao
  tot.classList.add('on'); await sleep(450);
  stars.forEach((s, k) => { if(!frac(cur, k)) s.classList.add('off'); });
  await write($('#rcheer'), 7); await write($('#rwhy'), 6); await write($('#rsig'), 5);
  if(live() && rec){ await sleep(200); $('#rflag').classList.add('on'); SFX.stamp(); }
}
function showResult(i, st){
  const day = DAYS[i], num = i+1;
  let sc, count, why = '';
  // sao theo điểm (js/diem.js); mốc 1 / 2 sao = số phần cần theo luật cũ, 3 sao là 170 điểm mỗi phần
  if(day.mg || day.trip){   // minigame và ngày đi thực tế: chấm theo số câu đúng
    const n = st.total;
    sc = runScore(n, st.correct, Math.ceil(n*.5), Math.ceil(n*.75), n > 0 && st.correct === n);
    count = (st.label || 'Trả lời đúng') + ' (' + st.correct + '/' + n + ')';
  } else {
    const all = day.orders.length;
    sc = runScore(all, st.served, day.s1, all, st.served === all && st.wrong === 0 && !st.safety);
    count = 'Đơn hoàn thành (' + st.served + '/' + all + ')';
    // chưa đủ 3 sao vì đâu: giáo sư ghi đỏ trên phiếu, để lượt sau biết phải sửa gì
    const w = [];
    if(st.served < all) w.push('còn ' + (all - st.served) + ' đơn chưa giao');
    if(st.wrong) w.push('giao sai ' + st.wrong + ' lần' + (st.hard ? '' : ' (lần sai đầu tiên đã được bỏ qua)'));
    if(st.safety) w.push(st.safety + ' lỗi an toàn');
    if(w.length && sc.stars < 3) why = 'Chưa đủ 3 sao vì ' + w.join(', ') + '.';
    save.served += st.served;
    if(st.served === all && !st.wrong) unlockAch('clean');
  }
  const stars = sc.stars;
  // save progress — chế độ khó có cột sao và kỷ lục riêng, nhưng qua được thì vẫn mở ngày kế tiếp
  const book = st.hard ? save.starsHard : save.stars, bests = st.hard ? save.bestHard : save.best;
  if(stars > (book[num] || 0)) book[num] = stars;
  const rec = sc.pts > (bests[num] || 0);
  if(rec) bests[num] = sc.pts;
  if(stars >= 1 && num >= save.unlocked && num < DAYS.length){ save.unlocked = num + 1; skipRest(); }
  // nhật ký từng lượt chơi (giữ 400 lượt gần nhất)
  save.hist.push(day.mg || day.trip ? {d:num, h:st.hard ? 1 : 0, s:stars, w:st.total - st.correct, t:Date.now()}
    : {d:num, h:st.hard ? 1 : 0, s:stars, sv:st.served, w:st.wrong, sf:st.safety||0, t:Date.now()});
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
    for(let d=w*7+1; d<=w*7+7; d++) if(!DAYS[d-1].rest && (save.stars[d]||0) < 3) ok = false;   // ngày để trống coi như đã qua
    if(ok) unlockAch('week'+(w+1));
  }
  if(DAYS.every((d, k) => d.rest || (save.stars[k + 1] || 0) >= 1)) unlockAch('all28');
  if(num === 28 && stars === 3) unlockAch('master');
  persist();
  let nx = i + 1; while(DAYS[nx] && DAYS[nx].rest) nx++;   // "Ngày tiếp theo" bỏ qua ngày để trống
  const cheer = stars===3?'Xuất sắc! Không chê vào đâu được!':stars===2?'Làm tốt lắm, gần hoàn hảo rồi!':stars===1?'Ổn đấy! Luyện thêm chút nữa nhé.':'Đừng nản — thử lại nào, ta tin trò!';
  const p = sc.parts;
  resultCard({day:num, name:day.t, hard:st.hard, lim:sc.lim, rec, cheer, why,
    rows:[{l:count, v:p.ok, add:1}, {l:'Tốc độ', v:p.fast, plus:1, add:1}, {l:'Chuỗi', v:p.streak, plus:1, add:1}, {l:'Hoàn hảo', v:p.perfect, plus:1, add:1}],
    total:{l:'TỔNG ĐIỂM', best:rec ? null : bests[num]},
    btns:resBtn('bretry', 'retry', 'Chơi lại') + resBtn('bmap', 'map', 'Bản đồ') + exploreBtn(day, i, true)
      + ((stars>=1 && nx<DAYS.length) ? resBtn('bnext', 'next', 'Ngày tiếp theo', ' main') : '')});
  G.querySelector('#bretry').onclick = () => go(()=>playDay(i));
  G.querySelector('#bmap').onclick = () => go(showMap);
  bindExplore(i);
  const bn = G.querySelector('#bnext');
  if(bn) bn.onclick = () => go(()=>playDay(nx));
}

/* =====================  SCALE TO WINDOW  ===================== */
// Tỷ lệ màn hình (Cài đặt): 'auto' theo đúng hình cửa sổ; tỷ lệ cố định thì phần cửa sổ dư ra để trống.
// Ngoài khoảng 5:4 … 21:9 thì không giãn thêm nữa — cảnh sẽ quá trống — mà để dải trống như cũ.
const SCREEN_RES = [
  ['auto',  'Tự động', 'Vừa khít cửa sổ'],
  ['16:9',  '16:9',    '1920×1080, 1366×768'],
  ['16:10', '16:10',   '1920×1200, 1440×900, MacBook'],
  ['3:2',   '3:2',     'Surface, Chromebook'],
  ['4:3',   '4:3',     '1024×768, iPad'],
  ['5:4',   '5:4',     '1280×1024'],
  ['21:9',  '21:9',    '2560×1080, 3440×1440']];
const RES_MIN = 5/4, RES_MAX = 64/27;
const SCR = document.getElementById('screen');
let BX = 0, BY = 0;   // = --bx / --by: phần màn hình dư ra mỗi bên vùng 1280×720, tính bằng px game
// toàn màn hình: Safari cũ chỉ có bản webkit-; trong iframe không được phép (itch.io tắt nút) thì fsOK() = false
const fsOK = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
const fsOn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function setFullscreen(on){
  const d = document.documentElement;
  const p = on ? (d.requestFullscreen || d.webkitRequestFullscreen).call(d)
               : (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  if(p && p.catch) p.catch(() => notify('Trình duyệt không cho bật toàn màn hình — thử phím F11 nhé!'));
}
// bật/tắt bằng phím Esc / F11 hay nút của trình duyệt cũng phải lật công tắc trong Cài đặt nếu đang mở
['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => {
  const t = G.querySelector('#tglFull');
  if(t && fsOK()){ t.classList.toggle('on', fsOn()); t.setAttribute('aria-checked', fsOn()); }
}));
// hộp của #game trên màn hình: chỉ đổi khi fit() co giãn lại, nên đo một lần rồi nhớ — kéo–thả hỏi nó mỗi lần rê
// chuột, đo lại mỗi lần là bắt trình duyệt tính lại bố cục giữa chừng
let gameBox = null;
const gameRect = () => gameBox || (gameBox = G.getBoundingClientRect());
let benchBX = null;
function fit(){
  gameBox = null;
  const r = save.settings.res, k = r && r !== 'auto' ? r.split(':') : null;
  const a = Math.min(RES_MAX, Math.max(RES_MIN, k ? k[0]/k[1] : innerWidth/innerHeight));
  // vùng game 1280×720 luôn nằm trọn; chiều còn lại nới ra cho khớp tỷ lệ
  const W = Math.max(1280, 720*a), H = Math.max(720, 1280/a);
  const s = Math.min(innerWidth/W, innerHeight/H);
  BX = (W-1280)/2; BY = (H-720)/2;
  SCR.style.width = W+'px'; SCR.style.height = H+'px';
  SCR.style.setProperty('--bx', BX+'px');
  SCR.style.setProperty('--by', BY+'px');
  SCR.style.transform = `translate(-50%,-50%) scale(${s})`;
  const bench = G.querySelector('#benchsvg');            // cạnh trái bàn bám theo mép màn — vẽ lại chỉ khi mép thật sự đổi
  if(bench && (BX !== benchBX || !bench.isConnected)){ benchBX = BX; bench.outerHTML = benchSVG(); }
}
// kéo cửa sổ / thanh địa chỉ điện thoại co giãn bắn hàng chục sự kiện resize: gom lại, mỗi khung hình fit() một lần
let fitQueued = false;
addEventListener('resize', () => { if(fitQueued) return; fitQueued = true; requestAnimationFrame(() => { fitQueued = false; fit(); }); });
