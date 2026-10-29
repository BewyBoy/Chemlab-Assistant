/* =====================================================================
   DỮ LIỆU — hoá chất (CHEMS), khách, 31 ngày (DAYS), thành tựu, "Bạn có biết?",
   cùng mấy hàm định dạng dùng khắp nơi (sub, amt, eqStr). Nạp sau loi-thoai.js, nhan-vat.js, phan-ung.js.
   ===================================================================== */
'use strict';

// Dev mode TẮT mặc định (kể cả khi mở bằng file:// hay localhost) — bản đóng gói phải
// khoá ngày đúng như người chơi thật thấy. Cần mở lại thì thêm #dev vào cuối URL.
let DEBUG = location.hash === '#dev';   // khoi-dong.js bật/tắt được bằng mật khẩu benben1304 / Esc ×3

/* =====================  DATA  ===================== */
// state s: r=rắn, l=lỏng, k=khí, d=dung dịch. sol: soluble (stays in solution).
// a: acid (quỳ đỏ), b: base (quỳ xanh). c: display color.
// slb: độ tan thực tế (g/100g nước, ~20°C) cho chất rắn tan — chỉ để so với NaCl xem có cần khuấy không (xem SLOW_DISSOLVE).
const CHEMS = {
 'H2O':      {n:'Nước',                          s:'l', c:'#cfe6f2', sol:1},
 'NaCl':     {n:'Muối ăn (natri clorua)',        s:'r', c:'#f4f2ec', sol:1, slb:36},
 'C12H22O11':{n:'Đường (saccarozơ)',             s:'r', c:'#f7ead2', sol:1, slb:204},
 'HCl':      {n:'Axit clohiđric',                s:'d', c:'#e9f2d8', sol:1, a:1},
 'H2SO4':    {n:'Axit sunfuric',                 s:'d', c:'#f0ecd2', sol:1, a:1},
 'HNO3':     {n:'Axit nitric',                   s:'d', c:'#f0ecd2', sol:1, a:1},
 'H3PO4':    {n:'Axit photphoric',               s:'d', c:'#f0ecd2', sol:1, a:1},
 'NaOH':     {n:'Natri hiđroxit (xút)',          s:'d', c:'#ddeef4', sol:1, b:1},
 'KOH':      {n:'Kali hiđroxit',                 s:'d', c:'#ddeef4', sol:1, b:1},
 'Ca(OH)2':  {n:'Canxi hiđroxit (nước vôi trong)',s:'d',c:'#e6f0ea', sol:1, b:1},
 'Na':       {n:'Natri (kim loại)',              s:'r', c:'#d8d8cc'},
 'K':        {n:'Kali (kim loại)',               s:'r', c:'#d8d8cc'},
 'Mg':       {n:'Magie',                         s:'r', c:'#ccd2d8'},
 'Al':       {n:'Nhôm',                          s:'r', c:'#ccd2d8'},
 'Zn':       {n:'Kẽm',                           s:'r', c:'#aab1b8'},
 'Fe':       {n:'Sắt',                           s:'r', c:'#8a8d90'},
 'Cu':       {n:'Đồng',                          s:'r', c:'#c96f33'},
 'Ag':       {n:'Bạc',                           s:'r', c:'#d5d9de'},
 'S':        {n:'Lưu huỳnh',                     s:'r', c:'#e8d44d'},
 'P':        {n:'Photpho đỏ',                    s:'r', c:'#c0574a'},
 'C':        {n:'Cacbon (than)',                 s:'r', c:'#3a3a3a'},
 'O2':       {n:'Khí oxi',                       s:'k', c:'#dbeefc'},
 'H2':       {n:'Khí hiđro',                     s:'k', c:'#eef6fb'},
 'CO2':      {n:'Khí cacbonic',                  s:'k', c:'#e3e8ec'},
 'SO2':      {n:'Khí sunfurơ',                   s:'k', c:'#eae4d0'},
 'KCl':      {n:'Kali clorua',                   s:'r', c:'#f4f2ec', sol:1, slb:34},
 'CaCl2':    {n:'Canxi clorua',                  s:'r', c:'#f4f2ec', sol:1, slb:74},
 'MgCl2':    {n:'Magie clorua',                  s:'r', c:'#f4f2ec', sol:1, slb:54},
 'AlCl3':    {n:'Nhôm clorua',                   s:'r', c:'#f4f2ec', sol:1, slb:46},
 'ZnCl2':    {n:'Kẽm clorua',                    s:'r', c:'#f4f2ec', sol:1, slb:432},
 'FeCl2':    {n:'Sắt(II) clorua',                s:'r', c:'#bcd6b4', sol:1, slb:64},
 'FeCl3':    {n:'Sắt(III) clorua',               s:'r', c:'#d19a4f', sol:1, slb:92},
 'CuCl2':    {n:'Đồng(II) clorua',               s:'r', c:'#7fc4c9', sol:1, slb:76},
 'BaCl2':    {n:'Bari clorua',                   s:'r', c:'#f4f2ec', sol:1, slb:35.7},
 'Na2SO4':   {n:'Natri sunfat',                  s:'r', c:'#f4f2ec', sol:1, slb:19.5},
 'K2SO4':    {n:'Kali sunfat',                   s:'r', c:'#f4f2ec', sol:1, slb:12},
 'MgSO4':    {n:'Magie sunfat',                  s:'r', c:'#f4f2ec', sol:1, slb:35.5},
 'ZnSO4':    {n:'Kẽm sunfat',                    s:'r', c:'#f4f2ec', sol:1, slb:54},
 'FeSO4':    {n:'Sắt(II) sunfat',                s:'r', c:'#bcd6b4', sol:1, slb:26.5},
 'CuSO4':    {n:'Đồng(II) sunfat',               s:'r', c:'#5b9bd5', sol:1, slb:32},
 'BaSO4':    {n:'Bari sunfat (kết tủa trắng)',   s:'r', c:'#f7f7f0'},
 'NaNO3':    {n:'Natri nitrat',                  s:'r', c:'#f4f2ec', sol:1, slb:88},
 'AgNO3':    {n:'Bạc nitrat',                    s:'r', c:'#f4f2ec', sol:1, slb:122},
 'Cu(NO3)2': {n:'Đồng(II) nitrat',               s:'r', c:'#6aaede', sol:1, slb:138},
 'AgCl':     {n:'Bạc clorua (kết tủa trắng)',    s:'r', c:'#f5f4ee'},
 'Na2CO3':   {n:'Natri cacbonat (sô-đa)',        s:'r', c:'#f4f2ec', sol:1, slb:21.5},
 'NaHCO3':   {n:'Natri hiđrocacbonat',           s:'r', c:'#f4f2ec', sol:1, slb:9.6},
 'CaCO3':    {n:'Canxi cacbonat (đá vôi)',       s:'r', c:'#efece3'},
 'BaCO3':    {n:'Bari cacbonat (kết tủa trắng)', s:'r', c:'#f7f7f0'},
 'MgO':      {n:'Magie oxit',                    s:'r', c:'#f2f0ea'},
 'CuO':      {n:'Đồng(II) oxit (đen)',           s:'r', c:'#33322f'},
 'ZnO':      {n:'Kẽm oxit',                      s:'r', c:'#f2f0ea'},
 'Fe2O3':    {n:'Sắt(III) oxit (đỏ nâu)',        s:'r', c:'#b5502a'},
 'Fe3O4':    {n:'Oxit sắt từ (đen)',             s:'r', c:'#2f2f38'},
 'CaO':      {n:'Canxi oxit (vôi sống)',         s:'r', c:'#f2f0ea'},
 'Na2O':     {n:'Natri oxit',                    s:'r', c:'#f2f0ea'},
 'P2O5':     {n:'Điphotpho pentaoxit',           s:'r', c:'#f5f5ee'},
 'Cu(OH)2':  {n:'Đồng(II) hiđroxit (xanh lam)',  s:'r', c:'#4f9fd8'},
 'Fe(OH)3':  {n:'Sắt(III) hiđroxit (nâu đỏ)',    s:'r', c:'#a34e26'},
 'Fe(OH)2':  {n:'Sắt(II) hiđroxit (trắng xanh)', s:'r', c:'#9fb8a8'},
 // chương 4-5: halogen, nitơ, thuốc tím
 'Cl2':      {n:'Khí clo (vàng lục, độc)',       s:'k', c:'#c3d465'},
 'N2':       {n:'Khí nitơ (trơ)',                s:'k', c:'#e8edf2'},
 'NH3':      {n:'Khí amoniac (mùi khai)',        s:'k', c:'#dfe8d8', b:1},
 'NH4Cl':    {n:'Amoni clorua',                  s:'r', c:'#f6f4ee', sol:1, slb:37},
 'KMnO4':    {n:'Kali pemanganat (thuốc tím)',   s:'r', c:'#7d2b8b', sol:1, slb:6.4},
 'K2MnO4':   {n:'Kali manganat (xanh lục)',      s:'r', c:'#2f6b4f', sol:1, slb:20},
 'MnO2':     {n:'Mangan đioxit (đen)',           s:'r', c:'#2b2b2b'},
 // chất mới, sinh ra từ các phản ứng bổ sung trong phan-ung.js
 'MnCl2':    {n:'Mangan(II) clorua',             s:'r', c:'#f6ece8', sol:1, slb:72},
 'K2O':      {n:'Kali oxit',                     s:'r', c:'#f2f0ea'},
 'K2CO3':    {n:'Kali cacbonat',                 s:'r', c:'#f4f2ec', sol:1, slb:112},
 'KNO3':     {n:'Kali nitrat (diêm tiêu)',       s:'r', c:'#f4f2ec', sol:1, slb:31.6},
 'Na2SO3':   {n:'Natri sunfit',                  s:'r', c:'#f4f2ec', sol:1, slb:27},
 'Na3PO4':   {n:'Natri photphat',                s:'r', c:'#f4f2ec', sol:1, slb:12},
 'CaSO4':    {n:'Canxi sunfat (thạch cao)',      s:'r', c:'#f7f7f0'},
 'Al2O3':    {n:'Nhôm oxit',                     s:'r', c:'#f2f0ea'},
 'Al(OH)3':  {n:'Nhôm hiđroxit (keo trắng)',     s:'r', c:'#f0f0ea'},
 'Al2(SO4)3':{n:'Nhôm sunfat',                   s:'r', c:'#f4f2ec', sol:1, slb:36},
 'Mg(OH)2':  {n:'Magie hiđroxit (trắng)',        s:'r', c:'#f2f2ec'},
 'Fe2(SO4)3':{n:'Sắt(III) sunfat',               s:'r', c:'#d9a86a', sol:1, slb:44},
 'Zn(OH)2':  {n:'Kẽm hiđroxit (trắng)',          s:'r', c:'#f2f2ec'}
};
const isPrecip = f => { const c = CHEMS[f]; return c.s === 'r' && !c.sol; };
// solids less soluble than NaCl (36 g/100g nước) need stirring with the glass rod to dissolve
const SLOW_DISSOLVE = Object.keys(CHEMS).filter(f => CHEMS[f].s === 'r' && CHEMS[f].sol);

/* ---- reactions: rg = reagents (mol ratio), pr = products, heat = needs đèn cồn, exo = toả nhiệt ---- */
/* Bảng phản ứng nằm ở phan-ung.js (nạp ngay trên) — sửa hoá học thì sửa file đó. */

/* ---- formatting helpers ---- */
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
const sub = f => f.replace(/([A-Za-z)])(\d+)/g, (m,ch,d) => ch + [...d].map(x=>SUBS[+x]).join(''));
const amt = n => (+(n/10).toFixed(3)).toString().replace('.',',') + ' mol'; // doses can be fractional (0,05 mol...)
function eqStr(r){ // auto-build balanced equation string with ↑/↓ markers
  const side = (obj, mark) => Object.keys(obj).map(f=>{
    let m = '';
    if(mark){ if(CHEMS[f].s==='k') m='↑'; else if(isPrecip(f)) m='↓'; }
    return (obj[f]>1? obj[f]:'') + sub(f) + m;
  }).join(' + ');
  return side(r.rg) + ' —' + rxOver(r) + '→ ' + side(r.pr, true);
}
// điều kiện ghi trên mũi tên: đốt cũng là t° như SGK viết
const rxOver = r => [(r.heat||r.burn)?'t°':'', r.elec?'đp':'', r.cat?r.cat.map(sub).join(','):''].filter(Boolean).join(', ');
function fxOf(r){ // visual effect summary for a reaction
  const fx = [];
  if(Object.keys(r.pr).some(f=>CHEMS[f].s==='k')) fx.push('sủi bọt khí');
  if(Object.keys(r.pr).some(isPrecip)) fx.push('kết tủa');
  if(r.exo) fx.push('toả nhiệt');
  return fx.join(', ');
}

/* ---- customers: [name, emoji, self-pronoun] ---- */
const CUSTOMERS = [
 ['Bà Tư','lò bánh mì','bà'], ['Chú Ba','nông dân','chú'], ['Bé Na','học sinh lớp 8','em'], ['Anh Minh','thợ xây','anh'],
 ['Cô Lan','y tá trạm xá','cô'], ['Ông Sáu','chủ ao cá','ông'], ['Bạn Tí','học sinh lớp 8','mình'], ['Chị Hoa','tiệm vàng bạc','chị'],
 ['Thầy Nam','giáo viên Hoá','thầy'], ['Cô Mai','quán chè','cô']
];
// mọi lời thoại NPC (khách, giáo sư, DAY_STORY của từng ngày): xem file loi-thoai.js
// điền chỗ trống {x} trong câu thoại bằng vars.x — chỗ nào không có trong vars thì giữ nguyên
const fillLine = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (all, k) => k in vars ? vars[k] : all);
const pickLine = list => list[Math.floor(Math.random()*list.length)];

/* ---- order builder: o(customerIdx, chemFormula, doses, opts) ---- */
function o(who, chem, n, opts){
  return Object.assign({who, chem, n}, opts||{});
}

/* ---- 31 days, 5 chương. Lab day: {story, chems, tools, dur, orders, s1}. Minigame day: {story, mg, ...data} ---- */
/* tên / mô tả từng ngày (day.t) nằm ở js/lich.js — sửa ở đó */
/* tools: spoon, book, quy, gas, heat, filter, elec (sink + đũa thuỷ tinh luôn có sẵn) */
const DAYS = [
 // ================= CHƯƠNG 1: NHẬP MÔN & OXI (1–7) =================
 {
  story:DAY_STORY[1],
  chems:['H2O','NaCl','C12H22O11','MgSO4'], tools:[], dur:500, s1:3,
  orders:[ o(2,'C12H22O11',1,{water:1,pname:'nước đường'}),
           o(0,'NaCl',1,{water:1,pname:'nước muối'}),
           o(4,'MgSO4',1,{water:1,pname:'nước muối tắm Epsom (khuấy cho tan!)'}),
           o(9,'C12H22O11',1,{water:1,pname:'nước đường nấu chè'}),
           o(5,'NaCl',1,{water:1,pname:'nước muối tắm cho cá'}) ]},

 {
  story:DAY_STORY[2],
  chems:['H2O','NaCl','C12H22O11'], tools:['spoon'], dur:450, s1:4,
  orders:[ o(3,'C12H22O11',2,{water:1,pname:'nước đường (0,2 mol đường)'}),
           o(8,'NaCl',3,{water:1,pname:'nước muối (0,3 mol NaCl)',
             line:SPECIAL_LINES.avogadroThay}),
           o(6,'C12H22O11',1,{water:1,pname:'nước đường loãng',
             line:SPECIAL_LINES.avogadroTro}),
           o(9,'C12H22O11',3,{water:1,pname:'nước đường nấu chè (0,3 mol đường)'}),
           o(7,'NaCl',2,{water:1,pname:'nước muối (0,2 mol NaCl)'}),
           o(5,'NaCl',1,{water:1,pname:'nước muối (0,1 mol NaCl)'}) ]},

 {mg:'bins',
  story:DAY_STORY[3],
  bins:['Nguyên tử','Phân tử đơn chất','Phân tử hợp chất'], binNotes:['kim loại'],
  items:[['Fe',0],['Cu',0],['Na',0],['Ag',0],['O2',1],['H2',1],['N2',1],['Cl2',1],['H2O',2],['CO2',2],['NaCl',2],['H2SO4',2]],
  // CHẾ ĐỘ KHÓ: tạo ion (MG.ion trong che-do.js). Mỗi nhóm bốc [số câu, các nguyên tố] rồi xáo chung. Nguyên tố phải là
  // nhóm A có ion bền giống khí hiếm (ptIon) và có bóng trong ATOM_STYLE — khoi-dong.js kiểm tra
  hard:{
   note:'Mỗi câu chỉ có <b>một nguyên tử</b>, vẽ đủ các lớp electron; lớp ngoài cùng xếp theo sơ đồ Lewis. Tự xét nên <b>nhường</b> electron lớp ngoài hay <b>nhận</b> các electron tự do trôi quanh, bao nhiêu cái, để nguyên tử thành ion bền như khí hiếm. 10 câu trong 150 giây.',
   story:DAY_STORY['3-kho'],
   time:150,
   pools:[[5, ['Li','Na','K','Mg','Ca','Al']], [5, ['N','O','F','P','S','Cl','Br']]]}},

 {mg:'valence',
  story:DAY_STORY[4],
  // mỗi lượt bốc theo thứ tự: [số câu, danh sách]. Hai nguyên tố: [A, hoá trị A, B, hoá trị B, tên];
  // axit / bazơ / muối: [kim loại hoặc H, hoá trị, gốc, tên] — câu trước buildFrom có gốc dựng sẵn, từ đó ráp từ nguyên tử
  buildFrom:3,
  pools:[
   [1, [['H',1,'O',2,'nước'], ['Na',1,'O',2,'natri oxit'], ['H',1,'S',2,'hiđro sunfua'], ['Mg',2,'Cl',1,'magie clorua'],
        ['Ca',2,'Cl',1,'canxi clorua'], ['Fe',2,'Cl',1,'sắt(II) clorua'], ['N',3,'H',1,'amoniac'], ['Al',3,'Cl',1,'nhôm clorua'],
        ['Fe',3,'Cl',1,'sắt(III) clorua'], ['C',4,'H',1,'metan'], ['C',4,'O',2,'khí cacbonic'], ['S',4,'O',2,'lưu huỳnh đioxit'],
        ['S',6,'O',2,'lưu huỳnh trioxit'], ['Al',3,'O',2,'nhôm oxit'], ['Fe',3,'O',2,'sắt(III) oxit'],
        ['P',5,'O',2,'điphotpho pentaoxit'], ['N',5,'O',2,'đinitơ pentaoxit'], ['Mg',2,'N',3,'magie nitrua']]],
   [2, [['Na',1,'OH','natri hiđroxit'], ['Ca',2,'OH','canxi hiđroxit'], ['Al',3,'OH','nhôm hiđroxit'], ['Fe',3,'OH','sắt(III) hiđroxit'],
        ['H',1,'SO4','axit sunfuric'], ['Na',1,'SO4','natri sunfat'], ['Cu',2,'SO4','đồng(II) sunfat'], ['H',1,'NO3','axit nitric'],
        ['Ca',2,'NO3','canxi nitrat'], ['Na',1,'CO3','natri cacbonat'], ['Ca',2,'CO3','canxi cacbonat'], ['H',1,'PO4','axit photphoric']]],
   [1, [['H',1,'SO4','axit sunfuric'], ['H',1,'NO3','axit nitric'], ['H',1,'CO3','axit cacbonic'], ['H',1,'PO4','axit photphoric']]],
   [1, [['Na',1,'OH','natri hiđroxit'], ['K',1,'OH','kali hiđroxit'], ['Ba',2,'OH','bari hiđroxit'], ['Cu',2,'OH','đồng(II) hiđroxit'],
        ['Mg',2,'OH','magie hiđroxit']]],
   [3, [['K',1,'SO4','kali sunfat'], ['Ba',2,'SO4','bari sunfat'], ['Zn',2,'SO4','kẽm sunfat'], ['Cu',2,'SO4','đồng(II) sunfat'],
        ['K',1,'NO3','kali nitrat'], ['Ag',1,'NO3','bạc nitrat'], ['Na',1,'NO3','natri nitrat'], ['K',1,'CO3','kali cacbonat'],
        ['Ca',2,'CO3','canxi cacbonat'], ['Mg',2,'CO3','magie cacbonat'], ['Na',1,'PO4','natri photphat']]]],
  // tạo chất tự do (sau khi xong 8 câu) + khám phá: sổ chất = mọi câu trong pools + các chất dưới đây (cả các gốc chỉ dùng ở đây)
  freeExtra:[['Na',1,'Cl',1,'natri clorua'], ['K',1,'Cl',1,'kali clorua'], ['H',1,'Cl',1,'hiđro clorua'], ['Ag',1,'Cl',1,'bạc clorua'],
   ['Zn',2,'Cl',1,'kẽm clorua'], ['Cu',2,'Cl',1,'đồng(II) clorua'], ['Ba',2,'Cl',1,'bari clorua'], ['K',1,'O',2,'kali oxit'],
   ['Mg',2,'O',2,'magie oxit'], ['Ca',2,'O',2,'canxi oxit'], ['Zn',2,'O',2,'kẽm oxit'], ['Cu',2,'O',2,'đồng(II) oxit'],
   ['Cu',1,'O',2,'đồng(I) oxit'], ['Ba',2,'O',2,'bari oxit'], ['Fe',2,'O',2,'sắt(II) oxit'], ['C',2,'O',2,'cacbon oxit'],
   ['N',4,'O',2,'nitơ đioxit'], ['Na',1,'S',2,'natri sunfua'], ['Zn',2,'S',2,'kẽm sunfua'], ['Al',3,'S',2,'nhôm sunfua'],
   ['Ca',2,'SO4','canxi sunfat'], ['Mg',2,'SO4','magie sunfat'], ['Ba',2,'NO3','bari nitrat'], ['Cu',2,'NO3','đồng(II) nitrat'],
   ['Zn',2,'OH','kẽm hiđroxit'], ['Fe',2,'OH','sắt(II) hiđroxit'], ['K',1,'PO4','kali photphat'], ['Ba',2,'CO3','bari cacbonat'],
   ['K',1,'S',2,'kali sunfua'], ['Ca',2,'S',2,'canxi sunfua'], ['Mg',2,'S',2,'magie sunfua'], ['Ba',2,'S',2,'bari sunfua'],
   ['Fe',2,'S',2,'sắt(II) sunfua'], ['Cu',2,'S',2,'đồng(II) sunfua'], ['Ag',1,'S',2,'bạc sunfua'], ['Ag',1,'O',2,'bạc oxit'],
   ['N',2,'O',2,'nitơ oxit'], ['C',4,'S',2,'cacbon đisunfua'], ['C',4,'Cl',1,'cacbon tetraclorua'],
   ['P',3,'Cl',1,'photpho triclorua'], ['P',5,'Cl',1,'photpho pentaclorua'],
   ['Na',1,'SO3','natri sunfit'], ['K',1,'SO3','kali sunfit'], ['H',1,'SO3','axit sunfurơ'], ['Ca',2,'SO3','canxi sunfit'],
   ['Ba',2,'SO3','bari sunfit'], ['Na',1,'S2O7','natri đisunfat'], ['K',1,'S2O7','kali đisunfat'], ['H',1,'S2O7','axit đisunfuric (oleum)'],
   ['Na',1,'NO2','natri nitrit'], ['K',1,'NO2','kali nitrit'], ['H',1,'NO2','axit nitrơ'],
   ['Na',1,'HCO3','natri hiđrocacbonat (thuốc muối)'], ['K',1,'HCO3','kali hiđrocacbonat'], ['Ca',2,'HCO3','canxi hiđrocacbonat'],
   ['Na',1,'HSO4','natri hiđrosunfat'], ['K',1,'HSO4','kali hiđrosunfat'], ['Na',1,'H2PO4','natri đihiđrophotphat'],
   ['Na',1,'HPO4','natri hiđrophotphat'], ['Ca',2,'HPO4','canxi hiđrophotphat'],
   ['K',1,'ClO3','kali clorat'], ['Na',1,'ClO3','natri clorat'], ['H',1,'ClO3','axit cloric'],
   // muối hữu cơ: mỗi gốc tới 2 nguyên tử C (tính từng gốc — (CH₃COO)₂Ca có 4 C vẫn nhận). Chất nào cần quá 16 bóng
   // (MAX ở MG.valence, vd. Al(CH₃COO)₃ = 22) thì không ghép nổi nên không đưa vào
   ['Na',1,'HCOO','natri fomat'], ['K',1,'HCOO','kali fomat'], ['Ag',1,'HCOO','bạc fomat'], ['Mg',2,'HCOO','magie fomat'],
   ['Ca',2,'HCOO','canxi fomat'], ['Ba',2,'HCOO','bari fomat'], ['Zn',2,'HCOO','kẽm fomat'], ['Fe',2,'HCOO','sắt(II) fomat'],
   ['Cu',2,'HCOO','đồng(II) fomat'],
   ['Na',1,'CH3COO','natri axetat'], ['K',1,'CH3COO','kali axetat'], ['Ag',1,'CH3COO','bạc axetat'], ['Mg',2,'CH3COO','magie axetat'],
   ['Ca',2,'CH3COO','canxi axetat'], ['Ba',2,'CH3COO','bari axetat'], ['Zn',2,'CH3COO','kẽm axetat'], ['Fe',2,'CH3COO','sắt(II) axetat'],
   ['Cu',2,'CH3COO','đồng(II) axetat'],
   ['Na',1,'CH3O','natri metylat'], ['K',1,'CH3O','kali metylat'], ['Na',1,'C2H5O','natri etylat'], ['K',1,'C2H5O','kali etylat'],
   ['H',1,'C2O4','axit oxalic'], ['Na',1,'C2O4','natri oxalat'], ['K',1,'C2O4','kali oxalat'], ['Ag',1,'C2O4','bạc oxalat'],
   ['Mg',2,'C2O4','magie oxalat'], ['Ca',2,'C2O4','canxi oxalat'], ['Ba',2,'C2O4','bari oxalat'], ['Zn',2,'C2O4','kẽm oxalat'],
   ['Fe',2,'C2O4','sắt(II) oxalat'], ['Cu',2,'C2O4','đồng(II) oxalat']],
  // CHẾ ĐỘ KHÓ: sơ đồ Lewis (MG.lewis trong che-do.js). Mỗi lượt bốc theo thứ tự: [số câu, danh sách [công thức, tên]].
  // Đề không ghi công thức — mỗi chất phải là cách ghép ÍT nguyên tử nhất mà mọi nguyên tử đủ electron (khoi-dong.js kiểm
  // tra số electron khớp); nguyên tố phải có trong LW_E. Có kim loại thì là liên kết ion, toàn phi kim là cộng hoá trị
  hard:{
   note:'Nguyên tử vẽ theo <b>sơ đồ Lewis</b>, mỗi chấm là một electron lớp ngoài cùng. Hai phi kim: <b>nối hai chấm</b> thành liên kết cộng hoá trị; có kim loại: <b>kéo electron</b> của kim loại sang phi kim thành liên kết ion. 8 câu trong 240 giây.',
   story:DAY_STORY['4-kho'],
   time:240,
   pools:[
    [2, [['HCl','hiđro clorua'], ['H2O','nước'], ['NH3','amoniac'], ['CH4','metan'], ['H2S','hiđro sunfua'], ['CCl4','cacbon tetraclorua'],
         ['PCl3','photpho triclorua']]],
    [2, [['NaCl','natri clorua'], ['KCl','kali clorua'], ['MgO','magie oxit'], ['CaO','canxi oxit'], ['Na2O','natri oxit'],
         ['K2S','kali sunfua'], ['MgCl2','magie clorua'], ['CaCl2','canxi clorua']]],
    [2, [['O2','khí oxi'], ['N2','khí nitơ'], ['CO2','khí cacbonic'], ['CS2','cacbon đisunfua'], ['HCN','axit xianhiđric']]],
    [2, [['Al2O3','nhôm oxit'], ['Mg3N2','magie nitrua'], ['Ca3N2','canxi nitrua'], ['Al2S3','nhôm sunfua']]]]}},

 {mg:'balance',
  story:DAY_STORY[5],
  // mỗi lượt bốc theo thứ tự: [số câu, danh sách]. Viết 'chất + chất = sản phẩm + …', không ghi hệ số — hệ số đúng lấy
  // từ dòng có đúng các chất đó trong REACTIONS (phan-ung.js), khoi-dong.js kiểm tra dòng đó có thật và hệ số ≤ BAL_BIG
  pools:[[2, ['H2 + O2 = H2O', 'Mg + O2 = MgO', 'Cu + O2 = CuO', 'Zn + O2 = ZnO', 'H2 + Cl2 = HCl', 'Na + Cl2 = NaCl']],
         [2, ['Fe + O2 = Fe3O4', 'Na + O2 = Na2O', 'Zn + HCl = ZnCl2 + H2', 'Na + H2O = NaOH + H2', 'H2O = H2 + O2']],
         [2, ['Al + O2 = Al2O3', 'P + O2 = P2O5', 'Fe2O3 + H2 = Fe + H2O', 'Fe + Cl2 = FeCl3', 'N2 + H2 = NH3']]]},

 {
  story:DAY_STORY[6],
  chems:['Mg','Fe','C','S','P','O2'], tools:['spoon','book','heat','gas','burn'], dur:500, s1:4,
  orders:[ o(4,'MgO',2,{pname:'magie oxit'}),
           o(2,'CO2',1,{pname:'khí cacbonic'}),
           o(8,'Fe3O4',1,{pname:'oxit sắt từ'}),
           o(9,'SO2',1,{pname:'khí sunfurơ'}),
           o(6,'CO2',2,{pname:'khí cacbonic (0,2 mol)'}),
           o(5,'P2O5',2,{pname:'điphotpho pentaoxit'}) ]},

 {
  story:DAY_STORY[7],
  chems:['H2O','NaCl','C12H22O11','MgSO4','Mg','Fe','C','S','P','O2'], tools:['spoon','book','heat','gas','burn'], dur:900, s1:6,
  orders:[ o(0,'NaCl',2,{water:1,pname:'nước muối (0,2 mol)'}),
           o(4,'MgO',2,{pname:'magie oxit'}),
           o(6,'C12H22O11',2,{water:1,pname:'nước đường (0,2 mol đường)'}),
           o(2,'CO2',1,{pname:'khí cacbonic'}),
           o(1,'MgSO4',1,{water:1,pname:'muối magie bón cây (khuấy cho tan!)'}),
           o(8,'Fe3O4',1,{pname:'oxit sắt từ'}),
           o(9,'SO2',1,{pname:'khí sunfurơ'}),
           o(5,'P2O5',2,{pname:'điphotpho pentaoxit'}),
           o(3,'CO2',2,{pname:'khí cacbonic (0,2 mol)'}),
           o(7,'NaCl',3,{water:1,pname:'nước muối (0,3 mol)'}) ]},

 // ================= CHƯƠNG 2: HIĐRO – NƯỚC – AXIT BAZƠ (8–14) =================
 {
  story:DAY_STORY[8],
  chems:['H2O','CuO','Fe2O3','H2'], tools:['spoon','book','heat','filter'], dur:530, s1:3,
  orders:[ o(8,'Cu',1,{pname:'đồng kim loại'}),
           o(9,'Fe',2,{pname:'sắt kim loại'}),
           o(7,'Cu',1,{pname:'đồng đỏ (H₂ khử CuO)'}),
           o(4,'Cu',2,{pname:'đồng kim loại (0,2 mol)'}),
           o(3,'Fe',2,{pname:'sắt (H₂ khử Fe₂O₃)'}) ]},

 {
  story:DAY_STORY[9],
  chems:['H2O','HCl','Zn','Fe','Mg','Al'], tools:['spoon','book','quy','gas'], dur:410, s1:4,
  orders:[ o(6,'H2',1,{pname:'khí hiđro'}),
           o(1,'ZnCl2',1,{pname:'kẽm clorua'}),
           o(3,'H2',2,{pname:'khí hiđro (0,2 mol)'}),
           o(7,'FeCl2',1,{pname:'sắt(II) clorua'}),
           o(5,'MgCl2',1,{pname:'magie clorua'}),
           o(0,'AlCl3',1,{pname:'nhôm clorua'}) ]},

 {mg:'redox',
  story:DAY_STORY[10],
  quiz:[
   {q:'CuO + H₂ —t°→ Cu + H₂O', opts:['CuO','H₂'], ans:1, why:'H₂ chiếm oxi của CuO nên H₂ là chất khử'},
   {q:'Fe₂O₃ + 3H₂ —t°→ 2Fe + 3H₂O', opts:['H₂','Fe₂O₃'], ans:0, why:'H₂ chiếm oxi → chất khử'},
   {q:'C + O₂ —t°→ CO₂', opts:['C','O₂'], ans:0, why:'C chiếm oxi của O₂ → C là chất khử'},
   {q:'2Mg + O₂ —t°→ 2MgO', opts:['O₂','Mg'], ans:1, why:'Mg kết hợp với oxi → chất khử'},
   {q:'Zn + CuSO₄ → ZnSO₄ + Cu', opts:['Zn','CuSO₄'], ans:0, why:'Zn nhường electron, đẩy Cu ra → chất khử'},
   {q:'2Cu + O₂ —t°→ 2CuO', opts:['Cu','O₂'], ans:0, why:'Cu kết hợp với oxi → chất khử'}]},

 {
  story:DAY_STORY[11],
  chems:['H2O','Na','CaO'], tools:['spoon','book','quy','gas','filter'], dur:530, s1:3,
  orders:[ o(8,'H2',1,{pname:'khí hiđro (hứng từ Na + nước!)'}),
           o(4,'NaOH',2,{pname:'natri hiđroxit'}),
           o(0,'Ca(OH)2',1,{pname:'nước vôi trong'}),
           o(1,'NaOH',1,{pname:'natri hiđroxit (0,1 mol)'}),
           o(5,'Ca(OH)2',2,{pname:'nước vôi trong (0,2 mol)'}) ]},

 {mg:'identify',
  story:DAY_STORY[12],
  // mỗi lượt bốc ngẫu nhiên MỘT bộ 3 lọ; bộ nào cũng phải phân biệt được bằng quỳ + reagents (khoi-dong.js kiểm tra)
  reagents:['BaCl2','AgNO3','Na2CO3'],
  sets:[['HCl','H2SO4','NaOH'], ['HCl','NaCl','NaOH'], ['H2SO4','Na2SO4','NaCl'],
        ['HCl','NaCl','H2O'], ['NaOH','Ca(OH)2','NaCl'], ['H2SO4','NaOH','Na2SO4']]},

 {
  story:DAY_STORY[13],
  chems:['H2O','CaO','Na2O','P2O5'], tools:['spoon','book','quy','filter'], dur:500, s1:3,
  orders:[ o(0,'Ca(OH)2',1,{pname:'nước vôi trong'}),
           o(4,'NaOH',2,{pname:'natri hiđroxit'}),
           o(9,'H3PO4',2,{pname:'axit photphoric'}),
           o(1,'Ca(OH)2',2,{pname:'nước vôi trong (0,2 mol)'}),
           o(8,'Na3PO4',2,{pname:'natri photphat (P₂O₅ gặp NaOH)'}) ]},

 {
  story:DAY_STORY[14],
  chems:['H2O','HCl','Zn','Na','CuO','Fe2O3','CaO','P2O5','H2'], tools:['spoon','book','quy','gas','heat','filter'], dur:900, s1:6,
  orders:[ o(2,'H2',1,{pname:'khí hiđro (Zn + axit)'}),
           o(8,'Cu',1,{pname:'đồng (H₂ khử CuO)'}),
           o(4,'NaOH',2,{pname:'natri hiđroxit (Na + nước)'}),
           o(0,'Ca(OH)2',1,{pname:'nước vôi trong'}),
           o(9,'Fe',2,{pname:'sắt (H₂ khử Fe₂O₃)'}),
           o(1,'ZnCl2',1,{pname:'kẽm clorua'}),
           o(5,'CuCl2',1,{pname:'đồng(II) clorua (CuO + axit)'}),
           o(3,'H3PO4',2,{pname:'axit photphoric (P₂O₅ + nước)'}),
           o(7,'CaCl2',1,{pname:'canxi clorua (CaO + axit)'}),
           o(6,'H2',2,{pname:'khí hiđro (0,2 mol)'}) ]}
];

DAYS.push(
 // ================= CHƯƠNG 3: AXIT – BAZƠ – MUỐI (15–21) =================
 {
  story:DAY_STORY[15],
  chems:['H2O','HCl','H2SO4','Zn','Fe','CuO'], tools:['spoon','book','quy','gas','filter'], dur:510, s1:4,
  orders:[ o(0,'CuCl2',1,{pname:'đồng(II) clorua (gốc −Cl)'}),
           o(4,'CuSO4',1,{pname:'đồng(II) sunfat (gốc =SO₄)'}),
           o(9,'ZnSO4',1,{pname:'kẽm sunfat'}),
           o(7,'FeSO4',1,{pname:'sắt(II) sunfat'}),
           o(3,'H2',1,{pname:'khí hiđro'}),
           o(1,'FeCl2',1,{pname:'sắt(II) clorua'}) ]},

 {
  story:DAY_STORY[16],
  chems:['H2O','CuSO4','FeCl3','NaOH'], tools:['spoon','book','quy','heat','filter'], dur:510, s1:4,
  orders:[ o(2,'Cu(OH)2',1,{pname:'đồng(II) hiđroxit xanh lam'}),
           o(9,'Fe(OH)3',1,{pname:'sắt(III) hiđroxit nâu đỏ'}),
           o(6,'NaCl',3,{pname:'natri clorua (nước lọc sau Fe(OH)₃)'}),
           o(5,'CuO',1,{pname:'đồng(II) oxit (nung Cu(OH)₂)'}),
           o(3,'Na2SO4',1,{pname:'natri sunfat (nước lọc)'}),
           o(8,'Fe2O3',1,{pname:'sắt(III) oxit (nung Fe(OH)₃)'}) ]},

 {mg:'bins',
  story:DAY_STORY[17],
  bins:['Oxit','Axit','Bazơ','Muối'], binScale:1.3,
  items:[['CO2',0],['CaO',0],['Fe2O3',0],['SO2',0],['HCl',1],['H2SO4',1],['HNO3',1],['NaOH',2],['KOH',2],['Cu(OH)2',2],['NaCl',3],['CuSO4',3],['Na2CO3',3],['NaHCO3',3]]},

 {
  story:DAY_STORY[18],
  chems:['H2O','H2SO4','HNO3','NaOH','KOH','BaCl2'], tools:['spoon','book','quy','filter'], dur:510, s1:4,
  orders:[ o(4,'Na2SO4',1,{pname:'natri sunfat (tỉ lệ 1:2!)'}),
           o(8,'NaNO3',1,{pname:'natri nitrat'}),
           o(5,'KNO3',1,{pname:'kali nitrat bón vườn'}),
           o(9,'K2SO4',1,{pname:'kali sunfat'}),
           o(1,'BaSO4',1,{pname:'bari sunfat trắng (nhận biết gốc =SO₄)'}),
           o(3,'HCl',2,{pname:'axit clohiđric (lọc bỏ BaSO₄)'}) ]},

 {
  story:DAY_STORY[19],
  chems:['H2O','HCl','H2SO4','NaOH','KOH'], tools:['spoon','book','quy'], dur:450, s1:4,
  orders:[ o(0,'NaCl',1,{pname:'muối ăn'}),
           o(8,'KCl',1,{pname:'kali clorua'}),
           o(1,'K2SO4',1,{pname:'kali sunfat bón cây'}),
           o(4,'Na2SO4',1,{pname:'natri sunfat'}),
           o(6,'KCl',2,{pname:'kali clorua (0,2 mol)'}),
           o(5,'NaCl',2,{pname:'muối ăn (0,2 mol)'}) ]},

 {
  story:DAY_STORY[20],
  chems:['H2O','AgNO3','NaCl','BaCl2','Na2SO4'], tools:['spoon','book','filter'], dur:480, s1:3,
  orders:[ o(0,'AgCl',1,{pname:'bạc clorua trắng'}),
           o(4,'BaSO4',1,{pname:'bari sunfat trắng'}),
           o(7,'AgCl',2,{pname:'bạc clorua (0,2 mol)'}),
           o(8,'NaNO3',1,{pname:'natri nitrat (nước lọc sau kết tủa)'}),
           o(2,'BaSO4',2,{pname:'bari sunfat trắng (0,2 mol)'}),
           o(1,'NaCl',2,{pname:'muối ăn (nước lọc sau kết tủa)'}) ]},

 {
  story:DAY_STORY[21],
  chems:['H2O','Zn','Fe','NaCl','HCl','H2SO4','NaOH','CuSO4','AgNO3','BaCl2'], tools:['spoon','book','quy','gas','heat','filter'], dur:680, s1:6,
  orders:[ o(9,'Cu(OH)2',1,{pname:'đồng(II) hiđroxit'}),
           o(3,'H2',2,{pname:'khí hiđro (0,2 mol)'}),
           o(8,'ZnSO4',1,{pname:'kẽm sunfat'}),
           o(0,'AgCl',2,{pname:'bạc clorua'}),
           o(1,'Cu',1,{pname:'đồng (Fe đẩy khỏi CuSO₄)'}),
           o(4,'Na2SO4',1,{pname:'natri sunfat'}),
           o(5,'NaCl',1,{pname:'muối ăn (trung hoà HCl bằng NaOH)'}),
           o(7,'FeSO4',1,{pname:'sắt(II) sunfat'}),
           o(2,'BaSO4',1,{pname:'bari sunfat trắng'}),
           o(6,'ZnCl2',1,{pname:'kẽm clorua'}) ]},

 // ================= CHƯƠNG 4: KIM LOẠI & PHI KIM (22–28) =================
 {
  story:DAY_STORY[22],
  chems:['H2O','HCl','Al','Cl2'], tools:['spoon','book','quy','heat','gas','burn'], dur:570, s1:3,
  orders:[ o(3,'AlCl3',2,{pname:'nhôm clorua (đường axit)'}),
           o(6,'H2',3,{pname:'khí hiđro (0,3 mol — nhôm hào phóng!)'}),
           o(9,'AlCl3',1,{pname:'nhôm clorua (0,1 mol)'}),
           o(1,'AlCl3',2,{pname:'nhôm clorua (đốt trong clo)'}),
           o(4,'H2',3,{pname:'khí hiđro (Al + axit)'}) ]},

 {
  story:DAY_STORY[23],
  chems:['H2O','HCl','Cl2','Fe','O2','CuSO4'], tools:['spoon','book','heat','gas','burn','filter'], dur:540, s1:4,
  orders:[ o(7,'FeCl2',1,{pname:'sắt(II) clorua — Fe + axit'}),
           o(9,'FeCl3',2,{pname:'sắt(III) clorua — Fe + clo'}),
           o(3,'H2',1,{pname:'khí hiđro (Fe + axit)'}),
           o(8,'Fe3O4',1,{pname:'oxit sắt từ'}),
           o(0,'Cu',1,{pname:'đồng (Fe đẩy khỏi muối)'}),
           o(4,'FeSO4',1,{pname:'sắt(II) sunfat (nước lọc sau khi tách Cu)'}) ]},

 // Ngày 24 TẠM THỜI là minigame bảng tuần hoàn. Bản gốc (xếp dãy hoạt động kim loại) cất ở DAY24_SORT cuối danh
 // sách — muốn trả lại thì thay mục này bằng DAY24_SORT và đổi tên ngày 24 trong js/lich.js về 'May áo giáp sắt'.
 {mg:'ptable',
  story:DAY_STORY[24],
  // 12 câu, bốc theo từng nhóm dạng câu: [số câu, các dạng]. Trong một nhóm, dạng nào chưa ra thì được bốc trước.
  // Cách sinh từng dạng câu: PT_Q trong che-do.js
  rounds:[[3, ['mass', 'proton', 'symbol', 'findZ', 'findMass']],     // đọc ô
          [3, ['outer', 'kind', 'same']],                             // nhóm, chu kì, màu ô (số lớp electron: chế độ khó)
          [3, ['bigger']],                                            // so sánh bán kính nguyên tử
          [3, ['mr', 'ratio', 'heavier']]],                           // tính toán với nguyên tử khối
  // đề chỉ hỏi về các nguyên tố quen thuộc này (riêng câu so sánh bán kính dùng bảng PT_RAD)
  pool:['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Mn','Fe','Cu','Zn','Br','Ag','I','Ba'],
  // chất để hỏi phân tử khối — chỉ gồm nguyên tố có trong ATOM
  mr:['H2O','CO2','NaCl','O2','N2','NH3','CH4','HCl','NaOH','MgO','SO2','CaCO3','H2SO4','HNO3','Fe2O3','CuSO4','Al2O3','Ca(OH)2','KCl','P2O5'],
  // CHẾ ĐỘ KHÓ: mỗi ô ghi thêm độ âm điện và cấu hình electron, không có kính lúp (chỉ một ô hướng dẫn có chú thích; màn
  // hình vừa và nhỏ thì bấm ô để xem to ở đó); các mục dưới đây thay cho mục cùng tên ở trên
  hard:{
   note:'Mỗi ô ghi thêm <b>độ âm điện</b> và <b>cấu hình electron</b>; không có kính lúp, tự đọc trên bảng (màn hình nhỏ: bấm ô để xem to). 12 câu khác hẳn: neutron, lớp electron, ion, độ âm điện, loại liên kết.',
   story:DAY_STORY['24-kho'],
   rounds:[[3, ['neutron', 'shells', 'shell', 'config']],            // hạt và lớp electron
           [3, ['ion', 'ionGas']],                                   // ion
           [3, ['en', 'enMax']],                                     // độ âm điện
           [3, ['bond']]],                                           // loại liên kết
   // hỏi số neutron: nguyên tử khối làm tròn trùng số khối của đồng vị chính (bỏ Cl 35,5, Cu, Zn, Br, Ag, Ba)
   neutron:['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Ar','K','Ca','Mn','Fe','I'],
   // hỏi ion: kim loại nhóm IA–IIIA và phi kim nhóm VA–VIIA, ion có lớp electron giống khí hiếm
   ion:['Li','Na','K','Mg','Ca','Al','N','O','F','P','S','Cl','Br'],
   // hỏi loại liên kết — đủ cả ba loại; khoi-dong.js kiểm tra không chất nào có Δχ sát ngưỡng 0,4 / 1,7
   bond:['NaCl','KCl','NaF','LiF','MgO','CaO','Na2O','MgCl2','CaCl2','KBr','HCl','HBr','H2O','NH3','CO2','SO2','PCl3','CCl4','AlCl3',
         'H2','N2','O2','F2','Cl2','Br2','CH4']}},

 {
  story:DAY_STORY[25],
  chems:['H2O','Na','Fe','Cu','H2','Cl2'], tools:['spoon','book','quy','heat','gas','burn'], dur:510, s1:4,
  orders:[ o(0,'NaCl',2,{pname:'muối ăn (từ Na + Cl₂!)'}),
           o(1,'CuCl2',1,{pname:'đồng(II) clorua'}),
           o(9,'FeCl3',2,{pname:'sắt(III) clorua'}),
           o(3,'HCl',4,{pname:'axit clohiđric (0,4 mol) — tẩy gỉ'}),
           o(5,'CuCl2',2,{pname:'đồng(II) clorua (0,2 mol)'}),
           o(8,'HCl',2,{pname:'axit clohiđric (H₂ + Cl₂)'}) ]},

 {
  story:DAY_STORY[26],
  chems:['N2','H2','NH3','HCl'], tools:['spoon','book','quy','gas','heat'], dur:570, s1:3,
  orders:[ o(8,'NH3',2,{pname:'khí amoniac (tổng hợp N₂ + H₂)'}),
           o(4,'NH4Cl',1,{pname:'amoni clorua (khói trắng)'}),
           o(1,'NH4Cl',3,{pname:'amoni clorua — phân đạm (0,3 mol)'}),
           o(2,'NH4Cl',2,{pname:'amoni clorua (0,2 mol)'}),
           o(6,'NH3',2,{pname:'khí amoniac'}) ]},

 {
  story:DAY_STORY[27],
  chems:['H2O','C','O2','CuO','CaCO3','HCl'], tools:['spoon','book','heat','gas','burn','filter'], dur:540, s1:4,
  orders:[ o(2,'CO2',1,{pname:'khí cacbonic (đốt than)'}),
           o(5,'Cu',2,{pname:'đồng đỏ (C khử CuO — lò luyện kim!)'}),
           o(3,'Ca(OH)2',1,{pname:'nước vôi (nung đá vôi rồi tôi vôi)'}),
           o(7,'CaO',1,{pname:'vôi sống (nung đá vôi)'}),
           o(9,'CO2',2,{pname:'khí cacbonic (đá vôi + axit)'}),
           o(0,'CaCl2',1,{pname:'canxi clorua'}) ]},

 {
  story:DAY_STORY[28],
  chems:['H2O','Zn','Fe','Cu','C','O2','CO2','HCl','H2SO4','NaOH','KOH','Ca(OH)2','CuSO4','AgNO3','NaCl','BaCl2','Na2SO4'],
  tools:['spoon','book','quy','gas','heat','filter'], dur:700, s1:6,
  orders:[ o(0,'NaCl',2,{pname:'muối ăn (trung hoà axit–bazơ)'}),
           o(2,'H2',1,{pname:'khí hiđro'}),
           o(7,'Ag',2,{pname:'bạc (Cu đẩy khỏi AgNO₃)'}),
           o(8,'Cu',1,{pname:'đồng đỏ (phản ứng thế)'}),
           o(3,'CaCO3',1,{pname:'canxi cacbonat (CO₂ làm đục nước vôi)'}),
           o(4,'AgCl',1,{pname:'bạc clorua trắng'}),
           o(1,'K2SO4',1,{pname:'kali sunfat bón cây'}),
           o(9,'Na2CO3',1,{pname:'natri cacbonat (CO₂ + 2NaOH)'}),
           o(6,'Cu(OH)2',1,{pname:'đồng(II) hiđroxit xanh lam'}),
           o(5,'BaSO4',1,{pname:'bari sunfat trắng'}) ]},

 // ================= CHƯƠNG 5: PHÒNG THÍ NGHIỆM NÂNG CAO (29–31) =================
 {
  story:DAY_STORY[29],
  chems:['H2O','CuCl2'], tools:['spoon','book','gas','filter','elec'], dur:600, s1:3,
  orders:[ o(8,'H2',2,{pname:'khí hiđro (điện phân nước)'}),
           o(3,'Cu',1,{pname:'đồng (điện phân CuCl₂)'}),
           o(9,'Cl2',1,{pname:'khí clo (hứng ở cực dương)'}),
           o(7,'Cu',2,{pname:'đồng tinh khiết (0,2 mol)'}),
           o(5,'Cl2',1,{pname:'khí clo khử trùng nước'}) ]},

 {
  story:DAY_STORY[30],
  chems:['H2O','KMnO4','Cu'], tools:['spoon','book','heat','gas','burn','filter'], dur:630, s1:3,
  orders:[ o(4,'O2',1,{pname:'khí oxi (nhiệt phân thuốc tím)'}),
           o(0,'KMnO4',1,{water:1,pname:'dung dịch thuốc tím (khuấy cho tan!)'}),
           o(6,'MnO2',1,{pname:'mangan đioxit (bã rắn — lọc lấy)'}),
           o(5,'O2',2,{pname:'khí oxi sục ao cá (0,2 mol)'}),
           o(1,'CuO',2,{pname:'đồng oxit (đốt Cu bằng O₂ tự chế!)'}) ]},

 {mg:'chain',
  story:DAY_STORY[31],
  // Mỗi chuỗi: chất đầu → … → chất đích. ans = chất thêm vào ở từng mũi tên, more = bình gây nhiễu trong khay.
  // Chất ở giữa không ghi ở đây — MG.chain tự dò theo REACTIONS (khoi-dong.js kiểm tra ans đi tới được đích).
  chains:[
   {start:'Cu',  target:'Cu(OH)2',   ans:['O2','H2SO4','NaOH'],  more:['H2O','NaCl','Fe','CO2','Cl2']},
   {start:'CaO', target:'CaCl2',     ans:['H2O','CO2','HCl'],    more:['NaOH','NaCl','O2','H2SO4','H2']},
   {start:'Fe',  target:'Fe2(SO4)3', ans:['Cl2','NaOH','H2SO4'], more:['HCl','O2','CuSO4','H2O','NaCl']},
   {start:'CuO', target:'AgCl',      ans:['H2','Cl2','AgNO3'],   more:['HCl','O2','H2O','NaCl','H2SO4']}
  ]}
);
// bản gốc của ngày 24 (đang tạm thay bằng minigame bảng tuần hoàn) — xem ghi chú ở mục ngày 24 trong DAYS
const DAY24_SORT = {mg:'sort',
  story:DAY_STORY['24-cu'],
  metals:['K','Na','Mg','Al','Zn','Fe','Cu','Ag']};

/* ---- achievements ---- */
const ACH = {
 rxall:   {n:'Nhà hoá học',       d:'Ghi đủ mọi phản ứng vào sổ tay'},
 d1:      {n:'Ngày đầu tiên',      d:'Hoàn thành ngày làm việc đầu tiên'},
 gas1:    {n:'Bắt khí đầu tiên',   d:'Thu được khí vào bình thu khí'},
 filter1: {n:'Thợ lọc tập sự',     d:'Lọc kết tủa đầu tiên'},
 quy1:    {n:'Thám tử quỳ tím',    d:'Dùng giấy quỳ lần đầu'},
 star3:   {n:'Ngôi sao sáng',      d:'Đạt 3 sao một ngày bất kỳ'},
 week1:   {n:'Tuần hoàn hảo I',    d:'3 sao cả tuần 1'},
 week2:   {n:'Tuần hoàn hảo II',   d:'3 sao cả tuần 2'},
 week3:   {n:'Tuần hoàn hảo III',  d:'3 sao cả tuần 3'},
 week4:   {n:'Tuần hoàn hảo IV',   d:'3 sao cả tuần 4'},
 all28:   {n:'Tốt nghiệp',         d:'Hoàn thành cả 28 ngày'},
 serve10: {n:'Người bán chăm chỉ', d:'Phục vụ 10 đơn hàng'},
 serve50: {n:'Trợ lý vàng',        d:'Phục vụ 50 đơn hàng'},
 oops:    {n:'Ối, nhầm rồi!',      d:'Giao nhầm hàng lần đầu (ai chẳng có lúc sai)'},
 clean:   {n:'Bàn tay sạch',       d:'Xong một ngày trọn vẹn không giao sai'},
 master:  {n:'Nhà hoá học nhí',    d:'Đạt 3 sao ngày Lễ hội hoá học'},
 burn1:   {n:'Lửa trong lọ',       d:'Đốt cháy một chất trong lọ khí bằng muôi đốt'},
 hard1:   {n:'Cân đo chuẩn xác',   d:'Đạt ít nhất 1 sao một ngày ở chế độ khó'},
 hard3:   {n:'Phù thuỷ định lượng',d:'Đạt 3 sao chế độ khó ở 5 ngày khác nhau'},
 egg:     {n:'Phân tử bí mật',     d:'Ghép ra một chất "ngoài đề" ở trò lập công thức (ngày 4)'}
};

// days where a perfect no-dump run is possible → star 3 also requires "no waste"
[0,1,5,7,8,10,11,12,13,14,15,21,24].forEach(i => DAYS[i].clean = 1);

const TOOLNAMES = {spoon:'Khuấy', book:'Sổ tay', quy:'Giấy quỳ', gas:'Bình thu khí', heat:'Đèn cồn', filter:'Phễu lọc', elec:'Nguồn điện phân', burn:'Muôi đốt'};
const TOOLSYM   = {spoon:'sym-stirrod', book:'sym-notebook', quy:'sym-litmusbox', gas:'sym-gasbottle', heat:'sym-lamp', filter:'sym-funnel', elec:'sym-electro', burn:'sym-burnspoon'};

/* ---- chemical facts (hover 5s); generated content, see scratchpad/chem-facts.js ---- */
const CHEM_FACTS = {
 'H2O': "Nước là chất duy nhất tồn tại tự nhiên ở cả ba thể rắn, lỏng, khí trên Trái Đất.",
 'NaCl': "Muối ăn chính là hợp chất natri clorua, giúp cơ thể duy trì cân bằng nước và dẫn truyền thần kinh.",
 'C12H22O11': "Đường ăn (saccarozo) khi đun nóng sẽ chuyển thành caramen có màu nâu và mùi thơm đặc trưng.",
 'HCl': "Dạ dày con người tiết ra axit clohidric để tiêu hóa thức ăn và tiêu diệt vi khuẩn.",
 'H2SO4': "Axit sunfuric đậm đặc háo nước mạnh đến mức có thể làm cháy đen đường và giấy ngay lập tức.",
 'HNO3': "Axit nitric có thể hòa tan hầu hết kim loại và dùng để sản xuất phân đạm, thuốc nổ.",
 'H3PO4': "Axit photphoric là chất tạo vị chua nhẹ trong nhiều loại nước ngọt có gas.",
 'NaOH': "Xút ăn da dùng để làm xà phòng và thông cống vì khả năng phân hủy chất béo mạnh.",
 'KOH': "Kali hidroxit cũng dùng làm xà phòng, thường tạo ra loại xà phòng mềm hơn so với NaOH.",
 'Ca(OH)2': "Nước vôi trong dùng để nhận biết khí CO2 vì tạo kết tủa trắng đục khi sục khí vào.",
 'Na': "Kim loại natri mềm đến mức cắt được bằng dao và phản ứng rất mạnh khi gặp nước.",
 'K': "Kali là kim loại phản ứng với nước mạnh hơn natri, thậm chí có thể bốc cháy ngay lập tức.",
 'Mg': "Kim loại magie cháy sáng chói lóa, được dùng trong pháo hoa và đèn flash ngày xưa.",
 'Al': "Nhôm nhẹ nhưng bền, có lớp oxit mỏng bảo vệ nên không bị gỉ như sắt.",
 'Zn': "Kẽm thường dùng để mạ lên sắt thép, tạo lớp tôn mạ kẽm chống gỉ.",
 'Fe': "Sắt là kim loại được con người sử dụng nhiều nhất và cũng có trong máu dưới dạng hemoglobin.",
 'Cu': "Đồng dẫn điện rất tốt nên được dùng làm dây điện trong hầu hết các thiết bị điện.",
 'Ag': "Bạc là kim loại dẫn điện tốt nhất trong tất cả kim loại, hơn cả đồng và vàng.",
 'S': "Lưu huỳnh có màu vàng đặc trưng và khi cháy tạo ra khí SO2 có mùi hắc khó chịu.",
 'P': "Photpho đỏ an toàn hơn photpho trắng, được phủ lên vỏ bao diêm để quẹt diêm.",
 'C': "Kim cương và than chì đều là cacbon nguyên chất, chỉ khác cách sắp xếp nguyên tử.",
 'O2': "Khí oxi chiếm khoảng 21% không khí và cần thiết cho sự hô hấp cũng như sự cháy.",
 'H2': "Khí hidro nhẹ nhất trong mọi chất khí và cháy được, tạo ra nước khi kết hợp với oxi.",
 'CO2': "Khí cacbonic được cây xanh hấp thụ để quang hợp và cũng là chất tạo ga cho nước ngọt.",
 'SO2': "Khí lưu huỳnh đioxit gây mưa axit và là một trong những nguyên nhân ô nhiễm không khí.",
 'KCl': "Kali clorua là thành phần chính trong nhiều loại phân bón kali cho cây trồng.",
 'CaCl2': "Canxi clorua hút ẩm rất mạnh nên thường dùng để làm khô không khí hoặc rã băng đường vào mùa đông.",
 'MgCl2': "Magie clorua tách ra từ nước biển và dùng làm chất làm đông trong sản xuất đậu phụ.",
 'AlCl3': "Nhôm clorua được dùng làm chất xúc tác trong nhiều phản ứng hóa học hữu cơ.",
 'ZnCl2': "Kẽm clorua có tính hút ẩm mạnh, thường dùng trong hàn kim loại để làm sạch bề mặt.",
 'FeCl2': "Sắt (II) clorua có màu lục nhạt và dễ bị oxi hóa thành sắt (III) khi để ngoài không khí.",
 'FeCl3': "Sắt (III) clorua có màu vàng nâu và được dùng để xử lý, làm sạch nước thải.",
 'CuCl2': "Đồng (II) clorua có màu xanh lam đặc trưng, thường dùng để tạo màu xanh lục trong pháo hoa.",
 'BaCl2': "Bari clorua độc với người nhưng lại dùng trong phòng thí nghiệm để nhận biết ion sunfat.",
 'Na2SO4': "Natri sunfat được dùng trong sản xuất bột giặt và thủy tinh.",
 'K2SO4': "Kali sunfat là loại phân bón kali không chứa clo, phù hợp với cây trồng nhạy cảm với clo.",
 'MgSO4': "Muối Epsom chính là magie sunfat, được hòa vào nước tắm để giúp thư giãn cơ bắp.",
 'ZnSO4': "Kẽm sunfat được dùng làm phân vi lượng bổ sung kẽm cho cây trồng thiếu chất.",
 'FeSO4': "Sắt (II) sunfat dùng làm thuốc bổ sung sắt cho người bị thiếu máu.",
 'CuSO4': "Dung dịch đồng sunfat có màu xanh lam đặc trưng, dùng để pha thuốc trừ nấm cho cây trồng.",
 'BaSO4': "Bari sunfat không tan trong axit dạ dày nên an toàn khi dùng để chụp X-quang đường tiêu hóa.",
 'NaNO3': "Natri nitrat còn gọi là diêm tiêu Chile, dùng làm phân đạm và chất bảo quản thịt.",
 'AgNO3': "Bạc nitrat dùng trong kỹ thuật tráng gương vì bạc kim loại bám rất đều lên bề mặt kính.",
 'Cu(NO3)2': "Đồng (II) nitrat có màu xanh lam và khi nhiệt phân sẽ giải phóng khí NO2 màu nâu đỏ.",
 'AgCl': "Bạc clorua là kết tủa trắng không tan trong nước, chuyển sang màu xám đen khi để ngoài ánh sáng.",
 'Na2CO3': "Sô-đa dùng để làm mềm nước cứng và là nguyên liệu quan trọng để sản xuất thủy tinh.",
 'NaHCO3': "Thuốc muối (bột nở) sinh ra khí CO2 khi gặp nhiệt hoặc axit, giúp bánh nở xốp.",
 'CaCO3': "Đá vôi, vỏ trứng và vỏ ốc đều chứa canxi cacbonat, thành phần chính tạo nên thạch nhũ trong hang động.",
 'BaCO3': "Bari cacbonat được dùng làm bả diệt chuột vì độc với động vật gặm nhấm.",
 'MgO': "Magie oxit chịu nhiệt cực tốt nên được dùng làm vật liệu chịu lửa trong lò nung.",
 'CuO': "Đồng (II) oxit có màu đen, khi cho khí hidro đi qua sẽ bị khử thành đồng kim loại màu đỏ.",
 'ZnO': "Kẽm oxit có màu trắng, thường có trong kem chống nắng và thuốc trị hăm cho trẻ em.",
 'Fe2O3': "Sắt (III) oxit chính là thành phần chính tạo nên màu đỏ của gỉ sắt.",
 'Fe3O4': "Oxit sắt từ có tính nhiễm từ, từng được dùng làm la bàn tự nhiên thời cổ đại.",
 'CaO': "Vôi sống phản ứng mạnh với nước, tỏa nhiệt lớn để tạo thành vôi tôi (nước vôi trong).",
 'Na2O': "Natri oxit phản ứng ngay với nước tạo thành dung dịch bazơ mạnh natri hidroxit.",
 'P2O5': "Điphotpho pentaoxit hút ẩm cực mạnh, thường dùng làm chất làm khô trong phòng thí nghiệm.",
 'Cu(OH)2': "Đồng (II) hidroxit là kết tủa màu xanh lam, khi đun nóng sẽ chuyển thành đồng oxit màu đen.",
 'Fe(OH)3': "Sắt (III) hidroxit là kết tủa màu nâu đỏ, thường gặp khi nước bị nhiễm sắt để lâu ngoài không khí.",
 'Fe(OH)2': "Sắt (II) hidroxit là kết tủa trắng xanh, để ngoài không khí sẽ dần hóa nâu đỏ thành sắt (III) hidroxit.",
 'Cl2': "Khí clo có màu vàng lục, mùi hắc độc hại nhưng lại dùng để khử trùng nước máy sinh hoạt.",
 'N2': "Khí nitơ chiếm khoảng 78% không khí và khá trơ nên được bơm vào túi snack để chống oxi hóa.",
 'NH3': "Khí amoniac có mùi khai đặc trưng, tan rất nhiều trong nước và là nguyên liệu sản xuất phân đạm ure.",
 'NH4Cl': "Amoni clorua (còn gọi là sal amoniac) được dùng làm chất trợ dung khi hàn thiếc.",
 'KMnO4': "Thuốc tím có màu tím đặc trưng, dùng để sát khuẩn vết thương và khử trùng nước.",
 'K2MnO4': "Kali manganat màu lục sẫm, sinh ra khi nhiệt phân thuốc tím và là bước trung gian điều chế khí oxi.",
 'MnO2': "Mangan đioxit đóng vai trò chất xúc tác giúp phản ứng phân hủy H2O2 tạo khí oxi diễn ra nhanh hơn.",
};
