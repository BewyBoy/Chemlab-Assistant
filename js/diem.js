/* =====================================================================
   ĐIỂM & SAO — luật chấm chung cho mọi lượt chơi: một ca ở bàn thí nghiệm, một minigame, thử thách pha nồng độ.
   Đổi luật thì chỉ sửa file này.

   Một lượt có N phần (đơn hàng / câu / điểm của màn) và làm được k phần — đếm như trước giờ.
     ĐÚNG      100 mỗi phần làm được                                                            → 100·k
     NHANH     mỗi lần làm đúng +0…50 theo phần thời gian còn lại của lần đó: ở bàn thí nghiệm là vòng đồng hồ chờ
               trên phiếu khách; ở minigame là PAT giây cho mỗi câu (đồng hồ đứng khi tạm nghỉ / có thẻ phủ lên màn)
     CHUỖI     mỗi lần làm đúng +10 cho mỗi lần đúng liền ngay trước nó, tối đa +50. Sai một lần — giao sai, lỗi an
               toàn, khách bỏ đi, trả lời sai — là chuỗi về 0. Ở bàn thí nghiệm chế độ thường, lần giao sai ĐẦU TIÊN
               trong ca không tính (không đứt chuỗi, không mất HOÀN HẢO) — xem serve() trong phong-thi-nghiem.js
     HOÀN HẢO  đạt điều kiện 3 sao cũ (giao đủ, không giao sai, không lỗi an toàn / đúng tất cả): +100 mỗi phần,
               bằng đúng NHANH + CHUỖI tối đa của một lần đúng
   Mốc sao — k1, k2: số phần cần cho 1, 2 sao theo luật cũ (s1 đơn và đủ đơn; một nửa và 3/4 số câu):
     ★ 100·k1        ★★ 100·k2        ★★★ 200·N
   · Mỗi phần làm được ≥ 100 điểm, nên đạt luật cũ mấy sao thì điểm cũng đủ mấy sao: không ngày nào khó hơn trước.
   · Làm nhanh, đúng liền thì lên 1–2 sao với ít phần hơn — thời gian và chuỗi đúng là thứ được cộng thêm.
   · Lượt hoàn hảo có sẵn 200·N nên chậm mấy cũng 3 sao. Lượt có lỗi mất HOÀN HẢO, mà NHANH + CHUỖI cả lượt luôn
     dưới 100·N (tối đa N lần đúng, mỗi lần dưới 100 vì lần đầu chưa có chuỗi): nhanh tới đâu cũng không bù được
     một lỗi. khoi-dong.js (#dev) kiểm lại điều này nếu các hằng số bị chỉnh.
   ===================================================================== */
'use strict';

const PTS_OK = 100, PTS_FAST = 50, PTS_STREAK = 10, STREAK_CAP = 5;
const PTS_PERFECT = PTS_FAST + PTS_STREAK*STREAK_CAP;   // = thưởng tối đa của một lần đúng
// PAT: số giây cho một câu ở minigame không có đồng hồ chung (identify: cho mỗi lọ) — xong ngay thì +50, hết PAT
// giây thì +0. Minigame có đồng hồ chung (lập công thức, sơ đồ Lewis, tạo ion) tính như đồng hồ chờ của khách: gấp
// đôi phần chia đều. Số đoán trước khi playtest — chỉnh ở đây.
const PAT = {bins:8, identify:60, redox:15, sort:6, ptable:15, chain:45, balance:60, conc:90};

const starLimits = (n, k1, k2) => [PTS_OK*k1, PTS_OK*k2, (PTS_OK + PTS_PERFECT)*n];
// NHANH + CHUỖI lớn nhất có thể của n lần đúng liền, xong ngay tức thì
const maxBonus = n => Array.from({length:n}, (_, c) => PTS_FAST + PTS_STREAK*Math.min(c, STREAK_CAP)).reduce((a, b) => a + b, 0);

/* Lượt đang chơi: t giây của câu hiện tại (pat = 0: không có đồng hồ, thời gian còn lại truyền thẳng vào runHit),
   chain số lần đúng liền, fast / streak điểm thưởng đã cộng. held(): đồng hồ đang đứng (tạm nghỉ, thẻ phủ). */
let curRun = null;
function runStart(pat, held){
  if(curRun) clearInterval(curRun.iv);
  const r = curRun = {pat:pat || 0, t:0, chain:0, best:0, fast:0, streak:0, iv:0};
  if(r.pat) r.iv = setInterval(() => { if(!held()) r.t += .25; }, 250);
}
const runItem = () => { if(curRun) curRun.t = 0; };                     // câu mới: đồng hồ của câu về 0
const runLeft = () => curRun && curRun.pat ? Math.max(0, 1 - curRun.t/curRun.pat) : 0;
const runStreak = () => curRun ? curRun.chain : 0;
const runMiss = () => { if(curRun) curRun.chain = 0; };
// làm đúng một lần — left: phần thời gian còn lại 0…1 (bỏ trống: theo đồng hồ của câu); units: số phần lần này
// mang về (chuỗi phản ứng, cân bằng: cả câu). Trả về số điểm vừa được, để bay lên HUD
function runHit(left = runLeft(), units = 1){
  if(!curRun) return 0;
  const f = Math.round(PTS_FAST*Math.min(1, Math.max(0, left))), s = PTS_STREAK*Math.min(curRun.chain, STREAK_CAP);
  curRun.fast += f; curRun.streak += s; curRun.best = Math.max(curRun.best, ++curRun.chain); curRun.t = 0;
  return PTS_OK*units + f + s;
}
// chấm cả lượt rồi đóng lượt: n phần, làm được k, k1 / k2 phần cho 1 / 2 sao theo luật cũ, perfect: đạt điều kiện
// 3 sao cũ. Không có lượt nào đang mở thì coi như không có thưởng — sao vẫn đúng như luật cũ
function runScore(n, k, k1, k2, perfect){
  const r = curRun || {fast:0, streak:0, best:0};
  if(curRun){ clearInterval(curRun.iv); curRun = null; }
  const parts = {ok:PTS_OK*k, fast:r.fast, streak:r.streak, perfect:perfect ? PTS_PERFECT*n : 0};
  const pts = parts.ok + parts.fast + parts.streak + parts.perfect, lim = starLimits(n, k1, k2);
  return {pts, parts, lim, top:lim[2] + maxBonus(n), best:r.best, stars:n ? lim.filter(t => pts >= t).length : 0};
}

// chữ bay lên từ một ô trên HUD: "+137" (kèm "chuỗi ×3" khi đang đúng liền), "−1" của mgMinus (che-do.js)
function hudPop(hud, html, cls){
  if(!hud || !hud.isConnected) return;
  const m = document.createElement('div'), g = G.getBoundingClientRect(), r = hud.getBoundingClientRect(), sc = g.width/1280;
  m.className = cls; m.innerHTML = html;
  m.style.left = (r.left + r.width/2 - g.left)/sc + 'px'; m.style.top = (r.bottom - g.top)/sc + 'px';
  G.appendChild(m);
  m.onanimationend = () => m.remove();
}
const runPop = (hud, gain) => { if(gain) hudPop(hud, '+' + gain + (runStreak() >= 2 ? '<small>chuỗi ×' + runStreak() + '</small>' : ''), 'run-plus'); };

// khối điểm trên thẻ kết quả: tổng + kỷ lục, các phần cộng, thanh điểm có ba mốc sao
function scoreHTML(sc, rec, best){
  const p = sc.parts, pct = v => (Math.min(1, v/sc.top)*100).toFixed(1) + '%';
  const bits = [['Đúng', p.ok], ['Nhanh', p.fast], ['Chuỗi', p.streak], ['Hoàn hảo', p.perfect]].filter(([, v], k) => !k || v)
    .map(([t, v], k) => t + ' <b>' + (k ? '+' : '') + v + '</b>').join(' · ');
  return `<div class="rscore"><p><b class="rspts">${sc.pts}</b> điểm · ${rec ? '<b class="rsrec">Kỷ lục mới!</b>' : 'Kỷ lục: <b>' + best + '</b>'}</p>
    <p class="rsparts">${bits}</p>
    <div class="rsbar"><i style="width:${pct(sc.pts)}"></i>${sc.lim.map((t, k) =>
      `<span class="rstick${sc.pts >= t ? ' on' : ''}" style="left:${pct(t)}" title="${k + 1} sao: ${t} điểm">${ico('star', 15)}</span>`).join('')}</div></div>`;
}
