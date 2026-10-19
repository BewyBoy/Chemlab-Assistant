/* =====================================================================
   KHỞI ĐỘNG — tự kiểm tra dữ liệu (mở bằng #dev), gắn kho SVG vào trang, vào menu.
   Phải là file nạp CUỐI CÙNG.
   ===================================================================== */
'use strict';

/* =====================  SELF-CHECK & BOOT  ===================== */
// ponytail: dev-time sanity check — every order must be reachable from that day's shelf
if(DEBUG){
  console.assert(DAYS.length === 31, 'DAYS phải đủ 31 ngày');
  console.assert(LICH.ngay.length === DAYS.length && DAYS.every(d => d.t), 'js/lich.js: cần đúng một mô tả cho mỗi ngày');
  console.assert(BAI_GIANG.length === DAYS.length && BAI_GIANG.every(d => d.length), 'js/bai-giang.js: cần đúng một bài giảng (ít nhất một câu) cho mỗi ngày');
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
  // tạo ion (ngày 3, chế độ khó): nguyên tố nhóm A có bóng, ion ra cấu hình khí hiếm, số chấm sau khi nhường / nhận nằm
  // trong 0–8 (Lewis vẽ tối đa 8 chấm); vẽ đủ các lớp nên tối đa 4 lớp (vòng ngoài cùng vừa khít khu vực) và lớp cuối
  // trong e.sh đúng là số electron lớp ngoài
  DAYS.filter(d => d.mg === 'bins' && d.hard).forEach(d => {
    const H = d.hard;
    console.assert(H.story && H.note && H.time > 0, 'tạo ion: thiếu lời dặn / thời gian chế độ khó');
    H.pools.forEach(([n, list]) => {
      console.assert(n <= list.length, 'tạo ion: bốc '+n+' câu từ nhóm chỉ có '+list.length);
      list.forEach(s => { const e = PT_BY[s], I = e && ptIon(e), k = e && ptOuter(e) - I.q;
        console.assert(e && ATOM_STYLE[s] && ptMain(e) && e.k !== 'g' && I.gas && k >= 0 && k <= 8, 'tạo ion: '+s+' thiếu dữ liệu / không ra ion bền');
        console.assert(e && e.sh.length <= 4 && e.sh[e.sh.length - 1] === ptOuter(e), 'tạo ion: '+s+' quá 4 lớp / lớp ngoài lệch'); });
    });
  });
  // lập công thức theo hoá trị: mô hình đáp án (và easter egg) dựng được, mỗi bóng đúng số tay theo hoá trị dùng trong
  // câu, đủ bóng theo công thức, không hai bóng nào sát tới mức sticker dính vào nhau; hoá trị tô đậm phải có trong bảng
  const vlCheck = (f, lay, vals, over) => {          // over: số tay của nút ngoại lệ (chất bí mật)
    console.assert(lay, 'hoá trị: chưa có kiểu xếp cho '+f);
    if(!lay) return;
    const arms = lay.nodes.map(() => 0), cnt = {}, want = atomCounts(f);
    lay.bonds.forEach(([p, q, o]) => { arms[p] += o; arms[q] += o; });
    (lay.free || []).forEach(([p]) => arms[p]++);
    lay.nodes.forEach((nd, k) => { cnt[nd.el] = (cnt[nd.el]||0) + 1;
      const need = over && over[k] !== undefined ? over[k] : vals[nd.el];
      console.assert(arms[k] === need, 'hoá trị '+f+': '+nd.el+' #'+k+' có '+arms[k]+' tay, cần '+need); });
    console.assert(same(cnt, want), 'hoá trị '+f+': số bóng lệch công thức');
    lay.nodes.forEach((p, s) => lay.nodes.forEach((q, t) => { if(t > s)
      console.assert(Math.hypot(p.x - q.x, p.y - q.y) >= atomR(p.el) + atomR(q.el) + 2*STICKER, 'hoá trị '+f+': bóng #'+s+' và #'+t+' quá sát'); }));
  };
  const same = (a, b) => Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(e => a[e] === b[e]);
  const vlAll = [];
  // sổ chất của chơi tự do = mọi câu trong pools + freeExtra (vlBook), nên kiểm tra luôn cả những chất thêm
  DAYS.filter(d => d.mg === 'valence').forEach(d => {
    d.pools.forEach(([n, list]) => console.assert(n <= list.length, 'hoá trị: bốc '+n+' câu từ nhóm chỉ có '+list.length));
    vlBook(d).forEach(q => {
      console.assert(!vlAll.some(c => same(c, atomCounts(q.f))), 'sổ chất: '+q.f+' trùng số nguyên tử với chất khác');
      vlAll.push(atomCounts(q.f));
      console.assert(Object.values(atomCounts(q.f)).reduce((s, n) => s + n, 0) <= VL_MAX, 'sổ chất: '+q.f+' cần nhiều bóng hơn bàn chứa được');
      console.assert(q.name && Object.keys(q.vals).every(e => EL_VN[e] && ATOM_STYLE[e] && (VL_VALS[e]||[]).includes(q.vals[e])), 'hoá trị: thiếu dữ liệu cho '+q.f);
      vlCheck(q.f, vlLayout(q), q.vals);
    });
    // chế độ khó (sơ đồ Lewis): đủ dữ liệu từng nguyên tố, công thức tối giản; có kim loại thì số electron kim loại nhường
    // khớp số electron phi kim cần nhận, toàn phi kim thì số electron còn thiếu chẵn (mỗi cặp dùng chung bù 2) và đủ nối
    // mọi bóng thành một cụm
    const H = d.hard;
    console.assert(H && H.story && H.note && H.time > 0, 'sơ đồ Lewis: thiếu lời dặn / thời gian chế độ khó');
    H.pools.forEach(([n, list]) => {
      console.assert(n <= list.length, 'sơ đồ Lewis: bốc '+n+' câu từ nhóm chỉ có '+list.length);
      list.forEach(([f, name]) => {
        const c = atomCounts(f), els = Object.keys(c), tot = els.reduce((s, e) => s + c[e], 0);
        console.assert(name && tot <= VL_MAX && els.every(e => LW_E[e] && EL_VN[e] && ATOM_STYLE[e]), 'sơ đồ Lewis: thiếu dữ liệu cho '+f);
        console.assert(els.length === 1 || els.reduce((g, e) => gcd(g, c[e]), 0) === 1, 'sơ đồ Lewis: '+f+' chưa tối giản');
        const give = els.filter(e => LW_METAL.includes(e)).reduce((s, e) => s + c[e]*LW_E[e], 0);
        const need = els.filter(e => !LW_METAL.includes(e)).reduce((s, e) => s + c[e]*(lwNeed(e) - LW_E[e]), 0);
        console.assert(give ? give === need : need % 2 === 0 && need >= 2*(tot - 1), 'sơ đồ Lewis: '+f+' không ghép đủ electron được');
      });
    });
  });
  // gốc: số tay mỗi X = 2·(O đôi) + (O–H) + (O neo của X đó) + (O cầu nối); chất vẽ tay (hữu cơ tới 2 C) cũng phải đúng hoá trị
  Object.keys(VL_RAD).forEach(R => { const rd = VL_RAD[R];
    if(rd.X) console.assert(2*rd.dbl + (rd.oh||0) + (rd.bridge ? rd.v/2 + 1 : rd.v) === rd.xv && VL_VALS[rd.X].includes(rd.xv), 'gốc '+R+': số tay của '+rd.X+' lệch hoá trị'); });
  const BASE = {H:1, O:2, C:4, N:3, S:6, Na:1, Ca:2};
  Object.keys(VL_MOL).forEach(f => {
    console.assert(!vlAll.some(c => same(c, atomCounts(f))) && (atomCounts(f).C || 0) <= 2, 'chất vẽ tay '+f+' trùng sổ chất hoặc quá 2 C');
    vlAll.push(atomCounts(f));
    vlCheck(f, handLayout(VL_MOL[f]), BASE, VL_MOL[f].v);
  });
  Object.keys(VL_EGG).forEach(f => {
    console.assert(!vlAll.some(c => same(c, atomCounts(f))), 'chất bí mật '+f+' trùng số nguyên tử với một chất trong sổ');
    vlAll.push(atomCounts(f));                       // hai chất bí mật cũng không được trùng nhau
    vlCheck(f, eggLayout(f), BASE, VL_EGG[f].v);
  });
  // đơn chất (chỉ khám phá): đúng số tay, không trùng chất nào; chất không tồn tại (VL_GONE) cũng không được trùng chất có thật
  Object.keys(VL_ELEM).forEach(f => {
    const el = Object.keys(atomCounts(f))[0];
    console.assert(Object.keys(atomCounts(f)).length === 1 && !vlAll.some(c => same(c, atomCounts(f))), 'đơn chất '+f+' trùng chất khác hoặc không phải một nguyên tố');
    vlAll.push(atomCounts(f));
    vlCheck(f, handLayout(VL_ELEM[f]), {[el]:VL_ELEM[f].arms});
  });
  Object.keys(VL_GONE).forEach(f => console.assert(!vlAll.some(c => same(c, atomCounts(f))), 'chất không tồn tại '+f+' lại trùng một chất có thật'));
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
  // chuỗi phản ứng: đáp án đi tới đích theo REACTIONS; bố cục và vùng thả (cs0–cs2) chỉ đủ cho 2–3 mũi tên
  DAYS.filter(d => d.mg === 'chain').forEach(d => d.chains.forEach(ch => {
    const tag = 'chuỗi ' + ch.start + ' → ' + ch.target;
    [ch.start, ch.target].concat(ch.ans, ch.more).forEach(f => console.assert(CHEMS[f], tag + ': chất lạ ' + f));
    console.assert(ch.ans.length >= 2 && ch.ans.length <= 3, tag + ': cần 2–3 mũi tên');
    console.assert(chainWalk(ch.start, ch.ans, ch.target), tag + ': đáp án không đi tới đích');
  }));
  // cân bằng phương trình: mỗi đề khớp đúng MỘT phản ứng, hệ số không quá BAL_BIG (đáp án vẽ đủ từng phân tử, không phải
  // ghi "n ×") và đã tối giản,
  // mỗi nhóm đủ đề để bốc
  DAYS.filter(d => d.mg === 'balance').forEach(d => d.pools.forEach(([n, list]) => {
    console.assert(list.length >= n, 'cân bằng: nhóm đề ít hơn ' + n + ' câu');
    list.forEach(s => {
      const m = balRxs(s);
      console.assert(m.length === 1, 'cân bằng: "' + s + '" khớp ' + m.length + ' phản ứng');
      if(!m.length) return;
      const k = Object.values(m[0].rg).concat(Object.values(m[0].pr));
      console.assert(Math.max(...k) <= BAL_BIG && k.reduce(gcd) === 1, 'cân bằng: hệ số của "' + s + '" quá lớn / chưa tối giản');
      // mọi chất đều vẽ được bi–que (MOL_2D hoặc mô hình ngày 4), đủ nguyên tử theo công thức, bi không chồng nhau
      Object.keys(m[0].rg).concat(Object.keys(m[0].pr)).forEach(f => {
        const g = molGeom(f), want = atomCounts(f), n = {};
        g.atoms.forEach(a => n[a.el] = (n[a.el] || 0) + 1);
        console.assert(MOL_2D[f] || vlModel(f), 'cân bằng: chưa có mô hình bi–que cho ' + f);
        console.assert(Object.keys(want).every(e => want[e] === n[e]) && g.atoms.length === Object.values(want).reduce((a, b) => a + b),
          'cân bằng: mô hình ' + f + ' lệch số nguyên tử');
        g.atoms.forEach((p, a) => g.atoms.forEach((q, b) => { if(b > a)
          console.assert(Math.hypot(p.x - q.x, p.y - q.y) >= p.r + q.r - .01, 'cân bằng: mô hình ' + f + ' có bi chồng nhau'); }));
      });
    });
  }));
  // bảng tuần hoàn: đủ 118 số hiệu (90 ô vì hai họ gộp), không trùng ô, nguyên tử khối khớp ATOM; đề sinh ra luôn có đáp
  // án, phương án không trùng nhau, ô được tô khi giải đều có thật
  console.assert(PT.length === 90 && Object.keys(PT_Z).length === 88 && PT_Z[118].s === 'Og', 'bảng tuần hoàn: lệch số hiệu');
  console.assert(new Set(PT.map(e => e.p + '-' + e.c)).size === PT.length, 'bảng tuần hoàn: hai ô trùng chỗ');
  Object.keys(ATOM).forEach(e => console.assert(PT_BY[e] && PT_BY[e].m === ATOM[e], 'bảng tuần hoàn: nguyên tử khối ' + e + ' lệch ATOM'));
  Object.keys(PT_RAD).forEach(e => console.assert(PT_BY[e] && ptMain(PT_BY[e]) && PT_BY[e].k !== 'g', 'PT_RAD: ' + e + ' không phải nhóm A / là khí hiếm'));
  // lớp electron: tổng = Z; nhóm A có số lớp = chu kì và lớp ngoài = số thứ tự nhóm (He: 2); nhóm B cũng số lớp = chu kì
  // trừ Pd (4 lớp ở chu kì 5). Độ âm điện: khí hiếm không ghi, mọi nguyên tố khác tới Z = 88 đều có
  PT.filter(e => !e.fam).forEach(e => {
    console.assert(e.sh.reduce((a, n) => a + n, 0) === e.z && e.sh.every(n => n > 0), 'lớp electron ' + e.s + ': tổng lệch Z');
    console.assert(e.sh.length === e.p || e.s === 'Pd', 'lớp electron ' + e.s + ': số lớp khác chu kì');
    if(ptMain(e) && e.z <= 88) console.assert(e.sh[e.sh.length - 1] === (e.s === 'He' ? 2 : ptOuter(e)), 'lớp electron ' + e.s + ': lớp ngoài lệch nhóm');
    console.assert(e.k === 'g' ? e.en === null : (e.en !== null) === (e.z <= 88), 'độ âm điện ' + e.s + ': thiếu / thừa');
    // cấu hình: tổng số mũ = Z, không phân lớp nào quá sức chứa (s 2, p 6, d 10, f 14), xếp theo lớp; phần viết gọn [Ar]…
    // phải là nguyên cấu hình của khí hiếm đó nằm trong cấu hình nguyên tố
    console.assert(e.cfg.reduce((a, x) => a + x[2], 0) === e.z && e.cfg.every(([n, l, k]) => l < n && k > 0 && k <= 4*l + 2)
      && e.cfg.every((x, j) => !j || e.cfg[j - 1][0] < x[0] || e.cfg[j - 1][1] < x[1]), 'cấu hình electron ' + e.s + ': sai');
    const core = PT_CORE[e.p] && PT_BY[PT_CORE[e.p]];
    if(core) console.assert(core.cfg.every(c => e.cfg.some(x => x[0] === c[0] && x[1] === c[1] && x[2] === c[2])), 'cấu hình electron ' + e.s + ': không chứa [' + core.s + ']');
  });
  console.assert(ptCfgHTML(PT_BY.O) === '1s<sup>2</sup> 2s<sup>2</sup> 2p<sup>4</sup>' && ptCfgHTML(PT_BY.Na) === '[Ne] 3s<sup>1</sup>'
    && ptCfgHTML(PT_BY.Fe) === '[Ar] 3d<sup>6</sup> 4s<sup>2</sup>'
    && ptCfgHTML(PT_BY.Cu) === '[Ar] 3d<sup>10</sup> 4s<sup>1</sup>' && ptCfgHTML(PT_BY.Pd) === '[Kr] 4d<sup>10</sup>', 'cấu hình electron: O / Na / Fe / Cu / Pd viết sai');
  // độ âm điện lớn nhất / nhỏ nhất (enMax) đúng như lời giải: chu kì 2–5 lớn nhất ở nhóm VIIA, nhỏ nhất ở IA; nhóm A lớn nhất ở trên cùng
  [2, 3, 4, 5].forEach(p => { const L = PT.filter(x => x.en && x.p === p).sort((a, b) => b.en - a.en);
    console.assert(L[0].c === 17 && L[L.length - 1].c === 1 && L[0].en > L[1].en && L[L.length - 2].en > L[L.length - 1].en, 'độ âm điện chu kì ' + p + ': lệch quy luật'); });
  [1, 2, 13, 14, 15, 16, 17].forEach(c => { const L = PT.filter(x => x.en && x.c === c).sort((a, b) => b.en - a.en);
    console.assert(L[0].p === Math.min(...L.map(x => x.p)) && L[0].en > L[1].en, 'độ âm điện nhóm ' + PT_GROUP[c - 1] + ': lệch quy luật'); });
  DAYS.filter(d => d.mg === 'ptable').forEach(d => {
    const H = Object.assign({}, d, d.hard);
    console.assert(d.hard && d.hard.story && d.hard.note, 'bảng tuần hoàn: thiếu lời dặn chế độ khó');
    H.neutron.forEach(s => console.assert(PT_BY[s] && Number.isInteger(PT_BY[s].m), 'neutron: nguyên tử khối ' + s + ' không nguyên'));
    H.ion.forEach(s => { const e = PT_BY[s];
      console.assert(e && ptMain(e) && e.k !== 'g' && ptIon(e).gas, 'ion: ' + s + ' không ra cấu hình khí hiếm'); });
    const B = ptBonds(H);
    B.forEach(b => console.assert(b.els.length <= 2 && b.els.every(s => PT_BY[s].en)
      && Math.abs(b.d - .4) >= .05 && Math.abs(b.d - 1.7) >= .05, 'liên kết ' + b.f + ': không đủ số liệu hoặc Δχ sát ngưỡng'));
    [0, 1, 2].forEach(c => console.assert(B.some(b => b.cls === c), 'liên kết: thiếu loại ' + c));
    d.pool.forEach(s => console.assert(PT_BY[s] && typeof PT_BY[s].m === 'number', 'bảng tuần hoàn: nguyên tố lạ trong pool ' + s));
    d.mr.forEach(f => console.assert(Object.keys(atomCounts(f)).every(e => ATOM[e]), 'phân tử khối: thiếu nguyên tử khối cho ' + f));
    d.rounds.concat(H.rounds).forEach(([n, kinds]) => kinds.forEach(k => console.assert(PT_Q[k], 'bảng tuần hoàn: chưa có dạng câu ' + k)));
    for(let t = 0; t < 300; t++) ptQuiz(t % 2 ? H : d).forEach(q => {
      const tag = 'bảng tuần hoàn (' + q.kind + '): ';
      if(q.pick) console.assert(q.pick.length && q.pick.every(s => PT_BY[s]), tag + 'câu chọn ô không có đáp án');
      else {
        console.assert(q.opts.length >= 2 && q.opts[q.ans], tag + 'thiếu phương án / đáp án — ' + q.q);
        console.assert(new Set(q.opts.map(o => o.t)).size === q.opts.length, tag + 'trùng phương án — ' + q.q);
      }
      console.assert(q.why && q.show.every(s => PT_BY[s]), tag + 'thiếu lời giải / ô tô sai');
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
