/* =====================================================================
   CÁC CHẾ ĐỘ PHỤ — 6 minigame, thử thách pha nồng độ, chế độ khó trong ca (tự cân đong),
   thẻ phản ứng hoạt hình.
   ===================================================================== */
'use strict';

/* =====================  MINIGAMES  ===================== */
const shuffle = a => { a = a.slice(); for(let k=a.length-1; k>0; k--){ const j = Math.floor(Math.random()*(k+1)); [a[k],a[j]] = [a[j],a[k]]; } return a; };

function mgFrame(i, day, inner){
  G.innerHTML = `<div class="scene" style="padding:0">
    <div class="hudboard">${sym('sym-benchtex',1240,52,'position:absolute;left:20px;top:6px;opacity:.4;pointer-events:none')}
      <span class="hud-title">Ngày ${i+1} ${ico('dice',17)} ${day.t}</span>
      <div style="flex:1"></div><span class="hudstat" id="mgscore"></span>
      <span class="hudstat" id="mgtime" style="display:none"></span>
      <button class="btn icobtn" id="bquit">${ico('close')}</button></div>
    <div class="mgwrap">${inner}</div></div>`;
  G.querySelector('#bquit').onclick = () => confirmModal(
    '<h2>'+ico('back',22)+' Bỏ dở trò chơi?</h2><p style="margin:8px 0">Kết quả ca làm hiện tại sẽ không được tính.</p>',
    () => go(showMap), 'Bỏ dở', 'Chơi tiếp');
}
const mgScore = (c,t) => { G.querySelector('#mgscore').textContent = 'Đúng: '+c+'/'+t; };

function startMinigame(i){
  SFX.music(themeOf(i));
  const day = DAYS[i];
  MG[day.mg](i, day);
}

/* Vật lý trong giỏ phân loại: mỗi mô hình bi–que là MỘT vật rắn ghép từ các hình tròn (bi), khối lượng ∝ r².
   Trọng lực + va chạm bi–bi giữa các vật và với thành / đáy giỏ, giải bằng xung lực có ma sát; chia nhỏ bước
   thời gian cho chồng vật đứng yên được. Đứng yên hết thì tạm dừng vòng lặp, thả vật mới thì chạy lại. */
/* Nhãn giỏ kiểu băng dính dán ngang: cạnh trên / dưới thẳng, hai đầu răng cưa như xé tay. Số răng, độ sâu và độ
   lệch sinh từ chữ trên nhãn nên mỗi nhãn một kiểu mà lần nào mở cũng y như cũ. Vẽ theo cỡ thật của nhãn, và vẽ
   lại khi font đã tải xong (phòng lúc đầu chữ còn đo bằng font dự phòng). */
function tapeLabel(el){
  const seed = [...el.textContent].reduce((s, ch) => (s*31 + ch.charCodeAt(0)) % 2147483647, 7) || 7;
  const draw = () => {
    if(!el.isConnected) return;
    let n = seed;
    const rnd = () => (n = n*16807 % 2147483647)/2147483647;
    const w = el.offsetWidth, h = el.offsetHeight;
    const end = (x, dir) => {                     // dir 1: đầu phải, từ trên xuống; -1: đầu trái, từ dưới lên
      const t = 2 + (rnd() < .5 ? 0 : 1), a = 1 + rnd()*3, seg = 2*t;      // 2–3 răng, sâu 1–4 px
      let d = '';
      for(let k = 1; k < seg; k++){
        const y = h*k/seg + (k % 2 ? (rnd() - .5)*h/seg*.7 : 0);
        d += ` L${(x - dir*(k % 2 ? a : 0)).toFixed(1)} ${(dir > 0 ? y : h - y).toFixed(1)}`;
      }
      return d;
    };
    el.querySelector('.tape')?.remove();
    el.insertAdjacentHTML('afterbegin', `<svg class="tape" width="${w}" height="${h}"><path d="M0 0 L${w} 0${end(w, 1)} L${w} ${h} L0 ${h}${end(0, -1)} Z" `
      + `fill="#fff" stroke="#3b3025" stroke-width="1.5" stroke-linejoin="miter" stroke-miterlimit="6"/></svg>`);
  };
  draw();
  if(document.fonts) document.fonts.ready.then(draw, () => {});
}

function binWorld(){
  const bodies = [], GRAV = 1500, BOUNCE = .25, MU = .45, SUB = 8;
  let raf = 0, last = 0, calm = 0;
  function add(bin, f, x, s){
    const {atoms, bonds} = molGeom(f), Wb = bin.clientWidth;
    let M = 0, cx = 0, cy = 0;
    atoms.forEach(a => { const w = a.r*a.r; M += w; cx += a.x*w; cy += a.y*w; });
    // phân tử dài nhất (Na₂CO₃) không được rộng hơn lòng giỏ, không thì kẹt giữa hai thành
    const R1 = Math.max(...atoms.map(a => Math.hypot(a.x - cx/M, a.y - cy/M) + a.r + STICKER));
    s = Math.min(s, (Wb - 6)/(2*R1));
    // c: bán kính va chạm = bi + viền sticker, để các sticker chạm nhau ở mép trắng chứ không đè lên nhau
    const parts = atoms.map(a => ({x:(a.x - cx/M)*s, y:(a.y - cy/M)*s, r:a.r*s, c:(a.r + STICKER)*s}));
    M = 0; let I = 0;
    parts.forEach(p => { const w = p.r*p.r; M += w; I += w*(p.r*p.r/2 + p.x*p.x + p.y*p.y); });
    const R = R1*s + 3;
    const el = document.createElement('div');
    el.className = 'mbody';
    el.style.cssText = `width:${2*R}px;height:${2*R}px;transform-origin:${R}px ${R}px`;
    el.innerHTML = molDraw(parts.map((p, k) => ({el:atoms[k].el, x:R + p.x, y:R + p.y, r:p.r})), bonds, 2*R, 2*R, s, false);
    bin.appendChild(el);
    const b = {bin, el, R, parts, x:Math.max(R, Math.min(Wb - R, x)), y:-R, a:(Math.random() - .5)*.6,
               vx:(Math.random() - .5)*60, vy:120, w:(Math.random() - .5)*4, im:1/M, iI:1/I};
    bodies.push(b); draw(b);
    calm = 0; if(!raf){ last = performance.now(); raf = requestAnimationFrame(tick); }
  }
  const world = b => { const c = Math.cos(b.a), s = Math.sin(b.a);
    return b.parts.map(p => ({x:b.x + p.x*c - p.y*s, y:b.y + p.x*s + p.y*c, r:p.c})); };
  const push = (A, B, ra, rb, ix, iy) => {
    if(A){ A.vx -= ix*A.im; A.vy -= iy*A.im; A.w -= (ra[0]*iy - ra[1]*ix)*A.iI; }
    B.vx += ix*B.im; B.vy += iy*B.im; B.w += (rb[0]*iy - rb[1]*ix)*B.iI;
  };
  // tiếp xúc tại (px,py), pháp tuyến n hướng từ A sang B, lún sâu depth; A = null là thành giỏ (đứng yên)
  function hit(A, B, px, py, nx, ny, depth){
    const imA = A ? A.im : 0, iIA = A ? A.iI : 0;
    const corr = Math.max(depth - .3, 0)*.5/(imA + B.im);           // đẩy hai vật ra khỏi nhau
    if(A){ A.x -= nx*corr*imA; A.y -= ny*corr*imA; }
    B.x += nx*corr*B.im; B.y += ny*corr*B.im;
    const ra = A ? [px - A.x, py - A.y] : [0, 0], rb = [px - B.x, py - B.y];
    const rvx = B.vx - B.w*rb[1] - (A ? A.vx - A.w*ra[1] : 0), rvy = B.vy + B.w*rb[0] - (A ? A.vy + A.w*ra[0] : 0);
    const vn = rvx*nx + rvy*ny;
    if(vn > 0) return;
    const ran = ra[0]*ny - ra[1]*nx, rbn = rb[0]*ny - rb[1]*nx;
    const j = -(1 + (vn < -80 ? BOUNCE : 0))*vn/(imA + B.im + ran*ran*iIA + rbn*rbn*B.iI);
    push(A, B, ra, rb, nx*j, ny*j);
    let tx = rvx - vn*nx, ty = rvy - vn*ny; const tl = Math.hypot(tx, ty);   // ma sát Coulomb
    if(tl < 1e-6) return;
    tx /= tl; ty /= tl;
    const rat = ra[0]*ty - ra[1]*tx, rbt = rb[0]*ty - rb[1]*tx;
    const jt = Math.max(-MU*j, Math.min(MU*j, -(rvx*tx + rvy*ty)/(imA + B.im + rat*rat*iIA + rbt*rbt*B.iI)));
    push(A, B, ra, rb, tx*jt, ty*jt);
  }
  function step(dt){
    bodies.forEach(b => { b.vy += GRAV*dt; b.x += b.vx*dt; b.y += b.vy*dt; b.a += b.w*dt; b.w *= .995; });
    bodies.forEach((B, k) => {
      const Wb = B.bin.clientWidth, Hb = B.bin.clientHeight;
      world(B).forEach(P => {                                          // thành trái, thành phải, đáy giỏ
        if(P.x - P.r < 0) hit(null, B, 0, P.y, 1, 0, P.r - P.x);
        if(P.x + P.r > Wb) hit(null, B, Wb, P.y, -1, 0, P.x + P.r - Wb);
        if(P.y + P.r > Hb) hit(null, B, P.x, Hb, 0, -1, P.y + P.r - Hb);
      });
      for(let j = 0; j < k; j++){                                       // với các vật đã nằm trong cùng giỏ
        const A = bodies[j];
        if(A.bin !== B.bin || Math.hypot(B.x - A.x, B.y - A.y) > A.R + B.R) continue;
        const pa = world(A), pb = world(B);
        pa.forEach(P => pb.forEach(Q => {
          const dx = Q.x - P.x, dy = Q.y - P.y, d = Math.hypot(dx, dy);
          if(d >= P.r + Q.r || d < 1e-6) return;
          hit(A, B, P.x + dx/d*P.r, P.y + dy/d*P.r, dx/d, dy/d, P.r + Q.r - d);
        }));
      }
    });
  }
  const draw = b => { b.el.style.transform = `translate(${b.x - b.R}px,${b.y - b.R}px) rotate(${b.a}rad)`; };
  function tick(now){
    if(!bodies[0].bin.isConnected){ raf = 0; return; }                  // rời minigame: dừng hẳn
    const dt = Math.min(now - last, 34)/1000; last = now;
    for(let k = 0; k < SUB; k++) step(dt/SUB);
    bodies.forEach(draw);
    calm = bodies.every(b => Math.hypot(b.vx, b.vy) < 12 && Math.abs(b.w) < .4) ? calm + 1 : 0;
    raf = calm > 45 ? 0 : requestAnimationFrame(tick);
  }
  return {add};
}

/* Dung dịch trong cốc nhỏ (minigame xác định chất): mô phỏng vật lý vẽ trên canvas, toạ độ px tính từ góc trên
   trái lòng cốc, rest = độ cao mặt nước lúc yên.
   – Mặt nước: N cột nối nhau như lò xo (phương trình sóng có tắt dần) — giọt rơi, bọt vỡ làm gợn sóng lan ra
     và dội lại ở thành cốc.
   – Kết tủa: hạt rắn chịu trọng lực + cản nhớt (nên chìm đều với vận tốc giới hạn ≈ g/DRAG) + xáo động nhẹ.
     Chạm đáy thì hạt nhập vào lớp cặn; lớp cặn dốc quá SLOPE thì sụt dần sang hai bên như cát đổ (góc nghỉ).
     Hạt còn lơ lửng vẽ thêm quầng mờ: đám đục loang ra từ chỗ giọt rơi rồi tan dần khi hạt lắng. Hạt mịn thì không
     bao giờ lắng hết, nên cả cốc ngả dần sang màu kết tủa và giữ lại độ đục nhẹ (turb) như ngoài thực tế.
   – Bọt khí: lực đẩy kéo lên, lắc ngang khi nổi, chạm mặt nước thì vỡ và hất mặt nước lên.
   Đứng yên hết thì dừng vòng lặp; có tác động mới thì chạy lại. */
function liquidSim(cv, W, H, rest, liq){
  const R = Math.max(2, Math.ceil(window.devicePixelRatio || 1)), ctx = cv.getContext('2d');
  cv.width = W*R; cv.height = H*R;
  const N = 26, CW = W/N, TENS = 2500, SPRING = 40, DAMP = 3, DRAG = 3.2, SLOPE = .4, SUB = 4;
  const d = new Float32Array(N), v = new Float32Array(N);   // độ lệch mặt nước (px, dương = lõm xuống) và vận tốc
  const pile = new Float32Array(Math.ceil(W));             // độ dày lớp cặn ở từng px
  let parts = [], bubs = [], col = '#fff', haze = .1, gasEnd = 0, now = 0, raf = 0, last = 0, slump = false;
  let turb = 0, turbTo = 0;                 // độ đục cả cốc lúc này / mức sẽ ngả tới
  const colAt = x => Math.min(N - 1, Math.max(0, x/CW | 0));
  const surf = x => rest + d[colAt(x)];
  const wake = () => { if(!raf){ last = performance.now(); raf = requestAnimationFrame(tick); } };
  function poke(x, s){                       // s > 0: ấn mặt nước xuống (giọt rơi), s < 0: hất lên (bọt vỡ)
    const i = colAt(x);
    v[i] += s; if(i) v[i-1] += s/2; if(i < N - 1) v[i+1] += s/2;
    wake();
  }
  function reset(){ parts = []; bubs = []; gasEnd = 0; pile.fill(0); turb = turbTo = 0; draw(); }
  function ppt(c, n, faint){                 // n hạt kết tủa nở ra từ chỗ giọt rơi (giữa cốc), mỗi hạt trễ một chút
    col = c; haze = faint ? .05 : .11; turbTo = faint ? .16 : .3;
    for(let k = 0; k < n; k++) parts.push({x:W/2 + (Math.random() - .5)*16, y:rest + 2 + Math.random()*4,
      vx:(Math.random() - .5)*170, vy:Math.random()*60, r:faint ? .9 + Math.random()*.6 : 1.3 + Math.random()*.9,
      g:(faint ? 18 : 45) + Math.random()*35, wait:Math.random()*.45});
    wake();
  }
  function gas(sec){ gasEnd = now + sec; wake(); }
  function step(dt){
    for(let i = 0; i < N; i++)               // biên phản xạ: cột ngoài cùng coi như có hàng xóm giống hệt nó
      v[i] += (TENS*(d[i ? i-1 : 0] + d[i < N-1 ? i+1 : i] - 2*d[i]) - SPRING*d[i] - DAMP*v[i])*dt;
    for(let i = 0; i < N; i++) d[i] = Math.max(-8, Math.min(8, d[i] + v[i]*dt));
    turb += (turbTo - turb)*Math.min(1, dt*1.2);
    const k = Math.exp(-DRAG*dt);
    parts = parts.filter(p => {
      if(p.wait > 0){ p.wait -= dt; return true; }
      p.vx = (p.vx + (Math.random() - .5)*300*dt)*k; p.vy = (p.vy + p.g*dt)*k;
      p.x += p.vx*dt; p.y += p.vy*dt;
      if(p.x < p.r){ p.x = p.r; p.vx = Math.abs(p.vx)*.3; }
      else if(p.x > W - p.r){ p.x = W - p.r; p.vx = -Math.abs(p.vx)*.3; }
      const top = surf(p.x) + p.r; if(p.y < top){ p.y = top; p.vy = Math.abs(p.vy)*.2; }
      const xi = Math.min(pile.length - 1, Math.max(0, p.x | 0));
      if(p.y < H - pile[xi] - p.r) return true;
      for(let j = -3; j <= 3; j++)                                    // chạm đáy: diện tích hạt rải hình tam giác vào lớp cặn
        pile[Math.min(pile.length - 1, Math.max(0, xi + j))] += Math.PI*p.r*p.r*.9*(4 - Math.abs(j))/16;
      slump = true; return false;
    });
    if(slump){                                // lớp cặn sụt: mỗi bước san bớt một nửa phần dốc quá SLOPE
      slump = false;
      for(let j = 0; j < pile.length - 1; j++){
        const diff = pile[j] - pile[j+1];
        if(Math.abs(diff) <= SLOPE) continue;
        const t = (diff - Math.sign(diff)*SLOPE)/4;
        pile[j] -= t; pile[j+1] += t; slump = true;
      }
    }
    if(now < gasEnd && Math.random() < dt*28){
      const x = 4 + Math.random()*(W - 8);
      bubs.push({x, y:H - pile[x | 0] - 3, r:1.4 + Math.random()*2, vy:0, ph:Math.random()*6});
    }
    bubs = bubs.filter(b => {
      b.vy = (b.vy - (220 + 40*b.r)*dt)*Math.exp(-2.5*dt);
      b.y += b.vy*dt; b.x += Math.sin(now*11 + b.ph)*10*dt;
      if(b.y - b.r > surf(b.x)) return true;
      poke(b.x, -b.r*14); return false;
    });
  }
  function draw(){
    ctx.setTransform(R, 0, 0, R, 0, 0); ctx.clearRect(0, 0, W, H);
    const line = () => { ctx.moveTo(0, rest + d[0]); for(let i = 0; i < N; i++) ctx.lineTo((i + .5)*CW, rest + d[i]); ctx.lineTo(W, rest + d[N-1]); };
    ctx.beginPath(); line(); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = liq; ctx.fill();
    ctx.save(); ctx.clip();
    if(turb > .003){ ctx.fillStyle = col; ctx.globalAlpha = turb; ctx.fillRect(0, 0, W, H); }
    ctx.fillStyle = col; ctx.globalAlpha = haze;
    parts.forEach(p => { if(p.wait <= 0){ ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, 7); ctx.fill(); } });
    ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(59,48,37,.6)'; ctx.lineWidth = .8;
    parts.forEach(p => { if(p.wait <= 0){ ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); ctx.stroke(); } });
    if(pile.some(h => h > .05)){              // lớp cặn: mặt trên vẽ cong qua trung điểm cho mượt, viền mực nhạt
      const top = () => { ctx.moveTo(0, H - pile[0]);
        for(let j = 1; j < pile.length; j++) ctx.quadraticCurveTo(j - .5, H - pile[j-1], j, H - (pile[j-1] + pile[j])/2);
        ctx.lineTo(W, H - pile[pile.length - 1]); };
      ctx.beginPath(); top(); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.beginPath(); top(); ctx.strokeStyle = 'rgba(59,48,37,.45)'; ctx.lineWidth = 1.2; ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.strokeStyle = '#3b3025'; ctx.lineWidth = 1;
    bubs.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); ctx.stroke(); });
    ctx.restore();
    ctx.beginPath(); line(); ctx.strokeStyle = 'rgba(59,48,37,.7)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.stroke();
  }
  function tick(t){
    if(!cv.isConnected){ raf = 0; return; }                          // rời minigame: dừng hẳn
    // mốc giờ của khung đầu có thể SỚM hơn lúc wake() (trình duyệt bóp khung khi ẩn) → dt âm làm sóng nổ tung
    const dt = Math.max(0, Math.min(t - last, 34))/1000; last = t; now += dt;
    for(let s = 0; s < SUB; s++) step(dt/SUB);
    draw();
    const calm = now >= gasEnd && !bubs.length && !parts.length && !slump && Math.abs(turbTo - turb) < .003
      && d.every(x => Math.abs(x) < .04) && v.every(x => Math.abs(x) < .3);
    raf = calm ? 0 : requestAnimationFrame(tick);
  }
  draw();
  return {poke, ppt, gas, reset};
}

const MG = {
 /* --- phân loại (ngày 3: nguyên tử/phân tử; ngày 17: oxit/axit/bazơ/muối). Mỗi lúc chỉ MỘT chất: thẻ vẽ
        mô hình bi–que, công thức ở dưới; kéo thẻ vào giỏ hoặc bấm thẳng vào giỏ. Đúng giỏ: mô hình rơi vào giỏ
        thành vật thật, va chạm với các chất đã nằm đó. Sai giỏ: giỏ nhả thẻ, thẻ văng ra ngoài màn hình —
        mỗi chất chỉ được chọn MỘT lần. --- */
 bins(i, day){
  const items = shuffle(day.items), notes = day.binNotes || [];
  const bins = day.bins.map((b,k)=>`<div class="bincol"><div class="bin" data-b="${k}" data-dz="bin${k}"><span class="binlbl">${b}</span></div>
    <div class="binnote">${notes[k] || ''}</div></div>`).join('');
  mgFrame(i, day, `<div class="mgspot"></div><div class="bins">${bins}</div>`);
  G.querySelectorAll('.binlbl').forEach(tapeLabel);
  // BODY_SC: cỡ mô hình khi nằm trong giỏ (ngày nhiều phân tử lớn đặt binScale nhỏ hơn) — giỏ đầy nhất vẫn có thể
  // chồng cao quá miệng giỏ, nên thẻ chất (.mgspot) và nhãn giỏ (.binlbl) được đặt nổi trên chồng phân tử.
  // DIP_Y: thẻ sai giỏ lọt sâu vào giỏ bao nhiêu px trước khi bị nhả
  const spot = G.querySelector('.mgspot'), world = binWorld(), BODY_SC = day.binScale || 1.875, DIP_Y = 50;
  const miniHTML = f => `<div class="mgspec mini"><div class="molbox"><div class="mol">${molHTML(f, 134, 78, 1.6)}</div></div><div class="fm">${sub(f)}</div></div>`;
  const gRect = el => { const g = G.getBoundingClientRect(), s = g.width/1280, r = el.getBoundingClientRect();
    return {x:(r.left - g.left)/s, y:(r.top - g.top)/s, w:r.width/s, h:r.height/s}; };
  let cur = 0, correct = 0, busy = false, card = null;
  mgScore(0, items.length);
  function show(){
    const f = items[cur][0];
    spot.innerHTML = `<div class="mgspec enter" data-f="${f}">
      ${molBox(f, 450, 270, 3.6)}<div class="fm">${sub(f)}</div></div>`;
    card = spot.firstElementChild; busy = false;
    dragify(card, 'mgcard', {
      w:150, h:118,
      ghostHTML: () => miniHTML(f),
      onDrop: (z, e) => grade(+z.slice(3), gameXY(e)),
      onClick: () => { card.classList.remove('poke'); void card.offsetWidth; card.classList.add('poke'); SFX.clink(); }
    });
  }
  // giỏ nhả thẻ: thẻ lọt xuống giỏ một chút (150ms) rồi văng theo parabol p(t) = p0 + v0·t + ½·a·t² — đa thức
  // bậc 2 theo t — ra trái, ra phải hoặc rơi thẳng xuống đáy màn hình; ra khỏi khung game thì xoá
  function flick(f, from, bin){
    const el = document.createElement('div');
    el.className = 'mgflick'; el.innerHTML = miniHTML(f);
    G.appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight, br = gRect(bin);
    const p0 = {x:br.x + br.w/2, y:br.y + DIP_Y}, start = from || {x:p0.x, y:br.y};
    const r = Math.random(), dir = r < .2 ? 0 : r < .6 ? -1 : 1;               // 20%: gần như rơi thẳng xuống
    const v0 = {x:dir ? dir*(260 + Math.random()*420) : (Math.random() - .5)*120, y:-(480 + Math.random()*380)};
    const acc = 2400, spin = (dir || (Math.random() < .5 ? -1 : 1))*(180 + Math.random()*360);
    const t0 = performance.now(), DIP = 150;
    const place = (x, y, rot, sc) => { el.style.transform = `translate(${x - w/2}px,${y - h/2}px) rotate(${rot}deg) scale(${sc})`; };
    (function frame(now){
      const ms = now - t0;
      if(ms < DIP){ const k = ms/DIP, s0 = from ? 1 : .85; place(start.x + (p0.x - start.x)*k, start.y + (p0.y - start.y)*k, 0, s0 + (.85 - s0)*k); }
      else {
        const t = (ms - DIP)/1000, x = p0.x + v0.x*t, y = p0.y + v0.y*t + acc*t*t/2;
        place(x, y, spin*t, .85);
        if(y - h > 760 || x + w < -40 || x - w > 1320 || !el.isConnected){ el.remove(); return; }
      }
      requestAnimationFrame(frame);
    })(t0);
  }
  function grade(b, drop){                   // drop = điểm thả (toạ độ game) khi kéo; null khi bấm giỏ
    if(busy) return;
    busy = true;
    const [f, right] = items[cur], ok = b === right, bin = G.querySelector('.bin[data-b="'+b+'"]');
    const land = () => {                     // thẻ đã tới miệng giỏ
      bin.classList.remove('flash-ok', 'flash-bad'); void bin.offsetWidth; bin.classList.add(ok ? 'flash-ok' : 'flash-bad');
      if(ok){
        const br = gRect(bin), x = drop ? drop.x - br.x - 4 : br.w/2 - 4 + (Math.random() - .5)*50;
        world.add(bin, f, x, BODY_SC); SFX.coin();
      } else {
        flick(f, drop, bin); SFX.err();
        toast(sub(f) + ' thuộc giỏ ' + day.bins[right] + ' chứ không phải ' + day.bins[b] + '!');
      }
    };
    if(ok){ correct++; mgScore(correct, items.length); }
    card.classList.remove('enter');
    if(drop){ card.classList.add('gone'); land(); }                    // thẻ đã được thả vào giỏ
    else {                                                              // bấm giỏ: thẻ bay từ giữa bàn tới miệng giỏ
      const cr = card.getBoundingClientRect(), br = bin.getBoundingClientRect(), s = cr.width / card.offsetWidth;
      card.style.transform = 'translate(' + (br.left + br.width/2 - cr.left - cr.width/2)/s + 'px,'
        + (br.top - cr.top - cr.height/2)/s + 'px) scale(' + (150*.85/card.offsetWidth).toFixed(3) + ')';   // thu về cỡ thẻ nhỏ sẽ văng ra
      card.classList.add('fly');
      setTimeout(() => { card.style.opacity = 0; land(); }, 350);
    }
    setTimeout(() => {
      if(++cur < items.length) show();
      else setTimeout(() => showResult(i, {correct, total:items.length}), 900);   // cho chất cuối rơi xong
    }, drop ? 650 : 950);
  }
  G.querySelectorAll('.bin').forEach(bn => bn.onclick = () => grade(+bn.dataset.b, null));
  show();
 },

 /* --- ngày 12: xác định chất. Ba lọ mất nhãn đánh số 1–3, nhãn nằm xáo trộn bên dưới.
        Bước 1 — kệ: xem lọ và tên các chất có thể; "Bắt đầu thí nghiệm" thì cả bàn trượt sang trái.
        Bước 2 — bàn: kéo ống nhỏ giọt mẫu 1–3 vào giấy quỳ / cốc thuốc thử (bảng TESTS, phan-ung.js);
                 dung dịch trong cốc là mô phỏng vật lý (liquidSim); dòng chữ hiện tượng chỉ thoáng hiện trên
                 trạm — trò phải tự nhớ, hoặc tự ghi ra giấy.
        Bước 3 — trượt về kệ, kéo nhãn dán vào lọ (dán đè thì hai nhãn đổi chỗ), "Kiểm tra" để chấm.
        Bấm thay kéo cũng được: bấm ống / nhãn để chọn, rồi bấm trạm / lọ.
        Sổ ghi chép (mua ở Cửa hàng, bật/tắt được — labbookOn): đứng yên bên phải, tự ghi từng lần nhỏ thử kèm mẹo
        nhận biết; không có sổ thì khung trượt chiếm cả bề ngang. --- */
 identify(i, day){
  const book = labbookOn();
  const samples = shuffle(pick(day.sets)), labels = shuffle(samples);   // samples[lọ], labels[ô trong khay nhãn]
  const st = ['quy'].concat(day.reagents);                              // trạm 0 = giấy quỳ, còn lại = cốc thuốc thử
  const stName = s => s ? sub(st[s]) : 'quỳ tím';
  const short = f => CHEMS[f].n.split(' (')[0];                         // "Muối ăn (natri clorua)" → "Muối ăn"
  const LIQ = '--lc:#dcecf3';    // mẫu nào cũng trong suốt như nhau — nhìn màu không đoán được
  const LIQ_X = 36, LIQ_Y = 44;  // canvas dung dịch trong .idf-art (khớp .idf-liq): lòng cốc x 16–94, đáy y 112, mặt nước y 58
  // dòng chữ hiện tượng chỉ tả cái mắt thấy, không nói mẫu số mấy
  const seenText = fx => fx.spot ? (fx.col === 'tím' ? 'quỳ không đổi màu' : 'quỳ hoá ' + fx.col)
    : fx.ppt ? 'kết tủa ' + fx.col + (fx.faint ? ' rất ít' : '') : fx.gas ? 'sủi bọt khí' : 'không hiện tượng';
  const pip = (k, w, h) => `<div class="idf-pip">${sym('sym-pipette', w, h, LIQ)}<span class="idf-badge">${k+1}</span></div>`;
  const jarHTML = samples.map((f, k) => `<div class="idf-jar" data-dz="jar${k}">${sym('sym-jar-blank', 170, 240, LIQ)}
      <span class="idf-badge idf-cap">${k+1}</span><span class="idf-num">${k+1}</span><div class="idf-slot"></div><div class="idf-ans"></div></div>`).join('');
  const lblHTML = labels.map(f => `<div class="idf-tslot"><div class="idf-lbl"><b>${sub(f)}</b><small>${short(f)}</small></div></div>`).join('');
  const dropHTML = samples.map((f, k) => `<div class="idf-drop">${pip(k, 44, 160)}</div>`).join('');
  const stHTML = st.map((r, s) => `<div class="idf-st" data-s="${s}" data-dz="${s ? 'rg'+(s-1) : 'quy'}"><div class="idf-art">${s
      ? sym('sym-beaker-small', 110, 120, 'position:absolute;left:20px;top:0') + '<canvas class="idf-liq"></canvas>'
        + sym('sym-beaker-line', 110, 120, 'position:absolute;left:20px;top:0') + '<span class="idf-badge idf-who"></span>'
      : '<div class="idf-tile"><div class="idf-paper"></div></div>' + samples.map((f, k) => `<span class="idf-mark" style="left:${35+40*k}px">${k+1}</span>`).join('')}
    </div><div class="idf-tag">${s ? sub(r) : 'Quỳ tím'}</div></div>`).join('');
  const head = '<tr><th>Mẫu</th>' + st.map((r, s) => '<th>' + (s ? sub(r) : 'Quỳ') + '</th>').join('') + '</tr>';
  const rows = samples.map((f, k) => '<tr><th>' + (k+1) + '</th>' + st.map((r, s) => `<td data-k="${k}" data-s="${s}">·</td>`).join('') + '</tr>').join('');
  mgFrame(i, day, `<div class="idf${book ? '' : ' nobook'}" data-stage="1" data-shelf="look">
    <div class="idf-view"><div class="idf-track">
      <div class="idf-pane">
        <p class="idf-say s1only">Ba lọ dung dịch bong hết nhãn! Mỗi nhãn dưới đây thuộc về một lọ — làm thí nghiệm để biết lọ nào là chất nào.</p>
        <p class="idf-say s3only">Kéo nhãn dán vào đúng lọ (hoặc bấm nhãn rồi bấm lọ). Dán đủ ba lọ thì bấm <b>Kiểm tra</b>.</p>
        <div class="idf-row idf-jars">${jarHTML}</div>
        <div class="idf-tray" data-dz="tray">${lblHTML}</div>
        <div class="idf-btns">
          <button class="btn big s1only" id="idgo">Bắt đầu thí nghiệm ${ico('next')}</button>
          <button class="btn s3only" id="idmore">Làm thêm thí nghiệm ${ico('next')}</button>
          <button class="btn big s3only" id="idcheck" disabled>${ico('check')} Kiểm tra</button>
        </div>
      </div>
      <div class="idf-pane">
        <div class="idf-rack"><div class="idf-row idf-drops">${dropHTML}</div><div class="idf-rackbar"></div></div>
        <div class="idf-row idf-sts">${stHTML}</div>
        <div class="idf-btns"><button class="btn big" id="idlabel">${ico('back')} Quay lại dán nhãn</button></div>
      </div>
    </div></div>${book ? `
    <div class="idf-book">
      <h3>${ico('note', 22)} Sổ ghi chép</h3>
      <table class="idf-tab">${head}${rows}</table>
      <div class="idf-obs">Chưa có thí nghiệm nào — nhỏ thử mẫu để xem hiện tượng.</div>
      <ul class="idf-tips">${st.map(r => '<li>' + TESTS[r].tip + '</li>').join('')}</ul>
    </div>` : ''}</div>`);
  const root = G.querySelector('.idf'), hud = G.querySelector('#mgscore'), obs = G.querySelector('.idf-obs');
  const jars = [...G.querySelectorAll('.idf-jar')], lbls = [...G.querySelectorAll('.idf-lbl')], tslots = [...G.querySelectorAll('.idf-tslot')];
  const btnCheck = G.querySelector('#idcheck'), STEP = ['', 'Bước 1/3 · Xem lọ', 'Bước 2/3 · Thí nghiệm', 'Bước 3/3 · Dán nhãn'];
  const onJar = samples.map(() => null);    // onJar[lọ] = ô khay của nhãn đang dán trên lọ đó
  const busy = {}, rec = {};                // busy[trạm]: đang nhỏ dở · rec['mẫu-trạm']: hiện tượng đã thấy
  let stage = 1, moving = false, done = false, live = false, sel = null;
  lbls.forEach(tapeLabel);
  const sims = {};                          // sims[trạm]: dung dịch trong từng cốc thuốc thử (liquidSim)
  G.querySelectorAll('.idf-liq').forEach((cv, n) => sims[n + 1] = liquidSim(cv, 78, 112 - LIQ_Y, 58 - LIQ_Y, 'rgba(220,236,243,.9)'));
  hud.textContent = STEP[1];

  function unselect(){ if(sel) sel.el.classList.remove('idf-sel'); sel = null; }
  function choose(el, it){                   // bấm để chọn ống / nhãn; bấm lại lần nữa thì bỏ chọn
    const again = sel && sel.el === el;
    unselect();
    if(!again){ sel = Object.assign({el}, it); el.classList.add('idf-sel'); SFX.clink(); }
  }
  // stage 2 = bàn thí nghiệm (khung trượt sang trái); 1 và 3 cùng là kệ lọ, khác nhau ở chữ và nút (data-shelf)
  function goStage(n){
    if(moving || done) return;
    moving = true; setTimeout(() => moving = false, 900);              // đang trượt thì không nhận nút
    stage = n; root.dataset.stage = n;
    if(n !== 2) root.dataset.shelf = n === 1 ? 'look' : 'label';
    hud.textContent = STEP[n]; unselect(); SFX.page();
    if(n === 3 && !live){ live = true; lbls.forEach(liveLabel); }      // bước 1 chỉ xem, chưa cho kéo nhãn
  }
  G.querySelector('#idgo').onclick = () => goStage(2);
  G.querySelector('#idmore').onclick = () => goStage(2);
  G.querySelector('#idlabel').onclick = () => goStage(3);

  /* ---- bước 2: nhỏ mẫu vào trạm ---- */
  G.querySelectorAll('.idf-drop').forEach((d, k) => dragify(d, 'mgdrop', {w:44, h:160,
    ghostHTML: () => pip(k, 44, 160),
    onDrop: z => drip(k, z === 'quy' ? 0 : +z.slice(2) + 1),
    onClick: () => choose(d, {k})}));
  G.querySelectorAll('.idf-st').forEach(el => el.onclick = () => { if(stage === 2 && sel) drip(sel.k, +el.dataset.s); });
  // ống nhỏ giọt hạ xuống trên trạm, ba giọt rơi, rồi hiện tượng hiện ra (có sổ thì ghi luôn vào sổ)
  function drip(k, s){
    if(done || busy[s]) return;
    busy[s] = 1; unselect();
    const art = G.querySelector('.idf-st[data-s="'+s+'"] .idf-art'), res = testOf(st[s], samples[k]);
    const x = s ? 75 : 35 + 40*k, tip = s ? 4 : 30, land = s ? 58 : 65;   // toạ độ trong .idf-art: đầu ống → chỗ giọt rơi
    const p = document.createElement('div');
    p.className = 'idf-pour'; p.style.cssText = `left:${x - 17}px;top:${tip - 122}px`;
    p.innerHTML = sym('sym-pipette', 34, 124, LIQ);
    art.appendChild(p); SFX.pour();
    if(s){                                                              // cốc được thay sạch cho mẫu mới
      sims[s].reset();
      const who = art.querySelector('.idf-who'); who.textContent = k + 1; who.style.display = 'block';
    }
    for(let n = 0; n < 3; n++) setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'idf-drip'; d.style.cssText = `left:${x}px;top:${tip}px;--fall:${land - tip}px`;
      art.appendChild(d); setTimeout(() => d.remove(), 400);
      if(s) setTimeout(() => sims[s].poke(x - LIQ_X, 140), 320);         // giọt chạm mặt nước (hết .32s rơi)
    }, 250 + n*160);
    setTimeout(() => {
      p.remove(); busy[s] = 0;
      if(!art.isConnected) return;                                      // đã bỏ dở minigame
      if(s) inBeaker(s, res.fx); else onPaper(art, k, res.fx);
      // dòng chữ thoáng hiện trên trạm rồi mờ hẳn — giúp nhìn rõ hiện tượng nhạt (hơi đục), nhưng không lưu lại
      art.querySelector('.idf-seen')?.remove();
      art.insertAdjacentHTML('beforeend', `<div class="idf-seen">${seenText(res.fx)}</div>`);
      art.lastElementChild.onanimationend = e => e.target.remove();
      if(!book) return;
      rec[k+'-'+s] = res; tell(k, s);
      const td = G.querySelector(`.idf-tab td[data-k="${k}"][data-s="${s}"]`);
      td.textContent = res.t; td.classList.remove('got'); void td.offsetWidth; td.classList.add('got');
    }, 900);
  }
  // giấy quỳ: mỗi mẫu một vết ở đúng ô số của nó (tâm x = 35 + 40k trong .idf-art = 22 + 40k trong lòng dải giấy),
  // vết nằm lại trên giấy
  function onPaper(art, k, fx){
    art.querySelector('.idf-spot' + k)?.remove();
    art.querySelector('.idf-paper').insertAdjacentHTML('beforeend', `<div class="idf-spot idf-spot${k}" style="left:${3+40*k}px;--c:${fx.spot}"></div>`);
    SFX.clink();
  }
  // cốc thuốc thử: kết tủa nở ra rồi lắng thành đống / sủi bọt khí; không phản ứng thì chỉ còn gợn sóng của giọt rơi
  function inBeaker(s, fx){
    if(fx.ppt){ sims[s].ppt(fx.ppt, fx.faint ? 14 : 70, fx.faint); SFX.tinkle(); }
    else if(fx.gas){ sims[s].gas(2.6); SFX.fizz(); }
  }
  const tell = (k, s) => { obs.innerHTML = `<b>Mẫu ${k+1} + ${stName(s)}:</b> ${rec[k+'-'+s].d}`; };
  G.querySelectorAll('.idf-tab td').forEach(td => td.onclick = () => {      // bấm ô đã ghi để đọc lại hiện tượng
    if(rec[td.dataset.k+'-'+td.dataset.s]) tell(+td.dataset.k, +td.dataset.s);
  });

  /* ---- bước 3: dán nhãn ---- */
  function liveLabel(el, L){
    dragify(el, 'mglabel', {w:146, h:56,
      ghostHTML: () => el.outerHTML,
      onDrop: z => put(L, z === 'tray' ? null : +z.slice(3)),
      onClick: () => { if(done) return; if(onJar.includes(L)) put(L, null); else choose(el, {L}); }});
  }
  jars.forEach((j, J) => j.onclick = () => { if(stage === 3 && sel) put(sel.L, J); });
  // nhãn L → lọ J (null = trả về khay). Lọ đích đã có nhãn thì nhãn cũ sang chỗ nhãn L vừa rời (khay hoặc lọ khác)
  function put(L, J){
    if(done) return;
    unselect();
    const from = onJar.indexOf(L);
    if(from === (J === null ? -1 : J)) return;
    const M = J === null ? null : onJar[J];
    if(from >= 0) onJar[from] = M;
    if(J !== null) onJar[J] = L;
    lbls.forEach((el, n) => {
      const at = onJar.indexOf(n), host = at >= 0 ? jars[at].querySelector('.idf-slot') : tslots[n];
      if(el.parentNode !== host){ host.appendChild(el); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    });
    btnCheck.disabled = onJar.includes(null);
    SFX.clink();
  }
  btnCheck.onclick = () => {
    if(moving || done || onJar.includes(null)) return;
    done = true; unselect();
    G.querySelectorAll('.idf-btns .btn').forEach(b => b.disabled = true);
    let correct = 0, shown = 0;
    jars.forEach((j, J) => setTimeout(() => {                          // lật từng lọ một
      const ok = labels[onJar[J]] === samples[J];
      if(ok){ correct++; SFX.coin(); } else SFX.err();
      j.classList.add(ok ? 'ok' : 'bad');
      j.querySelector('.idf-ans').innerHTML = ok ? ico('check', 16) + ' Đúng!' : ico('close', 16) + ' Là <b>' + sub(samples[J]) + '</b>';
      mgScore(correct, samples.length);
      if(++shown === samples.length) setTimeout(() => { if(root.isConnected) showResult(i, {correct, total:samples.length}); }, 1800);
    }, 300 + J*550));
  };
 },

 /* --- day 10: pick the reducing agent --- */
 redox(i, day){
  let qi = 0, correct = 0;
  mgFrame(i, day, '<div id="qbox" class="paper" style="min-width:560px;text-align:center"></div>');
  mgScore(0, day.quiz.length);
  function ask(){
    if(qi >= day.quiz.length){ showResult(i, {correct, total:day.quiz.length}); return; }
    const q = day.quiz[qi];
    G.querySelector('#qbox').innerHTML = `<p style="opacity:.7">Câu ${qi+1}/${day.quiz.length}</p>
      <h2 style="font-family:var(--fh)">${q.q}</h2><p>Chất khử là chất nào?</p>
      <div class="row" style="justify-content:center">${q.opts.map((op,x)=>`<button class="btn" data-x="${x}">${op}</button>`).join('')}</div>
      <p id="why" style="min-height:26px;font-size:15px"></p>`;
    G.querySelectorAll('#qbox .btn').forEach(b => b.onclick = () => {
      const ok = +b.dataset.x === q.ans;
      if(ok){ correct++; SFX.coin(); } else SFX.err();
      mgScore(correct, day.quiz.length);
      G.querySelector('#why').innerHTML = (ok ? ico('check',15)+' Chuẩn! ' : ico('close',15)+' Chưa đúng. ') + q.why + '.';
      G.querySelectorAll('#qbox .btn').forEach(x => x.disabled = true);
      qi++; setTimeout(ask, 1600);
    });
  }
  ask();
 },

 /* --- day 24: order metals by activity --- */
 sort(i, day){
  const chips = shuffle(day.metals);
  mgFrame(i, day, `<p style="font-size:16px">Bấm lần lượt kim loại <b>MẠNH NHẤT còn lại</b> để xếp dãy hoạt động (mạnh → yếu).</p>
    <div id="slots">${day.metals.map(()=>'<span class="seqslot"></span>').join('>')}</div>
    <div class="mgcards" id="chips">${chips.map(m=>`<div class="mgcard" data-m="${m}">${m}</div>`).join('')}</div>
    <p style="opacity:.7">Mẹo: “Khi Nào May Áo Záp Sắt Đồng Bạc”</p>`);
  let expected = 0, correct = 0, slipped = false;
  mgScore(0, day.metals.length);
  G.querySelectorAll('#chips .mgcard').forEach(c => c.onclick = () => {
    if(c.dataset.m === day.metals[expected]){
      if(!slipped) correct++;
      slipped = false;
      const slot = G.querySelectorAll('.seqslot')[expected];
      slot.textContent = c.dataset.m; slot.classList.add('filled');
      c.classList.add('done');
      expected++;
      mgScore(correct, day.metals.length); SFX.coin();
      if(expected === day.metals.length) setTimeout(()=>showResult(i,{correct,total:day.metals.length}), 700);
    } else {
      slipped = true;
      c.classList.remove('flash-bad'); void c.offsetWidth; c.classList.add('flash-bad');
      SFX.err();
      toast(c.dataset.m + ' chưa phải kim loại mạnh nhất còn lại đâu!');
    }
  });
 },

 /* --- day 31: reaction-chain quiz — pick the right reagent to reach the target --- */
 chain(i, day){
  let ci = 0, si = 0, correct = 0;
  const total = day.chains.reduce((a, c) => a + c.steps.length, 0);
  mgFrame(i, day, '<div id="qbox" class="paper" style="min-width:660px;max-width:900px;text-align:center"></div>');
  mgScore(0, total);
  function ask(){
    if(ci >= day.chains.length){ showResult(i, {correct, total}); return; }
    const ch = day.chains[ci], st = ch.steps[si];
    const crumb = [ch.start].concat(ch.steps.slice(0, si).map(s => s.prod));
    const trail = crumb.join(' → ') + ' → <b style="color:var(--accent)">?</b>' +
      (si < ch.steps.length-1 ? ' → …' : '');
    G.querySelector('#qbox').innerHTML = `<p style="opacity:.7">Chuỗi ${ci+1}/${day.chains.length} · bước ${si+1}/${ch.steps.length} · đích: <b>${ch.target}</b></p>
      <h2 style="font-family:var(--fh)">${trail}</h2><p>Chọn cách đi đúng:</p>
      <div class="row" style="justify-content:center;flex-wrap:wrap">${st.opts.map((op,x)=>`<button class="btn" data-x="${x}">${op}</button>`).join('')}</div>
      <p id="why" style="min-height:44px;font-size:15px"></p>`;
    G.querySelectorAll('#qbox .btn').forEach(b => b.onclick = () => {
      const ok = +b.dataset.x === st.ans;
      if(ok){ correct++; SFX.coin(); } else SFX.err();
      mgScore(correct, total);
      G.querySelector('#why').innerHTML = (ok ? ico('check',15)+' Chuẩn! ' : ico('close',15)+' Chưa đúng — phải "'+st.opts[st.ans]+'". ')
        + st.why + ' → thu được <b>' + st.prod + '</b>.';
      G.querySelectorAll('#qbox .btn').forEach(x => x.disabled = true);
      si++;
      if(si >= ch.steps.length){ ci++; si = 0; if(ci < day.chains.length) toast('Xong chuỗi! Sang chuỗi tiếp theo…'); }
      setTimeout(ask, 2200);
    });
  }
  ask();
 }
};

/* =====================  CHẾ ĐỘ KHÓ: PHA NỒNG ĐỘ (Cₘ & C%)  ===================== */
// Dạy nồng độ mol (Cₘ) và nồng độ phần trăm (C%): dùng CÂN để đong khối lượng chất rắn,
// ỐNG ĐONG để đong thể tích nước / dung dịch gốc. Giao hàng đạt khi mọi số liệu lệch ≤ 5%.
const CONC_TOL = 0.05;                       // sai số tối đa 5%
const within = (v, t) => t > 0 && Math.abs(v - t) <= CONC_TOL * t;
// khối lượng mol tính từ công thức (bảng nguyên tử khối KHTN 8)
const ATOM = {H:1,C:12,N:14,O:16,Na:23,Mg:24,Al:27,P:31,S:32,Cl:35.5,K:39,Ca:40,Mn:55,Fe:56,Cu:64,Zn:65,Ag:108,Ba:137};
// đếm nguyên tử trong một công thức, có ngoặc: 'Ca(OH)2' → {Ca:1, O:2, H:2}
function atomCounts(f){
  let i = 0;
  const grp = () => {
    const m = {}, add = (k, v) => { m[k] = (m[k]||0) + v; };
    while(i < f.length){
      const ch = f[i];
      if(ch === '('){ i++; const inner = grp(); let d = ''; while(/\d/.test(f[i]||'')) d += f[i++]; Object.keys(inner).forEach(k => add(k, inner[k]*(+d||1))); }
      else if(ch === ')'){ i++; return m; }
      else if(/[A-Z]/.test(ch)){ let sy = ch; i++; while(/[a-z]/.test(f[i]||'')) sy += f[i++]; let d = ''; while(/\d/.test(f[i]||'')) d += f[i++]; add(sy, +d||1); }
      else i++;
    }
    return m;
  };
  return grp();
}
function molarMass(f){
  const c = atomCounts(f);
  return Object.keys(c).reduce((s, el) => s + ATOM[el]*c[el], 0);
}
const fmt = (n, d) => (+n.toFixed(d==null?1:d)).toString().replace('.', ',');
const niceCeil = x => { const p = Math.pow(10, Math.floor(Math.log10(x))); const h = p/2; return Math.max(h, Math.ceil(x/h)*h); };
const pick = a => a[Math.floor(Math.random()*a.length)];
const CONC_SOLUTES = ['NaCl','KCl','CuSO4','Na2CO3','NaNO3','C12H22O11']; // chất rắn tan, Mr đẹp

function makeChallenge(){
  for(let tries=0; tries<80; tries++){
    const who = Math.floor(Math.random()*CUSTOMERS.length);
    const kind = pick(['cm_solid','cm_dilute','cpct']);
    const sol = pick(CONC_SOLUTES), Mr = molarMass(sol), nm = CHEMS[sol].n.toLowerCase(), col = CHEMS[sol].c;
    const base = {who, sol, solColor:col};
    if(kind === 'cm_solid'){
      const V = pick([100,150,200,250]), M = pick([0.5,1,2]);
      const n = M*V/1000, mass = n*Mr;
      if(mass > 110) continue;
      return Object.assign(base, {
        order:`Pha ${V} ml dung dịch ${nm} ${fmt(M,2)}M.`,
        hint:`M(${sub(sol)}) = ${fmt(Mr,1)} g/mol · Cₘ = n / V(lít) · n = m / M`,
        aLabel:'Cân (chất tan)', aUnit:'g', aStep:0.1, aMax:niceCeil(mass*2.2), aTarget:mass,
        bUnit:'ml', bMax:niceCeil(V*1.7), bTarget:V,
        totalMode:'b', totalTarget:V, targetC:M, cUnit:'M',
        reveal:(a,b) => b>0 ? (a/Mr)/(b/1000) : 0,
        solve:`n = Cₘ·V = ${fmt(M,2)}·${fmt(V/1000,3)} = ${fmt(n,3)} mol → m = n·M = ${fmt(n,3)}·${fmt(Mr,1)} = <b>${fmt(mass,1)} g</b>; đong <b>${V} ml</b> nước.`
      });
    }
    if(kind === 'cm_dilute'){
      const stockM = pick([1,2]);
      const M = pick([0.25,0.5,1].filter(x => x < stockM));
      const V = pick([100,200,300]);
      const Vs = M*V/stockM, w = V - Vs;
      if(Vs < 10 || w < 10) continue;
      return Object.assign(base, {
        order:`Pha ${V} ml dung dịch ${nm} ${fmt(M,2)}M từ dung dịch gốc ${stockM}M.`,
        hint:`Pha loãng: C₁·V₁ = C₂·V₂ (số mol không đổi), rồi thêm nước cho đủ ${V} ml.`,
        aLabel:`Dung dịch gốc ${stockM}M`, aUnit:'ml', aStep:1, aMax:niceCeil(Vs*2.2), aTarget:Vs,
        bUnit:'ml', bMax:niceCeil(w*1.9), bTarget:w,
        totalMode:'sum', totalTarget:V, targetC:M, cUnit:'M',
        reveal:(a,b) => (a+b)>0 ? stockM*a/(a+b) : 0,
        solve:`V₁ = C₂·V₂ / C₁ = ${fmt(M,2)}·${V} / ${stockM} = <b>${fmt(Vs,1)} ml</b> dung dịch gốc; thêm <b>${fmt(w,1)} ml</b> nước cho đủ ${V} ml.`
      });
    }
    // cpct: nồng độ phần trăm
    const mdd = pick([100,150,200]), P = pick([5,10,15,20]);
    const mct = P*mdd/100, w = mdd - mct;
    if(mct > 110) continue;
    return Object.assign(base, {
      order:`Pha ${mdd} g dung dịch ${nm} ${P}%.`,
      hint:`C% = m(chất tan) / m(dung dịch) × 100 · m(nước) = m(dd) − m(chất tan) · 1 ml nước ≈ 1 g`,
      aLabel:'Cân (chất tan)', aUnit:'g', aStep:0.1, aMax:niceCeil(mct*2.4), aTarget:mct,
      bUnit:'ml', bMax:niceCeil(w*1.6), bTarget:w,
      totalMode:'sum', totalTarget:mdd, targetC:P, cUnit:'%',
      reveal:(a,b) => (a+b)>0 ? a/(a+b)*100 : 0,
      solve:`m(chất tan) = C%·m(dd)/100 = ${P}·${mdd}/100 = <b>${fmt(mct,1)} g</b>; m(nước) = ${mdd} − ${fmt(mct,1)} = <b>${fmt(w,1)} g</b>.`
    });
  }
  return null;
}

let conc = null;
function startConc(){
  SFX.music(3);
  conc = {list: Array.from({length:5}, makeChallenge).filter(Boolean), ci:0, correct:0};
  renderConc();
}
function renderConc(){
  const c = conc.list[conc.ci];
  conc.a = 0; conc.b = 0;
  G.innerHTML = `<div class="scene" style="padding:0">
    <div class="hudboard">
      <span class="hud-title">Chế độ khó · Pha nồng độ</span>
      <div style="flex:1"></div>
      <span class="hudstat">Câu ${conc.ci+1}/${conc.list.length}</span>
      <span class="hudstat">${ico('check',15)} Đúng: <span id="ccor">${conc.correct}</span></span>
      <button class="btn icobtn" id="cmute">${ico(SFX.isMuted()?'mute':'sound')}</button>
      <button class="btn icobtn" id="cquit">${ico('close')}</button>
    </div>
    <style>
      .concwrap{display:flex;gap:30px;justify-content:center;align-items:flex-start;padding:30px 26px}
      .conc-order{max-width:430px}
      .conc-ask{font-family:var(--fh);font-size:19px;margin-top:2px}
      .conc-hint{margin-top:12px;padding:9px 11px;background:#fffdf5;border:1.2px dashed var(--ink);border-radius:6px;font-size:14px;line-height:1.5}
      .conc-bench{display:flex;gap:26px;align-items:center;background:var(--card);border:1.2px solid var(--ink);border-radius:9.6px;padding:20px 24px;}
      .conc-panel{display:flex;flex-direction:column;gap:5px;min-width:310px}
      .conc-read{font-size:15px;margin-top:6px}
      .conc-read b{font-family:var(--fh)}
      .conc-panel input[type=range]{width:310px;accent-color:var(--accent);height:22px;cursor:pointer}
      .conc-face{flex:none}
    </style>
    <div class="concwrap">
      <div class="paper conc-order">
        <div class="row" style="gap:12px;align-items:center">
          <div class="conc-face">${custSVG(c.who,'neutral').replace('<svg ','<svg style="height:104px" ')}</div>
          <div><b style="font-family:var(--fh);font-size:18px">${CUSTOMERS[c.who][0]}</b>
            <div class="conc-ask">“${c.order}”</div></div>
        </div>
        <div class="conc-hint">${ico('book',14)} ${c.hint}</div>
        <div class="row" style="margin-top:14px;gap:8px">
          <button class="btn" id="cbook">${ico('book')} Sổ tay công thức</button>
          <button class="btn big" id="cserve">${ico('flask')} Giao cho khách</button>
        </div>
      </div>
      <div class="conc-bench">
        <svg id="cbk" width="150" height="192" viewBox="0 0 120 152" aria-hidden="true">
          <rect id="cbk-liq" x="17" width="86" y="146" height="0" rx="2"/>
          <path d="M14,10 L14,140 Q14,148 22,148 L98,148 Q106,148 106,140 L106,10" fill="none" stroke="#3b3025" stroke-width="3"/>
          <path d="M14,10 L2,4 M106,10 L118,4" stroke="#3b3025" stroke-width="3" fill="none"/>
        </svg>
        <div class="conc-panel">
          <div class="conc-read">${ico('flask',14)} <b>${c.aLabel}:</b> <span id="craA">0</span> ${c.aUnit}</div>
          <input type="range" id="csA" min="0" max="${c.aMax}" step="${c.aStep}" value="0">
          <div class="conc-read">${ico('flask',14)} <b>Nước:</b> <span id="craB">0</span> ${c.bUnit}</div>
          <input type="range" id="csB" min="0" max="${c.bMax}" step="1" value="0">
        </div>
      </div>
    </div>
  </div>`;
  const sA = G.querySelector('#csA'), sB = G.querySelector('#csB');
  sA.oninput = () => { conc.a = +sA.value; updateConc(); };
  sB.oninput = () => { conc.b = +sB.value; updateConc(); };
  G.querySelector('#cserve').onclick = serveConc;
  G.querySelector('#cbook').onclick = showConcBook;
  G.querySelector('#cquit').onclick = () => go(showMenu);
  G.querySelector('#cmute').onclick = e => { const m = SFX.toggle(); e.currentTarget.innerHTML = ico(m?'mute':'sound'); };
  updateConc();
}
function updateConc(){
  const c = conc.list[conc.ci];
  G.querySelector('#craA').textContent = fmt(conc.a, c.aStep < 1 ? 1 : 0);
  G.querySelector('#craB').textContent = fmt(conc.b, 0);
  const total = c.totalMode === 'b' ? conc.b : conc.a + conc.b;
  const maxV = c.totalTarget * 1.9;
  const H = Math.max(0, Math.min(1, total / maxV)) * 116;
  const liq = G.querySelector('#cbk-liq');
  liq.setAttribute('y', 146 - H); liq.setAttribute('height', H);
  liq.setAttribute('fill', lerpHex('#cfe6f2', c.solColor, conc.a > 0 ? 0.4 : 0));
}
function showConcBook(){
  modal('<h2>'+ico('book',22)+' Sổ tay công thức</h2><div style="text-align:left;font-size:15px;line-height:1.9">'
    + '<div><b>Nồng độ mol:</b> Cₘ = n / V &nbsp;(n: mol chất tan, V: lít dung dịch)</div>'
    + '<div><b>Số mol ↔ khối lượng:</b> n = m / M &nbsp;⇒&nbsp; m = n · M</div>'
    + '<div><b>Pha loãng:</b> C₁·V₁ = C₂·V₂ &nbsp;(số mol chất tan không đổi)</div>'
    + '<div><b>Nồng độ phần trăm:</b> C% = m(chất tan) / m(dung dịch) × 100</div>'
    + '<div style="opacity:.75">m(dung dịch) = m(chất tan) + m(nước); 1 ml nước ≈ 1 g</div>'
    + '<div style="margin-top:6px;opacity:.75">Được chấp nhận nếu mọi số liệu lệch không quá <b>5%</b>.</div></div>');
}
function serveConc(){
  const c = conc.list[conc.ci];
  const total = c.totalMode === 'b' ? conc.b : conc.a + conc.b;
  const okA = within(conc.a, c.aTarget), okT = within(total, c.totalTarget);
  const pass = okA && okT;
  if(pass){ conc.correct++; G.querySelector('#ccor').textContent = conc.correct; SFX.coin(); setTimeout(SFX.clink,150); }
  else SFX.err();
  const achieved = c.reveal(conc.a, conc.b);
  const last = conc.ci >= conc.list.length - 1;
  const chk = ok => ico(ok ? 'check' : 'close', 15);
  const ov = document.createElement('div'); ov.className = 'overlay';
  ov.innerHTML = `<div class="modal" style="max-width:560px">
    <h2>${ico(pass?'check':'close',22)} ${pass?'Chuẩn! Sai số trong 5%':'Chưa đạt — lệch quá 5%'}</h2>
    <div style="text-align:left;font-size:15px;line-height:1.7">
      <div>${chk(okA)} ${c.aLabel}: <b>${fmt(conc.a, c.aStep<1?1:0)} ${c.aUnit}</b> · cần ${fmt(c.aTarget,1)} ${c.aUnit}</div>
      <div>${chk(okT)} Tổng ${c.totalMode==='b'?'thể tích':'khối lượng'}: <b>${fmt(total,1)}</b> · cần ${fmt(c.totalTarget,1)}</div>
      <div style="margin-top:6px">Nồng độ đạt được: <b>${fmt(achieved,2)} ${c.cUnit}</b> · yêu cầu <b>${fmt(c.targetC,2)} ${c.cUnit}</b></div>
      <div style="margin-top:8px;padding-top:8px;border-top:1.2px dashed var(--ink)"><b>Cách tính:</b><br>${c.solve}</div>
    </div>
    <div class="center" style="margin-top:12px"><button class="btn big" id="cnext">${last?'Xem kết quả':'Câu tiếp '+ico('next')}</button></div>
  </div>`;
  G.appendChild(ov);
  ov.querySelector('#cnext').onclick = () => { ov.remove(); if(last) go(concResult); else { conc.ci++; renderConc(); } };
}
function concResult(){
  const n = conc.list.length, cor = conc.correct, r = cor/n;
  const stars = r>=1 ? 3 : r>=.75 ? 2 : r>=.5 ? 1 : 0;
  if(cor > (save.hardBest||0)){ save.hardBest = cor; persist(); }
  const stamps = [0,1,2].map(k => '<span class="starstamp '+(k<stars?'go':'off')+'">'+ico('star',60)+'</span>').join('');
  G.innerHTML = `<div class="scene center" style="padding-top:50px">
    <h2>Kết thúc chế độ khó</h2>
    <div class="stamprow">${stamps}</div>
    <div class="paper" style="max-width:520px;margin:10px auto">
      <p style="font-size:18px">Đúng <b>${cor}/${n}</b> câu · Kỷ lục: <b>${Math.max(cor, save.hardBest||0)}/${n}</b></p>
      <div class="row" style="justify-content:center"><div id="cresprof"></div>
      <p class="hand" style="text-align:left">“${stars===3?'Bậc thầy nồng độ — không lệch một li!':stars>=1?'Khá lắm! Luyện thêm cho chắc công thức nhé.':'Ôn lại Cₘ và C% rồi thử lại nào, trò làm được mà!'}”</p></div>
    </div>
    <div class="row" style="justify-content:center;margin-top:8px">
      <button class="btn" id="cagain">${ico('retry')} Chơi lại</button>
      <button class="btn big" id="cmenu">${ico('map')} Về menu</button>
    </div></div>`;
  G.querySelector('#cresprof').innerHTML = profSVG(stars>=2?'happy':stars>=1?'neutral':'annoy').replace('viewBox','height="120" viewBox');
  G.querySelector('#cagain').onclick = () => go(startConc);
  G.querySelector('#cmenu').onclick = () => go(showMenu);
  if(stars > 0) SFX.bell();
}

/* =====================  CHẾ ĐỘ KHÓ TRONG CA: TỰ TÍNH GAM / ML / LÍT  =====================
   Bản thường: mỗi lần nghiêng lọ = 0,1 mol, phiếu ghi sẵn số mol. Chế độ khó: phiếu ghi
   KHỐI LƯỢNG (gam) hoặc THỂ TÍCH KHÍ (lít, đkc); mỗi lần lấy hoá chất phải tự nhập số gam
   (cân), số ml (ống đong, lọ dung dịch có ghi Cₘ) hoặc số lít khí. Bên trong vẫn quy về
   đơn vị 0,1 mol nên toàn bộ động cơ phản ứng giữ nguyên; chỉ chấm lệch tối đa 5%. */
const GAS_VM = 24.79;   // lít/mol ở đkc (25 °C, 1 bar) — KHTN 8
const SOL_CM = {HCl:2, H2SO4:1, HNO3:1, H3PO4:1, NaOH:1, KOH:1, 'Ca(OH)2':0.5};   // nồng độ lọ dung dịch trên kệ (M)
// lượng một chất trên phiếu hàng: bản thường ghi mol; chế độ khó ghi lít (khí) hoặc gam
function qtyStr(f, units){
  if(!(lab && lab.hard)) return amt(units);
  const n = units/10;
  return CHEMS[f].s === 'k' ? fmt(n*GAS_VM, 2) + ' lít' : fmt(n*molarMass(f), 2) + ' g';
}
// lượng một chất đúng theo dụng cụ lấy nó: khí → lít, dung dịch trên kệ → ml, chất rắn → gam
function doseStr(f, units){
  if(!(lab && lab.hard) || f === 'H2O') return amt(units);
  const n = units/10;
  if(CHEMS[f].s === 'k') return fmt(n*GAS_VM, 2) + ' lít';
  if(SOL_CM[f]) return fmt(n/SOL_CM[f]*1000, 1) + ' ml dd ' + fmt(SOL_CM[f], 2) + 'M';
  return fmt(n*molarMass(f), 2) + ' g';
}
function doseKind(f){
  const c = CHEMS[f];
  if(c.s === 'k') return {tool:'Bình khí có đồng hồ đo', unit:'lít', ask:'Nạp bao nhiêu lít khí <b>'+sub(f)+'</b> (đo ở đkc: 25 °C, 1 bar)?',
                          toUnits: v => v/GAS_VM*10};
  if(SOL_CM[f]) return {tool:'Ống đong', unit:'ml', ask:'Đong bao nhiêu ml dung dịch <b>'+sub(f)+' '+fmt(SOL_CM[f],2)+'M</b>?',
                        toUnits: v => SOL_CM[f]*v/1000*10};
  return {tool:'Cân điện tử', unit:'g', ask:'Cân bao nhiêu gam <b>'+sub(f)+'</b>?', toUnits: v => v/molarMass(f)*10};
}
// hỏi lượng rồi mới rót. Nước là dung môi nên không bắt đong.
function askDose(f, cb){
  if(!lab.hard || f === 'H2O') return cb(f === 'H2O' ? 1 : baseDose());
  const k = doseKind(f);
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = '<div class="modal dosebox"><h2>' + ico('flask',22) + ' ' + k.tool + '</h2>'
    + '<p style="margin:4px 0 12px">' + k.ask + '</p>'
    + '<div class="row" style="justify-content:center"><input id="dosein" class="dosein" inputmode="decimal" autocomplete="off" placeholder="0">'
    + '<b style="font-family:var(--fh);font-size:20px">' + k.unit + '</b></div>'
    + '<div class="dosemsg" id="dosemsg"></div>'
    + '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn big" id="dok">Cho vào</button>'
    + '<button class="btn" id="dno">Huỷ</button></div></div>';
  G.appendChild(ov);
  const inp = ov.querySelector('#dosein'), msg = ov.querySelector('#dosemsg');
  setTimeout(() => inp.focus(), 30);
  const ok = () => {
    const v = parseFloat(inp.value.replace(',', '.'));
    if(!(v > 0)){ msg.textContent = 'Nhập một số lớn hơn 0 nhé (dùng dấu phẩy cho số lẻ: 6,5).'; return; }
    const units = RQ(k.toUnits(v));
    if(units < 0.01){ msg.textContent = 'Ít quá, cân không đo nổi — kiểm tra lại phép tính.'; return; }
    if(units > 40){ msg.textContent = 'Nhiều quá — cốc chỉ chứa nổi cỡ 4 mol thôi. Kiểm tra lại phép tính.'; return; }
    ov.remove(); cb(units);
  };
  ov.querySelector('#dok').onclick = ok;
  ov.querySelector('#dno').onclick = () => ov.remove();
  inp.addEventListener('keydown', e => { if(e.key === 'Enter') ok(); else if(e.key === 'Escape') ov.remove(); });
}
// con đường dùng để giải mẫu: đốt nếu phiếu là đơn đốt, không thì phản ứng ra đúng chất từ kệ
function hardRoute(od){
  const day = lab.day, br = burnRoute(day, od);
  if(br) return br;
  const on = (r, set) => Object.keys(r.rg).every(f => set.has ? set.has(f) : set.includes(f));
  return REACTIONS.find(r => r.pr[od.chem] && on(r, day.chems))
      || REACTIONS.find(r => r.pr[od.chem] && on(r, dayHave(day))) || null;
}
// gợi ý theo bậc sau mỗi lần giao sai: 1 công thức · 2 khối lượng mol · 3 lời giải đủ
function hardHint(od, tier){
  if(!od) return '';
  const f = od.chem, n = od.n/10, gas = CHEMS[f].s === 'k';
  const onShelf = lab.day.chems.includes(f), r = onShelf ? null : hardRoute(od);
  if(tier <= 1) return '<b>Gợi ý 1:</b> ' + (gas ? 'n = V / 24,79 (lít khí ở đkc)' : 'n = m / M')
    + ' → ra số mol ' + sub(f) + (r ? ', rồi theo hệ số phương trình suy ra số mol từng chất cần lấy' : '')
    + '. Rắn: m = n·M · dung dịch: V = n / Cₘ · khí: V = n·24,79.';
  const inv = [...new Set([f].concat(r ? Object.keys(r.rg) : []))].filter(x => x !== 'H2O');
  if(tier === 2) return '<b>Gợi ý 2:</b> ' + inv.map(x => 'M(' + sub(x) + ') = ' + fmt(molarMass(x), 1)).join(' · ');
  if(!r) return '<b>Lời giải:</b> n(' + sub(f) + ') = ' + fmt(n, 3) + ' mol → lấy <b>' + doseStr(f, od.n) + '</b>.';
  const k = n / r.pr[f];
  return '<b>Lời giải:</b> ' + eqStr(r) + ' · n(' + sub(f) + ') = ' + fmt(n, 3) + ' mol → '
    + Object.keys(r.rg).filter(x => x !== 'H2O').map(x => {
        const nx = k * r.rg[x];
        return fmt(nx, 3) + ' mol ' + sub(x) + (lab.day.chems.includes(x) ? ' = <b>' + doseStr(x, nx*10) + '</b>' : ' (tự điều chế)');
      }).join(', ') + '.';
}
function showHardBook(){
  const sols = lab.day.chems.filter(f => SOL_CM[f]);
  modal('<h2>' + ico('book',22) + ' Sổ tay công thức</h2><div style="text-align:left;font-size:15px;line-height:1.85">'
    + '<div><b>Số mol ↔ khối lượng:</b> n = m / M &nbsp;⇒&nbsp; m = n · M</div>'
    + '<div><b>Dung dịch:</b> n = Cₘ · V &nbsp;(V tính bằng <b>lít</b>: 50 ml = 0,05 l)</div>'
    + '<div><b>Chất khí ở đkc</b> (25 °C, 1 bar): V = n · 24,79 &nbsp;(lít)</div>'
    + '<div><b>Theo phương trình:</b> số mol các chất tỉ lệ đúng với hệ số. Vd 2Mg + O₂ → 2MgO: 0,2 mol Mg cần 0,1 mol O₂.</div>'
    + (sols.length ? '<div style="margin-top:4px"><b>Lọ dung dịch hôm nay:</b> ' + sols.map(f => sub(f) + ' ' + fmt(SOL_CM[f],2) + 'M').join(' · ') + '</div>' : '')
    + '<div style="margin-top:6px"><b>Nguyên tử khối:</b> ' + Object.keys(ATOM).map(e => e + ' = ' + fmt(ATOM[e],1)).join(' · ') + '</div>'
    + '<div style="margin-top:6px;opacity:.75">Giao hàng được chấp nhận nếu lệch không quá <b>5%</b>.</div></div>');
}

/* =====================  THẺ PHẢN ỨNG  =====================
   Lần đầu tự tay làm ra một phản ứng (hoặc bấm một dòng trong Sổ tay): mỗi phân tử là một
   chùm bi nguyên tử; bi tách khỏi chất tham gia rồi bay sang ghép thành sản phẩm — số bi mỗi
   màu hai bên bằng nhau, đó chính là cân bằng phương trình. Dựng tự động từ rg/pr trong
   phan-ung.js nên cả 167 phản ứng đều có thẻ, không phải vẽ tay cái nào. */
const ATOM_STYLE = {H:['#ffffff',8], O:['#e0574a',11], C:['#4a4a4a',11], N:['#5b7fe0',11], Cl:['#7cc35a',12],
  S:['#e8d44d',12], P:['#f0954a',12], Na:['#a37ad6',13], K:['#8f5fd0',14], Mg:['#4fb38a',13], Ca:['#9fb8a6',14],
  Al:['#c9a0a8',13], Zn:['#8aa0b8',13], Fe:['#c46a3a',13], Cu:['#d98a4a',13], Ag:['#c8ccd4',14], Ba:['#5fbf8f',14], Mn:['#9b6bb0',13]};
const atomR = el => (ATOM_STYLE[el] || ['#ccc',12])[1];
const RX_NOTES = [
  'Axit gặp bazơ: H của axit bắt tay nhóm OH của bazơ thành nước, phần còn lại ghép thành muối — phản ứng trung hoà.',
  'Bazơ không tan vẫn bị axit "ăn" dần, tạo muối tan và nước.',
  'Kim loại đứng trước H trong dãy hoạt động đẩy được hiđro ra khỏi axit thành khí H₂.',
  'Kim loại kiềm mạnh đến mức đẩy được cả hiđro ra khỏi nước, để lại dung dịch kiềm.',
  'Chất cháy kết hợp với oxi thành oxit — phản ứng hoá hợp, toả rất nhiều nhiệt.',
  'Kim loại mạnh hơn đẩy kim loại yếu hơn ra khỏi dung dịch muối.',
  'Oxit bazơ gặp axit tạo ra muối và nước.',
  'Oxit của kim loại mạnh tan vào nước thành dung dịch bazơ (kiềm).',
  'Oxit của phi kim tan vào nước thành axit.',
  'Oxit axit gặp kiềm tạo muối và nước — vì thế CO₂ làm đục nước vôi trong.',
  'Oxit bazơ và oxit axit kết hợp thẳng với nhau thành muối.',
  'Muối gặp axit đổi thành muối mới và axit mới — thường kèm khí bay lên hoặc kết tủa.',
  'Muối gặp bazơ đổi thành muối mới và bazơ mới — xảy ra khi có kết tủa hoặc khí.',
  'Hai muối đổi "bạn nhảy" cho nhau — chỉ xảy ra khi có chất kết tủa.',
  'Nhiệt tách một chất thành nhiều chất đơn giản hơn — phản ứng phân huỷ.',
  'Chất khử (H₂ hoặc C) giành lấy oxi của oxit kim loại, để lại kim loại.',
  'Clo phản ứng mãnh liệt với kim loại và hiđro, tạo muối clorua hoặc khí HCl.',
  'Nitơ rất trơ, phải ép với hiđro ở nhiệt độ cao mới ra amoniac.',
  'Axit sunfuric đặc háo nước: rút hết H và O khỏi đường, chỉ còn lại than.',
  'Dòng điện tách hợp chất thành những chất đơn giản hơn.'
];
const rxGroupOf = i => { let k = 0; RX_GROUPS.forEach((g, j) => { if(g.i <= i) k = j; }); return k; };
// một phân tử = chùm bi: nguyên tố "trung tâm" ở giữa, O quây quanh, H bám ngoài cùng
// 9 chỗ đầu xếp tay (tâm + chữ thập + chéo), sau đó là các vòng đồng tâm — đủ chỗ cho cả phân tử đường 45 bi
const MOL_OFFS = [[0,0],[1,0],[-1,0],[0,-1],[0,1],[.72,-.72],[-.72,.72],[.72,.72],[-.72,-.72]]
  .concat(...[[1.9,12],[2.8,18],[3.7,24]].map(([R, n]) =>
    Array.from({length:n}, (_, k) => [R*Math.cos(2*Math.PI*k/n), R*Math.sin(2*Math.PI*k/n)])));
function molAtoms(f){
  const cnt = atomCounts(f), rank = e => e === 'H' ? 2 : e === 'O' ? 1 : 0;
  const els = Object.keys(cnt).sort((a, b) => rank(a) - rank(b) || cnt[a] - cnt[b]);
  const list = [];
  els.forEach(e => { for(let k = 0; k < cnt[e]; k++) list.push(e); });
  return list.map((el, k) => ({el, x:MOL_OFFS[k][0]*17, y:MOL_OFFS[k][1]*17}));
}
// một viên bi nguyên tử (thẻ phản ứng + minigame phân loại); chữ sáng trên bi màu tối
const atomInk = c => { const v = parseInt(c.slice(1), 16); return ((v>>16)*0.3 + (v>>8&255)*0.59 + (v&255)*0.11) < 120 ? '#fffdf5' : '#3b3025'; };
function atomBall(a, cls, extra, bare){   // bare: bi trơn, không ghi kí hiệu nguyên tố
  const [col] = ATOM_STYLE[a.el] || ['#ccc']; const d = Math.max(8, a.r*2);
  return '<div class="atom ' + cls + '" style="left:' + a.x + 'px;top:' + a.y + 'px;width:' + d + 'px;height:' + d + 'px;background:'
    + col + ';color:' + atomInk(col) + ';font-size:' + Math.max(7, Math.round(a.r*0.95)) + 'px' + (extra ? ';' + extra : '') + '">' + (!bare && a.r >= 6.5 ? a.el : '') + '</div>';
}
/* Mô hình bi–que theo CÔNG THỨC CẤU TẠO cho các chất của minigame phân loại: a = [nguyên tố, x, y]
   (đơn vị = một độ dài liên kết, y hướng xuống), b = [i, j, bậc liên kết]. Góc thật: H–O–H 105°, O=S=O 120°,
   C–O–H / S–O–H ≈ 110°; H luôn bám vào O. Hợp chất ion (NaCl, CuSO₄…) vẽ theo công thức cấu tạo
   quen thuộc trong sách, mỗi nguyên tử có đúng số "tay" bằng hoá trị. Riêng HNO₃: N hoá trị IV, O thứ ba
   gắn bằng liên kết cho–nhận N→O (vẽ như liên kết đơn) — v ghi số tay của các nguyên tử ngoại lệ đó. */
const MOL_2D = {
  'O2':     {a:[['O',-.55,0],['O',.55,0]], b:[[0,1,2]]},
  'H2':     {a:[['H',-.4,0],['H',.4,0]], b:[[0,1]]},
  'N2':     {a:[['N',-.5,0],['N',.5,0]], b:[[0,1,3]]},
  'Cl2':    {a:[['Cl',-.55,0],['Cl',.55,0]], b:[[0,1]]},
  'H2O':    {a:[['O',0,-.2],['H',-.65,.3],['H',.65,.3]], b:[[0,1],[0,2]]},
  'CO2':    {a:[['C',0,0],['O',-1,0],['O',1,0]], b:[[0,1,2],[0,2,2]]},
  'NaCl':   {a:[['Na',-.55,0],['Cl',.55,0]], b:[[0,1]]},
  'HCl':    {a:[['Cl',.45,0],['H',-.45,0]], b:[[0,1]]},
  'CaO':    {a:[['Ca',-.55,0],['O',.55,0]], b:[[0,1,2]]},
  'SO2':    {a:[['S',0,-.25],['O',-.86,.25],['O',.86,.25]], b:[[0,1,2],[0,2,2]]},
  'H2SO4':  {a:[['S',0,0],['O',0,-1],['O',0,1],['O',-1,0],['O',1,0],['H',-1.29,.8],['H',1.29,-.8]],
             b:[[0,1,2],[0,2,2],[0,3],[0,4],[3,5],[4,6]]},
  'HNO3':   {a:[['N',0,0],['O',0,-1],['O',.87,.5],['O',-.87,.5],['H',-1.52,-.05]], b:[[0,1,2],[0,2],[0,3],[3,4]], v:{0:4, 2:1}},
  'NaOH':   {a:[['O',0,0],['Na',-1,0],['H',.8,0]], b:[[0,1],[0,2]]},
  'KOH':    {a:[['O',0,0],['K',-1.05,0],['H',.8,0]], b:[[0,1],[0,2]]},
  'Cu(OH)2':{a:[['Cu',0,0],['O',-1,0],['O',1,0],['H',-1.29,.8],['H',1.29,-.8]], b:[[0,1],[0,2],[1,3],[2,4]]},
  'Fe2O3':  {a:[['O',0,0],['Fe',-.82,.57],['Fe',.82,.57],['O',-1.64,0],['O',1.64,0]], b:[[0,1],[0,2],[1,3,2],[2,4,2]]},
  'CuSO4':  {a:[['S',0,0],['O',-.7,-.7],['O',-.7,.7],['O',.7,-.7],['O',.7,.7],['Cu',1.4,0]],
             b:[[0,1,2],[0,2,2],[0,3],[0,4],[3,5],[4,5]]},
  'Na2CO3': {a:[['C',0,0],['O',0,-1],['O',-.87,.5],['O',.87,.5],['Na',-1.73,0],['Na',1.73,0]], b:[[0,1,2],[0,2],[0,3],[2,4],[3,5]]},
  'NaHCO3': {a:[['C',0,0],['O',0,-1],['O',-.87,.5],['O',.87,.5],['H',-1.6,.08],['Na',1.73,0]], b:[[0,1,2],[0,2],[0,3],[2,4],[3,5]]},
};
// toạ độ bi (px, nguyên tử đầu ở gốc) của một chất. MOL_2D: đi theo cây liên kết, giữ hướng que nhưng rút
// khe hở giữa hai bi còn MOL_GAP (bi sát nhau hơn mà không chồng lên nhau); chất khác: chùm bi molAtoms.
const MOL_GAP = 0.3;
function molGeom(f){
  const m = MOL_2D[f], BL = 34;
  if(!m) return {atoms:molAtoms(f).map(a => ({el:a.el, x:a.x, y:a.y, r:atomR(a.el)})), bonds:[]};
  const raw = m.a.map(([el, x, y]) => ({el, x:x*BL, y:y*BL, r:atomR(el)}));
  const atoms = raw.map(a => ({el:a.el, x:0, y:0, r:a.r})), seen = [0];
  for(let k = 0; k < seen.length; k++){
    const i = seen[k];
    m.b.forEach(([p, q]) => {
      const j = p === i ? q : q === i ? p : -1;
      if(j < 0 || seen.includes(j)) return;
      const dx = raw[j].x - raw[i].x, dy = raw[j].y - raw[i].y, d = Math.hypot(dx, dy), rr = raw[i].r + raw[j].r;
      const nd = rr + MOL_GAP*(d - rr);
      atoms[j].x = atoms[i].x + dx/d*nd; atoms[j].y = atoms[i].y + dy/d*nd;
      seen.push(j);
    });
  }
  return {atoms, bonds:m.b};
}
// vẽ các bi đã có toạ độ px trong khung W×H: mỗi que là một nét liền (liên kết đôi / ba: 2 / 3 nét song song),
// bi trơn không ghi kí hiệu; stagger: bi nảy ra lần lượt rồi que mới hiện.
// Cả phân tử nằm trên một "sticker": viền trắng dày STICKER bao quanh hình bi–que, ngoài cùng một mép mực mờ
// cho tách khỏi nền — trong giỏ nhiều chất chồng nhau vẫn nhìn ra từng chất.
const STICKER = 2.6;
function molDraw(P, bonds, W, H, sc, stagger){
  const stick = ([i, j, o]) => {
    const p = P[i], q = P[j], len = Math.hypot(q.x - p.x, q.y - p.y), nx = -(q.y - p.y)/len, ny = (q.x - p.x)/len;
    const g = 4.4*sc, w = (o || 1) > 1 ? 2.2*sc : 3.2*sc;
    return [[0], [-g/2, g/2], [-g, 0, g]][(o || 1) - 1].map(d =>
      `<line x1="${p.x + nx*d}" y1="${p.y + ny*d}" x2="${q.x + nx*d}" y2="${q.y + ny*d}" stroke-width="${w}"/>`).join('');
  };
  const span = o => [3.2, 6.6, 11][(o || 1) - 1]*sc;                 // bề ngang của cụm 1 / 2 / 3 nét que
  const shape = pad => `<g>${P.map(a => `<circle cx="${a.x}" cy="${a.y}" r="${a.r + pad}"/>`).join('')}</g>`
    + `<g stroke-linecap="round">${bonds.map(([i, j, o]) =>
      `<line x1="${P[i].x}" y1="${P[i].y}" x2="${P[j].x}" y2="${P[j].y}" stroke-width="${span(o) + 2*pad}"/>`).join('')}</g>`;
  const pad = STICKER*sc, edge = Math.max(1, .6*sc);
  return `<svg class="bonds" width="${W}" height="${H}"${stagger ? ` style="animation-delay:${P.length*70}ms"` : ''}>`
      + `<g fill="#3b3025" stroke="#3b3025" opacity=".28">${shape(pad + edge)}</g>`
      + `<g fill="#fff" stroke="#fff">${shape(pad)}</g>`
      + `<g stroke="#3b3025">${bonds.map(stick).join('')}</g></svg>`
    + P.map((a, k) => atomBall(a, 'm', stagger ? 'animation-delay:' + k*70 + 'ms' : '', true)).join('');
}
// đặt một chất vừa khung W×H, phóng to tối đa maxSc lần; biên tính cả viền sticker (lề co giãn theo tỉ lệ)
function molFit(f, W, H, maxSc){
  const g = molGeom(f), p = STICKER + 1, ext = (k, sg) => Math.max(...g.atoms.map(a => sg*a[k] + a.r + p));
  const x0 = -ext('x', -1), x1 = ext('x', 1), y0 = -ext('y', -1), y1 = ext('y', 1);
  return {...g, x0, x1, y0, y1, sc:Math.min(maxSc, (W - 4)/(x1 - x0), (H - 4)/(y1 - y0))};
}
// một chất đứng riêng, căn giữa khung W×H
function molHTML(f, W, H, maxSc){
  const {atoms, bonds, x0, x1, y0, y1, sc} = molFit(f, W, H, maxSc);
  return molDraw(atoms.map(a => ({el:a.el, x:W/2 + (a.x - (x0 + x1)/2)*sc, y:H/2 + (a.y - (y0 + y1)/2)*sc, r:a.r*sc})),
    bonds, W, H, sc, true);
}
// khung phân tử rộng W, cao vừa khít sticker (tối đa maxH) — công thức đặt ngay bên dưới là sát sticker
function molBox(f, W, maxH, maxSc){
  const {y0, y1, sc} = molFit(f, W, maxH, maxSc), H = Math.ceil((y1 - y0)*sc + 4);
  return `<div class="molbox" style="width:${W}px;height:${H}px"><div class="mol">${molHTML(f, W, H, maxSc)}</div></div>`;
}
// xếp một vế: mỗi chất một khối, hệ số bao nhiêu thì bấy nhiêu phân tử (quá 3 thì xếp lưới
// nhiều cột cho khỏi thành cột dài ngoằng); cả vế co giãn cho vừa khung
function rxSide(obj, x0, x1, H, fixSc){
  const GAP = 30, PAD = 6;
  const sp = Object.keys(obj).map(f => {
    const atoms = molAtoms(f), n = obj[f];
    const box = k => Math.max(...atoms.map(a => a[k] + atomR(a.el))) - Math.min(...atoms.map(a => a[k] - atomR(a.el)));
    const mid = k => (Math.max(...atoms.map(a => a[k] + atomR(a.el))) + Math.min(...atoms.map(a => a[k] - atomR(a.el)))) / 2;
    const w = box('x'), h = box('y'), cols = n <= 3 ? 1 : Math.ceil(n/3), rows = Math.ceil(n/cols);
    return {f, n, atoms, w, h, mx:mid('x'), my:mid('y'), cols, rows,
            bw:cols*w + (cols - 1)*PAD, bh:rows*h + (rows - 1)*PAD};
  });
  const totW = sp.reduce((s, x) => s + x.bw, 0) + GAP*(sp.length - 1);
  const colH = Math.max(...sp.map(x => x.bh));
  const sc = fixSc || Math.min(1.9, (x1 - x0)/totW, (H - 34)/colH);   // phản ứng ít bi thì phóng to cho dễ nhìn
  const atoms = [], labels = [], plus = [];
  let cur = (x0 + x1)/2 - totW*sc/2;
  sp.forEach((s, si) => {
    const left = cur, top = (H - 24)/2 - s.bh*sc/2;
    for(let c = 0; c < s.n; c++){
      const cx = left + ((c % s.cols)*(s.w + PAD) + s.w/2)*sc;
      const cy = top + (Math.floor(c / s.cols)*(s.h + PAD) + s.h/2)*sc;
      s.atoms.forEach(a => atoms.push({el:a.el, x:cx + (a.x - s.mx)*sc, y:cy + (a.y - s.my)*sc, r:atomR(a.el)*sc, mx:cx, my:cy}));
    }
    labels.push({t:(s.n > 1 ? s.n : '') + sub(s.f), x:left + s.bw*sc/2});
    cur += s.bw*sc;
    if(si < sp.length - 1){ plus.push(cur + GAP*sc/2); cur += GAP*sc; }
  });
  return {atoms, labels, plus, sc};
}
function showRxCard(r, opt){
  opt = opt || {};
  const W = 720, H = 230, idx = REACTIONS.indexOf(r), gi = rxGroupOf(idx);
  // hai vế chung một tỉ lệ — bi cùng nguyên tố hai bên to bằng nhau thì mới thấy là "cùng một bi"
  const sc = Math.min(rxSide(r.rg, 18, W/2 - 58, H).sc, rxSide(r.pr, W/2 + 58, W - 18, H).sc);
  const L = rxSide(r.rg, 18, W/2 - 58, H, sc), R = rxSide(r.pr, W/2 + 58, W - 18, H, sc);
  // ghép cặp từng bi bên trái với một bi cùng nguyên tố bên phải (cân bằng thì luôn đủ cặp)
  const pool = {};
  R.atoms.forEach(a => (pool[a.el] = pool[a.el] || []).push(a));
  const exact = L.sc > 0.42 && R.sc > 0.42 && L.atoms.every(a => (pool[a.el]||[]).length && pool[a.el].shift());
  const ball = atomBall;
  const lbl = (side, cls) => side.labels.map(l => '<div class="rxlbl ' + cls + '" style="left:' + l.x + 'px;top:' + (H - 30) + 'px">' + l.t + '</div>').join('')
    + side.plus.map(x => '<div class="rxplus ' + cls + '" style="left:' + x + 'px;top:' + ((H - 24)/2) + 'px">+</div>').join('');
  // đủ cặp thì bi bay thật từ trái sang phải; không thì (đường, phân tử quá to) chỉ tan rồi hiện
  const stage = exact
    ? L.atoms.map(a => ball(a, 'mv')).join('')
    : L.atoms.map(a => ball(a, 'lft')).join('') + R.atoms.map(a => ball(a, 'rgt')).join('');
  const cons = (() => { const c = {};
    Object.keys(r.rg).forEach(f => { const a = atomCounts(f); Object.keys(a).forEach(e => c[e] = (c[e]||0) + a[e]*r.rg[f]); });
    return Object.keys(c).map(e => e + ': ' + c[e]).join(' · '); })();
  const face = profSVG('happy').replace(/viewBox="[^"]+"/, 'viewBox="' + HD_HEADS[0] + '"');
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = '<div class="rxcard">'
    + '<div class="rxc-head">' + (opt.isNew ? '<span class="rxc-tag">Phản ứng mới!</span>' : '') + '<b>' + RX_GROUPS[gi].t + '</b></div>'
    + '<div class="rxstage" style="width:' + W + 'px;height:' + H + 'px">' + stage + lbl(L, 'lft') + lbl(R, 'rgt')
    +   '<div class="rxarrow">' + (rxOver(r) ? '<small>' + rxOver(r) + '</small><br>' : '') + '⟶</div></div>'
    + '<div class="rxc-eq">' + eqStr(r) + '</div>'
    + '<div class="rxc-obs">' + (r.obs || (fxOf(r) ? 'Hiện tượng: ' + fxOf(r) + '.' : '')) + '</div>'
    + '<div class="rxc-cons">Đếm bi mỗi bên — <b>' + cons + '</b> — trước và sau bằng nhau: nguyên tử không mất đi, chỉ đổi bạn.</div>'
    + '<div class="rxc-note"><div class="on-face" style="width:54px;height:54px">' + face + '</div>'
    +   '<p class="hand" style="margin:0;font-size:15px;line-height:1.4">“' + RX_NOTES[gi] + '”</p></div>'
    + '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="rxagain">' + ico('retry') + ' Xem lại</button>'
    + '<button class="btn big" id="rxgo">' + (opt.isNew ? 'Ghi vào sổ ' + ico('next') : 'Đóng') + '</button></div></div>';
  G.appendChild(ov);
  const st = ov.querySelector('.rxstage');
  let timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const play = () => {
    timers.forEach(clearTimeout); timers = [];
    st.classList.remove('done', 'mix');
    const mv = [...st.querySelectorAll('.atom.mv')];
    mv.forEach((el, k) => { const a = L.atoms[k]; el.style.transition = 'none'; el.style.left = a.x + 'px'; el.style.top = a.y + 'px';
      el.style.width = el.style.height = Math.max(8, a.r*2) + 'px'; });
    void st.offsetWidth;
    // ghép đích cho từng bi: bi thứ k của nguyên tố X bên trái → bi thứ k của X bên phải
    const used = {}, dest = L.atoms.map(a => { used[a.el] = (used[a.el]||0); return R.atoms.filter(b => b.el === a.el)[used[a.el]++]; });
    later(700, () => {           // liên kết đứt: bi rung rồi tách xa nhau một chút
      st.classList.add('mix');
      mv.forEach((el, k) => { const a = L.atoms[k]; el.style.transition = '';
        el.style.left = (a.mx + (a.x - a.mx)*1.45) + 'px'; el.style.top = (a.my + (a.y - a.my)*1.45) + 'px'; });
    });
    later(1350, () => mv.forEach((el, k) => {   // bay sang chỗ mới trong sản phẩm
      const b = dest[k]; if(!b) return;
      el.style.transitionDelay = Math.min(k*18, 360) + 'ms';
      el.style.left = b.x + 'px'; el.style.top = b.y + 'px';
      el.style.width = el.style.height = Math.max(8, b.r*2) + 'px';
    }));
    later(exact ? 2950 : 1500, () => { st.classList.add('done'); mv.forEach(el => el.style.transitionDelay = ''); });
  };
  play();
  ov.querySelector('#rxagain').onclick = play;
  ov.querySelector('#rxgo').onclick = () => { timers.forEach(clearTimeout); ov.remove(); if(opt.onClose) opt.onClose(); };
  SFX.bell();
}
/* Trong ca: thẻ xếp hàng, mỗi lần một thẻ; đồng hồ ca đứng yên lúc xem — học không bị trừ giờ */
function queueRxCard(r){
  lab.cardQ.push(r);
  if(!lab.cardOpen) setTimeout(nextRxCard, 650);
}
function nextRxCard(){
  if(!lab || lab.cardOpen || !lab.cardQ.length) return;
  lab.cardOpen = true;
  if(lab.timer){ clearInterval(lab.timer); lab.timer = null; }
  showRxCard(lab.cardQ.shift(), {isNew:true, onClose: () => {
    if(!lab) return;
    lab.cardOpen = false;
    if(lab.cardQ.length) return nextRxCard();
    if(lab.timer === null && !G.querySelector('.pausecard')) lab.timer = setInterval(labTick, 1000);
  }});
}
