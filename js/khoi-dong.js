/* =====================================================================
   KHỞI ĐỘNG — tự kiểm tra dữ liệu (mở bằng #dev), gắn kho SVG vào trang, vào menu.
   Phải là file nạp CUỐI CÙNG.
   ===================================================================== */
'use strict';

/* =====================  SELF-CHECK & BOOT  ===================== */
// ponytail: dev-time sanity check — every order must be reachable from that day's shelf
if(DEBUG){
  console.assert(DAYS.length === 31, 'DAYS phải đủ 31 ngày');
  DAYS.forEach((day, i) => {
    if(day.mg) return;
    const have = new Set(day.chems);          // bao đóng: pha ra được gì từ kệ của ngày đó
    for(let grew = true; grew;){ grew = false;
      for(const r of REACTIONS)
        if(Object.keys(r.rg).every(f => have.has(f)))
          Object.keys(r.pr).forEach(f => { if(!have.has(f)){ have.add(f); grew = true; } });
    }
    // bao đóng KHÔNG tính phản ứng cháy: đơn nào chỉ ra được bằng đốt thì ngày đó phải có muôi + lọ khí
    const noBurn = new Set(day.chems);
    for(let grew = true; grew;){ grew = false;
      for(const r of REACTIONS)
        if(!r.burn && Object.keys(r.rg).every(f => noBurn.has(f)))
          Object.keys(r.pr).forEach(f => { if(!noBurn.has(f)){ noBurn.add(f); grew = true; } });
    }
    day.orders.forEach(od => {
      console.assert(CHEMS[od.chem], 'Ngày '+(i+1)+': chất lạ '+od.chem);
      console.assert(have.has(od.chem), 'Ngày '+(i+1)+': đơn '+od.chem+' KHÔNG điều chế được!');
      const br = burnRoute(day, od);
      if(!noBurn.has(od.chem)) console.assert(day.tools.includes('burn') && day.tools.includes('gas'), 'Ngày '+(i+1)+': '+od.chem+' chỉ ra được bằng đốt — cần muôi đốt + lọ khí');
      if(CHEMS[od.chem] && CHEMS[od.chem].s === 'k') console.assert(day.tools.includes('gas'), 'Ngày '+(i+1)+': cần bình thu khí cho '+od.chem);
      if(CHEMS[od.chem] && isPrecip(od.chem) && !br) console.assert(day.tools.includes('filter'), 'Ngày '+(i+1)+': cần phễu lọc cho '+od.chem);
    });
  });
  console.assert(REACTIONS.length === 167 && RX_GROUPS.length === RX_NOTES.length, 'sổ tay: số phản ứng / ghi chú nhóm lệch');
  REACTIONS.forEach((r,k) => {   // thẻ phản ứng ghép bi theo nguyên tố — phương trình nào lệch là lộ ngay
    const side = o => { const c = {}; Object.keys(o).forEach(f => { const a = atomCounts(f); Object.keys(a).forEach(e => c[e] = (c[e]||0) + a[e]*o[f]); }); return c; };
    const L = side(r.rg), R = side(r.pr);
    console.assert(Object.keys(L).concat(Object.keys(R)).every(e => L[e] === R[e]), 'Phản ứng #'+k+' chưa cân bằng: '+eqStr(r));
    Object.keys(L).forEach(e => console.assert(ATOM_STYLE[e] && ATOM[e], 'thiếu màu bi / nguyên tử khối cho '+e));
  });
  REACTIONS.forEach((r,k) => {
    Object.keys(r.rg).concat(Object.keys(r.pr)).forEach(f => console.assert(CHEMS[f], 'Phản ứng #'+k+': chất lạ '+f));
  });
  // mô hình bi–que của minigame phân loại: đủ nguyên tử theo công thức, mỗi nguyên tử đúng số "tay" (hoá trị)
  const VAL = {H:1, O:2, Na:1, K:1, Cl:1, Ca:2, Cu:2, Fe:3, C:4};
  Object.keys(MOL_2D).forEach(f => {
    const m = MOL_2D[f], cnt = {}, arms = m.a.map(() => 0), want = atomCounts(f);
    m.a.forEach(([e]) => cnt[e] = (cnt[e]||0) + 1);
    m.b.forEach(([i, j, o]) => { arms[i] += o||1; arms[j] += o||1; });
    console.assert(Object.keys(want).length === Object.keys(cnt).length && Object.keys(want).every(e => want[e] === cnt[e]), 'MOL_2D '+f+': số nguyên tử lệch công thức');
    m.a.forEach(([e], k) => { const v = m.v && m.v[k] !== undefined ? m.v[k] : VAL[e];
      console.assert(v === undefined || arms[k] === v, 'MOL_2D '+f+': '+e+' #'+k+' có '+arms[k]+' tay, cần '+v); });
    const g = molGeom(f);                    // rút khe hở MOL_GAP xong, không hai bi nào được chồng lên nhau
    g.atoms.forEach((p, a) => g.atoms.forEach((q, b) => { if(b > a)
      console.assert(Math.hypot(p.x - q.x, p.y - q.y) >= p.r + q.r - .01, 'MOL_2D '+f+': bi #'+a+' và #'+b+' chồng nhau'); }));
  });
  DAYS.filter(d => d.mg === 'bins').forEach(d => d.items.forEach(([f]) =>
    console.assert(MOL_2D[f] || molAtoms(f).length === 1, 'minigame phân loại: thiếu mô hình bi–que cho '+f)));
  // xác định chất: mỗi bộ 3 lọ phải phân biệt được — hai mẫu khác nhau thì khác ít nhất một ô trong sổ ghi chép
  DAYS.filter(d => d.mg === 'identify').forEach(d => {
    const st = ['quy'].concat(d.reagents);
    d.reagents.forEach(r => console.assert(TESTS[r], 'xác định chất: chưa có thuốc thử '+r+' trong TESTS'));
    d.sets.forEach(set => {
      set.forEach(f => console.assert(CHEMS[f] && TESTS.quy.on[f], 'xác định chất: '+f+' thiếu trong CHEMS hoặc chưa có dòng quỳ'));
      const sig = set.map(f => st.map(r => TESTS[r] ? testOf(r, f).t : '').join('|'));
      console.assert(new Set(sig).size === set.length, 'xác định chất: bộ '+set.join(', ')+' không phân biệt được');
    });
  });
  // hard mode: molar mass parser + tolerance + generated challenges are self-consistent
  console.assert(molarMass('NaCl') === 58.5, 'Mr NaCl');
  console.assert(molarMass('Ca(OH)2') === 74, 'Mr Ca(OH)2');
  console.assert(molarMass('CuSO4') === 160, 'Mr CuSO4');
  console.assert(molarMass('C12H22O11') === 342, 'Mr saccarozơ');
  console.assert(molarMass('Cu(NO3)2') === 188, 'Mr Cu(NO3)2 (dấu ngoặc)');
  console.assert(within(104.9,100) && !within(106,100), 'ngưỡng 5%');
  for(let t=0; t<300; t++){
    const c = makeChallenge();
    console.assert(c, 'makeChallenge trả null');
    if(!c) continue;
    const total = c.totalMode === 'b' ? c.bTarget : c.aTarget + c.bTarget;
    // đáp án đúng phải qua; lệch 6% ở một số liệu phải trượt
    console.assert(within(c.aTarget,c.aTarget) && within(total,c.totalTarget), 'đáp án đúng lại trượt');
    console.assert(!within(c.aTarget*1.06, c.aTarget), '+6% vẫn qua?!');
    console.assert(c.aTarget<=c.aMax && c.bTarget<=c.bMax, 'mục tiêu vượt thang trượt');
    console.assert(Math.abs(c.reveal(c.aTarget,c.bTarget) - c.targetC) < c.targetC*0.02, 'nồng độ đạt ≠ yêu cầu');
  }
}
/* Dev mode lúc chạy: gõ "benben1304" để bật, nhấn Esc 3 lần liên tiếp để tắt. */
function setDev(on){
  if(DEBUG === on) return;
  DEBUG = on;
  if(G.querySelector('.calsheet')) showMap();   // đang ở lịch thì vẽ lại cho mở/khoá ngày; không đụng ca đang chơi
  else if(G.querySelector('.menu, #bplay')) showMenu();
}
(function(){
  const CODE = 'benben1304';
  let typed = '', escs = 0;
  addEventListener('keydown', e => {
    if(e.key === 'Escape'){ if(DEBUG && ++escs >= 3){ escs = 0; setDev(false); } return; }
    escs = 0;                                     // phím khác chen vào thì đếm Esc lại từ đầu
    if(e.key.length !== 1 || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    typed = (typed + e.key.toLowerCase()).slice(-CODE.length);
    if(typed === CODE){ typed = ''; setDev(true); }
  });
})();
document.body.insertAdjacentHTML('afterbegin',
  '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + SVG_DEFS + '</defs></svg>');
fit();
showMenu();
