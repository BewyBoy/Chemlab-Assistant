/* =====================================================================
   CÁC CHẾ ĐỘ PHỤ — 8 minigame, thử thách pha nồng độ, chế độ khó trong ca (tự cân đong),
   thẻ phản ứng hoạt hình.
   ===================================================================== */
'use strict';

/* =====================  MINIGAMES  ===================== */
const shuffle = a => { a = a.slice(); for(let k=a.length-1; k>0; k--){ const j = Math.floor(Math.random()*(k+1)); [a[k],a[j]] = [a[j],a[k]]; } return a; };

function mgFrame(i, day, inner){
  G.innerHTML = `<div class="scene" style="padding:0;${mgBgCSS(day.mg)}">
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
// đồng hồ minigame (lập công thức, sơ đồ Lewis, tạo ion) đứng yên khi có lớp phủ trên màn: đang hỏi "Bỏ dở trò chơi?"
// sau nút ✕ thì coi như tạm dừng, bấm Chơi tiếp mới chạy lại
const mgHeld = () => !!G.querySelector('.overlay');
// mất điểm: ô Điểm nháy đỏ, "−1" bật ra ngay dưới nó rồi bay lên nhập vào (chuỗi phản ứng, cân bằng phương trình)
function mgMinus(hud){
  hud.classList.remove('flash-bad'); void hud.offsetWidth; hud.classList.add('flash-bad');
  const m = document.createElement('div'), g = G.getBoundingClientRect(), r = hud.getBoundingClientRect(), sc = g.width/1280;
  m.className = 'chn-minus'; m.textContent = '−1';
  m.style.left = (r.left + r.width/2 - g.left)/sc + 'px'; m.style.top = (r.bottom - g.top)/sc + 'px';
  G.appendChild(m);
  m.onanimationend = () => m.remove();
}

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

/* Lập công thức theo hoá trị (ngày 4). Hoá trị = số "tay" của một nguyên tử. Bóng nguyên tố để trơn, không que (một
   nguyên tố có thể có nhiều hoá trị — N từ I tới V); đề ghi đủ các hoá trị và tô đậm hoá trị dùng trong câu. Kiểm tra
   đúng thì các bóng trượt về chỗ rồi mọc tay nối nhau thành mô hình bi–que kiểu ngày 3. Mô hình đáp án dựng tự động:
   – hai nguyên tố (valLayout): 1 : 1 → nối a que; một bên chỉ 1 nguyên tử → đứng giữa, bên kia quây quanh (CO₂ thẳng
     hàng, H₂O / H₂S / SO₂ gấp khúc, NH₃ / SO₃ chữ Y, CH₄ chữ thập); Al₂O₃, P₂O₅, Mg₃N₂ → hai nguyên tử nối qua một
     nguyên tử hoá trị II làm cầu, còn lại bám ngoài bằng liên kết đôi;
   – axit / bazơ / muối (terLayout): gốc là X ở giữa nối các O đôi và các O "neo" (mỗi O neo còn một tay rảnh, số O neo
     = hoá trị gốc). H / kim loại hoá trị I bám vào từng O neo; kim loại hoá trị II ôm hai O neo thành vòng (CaSO₄,
     CaCO₃); kim loại hoá trị II–III với −OH / −NO₃ thì đứng giữa, các gốc toả ra.
   Hai bóng nắm tay cách nhau đúng r₁ + r₂ + 2·VL_ARM: mỗi tay dài VL_ARM tính từ mặt bóng, hai đầu tay chạm nhau. */
const VL_ARM = 9;
const VL_MAX = 16;                          // số bóng tối đa trên bàn tạo chất — chất nào cần nhiều hơn thì không ghép nổi
const ROMAN =['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const EL_VN = {H:'hiđro', O:'oxi', C:'cacbon', N:'nitơ', Cl:'clo', S:'lưu huỳnh', P:'photpho', Na:'natri', K:'kali',
  Mg:'magie', Ca:'canxi', Ba:'bari', Al:'nhôm', Zn:'kẽm', Fe:'sắt', Cu:'đồng', Ag:'bạc'};
// các hoá trị thường gặp (bảng hoá trị KHTN) — đề ghi đủ, tô đậm hoá trị dùng trong câu
const VL_VALS = {H:[1], O:[2], C:[2, 4], N:[1, 2, 3, 4, 5], S:[2, 4, 6], P:[3, 5], Cl:[1, 3, 5, 7], Na:[1], K:[1], Ag:[1],
  Mg:[2], Ca:[2], Ba:[2], Zn:[2], Al:[3], Fe:[2, 3], Cu:[1, 2]};
// gốc axit và nhóm −OH: X ở giữa (hoá trị xv) nối dbl O bằng liên kết đôi, oh O mang H, và v O neo (mỗi O neo một tay
// rảnh = hoá trị gốc); −OH là một O neo kèm H; bridge: hai X nối qua một O (S₂O₇). Câu hỏi chỉ dùng 5 gốc đầu, các gốc
// còn lại cho phần tạo chất tự do / khám phá (freeExtra)
const VL_RAD = {
  OH:   {v:1, nm:'hiđroxit', mark:'−'},
  NO3:  {v:1, X:'N', xv:5, dbl:2, nm:'nitrat', mark:'−'},
  SO4:  {v:2, X:'S', xv:6, dbl:2, nm:'sunfat', mark:'='},
  CO3:  {v:2, X:'C', xv:4, dbl:1, nm:'cacbonat', mark:'='},
  PO4:  {v:3, X:'P', xv:5, dbl:1, nm:'photphat', mark:'≡'},
  NO2:  {v:1, X:'N', xv:3, dbl:1, nm:'nitrit', mark:'−'},
  SO3:  {v:2, X:'S', xv:4, dbl:1, nm:'sunfit', mark:'='},
  HSO4: {v:1, X:'S', xv:6, dbl:2, oh:1, nm:'hiđrosunfat', mark:'−'},
  S2O7: {v:2, X:'S', xv:6, dbl:2, bridge:1, nm:'đisunfat', mark:'='},
  HCO3: {v:1, X:'C', xv:4, dbl:1, oh:1, nm:'hiđrocacbonat', mark:'−'},
  HPO4: {v:2, X:'P', xv:5, dbl:1, oh:1, nm:'hiđrophotphat', mark:'='},
  H2PO4:{v:1, X:'P', xv:5, dbl:1, oh:2, nm:'đihiđrophotphat', mark:'−'},
  ClO3: {v:1, X:'Cl', xv:5, dbl:2, nm:'clorat', mark:'−'},
  // gốc hữu cơ, mỗi gốc tới 2 nguyên tử C (muối có nhiều gốc thì tổng C có thể hơn 2). org: các nguyên tử sau O neo, mỗi
  // phần tử [nguyên tố, nút cha, hướng so với trục ra ngoài, bậc] (nút 0 = O neo); vals: số tay từng nguyên tố;
  // lead: viết gốc trước kim loại như trong sách (CH₃COONa, (CH₃COO)₂Ca); pair: hai C nối nhau, mỗi C một O neo (oxalat)
  HCOO:   {v:1, nm:'fomat', mark:'−', lead:1, vals:{C:4, H:1, O:2},
    org:[['C', 0, 0, 1], ['O', 1, -60, 2], ['H', 1, 60, 1]]},
  CH3COO: {v:1, nm:'axetat', mark:'−', lead:1, vals:{C:4, H:1, O:2},
    org:[['C', 0, 0, 1], ['O', 1, -60, 2], ['C', 1, 60, 1], ['H', 3, -30, 1], ['H', 3, 60, 1], ['H', 3, 150, 1]]},
  CH3O:   {v:1, nm:'metylat', mark:'−', lead:1, vals:{C:4, H:1, O:2},
    org:[['C', 0, 0, 1], ['H', 1, 90, 1], ['H', 1, -90, 1], ['H', 1, 0, 1]]},
  C2H5O:  {v:1, nm:'etylat', mark:'−', lead:1, vals:{C:4, H:1, O:2},
    org:[['C', 0, 0, 1], ['H', 1, 90, 1], ['H', 1, -90, 1], ['C', 1, 0, 1], ['H', 4, 90, 1], ['H', 4, -90, 1], ['H', 4, 0, 1]]},
  C2O4:   {v:2, nm:'oxalat', mark:'=', pair:1, vals:{C:4, O:2}, org:[]}};
const radStr = R => VL_RAD[R].mark + sub(R);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const fmlOf = (A, x, B, y) => (x ? A + (x > 1 ? x : '') : '') + (y ? B + (y > 1 ? y : '') : '');
function valFormula(A, a, B, b){
  const g = gcd(a, b), x = b/g, y = a/g;
  return {x, y, f:fmlOf(A, x, B, y)};
}
// một câu trong pools: [A, a, B, b, tên] (hai nguyên tố) hoặc [M, m, gốc, tên] (axit / bazơ / muối)
function vlQuestion(q){
  if(typeof q[3] === 'number'){
    const [A, a, B, b, name] = q;
    return {kind:'bin', name, A, a, B, b, f:valFormula(A, a, B, b).f, vals:{[A]:a, [B]:b}, els:[A, B]};
  }
  const [M, m, R, name] = q, rd = VL_RAD[R], g = gcd(m, rd.v), x = rd.v/g, y = m/g;
  if(rd.vals){                              // gốc hữu cơ: không có X ở giữa, thành phần ghi sẵn ở rd.vals
    const rs = y > 1 ? '(' + R + ')' + y : R;
    return {kind:'ter', name, M, m, R, f:rd.lead ? rs + M : M + (x > 1 ? x : '') + rs,
      vals:Object.assign({[M]:m}, rd.vals), els:[M].concat(Object.keys(rd.vals).filter(e => e !== M))};
  }
  return {kind:'ter', name, M, m, R, f:M + (x > 1 ? x : '') + (y > 1 ? '(' + R + ')' + y : R),
    vals:R === 'OH' ? {[M]:m, O:2, H:1} : Object.assign({[M]:m, [rd.X]:rd.xv, O:2}, rd.oh ? {H:1} : {}),
    els:R === 'OH' ? [M, 'O', 'H'] : [M, rd.X, 'O'].concat(rd.oh && M !== 'H' ? ['H'] : [])};
}
// dựng mô hình: nút đầu ở gốc toạ độ, mỗi nút sau nắm tay một nút đã có theo hướng deg (độ, y hướng xuống), bậc o.
// g: nhóm (các nút của cùng một gốc dựng sẵn) — nút không ghi nhóm thì đứng riêng
function vlBuilder(){
  const nodes = [], bonds = [];
  const add = (el, x, y, g) => nodes.push({el, x, y, g}) - 1;
  const at = (i, el, deg, o, g) => {
    const t = deg*Math.PI/180, d = atomR(nodes[i].el) + atomR(el) + 2*VL_ARM;
    const j = add(el, nodes[i].x + Math.cos(t)*d, nodes[i].y + Math.sin(t)*d, g);
    bonds.push([i, j, o || 1]);
    return j;
  };
  const done = () => { nodes.forEach((n, j) => { if(n.g === undefined) n.g = 'n' + j; }); return {nodes, bonds, add, at}; };
  return {nodes, bonds, add, at, done};
}
function valLayout(A, a, B, b){
  const {x, y} = valFormula(A, a, B, b), L = vlBuilder();
  if(x === 1 && y === 1){ L.add(A, 0, 0); L.at(0, B, 0, a); }
  else if(x === 1 || y === 1){
    const [C, Lg, n, v] = x === 1 ? [A, B, y, b] : [B, A, x, a];
    const bent = n === 2 && (C === 'S' || (C === 'O' && Lg === 'H'));
    const angs = n === 2 ? (bent ? (Lg === 'H' ? [37.5, 142.5] : [30, 150]) : [180, 0])
      : Array.from({length:n}, (_, k) => -90 + 360*k/n);
    L.add(C, 0, 0);
    angs.forEach(d => L.at(0, Lg, d, v));
  } else {
    const [P, Q, q, n] = x === 2 ? [A, B, b, y] : [B, A, a, x], k = (n - 1)/2;
    if(q !== 2 || Math.min(x, y) !== 2 || k > 2) return null;     // chưa có kiểu xếp cho tỉ lệ này
    L.add(Q, 0, 0);
    [1, -1].forEach(sg => {                                       // nửa phải, rồi nửa trái lật gương
      const mir = d => sg > 0 ? d : 180 - d, p = L.at(0, P, mir(35));
      (k === 1 ? [0] : [-25, 95]).forEach(d => L.at(p, Q, mir(d), q));
    });
  }
  return L.done();
}
// hướng các O quanh X (theo số O): xếp O neo trước, rồi O–H, rồi O nối đôi — kim loại / H bám thẳng ra ngoài từng O neo
// nên không bao giờ đụng nhau. ring: kim loại hoá trị II ôm hai O neo ở ±α quanh hướng 0°, các O còn lại bên trái
const VL_AROUND = {2:[180, 0], 3:[150, 30, -90], 4:[180, 0, 90, -90]};
const VL_RING = {3:[60, -60, 180], 4:[45, -45, 135, 225]};
function terLayout(M, m, R){
  const rd = VL_RAD[R], g = gcd(m, rd.v), x = rd.v/g, y = m/g, L = vlBuilder(), oh = rd.oh || 0;
  const kinds = [...'a'.repeat(rd.v), ...'h'.repeat(oh), ...'d'.repeat(rd.dbl || 0)];
  if(x > 1 && y > 1) return null;                                 // Al₂(SO₄)₃, Ca₃(PO₄)₂: chưa có kiểu xếp
  if(y > 1){                                                      // kim loại ở giữa, các gốc hoá trị I toả ra
    if(rd.v !== 1) return null;
    L.add(M, 0, 0);
    (y === 2 ? [180, 0] : Array.from({length:y}, (_, k) => -90 + 360*k/y)).forEach((d, k) => {
      const gid = 'r' + k, o = L.at(0, 'O', d, 1, gid);
      if(R === 'OH') return L.at(o, 'H', d, 1, gid);
      const xi = L.at(o, rd.X, d, 1, gid), rest = kinds.slice(1), sp = {1:[0], 2:[-60, 60], 3:[-90, 0, 90]}[rest.length];
      rest.forEach((kd, j) => { const e = d + sp[j], oo = L.at(xi, 'O', e, kd === 'd' ? 2 : 1, gid); if(kd === 'h') L.at(oo, 'H', e, 1, gid); });
    });
    return L.done();
  }
  if(R === 'OH'){ L.add('O', 0, 0, 'r'); L.at(0, M, 180); L.at(0, 'H', 0, 1, 'r'); return L.done(); }   // NaOH, KOH
  if(rd.bridge){                                                  // X–O–X: mỗi X hai O đôi + một O neo; chỉ kim loại hoá trị I
    if(m !== 1) return null;
    L.add('O', 0, 0, 'r');
    [180, 0].forEach(d => { const xi = L.at(0, rd.X, d, 1, 'r'); [90, -90].forEach(e => L.at(xi, 'O', e, 2, 'r')); L.at(L.at(xi, 'O', d, 1, 'r'), M, d); });
    return L.done();
  }
  const ring = m === 2 && rd.v === 2, dirs = (ring ? VL_RING : VL_AROUND)[kinds.length];
  if((m !== 1 && !ring) || !dirs) return null;
  L.add(rd.X, 0, 0, 'r');
  const anc = [];
  kinds.forEach((kd, k) => {
    const o = L.at(0, 'O', dirs[k], kd === 'd' ? 2 : 1, 'r');
    if(kd === 'h') L.at(o, 'H', dirs[k], 1, 'r');
    if(kd === 'a'){ anc.push(o); if(!ring) L.at(o, M, dirs[k]); }
  });
  if(ring){                                                       // kim loại trên phân giác, cách mỗi O neo một tay nắm
    const [p, q] = anc.map(j => L.nodes[j]), ux = (p.x + q.x)/2, uy = (p.y + q.y)/2, ul = Math.hypot(ux, uy);
    const d = atomR('O') + atomR(M) + 2*VL_ARM, h = Math.hypot(p.x - ux, p.y - uy), t = ul + Math.sqrt(d*d - h*h);
    const c = L.add(M, ux/ul*t, uy/ul*t);
    anc.forEach(j => L.bonds.push([j, c, 1]));
  }
  return L.done();
}
// gốc hữu cơ (VL_RAD có org): hoá trị I → chuỗi M–O–gốc, kim loại hoá trị m ≥ 2 đứng giữa cho m gốc toả ra;
// oxalat (hoá trị II): hai kim loại hoá trị I mỗi bên, hoặc một kim loại hoá trị II ôm cả hai O neo
function orgLayout(M, m, R){
  const rd = VL_RAD[R], g = gcd(m, rd.v), x = rd.v/g, y = m/g, L = vlBuilder();
  const tail = (o, dir) => { const id = [o]; rd.org.forEach(([el, p, d, ord]) => id.push(L.at(id[p], el, dir + d, ord))); };
  if(!rd.pair){
    if(m === 1){ L.add('O', 0, 0); L.at(0, M, 180); tail(0, 0); return L.done(); }
    L.add(M, 0, 0);
    (m === 2 ? [180, 0] : Array.from({length:m}, (_, k) => -90 + 360*k/m)).forEach(d => tail(L.at(0, 'O', d, 1), d));
    return L.done();
  }
  if(x > 1 && y > 1) return null;
  L.add('C', 0, 0);
  const c2 = L.at(0, 'C', 0, 1);
  if(x === 2){                              // kim loại hoá trị I: O–C(=O)–C(=O)–O, mỗi đầu một kim loại
    [[0, 120, -120], [c2, 60, -60]].forEach(([c, a, d]) => { L.at(c, 'O', d, 2); L.at(L.at(c, 'O', a, 1), M, a, 1); });
    return L.done();
  }
  if(x === 1 && y === 1){                   // kim loại hoá trị II nằm dưới, nắm cả hai O neo
    const o1 = L.at(0, 'O', 90, 1), o2 = L.at(c2, 'O', 90, 1);
    L.at(0, 'O', -90, 2); L.at(c2, 'O', -90, 2);
    const p = L.nodes[o1], q = L.nodes[o2], d = atomR('O') + atomR(M) + 2*VL_ARM, h = (q.x - p.x)/2;
    L.bonds.push([o1, L.add(M, (p.x + q.x)/2, p.y + Math.sqrt(d*d - h*h)), 1]);
    L.bonds.push([o2, L.nodes.length - 1, 1]);
    return L.done();
  }
  return null;
}
const vlLayout = q => q.kind === 'bin' ? valLayout(q.A, q.a, q.B, q.b) : VL_RAD[q.R].org ? orgLayout(q.M, q.m, q.R) : terLayout(q.M, q.m, q.R);
// sổ chất (tạo chất tự do + khám phá): mọi câu trong pools + freeExtra, mỗi công thức một lần
const vlBook = day => day.pools.flatMap(([, list]) => list).concat(day.freeExtra || []).map(vlQuestion)
  .filter((q, k, all) => all.findIndex(o => o.f === q.f) === k);
// khám phá ghép bằng bóng có tay (MG.valence) hay bằng sơ đồ Lewis (MG.lewis): công tắc ở đầu màn, nhớ ở save.settings.lewis
function startVlExplore(i){ SFX.music(themeOf(i)); MG[save.settings.lewis ? 'lewis' : 'valence'](i, DAYS[i], true); }
const vlLewisSwitch = () => `<span class="vl-mode">Sơ đồ Lewis<span class="toggle${save.settings.lewis ? ' on' : ''}" id="tglLewis" `
  + `role="switch" aria-checked="${!!save.settings.lewis}"></span></span>`;
function bindLewisSwitch(i){                // gạt xong mới đổi màn (bàn đang ghép bỏ đi, hai kiểu ghép khác hẳn nhau)
  const t = G.querySelector('#tglLewis');
  t.onclick = () => {
    t.onclick = null;
    save.settings.lewis = !save.settings.lewis; persist(); SFX.clink();
    t.classList.toggle('on', save.settings.lewis); t.setAttribute('aria-checked', save.settings.lewis);
    setTimeout(() => { if(t.isConnected) startVlExplore(i); }, 220);
  };
}
// thẻ công thức trong danh sách chất đã ghép ở màn khám phá; công thức dài như (CH₃COO)₂Ca thì thu nhỏ chữ cho vừa ô,
// cột vẫn thẳng hàng
function vlFoundTag(f, egg, title){
  const list = G.querySelector('.vl-found');
  list.insertAdjacentHTML('beforeend', `<span class="vl-tag${egg ? ' egg' : ''}" title="${title}">${sub(fShow(f))}</span>`);
  const tag = list.lastElementChild;
  for(let s = 15; tag.scrollWidth > tag.clientWidth && s > 9; ) tag.style.fontSize = (s -= .5) + 'px';
}
const VL_ORG = 'Chất hữu cơ mới hỗ trợ mỗi nhóm tới 2 nguyên tử C thôi — nhiều C hơn thì cấu tạo phức tạp lắm!';
// chất bí mật: chất có thật mà không theo kiểu "hai nhóm nắm nhau" của đề, ghép được từ bóng của câu.
// a: [nguyên tố, nút nắm tay, hướng, bậc liên kết]; b: liên kết thêm (khép vòng); free: tay rảnh [nút, hướng];
// v: số tay của nút ngoại lệ (Fe hoá trị II / III trong Fe₃O₄, liên kết cho–nhận trong O₃); show: cách viết công thức
const VL_EGG = {
  N2H4:   {nm:'hiđrazin, nhiên liệu tên lửa', a:[['N'], ['N', 0, 0], ['H', 0, 120], ['H', 0, 240], ['H', 1, 60], ['H', 1, -60]]},
  H2O2:   {nm:'hiđro peoxit, nước oxi già', a:[['O'], ['O', 0, 0], ['H', 0, 120], ['H', 1, -60]]},
  Na2O2:  {nm:'natri peoxit — hai O nắm tay nhau', a:[['O'], ['O', 0, 0], ['Na', 0, 120], ['Na', 1, -60]]},
  O3:     {nm:'ozon — O giữa nắm thêm O kia bằng liên kết cho–nhận', a:[['O'], ['O', 0, 150, 2], ['O', 0, 30]], v:{0:3, 2:1}},
  C2H6:   {nm:'etan', a:[['C'], ['C', 0, 0], ['H', 0, 90], ['H', 0, 180], ['H', 0, 270], ['H', 1, 90], ['H', 1, 0], ['H', 1, 270]]},
  C2H4:   {nm:'etilen', a:[['C'], ['C', 0, 0, 2], ['H', 0, 120], ['H', 0, 240], ['H', 1, 60], ['H', 1, -60]]},
  C2H2:   {nm:'axetilen, khí đất đèn', a:[['C'], ['C', 0, 0, 3], ['H', 0, 180], ['H', 1, 0]]},
  C2H6O:  {nm:'etanol (cồn)', show:'C2H5OH', a:[['C'], ['C', 0, 0], ['H', 0, 90], ['H', 0, 180], ['H', 0, 270], ['H', 1, 90], ['H', 1, 270],
    ['O', 1, 0], ['H', 7, -60]]},
  C2H4O2: {nm:'axit axetic (giấm ăn)', show:'CH3COOH', a:[['C'], ['C', 0, 0], ['H', 0, 90], ['H', 0, 180], ['H', 0, 270], ['O', 1, -60, 2],
    ['O', 1, 60], ['H', 6, 0]]},
  CaC2:   {nm:'canxi cacbua (đất đèn) — gặp nước sinh khí axetilen', a:[['Ca'], ['C', 0, 62.28], ['C', 1, 180, 3]], b:[[0, 2, 1]]},
  Fe3O4:  {nm:'oxit sắt từ — một Fe hoá trị II, hai Fe hoá trị III', a:[['Fe'], ['O', 0, 210], ['O', 0, -30], ['Fe', 1, 150], ['Fe', 2, 30],
    ['O', 3, 210, 2], ['O', 4, -30, 2]], v:{0:2, 3:3, 4:3}},
  S2O7:   {nm:'gốc đisunfat (hoá trị II) trong oleum', a:[['O'], ['S', 0, 180], ['S', 0, 0], ['O', 1, 90, 2], ['O', 1, 270, 2],
    ['O', 1, 180], ['O', 2, 90, 2], ['O', 2, 270, 2], ['O', 2, 0]], free:[[5, 180], [8, 0]]}};
// chất đã biết vẽ tay: hữu cơ tới 2 nguyên tử C (nhiều C hơn cấu tạo phức tạp mà ít ích; muối hữu cơ thì tính từng gốc,
// xem VL_RAD), cùng kiểu khai báo với chất bí mật
const VL_MOL = {
  CH4O:   {nm:'metanol (rất độc)', show:'CH3OH', a:[['C'], ['H', 0, 90], ['H', 0, 180], ['H', 0, 270], ['O', 0, 0], ['H', 4, -60]]},
  CH2O:   {nm:'fomanđehit (fomon)', show:'HCHO', a:[['C'], ['O', 0, 0, 2], ['H', 0, 120], ['H', 0, 240]]},
  CH2O2:  {nm:'axit fomic (có trong nọc kiến)', show:'HCOOH', a:[['C'], ['O', 0, -60, 2], ['O', 0, 60], ['H', 0, 180], ['H', 2, 0]]},
  C2H4O:  {nm:'anđehit axetic', show:'CH3CHO', a:[['C'], ['C', 0, 0], ['H', 0, 90], ['H', 0, 180], ['H', 0, 270], ['O', 1, -60, 2], ['H', 1, 60]]},
  CH5N:   {nm:'metylamin', show:'CH3NH2', a:[['C'], ['H', 0, 90], ['H', 0, 180], ['H', 0, 270], ['N', 0, 0], ['H', 4, -60], ['H', 4, 60]]},
  CHN:    {nm:'axit xianhiđric (rất độc)', show:'HCN', a:[['C'], ['N', 0, 0, 3], ['H', 0, 180]]},
  CH4N2O: {nm:'urê (phân đạm)', show:'CO(NH2)2', a:[['C'], ['O', 0, -90, 2], ['N', 0, 150], ['N', 0, 30], ['H', 2, 90], ['H', 2, 210],
    ['H', 3, 90], ['H', 3, -30]]}};
const fShow = f => ((VL_EGG[f] || VL_MOL[f] || {}).show) || f;   // cách viết công thức (CH₃COOH thay cho C₂H₄O₂)
function handLayout(e){
  const L = vlBuilder();
  e.a.forEach(([el, i, d, o]) => i === undefined ? L.add(el, 0, 0) : L.at(i, el, d, o));
  (e.b || []).forEach(b => L.bonds.push(b));
  return Object.assign(L.done(), {free:e.free || []});
}
const eggLayout = f => handLayout(VL_EGG[f]);
// mọi chất được công nhận khi tạo chất tự do / khám phá: sổ chất + chất vẽ tay (chất bí mật tính riêng)
const vlKnown = day => vlBook(day).map(q => ({f:q.f, name:q.name, L:() => vlLayout(q)}))
  .concat(Object.keys(VL_MOL).map(f => ({f, name:VL_MOL[f].nm, L:() => handLayout(VL_MOL[f])})));
// đơn chất — chỉ nhận ở khám phá (tạo chất tự do vẫn đòi hợp chất): phân tử vẽ tay như VL_MOL; kim loại, C, S, P là một
// nguyên tử đứng riêng, viết như trong sách (Fe, Cu, C…). arms: số tay của mỗi nguyên tử
const VL_ELEM = {
  H2:  {nm:'khí hiđro', arms:1, a:[['H'], ['H', 0, 0]]},
  O2:  {nm:'khí oxi', arms:2, a:[['O'], ['O', 0, 0, 2]]},
  N2:  {nm:'khí nitơ', arms:3, a:[['N'], ['N', 0, 0, 3]]},
  Cl2: {nm:'khí clo', arms:1, a:[['Cl'], ['Cl', 0, 0]]},
  S8:  {nm:'lưu huỳnh — vòng 8 nguyên tử', arms:2, b:[[7, 0, 1]],
    a:[['S'], ['S', 0, 0], ['S', 1, 45], ['S', 2, 90], ['S', 3, 135], ['S', 4, 180], ['S', 5, 225], ['S', 6, 270]]}};
['Na', 'K', 'Ag', 'Mg', 'Ca', 'Ba', 'Zn', 'Al', 'Fe', 'Cu', 'C', 'S', 'P'].forEach(e => VL_ELEM[e] = {arms:0, a:[[e]],
  nm:e === 'C' ? 'cacbon (than, kim cương)' : e === 'P' ? 'photpho đỏ' : e === 'S' ? 'lưu huỳnh' : EL_VN[e] + ' (kim loại)'});
const vlElems = () => Object.keys(VL_ELEM).map(f => ({f, name:VL_ELEM[f].nm, L:() => handLayout(VL_ELEM[f])}));
// chất ghép đúng hoá trị nhưng không tồn tại: tạo chất tự do / khám phá báo "phân huỷ ngay lập tức" (kèm sản phẩm) thay cho
// "chưa có trong sổ". Giá trị: sản phẩm
const VL_GONE = {
  'Al2(CO3)3':'thành Al(OH)3 và CO2 khi gặp nước', 'Fe2(CO3)3':'thành Fe(OH)3 và CO2 khi gặp nước',
  'Al2(SO3)3':'thành Al(OH)3 và SO2 khi gặp nước', 'Fe2(SO3)3':'thành Fe(OH)3 và SO2 khi gặp nước',
  'Al(HCO3)3':'thành Al(OH)3 và CO2 khi gặp nước', 'Fe(HCO3)3':'thành Fe(OH)3 và CO2 khi gặp nước',
  CuCO3:'thành muối bazơ Cu2(OH)2CO3 và CO2 khi gặp nước', AgOH:'thành Ag2O và H2O', CuOH:'thành Cu2O và H2O', Fe2S3:'thành FeS và S'};
// hoá trị từng nguyên tố trong một mô hình, đếm tay của từng bóng: "Fe: II, III · O: II" (chú thích khi rê chuột)
function vlValText(L){
  const arms = L.nodes.map(() => 0), m = {};
  L.bonds.forEach(([p, q, o]) => { arms[p] += o; arms[q] += o; });
  (L.free || []).forEach(([p]) => arms[p]++);
  L.nodes.forEach((n, k) => (m[n.el] = m[n.el] || new Set()).add(arms[k]));
  return Object.keys(m).map(e => e + ': ' + [...m[e]].sort().map(v => ROMAN[v] || 'không nắm tay').join(', ')).join(' · ');
}
// các lớp svg cho một nhóm bóng, cùng thứ tự với molDraw (viền mực mờ → sticker trắng → que) để sticker các bóng chạm
// nhau liền thành một miếng. Tay là một nét mọc từ tâm bóng: a = hướng, d = lệch ngang (liên kết đôi / ba là 2 / 3 nét
// song song), w = bề dày, g = đã mọc bao nhiêu (0 → 1); d, w, độ dài tính theo đơn vị bóng, nhân với cỡ s của từng bóng
function vlLayers(list){
  const f = n => n.toFixed(1);
  const segs = list.map(A => A.arms.filter(m => m.g > .02).map(m => {
    const c = Math.cos(m.a), s = Math.sin(m.a), x = A.x - s*m.d*A.s, y = A.y + c*m.d*A.s, len = (atomR(A.el) + VL_ARM)*A.s*m.g;
    return {p:`x1="${f(x)}" y1="${f(y)}" x2="${f(x + c*len)}" y2="${f(y + s*len)}"`, w:m.w*A.s};
  }));
  const shape = edge => list.map((A, n) => {
    const p = STICKER*A.s + (edge ? Math.max(1, .6*A.s) : 0);
    return `<circle cx="${f(A.x)}" cy="${f(A.y)}" r="${f(atomR(A.el)*A.s + p)}"/>`
      + segs[n].map(g => `<line ${g.p} stroke-width="${f(g.w + 2*p)}"/>`).join('');
  }).join('');
  return `<g fill="#3b3025" stroke="#3b3025" opacity=".28" stroke-linecap="round">${shape(true)}</g>`
    + `<g fill="#fff" stroke="#fff" stroke-linecap="round">${shape(false)}</g>`
    + `<g stroke="#3b3025" stroke-linecap="round">${segs.flat().map(g => `<line ${g.p} stroke-width="${f(g.w)}"/>`).join('')}</g>`;
}
// một "bóng" trong cột trái: nguyên tố, hoặc gốc dựng sẵn = chùm bóng sát nhau (X ở giữa, O quây quanh), chưa có que
function vlPieceGeom(key){
  const rd = VL_RAD[key];
  if(!rd) return [{el:key, x:0, y:0}];
  const n = rd.dbl + rd.v, d = key === 'OH' ? 0 : atomR(rd.X) + atomR('O');
  const at = key === 'OH' ? [{el:'O', x:0, y:0}, {el:'H', x:atomR('O') + atomR('H'), y:0}]
    : [{el:rd.X, x:0, y:0}].concat(Array.from({length:n}, (_, k) => {
        const t = -Math.PI/2 + 2*Math.PI*k/n; return {el:'O', x:Math.cos(t)*d, y:Math.sin(t)*d}; }));
  const mid = k => (Math.min(...at.map(a => a[k] - atomR(a.el))) + Math.max(...at.map(a => a[k] + atomR(a.el))))/2;
  const cx = mid('x'), cy = mid('y');
  return at.map(a => ({el:a.el, x:a.x - cx, y:a.y - cy}));
}
const vlPieceR = key => Math.max(...vlPieceGeom(key).map(a => Math.hypot(a.x, a.y) + atomR(a.el))) + STICKER;
const vlPieceSize = (key, sc) => Math.ceil(2*(vlPieceR(key)*sc + 3));
function vlPiece(key, sc, bare){             // bare: bóng trơn, không ghi kí hiệu (chip nhỏ trên đề)
  const S = vlPieceSize(key, sc), c = S/2, P = vlPieceGeom(key).map(a => ({el:a.el, x:c + a.x*sc, y:c + a.y*sc, s:sc, arms:[]}));
  return `<div class="vl-one" style="width:${S}px;height:${S}px"><svg class="bonds" width="${S}" height="${S}">${vlLayers(P)}</svg>`
    + P.map(p => atomBall({el:p.el, x:p.x, y:p.y, r:atomR(p.el)*sc}, '', '', bare)).join('') + '</div>';
}
// bộ sưu tập chất bí mật (lưu qua các lượt) ở cột phải trò lập công thức (cả chế độ thường lẫn sơ đồ Lewis): chỉ bật lên
// lúc vừa tìm được một chất, vài giây sau tự tắt. Mỗi chất một ngôi sao, chưa tìm thì mờ; rê chuột lên ngôi sao đã sáng
// để xem công thức và hoá trị
function vlEggBox(el){
  const EGGS = Object.keys(VL_EGG);
  let t = 0;
  const hide = () => el.classList.remove('show');
  function show(){
    const got = EGGS.filter(f => (save.eggs || []).includes(f));
    el.innerHTML = '<small>Chất bí mật</small><div>' + EGGS.map(f => got.includes(f)
      ? `<span class="on" title="${sub(fShow(f))} — ${vlValText(eggLayout(f))}">${ico('star', 17)}</span>` : `<span title="???">${ico('star', 17)}</span>`).join('')
      + `</div><b>${got.length}/${EGGS.length}</b>`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(t); t = setTimeout(hide, 5000);
  }
  function collect(f){
    save.eggs = save.eggs || [];
    if(!save.eggs.includes(f)){ save.eggs.push(f); persist(); }
    unlockAch('egg'); show();
  }
  return {hide, collect};
}

/* Sơ đồ Lewis (ngày 4, chế độ khó — MG.lewis). Bóng nguyên tử như ở trò lập công thức, quanh bóng là các electron lớp
   ngoài cùng vẽ thành chấm ở bốn phía: 0 phải, 1 dưới, 2 trái, 3 trên (y hướng xuống), mỗi phía tối đa 2 chấm. Điền như
   sách: mỗi phía một chấm trước (phải, trái, trên, dưới), còn thừa thì ghép đôi (trên, dưới, trái) — O có hai chấm độc
   thân hai bên, hai cặp trên dưới (H–O–H nằm ngang); N một cặp trên, ba chấm độc thân. Hai bóng góp chung electron đứng
   cách nhau đúng như hai bóng nắm tay ở chế độ thường (gạch nối vẽ bằng tay của vlLayers); hai ion đứng xa hơn một chút
   cho vừa ngoặc vuông. */
const LW_E = {H:1, C:4, N:5, O:6, S:6, P:5, Cl:7, Na:1, K:1, Mg:2, Ca:2, Ba:2, Al:3};   // số electron lớp ngoài cùng
const LW_METAL = ['Na', 'K', 'Mg', 'Ca', 'Ba', 'Al'];
const LW_SC = 2, LW_DOT = 11, LW_GAP = 6, LW_DOT_R = 4.2;   // cỡ bóng; chấm cách mặt bóng; nửa khoảng cách hai chấm một cặp; bán kính chấm
const LW_BOND = 2*VL_ARM*LW_SC, LW_ION = 2*LW_DOT + 16;     // khoảng hở giữa hai mặt bóng: góp chung electron / cặp ion
const lwNeed = el => el === 'H' ? 2 : 8;                    // H đủ 2 electron như He, các phi kim khác đủ 8
function lwSides(el){                                       // số chấm từng phía lúc nguyên tử còn đứng riêng
  const c = [0, 0, 0, 0];
  for(let k = 0; k < LW_E[el]; k++) c[k < 4 ? [0, 2, 3, 1][k] : [3, 1, 2][k - 4]]++;
  return c;
}
// chỗ một chấm quanh bóng tâm (x, y) bán kính r; k = −1 / 1: hai chấm của một cặp; z: co khoảng cách chấm (bóng nhỏ ở cột trái)
function lwDot(x, y, r, side, rot, k, z = 1){
  const t = side*Math.PI/2 + rot, c = Math.cos(t), s = Math.sin(t), d = r + LW_DOT*z, o = k*LW_GAP*z;
  return {x:x + c*d - s*o, y:y + s*d + c*o};
}
// kí hiệu Lewis đứng riêng (cột trái, bóng đang kéo): bóng + chấm electron; nhỏ hơn cỡ trên bàn (LW_SC) thì chấm sát lại theo
const lwPieceSize = (el, sc) => Math.ceil(2*(atomR(el)*sc + (LW_DOT + LW_DOT_R + 3)*sc/LW_SC));
function lwPiece(el, sc){
  const S = lwPieceSize(el, sc), c = S/2, r = atomR(el)*sc, z = sc/LW_SC;
  const dots = lwSides(el).flatMap((n, s) => Array.from({length:n}, (_, k) => lwDot(c, c, r, s, 0, n > 1 ? 2*k - 1 : 0, z)));
  return `<div class="vl-one" style="width:${S}px;height:${S}px"><svg class="bonds" width="${S}" height="${S}">${vlLayers([{el, x:c, y:c, s:sc, arms:[]}])}`
    + dots.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(LW_DOT_R*z).toFixed(1)}" fill="#3b3025"/>`).join('') + '</svg>'
    + atomBall({el, x:c, y:c, r}, '') + '</div>';
}

const MG = {
 /* --- phân loại (ngày 3: nguyên tử/phân tử; ngày 17: oxit/axit/bazơ/muối). Mỗi lúc chỉ MỘT chất: thẻ vẽ
        mô hình bi–que, công thức ở dưới; kéo thẻ vào giỏ hoặc bấm thẳng vào giỏ. Đúng giỏ: mô hình rơi vào giỏ
        thành vật thật, va chạm với các chất đã nằm đó. Sai giỏ: giỏ nhả thẻ, thẻ văng ra ngoài màn hình —
        mỗi chất chỉ được chọn MỘT lần. --- */
 bins(i, day){
  if(day.hard && hardOn()) return MG.ion(i, day);                    // ngày 3, chế độ khó: tạo ion
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

 /* --- ngày 4: lập công thức theo hoá trị. Cột trái: bóng của câu (nguyên tố; mấy câu đầu có thêm gốc dựng sẵn); rê
        chuột lên bóng để xem các hoá trị. Cột phải: Kiểm tra / Làm lại. Kéo bóng (hoặc bấm — bóng rơi vào giữa sân)
        vào khu vực tạo chất; bóng trên bàn trôi rất chậm quanh giữa sân. Bấm bóng, hoặc kéo ra ngoài, để bỏ. Kiểm tra:
        – đúng → các bóng trượt về chỗ trong mô hình đáp án rồi mọc tay nối nhau (rê chuột lên mô hình: hoá trị từng bóng);
        – ghép ra chất có thật "ngoài đề" (VL_EGG) → ngôi sao vào bộ sưu tập (save.eggs, chỉ bật lên lúc vừa tìm được) +
          thành tựu, không tính sai, nhưng vẫn phải ghép chất của đề;
        – sai → bàn rung, bị từ chối; mọi tay đã nắm được mà vẫn sai thì nói lý do (chưa tối giản / sai gốc / thiếu
          nguyên tố). Sai là mất điểm câu đó, bàn tự dọn sạch để làm lại ngay cho tới khi đúng.
        Cả màn chỉ có TOTAL_T giây, chạy từ câu đầu; hết giờ là kết thúc. Xong 8 câu thì đồng hồ dừng, cột phải hiện
        "Hoàn thành!" với Kết thúc / Tiếp tục. Tiếp tục → tạo chất tự do (mode 'free') bằng số giây còn lại: mỗi lượt một
        bộ nguyên tố, tạo chất nào có thật cũng được (vlKnown — không ép về chất của đề), mỗi chất +PTS một lần, chất bí
        mật thưởng thêm EGG_BONUS. Khám phá (explore, mở khi ngày 4 đạt 3 sao thường hoặc khó, startVlExplore): bảng 17 nguyên tố, ghép
        bừa không tính giờ; số chất đã khám phá lưu ở save.vlSeen. Chỉ khám phá nhận thêm đơn chất (VL_ELEM: H₂, O₂,
        N₂, Cl₂, S₈, kim loại, C, S, P). Cả hai phần tự do đều báo chất không tồn tại (VL_GONE) là "phân huỷ ngay".
        Cả khu vực vẽ lại mỗi khung hình trên MỘT svg (vlLayers), bóng là các .atom đè lên trên. --- */
 valence(i, day, explore){
  if(!explore && day.hard && hardOn()) return MG.lewis(i, day);       // chế độ khó: sơ đồ Lewis
  const known = vlKnown(day).concat(explore ? vlElems() : []), EGGS = Object.keys(VL_EGG), qs = [];   // qs: 8 câu, bốc theo từng nhóm, không lặp chất; đơn chất chỉ nhận ở khám phá
  if(!explore) day.pools.forEach(([n, list]) => shuffle(list).map(vlQuestion).filter(q => !qs.some(o => o.f === q.f)).slice(0, n).forEach(q => qs.push(q)));
  const TOTAL_T = 90, PTS = 10, EGG_BONUS = 20;
  const ZW = 840, ZH = 430, SC = 2.2, PSC = 1.9, MAX = VL_MAX;         // SC: cỡ bóng trên bàn, PSC: ở cột trái
  // bóng trôi DRIFT px/s, hướng lắc ngẫu nhiên (NOISE·√dt — đổi hướng sau vài giây, không phụ thuộc số khung hình);
  // mỗi giây bị kéo về giữa sân PULL phần khoảng cách → cả cụm trôi chừng 4–5 px/s quanh giữa sân
  const DRIFT = 6, PULL = .03, NOISE = 2.5;
  // bộ nguyên tố của phần tự do lấy từ thành phần các chất thường trong sổ (không lấy từ chất bí mật — khỏi lộ bí mật;
  // chất bí mật vẫn được thưởng nếu ghép ra); xếp kim loại trước, O cuối
  const ORDER = ['Na', 'K', 'Ag', 'Mg', 'Ca', 'Ba', 'Zn', 'Cu', 'Fe', 'Al', 'H', 'C', 'N', 'P', 'S', 'Cl', 'O'];
  const elsOf = f => Object.keys(atomCounts(f)), ALL = known.map(k => k.f);
  mgFrame(i, explore ? Object.assign({}, day, {t:day.t + ' · Khám phá'}) : day, `<div class="vl">
    <div class="vl-task"><div class="vl-t1"></div><div class="vl-t2"></div></div>
    <div class="vl-mid">
      <div class="vl-pal"></div>
      <div class="vl-zone" data-dz="vbuild" style="width:${ZW}px;height:${ZH}px">
        <div class="vl-layer"><svg class="bonds" width="${ZW}" height="${ZH}"></svg></div>
        <span class="vl-zlbl">Khu vực tạo chất</span></div>
      <div class="vl-side">
        <div class="vl-acts"><button class="btn big" id="vlgo"></button>
          <button class="btn" id="vlclear">${ico('retry')} Làm lại</button></div>
        <div class="vl-donebox"><b>Hoàn thành!</b><button class="btn" id="vlend">${ico('check')} Kết thúc</button>
          <button class="btn big" id="vlmore">Tiếp tục ${ico('next')}</button></div>
        <div class="vl-eggs"></div>${explore ? '<div class="vl-found"></div>' : ''}</div>
    </div>
    <div class="vl-say"></div></div>`);
  const t1 = G.querySelector('.vl-t1'), t2 = G.querySelector('.vl-t2'), pal = G.querySelector('.vl-pal'), side = G.querySelector('.vl-side');
  const zone = G.querySelector('.vl-zone'), layer = zone.querySelector('.vl-layer'), svg = layer.firstElementChild;
  const say = G.querySelector('.vl-say'), bGo = G.querySelector('#vlgo'), bClear = G.querySelector('#vlclear'), eggsEl = G.querySelector('.vl-eggs');
  tapeLabel(zone.querySelector('.vl-zlbl'));
  // missed: câu này đã sai một lần (không còn tính điểm); afterEgg: vừa ra chất bí mật — nhắc ghép chất của đề.
  // tLeft: số giây còn lại của cả màn (paused: đang chờ chọn Kết thúc / Tiếp tục); solved: số câu đã xong;
  // made / found: chất đã tạo ở phần tự do (khám phá: chất đã ghép lượt này)
  let mode = explore ? 'explore' : 'quiz', qi = -1, correct = 0, solved = 0, q = null, keys = [], phase = 'build', missed = false, afterEgg = false;
  let pieces = [], atoms = [], shakeT = 0, tLeft = TOTAL_T, paused = false, score = 0, made = 0, found = [], ended = false, shownT = -1, lastSet = '';
  const live = () => pieces.filter(p => !p.leaving);                   // phase: build → check (hoạt cảnh) → done / egg / next
  // toạ độ trong khu vực tạo chất: tâm một phần tử / điểm thả (ngón tay: vật nổi trên đầu ngón, xem dragify).
  // Cửa sổ thu về 0×0 thì fit() co game về tỉ lệ 0 — chia cho 0 ra NaN lây sang mọi bóng qua relax, nên đặt sàn 1
  const zPt = el => { const z = layer.getBoundingClientRect(), r = el.getBoundingClientRect(), s = z.width/ZW || 1;
    return {x:(r.left + r.width/2 - z.left)/s, y:(r.top + r.height/2 - z.top)/s}; };
  const dropAt = (e, h) => { const z = layer.getBoundingClientRect(), s = z.width/ZW || 1;
    return {x:(e.clientX - z.left)/s, y:(e.clientY - z.top)/s - (e.pointerType === 'mouse' ? 0 : h*.6 + 24)}; };
  const palPt = k => zPt(pal.children[k].querySelector('.vl-one'));
  const countOf = list => { const c = {}; list.forEach(p => p.atoms.forEach(A => c[A.el] = (c[A.el]||0) + 1)); return c; };
  const same = (a, b) => Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(e => a[e] === b[e]);
  const setGo = chk => { bGo.innerHTML = chk ? ico('check') + ' Kiểm tra' : 'Tiếp tục ' + ico('next'); };
  const later = (ms, fn) => setTimeout(() => { if(zone.isConnected && !ended) fn(); }, ms);
  const fml = (f, L) => `<b class="vl-f" title="${vlValText(L)}">${sub(fShow(f))}</b>`;   // rê chuột: hoá trị
  const hud = (txt, el) => { G.querySelector(el || '#mgscore').textContent = txt; };
  const seen = () => known.filter(k => (save.vlSeen || []).includes(k.f)).length;
  const AGAIN = 'Hãy tạo chất với ít nguyên tử nhất để qua màn ;)';   // nhắc sau khi ra chất bí mật

  const eggBox = vlEggBox(eggsEl);

  // một bóng (hoặc chùm bóng của gốc dựng sẵn) bay từ from tới to; bấm / kéo ra ngoài để bỏ, kéo trong khu vực để dời
  function spawn(key, k, from, to){
    const geo = vlPieceGeom(key), S = vlPieceSize(key, SC);
    const p = {key, k, comp:geo.map(a => a.el).sort().join(), R:vlPieceR(key)*SC, tx:to.x, ty:to.y, va:Math.random()*2*Math.PI, leaving:false, dragging:false, atoms:[]};
    geo.forEach(a => {
      const A = {el:a.el, pc:p, ox:a.x*SC, oy:a.y*SC, s:SC, ts:SC, arms:[]};
      Object.assign(A, {x:from.x + A.ox, y:from.y + A.oy, tx:to.x + A.ox, ty:to.y + A.oy});
      layer.insertAdjacentHTML('beforeend', atomBall({el:a.el, x:A.x, y:A.y, r:atomR(a.el)*SC}, 'vl-b'));
      A.div = layer.lastElementChild;
      dragify(A.div, 'vlmove', {w:S, h:S,
        ghostHTML: () => { p.dragging = true; return vlPiece(key, SC); },
        onDrop: (z, e) => { p.dragging = false; const d = dropAt(e, S);
          p.tx = d.x; p.ty = d.y; p.atoms.forEach(B => { B.x = d.x + B.ox; B.y = d.y + B.oy; }); relax(p); SFX.clink(); },
        onLoose: () => { p.dragging = false; leave(p); refresh(); return true; },
        onClick: () => { if(phase === 'build'){ leave(p); refresh(); } }});
      p.atoms.push(A); atoms.push(A);
    });
    pieces.push(p);
    return p;
  }
  function leave(p){                        // về lại cột trái rồi biến mất (vòng vẽ xoá khi tới nơi); tay thu lại
    const h = palPt(p.k), k = (mode === 'explore' ? 1.4 : PSC)/SC;
    p.leaving = true;
    p.atoms.forEach(A => { Object.assign(A, {tx:h.x + A.ox*k, ty:h.y + A.oy*k, ts:SC*k}); A.arms.forEach(m => m.tg = 0); A.div.style.pointerEvents = 'none'; });
    SFX.clink();
  }
  const clearOut = () => { live().forEach(leave); layer.classList.remove('vl-done'); };
  const wipe = () => { atoms.forEach(A => A.div.remove()); atoms = []; pieces = []; layer.classList.remove('vl-done'); };
  // dồn các bóng cho sticker khỏi chạm nhau (chạm là trông như đã nắm tay), giữ trong khu vực; bóng vừa thả ít bị đẩy.
  // Vòng vẽ gọi mỗi khung với 1 lượt (its = 1) để bóng đang trôi né nhau dần dần
  function relax(fix, its){
    const L = live().filter(P => !P.dragging);
    for(let it = 0; it < (its || 40); it++){
      L.forEach((A, n) => L.slice(n + 1).forEach((B, m) => {
        const dx = B.tx - A.tx, dy = B.ty - A.ty, d = Math.hypot(dx, dy), need = A.R + B.R + 8;
        if(d >= need) return;
        const [ux, uy] = d > .5 ? [dx/d, dy/d] : [Math.cos(n + m + it), Math.sin(n + m + it)];
        const push = need - d, wa = A === fix ? .15 : B === fix ? .85 : .5;
        A.tx -= ux*push*wa; A.ty -= uy*push*wa; B.tx += ux*push*(1 - wa); B.ty += uy*push*(1 - wa);
      }));
      L.forEach(P => { P.tx = Math.max(P.R, Math.min(ZW - P.R, P.tx)); P.ty = Math.max(P.R, Math.min(ZH - P.R, P.ty)); });
    }
    L.forEach(P => P.atoms.forEach(A => { A.tx = P.tx + A.ox; A.ty = P.ty + A.oy; }));
  }
  function put(key, k, d){                  // d: điểm thả; null = bấm → bóng rơi vào giữa sân, bóng cũ dạt ra nhường chỗ
    if(phase !== 'build') return;
    if(live().length >= MAX){ SFX.err(); toast('Khu vực tạo chất đầy rồi — bấm vào một bóng để bỏ bớt!'); return; }
    relax(spawn(key, k, d || palPt(k), d || {x:ZW/2 + (Math.random() - .5)*60, y:ZH/2 + (Math.random() - .5)*40}));
    refresh(); SFX.clink();
  }

  function refresh(){                       // nút + dòng nhắc dưới bàn (chỉ lúc đang ghép; có bóng trên bàn thì để trống)
    if(phase !== 'build') return;
    const L = live();
    bGo.disabled = bClear.disabled = !L.length;
    say.innerHTML = L.length ? '' : afterEgg ? AGAIN
      : mode === 'free' ? 'Tạo chất nào cũng được, miễn là chất có thật!'
      : mode === 'explore' ? ''
      : 'Kéo bóng ở cột trái vào khu vực tạo chất (hoặc bấm vào bóng). Bấm vào bóng trên bàn để bỏ ra.';
  }
  function lock(on){
    pal.classList.toggle('off', on);
    atoms.forEach(A => A.div.style.pointerEvents = on || A.pc.leaving ? 'none' : '');
    bGo.disabled = bClear.disabled = on;
  }
  // chip trên đề: bóng nhỏ + mọi hoá trị của nguyên tố, tô vàng hoá trị dùng trong câu (on); all: không tô, để rõ cả
  const vchip = (el, on, all) => `<span class="vl-chip">${vlPiece(el, .7, true)}<b>${el}</b><span class="vl-vals${all ? ' all' : ''}">`
    + VL_VALS[el].map(v => `<i${v === on ? ' class="on"' : ''}>${ROMAN[v]}</i>`).join('') + '</span></span>';
  // cột trái: bóng có nhãn (câu hỏi, tự do) hoặc lưới 17 nguyên tố (khám phá — rê chuột lên bóng hiện các hoá trị của nó;
  // câu hỏi và tự do đã ghi hoá trị trên đề nên khỏi)
  function setPal(grid){
    pal.classList.toggle('grid', grid);
    pal.innerHTML = keys.map((key, k) => `<div class="vl-pitem enter" style="animation-delay:${k*(grid ? 25 : 70)}ms">`
      + (grid ? vlPiece(key, 1.4) : vlPiece(key, PSC) + `<div class="vl-plbl">${VL_RAD[key] ? `<b>${radStr(key)}</b> · ${key === 'OH' ? 'nhóm' : 'gốc'} ${VL_RAD[key].nm}`
        : `<b>${key}</b> · ${EL_VN[key]}`}</div>`) + (grid ? `<span class="vl-hv">${VL_VALS[key].map(v => ROMAN[v]).join(' · ')}</span>` : '') + '</div>').join('');
    [...pal.children].forEach((it, k) => {
      const key = keys[k], S = vlPieceSize(key, SC);
      if(!grid) tapeLabel(it.querySelector('.vl-plbl'));
      dragify(it, 'vlatom', {w:S, h:S, enabled: () => phase === 'build', ghostHTML: () => vlPiece(key, SC),
        onDrop: (z, e) => put(key, k, dropAt(e, S)), onClick: () => put(key, k, null)});
    });
  }
  function round(){                         // câu hỏi tiếp theo (8 câu)
    q = qs[++qi]; phase = 'build'; missed = afterEgg = false;
    wipe();
    // cột trái: hai nguyên tố; axit / bazơ / muối thì kim loại (hoặc H) + gốc dựng sẵn ở mấy câu đầu, sau đó 3 nguyên tố
    keys = q.kind === 'bin' ? [q.A, q.B] : qi < day.buildFrom ? [q.M, q.R] : q.els;
    const rchip = hint => `<span class="vl-chip vl-rad${hint ? ' hint' : ''}">${hint ? (q.R === 'OH' ? 'nhóm' : 'gốc') : vlPiece(q.R, .6, true)}`
      + `<b>${radStr(q.R)}</b><span class="vl-vals"><i class="on">${ROMAN[VL_RAD[q.R].v]}</i></span></span>`;
    t1.innerHTML = `<span class="vl-qn">Câu ${qi + 1}/${qs.length}</span>`
      + (q.kind === 'bin' ? 'Lập công thức hợp chất của hai nguyên tố' : `Lập công thức: <b>${q.name}</b>`);
    t2.innerHTML = q.kind === 'bin' ? vchip(q.A, q.a) + vchip(q.B, q.b)
      : keys.includes(q.R) ? vchip(q.M, q.m) + rchip(false) : q.els.map(el => vchip(el, q.vals[el])).join('') + rchip(true);
    setPal(false);
    setGo(true); lock(false); refresh();
  }
  // tạo chất tự do: bộ nguyên tố còn ít nhất một chất chưa tạo (không lặp bộ vừa rồi)
  function nextSet(){
    const sets = [...new Set(ALL.map(f => elsOf(f).sort().join()))].map(s => s.split(',')).filter(s => s.length > 1 && s.length <= 3);   // mỗi chất tối đa 3 nguyên tố
    const open = sets.filter(s => ALL.some(f => !found.includes(f) && elsOf(f).every(e => s.includes(e))));
    const fresh = open.filter(s => s.join() !== lastSet), set = pick(fresh.length ? fresh : open.length ? open : sets);
    lastSet = set.join();
    return set.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  }
  function freeRound(){
    phase = 'build'; afterEgg = false;
    wipe();
    keys = nextSet();
    t1.innerHTML = `<span class="vl-qn">Tự do · chất ${made + 1}</span>Tạo một chất bất kỳ từ các nguyên tố này`;
    t2.innerHTML = keys.map(el => vchip(el, 0, true)).join('');
    setPal(false);
    setGo(true); lock(false); refresh();
  }
  function startFree(){                     // xong 8 câu → Tiếp tục: đồng hồ chạy tiếp; ✕ lúc này chỉ dừng sớm
    mode = 'free'; side.classList.remove('complete'); paused = false;
    score = made = 0; found = [];
    hud('Điểm: 0');
    G.querySelector('#bquit').onclick = () => { if(!ended) endGame(true); };
    SFX.page(); freeRound();
  }
  function exploreSetup(){
    keys = Object.keys(VL_VALS);
    t1.innerHTML = '<span class="vl-qn">Khám phá</span>' + vlLewisSwitch();
    t2.innerHTML = '<span>Chất hữu cơ: mỗi nhóm tối đa 2 nguyên tử C</span>';
    bindLewisSwitch(i);
    setPal(true);
    hud('Sổ chất: ' + seen() + '/' + known.length);
    setGo(true); lock(false); refresh();
  }
  // hết giờ (early: bấm ✕ dừng sớm ở phần tự do): khoá bàn, bảng tổng kết chỉ có Kết thúc — chơi lại thì làm lại từ đầu
  function endGame(early){
    ended = true; phase = 'end'; lock(true); eggBox.hide(); SFX.bell();
    const free = mode === 'free', rec = free && score > (save.vlBest || 0), eggs = found.filter(f => VL_EGG[f]).length;
    if(rec){ save.vlBest = score; persist(); }
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="paper vl-end"><h2>${ico('flask', 24)} ${early ? 'Dừng thử thách' : 'Hết giờ!'}</h2>` + (free
      ? `<p>Tạo được <b>${made}</b> chất${eggs ? ` · ${ico('star', 16)} ${eggs} chất bí mật` : ''}</p><div class="vl-endpts">${score} điểm</div>
        <p>${rec ? '<b class="vl-ok">Kỷ lục mới!</b>' : 'Kỷ lục: <b>' + (save.vlBest || 0) + '</b> điểm'}</p>`
      : `<p>Xong <b>${solved}</b>/${qs.length} câu · đúng ngay lần đầu <b>${correct}</b> câu</p>`)
      + `<div class="row" style="justify-content:center;margin-top:10px"><button class="btn big" id="vfend">${ico('check')} Kết thúc</button></div></div>`;
    G.appendChild(ov);
    ov.querySelector('#vfend').onclick = () => showResult(i, {correct, total:qs.length});
  }
  // bị từ chối: bàn rung, đỏ lên rồi tự dọn sạch; plain: không phải ghép sai đề (khỏi nhắc "Sai rồi")
  function reject(msg, plain){
    phase = 'check'; lock(true);
    shakeT = performance.now() + 450; SFX.err();
    zone.classList.remove('flash-bad'); void zone.offsetWidth; zone.classList.add('flash-bad');
    say.innerHTML = `<span class="vl-bad">${ico('close', 20)} ${msg}</span>` + (mode !== 'quiz' || plain ? '' : '<br><small>Sai rồi — bàn đã dọn sạch, làm lại nhé!</small>');
    later(650, () => { live().forEach(leave); phase = 'build'; lock(false); bGo.disabled = bClear.disabled = true; });
  }

  function check(){
    const c = countOf(live());
    phase = 'check'; lock(true);
    if(mode !== 'quiz') return checkKnown(c);
    const want = atomCounts(q.f);
    if(same(c, want)) return win();
    const egg = EGGS.find(f => same(c, atomCounts(f)));
    if(egg) return eggFound(egg);
    // sai là sai: câu này mất điểm, bàn tự dọn sạch — làm lại ngay cho tới khi đúng
    missed = true;
    reject(why(c, want));
  }
  function win(){
    const L = vlLayout(q), last = qi + 1 >= qs.length;
    if(!missed){ correct++; mgScore(correct, qs.length); }
    solved++;
    if(last) paused = true;                 // đủ 8 công thức: đồng hồ dừng trong lúc chọn Kết thúc / Tiếp tục
    assemble(L, () => {
      SFX.coin();
      say.innerHTML = `<span class="vl-ok">${ico('check', 20)} Chính xác!</span> ${fml(q.f, L)} — ${q.name}`;
      if(!last) return finish('done');
      phase = 'complete'; side.classList.add('complete'); SFX.bell();
    });
  }
  function eggFound(egg){
    const L = eggLayout(egg);
    assemble(L, () => {
      SFX.tinkle(); eggBox.collect(egg);
      say.innerHTML = `<span class="vl-ok">${ico('star', 20)}</span> ${fml(egg, L)} — ${VL_EGG[egg].nm}<br><small>${AGAIN}</small>`;
      finish('egg');
    });
  }
  function backToBuild(){ clearOut(); phase = 'build'; afterEgg = true; setGo(true); lock(false); refresh(); }
  // tự do / khám phá: chất có thật nào cũng được (sổ chất, chất vẽ tay, chất bí mật).
  // Tự do: mỗi chất tính điểm một lần rồi sang bộ nguyên tố khác. Khám phá: mô hình đứng yên cho rê chuột xem hoá trị
  function checkKnown(c){
    const hit = known.find(k => same(c, atomCounts(k.f))), egg = !hit && EGGS.find(e => same(c, atomCounts(e)));
    if(!hit && !egg){
      const els = Object.keys(c), n = c[els[0]], gone = Object.keys(VL_GONE).find(g => same(c, atomCounts(g)));
      const org = (c.C || 0) >= 3 && c.H && els.every(e => ['C', 'H', 'O', 'N', 'Na', 'K', 'Ag', 'Mg', 'Ca', 'Ba', 'Zn', 'Al', 'Fe', 'Cu'].includes(e));
      return reject(gone ? sub(`${gone} không tồn tại — phân huỷ ngay lập tức ${VL_GONE[gone]}!`)
        : els.length > 1 ? (org ? VL_ORG : 'Chưa có chất này trong sổ — thử chất khác!')
        : mode !== 'explore' ? `Mới có ${els[0]} — hãy ghép thành hợp chất nhé!`   // đơn chất chỉ nhận ở khám phá
        : n === 1 ? `Một nguyên tử ${els[0]} lẻ loi chưa thành chất — ghép thêm bạn nhé!`
        : sub(`${els[0]}${n}`) + ' chưa phải chất quen thuộc — thử số nguyên tử khác nhé!', true);
    }
    const f = hit ? hit.f : egg, L = hit ? hit.L() : eggLayout(egg), nm = hit ? hit.name : VL_EGG[egg].nm;
    if(mode === 'free'){
      if(found.includes(f)) return reject(`Đã tạo ${sub(fShow(f))} rồi — thử chất khác!`, true);
      const pts = egg ? PTS + EGG_BONUS : PTS;
      found.push(f); made++; score += pts; hud('Điểm: ' + score);
      return assemble(L, () => {
        if(egg){ SFX.tinkle(); eggBox.collect(egg); } else SFX.coin();
        say.innerHTML = `<span class="vl-ok">${ico(egg ? 'star' : 'check', 20)}</span> ${fml(f, L)} — ${nm} <b class="vl-ok">+${pts}</b>`;
        later(900, freeRound);
      });
    }
    let fresh = false;
    if(hit){ save.vlSeen = save.vlSeen || []; if(!save.vlSeen.includes(f)){ save.vlSeen.push(f); persist(); fresh = true; } }
    if(!found.includes(f)){ found.push(f); vlFoundTag(f, egg, vlValText(L)); }
    hud('Sổ chất: ' + seen() + '/' + known.length);
    assemble(L, () => {
      if(egg){ SFX.tinkle(); eggBox.collect(egg); } else SFX.coin();
      say.innerHTML = `<span class="vl-ok">${ico(egg ? 'star' : 'check', 20)}</span> ${fml(f, L)} — ${nm}` + (fresh ? ' <b class="vl-ok">Mới!</b>' : '');
      finish('next');
    });
  }
  const finish = ph => { phase = ph; setGo(false); bGo.disabled = false; };
  // lý do bị từ chối. Mọi tay có nắm hết được không: hai nguyên tố thì A chỉ nắm B; gốc dựng sẵn thì kim loại chỉ nắm
  // gốc; ráp từ từng nguyên tử thì mọi liên kết đều đi qua O (mỗi O hai tay). Nắm hết mà vẫn sai thì nói vì sao.
  function why(c, want){
    const v = q.vals, n = e => c[e] || 0, ready = q.kind === 'ter' && keys.includes(q.R), nk = key => live().filter(p => p.key === key).length;
    const ok = q.kind === 'bin' ? v[q.A]*n(q.A) === v[q.B]*n(q.B)
      : ready ? q.m*nk(q.M) === VL_RAD[q.R].v*nk(q.R)
      : n('O') > 0 && 2*n('O') === Object.keys(c).reduce((s, e) => s + (e === 'O' ? 0 : (v[e] || 0)*c[e]), 0);
    const els = Object.keys(want), k = n(els[0])/want[els[0]], miss = els.filter(e => !n(e));
    if(Object.keys(c).length === 1) return `Mới có ${Object.keys(c)[0]} — chất cần tạo là hợp chất của ${els.length} nguyên tố.`;   // O₂, H₂…: đơn chất
    if(!ok) return 'Vẫn còn tay chưa có bạn nắm.';
    if(Number.isInteger(k) && k > 1 && els.every(e => n(e) === want[e]*k) && Object.keys(c).length === els.length)
      return `Mọi tay đều có bạn nắm, nhưng công thức chưa tối giản — còn chia được cho ${k}.`;
    if(miss.length) return `Mọi tay đều có bạn nắm, nhưng thiếu ${miss.join(', ')} — ${q.name} có đủ ${els.length} nguyên tố.`;
    const comp = atomCounts(q.R);
    return `Mọi tay đều có bạn nắm, nhưng chưa thành ${q.R === 'OH' ? 'nhóm' : 'gốc'} ${radStr(q.R)} — gồm `
      + Object.keys(comp).map(e => comp[e] + ' ' + e).join(' và ') + '.';
  }
  // ghép mô hình: mỗi nút nhận một bóng cùng nguyên tố. Gốc dựng sẵn đi nguyên chùm vào đúng một gốc của mô hình (cặp
  // gần nhau ghép trước); ghép chùm không khớp (vd. hai nhóm OH thành H₂O₂) thì ghép từng bóng.
  // Bóng tới gần chỗ thì mới mọc tay — liên kết bậc o là o nét song song. Mỗi bóng gắn nhãn hoá trị (số tay của nó),
  // chỉ hiện khi rê chuột lên khu vực tạo chất (.vl-val, style.css)
  function assemble(L, done){
    const {nodes, bonds} = L, free = L.free || [], pad = STICKER + 2;
    const ext = (key, sg) => Math.max(...nodes.map(nd => sg*nd[key] + atomR(nd.el) + pad));
    const x0 = -ext('x', -1), x1 = ext('x', 1), y0 = -ext('y', -1), y1 = ext('y', 1);
    const sc = Math.min(SC, (ZW - 60)/(x1 - x0), (ZH - 60)/(y1 - y0));
    const P = nodes.map(nd => ({el:nd.el, g:nd.g, x:ZW/2 + (nd.x - (x0 + x1)/2)*sc, y:ZH/2 + (nd.y - (y0 + y1)/2)*sc}));
    const own = match(P);
    const slots = P.map(() => []);
    bonds.forEach(([s, t, o]) => {
      const a = Math.atan2(P[t].y - P[s].y, P[t].x - P[s].x), w = o > 1 ? 2.2 : 3.2;
      [[0], [-2.2, 2.2], [-4.4, 0, 4.4]][o - 1].forEach(d => { slots[s].push({a, d, w}); slots[t].push({a:a + Math.PI, d, w}); });
    });
    free.forEach(([j, deg]) => slots[j].push({a:deg*Math.PI/180, d:0, w:3.2}));
    own.forEach((A, j) => {
      Object.assign(A, {tx:P[j].x, ty:P[j].y, ts:sc, arms:slots[j].map(s => Object.assign({g:0, tg:0}, s))});
      A.div.style.pointerEvents = 'none';
      A.div.querySelector('.vl-val')?.remove();
      if(slots[j].length) A.div.insertAdjacentHTML('beforeend', `<span class="vl-val">${ROMAN[slots[j].length]}</span>`);   // nguyên tử đứng riêng không có nhãn
    });
    setTimeout(() => own.forEach(A => A.arms.forEach(m => m.tg = 1)), 380);
    setTimeout(() => {
      if(!zone.isConnected || ended) return;
      own.forEach((A, n) => setTimeout(() => { A.div.classList.remove('vl-pop'); void A.div.offsetWidth; A.div.classList.add('vl-pop'); }, n*40));
      layer.classList.add('vl-done');
      done();
    }, 1150);
  }
  function match(P){
    const own = P.map(() => null), L = live(), byG = {};
    P.forEach((p, j) => (byG[p.g] = byG[p.g] || []).push(j));
    const pick = (js, As) => {              // từng bóng cùng nguyên tố, cặp gần nhau ghép trước
      const pr = [], got = new Set();
      js.forEach(j => As.forEach(A => { if(A.el === P[j].el) pr.push([Math.hypot(A.x - P[j].x, A.y - P[j].y), A, j]); }));
      pr.sort((u, w) => u[0] - w[0]).forEach(([, A, j]) => { if(!own[j] && !got.has(A)){ own[j] = A; got.add(A); } });
    };
    const units = Object.values(byG).map(js => ({js, comp:js.map(j => P[j].el).sort().join(),
      x:js.reduce((s, j) => s + P[j].x, 0)/js.length, y:js.reduce((s, j) => s + P[j].y, 0)/js.length}));
    const pr = [], uU = new Set(), uP = new Set();
    units.forEach(u => L.forEach(p => { if(p.comp === u.comp) pr.push([Math.hypot(p.tx - u.x, p.ty - u.y), u, p]); }));
    pr.sort((u, w) => u[0] - w[0]).forEach(([, u, p]) => { if(uU.has(u) || uP.has(p)) return; uU.add(u); uP.add(p); pick(u.js, p.atoms); });
    if(uU.size < units.length || uP.size < L.length){ own.fill(null); pick(P.map((_, j) => j), L.flatMap(p => p.atoms)); }
    return own;
  }
  bGo.onclick = () => {
    if(phase === 'build'){ if(live().length) check(); }
    else if(phase === 'egg'){ eggBox.hide(); backToBuild(); }
    else if(phase === 'next'){ clearOut(); phase = 'build'; setGo(true); lock(false); refresh(); }   // khám phá: dọn bàn
    else if(phase === 'done'){ SFX.page(); round(); }
  };
  bClear.onclick = () => { if(phase === 'build'){ live().forEach(leave); refresh(); } };
  G.querySelector('#vlend').onclick = () => showResult(i, {correct, total:qs.length});
  G.querySelector('#vlmore').onclick = startFree;

  // vòng vẽ: đồng hồ của màn; mọi thứ trôi êm về đích (vị trí, cỡ, độ mọc của tay); bị từ chối thì cả bàn rung ngang.
  // Lúc đang ghép, bóng trên bàn trôi rất chậm: hướng đổi dần, bị kéo nhẹ về giữa sân, nảy ở mép, né nhau (relax 1 lượt)
  let last = performance.now();
  (function frame(now){
    if(!zone.isConnected) return;                                       // rời minigame: dừng hẳn
    // máy chậm (ít khung hình) vẫn về đích kịp mốc của assemble: chặn dt rộng tay hơn các vòng vật lý
    const dt = Math.max(0, Math.min(now - last, 120))/1000, e = 1 - Math.exp(-dt*9), t = now/1000;
    // đồng hồ của màn theo giờ thật (máy chậm vẫn đúng giờ); khung hình ngắt quãng quá 1 s (chuyển tab, thu nhỏ cửa
    // sổ) chỉ tính 1 s — trò không bị trừ giờ lúc không nhìn màn hình
    const clk = Math.max(0, Math.min(now - last, 1000))/1000;
    last = now;
    if(!G.querySelector('.dragghost')) pieces.forEach(p => p.dragging = false);   // kéo bị huỷ giữa chừng
    if(mode !== 'explore' && !ended && !paused && !mgHeld()){
      tLeft = Math.max(0, tLeft - clk);
      const sec = Math.ceil(tLeft);
      if(sec !== shownT){ shownT = sec; hud('Còn ' + sec + ' giây', '#mgtime'); }
      if(!tLeft) endGame(false);
    }
    if(phase === 'build' && pieces.length){
      live().forEach(P => {
        if(P.dragging) return;
        P.va += (Math.random() - .5)*NOISE*Math.sqrt(dt);
        P.tx += (Math.cos(P.va)*DRIFT + (ZW/2 - P.tx)*PULL)*dt;
        P.ty += (Math.sin(P.va)*DRIFT + (ZH/2 - P.ty)*PULL)*dt;
        if(P.tx < P.R || P.tx > ZW - P.R) P.va = Math.PI - P.va;
        if(P.ty < P.R || P.ty > ZH - P.R) P.va = -P.va;
      });
      relax(null, 1);
    }
    atoms.forEach(A => {
      A.x += (A.tx - A.x)*e; A.y += (A.ty - A.y)*e; A.s += (A.ts - A.s)*e;
      A.arms.forEach(m => m.g += (m.tg - m.g)*Math.min(1, e*1.3));
    });
    pieces = pieces.filter(p => {
      const A = p.atoms[0];
      if(!p.leaving || Math.hypot(A.tx - A.x, A.ty - A.y) > 8) return true;
      p.atoms.forEach(B => B.div.remove()); atoms = atoms.filter(B => B.pc !== p);
      return false;
    });
    const sh = now < shakeT ? 7*Math.sin(t*55)*(shakeT - now)/450 : 0;
    const dx = A => A.pc.leaving ? 0 : sh;
    const look = A => ({el:A.el, x:A.x + dx(A), y:A.y, s:A.s, arms:A.arms});
    const held = atoms.filter(A => A.pc.dragging);                      // bóng đang bị kéo: mờ đi như .draggingsrc
    svg.innerHTML = vlLayers(atoms.filter(A => !A.pc.dragging).map(look)) + (held.length ? `<g opacity=".35">${vlLayers(held.map(look))}</g>` : '');
    atoms.forEach(A => { const r = atomR(A.el)*A.s, st = A.div.style;
      st.left = A.x + dx(A) + 'px'; st.top = A.y + 'px'; st.width = st.height = 2*r + 'px'; st.fontSize = Math.max(7, Math.round(r*.95)) + 'px'; });
    requestAnimationFrame(frame);
  })(last);
  if(explore) exploreSetup();
  else { G.querySelector('#mgtime').style.display = ''; hud('Còn ' + TOTAL_T + ' giây', '#mgtime'); mgScore(0, qs.length); round(); }
 },

 /* --- ngày 4, chế độ khó: sơ đồ Lewis (day.hard, bật bằng công tắc chế độ khó chung). Cùng khung với lập công thức
        (cột trái: nguyên tố của câu; giữa: khu vực tạo chất; phải: Kiểm tra / Làm lại) nhưng bóng không có tay mà mang
        các electron lớp ngoài cùng (chấm, xem lwSides). Đề chỉ ghi tên chất, số electron lớp ngoài và kim loại / phi kim
        — trò tự suy ra cần bao nhiêu nguyên tử. Chấm kéo được thì có quầng vàng:
        – electron độc thân của phi kim: kéo sang electron độc thân của phi kim khác (thả lên chấm hay lên bóng đều được)
          → hai chấm thành một gạch = cặp electron dùng chung, liên kết cộng hoá trị; nối tiếp giữa hai bóng đã nối là
          liên kết đôi, ba;
        – electron của kim loại: thả vào phi kim còn electron độc thân → electron bay sang ghép đôi (vẽ đỏ), kim loại
          thành ion dương, phi kim thành ion âm (ngoặc vuông + điện tích): liên kết ion.
        Hai cụm rời vừa nối thì cụm nhỏ hơn xoay (từng góc vuông) và trượt tới cho hai phía vừa nối quay vào nhau; cụm
        là vật rắn, kéo bóng nào cũng dời cả cụm (kéo ra ngoài khu vực = bỏ cả cụm). Bấm bóng để bỏ riêng bóng đó, bấm
        gạch nối để tách bớt một cặp, bấm chấm đỏ để trả electron về kim loại.
        Kiểm tra: phi kim đủ 8 electron (H đủ 2), kim loại nhường hết, cả bàn là một cụm, đúng số nguyên tử. Sai là mất
        điểm câu đó nhưng bàn giữ nguyên (bóng chưa đủ electron nháy đỏ) để sửa tiếp; ghép ra chất bí mật (VL_EGG) thì
        như ở chế độ thường. Cả màn day.hard.time giây; xong hết câu là Kết thúc, không có phần tạo chất tự do; sao lưu
        vào cột sao chế độ khó. Khu vực vẽ lại mỗi khung hình trên MỘT svg (vlLayers + chấm), bóng là các .atom đè lên.
        Khám phá (explore — công tắc "Sơ đồ Lewis" ở màn khám phá, startVlExplore): lưới các nguyên tố có trong LW_E,
        không tính giờ, không mất điểm. Kiểm tra: mọi bóng đủ electron và cả bàn là một cụm thì tra sổ chất như khám phá
        thường (vlKnown + đơn chất + chất bí mật), chất mới ghi vào save.vlSeen; Tiếp tục để dọn bàn. --- */
 lewis(i, day, explore){
  const H = day.hard, qs = [], EGGS = Object.keys(VL_EGG), found = [];
  if(!explore) H.pools.forEach(([n, list]) => shuffle(list).slice(0, n).forEach(([f, name]) => qs.push({f, name})));
  const known = explore ? vlKnown(day).concat(vlElems()) : [];        // khám phá: cùng sổ chất với khám phá thường
  const TOTAL_T = H.time, ZW = 840, ZH = 430, SC = LW_SC, MAX = VL_MAX;
  const ORDER = ['Na', 'K', 'Mg', 'Ca', 'Al', 'H', 'C', 'N', 'P', 'S', 'Cl', 'O'];      // cột trái: kim loại trước, O cuối
  mgFrame(i, explore ? Object.assign({}, day, {t:day.t + ' · Khám phá'}) : day, `<div class="vl lw">
    <div class="vl-task"><div class="vl-t1"></div><div class="vl-t2"></div></div>
    <div class="vl-mid">
      <div class="vl-pal"></div>
      <div class="vl-zone" data-dz="vbuild" style="width:${ZW}px;height:${ZH}px">
        <div class="vl-layer"><svg class="bonds lw-svg" width="${ZW}" height="${ZH}"></svg></div>
        <span class="vl-zlbl">Khu vực tạo chất</span></div>
      <div class="vl-side">
        <div class="vl-acts"><button class="btn big" id="vlgo"></button>
          <button class="btn" id="vlclear">${ico('retry')} Làm lại</button></div>
        <div class="vl-donebox"><b>Hoàn thành!</b><button class="btn big" id="vlend">${ico('check')} Kết thúc</button></div>
        <div class="vl-eggs"></div>${explore ? '<div class="vl-found"></div>' : ''}</div>
    </div>
    <div class="vl-say"></div></div>`);
  if(!explore) G.querySelector('.hud-title').insertAdjacentHTML('beforeend', ' · <span style="color:#a8331f">khó</span>');
  const t1 = G.querySelector('.vl-t1'), t2 = G.querySelector('.vl-t2'), pal = G.querySelector('.vl-pal'), side = G.querySelector('.vl-side');
  const zone = G.querySelector('.vl-zone'), layer = zone.querySelector('.vl-layer'), svg = layer.firstElementChild;
  const say = G.querySelector('.vl-say'), bGo = G.querySelector('#vlgo'), bClear = G.querySelector('#vlclear'), eggBox = vlEggBox(G.querySelector('.vl-eggs'));
  tapeLabel(zone.querySelector('.vl-zlbl'));
  // atoms: {el, metal, R (bán kính lúc xếp chỗ), x, y (đang hiện) → tx, ty (đích), s → ts (cỡ), rot (góc xoay còn lại, về
  //   0 dần), vx (x đang vẽ, cộng cả độ rung), div, leaving, bad (nháy đỏ tới lúc nào)};
  // els: electron {own (nguyên tử gốc), at (đang ở đâu; null = nằm trong gạch nối), side, home (phía cũ trên own, để trả
  //   về), ox, oy (độ lệch lúc đang bay — giảm dần về 0), link (cặp ion do electron này tạo ra)};
  // links: {kind:'cov' | 'ion', a, sa, b, sb (hai đầu và phía), order, els, grow (độ mọc của từng gạch)}.
  // hold: thứ đang bị nhấn giữ trên bàn — electron e, gạch nối l, hoặc bóng A (cả cụm F đi theo)
  let qi = -1, q = null, keys = [], correct = 0, solved = 0, missed = false, phase = 'build', tLeft = TOTAL_T, shownT = -1;
  let paused = false, ended = false, shakeT = 0, atoms = [], els = [], links = [], uid = 0, hold = null;
  const live = () => atoms.filter(A => !A.leaving);
  const rad = A => atomR(A.el)*A.s;
  const DIR = s => [Math.cos(s*Math.PI/2), Math.sin(s*Math.PI/2)];
  const on = (A, s) => els.filter(e => e.at === A && e.side === s);                  // các chấm trên phía s của A
  const bondOn = (A, s) => links.some(l => l.kind === 'cov' && (l.a === A && l.sa === s || l.b === A && l.sb === s));
  const singles = A => [0, 1, 2, 3].filter(s => on(A, s).length === 1 && !bondOn(A, s));
  const covOf = A => links.filter(l => l.kind === 'cov' && (l.a === A || l.b === A));
  const around = A => els.filter(e => e.at === A).length + 2*covOf(A).reduce((n, l) => n + l.order, 0);   // electron lớp ngoài A đang có
  const charge = A => els.filter(e => e.own === A && e.at && e.at !== A).length - els.filter(e => e.at === A && e.own !== A).length;
  const order = (A, B) => (covOf(A).find(l => l.a === B || l.b === B) || {order:0}).order;
  const slot = e => { const A = e.at, L = on(A, e.side); return lwDot(A.vx, A.y, rad(A), e.side, A.rot, L.length > 1 ? 2*L.indexOf(e) - 1 : 0); };
  const here = e => { const p = slot(e); return {x:p.x + e.ox, y:p.y + e.oy}; };     // chỗ electron đang hiện
  const fly = (e, p) => { const s = slot(e); e.ox = p.x - s.x; e.oy = p.y - s.y; };  // electron vừa đổi chỗ: bay từ p tới chỗ mới
  const zXY = ev => { const z = layer.getBoundingClientRect(), s = z.width/ZW || 1; return {x:(ev.clientX - z.left)/s, y:(ev.clientY - z.top)/s}; };
  const dropAt = (e, h) => { const z = layer.getBoundingClientRect(), s = z.width/ZW || 1;
    return {x:(e.clientX - z.left)/s, y:(e.clientY - z.top)/s - (e.pointerType === 'mouse' ? 0 : h*.6 + 24)}; };
  const palPt = k => { const z = layer.getBoundingClientRect(), r = pal.children[k].querySelector('.vl-one').getBoundingClientRect(), s = z.width/ZW || 1;
    return {x:(r.left + r.width/2 - z.left)/s, y:(r.top + r.height/2 - z.top)/s}; };
  const setGo = chk => { bGo.innerHTML = chk ? ico('check') + ' Kiểm tra' : 'Tiếp tục ' + ico('next'); };
  const hud = (txt, el) => { G.querySelector(el || '#mgscore').textContent = txt; };
  const note = (msg, err) => { say.innerHTML = err ? `<span class="vl-bad">${msg}</span>` : msg; if(err) SFX.err(); };
  const seen = () => known.filter(k => (save.vlSeen || []).includes(k.f)).length;
  // chip trên đề: bóng nhỏ, kí hiệu, số electron lớp ngoài cùng, kim loại hay phi kim
  const chip = el => `<span class="vl-chip">${vlPiece(el, .7, true)}<b>${el}</b><span class="vl-vals all"><i>${LW_E[el]} e</i>`
    + `<i>${LW_METAL.includes(el) ? 'kim loại' : 'phi kim'}</i></span></span>`;

  // cụm: các bóng nối với A qua gạch nối hoặc cặp ion
  function frag(A){
    const F = [A];
    for(let k = 0; k < F.length; k++) links.forEach(l => { const B = l.a === F[k] ? l.b : l.b === F[k] ? l.a : null; if(B && !F.includes(B)) F.push(B); });
    return F;
  }
  // xoay cả cụm F k góc vuông theo chiều kim đồng hồ quanh bóng P: chỗ đứng, phía của từng chấm và từng đầu nối đều
  // xoay theo; rot giữ cho chấm lúc này vẫn hiện ở chỗ cũ rồi quay dần sang chỗ mới (đường ngắn nhất)
  function turn(F, P, k){
    if(!k) return;
    const c = [1, 0, -1, 0][k], s = [0, 1, 0, -1][k];
    F.forEach(A => { const dx = A.tx - P.tx, dy = A.ty - P.ty;
      A.tx = P.tx + dx*c - dy*s; A.ty = P.ty + dx*s + dy*c; A.rot -= (k === 3 ? -1 : k)*Math.PI/2; });
    els.forEach(e => { if(F.includes(e.at)) e.side = (e.side + k) % 4; if(F.includes(e.own)) e.home = (e.home + k) % 4; });
    links.forEach(l => { if(F.includes(l.a)) l.sa = (l.sa + k) % 4; if(F.includes(l.b)) l.sb = (l.sb + k) % 4; });
  }
  // nối A (phía sa) với B (phía sb). Hai cụm đang rời nhau thì cụm nhỏ hơn (bằng nhau: cụm của B) xoay rồi trượt tới
  // cho hai phía vừa nối quay vào nhau, cách đúng một khoảng nối; đã chung cụm thì giữ nguyên chỗ
  function join(kind, A, sa, B, sb, extra){
    const FA = frag(A), FB = frag(B), l = Object.assign({id:++uid, kind, a:A, sa, b:B, sb}, extra);
    links.push(l);
    if(FA.includes(B)) return l;
    const [P, Q, F] = FB.length <= FA.length ? [A, B, FB] : [B, A, FA], sd = X => X === l.a ? l.sa : l.sb;
    turn(F, Q, (sd(P) + 6 - sd(Q)) % 4);
    const [dx, dy] = DIR(sd(P)), d = P.R + Q.R + (kind === 'cov' ? LW_BOND : LW_ION), mx = P.tx + dx*d - Q.tx, my = P.ty + dy*d - Q.ty;
    F.forEach(X => { X.tx += mx; X.ty += my; });
    return l;
  }
  // dồn các cụm (mỗi cụm là một vật rắn) cho chấm của hai cụm khỏi chạm nhau, rồi đẩy cả cụm vào trong khu vực;
  // cụm chứa fix (bóng vừa thả / vừa nối) ít bị đẩy
  function relax(fix){
    const Fs = [], pad = A => A.R + LW_DOT + 10;
    live().forEach(A => { if(!Fs.some(F => F.includes(A))) Fs.push(frag(A)); });
    for(let it = 0; it < 40; it++){
      Fs.forEach((F, n) => Fs.slice(n + 1).forEach((E, m) => F.forEach(A => E.forEach(B => {
        const dx = B.tx - A.tx, dy = B.ty - A.ty, d = Math.hypot(dx, dy), need = pad(A) + pad(B);
        if(d >= need) return;
        const [ux, uy] = d > .5 ? [dx/d, dy/d] : [Math.cos(n + m + it), Math.sin(n + m + it)];
        const push = need - d, wa = F.includes(fix) ? .15 : E.includes(fix) ? .85 : .5;
        F.forEach(X => { X.tx -= ux*push*wa; X.ty -= uy*push*wa; });
        E.forEach(X => { X.tx += ux*push*(1 - wa); X.ty += uy*push*(1 - wa); });
      }))));
      Fs.forEach(F => ['tx', 'ty'].forEach(k => {
        const W = k === 'tx' ? ZW : ZH, lo = Math.min(...F.map(A => A[k] - pad(A))), hi = Math.max(...F.map(A => A[k] + pad(A)));
        const d = hi - lo > W ? (W - lo - hi)/2 : lo < 0 ? -lo : hi > W ? W - hi : 0;
        if(d) F.forEach(A => A[k] += d);
      }));
    }
  }
  // đặt electron e lên A: ưu tiên phía pref nếu còn trống, rồi phía trống bất kì, rồi phía mới có một chấm (không đặt lên
  // phía có gạch nối)
  function place(e, A, pref){
    const ss = [pref, 0, 1, 2, 3].filter(s => s != null && !bondOn(A, s));
    Object.assign(e, {at:A, side:ss.find(s => !on(A, s).length) ?? ss.find(s => on(A, s).length < 2)});
  }

  function put(el, k, d){                   // d: điểm thả; null = bấm → bóng rơi vào giữa sân, các cụm cũ dạt ra nhường chỗ
    if(phase !== 'build') return;
    if(live().length >= MAX){ SFX.err(); toast('Khu vực tạo chất đầy rồi — bấm vào một bóng để bỏ bớt!'); return; }
    const from = d || palPt(k), to = d || {x:ZW/2 + (Math.random() - .5)*60, y:ZH/2 + (Math.random() - .5)*40};
    const A = {el, metal:LW_METAL.includes(el), R:atomR(el)*SC, x:from.x, y:from.y, vx:from.x, tx:to.x, ty:to.y, s:SC, ts:SC, rot:0, leaving:false, bad:0};
    layer.insertAdjacentHTML('beforeend', atomBall({el, x:A.x, y:A.y, r:A.R}, 'lw-b'));
    A.div = layer.lastElementChild;
    atoms.push(A);
    lwSides(el).forEach((n, s) => { for(let j = 0; j < n; j++) els.push({id:++uid, own:A, at:A, side:s, home:s, ox:0, oy:0, link:null}); });
    relax(A); refresh(); SFX.clink();
  }
  // hai electron độc thân (của hai phi kim) thành một cặp dùng chung: thêm một gạch nối
  function bond(e1, e2){
    const A = e1.at, B = e2.at, sa = e1.side, sb = e2.side, old = covOf(A).find(l => l.a === B || l.b === B);
    e1.at = e2.at = null;
    if(old){ old.order++; old.els.push(e1, e2); old.grow.push(0); }
    else join('cov', A, sa, B, sb, {order:1, els:[e1, e2], grow:[0]});
  }
  function unbond(l){                       // tách một cặp dùng chung: mỗi bên nhận lại electron của mình, bay ra từ giữa gạch
    const m = {x:(l.a.vx + l.b.vx)/2, y:(l.a.y + l.b.y)/2}, two = l.els.splice(-2);
    l.grow.pop();
    if(!--l.order) links.splice(links.indexOf(l), 1);
    two.forEach(e => { place(e, e.own, l.order ? null : e.own === l.a ? l.sa : l.sb); fly(e, m); });
  }
  // electron e của kim loại (đang hiện ở p) sang phía s của phi kim X; hai bên chưa chung cụm thì thành cặp ion
  function give(e, X, s, p){
    const M = e.at, sm = e.side;
    Object.assign(e, {at:X, side:s, home:sm});
    if(!frag(M).includes(X)) e.link = join('ion', M, sm, X, s);
    fly(e, p);
  }
  function giveBack(e){                     // chấm đỏ bay về lại kim loại; cặp ion do nó tạo ra cũng rã
    const p = here(e);
    if(e.link){ links.splice(links.indexOf(e.link), 1); e.link = null; }
    place(e, e.own, e.home); fly(e, p);
  }
  // bỏ A khỏi bàn: tách hết gạch nối, rã cặp ion, electron ai về nhà nấy, rồi bóng bay về cột trái
  function drop(A){
    if(A.leaving) return;
    links.filter(l => l.a === A || l.b === A).forEach(l => {
      if(l.kind === 'cov') while(links.includes(l)) unbond(l);
      else { links.splice(links.indexOf(l), 1); els.forEach(e => { if(e.link === l) e.link = null; }); }
    });
    els.filter(e => e.at === A && e.own !== A).forEach(giveBack);
    els = els.filter(e => e.own !== A);
    const h = palPt(keys.indexOf(A.el));
    Object.assign(A, {leaving:true, tx:h.x, ty:h.y});
    A.div.style.pointerEvents = 'none';
    SFX.clink();
  }
  const clearOut = () => { live().forEach(drop); layer.classList.remove('vl-done'); };
  const wipe = () => { atoms.forEach(A => A.div.remove()); atoms = []; els = []; links = []; hold = null; layer.classList.remove('vl-done'); };
  // đang nhắm vào đâu: bóng gần p nhất trong tầm (thả lên chấm hay lên bóng đều được) và phía còn chấm độc thân gần p nhất
  function aim(e, p){
    const d = (u, x, y) => Math.hypot(u.x - x, u.y - y);
    const X = live().filter(B => B !== e.at && d(p, B.vx, B.y) < rad(B) + LW_DOT + 14).sort((u, w) => d(p, u.vx, u.y) - d(p, w.vx, w.y))[0];
    if(!X) return null;
    const near = s => { const o = slot(on(X, s)[0]); return d(p, o.x, o.y); };
    return {X, s:X.metal ? undefined : singles(X).sort((a, b) => near(a) - near(b))[0]};
  }
  function why(e, {X, s}){                  // vì sao không nối / không nhường được sang X (chuỗi rỗng: được)
    if(e.at.metal) return X.metal ? 'Electron của kim loại chỉ sang được phi kim.'
      : s === undefined ? `${X.el} đã đủ ${lwNeed(X.el)} electron lớp ngoài, không nhận thêm nữa.` : '';
    if(X.metal) return `${X.el} là kim loại — kim loại không góp chung mà <b>nhường</b> electron. Hãy kéo electron của ${X.el} thả vào phi kim.`;
    if(s === undefined) return `${X.el} không còn electron độc thân để góp chung.`;
    return order(e.at, X) >= 3 ? 'Hai nguyên tử góp chung nhiều nhất 3 cặp electron (liên kết ba).' : '';
  }

  layer.style.touchAction = 'none';
  layer.addEventListener('pointerdown', ev => {
    const t = ev.target.closest && ev.target.closest('[data-e],[data-l],.lw-b');
    if(ev.button !== 0 || phase !== 'build' || hold || !t) return;
    ev.preventDefault();
    layer.setPointerCapture(ev.pointerId);
    const p = zXY(ev);
    hold = {id:ev.pointerId, sx:p.x, sy:p.y, x:p.x, y:p.y, lx:p.x, ly:p.y, moved:false,
      e:t.dataset.e ? els.find(e => e.id === +t.dataset.e) : null, l:t.dataset.l ? links.find(l => l.id === +t.dataset.l) : null};
    if(!t.dataset.e && !t.dataset.l){ hold.A = atoms.find(A => A.div === t); hold.F = hold.A && frag(hold.A); }
    if(!hold.e && !hold.l && !hold.A) hold = null;
  });
  layer.addEventListener('pointermove', ev => {
    if(!hold || ev.pointerId !== hold.id) return;
    const p = zXY(ev);
    hold.x = p.x; hold.y = p.y;
    if(!hold.moved && Math.hypot(p.x - hold.sx, p.y - hold.sy) < 6) return;
    hold.moved = true;
    if(hold.F) hold.F.forEach(A => { A.x += p.x - hold.lx; A.y += p.y - hold.ly; A.tx += p.x - hold.lx; A.ty += p.y - hold.ly; });
    hold.lx = p.x; hold.ly = p.y;
  });
  function up(ev){
    if(!hold || ev.pointerId !== hold.id) return;
    const h = hold, p = zXY(ev);
    hold = null;
    if(phase !== 'build') return;
    if(h.A){                                // bấm bóng: bỏ bóng đó; kéo: dời cả cụm, kéo ra ngoài khu vực thì bỏ cả cụm
      if(!h.moved) drop(h.A);
      else if(p.x < 0 || p.y < 0 || p.x > ZW || p.y > ZH) h.F.forEach(drop);
      relax(h.A); return refresh();
    }
    if(h.l){ if(!h.moved && links.includes(h.l)){ unbond(h.l); SFX.clink(); relax(); refresh(); } return; }
    const e = h.e, A = e.at;
    if(!A) return;
    if(e.own !== A){ giveBack(e); SFX.clink(); relax(); return refresh(); }      // chấm đỏ: trả electron về kim loại
    if(!A.metal && on(A, e.side).length > 1) return note('Hai chấm này đã là một cặp electron — chỉ chấm đứng một mình (có quầng vàng) mới góp chung được.');
    if(!h.moved) return note(A.metal ? 'Kéo electron này thả vào một phi kim — kim loại <b>nhường</b> electron.'
      : 'Kéo từ chấm này sang một chấm có quầng vàng của nguyên tử khác để <b>góp chung</b> thành một cặp.');
    const tg = aim(e, p), no = tg && why(e, tg);
    if(!tg || no){ if(A.metal) fly(e, p); return no && note(no, true); }        // electron kim loại thả hụt thì bay về chỗ cũ
    if(A.metal) give(e, tg.X, tg.s, p); else bond(e, on(tg.X, tg.s)[0]);
    SFX.clink(); relax(A); refresh();
  }
  layer.addEventListener('pointerup', up);
  layer.addEventListener('pointercancel', up);

  function refresh(){                       // nút + dòng nhắc dưới bàn (chỉ lúc đang ghép; có bóng trên bàn thì để trống)
    if(phase !== 'build') return;
    const n = live().length;
    bGo.disabled = bClear.disabled = !n;
    say.innerHTML = n ? '' : 'Kéo nguyên tử vào khu vực tạo chất. Hai phi kim: kéo từ chấm có quầng vàng sang chấm có quầng vàng'
      + ' của nguyên tử kia để <b>góp chung</b>. Kim loại: kéo chấm electron thả vào phi kim để <b>nhường</b>.';
  }
  function lock(off){ pal.classList.toggle('off', off); bGo.disabled = bClear.disabled = off; }
  // cột trái: bóng có nhãn (câu hỏi) hoặc lưới bóng nhỏ (khám phá — rê chuột: số electron lớp ngoài, kim loại / phi kim)
  function setPal(grid){
    pal.classList.toggle('grid', !!grid);
    pal.innerHTML = keys.map((el, k) => `<div class="vl-pitem enter" style="animation-delay:${k*(grid ? 25 : 70)}ms">${lwPiece(el, grid ? 1.1 : SC)}`
      + (grid ? `<span class="vl-hv">${LW_E[el]} e · ${LW_METAL.includes(el) ? 'kim loại' : 'phi kim'}</span>`
        : `<div class="vl-plbl"><b>${el}</b> · ${EL_VN[el]}</div>`) + '</div>').join('');
    [...pal.children].forEach((it, k) => {
      const el = keys[k], S = lwPieceSize(el, SC);
      if(!grid) tapeLabel(it.querySelector('.vl-plbl'));
      dragify(it, 'vlatom', {w:S, h:S, enabled: () => phase === 'build', ghostHTML: () => lwPiece(el, SC),
        onDrop: (z, e) => put(el, k, dropAt(e, S)), onClick: () => put(el, k, null)});
    });
  }
  function round(){
    q = qs[++qi]; phase = 'build'; missed = false;
    wipe();
    keys = Object.keys(atomCounts(q.f)).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    t1.innerHTML = `<span class="vl-qn">Câu ${qi + 1}/${qs.length}</span>Vẽ sơ đồ Lewis: tạo <b>${q.name}</b>`;
    t2.innerHTML = keys.map(chip).join('');
    setPal(false);
    setGo(true); lock(false); refresh();
  }
  function exploreSetup(){
    keys = Object.keys(VL_VALS).filter(el => LW_E[el]);
    t1.innerHTML = '<span class="vl-qn">Khám phá</span>' + vlLewisSwitch();
    t2.innerHTML = '<span>Phi kim đủ 8 electron lớp ngoài (H đủ 2), kim loại nhường hết electron lớp ngoài</span>';
    bindLewisSwitch(i);
    setPal(true);
    hud('Sổ chất: ' + seen() + '/' + known.length);
    setGo(true); lock(false); refresh();
  }
  function endGame(){                       // hết giờ: khoá bàn, bảng tổng kết chỉ có Kết thúc
    ended = true; phase = 'end'; lock(true); eggBox.hide(); SFX.bell();
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="paper vl-end"><h2>${ico('flask', 24)} Hết giờ!</h2><p>Xong <b>${solved}</b>/${qs.length} câu · đúng ngay lần đầu <b>${correct}</b> câu</p>`
      + `<div class="row" style="justify-content:center;margin-top:10px"><button class="btn big" id="vfend">${ico('check')} Kết thúc</button></div></div>`;
    G.appendChild(ov);
    ov.querySelector('#vfend').onclick = () => showResult(i, {correct, total:qs.length, hard:true});
  }

  // các cụm rời nhau, tính cả kim loại với phi kim đã nhận electron của nó (cặp ion có thể đã rã khi trả bớt electron)
  function groups(){
    const L = live(), adj = new Map(L.map(A => [A, []])), seen = new Set();
    const tie = (A, B) => { adj.get(A).push(B); adj.get(B).push(A); };
    links.forEach(l => tie(l.a, l.b));
    els.forEach(e => { if(e.at && e.at !== e.own) tie(e.at, e.own); });
    return L.filter(A => { if(seen.has(A)) return false;
      const st = [A]; seen.add(A);
      while(st.length) adj.get(st.pop()).forEach(B => { if(!seen.has(B)){ seen.add(B); st.push(B); } });
      return true; }).length;
  }
  function check(){
    const L = live(), c = {}, bad = L.filter(A => A.metal ? els.some(e => e.at === A) : around(A) < lwNeed(A.el));
    L.forEach(A => c[A.el] = (c[A.el] || 0) + 1);
    if(bad.length){
      const A = bad[0];
      bad.forEach(B => B.bad = performance.now() + 1800);
      return (explore ? nope : wrong)((A.metal ? `${A.el} vẫn còn electron lớp ngoài — kim loại phải nhường hết cho phi kim.`
        : `${A.el} mới có ${around(A)} electron lớp ngoài — cần đủ ${lwNeed(A.el)} như khí hiếm${A.el === 'H' ? ' He' : ''}.`)
        + (bad.length > 1 ? ` <small>(còn ${bad.length - 1} nguyên tử nữa chưa đủ)</small>` : ''));
    }
    if(explore) return discover(c, groups());
    const want = atomCounts(q.f), g = groups();
    if(g === 1 && same(c, want)) return win();
    const egg = g === 1 && EGGS.find(f => same(c, atomCounts(f)));
    if(egg) return eggFound(egg);
    // nguyên tử nào cũng đủ electron mà vẫn sai: nói vì sao
    const ks = Object.keys(want), k = (c[ks[0]] || 0)/want[ks[0]], miss = ks.filter(e => !c[e]), tot = o => Object.values(o).reduce((s, n) => s + n, 0);
    const fml = ks.concat(Object.keys(c).filter(e => !want[e])).filter(e => c[e]).map(e => e + (c[e] > 1 ? c[e] : '')).join('');
    wrong('Mọi nguyên tử đều đủ electron, nhưng ' + (miss.length ? `thiếu ${miss.join(', ')} — ${q.name} có đủ ${ks.length} nguyên tố.`
      : g > 1 ? `trên bàn có ${g} cụm rời nhau — chỉ cần tạo một thôi.`
      : Number.isInteger(k) && k > 1 && ks.every(e => c[e] === want[e]*k) ? `công thức chưa tối giản — còn chia được cho ${k}.`
      : `${sub(fml)} chưa phải ${q.name}` + (tot(c) > tot(want) ? ' — thử với ít nguyên tử hơn.' : '.')));
  }
  const same = (a, b) => Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(e => a[e] === b[e]);
  function nope(msg, more){                 // bị từ chối: bàn rung nhưng giữ nguyên để sửa tiếp
    shakeT = performance.now() + 450; SFX.err();
    zone.classList.remove('flash-bad'); void zone.offsetWidth; zone.classList.add('flash-bad');
    say.innerHTML = `<span class="vl-bad">${ico('close', 20)} ${msg}</span>` + (more ? '<br><small>' + more + '</small>' : '');
  }
  function wrong(msg){ missed = true; nope(msg, 'Câu này không còn tính điểm — sửa tiếp trên bàn rồi Kiểm tra lại nhé!'); }   // sai: mất điểm câu này
  // tóm tắt liên kết trên bàn: các ion (ion dương trước) rồi số liên kết đơn / đôi / ba
  function bonds(){
    const nb = [0, 0, 0, 0], ions = [];
    links.forEach(l => { if(l.kind === 'cov') nb[l.order]++; });
    live().sort((A, B) => charge(B) - charge(A)).forEach(A => { const z = charge(A), t = A.el + ptCharge(z); if(z && !ions.includes(t)) ions.push(t); });
    const cov = [1, 2, 3].filter(o => nb[o]).map(o => nb[o] + ' liên kết ' + ['', 'đơn', 'đôi', 'ba'][o]).join(', ');
    return [ions.length ? 'Liên kết ion giữa ' + ions.join(' và ') : '', cov ? 'Liên kết cộng hoá trị: ' + cov : ''].filter(Boolean).join(' · ');
  }
  // khám phá: mọi bóng đã đủ electron (check lọc trước) — còn phải là một cụm và có trong sổ chất / chất bí mật
  function discover(c, g){
    if(g > 1) return nope(`Trên bàn có ${g} cụm rời nhau — ghép từng chất một thôi nhé!`);
    const hit = known.find(k => same(c, atomCounts(k.f))), egg = !hit && EGGS.find(f => same(c, atomCounts(f)));
    if(!hit && !egg){
      const gone = Object.keys(VL_GONE).find(f => same(c, atomCounts(f)));
      return nope(gone ? sub(`${gone} không tồn tại — phân huỷ ngay lập tức ${VL_GONE[gone]}!`)
        : (c.C || 0) >= 3 && c.H ? VL_ORG : 'Mọi nguyên tử đều đủ electron, nhưng chưa có chất này trong sổ — thử chất khác!');
    }
    const f = hit ? hit.f : egg, nm = hit ? hit.name : VL_EGG[egg].nm;
    let fresh = false;
    if(hit){ save.vlSeen = save.vlSeen || []; if(!save.vlSeen.includes(f)){ save.vlSeen.push(f); persist(); fresh = true; } }
    if(!found.includes(f)){ found.push(f); vlFoundTag(f, egg, nm); }
    hud('Sổ chất: ' + seen() + '/' + known.length);
    phase = 'next'; lock(true); pop();
    layer.classList.add('vl-done');
    if(egg){ SFX.tinkle(); eggBox.collect(egg); } else SFX.coin();
    say.innerHTML = `<span class="vl-ok">${ico(egg ? 'star' : 'check', 20)}</span> <b class="vl-f">${sub(fShow(f))}</b> — ${nm}`
      + (fresh ? ' <b class="vl-ok">Mới!</b>' : '') + `<br><small>${bonds()}</small>`;
    setGo(false); bGo.disabled = false;
  }
  const pop = () => live().forEach((A, n) => setTimeout(() => { A.div.classList.remove('vl-pop'); void A.div.offsetWidth; A.div.classList.add('vl-pop'); }, n*40));
  function win(){
    const last = qi + 1 >= qs.length;
    if(!missed){ correct++; mgScore(correct, qs.length); }
    solved++;
    phase = 'done'; lock(true); SFX.coin(); pop();
    layer.classList.add('vl-done');
    say.innerHTML = `<span class="vl-ok">${ico('check', 20)} Chính xác!</span> <b class="vl-f">${sub(q.f)}</b> — ${q.name}<br><small>${bonds()}</small>`;
    if(last){ paused = true; side.classList.add('complete'); SFX.bell(); }
    else { setGo(false); bGo.disabled = false; }
  }
  function eggFound(egg){
    phase = 'egg'; lock(true); SFX.tinkle(); pop(); eggBox.collect(egg);
    layer.classList.add('vl-done');
    say.innerHTML = `<span class="vl-ok">${ico('star', 20)}</span> <b class="vl-f">${sub(fShow(egg))}</b> — ${VL_EGG[egg].nm}`
      + `<br><small>Chất bí mật! Giờ hãy tạo ${q.name} nhé ;)</small>`;
    setGo(false); bGo.disabled = false;
  }
  bGo.onclick = () => {
    if(phase === 'build'){ if(live().length) check(); }
    else if(phase === 'egg' || phase === 'next'){ eggBox.hide(); clearOut(); phase = 'build'; setGo(true); lock(false); refresh(); }   // next: khám phá dọn bàn
    else if(phase === 'done'){ SFX.page(); round(); }
  };
  bClear.onclick = () => { if(phase === 'build'){ clearOut(); refresh(); } };
  G.querySelector('#vlend').onclick = () => showResult(i, {correct, total:qs.length, hard:true});

  // vẽ cả bàn: sticker + gạch nối (tay của vlLayers, co giãn cho hai đầu luôn chạm nhau), vùng bấm gạch nối, ngoặc vuông +
  // điện tích, quầng vàng, chấm electron (chấm đỏ: electron kim loại đã nhường), dây đang kéo / electron đang mang đi
  function draw(now){
    const t = now/1000, sh = now < shakeT ? 7*Math.sin(t*55)*(shakeT - now)/450 : 0, f = n => n.toFixed(1);
    atoms.forEach(A => { A.vx = A.x + (A.leaving ? 0 : sh); A.arms = []; });
    let hitL = '', hitE = '', hitR = '', deco = '', glow = '', dots = '', top = '';
    links.forEach(l => {
      if(l.kind !== 'cov') return;
      const {a:A, b:B} = l, a = Math.atan2(B.y - A.y, B.vx - A.vx), w = l.order > 1 ? 2.2 : 3.2;
      const k = Math.hypot(B.vx - A.vx, B.y - A.y)/((atomR(A.el) + atomR(B.el) + 2*VL_ARM)*SC);
      [[0], [-2.2, 2.2], [-4.4, 0, 4.4]][l.order - 1].forEach((d, n) => { const g = l.grow[n]*k;
        A.arms.push({a, d, w, g}); B.arms.push({a:a + Math.PI, d, w, g}); });
      hitL += `<line data-l="${l.id}" x1="${f(A.vx)}" y1="${f(A.y)}" x2="${f(B.vx)}" y2="${f(B.y)}" stroke="transparent" stroke-width="18"/>`;
    });
    live().forEach(A => {
      const z = charge(A), r = rad(A), lab = (Math.abs(z) > 1 ? Math.abs(z) : '') + (z > 0 ? '+' : '−');
      if(now < A.bad) deco += `<circle cx="${f(A.vx)}" cy="${f(A.y)}" r="${f(r + LW_DOT + 8)}" fill="none" stroke="#d9634f" stroke-width="3" `
        + `stroke-dasharray="7 5" opacity="${f(Math.min(1, (A.bad - now)/600))}"/>`;
      if(!z) return;
      if(z > 0){ deco += `<text class="lw-q" x="${f(A.vx + r*.7 + 2)}" y="${f(A.y - r*.7 - 2)}">${lab}</text>`; return; }
      const bx = r + LW_DOT + 9, by = r + LW_DOT + 7;
      deco += `<path d="M${f(A.vx - bx + 5)} ${f(A.y - by)}h-5v${f(2*by)}h5M${f(A.vx + bx - 5)} ${f(A.y - by)}h5v${f(2*by)}h-5" fill="none" stroke="#3b3025" stroke-width="2"/>`
        + `<text class="lw-q" x="${f(A.vx + bx + 2)}" y="${f(A.y - by + 8)}">${lab}</text>`;
    });
    const held = hold && hold.moved && hold.e && hold.e.at && hold.e.own === hold.e.at && (hold.e.at.metal || on(hold.e.at, hold.e.side).length === 1) ? hold.e : null;
    els.forEach(e => {
      if(!e.at || e.at.leaving) return;
      const A = e.at, mine = e.own === A, p = e === held && A.metal ? {x:hold.x, y:hold.y} : here(e);
      if(mine && phase === 'build' && (A.metal || on(A, e.side).length === 1))
        glow += `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(8.5 + Math.sin(t*5 + e.id)*1.2)}" fill="#e8b84b" opacity=".55"/>`;
      dots += `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${mine ? LW_DOT_R : LW_DOT_R + .5}" fill="${mine ? '#3b3025' : '#d9634f'}"${mine ? '' : ' stroke="#3b3025" stroke-width="1"'}/>`;
      const h = `<circle data-e="${e.id}" cx="${f(p.x)}" cy="${f(p.y)}" r="13" fill="transparent"/>`;
      if(mine) hitE += h; else hitR += h;           // vùng bấm chấm đỏ nằm trên cùng: chung cặp vẫn bấm trúng chấm đỏ
    });
    if(held){                               // dây nét đứt từ chấm đang kéo; nhắm đúng chỗ nối / nhận được thì đầu dây bắt vào đó, sáng xanh
      const o = slot(held), tg = aim(held, hold), ok = tg && !why(held, tg), X = ok && tg.X;
      const end = ok && !held.at.metal ? slot(on(X, tg.s)[0]) : hold;
      top += `<line x1="${f(o.x)}" y1="${f(o.y)}" x2="${f(end.x)}" y2="${f(end.y)}" stroke="#3b3025" stroke-width="2.2" stroke-dasharray="5 5" stroke-linecap="round"/>`;
      if(ok) top += held.at.metal ? `<circle cx="${f(X.vx)}" cy="${f(X.y)}" r="${f(rad(X) + LW_DOT + 8)}" fill="none" stroke="#7aa95c" stroke-width="3"/>`
        : `<circle cx="${f(end.x)}" cy="${f(end.y)}" r="10" fill="none" stroke="#7aa95c" stroke-width="3"/>`;
    }
    svg.innerHTML = vlLayers(atoms.map(A => ({el:A.el, x:A.vx, y:A.y, s:A.s, arms:A.arms}))) + deco + glow + top + dots + hitL + hitE + hitR;
    atoms.forEach(A => { const r = rad(A), st = A.div.style;
      st.left = A.vx + 'px'; st.top = A.y + 'px'; st.width = st.height = 2*r + 'px'; st.fontSize = Math.max(7, Math.round(r*.95)) + 'px'; });
  }
  // vòng vẽ: đồng hồ của màn; bóng trôi êm về đích, chấm quay về phía mới, electron bay tới chỗ mới, gạch nối mọc dần
  let last = performance.now();
  (function frame(now){
    if(!zone.isConnected) return;                                       // rời minigame: dừng hẳn
    const dt = Math.max(0, Math.min(now - last, 120))/1000, e = 1 - Math.exp(-dt*9);
    const clk = Math.max(0, Math.min(now - last, 1000))/1000;           // như trò thường: ngắt quãng quá 1 s chỉ tính 1 s
    last = now;
    if(!explore && !ended && !paused && !mgHeld()){
      tLeft = Math.max(0, tLeft - clk);
      const sec = Math.ceil(tLeft);
      if(sec !== shownT){ shownT = sec; hud('Còn ' + sec + ' giây', '#mgtime'); }
      if(!tLeft) endGame();
    }
    atoms.forEach(A => { A.x += (A.tx - A.x)*e; A.y += (A.ty - A.y)*e; A.s += (A.ts - A.s)*e; A.rot -= A.rot*e; });
    els.forEach(x => { x.ox -= x.ox*e; x.oy -= x.oy*e; });
    links.forEach(l => { if(l.grow) l.grow.forEach((g, n) => l.grow[n] += (1 - g)*Math.min(1, e*1.3)); });
    atoms = atoms.filter(A => { if(!A.leaving || Math.hypot(A.tx - A.x, A.ty - A.y) > 8) return true; A.div.remove(); return false; });
    draw(now);
    requestAnimationFrame(frame);
  })(last);
  if(explore) exploreSetup();
  else { G.querySelector('#mgtime').style.display = ''; hud('Còn ' + TOTAL_T + ' giây', '#mgtime'); mgScore(0, qs.length); round(); }
 },

 /* --- ngày 3, chế độ khó: tạo ion (day.hard, bật bằng công tắc chế độ khó chung). Mỗi câu chỉ có MỘT nguyên tử, vẽ
        đủ các lớp electron (e.sh): bóng hạt nhân ở giữa, mỗi lớp một vòng. Lớp trong là chấm nhỏ đều quanh vòng, cố định
        (bấm vào thì chỉ nhắc); lớp ngoài cùng là chấm to có quầng vàng, xếp như sơ đồ Lewis trên vòng ngoài: bốn phía
        phải, dưới, trái, trên, mỗi phía tối đa 2. Dưới nguyên tử có dòng đếm mờ số electron lớp ngoài cùng (lớp ngoài bị
        bỏ hết thì đếm lớp kế trong — vòng ngoài khi đó chỉ còn nét đứt mờ). Đề chỉ ghi tên nguyên tố — không nói kim loại
        hay phi kim, nhường hay nhận, mấy electron. Quanh nguyên tử có vài ELECTRON TỰ DO trôi lơ lửng (đỏ; luôn còn ít
        nhất FREE_MIN cái — thiếu thì có cái mới trôi vào từ mép), không bao giờ trôi vào vùng nguyên tử:
        – nhường: bấm vào chấm lớp ngoài → electron bật ra, bay xa dần rồi trôi tự do; hoặc kéo chấm ra xa nguyên tử (dây
          nét đứt đứt ra) rồi thả;
        – nhận: bấm vào electron tự do, hoặc kéo nó thả vào nguyên tử → chấm vào phía còn trống trước (phải, trái, trên,
          dưới), hết phía trống mới ghép đôi (trên, dưới, trái, phải), tối đa 8 chấm. Electron từ ngoài vào vẽ đỏ như ở sơ
          đồ Lewis; electron của chính nguyên tử bật ra vẫn đen, nhận lại thì vẫn đen.
        Số chấm lệch số ban đầu là hiện điện tích ngay (ion âm có ngoặc vuông). Kiểm tra: đúng ion có lớp electron như khí
        hiếm (ptIon). Còn trung hoà thì chỉ nhắc; sai là mất điểm câu đó nhưng bàn giữ nguyên để sửa tiếp. Làm lại: trả
        nguyên tử về như lúc đầu. Cả màn day.hard.time giây; xong hết câu là Kết thúc; sao lưu vào cột sao chế độ khó. --- */
 ion(i, day){
  const H = day.hard, qs = shuffle(H.pools.flatMap(([n, list]) => shuffle(list).slice(0, n))).map(el => {
    const e = PT_BY[el]; return {el, e, sh:e.sh, n0:ptOuter(e), I:ptIon(e)}; });
  // RN: bán kính bóng hạt nhân; vòng thứ j (lớp j + 1) cách tâm RING0 + j·GAP — nguyên tử càng nhiều lớp càng to (K, Ca,
  // Br 4 lớp vừa khít khu vực); DOT_R / IN_R: chấm lớp ngoài / lớp trong; PAIR_D: nửa khoảng cách hai chấm một cặp.
  // Không có cột trái nên khu vực rộng thêm đúng chỗ của nó (.vl-pal 180px + khoảng hở 18px): ZW = 840 + 198
  const TOTAL_T = H.time, ZW = 1038, ZH = 430, RN = 26, RING0 = 50, GAP = 30, MAX = 8, CX = ZW/2, CY = ZH/2 - 6;
  const DOT_R = LW_DOT_R*1.8, IN_R = 4.4, PAIR_D = 13, FILL = [0, 2, 3, 1], PAIR = [3, 1, 2, 0];
  const f = n => n.toFixed(1);
  const dot = (p, mine, r = DOT_R) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(mine ? r : r + .6)}" fill="${mine ? '#3b3025' : '#d9634f'}"`
    + (mine ? '/>' : ' stroke="#3b3025" stroke-width="1.2"/>');
  const halo = (p, r) => `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(Math.max(0, r))}" fill="#e8b84b" opacity=".5"/>`;
  // electron tự do: lúc đầu câu có FREE0 cái; trôi chậm SPD px/s, bật ra khỏi nguyên tử thì bay EJECT px/s rồi chậm dần;
  // cách mép khu vực PAD; FREE_HIT: bán kính vùng bấm vô hình (to hơn chấm nhiều cho dễ trúng)
  const FREE0 = 4, FREE_MIN = 3, SPD = 22, EJECT = 260, PAD = 16, FREE_HIT = 22;
  mgFrame(i, day, `<div class="vl lw io">
    <div class="vl-task"><div class="io-row"><div class="vl-t1"></div>
      <button class="btn io-hbtn" id="iohelp" aria-label="Cách chơi" title="Cách chơi">?</button></div></div>
    <div class="vl-mid">
      <div class="vl-zone" data-dz="vbuild" style="width:${ZW}px;height:${ZH}px">
        <div class="vl-layer"><svg class="bonds lw-svg" width="${ZW}" height="${ZH}" style="overflow:visible"></svg></div>
        <span class="vl-zlbl">Khu vực tạo ion</span></div>
      <div class="vl-side">
        <div class="vl-acts"><button class="btn big" id="vlgo"></button>
          <button class="btn" id="vlclear">${ico('retry')} Làm lại</button></div>
        <div class="vl-donebox"><b>Hoàn thành!</b><button class="btn big" id="vlend">${ico('check')} Kết thúc</button></div></div>
    </div>
    <div class="vl-say"></div></div>`);
  G.querySelector('.hud-title').insertAdjacentHTML('beforeend', ' · <span style="color:#a8331f">khó</span>');
  const t1 = G.querySelector('.vl-t1'), side = G.querySelector('.vl-side');
  const zone = G.querySelector('.vl-zone'), layer = zone.querySelector('.vl-layer'), svg = layer.firstElementChild;
  const say = G.querySelector('.vl-say'), bGo = G.querySelector('#vlgo'), bClear = G.querySelector('#vlclear');
  tapeLabel(zone.querySelector('.vl-zlbl'));
  // q: {el, e (ô bảng tuần hoàn), sh (số electron từng lớp), n0 (số electron lớp ngoài lúc đầu), I (ion đúng, ptIon)};
  // RO: bán kính vòng ngoài cùng; g: độ nở của các vòng lúc mới ra câu (0 → 1, từ born); ax: tâm đang vẽ (cộng cả độ
  // rung); els: electron lớp ngoài {id, mine (của chính nguyên tử / từ ngoài vào), side, ox, oy (độ lệch lúc đang bay —
  // giảm dần về 0)}; free: electron tự do {id, x, y, vx, vy, mine, t0 (lúc hiện ra)} — một electron đổi qua lại giữa
  // els và free vẫn giữ id; hold: chấm đang bị nhấn giữ (e: lớp ngoài, o: tự do)
  let qi = -1, q = null, RO = 0, g = 1, born = 0, ax = CX, ball = null, correct = 0, solved = 0, missed = false, phase = 'build', tLeft = TOTAL_T, shownT = -1;
  let paused = false, ended = false, shakeT = 0, badT = 0, els = [], free = [], uid = 0, hold = null;
  const on = s => els.filter(e => e.side === s);
  const sideFor = () => FILL.find(s => !on(s).length) ?? PAIR.find(s => on(s).length < 2);
  const charge = () => q.n0 - els.length;
  const reach = () => RO + 34;                          // kéo chấm lớp ngoài ra xa hơn chừng này là nhường; thả electron tự do gần hơn là nhận
  const clear = () => RO + DOT_R + 52;                  // electron tự do không trôi vào trong vòng này (cả ngoặc vuông, dòng đếm)
  const slot = e => { const L = on(e.side), r = RO*g, a = e.side*Math.PI/2 + (L.length > 1 ? (2*L.indexOf(e) - 1)*PAIR_D/RO : 0);
    return {x:ax + r*Math.cos(a), y:CY + r*Math.sin(a)}; };
  const nextSlot = () => { const s = sideFor(), a = s*Math.PI/2 + (on(s).length ? PAIR_D/RO : 0);   // chỗ electron nhận tiếp sẽ vào
    return {x:ax + RO*g*Math.cos(a), y:CY + RO*g*Math.sin(a)}; };
  // vùng bấm (vô hình, rộng hơn chấm nhiều cho dễ trúng) của chấm lớp ngoài e: hình quạt vành khăn chờm ra ngoài vòng
  // ngoài, từ RO − HIT_IN (chưa chạm vùng bấm lớp trong, cách RO − 20) tới RO + HIT_OUT, rộng ±HIT_A quanh phía của chấm
  // (45°: trọn góc phần tư, quạt các phía khít nhau không hở); phía có hai chấm thì chia đôi tại trục, mỗi chấm một nửa —
  // các quạt không chồng nhau. Electron tự do không bao giờ trôi vào sâu tới đây (clear), vùng bấm của nó vẽ đè lên trên
  const HIT_A = Math.PI/4, HIT_IN = 15, HIT_OUT = 50;
  function hitArc(e){
    const L = on(e.side), a = e.side*Math.PI/2, k = L.length > 1 ? 2*L.indexOf(e) - 1 : 0;
    const a0 = k > 0 ? a : a - HIT_A, a1 = k < 0 ? a : a + HIT_A, r0 = (RO - HIT_IN)*g, r1 = (RO + HIT_OUT)*g;
    const P = (r, t) => f(ax + r*Math.cos(t)) + ' ' + f(CY + r*Math.sin(t));
    return `<path data-e="${e.id}" d="M${P(r1, a0)}A${f(r1)} ${f(r1)} 0 0 1 ${P(r1, a1)}L${P(r0, a1)}A${f(r0)} ${f(r0)} 0 0 0 ${P(r0, a0)}Z" fill="transparent"/>`;
  }
  const here = e => { const p = slot(e); return {x:p.x + e.ox, y:p.y + e.oy}; };
  const fly = (e, p) => { const s = slot(e); e.ox = p.x - s.x; e.oy = p.y - s.y; };
  // thêm / bớt chấm làm các chấm cùng phía dời chỗ (đứng giữa ↔ thành cặp): chấm cũ trượt êm từ chỗ đang hiện (old)
  function settle(fn){ const old = new Map(els.map(e => [e, here(e)])); fn(old); els.forEach(e => { if(old.has(e)) fly(e, old.get(e)); }); }
  const zXY = ev => { const z = layer.getBoundingClientRect(), s = z.width/ZW || 1; return {x:(ev.clientX - z.left)/s, y:(ev.clientY - z.top)/s}; };
  // một electron tự do ở p; v: vận tốc đầu (không có: trôi chậm theo hướng bất kì)
  function loose(p, mine, v, id){
    const a = Math.random()*2*Math.PI;
    free.push({id:id || ++uid, x:p.x, y:p.y, vx:v ? v.x : Math.cos(a)*SPD, vy:v ? v.y : Math.sin(a)*SPD, mine, t0:performance.now()});
  }
  function spot(){                          // chỗ trống cho electron tự do lúc đầu câu: ngoài vùng nguyên tử, không sát nhau
    for(let k = 0; k < 80; k++){
      const p = {x:PAD + Math.random()*(ZW - 2*PAD), y:PAD + 18 + Math.random()*(ZH - 2*PAD - 18)};
      if(Math.hypot(p.x - CX, p.y - CY) > clear() + 10 && free.every(o => Math.hypot(o.x - p.x, o.y - p.y) > 60)) return p;
    }
    return {x:PAD + 20 + Math.random()*80, y:ZH/2};
  }
  const setGo = chk => { bGo.innerHTML = chk ? ico('check') + ' Kiểm tra' : 'Tiếp tục ' + ico('next'); };
  const hud = (txt, el) => { G.querySelector(el || '#mgscore').textContent = txt; };
  const note = (msg, err) => { say.innerHTML = err ? `<span class="vl-bad">${msg}</span>` : msg; if(err) SFX.err(); };

  const away = (p, k) => { const dx = p.x - ax, dy = p.y - CY, d = Math.hypot(dx, dy) || 1; return {x:dx/d*k, y:dy/d*k}; };   // vận tốc hướng ra xa tâm
  function capture(o, p){                   // nguyên tử nhận electron tự do o (đang ở p): chấm bay vào chỗ trống trên vòng ngoài
    if(els.length >= MAX){ note(`Lớp ngoài cùng đã đủ ${MAX} electron — không nhận thêm được nữa.`, true); return false; }
    free.splice(free.indexOf(o), 1);
    const e = {id:o.id, mine:o.mine, ox:0, oy:0};
    settle(() => { e.side = sideFor(); els.push(e); });
    fly(e, p);
    SFX.clink(); refresh();
    return true;
  }
  function eject(e, p, soft){               // nguyên tử nhường electron e (đang ở p): bật ra xa (soft: kéo ra rồi thả — trôi luôn)
    settle(() => els.splice(els.indexOf(e), 1));
    loose(p, e.mine, soft ? away(p, SPD) : away(p, EJECT), e.id);
    SFX.clink(); refresh();
  }
  // Làm lại: electron từ ngoài vào bật ra, electron của nguyên tử đang trôi tự do bay về (thiếu thì mọc từ hạt nhân), xếp
  // lại như lúc đầu
  function reset(){
    if(phase !== 'build') return;
    settle(old => {
      els.filter(e => !e.mine).forEach(e => loose(old.get(e), false, away(old.get(e), EJECT), e.id));
      const keep = els.filter(e => e.mine), back = free.filter(o => o.mine).slice(0, q.n0 - keep.length);
      free = free.filter(o => !back.includes(o));
      const ret = back.map(o => { const e = {id:o.id, mine:true, ox:0, oy:0}; old.set(e, {x:o.x, y:o.y}); return e; });
      while(keep.length + ret.length < q.n0){ const e = {id:++uid, mine:true, ox:0, oy:0}; old.set(e, {x:ax, y:CY}); ret.push(e); }
      els = [];
      keep.concat(ret).forEach(e => { e.side = sideFor(); els.push(e); });
    });
    SFX.clink(); refresh();
  }

  layer.style.touchAction = 'none';
  layer.addEventListener('pointerdown', ev => {
    const t = ev.target.closest && ev.target.closest('[data-e],[data-f],[data-i]');
    if(ev.button !== 0 || phase !== 'build' || hold || !t) return;
    if(t.dataset.i) return note('Electron lớp trong bị hạt nhân giữ rất chặt — chỉ electron <b>lớp ngoài cùng</b> (vòng ngoài, có quầng vàng) mới nhường hay nhận được.');
    const e = t.dataset.e && els.find(x => x.id === +t.dataset.e), o = t.dataset.f && free.find(x => x.id === +t.dataset.f);
    if(!e && !o) return;
    ev.preventDefault();
    layer.setPointerCapture(ev.pointerId);
    const p = zXY(ev);
    hold = {id:ev.pointerId, e, o, sx:p.x, sy:p.y, x:p.x, y:p.y, moved:false};
  });
  layer.addEventListener('pointermove', ev => {
    if(!hold || ev.pointerId !== hold.id) return;
    const p = zXY(ev);
    hold.x = p.x; hold.y = p.y;
    if(Math.hypot(p.x - hold.sx, p.y - hold.sy) >= 6) hold.moved = true;
  });
  layer.addEventListener('pointerup', ev => {
    if(!hold || ev.pointerId !== hold.id) return;
    const {e, o, moved, x, y} = hold, near = Math.hypot(x - ax, y - CY) <= reach();
    hold = null;
    if(phase !== 'build') return;
    if(o){                                  // electron tự do: bấm, hoặc kéo thả vào nguyên tử → nhận; thả chỗ khác → trôi tiếp từ đó
      if(!free.includes(o) || (!moved || near) && capture(o, moved ? {x, y} : o)) return;
      if(moved) Object.assign(o, {x, y, vx:0, vy:0});
      return;
    }
    if(!els.includes(e)) return;
    if(!moved) return eject(e, here(e));                               // bấm: electron bật ra
    if(!near) return eject(e, {x, y}, true);                           // kéo ra xa rồi thả: electron trôi đi từ đó
    fly(e, {x, y});                                                     // thả lại gần nguyên tử: chấm về chỗ cũ
  });
  layer.addEventListener('pointercancel', ev => {
    if(!hold || ev.pointerId !== hold.id) return;
    if(hold.moved && hold.e) fly(hold.e, hold);
    if(hold.moved && hold.o) Object.assign(hold.o, {x:hold.x, y:hold.y, vx:0, vy:0});
    hold = null;
  });

  function refresh(){                       // sau mỗi thao tác: bật nút, xoá lời nhắc cũ (cách chơi ở card mở bằng nút ? cạnh đề)
    if(phase !== 'build') return;
    bGo.disabled = bClear.disabled = false;
    say.innerHTML = '';
  }
  function lock(off){ bGo.disabled = bClear.disabled = off; }
  function round(){
    q = qs[++qi]; phase = 'build'; missed = false; badT = 0;
    RO = RING0 + (q.sh.length - 1)*GAP; g = 0; born = performance.now();  // các vòng nở ra từ hạt nhân
    ax = CX; els = []; free = []; hold = null;
    layer.classList.remove('vl-done');
    if(ball) ball.remove();
    layer.insertAdjacentHTML('beforeend', atomBall({el:q.el, x:CX, y:CY, r:RN}, 'vl-pop'));
    ball = layer.lastElementChild;
    for(let k = 0; k < q.n0; k++) els.push({id:++uid, mine:true, side:sideFor(), ox:0, oy:0});
    for(let k = 0; k < FREE0; k++) loose(spot(), false);              // số electron tự do lúc đầu luôn như nhau: không lộ đáp án
    t1.innerHTML = `<span class="vl-qn">Câu ${qi + 1}/${qs.length}</span>Tạo ion bền từ nguyên tử <b>${q.e.nm}</b>`;
    setGo(true); lock(false); refresh();
  }
  function endGame(){                       // hết giờ: khoá bàn, bảng tổng kết chỉ có Kết thúc
    ended = true; phase = 'end'; hold = null; lock(true); SFX.bell();
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="paper vl-end"><h2>${ico('flask', 24)} Hết giờ!</h2><p>Xong <b>${solved}</b>/${qs.length} câu · đúng ngay lần đầu <b>${correct}</b> câu</p>`
      + `<div class="row" style="justify-content:center;margin-top:10px"><button class="btn big" id="vfend">${ico('check')} Kết thúc</button></div></div>`;
    G.appendChild(ov);
    ov.querySelector('#vfend').onclick = () => showResult(i, {correct, total:qs.length, hard:true});
  }

  function check(){
    const {el, n0, I} = q, z = charge(), k = els.length;
    if(!z) return note(`Nguyên tử ${el} vẫn trung hoà về điện, chưa phải ion — hãy <b>bỏ</b> hoặc <b>thêm</b> electron.`, true);
    if(z === I.q) return win();
    wrong(I.give
      ? (z < 0 ? `${el} chỉ có ${n0} electron lớp ngoài — <b>nhường</b> ${n0} electron dễ hơn nhiều so với nhận thêm ${8 - n0}. Kim loại thì nhường electron.`
               : `${el} vẫn còn ${k} electron lớp ngoài — kim loại nhường <b>hết</b> electron lớp ngoài cùng.`)
      : z > 0 ? `${el} đã có ${n0} electron lớp ngoài — <b>nhận thêm</b> ${8 - n0} electron dễ hơn nhiều so với nhường ${n0}. Phi kim thì nhận electron.`
      : `${el} mới có ${k} electron lớp ngoài — cần đủ 8 như khí hiếm.`);
  }
  function wrong(msg){                      // sai: mất điểm câu này, bàn rung, vòng đỏ quanh nguyên tử, giữ nguyên để sửa tiếp
    missed = true;
    shakeT = performance.now() + 450; badT = performance.now() + 1800; SFX.err();
    zone.classList.remove('flash-bad'); void zone.offsetWidth; zone.classList.add('flash-bad');
    say.innerHTML = `<span class="vl-bad">${ico('close', 20)} ${msg}</span><br><small>Câu này không còn tính điểm — sửa tiếp rồi Kiểm tra lại nhé!</small>`;
  }
  function win(){
    const {el, e, I} = q, last = qi + 1 >= qs.length, ke = I.k + 'e';
    if(!missed){ correct++; mgScore(correct, qs.length); }
    solved++;
    phase = 'done'; lock(true); SFX.coin();
    ball.classList.remove('vl-pop'); void ball.offsetWidth; ball.classList.add('vl-pop');
    layer.classList.add('vl-done');
    say.innerHTML = `<span class="vl-ok">${ico('check', 20)} Chính xác!</span> <b class="vl-f">${I.give ? `${el} → ${I.ion} + ${ke}` : `${el} + ${ke} → ${I.ion}`}</b>`
      + `<br><small>${e.nm[0].toUpperCase() + e.nm.slice(1)} ${I.give ? 'nhường' : 'nhận thêm'} ${I.k} electron → ion ${I.give ? 'dương' : 'âm'} ${I.ion}`
      + ` có các lớp electron ${I.sh.join(', ')} — giống khí hiếm ${I.gas.s}</small>`;
    if(last){ paused = true; side.classList.add('complete'); SFX.bell(); }
    else { setGo(false); bGo.disabled = false; }
  }
  bGo.onclick = () => {
    if(phase === 'build') check();
    else if(phase === 'done'){ SFX.page(); round(); }
  };
  bClear.onclick = reset;
  G.querySelector('#vlend').onclick = () => showResult(i, {correct, total:qs.length, hard:true});

  // vẽ cả bàn trên một svg: các vòng + chấm lớp trong, sticker của bóng, vòng đỏ khi sai, điện tích (ion âm có ngoặc
  // vuông), dòng đếm lớp ngoài cùng, quầng vàng, chấm lớp ngoài (đỏ: từ ngoài vào), electron tự do (mới hiện thì nở ra),
  // dây nét đứt: chấm lớp ngoài đang kéo ↔ chỗ cũ (kéo quá xa thì dây đứt: thả là nhường), electron tự do đang kéo vào gần
  // ↔ chỗ nó sẽ vào (vòng xanh); bóng hạt nhân là .atom đè lên trên
  function draw(now){
    const t = now/1000, sh = now < shakeT ? 7*Math.sin(t*55)*(shakeT - now)/450 : 0, z = charge(), o = RO*g, L = q.sh.length;
    ax = CX + sh;
    const lab = (Math.abs(z) > 1 ? Math.abs(z) : '') + (z > 0 ? '+' : '−'), held = hold && hold.moved && hold.e;
    const out = els.length || q.sh[L - 2] || 0;                           // lớp ngoài bị bỏ hết thì lớp kế trong thành lớp ngoài cùng
    let rings = '', inner = '', deco = '', glow = '', dots = '', hitI = '', hit = '', hitF = '', top = '';
    q.sh.forEach((n, j) => {                // vòng ngoài trống: nét đứt mờ (vẫn là chỗ để nhận lại electron)
      const r = (RING0 + j*GAP)*g, empty = j === L - 1 && !els.length;
      rings += `<circle cx="${f(ax)}" cy="${CY}" r="${f(r)}" fill="none" stroke="#3b3025" stroke-width="1.5" stroke-opacity="${empty ? .22 : .38}"`
        + (empty ? ' stroke-dasharray="4 6"/>' : '/>');
      if(j < L - 1) for(let k = 0; k < n; k++){
        const a = -Math.PI/2 + j*.4 + 2*Math.PI*k/n, x = f(ax + r*Math.cos(a)), y = f(CY + r*Math.sin(a));
        inner += `<circle cx="${x}" cy="${y}" r="${IN_R}" fill="#3b3025" opacity=".8"/>`;
        hitI += `<circle data-i="${j}" cx="${x}" cy="${y}" r="10" fill="transparent"/>`;
      }
    });
    deco += `<text class="io-cnt" x="${f(ax)}" y="${f(CY + o + 44)}">lớp ngoài cùng: <tspan font-weight="bold">${out}</tspan> e</text>`;
    if(now < badT) deco += `<circle cx="${f(ax)}" cy="${CY}" r="${f(o + DOT_R + 24)}" fill="none" stroke="#d9634f" stroke-width="3" `
      + `stroke-dasharray="9 6" opacity="${f(Math.min(1, (badT - now)/600))}"/>`;
    if(z > 0){                              // ion dương: điện tích bám góc lớp ngoài cùng còn electron
      const p = els.length ? o : (RING0 + Math.max(0, L - 2)*GAP)*g;
      deco += `<text class="lw-q" x="${f(ax + p*.72 + 10)}" y="${f(CY - p*.72 - 8)}">${lab}</text>`;
    }
    else if(z < 0){
      const b = o + DOT_R + 14;
      deco += `<path d="M${f(ax - b + 9)} ${f(CY - b)}h-9v${f(2*b)}h9M${f(ax + b - 9)} ${f(CY - b)}h9v${f(2*b)}h-9" fill="none" stroke="#3b3025" stroke-width="3"/>`
        + `<text class="lw-q" x="${f(ax + b + 5)}" y="${f(CY - b + 18)}">${lab}</text>`;
    }
    els.forEach(e => {
      const p = e === held ? hold : here(e);
      if(phase === 'build') glow += halo(p, DOT_R + 5 + Math.sin(t*5 + e.id)*1.5);
      dots += dot(p, e.mine);
      hit += hitArc(e);
    });
    free.forEach(o => {
      const s = Math.max(0, Math.min(1, (now - o.t0)/300));
      if(phase === 'build') glow += halo(o, (DOT_R + 5 + Math.sin(t*4 + o.id)*1.5)*s);
      dots += dot(o, o.mine, DOT_R*s);
      hitF += `<circle data-f="${o.id}" cx="${f(o.x)}" cy="${f(o.y)}" r="${FREE_HIT}" fill="transparent"/>`;
    });
    const line = (a, b) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke="#3b3025" stroke-width="2.2" stroke-dasharray="5 5" stroke-linecap="round"/>`;
    const near = hold && hold.moved && Math.hypot(hold.x - ax, hold.y - CY) <= reach();
    if(held && near) top += line(slot(held), hold);
    if(hold && hold.moved && hold.o && near && els.length < MAX){ const s = nextSlot();
      top += line(hold, s) + `<circle cx="${f(s.x)}" cy="${f(s.y)}" r="11" fill="none" stroke="#7aa95c" stroke-width="3"/>`; }
    svg.innerHTML = rings + vlLayers([{el:q.el, x:ax, y:CY, s:RN/atomR(q.el), arms:[]}]) + inner + deco + glow + top + dots + hitI + hit + hitF;
    ball.style.left = ax + 'px';
  }
  G.querySelector('#mgtime').style.display = ''; hud('Còn ' + TOTAL_T + ' giây', '#mgtime'); mgScore(0, qs.length); round();
  // card "Cách chơi" (bấm nút tròn ? cạnh đề): lớp phủ nên đồng hồ đứng yên lúc đang xem (mgHeld). Con trỏ giả lặp lại
  // ba bước trên một nguyên tử mẫu (hạt nhân không ghi kí hiệu — không lộ đáp án), chu kì GD giây, bước đang diễn sáng lên
  // trong danh sách bên dưới: bấm chấm lớp ngoài → electron bật ra; kéo electron tự do vào → nguyên tử nhận; bấm nút
  // Kiểm tra nhỏ trong hình. Toạ độ theo viewBox 220×100: G0 tâm nguyên tử; GA chấm lớp ngoài bên phải (bị bấm, rồi
  // electron tự do được kéo vào đúng chỗ đó); GF electron tự do; GC con trỏ nghỉ; GO chỗ electron bật ra bay tới; GB nút
  const GD = 8, G0 = {x:62, y:52}, GA = {x:92, y:52}, GF = {x:168, y:34}, GC = {x:204, y:52}, GO = {x:126, y:10}, GB = {x:180, y:80};
  const GSTEPS = ['Bấm vào chấm lớp ngoài → nguyên tử <b>nhường</b> electron',
    'Kéo (hoặc bấm) electron tự do vào → nguyên tử <b>nhận</b> electron', 'Đủ rồi thì bấm <b>Kiểm tra</b>'];
  let gsvg = null, gli = [], gOpen = 0, gStep = -1;
  const mix = (a, b, u) => { u = Math.max(0, Math.min(1, u)); u = u < .5 ? 2*u*u : 1 - 2*(1 - u)*(1 - u);
    return {x:a.x + (b.x - a.x)*u, y:a.y + (b.y - a.y)*u}; };
  const gdot = (p, red, a, hl) => (hl ? `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="7.5" fill="#e8b84b" opacity="${f(.5*a)}"/>` : '')
    + `<circle cx="${f(p.x)}" cy="${f(p.y)}" r="4" fill="${red ? '#d9634f' : '#3b3025'}" opacity="${f(a)}"${red ? ' stroke="#3b3025" stroke-width=".8"' : ''}/>`;
  function guide(now){
    if(!gsvg) return;
    const T = Math.max(0, now - gOpen)/1000 % GD, seg = (a, b) => (T - a)/(b - a);
    const cur = T < 1.1 ? mix(GC, GA, seg(.3, 1.1)) : T < 2.8 ? GA : T < 3.5 ? mix(GA, GF, seg(2.8, 3.5)) : T < 3.7 ? GF
      : T < 4.6 ? mix(GF, GA, seg(3.7, 4.6)) : T < 5.6 ? GA : mix(GA, GB, seg(5.6, 6.4));
    const down = T >= 1.1 && T < 1.3 || T >= 3.5 && T < 4.6 || T >= 6.6 && T < 6.8;   // đang nhấn chuột
    const click = [1.1, 3.5, 6.6].map(c => T - c).find(d => d >= 0 && d < .45);      // gợn tròn lúc vừa nhấn
    const step = T < 2.8 ? 0 : T < 5.6 ? 1 : 2, push = T >= 6.6 && T < 6.8;
    if(step !== gStep){ gStep = step; gli.forEach((li, k) => li.classList.toggle('on', k === step)); }
    let s = `<g opacity="${f(Math.max(0, Math.min(1, T/.3, (GD - T)/.4)))}">`
      + [16, 30].map(r => `<circle cx="${G0.x}" cy="${G0.y}" r="${r}" fill="none" stroke="#3b3025" stroke-opacity=".38" stroke-width="1.2"/>`).join('')
      + `<circle cx="${G0.x}" cy="${G0.y - 16}" r="2.2" fill="#3b3025" opacity=".8"/><circle cx="${G0.x}" cy="${G0.y + 16}" r="2.2" fill="#3b3025" opacity=".8"/>`
      + `<circle cx="${G0.x}" cy="${G0.y}" r="8" fill="#cdbfa8" stroke="#3b3025" stroke-width="1.5"/>`
      + gdot({x:G0.x - 30, y:G0.y}, false, 1, !step) + gdot({x:G0.x, y:G0.y - 30}, false, 1, !step)
      + `<g transform="translate(0 ${push ? 1 : 0})"><rect x="${GB.x - 30}" y="${GB.y - 10}" width="60" height="20" rx="4" fill="${push ? '#cf9f35' : '#e8b84b'}" `
      + `stroke="#3b3025" stroke-width="1.2"/><text x="${GB.x}" y="${GB.y + 3.5}" text-anchor="middle" style="font:10px var(--fh)" fill="#3b3025">✓ Kiểm tra</text></g>`;
    if(T < 1.2) s += gdot(GA, false, 1, true);
    else if(T < 2.2) s += gdot(mix(GA, GO, seg(1.2, 2.2)), false, 1 - seg(1.2, 2.2));
    s += gdot(T < 3.5 ? {x:GF.x + Math.sin(T*2.2)*3, y:GF.y + Math.cos(T*1.7)*2} : T < 4.6 ? cur : GA, true, 1, T < 4.6);
    if(click !== undefined) s += `<circle cx="${f(cur.x)}" cy="${f(cur.y)}" r="${f(3 + click*24)}" fill="none" stroke="#3b3025" stroke-width="1.5" opacity="${f(1 - click/.45)}"/>`;
    gsvg.innerHTML = s + `<path transform="translate(${f(cur.x)} ${f(cur.y)}) scale(${down ? .85 : 1})" d="M0 0V15l4-3.5 2.8 6 2.4-1.1-2.7-5.8h5z" `
      + `fill="#fff" stroke="#3b3025" stroke-width="1.3" stroke-linejoin="round"/></g>`;
  }
  function help(){                          // mở card Cách chơi (đóng bằng nút ✕ hoặc Đã hiểu)
    if(ended || G.querySelector('.overlay')) return;
    const ov = modal(`<h2>${ico('book', 22)} Cách chơi</h2><svg class="io-demo" viewBox="0 0 220 100" width="440" height="200"></svg>`
      + `<ol class="io-steps">${GSTEPS.map(s => `<li>${s}</li>`).join('')}</ol>`
      + `<div class="center"><button class="btn big" id="iook">${ico('check')} Đã hiểu</button></div>`, () => { gsvg = null; }, 'io-help');
    gsvg = ov.querySelector('.io-demo'); gli = [...ov.querySelectorAll('.io-steps li')]; gOpen = performance.now(); gStep = -1;
    ov.querySelector('#iook').onclick = () => { gsvg = null; closeOv(ov); };
  }
  G.querySelector('#iohelp').onclick = help;
  // electron tự do trôi: hướng bay đổi dần ngẫu nhiên, tốc độ kéo dần về SPD (vừa bật ra thì chậm lại), bị đẩy ra khỏi
  // vùng nguyên tử, tránh nhau, dội mép khu vực; còn ít hơn FREE_MIN thì một electron mới trôi vào từ mép trái / phải
  function drift(dt){
    const C = clear();
    free.forEach(o => {
      if(hold && hold.o === o && hold.moved){ Object.assign(o, {x:hold.x, y:hold.y, vx:0, vy:0}); return; }
      const a = Math.atan2(o.vy, o.vx) + (Math.random() - .5)*2.4*dt, s = Math.hypot(o.vx, o.vy) || SPD, v = s + (SPD - s)*Math.min(1, dt*1.6);
      o.vx = Math.cos(a)*v; o.vy = Math.sin(a)*v;
      const dx = o.x - ax, dy = o.y - CY, d = Math.hypot(dx, dy) || 1;
      if(d < C){ o.vx += dx/d*260*dt; o.vy += dy/d*260*dt; }
      free.forEach(p => { if(p === o) return;
        const ex = o.x - p.x, ey = o.y - p.y, m = Math.hypot(ex, ey) || 1;
        if(m < 44){ o.vx += ex/m*70*dt; o.vy += ey/m*70*dt; } });
      o.x += o.vx*dt; o.y += o.vy*dt;
      if(o.x < PAD){ o.x = PAD; o.vx = Math.abs(o.vx); }
      if(o.x > ZW - PAD){ o.x = ZW - PAD; o.vx = -Math.abs(o.vx); }
      if(o.y < PAD + 18){ o.y = PAD + 18; o.vy = Math.abs(o.vy); }            // chừa nhãn "Khu vực tạo ion"
      if(o.y > ZH - PAD){ o.y = ZH - PAD; o.vy = -Math.abs(o.vy); }
    });
    if(phase === 'build' && free.length < FREE_MIN){
      const L = Math.random() < .5;
      loose({x:L ? PAD : ZW - PAD, y:PAD + 40 + Math.random()*(ZH - 2*PAD - 60)}, false, {x:(L ? 1 : -1)*SPD*2, y:0});
    }
  }
  // vòng vẽ: đồng hồ của màn; các vòng nở ra lúc mới ra câu; chấm lớp ngoài trượt về chỗ mới; electron tự do trôi
  let last = performance.now();
  (function frame(now){
    if(!zone.isConnected) return;                                       // rời minigame: dừng hẳn
    const dt = Math.max(0, Math.min(now - last, 120))/1000, k = 1 - Math.exp(-dt*9);
    const clk = Math.max(0, Math.min(now - last, 1000))/1000;           // như trò thường: ngắt quãng quá 1 s chỉ tính 1 s
    last = now;
    if(!ended && !paused && !mgHeld()){
      tLeft = Math.max(0, tLeft - clk);
      const sec = Math.ceil(tLeft);
      if(sec !== shownT){ shownT = sec; hud('Còn ' + sec + ' giây', '#mgtime'); }
      if(!tLeft) endGame();
    }
    g = 1 - (1 - Math.max(0, Math.min(1, (now - born)/500)))**3;       // now của khung hình có thể sớm hơn born một chút
    els.forEach(e => { e.ox -= e.ox*k; e.oy -= e.oy*k; });
    drift(dt);
    draw(now);
    guide(now);
    requestAnimationFrame(frame);
  })(last);
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

 /* --- ngày 24: bảng tuần hoàn. Trên: bảng 7 chu kì × 18 cột (PT), ô tô màu kim loại / phi kim / khí hiếm. Rê chuột
        hoặc bấm vào ô thì KÍNH LÚP (khoảng trống giữa bảng, cột 3–12 × chu kì 1–3) phóng to ô đó kèm tên nguyên tố,
        nhãn chu kì / nhóm của ô sáng lên. Rê chuột / bấm vào nhãn chu kì hay nhóm thì cả hàng / cột sáng lên (bấm là
        ghim). Dưới: 12 câu liền tay (ptQuiz). Câu có nút thì bấm nút; câu "tìm trên bảng" thì bấm ô rồi Chốt. Đúng → tô
        xanh, chỉ báo "Đúng!" / "Chính xác!", tự sang câu sau; sai → tô đỏ chỗ chọn, tô xanh đáp án, hiện lời giải, bấm
        Câu tiếp.
        Chế độ khó (day.hard, bật bằng công tắc chế độ khó chung): ô ghi đủ như bảng in trong sách — nguyên tử khối lên góc
        phải, độ âm điện (tím) cạnh kí hiệu, cấu hình electron dưới cùng. KHÔNG có kính lúp: chỗ đó là ô hướng dẫn — ô
        nhôm phóng to, không khung, vạch đứt chỉ từng thông tin nằm ở đâu. Màn hình vừa và nhỏ (khung game hiện nhỏ hơn
        PT_ZOOM_MIN lần, chữ trên ô khó đọc): bấm ô nào thì số liệu ô đó hiện vào ô hướng dẫn và các nhãn chú thích ẩn
        đi; sang câu mới (bỏ chọn) thì trở lại ô nhôm có chú thích. Kính lúp chi tiết của chế độ khó (độ âm điện, các lớp
        electron, hình các lớp — ptBohr) vẫn giữ trong code, bật lại bằng PT_HARD_LENS. 12 câu theo day.hard.rounds; sao
        lưu vào cột sao chế độ khó. --- */
 ptable(i, day){
  const hard = !!day.hard && hardOn(), D = hard ? Object.assign({}, day, day.hard) : day;
  const lensOn = !hard || PT_HARD_LENS;                               // kính lúp đổi theo ô đang soi
  const qs = ptQuiz(D), total = qs.length;
  const X = c => PT_X0 + (c - 1)*PT_STEP, Y = p => PT_Y0 + (p - 1)*PT_STEP;
  const cellIn = e => `<span class="z">${e.z}</span><b class="s">${e.s}</b><span class="m">${e.fam ? '' : ptMass(e)}</span>`
    + (hard && !e.fam ? `<span class="en">${ptEN(e.en)}</span><span class="cfg">${ptCfgHTML(e)}</span>` : '');
  const cell = e => `<div class="pt-cell k-${e.k}${e.fam ? ' fam' : ''}" data-s="${e.s}" style="left:${X(e.c)}px;top:${Y(e.p)}px">${cellIn(e)}</div>`;
  const hint = '<p class="pt-hint">Rê chuột hoặc bấm vào một ô để soi bằng kính lúp.</p>';   // chỉ còn ở kính lúp chi tiết (PT_HARD_LENS)
  // ô hướng dẫn của chế độ khó: cùng nội dung với ô thật (không có data-s nên không bấm chọn được); top của mỗi nhãn =
  // tâm dòng thông tin trong ô 60 px × 2,6 (xem .pt-ex trong style.css) trừ nửa chiều cao nhãn — cấu hình của Al một dòng
  const exKey = `<div class="pt-ex"><div class="pt-cell k-${PT_BY.Al.k}">${cellIn(PT_BY.Al)}</div>
       <span class="l" style="top:24px">Số hiệu nguyên tử</span><span class="l" style="top:64px">Kí hiệu hoá học</span>
       <span class="l" style="top:111px">Cấu hình electron</span>
       <span class="r" style="top:24px">Nguyên tử khối</span><span class="r" style="top:64px">Độ âm điện χ</span></div>`;
  const lensIn = !lensOn ? exKey : hard
    ? `<div class="pt-big"><span class="z"></span><span class="en"></span><b class="s"></b><span class="n"></span><span class="m"></span></div>
       <div class="pt-info"><div class="pt-kind"></div><p>Độ âm điện χ: <b class="i-en"></b></p><p>Lớp electron: <b class="i-sh"></b></p>${hint}</div>
       <svg class="pt-bohr" width="176" height="176" viewBox="0 0 176 176"></svg>`
    : `<div class="pt-big"><span class="z"></span><b class="s"></b><span class="n"></span><span class="m"></span></div>
       <div class="pt-key"><span style="top:19px">Số hiệu nguyên tử (Z)</span><span style="top:62px">Kí hiệu hoá học</span>
         <span style="top:105px">Tên nguyên tố</span><span style="top:143px">Nguyên tử khối (amu)</span></div>
       <div class="pt-kind"></div>`;
  mgFrame(i, day, `<div class="pt${hard ? ' hard' : ''}"><div class="pt-tab">
      <span class="pt-axis g">Nhóm</span><span class="pt-axis p">Chu kì</span>
      ${PT_GROUP.map((g, k) => `<span class="pt-gl" data-c="${k + 1}" style="left:${X(k + 1)}px">${g}</span>`).join('')}
      ${[1, 2, 3, 4, 5, 6, 7].map(p => `<span class="pt-pl" data-p="${p}" style="top:${Y(p)}px">${p}</span>`).join('')}
      ${PT.map(cell).join('')}
      <div class="pt-lens${lensOn ? '' : ' plain'}" style="left:${X(3)}px;top:${Y(1)}px">${lensIn}</div>
      <div class="pt-legend" style="left:${X(13)}px;top:${Y(1)}px">${'mng'.split('').map(k => `<span><i class="k-${k}"></i>${PT_KIND[k]}</span>`).join('')}</div>
    </div>
    <div class="pt-bar">
      <div class="pt-tag"></div>
      <div class="pt-row"><div class="pt-q"></div><div class="pt-ans"></div></div>
      <div class="pt-foot"><p class="pt-why"></p><button class="btn" id="ptnext" hidden></button></div>
    </div></div>`);
  const root = G.querySelector('.pt'), lens = root.querySelector('.pt-lens'), big = lens.querySelector('.pt-big');
  const [tagEl, qEl, ansEl, whyEl, next] = ['.pt-tag', '.pt-q', '.pt-ans', '.pt-why', '#ptnext'].map(s => root.querySelector(s));
  const cells = {}, ptOf = {};
  root.querySelectorAll('.pt-cell[data-s]').forEach(c => cells[c.dataset.s] = c);
  PT.forEach(e => ptOf[e.s] = e);
  let qi = 0, correct = 0, streak = 0, sel = null, done = false;
  mgScore(0, total);
  if(hard) G.querySelector('.hud-title').insertAdjacentHTML('beforeend', ' · <span style="color:#a8331f">khó</span>');

  // kính lúp soi ô s (null: ô mẫu để chú thích) — khi đang bật (lensOn); nhãn chu kì và nhóm của ô đó luôn sáng lên
  function look(s){
    const e = s && ptOf[s];
    if(lensOn){
      big.className = 'pt-big ' + (e ? 'k-' + e.k : 'idle') + (e && e.fam ? ' fam' : '');
      [['.z', 'z', 'Z'], ['.s', 's', 'X'], ['.n', 'nm', 'tên'], ['.m', 'm', '?']].forEach(([q, k, d]) =>
        big.querySelector(q).textContent = e ? (k === 'm' ? ptMass(e) : e[k]) : d);
      lens.querySelector('.pt-kind').innerHTML = e ? `<i class="k-${e.k}"></i>${e.fam ? 'Kim loại (cả họ)' : PT_KIND[e.k]}` : '';
    }
    if(lensOn && hard){
      big.querySelector('.en').textContent = e ? ptEN(e.en) : 'χ';
      lens.querySelector('.i-en').textContent = e ? ptEN(e.en) : '?';
      lens.querySelector('.i-sh').textContent = e ? (e.fam ? '—' : e.sh.join(', ')) : '?';
      const bohr = lens.querySelector('.pt-bohr');
      bohr.setAttribute('class', 'pt-bohr' + (e ? ' k-' + e.k : ''));
      bohr.innerHTML = ptBohr(e);
    }
    root.querySelectorAll('.pt-gl.on, .pt-pl.on').forEach(x => x.classList.remove('on'));
    if(e){ root.querySelector(`.pt-gl[data-c="${e.c}"]`).classList.add('on'); root.querySelector(`.pt-pl[data-p="${e.p}"]`).classList.add('on'); }
  }
  // ô hướng dẫn (chế độ khó): màn hình vừa và nhỏ thì hiện số liệu ô s vừa bấm, ẩn nhãn chú thích; s = null hoặc màn hình
  // lớn thì là ô nhôm có chú thích. Đo cỡ khung game lúc bấm, nên đổi cỡ cửa sổ giữa chừng vẫn đúng
  function exShow(s){
    if(lensOn) return;
    const e = s && G.getBoundingClientRect().width/1280 < PT_ZOOM_MIN ? ptOf[s] : null, show = e || PT_BY.Al;
    const ex = lens.querySelector('.pt-ex'), c = ex.querySelector('.pt-cell');
    c.className = 'pt-cell k-' + show.k + (show.fam ? ' fam' : '');
    c.innerHTML = cellIn(show);
    ex.classList.toggle('zoom', !!e);
  }
  // bấm ô: chọn ô đó (viền đậm) — với câu "tìm trên bảng" thì đây là đáp án sắp chốt
  function choose(s){
    if(sel) cells[sel].classList.remove('sel');
    sel = s; cells[s].classList.add('sel'); look(s); exShow(s); SFX.clink();
    if(qs[qi].pick && !done) drawPick();
  }
  Object.values(cells).forEach(c => { c.onmouseenter = () => look(c.dataset.s); c.onclick = () => choose(c.dataset.s); });
  root.querySelector('.pt-tab').onmouseleave = () => look(sel);

  // nhãn chu kì / nhóm: rê chuột lên thì cả hàng / cột sáng (hov); bấm thì ghim lại (pin), bấm lần nữa để bỏ — màn hình
  // cảm ứng chỉ có bấm. Hàng ghim và hàng đang rê sáng cùng lúc được; sang câu mới thì bỏ ghim
  let pin = null, hov = null;
  const lineOf = lb => Object.values(cells).filter(c => lb.dataset.p ? ptOf[c.dataset.s].p === +lb.dataset.p : ptOf[c.dataset.s].c === +lb.dataset.c);
  function lines(){
    root.querySelectorAll('.pt-cell.line, .pt-gl.lit, .pt-pl.lit').forEach(x => x.classList.remove('line', 'lit'));
    [pin, hov].forEach(lb => { if(lb){ lb.classList.add('lit'); lineOf(lb).forEach(c => c.classList.add('line')); } });
  }
  root.querySelectorAll('.pt-gl, .pt-pl').forEach(lb => {
    lb.onmouseenter = () => { hov = lb; lines(); };
    lb.onmouseleave = () => { hov = null; lines(); };
    lb.onclick = () => { if(pin === lb){ pin = null; hov = null; } else pin = lb; lines(); SFX.clink(); };
  });

  function drawPick(){
    const ok = sel && PT_BY[sel];                                       // ô gộp một họ thì không chốt được
    ansEl.innerHTML = `<span class="pt-chip${ok ? '' : ' empty'}">${ok ? `Đã chọn: <b>${sel}</b> · ${PT_BY[sel].nm}`
      : sel ? 'Hãy chọn một nguyên tố cụ thể' : 'Chưa chọn ô nào'}</span>`
      + `<button class="btn go" id="ptgo"${ok ? '' : ' disabled'}>${ico('check')} Chốt</button>`;
    if(ok) ansEl.querySelector('#ptgo').onclick = () => grade(qs[qi].pick.includes(sel), null);
  }
  function ask(){
    const q = qs[qi];
    done = false;
    root.querySelectorAll('.pt-cell.ok, .pt-cell.bad, .pt-cell.peek').forEach(c => c.classList.remove('ok', 'bad', 'peek'));
    root.querySelectorAll('.pt-gl.hint, .pt-pl.hint').forEach(x => x.classList.remove('hint'));
    if(sel){ cells[sel].classList.remove('sel'); sel = null; }
    look(null); exShow(null);
    pin = hov = null; lines();
    tagEl.innerHTML = `Câu ${qi + 1}/${total} · ${q.tag}` + (streak >= 2 ? ` <span class="pt-streak">${ico('star', 13)} ${streak} câu đúng liền!</span>` : '');
    qEl.innerHTML = q.q;
    whyEl.className = 'pt-why'; whyEl.innerHTML = ''; next.hidden = true;
    if(q.pick) drawPick();
    else {
      ansEl.innerHTML = q.opts.map((o, x) => `<button class="btn${q.els ? ' el' : ''}${q.eq ? ' eq' : ''}" data-x="${x}">${o.t}</button>`).join('');
      ansEl.querySelectorAll('.btn').forEach(b => {
        const s = q.els && q.opts[+b.dataset.x].v;
        b.onclick = () => grade(+b.dataset.x === q.ans, b);
        if(s){ b.onmouseenter = () => cells[s].classList.add('peek'); b.onmouseleave = () => cells[s].classList.remove('peek'); }
      });
    }
    const row = root.querySelector('.pt-row');
    row.classList.remove('enter'); void row.offsetWidth; row.classList.add('enter');
  }
  function grade(ok, btn){
    if(done) return;
    done = true;
    const q = qs[qi], last = qi === total - 1;
    if(ok){ correct++; streak++; SFX.coin(); } else { streak = 0; SFX.err(); }
    mgScore(correct, total);
    ansEl.querySelectorAll('.btn').forEach(b => b.disabled = true);
    root.querySelectorAll('.pt-cell.peek').forEach(c => c.classList.remove('peek'));
    if(q.opts){
      ansEl.querySelector(`[data-x="${q.ans}"]`).classList.add('ok');
      if(!ok){ btn.classList.add('bad'); if(q.els) cells[q.opts[+btn.dataset.x].v].classList.add('bad'); }
    }
    else if(!ok) cells[sel].classList.add('bad');
    q.show.forEach(s => cells[s].classList.add('ok'));
    if(q.row) root.querySelector(`.pt-pl[data-p="${q.row}"]`).classList.add('hint');
    if(q.col) root.querySelector(`.pt-gl[data-c="${q.col}"]`).classList.add('hint');
    whyEl.className = 'pt-why ' + (ok ? 'good' : 'bad');            // đúng: chỉ khen ngắn; sai: kèm lời giải
    whyEl.innerHTML = ok ? ico('check', 16) + ' ' + pick(['Đúng!', 'Chính xác!']) : ico('close', 16) + ' Chưa đúng. ' + q.why;
    const go = () => {
      if(!root.isConnected) return;
      if(last) showResult(i, {correct, total, hard});
      else { qi++; SFX.page(); ask(); }
    };
    if(ok) setTimeout(go, 1300);                                        // đúng: tự sang câu sau (không có lời giải phải đọc)
    else {                                                              // sai: đọc lời giải rồi tự bấm sang
      next.innerHTML = last ? ico('star') + ' Xem kết quả' : 'Câu tiếp ' + ico('next');
      next.onclick = () => { next.onclick = null; go(); };
      next.hidden = false;
    }
  }
  ask();
 },

 /* --- ngày 31: chuỗi phản ứng. Trên: chất đầu ○ —▭→ ? —▭→ ? —▭→ ○ chất đích; dưới: băng chọn chất (dải vàng).
        Kéo bình (hoặc bấm bình rồi bấm ô) vào ô trên mũi tên. Điền đủ ô thì chấm ngay: đúng cả chuỗi thì các chất
        ở giữa lần lượt hiện ra kèm phương trình; sai thì ô sai đỏ lên rồi bật ra, mất 1 điểm. Mỗi chuỗi mất tối đa
        bằng số ô của nó — mất hết thì giáo sư điền đáp án làm mẫu. Chấm theo REACTIONS (chainWalk), nên cách đi
        khác mà đúng hoá học vẫn được tính. --- */
 chain(i, day){
  const total = day.chains.reduce((a, c) => a + c.ans.length, 0);
  const short = f => CHEMS[f].n.split(' (')[0];                     // "Natri hiđroxit (xút)" → "Natri hiđroxit"
  const fz = f => sub(f).length > 7 ? 20 : 25;                      // công thức dài thì chữ nhỏ lại cho lọt vòng tròn
  const liq = f => CHEMS[f].c + (CHEMS[f].s === 'k' ? '80' : '');   // khí: màu trong hơn
  const lblHTML = f => `<div class="chn-lbl"><b>${sub(f)}</b></div>`;
  /* Lọ trong băng chọn chất — cùng bộ hình với tủ hoá chất ở bàn thí nghiệm (contSym): dung dịch trong lọ nút mài,
     khí trong bình thép, chất rắn trong lọ nút bần; riêng kim loại ở đây là bột nên cũng vào lọ bột (bàn thí nghiệm
     vẽ mẩu kim loại). Lọ dung dịch đứng nghiêng vài độ, tựa vào đáy. Sticker công thức dán đè lên phần dung dịch / bột
     (bình khí: lên dải màu giữa thân), xoay lệch vài độ; góc nào cũng cố định theo chất. STK_Y: tâm sticker theo toạ độ
     viewBox 100×140 của các symbol này. */
  const ART_W = 120, ART_H = 168, STK_Y = {'sym-bottle-liquid':103, 'sym-jar-powder':108, 'sym-canister':84};
  const hash = f => [...f].reduce((s, c) => (s*31 + c.charCodeAt(0)) % 997, 7);
  const cont = f => contSym(f).startsWith('sym-metal') ? 'sym-jar-powder' : contSym(f);
  function art(f){
    const id = cont(f), lean = id === 'sym-bottle-liquid' ? [-7, -5, 5, 7][hash(f) % 4] : 0;
    return `<div class="chn-art" style="--lean:${lean}deg">${sym(id, ART_W, ART_H, '--lc:' + CHEMS[f].c + ';--lc2:#00000022')}`
      + `<span class="chn-stk" style="top:${STK_Y[id]*ART_H/140}px;--rot:${hash(f) % 9 - 4}deg;--stripe:${stripeCol(f)}">${sub(f)}</span></div>`;
  }
  const ARR = 'M4 10 Q60 8 194 10 M183 3 L195 10 L183 17';           // mũi tên vẽ tay; bản thứ hai tô màu chạy dọc khi mở
  let ci = 0, pts = total;
  mgFrame(i, day, '<div class="chn"></div>');
  const root = G.querySelector('.chn'), hud = G.querySelector('#mgscore');
  const score = () => { hud.textContent = 'Điểm: ' + pts + '/' + total; };
  score();

  function play(){
    const ch = day.chains[ci], n = ch.ans.length;
    const pool = shuffle([...new Set(ch.ans.concat(ch.more))]);
    const sols = chainSolutions(ch.start, ch.target, n, pool);        // mọi cách đi tới đích bằng bình trong khay
    const fill = new Array(n).fill(null);                             // fill[ô] = công thức đã thả vào ô đó
    let sel = null, busy = false, lost = 0;
    const node = (f, k) => {
      const end = k === 0 || k === n;
      return `<div class="chn-node${end ? '' : ' hid'}" data-n="${k}"${end ? ` style="--lc:${liq(f)}"` : ''}>
        ${end ? `<span class="chn-tag">${k ? 'chất đích' : 'chất đầu'}</span>` : ''}
        <div class="chn-ball"><b style="font-size:${end ? fz(f) : 44}px">${end ? sub(f) : '?'}</b></div>
        <small>${end ? short(f) : ''}</small></div>`;
    };
    const link = k => `<div class="chn-link" data-l="${k}"><div class="chn-slot" data-dz="cs${k}"></div>
        <svg class="chn-arrow" width="200" height="20" viewBox="0 0 200 20"><path d="${ARR}"/><path class="chn-flow" pathLength="1" d="${ARR}"/></svg>
        <span class="chn-cond">(${k+1})</span></div>`;
    root.className = 'chn';
    root.innerHTML = `<p class="chn-say"></p>
      <div class="chn-row">${node(ch.start, 0)}${ch.ans.map((a, k) => link(k) + node(k === n-1 ? ch.target : null, k+1)).join('')}</div>
      <div class="chn-band">
        <button class="chn-nav" aria-label="Cuộn sang trái"><svg width="40" height="52" viewBox="0 0 40 52"><path d="M34 5 L6 26 L34 47 Z"/></svg></button>
        <div class="chn-strip"><div class="chn-flasks">${pool.map(f => `<div class="chn-flask" data-f="${f}">${art(f)}</div>`).join('')}</div></div>
        <button class="chn-nav" aria-label="Cuộn sang phải"><svg width="40" height="52" viewBox="0 0 40 52"><path d="M6 5 L34 26 L6 47 Z"/></svg></button>
        <div class="chn-done"><div class="chn-eqs"></div><button class="btn big" id="chnext"></button></div>
      </div>`;
    const sayEl = root.querySelector('.chn-say');
    const say = (html, cls) => { sayEl.innerHTML = html; sayEl.className = 'chn-say' + (cls ? ' ' + cls : ''); };
    say(`Chuỗi ${ci+1}/${day.chains.length}: đi từ <b>${sub(ch.start)}</b> tới <b>${sub(ch.target)}</b> — kéo bình hoá chất vào ô trên mỗi mũi tên.`);
    const slots = [...root.querySelectorAll('.chn-slot')];

    // băng chọn chất: mỗi bình một ô rộng CELL, khung nhìn rộng VIEW (băng 1280 trừ chỗ hai nút ◁ ▷). Nút trượt 2 ô
    // (canh theo ô; còn chưa tới nửa ô là hết băng thì nhảy luôn tới cuối), lăn chuột trượt liền. Hết đường thì nút
    // mờ đi; cả băng vừa khung thì giấu nút, bình xếp giữa.
    const CELL = 190, VIEW = 1120, maxOff = Math.max(0, pool.length*CELL - VIEW);
    const track = root.querySelector('.chn-flasks'), [prev, next] = root.querySelectorAll('.chn-nav');
    let off = 0;
    const slide = v => {
      off = Math.max(0, Math.min(maxOff, v));
      track.style.transform = `translateX(${-off}px)`;
      prev.disabled = off <= 0; next.disabled = off >= maxOff;
    };
    const step = d => { const v = (Math.round(off/CELL) + 2*d)*CELL; slide(v > maxOff - CELL/2 ? maxOff : v); SFX.clink(); };
    prev.onclick = () => step(-1);
    next.onclick = () => step(1);
    root.querySelector('.chn-strip').addEventListener('wheel', e => { e.preventDefault(); slide(off + (e.deltaX || e.deltaY)); }, {passive:false});
    root.querySelector('.chn-band').classList.toggle('fits', !maxOff);
    slide(0);

    function unselect(){ if(sel) sel.classList.remove('chn-sel'); sel = null; }
    root.querySelectorAll('.chn-flask').forEach(el => dragify(el, 'chflask', {w:ART_W, h:ART_H, enabled: () => !busy,
      ghostHTML: () => art(el.dataset.f),
      onDrop: z => put(+z.slice(2), el.dataset.f),
      onClick: () => {                                                // bấm để chọn bình; bấm lại thì bỏ chọn
        if(busy) return;
        const again = sel === el;
        unselect();
        if(!again){ sel = el; el.classList.add('chn-sel'); SFX.clink(); }
      }}));
    // bấm vào nhãn đã dán do dragify của nhãn lo (xem draw), ở đây chỉ nhận bấm vào ô trống
    slots.forEach((s, k) => s.onclick = e => { if(!busy && sel && !e.target.closest('.chn-lbl')) put(k, sel.dataset.f); });

    // vẽ lại ô k theo fill[k]; nhãn đã dán kéo được sang ô khác, kéo ra ngoài hoặc bấm vào thì gỡ
    function draw(k, pop){
      const s = slots[k];
      s.classList.remove('ok', 'bad');
      s.classList.toggle('full', !!fill[k]);
      s.innerHTML = fill[k] ? lblHTML(fill[k]) : '';
      const l = s.firstElementChild;
      if(!l) return;
      tapeLabel(l);
      if(pop) l.classList.add('pop');
      dragify(l, 'chlbl', {w:146, h:56, enabled: () => !busy,
        ghostHTML: () => l.outerHTML,
        onDrop: z => move(k, +z.slice(2)),
        onLoose: () => { take(k); return true; },
        onClick: () => { if(busy) return; if(sel) put(k, sel.dataset.f); else take(k); }});
    }
    function put(k, f){
      if(busy) return;
      unselect();
      fill[k] = f; draw(k, true); SFX.pour();
      if(fill.every(Boolean)){ busy = true; setTimeout(check, 450); }
    }
    function take(k){ if(busy) return; fill[k] = null; draw(k); SFX.clink(); }
    function move(a, b){                                              // ô đích đã có nhãn thì hai nhãn đổi chỗ
      if(busy || a === b) return;
      [fill[a], fill[b]] = [fill[b], fill[a]];
      draw(a, true); draw(b, true); SFX.clink();
    }

    function check(){
      if(!root.isConnected) return;
      const walk = chainWalk(ch.start, fill, ch.target);
      if(walk) return solved(walk, true);
      // ô sai = ô khác với cách giải (trong khay) giống bài làm nhất
      const agree = s => s.reduce((a, f, k) => a + (f === fill[k]), 0);
      const best = sols.reduce((b, s) => agree(s) > agree(b) ? s : b, sols[0] || []);
      const bad = fill.map((f, k) => f !== best[k]);
      slots.forEach((s, k) => s.classList.add(bad[k] ? 'bad' : 'ok'));
      lost++; pts--; score(); SFX.err(); mgMinus(hud);
      const out = lost >= n;
      say(out ? 'Sai rồi, <b>−1 điểm</b>. Chuỗi này hết điểm — xem ta làm mẫu nhé!'
              : 'Chưa đúng — ô đỏ là chỗ sai. <b>−1 điểm</b>. Thử lại nào!', 'bad');
      setTimeout(() => {
        if(!root.isConnected) return;
        if(out){
          ch.ans.forEach((f, k) => { fill[k] = f; draw(k, true); });
          SFX.pour();
          setTimeout(() => solved(chainWalk(ch.start, ch.ans, ch.target), false), 700);
          return;
        }
        bad.forEach((b, k) => { if(b){ fill[k] = null; draw(k); } });  // ô đúng giữ lại, vẫn tô xanh
        busy = false;
      }, 1500);
    }

    // mở lần lượt từng mũi tên: mũi tên sáng lên, chất sau nó hiện ra; xong thì khay nhường chỗ cho các phương trình
    function solved(walk, mine){
      busy = true; unselect();
      slots.forEach(s => { s.classList.remove('bad'); s.classList.add('ok'); });
      if(mine) say(lost ? 'Đúng rồi! Cả chuỗi đã nối liền.' : 'Chuẩn không cần chỉnh — đúng ngay lần đầu!', 'good');
      else say('Đáp án đây — nhìn kĩ từng mắt xích nhé!');
      const STEP = 650;
      walk.forEach((s, k) => setTimeout(() => {
        if(!root.isConnected) return;
        const L = root.querySelector('.chn-link[data-l="'+k+'"]'), nd = root.querySelector('.chn-node[data-n="'+(k+1)+'"]');
        L.classList.add('lit');
        const over = rxOver(s.r);
        if(over) L.querySelector('.chn-cond').textContent = '(' + (k+1) + ') ' + over;
        if(nd.classList.contains('hid')){
          const b = nd.querySelector('b');
          nd.classList.replace('hid', 'show');
          nd.style.setProperty('--lc', liq(s.f));
          b.style.fontSize = fz(s.f) + 'px'; b.innerHTML = sub(s.f);
          nd.querySelector('small').textContent = short(s.f);
        } else nd.classList.add('show');
        SFX.tinkle();
      }, 300 + k*STEP));
      setTimeout(() => {
        if(!root.isConnected) return;
        const last = ci === day.chains.length - 1, btn = root.querySelector('#chnext');
        root.querySelector('.chn-eqs').innerHTML = '<h3>' + ico('note', 18) + ' Các phương trình</h3>'
          + walk.map((s, k) => `<div><span>(${k+1})</span>${eqStr(s.r)}</div>`).join('');
        btn.innerHTML = last ? ico('star') + ' Xem kết quả' : 'Chuỗi tiếp theo ' + ico('next');
        btn.onclick = () => { if(last) showResult(i, {correct:pts, total, label:'Điểm'}); else { ci++; SFX.page(); play(); } };
        root.classList.add('solved');
        SFX.coin();
      }, 300 + walk.length*STEP + 250);
    }
  }
  play();
 },

 /* --- ngày 5: cân bằng phương trình. Trên: KHAY PHẢN ỨNG, không chữ — chất tham gia bên trái mũi tên, sản phẩm bên phải
        (vẽ mờ: chỗ chờ phản ứng tạo ra). Giữa: phương trình, mỗi hệ số là một ô gạch chân gõ số được; gõ tới đâu phân tử
        nhảy từ ô vào khay tới đó (quá BAL_BIG phân tử thì khay vẽ một phân tử kèm "n ×"). Dưới: hàng chất — kéo (hoặc bấm)
        một chất là thêm MỘT phân tử; bấm phân tử trong khay hoặc kéo nó ra ngoài là bớt. Bấm PHẢN ỨNG (hay Enter trong ô):
        liên kết của chất tham gia đứt, từng nguyên tử bay sang chỗ của nó trong các sản phẩm đang chờ; sản phẩm nào đủ
        nguyên tử thì thành hình. Vừa khít với bộ hệ số nhỏ nhất thì phương trình được gạch chân, ô hệ số thành chữ (hệ số 1
        biến mất). Lệch thì nguyên tử thừa ở lại viền đỏ, chỗ thiếu hiện vòng đỏ, dòng trên cùng ghi "thừa n × ●, thiếu
        n × ◌", −1 điểm; sửa là khay dọn về như cũ. Lệch lần nữa thì giáo sư làm mẫu. Vừa khít nhưng hệ số còn rút gọn
        được thì chỉ nhắc, không trừ điểm. Mỗi câu BAL_PTS điểm. --- */
 balance(i, day){
  const qs = day.pools.flatMap(([n, list]) => shuffle(list).slice(0, n).map(balRx));
  const total = qs.length*BAL_PTS;
  let qi = 0, pts = total;
  mgFrame(i, day, '<div class="bal"></div>');
  const root = G.querySelector('.bal'), hud = G.querySelector('#mgscore');
  const score = () => { hud.textContent = 'Điểm: ' + pts + '/' + total; };
  score();

  function play(){
    const r = qs[qi], fs = Object.keys(r.rg).concat(Object.keys(r.pr)), nL = Object.keys(r.rg).length;
    const ks = fs.map((f, k) => k), isR = k => k >= nL;              // chất thứ k là sản phẩm (vế phải)?
    const want = fs.map((f, k) => isR(k) ? r.pr[f] : r.rg[f]), cnt = fs.map(() => 0);
    const big = k => cnt[k] > BAL_BIG;                                // khay vẽ "n ×" + một phân tử
    let busy = false, lost = 0, timers = [], flyT = [];
    const later = (ms, fn, T) => (T || timers).push(setTimeout(() => { if(root.isConnected) fn(); }, ms));
    // khay: mỗi vế chia bề ngang cho các chất của vế đó theo độ rộng thật của phân tử (Fe₂O₃ rộng hơn H₂ nhiều); mỗi chất
    // xếp số phân tử đang có thành lưới 1–5 cột (chọn số cột cho phân tử to nhất); cả khay chung MỘT tỉ lệ để bi cùng
    // nguyên tố ở hai vế to bằng nhau — nhiều phân tử thì cả khay thu nhỏ lại. NW: chỗ cho nhãn "n ×"
    const SIDE_W = (BAL_ZW - BAL_ARW)/2 - 20, MOL_H = BAL_ZH - 28, NW = 78;
    const wide = fs.map(f => { const g = molFit(f, 1e4, 1e4, 1); return Math.max(70, g.x1 - g.x0); });
    const sideW = right => ks.filter(k => isR(k) === right).reduce((s, k) => s + wide[k], 0);
    function grid(){
      const cell = fs.map((f, k) => {
        const cw = Math.floor(SIDE_W*wide[k]/sideW(isR(k))), n = big(k) ? 1 : Math.max(1, cnt[k]), aw = cw - (big(k) ? NW : 0);
        let best = null;
        for(let c = 1; c <= Math.min(n, 5); c++){
          const w = Math.floor(aw/c), h = Math.floor(MOL_H/Math.ceil(n/c)), s = molFit(f, w, h, BAL_SC).sc;
          // cùng cỡ bi (thường do chạm BAL_SC) thì chọn lưới gần vuông nhất: 4 phân tử xếp 2×2 chứ không thành cột dài
          const sq = x => Math.abs(x - Math.sqrt(n));
          if(!best || s > best.s + 1e-6 || (s > best.s - 1e-6 && sq(c) < sq(best.c))) best = {cw, c, w, h, s};
        }
        return best;
      });
      return {cell, sc:Math.min(...cell.map(c => c.s))};
    }
    let lay = grid();
    const box = k => `<div class="bal-box" style="width:${lay.cell[k].w}px;height:${lay.cell[k].h}px">${molHTML(fs[k], lay.cell[k].w, lay.cell[k].h, lay.sc)}</div>`;
    // phương trình: ô hệ số gạch chân + công thức; sản phẩm khí / kết tủa có sẵn dấu ↑ / ↓, chỉ hiện khi đã cân bằng xong
    const mark = f => CHEMS[f].s === 'k' ? '↑' : isPrecip(f) ? '↓' : '';
    const term = k => (k && k !== nL ? '<span class="bal-op">+</span>' : '') + (k === nL ? handArrow(r) : '')
      + `<span class="bal-term"><input class="bal-in" type="text" inputmode="numeric" maxlength="2" autocomplete="off" `
      + `aria-label="hệ số của ${fs[k]}"><span>${sub(fs[k])}</span>`
      + (isR(k) && mark(fs[k]) ? `<i class="bal-mk">${mark(fs[k])}</i>` : '') + '</span>';
    const card = k => `<div class="bal-card" data-k="${k}"><div class="bal-cmol">${molHTML(fs[k], 116, 62, 1.3)}</div><b>${sub(fs[k])}</b></div>`;
    const ARR = '<svg width="84" height="24" viewBox="0 0 84 24"><path d="M4 12 Q30 10 76 12 M64 4 L77 12 L64 20"/></svg>';
    const col = k => `<div class="bal-col" data-k="${k}"></div>`;
    const L = ks.filter(k => !isR(k)), R = ks.filter(isR);
    root.innerHTML = `<p class="bal-say"></p>
      <div class="bal-zone" data-dz="bzone">
        <div class="bal-side l">${L.map(col).join('')}</div>
        <div class="bal-arrow">${ARR}</div>
        <div class="bal-side r">${R.map(col).join('')}</div>
        <div class="bal-fly"></div>
      </div>
      <div class="bal-eq"><div class="bal-eqin">${ks.map(term).join('')}
        <svg class="bal-ul" viewBox="0 0 400 12" preserveAspectRatio="none"><path pathLength="1" d="M4 7 Q110 3 210 6 T396 5"/></svg></div></div>
      <div class="bal-band">
        <div class="bal-pick">
          <div class="bal-grp">${L.map(card).join('')}</div>
          <div class="bal-arrow">${ARR}</div>
          <div class="bal-grp">${R.map(card).join('')}</div>
          <div class="bal-btns"><button class="btn big" id="balgo" disabled>${ico('flask')} Phản ứng</button>
            <button class="btn" id="balhelp">${ico('book')} Cách cân bằng</button></div>
        </div>
        <div class="bal-done"></div>
      </div>`;
    const zone = root.querySelector('.bal-zone'), band = root.querySelector('.bal-band'), done = root.querySelector('.bal-done');
    const layer = zone.querySelector('.bal-fly'), ins = [...root.querySelectorAll('.bal-in')];
    const sayEl = root.querySelector('.bal-say'), go = root.querySelector('#balgo');
    // dòng chữ trên cùng chỉ hiện khi có điều cần báo (sai, hệ số chưa gọn, giáo sư làm mẫu); trò sửa khay thì xoá đi
    const say = (html, cls) => { sayEl.innerHTML = html || ''; sayEl.className = 'bal-say' + (cls ? ' ' + cls : ''); };
    const mols = k => [...zone.querySelectorAll(`.bal-col[data-k="${k}"] .bal-mol`)];
    function setBusy(b){
      busy = b; root.classList.toggle('busy', b);
      ins.forEach(x => x.readOnly = b);
      go.disabled = b || cnt.some(n => !n);
    }

    // ô hệ số theo số phân tử; nút Phản ứng chỉ bấm được khi chất nào cũng có mặt
    function sync(){
      ins.forEach((x, k) => { const v = cnt[k] ? String(cnt[k]) : ''; if(x.value !== v) x.value = v; });
      go.disabled = busy || cnt.some(n => !n);
    }
    // vẽ lại cả khay (đổi số phân tử là có thể đổi lưới và tỉ lệ chung). Phân tử mới của chất k nhảy từ src (ô hệ số hoặc
    // chất ở hàng dưới) vào chỗ của nó; không có src (kéo thả vào khay) thì nảy ra tại chỗ
    function render(k0, prev, src){
      lay = grid();
      ks.forEach(k => {
        const c = lay.cell[k], el = zone.querySelector(`.bal-col[data-k="${k}"]`), n = big(k) ? 1 : cnt[k];
        el.style.width = c.cw + 'px';
        el.innerHTML = (big(k) ? `<span class="bal-n">${cnt[k]} ×</span>` : '')
          + `<div class="bal-mols" style="width:${c.c*c.w}px;height:${MOL_H}px">`
          + Array.from({length:n}, (_, j) => `<div class="bal-mol${isR(k) ? ' ghost' : ''}`
            + `${k === k0 && !src && !big(k) && j >= prev ? ' pop' : ''}">${box(k)}</div>`).join('') + '</div>';
        el.querySelectorAll('.bal-mol').forEach(m => dragify(m, 'balout', {w:c.w, h:c.h, enabled: () => !busy,
          ghostHTML: () => box(k), onDrop: () => {}, onLoose: () => { setCount(k, cnt[k] - 1); return true; },
          onClick: () => setCount(k, cnt[k] - 1)}));
      });
      if(src && !big(k0)) jump(mols(k0).slice(prev), src);
    }
    function jump(els, src){
      const s = G.getBoundingClientRect().width/1280, a = src.getBoundingClientRect(), ax = a.left + a.width/2, ay = a.top + a.height/2;
      els.forEach((el, j) => {
        const b = el.getBoundingClientRect(), dx = (ax - b.left - b.width/2)/s, dy = (ay - b.top - b.height/2)/s;
        el.animate([{transform:`translate(${dx}px,${dy}px) scale(.35)`, opacity:0},
          {transform:`translate(${dx*.45}px,${dy*.45 - 70}px) scale(.85)`, opacity:1, offset:.55},
          {transform:'none', opacity:1}], {duration:520, delay:j*60, easing:'ease-out', fill:'backwards'});
      });
    }
    // auto: giáo sư đang làm mẫu (trò bị khoá tay). Sửa khay sau một lần phản ứng hụt thì khay dọn về như cũ
    function setCount(k, n, src, auto){
      if(busy && !auto) return;
      n = Math.max(0, Math.min(BAL_IN, n | 0));
      if(n === cnt[k]) return sync();
      reset();
      if(!auto) say();
      const prev = cnt[k];
      cnt[k] = n;
      render(k, prev, n > prev ? src : null);
      sync(); SFX.clink();
    }
    ins.forEach((x, k) => {
      x.oninput = () => { const v = x.value.replace(/\D/g, '').slice(0, 2); if(v !== x.value) x.value = v; setCount(k, +v || 0, x); };
      x.onkeydown = e => { if(e.key === 'Enter'){ x.blur(); react(); } };
    });
    root.querySelectorAll('.bal-card').forEach(el => { const k = +el.dataset.k;
      dragify(el, 'balmol', {get w(){ return lay.cell[k].w; }, get h(){ return lay.cell[k].h; }, enabled: () => !busy, ghostHTML: () => box(k),
        onDrop: () => setCount(k, cnt[k] + 1), onClick: () => setCount(k, cnt[k] + 1, el)}); });
    go.onclick = react;
    root.querySelector('#balhelp').onclick = () => { if(!busy) balanceTutorial(); };
    render(-1, 0, null);

    function react(){
      if(busy || cnt.some(n => !n)) return;
      run(false);
    }
    // số nguyên tử mỗi nguyên tố: trước − sau (dương: thừa, âm: thiếu)
    function tally(){
      const d = {};
      ks.forEach(k => { const a = atomCounts(fs[k]); Object.keys(a).forEach(e => d[e] = (d[e] || 0) + (isR(k) ? -1 : 1)*cnt[k]*a[e]); });
      return Object.keys(d).map(e => ({e, d:d[e]}));
    }
    // cho phản ứng chạy rồi chấm theo kết quả: vừa khít (không thừa, không thiếu) + bộ hệ số nhỏ nhất là đúng.
    // byProf: giáo sư vừa làm mẫu
    function run(byProf){
      setBusy(true);
      if(!byProf) say();
      SFX.fizz();
      const ms = fly();
      later(ms + 250, () => {
        const T = tally(), g = cnt.reduce(gcd);
        if(T.every(t => !t.d)){
          if(g === 1) return solved(byProf);
          setBusy(false);
          return say(`Vừa khít, nhưng mọi hệ số còn chia hết cho ${g} — rút gọn nhé!`);
        }
        lost++; pts--; score(); SFX.err(); mgMinus(hud);
        // thừa / thiếu ghi kiểu hệ số × chất: một bi màu nguyên tố (thừa: viền đỏ như bi ở lại; thiếu: vòng đỏ đứt nét)
        const dot = (e, miss) => `<span class="bal-dot${miss ? ' miss' : ''}" style="--c:${(ATOM_STYLE[e] || ['#ccc'])[0]}"></span>`;
        const part = (w, list, miss) => list.length ? w + ' ' + list.map(t => Math.abs(t.d) + ' × ' + dot(t.e, miss)).join(', ') : '';
        const msg = 'Chưa cân bằng — ' + [part('thừa', T.filter(t => t.d > 0)), part('thiếu', T.filter(t => t.d < 0), 1)].filter(Boolean).join(' · ');
        if(lost < BAL_PTS){ setBusy(false); return say(msg, 'bad'); }
        say(msg + '. Hết điểm câu này — xem ta làm mẫu nhé!', 'bad');
        later(2800, demo);
      });
    }
    // đúng: phương trình được gạch chân — ô hệ số thu vừa con số và mất gạch, hệ số 1 biến mất, hiện dấu ↑ / ↓; hàng chất
    // nhường chỗ cho hai nút xem lại / đi tiếp
    function solved(byProf){
      say(byProf ? 'Ta làm mẫu đây — đếm lại số phân tử mỗi chất nhé!' : '');
      SFX.bell();
      const meas = document.createElement('span');
      meas.className = 'bal-meas';
      root.appendChild(meas);
      ins.forEach((x, k) => { meas.textContent = x.value; x.style.width = (cnt[k] === 1 ? 0 : meas.offsetWidth + 2) + 'px'; });
      meas.remove();
      root.querySelector('.bal-eq').classList.add('final');
      const last = qi === qs.length - 1;
      done.innerHTML = `<div class="row">`
        + `<button class="btn bal-ib" id="balagain" aria-label="Xem lại" title="Xem lại">${ico('retry', 26)}</button>`
        + `<button class="btn big bal-ib" id="balnext" aria-label="${last ? 'Xem kết quả' : 'Câu tiếp theo'}" title="${last ? 'Xem kết quả' : 'Câu tiếp theo'}">`
        + `${ico(last ? 'star' : 'next', 26)}</button></div>`;
      band.classList.add('done');
      done.querySelector('#balagain').onclick = () => { SFX.clink(); fly(); };
      done.querySelector('#balnext').onclick = () => { timers.concat(flyT).forEach(clearTimeout);
        if(last) showResult(i, {correct:pts, total, label:'Điểm'}); else { qi++; SFX.page(); play(); } };
    }
    // hết điểm: giáo sư sửa từng ô hệ số (phân tử nhảy vào / ra theo) cho đủ đúng số rồi cho phản ứng chạy
    function demo(){
      reset();
      say('Ta đặt lại số phân tử cho đúng nhé…');
      const steps = [];
      ks.forEach(k => {
        for(let n = cnt[k]; n > want[k]; n--) steps.push(() => setCount(k, cnt[k] - 1, null, true));
        for(let n = cnt[k]; n < want[k]; n++) steps.push(() => setCount(k, cnt[k] + 1, ins[k], true));
      });
      steps.forEach((s, j) => later(350 + j*280, s));
      later(350 + steps.length*280 + 450, () => run(true));
    }
    // dọn khay về lúc chưa phản ứng: chất tham gia hiện lại, sản phẩm về dạng chờ, bỏ bi bay và vòng đánh dấu
    function reset(){
      flyT.forEach(clearTimeout); flyT = [];
      zone.classList.remove('split');
      layer.innerHTML = '';
      zone.querySelectorAll('.bal-mol.made').forEach(m => m.classList.remove('made'));
    }
    // phản ứng thật: que và sticker của chất tham gia mờ đi (liên kết đứt), từng nguyên tử tách xa nhau, rồi bay vào chỗ
    // của nó trong các sản phẩm đang chờ. Ghép theo từng nguyên tố: bi thứ n (từ trên xuống) bên trái vào chỗ thứ n bên
    // phải, chỗ xếp theo thứ tự phân tử — thiếu bi thì các phân tử sau cùng hụt, thừa bi thì bi dưới cùng ở lại. Tới nơi:
    // sản phẩm nào đủ bi thì thành hình; bi không có chỗ viền đỏ, chỗ không có bi tới hiện vòng đỏ. Toạ độ đo từ khay thật
    // (cột xếp bằng flex) nên khớp khít với các phân tử đang nằm trên khay. Khay có chất ghi "n ×" thì không cho từng bi
    // bay (một phân tử vẽ thay cho nhiều): chất tham gia mờ đi, vừa khít thì sản phẩm thành hình. Trả về thời gian chạy.
    function fly(){
      reset();
      zone.classList.add('split');
      SFX.crackle();
      if(ks.some(big)){
        const fit = tally().every(t => !t.d);
        later(700, () => { if(fit){ zone.querySelectorAll('.bal-side.r .bal-mol').forEach(m => m.classList.add('made')); SFX.tinkle(); } }, flyT);
        return 800;
      }
      const o = layer.getBoundingClientRect(), s = o.width/layer.offsetWidth;
      const pos = right => ks.filter(k => isR(k) === right).flatMap(k => mols(k).map(m => {
        const c = lay.cell[k], b = m.firstElementChild.getBoundingClientRect(), x0 = (b.left - o.left)/s, y0 = (b.top - o.top)/s;
        return {m, P:molPts(fs[k], c.w, c.h, lay.sc).P.map(a => ({el:a.el, r:a.r, x:x0 + a.x, y:y0 + a.y, cx:x0 + c.w/2, cy:y0 + c.h/2}))};
      }));
      const A = pos(false).flatMap(p => p.P), prod = pos(true);
      const B = prod.flatMap((p, mi) => p.P.map(a => Object.assign(a, {mi})));
      const byY = (a, b) => a.y - b.y || a.x - b.x, dest = A.map(() => null), got = new Set();
      [...new Set(A.map(a => a.el))].forEach(e => {
        const to = B.filter(b => b.el === e);
        A.map((a, j) => j).filter(j => A[j].el === e).sort((p, q) => byY(A[p], A[q]))
          .forEach((j, n) => { if(to[n]){ dest[j] = to[n]; got.add(to[n]); } });
      });
      const miss = B.filter(b => !got.has(b)), full = prod.map((p, mi) => !miss.some(b => b.mi === mi));
      layer.innerHTML = A.map(a => atomBall(a, 'mv', '', true)).join('');
      const balls = [...layer.children];
      later(450, () => balls.forEach((el, j) => { const a = A[j];
        el.style.transition = 'left .45s ease-out, top .45s ease-out';
        el.style.left = a.cx + (a.x - a.cx)*1.6 + 'px'; el.style.top = a.cy + (a.y - a.cy)*1.6 + 'px'; }), flyT);
      const spread = Math.min(balls.length*30, 450), ms = 1150 + 1100 + spread + 60;
      later(1150, () => balls.forEach((el, j) => { const b = dest[j]; if(!b) return;
        el.style.transition = ''; el.style.transitionDelay = Math.min(j*30, 450) + 'ms';
        el.style.left = b.x + 'px'; el.style.top = b.y + 'px'; }), flyT);
      later(ms, () => {
        balls.forEach((el, j) => { el.style.transitionDelay = '';
          if(!dest[j]) el.classList.add('extra'); else if(full[dest[j].mi]) el.classList.add('in'); });
        prod.forEach((p, mi) => { if(full[mi]) p.m.classList.add('made'); });
        layer.insertAdjacentHTML('beforeend', miss.map(b => `<div class="bal-miss" style="left:${b.x}px;top:${b.y}px;`
          + `width:${2*b.r + 6}px;height:${2*b.r + 6}px"></div>`).join(''));
        if(full.some(Boolean)) SFX.tinkle();
      }, flyT);
      return ms;
    }
  }
  play();
 }
};

/* Cân bằng phương trình (ngày 5). Đề viết 'H2 + O2 = H2O', hệ số lấy từ dòng trong REACTIONS có đúng các chất tham gia
   và sản phẩm đó — nên đáp án luôn khớp thẻ phản ứng và sổ tay. khoi-dong.js kiểm tra mỗi đề khớp đúng một dòng. */
const BAL_PTS = 2, BAL_SC = 2;                    // điểm mỗi câu; tỉ lệ bi tối đa trong khay
const BAL_BIG = 10, BAL_IN = 99;                  // quá BAL_BIG phân tử thì khay ghi "n ×"; ô hệ số gõ tới BAL_IN
const BAL_ZW = 1232, BAL_ZH = 330, BAL_ARW = 120; // khay phản ứng: rộng, cao, chỗ mũi tên ở giữa — khớp .bal-zone trong style.css
const balKey = fs => fs.map(f => f.trim()).sort().join();
const balRxs = s => { const [a, b] = s.split('=').map(x => balKey(x.split('+')));
  return REACTIONS.filter(r => balKey(Object.keys(r.rg)) === a && balKey(Object.keys(r.pr)) === b); };
const balRx = s => balRxs(s)[0];

/* Chuỗi phản ứng (ngày 31) — mỗi mũi tên là MỘT phản ứng trong REACTIONS có đúng hai chất tham gia: chất đứng trước
   và chất thêm vào; chất đứng sau là một sản phẩm bất kì của nó. Điện phân cần nguồn điện chứ không phải thêm chất
   nên không tính. chainStep: từ cur thêm add thì ra được gì — [{r: phản ứng, f: sản phẩm}]. */
function chainStep(cur, add){
  const out = [];
  REACTIONS.forEach(r => {
    const rg = Object.keys(r.rg);
    if(r.elec || cur === add || rg.length !== 2 || !rg.includes(cur) || !rg.includes(add)) return;
    Object.keys(r.pr).forEach(f => out.push({r, f}));
  });
  return out;
}
// lần lượt thêm các chất adds vào, từ start phải tới đúng target: trả về [{r, f}] cho từng mũi tên, hoặc null
function chainWalk(start, adds, target){
  if(!adds.length) return start === target ? [] : null;
  for(const s of chainStep(start, adds[0])){
    const rest = chainWalk(s.f, adds.slice(1), target);
    if(rest) return [s].concat(rest);
  }
  return null;
}
// mọi dãy n chất lấy từ pool (được lặp lại) đi được từ start tới target
function chainSolutions(start, target, n, pool){
  const out = [];
  (function go(cur, pre){
    if(pre.length === n){ if(cur === target && !out.some(s => s.join() === pre.join())) out.push(pre); return; }
    pool.forEach(a => chainStep(cur, a).forEach(s => go(s.f, pre.concat(a))));
  })(start, []);
  return out;
}

/* =====================  BẢNG TUẦN HOÀN (ngày 24)  ===================== */
/* Bảng rút gọn 7 chu kì × 18 cột như sách KHTN: họ lantan (57–71) và họ actini (89–103) gộp thành MỘT ô ở cột IIIB.
   Mỗi chu kì một hàng, mỗi nguyên tố [kí hiệu, tên, nguyên tử khối, loại] — loại m: kim loại, n: phi kim, g: khí hiếm;
   chuỗi là ô gộp một họ. Số hiệu nguyên tử tự đếm theo thứ tự (ô gộp chiếm 15 số). Nguyên tử khối làm tròn như sách
   (Cl = 35,5) và phải khớp ATOM (khoi-dong.js kiểm tra); nguyên tố phóng xạ không có nguyên tử khối chuẩn thì ghi số
   khối của đồng vị bền nhất trong ngoặc vuông. */
const PT_DATA = [
 [['H','hiđro',1,'n'], ['He','heli',4,'g']],
 [['Li','liti',7,'m'], ['Be','beri',9,'m'], ['B','bo',11,'n'], ['C','cacbon',12,'n'], ['N','nitơ',14,'n'], ['O','oxi',16,'n'],
  ['F','flo',19,'n'], ['Ne','neon',20,'g']],
 [['Na','natri',23,'m'], ['Mg','magie',24,'m'], ['Al','nhôm',27,'m'], ['Si','silic',28,'n'], ['P','photpho',31,'n'],
  ['S','lưu huỳnh',32,'n'], ['Cl','clo',35.5,'n'], ['Ar','agon',40,'g']],
 [['K','kali',39,'m'], ['Ca','canxi',40,'m'], ['Sc','scanđi',45,'m'], ['Ti','titan',48,'m'], ['V','vanađi',51,'m'],
  ['Cr','crom',52,'m'], ['Mn','mangan',55,'m'], ['Fe','sắt',56,'m'], ['Co','coban',59,'m'], ['Ni','niken',59,'m'],
  ['Cu','đồng',64,'m'], ['Zn','kẽm',65,'m'], ['Ga','gali',70,'m'], ['Ge','gemani',73,'m'], ['As','asen',75,'n'],
  ['Se','selen',79,'n'], ['Br','brom',80,'n'], ['Kr','kripton',84,'g']],
 [['Rb','rubiđi',85.5,'m'], ['Sr','stronti',88,'m'], ['Y','ytri',89,'m'], ['Zr','ziriconi',91,'m'], ['Nb','niobi',93,'m'],
  ['Mo','molipđen',96,'m'], ['Tc','tecneti','[98]','m'], ['Ru','ruteni',101,'m'], ['Rh','rođi',103,'m'], ['Pd','palađi',106,'m'],
  ['Ag','bạc',108,'m'], ['Cd','cađimi',112,'m'], ['In','inđi',115,'m'], ['Sn','thiếc',119,'m'], ['Sb','antimon',122,'m'],
  ['Te','telu',128,'n'], ['I','iot',127,'n'], ['Xe','xenon',131,'g']],
 [['Cs','xesi',133,'m'], ['Ba','bari',137,'m'], 'La–Lu', ['Hf','hafini',178,'m'], ['Ta','tantan',181,'m'], ['W','vonfram',184,'m'],
  ['Re','reni',186,'m'], ['Os','osimi',190,'m'], ['Ir','iriđi',192,'m'], ['Pt','platin',195,'m'], ['Au','vàng',197,'m'],
  ['Hg','thuỷ ngân',201,'m'], ['Tl','tali',204,'m'], ['Pb','chì',207,'m'], ['Bi','bitmut',209,'m'], ['Po','poloni','[209]','m'],
  ['At','atatin','[210]','n'], ['Rn','rađon','[222]','g']],
 [['Fr','franxi','[223]','m'], ['Ra','rađi','[226]','m'], 'Ac–Lr', ['Rf','rutherfordi','[267]','m'], ['Db','dubni','[268]','m'],
  ['Sg','seaborgi','[269]','m'], ['Bh','bohri','[270]','m'], ['Hs','hassi','[269]','m'], ['Mt','meitneri','[278]','m'],
  ['Ds','darmstadti','[281]','m'], ['Rg','roentgeni','[282]','m'], ['Cn','copernixi','[285]','m'], ['Nh','nihoni','[286]','m'],
  ['Fl','flerovi','[289]','m'], ['Mc','moscovi','[290]','m'], ['Lv','livermori','[293]','m'], ['Ts','tennessin','[294]','n'],
  ['Og','oganesson','[294]','g']]
];
// lưới bảng: ô 60 px (style.css .pt-cell), bước 64 px; chừa cột số chu kì bên trái và hàng nhãn nhóm ở trên
const PT_STEP = 64, PT_X0 = 26, PT_Y0 = 22;
const PT_GROUP = ['IA','IIA','IIIB','IVB','VB','VIB','VIIB','VIIIB','VIIIB','VIIIB','IB','IIB','IIIA','IVA','VA','VIA','VIIA','VIIIA'];
const PT_KIND = {m:'Kim loại', n:'Phi kim', g:'Khí hiếm'};
const PT_COLOR = {m:'xanh lam', n:'hồng', g:'vàng'};          // màu ô (style.css .k-m / .k-n / .k-g), dùng trong lời giải
const PT_LATIN = {Na:'natrium', K:'kalium', Fe:'ferrum', Cu:'cuprum', Ag:'argentum'};   // kí hiệu "lạ" so với tên tiếng Việt
// độ âm điện χ (thang Pauling) — chế độ khó. Nhóm A lấy đúng bảng độ âm điện SGK Hoá 10; khí hiếm không xét và nguyên
// tố siêu nặng chưa đo được thì không ghi (bảng hiện "—")
const PT_EN = {
 H:2.20, Li:0.98, Be:1.57, B:2.04, C:2.55, N:3.04, O:3.44, F:3.98, Na:0.93, Mg:1.31, Al:1.61, Si:1.90, P:2.19, S:2.58, Cl:3.16,
 K:0.82, Ca:1.00, Sc:1.36, Ti:1.54, V:1.63, Cr:1.66, Mn:1.55, Fe:1.83, Co:1.88, Ni:1.91, Cu:1.90, Zn:1.65, Ga:1.81, Ge:2.01,
 As:2.18, Se:2.55, Br:2.96, Rb:0.82, Sr:0.95, Y:1.22, Zr:1.33, Nb:1.60, Mo:2.16, Tc:1.90, Ru:2.20, Rh:2.28, Pd:2.20, Ag:1.93,
 Cd:1.69, In:1.78, Sn:1.96, Sb:2.05, Te:2.10, I:2.66, Cs:0.79, Ba:0.89, Hf:1.30, Ta:1.50, W:2.36, Re:1.90, Os:2.20, Ir:2.20,
 Pt:2.28, Au:2.54, Hg:2.00, Tl:1.62, Pb:2.33, Bi:2.02, Po:2.00, At:2.20, Fr:0.70, Ra:0.90};
// cấu hình electron: [[lớp n, phân lớp l (0 s, 1 p, 2 d, 3 f), số electron]…]. Điền các phân lớp theo thứ tự năng lượng
// (1s 2s 2p 3s 3p 4s 3d 4p…), sửa ngoại lệ rồi viết lại theo thứ tự lớp như SGK (Fe: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²).
// PT_SHELL_FIX: số electron chuyển từ phân lớp s ngoài cùng vào phân lớp d sát trong (Cr, Cu: 3dⁿ⁺¹ 4s¹; Pd chuyển cả 2 nên
// chỉ còn 4 lớp dù ở chu kì 5)
const PT_SHELL_FIX = {Cr:1, Cu:1, Nb:1, Mo:1, Ru:1, Rh:1, Pd:2, Ag:1, Pt:1, Au:1};
function ptConfig(z, s){
  const subs = [], cfg = [];
  for(let n = 1; n <= 7; n++) for(let l = 0; l < Math.min(n, 4); l++) subs.push([n, l]);
  subs.sort((a, b) => a[0] + a[1] - b[0] - b[1] || a[0] - b[0]);
  let left = z;
  subs.forEach(([n, l]) => { const k = Math.min(left, 4*l + 2); if(k){ cfg.push([n, l, k]); left -= k; } });
  const mv = PT_SHELL_FIX[s];
  if(mv){
    const ns = cfg.filter(x => x[1] === 0).pop();
    ns[2] -= mv; cfg.find(x => x[0] === ns[0] - 1 && x[1] === 2)[2] += mv;
  }
  return cfg.filter(x => x[2]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
// cấu hình viết ra HTML (số electron là chữ mũ), các phân lớp cách nhau dấu cách để ô hẹp tự xuống dòng. Từ chu kì 3 viết
// gọn phần giống khí hiếm đứng trước: Na = [Ne] 3s¹, K = [Ar] 4s¹ (full = true thì viết đủ). cfg: chỉ viết các phân lớp này
const PT_CORE = {3:'Ne', 4:'Ar', 5:'Kr', 6:'Xe', 7:'Rn'};
function ptCfgHTML(e, full, cfg){
  const core = !full && PT_CORE[e.p] && PT_BY[PT_CORE[e.p]];
  const rest = (cfg || e.cfg).filter(x => !core || !core.cfg.some(c => c[0] === x[0] && c[1] === x[1]));
  return (core ? '[' + core.s + '] ' : '') + rest.map(([n, l, k]) => n + 'spdf'[l] + '<sup>' + k + '</sup>').join(' ');
}
// các phân lớp của lớp n, có nhiều phân lớp thì kèm phép cộng: "3s² 3p⁵ = 2 + 5"
const ptLayer = (e, n) => { const L = e.cfg.filter(x => x[0] === n);
  return ptCfgHTML(e, true, L) + (L.length > 1 ? ' = ' + L.map(x => x[2]).join(' + ') : ''); };
// cấu hình như ghi trên ô; ô viết gọn thì kèm bản đầy đủ (lời giải)
const ptCfgSay = e => PT_CORE[e.p] ? ptCfgHTML(e) + ' (đầy đủ: ' + ptCfgHTML(e, true) + ')' : ptCfgHTML(e);
// PT: mọi ô theo thứ tự {s, z, nm, m, k, p: chu kì, c: cột 1–18, en: độ âm điện hoặc null, cfg: cấu hình electron, sh:
// số electron từng lớp}; ô gộp có fam = 1. PT_BY: tra theo kí hiệu, PT_Z: theo số hiệu
const PT = [], PT_BY = {}, PT_Z = {};
(() => {
  let z = 0;
  PT_DATA.forEach((row, r) => row.forEach((e, k) => {
    const p = r + 1, c = row.length === 2 ? [1, 18][k] : row.length === 8 ? [1, 2, 13, 14, 15, 16, 17, 18][k] : k + 1;
    if(typeof e === 'string'){
      PT.push({fam:1, s:e, z:(z + 1) + '–' + (z + 15), nm:p === 6 ? 'họ lantan' : 'họ actini', m:'15 nguyên tố', k:'m', p, c});
      z += 15; return;
    }
    const el = {s:e[0], z:++z, nm:e[1], m:e[2], k:e[3], p, c, en:PT_EN[e[0]] || null};
    el.cfg = ptConfig(el.z, el.s);
    el.sh = [];
    el.cfg.forEach(([n, , k]) => el.sh[n - 1] = (el.sh[n - 1] || 0) + k);
    PT.push(el); PT_BY[el.s] = el; PT_Z[el.z] = el;
  }));
})();
const ptMain = e => e.c <= 2 || e.c >= 13;                    // nguyên tố nhóm A
const ptOuter = e => e.c <= 2 ? e.c : e.c - 10;               // nhóm A: số electron lớp ngoài cùng = số thứ tự nhóm
const ptMass = e => typeof e.m === 'number' ? fmt(e.m, 1) : e.m;
const ptName = e => e.nm + ' (' + e.s + ')';
// bán kính cộng hoá trị (pm, Cordero 2008) của các nguyên tố nhóm A trừ khí hiếm — chỉ để chọn đề so sánh kích thước:
// chỉ hỏi cặp mà quy luật trên bảng (cùng chu kì: trái → phải nhỏ dần; cùng nhóm: trên → dưới to dần) khớp với số liệu
// thật và chênh ít nhất PT_RAD_GAP pm. Cặp sát nhau / ngược quy luật như Al–Ga, Se–Br, Te–I tự bị loại.
const PT_RAD = {H:31, Li:128, Be:96, B:84, C:76, N:71, O:66, F:57, Na:166, Mg:141, Al:121, Si:111, P:107, S:105, Cl:102,
  K:203, Ca:176, Ga:122, Ge:120, As:119, Se:120, Br:120, Rb:220, Sr:195, In:142, Sn:139, Sb:139, Te:138, I:139, Cs:244, Ba:215};
const PT_RAD_GAP = 3;
// a to hơn b theo quy luật nào? 'p': cùng chu kì, a bên trái · 'g': cùng nhóm, a ở dưới · 'd': a vừa ở dưới vừa bên trái
function ptBig(a, b){
  const A = PT_BY[a], B = PT_BY[b];
  const how = A.p === B.p ? A.c < B.c && 'p' : A.c === B.c ? A.p > B.p && 'g' : A.p > B.p && A.c < B.c && 'd';
  return how && PT_RAD[a] - PT_RAD[b] >= PT_RAD_GAP ? how : null;
}
// mọi đề so sánh bán kính: cặp theo từng quy luật, bộ ba cùng chu kì / cùng nhóm; mỗi đề xếp sẵn từ to đến nhỏ
let ptBigSets = null;
function ptBigAll(){
  if(ptBigSets) return ptBigSets;
  const K = Object.keys(PT_RAD), S = {p2:[], g2:[], d2:[], p3:[], g3:[]};
  K.forEach(a => K.forEach(b => {
    const h = ptBig(a, b);
    if(!h) return;
    S[h + 2].push([a, b]);
    if(h !== 'd') K.forEach(c => { if(ptBig(b, c) === h && ptBig(a, c) === h) S[h + 3].push([a, b, c]); });
  }));
  return ptBigSets = S;
}
// phương án trả lời: đáp án + phương án nhiễu theo thứ tự ưu tiên trong wrong (bỏ trùng, bỏ khác kiểu, bỏ số ≤ 0) cho
// đủ 4; đáp án là số mà còn thiếu thì bù bằng số gần đáp án. show: cách ghi một phương án
function ptChoice(right, wrong, show){
  const vals = [right];
  const add = v => { if(vals.length < 4 && typeof v === typeof right && !(typeof v === 'number' && !(v > 0)) && !vals.includes(v)) vals.push(v); };
  wrong.forEach(add);
  if(typeof right === 'number') for(let d = 1; vals.length < 4; d++){ add(right + d); add(right - d); }
  const opts = shuffle(vals);
  return {opts:opts.map(v => ({t:show ? show(v) : String(v), v})), ans:opts.indexOf(right)};
}
const ptOr = c => c.length === 2 ? c.join(' hay ') : c.slice(0, -1).join(', ') + ' hay ' + c[c.length - 1];   // "Na, Mg hay Al"
// —— dùng cho chế độ khó ——
const ptEN = v => v == null ? '—' : v.toFixed(2).replace('.', ',');
const ptGroupNum = e => ({I:1, II:2, III:3, IV:4, V:5, VI:6, VII:7, VIII:8})[PT_GROUP[e.c - 1].slice(0, -1)];
const PT_SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const ptCharge = q => (Math.abs(q) > 1 ? PT_SUP[Math.abs(q)] : '') + (q > 0 ? '⁺' : '⁻');
// ion của nguyên tố nhóm A: kim loại nhường hết electron lớp ngoài, phi kim nhận thêm cho đủ 8 → các lớp electron (sh)
// giống một khí hiếm (gas)
function ptIon(e){
  const n = ptOuter(e), give = e.k === 'm', k = give ? n : 8 - n, q = give ? k : -k;
  const sh = give ? e.sh.slice(0, -1) : e.sh.slice(0, -1).concat(8);
  return {q, k, give, sh, ion:e.s + ptCharge(q), gas:PT.find(x => x.k === 'g' && x.sh.join() === sh.join())};
}
// đề so sánh độ âm điện theo quy luật: cặp / bộ ba cùng chu kì (χ tăng sang phải) hoặc cặp cùng nhóm (χ giảm xuống dưới)
// mà số liệu khớp quy luật, chênh ít nhất 0,1 — cặp ngược như Al–Ga (1,61 – 1,81) tự bị loại. Mỗi đề xếp từ χ lớn đến nhỏ
let ptEnSets = null;
function ptEnAll(){
  if(ptEnSets) return ptEnSets;
  const K = Object.keys(PT_RAD), S = {p2:[], g2:[], p3:[]};
  const hi = (a, b) => {
    const A = PT_BY[a], B = PT_BY[b];
    const how = A.p === B.p ? A.c > B.c && 'p' : A.c === B.c ? A.p < B.p && 'g' : null;
    return how && Math.round((A.en - B.en)*100) >= 10 ? how : null;
  };
  K.forEach(a => K.forEach(b => {
    const h = hi(a, b);
    if(!h) return;
    S[h + 2].push([a, b]);
    if(h === 'p') K.forEach(c => { if(hi(b, c) === 'p' && hi(a, c) === 'p') S.p3.push([a, b, c]); });
  }));
  return ptEnSets = S;
}
// kính lúp chi tiết của chế độ khó (độ âm điện, các lớp electron, hình các lớp ptBohr bên dưới). Đang TẮT: chế độ khó ghi
// mọi thông tin ngay trên ô, chỗ kính lúp chỉ là một ô ví dụ có chú thích. Để dành làm tính năng "học thêm" — đổi thành
// true là kính lúp này hiện lại, đổi theo ô đang soi
const PT_HARD_LENS = false;
// chế độ khó: khung game hiện nhỏ hơn mức này (cỡ thật / 1280) là "màn hình vừa và nhỏ" — chữ cấu hình 8,5 px trên ô còn
// dưới ~9 px — thì bấm ô sẽ hiện số liệu ô đó vào ô hướng dẫn. Full HD toàn màn hình ≈ 1,3; laptop ≈ 0,9; điện thoại ≈ 0,5
const PT_ZOOM_MIN = 1.1;
// các lớp electron vẽ trong kính lúp (chế độ khó): hạt nhân +Z ở giữa, mỗi lớp một vòng, electron chia đều trên vòng.
// Khung 176×176; lớp ngoài cùng cách mép 4 px, nhiều lớp thì các vòng xích lại
function ptBohr(e){
  const C = 88, R0 = 16, sh = e && !e.fam ? e.sh : [], f = n => n.toFixed(1);
  const step = Math.min(22, (C - 4 - R0)/Math.max(1, sh.length)), dot = sh.length > 4 ? 2.4 : 3.2;
  let g = '';
  sh.forEach((n, j) => {
    const r = R0 + step*(j + 1);
    g += `<circle cx="${C}" cy="${C}" r="${f(r)}" fill="none" stroke="#3b302566" stroke-width="1.2"/>`;
    for(let t = 0; t < n; t++){
      const a = -Math.PI/2 + j*.4 + 2*Math.PI*t/n;
      g += `<circle cx="${f(C + r*Math.cos(a))}" cy="${f(C + r*Math.sin(a))}" r="${dot}" fill="#3b3025"/>`;
    }
  });
  const lbl = e && !e.fam ? '+' + e.z : '?';
  return g + `<circle cx="${C}" cy="${C}" r="${R0}" style="fill:var(--kc,#fff)" stroke="#3b3025" stroke-width="1.5"/>`
    + `<text x="${C}" y="${C + 4.5}" text-anchor="middle" style="font:${lbl.length > 3 ? 11 : 13}px var(--fh)" fill="#3b3025">${lbl}</text>`;
}
/* Các dạng câu (day.rounds chọn dạng). Mỗi hàm trả về một câu: key (không cho ra hai câu trùng key), tag (nhãn nhỏ),
   q (đề, HTML), why (lời giải hiện sau khi trả lời), show (ô tô xanh khi giải), row / col (nhãn chu kì / nhóm tô vàng khi
   giải), và MỘT trong hai cách trả lời:
   – opts + ans: bấm nút (els: các nút là kí hiệu nguyên tố — rê chuột lên nút thì ô đó trên bảng sáng viền; eq: các nút
     cùng cỡ, chữ trên nút xuống dòng theo <br>);
   – pick: các kí hiệu được chấp nhận — bấm ô trên bảng rồi Chốt. */
const PT_Q = {
 // —— đọc ô ——
 mass(day){
  const e = PT_BY[pick(day.pool)], near = [PT_Z[e.z + 1], PT_Z[e.z - 1]].map(x => x && x.m);
  return {key:'mass' + e.s, tag:'Đọc ô nguyên tố', q:`Nguyên tử khối của <b>${ptName(e)}</b> là bao nhiêu?`,
   ...ptChoice(e.m, [e.z].concat(shuffle(near.concat(2*e.z, e.m + 2))), v => fmt(v, 1) + ' amu'),
   why:`Ô ${e.s}: số nhỏ ở góc trên là số hiệu nguyên tử (${e.z}), số dưới cùng là nguyên tử khối — <b>${fmt(e.m, 1)} amu</b>.`, show:[e.s]};
 },
 proton(day){
  const e = PT_BY[pick(day.pool)], el = Math.random() < .5, A = Math.round(e.m);
  return {key:'proton' + e.s, tag:'Đọc ô nguyên tố', q:`Nguyên tử <b>${ptName(e)}</b> có bao nhiêu ${el ? 'electron' : 'proton trong hạt nhân'}?`,
   ...ptChoice(e.z, [A, A - e.z, e.z + 1, e.z - 1]),
   why:`Số proton = số electron = số hiệu nguyên tử. ${e.s} nằm ở ô số ${e.z} → <b>${e.z} ${el ? 'electron' : 'proton'}</b>.`, show:[e.s]};
 },
 // tên chỉ hiện trong kính lúp, nên phải soi ô mới tìm ra; phương án nhiễu là kí hiệu cùng chữ đầu với đáp án / với tên
 symbol(day){
  const e = PT_BY[pick(day.pool)], first = e.nm[0].toUpperCase();
  const like = PT.filter(x => !x.fam && x !== e && (x.s[0] === e.s[0] || x.s[0] === first)).map(x => x.s);
  return {key:'symbol' + e.s, tag:'Đọc ô nguyên tố', els:1, q:`Kí hiệu hoá học của nguyên tố <b>${e.nm}</b> là gì?`,
   ...ptChoice(e.s, shuffle(like).concat(shuffle(day.pool))),
   why:`Kí hiệu của ${e.nm} là <b>${e.s}</b>` + (PT_LATIN[e.s] ? ` — lấy từ tên Latinh <i>${PT_LATIN[e.s]}</i>.` : ': chữ cái đầu viết hoa, chữ sau (nếu có) viết thường.'),
   show:[e.s]};
 },
 findZ(day){
  const e = PT_BY[pick(day.pool)], el = Math.random() < .5;
  return {key:'find' + e.s, tag:'Tìm trên bảng', pick:[e.s],
   q:`Hãy chọn nguyên tố có <b>${e.z} ${el ? 'electron' : 'proton'}</b> trong nguyên tử.`,
   why:`Số ${el ? 'electron' : 'proton'} = số hiệu nguyên tử → ô số ${e.z} là <b>${ptName(e)}</b>.`, show:[e.s]};
 },
 findMass(day){
  const e = PT_BY[pick(day.pool.filter(s => PT.filter(x => x.m === PT_BY[s].m).length === 1))];   // nguyên tử khối không trùng ô khác
  return {key:'find' + e.s, tag:'Tìm trên bảng', pick:[e.s],
   q:`Hãy chọn nguyên tố có nguyên tử khối <b>${fmt(e.m, 1)} amu</b>.`,
   why:`Ô có nguyên tử khối ${fmt(e.m, 1)} là <b>${ptName(e)}</b>.`, show:[e.s]};
 },
 // —— chu kì, nhóm, màu ô ——
 // số lớp electron: chỉ có ở chế độ khó (day.hard.rounds), nên lời giải dẫn cả cấu hình ghi trên ô
 shells(day){
  const e = PT_BY[pick(day.pool)];
  return {key:'shells' + e.s, tag:'Chu kì & lớp electron', q:`Nguyên tử <b>${ptName(e)}</b> có mấy lớp electron?`,
   ...ptChoice(e.p, [ptMain(e) ? ptOuter(e) : null, e.p + 1, e.p - 1]),
   why:`Số lớp electron = số thứ tự chu kì. ${e.s} nằm ở hàng chu kì ${e.p} → <b>${e.p} lớp electron</b>`
     + ` (cấu hình ${ptCfgHTML(e)}: phân lớp ngoài cùng bắt đầu bằng số ${e.p}).`, show:[e.s], row:e.p};
 },
 outer(day){
  const e = PT_BY[pick(day.pool.filter(s => s !== 'He' && ptMain(PT_BY[s])))], n = ptOuter(e);
  return {key:'outer' + e.s, tag:'Nhóm & electron lớp ngoài cùng', q:`Nguyên tử <b>${ptName(e)}</b> có mấy electron ở lớp ngoài cùng?`,
   ...ptChoice(n, [e.p, n + 1, n - 1, e.z]),
   why:`Nhóm A: số electron lớp ngoài cùng = số thứ tự nhóm. ${e.s} ở cột nhóm ${PT_GROUP[e.c - 1]} → <b>${n} electron</b>.`, show:[e.s], col:e.c};
 },
 kind(day){
  const e = PT_BY[pick(day.pool)], K = ['m', 'n', 'g'];
  return {key:'kind' + e.s, tag:'Kim loại hay phi kim?', q:`<b>${ptName(e).replace(/^./, ch => ch.toUpperCase())}</b> là kim loại, phi kim hay khí hiếm?`,
   opts:K.map(k => ({t:PT_KIND[k], v:k})), ans:K.indexOf(e.k),
   why:`Nhìn màu ô: ${e.s} tô màu ${PT_COLOR[e.k]} → ${e.s} là <b>${PT_KIND[e.k].toLowerCase()}</b>.`, show:[e.s]};
 },
 // cùng nhóm chỉ hỏi nguyên tố nhóm A (nhóm VIIIB có tới ba cột)
 same(day){
  const e = PT_BY[pick(day.pool)], grp = ptMain(e) && Math.random() < .5;
  const all = PT.filter(x => !x.fam && (grp ? x.c === e.c : x.p === e.p)).map(x => x.s);
  const list = all.length > 8 ? all.slice(0, 3).join(', ') + ', …, ' + all[all.length - 1] : all.join(', ');
  return {key:'same' + e.s, tag:'Tìm trên bảng', pick:all.filter(s => s !== e.s),
   q:`Hãy chọn một nguyên tố <b>cùng ${grp ? 'nhóm' : 'chu kì'}</b> với ${ptName(e)}.`,
   why:grp ? `Cùng nhóm = cùng CỘT. Nhóm ${PT_GROUP[e.c - 1]} gồm ${list}.` : `Cùng chu kì = cùng HÀNG. Chu kì ${e.p} gồm ${list}.`,
   show:all.filter(s => s !== e.s), ...(grp ? {col:e.c} : {row:e.p})};
 },
 // —— so sánh bán kính: cặp / bộ ba cùng chu kì, cùng nhóm, hoặc cặp chéo (vừa ở dưới vừa bên trái) ——
 bigger(){
  const S = ptBigAll(), kind = pick(['p2', 'g2', 'd2', 'p3', 'g3']), set = pick(S[kind]), big = Math.random() < .5;
  const A = PT_BY[set[0]], B = PT_BY[set[1]], ans = big ? set[0] : set[set.length - 1], cand = shuffle(set);
  const why = kind[0] === 'p' ? `Cùng chu kì ${A.p}: đi từ trái sang phải, bán kính nguyên tử giảm dần`
    : kind[0] === 'g' ? `Cùng nhóm ${PT_GROUP[A.c - 1]}: đi từ trên xuống, nguyên tử thêm lớp electron nên bán kính tăng dần`
    : `${A.s} vừa ở chu kì dưới (nhiều lớp electron hơn) vừa nằm bên trái ${B.s}`;
  return {key:'big' + set.slice().sort().join(), tag:'So sánh kích thước nguyên tử', els:1,
   q:`Nguyên tử nào có bán kính <b>${big ? 'LỚN' : 'NHỎ'} ${set.length === 2 ? 'hơn' : 'nhất'}</b>: ${ptOr(cand)}?`,
   opts:cand.map(s => ({t:s, v:s})), ans:cand.indexOf(ans),
   why:why + ' → ' + set.join(' > ') + `. Nguyên tử ${big ? 'lớn' : 'nhỏ'} ${set.length === 2 ? 'hơn' : 'nhất'} là <b>${ans}</b>.`,
   show:[ans], ...(kind[0] === 'p' ? {row:A.p} : kind[0] === 'g' ? {col:A.c} : {})};
 },
 // —— tính toán với nguyên tử khối ——
 mr(day){
  const f = pick(day.mr), cnt = atomCounts(f), els = Object.keys(cnt), M = molarMass(f);
  const terms = els.map(e => (cnt[e] > 1 ? cnt[e] + '×' : '') + fmt(ATOM[e], 1)).join(' + ');
  const noSub = els.reduce((s, e) => s + ATOM[e], 0), byZ = els.reduce((s, e) => s + PT_BY[e].z*cnt[e], 0);
  return {key:'mr' + f, tag:'Tính phân tử khối', q:`Phân tử khối của <b>${sub(f)}</b> là bao nhiêu? Đọc nguyên tử khối trên bảng rồi cộng lại.`,
   ...ptChoice(M, [noSub, byZ, M + 16, M - 16, M + 2], v => fmt(v, 1) + ' amu'),
   why:`${sub(f)} = ${terms} = <b>${fmt(M, 1)} amu</b>.`, show:els};
 },
 ratio(day){
  const ps = [];
  day.pool.forEach(a => day.pool.forEach(b => { const r = PT_BY[a].m/PT_BY[b].m; if(r >= 1.5 && r <= 16 && Number.isInteger(r*2)) ps.push([a, b, r]); }));
  const [a, b, r] = pick(ps), A = PT_BY[a], B = PT_BY[b];
  return {key:'ratio' + a + b, tag:'So sánh khối lượng', q:`Nguyên tử <b>${a}</b> nặng gấp mấy lần nguyên tử <b>${b}</b>?`,
   ...ptChoice(r, [r + 1, 2*r, r - .5, Math.round(A.z/B.z*2)/2], v => fmt(v, 1) + ' lần'),
   why:`Nguyên tử khối: ${a} = ${fmt(A.m, 1)}, ${b} = ${fmt(B.m, 1)} → ${fmt(A.m, 1)} : ${fmt(B.m, 1)} = <b>${fmt(r, 1)} lần</b>.`, show:[a, b]};
 },
 // 30%: câu bẫy Ar–K / Te–I — chất đứng trước trong bảng lại nặng hơn
 heavier(day){
  const trap = Math.random() < .3;
  let c = trap ? pick([['Ar', 'K'], ['Te', 'I']]) : null;
  while(!c || new Set(c.map(s => PT_BY[s].m)).size < c.length) c = shuffle(day.pool).slice(0, 3);
  const heavy = trap || Math.random() < .5, by = c.slice().sort((x, y) => PT_BY[y].m - PT_BY[x].m);
  const ans = heavy ? by[0] : by[by.length - 1], cand = shuffle(c), hn = c.length === 2 ? 'hơn' : 'nhất';
  return {key:'heavy' + by.join(), tag:'So sánh khối lượng', els:1, q:`Nguyên tử nào <b>${heavy ? 'NẶNG' : 'NHẸ'} ${hn}</b>: ${ptOr(cand)}?`,
   opts:cand.map(s => ({t:s, v:s})), ans:cand.indexOf(ans),
   why:'Nguyên tử khối: ' + by.map(s => s + ' = ' + fmt(PT_BY[s].m, 1)).join(', ') + ` → <b>${ans}</b> ${heavy ? 'nặng' : 'nhẹ'} ${hn}.`
     + (trap ? ` ${by[1]} đứng SAU ${by[0]} trong bảng mà lại nhẹ hơn — bảng xếp theo số hiệu nguyên tử, không theo khối lượng!` : ''),
   show:[ans]};
 },

 // ———— chế độ khó: neutron, lớp electron, ion, độ âm điện, loại liên kết (danh sách nguyên tố / chất trong day.hard) ————
 neutron(day){
  const e = PT_BY[pick(day.neutron)], n = e.m - e.z;
  return {key:'neu' + e.s, tag:'Hạt trong nguyên tử', q:`Nguyên tử <b>${ptName(e)}</b> có bao nhiêu neutron trong hạt nhân?`,
   ...ptChoice(n, [e.m, e.z, e.m + e.z, n + 1]),
   why:`Khối lượng nguyên tử ≈ số proton + số neutron (electron nhẹ, coi như không đáng kể). ${e.s}: ${e.m} − ${e.z} = <b>${n} neutron</b>.`, show:[e.s]};
 },
 // đọc lớp thứ k từ cấu hình trên ô (cộng các phân lớp cùng số lớp); riêng nguyên tố nhóm B mà lớp ngoài cùng khác số thứ
 // tự nhóm (Mn, Fe) thì hỏi lớp ngoài cùng — bẫy quy tắc nhóm A, và bẫy 3d viết trước 4s
 shell(day){
  const e = PT_BY[pick(day.pool.filter(s => PT_BY[s].sh.length >= 2))], sh = e.sh, L = sh.length, out = sh[L - 1];
  if(!ptMain(e) && ptGroupNum(e) !== out)
    return {key:'shell' + e.s, tag:'Cấu hình electron', q:`<b>${ptName(e).replace(/^./, ch => ch.toUpperCase())}</b> thuộc nhóm ${PT_GROUP[e.c - 1]}. Lớp ngoài cùng của nguyên tử này có mấy electron?`,
     ...ptChoice(out, [ptGroupNum(e), sh[L - 2], 8, out + 1]),
     why:`${e.s} thuộc nhóm B nên KHÔNG dùng được quy tắc "số electron lớp ngoài = số thứ tự nhóm". Cấu hình ${ptCfgSay(e)}: lớp ngoài cùng là lớp ${L} (${ptLayer(e, L)}) → <b>${out} electron</b>. Phân lớp ${L - 1}d thuộc lớp ${L - 1}, không phải lớp ngoài!`,
     show:[e.s], col:e.c};
  const k = 2 + Math.floor(Math.random()*(L - 1));                  // từ lớp thứ 2 — lớp 1 lúc nào cũng 2 electron
  return {key:'shell' + e.s, tag:'Cấu hình electron', q:`Lớp electron thứ <b>${k}</b> của nguyên tử <b>${ptName(e)}</b> có mấy electron?`,
   ...ptChoice(sh[k - 1], sh.concat(8, e.z > 20 ? 18 : e.p, sh[k - 1] + 1, sh[k - 1] - 1)),   // 18 chỉ nhiễu được khi có lớp 18
   why:`Cấu hình ${ptCfgSay(e)}. Lớp ${k} gồm các phân lớp có số ${k} đứng đầu: ${ptLayer(e, k)} → <b>${sh[k - 1]} electron</b>.`, show:[e.s]};
 },
 // đề ghi cấu hình ĐẦY ĐỦ; từ chu kì 3 ô trên bảng viết gọn [Ne]… nên phải hiểu cách viết gọn mới tìm ra
 config(day){
  const e = PT_BY[pick(day.pool.filter(s => s !== 'He' && ptMain(PT_BY[s]) && PT_BY[s].sh.length >= 2))];
  return {key:'find' + e.s, tag:'Tìm trên bảng', pick:[e.s],
   q:`Hãy chọn nguyên tố có cấu hình electron <b>${ptCfgHTML(e, true)}</b>.`,
   why:`Cộng các số mũ: ${e.cfg.map(x => x[2]).join(' + ')} = ${e.z} electron → Z = ${e.z} → <b>${ptName(e)}</b>`
     + (PT_CORE[e.p] ? `; trên bảng ô ${e.s} viết gọn là ${ptCfgHTML(e)}.` : '.'),
   show:[e.s], row:e.p, col:e.c};
 },
 ion(day){
  const e = PT_BY[pick(day.ion)], I = ptIon(e), n = ptOuter(e), s = Math.sign(I.q), L = e.sh.length;
  const wrong = [I.give ? n - 8 : n, I.q + s, -I.q, I.q - s].filter(q => q && Math.abs(q) <= 7);   // sai chiều, sai số electron
  return {key:'ion' + e.s, tag:'Ion', q:`Để có lớp electron ngoài cùng bền như khí hiếm, nguyên tử <b>${ptName(e)}</b> sẽ tạo thành ion nào?`,
   ...ptChoice(I.ion, wrong.map(q => e.s + ptCharge(q))),
   why:`${e.s}: ${ptCfgHTML(e)} — lớp ngoài cùng (${ptLayer(e, L)}) có ${n} electron → dễ ${I.give ? 'NHƯỜNG' : 'NHẬN thêm'} ${I.k} electron → <b>${I.ion}</b> có cấu hình ${ptCfgHTML(I.gas)} giống ${I.gas.s}.`,
   show:[e.s, I.gas.s]};
 },
 // cùng key với ion: một nguyên tố không bị hỏi hai lần (câu sau sẽ lộ đáp án câu trước)
 ionGas(day){
  const e = PT_BY[pick(day.ion)], I = ptIon(e), verb = I.give ? 'nhường' : 'nhận thêm';
  if(Math.random() < .5){
    const G4 = ['He', 'Ne', 'Ar', 'Kr'];
    return {key:'ion' + e.s, tag:'Ion', els:1, q:`Ion <b>${I.ion}</b> có cấu hình electron giống nguyên tử khí hiếm nào?`,
     opts:G4.map(s => ({t:s, v:s})), ans:G4.indexOf(I.gas.s),
     why:`${e.s} (${ptCfgHTML(e)}) ${verb} ${I.k} electron → ${I.ion}: ${ptCfgHTML(I.gas)} — y như <b>${I.gas.s}</b>.`, show:[e.s, I.gas.s]};
  }
  const N = e.z - I.q;
  return {key:'ion' + e.s, tag:'Ion', q:`Ion <b>${I.ion}</b> có tất cả bao nhiêu electron?`,
   ...ptChoice(N, [e.z, e.z + I.q, N + 2, N - 2]),
   why:`Nguyên tử ${e.s} có ${e.z} electron (= Z), ${verb} ${I.k} → ${I.ion} có ${e.z} ${I.give ? '−' : '+'} ${I.k} = <b>${N} electron</b>.`, show:[e.s]};
 },
 // so sánh độ âm điện: theo quy luật (ptEnAll) hoặc hai, ba nguyên tố bất kì trong pool — khi đó chỉ đọc số liệu
 en(day){
  const kind = pick(['p2', 'g2', 'p3', 'x2', 'x3']), big = Math.random() < .5;
  let set;
  if(kind[0] === 'x'){
    const P = day.pool.filter(s => PT_BY[s].en);
    do set = shuffle(P).slice(0, +kind[1]);
    while(set.some((a, j) => set.some((b, t) => t > j && Math.abs(PT_BY[a].en - PT_BY[b].en) < .1)));
    set.sort((a, b) => PT_BY[b].en - PT_BY[a].en);
  } else set = pick(ptEnAll()[kind]);
  const A = PT_BY[set[0]], ans = big ? set[0] : set[set.length - 1], cand = shuffle(set), hn = set.length === 2 ? 'hơn' : 'nhất';
  const rule = kind[0] === 'p' ? ` — cùng chu kì ${A.p}, χ tăng dần từ trái sang phải` : kind[0] === 'g' ? ` — cùng nhóm ${PT_GROUP[A.c - 1]}, χ giảm dần từ trên xuống` : '';
  return {key:'en' + set.slice().sort().join(), tag:'Độ âm điện', els:1, q:`Nguyên tố nào có độ âm điện <b>${big ? 'LỚN' : 'NHỎ'} ${hn}</b>: ${ptOr(cand)}?`,
   opts:cand.map(s => ({t:s, v:s})), ans:cand.indexOf(ans),
   why:`Độ âm điện: ${set.map(s => s + ' = ' + ptEN(PT_BY[s].en)).join(', ')}${rule} → ${big ? 'lớn' : 'nhỏ'} ${hn} là <b>${ans}</b>.`,
   show:[ans], ...(kind[0] === 'p' ? {row:A.p} : kind[0] === 'g' ? {col:A.c} : {})};
 },
 // độ âm điện lớn / nhỏ nhất của một chu kì (2–5) hoặc lớn nhất của một nhóm A — khoi-dong.js kiểm tra đáp án khớp quy luật
 enMax(){
  const v = pick(['pMax', 'pMin', 'gMax']), c = pick([1, 2, 13, 14, 15, 16, 17]), p = 2 + Math.floor(Math.random()*4);
  const line = PT.filter(x => x.en && (v === 'gMax' ? x.c === c : x.p === p)).sort((a, b) => b.en - a.en);
  const e = v === 'pMin' ? line[line.length - 1] : line[0];
  return {key:'enMax' + v + (v === 'gMax' ? c : p), tag:'Độ âm điện', pick:[e.s],
   q:v === 'gMax' ? `Hãy chọn nguyên tố có độ âm điện <b>LỚN NHẤT</b> trong nhóm <b>${PT_GROUP[c - 1]}</b>.`
     : `Hãy chọn nguyên tố có độ âm điện <b>${v === 'pMin' ? 'NHỎ NHẤT' : 'LỚN NHẤT'}</b> trong chu kì <b>${p}</b>.`,
   why:(v === 'gMax' ? 'Cùng nhóm, χ giảm dần từ trên xuống → lớn nhất là nguyên tố trên cùng'
     : 'Cùng chu kì, χ tăng dần từ trái sang phải (khí hiếm không xét) → ' + (v === 'pMin' ? 'nhỏ nhất ở đầu hàng' : 'lớn nhất ở cuối hàng, ngay trước khí hiếm'))
     + `: <b>${ptName(e)}</b>, χ = ${ptEN(e.en)}.`,
   show:[e.s], ...(v === 'gMax' ? {col:c} : {row:p})};
 },
 // loại liên kết theo hiệu độ âm điện (SGK Hoá 10): bốc loại trước rồi mới bốc chất, cho ba loại ra đều nhau
 bond(day){
  const K = ['Liên kết ion', 'Cộng hoá trị có cực', 'Cộng hoá trị không cực'], cls = pick([0, 1, 2]);
  const b = pick(ptBonds(day).filter(x => x.cls === cls)), by = b.els.slice().sort((x, y) => PT_BY[y].en - PT_BY[x].en);
  const metal = cls && b.els.find(s => PT_BY[s].k === 'm');
  return {key:'bond' + b.f, tag:'Liên kết hoá học',
   q:`Dựa vào hiệu độ âm điện Δχ, liên kết trong <b>${sub(b.f)}</b> thuộc loại nào?`
     + '<small class="pt-rule">Δχ ≥ 1,7: ion · 0,4 ≤ Δχ < 1,7: cộng hoá trị có cực · Δχ < 0,4: cộng hoá trị không cực</small>',
   opts:K.map((t, x) => ({t:t.replace('trị ', 'trị<br>'), v:x})), ans:cls, eq:1,       // nút cùng cỡ, xuống dòng sau "Cộng hoá trị"
   why:(by.length === 1 ? `${sub(b.f)}: các nguyên tử giống nhau → Δχ = 0`
       : `Δχ = ${ptEN(PT_BY[by[0]].en)} (${by[0]}) − ${ptEN(PT_BY[by[1]].en)} (${by[1]}) = ${ptEN(b.d)}`)
     + ` → <b>${K[cls].toLowerCase()}</b>.` + (metal ? ` Dù ${metal} là kim loại, Δχ vẫn chưa tới 1,7!` : ''),
   show:b.els};
 }
};
// chất trong day.bond kèm hiệu độ âm điện d và loại liên kết cls (0 ion, 1 cộng hoá trị có cực, 2 không cực)
function ptBonds(day){
  return day.bond.map(f => {
    const els = Object.keys(atomCounts(f)), x = els.map(s => PT_BY[s].en);
    const d = Math.round((Math.max(...x) - Math.min(...x))*100)/100;
    return {f, els, d, cls:d >= 1.7 ? 0 : d >= .4 ? 1 : 2};
  });
}
// 12 câu theo day.rounds; trong một nhóm, dạng nào chưa ra thì bốc trước; không có hai câu trùng key
function ptQuiz(day){
  const qs = [];
  day.rounds.forEach(([n, kinds]) => {
    const used = [];
    for(let k = 0; k < n; k++){
      const left = kinds.filter(x => !used.includes(x));
      let q;
      for(let t = 0; t < 40; t++){
        const kind = pick(left.length ? left : kinds);
        q = PT_Q[kind](day); q.kind = kind;
        if(!qs.some(o => o.key === q.key)) break;
      }
      used.push(q.kind); qs.push(q);
    }
  });
  return qs;
}

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
  ov.querySelector('#cnext').onclick = () => { closeOv(ov); if(last) concResult(); else { conc.ci++; renderConc(); } };
}
function concResult(){
  const n = conc.list.length, cor = conc.correct, r = cor/n;
  const stars = r>=1 ? 3 : r>=.75 ? 2 : r>=.5 ? 1 : 0;
  if(cor > (save.hardBest||0)){ save.hardBest = cor; persist(); }
  resultCard('Kết thúc chế độ khó', stars, `<div class="resbody">
      <p style="font-size:18px">Đúng <b>${cor}/${n}</b> câu · Kỷ lục: <b>${Math.max(cor, save.hardBest||0)}/${n}</b></p>
      <p class="hand">“${stars===3?'Bậc thầy nồng độ — không lệch một li!':stars>=1?'Khá lắm! Luyện thêm cho chắc công thức nhé.':'Ôn lại Cₘ và C% rồi thử lại nào, trò làm được mà!'}”</p>
    </div>
    <div class="row resbtns">${resBtn('cagain', 'retry', 'Chơi lại')}${resBtn('cmenu', 'home', 'Về menu', ' main')}</div>`);
  G.querySelector('#cagain').onclick = () => go(startConc);
  G.querySelector('#cmenu').onclick = () => go(showMenu);
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
    closeOv(ov); cb(units);
  };
  ov.querySelector('#dok').onclick = ok;
  ov.querySelector('#dno').onclick = () => closeOv(ov);
  inp.addEventListener('keydown', e => { if(e.key === 'Enter') ok(); else if(e.key === 'Escape') closeOv(ov); });
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
  Al:['#c9a0a8',13], Zn:['#8aa0b8',13], Fe:['#c46a3a',13], Cu:['#d98a4a',13], Ag:['#c8ccd4',14], Ba:['#5fbf8f',14], Mn:['#9b6bb0',13],
  Li:['#c3a6e8',12], F:['#c8e07e',10], Br:['#a3402c',13]};          // Li, F, Br: chỉ có ở trò tạo ion (ngày 3 khó)
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
// mô hình bi–que kiểu ngày 4 cho chất không có trong MOL_2D: đơn chất / chất vẽ tay, rồi hợp chất hai nguyên tố hoặc
// axit / bazơ / muối dựng theo hoá trị (thử các hoá trị trong VL_VALS tới khi ra đúng công thức). null: chưa dựng được
function vlModel(f){
  const hand = VL_ELEM[f] || VL_EGG[f] || VL_MOL[f];
  if(hand) return handLayout(hand);
  const els = Object.keys(atomCounts(f));
  for(const A of els) for(const a of VL_VALS[A] || []){
    if(els.length === 2){ const B = els.find(e => e !== A);
      for(const b of VL_VALS[B] || []) if(valFormula(A, a, B, b).f === f) return valLayout(A, a, B, b); }
    for(const R in VL_RAD){ const q = vlQuestion([A, a, R]); if(q.f === f) return vlLayout(q); }
  }
  return null;
}
// toạ độ bi (px, nguyên tử đầu ở gốc) của một chất. MOL_2D hoặc mô hình ngày 4 (vlModel): đi theo cây liên kết, giữ
// hướng que nhưng rút khe hở giữa hai bi còn MOL_GAP (bi sát nhau hơn mà không chồng lên nhau); không dựng được mô
// hình thì để chùm bi molAtoms.
const MOL_GAP = 0.3;
function molGeom(f){
  const m = MOL_2D[f], BL = 34, L = m ? null : vlModel(f);
  if(!m && !L) return {atoms:molAtoms(f).map(a => ({el:a.el, x:a.x, y:a.y, r:atomR(a.el)})), bonds:[]};
  const raw = m ? m.a.map(([el, x, y]) => ({el, x:x*BL, y:y*BL, r:atomR(el)})) : L.nodes.map(n => ({el:n.el, x:n.x, y:n.y, r:atomR(n.el)}));
  const bonds = m ? m.b : L.bonds;
  const atoms = raw.map(a => ({el:a.el, x:0, y:0, r:a.r})), seen = [0];
  for(let k = 0; k < seen.length; k++){
    const i = seen[k];
    bonds.forEach(([p, q]) => {
      const j = p === i ? q : q === i ? p : -1;
      if(j < 0 || seen.includes(j)) return;
      const dx = raw[j].x - raw[i].x, dy = raw[j].y - raw[i].y, d = Math.hypot(dx, dy), rr = raw[i].r + raw[j].r;
      const nd = rr + MOL_GAP*(d - rr);
      atoms[j].x = atoms[i].x + dx/d*nd; atoms[j].y = atoms[i].y + dy/d*nd;
      seen.push(j);
    });
  }
  return {atoms, bonds};
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
// toạ độ px các bi của một chất căn giữa khung W×H (minigame cân bằng dùng để cho bi bay đúng chỗ)
function molPts(f, W, H, maxSc){
  const {atoms, bonds, x0, x1, y0, y1, sc} = molFit(f, W, H, maxSc);
  return {bonds, sc, P:atoms.map(a => ({el:a.el, x:W/2 + (a.x - (x0 + x1)/2)*sc, y:H/2 + (a.y - (y0 + y1)/2)*sc, r:a.r*sc}))};
}
// một chất đứng riêng, căn giữa khung W×H
function molHTML(f, W, H, maxSc){
  const {P, bonds, sc} = molPts(f, W, H, maxSc);
  return molDraw(P, bonds, W, H, sc, true);
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
  ov.querySelector('#rxgo').onclick = () => { timers.forEach(clearTimeout); closeOv(ov); if(opt.onClose) opt.onClose(); };
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
